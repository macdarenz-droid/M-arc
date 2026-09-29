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

/** QA12-1: OnboardingSheet now opens only once the O1 launch overlay (#launch) has left, so any
 * block that goes on to check for or dismiss its "Later" button must wait for #launch to be gone
 * first, or the sheet hasn't opened yet (an isVisible() check reads false) or opens moments later
 * and steals the next click (its native <dialog> paints above any z-index). A no-op wherever
 * #launch is already gone (every reduced-motion context, almost immediately). */
async function launchGone(page) {
  await page.waitForFunction(() => !document.getElementById('launch'), null, { timeout: 5000 }).catch(() => {});
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

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

// A6: disable Chromium's own swipe-to-navigate gesture, which a horizontal CDP touch drag can
// otherwise trigger (it consumes the touch as browser navigation before any page JS sees it,
// navigating to about:blank since these fresh contexts have no earlier history entry).
const browser = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {}), args: ['--no-sandbox', '--disable-features=OverscrollHistoryNavigation,TouchpadOverscrollHistoryNavigation'] });
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
  // O1: every context here runs under reducedMotion:'reduce', so the launch overlay's own
  // wait is 0ms and it should be gone (or gone within one fade) very shortly after .nav shows.
  // (No launchGone() here on purpose — this measures the raw gap it would otherwise pre-wait out.)
  const launchGoneMs = await page.evaluate(() => new Promise(resolve => {
    const t = performance.now();
    const check = () => {
      if (!document.getElementById('launch')) { resolve(performance.now() - t); return; }
      if (performance.now() - t > 1000) { resolve(Infinity); return; }
      setTimeout(check, 10);
    };
    check();
  }));
  if (launchGoneMs > 300) errors.push(`${theme}: #launch overlay took ${Math.round(launchGoneMs)}ms to leave after .nav appeared (want <=300ms)`);
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

// I14: WCAG contrast (>=4.5:1 against the nearest opaque ancestor background) for small/secondary
// text — .hint, .eyebrow, .set-kind, the in-session autoregulation line (--accent-text) — plus the
// composer's "About:" context chip (.chip-accent) and the Escobar Past-conversations Back link
// (.esc-link), in all five themes.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `I14 contrast ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => {
    localStorage.setItem('marc.dev', '1');
    localStorage.setItem('marc.theme', t);
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
  }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }

  // Colour vs the nearest ancestor with a fully opaque background, same maths as the F9/F13
  // pr-badge/toast probes above.
  const checkContrast = async (sel, label) => {
    const c = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      // This Chromium build serializes a color-mix() result (--accent-text) via the CSS Color 4
      // `color(srgb r g b)` function (0-1 range) rather than legacy rgb()/rgba() (0-255 range) —
      // the F9/F13 probes above never hit this because their color-mix()es are backgrounds, not
      // text color, and happened not to exercise a build/property combination that serializes
      // this way.
      const parseRgba = str => {
        let m = str.match(/rgba?\(([^)]+)\)/);
        if (m) { const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
        m = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
        if (m) return { r: Number(m[1]) * 255, g: Number(m[2]) * 255, b: Number(m[3]) * 255, a: m[4] !== undefined ? Number(m[4]) : 1 };
        return null;
      };
      const fg = parseRgba(getComputedStyle(el).color);
      if (!fg) return null;
      let node = el, under = { r: 255, g: 255, b: 255 };
      while (node) { const bg = parseRgba(getComputedStyle(node).backgroundColor); if (bg && bg.a >= 0.999) { under = bg; break; } node = node.parentElement; }
      const lin = c2 => { const s2 = c2 / 255; return s2 <= 0.03928 ? s2 / 12.92 : Math.pow((s2 + 0.055) / 1.055, 2.4); };
      const rl = ({ r, g, b: bb }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
      const l1 = rl(fg) + 0.05, l2 = rl(under) + 0.05;
      return l1 > l2 ? l1 / l2 : l2 / l1;
    }, sel);
    if (c == null) { errors.push(`${tag}: could not measure contrast for ${label} (selector ${sel})`); return; }
    if (c < 4.5) errors.push(`${tag}: ${label} contrast ${c.toFixed(2)} < 4.5`);
  };

  // .eyebrow and .hint are both on Today without any interaction.
  await checkContrast('.eyebrow', '.eyebrow');
  await checkContrast('.hint', '.hint');

  // .set-kind (uncommitted) and the autoreg line: log set 1 easy, at/above its placeholder target.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  const inputs = page.locator('.set-grid input');
  const targetKg = parseFloat(await inputs.nth(0).getAttribute('placeholder')) || 50;
  const targetReps = parseInt(await inputs.nth(1).getAttribute('placeholder'), 10) || 8;
  await inputs.nth(0).fill(String(targetKg)); await inputs.nth(1).fill(String(targetReps + 2)); await inputs.nth(1).blur();
  await page.locator('.effort button.easy').first().click();
  await page.waitForTimeout(300);
  if (!(await visible(page.getByText('for the next set')))) errors.push(`${tag}: expected the autoregulation line after an easy first set`);
  await checkContrast('.hint[style*="accent-text"]', 'autoreg line');
  await checkContrast('.set-grid:not(.committed) .set-kind', '.set-kind');

  // .chip-accent: "Ask Escobar about" opens the composer straight to an "About:" chip, no send needed.
  // Escobar must be turned on first (the Explainer has no composer).
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(250);
  await page.locator('.esc-hall-input').click();
  await page.waitForSelector('dialog.esc-sheet[open]'); await page.waitForTimeout(250);
  await page.locator('dialog.esc-sheet').getByRole('button', { name: 'Turn on Escobar', exact: true }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(250);
  await page.locator('[aria-label^="Ask Escobar about"]').first().click(); await page.waitForTimeout(300);
  if (!(await visible(page.locator('.chip-accent')))) errors.push(`${tag}: expected an "About:" chip after "Ask Escobar about"`);
  await checkContrast('.chip-accent', '.chip-accent');
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);

  // .esc-link: the Back button in Escobar's Past-conversations list needs no actual conversation.
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(250);
  await page.locator('.esc-hall-input').click();
  await page.waitForSelector('dialog.esc-sheet[open]'); await page.waitForTimeout(250);
  await page.locator('button[aria-label="Escobar menu"]').click(); await page.waitForTimeout(150);
  await page.getByRole('menuitem', { name: 'Past conversations' }).click(); await page.waitForTimeout(150);
  if (!(await visible(page.locator('.esc-link')))) errors.push(`${tag}: expected the Past-conversations Back link`);
  await checkContrast('.esc-link', '.esc-link (Back)');

  await ctx.close();
}

// I18: every icon renders at the same 1.5px optical stroke weight regardless of its rendered
// size — icons.tsx `base()` scales `stroke-width` by size instead of a fixed 1.8 literal.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'I18 icon stroke';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  const measure = sel => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const sw = parseFloat(el.getAttribute('stroke-width') || '0');
    const size = el.getBoundingClientRect().width;
    return size ? (sw * size) / 24 : null;
  }, sel);
  const navStroke = await measure('.nav button svg');
  const gearStroke = await measure('[aria-label="Settings"] svg');
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  const trophyStroke = await measure('section[data-palace="history.records"] svg');
  for (const [label, v] of [['nav icon', navStroke], ['Settings gear', gearStroke], ['History trophy chip', trophyStroke]]) {
    if (v == null) errors.push(`${tag}: could not measure ${label}`);
    else if (Math.abs(v - 1.5) > 0.05) errors.push(`${tag}: ${label} rendered stroke ${v.toFixed(3)}, expected 1.5±0.05`);
  }
  await ctx.close();
}

// I15: colour means one thing — the selected effort chip is a soft tint (background alpha < .3),
// not a solid fill, and its letter still clears 4.5:1 against the composited result, in all 5 themes.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `I15 effort ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);

  const measureEffort = sel => page.evaluate((s) => {
    // Same colour parser as the I14 contrast probe above (color-mix() results serialize via the
    // CSS Color 4 `color(srgb r g b)` function in this Chromium build, not legacy rgb()/rgba()).
    const parseColor = str => {
      let m = str.match(/rgba?\(([^)]+)\)/);
      if (m) { const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
      m = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
      if (m) return { r: Number(m[1]) * 255, g: Number(m[2]) * 255, b: Number(m[3]) * 255, a: m[4] !== undefined ? Number(m[4]) : 1 };
      return null;
    };
    const el = document.querySelector(s);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color);
    const own = parseColor(cs.backgroundColor);
    if (!fg || !own) return null;
    let node = el.parentElement, under = { r: 255, g: 255, b: 255 };
    while (node) { const bg = parseColor(getComputedStyle(node).backgroundColor); if (bg && bg.a >= 0.999) { under = bg; break; } node = node.parentElement; }
    const mixc = (f, b, a) => f * a + b * (1 - a);
    const bg = { r: mixc(own.r, under.r, own.a), g: mixc(own.g, under.g, own.a), b: mixc(own.b, under.b, own.a) };
    const lin = c => { const s2 = c / 255; return s2 <= 0.03928 ? s2 / 12.92 : Math.pow((s2 + 0.055) / 1.055, 2.4); };
    const rl = ({ r, g, b: bb }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
    const l1 = rl(fg) + 0.05, l2 = rl(bg) + 0.05;
    return { contrast: l1 > l2 ? l1 / l2 : l2 / l1, alpha: own.a };
  }, sel);

  // Set 0 easy, set 1 ideal, set 2 max — the same nth() pattern the legacy live-flow walk above uses.
  await page.locator('.effort button.easy').nth(0).click(); await page.waitForTimeout(200);
  await page.locator('.effort button.ideal').nth(1).click(); await page.waitForTimeout(200);
  await page.locator('.effort button.max').nth(2).click(); await page.waitForTimeout(300);
  for (const kind of ['easy', 'ideal', 'max']) {
    const r = await measureEffort(`.effort button[aria-pressed="true"].${kind}`);
    if (!r) { errors.push(`${tag}: could not measure .effort .${kind}`); continue; }
    if (r.contrast < 4.5) errors.push(`${tag}: .effort .${kind} letter contrast ${r.contrast.toFixed(2)} < 4.5`);
    if (r.alpha >= 0.3) errors.push(`${tag}: .effort .${kind} background alpha ${r.alpha.toFixed(2)} >= .3`);
  }
  await ctx.close();
}

// I16: elevation — tracks (.bar/.seg/an off .toggle) sit on a neutral overlay distinct from their
// parent's background, and floating/sheet layers step up from a plain .card, in all 5 themes.
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `I16 elevation ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }

  // Walks to the nearest ancestor with a fully opaque background — the actual visual "layer" the
  // element sits on — rather than el.parentElement, which is usually unstyled/transparent and
  // would trivially "differ" from any real colour regardless of whether the track blends into its
  // surrounding surface.
  const bgDiffersFromParent = sel => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const own = getComputedStyle(el).backgroundColor;
    let node = el.parentElement, under = null;
    while (node) { const bg = getComputedStyle(node).backgroundColor; if (bg && bg !== 'rgba(0, 0, 0, 0)' && !/^color\(srgb [\d.]+ [\d.]+ [\d.]+ \/ 0\)$/.test(bg)) { under = bg; break; } node = node.parentElement; }
    if (under == null) return null;
    return own !== under;
  }, sel);
  const bgDiffers = (selA, selB) => page.evaluate(([a, b]) => {
    const elA = document.querySelector(a), elB = document.querySelector(b);
    if (!elA || !elB) return null;
    return getComputedStyle(elA).backgroundColor !== getComputedStyle(elB).backgroundColor;
  }, [selA, selB]);

  // .seg: History's Log/Stats segmented control, visible with no interaction.
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  const segOk = await bgDiffersFromParent('.seg');
  if (segOk == null) errors.push(`${tag}: could not find .seg`);
  else if (!segOk) errors.push(`${tag}: .seg background matches its parent`);

  // An off .toggle, and a plain .card nested inside the Settings sheet (.sheet-panel).
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Settings', exact: true }).click(); await page.waitForTimeout(300);
  const toggleOk = await bgDiffersFromParent('.toggle:not([aria-checked="true"])');
  if (toggleOk == null) errors.push(`${tag}: could not find an off .toggle`);
  else if (!toggleOk) errors.push(`${tag}: an off .toggle's background matches its parent`);
  const panelCardOk = await bgDiffers('.sheet-panel', '.sheet-panel .card');
  if (panelCardOk == null) errors.push(`${tag}: could not find .sheet-panel .card`);
  else if (!panelCardOk) errors.push(`${tag}: a .card inside .sheet-panel matches the panel's own background`);
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);

  // .bar (the rest banner's progress track) and .rest vs a plain .card: log a set to start rest.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  const inputs = page.locator('.set-grid input');
  await inputs.nth(0).fill('50'); await inputs.nth(1).fill('8'); await inputs.nth(1).blur();
  await page.locator('.effort button.easy').first().click();
  await page.waitForTimeout(300);
  if (!(await visible(page.locator('.rest')))) errors.push(`${tag}: expected the rest banner after a logged set`);
  const barOk = await bgDiffersFromParent('.rest .bar');
  if (barOk == null) errors.push(`${tag}: could not find .bar`);
  else if (!barOk) errors.push(`${tag}: .bar background matches its parent`);
  const restCardOk = await bgDiffers('.rest', '.card');
  if (restCardOk == null) errors.push(`${tag}: could not find both .rest and .card`);
  else if (!restCardOk) errors.push(`${tag}: .rest matches a plain .card's background`);
  await ctx.close();
}

// I17: on one grid — Emerald's computed .set-kind and .esc-bubble radii equal its own theme
// tokens (radius.sm 6px, radius.lg 12px, the global --radius-xs 4px — src/theme/themes.ts).
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'I17 radius emerald';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { localStorage.setItem('marc.dev', '1'); localStorage.setItem('marc.theme', 'emerald'); if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }

  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  const setKindRadius = await page.evaluate(() => { const el = document.querySelector('.set-kind'); return el ? getComputedStyle(el).borderRadius : null; });
  if (setKindRadius !== '6px') errors.push(`${tag}: .set-kind radius ${setKindRadius}, expected 6px`);

  await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(250);
  await page.locator('.esc-hall-input').click();
  await page.waitForSelector('dialog.esc-sheet[open]'); await page.waitForTimeout(250);
  await page.locator('dialog.esc-sheet').getByRole('button', { name: 'Turn on Escobar', exact: true }).click();
  await page.waitForTimeout(200);
  await page.locator('.esc-textarea').fill('radius check');
  await page.locator('.esc-send').click();
  await page.waitForTimeout(200);
  const bubbleRadii = await page.evaluate(() => {
    const el = document.querySelector('.esc-bubble');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
  });
  const expectedBubble = ['12px', '12px', '4px', '12px'];
  if (!bubbleRadii) errors.push(`${tag}: could not find .esc-bubble`);
  else if (bubbleRadii.join(',') !== expectedBubble.join(',')) errors.push(`${tag}: .esc-bubble radii ${bubbleRadii.join(',')}, expected ${expectedBubble.join(',')}`);
  await ctx.close();
}

// I17: no theme computes a negative border-radius anywhere (a calc()/max() expression gone wrong).
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `I17 radius negative ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  const negatives = await page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      for (const prop of ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius']) {
        const v = parseFloat(cs[prop]);
        if (v < 0) bad.push(`${el.className || el.tagName}.${prop}=${cs[prop]}`);
      }
    }
    return bad;
  });
  if (negatives.length) errors.push(`${tag}: negative radius on ${negatives.slice(0, 5).join(', ')}`);
  await ctx.close();
}

// BUG-12: on Stats > Weekly volume, the "avg" label (on the dashed average line) and the
// current-week value label (above the right-most bar) used to overlap when this week sat near the
// average. Seed 11 earlier weeks at 10k kg and this week at 0.8x, 1.0x and 1.2x of the 12-week
// average, and check the two label boxes never intersect (A1); at 1.0x, in all 5 themes at 390 px,
// the avg label overlaps no bar value label (A2).
// A4 (every chart with value labels, audited in the PR): the dashed avg line must sit where an
// average-height bar ends and never run through the value label; and on Exercise progress (the same
// bench sessions, so the latest point is the min at 0.8x, flat at 1.0x, the max at 1.2x) the opaque
// min/max labels must never cover the latest point's end dot.
{
  const tag = 'BUG-12 volume labels';
  const intersects = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const runs = [...[0.8, 1, 1.2].map(r => ({ r, theme: 'silent-black' })), ...themes.filter(t => t !== 'silent-black').map(theme => ({ r: 1, theme }))];
  for (const { r, theme } of runs) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const where = `${tag} (${theme}, ${r}x avg)`;
    page.on('pageerror', e => errors.push(`${where}: ${e.message}`));
    // avg = (11 * 10000 + x) / 12 and x = r * avg, so x = 11 * r * 10000 / (12 - r).
    const thisWeekKg = (11 * r * 10000) / (12 - r) / 100;
    await page.addInitScript(([thisKg, theme]) => {
      const now = new Date().toISOString();
      const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
      const sess = (offset, kg) => ({ id: `bug12-${offset}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T12:00:00.000Z`, endedAt: `${day(offset)}T13:00:00.000Z`, durationSec: 3600, gymId: 'gym_default',
        exercises: [{ exerciseId: 'lib_bench_press', name: 'Bench Press', sets: Array.from({ length: 10 }, () => ({ kg, reps: 10, effort: 'ideal' })) }],
        logging: { mode: 'live', trainedAt: `${day(offset)}T12:00:00.000Z`, trainedEndAt: `${day(offset)}T13:00:00.000Z`, loggedAt: `${day(offset)}T13:00:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
      localStorage.setItem('marc.theme', theme);
      localStorage.setItem('marc.state.v1', JSON.stringify({
        version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
        goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
        sessions: [...Array.from({ length: 11 }, (_, i) => sess(7 * (11 - i), 100)), sess(0, thisKg)],
        active: null, customExercises: [],
        preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
        body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
        onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
      }));
    }, [thisWeekKg, theme]);
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav');
    await launchGone(page);
    await page.waitForTimeout(300);
    await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
    await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
    await settle(page);
    await page.locator('[data-palace="history.weekly-volume"]').scrollIntoViewIfNeeded();
    const got = await page.evaluate(() => {
      const card = document.querySelector('[data-palace="history.weekly-volume"]');
      const avg = card?.querySelector('.volume-avg span');
      const values = [...(card?.querySelectorAll('.volume-bar-value') ?? [])];
      const box = el => { const b = el.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom }; };
      const cur = card?.querySelector('.volume-bars i.current .volume-bar-value');
      const bars = card?.querySelector('.volume-bars');
      const line = card?.querySelector('.volume-avg');
      let lineY = null, expectedLineY = null, lineHitsLabel = false;
      if (bars && line && cur) {
        lineY = line.getBoundingClientRect().top;
        const pcts = [...bars.querySelectorAll('i')].map(b => parseFloat(b.style.height) || 0);
        const contentH = bars.clientHeight - parseFloat(getComputedStyle(bars).paddingTop);
        expectedLineY = bars.getBoundingClientRect().bottom - (pcts.reduce((a, b) => a + b, 0) / pcts.length / 100) * contentH;
        const c = cur.getBoundingClientRect();
        // Where the line crosses the label's box, the label must be on top (hit test) and opaque
        // (a transparent label on top still shows the dashes through its digits).
        if (lineY >= c.top && lineY <= c.bottom) {
          const hit = document.elementFromPoint((c.left + c.right) / 2, lineY + 0.5);
          const bg = getComputedStyle(cur).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
          const opaque = bg.length === 3 || (bg.length === 4 && bg[3] === 1);
          lineHitsLabel = !(hit && cur.contains(hit)) || !opaque;
        }
      }
      return { avg: avg && box(avg), avgText: avg?.textContent ?? '', cur: cur && box(cur), curText: cur?.textContent ?? '', values: values.map(box), bars: card?.querySelectorAll('.volume-bars i').length ?? 0, lineY, expectedLineY, lineHitsLabel };
    });
    if (!got.avg || !got.cur) { errors.push(`${where}: expected the avg label and the current-week value label (got ${JSON.stringify(got)})`); await ctx.close(); continue; }
    if (got.bars !== 12) errors.push(`${where}: expected 12 weekly bars, got ${got.bars}`);
    // The seed really puts this week at r x the average (the labels round to 0.1k).
    const k = t => parseFloat(t.replace(/[^\d.]/g, ''));
    const ratio = k(got.curText) / k(got.avgText);
    if (Math.abs(ratio - r) > 0.05) errors.push(`${where}: seeded this week at ${r}x avg but the labels read ${got.curText} vs ${got.avgText}`);
    if (intersects(got.avg, got.cur)) errors.push(`${where}: avg label ${JSON.stringify(got.avg)} overlaps the current-week value label ${JSON.stringify(got.cur)}`);
    for (const v of got.values) if (intersects(got.avg, v)) errors.push(`${where}: avg label overlaps a bar value label ${JSON.stringify(v)}`);
    if (got.lineY == null || got.expectedLineY == null) errors.push(`${where}: expected the dashed avg line`);
    else if (Math.abs(got.lineY - got.expectedLineY) > 1) errors.push(`${where}: the avg line is at y ${got.lineY.toFixed(1)}, an average-height bar ends at ${got.expectedLineY.toFixed(1)} (±1px)`);
    if (got.lineHitsLabel) errors.push(`${where}: the dashed avg line runs through the current-week value label ${got.curText}`);
    // Font size and bar height differ on a real phone (the owner's 0.84x repro overlapped there), so
    // the two labels must not even share a column: then no ratio or font can stack them.
    if (got.avg.left < got.cur.right && got.cur.left < got.avg.right) errors.push(`${where}: avg label and current-week value label share a column (x ${got.avg.left}-${got.avg.right} vs ${got.cur.left}-${got.cur.right})`);
    await page.locator('[data-palace="history.exercise-stats"] .sparkline-wrap').scrollIntoViewIfNeeded();
    const spark = await page.evaluate(() => {
      const wrap = document.querySelector('[data-palace="history.exercise-stats"] .sparkline-wrap');
      const dot = wrap?.querySelector('svg.sparkline circle');
      const box = el => { const b = el.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom }; };
      return dot ? { dot: box(dot), labels: [...wrap.querySelectorAll('.sparkline-minmax span')].map(el => ({ text: el.textContent, ...box(el) })) } : null;
    });
    if (!spark || !spark.labels.length) errors.push(`${where}: expected the exercise-progress sparkline with its end dot and min/max labels`);
    else for (const l of spark.labels) if (intersects(spark.dot, l)) errors.push(`${where}: sparkline label "${l.text}" covers the latest point's end dot ${JSON.stringify(spark.dot)}`);
    await ctx.close();
  }
}

// BUG-10: History's calendar used to change height between months (4/5/6 raw rows), shoving
// "Recent" up and down as the owner paged. monthCells always pads to 42 cells / 6 rows — walk
// back 13 months (any 13-month window spans a 5- and a 6-row month, whatever today's date is) and
// check the card's height, "Recent"'s position and the day-cell count never move.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'BUG-10 calendar height';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);

  const read = () => page.evaluate(() => {
    const cal = document.querySelector('.cal');
    const heading = [...document.querySelectorAll('h2')].find(h => h.textContent === 'Recent');
    if (!cal || !heading) return null;
    return { height: cal.getBoundingClientRect().height, top: heading.getBoundingClientRect().top, count: cal.querySelectorAll('.day').length };
  });
  const first = await read();
  if (!first) errors.push(`${tag}: could not find .cal and the "Recent" heading`);
  else if (first.count !== 42) errors.push(`${tag}: expected 42 day cells, got ${first.count}`);
  for (let i = 0; i < 13; i++) {
    await page.locator('[aria-label="Previous month"]').click(); await page.waitForTimeout(150);
    const r = await read();
    if (!r) { errors.push(`${tag}: could not find .cal and the "Recent" heading after ${i + 1} month(s) back`); continue; }
    if (r.count !== 42) errors.push(`${tag}: ${i + 1} month(s) back: expected 42 day cells, got ${r.count}`);
    if (first && Math.abs(r.height - first.height) > 0.5) errors.push(`${tag}: ${i + 1} month(s) back: .cal height ${r.height} vs ${first.height}`);
    if (first && Math.abs(r.top - first.top) > 0.5) errors.push(`${tag}: ${i + 1} month(s) back: "Recent" top ${r.top} vs ${first.top}`);
  }
  await ctx.close();
}

// R2.7 (UI-23): on a 360 px phone the set row keeps a typed 102.5 fully visible.
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`narrow: ${e.message}`));
  await page.addInitScript(legacyJson => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, JSON.stringify(legacy));
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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

// I12: an undistorted sparkline (round end dot) and labelled, current-week-highlighted volume bars.
{
  for (const width of [390, 560]) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 2, isMobile: width < 500, hasTouch: width < 500, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const tag = `i12-${width}`;
    page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
    await page.addInitScript(() => {
      const now = new Date().toISOString();
      const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
      const sess = (offset, id, name, sets) => ({ id: `i12-${offset}-${id}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
        exercises: [{ exerciseId: id, name, sets }],
        logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
      const sets = kg => [{ kg, reps: 5, effort: 'ideal' }, { kg, reps: 5, effort: 'ideal' }];
      localStorage.setItem('marc.state.v1', JSON.stringify({
        version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
        goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
        sessions: [
          sess(60, 'lib_bench_press', 'Bench Press', sets(60)), sess(45, 'lib_bench_press', 'Bench Press', sets(70)),
          sess(30, 'lib_bench_press', 'Bench Press', sets(80)), sess(20, 'lib_bench_press', 'Bench Press', sets(85)),
          sess(10, 'lib_bench_press', 'Bench Press', sets(90)), sess(2, 'lib_bench_press', 'Bench Press', sets(100)),
        ],
        active: null, customExercises: [],
        preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
        body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
        onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
      }));
    });
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav');
    await launchGone(page);
    await page.waitForTimeout(300);
    await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
    await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
    await settle(page); await page.screenshot({ path: `${OUT}/silent-black-history-stats-${width}.png` });
    const result = await page.evaluate(() => {
      const bars = document.querySelector('[data-palace="history.weekly-volume"] .volume-bars');
      const hasTitle = !!bars?.querySelector('[title]');
      const current = bars?.querySelector('i.current');
      const currentBg = current ? getComputedStyle(current).backgroundColor : null;
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'var(--accent)';
      document.body.appendChild(probe);
      const accentBg = getComputedStyle(probe).backgroundColor;
      probe.remove();
      const dot = document.querySelector('[data-palace="history.exercise-stats"] .sparkline circle:last-of-type');
      const dr = dot ? dot.getBoundingClientRect() : null;
      return { hasTitle, currentBg, accentBg, dot: dr ? { w: dr.width, h: dr.height } : null };
    });
    if (result.hasTitle) errors.push(`${tag}: .volume-bars still has a title attribute`);
    if (!result.currentBg || result.currentBg !== result.accentBg) errors.push(`${tag}: current-week bar background (${result.currentBg}) should equal --accent (${result.accentBg})`);
    if (!result.dot) errors.push(`${tag}: expected the sparkline's end dot`);
    else if (Math.abs(result.dot.w - result.dot.h) > 0.5) errors.push(`${tag}: sparkline end dot is ${result.dot.w}x${result.dot.h} (should be round, not stretched by an uneven viewBox)`);
    await ctx.close();
  }
}

// QA13-3: the current-week volume bar's label must never eat into the bar's own height.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'qa13-3';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset, id, name, sets) => ({ id: `qa13-3-${offset}-${id}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets }],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    const sets = kg => [{ kg, reps: 5, effort: 'ideal' }, { kg, reps: 5, effort: 'ideal' }];
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [
        sess(60, 'lib_bench_press', 'Bench Press', sets(60)), sess(45, 'lib_bench_press', 'Bench Press', sets(70)),
        sess(30, 'lib_bench_press', 'Bench Press', sets(80)), sess(20, 'lib_bench_press', 'Bench Press', sets(85)),
        sess(10, 'lib_bench_press', 'Bench Press', sets(90)), sess(2, 'lib_bench_press', 'Bench Press', sets(100)),
      ],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await launchGone(page);
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  await settle(page);
  const check = await page.evaluate(() => {
    const container = document.querySelector('[data-palace="history.weekly-volume"] .volume-bars');
    const bars = [...container.querySelectorAll('i')];
    const cs = getComputedStyle(container);
    const contentH = container.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    return bars.map(b => {
      const pct = parseFloat(b.style.height) || 0;
      const expected = (pct / 100) * contentH;
      const actual = b.getBoundingClientRect().height;
      return { pct, expected: Math.round(expected * 10) / 10, actual: Math.round(actual * 10) / 10, diff: Math.abs(expected - actual), current: b.classList.contains('current') };
    });
  });
  const bad = check.filter(c => c.diff > 1);
  if (bad.length) errors.push(`${tag}: volume bar height doesn't match its inline %, ±1px: ${JSON.stringify(bad)}`);
  if (!check.some(c => c.current)) errors.push(`${tag}: expected a current-week bar to check`);
  await ctx.close();
}

// QA13-4: the sparkline's min/max labels must sit at the lowest/highest plotted point, not drift
// down into the dates row below the chart.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'qa13-4';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset, id, name, sets) => ({ id: `qa13-4-${offset}-${id}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets }],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    const sets = kg => [{ kg, reps: 5, effort: 'ideal' }, { kg, reps: 5, effort: 'ideal' }];
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [
        sess(60, 'lib_bench_press', 'Bench Press', sets(60)), sess(45, 'lib_bench_press', 'Bench Press', sets(70)),
        sess(30, 'lib_bench_press', 'Bench Press', sets(80)), sess(20, 'lib_bench_press', 'Bench Press', sets(85)),
        sess(10, 'lib_bench_press', 'Bench Press', sets(90)), sess(2, 'lib_bench_press', 'Bench Press', sets(100)),
      ],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await launchGone(page);
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  await settle(page);
  const check = await page.evaluate(() => {
    const wrap = document.querySelector('[data-palace="history.exercise-stats"] .sparkline-wrap');
    const svg = wrap?.querySelector('svg.sparkline');
    const path = svg?.querySelector('path');
    const d = path?.getAttribute('d') ?? '';
    const nums = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const ys = [];
    for (let i = 1; i < nums.length; i += 2) ys.push(nums[i]);
    if (!ys.length) return null;
    const lowestY = Math.max(...ys); // largest svg-y = the chart's lowest value
    const highestY = Math.min(...ys); // smallest svg-y = the chart's highest value
    const svgRect = svg.getBoundingClientRect();
    const vbHeight = svg.viewBox.baseVal.height;
    const toScreenY = svgY => svgRect.top + (svgY / vbHeight) * svgRect.height;
    const spans = [...wrap.querySelectorAll('.sparkline-minmax span')];
    const centerOf = el => { const r = el.getBoundingClientRect(); return (r.top + r.bottom) / 2; };
    return {
      maxDiff: spans[0] ? Math.abs(centerOf(spans[0]) - toScreenY(highestY)) : null,
      minDiff: spans[1] ? Math.abs(centerOf(spans[1]) - toScreenY(lowestY)) : null,
    };
  });
  if (!check) errors.push(`${tag}: expected the exercise-progress sparkline with labels`);
  else {
    if (check.maxDiff != null && check.maxDiff > 3) errors.push(`${tag}: the max label is ${check.maxDiff.toFixed(1)}px from the highest plotted point (budget 3px)`);
    if (check.minDiff != null && check.minDiff > 3) errors.push(`${tag}: the min label is ${check.minDiff.toFixed(1)}px from the lowest plotted point (budget 3px)`);
  }
  await ctx.close();
}

// QA13-5: an all-zero effort chart (no saved body weight) still keeps a 44px tap target per bar.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'qa13-5';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset, id, name, sets) => ({ id: `qa13-5-${offset}-${id}`, splitId: 'sp1', splitName: 'Pull', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets }],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    const pullUp = [{ kg: 0, reps: 8, effort: 'ideal' }, { kg: 0, reps: 8, effort: 'ideal' }];
    localStorage.setItem('marc.state.v1', JSON.stringify({
      // No profile.bodyWeightKg and no weightLog: every bodyweight set's effective load is null (0 kg).
      version: 1, createdAt: now, profile: { name: 'Marc', heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [
        sess(20, 'lib_pull_up', 'Pull-Up', pullUp), sess(10, 'lib_pull_up', 'Pull-Up', pullUp), sess(2, 'lib_pull_up', 'Pull-Up', pullUp),
      ],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await launchGone(page);
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  await settle(page);
  const check = await page.evaluate(() => [...document.querySelectorAll('.effort-bar-col')].map(el => { const r = el.getBoundingClientRect(); return { w: r.width, h: r.height }; }));
  if (!check.length) errors.push(`${tag}: expected the all-zero effort chart's bar columns`);
  const tooSmall = check.filter(c => c.w < 44 || c.h < 44);
  if (tooSmall.length) errors.push(`${tag}: ${tooSmall.length} effort-bar-col tap target(s) under 44x44px: ${JSON.stringify(tooSmall)}`);
  await ctx.close();
}

// QA13-6: "Easy" and "Not rated" must read as clearly different, and each at ≥3:1 against the card.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'qa13-6';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset, id, name, sets) => ({ id: `qa13-6-${offset}-${id}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets }],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    localStorage.setItem('marc.theme', 'paper');
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [
        sess(10, 'lib_bench_press', 'Bench Press', [{ kg: 60, reps: 5, effort: 'easy' }, { kg: 60, reps: 5 }]),
        sess(2, 'lib_bench_press', 'Bench Press', [{ kg: 60, reps: 5, effort: 'easy' }, { kg: 60, reps: 5 }]),
      ],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await launchGone(page);
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  await settle(page);
  const contrast = (fg, bg) => {
    const toRgb = s => s.match(/[\d.]+/g).map(Number);
    const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const L1 = lum(toRgb(fg)), L2 = lum(toRgb(bg));
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  };
  const check = await page.evaluate(() => {
    const card = document.querySelector('[data-palace="history.exercise-stats"] .card');
    const surface1 = getComputedStyle(card).backgroundColor;
    const easySwatch = document.querySelector('.effort-legend .effort-swatch.easy') ?? document.querySelector('.effort-bar-stack i.easy');
    const unratedEl = document.querySelector('.effort-legend .effort-swatch.unrated') ?? document.querySelector('.effort-bar-stack i.unrated');
    const easyColor = easySwatch ? getComputedStyle(easySwatch).backgroundColor : null;
    const unratedOutline = unratedEl ? (getComputedStyle(unratedEl).boxShadow || getComputedStyle(unratedEl).outlineColor) : null;
    const unratedFillColor = unratedEl ? getComputedStyle(unratedEl).backgroundColor : null;
    return { surface1, easyColor, unratedOutline, unratedFillColor, hasUnratedLegend: !!document.querySelector('.effort-legend')?.textContent?.includes('Not rated') };
  });
  if (!check.easyColor) errors.push(`${tag}: expected an "easy" swatch/segment to measure`);
  else if (contrast(check.easyColor, check.surface1) < 3) errors.push(`${tag}: "easy" colour ${check.easyColor} is under 3:1 against ${check.surface1}`);
  if (check.hasUnratedLegend) {
    if (check.easyColor && check.unratedFillColor && check.easyColor === check.unratedFillColor) errors.push(`${tag}: "easy" and "Not rated" use the identical fill colour`);
    if (!check.unratedOutline || check.unratedOutline === 'none') errors.push(`${tag}: expected "Not rated" to have a distinct outline, not a plain flat fill`);
  }
  await ctx.close();
}

// O4: "Work done, by effort" bars per exercise — legend, no page scroll, no overlap, tap selects a bar.
{
  for (const width of [360, 390]) {
    for (const theme of ['silent-black', 'paper']) {
      const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const tag = `o4-${theme}-${width}`;
      page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
      await page.addInitScript(t => {
        const now = new Date().toISOString();
        const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
        const sess = (offset, id, name, sets) => ({ id: `o4-${offset}-${id}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
          exercises: [{ exerciseId: id, name, sets }],
          logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
        localStorage.setItem('marc.theme', t);
        localStorage.setItem('marc.state.v1', JSON.stringify({
          version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
          goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
          sessions: [
            sess(40, 'lib_bench_press', 'Bench Press', [{ kg: 100, reps: 5, effort: 'easy' }, { kg: 100, reps: 5, effort: 'easy' }]),
            sess(30, 'lib_bench_press', 'Bench Press', [{ kg: 100, reps: 5, effort: 'ideal' }, { kg: 100, reps: 5 }]),
            sess(20, 'lib_bench_press', 'Bench Press', [{ kg: 110, reps: 5, effort: 'ideal' }, { kg: 110, reps: 5, effort: 'max' }]),
            sess(10, 'lib_bench_press', 'Bench Press', [{ kg: 110, reps: 5, effort: 'max' }, { kg: 110, reps: 5, kind: 'failure' }]),
            sess(2, 'lib_bench_press', 'Bench Press', [{ kg: 120, reps: 5, effort: 'ideal' }, { kg: 120, reps: 5, effort: 'ideal' }]),
          ],
          active: null, customExercises: [],
          preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
          body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
          onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
        }));
      }, theme);
      await page.goto(`http://localhost:${PORT}/`);
      await page.waitForSelector('.nav');
      await launchGone(page);
      await page.waitForTimeout(300);
      await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
      await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
      await settle(page); await page.screenshot({ path: `${OUT}/${theme}-effort-bars-${width}.png` });
      const check = await page.evaluate(() => {
        const bars = [...document.querySelectorAll('.effort-bar-col')];
        const rects = bars.map(b => b.getBoundingClientRect());
        let overlap = false;
        for (let i = 1; i < rects.length; i++) if (rects[i]?.left < (rects[i - 1]?.right ?? 0) - 0.5) overlap = true;
        const legendHasUnrated = document.querySelector('.effort-legend')?.textContent?.includes('Not rated') ?? false;
        return { count: bars.length, overlap, legendHasUnrated, pageWidth: document.documentElement.scrollWidth };
      });
      if (check.count < 4) errors.push(`${tag}: expected the effort bars chart with at least 4 sessions`);
      if (check.overlap) errors.push(`${tag}: effort bar columns overlap`);
      if (!check.legendHasUnrated) errors.push(`${tag}: expected "Not rated" in the legend (an unrated set is seeded)`);
      if (check.pageWidth > width) errors.push(`${tag}: the page scrolls horizontally at ${width}px (scrollWidth ${check.pageWidth})`);
      // Tapping a bar selects it (and, per Stats, reveals that session's logged sets below the chart).
      await page.locator('.effort-bar-col').first().click();
      await page.waitForTimeout(150);
      const selected = await page.evaluate(() => document.querySelector('.effort-bar-col[aria-pressed="true"]') != null);
      if (!selected) errors.push(`${tag}: tapping a bar should select it`);
      await ctx.close();
    }
  }
}

// A6: scrub the sparkline and the weekly volume bars with a finger or the keyboard.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'a6';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset, id, name, sets) => ({ id: `a6-${offset}-${id}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets }],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    const sets = kg => [{ kg, reps: 5, effort: 'ideal' }, { kg, reps: 5, effort: 'ideal' }];
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [
        sess(60, 'lib_bench_press', 'Bench Press', sets(60)), sess(45, 'lib_bench_press', 'Bench Press', sets(70)),
        sess(30, 'lib_bench_press', 'Bench Press', sets(80)), sess(20, 'lib_bench_press', 'Bench Press', sets(85)),
        sess(10, 'lib_bench_press', 'Bench Press', sets(90)), sess(2, 'lib_bench_press', 'Bench Press', sets(100)),
      ],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await launchGone(page);
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  await settle(page);

  // The fixed bottom nav and the Escobar dock float over the last ~150px of the viewport; scroll
  // a chart clear of both before dragging on it, so the touch actually reaches the chart.
  const scrollClear = async locator => {
    const vh = page.viewportSize().height;
    let box = await locator.boundingBox();
    const overlap = box.y + box.height - (vh - 150);
    if (overlap > 0) {
      await page.evaluate(d => window.scrollBy(0, d), overlap);
      await page.waitForTimeout(50);
      box = await locator.boundingBox();
    }
    return box;
  };

  // Sparkline: touchDrag 10%->90% changes the readout at least 3 times, and it returns to the latest value within 300ms of release.
  {
    const readoutSel = '[data-palace="history.exercise-stats"] .chart-readout .readout-cur';
    const wrap = page.locator('[data-palace="history.exercise-stats"] .sparkline-wrap');
    const box = await scrollClear(wrap);
    const restText = await page.locator(readoutSel).textContent();
    await page.evaluate(sel => {
      const el = document.querySelector(sel);
      window.__a6 = [el?.textContent ?? ''];
      window.__a6obs = new MutationObserver(() => window.__a6.push(el?.textContent ?? ''));
      window.__a6obs.observe(el, { characterData: true, childList: true, subtree: true });
    }, readoutSel);
    await touchDrag(page, box.x + box.width * 0.1, box.y + box.height / 2, box.x + box.width * 0.9, box.y + box.height / 2, 400);
    const seen = await page.evaluate(() => new Set(window.__a6).size);
    if (seen < 3) errors.push(`${tag}: sparkline readout changed ${seen - 1} time(s) during a 10%->90% drag, expected >= 3`);
    const backToRest = await page.waitForFunction(sel => document.querySelector(sel)?.textContent === window.__a6[0], readoutSel, { timeout: 300 }).then(() => true).catch(() => false);
    if (!backToRest) errors.push(`${tag}: sparkline readout did not return to the latest value within 300ms of release`);
    const restTextNow = await page.locator(readoutSel).textContent();
    if (restTextNow !== restText) errors.push(`${tag}: sparkline readout at rest changed from "${restText}" to "${restTextNow}"`);
  }

  // QA14-1, under reduced motion (this whole context): release must stay an instant swap, never
  // a fractional-opacity frame — the same drag as above, sampled right after release.
  {
    const wrap = page.locator('[data-palace="history.exercise-stats"] .sparkline-wrap');
    const box = await scrollClear(wrap);
    await touchDrag(page, box.x + box.width * 0.2, box.y + box.height / 2, box.x + box.width * 0.6, box.y + box.height / 2, 250);
    const opacities = await page.evaluate(() => {
      const old = document.querySelector('[data-palace="history.exercise-stats"] .chart-readout .readout-old');
      const dot = document.querySelector('[data-palace="history.exercise-stats"] .sparkline-guide-dot');
      return [old, dot].filter(Boolean).map(el => parseFloat(getComputedStyle(el).opacity));
    });
    if (opacities.some(o => o > 0 && o < 1)) errors.push(`${tag}: under reduced motion, release should be an instant swap, not a fade (opacities: ${JSON.stringify(opacities)})`);
  }

  // A vertical drag on the sparkline scrolls the page (touch-action:pan-y), it doesn't scrub.
  {
    const wrap = page.locator('[data-palace="history.exercise-stats"] .sparkline-wrap');
    const box = await scrollClear(wrap);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await touchDrag(page, box.x + box.width / 2, box.y + box.height / 2, box.x + box.width / 2, box.y + box.height / 2 - 200, 200);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    if (scrollAfter <= scrollBefore) errors.push(`${tag}: a vertical drag on the sparkline should scroll the page (was ${scrollBefore}, now ${scrollAfter})`);
  }

  // Keyboard: focus + ArrowLeft changes the readout and aria-valuenow.
  {
    const readoutSel = '[data-palace="history.exercise-stats"] .chart-readout .readout-cur';
    const slider = page.locator('[data-palace="history.exercise-stats"] .sparkline-wrap');
    await slider.focus();
    const before = { text: await page.locator(readoutSel).textContent(), now: await slider.getAttribute('aria-valuenow') };
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(50);
    const after = { text: await page.locator(readoutSel).textContent(), now: await slider.getAttribute('aria-valuenow') };
    if (after.text === before.text) errors.push(`${tag}: ArrowLeft on the focused sparkline should change the readout`);
    if (after.now === before.now) errors.push(`${tag}: ArrowLeft on the focused sparkline should change aria-valuenow`);
    await page.keyboard.press('Escape');
  }

  // The weekly volume bars get the same touch behaviour: a horizontal drag changes the readout at
  // least once mid-drag (checked live via MutationObserver — the release reverts it before a
  // post-drag read would ever see the change), and dims the non-selected bars while it's held.
  {
    const readoutSel = '[data-palace="history.weekly-volume"] .chart-readout .readout-cur';
    const bars = page.locator('[data-palace="history.weekly-volume"] .volume-bars');
    const box = await scrollClear(bars);
    const restText = await page.locator(readoutSel).textContent();
    await page.evaluate(sel => {
      const el = document.querySelector(sel);
      window.__a6vol = [el?.textContent ?? ''];
      window.__a6volDim = false;
      window.__a6volObs = new MutationObserver(() => {
        window.__a6vol.push(el?.textContent ?? '');
        if ([...document.querySelectorAll('[data-palace="history.weekly-volume"] .volume-bars i')].some(b => parseFloat(getComputedStyle(b).opacity) < 1)) window.__a6volDim = true;
      });
      window.__a6volObs.observe(el, { characterData: true, childList: true, subtree: true });
    }, readoutSel);
    await touchDrag(page, box.x + box.width * 0.15, box.y + box.height / 2, box.x + box.width * 0.85, box.y + box.height / 2, 400);
    const [seenVol, dimmed] = await page.evaluate(() => [new Set(window.__a6vol).size, window.__a6volDim]);
    if (seenVol < 2) errors.push(`${tag}: dragging across the weekly volume bars should change the readout`);
    if (!dimmed) errors.push(`${tag}: mid-drag, at least one non-selected volume bar should be dimmed`);
    const backText = await page.locator(readoutSel).textContent();
    if (backText !== restText) errors.push(`${tag}: weekly volume readout did not return to "${restText}" after release (got "${backText}")`);
  }
  await ctx.close();
}

// QA14-1: under full motion, letting go of a chart scrub must crossfade, not snap in one frame.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const tag = 'qa14-1';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const sess = (offset, id, name, sets) => ({ id: `qa14-1-${offset}-${id}`, splitId: 'sp1', splitName: 'Push', day: day(offset), startedAt: `${day(offset)}T17:00:00.000Z`, endedAt: `${day(offset)}T17:30:00.000Z`, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: id, name, sets }],
      logging: { mode: 'live', trainedAt: `${day(offset)}T17:00:00.000Z`, trainedEndAt: `${day(offset)}T17:30:00.000Z`, loggedAt: `${day(offset)}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } });
    const sets = kg => [{ kg, reps: 5, effort: 'ideal' }, { kg, reps: 5, effort: 'ideal' }];
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [
        sess(60, 'lib_bench_press', 'Bench Press', sets(60)), sess(45, 'lib_bench_press', 'Bench Press', sets(70)),
        sess(30, 'lib_bench_press', 'Bench Press', sets(80)), sess(20, 'lib_bench_press', 'Bench Press', sets(85)),
        sess(10, 'lib_bench_press', 'Bench Press', sets(90)), sess(2, 'lib_bench_press', 'Bench Press', sets(100)),
      ],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav');
  await launchGone(page);
  await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  const wrap = page.locator('[data-palace="history.exercise-stats"] .sparkline-wrap');
  const vh = page.viewportSize().height;
  let box = await wrap.boundingBox();
  const overlap = box.y + box.height - (vh - 150);
  if (overlap > 0) { await page.evaluate(d => window.scrollBy(0, d), overlap); await page.waitForTimeout(50); box = await wrap.boundingBox(); }
  await touchDrag(page, box.x + box.width * 0.2, box.y + box.height / 2, box.x + box.width * 0.6, box.y + box.height / 2, 250);
  // Sample a few times across the --dur-fast window right after release: at least one frame must
  // catch a fractional opacity, or a running (non-idle) Web Animation.
  let midTransition = false;
  for (let i = 0; i < 6 && !midTransition; i++) {
    await page.waitForTimeout(20);
    midTransition = await page.evaluate(() => {
      const old = document.querySelector('[data-palace="history.exercise-stats"] .chart-readout .readout-old');
      const dot = document.querySelector('[data-palace="history.exercise-stats"] .sparkline-guide-dot');
      const line = document.querySelector('[data-palace="history.exercise-stats"] .sparkline-guide');
      const fractional = [old, dot, line].filter(Boolean).some(el => { const o = parseFloat(getComputedStyle(el).opacity); return o > 0 && o < 1; });
      const running = [old, dot, line].filter(Boolean).some(el => el.getAnimations().some(a => a.playState === 'running'));
      return fractional || running;
    });
  }
  if (!midTransition) errors.push(`${tag}: releasing a chart scrub under full motion should crossfade (a mid-transition frame within ~120ms of release), not snap instantly`);
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
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.waitForTimeout(300);
  // Every weekday scheduled, so today is a training day whatever the date. Written by an init
  // script on a fresh page: editing storage under the running app loses to its own save on unload.
  const patched = await page.evaluate(() => { const st = JSON.parse(localStorage.getItem('marc.state.v1')); const id = st.splits[0].id; for (const d of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']) st.schedule[d] = id; return JSON.stringify(st); });
  await page.close();
  const page2 = await ctx.newPage();
  page2.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page2.addInitScript(json => { if (!sessionStorage.getItem('r6.patched')) { sessionStorage.setItem('r6.patched', '1'); localStorage.setItem('marc.state.v1', json); } }, patched);
  await page2.goto(`http://localhost:${PORT}/`); await page2.waitForSelector('.nav'); await launchGone(page2); await page2.waitForTimeout(300);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  // I19: an empty History, on a fresh profile with no sessions yet, shows a designed empty state
  // (left-aligned, a title, no ghost rows) with a button that starts a session on Train.
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  if (!(await visible(page.getByText('Your finished workouts land here.')))) errors.push('fresh-profile: expected the History empty-state title');
  const emptyAlign = await page.locator('.empty').first().evaluate(el => getComputedStyle(el).textAlign);
  if (emptyAlign !== 'left' && emptyAlign !== 'start') errors.push(`fresh-profile: expected the History empty state left-aligned, computed text-align was ${emptyAlign}`);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-history-empty.png` });
  await page.locator('.empty').getByRole('button').first().click(); await page.waitForTimeout(300);
  if (!(await visible(page.locator('nav.nav button[aria-current="page"]', { hasText: /^(Train|Live)$/ })))) errors.push('fresh-profile: expected the History empty-state button to land on Train');
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  // BUG-13: the seed's newest workout is yesterday (offset 1), so on a local Monday "This week" was
  // empty and the sheet rightly disabled Save / Share. Pin the page clock to that workout's evening
  // (same local time zone as the seed) so the default Week card always has sets to share.
  const shareFitNow = new Date(); shareFitNow.setDate(shareFitNow.getDate() - 1); shareFitNow.setHours(20, 0, 0, 0);
  await page.clock.install({ time: shareFitNow.getTime() });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(250);
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250);
  for (const inset of [0, 24, 48]) {
    await page.evaluate(i => document.documentElement.style.setProperty('--safe-area-inset-bottom', `${i}px`), inset);
    await page.getByRole('button', { name: 'Share your stats' }).click();
    await shareSheetReady(page);
    // BUG-13: an empty card disables Save / Share on purpose; fail loudly if the seed ever lands there.
    if (await page.locator('dialog[open] .share-empty').isVisible().catch(() => false)) errors.push(`share-fit ${w}×${h} inset ${inset}: the Week card is empty, so Save / Share are disabled (seed outside the pinned week)`);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
    await again.waitForSelector('.nav'); await launchGone(again);
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
  // I12: Escobar's sparkline stays the static 56px chart with no scrub/date labels.
  const escSpark = await page.evaluate(() => {
    const svg = document.querySelector('.esc-comp[data-component="lift_trend"] .sparkline');
    const wrap = svg?.closest('.sparkline-wrap');
    return { h: svg ? svg.getBoundingClientRect().height : 0, hasLabels: !!(wrap && wrap.querySelector('.sparkline-minmax, .sparkline-dates')) };
  });
  if (Math.round(escSpark.h) !== 56) errors.push(`${tag}: Escobar sparkline is ${escSpark.h}px tall, expected 56`);
  if (escSpark.hasLabels) errors.push(`${tag}: Escobar sparkline should render with no labels`);
  // O4: the same effort split renders under the sparkline, static (no tap).
  if (!(await visible(page.locator('.esc-comp[data-component="lift_trend"] .effort-bars')))) errors.push(`${tag}: expected the lift_trend effort bars`);
  if ((await page.locator('.esc-comp[data-component="lift_trend"] .effort-bar-col[type="button"]').count()) > 0) errors.push(`${tag}: Escobar's effort bars should not be tappable`);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
  const later = async () => { if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); } };
  await later();
  const controlled = await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 }).then(() => true).catch(() => false);
  if (!controlled) errors.push(`${tag}: the service worker never took control`);
  await ctx.setOffline(true);
  await page.reload();
  if (!(await page.waitForSelector('.nav', { timeout: 10000 }).then(() => true).catch(() => false))) errors.push(`${tag}: offline reload did not render the app`);
  // I13: the bundled Inter Variable font (precached by the service worker, cache marc-*, sw.js:6)
  // must render with the network fully off, not just from an already-warm HTTP cache.
  const fontsOffline = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some(f => /Inter/.test(f.family) && f.status === 'loaded');
  });
  if (!fontsOffline) errors.push(`I13: Inter did not report loaded on an offline reload`);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.reload(); await page.waitForSelector('.nav'); await launchGone(page);
  m = await mstate();
  if (m.attr !== 'reduce' || m.pref !== 'reduce') errors.push(`${tag}: Reduce motion did not survive reload`);
  await page.evaluate(() => localStorage.removeItem('marc.motion'));
  await page.reload(); await page.waitForSelector('.nav'); await launchGone(page);

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
  // UI-1 (replaces I3's "no exercise-* animation" probe): at most one exercise-* animation, only on
  // the open card's title. The inputs are blurred here, so the logging sweep must be off and the
  // idle check below stays strict: exercise-shimmer is NOT on its allow list.
  const exAnims = await page.evaluate(() => document.getAnimations().filter(a => a instanceof CSSAnimation && a.animationName.startsWith('exercise-'))
    .map(a => ({ name: a.animationName, onActiveTitle: !!a.effect?.target?.matches?.('.exercise.active .exname') })));
  if (exAnims.length > 1 || exAnims.some(a => !a.onActiveTitle)) errors.push(`${tag}: UI-1 A6 exercise-* animations: ${JSON.stringify(exAnims)}`);
  const ALLOW = ['esc-rot', 'esc-blink', 'esc-pulse', 'esc-lift', 'palace-glow', 'esc-spin'];
  const unlisted = await page.evaluate(allow => document.getAnimations()
    .filter(a => a.effect && a.effect.getTiming().iterations === Infinity)
    .filter(a => !(a instanceof CSSAnimation && allow.includes(a.animationName)))
    .map(a => (a instanceof CSSAnimation ? a.animationName : a.constructor.name)), ALLOW);
  if (unlisted.length) errors.push(`${tag}: unlisted infinite animation(s): ${unlisted.join(', ')}`);
  await ctx.close();
}

// UI-1: the open exercise's title sweeps twice on open and stops by itself (A1), sweeps while a
// kg/reps field has focus and stops on blur, holds briefly after an effort tap, stays off when idle
// (A2), never runs under reduced motion (A3), paints only var(--text) and the accent (A4), and only
// the open card's title ever animates (A6). Full motion, 390 px, Silent Black and Paper.
for (const theme of ['silent-black', 'paper']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = `UI-1 shimmer ${theme}`;
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click();
  await page.waitForSelector('.exercise.active .exname');
  // Every exercise-* animation, where it runs, and the title's paint at this instant.
  const probe = () => page.evaluate(() => {
    const anims = document.getAnimations().filter(a => a instanceof CSSAnimation && a.animationName.startsWith('exercise-'));
    const rgb = v => { const d = document.createElement('i'); d.style.color = v; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; };
    const n = document.querySelector('.exercise.active .exname'); const cs = n && getComputedStyle(n);
    return {
      anims: anims.map(a => ({ name: a.animationName, state: a.playState, iterations: a.effect.getTiming().iterations, onActiveTitle: !!a.effect.target?.matches('.exercise.active .exname') })),
      text: rgb('var(--text)'), accent: rgb('var(--accent)'), greys: [rgb('var(--text-2)'), rgb('var(--text-3)')],
      paint: cs && { color: cs.color, fill: cs.webkitTextFillColor, clip: cs.backgroundClip || cs.webkitBackgroundClip, bg: cs.backgroundColor, image: cs.backgroundImage },
    };
  });
  const running = p => p.anims.filter(a => a.state === 'running');
  const a6 = (p, when) => { if (p.anims.length > 1 || p.anims.some(a => !a.onActiveTitle)) errors.push(`${tag}: A6 ${when}: ${JSON.stringify(p.anims)}`); };
  // A4: plain var(--text) at rest; mid-sweep the fill is transparent over a var(--text) background
  // carrying only the accent band, with no dim text tone anywhere.
  const restPlain = (p, when) => { if (!p.paint || p.paint.color !== p.text || p.paint.fill !== p.text || p.paint.clip === 'text') errors.push(`${tag}: A4 title not plain var(--text) ${when}: ${JSON.stringify(p.paint)} text ${p.text}`); };

  // A1: opening starts a finite run on the title.
  let p = await probe();
  a6(p, 'on open');
  if (running(p).length !== 1 || !(Number.isFinite(p.anims[0]?.iterations) && p.anims[0].iterations >= 1)) errors.push(`${tag}: A1 opening gave no finite exercise-shimmer run: ${JSON.stringify(p.anims)}`);
  // Freeze it mid-pass for the paint check and the screenshot (once the screen's own entry fades
  // have settled), then let it run on.
  await settle(page);
  await page.evaluate(() => { const a = document.getAnimations().find(x => x instanceof CSSAnimation && x.animationName === 'exercise-shimmer'); if (a) { a.pause(); a.currentTime = 1000; } });
  p = await probe();
  const mid = p.paint;
  if (!mid || mid.color !== p.text || mid.bg !== p.text || mid.clip !== 'text' || mid.fill !== 'rgba(0, 0, 0, 0)' || !mid.image.includes(p.accent) || p.greys.some(g => mid.image.includes(g) || mid.bg === g)) errors.push(`${tag}: A4 mid-sweep paint is not var(--text) + accent: ${JSON.stringify(mid)} text ${p.text} accent ${p.accent}`);
  const head = await page.locator('.exercise.active .ex-head').boundingBox();
  if (head) await page.screenshot({ path: `${OUT}/${theme}-ui1-title-sweep.png`, clip: { x: 0, y: Math.max(0, head.y - 8), width: 390, height: head.height + 16 } });
  await page.evaluate(() => document.getAnimations().find(x => x instanceof CSSAnimation && x.animationName === 'exercise-shimmer')?.play());
  // ...and it ends by itself: gone from document.getAnimations(), title plain again (A1, A2 idle).
  await page.waitForFunction(() => !document.getAnimations().some(a => a instanceof CSSAnimation && a.animationName.startsWith('exercise-')), null, { timeout: 6000 }).catch(() => {});
  p = await probe();
  if (p.anims.length) errors.push(`${tag}: A1 the open run did not end by itself: ${JSON.stringify(p.anims)}`);
  restPlain(p, 'after the open run');

  // A2: focusing a kg field sweeps, and keeps sweeping; blurring stops it within one cycle.
  await page.locator('.exercise.active .set-grid input').first().focus(); await page.waitForTimeout(150);
  p = await probe(); a6(p, 'kg focus');
  if (running(p).length !== 1 || p.anims[0].iterations !== Infinity) errors.push(`${tag}: A2 kg focus gave no sweep: ${JSON.stringify(p.anims)}`);
  await page.locator('.exercise.active .set-grid input').first().fill('40');
  await page.locator('.exercise.active .set-grid input').nth(1).focus(); await page.waitForTimeout(2300);
  p = await probe();
  if (running(p).length !== 1) errors.push(`${tag}: A2 sweep stopped while the reps field still has focus: ${JSON.stringify(p.anims)}`);
  await page.locator('.exercise.active .set-grid input').nth(1).blur();
  const offAfterBlur = await page.waitForFunction(() => !document.getAnimations().some(a => a instanceof CSSAnimation && a.animationName.startsWith('exercise-')), null, { timeout: 2000 }).then(() => true).catch(() => false);
  if (!offAfterBlur) errors.push(`${tag}: A2 the sweep did not stop within one cycle of blur`);
  restPlain(await probe(), 'after blur');

  // A2: an effort tap gives a short hold that ends by itself, even while the button keeps focus.
  await page.locator('.exercise.active .effort button').first().click(); await page.waitForTimeout(150);
  p = await probe(); a6(p, 'effort tap');
  const effortFocused = await page.evaluate(() => !!document.activeElement?.closest('.exercise.active .effort'));
  if (running(p).length !== 1) errors.push(`${tag}: A2 effort tap gave no hold (button focused: ${effortFocused}): ${JSON.stringify(p.anims)}`);
  await page.waitForTimeout(2300);
  p = await probe();
  if (p.anims.length) errors.push(`${tag}: A2 the effort hold did not end by itself: ${JSON.stringify(p.anims)}`);

  // A6: opening another card moves the one run to it; the first card's title is plain.
  const second = page.locator('.exercise:not(.active) .ex-head').first();
  if (await second.count()) {
    await second.click(); await page.waitForTimeout(150);
    p = await probe(); a6(p, 'second card');
    if (running(p).length !== 1) errors.push(`${tag}: A1 opening a second card gave no run: ${JSON.stringify(p.anims)}`);
  } else errors.push(`${tag}: expected a second exercise card`);

  // A3: under reduced motion there is never a sweep, focused or not, and the title stays plain.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'reduce', null, { timeout: 2000 }).catch(() => {});
  p = await probe();
  if (p.anims.length) errors.push(`${tag}: A3 a sweep is still running under reduce: ${JSON.stringify(p.anims)}`);
  await page.locator('.exercise.active .set-grid input').first().focus(); await page.waitForTimeout(150);
  p = await probe();
  if (p.anims.length) errors.push(`${tag}: A3 kg focus swept under reduce: ${JSON.stringify(p.anims)}`);
  restPlain(p, 'under reduce');
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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

  // (b2) QA11-5: the backdrop's scrim opacity follows the drag 1:1 while held. On a spring-back
  // release it used to jump straight to full opacity the instant the finger lifted, well before
  // the panel had actually animated back to rest — a visible backdrop "pop". It must stay at
  // (close to) the held value right after release, and only reach full opacity once the panel
  // settles.
  const backdropOpacity = () => page.evaluate(() => {
    const d = document.querySelector('dialog.sheet[open]');
    return d ? parseFloat(getComputedStyle(d, '::backdrop').opacity) : null;
  });
  box = await panelBox();
  const dist10b = box.height * 0.1;
  const x0b = box.x + box.width / 2;
  const y0b = box.y + 10;
  const y1b = y0b + dist10b;
  const dragMs = Math.round(dist10b / 0.15);
  const cdp = await page.context().newCDPSession(page);
  try {
    // Paced multi-step move (same pacing touchDrag uses for a slow drag) so the tracker's
    // velocity estimate reflects a genuine slow drag, not a single-jump "flick" that would
    // fling the sheet closed instead of springing back.
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0b, y: y0b }] });
    const steps = Math.min(10, Math.max(3, Math.round(dragMs / 150)));
    for (let s = 1; s <= steps; s++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0b, y: y0b + (y1b - y0b) * (s / steps) }] });
      await new Promise(r => setTimeout(r, dragMs / steps));
    }
    // Hold at the final position without moving: the velocity estimate decays toward the held
    // position's own (near-zero) recent motion, same as a finger paused mid-drag.
    await page.waitForTimeout(150);
    const heldOpacity = await backdropOpacity();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const rightAfterRelease = await backdropOpacity();
    if (heldOpacity == null || rightAfterRelease == null || Math.abs(rightAfterRelease - heldOpacity) > 0.02) errors.push(`${tag} (QA11-5): expected backdrop opacity right after release (${rightAfterRelease}) within 0.02 of its held value (${heldOpacity})`);
    await page.waitForTimeout(500);
    const settledOpacity = await backdropOpacity();
    if (settledOpacity == null || Math.abs(settledOpacity - 1) > 0.02) errors.push(`${tag} (QA11-5): expected backdrop opacity back at 1 once the panel is back at rest, got ${settledOpacity}`);
    if (!(await openCount())) errors.push(`${tag} (QA11-5): sheet should remain open after a short spring-back drag`);
  } finally {
    await cdp.detach().catch(() => {});
  }

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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
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
  let ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  let page = await ctx.newPage();
  const tag = 'F13 toast';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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

  // QA11-3/QA11-6: each of these lets its toast's countdown run out without Undo, permanently
  // removing an exercise (same as a real user who never taps Undo) — with only 3 exercises in
  // this fixture's push split, that exhausts the list after the two swipeAway() calls below plus
  // one more, and the next removeAndGetToast() times out finding a `.card.exercise` that no
  // longer exists. A fresh, isolated context (like every other gate block already uses, just one
  // per un-Undone removal instead of one per theme) sidesteps that entirely — localStorage.clear()
  // alone isn't enough (the live session is restored from IndexedDB regardless), and clearing
  // IndexedDB in place races the still-open connection from this same page/tab.
  const freshLiveSession = async () => {
    await ctx.close();
    ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
    await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); }, [JSON.stringify(legacy)]);
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Later' }).click().catch(() => {}); await page.waitForTimeout(150);
    await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  };

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
    await page.reload(); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
    await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
    await removeAndGetToast();
    const contrast = await page.evaluate(() => {
      const btn = document.querySelector('.toast button');
      const toast = document.querySelector('.toast');
      if (!btn || !toast) return null;
      // QA-b7-1: this Chromium build serializes a color-mix() result via the CSS Color 4
      // `color(srgb r g b)` function (0-1 range), not legacy rgb()/rgba() — without this, fg/bg
      // silently parsed to null and the check below never actually ran.
      const parseRgba = str => {
        let m = str.match(/rgba?\(([^)]+)\)/);
        if (m) { const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
        m = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
        if (m) return { r: Number(m[1]) * 255, g: Number(m[2]) * 255, b: Number(m[3]) * 255, a: m[4] !== undefined ? Number(m[4]) : 1 };
        return null;
      };
      const fg = parseRgba(getComputedStyle(btn).color);
      const bg = parseRgba(getComputedStyle(toast).backgroundColor);
      if (!fg || !bg) return null;
      const lin = c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
      const rl = ({ r, g, b: bb }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
      const l1 = rl(fg) + 0.05, l2 = rl(bg) + 0.05;
      return l1 > l2 ? l1 / l2 : l2 / l1;
    });
    // QA-b7-1: a null contrast (couldn't parse either colour) is now a hard error, not a skip.
    if (contrast == null) errors.push(`${tag} ${theme}: could not measure toast button contrast`);
    else if (contrast < 4.5) errors.push(`${tag} ${theme}: toast button contrast ${contrast.toFixed(2)} < 4.5`);
    await page.locator('.toast').getByRole('button', { name: 'Undo' }).click(); await page.waitForTimeout(350);
  }
  await page.evaluate(t => { localStorage.setItem('marc.theme', t); }, 'silent-black');
  await page.reload(); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);

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
  await freshLiveSession();
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
  await freshLiveSession();
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
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
    // QA-b7-1: see the toast contrast check above — this Chromium build serializes a color-mix()
    // result via `color(srgb r g b)` (0-1 range), not legacy rgb()/rgba().
    const parseRgba = str => {
      let m = str.match(/rgba?\(([^)]+)\)/);
      if (m) { const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
      m = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
      if (m) return { r: Number(m[1]) * 255, g: Number(m[2]) * 255, b: Number(m[3]) * 255, a: m[4] !== undefined ? Number(m[4]) : 1 };
      return null;
    };
    const cs = getComputedStyle(badge);
    const fg = parseRgba(cs.color);
    const own = parseRgba(cs.backgroundColor);
    if (!fg || !own) return null;
    let node = badge.parentElement, under = { r: 255, g: 255, b: 255 };
    while (node) { const bg = parseRgba(getComputedStyle(node).backgroundColor); if (bg && bg.a >= 0.999) { under = bg; break; } node = node.parentElement; }
    const mix = (f, b, a) => f * a + b * (1 - a);
    const bg = { r: mix(own.r, under.r, own.a), g: mix(own.g, under.g, own.a), b: mix(own.b, under.b, own.a) };
    const lin = c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
    const rl = ({ r, g, b: bb }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
    const l1 = rl(fg) + 0.05, l2 = rl(bg) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  });
  // QA-b7-1: a null contrast (badge missing, or either colour failed to parse) is now a hard
  // error, not a skip.
  if (contrast == null) errors.push(`${tag}: could not measure pr-badge text contrast`);
  else if (contrast < 4.5) errors.push(`${tag}: pr-badge text contrast ${contrast.toFixed(2)} < 4.5`);

  // A tab switch away and back does not replay the pop.
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(300);
  const afterSwitch = await page.evaluate(() => { const b = document.querySelector('.pr-badge'); return { exists: !!b, hasPop: !!b?.classList.contains('pop') }; });
  if (!afterSwitch.exists) errors.push(`${tag}: expected the .pr-badge to still be there after a tab switch`);
  if (afterSwitch.hasPop) errors.push(`${tag}: the badge replayed .pop after a tab switch back`);

  await ctx.close();
}

// BUG-18: a record from a set the plausibility check flags (80 kg after 50 kg, over the 25 % jump
// line) reads "PR unconfirmed"; a plausible one (55 kg) reads plain "PR".
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'BUG-18 unconfirmed record';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => {
    if (localStorage.getItem('marc.state.v1')) return;
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
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: 'Train' }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip' }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  const inputs = page.locator('.set-grid input');
  await inputs.nth(0).fill('80'); await inputs.nth(1).fill('5'); await inputs.nth(1).blur(); await page.waitForTimeout(150);
  const first = (await page.locator('.pr-badge').first().textContent().catch(() => null))?.trim() ?? null;
  if (first !== 'PR unconfirmed') errors.push(`${tag}: 80 kg after 50 kg should read 'PR unconfirmed', got ${JSON.stringify(first)}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) errors.push(`${tag}: the unconfirmed pill makes the page scroll sideways at 360 px`);
  const second = page.locator('.set-grid:has(input)').nth(1).locator('input');
  await second.nth(0).fill('55'); await second.nth(1).fill('5'); await second.nth(1).blur(); await page.waitForTimeout(150);
  const texts = (await page.locator('.pr-badge').allTextContents()).map(t => t.trim());
  if (!texts.includes('PR')) errors.push(`${tag}: 55 kg after 50 kg should read 'PR', got ${JSON.stringify(texts)}`);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
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
  await page.goto(`http://localhost:${PORT}/`); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(400);
  // O1: this is the one block using raw page.mouse.*, which (unlike a locator .click(), which
  // retries until unobscured) hits whatever is at those coordinates right now. Under full motion
  // (this context has no reducedMotion key, on purpose: QA5-2) the launch overlay still covers
  // the screen for up to ~1750ms, so wait for it to clear before any coordinate-based press.
  await page.locator('#launch').waitFor({ state: 'detached', timeout: 4500 }).catch(() => {});
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
    await page.waitForSelector('.nav'); await launchGone(page);
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
    await page.waitForSelector('.nav'); await launchGone(page);
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
    { tag: 'only-sore', sessions: [rtSess(96, 'e1', 'Barbell Curl', 20, 'easy', 1)], checkIns: [{ day: `${RT_PINNED_NOW.getFullYear()}-${String(RT_PINNED_NOW.getMonth() + 1).padStart(2, '0')}-${String(RT_PINNED_NOW.getDate()).padStart(2, '0')}`, soreness: { biceps: 5, brachialis: 5 } }] },
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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
  await page.waitForSelector('.nav'); await launchGone(page);
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

// I9: tabs keep their own scroll position, and re-tapping the current tab glides back to the top.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'I9 tab scroll';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);

  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const target = Math.max(40, Math.min(300, maxScroll));
  await page.evaluate(y => window.scrollTo(0, y), target);
  await page.waitForTimeout(50);
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(200);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click();
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const restored = await page.evaluate(() => window.scrollY);
  if (Math.abs(restored - target) > 4) errors.push(`${tag}: expected scrollY ~${target} back on Train, got ${restored}`);

  // Re-tapping the tab already showing glides to the top (reduced motion: instant).
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click();
  const reachedTop = await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 800 }).then(() => true).catch(() => false);
  if (!reachedTop) errors.push(`${tag}: re-tapping the current tab did not reach scrollY 0 within 800ms`);
  await ctx.close();
}

// I10: the segmented thumb glides to the selected option, the raw (thumb-less) .seg keeps its old
// fill, split tabs scroll the active one into view, and a theme change fires a view transition.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'I10 segmented/theme';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);

  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(300);
  await page.locator('.seg button', { hasText: 'Stats' }).click();
  await page.waitForTimeout(450);
  const segCmp = await page.evaluate(() => {
    const seg = document.querySelector('.seg');
    const thumb = seg?.querySelector('.seg-thumb');
    const btn = [...(seg?.querySelectorAll('button[role="tab"]') ?? [])].find(b => b.getAttribute('aria-pressed') === 'true');
    if (!thumb || !btn) return null;
    const t = thumb.getBoundingClientRect(); const b = btn.getBoundingClientRect();
    return { dx: Math.abs(t.x - b.x), dw: Math.abs(t.width - b.width) };
  });
  if (!segCmp) errors.push(`${tag}: expected a .seg-thumb tracking the selected History tab`);
  else if (segCmp.dx > 1 || segCmp.dw > 1) errors.push(`${tag}: thumb rect drifted from the selected button by ${JSON.stringify(segCmp)}`);
  const thumbVsTrack = await page.evaluate((themes) => {
    const seg = document.querySelector('.seg');
    const thumb = seg?.querySelector('.seg-thumb');
    if (!seg || !thumb) return [];
    const before = document.documentElement.getAttribute('data-theme');
    const bad = [];
    for (const t of themes) {
      document.documentElement.setAttribute('data-theme', t);
      if (getComputedStyle(thumb).backgroundColor === getComputedStyle(seg).backgroundColor) bad.push(t);
    }
    if (before) document.documentElement.setAttribute('data-theme', before);
    return bad;
  }, themes);
  if (thumbVsTrack.length) errors.push(`${tag}: thumb background equals track background in ${thumbVsTrack.join(', ')}`);

  // A 3-option control (Body's view switcher): the thumb still tracks index 2.
  await page.locator('nav.nav button', { hasText: 'Body' }).click(); await page.waitForTimeout(300);
  await page.locator('.seg button', { hasText: 'Levels' }).click();
  await page.waitForTimeout(450);
  const segCmp3 = await page.evaluate(() => {
    const seg = document.querySelector('.seg');
    const thumb = seg?.querySelector('.seg-thumb');
    const btn = [...(seg?.querySelectorAll('button[role="tab"]') ?? [])].find(b => b.getAttribute('aria-pressed') === 'true');
    if (!thumb || !btn) return null;
    const t = thumb.getBoundingClientRect(); const b = btn.getBoundingClientRect();
    return { dx: Math.abs(t.x - b.x), dw: Math.abs(t.width - b.width) };
  });
  if (!segCmp3) errors.push(`${tag}: expected a .seg-thumb on the 3-option Body switcher`);
  else if (segCmp3.dx > 1 || segCmp3.dw > 1) errors.push(`${tag}: 3-option thumb rect drifted by ${JSON.stringify(segCmp3)}`);

  // Split tabs: the active one scrolls into the strip's visible area.
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  const tabCount = await page.locator('.tabs-strip .tab').count();
  if (tabCount >= 2) {
    await page.locator('.tabs-strip .tab').last().click();
    await page.waitForTimeout(500);
    const within = await page.evaluate(() => {
      const strip = document.querySelector('.tabs-strip');
      const tab = strip?.querySelector('.tab[aria-pressed="true"]');
      if (!strip || !tab) return false;
      const sr = strip.getBoundingClientRect(); const tr = tab.getBoundingClientRect();
      return tr.left >= sr.left - 1 && tr.right <= sr.right + 1;
    });
    if (!within) errors.push(`${tag}: expected the selected split tab to have scrolled into view`);
  }

  // Theme: a startViewTransition-backed change (spied), plus the raw Settings .seg and Toggle.
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(150);
  await page.getByRole('button', { name: 'Settings', exact: true }).click(); await page.waitForTimeout(300);
  await page.evaluate(() => { window.__vtCalls = 0; if ('startViewTransition' in document) { const orig = document.startViewTransition.bind(document); document.startViewTransition = cb => { window.__vtCalls++; return orig(cb); }; } });
  const cards = page.locator('dialog[open] .theme-card');
  const cardCount = await cards.count();
  let pickIdx = -1;
  for (let k = 0; k < cardCount; k++) { if ((await cards.nth(k).getAttribute('aria-pressed')) !== 'true') { pickIdx = k; break; } }
  if (pickIdx >= 0) {
    await cards.nth(pickIdx).click();
    await page.waitForTimeout(400);
    const supportsVT = await page.evaluate(() => 'startViewTransition' in document);
    if (supportsVT) { const calls = await page.evaluate(() => window.__vtCalls); if (!calls) errors.push(`${tag}: expected document.startViewTransition to be called on a theme change`); }
  }
  const rawSeg = await page.evaluate(() => {
    const seg = [...document.querySelectorAll('dialog[open] .seg')].find(s => !s.querySelector('.seg-thumb'));
    const pressed = seg?.querySelector('button[aria-pressed="true"]');
    const other = seg ? [...seg.querySelectorAll('button')].find(b => b !== pressed) : null;
    return pressed && other ? { pressedBg: getComputedStyle(pressed).backgroundColor, otherBg: getComputedStyle(other).backgroundColor } : null;
  });
  if (!rawSeg) errors.push(`${tag}: expected a raw (thumb-less) .seg in Settings`);
  else if (rawSeg.pressedBg === rawSeg.otherBg) errors.push(`${tag}: raw .seg's selected option has no visible fill`);
  const toggleDur = await page.evaluate(() => { const t = document.querySelector('dialog[open] .toggle'); return t ? getComputedStyle(t).transitionDuration : null; });
  if (!toggleDur || !toggleDur.includes('0.2s')) errors.push(`${tag}: expected .toggle transition-duration to include 0.2s, got ${toggleDur}`);
  await ctx.close();
}

// I11: hold-to-reorder lifts with depth, auto-scrolls near the edges, settles on drop, and every
// long-press (including the unit-pill's) fires at the same 400ms.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 700 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const tag = 'I11 reorder';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);

  // Unit-pill long-press fires around 400ms everywhere (bounded window, to keep this deterministic).
  const pillBox = await page.locator('.unit-pill').first().boundingBox();
  if (!pillBox) errors.push(`${tag}: expected a .unit-pill on the open live card`);
  else {
    // The flipGroup toast reads "<unit> for all <equipment> here" — filtered so the boot-time
    // "Imported N sessions..." toast (main.tsx) already on screen can't be mistaken for it.
    const flipToast = page.locator('.toast', { hasText: 'for all' });
    await page.mouse.move(pillBox.x + pillBox.width / 2, pillBox.y + pillBox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(300);
    const early = await flipToast.count();
    await page.waitForTimeout(200);
    const late = await flipToast.count();
    await page.mouse.up();
    if (early !== 0) errors.push(`${tag}: unit-pill long-press fired before 300ms`);
    if (late === 0) errors.push(`${tag}: unit-pill long-press had not fired by 500ms`);
  }

  // Collapse the open card so the list is short and even, same as the pulse-block reorder check.
  await page.locator('.reorder-item .exname').first().click(); await page.waitForTimeout(200);
  const box = await page.locator('.reorder-item').nth(0).boundingBox();
  await page.mouse.move(box.x + 40, box.y + 24);
  await page.mouse.down();
  await page.waitForTimeout(450); // past REORDER_HOLD_MS (320ms)
  const liftedScale = await page.evaluate(() => { const el = document.querySelector('.reorder-item.lifted'); return el ? getComputedStyle(el).scale : null; });
  if (liftedScale == null) errors.push(`${tag}: expected .reorder-item.lifted after a >320ms hold`);
  else if (Math.abs(parseFloat(liftedScale) - 1.02) > 0.005) errors.push(`${tag}: expected computed scale 1.02 while lifted, got ${liftedScale}`);

  // Auto-scroll: holding near the bottom nav's top edge for ~1s scrolls the page down.
  const navBox = await page.locator('.nav').boundingBox();
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.move(box.x + 40, navBox.y - 20);
  await page.waitForTimeout(1000);
  const afterScroll = await page.evaluate(() => window.scrollY);
  if (!(afterScroll > beforeScroll)) errors.push(`${tag}: expected auto-scroll to increase scrollY near the bottom edge, ${beforeScroll} -> ${afterScroll}`);

  await page.mouse.move(box.x + 40, box.y + 24);
  await page.waitForTimeout(100);
  await page.mouse.up();
  await page.waitForTimeout(400);
  const stillLifted = await page.locator('.reorder-item.lifted').count();
  if (stillLifted) errors.push(`${tag}: expected .lifted removed once the drop has settled`);
  await settle(page); await page.screenshot({ path: `${OUT}/reorder-settled.png` });
  await ctx.close();
}

// A5: swipe a History session row left to delete it (with Undo); swipe the calendar to page months.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = 'A5 swipe';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(300);

  const countBefore = await page.locator('.swipe-row').count();
  if (!countBefore) errors.push(`${tag}: expected at least one session row`);
  else {
    // (a) A vertical drag on a row scrolls the page; the row never moves horizontally.
    const scrollBefore = await page.evaluate(() => window.scrollY);
    let box = await page.locator('.swipe-row').nth(0).boundingBox();
    await touchDrag(page, box.x + box.width / 2, box.y + 10, box.x + box.width / 2, box.y - 120, 200);
    await page.waitForTimeout(150);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    const cardTx = await page.evaluate(() => { const c = document.querySelector('.swipe-row .card'); const t = getComputedStyle(c).transform; return t === 'none' ? 0 : new DOMMatrixReadOnly(t).e; });
    if (!(scrollAfter > scrollBefore)) errors.push(`${tag}: expected a vertical drag on a row to scroll the page, ${scrollBefore} -> ${scrollAfter}`);
    if (Math.abs(cardTx) > 0.5) errors.push(`${tag}: expected no horizontal move from a vertical drag, got translateX ${cardTx}`);
    await page.evaluate(y => window.scrollTo(0, y), scrollBefore);
    await page.waitForTimeout(150);

    // (b) A drag starting 20px from the right edge does nothing (EDGE_IGNORE_PX is 32).
    box = await page.locator('.swipe-row').nth(0).boundingBox();
    await touchDrag(page, box.x + box.width - 20, box.y + box.height / 2, box.x + box.width - 120, box.y + box.height / 2, 200);
    await page.waitForTimeout(150);
    if (await page.locator('.swipe-row.armed').count()) errors.push(`${tag}: a drag starting 20px from the edge should do nothing`);

    // (c) A short (-20%) drag springs back; nothing is deleted.
    box = await page.locator('.swipe-row').nth(0).boundingBox();
    await touchDrag(page, box.x + box.width * 0.8, box.y + box.height / 2, box.x + box.width * 0.6, box.y + box.height / 2, 250);
    await page.waitForTimeout(500);
    const countAfterShort = await page.locator('.swipe-row').count();
    if (countAfterShort !== countBefore) errors.push(`${tag}: a 20% drag should not delete a session (before ${countBefore}, after ${countAfterShort})`);
    const cardTxBack = await page.evaluate(() => { const c = document.querySelector('.swipe-row .card'); const t = getComputedStyle(c).transform; return t === 'none' ? 0 : new DOMMatrixReadOnly(t).e; });
    if (Math.abs(cardTxBack) > 1) errors.push(`${tag}: expected the row back at translateX 0 after a short drag, got ${cardTxBack}`);

    // (d) A -70% drag deletes with Undo, and Undo restores the same session.
    const firstLabel = await page.locator('.swipe-row').nth(0).locator('b').first().textContent();
    box = await page.locator('.swipe-row').nth(0).boundingBox();
    await touchDrag(page, box.x + box.width * 0.9, box.y + box.height / 2, box.x + box.width * 0.15, box.y + box.height / 2, 300);
    await page.waitForTimeout(400);
    const countAfterDelete = await page.locator('.swipe-row').count();
    if (countAfterDelete !== countBefore - 1) errors.push(`${tag}: expected one fewer session after a 70% swipe, before ${countBefore} after ${countAfterDelete}`);
    const undoBtn = page.locator('.toast button', { hasText: 'Undo' });
    if (!(await visible(page.locator('.toast', { hasText: 'Session deleted' })))) { errors.push(`${tag}: expected a "Session deleted" toast with Undo`); }
    else {
      await undoBtn.click().catch(() => errors.push(`${tag}: could not click the Undo button`));
      await page.waitForTimeout(200);
      const countAfterUndo = await page.locator('.swipe-row').count();
      if (countAfterUndo !== countBefore) errors.push(`${tag}: Undo should restore the deleted session, before ${countBefore} after ${countAfterUndo}`);
      const firstLabelAfterUndo = await page.locator('.swipe-row').nth(0).locator('b').first().textContent();
      if (firstLabelAfterUndo !== firstLabel) errors.push(`${tag}: Undo restored a different session (${firstLabelAfterUndo} vs ${firstLabel})`);
    }
  }

  // Calendar: starts on today's month, the latest one shown. A leftward swipe (finger moves
  // toward the leading edge, paging forward) has nothing past it, so it only rubber-bands.
  const monthLabelSel = '[data-palace="history.calendar"] b';
  const monthLatest = await page.locator(monthLabelSel).textContent();
  let calBox = await page.locator('.cal').boundingBox();
  await touchDrag(page, calBox.x + calBox.width * 0.9, calBox.y + calBox.height / 2, calBox.x + calBox.width * 0.1, calBox.y + calBox.height / 2, 300);
  await page.waitForTimeout(400);
  const monthAfterForward = await page.locator(monthLabelSel).textContent();
  if (monthAfterForward !== monthLatest) errors.push(`${tag}: expected swiping past the current month to do nothing, went from ${monthLatest} to ${monthAfterForward}`);

  // A rightward swipe (paging back) is always allowed and changes the shown month.
  calBox = await page.locator('.cal').boundingBox();
  await touchDrag(page, calBox.x + calBox.width * 0.1, calBox.y + calBox.height / 2, calBox.x + calBox.width * 0.9, calBox.y + calBox.height / 2, 300);
  await page.waitForTimeout(400);
  const monthAfterBack = await page.locator(monthLabelSel).textContent();
  if (monthAfterBack === monthLatest) errors.push(`${tag}: expected the calendar swipe to change the shown month (stayed on ${monthLatest})`);
  await settle(page); await page.screenshot({ path: `${OUT}/a5-history-swipe.png` });
  await ctx.close();
}

// QA12-3: under reduce, the drawing animation is skipped outright (not just faded fast). A
// mutation that always calls beginElement() regardless of `reduce` would still pass every other
// O1 probe (they only check timing), so assert the finished state directly, right after load.
{
  const tag = 'launch reduce draws nothing (QA12-3)';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  // 7.5 (supervisor request, 2026-09-28): under reduce the overlay leaves 100 ms after the app
  // signals ready, so reading it after goto() raced its removal (about 1 run in 70, on main too).
  // Wrap window.__marcLaunchReady and hold the ready call until after `load` and two animation
  // frames: SMIL has started by then (so a beginElement() under reduce shows as a non-zero
  // dashoffset, as main's read after goto() did), and the overlay can't leave before the
  // snapshot, because leaving only starts once the held call runs. Same assertions, no race.
  await page.addInitScript(() => {
    let inner;
    Object.defineProperty(window, '__marcLaunchReady', {
      configurable: true,
      get() { return inner && (() => {
        const path = document.querySelector('#launch svg path');
        const dot = document.getElementById('launch-dot');
        const snap = () => {
          window.__qa123Snapshot = {
            dashoffset: path ? getComputedStyle(path).strokeDashoffset : null,
            cx: dot ? dot.getAttribute('cx') : null,
            cy: dot ? dot.getAttribute('cy') : null,
          };
          inner();
        };
        const go = () => requestAnimationFrame(() => requestAnimationFrame(snap));
        if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
      }); },
      set(fn) { inner = fn; },
    });
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForFunction(() => typeof window.__marcLaunchT0 === 'number');
  await page.waitForFunction(() => window.__qa123Snapshot !== undefined, null, { timeout: 5000 }).catch(() => {});
  const state = await page.evaluate(() => window.__qa123Snapshot ?? { dashoffset: 'no ready signal', cx: null, cy: null });
  if (state.dashoffset !== '0px' && state.dashoffset !== '0') errors.push(`${tag}: expected the path's strokeDashoffset to be 0 right after load, got ${state.dashoffset}`);
  if (state.cx !== '30' || state.cy !== '50') errors.push(`${tag}: expected #launch-dot at cx=30 cy=50 right after load, got cx=${state.cx} cy=${state.cy}`);
  await ctx.close();
}

// O1: launch overlay "Bar path" timing, under full motion, measured from window.__marcLaunchT0
// (set by the inline script in index.html at its very first line).
{
  const elapsedAtLeast = (page, ms) => page.waitForFunction(target => performance.now() - window.__marcLaunchT0 >= target, ms, { timeout: 8000 });
  const tag = 'launch (O1)';

  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForFunction(() => typeof window.__marcLaunchT0 === 'number');

  if ((await page.locator('#launch svg path').count()) === 0) errors.push(`${tag}: expected #launch svg path to exist`);

  await elapsedAtLeast(page, 250);
  const offAt250 = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#launch svg path')).strokeDashoffset));
  if (!(offAt250 > 46 && offAt250 < 100)) errors.push(`${tag}: at 250ms strokeDashoffset should be strictly between 46 and 100, got ${offAt250}`);

  await elapsedAtLeast(page, 1400);
  const offAt1400 = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#launch svg path')).strokeDashoffset));
  if (!(offAt1400 <= 1)) errors.push(`${tag}: at 1400ms strokeDashoffset should be <=1, got ${offAt1400}`);

  await elapsedAtLeast(page, 2400);
  if (await page.evaluate(() => !!document.getElementById('launch'))) errors.push(`${tag}: expected #launch to be gone by 2400ms`);
  await ctx.close();
}

// O1: a tap skips the overlay.
{
  const elapsedAtLeast = (page, ms) => page.waitForFunction(target => performance.now() - window.__marcLaunchT0 >= target, ms, { timeout: 8000 });
  const tag = 'launch skip (O1)';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  // A complete profile so the onboarding sheet's native <dialog> (top layer, above any z-index)
  // can't sit over #launch and steal the click.
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForFunction(() => typeof window.__marcLaunchT0 === 'number');
  await elapsedAtLeast(page, 300);
  await page.locator('#launch').click({ force: true }).catch(() => {});
  await elapsedAtLeast(page, 700);
  if (await page.evaluate(() => !!document.getElementById('launch'))) errors.push(`${tag}: a click at 300ms should have removed #launch by 700ms`);
  await ctx.close();
}

// QA12-1: a real first install (no seeded profile at all) shows OnboardingSheet, whose native
// <dialog> paints in the browser's top layer above any z-index including #launch's. Before the
// fix, the dialog opened at 0ms and swallowed the tap meant to skip the launch overlay. Keeps
// the existing seeded "launch skip (O1)" probe above; this is the unseeded case next to it.
{
  const elapsedAtLeast = (page, ms) => page.waitForFunction(target => performance.now() - window.__marcLaunchT0 >= target, ms, { timeout: 8000 });
  const tag = 'launch skip, first run (QA12-1)';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForFunction(() => typeof window.__marcLaunchT0 === 'number');
  await elapsedAtLeast(page, 300);
  const cx = 195, cy = 422; // viewport centre (390x844)
  const hit = await page.evaluate(([x, y]) => {
    const el = document.elementFromPoint(x, y);
    return { inLaunch: !!el?.closest('#launch'), inDialog: !!el?.closest('dialog[open]') };
  }, [cx, cy]);
  if (!hit.inLaunch || hit.inDialog) errors.push(`${tag}: at 300ms the centre point should hit #launch, not a dialog: ${JSON.stringify(hit)}`);
  await page.mouse.click(cx, cy);
  await elapsedAtLeast(page, 600);
  if (await page.evaluate(() => !!document.getElementById('launch'))) errors.push(`${tag}: a real mouse click at 300ms should have removed #launch by 600ms`);
  if (!(await visible(page.locator('dialog[open]')))) errors.push(`${tag}: expected the onboarding sheet to open once #launch is gone`);
  await ctx.close();
}

// O2: Muscle panel — recovery timeline (real dates), facts, actions, Logged/Try next tabs.
{
  // Computed from the real library, not hard-coded, so this stays correct if the library changes.
  const O2_GLUTES_DIRECT = JSON.parse(readFileSync(join(ROOT, 'src/data/exercises.json'), 'utf8')).filter(e => e.primary?.includes('glutes')).length;
  const O2_PINNED = new Date(); O2_PINNED.setHours(12, 0, 0, 0);
  const o2Day = daysAgo => { const d = new Date(O2_PINNED.getTime() - daysAgo * 86_400_000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const o2Session = (id, exerciseId, name, daysAgo, kg) => {
    const at = new Date(`${o2Day(daysAgo)}T09:00:00`).toISOString();
    return {
      id, splitId: 'sp1', splitName: 'Custom', day: o2Day(daysAgo), startedAt: at, endedAt: at, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId, name, sets: Array.from({ length: 3 }, () => ({ kg, reps: 8, effort: 'ideal' })) }],
      logging: { mode: 'live', trainedAt: at, trainedEndAt: at, loggedAt: at, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] },
    };
  };
  // Leg Press (2 days ago) + an older Bulgarian Split Squat: both primary-glutes, so Glutes shows
  // "Logged · 2" with the rest of the library's direct-glutes exercises (minus these 2, capped at
  // 10, see O2_GLUTES_DIRECT above) in Try next.
  const o2Sessions = [o2Session('o2-1', 'lib_leg_press', 'Leg Press', 2, 100), o2Session('o2-2', 'lib_bulgarian_split_squat', 'Bulgarian Split Squat', 10, 20)];
  const o2StateJson = (sessions, active = null) => JSON.stringify({
    version: 1, createdAt: new Date().toISOString(), profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
    goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
    sessions, active, customExercises: [],
    preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
    body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
    onboarding: { dismissedAt: [], completedAt: new Date().toISOString() }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
  });

  const openMuscle = async (page, stateJson, theme, label) => {
    await page.addInitScript(([json, t]) => { localStorage.setItem('marc.state.v1', json); localStorage.setItem('marc.theme', t); }, [stateJson, theme]);
    await page.clock.install({ time: O2_PINNED.getTime() });
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav'); await launchGone(page);
    await page.waitForTimeout(250);
    if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(150); }
    await page.locator('nav.nav button', { hasText: 'Body' }).click(); await page.waitForTimeout(300);
    // The "Levels" list shows every muscle regardless of recovery state, so it opens either the
    // seeded (Glutes) or never-trained (Biceps) case the same reliable way.
    await page.locator('.seg button', { hasText: 'Levels' }).click(); await page.waitForTimeout(200);
    await page.locator('.list-row', { hasText: label }).first().click(); await page.waitForTimeout(300);
  };

  for (const width of [360, 390]) {
    for (const theme of ['paper', 'silent-black']) {
      const tag = `muscle panel ${theme} ${width}`;
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
      page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
      await openMuscle(page, o2StateJson(o2Sessions), theme, 'Glutes');

      if (!(await visible(page.locator('dialog.sheet[open]')))) errors.push(`${tag}: expected the muscle panel to open`);
      const pctText = await page.locator('.mtl-pct').textContent();
      if (!/^\d+%$/.test((pctText ?? '').trim())) errors.push(`${tag}: expected a "N%" header, got "${pctText}"`);
      const pillText = (await page.locator('.mtl-head .chip').textContent())?.trim();
      if (!['Recovering', 'Ready', 'Held back by soreness'].includes(pillText ?? '')) errors.push(`${tag}: unexpected pill text "${pillText}"`);
      const tlVals = await page.locator('.mtl-tl-val').allTextContents();
      if (tlVals.length !== 3) errors.push(`${tag}: expected 3 timeline labels (Trained/Ready/Full), got ${tlVals.length}`);
      if (tlVals.some(t => t.includes('d to'))) errors.push(`${tag}: a timeline label still reads the old "d to" range: ${JSON.stringify(tlVals)}`);

      // Every button in the actions row (Mark as fresh, Ask Escobar) must fit its own label, and
      // when both show they must be the same height — the labelled "Ask Escobar" button used to
      // inherit the icon-only .esc-ask's 32px width/height and clip its text.
      const actionBtns = await page.evaluate(() => [...document.querySelectorAll('.mtl-actions button')].map(b => ({ text: b.textContent?.trim(), scrollWidth: b.scrollWidth, clientWidth: b.clientWidth, height: b.getBoundingClientRect().height })));
      const clippedBtns = actionBtns.filter(b => b.scrollWidth > b.clientWidth + 1);
      if (clippedBtns.length) errors.push(`${tag}: clipped action button(s): ${JSON.stringify(clippedBtns)}`);
      if (actionBtns.length === 2 && Math.abs(actionBtns[0].height - actionBtns[1].height) > 1) errors.push(`${tag}: action buttons have mismatched heights: ${JSON.stringify(actionBtns)}`);

      const sheetText = await page.locator('dialog.sheet[open]').innerText();
      for (const bad of ['at a glance', '1 sessions', 'Low confidence']) if (sheetText.includes(bad)) errors.push(`${tag}: sheet still contains "${bad}"`);

      const segLabels = await page.locator('[data-palace="body.muscle-tabs"] .seg button').allTextContents();
      if (!segLabels.some(t => t.trim() === 'Logged · 2')) errors.push(`${tag}: expected a "Logged · 2" tab, got ${JSON.stringify(segLabels)}`);
      const expectTryNext = `Try next · ${Math.min(O2_GLUTES_DIRECT - 2, 10)}`;
      if (!segLabels.some(t => t.trim() === expectTryNext)) errors.push(`${tag}: expected a "${expectTryNext}" tab, got ${JSON.stringify(segLabels)}`);

      const loggedNames = await page.locator('.mtl-tab-list .list-row .small').allTextContents();
      await page.locator('[data-palace="body.muscle-tabs"] .seg button', { hasText: 'Try next' }).click(); await page.waitForTimeout(200);
      const tryNextNames = await page.locator('.mtl-tab-list .list-row .small').allTextContents();
      const overlap = loggedNames.filter(n => tryNextNames.includes(n));
      if (overlap.length) errors.push(`${tag}: Logged and Try next share an exercise: ${overlap.join(', ')}`);

      const clipped = await page.evaluate(() => [...document.querySelectorAll('.mtl-tl-val')].filter(n => n.scrollWidth > n.clientWidth + 1).map(n => n.textContent));
      if (clipped.length) errors.push(`${tag}: clipped timeline label(s): ${clipped.join(', ')}`);
      if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) errors.push(`${tag}: horizontal scroll with the muscle panel open`);

      await settle(page);
      await page.screenshot({ path: `${OUT}/${theme}-muscle-panel-${width}.png` });
      await ctx.close();
    }
  }

  // Live workout: "Add" on a Try next row adds it to state.active.entries and the row flips to "In workout".
  {
    const tag = 'muscle panel live Add';
    const active = { id: 'act1', splitId: 'sp1', startedAt: new Date().toISOString(), pausedMs: 0, entries: [{ id: 'en1', exerciseId: 'lib_leg_press', name: 'Leg Press', sets: [{ kg: 100, reps: 8 }], done: false, skipped: false }] };
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
    await openMuscle(page, o2StateJson(o2Sessions, active), 'silent-black', 'Glutes');
    await page.locator('[data-palace="body.muscle-tabs"] .seg button', { hasText: 'Try next' }).click(); await page.waitForTimeout(200);
    const hipThrustRow = page.locator('.list .list-row', { hasText: 'Hip Thrust' });
    if (!(await hipThrustRow.count())) {
      errors.push(`${tag}: expected a "Hip Thrust" row in Try next`);
    } else {
      await hipThrustRow.getByRole('button', { name: 'Add' }).click();
      await page.waitForTimeout(300);
      if (!(await visible(page.locator('.toast', { hasText: "Added Hip Thrust to today's workout" })))) errors.push(`${tag}: expected the "Added Hip Thrust..." toast`);
      if (!(await hipThrustRow.getByText('In workout').isVisible().catch(() => false))) errors.push(`${tag}: the Hip Thrust row should read "In workout" after Add`);
    }
    await ctx.close();
  }

  // Never-trained muscle: "Not trained yet", no timeline, Try next selected by default.
  {
    const tag = 'muscle panel never trained';
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
    await openMuscle(page, o2StateJson(o2Sessions), 'silent-black', 'Biceps');
    const pillText = (await page.locator('.mtl-head .chip').textContent())?.trim();
    if (pillText !== 'Not trained yet') errors.push(`${tag}: expected pill "Not trained yet", got "${pillText}"`);
    if ((await page.locator('.mtl-pct').textContent())?.trim() !== '—') errors.push(`${tag}: expected "—" for an untrained muscle's percentage`);
    if (await page.locator('.mtl-timeline').count()) errors.push(`${tag}: a never-trained muscle should not show the timeline`);
    const selected = await page.locator('[data-palace="body.muscle-tabs"] .seg button[aria-selected="true"]').textContent();
    if (!selected?.startsWith('Try next')) errors.push(`${tag}: expected "Try next" selected by default, got "${selected}"`);
    await ctx.close();
  }
}

// O1: the theme colour map, and the crash hook clearing the overlay.
{
  const tag = 'launch theme+crash (O1)';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(() => localStorage.setItem('marc.theme', 'paper'));
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('#launch');
  const bg = await page.evaluate(() => getComputedStyle(document.getElementById('launch')).backgroundColor);
  if (bg !== 'rgb(255, 255, 255)') errors.push(`${tag}: paper theme overlay background should be rgb(255, 255, 255), got ${bg}`);
  await page.evaluate(() => window.__marcCrash('x'));
  if (await page.evaluate(() => !!document.getElementById('launch'))) errors.push(`${tag}: __marcCrash should remove #launch`);
  if (!(await visible(page.getByText('M/ARC could not start')))) errors.push(`${tag}: __marcCrash should show the crash box`);
  await ctx.close();
}

// A4: keepAwake is called on while a workout is live, and off once it ends. The NativeUi plugin
// is mocked here (isNativePlatform forced true) since this gate runs the web build.
{
  const tag = 'keepAwake (A4)';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson]) => {
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
    window.__keepAwakeCalls = [];
    // Capacitor's own web core (bundled in the app) overwrites a plain `window.Capacitor`
    // override, but respects the official CapacitorCustomPlatform escape hatch (see the
    // watch-stub block above) for reporting a non-web platform.
    window.CapacitorCustomPlatform = { name: 'android' };
    window.Capacitor = { isNativePlatform: () => true, Plugins: { NativeUi: {
      haptic: () => Promise.resolve({ played: false }),
      peak: () => Promise.resolve({ played: false }),
      keepAwake: o => { window.__keepAwakeCalls.push(o.on); return Promise.resolve(); },
    } } };
  }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(200);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  const callsAfterStart = await page.evaluate(() => window.__keepAwakeCalls.slice());
  if (!callsAfterStart.includes(true)) errors.push(`${tag}: expected keepAwake(true) once a workout went live, got ${JSON.stringify(callsAfterStart)}`);
  await page.getByRole('button', { name: 'Finish' }).click(); await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Finish and save|Just today/ }).click().catch(() => {}); await page.waitForTimeout(400);
  if (await page.getByRole('heading', { name: 'When did you train?' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Save', exact: true }).click(); await page.waitForTimeout(400); }
  const callsAfterFinish = await page.evaluate(() => window.__keepAwakeCalls.slice());
  if (callsAfterFinish[callsAfterFinish.length - 1] !== false) errors.push(`${tag}: expected keepAwake(false) once the workout finished, got ${JSON.stringify(callsAfterFinish)}`);
  // QA12-2: a one-shot "keepAwake(true) only once per app lifetime" mutation still passed the
  // block above. Start a second workout and prove it comes back on. The finish screen needs an
  // explicit Done tap to leave (gate :126/:182/:460/:514); without it, Train never returns to
  // an idle, startable state.
  await page.getByRole('button', { name: 'Done', exact: true }).click().catch(() => {}); await page.waitForTimeout(300);
  await page.locator('nav.nav button', { hasText: /^(Train|Live)$/ }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
  await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(400);
  const callsAfterSecondStart = await page.evaluate(() => window.__keepAwakeCalls.slice());
  const last2 = callsAfterSecondStart.slice(-2);
  if (last2.length !== 2 || last2[0] !== false || last2[1] !== true) errors.push(`${tag} (QA12-2): expected __keepAwakeCalls to end [..., false, true] after a second workout starts, got ${JSON.stringify(callsAfterSecondStart)}`);
  await ctx.close();
}

// COACH-FB: on Escobar's notes, Helpful and Not now hide the tapped note at once, with the chat
// path's toast and a working Undo; a quick second tap cannot hide the note that slides into the
// same spot; saved feedback keeps one record per (note, day); the raw "Earlier this month" log is
// gone; hidden notes sit behind one quiet row that opens to their titles, each with Show again;
// a hidden note stays hidden after a reload.
{
  const tag = 'COACH-FB';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); }, [JSON.stringify(legacy)]);
  const openNotes = async () => {
    await page.waitForSelector('.nav'); await launchGone(page);
    await page.getByRole('button', { name: 'Later' }).click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(200);
    await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(300);
    await page.locator('[data-palace="coach.insights"]').evaluate(e => e.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(100);
  };
  const titles = () => page.locator('.insight h3').allTextContents();
  const firstBtn = (name) => page.locator('.insight').first().getByRole('button', { name, exact: true });
  const toastText = async () => (await page.locator('.toast span').first().textContent({ timeout: 1000 }).catch(() => '')) ?? '';
  const centre = async (loc) => { const b = await loc.boundingBox(); return b ? [b.x + b.width / 2, b.y + b.height / 2] : null; };
  await page.goto(`http://localhost:${PORT}/`);
  await openNotes();
  const t0 = await titles();
  if (t0.length !== 3) errors.push(`${tag}: expected 3 notes on the legacy fixture, got ${t0.length}`);
  // CFB-G1: Helpful hides the note at once, with the same toast as the chat path.
  await firstBtn('Helpful').tap(); await page.waitForTimeout(200);
  if ((await titles()).includes(t0[0])) errors.push(`${tag}: "${t0[0]}" still shown after Helpful`);
  if (!(await toastText()).includes('Marked helpful')) errors.push(`${tag}: expected the "Marked helpful" toast`);
  // CFB-G2: Undo on that toast brings it back.
  await page.locator('.toast').getByRole('button', { name: 'Undo', exact: true }).tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no Undo on the toast`));
  await page.waitForTimeout(200);
  if (JSON.stringify(await titles()) !== JSON.stringify(t0)) errors.push(`${tag}: Undo did not restore the notes, got: ${(await titles()).join(' | ')}`);
  // CFB-G3: Not now hides the note; a second tap 100 ms later, on the note that slid into its place, is ignored.
  await page.waitForTimeout(600);
  const p1 = await centre(firstBtn('Not now'));
  if (p1) await page.touchscreen.tap(p1[0], p1[1]);
  await page.waitForTimeout(100);
  const p2 = await centre(firstBtn('Not now'));
  if (p2) await page.touchscreen.tap(p2[0], p2[1]);
  await page.waitForTimeout(300);
  const t3 = await titles();
  if (t3.includes(t0[0])) errors.push(`${tag}: "${t0[0]}" still shown after Not now`);
  if (!t3.includes(t0[1])) errors.push(`${tag}: a quick second tap also hid "${t0[1]}"`);
  if (!(await toastText()).includes('Snoozed for 7 days')) errors.push(`${tag}: expected the "Snoozed for 7 days" toast`);
  // CFB-G4: saved data holds one record per (note, day) after Helpful, Undo, Not now on the same note.
  await page.waitForTimeout(400);
  const fb = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1') || '{}').insightFeedback || []);
  const keys = fb.map(f => `${f.id}|${f.day}`);
  if (new Set(keys).size !== keys.length) errors.push(`${tag}: duplicate saved feedback records: ${JSON.stringify(fb)}`);
  // CFB-G5: the raw log is gone.
  if (await page.getByText('Earlier this month').count()) errors.push(`${tag}: the raw "Earlier this month" log is still shown`);
  // CFB-G6: one quiet row that opens to the hidden note's title.
  const row = page.locator('.notes-hidden');
  if (!(await visible(row.getByText('1 note hidden', { exact: true }), 1500))) errors.push(`${tag}: expected a "1 note hidden" row`);
  await row.getByRole('button', { name: 'Show', exact: true }).tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no Show on the hidden row`));
  await page.waitForTimeout(200);
  if (!(await visible(row.getByText(t0[0], { exact: true }), 1500))) errors.push(`${tag}: the hidden list does not name "${t0[0]}"`);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-coach-fb-hidden.png` });
  // CFB-G7: after a reload the note is still hidden and still listed; Show again brings it back and the row goes.
  await page.reload();
  await openNotes();
  if ((await titles()).includes(t0[0])) errors.push(`${tag}: "${t0[0]}" came back after a reload`);
  await row.getByRole('button', { name: 'Show', exact: true }).tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no hidden row after a reload`));
  await page.waitForTimeout(200);
  await row.getByRole('button', { name: 'Show again', exact: true }).first().tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no Show again`));
  await page.waitForTimeout(200);
  if (!(await titles()).includes(t0[0])) errors.push(`${tag}: Show again did not bring back "${t0[0]}"`);
  if (await row.count()) errors.push(`${tag}: the hidden row is still shown with nothing hidden`);
  await ctx.close();
}

// BUG-8: a saved height/weight must not read "Not set" just because it has no profileHistory
// entry, sex must not look chosen when it was never saved, and the Escobar tab's Profile row
// must name what's missing (and read complete once it is).
{
  const tag = 'BUG-8';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    localStorage.setItem('marc.theme', 'silent-black');
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', birthYear: 1998, heightCm: 164, bodyWeightKg: 70 },
      goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [{ day: '2026-09-20', kg: 70 }], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [], insightFeedback: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.waitForTimeout(250);
  await page.locator('.list-row', { hasText: 'Weight, height, birth year' }).getByRole('button', { name: 'Open', exact: true }).click();
  await page.waitForTimeout(250);
  const fieldHints = (label) => page.evaluate((lbl) => {
    const l = [...document.querySelectorAll('dialog[open] label.stack-sm')].find(el => el.querySelector('.small.muted')?.textContent === lbl);
    return l ? [...l.querySelectorAll('.hint')].map(h => h.textContent) : null;
  }, label);
  // BUG-8 A: sex never looks chosen when it was never saved.
  const sexPressed = await page.evaluate(() => [...document.querySelectorAll('dialog[open] .seg button')].map(b => b.getAttribute('aria-pressed')));
  if (sexPressed.some(p => p === 'true')) errors.push(`${tag}: a Sex option shows pressed although sex was never saved (${JSON.stringify(sexPressed)})`);
  // BUG-8 items 1-2: height was saved (no profileHistory entry) and must read "Saved", not "Not set".
  const heightHints = await fieldHints('Height (cm)');
  if (!heightHints || heightHints[0] !== 'Saved') errors.push(`${tag}: expected the Height hint to read "Saved", got ${JSON.stringify(heightHints)}`);
  // Weight was saved and logged (no profileHistory entry either) and must read "Saved", not "Not set".
  const weightHint = await page.locator('dialog[open] .hint', { hasText: 'weigh-in' }).first().textContent();
  if (!weightHint?.startsWith('Saved')) errors.push(`${tag}: expected the Body weight hint to start with "Saved", got "${weightHint}"`);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-bug-8-profile.png` });
  // A real tap on Male (the first Sex option): it saves, and the hint becomes "Updated …".
  await page.locator('dialog[open] .seg button').first().tap();
  await page.waitForTimeout(200);
  const sexHints = await fieldHints('Sex');
  if (!sexHints || !sexHints[0]?.startsWith('Updated')) errors.push(`${tag}: expected the Sex hint to read "Updated …" after tapping Male, got ${JSON.stringify(sexHints)}`);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.waitForTimeout(200);
  // BUG-8 item 3: the Escobar tab's Profile row now reads complete.
  await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(300);
  await page.locator('[data-palace="coach.sees"]').evaluate(e => e.scrollIntoView({ block: 'center' }));
  if (!(await visible(page.getByText('All 4 details', { exact: true }), 1500))) errors.push(`${tag}: expected the Escobar tab's Profile row to read "All 4 details" once sex is set`);
  await ctx.close();
}

// BUG-9: a month swipe's exit animation fills forwards and was never cancelled, so once the next
// month's plain enter animation finished, the old exit's fill re-applied and left the grid at
// opacity 0, translated one width sideways, which widened the whole page and stretched the fixed
// bottom bar. On purpose, this context carries no reducedMotion — under reduce the animation
// branch never runs at all, which is exactly how the existing A5 gate block missed this.
{
  const tag = 'BUG-9';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, [JSON.stringify(legacy)]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.getByRole('button', { name: 'Later' }).click().catch(() => {});
  await page.waitForTimeout(250);
  await page.locator('nav.nav button', { hasText: 'History' }).click(); await page.waitForTimeout(300);

  const innerWidth = await page.evaluate(() => window.innerWidth);
  const monthLabelSel = '[data-palace="history.calendar"] b';
  const monthLatest = await page.locator(monthLabelSel).textContent();

  // A: while the touch is still held (no touchEnd yet), a 60%-of-width rightward drag must not
  // have widened the page.
  let calBox = await page.locator('.cal').boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const ax0 = calBox.x + calBox.width * 0.1, ay0 = calBox.y + calBox.height / 2;
  const ax1 = calBox.x + calBox.width * 0.7;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: ax0, y: ay0 }] });
  for (let i = 1; i <= 6; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: ax0 + (ax1 - ax0) * (i / 6), y: ay0 }] });
    await new Promise(r => setTimeout(r, 30));
  }
  const midDragWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  if (midDragWidth > innerWidth) errors.push(`${tag} A: mid-drag scrollWidth ${midDragWidth} > innerWidth ${innerWidth}`);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach().catch(() => {});

  // B: after the release, a second swipe back, and one swipe forward — each time, wait 1500ms,
  // then the grid must be visible in place, with no animation left, and the page must not have
  // widened, keeping every nav.nav button on screen.
  const settled = async (label) => {
    await page.waitForTimeout(1500);
    const cal = await page.evaluate(() => { const el = document.querySelector('.cal'); const cs = getComputedStyle(el); return { opacity: cs.opacity, transform: cs.transform, anims: el.getAnimations().length }; });
    if (cal.opacity !== '1') errors.push(`${tag} B (${label}): expected .cal opacity 1, got ${cal.opacity}`);
    if (cal.transform !== 'none') errors.push(`${tag} B (${label}): expected .cal transform none, got ${cal.transform}`);
    if (cal.anims !== 0) errors.push(`${tag} B (${label}): expected .cal to have 0 animations left, got ${cal.anims}`);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    if (scrollWidth > innerWidth) errors.push(`${tag} B (${label}): scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`);
    const bad = await page.evaluate(w => [...document.querySelectorAll('nav.nav button')].map(b => b.getBoundingClientRect()).filter(r => r.left < 0 || r.right > w).length, innerWidth);
    if (bad) errors.push(`${tag} B (${label}): ${bad} nav.nav button rect(s) fall outside [0, ${innerWidth}]`);
    return page.locator(monthLabelSel).textContent();
  };

  const monthAfterFirst = await settled('after the release');
  if (monthAfterFirst === monthLatest) errors.push(`${tag} B: expected the month to change after the swipe back, stayed on ${monthLatest}`);

  calBox = await page.locator('.cal').boundingBox();
  await touchDrag(page, calBox.x + calBox.width * 0.1, calBox.y + calBox.height / 2, calBox.x + calBox.width * 0.9, calBox.y + calBox.height / 2, 300);
  const monthAfterSecond = await settled('after a second swipe back');
  if (monthAfterSecond === monthAfterFirst) errors.push(`${tag} B: expected a second swipe back to change the month again, stayed on ${monthAfterFirst}`);

  calBox = await page.locator('.cal').boundingBox();
  await touchDrag(page, calBox.x + calBox.width * 0.9, calBox.y + calBox.height / 2, calBox.x + calBox.width * 0.1, calBox.y + calBox.height / 2, 300);
  const monthAfterForward = await settled('after one forward swipe');
  if (monthAfterForward !== monthAfterFirst) errors.push(`${tag} B: expected the forward swipe to return to the previous month (${monthAfterFirst}), got ${monthAfterForward}`);

  await settle(page); await page.screenshot({ path: `${OUT}/bug-9-calendar.png` });

  // C: full-motion row swipe-delete, then Undo — the restored row must render in place, not
  // stuck off to the side or invisible, and the page must still fit the screen.
  const countBefore = await page.locator('.swipe-row').count();
  if (!countBefore) errors.push(`${tag} C: expected at least one session row`);
  else {
    const box = await page.locator('.swipe-row').nth(0).boundingBox();
    await touchDrag(page, box.x + box.width * 0.9, box.y + box.height / 2, box.x + box.width * 0.15, box.y + box.height / 2, 300);
    await page.waitForTimeout(400);
    const undoBtn = page.locator('.toast button', { hasText: 'Undo' });
    if (!(await visible(page.locator('.toast', { hasText: 'Session deleted' })))) errors.push(`${tag} C: expected a "Session deleted" toast with Undo`);
    else {
      await undoBtn.click().catch(() => errors.push(`${tag} C: could not click Undo`));
      await page.waitForTimeout(1500);
      const restored = await page.evaluate(() => { const c = document.querySelector('.swipe-row .card'); if (!c) return null; const cs = getComputedStyle(c); return { opacity: cs.opacity, transform: cs.transform }; });
      if (!restored) errors.push(`${tag} C: expected the restored row's .card to be present`);
      else {
        if (restored.opacity !== '1') errors.push(`${tag} C: expected the restored row's .card opacity 1, got ${restored.opacity}`);
        if (restored.transform !== 'none') errors.push(`${tag} C: expected the restored row's .card transform none, got ${restored.transform}`);
      }
      const scrollWidthAfterUndo = await page.evaluate(() => document.documentElement.scrollWidth);
      if (scrollWidthAfterUndo > innerWidth) errors.push(`${tag} C: scrollWidth ${scrollWidthAfterUndo} > innerWidth ${innerWidth} after Undo`);
    }
  }
  await ctx.close();
}

// BUG-19 (DATES-F1): Finish long after the last set ends the session 5 min after that set, and the
// finish sheet says so and shows that duration. Finishing right after the last set adds nothing.
{
  const tag = 'BUG-19 finish end time';
  for (const { label, lastAgoMin, expectNote, expectDur } of [
    { label: 'forgotten', lastAgoMin: 190, expectNote: true, expectDur: '15:00' },
    { label: 'on time', lastAgoMin: 1, expectNote: false, expectDur: null },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag} (${label}): ${e.message}`));
    await page.addInitScript(lastAgo => {
      const nowMs = Date.now(); const now = new Date(nowMs).toISOString();
      const ago = min => new Date(nowMs - min * 60_000).toISOString();
      // Started 10 min before the last set; three live sets at 0, 5 and 10 min of training.
      const set = (id, min) => ({ id, kg: 80, reps: 8, at: ago(min), fidelity: 'live', status: 'committed' });
      localStorage.setItem('marc.theme', 'silent-black');
      localStorage.setItem('marc.state.v1', JSON.stringify({
        version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
        goal: 'lean', splits: [{ id: 'sp1', name: 'Upper', color: '#6aa9ff', focus: [], createdAt: now, exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] }],
        schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
        sessions: [],
        active: { id: 's_bug19', splitId: 'sp1', startedAt: ago(lastAgo + 10), pausedMs: 0, gymId: 'gym_default',
          entries: [{ id: 'e1', exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', done: false, skipped: false, sets: [set('b1', lastAgo + 10), set('b2', lastAgo + 5), set('b3', lastAgo)] }] },
        customExercises: [],
        preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: false, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
        body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
        onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
      }));
    }, lastAgoMin);
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav');
    await launchGone(page);
    // With a session in progress the Train tab reads "Live".
    await page.locator('nav.nav button', { hasText: 'Live' }).click(); await page.waitForTimeout(250);
    const finish = page.getByRole('button', { name: 'Finish', exact: true });
    // Nothing (the Escobar dock included, BUG-22) may sit on top of the button's centre.
    const onTop = loc => loc.evaluate(el => { const r = el.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!hit && el.contains(hit); }).catch(() => false);
    if (!(await onTop(finish))) errors.push(`${tag} (${label}): something covers the live session's Finish button`);
    await finish.click({ timeout: 5000 }).catch(() => errors.push(`${tag} (${label}): no Finish button on the live session`));
    await page.waitForTimeout(300);
    const note = page.locator('[data-finish-trimmed]');
    const shown = await visible(note);
    if (shown !== expectNote) errors.push(`${tag} (${label}): expected the ended-at note ${expectNote ? 'shown' : 'hidden'}, it was ${shown ? 'shown' : 'hidden'}`);
    const dur = (await page.locator('[data-finish-duration]').textContent().catch(() => null))?.trim();
    if (expectDur && dur !== expectDur) errors.push(`${tag} (${label}): expected the finish sheet to show ${expectDur}, got ${dur}`);
    if (!expectDur && (!dur || dur.split(':').length > 2)) errors.push(`${tag} (${label}): expected the running duration under an hour, got ${dur}`);
    if (expectNote) { await settle(page); await page.screenshot({ path: `${OUT}/bug-19-finish-trimmed.png` }); }
    const save = page.getByRole('button', { name: /Finish and save|Just today/ }).first();
    await save.scrollIntoViewIfNeeded().catch(() => {});
    if (!(await onTop(save))) errors.push(`${tag} (${label}): something covers "Finish and save"`);
    await save.click().catch(() => errors.push(`${tag} (${label}): no Finish and save`));
    await page.waitForTimeout(400);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).sessions.find(x => x.id === 's_bug19'));
    if (!saved) errors.push(`${tag} (${label}): the session was not saved`);
    else if (expectNote && saved.durationSec !== 15 * 60) errors.push(`${tag} (${label}): expected 900 s saved, got ${saved.durationSec}`);
    else if (!expectNote && Math.abs(Date.parse(saved.endedAt) - Date.now()) > 60_000) errors.push(`${tag} (${label}): expected the session to end at Finish, got ${saved.endedAt}`);
    await ctx.close();
  }
}

// 7.5: anonymous error reports. The Settings row starts off, the one-time ask appears once (after
// a finished workout, never during a live one) as a plain banner (never a blocking modal — it
// must not steal a tap meant for anything else), Yes/No are remembered across a reload, and no
// request reaches the errors endpoint while consent is off.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = '7.5';
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  const errorRequests = [];
  page.on('request', r => { if (r.url().includes('/errors')) errorRequests.push(r.url()); });
  await page.addInitScript(legacyJson => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); }, JSON.stringify(legacy));
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.waitForTimeout(300);

  const ask = page.locator('[data-palace="errors.ask"]');
  // Not yet: this very boot is the one that just imported the history, so it never interrupts it.
  if (await visible(ask)) errors.push(`${tag}: the ask must not show on the same boot that just imported its history`);

  // The next ordinary open (bootSource "saved") is when it appears.
  await page.reload(); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Later' }).click({ timeout: 1000 }).catch(() => {}); // the onboarding sheet takes priority if it's still showing
  if (!(await visible(ask))) errors.push(`${tag}: expected the error-reports ask on the next open after a finished workout`);
  else {
    await settle(page); await page.screenshot({ path: `${OUT}/7-5-ask-banner.png` });
    // A banner, not a modal: it must never block the nav underneath it.
    await page.locator('nav.nav button', { hasText: 'Train' }).click({ timeout: 3000 }).catch(() => errors.push(`${tag}: the ask blocked a tap on the nav underneath it`));
    await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(150);
    await ask.getByRole('button', { name: 'No thanks' }).click().catch(() => errors.push(`${tag}: no "No thanks" button on the ask`));
    await page.waitForTimeout(200);
    if (await visible(ask)) errors.push(`${tag}: the ask should close after answering`);
  }

  await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(300);
  const row = page.locator('[data-palace="settings.error-reports"]');
  await row.scrollIntoViewIfNeeded().catch(() => {});
  if (!(await visible(row))) errors.push(`${tag}: expected the "Send anonymous error reports" row in Settings`);
  const toggle = page.getByRole('switch', { name: 'Send anonymous error reports' });
  if ((await toggle.getAttribute('aria-checked')) !== 'false') errors.push(`${tag}: expected the error-reports toggle off after answering No`);
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);

  await page.reload(); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await visible(page.locator('[data-palace="errors.ask"]'))) errors.push(`${tag}: the ask reappeared after being answered`);
  if (errorRequests.length) errors.push(`${tag}: ${errorRequests.length} request(s) reached /errors while consent was off`);

  // Never during a live workout, even with a finished one already in history and the ask unanswered.
  const page2 = await ctx.newPage();
  page2.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page2.addInitScript(() => {
    const st = JSON.parse(localStorage.getItem('marc.state.v1'));
    st.preferences.errorReportsAsked = false;
    st.preferences.errorReports = false;
    st.active = { splitId: st.splits[0]?.id ?? 's1', startedAt: new Date().toISOString(), pausedMs: 0, entries: [] };
    localStorage.setItem('marc.state.v1', JSON.stringify(st));
  });
  await page2.goto(`http://localhost:${PORT}/`); await page2.waitForSelector('.nav'); await launchGone(page2); await page2.waitForTimeout(300);
  if (await visible(page2.locator('[data-palace="errors.ask"]'))) errors.push(`${tag}: the ask must never show during a live workout`);
  await ctx.close();
}

// 7.5-toggle: the Settings consent switch in Silent Black and Paper. It starts off, its label and
// hint read at 4.5:1 or better, On queues an error locally (the wiring works) yet no request
// ever reaches /errors (an automated browser never sends), and Off clears the queue and sticks
// across a reload.
for (const theme of ['silent-black', 'paper']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `7.5-toggle ${theme}`;
  page.on('pageerror', e => { if (!e.message.includes('gate-7.5-probe')) errors.push(`${tag}: ${e.message}`); });
  const errorRequests = [];
  page.on('request', r => { if (/\/errors(\?|$)/.test(new URL(r.url()).pathname)) errorRequests.push(r.url()); });
  await page.addInitScript(([legacyJson, t]) => {
    localStorage.setItem('marc.theme', t);
    if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson);
  }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }

  const openSettings = async () => {
    await page.locator('[data-palace="today.settings"]').click(); await page.waitForTimeout(300);
    await page.locator('[data-palace="settings.error-reports"]').scrollIntoViewIfNeeded().catch(() => {});
  };
  const toggle = page.getByRole('switch', { name: 'Send anonymous error reports' });
  const queueLen = () => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('marc.errors.queue') ?? '{"reports":[]}').reports.length; } catch { return -1; } });

  await openSettings();
  if (!(await visible(toggle))) errors.push(`${tag}: expected the "Send anonymous error reports" switch in Settings`);
  else {
    if ((await toggle.getAttribute('aria-checked')) !== 'false') errors.push(`${tag}: the switch must start off`);
    for (const [sel, label] of [['[data-palace="settings.error-reports"]', 'switch label'], ['[data-palace="settings.error-reports"] + .hint', 'switch hint']]) {
      const c = await page.evaluate((q) => {
        const el = document.querySelector(q);
        if (!el) return null;
        const parse = str => {
          let m = str.match(/rgba?\(([^)]+)\)/);
          if (m) { const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
          m = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
          if (m) return { r: Number(m[1]) * 255, g: Number(m[2]) * 255, b: Number(m[3]) * 255, a: m[4] !== undefined ? Number(m[4]) : 1 };
          return null;
        };
        const fg = parse(getComputedStyle(el).color);
        if (!fg) return null;
        let node = el, under = { r: 255, g: 255, b: 255 };
        while (node) { const bg = parse(getComputedStyle(node).backgroundColor); if (bg && bg.a >= 0.999) { under = bg; break; } node = node.parentElement; }
        const lin = v => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
        const rl = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
        const l1 = rl(fg) + 0.05, l2 = rl(under) + 0.05;
        return l1 > l2 ? l1 / l2 : l2 / l1;
      }, sel);
      if (c == null) errors.push(`${tag}: could not measure contrast for the ${label}`);
      else if (c < 4.5) errors.push(`${tag}: ${label} contrast ${c.toFixed(2)} < 4.5`);
    }
    await settle(page); await page.locator('.list-row:has([data-palace="settings.error-reports"])').screenshot({ path: `${OUT}/${theme}-7-5-toggle-off.png` }).catch(() => {});

    await toggle.click(); await page.waitForTimeout(200);
    if ((await toggle.getAttribute('aria-checked')) !== 'true') errors.push(`${tag}: the switch did not turn on`);
    await settle(page); await page.locator('.list-row:has([data-palace="settings.error-reports"])').screenshot({ path: `${OUT}/${theme}-7-5-toggle-on.png` }).catch(() => {});
    await page.evaluate(() => { void Promise.reject(new Error('gate-7.5-probe')); });
    await page.waitForTimeout(600);
    if ((await queueLen()) < 1) errors.push(`${tag}: with consent on, an unhandled rejection should be queued locally`);

    await toggle.click(); await page.waitForTimeout(200);
    if ((await toggle.getAttribute('aria-checked')) !== 'false') errors.push(`${tag}: the switch did not turn back off`);
    if ((await queueLen()) !== 0) errors.push(`${tag}: switching off must clear the queued reports`);
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    await page.reload(); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
    if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); }
    await openSettings();
    if ((await toggle.getAttribute('aria-checked').catch(() => null)) !== 'false') errors.push(`${tag}: the switch should stay off after a reload`);
  }
  if (errorRequests.length) errors.push(`${tag}: ${errorRequests.length} request(s) reached /errors under the gate`);
  await ctx.close();
}

// FG-5: the free-weight parts library (docs/FORM-GUIDE-PRODUCTION.md §4, tests/formguide/partsGallery.ts). Every part's
// drawings, framed to their own box, plus the front figure with the library dumbbell and with a barbell at its hand
// anchors, in Silent Black and Paper at phone width (390 px): no page error, no sideways scroll, every drawing has a
// non-empty box inside its card, and the part gradient's stops are the theme's own --iron tokens.
{
  const { build } = await import('esbuild');
  const fg5Out = join(ROOT, 'node_modules/.cache/fg5-gallery.mjs');
  await build({ entryPoints: [join(ROOT, 'tests/formguide/partsGallery.ts')], bundle: true, format: 'esm', platform: 'node', outfile: fg5Out, logLevel: 'warning' });
  const { galleryHtml, GALLERY } = await import(`file://${fg5Out}?t=${Date.now()}`);
  for (const theme of ['silent-black', 'paper']) {
    const tag = `FG-5 parts ${theme}`;
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: page error ${e.message}`));
    await page.setContent(galleryHtml(theme));
    const r = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement), tok = n => root.getPropertyValue(n).trim().toLowerCase();
      const stops = [...document.querySelectorAll('#fgp-i stop')].map(s => s.getAttribute('stop-color').toLowerCase());
      const cards = [...document.querySelectorAll('figure.card')].map(f => {
        const svg = f.querySelector('svg'), part = svg.querySelector('.fg-part') ?? svg.querySelector('.fg-fig');
        const b = part.getBoundingClientRect(), c = svg.getBoundingClientRect();
        return { name: f.dataset.part, w: b.width, h: b.height, inside: b.left >= c.left - 1 && b.right <= c.right + 1 && b.top >= c.top - 1 && b.bottom <= c.bottom + 1 };
      });
      return { sw: document.documentElement.scrollWidth, iw: innerWidth, stops: [...new Set(stops)].sort(), iron: [tok('--iron-hi'), tok('--iron'), tok('--iron-sh')].sort(), cards };
    });
    if (r.sw > r.iw) errors.push(`${tag}: scrollWidth ${r.sw} > innerWidth ${r.iw}`);
    if (r.cards.length !== GALLERY.length + 2) errors.push(`${tag}: expected ${GALLERY.length + 2} drawings, got ${r.cards.length}`);
    for (const c of r.cards) {
      if (!(c.w > 4 && c.h > 4)) errors.push(`${tag}: ${c.name} draws an empty box ${c.w}x${c.h}`);
      if (!c.inside) errors.push(`${tag}: ${c.name} spills out of its card`);
    }
    if (JSON.stringify(r.stops) !== JSON.stringify([...new Set(r.iron)].sort())) errors.push(`${tag}: part gradient stops ${r.stops} are not the theme's iron tokens ${r.iron}`);
    await page.screenshot({ path: `${OUT}/fg5-parts-${theme}.png`, fullPage: true });
    await ctx.close();
  }
}

// FG-6: the side figure (docs/FORM-GUIDE-PRODUCTION.md §3, tests/formguide/sideGallery.ts). A2: the bench press (lockout,
// bar on the chest, facing left) and the back squat (top, bottom) stills, plus the rest poses, each framed by the
// standing camera in Silent Black and Paper at phone width (390 px): no page error, no sideways scroll, the figure and
// its parts draw a non-empty box that stays inside its camera (nothing clipped; measured on the drawn shapes, since a
// group's box in Chrome is the union of its children's boxes turned with them, which overstates a rotated figure), and
// all 17 joint groups carry the written transforms.
{
  const { build } = await import('esbuild');
  const fg6Out = join(ROOT, 'node_modules/.cache/fg6-gallery.mjs');
  await build({ entryPoints: [join(ROOT, 'tests/formguide/sideGallery.ts')], bundle: true, format: 'esm', platform: 'node', outfile: fg6Out, logLevel: 'warning' });
  const { sideGalleryHtml, STILLS } = await import(`file://${fg6Out}?t=${Date.now()}`);
  for (const theme of ['silent-black', 'paper']) {
    const tag = `FG-6 side figure ${theme}`;
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag}: page error ${e.message}`));
    await page.setContent(sideGalleryHtml(theme));
    const r = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, iw: innerWidth,
      cards: [...document.querySelectorAll('figure.card')].map(f => {
        const svg = f.querySelector('svg'), c = svg.getBoundingClientRect(), bs = [...svg.querySelectorAll(':is(.fg-fig, .fg-part) :is(path, ellipse, circle, rect, polygon)')].map(e => e.getBoundingClientRect());
        const b = bs.reduce((a, x) => ({ left: Math.min(a.left, x.left), top: Math.min(a.top, x.top), right: Math.max(a.right, x.right), bottom: Math.max(a.bottom, x.bottom) }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
        const posed = [...svg.querySelectorAll('.fg-j')].filter(g => g.style.transform).length;
        return { name: f.dataset.still, w: b.right - b.left, h: b.bottom - b.top, inside: b.left >= c.left - 1 && b.right <= c.right + 1 && b.top >= c.top - 1 && b.bottom <= c.bottom + 1, cardIn: c.right <= innerWidth, posed };
      }),
    }));
    if (r.sw > r.iw) errors.push(`${tag}: scrollWidth ${r.sw} > innerWidth ${r.iw}`);
    if (r.cards.length !== STILLS.length) errors.push(`${tag}: expected ${STILLS.length} stills, got ${r.cards.length}`);
    for (const name of ['bench press, lockout', 'bench press, bar on the chest', 'back squat, top', 'back squat, bottom']) if (!r.cards.some(c => c.name === name)) errors.push(`${tag}: missing still "${name}"`);
    for (const c of r.cards) {
      if (!(c.w > 40 && c.h > 40)) errors.push(`${tag}: ${c.name} draws an empty box ${c.w}x${c.h}`);
      if (!c.inside) errors.push(`${tag}: ${c.name} is clipped by its camera`);
      if (!c.cardIn) errors.push(`${tag}: ${c.name} runs past the screen edge`);
      if (c.posed !== 17) errors.push(`${tag}: ${c.name} has ${c.posed} of 17 joint groups posed`);
    }
    await page.screenshot({ path: `${OUT}/fg6-side-${theme}.png`, fullPage: true });
    await ctx.close();
  }
}

// BUG-22: the floating Escobar dock used to cover the end of long pages ("Log a past session" and
// the targets line on an 8-exercise split) and anything under it mid-scroll. At 390x844 in Silent
// Black and Paper: (A1) scrolled to the end of Train, Today, History and Body, with the rest banner
// down and up, every piece of page content ends above the dock's top edge plus its shadow
// (--dock-shade); (A2) scrolling down mid-page moves the dock out of the way (a tap at its spot
// reaches the page) and scrolling up brings it back. The owner's phone showed the dock over "Log a
// past session" even at the scroll end, so Train's end is also checked with a tall 48px system inset,
// both as env(safe-area-inset-bottom) and as the --safe-area-inset-bottom Capacitor's SystemBars
// injects on <html>, and with the dock pushed 60px higher than --float-bottom (standing in for a
// device where it sits higher than the tokens say); a real tap at the button's centre at the scroll
// end must open the sheet. Only the document may scroll (no nested scroller eating the end padding).
const bug22Runs = [];
for (const theme of ['silent-black', 'paper']) for (const inset of ['none', 'env48', 'var48', 'raised60']) bug22Runs.push({ theme, inset });
// The owner's Samsung (3-button navigation, larger default font): a 360x740 viewport, a 48px inset
// written the SystemBars way, and every --fs-* token scaled 1.3x (standing in for WebView text zoom).
for (const theme of ['silent-black', 'paper']) bug22Runs.push({ theme, inset: 'samsung' });
for (const { theme, inset } of bug22Runs) {
  const ctx = await browser.newContext({ viewport: inset === 'samsung' ? { width: 360, height: 740 } : { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const tag = `BUG-22 dock overlap (${theme}, inset ${inset})`;
  if (inset === 'samsung') await page.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const root = document.documentElement; root.style.setProperty('--safe-area-inset-bottom', '48px'); const cs = getComputedStyle(root); for (const k of ['--fs-body', '--fs-cap', '--fs-display', '--fs-h1', '--fs-meta', '--fs-small', '--fs-stat', '--fs-title']) { const v = parseFloat(cs.getPropertyValue(k)); if (v) root.style.setProperty(k, `${(v * 1.3).toFixed(1)}px`); } }); });
  if (inset === 'env48') { const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 0, bottom: 48, left: 0, right: 0 } }); }
  if (inset === 'raised60') await page.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = '.esc-dock { bottom: calc(var(--float-bottom) + 60px) !important; }'; document.head.append(st); }); });
  if (inset === 'var48') await page.addInitScript(() => { const set = () => document.documentElement.style.setProperty('--safe-area-inset-bottom', '48px'); if (document.documentElement) set(); else document.addEventListener('DOMContentLoaded', set); });
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300);
  const later = async () => { if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(200); } };
  await later();
  // Seeds go through sessionStorage and land before the app boots, so the running app's own save can't overwrite them.
  await page.addInitScript(() => { const seed = sessionStorage.getItem('bug22.seed'); if (seed) { localStorage.setItem('marc.state.v1', seed); sessionStorage.removeItem('bug22.seed'); } });
  const go = async (label) => { await page.locator('nav.nav button', { hasText: label }).click(); await page.waitForTimeout(300); };
  await go(/^Train$/);
  const tpl = page.getByRole('button', { name: 'Use Push / Pull / Legs' });
  if (await tpl.isVisible().catch(() => false)) { await tpl.click(); await page.waitForTimeout(300); }
  // One split with 8 different exercises (the owner's long split), then reload so it renders from storage.
  const n = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('marc.state.v1'));
    if (!s?.splits?.length) return 0;
    const seen = new Set();
    s.splits[0].exercises = s.splits.flatMap(x => x.exercises).filter(e => !seen.has(e.exerciseId) && seen.add(e.exerciseId)).slice(0, 8);
    sessionStorage.setItem('bug22.seed', JSON.stringify(s));
    return s.splits[0].exercises.length;
  });
  if (n !== 8) errors.push(`${tag}: expected to seed an 8-exercise split, got ${n}`);
  await page.reload(); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300); await later();

  const toEnd = async () => { await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight)); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); };
  const measureEnd = () => page.evaluate(() => {
    const dock = document.querySelector('.esc-dock');
    if (!dock) return null;
    const d = dock.getBoundingClientRect();
    const shade = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dock-shade')) || 0;
    let bottom = 0; let who = '';
    for (const el of document.querySelectorAll('.app *')) {
      if (el.closest('.esc-dock, .nav, .rest, .toast, dialog, .pulse-line')) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue;
      if (r.bottom > bottom) { bottom = r.bottom; who = `${el.tagName.toLowerCase()}.${el.className || ''} "${(el.textContent || '').trim().slice(0, 30)}"`; }
    }
    return { away: dock.classList.contains('esc-dock-away'), limit: d.top - shade, bottom, who };
  });
  const checkEnd = async (where) => {
    await toEnd();
    const m = await measureEnd();
    if (!m) { errors.push(`${tag} ${where}: expected the dock to show`); return; }
    if (m.away) errors.push(`${tag} ${where}: the dock should show at the end of the page`);
    if (m.bottom > m.limit + 0.5) errors.push(`${tag} ${where}: content ends at ${m.bottom.toFixed(1)} but the dock and its shadow start at ${m.limit.toFixed(1)} (${m.who})`);
  };

  // A1, rest banner down.
  await go(/^Train$/);
  await checkEnd('Train end');
  const scrollers = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => { const o = getComputedStyle(el).overflowY; return (o === 'auto' || o === 'scroll') && el.scrollHeight > el.clientHeight + 1 && !el.closest('dialog'); }).map(el => `${el.tagName.toLowerCase()}.${el.className}`));
  if (scrollers.length) errors.push(`${tag} Train: expected only the document to scroll, found ${scrollers.join(', ')}`);
  const trainEnd = await page.evaluate(() => {
    const dock = document.querySelector('.esc-dock').getBoundingClientRect();
    const shade = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dock-shade')) || 0;
    const log = document.querySelector('[data-palace="train.log-past"]');
    const hint = [...document.querySelectorAll('.view p.hint')].find(p => p.textContent.includes('Change the goal in Coach'));
    const lb = log?.getBoundingClientRect();
    const hit = lb ? document.elementFromPoint(lb.left + lb.width / 2, lb.top + lb.height / 2) : null;
    return { rows: document.querySelectorAll('[data-palace="train.split"] .list .row, [data-palace="train.split"] .list > *').length, limit: dock.top - shade, log: lb?.bottom ?? null, hint: hint?.getBoundingClientRect().bottom ?? null, tap: !!hit && log.contains(hit) };
  });
  if (trainEnd.log == null || trainEnd.hint == null) errors.push(`${tag} Train end: could not find "Log a past session" and the targets line`);
  else {
    if (trainEnd.log > trainEnd.limit) errors.push(`${tag} Train end: "Log a past session" ends at ${trainEnd.log}, under the dock (${trainEnd.limit})`);
    if (trainEnd.hint > trainEnd.limit) errors.push(`${tag} Train end: the targets line ends at ${trainEnd.hint}, under the dock (${trainEnd.limit})`);
    if (!trainEnd.tap) errors.push(`${tag} Train end: a tap on "Log a past session" does not reach it`);
  }
  await settle(page); await page.screenshot({ path: `${OUT}/bug-22-${theme}${inset === 'none' ? '' : `-${inset}`}-train-end.png` });
  // The owner's check: at the scroll end, a real tap on "Log a past session" opens its sheet.
  if (trainEnd.log != null) {
    const box = await page.locator('[data-palace="train.log-past"]').boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    if (!(await visible(page.getByRole('button', { name: 'Save past session' }), 3000))) errors.push(`${tag} Train end: tapping "Log a past session" at the scroll end did not open the log-past sheet`);
    else { await page.keyboard.press('Escape'); await page.waitForFunction(() => !document.querySelector('dialog[open]'), null, { timeout: 3000 }).catch(() => errors.push(`${tag}: the log-past sheet did not close`)); await page.waitForTimeout(200); }
  }
  if (inset !== 'none') { await ctx.close(); continue; }

  // A2: mid-page, scrolling down moves the dock away; scrolling up brings it back.
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(100);
  const spot = await page.evaluate(() => { const r = document.querySelector('.esc-dock').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  for (let k = 0; k < 3; k++) { await page.evaluate(() => window.scrollBy(0, 40)); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); }
  const mid = await page.evaluate(({ x, y }) => { const d = document.querySelector('.esc-dock'); const hit = document.elementFromPoint(x, y); return { y: window.scrollY, max: document.scrollingElement.scrollHeight - innerHeight, away: d.classList.contains('esc-dock-away'), blocks: !!hit?.closest('.esc-dock') }; }, spot);
  if (!(mid.y > 0 && mid.y < mid.max - 8)) errors.push(`${tag} A2: expected to be mid-page, at ${mid.y} of ${mid.max}`);
  if (!mid.away) errors.push(`${tag} A2: the dock should move away while scrolling down mid-page`);
  if (mid.blocks) errors.push(`${tag} A2: mid-scroll, a tap at the dock's spot still hits the dock`);
  await settle(page); await page.screenshot({ path: `${OUT}/bug-22-${theme}-train-mid.png` });
  await page.evaluate(() => window.scrollBy(0, -40)); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  if (await page.evaluate(() => document.querySelector('.esc-dock').classList.contains('esc-dock-away'))) errors.push(`${tag} A2: scrolling up should bring the dock back`);

  for (const t of ['Today', 'History', 'Body']) { await go(t); await checkEnd(`${t} end`); }

  // A2 on History > Stats, where the owner's screenshot had the dock over "Exercise progress": scrolling
  // down mid-page moves it away and a tap at its spot reaches the chart area; scrolling up brings it
  // back (the shipped trade-off: until the next scroll-down it may cover what is under it). Then A1 at its end.
  await go('History');
  await page.locator('.seg button', { hasText: /^Stats$/ }).click(); await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(100);
  for (let k = 0; k < 4; k++) { await page.evaluate(() => window.scrollBy(0, 40)); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); }
  const stats = await page.evaluate(({ x, y }) => { const d = document.querySelector('.esc-dock'); const hit = document.elementFromPoint(x, y); return { y: window.scrollY, max: document.scrollingElement.scrollHeight - innerHeight, away: d.classList.contains('esc-dock-away'), blocks: !!hit?.closest('.esc-dock'), onPage: !!hit?.closest('.view') }; }, spot);
  if (!(stats.y > 0 && stats.y < stats.max - 8)) errors.push(`${tag} A2 Stats: expected to be mid-page, at ${stats.y} of ${stats.max}`);
  if (!stats.away || stats.blocks) errors.push(`${tag} A2 Stats: scrolling down mid-page should move the dock away (away ${stats.away}, still hit ${stats.blocks})`);
  if (!stats.onPage) errors.push(`${tag} A2 Stats: a tap at the dock's spot should reach the page`);
  await page.evaluate(() => window.scrollBy(0, -40)); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  if (await page.evaluate(() => document.querySelector('.esc-dock').classList.contains('esc-dock-away'))) errors.push(`${tag} A2 Stats: scrolling up should bring the dock back`);
  await checkEnd('History > Stats end');

  // A1, rest banner up: a live session resting, looked at from the other tabs (Train hides the dock while live).
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('marc.state.v1'));
    const sp = s.splits[0];
    s.active = { splitId: sp.id, startedAt: new Date().toISOString(), pausedMs: 0, entries: sp.exercises.map(e => ({ exerciseId: e.exerciseId, name: e.exerciseId, sets: [], done: false, skipped: false })), rest: { endsAt: Date.now() + 600000, totalSec: 600 } };
    sessionStorage.setItem('bug22.seed', JSON.stringify(s));
  });
  await page.reload(); await page.waitForSelector('.nav'); await launchGone(page); await page.waitForTimeout(300); await later();
  for (const t of ['Today', 'History', 'Body']) {
    await go(t);
    if (!(await page.evaluate(() => document.documentElement.hasAttribute('data-rest') && !!document.querySelector('.rest')))) { errors.push(`${tag} ${t} rest: expected the rest banner up`); continue; }
    await checkEnd(`${t} end, rest up`);
    if (t === 'Today') { await settle(page); await page.screenshot({ path: `${OUT}/bug-22-${theme}-today-rest.png` }); }
  }
  await ctx.close();
}

// BUG-15 (PROGRESSION-F6): a lighter week cuts 3 planned sets to 2, and the Train rows show it:
// two rows carry the 0.9 × pre-week target (72.5 → 65 kg on the default barbell), the third is set
// aside, and the header counts 2 sets.
{
  const tag = 'BUG-15 set cut rows';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const bench = 'lib_barbell_bench_press';
    const pre = { id: 's-pre', splitId: 'sp1', splitName: 'Push', day: day(3), startedAt: `${day(3)}T17:00:00.000Z`, endedAt: `${day(3)}T18:00:00.000Z`, durationSec: 3600, logging: { mode: 'live', flags: [] },
      exercises: [{ exerciseId: bench, name: 'Barbell Bench Press', sets: [1, 2, 3].map(i => ({ id: `p${i}`, kg: 72.5, reps: 8, effort: 'ideal' })) }] };
    localStorage.setItem('marc.theme', 'silent-black');
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [{ id: 'sp1', name: 'Push', color: '#888', exercises: [{ exerciseId: bench, sets: 3 }], focus: [], createdAt: now }],
      schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [pre], customExercises: [],
      active: { id: 'act15', splitId: 'sp1', startedAt: now, pausedMs: 0, entries: [{ id: 'en15', exerciseId: bench, name: 'Barbell Bench Press', sets: [{ id: 'r1' }, { id: 'r2' }, { id: 'r3' }], done: false, skipped: false }] },
      deload: { startDay: day(1), endDay: day(-5), reason: 'gate', setFactor: 0.6, loadFactor: 0.9 },
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [], insightFeedback: [],
    }));
  });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  // A running session puts Train under the "Live" tab.
  await page.locator('nav.nav button', { hasText: 'Live' }).click(); await page.waitForTimeout(300);
  const card = page.locator('.card.exercise').first();
  if (!(await card.locator('.set-grid input').first().isVisible().catch(() => false))) { await card.locator('.ex-head').click(); await page.waitForTimeout(300); }
  const rows = await card.evaluate(c => [...c.querySelectorAll('.set-grid')].filter(g => g.querySelector('input')).map(g => ({ aside: g.hasAttribute('data-set-aside'), kg: g.querySelector('input')?.getAttribute('placeholder') ?? '' })));
  if (JSON.stringify(rows.map(r => r.aside)) !== '[false,false,true]') errors.push(`${tag}: expected rows [kept, kept, set aside], got ${JSON.stringify(rows)}`);
  if (rows[0]?.kg !== '65' || rows[1]?.kg !== '65') errors.push(`${tag}: expected both kept rows to target 65 (0.9 × 72.5, snapped down), got ${JSON.stringify(rows)}`);
  if (!(await visible(card.getByText('Not today · lighter week'), 1500))) errors.push(`${tag}: expected the third row to read "Not today · lighter week"`);
  if (!(await visible(card.locator('.ex-head .hint', { hasText: '0/2 sets' }), 1500))) errors.push(`${tag}: expected the header to count 2 sets`);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-bug-15-set-rows.png` });
  await ctx.close();
}

// GU-7a-2: the form guide (stub Guide until GU-7a-4). A10 chunk rules; A11 no guide on Today; A8 the
// "How to do it" row only for guided exercises; A7 screenshots in 5 themes at t 0 and 0.25, 390 px;
// A4 playback (3 reps of 4 s, 0.5x, Pause, Replay, closing cancels every animation); A5 zoom keeps
// playing with its subject inside the stage and above the bubble for 41 phases; A13 hotspots of at
// least 44 x 44 px and the muscle bubble; A6 reduced motion = Pictures with zero animate() calls;
// A9 a failed chunk keeps the sheet open with "Demo could not load." and Reload.
{
  const tag = 'GU-7a';
  const { gzipSync } = await import('node:zlib');
  const assets = join(ROOT, 'www/assets');
  const files = readdirSync(assets);
  const mains = files.filter(f => /^index-.*\.js$/.test(f));
  if (!mains.length) errors.push(`${tag} A10: no www/assets/index-*.js found`);
  for (const f of mains) {
    const text = readFileSync(join(assets, f), 'utf8');
    if (text.includes('marc-formguide-rig') || text.includes('id="rig-')) errors.push(`${tag} A10: ${f} (main chunk) holds form-guide code`);
    const buf = readFileSync(join(assets, f));
    console.log(`${tag} A10: ${f} ${buf.length} B raw, ${gzipSync(buf).length} B gzip`);
  }
  const chunk = files.find(f => /^FormGuidePlayer-.*\.js$/.test(f));
  if (!chunk) errors.push(`${tag} A10: www/assets/FormGuidePlayer-*.js is missing`);
  else {
    const buf = readFileSync(join(assets, chunk));
    const gz = gzipSync(buf).length;
    console.log(`${tag} A10: ${chunk} ${buf.length} B raw, ${gz} B gzip (cap ${150 * 1024})`);
    if (gz > 150 * 1024) errors.push(`${tag} A10: ${chunk} is ${gz} B gzip, over the 150 KB cap`);
  }

  const seed = ([t]) => {
    // Records every Web Animation the page creates, so a probe can see cancel() and count animate() calls.
    const orig = Element.prototype.animate;
    window.__fgAnims = [];
    Element.prototype.animate = function (...a) { const an = orig.apply(this, a); if (this.closest?.('.form-guide')) window.__fgAnims.push(an); return an; };
    if (localStorage.getItem('marc.state.v1')) return;
    localStorage.setItem('marc.theme', t);
    const now = new Date().toISOString();
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [{ id: 'sp1', name: 'Upper', color: '#6aa9ff', focus: [], createdAt: now, exercises: [{ exerciseId: 'lib_machine_chest_press', sets: 3 }, { exerciseId: 'lib_barbell_bench_press', sets: 3 }] }],
      schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: false, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  };
  const open = async (theme, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ...opts });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag} ${theme}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to (load|fetch)|ERR_FAILED/.test(m.text())) errors.push(`${tag} ${theme} console: ${m.text()}`); });
    await page.addInitScript(seed, [theme]);
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav'); await launchGone(page);
    await page.waitForTimeout(300);
    return { ctx, page };
  };
  const startSession = async (page) => {
    await page.locator('nav.nav button', { hasText: 'Train' }).click(); await page.waitForTimeout(200);
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
    if (await page.getByRole('button', { name: /^Start / }).first().isVisible().catch(() => false)) { await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300); }
  };
  const options = async (page, i) => { await page.getByRole('button', { name: 'Options', exact: true }).nth(i).click(); await page.waitForTimeout(300); };
  // UI-2: the button lives on the open card's Why-this-target row, not the "..." sheet.
  const openCard = async (page, i) => { await page.locator('.card.exercise .ex-head').nth(i).click(); await page.waitForTimeout(300); };
  const howButton = (page, i) => page.locator('.card.exercise').nth(i).locator('.btn-how-to');
  const openGuide = async (page) => { await howButton(page, 0).click(); return visible(page.locator('dialog[open] .form-guide .player')); };
  const seek = (page, ms) => page.evaluate(ms => { for (const a of window.__fgAnims) { a.pause(); a.currentTime = ms; } return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, ms);

  // A13: each muscle's real hit area (halo + core, round 3 D-R7: a point counts when it hits either) at t 0 and 0.25.
  const hotProbe = async (page, where) => {
    for (const ms of [0, 1000]) {
      await seek(page, ms);
      const sizes = await page.evaluate(() => [...document.querySelectorAll('dialog[open] .scene .hot:not(.hot-core)')].map(h => {
        const r = h.getBoundingClientRect();
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (let x = Math.floor(r.left - 24); x <= r.right + 24; x++) for (let y = Math.floor(r.top - 24); y <= r.bottom + 24; y++) {
          const hit = document.elementFromPoint(x, y);
          if (hit?.classList.contains('hot') && hit.dataset.muscle === h.dataset.muscle) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        }
        return { m: h.dataset.muscle, w: x1 - x0 + 1, h: y1 - y0 + 1 };
      }));
      if (sizes.length !== 3) errors.push(`${tag} A13 ${where}: expected 3 hotspots, got ${sizes.length}`);
      for (const s of sizes) if (!(s.w >= 44 && s.h >= 44)) errors.push(`${tag} A13 ${where}: hotspot ${s.m} hits ${s.w} x ${s.h} px at ${ms} ms`);
    }
    await seek(page, 0);
  };
  // A7 / R1-12: the player fits the sheet; Play stays a 44 px circle; no control overlaps another, leaves the player or clips its label.
  const fitProbe = async (page, where) => {
    const f = await page.evaluate(() => {
      const box = e => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; };
      const player = box(document.querySelector('dialog[open] .form-guide .player'));
      const panel = box(document.querySelector('dialog[open] .sheet-panel'));
      const play = box(document.querySelector('dialog[open] .form-guide .controls > .btn-icon'));
      const ctrls = [...document.querySelectorAll('dialog[open] .form-guide .chips > button, dialog[open] .form-guide .controls > .btn-icon, dialog[open] .form-guide .controls > .seg')];
      const named = ctrls.map(e => ({ n: e.getAttribute('aria-label') || e.textContent, ...box(e) }));
      const out = named.filter(c => c.l < player.l - 0.5 || c.r > player.r + 0.5 || c.t < player.t - 0.5 || c.b > player.b + 0.5).map(c => c.n);
      const overlap = [];
      for (let i = 0; i < named.length; i++) for (let j = i + 1; j < named.length; j++) {
        const a = named[i], b = named[j];
        if (a.l < b.r - 0.5 && b.l < a.r - 0.5 && a.t < b.b - 0.5 && b.t < a.b - 0.5) overlap.push(`${a.n} / ${b.n}`);
      }
      const clipped = [...document.querySelectorAll('dialog[open] .form-guide .seg button, dialog[open] .form-guide .chips > button')].filter(b => b.scrollWidth > b.clientWidth + 0.5).map(b => b.textContent);
      // integration with FG-1: `.form-guide svg { width: 100% }` must not stretch the chrome icons; each is drawn at its own width/height.
      const playIcon = box(document.querySelector('dialog[open] .form-guide .controls > .btn-icon > svg'));
      const icons = [...document.querySelectorAll('dialog[open] .form-guide .chips svg, dialog[open] .form-guide .controls svg')]
        .map(s => ({ want: `${s.getAttribute('width')} x ${s.getAttribute('height')}`, got: `${Math.round(s.getBoundingClientRect().width)} x ${Math.round(s.getBoundingClientRect().height)}`, in: s.parentElement.getAttribute('aria-label') || s.parentElement.textContent }))
        .filter(i => i.want !== i.got);
      return { player, panel, play, playIcon, icons, out, overlap, clipped, sw: document.documentElement.scrollWidth, iw: innerWidth };
    });
    if (Math.abs(f.playIcon.w - 20) > 0.5 || Math.abs(f.playIcon.h - 20) > 0.5) errors.push(`${tag} A7 ${where}: the Play icon is ${f.playIcon.w.toFixed(1)} x ${f.playIcon.h.toFixed(1)} px, not 20 x 20`);
    if (f.icons.length) errors.push(`${tag} A7 ${where}: icons drawn off their own size: ${f.icons.map(i => `${i.in} ${i.got} (want ${i.want})`).join('; ')}`);
    if (f.player.l < f.panel.l - 0.5 || f.player.r > f.panel.r + 0.5 || f.sw > f.iw) errors.push(`${tag} A7 ${where}: the player does not fit the sheet (${JSON.stringify({ player: f.player, panel: f.panel, sw: f.sw })})`);
    if (!(f.play.w >= 44 && f.play.h >= 44)) errors.push(`${tag} A7 ${where}: Play is ${f.play.w.toFixed(1)} x ${f.play.h.toFixed(1)} px, under 44`);
    if (f.out.length) errors.push(`${tag} A7 ${where}: controls leave the player: ${f.out.join(', ')}`);
    if (f.overlap.length) errors.push(`${tag} A7 ${where}: controls overlap: ${f.overlap.join('; ')}`);
    if (f.clipped.length) errors.push(`${tag} A7 ${where}: labels clipped: ${f.clipped.join(', ')}`);
  };

  for (const theme of themes) {
    const { ctx, page } = await open(theme);
    // A11: never on Today.
    if (await page.locator('.form-guide').count()) errors.push(`${tag} ${theme} A11: a .form-guide element is on Today`);
    await startSession(page);
    // UI-2 A2: the button is on the open card, not for the bench press (entry 1, no guide) even once its card is open.
    await openCard(page, 1);
    if (await howButton(page, 1).count()) errors.push(`${tag} ${theme} A2: "How to do it" shows for Barbell Bench Press`);
    // Single accordion: reopen entry 0 (closes entry 1).
    await openCard(page, 0);
    // UI-2 A3: the "..." sheet no longer lists it, for the guided exercise either.
    await options(page, 0);
    const labels = await page.locator('dialog[open] .stack-sm > button').allTextContents();
    if (labels.includes('How to do it')) errors.push(`${tag} ${theme} A3: "How to do it" still in the "..." sheet: ${JSON.stringify(labels)}`);
    await page.getByRole('button', { name: 'Close', exact: true }).click(); await page.waitForTimeout(300);
    // UI-2 A1: entry 0 (Machine Chest Press) is open by default; its button opens the guide directly.
    await howButton(page, 0).click();
    if (!(await visible(page.locator('dialog[open] .form-guide .player')))) { errors.push(`${tag} ${theme}: the guide sheet did not open`); await ctx.close(); continue; }
    const title = await page.locator('dialog[open] h2').textContent();
    if (title !== 'How to do it: Machine Chest Press') errors.push(`${tag} ${theme}: sheet title "${title}"`);
    // A7: screenshots at t 0 and 0.25; the player fits the 390 px sheet.
    const fit = await page.evaluate(() => { const p = document.querySelector('dialog[open] .form-guide .player').getBoundingClientRect(); const d = document.querySelector('dialog[open] .sheet-panel').getBoundingClientRect(); return { l: p.left, r: p.right, dl: d.left, dr: d.right, sw: document.documentElement.scrollWidth }; });
    if (fit.l < fit.dl || fit.r > fit.dr || fit.sw > 390) errors.push(`${tag} ${theme} A7: the player does not fit the sheet at 390 px (${JSON.stringify(fit)})`);
    await fitProbe(page, `${theme} 390 px`);
    await seek(page, 0); await page.screenshot({ path: `${OUT}/${theme}-gu7a-guide-t0.png` });
    await seek(page, 1000); await page.screenshot({ path: `${OUT}/${theme}-gu7a-guide-t025.png` });
    await seek(page, 0);

    if (theme === 'silent-black') {
      // A4: Play runs 3 reps of 4 s, linear, fill both, never looping.
      await page.locator('dialog[open] .form-guide').getByRole('button', { name: 'Play', exact: true }).click(); await page.waitForTimeout(200);
      const t = await page.evaluate(() => window.__fgAnims.map(a => { const x = a.effect.getTiming(); return `${a.playState} ${x.duration} ${x.iterations} ${x.easing} ${x.fill}`; }));
      if (!t.length || t.some(s => s !== 'running 4000 3 linear both')) errors.push(`${tag} A4: expected every animation "running 4000 3 linear both", got ${JSON.stringify([...new Set(t)])}`);
      await page.locator('dialog[open] .seg button', { hasText: '0.5x' }).click(); await page.waitForTimeout(100);
      const rates = await page.evaluate(() => [...new Set(window.__fgAnims.map(a => a.playbackRate))]);
      if (rates.join() !== '0.5') errors.push(`${tag} A4: 0.5x set playbackRate ${JSON.stringify(rates)}`);
      if (!(await page.locator('dialog[open] .pill-accent', { hasText: 'Slow motion' }).isVisible())) errors.push(`${tag} A4: no "Slow motion" pill at 0.5x`);
      await page.locator('dialog[open] .seg button', { hasText: '1x' }).click();
      await page.locator('dialog[open] .form-guide').getByRole('button', { name: 'Pause', exact: true }).click(); await page.waitForTimeout(100);
      const t1 = await page.evaluate(() => window.__fgAnims.map(a => `${a.playState} ${a.currentTime}`));
      await page.waitForTimeout(300);
      const t2 = await page.evaluate(() => window.__fgAnims.map(a => `${a.playState} ${a.currentTime}`));
      if (t1.join() !== t2.join() || !t1.every(s => s.startsWith('paused'))) errors.push(`${tag} A4: Pause did not freeze (${t1[0]} -> ${t2[0]})`);
      // The end of rep 3: the button becomes Replay and the figure holds the start pose.
      await page.locator('dialog[open] .form-guide').getByRole('button', { name: 'Play', exact: true }).click();
      await page.evaluate(() => { for (const a of window.__fgAnims) a.currentTime = 11990; });
      await page.waitForTimeout(400);
      const end = await page.evaluate(() => ({ states: [...new Set(window.__fgAnims.map(a => a.playState))], arm: getComputedStyle(document.querySelector('dialog[open] .scene .st-arm')).transform, cap: document.querySelector('dialog[open] .cap').textContent }));
      if (end.states.join() !== 'finished') errors.push(`${tag} A4: after 3 reps expected finished, got ${end.states}`);
      if (!/^matrix\(1, 0, 0, 1, 0, 0\)$|^none$/.test(end.arm)) errors.push(`${tag} A4: after 3 reps the arm is not on the start pose (${end.arm})`);
      if (end.cap !== 'Done. Tap Replay to watch again.') errors.push(`${tag} A4: ended caption "${end.cap}"`);
      await page.locator('dialog[open] .form-guide').getByRole('button', { name: 'Replay', exact: true }).click(); await page.waitForTimeout(150);
      const re = await page.evaluate(() => window.__fgAnims.map(a => `${a.playState} ${a.currentTime < 1000}`));
      if (!re.every(s => s === 'running true')) errors.push(`${tag} A4: Replay did not restart from 0 (${re[0]})`);
      if (await page.locator('dialog[open] .pill', { hasText: 'Rep 1 of 3' }).count() !== 1) errors.push(`${tag} A4: no "Rep 1 of 3" pill after Replay`);

      // A5: each zoom chip keeps playing; its subject (.ov-<chip>) stays in the stage, above the bubble, over 41 phases.
      for (const [i, chip] of ['grip', 'path', 'seat'].entries()) {
        await page.locator('dialog[open] .chips button').nth(i).click(); await page.waitForTimeout(450);
        const running = await page.evaluate(() => window.__fgAnims.every(a => a.playState === 'running'));
        if (!running) errors.push(`${tag} A5: zoom ${chip} stopped the animation`);
        const bad = await page.evaluate(async (chip) => {
          const out = [];
          const st = document.querySelector('dialog[open] .stage').getBoundingClientRect();
          const bub = document.querySelector('dialog[open] .bubble').getBoundingClientRect();
          for (let k = 0; k <= 40; k++) {
            for (const a of window.__fgAnims) { a.pause(); a.currentTime = (k / 40) * 4000; }
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            const b = document.querySelector(`dialog[open] .scene .ov-${chip}`).getBoundingClientRect();
            if (b.left < st.left || b.right > st.right || b.top < st.top || b.bottom > bub.top) out.push(k);
          }
          for (const a of window.__fgAnims) a.play();
          return out;
        }, chip);
        if (bad.length) errors.push(`${tag} A5: zoom ${chip} subject leaves the stage or meets the bubble at phases ${bad.join(',')}`);
        const cap = await page.locator('dialog[open] .bubble').textContent();
        if (!cap?.trim()) errors.push(`${tag} A5: zoom ${chip} shows no caption bubble`);
        await page.screenshot({ path: `${OUT}/silent-black-gu7a-zoom-${chip}.png` });
        await page.locator('dialog[open] .chips button').nth(i).click(); await page.waitForTimeout(450);
      }

      // A13: every hotspot hits at least 44 x 44 px at t 0 and t 0.25.
      await hotProbe(page, '390 px');
      // 5.12: the phase caption is announced politely.
      if (await page.locator('dialog[open] .cap[aria-live="polite"]').count() !== 1) errors.push(`${tag} 5.12: the caption line is not an aria-live="polite" region`);
      // Tap the target at t 0.3: the exact line, the dot in the muscle's colour, the outline on that region only.
      await seek(page, 1200);
      const tapHot = async (m) => { const b = await page.locator(`dialog[open] .scene .hot:not(.hot-core)[data-muscle="${m}"]`).boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(150); };
      await tapHot('chest');
      const bub = await page.evaluate(() => { const b = document.querySelector('dialog[open] .bubble'); if (!b) return null; const fg = document.querySelector('dialog[open] .form-guide'); const probe = document.createElement('i'); probe.style.color = 'var(--muscle-main)'; fg.appendChild(probe); const want = getComputedStyle(probe).color; probe.remove(); return { text: b.textContent, name: b.querySelector('.bt b')?.textContent, dot: getComputedStyle(b.querySelector('.dot')).backgroundColor, want, sel: [...document.querySelectorAll('dialog[open] .sel')].map(e => `${e.getAttribute('class')} ${e.getAttribute('points')}`) }; });
      if (!bub) errors.push(`${tag} A13: tapping the chest shows no bubble`);
      else {
        if (bub.text !== 'Chest (pectoralis major), target. Pushes the handles away; hardest as the arms straighten.' || bub.name !== 'Chest') errors.push(`${tag} A13: bubble text "${bub.text}" (bold "${bub.name}")`);
        if (bub.dot !== bub.want) errors.push(`${tag} A13: dot ${bub.dot}, muscle colour ${bub.want}`);
        const hotPts = await page.locator('dialog[open] .scene .hot:not(.hot-core)[data-muscle="chest"]').getAttribute('points');
        if (bub.sel.length !== 1 || bub.sel[0] !== `mm sel ${hotPts}`) errors.push(`${tag} A13: .sel outline on ${JSON.stringify(bub.sel)}`);
      }
      await page.screenshot({ path: `${OUT}/silent-black-gu7a-muscle.png` });
      // A tap on the bubble itself keeps it (the demo's tapStage guard); a second tap on the muscle closes it.
      await page.locator('dialog[open] .bubble').click(); await page.waitForTimeout(150);
      if (!(await page.locator('dialog[open] .bubble').count())) errors.push(`${tag} A13: a tap on the bubble closed it`);
      await tapHot('chest');
      if (await page.locator('dialog[open] .bubble').count()) errors.push(`${tag} A13: a second tap on the chest did not close the bubble`);
      // A tap on the stage background closes a muscle bubble.
      await tapHot('triceps');
      const stBox = await page.locator('dialog[open] .stage').boundingBox();
      await page.mouse.click(stBox.x + stBox.width - 20, stBox.y + stBox.height / 2); await page.waitForTimeout(150);
      if (await page.locator('dialog[open] .bubble').count()) errors.push(`${tag} A13: a tap on the stage background did not close the muscle bubble`);
      await tapHot('triceps');
      await page.locator('dialog[open] .chips button').nth(0).click(); await page.waitForTimeout(150);
      const zb = await page.locator('dialog[open] .bubble').textContent().catch(() => null);
      if (zb !== 'Hold the middle of the handle. Wrists straight, not bent back.') errors.push(`${tag} A13: the chip did not replace the muscle bubble ("${zb}")`);
      if (await page.locator('dialog[open] .sel').count()) errors.push(`${tag} A13: the outline stayed after a zoom chip`);
      await page.locator('dialog[open] .chips button').nth(0).click(); await page.waitForTimeout(150);
      if (await page.locator('dialog[open] .bubble').count()) errors.push(`${tag} A13: a second chip tap left a bubble`);
      // Pictures: 4 tiles with the demo captions, no hotspot inside.
      await page.locator('dialog[open] .seg button', { hasText: 'Pictures' }).click(); await page.waitForTimeout(150);
      const pics = await page.evaluate(() => ({ tiles: [...document.querySelectorAll('dialog[open] .pics .tile p')].map(p => p.textContent), hot: document.querySelectorAll('dialog[open] .pics .hot').length, hint: document.querySelector('dialog[open] .hint').textContent }));
      if (pics.tiles.join('|') !== 'Setup: handles at mid-chest|Press straight out|Arms almost straight, no lock|Back slowly, 2 s' || pics.hot || pics.hint !== 'Four key moments of one rep.') errors.push(`${tag} A6: Pictures ${JSON.stringify(pics)}`);
      await page.screenshot({ path: `${OUT}/silent-black-gu7a-pictures.png` });
      // Closing the sheet cancels every animation.
      await page.getByRole('button', { name: 'Close', exact: true }).click(); await page.waitForTimeout(600);
      const left = await page.evaluate(() => ({ n: window.__fgAnims.length, live: window.__fgAnims.filter(a => a.playState !== 'idle').length, open: !!document.querySelector('.form-guide') }));
      if (!left.n || left.live || left.open) errors.push(`${tag} A4: closing left ${left.live} of ${left.n} animations alive (guide still open: ${left.open})`);
    }
    await ctx.close();
  }

  // A7 and A13 on narrow phones (review of 25b05f6): the controls and the hotspots at 320 and 360 px.
  for (const w of [320, 360]) {
    const { ctx, page } = await open('silent-black', { viewport: { width: w, height: 740 } });
    await startSession(page);
    if (!(await openGuide(page))) errors.push(`${tag} ${w} px: the guide did not open`);
    else {
      await fitProbe(page, `${w} px`);
      await hotProbe(page, `${w} px`);
      await page.screenshot({ path: `${OUT}/silent-black-gu7a-guide-${w}.png` });
    }
    await ctx.close();
  }

  // A6: reduced motion shows Pictures only, with zero animate() calls, and says why.
  {
    const { ctx, page } = await open('silent-black', { reducedMotion: 'reduce' });
    await startSession(page);
    if (!(await openGuide(page))) errors.push(`${tag} A6: the guide did not open under reduced motion`);
    else {
      const rm = await page.evaluate(() => ({ calls: window.__fgAnims.length, tiles: document.querySelectorAll('dialog[open] .pics:not([hidden]) .tile').length, scene: getComputedStyle(document.querySelector('dialog[open] .scene')).display, hint: document.querySelector('dialog[open] .hint').textContent, anim: document.querySelector('dialog[open] .seg.mode button').disabled, play: document.querySelector('dialog[open] .controls .btn-icon').disabled }));
      if (rm.calls || rm.tiles !== 4 || rm.scene !== 'none' || rm.hint !== 'Pictures shown because your phone is set to reduce motion.' || !rm.anim || !rm.play) errors.push(`${tag} A6: reduced motion ${JSON.stringify(rm)}`);
      await page.screenshot({ path: `${OUT}/silent-black-gu7a-reduced.png` });
      await page.locator('dialog[open] .chips button').nth(1).click(); await page.waitForTimeout(150);
      const st = await page.evaluate(() => ({ calls: window.__fgAnims.length, still: document.querySelectorAll('dialog[open] .scene.still .st-arm').length, cap: document.querySelector('dialog[open] .cap').textContent }));
      if (st.calls || st.still !== 1 || st.cap !== 'Arms almost straight, no lock') errors.push(`${tag} A6: the Path still under reduced motion ${JSON.stringify(st)}`);
    }
    await ctx.close();
  }

  // A9: a failed chunk load keeps the sheet open with one line and Reload.
  {
    // The service worker would serve the precached chunk around page.route, so it is blocked here.
    const { ctx, page } = await open('silent-black', { reducedMotion: 'reduce', serviceWorkers: 'block' });
    await page.route(/FormGuidePlayer-.*\.js$/, r => r.abort());
    await startSession(page);
    await howButton(page, 0).click();
    if (!(await visible(page.locator('dialog[open] .hint', { hasText: 'Demo could not load.' })))) errors.push(`${tag} A9: no "Demo could not load." line after a failed chunk`);
    else {
      const f = await page.evaluate(() => ({ title: document.querySelector('dialog[open] h2')?.textContent, reload: [...document.querySelectorAll('dialog[open] button')].some(b => b.textContent === 'Reload') }));
      if (f.title !== 'How to do it: Machine Chest Press' || !f.reload) errors.push(`${tag} A9: failure sheet ${JSON.stringify(f)}`);
      await page.waitForTimeout(500);
      if (!(await page.locator('dialog[open] .hint', { hasText: 'Demo could not load.' }).isVisible())) errors.push(`${tag} A9: the sheet closed after a failed chunk`);
      await page.screenshot({ path: `${OUT}/silent-black-gu7a-load-failed.png` });
    }
    await ctx.close();
  }
}

// FG-4: the ExerciseGuide player on the lateral raise. A2 the main chunk holds no form-guide code, the player chunk is at
// most 150 KB gzip and the exercise is its own chunk; A1 it plays in the Train sheet: the three reps are one chained
// 12 s timeline (a keyframe set per rep), the figure moves, the dumbbell shows the last logged set; the mistake chip
// mounts the second figure only while on; A3 reduced motion = Pictures with zero animate() calls; A4 screenshots in
// Silent Black and Paper at 390 px; A5 the four snapshots paint in all five themes and regenerate on a data-theme change.
{
  const tag = 'FG-4';
  const { gzipSync } = await import('node:zlib');
  const assets = join(ROOT, 'www/assets');
  const files = readdirSync(assets);
  const player = files.find(f => /^FormGuidePlayer-.*\.js$/.test(f));
  const exChunk = files.find(f => /^lib_dumbbell_lateral_raise-.*\.js$/.test(f));
  for (const f of files.filter(f => /^index-.*\.js$/.test(f))) {
    const text = readFileSync(join(assets, f), 'utf8');
    for (const probe of ['fg-fig', 'transform-box:view-box', 'Dip, shrug and drop', 'data:image/svg+xml;charset=utf-8,']) if (text.includes(probe)) errors.push(`${tag} A2: ${f} (main chunk) holds form-guide code ("${probe}")`);
    console.log(`${tag} A2: ${f} ${text.length} B raw, ${gzipSync(readFileSync(join(assets, f))).length} B gzip`);
  }
  if (!player || !exChunk) errors.push(`${tag} A2: missing chunk (player ${player}, lateral raise ${exChunk})`);
  else {
    const p = readFileSync(join(assets, player)), e = readFileSync(join(assets, exChunk));
    const gz = gzipSync(p).length;
    console.log(`${tag} A2: ${player} ${p.length} B raw, ${gz} B gzip (cap ${150 * 1024}); ${exChunk} ${e.length} B raw, ${gzipSync(e).length} B gzip`);
    if (gz > 150 * 1024) errors.push(`${tag} A2: ${player} is ${gz} B gzip, over the 150 KB cap`);
    if (p.includes('Dip, shrug and drop')) errors.push(`${tag} A2: the lateral raise data is inside the player chunk, not its own`);
  }

  const seed = ([t]) => {
    const orig = Element.prototype.animate;
    window.__fgAnims = [];
    Element.prototype.animate = function (...a) { const an = orig.apply(this, a); if (this.closest?.('.form-guide')) window.__fgAnims.push(an); return an; };
    if (localStorage.getItem('marc.state.v1')) return;
    localStorage.setItem('marc.theme', t);
    const now = new Date().toISOString(), day = new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10);
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [{ id: 'sp1', name: 'Shoulders', color: '#6aa9ff', focus: [], createdAt: now, exercises: [{ exerciseId: 'lib_dumbbell_lateral_raise', sets: 3 }] }],
      schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [{ id: 's1', splitId: 'sp1', splitName: 'Shoulders', day, startedAt: `${day}T17:00:00.000Z`, endedAt: `${day}T17:30:00.000Z`, durationSec: 1800,
        exercises: [{ exerciseId: 'lib_dumbbell_lateral_raise', name: 'Dumbbell Lateral Raise', sets: [{ kg: 8, reps: 12 }, { kg: 9, reps: 10 }, { kg: 2, reps: 15, kind: 'warmup' }] }],
        logging: { mode: 'live', trainedAt: `${day}T17:00:00.000Z`, trainedEndAt: `${day}T17:30:00.000Z`, loggedAt: `${day}T17:30:00.000Z`, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } }],
      active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: false, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  };
  const open = async (theme, opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ...opts });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag} ${theme}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} ${theme} console: ${m.text()}`); });
    await page.addInitScript(seed, [theme]);
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav'); await launchGone(page);
    await page.waitForTimeout(300);
    await page.locator('nav.nav button', { hasText: 'Train' }).click(); await page.waitForTimeout(200);
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
    if (await page.getByRole('button', { name: /^Start / }).first().isVisible().catch(() => false)) { await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300); }
    // UI-2: the button lives on the open card's Why-this-target row, not the "..." sheet.
    await page.locator('.card.exercise').nth(0).locator('.btn-how-to').click();
    const ok = await visible(page.locator('dialog[open] .form-guide .player'));
    if (!ok) errors.push(`${tag} ${theme}: the lateral raise guide did not open`);
    return { ctx, page, ok };
  };
  const seek = (page, ms) => page.evaluate(ms => { for (const a of window.__fgAnims) if (a.playState !== 'idle') { a.pause(); a.currentTime = ms; } return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, ms);
  const fig = (page) => page.evaluate(() => [...document.querySelectorAll('dialog[open] .fg4-scene .fg-fig')].length);
  const shoulder = (page) => page.evaluate(() => getComputedStyle(document.querySelector('dialog[open] .fg4-scene .j-shoulder_r')).transform);
  // A5: every tile image decodes and paints: pixels differing from the tile's own corner colour.
  const tilesPaint = (page) => page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('dialog[open] .pics .tile img')];
    const out = [];
    for (const img of imgs) {
      await img.decode().catch(() => {});
      const c = document.createElement('canvas'); c.width = 169; c.height = 176;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      let ink = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) ink++;
      out.push({ ok: img.naturalWidth > 0, ink, vars: decodeURIComponent(img.src).includes('var(') });
    }
    return out;
  });

  for (const theme of themes) {
    const { ctx, page, ok } = await open(theme);
    if (!ok) { await ctx.close(); continue; }
    const title = await page.locator('dialog[open] h2').textContent();
    if (title !== 'How to do it: Dumbbell Lateral Raise') errors.push(`${tag} ${theme}: sheet title "${title}"`);
    // A5: the four moments as token-resolved images, non-blank, in this theme.
    await page.locator('dialog[open] .seg button', { hasText: 'Pictures' }).click(); await page.waitForTimeout(200);
    const shots = await tilesPaint(page);
    if (shots.length !== 4 || shots.some(s => !s.ok || s.ink < 2000 || s.vars)) errors.push(`${tag} ${theme} A5: snapshots ${JSON.stringify(shots)}`);
    if (theme === 'silent-black' || theme === 'paper') await page.screenshot({ path: `${OUT}/${theme}-fg4-pictures.png` });
    await page.locator('dialog[open] .seg button', { hasText: 'Animation' }).click(); await page.waitForTimeout(200);

    if (theme === 'silent-black' || theme === 'paper') {
      // A4: phone width, start pose and the top of rep 1; compare mode.
      const fit = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, p: document.querySelector('dialog[open] .form-guide .player').getBoundingClientRect().right, d: document.querySelector('dialog[open] .sheet-panel').getBoundingClientRect().right }));
      if (fit.sw > 390 || fit.p > fit.d + 0.5) errors.push(`${tag} ${theme} A4: the player does not fit 390 px (${JSON.stringify(fit)})`);
      await seek(page, 0); await page.screenshot({ path: `${OUT}/${theme}-fg4-guide-t0.png` });
      await seek(page, 1000); await page.screenshot({ path: `${OUT}/${theme}-fg4-guide-top.png` });
      await seek(page, 0);
    }

    if (theme === 'silent-black') {
      // A1: one figure, the load of the last logged working set (9 kg; the warm-up does not count), the chained timeline.
      if (await fig(page) !== 1) errors.push(`${tag} A1: expected one figure before the mistake chip, got ${await fig(page)}`);
      const label = await page.evaluate(() => [...document.querySelectorAll('dialog[open] .fg4-scene text')].map(t => t.textContent.trim()));
      if (label.join() !== '9,KG,9,KG') errors.push(`${tag} A1: dumbbell labels ${JSON.stringify(label)}, want the last logged set 9 KG`);
      const camLabel = await page.locator('dialog[open] .cam-label').textContent();
      if (camLabel !== 'Front view · 9 kg') errors.push(`${tag} A1: camera label "${camLabel}"`);
      const s0 = await shoulder(page);
      await page.locator('dialog[open] .form-guide').getByRole('button', { name: 'Play', exact: true }).click(); await page.waitForTimeout(200);
      const t = await page.evaluate(() => window.__fgAnims.map(a => { const x = a.effect.getTiming(); return `${a.playState} ${x.duration} ${x.iterations} ${x.easing} ${x.fill}`; }));
      if (!t.length || t.some(s => s !== 'running 12000 1 linear both')) errors.push(`${tag} A1: expected every animation "running 12000 1 linear both", got ${JSON.stringify([...new Set(t)])}`);
      // Rep 3 lifts slower than rep 1 (movement.slowdown): the shoulder is lower at the same point of its rep.
      const abdAt = async (ms) => { await seek(page, ms); return shoulder(page); };
      const top1 = await abdAt(1000), top3 = await abdAt(9000);
      if (top1 === s0) errors.push(`${tag} A1: the figure did not move (${s0} at 0 and 1 s)`);
      if (top1 === top3) errors.push(`${tag} A1: rep 3 is the same keyframe set as rep 1 (no slow-down)`);
      await page.evaluate(() => { for (const a of window.__fgAnims) a.play(); });
      const cap = await page.locator('dialog[open] .cap').textContent();
      if (!/^(Lift|Hold|Lower slowly|Reset), /.test(cap ?? '')) errors.push(`${tag} A1: caption while playing "${cap}"`);
      // Mistake chip: the second figure mounts, joins the clock, and leaves again with its animations cancelled.
      const nBefore = await page.evaluate(() => window.__fgAnims.length);
      await page.locator('dialog[open] .chips button', { hasText: 'Mistake' }).click(); await page.waitForTimeout(250);
      const on = await page.evaluate((n) => ({ figs: document.querySelectorAll('dialog[open] .fg4-scene .fg-fig').length, pressed: [...document.querySelectorAll('dialog[open] .chips button')].find(b => b.textContent === 'Mistake').getAttribute('aria-pressed'), added: window.__fgAnims.slice(n).map(a => `${a.playState} ${Math.abs(a.currentTime - window.__fgAnims[0].currentTime) < 50}`), hint: document.querySelector('dialog[open] .hint').textContent }), nBefore);
      if (on.figs !== 2 || on.pressed !== 'true' || !on.added.length || on.added.some(s => s !== 'running true')) errors.push(`${tag} A1 mistake on: ${JSON.stringify(on)}`);
      if (!on.hint.startsWith('Dip, shrug and drop: ')) errors.push(`${tag} A1 mistake on: hint "${on.hint}"`);
      await seek(page, 1300); await page.screenshot({ path: `${OUT}/silent-black-fg4-compare.png` });
      await page.evaluate(() => { for (const a of window.__fgAnims) if (a.playState !== 'idle') a.play(); });
      await page.locator('dialog[open] .chips button', { hasText: 'Mistake' }).click(); await page.waitForTimeout(250);
      const off = await page.evaluate((n) => ({ figs: document.querySelectorAll('dialog[open] .fg4-scene .fg-fig').length, idle: window.__fgAnims.slice(n).every(a => a.playState === 'idle') }), nBefore);
      if (off.figs !== 1 || !off.idle) errors.push(`${tag} A1 mistake off: ${JSON.stringify(off)}`);
      // The end of rep 3: Replay, and the figure is back on the start pose.
      await page.evaluate(() => { for (const a of window.__fgAnims) if (a.playState !== 'idle') a.currentTime = 11990; });
      await page.waitForTimeout(400);
      const end = await page.evaluate(() => ({ btn: document.querySelector('dialog[open] .controls .btn-icon').getAttribute('aria-label'), cap: document.querySelector('dialog[open] .cap').textContent }));
      if (end.btn !== 'Replay' || end.cap !== 'Done. Tap Replay to watch again.') errors.push(`${tag} A1: end of 3 reps ${JSON.stringify(end)}`);
      if (await shoulder(page) !== s0) errors.push(`${tag} A1: after 3 reps the shoulder is ${await shoulder(page)}, not the start pose ${s0}`);
      // A theme change while paused mid-run remounts the figure on the start pose and resets the rep pill and caption.
      await page.locator('dialog[open] .form-guide').getByRole('button', { name: 'Replay', exact: true }).click(); await page.waitForTimeout(150);
      await seek(page, 5000);
      await page.locator('dialog[open] .form-guide').getByRole('button', { name: 'Pause', exact: true }).click(); await page.waitForTimeout(150);
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'ember')); await page.waitForTimeout(250);
      const mid = await page.evaluate(() => ({ pill: document.querySelector('dialog[open] .pill')?.textContent, cap: document.querySelector('dialog[open] .cap').textContent, btn: document.querySelector('dialog[open] .controls .btn-icon').getAttribute('aria-label') }));
      if (mid.pill !== 'Rep 1 of 3' || mid.cap !== 'Tap Play to watch 3 slow reps.' || mid.btn !== 'Play') errors.push(`${tag} A1: theme change while paused mid-run ${JSON.stringify(mid)}`);
      if (await shoulder(page) !== s0) errors.push(`${tag} A1: after a theme change the shoulder is ${await shoulder(page)}, not the start pose ${s0}`);
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'silent-black')); await page.waitForTimeout(250);
      // A5: the pictures regenerate on a data-theme change (the next theme's tokens, new images).
      await page.locator('dialog[open] .seg button', { hasText: 'Pictures' }).click(); await page.waitForTimeout(200);
      const before = await page.evaluate(() => [...document.querySelectorAll('dialog[open] .pics .tile img')].map(i => i.src));
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'paper')); await page.waitForTimeout(250);
      const after = await page.evaluate(() => [...document.querySelectorAll('dialog[open] .pics .tile img')].map(i => i.src));
      if (after.length !== 4 || after.some((s, i) => s === before[i])) errors.push(`${tag} A5: the pictures did not regenerate on a data-theme change`);
      const shots2 = await tilesPaint(page);
      if (shots2.some(s => !s.ok || s.ink < 2000 || s.vars)) errors.push(`${tag} A5 after the theme change: ${JSON.stringify(shots2)}`);
      // Closing the sheet cancels every animation.
      await page.getByRole('button', { name: 'Close', exact: true }).click(); await page.waitForTimeout(600);
      const left = await page.evaluate(() => ({ n: window.__fgAnims.length, live: window.__fgAnims.filter(a => a.playState !== 'idle').length, open: !!document.querySelector('.form-guide') }));
      if (!left.n || left.live || left.open) errors.push(`${tag} A1: closing left ${left.live} of ${left.n} animations alive (open ${left.open})`);
    }
    await ctx.close();
  }

  // A3: reduced motion shows Pictures only, with zero animate() calls; the mistake chip swaps the pictures.
  {
    const { ctx, page, ok } = await open('paper', { reducedMotion: 'reduce' });
    if (ok) {
      const rm = await page.evaluate(() => ({ calls: window.__fgAnims.length, tiles: document.querySelectorAll('dialog[open] .pics .tile img').length, scene: getComputedStyle(document.querySelector('dialog[open] .fg4-scene')).display, hint: document.querySelector('dialog[open] .hint').textContent, anim: document.querySelector('dialog[open] .seg.mode button').disabled, play: document.querySelector('dialog[open] .controls .btn-icon').disabled }));
      if (rm.calls || rm.tiles !== 4 || rm.scene !== 'none' || rm.hint !== 'Pictures shown because your phone is set to reduce motion.' || !rm.anim || !rm.play) errors.push(`${tag} A3: reduced motion ${JSON.stringify(rm)}`);
      const shots = await tilesPaint(page);
      if (shots.some(s => !s.ok || s.ink < 2000)) errors.push(`${tag} A3: reduced-motion pictures ${JSON.stringify(shots)}`);
      await page.screenshot({ path: `${OUT}/paper-fg4-reduced.png` });
      await page.locator('dialog[open] .chips button', { hasText: 'Mistake' }).click(); await page.waitForTimeout(200);
      const m = await page.evaluate(() => ({ calls: window.__fgAnims.length, caps: [...document.querySelectorAll('dialog[open] .pics .tile p')].map(p => p.textContent) }));
      if (m.calls || m.caps.length !== 4 || !m.caps.every(c => c.startsWith('Mistake: '))) errors.push(`${tag} A3: mistake pictures ${JSON.stringify(m)}`);
      await page.locator('dialog[open] .chips button', { hasText: 'Zoom' }).click(); await page.waitForTimeout(200);
      const st = await page.evaluate(() => ({ calls: window.__fgAnims.length, still: !!document.querySelector('dialog[open] .fg4-still')?.naturalWidth }));
      if (st.calls || !st.still) errors.push(`${tag} A3: the zoom still under reduced motion ${JSON.stringify(st)}`);
    }
    await ctx.close();
  }
}

// BUG-17 (RECOVERY-F1): a muscle with more than 120 h still to go reads "5+ days" on Today, the
// Body ready-time tile and the muscle panel's Ready label, never "under 1h". Seed: a novice (no
// training start), squat to max for 10 sets of 12 on three days in a row, the last ending 1.5 h ago.
{
  const tag = 'BUG-17 5+ days';
  const pinned = new Date(); pinned.setHours(12, 0, 0, 0);
  const sq = (hoursAgo) => {
    const at = pinned.getTime() - hoursAgo * 3_600_000, d = new Date(at);
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const s0 = new Date(at).toISOString(), s1 = new Date(at + 1_800_000).toISOString();
    return { id: `b17-${hoursAgo}`, splitId: 'sp1', splitName: 'Legs', day, startedAt: s0, endedAt: s1, durationSec: 1800, gymId: 'gym_default',
      exercises: [{ exerciseId: 'lib_barbell_back_squat', name: 'Barbell Back Squat', sets: Array.from({ length: 10 }, () => ({ kg: 100, reps: 12, effort: 'max' })) }],
      logging: { mode: 'live', trainedAt: s0, trainedEndAt: s1, loggedAt: s1, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] } };
  };
  const now = new Date().toISOString();
  const json = JSON.stringify({
    version: 1, createdAt: now, profile: { name: 'Marc' }, goal: 'lean', splits: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
    sessions: [sq(50), sq(26), sq(2)], active: null, customExercises: [],
    preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
    body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
    onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
  });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  await page.addInitScript(([j]) => { localStorage.setItem('marc.state.v1', j); localStorage.setItem('marc.theme', 'silent-black'); }, [json]);
  await page.clock.install({ time: pinned.getTime() });
  await page.goto(`http://localhost:${PORT}/`);
  await page.waitForSelector('.nav'); await launchGone(page);
  await page.waitForTimeout(250);
  if (await page.getByRole('button', { name: 'Later' }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Later' }).click(); await page.waitForTimeout(150); }
  const todayRow = await page.evaluate(() => [...document.querySelectorAll('[data-palace="today.recovery"] .row-between')].find(r => r.children[0]?.textContent === 'Quads')?.children[1]?.textContent ?? null);
  if (!todayRow?.endsWith('· 5+ days')) errors.push(`${tag}: Today's Quads row reads ${JSON.stringify(todayRow)}, expected "N% · 5+ days"`);
  await page.locator('nav.nav button', { hasText: 'Body' }).click(); await page.waitForTimeout(300);
  const tile = await page.evaluate(() => [...document.querySelectorAll('button.rt-tile')].find(t => t.querySelector('.rt-tile-name')?.textContent === 'Quads')?.textContent ?? null);
  if (!tile?.includes('5+ days')) errors.push(`${tag}: Body's Quads tile reads ${JSON.stringify(tile)}, expected "5+ days"`);
  await page.locator('.seg button', { hasText: 'Levels' }).click(); await page.waitForTimeout(200);
  await page.locator('.list-row', { hasText: 'Quads' }).first().click(); await page.waitForTimeout(300);
  const tl = await page.evaluate(() => [...document.querySelectorAll('dialog.sheet[open] .mtl-tl-col')].map(c => [c.querySelector('.mtl-tl-key')?.textContent, c.querySelector('.mtl-tl-val')?.textContent]));
  const ready = tl.find(([k]) => k === 'Ready')?.[1];
  if (ready !== '5+ days') errors.push(`${tag}: the muscle panel's Ready label reads ${JSON.stringify(ready)} (timeline ${JSON.stringify(tl)}), expected "5+ days"`);
  await ctx.close();
}

// UI-2: the "How to do it" button lives on the open card's Why-this-target row. A4 accent styling,
// a 44px tap target, in Silent Black and Paper at 360px; A5 never on a collapsed card, and does not
// push the set rows off screen at 360px.
{
  const tag = 'UI-2';
  const seed = (t) => {
    localStorage.setItem('marc.theme', t);
    const now = new Date().toISOString();
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now, profile: { name: 'Marc', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 },
      goal: 'lean', splits: [{ id: 'sp1', name: 'Upper', color: '#6aa9ff', focus: [], createdAt: now, exercises: [{ exerciseId: 'lib_dumbbell_lateral_raise', sets: 2 }, { exerciseId: 'lib_barbell_bench_press', sets: 2 }] }],
      schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      sessions: [], active: null, customExercises: [],
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: false, haptics: true, reminders: { enabled: false, time: '17:30', style: 'silent' }, showSpark: true, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: [],
    }));
  };
  for (const theme of ['silent-black', 'paper']) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${tag} ${theme}: ${e.message}`));
    await page.addInitScript(seed, theme);
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForSelector('.nav'); await launchGone(page);
    await page.waitForTimeout(300);
    await page.locator('nav.nav button', { hasText: 'Train' }).click(); await page.waitForTimeout(200);
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    if (await page.getByRole('button', { name: 'Skip', exact: true }).isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Skip', exact: true }).click(); await page.waitForTimeout(300); }
    if (await page.getByRole('button', { name: /^Start / }).first().isVisible().catch(() => false)) { await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300); }
    const cards = page.locator('.card.exercise');
    // A1/A2: entry 0 (lateral raise, guided) is open by default and shows the button; entry 1 (bench press, no guide) does not, once opened.
    const btn0 = cards.nth(0).locator('.btn-how-to');
    // A1: entry 0 (lateral raise, guided) is open by default and shows the button.
    if (!(await visible(btn0))) errors.push(`${tag} ${theme} A1: no button on the open guided card`);
    // Single accordion: opening entry 1 (bench press, no guide) closes entry 0 — neither should show the
    // button once entry 0's close transition (240ms + 60ms grace, motion.ts DUR.enter) has settled.
    await cards.nth(1).locator('.ex-head').click(); await page.waitForTimeout(500);
    if (await cards.nth(1).locator('.btn-how-to').count()) errors.push(`${tag} ${theme} A2: a button shows for an exercise with no guide`);
    if (await cards.nth(0).locator('.btn-how-to').count()) errors.push(`${tag} ${theme} A5: the button stayed on the now-collapsed guided card`);
    // Reopen entry 0 (closes entry 1) for the styling and layout checks below.
    await cards.nth(0).locator('.ex-head').click(); await page.waitForTimeout(300);
    // A4: accent styling and a 44px tap target.
    const style = await btn0.evaluate(el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { h: r.height, bg: cs.backgroundColor, color: cs.color }; });
    if (style.h < 44) errors.push(`${tag} ${theme} A4: button is ${style.h}px tall, under 44`);
    if (style.bg === 'rgba(0, 0, 0, 0)' || style.bg === style.color) errors.push(`${tag} ${theme} A4: no visible accent fill (${JSON.stringify(style)})`);
    // A5: no horizontal overflow, the set rows still on screen, at 360px.
    const fit = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, row: document.querySelector('.card.exercise.active .set-grid')?.getBoundingClientRect() ?? null }));
    if (fit.sw > 360) errors.push(`${tag} ${theme} A5: page scrolls horizontally at 360px (scrollWidth ${fit.sw})`);
    if (!fit.row || fit.row.right > 360 + 0.5) errors.push(`${tag} ${theme} A5: the set rows are pushed off screen (${JSON.stringify(fit.row)})`);
    if (theme === 'silent-black' || theme === 'paper') await page.screenshot({ path: `${OUT}/${theme}-ui2-how-to-button.png` });
    await ctx.close();
  }
}

await browser.close();
stopping = true;
server.kill();
if (errors.length) { console.error('Page errors:', errors); process.exit(1); }
console.log('Screenshot gate PASS: 5 themes, no page errors, legacy import verified, crash containment and backup round trip verified, rest clock off-screen and 360 px set grid verified, watch stub verified, plate sense verified, palace verified, escobar verified (Apply, Undo in window, Undo gone after 8 s), heart line verified, reorder verified, service worker offline reload and build-B chunk carry-over verified, R6 day off, setup note, warm-ups and CSV row verified, F12 share sheet on all three entry points, PNG export at 9:16 and 1:1, and its buttons on screen at 360 and 390 px with 0/24/48 px safe areas verified, motion smoke and determinism verified (F5), O3 ready-times ring tiles (grouping, tap open/close/switch, muscle panel, one-column fallback, edge cases), and O2 muscle panel (recovery timeline, facts, live Add, never-trained) verified, and UI-2 "How to do it" button (open card only, accent styling, 44px target, no 360px overflow) verified.');

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const ROOT = '/home/user/M-arc';
const OUT = `${ROOT}/website/renders/shots`;
mkdirSync(OUT, { recursive: true });
const PORT = '4179';
const server = spawn(process.execPath, [`${ROOT}/node_modules/vite/bin/vite.js`, 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
process.on('exit', () => { try { server.kill('SIGKILL'); } catch {} });
// A stale server on the port would answer the readiness probe with the wrong app, so a preview that cannot bind fails the run.
server.stderr.on('data', (d) => process.stderr.write(`[preview] ${d}`));
server.on('exit', (code) => { if (code) { console.error(`preview server exited with ${code}`); process.exit(1); } });
for (let i = 0; ; i++) { try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) break; } catch {} if (i > 120) { console.error('no server'); process.exit(1); } await new Promise(r => setTimeout(r, 250)); }

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
// The schedule follows the capture date, so Today is a Push day whenever the shots are taken: push today, pull two days on, legs four days on.
// The newest session (offset 1, a push) is yesterday; it lands in the capture week unless the capture runs on a Monday (the app's week starts on Monday).
// The app's clock is fixed at 14:00 on the capture date (timers keep running), so readiness and the recovery rings read the same whatever hour the script runs.
const CLOCK = new Date(); CLOCK.setHours(14, 0, 0, 0);
const WD = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const wd = new Date().getDay();
const schedule = { days: Object.fromEntries(WD.map((k, n) => [k, n === wd ? 'push' : n === (wd + 2) % 7 ? 'pull' : n === (wd + 4) % 7 ? 'legs' : null])) };
if (wd === 1) console.warn('capture on a Monday: the Today week row will read 0 workouts because yesterday is in last week');
const legacy = {
  days: {}, money: { available: 0, savings: 0, weeklyLimit: 0, currency: 'AUD', transactions: [] },
  workouts: { completedExercises: completed, sessions: [], timedSessions: timed, customSplits: [], custom: {}, dayNames: {}, hiddenBaseSplits: [], trainingProgram: 'lean' },
  trainingSchedule: schedule,
  notifications: { trainingEnabled: true, trainingTime: '17:30', trainingStyle: 'silent' },
  preferences: { units: { weight: 'kg' } }, user: { profile: { displayName: 'Marc', bodyWeightKg: 78 } },
};
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
for (const theme of ['silent-black', 'paper', 'ember', 'emerald', 'midnight']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(CLOCK);
  page.on('pageerror', e => console.error('pageerror', theme, e.message));
  await page.addInitScript(([legacyJson, t]) => { localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  await page.locator('nav.nav').waitFor({ timeout: 20000 });
  await page.waitForFunction(() => !document.getElementById('launch'), null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  for (const name of [/^Later$/, /^Not now$/, /^Skip$/]) { const b = page.getByRole('button', { name }); if (await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(400); break; } }
  await page.waitForTimeout(3400);
  // The floating Ask Escobar pill slides away on a downward scroll (src/ui/hideOnScroll.ts, 8px of travel), so every shot scrolls exactly 8px first: the pill is clear and the screen keeps its eyebrow labels whole (16px cut their cap line).
  const shot = async (n, y = 8) => { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(400); await page.screenshot({ path: `${OUT}/${theme}-${n}.png` }); };
  await shot('today');
  for (const [label, n] of [[/^(Train|Live)$/, 'train'], ['Body', 'body'], ['History', 'history'], ['Escobar', 'escobar']]) {
    await page.locator('nav.nav button', { hasText: label }).click(); await page.waitForTimeout(700); await shot(n);
  }
  await page.locator('nav.nav button', { hasText: 'Today' }).click(); await page.waitForTimeout(400);
  const gear = page.locator('button[aria-label*="Settings" i], button:has-text("Settings")').first();
  if (await gear.isVisible().catch(() => false)) { await gear.click(); await page.waitForTimeout(700); await shot('settings'); }
  console.log('done', theme);
  await ctx.close();
}
await browser.close(); server.kill('SIGKILL'); process.exit(0);

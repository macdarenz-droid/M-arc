// Visual and migration gate: builds must already exist in www/. Boots the app
// with realistic data in the previous app's storage format, walks every screen
// in all five themes, saves screenshots as evidence and fails on any page error.
// Run: node scripts/screenshot-gate.mjs   (set MARC_CHROMIUM to a chrome binary to skip the bundled one)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'screenshots');
mkdirSync(OUT, { recursive: true });
const PORT = process.env.MARC_GATE_PORT || '4173';
const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--configLoader', 'runner', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
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

// Share one clock and timezone across fixtures and every browser context.
// Timers still run normally; only Date is fixed. A morning run must not turn
// a saved near miss into a future workout that the Coach correctly excludes.
const fixtureNow = new Date(process.env.MARC_GATE_NOW || '2026-09-21T18:30:00.000Z');
if (!Number.isFinite(fixtureNow.getTime())) throw new Error('Invalid MARC_GATE_NOW');
// Realistic legacy data so the migration path is exercised end to end.
const day = (offset) => { const d = new Date(fixtureNow); d.setUTCDate(d.getUTCDate() - offset); return d.toISOString().slice(0, 10); };
const iso = (offset, h = 17) => { const d = new Date(fixtureNow); d.setUTCDate(d.getUTCDate() - offset); d.setUTCHours(h, 30, 0, 0); return d.toISOString(); };
const rec = (i, offset, dayKey, name, type, muscle, sets, kg0) => ({ id: `r${i}`, day: dayKey, dayKey: day(offset), name, type, muscle, finalizedAt: iso(offset), sets: Array.from({ length: sets }, (_, k) => ({ kg: kg0, reps: 8 + (k % 2), effort: k === sets - 1 ? 'max' : 'ideal' })) });
const completed = [];
let i = 0;
const pushDays = [1, 4, 8, 11, 15, 18, 22, 25, 29, 32, 36, 43, 50];
const pullDays = [2, 6, 9, 13, 16, 20, 23, 27, 34, 41, 48];
const legDays = [3, 7, 10, 14, 17, 21, 24, 28, 35, 42, 49];
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
async function gateContext(options) {
  const context = await browser.newContext({ ...options, timezoneId: 'UTC' });
  await context.clock.setFixedTime(fixtureNow);
  return context;
}
const themes = ['silent-black', 'paper', 'ember', 'emerald', 'midnight'];
const errors = [];
for (const theme of themes) {
  const ctx = await gateContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${theme}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${theme} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson, t]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', t); }, [JSON.stringify(legacy), theme]);
  await page.goto(`http://localhost:${PORT}/`);
  console.log(theme, 'loaded');
  await page.waitForSelector('.nav');
  await page.waitForTimeout(400);
  const shot = (name) => page.screenshot({ path: `${OUT}/${theme}-${name}.png` });
  // Scoped to the bottom tab bar, not the whole page: a card's own aria-label (a suggestion,
  // an insight, a session) can legitimately contain a tab's name as a substring — e.g. a
  // "Today: Legs" plan suggestion — and Playwright's role/name matching is substring by
  // default, so an unscoped lookup can match either one.
  const nav = page.getByRole('navigation', { name: 'Main' });
  await shot('today');
  if (theme === 'silent-black') {
    const reviewSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Week in review' }) });
    const reviewDetails = reviewSection.getByRole('button', { name: 'Details' });
    await reviewDetails.click();
    if (!(await reviewSection.innerText()).includes('prior')) errors.push('silent-black: closed-week details lacked a grounded prior-week comparison');
    await shot('week-review');
    await page.setViewportSize({ width: 360, height: 800 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: closed-week review overflows at 360px');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload(); await page.waitForSelector('.nav');
    const restoredReview = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Week in review' }) });
    if (await restoredReview.getByRole('button', { name: 'Details' }).getAttribute('aria-expanded') !== 'false') errors.push('silent-black: review Details state persisted across reload');
    const reviewState = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    reviewState.preferences.weightUnit = 'lb';
    const reviewLbCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const reviewLbPage = await reviewLbCtx.newPage();
    await reviewLbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(reviewState));
    await reviewLbPage.goto(`http://localhost:${PORT}/`); await reviewLbPage.waitForSelector('.nav');
    const lbReview = reviewLbPage.locator('section').filter({ has: reviewLbPage.getByRole('heading', { name: 'Week in review' }) });
    await lbReview.getByRole('button', { name: 'Details' }).click();
    if (!(await lbReview.innerText()).includes('lb')) errors.push('silent-black: closed-week volume did not render in lb');
    await reviewLbCtx.close();
    const ones = page.getByRole('tab', { name: '1', exact: true });
    await ones.nth(0).click(); await ones.nth(1).click(); await ones.nth(2).click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.getByText('A low morning', { exact: true }).waitFor();
    await shot('readiness');
  }
  await nav.getByRole('button', { name: /^Train|^Live/ }).click(); await page.waitForTimeout(250); await shot('train');
  if (theme === 'silent-black') {
    // Start a session and log a set for the live screenshot.
    await page.getByRole('button', { name: /^Start / }).first().click(); await page.waitForTimeout(300);
    const capturedTarget = await page.locator('.exercise .hint.ellipsis').first().innerText();
    await page.reload(); await page.waitForSelector('.exercise');
    if (await page.locator('.exercise .hint.ellipsis').first().innerText() !== capturedTarget) errors.push('silent-black: captured live target changed after reload');
    const rampText = page.getByText(/^Suggested ramp:/).first();
    if (!await rampText.count()) errors.push('silent-black: history-backed warm-up ramp was not shown');
    const beforeHide = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    await shot('warmup-ramp');
    await page.setViewportSize({ width: 360, height: 800 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: live session overflows at 360px');
    await page.setViewportSize({ width: 390, height: 844 });
    const liveState = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    liveState.preferences.weightUnit = 'lb';
    const lbCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const lbPage = await lbCtx.newPage();
    lbPage.on('pageerror', e => errors.push(`silent-black lb: ${e.message}`));
    await lbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(liveState));
    await lbPage.goto(`http://localhost:${PORT}/`); await lbPage.waitForSelector('.nav');
    const restored = await lbPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (!restored.active) errors.push('silent-black: active session missing from restored lb context');
    await lbPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await lbPage.waitForSelector('.exercise');
    const lbTarget = await lbPage.locator('.exercise .hint.ellipsis').first().innerText();
    if (!lbTarget.includes('lb')) errors.push(`silent-black: captured target did not render in lb (${lbTarget})`);
    const lbRamp = await lbPage.getByText(/^Suggested ramp:/).first().innerText().catch(() => '');
    if (!lbRamp.includes('lb')) errors.push(`silent-black: warm-up ramp did not render in lb (${lbRamp})`);
    await lbCtx.close();
    const hideWarmup = page.getByRole('button', { name: 'Hide warm-up' });
    await hideWarmup.focus(); await page.keyboard.press('Enter');
    if (await page.getByRole('button', { name: 'Hide warm-up' }).count()) errors.push('silent-black: warm-up remained after keyboard dismissal');
    const afterHide = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (afterHide.active?.warmupDismissed !== true) errors.push('silent-black: warm-up dismissal was not persisted');
    if (JSON.stringify(afterHide.active?.entries.map(entry => entry.sets.length)) !== JSON.stringify(beforeHide.active?.entries.map(entry => entry.sets.length))) errors.push('silent-black: warm-up dismissal changed live set counts');
    if (afterHide.sessions.length !== beforeHide.sessions.length) errors.push('silent-black: warm-up dismissal wrote workout history');
    await page.reload(); await page.waitForSelector('.exercise');
    if (await page.getByRole('button', { name: 'Hide warm-up' }).count()) errors.push('silent-black: hidden warm-up returned after reload');
    const inputs = page.locator('input[type="number"]');
    const targetKg = Number(await inputs.nth(0).getAttribute('placeholder'));
    const targetReps = Number(await inputs.nth(1).getAttribute('placeholder'));
    const oldSecondKg = await inputs.nth(2).getAttribute('placeholder');
    await inputs.nth(0).fill(String(targetKg)); await inputs.nth(1).fill(String(Math.max(1, targetReps - 2))); await inputs.nth(1).blur();
    await page.locator('.effort button.max').first().click();
    await page.getByRole('button', { name: 'Use this target' }).waitFor();
    await shot('live-adjustment');
    await page.getByRole('button', { name: 'Use this target' }).click();
    await page.getByText('Target updated for the remaining empty sets.', { exact: true }).waitFor();
    const newSecondKg = await inputs.nth(2).getAttribute('placeholder');
    if (!newSecondKg || newSecondKg === oldSecondKg) errors.push('silent-black: accepted live target did not change the next row placeholder');
    await page.waitForSelector('.rest');
    if (!(await page.locator('.rest').innerText()).includes(newSecondKg)) errors.push('silent-black: rest banner target disagrees with accepted row target');
    await page.waitForTimeout(300); await shot('live');
    const secondExercise = page.locator('.exercise').nth(1);
    await secondExercise.locator(':scope > .row-between').click();
    const secondInputs = secondExercise.locator('input[type="number"]');
    const secondTargetKg = Number(await secondInputs.nth(0).getAttribute('placeholder'));
    const secondTargetReps = Number(await secondInputs.nth(1).getAttribute('placeholder'));
    const secondNextKg = await secondInputs.nth(2).getAttribute('placeholder');
    await secondInputs.nth(0).fill(String(secondTargetKg)); await secondInputs.nth(1).fill(String(Math.max(1, secondTargetReps - 2))); await secondInputs.nth(1).blur();
    await secondExercise.locator('.effort button.max').first().click();
    await secondExercise.getByRole('button', { name: 'Keep my targets' }).click();
    if (await secondExercise.getByRole('button', { name: 'Use this target' }).count()) errors.push('silent-black: dismissed live offer remained visible');
    if (await secondInputs.nth(2).getAttribute('placeholder') !== secondNextKg) errors.push('silent-black: dismiss changed a later row target');
    const dismissedState = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (dismissedState.active.entries[1].coachDecision?.action !== 'dismissed') errors.push('silent-black: dismissed live decision was not persisted');
    await page.reload(); await page.waitForSelector('.nav');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await page.waitForSelector('.exercise');
    if (await page.getByRole('button', { name: 'Use this target' }).count()) errors.push('silent-black: dismissed live offer returned after reload');
    await page.getByRole('button', { name: 'Finish' }).click(); await page.waitForTimeout(300); await shot('finish-sheet');
    await page.getByRole('button', { name: /Finish and save|Just today/ }).click(); await page.waitForTimeout(400); await shot('summary');
    await page.getByRole('heading', { name: 'Evidence' }).waitFor();
    const finishDebrief = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Evidence' }) });
    if (!(await finishDebrief.innerText()).includes('working sets logged')) errors.push('silent-black: finish debrief lacked saved plan totals');
    await page.screenshot({ path: `${OUT}/silent-black-session-debrief-finish.png` });
    await page.setViewportSize({ width: 360, height: 800 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: finish debrief overflows at 360px');
    await page.setViewportSize({ width: 390, height: 844 });
    const finishedState = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    const finished = finishedState.sessions[finishedState.sessions.length - 1];
    const finishedSets = finished?.exercises.reduce((total, exercise) => total + exercise.sets.length, 0) ?? 0;
    if (finishedSets !== 2) errors.push(`silent-black: warm-up suggestions changed saved set count (${finishedSets}, expected 2 actual sets)`);
    await page.getByRole('button', { name: 'Done' }).click();

    // Confirmed chronic-skip choices: one card, two explicit alternatives, one group dismissal.
    const skipState = structuredClone(finishedState);
    const push = skipState.splits.find(split => split.id === 'split_push');
    const omittedId = 'lib_triceps_pushdown';
    if (!push?.exercises.some(entry => entry.exerciseId === omittedId)) errors.push('silent-black: chronic-skip fixture target missing from Push');
    skipState.splits = [push];
    skipState.sessions = [];
    const skipDays = ['2026-08-24', '2026-08-30', '2026-09-05', '2026-09-11', '2026-09-15'];
    for (const [index, day] of skipDays.entries()) {
      const planned = push.exercises.map((entry, planIndex) => ({ id: `gate-pe-${index}-${planIndex}`, exerciseId: entry.exerciseId, name: entry.exerciseId, mode: 'weighted', origin: 'start', plannedSets: entry.sets, targetSource: 'history', allowIncrease: true, targets: Array.from({ length: entry.sets }, () => ({ kg: 30 + index * 2.5, reps: 8, durationSec: null })) }));
      const loggedIds = push.exercises.map(entry => entry.exerciseId).filter(id => id !== omittedId || index === 0);
      skipState.sessions.push({ id: `gate-skip-${index}`, splitId: push.id, splitName: push.name, day, startedAt: `${day}T10:00:00.000Z`, endedAt: `${day}T11:00:00.000Z`, durationSec: 3600, exercises: loggedIds.map(id => ({ exerciseId: id, name: id, sets: [{ kg: 30 + index * 2.5, reps: 8, effort: 'ideal' }] })), plan: { version: 1, capturedAt: `${day}T10:00:00.000Z`, goal: skipState.goal, deload: null, entries: planned } });
    }
    skipState.active = null;
    const skipCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const skipPage = await skipCtx.newPage();
    skipPage.on('pageerror', e => errors.push(`silent-black chronic skip: ${e.message}`));
    await skipPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(skipState));
    await skipPage.goto(`http://localhost:${PORT}/`); await skipPage.waitForSelector('.nav');
    await skipPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const removeChoice = skipPage.getByRole('button', { name: 'Remove from Push' });
    await removeChoice.waitFor();
    const skipCard = skipPage.locator('.suggestion').filter({ has: removeChoice });
    if (await skipCard.getByRole('button', { name: /^Use / }).count() !== 1) errors.push('silent-black: chronic-skip alternatives were not grouped on one card');
    await skipCard.locator('h3').click(); await skipPage.getByRole('heading', { name: 'Choose a split change' }).waitFor();
    await skipPage.screenshot({ path: `${OUT}/silent-black-chronic-skip.png` });
    await skipPage.keyboard.press('Escape');
    await skipCard.getByRole('button', { name: 'Not now' }).click();
    const dismissedSkip = await skipPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if ((dismissedSkip.coach.dismissed['split_modify:split_push'] ?? 0) < 1 || (dismissedSkip.coach.dismissed['exercise_swap:split_push'] ?? 0) < 1) errors.push('silent-black: one Not now did not dismiss both chronic-skip alternatives');

    await skipPage.evaluate(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(skipState));
    await skipPage.reload(); await skipPage.waitForSelector('.nav');
    await skipPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await skipPage.getByRole('button', { name: 'Remove from Push' }).click();
    const acceptedSkip = await skipPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (acceptedSkip.splits.find(split => split.id === 'split_push')?.exercises.some(entry => entry.exerciseId === omittedId)) errors.push('silent-black: accepted chronic-skip cut did not update the split');
    if (JSON.stringify(acceptedSkip.sessions) !== JSON.stringify(skipState.sessions) || acceptedSkip.active !== null) errors.push('silent-black: chronic-skip template change touched history or active work');

    const legacySkip = structuredClone(skipState);
    legacySkip.splits = legacySkip.splits.filter(split => split.id === 'split_push');
    legacySkip.sessions = legacySkip.sessions.filter(session => session.splitId === 'split_push').map(session => ({ ...session, plan: undefined }));
    await skipCtx.close();
    const legacyCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const legacyPage = await legacyCtx.newPage();
    legacyPage.on('pageerror', e => errors.push(`silent-black legacy skip: ${e.message}`));
    await legacyPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(legacySkip));
    await legacyPage.goto(`http://localhost:${PORT}/`); await legacyPage.waitForSelector('.nav');
    await legacyPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const legacyInsight = legacyPage.locator('.insight').filter({ hasText: 'Triceps Pushdown: often absent from Push' });
    await legacyInsight.click();
    const review = legacyPage.getByRole('button', { name: 'Review in Train' });
    await review.waitFor(); await review.click();
    if (!await legacyPage.getByRole('heading', { name: 'Workouts' }).count()) errors.push('silent-black: legacy chronic-skip review did not navigate to Train');
    await legacyCtx.close();
  }
  await nav.getByRole('button', { name: 'History' }).click(); await page.waitForTimeout(250); await shot('history');
  if (theme === 'silent-black') {
    const source = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    // A delayed input event must invalidate a destructive swap confirmation,
    // even when the number of logged sets stays the same.
    const swapState = structuredClone(source);
    swapState.sessions = [];
    swapState.readiness = [];
    swapState.health = { connected: false };
    swapState.preferences.weightUnit = 'kg';
    swapState.coach.deload = null;
    swapState.coach.remoteExplainer = false;
    swapState.active = {
      splitId: 'split_push', startedAt: new Date(fixtureNow.getTime() - 600_000).toISOString(), pausedMs: 0,
      entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', done: false, skipped: false,
        sets: [{ kg: 60, reps: 8, effort: 'ideal' }, {}, {}] }],
    };
    const swapCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const swapPage = await swapCtx.newPage();
    swapPage.on('pageerror', error => errors.push(`silent-black stale swap: ${error.message}`));
    await swapPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(swapState));
    await swapPage.goto(`http://localhost:${PORT}/`); await swapPage.waitForSelector('.nav');
    await swapPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await swapPage.getByRole('button', { name: 'Options', exact: true }).first().click();
    await swapPage.getByRole('button', { name: /Equipment is taken/ }).click();
    await swapPage.locator('dialog[open] .list .pressable').first().click();
    const clearSwap = swapPage.getByRole('button', { name: 'Swap and clear', exact: true });
    await clearSwap.waitFor();
    await swapPage.locator('.exercise input[type="number"]').first().evaluate(input => {
      input.value = '62.5'; input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await swapPage.waitForFunction(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries[0].sets[0]?.kg === 62.5);
    await clearSwap.click();
    await swapPage.getByText('Your logged sets changed; review them before swapping.', { exact: true }).waitFor();
    const preservedSwap = await swapPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries[0]);
    if (preservedSwap.exerciseId !== 'lib_barbell_bench_press' || preservedSwap.sets[0]?.kg !== 62.5) errors.push('silent-black: stale swap cleared a newer logged set');
    await swapPage.screenshot({ path: `${OUT}/silent-black-swap-refreshed.png` });
    await clearSwap.click();
    await clearSwap.waitFor({ state: 'hidden' });
    await swapPage.waitForFunction(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries[0].exerciseId !== 'lib_barbell_bench_press');
    const replacedSwap = await swapPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active.entries[0]);
    if (replacedSwap.exerciseId === 'lib_barbell_bench_press' || JSON.stringify(replacedSwap.sets) !== '[{},{},{}]') errors.push('silent-black: refreshed swap did not replace the reviewed sets');
    await swapCtx.close();

    const debriefState = structuredClone(source);
    debriefState.active = null;
    debriefState.coach.remoteExplainer = false;
    debriefState.coach.presence = { version: 1, tone: 'steady', dismissed: [] };
    debriefState.preferences.weightUnit = 'kg';
    const previousDay = day(7), currentDay = day(0);
    const originalTargets = Array.from({ length: 3 }, () => ({ kg: 60, reps: 8, durationSec: null }));
    const priorSession = { id: 'gate-debrief-prior', splitId: 'split_push', splitName: 'Push', day: previousDay, startedAt: `${previousDay}T10:00:00.000Z`, endedAt: `${previousDay}T11:00:00.000Z`, durationSec: 3600,
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: Array.from({ length: 3 }, () => ({ kg: 60, reps: 10, effort: 'ideal' })) }] };
    const planEntries = [
      { id: 'gate-pe-bench', exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'history', allowIncrease: true, targets: originalTargets, acceptedTargets: [null, null, { kg: 62.5, reps: 6, durationSec: null }] },
      { id: 'gate-pe-lateral', exerciseId: 'lib_dumbbell_lateral_raise', name: 'Dumbbell Lateral Raise', mode: 'weighted', origin: 'start', plannedSets: 1, targetSource: 'starter', allowIncrease: false, targets: [{ kg: 5, reps: 12, durationSec: null }] },
      { id: 'gate-pe-triceps', exerciseId: 'lib_triceps_pushdown', name: 'Triceps Pushdown', mode: 'weighted', origin: 'start', plannedSets: 2, targetSource: 'history', allowIncrease: true, targets: Array.from({ length: 2 }, () => ({ kg: 30, reps: 10, durationSec: null })), excluded: 'skipped' },
    ];
    const currentSession = { id: 'gate-debrief-current', splitId: 'split_push', splitName: 'Push', day: currentDay, startedAt: `${currentDay}T10:00:00.000Z`, endedAt: `${currentDay}T11:00:00.000Z`, durationSec: 3600,
      exercises: [
        { exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', planEntryId: 'gate-pe-bench', actualSetIndices: [0, 1, 2, 3], sets: [{ kg: 60, reps: 8, effort: 'ideal' }, { kg: 60, reps: 7, effort: 'ideal' }, { kg: 62.5, reps: 6, effort: 'max' }, { kg: 62.5, reps: 5, effort: 'ideal' }] },
        { exerciseId: 'lib_dumbbell_lateral_raise', name: 'Dumbbell Lateral Raise', planEntryId: 'gate-pe-lateral', actualSetIndices: [0], sets: [{ kg: 5, reps: 12, effort: 'ideal' }] },
      ], plan: { version: 1, capturedAt: `${currentDay}T09:59:00.000Z`, goal: debriefState.goal, deload: null, entries: planEntries,
        assessment: { version: 1, intent: { kind: 'easier', capturedAt: `${currentDay}T09:59:00.000Z`, source: 'accepted_deload', effortCap: 'ideal' },
          changes: [{ id: 'gate-pac-targets', acceptedAt: `${currentDay}T10:20:00.000Z`, kind: 'targets', entryId: 'gate-pe-bench', reason: 'max_below_target', targets: [{ setIndex: 2, target: { kg: 62.5, reps: 6, durationSec: null } }] }],
          invalidatedEntryIds: [], seenWorkingRows: [{ entryId: 'gate-pe-bench', setIndices: [0, 1, 2, 3] }, { entryId: 'gate-pe-lateral', setIndices: [0] }] } } };
    debriefState.sessions = [priorSession, currentSession];
    const debriefRequests = [];
    const debriefCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const debriefPage = await debriefCtx.newPage();
    debriefPage.on('pageerror', error => errors.push(`silent-black debrief: ${error.message}`));
    debriefPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) debriefRequests.push(request.url()); });
    await debriefPage.addInitScript(saved => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(debriefState));
    await debriefPage.goto(`http://localhost:${PORT}/`); await debriefPage.waitForSelector('.nav');
    await debriefPage.getByText('Harder than planned.', { exact: true }).waitFor();
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await debriefPage.getByRole('heading', { name: 'Latest workout' }).waitFor();
    await debriefPage.getByRole('button', { name: 'View plan evidence' }).waitFor();
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefPage.getByRole('button', { name: 'Edit' }).first().click();
    await debriefPage.getByRole('heading', { name: 'Achievement' }).waitFor();
    await debriefPage.getByRole('heading', { name: 'Plan fit' }).waitFor();
    await debriefPage.getByRole('heading', { name: 'Evidence' }).waitFor();
    await debriefPage.getByText('Harder than planned', { exact: true }).waitFor();
    await debriefPage.getByText('New best', { exact: true }).first().waitFor();
    await debriefPage.getByText('1 recorded effort rating was above the saved cap.', { exact: true }).waitFor();
    await debriefPage.getByText('Accepted target 62.5 kg \u00d7 6', { exact: true }).waitFor();
    await debriefPage.getByText('Starting suggestion, not a target learned from your history.', { exact: true }).waitFor();
    await debriefPage.getByText(/No original target \(additional set\); actual 62\.5 kg \u00d7 5/).waitFor();
    await debriefPage.getByRole('button', { name: 'Show comparison' }).focus(); await debriefPage.keyboard.press('Enter');
    await debriefPage.getByText(/Previous: 60 kg \u00d7 10, 1800 kg total/).waitFor();
    await debriefPage.screenshot({ path: `${OUT}/silent-black-session-debrief-history.png` });
    for (const width of [320, 360, 900]) {
      await debriefPage.setViewportSize({ width, height: width === 900 ? 900 : 800 });
      if (await debriefPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push(`silent-black: history debrief overflows at ${width}px`);
    }
    await debriefPage.setViewportSize({ width: 390, height: 844 });
    await debriefPage.keyboard.press('Escape');
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Body' }).click();
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefPage.reload(); await debriefPage.waitForSelector('.nav');
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefPage.getByRole('button', { name: 'Edit' }).first().click();
    await debriefPage.getByText('Accepted target 62.5 kg \u00d7 6', { exact: true }).waitFor();
    await debriefPage.keyboard.press('Escape');
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await debriefPage.getByRole('button', { name: 'Settings' }).click();
    const debriefDownloadPromise = debriefPage.waitForEvent('download');
    await debriefPage.getByRole('button', { name: 'Export backup' }).click();
    const debriefDownload = await debriefDownloadPromise;
    const debriefBackupPath = join(ROOT, '.tmp', 'debrief-backup.json');
    await debriefDownload.saveAs(debriefBackupPath);
    await debriefCtx.close();

    const debriefRestoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const debriefRestorePage = await debriefRestoreCtx.newPage();
    debriefRestorePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) debriefRequests.push(request.url()); });
    await debriefRestorePage.goto(`http://localhost:${PORT}/`); await debriefRestorePage.waitForSelector('.nav');
    await debriefRestorePage.getByRole('button', { name: 'Settings' }).click();
    const debriefChooserPromise = debriefRestorePage.waitForEvent('filechooser');
    await debriefRestorePage.getByRole('button', { name: 'Restore backup' }).click();
    const debriefChooser = await debriefChooserPromise; await debriefChooser.setFiles(debriefBackupPath);
    await debriefRestorePage.getByText('Restored 2 sessions', { exact: true }).waitFor();
    await debriefRestorePage.keyboard.press('Escape');
    await debriefRestorePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefRestorePage.getByRole('button', { name: 'Edit' }).first().click();
    await debriefRestorePage.getByText('Accepted target 62.5 kg \u00d7 6', { exact: true }).waitFor();
    await debriefRestoreCtx.close();

    const debriefLbState = structuredClone(debriefState); debriefLbState.preferences.weightUnit = 'lb'; debriefLbState.coach.presence.tone = 'direct';
    const debriefLbCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const debriefLbPage = await debriefLbCtx.newPage();
    debriefLbPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) debriefRequests.push(request.url()); });
    await debriefLbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(debriefLbState));
    await debriefLbPage.goto(`http://localhost:${PORT}/`); await debriefLbPage.waitForSelector('.nav');
    await debriefLbPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefLbPage.getByRole('button', { name: 'Edit' }).first().click();
    await debriefLbPage.getByText('Harder than planned', { exact: true }).waitFor();
    await debriefLbPage.getByText('1 recorded effort rating was above the saved cap.', { exact: true }).waitFor();
    await debriefLbPage.getByText('Accepted target 138 lb \u00d7 6', { exact: true }).waitFor();
    await debriefLbCtx.close();
    if (debriefRequests.length) errors.push(`silent-black: session debrief made external requests (${debriefRequests.join(', ')})`);

    const objectiveState = structuredClone(source);
    objectiveState.active = null;
    objectiveState.coach.remoteExplainer = false;
    delete objectiveState.coach.objective;
    const objectiveSchedule = JSON.stringify(objectiveState.schedule);
    const objectiveSplits = JSON.stringify(objectiveState.splits);
    const objectiveRequests = [];
    const objectiveCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const objectivePage = await objectiveCtx.newPage();
    objectivePage.on('pageerror', error => errors.push(`silent-black objective: ${error.message}`));
    objectivePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) objectiveRequests.push(request.url()); });
    await objectivePage.addInitScript(saved => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(objectiveState));
    await objectivePage.goto(`http://localhost:${PORT}/`); await objectivePage.waitForSelector('.nav');
    await objectivePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await objectivePage.getByRole('heading', { name: 'Your direction' }).waitFor();
    await objectivePage.getByRole('button', { name: 'Set', exact: true }).click();
    await objectivePage.getByLabel('What are you working towards?').fill('Build a steady three-day routine and improve my bench press');
    await objectivePage.getByLabel('Equipment note (optional)').fill('Home dumbbells on weekdays');
    await objectivePage.getByRole('button', { name: 'Chest', exact: true }).click();
    await objectivePage.getByRole('button', { name: 'Mon', exact: true }).click();
    await objectivePage.getByRole('button', { name: 'Lift trend', exact: true }).click();
    await objectivePage.getByRole('button', { name: 'Recorded body trend', exact: true }).click();
    await objectivePage.getByLabel('Lift to follow').selectOption('lib_barbell_bench_press');
    await objectivePage.getByLabel('Review day (optional)').fill(day(-14));
    await objectivePage.getByRole('button', { name: 'Cancel', exact: true }).click();
    if (await objectivePage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).coach.objective != null)) errors.push('silent-black: cancelling objective editor wrote state');
    await objectivePage.getByRole('button', { name: 'Set', exact: true }).click();
    await objectivePage.getByLabel('What are you working towards?').fill('Build a steady three-day routine and improve my bench press');
    await objectivePage.getByLabel('Equipment note (optional)').fill('Home dumbbells on weekdays');
    await objectivePage.getByRole('button', { name: 'Chest', exact: true }).click();
    await objectivePage.getByRole('button', { name: 'Mon', exact: true }).click();
    await objectivePage.getByRole('button', { name: 'Lift trend', exact: true }).click();
    await objectivePage.getByRole('button', { name: 'Recorded body trend', exact: true }).click();
    await objectivePage.getByLabel('Lift to follow').selectOption('lib_barbell_bench_press');
    await objectivePage.getByLabel('Review day (optional)').fill(day(-14));
    await objectivePage.getByRole('button', { name: 'Save direction', exact: true }).click();
    await objectivePage.getByText('Build a steady three-day routine and improve my bench press', { exact: true }).waitFor();
    await objectivePage.waitForFunction(() => JSON.parse(localStorage.getItem('marc.state.v1')).coach.objective?.revision === 1);
    const savedObjectiveState = await objectivePage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (JSON.stringify(savedObjectiveState.schedule) !== objectiveSchedule || JSON.stringify(savedObjectiveState.splits) !== objectiveSplits) errors.push('silent-black: saving objective mutated schedule or splits');
    if (savedObjectiveState.coach.objective?.revision !== 1 || savedObjectiveState.coach.objective?.measures?.length !== 3) errors.push('silent-black: objective did not save bounded evidence and revision');
    await objectivePage.screenshot({ path: `${OUT}/silent-black-objective-summary.png` });
    for (const width of [320, 900]) {
      await objectivePage.setViewportSize({ width, height: width === 900 ? 900 : 800 });
      if (await objectivePage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push(`silent-black: objective summary overflows at ${width}px`);
    }
    await objectivePage.reload(); await objectivePage.waitForSelector('.nav');
    await objectivePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await objectivePage.getByRole('heading', { name: 'Your direction' }).waitFor();
    const reloadedObjective = await objectivePage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).coach.objective);
    if (reloadedObjective?.statement !== 'Build a steady three-day routine and improve my bench press') errors.push(`silent-black: objective did not survive reload (${JSON.stringify(reloadedObjective)} from ${JSON.stringify(savedObjectiveState.coach.objective)})`);
    else await objectivePage.getByText('Build a steady three-day routine and improve my bench press', { exact: true }).waitFor();
    await objectivePage.getByRole('button', { name: 'View evidence', exact: true }).click();
    await objectivePage.getByRole('heading', { name: 'Direction review' }).waitFor();
    await objectivePage.getByText('Training consistency', { exact: true }).waitFor();
    await objectivePage.getByText('Recorded body trend', { exact: true }).waitFor();
    if (!(await objectivePage.locator('dialog[open]').innerText()).includes('US Navy tape-method estimates are not direct body-fat measurements')) errors.push('silent-black: objective review omitted the body-estimate limitation');
    await objectivePage.screenshot({ path: `${OUT}/silent-black-objective-review.png` });
    for (const width of [320, 900]) {
      await objectivePage.setViewportSize({ width, height: width === 900 ? 900 : 800 });
      if (await objectivePage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push(`silent-black: objective review overflows at ${width}px`);
    }
    await objectivePage.setViewportSize({ width: 390, height: 844 });
    await objectivePage.locator('dialog[open]').getByText('Close', { exact: true }).click();
    await objectivePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Body' }).click();
    await objectivePage.getByRole('heading', { name: 'Selected objective evidence' }).waitFor();
    const bodyObjectiveEvidence = objectivePage.locator('section').filter({ has: objectivePage.getByRole('heading', { name: 'Selected objective evidence' }) });
    if (!(await bodyObjectiveEvidence.innerText()).includes('not measured muscle growth')) errors.push('silent-black: Body objective evidence inferred muscle growth');
    await objectivePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await objectivePage.getByText(/^Direction: Build a steady three-day routine/).waitFor();
    await objectivePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await objectivePage.getByRole('button', { name: 'Settings' }).click();
    const objectiveDownloadPromise = objectivePage.waitForEvent('download');
    await objectivePage.getByRole('button', { name: 'Export backup' }).click();
    const objectiveDownload = await objectiveDownloadPromise;
    const objectiveBackupPath = join(ROOT, '.tmp', 'objective-backup.json');
    await objectiveDownload.saveAs(objectiveBackupPath);
    await objectiveCtx.close();

    const objectiveRestoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const objectiveRestorePage = await objectiveRestoreCtx.newPage();
    objectiveRestorePage.on('pageerror', error => errors.push(`silent-black objective restore: ${error.message}`));
    objectiveRestorePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) objectiveRequests.push(request.url()); });
    await objectiveRestorePage.goto(`http://localhost:${PORT}/`); await objectiveRestorePage.waitForSelector('.nav');
    await objectiveRestorePage.getByRole('button', { name: 'Settings' }).click();
    const objectiveChooserPromise = objectiveRestorePage.waitForEvent('filechooser');
    await objectiveRestorePage.getByRole('button', { name: 'Restore backup' }).click();
    const objectiveChooser = await objectiveChooserPromise; await objectiveChooser.setFiles(objectiveBackupPath);
    await objectiveRestorePage.getByText(/Restored \d+ sessions/).waitFor();
    await objectiveRestorePage.keyboard.press('Escape');
    await objectiveRestorePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await objectiveRestorePage.getByText('Build a steady three-day routine and improve my bench press', { exact: true }).waitFor();
    await objectiveRestorePage.getByRole('button', { name: 'View evidence', exact: true }).click();
    await objectiveRestorePage.getByRole('heading', { name: 'Direction review' }).waitFor();
    await objectiveRestoreCtx.close();
    if (objectiveRequests.length) errors.push(`silent-black: objective flow made external requests (${objectiveRequests.join(', ')})`);

    const repairState = structuredClone(source);
    repairState.sessions = [];
    repairState.coach.remoteExplainer = false;
    const repairStartedAt = `${currentDay}T12:00:00.000Z`;
    repairState.active = {
      splitId: 'split_push', startedAt: repairStartedAt, pausedMs: 0,
      entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', done: true, skipped: false, planEntryId: 'gate-repair-entry', sets: [{ kg: 60, reps: 8 }, { kg: 60, reps: 7 }, { kg: 60, reps: 6 }] }],
      plan: { version: 1, capturedAt: repairStartedAt, goal: repairState.goal, deload: null, entries: [{ id: 'gate-repair-entry', exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'history', allowIncrease: true, targets: Array.from({ length: 3 }, () => ({ kg: 60, reps: 8, durationSec: null })) }] },
    };
    const repairRequests = [];
    const repairCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const repairPage = await repairCtx.newPage();
    repairPage.on('pageerror', error => errors.push(`silent-black effort repair: ${error.message}`));
    repairPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) repairRequests.push(request.url()); });
    await repairPage.addInitScript(saved => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(repairState));
    await repairPage.goto(`http://localhost:${PORT}/`); await repairPage.waitForSelector('.nav');
    await repairPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await repairPage.getByRole('button', { name: 'Finish' }).click();
    await repairPage.getByRole('button', { name: /Finish and save|Just today/ }).click();
    const repairHeading = repairPage.getByRole('heading', { name: 'Rate the sets you remember' });
    await repairHeading.waitFor();
    await repairPage.getByText('3 of 3 working sets have no effort rating.', { exact: true }).waitFor();
    await repairPage.screenshot({ path: `${OUT}/silent-black-effort-repair.png` });
    await repairPage.setViewportSize({ width: 360, height: 800 });
    if (await repairPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: effort repair overflows at 360px');
    await repairPage.setViewportSize({ width: 390, height: 844 });
    const easyFirst = repairPage.getByRole('button', { name: 'Rate Barbell Bench Press set 1 Easy' });
    await easyFirst.focus(); await repairPage.keyboard.press('Enter');
    await repairPage.getByText('2 of 3 working sets have no effort rating.', { exact: true }).waitFor();
    await repairPage.getByRole('button', { name: 'Rate Barbell Bench Press set 2 Ideal' }).click();
    await repairPage.getByText('1 of 3 working sets have no effort rating.', { exact: true }).waitFor();
    if (!await repairHeading.count()) errors.push('silent-black: repair closed when coverage crossed one half');
    await repairPage.getByRole('button', { name: 'Skip for now' }).click();
    if (await repairHeading.count()) errors.push('silent-black: Skip for now did not close the repair strip');
    const repairedState = await repairPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    const repairedSets = repairedState.sessions.at(-1)?.exercises[0]?.sets;
    if (JSON.stringify(repairedSets?.map(set => set.effort ?? null)) !== JSON.stringify(['easy', 'ideal', null])) errors.push('silent-black: rating or Skip changed the wrong saved efforts');
    if (repairedState.active !== null || repairedState.sessions.length !== 1) errors.push('silent-black: effort repair changed active state or session count');
    await repairPage.reload(); await repairPage.waitForSelector('.nav');
    const afterRepairReload = await repairPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (JSON.stringify(afterRepairReload.sessions[0]?.exercises[0]?.sets.map(set => set.effort ?? null)) !== JSON.stringify(['easy', 'ideal', null])) errors.push('silent-black: effort repair did not persist across reload');
    await repairPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await repairPage.getByRole('button', { name: 'Settings' }).click();
    const repairDownloadPromise = repairPage.waitForEvent('download');
    await repairPage.getByRole('button', { name: 'Export backup' }).click();
    const repairDownload = await repairDownloadPromise;
    const repairBackupPath = join(ROOT, '.tmp', 'effort-repair-backup.json');
    await repairDownload.saveAs(repairBackupPath);
    await repairCtx.close();

    const repairRestoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const repairRestorePage = await repairRestoreCtx.newPage();
    repairRestorePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) repairRequests.push(request.url()); });
    await repairRestorePage.goto(`http://localhost:${PORT}/`); await repairRestorePage.waitForSelector('.nav');
    await repairRestorePage.getByRole('button', { name: 'Settings' }).click();
    const repairChooserPromise = repairRestorePage.waitForEvent('filechooser');
    await repairRestorePage.getByRole('button', { name: 'Restore backup' }).click();
    const repairChooser = await repairChooserPromise; await repairChooser.setFiles(repairBackupPath);
    await repairRestorePage.getByText('Restored 1 sessions', { exact: true }).waitFor();
    const restoredRepair = await repairRestorePage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (JSON.stringify(restoredRepair.sessions[0]?.exercises[0]?.sets.map(set => set.effort ?? null)) !== JSON.stringify(['easy', 'ideal', null])) errors.push('silent-black: repaired efforts did not survive export and restore');
    await repairRestoreCtx.close();

    const repairLbState = structuredClone(repairState); repairLbState.preferences.weightUnit = 'lb';
    const repairLbCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const repairLbPage = await repairLbCtx.newPage();
    repairLbPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) repairRequests.push(request.url()); });
    await repairLbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(repairLbState));
    await repairLbPage.goto(`http://localhost:${PORT}/`); await repairLbPage.waitForSelector('.nav');
    await repairLbPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await repairLbPage.getByRole('button', { name: 'Finish' }).click();
    await repairLbPage.getByRole('button', { name: /Finish and save|Just today/ }).click();
    await repairLbPage.getByText(/Barbell Bench Press \u00b7 Set 1 \u00b7 132\.5 lb \u00d7 8/).waitFor();
    await repairLbCtx.close();
    if (repairRequests.length) errors.push(`silent-black: effort repair made external requests (${repairRequests.join(', ')})`);

    const reachState = structuredClone(source);
    reachState.goal = 'lean';
    reachState.coach.deload = null;
    reachState.coach.remoteExplainer = false;
    reachState.sessions = [{
      id: 'gate-reach-prior', splitId: 'split_push', splitName: 'Push', day: previousDay,
      startedAt: `${previousDay}T10:00:00.000Z`, endedAt: `${previousDay}T11:00:00.000Z`, durationSec: 3600,
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: [{ kg: 60, reps: 8, effort: 'ideal' }] }],
    }];
    const reachStartedAt = `${currentDay}T13:00:00.000Z`;
    reachState.active = {
      splitId: 'split_push', startedAt: reachStartedAt, pausedMs: 0,
      entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', done: false, skipped: false, planEntryId: 'gate-reach-entry', sets: [{}, {}, {}] }],
      plan: { version: 1, capturedAt: reachStartedAt, goal: 'lean', deload: null, entries: [{ id: 'gate-reach-entry', exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'history', allowIncrease: true, targets: Array.from({ length: 3 }, () => ({ kg: 60, reps: 8, durationSec: null })) }] },
    };
    const reachRequests = [];
    const reachCopy = '9 reps at 60 kg would beat your previous 8. Only if it feels right today.';
    const reachCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const reachPage = await reachCtx.newPage();
    reachPage.on('pageerror', error => errors.push(`silent-black PR reach: ${error.message}`));
    reachPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) reachRequests.push(request.url()); });
    await reachPage.addInitScript(saved => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(reachState));
    await reachPage.goto(`http://localhost:${PORT}/`); await reachPage.waitForSelector('.nav');
    await reachPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await reachPage.getByText(reachCopy, { exact: true }).waitFor();
    await reachPage.screenshot({ path: `${OUT}/silent-black-pr-reach.png` });
    await reachPage.setViewportSize({ width: 360, height: 800 });
    if (await reachPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: PR reach overflows at 360px');
    await reachPage.setViewportSize({ width: 390, height: 844 });
    await reachPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Body' }).click();
    await reachPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await reachPage.getByText(reachCopy, { exact: true }).waitFor();
    await reachPage.reload(); await reachPage.waitForSelector('.nav');
    await reachPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await reachPage.getByText(reachCopy, { exact: true }).waitFor();

    await reachPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await reachPage.getByRole('button', { name: 'Settings' }).click();
    const reachDownloadPromise = reachPage.waitForEvent('download');
    await reachPage.getByRole('button', { name: 'Export backup' }).click();
    const reachDownload = await reachDownloadPromise;
    const reachBackupPath = join(ROOT, '.tmp', 'pr-reach-backup.json');
    await reachDownload.saveAs(reachBackupPath);
    await reachPage.keyboard.press('Escape');
    await reachPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    const reachCard = reachPage.locator('.exercise').filter({ hasText: 'Barbell Bench Press' });
    const reachInputs = reachCard.locator('input[type="number"]');
    await reachInputs.nth(0).focus(); await reachPage.keyboard.type('60');
    await reachPage.getByText(reachCopy, { exact: true }).waitFor({ state: 'hidden' });
    await reachInputs.nth(1).fill('9'); await reachInputs.nth(1).press('Tab');
    await reachCard.getByText('Record', { exact: true }).waitFor();
    if (await reachPage.getByText(/^\d+ reps at .*would beat your previous/).count()) errors.push('silent-black: possible record remained after the actual record was logged');
    await reachCtx.close();

    const reachRestoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const reachRestorePage = await reachRestoreCtx.newPage();
    reachRestorePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) reachRequests.push(request.url()); });
    await reachRestorePage.goto(`http://localhost:${PORT}/`); await reachRestorePage.waitForSelector('.nav');
    await reachRestorePage.getByRole('button', { name: 'Settings' }).click();
    const reachChooserPromise = reachRestorePage.waitForEvent('filechooser');
    await reachRestorePage.getByRole('button', { name: 'Restore backup' }).click();
    const reachChooser = await reachChooserPromise; await reachChooser.setFiles(reachBackupPath);
    await reachRestorePage.getByText('Restored 1 sessions', { exact: true }).waitFor();
    await reachRestorePage.keyboard.press('Escape');
    await reachRestorePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await reachRestorePage.getByText(reachCopy, { exact: true }).waitFor();
    await reachRestoreCtx.close();

    const reachLbState = structuredClone(reachState); reachLbState.preferences.weightUnit = 'lb';
    const reachLbCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const reachLbPage = await reachLbCtx.newPage();
    reachLbPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) reachRequests.push(request.url()); });
    await reachLbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(reachLbState));
    await reachLbPage.goto(`http://localhost:${PORT}/`); await reachLbPage.waitForSelector('.nav');
    await reachLbPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await reachLbPage.getByText('9 reps at 132.5 lb would beat your previous 8. Only if it feels right today.', { exact: true }).waitFor();
    await reachLbCtx.close();
    if (reachRequests.length) errors.push(`silent-black: PR reach made external requests (${reachRequests.join(', ')})`);

    const driftState = structuredClone(source);
    const addDay = (key, amount) => { const value = new Date(`${key}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + amount); return value.toISOString().slice(0, 10); };
    const localToday = day(0);
    const localDate = new Date(`${localToday}T12:00:00Z`);
    const currentMonday = addDay(localToday, -((localDate.getUTCDay() + 6) % 7));
    const oldestMonday = addDay(currentMonday, -16 * 7);
    const driftSessions = [];
    const driftSession = (week, weekday, splitId, splitName, exerciseId, name) => {
      const sessionDay = addDay(oldestMonday, week * 7 + weekday);
      driftSessions.push({ id: `gate-drift-${week}-${weekday}-${splitId}`, splitId, splitName, day: sessionDay,
        startedAt: `${sessionDay}T18:00:00`, endedAt: `${sessionDay}T19:00:00`, durationSec: 3600,
        exercises: [{ exerciseId, name, sets: [{ kg: 60, reps: 8, effort: 'ideal' }] }] });
    };
    driftSession(-1, 0, 'split_pull', 'Pull', 'lib_lat_pulldown', 'Lat Pulldown');
    for (let week = 0; week < 16; week++) {
      if (week < 7 || week === 8 || week === 9) driftSession(week, 4, 'split_push', 'Push', 'lib_barbell_bench_press', 'Barbell Bench Press');
      if (week >= 10 && week <= 13) driftSession(week, 5, 'split_push', 'Push', 'lib_barbell_bench_press', 'Barbell Bench Press');
      if (week >= 14) driftSession(week, 5, 'split_pull', 'Pull', 'lib_lat_pulldown', 'Lat Pulldown');
    }
    driftState.active = null;
    driftState.sessions = driftSessions.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    driftState.schedule = { sun: null, mon: null, tue: null, wed: null, thu: null, fri: 'split_push', sat: null };
    driftState.coach = { ...driftState.coach, deload: null, remoteExplainer: false, learnedStarts: { fri: '18:00', sat: '18:00', tue: '07:15' }, dismissed: {}, snoozedUntil: {}, accepted: {}, dismissalEvidence: {} };
    const driftRequests = [];
    const driftTitle = 'Fri is less common in your logs';
    const driftSuggestionTitle = 'Move Push from Fri to Sat?';
    const driftCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const driftPage = await driftCtx.newPage();
    driftPage.on('pageerror', error => errors.push(`silent-black consistency drift: ${error.message}`));
    driftPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) driftRequests.push(request.url()); });
    await driftPage.addInitScript(saved => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(driftState));
    await driftPage.goto(`http://localhost:${PORT}/`); await driftPage.waitForSelector('.nav');
    const openDriftCoach = async target => {
      await target.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
      await target.getByLabel(`Open insight: ${driftTitle}`).waitFor();
      await target.getByLabel(`Open suggestion: ${driftSuggestionTitle}`).waitFor();
    };
    await openDriftCoach(driftPage);
    const driftInsight = driftPage.getByLabel(`Open insight: ${driftTitle}`);
    await driftInsight.focus(); await driftPage.keyboard.press('Enter');
    await driftPage.getByText('Fri appeared in 7 of the older 8 complete weeks and 2 of the recent 8.', { exact: true }).waitFor();
    await driftPage.getByText(/This describes logged sessions; your past schedule was not saved\./).waitFor();
    await driftPage.screenshot({ path: `${OUT}/silent-black-consistency-drift.png` });
    await driftPage.setViewportSize({ width: 360, height: 800 });
    if (await driftPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: consistency drift overflows at 360px');
    await driftPage.setViewportSize({ width: 390, height: 844 });
    await driftPage.keyboard.press('Escape');
    await driftPage.getByLabel(`Open suggestion: ${driftSuggestionTitle}`).click();
    const driftDialog = driftPage.getByRole('dialog');
    await driftDialog.getByText('Sat appeared in 6 recent weeks, including 4 with Push.', { exact: true }).waitFor();
    await driftDialog.getByText('Fri: cleared', { exact: true }).waitFor();
    await driftDialog.getByText('Sat: Push at the learned start time', { exact: true }).waitFor();
    await driftPage.keyboard.press('Escape');
    await driftPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Body' }).click();
    await openDriftCoach(driftPage);
    await driftPage.reload(); await driftPage.waitForSelector('.nav'); await openDriftCoach(driftPage);

    await driftPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await driftPage.getByRole('button', { name: 'Settings' }).click();
    const driftDownloadPromise = driftPage.waitForEvent('download');
    await driftPage.getByRole('button', { name: 'Export backup' }).click();
    const driftDownload = await driftDownloadPromise;
    const driftBackupPath = join(ROOT, '.tmp', 'consistency-drift-backup.json');
    await driftDownload.saveAs(driftBackupPath);
    await driftCtx.close();

    const driftRestoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const driftRestorePage = await driftRestoreCtx.newPage();
    driftRestorePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) driftRequests.push(request.url()); });
    await driftRestorePage.goto(`http://localhost:${PORT}/`); await driftRestorePage.waitForSelector('.nav');
    await driftRestorePage.getByRole('button', { name: 'Settings' }).click();
    const driftChooserPromise = driftRestorePage.waitForEvent('filechooser');
    await driftRestorePage.getByRole('button', { name: 'Restore backup' }).click();
    const driftChooser = await driftChooserPromise; await driftChooser.setFiles(driftBackupPath);
    await driftRestorePage.getByText(`Restored ${driftSessions.length} sessions`, { exact: true }).waitFor();
    await driftRestorePage.keyboard.press('Escape'); await openDriftCoach(driftRestorePage);
    await driftRestoreCtx.close();

    const driftDismissCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const driftDismissPage = await driftDismissCtx.newPage();
    driftDismissPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) driftRequests.push(request.url()); });
    await driftDismissPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(driftState));
    await driftDismissPage.goto(`http://localhost:${PORT}/`); await driftDismissPage.waitForSelector('.nav'); await openDriftCoach(driftDismissPage);
    const beforeDriftDismiss = await driftDismissPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    await driftDismissPage.getByLabel(`Open suggestion: ${driftSuggestionTitle}`).getByRole('button', { name: 'Not now' }).click();
    await driftDismissPage.waitForTimeout(350);
    const afterDriftDismiss = await driftDismissPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (JSON.stringify(afterDriftDismiss.schedule) !== JSON.stringify(beforeDriftDismiss.schedule) || JSON.stringify(afterDriftDismiss.coach.learnedStarts) !== JSON.stringify(beforeDriftDismiss.coach.learnedStarts)) errors.push('silent-black: consistency drift dismissal changed schedule or learned starts');
    if (afterDriftDismiss.coach.dismissed['schedule:*'] !== 1) errors.push('silent-black: consistency drift dismissal was not remembered');
    await driftDismissCtx.close();

    const driftAcceptCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const driftAcceptPage = await driftAcceptCtx.newPage();
    driftAcceptPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) driftRequests.push(request.url()); });
    await driftAcceptPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(driftState));
    await driftAcceptPage.goto(`http://localhost:${PORT}/`); await driftAcceptPage.waitForSelector('.nav'); await openDriftCoach(driftAcceptPage);
    await driftAcceptPage.getByLabel(`Open suggestion: ${driftSuggestionTitle}`).getByRole('button', { name: 'Move the scheduled day' }).click();
    await driftAcceptPage.waitForTimeout(350);
    const afterDriftAccept = await driftAcceptPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (afterDriftAccept.schedule.fri !== null || afterDriftAccept.schedule.sat !== 'split_push' || afterDriftAccept.coach.learnedStarts.fri !== undefined || afterDriftAccept.coach.learnedStarts.sat !== '18:00') errors.push('silent-black: consistency drift acceptance did not move the exact scheduled day');
    if (afterDriftAccept.schedule.tue !== driftState.schedule.tue || afterDriftAccept.coach.learnedStarts.tue !== '07:15' || afterDriftAccept.coach.accepted['schedule:*'] !== localToday) errors.push('silent-black: consistency drift acceptance changed unrelated schedule data or was not remembered');
    await driftAcceptCtx.close();

    const driftLbState = structuredClone(driftState); driftLbState.preferences.weightUnit = 'lb';
    const driftLbCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const driftLbPage = await driftLbCtx.newPage();
    driftLbPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) driftRequests.push(request.url()); });
    await driftLbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(driftLbState));
    await driftLbPage.goto(`http://localhost:${PORT}/`); await driftLbPage.waitForSelector('.nav'); await openDriftCoach(driftLbPage);
    await driftLbCtx.close();
    if (driftRequests.length) errors.push(`silent-black: consistency drift made external requests (${driftRequests.join(', ')})`);

    const nearState = structuredClone(source);
    nearState.coach.deload = null;
    nearState.coach.remoteExplainer = false;
    nearState.sessions = [14, 7].map((offset, index) => {
      const sessionDay = day(offset);
      return { id: `gate-near-prior-${index}`, splitId: 'split_push', splitName: 'Push', day: sessionDay,
        startedAt: `${sessionDay}T17:00:00`, endedAt: `${sessionDay}T18:00:00`, durationSec: 3600,
        exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: [{ kg: 60, reps: 8, effort: 'ideal' }] }] };
    });
    const nearStartedAt = new Date(fixtureNow.getTime() - 3_600_000).toISOString();
    const nearActive = reps => ({
      splitId: 'split_push', startedAt: nearStartedAt, pausedMs: 0,
      entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', done: false, skipped: false, planEntryId: 'gate-near-entry', sets: [{ kg: 60, reps, effort: 'ideal' }] }],
      plan: { version: 1, capturedAt: nearStartedAt, goal: nearState.goal, deload: null, entries: [{ id: 'gate-near-entry', exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', mode: 'weighted', origin: 'start', plannedSets: 1, targetSource: 'history', allowIncrease: true, targets: [{ kg: 60, reps: 8, durationSec: null }] }] },
    });
    nearState.active = nearActive(8);
    const nearRequests = [];
    const finishNearMiss = async target => {
      await target.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
      await target.getByRole('button', { name: 'Finish' }).click();
      await target.getByRole('button', { name: /Finish and save|Just today/ }).click();
      await target.getByLabel('Close to a record: Barbell Bench Press').waitFor();
    };
    const openNearCoach = async target => {
      await target.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
      await target.getByLabel('Open insight: Close to a record: Barbell Bench Press').waitFor();
    };
    const nearCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const nearPage = await nearCtx.newPage();
    nearPage.on('pageerror', error => errors.push(`silent-black near miss: ${error.message}`));
    nearPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) nearRequests.push(request.url()); });
    await nearPage.addInitScript(saved => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(nearState));
    await nearPage.goto(`http://localhost:${PORT}/`); await nearPage.waitForSelector('.nav');
    await finishNearMiss(nearPage);
    await nearPage.getByText('Matched your 8-rep best at 60 kg. 1 more rep would be a new rep record.', { exact: true }).waitFor();
    await nearPage.getByText('A useful marker for another day; no extra set needed now.', { exact: true }).waitFor();
    await nearPage.screenshot({ path: `${OUT}/silent-black-near-miss.png` });
    await nearPage.setViewportSize({ width: 360, height: 800 });
    if (await nearPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: near-miss finish note overflows at 360px');
    await nearPage.setViewportSize({ width: 390, height: 844 });
    await openNearCoach(nearPage);
    const nearInsight = nearPage.getByLabel('Open insight: Close to a record: Barbell Bench Press');
    await nearInsight.focus(); await nearPage.keyboard.press('Enter');
    await nearPage.getByText('Matched your 8-rep best at 60 kg. 1 more rep would be a new rep record.', { exact: true }).waitFor();
    await nearPage.keyboard.press('Escape');
    await nearPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Body' }).click();
    await openNearCoach(nearPage);
    await nearPage.reload(); await nearPage.waitForSelector('.nav'); await openNearCoach(nearPage);
    await nearPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await nearPage.getByRole('button', { name: 'Settings' }).click();
    const nearDownloadPromise = nearPage.waitForEvent('download');
    await nearPage.getByRole('button', { name: 'Export backup' }).click();
    const nearDownload = await nearDownloadPromise;
    const nearBackupPath = join(ROOT, '.tmp', 'near-miss-backup.json');
    await nearDownload.saveAs(nearBackupPath);
    await nearCtx.close();

    const nearRestoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const nearRestorePage = await nearRestoreCtx.newPage();
    nearRestorePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) nearRequests.push(request.url()); });
    await nearRestorePage.goto(`http://localhost:${PORT}/`); await nearRestorePage.waitForSelector('.nav');
    await nearRestorePage.getByRole('button', { name: 'Settings' }).click();
    const nearChooserPromise = nearRestorePage.waitForEvent('filechooser');
    await nearRestorePage.getByRole('button', { name: 'Restore backup' }).click();
    const nearChooser = await nearChooserPromise; await nearChooser.setFiles(nearBackupPath);
    await nearRestorePage.getByText('Restored 3 sessions', { exact: true }).waitFor();
    await nearRestorePage.keyboard.press('Escape'); await openNearCoach(nearRestorePage);
    await nearRestoreCtx.close();

    const nearLbState = structuredClone(nearState); nearLbState.preferences.weightUnit = 'lb';
    const nearLbCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const nearLbPage = await nearLbCtx.newPage();
    nearLbPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) nearRequests.push(request.url()); });
    await nearLbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(nearLbState));
    await nearLbPage.goto(`http://localhost:${PORT}/`); await nearLbPage.waitForSelector('.nav'); await finishNearMiss(nearLbPage);
    await nearLbPage.getByText('Matched your 8-rep best at 132.5 lb. 1 more rep would be a new rep record.', { exact: true }).waitFor();
    await nearLbCtx.close();

    const recordState = structuredClone(nearState); recordState.active = nearActive(9);
    const recordCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const recordPage = await recordCtx.newPage();
    recordPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) nearRequests.push(request.url()); });
    await recordPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(recordState));
    await recordPage.goto(`http://localhost:${PORT}/`); await recordPage.waitForSelector('.nav');
    await recordPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await recordPage.getByText('Record', { exact: true }).waitFor();
    await recordPage.getByRole('button', { name: 'Finish' }).click();
    await recordPage.getByRole('button', { name: /Finish and save|Just today/ }).click();
    if (await recordPage.getByLabel('Close to a record: Barbell Bench Press').count()) errors.push('silent-black: actual record also rendered a near-miss finish note');
    await recordCtx.close();
    if (nearRequests.length) errors.push(`silent-black: near miss made external requests (${nearRequests.join(', ')})`);
  }
  await page.getByRole('tab', { name: 'Stats' }).click(); await page.waitForTimeout(250); await shot('stats');
  if (theme === 'silent-black') {
    const base = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    const trajectoryState = structuredClone(base);
    trajectoryState.active = null;
    trajectoryState.coach.deload = null;
    trajectoryState.sessions = Array.from({ length: 8 }, (_, index) => {
      const offset = (7 - index) * 7;
      const sessionDay = day(offset);
      return { id: `gate-trajectory-${index}`, splitId: 'split_push', splitName: 'Push', day: sessionDay, startedAt: iso(offset, 10), endedAt: iso(offset, 11), durationSec: 3600,
        exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: [{ kg: 43 + index, reps: 8, effort: 'ideal' }] }] };
    });
    const externalRequests = [];
    const openStats = async target => {
      await target.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
      const stats = target.getByRole('tab', { name: 'Stats' });
      await stats.focus(); await target.keyboard.press('Enter');
      await target.getByText(/^Logged top load is rising about/).waitFor();
    };
    const trajectoryCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const trajectoryPage = await trajectoryCtx.newPage();
    trajectoryPage.on('pageerror', e => errors.push(`silent-black trajectory: ${e.message}`));
    trajectoryPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) externalRequests.push(request.url()); });
    await trajectoryPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(trajectoryState));
    await trajectoryPage.goto(`http://localhost:${PORT}/`); await trajectoryPage.waitForSelector('.nav');
    const beforeTrajectory = await trajectoryPage.evaluate(() => localStorage.getItem('marc.state.v1'));
    await openStats(trajectoryPage);
    const trajectoryBlock = trajectoryPage.getByText(/^Logged top load is rising about/).locator('..');
    if (!(await trajectoryBlock.innerText()).includes('1 kg per week across 8 logged days')) errors.push('silent-black: projected trajectory rate or evidence count was wrong');
    if (!(await trajectoryBlock.innerText()).includes('52.5 kg')) errors.push('silent-black: projected next load was wrong');
    await trajectoryBlock.scrollIntoViewIfNeeded();
    await trajectoryPage.screenshot({ path: `${OUT}/silent-black-lift-trajectory.png` });
    await trajectoryPage.setViewportSize({ width: 360, height: 800 });
    if (await trajectoryPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: lift trajectory overflows at 360px');
    await trajectoryPage.setViewportSize({ width: 390, height: 844 });
    await trajectoryPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Body' }).click();
    await openStats(trajectoryPage);
    await trajectoryPage.reload(); await trajectoryPage.waitForSelector('.nav'); await openStats(trajectoryPage);
    const afterTrajectory = await trajectoryPage.evaluate(() => localStorage.getItem('marc.state.v1'));
    if (afterTrajectory !== beforeTrajectory) errors.push('silent-black: viewing or reloading lift trajectory wrote app state');

    await trajectoryPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await trajectoryPage.getByRole('button', { name: 'Settings' }).click();
    const downloadPromise = trajectoryPage.waitForEvent('download');
    await trajectoryPage.getByRole('button', { name: 'Export backup' }).click();
    const download = await downloadPromise;
    const backupPath = join(ROOT, '.tmp', 'trajectory-backup.json');
    await download.saveAs(backupPath);

    const restoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const restorePage = await restoreCtx.newPage();
    restorePage.on('pageerror', e => errors.push(`silent-black trajectory restore: ${e.message}`));
    await restorePage.goto(`http://localhost:${PORT}/`); await restorePage.waitForSelector('.nav');
    await restorePage.getByRole('button', { name: 'Settings' }).click();
    const chooserPromise = restorePage.waitForEvent('filechooser');
    await restorePage.getByRole('button', { name: 'Restore backup' }).click();
    const chooser = await chooserPromise; await chooser.setFiles(backupPath);
    await restorePage.getByText('Restored 8 sessions', { exact: true }).waitFor();
    await restorePage.keyboard.press('Escape'); await openStats(restorePage);
    await restoreCtx.close();

    const lbState = structuredClone(trajectoryState); lbState.preferences.weightUnit = 'lb';
    const lbTrajectoryCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const lbTrajectoryPage = await lbTrajectoryCtx.newPage();
    await lbTrajectoryPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(lbState));
    await lbTrajectoryPage.goto(`http://localhost:${PORT}/`); await lbTrajectoryPage.waitForSelector('.nav'); await openStats(lbTrajectoryPage);
    if (!(await lbTrajectoryPage.getByText(/^Logged top load is rising about/).locator('..').innerText()).includes('2 lb per week')) errors.push('silent-black: lift trajectory did not render in lb');
    await lbTrajectoryCtx.close();

    const expiredState = structuredClone(trajectoryState);
    expiredState.sessions = expiredState.sessions.map((session, index) => { const offset = (7 - index) * 7 + 40; const sessionDay = day(offset); return { ...session, day: sessionDay, startedAt: iso(offset, 10), endedAt: iso(offset, 11) }; });
    const expiredCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const expiredPage = await expiredCtx.newPage();
    await expiredPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(expiredState));
    await expiredPage.goto(`http://localhost:${PORT}/`); await expiredPage.waitForSelector('.nav');
    await expiredPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click(); await expiredPage.getByRole('tab', { name: 'Stats' }).click();
    await expiredPage.getByText('This projection has expired; another logged session is needed to reassess it.', { exact: true }).waitFor();
    await expiredCtx.close();

    const deloadState = structuredClone(trajectoryState);
    deloadState.coach.deload = { from: day(0), to: day(-6), loadFactor: 0.85, effortCap: 'ideal' };
    const deloadCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const deloadPage = await deloadCtx.newPage();
    await deloadPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(deloadState));
    await deloadPage.goto(`http://localhost:${PORT}/`); await deloadPage.waitForSelector('.nav');
    await deloadPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click(); await deloadPage.getByRole('tab', { name: 'Stats' }).click();
    if (await deloadPage.getByText(/^Logged top load is rising about/).count() || await deloadPage.getByText(/^This projection has expired/).count()) errors.push('silent-black: easier week did not suppress lift trajectory');
    await deloadCtx.close();
    if (externalRequests.length) errors.push(`silent-black: lift trajectory made external requests (${externalRequests.join(', ')})`);
    await trajectoryCtx.close();

    // P04 (docs/escobar-presence §5): a session captured while an accepted deload is active
    // shows its own frozen intent while training, not the live deload state — the pre-start
    // Splits banner already covers "live state"; this is "what THIS session was captured as".
    const intentState = structuredClone(deloadState);
    intentState.sessions = [];
    const intentStartedAt = `${day(0)}T12:00:00.000Z`;
    intentState.active = {
      splitId: 'split_push', startedAt: intentStartedAt, pausedMs: 0,
      entries: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', done: false, skipped: false, planEntryId: 'gate-intent-entry', sets: [{}, {}, {}] }],
      plan: {
        version: 1, capturedAt: intentStartedAt, goal: intentState.goal, deload: intentState.coach.deload,
        entries: [{ id: 'gate-intent-entry', exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'history', allowIncrease: true, targets: Array.from({ length: 3 }, () => ({ kg: 51, reps: 8, durationSec: null })) }],
        assessment: { version: 1, intent: { kind: 'easier', capturedAt: intentStartedAt, source: 'accepted_deload', effortCap: 'ideal' }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [] },
      },
    };
    const intentCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const intentPage = await intentCtx.newPage();
    intentPage.on('pageerror', error => errors.push(`silent-black session-intent: ${error.message}`));
    await intentPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(intentState));
    await intentPage.goto(`http://localhost:${PORT}/`); await intentPage.waitForSelector('.nav');
    await intentPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Train|^Live/ }).click();
    await intentPage.getByText('Captured as an easier session: stop at ideal effort, no max sets.', { exact: true }).waitFor();
    await intentCtx.close();
  }
  // P10 integrated visual state: every theme renders the same populated current objective
  // on Body, Coach review and Train. The focused silent-black flow above owns save/cancel;
  // this pass owns cross-theme/phone-width inspection without repeating editor mutations.
  const objectiveVisualState = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
  objectiveVisualState.active = null;
  objectiveVisualState.coach.remoteExplainer = false;
  const objectiveLiftId = objectiveVisualState.sessions.flatMap(session => session.exercises).find(exercise => exercise.sets.some(set => (set.kg ?? 0) > 0))?.exerciseId ?? 'lib_machine_chest_press';
  objectiveVisualState.coach.objective = {
    version: 1, id: `gate-objective-${theme}`, revision: 1, createdAt: iso(56), updatedAt: iso(56),
    statement: 'Build a steady three-day routine and improve my main press without guessing from body changes.',
    priorityMuscles: ['chest'], availableWeekdays: ['mon', 'wed', 'fri'], equipmentNote: 'Use the equipment already in my saved workouts.',
    measures: [{ kind: 'consistency' }, { kind: 'lift_trend', exerciseId: objectiveLiftId }, { kind: 'body_trend' }], reviewDay: day(0),
  };
  objectiveVisualState.body = [
    { day: day(42), neckCm: 39, waistCm: 86, bodyFatPct: 22 },
    { day: day(28), neckCm: 39, waistCm: 85, bodyFatPct: 21.5 },
    { day: day(14), neckCm: 39, waistCm: 84, bodyFatPct: 21 },
    { day: day(0), neckCm: 39, waistCm: 83, bodyFatPct: 20.5 },
  ];
  const objectiveThemeRequests = [];
  const objectiveThemeCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const objectiveThemePage = await objectiveThemeCtx.newPage();
  objectiveThemePage.on('pageerror', error => errors.push(`${theme} objective review: ${error.message}`));
  objectiveThemePage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) objectiveThemeRequests.push(request.url()); });
  await objectiveThemePage.addInitScript(([saved, selectedTheme]) => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', selectedTheme); }, [JSON.stringify(objectiveVisualState), theme]);
  await objectiveThemePage.goto(`http://localhost:${PORT}/`); await objectiveThemePage.waitForSelector('.nav');
  const objectiveThemeNav = objectiveThemePage.getByRole('navigation', { name: 'Main' });
  await objectiveThemeNav.getByRole('button', { name: 'Body' }).click();
  const selectedObjectiveHeading = objectiveThemePage.getByRole('heading', { name: 'Selected objective evidence' });
  await selectedObjectiveHeading.waitFor(); await selectedObjectiveHeading.scrollIntoViewIfNeeded();
  await objectiveThemePage.screenshot({ path: `${OUT}/${theme}-objective-body.png` });
  await objectiveThemeNav.getByRole('button', { name: 'Coach' }).click();
  await objectiveThemePage.getByRole('button', { name: 'Review now', exact: true }).click();
  await objectiveThemePage.getByRole('heading', { name: 'Direction review' }).waitFor();
  await objectiveThemePage.setViewportSize({ width: 360, height: 800 });
  if (await objectiveThemePage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push(`${theme}: objective review overflows at 360px`);
  await objectiveThemePage.screenshot({ path: `${OUT}/${theme}-objective-review-360.png` });
  await objectiveThemePage.setViewportSize({ width: 390, height: 844 });
  await objectiveThemePage.screenshot({ path: `${OUT}/${theme}-objective-review.png` });
  await objectiveThemePage.locator('dialog[open]').getByText('Close', { exact: true }).click();
  await objectiveThemeNav.getByRole('button', { name: /^Train|^Live/ }).click();
  await objectiveThemePage.getByText(/^Direction: Build a steady three-day routine/).waitFor();
  await objectiveThemePage.screenshot({ path: `${OUT}/${theme}-objective-train.png` });
  if (objectiveThemeRequests.length) errors.push(`${theme}: populated objective surfaces made external requests (${objectiveThemeRequests.join(', ')})`);
  await objectiveThemeCtx.close();

  await nav.getByRole('button', { name: 'Body' }).click(); await page.waitForTimeout(300); await shot('body');
  if (theme === 'silent-black') { await page.locator('path.muscle').nth(2).click({ force: true }); await page.waitForTimeout(300); await shot('muscle-detail'); await page.keyboard.press('Escape'); await page.getByRole('tab', { name: 'Levels' }).click(); await page.waitForTimeout(250); await shot('levels'); }
  await nav.getByRole('button', { name: 'Coach' }).click(); await page.waitForTimeout(250); await shot('coach');
  if (theme === 'silent-black') {
    await page.locator('.insight').first().click(); await page.waitForTimeout(300); await shot('insight'); await page.keyboard.press('Escape');

    const unfinishedState = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    unfinishedState.active = null;
    unfinishedState.coach.remoteExplainer = false;
    unfinishedState.coach.dismissalEvidence = { 'gate:*': { day: day(30), proposalFingerprint: '[]', reopenedOnce: false, findings: [] } };
    unfinishedState.coach.askThread = [{
      role: 'assistant', text: 'I saved four typed options for you.', scope: 'personal', category: 'training', concern: null,
      drafts: [
        { action: 'create', splitId: null, name: 'Saved full body', focus: ['quads'], exercises: [{ exerciseId: 'lib_leg_press', sets: 3 }] },
        { action: 'modify', splitId: 'split_push', name: 'Push revised', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] },
      ], applied: [false, false],
      scheduleDraft: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null }, scheduleApplied: false,
      actions: [{ kind: 'goal_change', goal: 'strength' }], actionPrev: [null],
    }];
    const unfinishedRequests = [];
    const unfinishedCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const unfinishedPage = await unfinishedCtx.newPage();
    unfinishedPage.on('pageerror', e => errors.push(`silent-black unfinished: ${e.message}`));
    unfinishedPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) unfinishedRequests.push(request.url()); });
    await unfinishedPage.addInitScript(saved => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(unfinishedState));
    await unfinishedPage.goto(`http://localhost:${PORT}/`); await unfinishedPage.waitForSelector('.nav');
    await unfinishedPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const unfinished = unfinishedPage.locator('section').filter({ has: unfinishedPage.getByRole('heading', { name: 'Unfinished' }) });
    await unfinished.getByRole('button', { name: 'Review all' }).waitFor();
    if (await unfinished.getByRole('button', { name: 'Review', exact: true }).count() !== 3) errors.push('silent-black: unfinished list did not cap visible rows at three');
    await unfinishedPage.screenshot({ path: `${OUT}/silent-black-unfinished.png` });
    await unfinishedPage.setViewportSize({ width: 360, height: 800 });
    if (await unfinishedPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: unfinished list overflows at 360px');
    const firstReview = unfinished.getByRole('button', { name: 'Review', exact: true }).first();
    await firstReview.focus(); await unfinishedPage.keyboard.press('Enter');
    await unfinishedPage.getByText('Review saved drafts. Online questions are off.', { exact: true }).waitFor();
    if (await unfinishedPage.getByRole('textbox').count()) errors.push('silent-black: saved-only review rendered an online composer');
    await unfinishedPage.getByRole('button', { name: 'Create split: Saved full body' }).click();
    const afterCreate = await unfinishedPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (!afterCreate.splits.some(split => split.name === 'Saved full body') || afterCreate.coach.askThread[0]?.applied?.[0] !== true) errors.push('silent-black: eligible saved split did not apply and mark its exact item');
    // P03: the shared Ask sheet is now mounted once at App level (docs/escobar-presence)
    // specifically so it survives a tab switch instead of being silently discarded — applying
    // the draft above navigated to Train under the hood, and the still-open saved-review
    // dialog correctly stays open across that navigation rather than vanishing as a side
    // effect of the old per-tab mount unmounting it. Close it explicitly, the way a real
    // person now has to, before driving the nav bar again.
    await unfinishedPage.getByRole('button', { name: 'Close' }).click();
    await unfinishedPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await unfinishedPage.reload(); await unfinishedPage.waitForSelector('.nav');
    await unfinishedPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const restoredUnfinished = unfinishedPage.locator('section').filter({ has: unfinishedPage.getByRole('heading', { name: 'Unfinished' }) });
    if (await restoredUnfinished.getByRole('button', { name: 'Review', exact: true }).count() !== 3) errors.push('silent-black: finished saved split returned or pending items were lost after reload');
    await restoredUnfinished.getByRole('button', { name: 'Dismiss' }).first().click();
    const afterDismiss = await unfinishedPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (!afterDismiss.coach.askThread[0]?.draftDismissed?.some(Boolean)) errors.push('silent-black: explicit saved-item dismissal was not persisted');
    await restoredUnfinished.getByRole('button', { name: 'Review', exact: true }).first().click();
    await unfinishedPage.getByRole('button', { name: 'Apply new schedule' }).click();
    await unfinishedPage.keyboard.press('Escape');
    const afterSchedule = await unfinishedPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (afterSchedule.coach.askThread[0]?.scheduleApplied !== true || Object.values(afterSchedule.schedule).some(Boolean)) errors.push('silent-black: saved schedule did not apply atomically');
    const remaining = unfinishedPage.locator('section').filter({ has: unfinishedPage.getByRole('heading', { name: 'Unfinished' }) });
    await remaining.locator('.card').filter({ hasText: 'Goal: Strength' }).getByRole('button', { name: 'Review' }).click();
    await unfinishedPage.getByRole('button', { name: 'Change goal to Strength' }).click();
    const afterGoal = await unfinishedPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (afterGoal.goal !== 'strength' || afterGoal.coach.askThread[0]?.actionPrev?.[0] !== unfinishedState.goal) errors.push('silent-black: saved goal did not record the exact previous goal');

    const backupCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const backupPage = await backupCtx.newPage();
    await backupPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(afterGoal));
    await backupPage.goto(`http://localhost:${PORT}/`); await backupPage.waitForSelector('.nav');
    await backupPage.getByRole('button', { name: 'Settings' }).click();
    const unfinishedDownloadPromise = backupPage.waitForEvent('download');
    await backupPage.getByRole('button', { name: 'Export backup' }).click();
    const unfinishedDownload = await unfinishedDownloadPromise;
    const unfinishedBackupPath = join(ROOT, '.tmp', 'unfinished-backup.json');
    await unfinishedDownload.saveAs(unfinishedBackupPath);
    await backupCtx.close();

    const unfinishedRestoreCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const unfinishedRestorePage = await unfinishedRestoreCtx.newPage();
    await unfinishedRestorePage.goto(`http://localhost:${PORT}/`); await unfinishedRestorePage.waitForSelector('.nav');
    await unfinishedRestorePage.getByRole('button', { name: 'Settings' }).click();
    const unfinishedChooserPromise = unfinishedRestorePage.waitForEvent('filechooser');
    await unfinishedRestorePage.getByRole('button', { name: 'Restore backup' }).click();
    const unfinishedChooser = await unfinishedChooserPromise; await unfinishedChooser.setFiles(unfinishedBackupPath);
    await unfinishedRestorePage.getByText(/Restored \d+ sessions/).waitFor();
    const restoredUnfinishedState = await unfinishedRestorePage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (!restoredUnfinishedState.coach.dismissalEvidence?.['gate:*'] || restoredUnfinishedState.coach.askThread[0]?.draftDismissed?.[1] !== true || !restoredUnfinishedState.splits.some(split => split.name === 'Saved full body')) errors.push('silent-black: unfinished-item ledger or flags did not survive export and restore');
    await unfinishedRestoreCtx.close();

    await unfinishedPage.keyboard.press('Escape');
    const goalSection = unfinishedPage.locator('section').filter({ has: unfinishedPage.getByRole('heading', { name: 'Training goal' }) });
    await goalSection.getByRole('button', { name: 'Change', exact: true }).click();
    await unfinishedPage.getByRole('button', { name: /Set training goal to Muscle growth/ }).click();
    await unfinishedPage.waitForTimeout(350);
    const laterGoalState = await unfinishedPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    laterGoalState.coach.remoteExplainer = true;
    const undoCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const undoPage = await undoCtx.newPage();
    undoPage.on('pageerror', e => errors.push(`silent-black stale undo: ${e.message}`));
    undoPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) unfinishedRequests.push(request.url()); });
    await undoPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(laterGoalState));
    await undoPage.goto(`http://localhost:${PORT}/`); await undoPage.waitForSelector('.nav');
    await undoPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await undoPage.getByRole('button', { name: /Ask Escobar a question/ }).click();
    await undoPage.getByRole('button', { name: 'Undo' }).click();
    await undoPage.getByText('This item changed. Review the current version.', { exact: true }).waitFor();
    const afterStaleUndo = await undoPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (afterStaleUndo.goal !== 'growth') errors.push('silent-black: stale goal Undo overwrote a later goal choice');
    await undoCtx.close();
    if (unfinishedRequests.length) errors.push(`silent-black: saved-only review made external requests (${unfinishedRequests.join(', ')})`);
    await unfinishedCtx.close();

    // P03 (docs/escobar-presence 01-ARCHITECTURE.md §4, regression B03) forbids a nested
    // modal. AskSheet is now mounted once at App level and survives navigation (P03.3) — the
    // one new collision that introduced was Settings opening on top of an already-open Ask,
    // which App.tsx defers against explicitly. Every OTHER control that could open a second
    // modal (Today's Settings gear, History/Body's own sheets, Train's confirmations) lives
    // on a screen that isn't even rendered while Ask is open from Coach or Train (App.tsx only
    // mounts the active tab), and AskSheet's own internal navigation (go('train')/go('coach'))
    // never targets 'today' — so reaching them at all first requires leaving the currently
    // open native <dialog>. That's only possible if the browser's own modal-dialog inertness,
    // which showModal() is specified to apply to every other on-page control, actually holds
    // here — verified directly below rather than assumed: a real tap at the bottom nav while
    // Ask is open must do nothing.
    const nestedModalState = { ...unfinishedState, coach: { ...unfinishedState.coach, remoteExplainer: true } };
    const nestedModalCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const nestedModalPage = await nestedModalCtx.newPage();
    nestedModalPage.on('pageerror', e => errors.push(`silent-black nested-modal: ${e.message}`));
    await nestedModalPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(nestedModalState));
    await nestedModalPage.goto(`http://localhost:${PORT}/`); await nestedModalPage.waitForSelector('.nav');
    await nestedModalPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await nestedModalPage.getByRole('button', { name: /Ask Escobar a question/ }).click();
    await nestedModalPage.getByRole('heading', { name: 'Ask Escobar' }).waitFor();
    let navClickBlocked = false;
    try {
      await nestedModalPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click({ timeout: 2000 });
    } catch { navClickBlocked = true; }
    if (!navClickBlocked) errors.push('silent-black: nav click was not blocked while Ask was open — nested-modal risk is real, needs an explicit defer guard (see docs/escobar-presence/PROGRESS.md)');
    if (!(await nestedModalPage.getByRole('heading', { name: 'Ask Escobar' }).isVisible())) errors.push('silent-black: Ask sheet closed or the tab changed from a background nav click while modal-open');
    await nestedModalPage.keyboard.press('Escape');
    await nestedModalPage.getByRole('heading', { name: 'Ask Escobar' }).waitFor({ state: 'hidden' });
    await nestedModalCtx.close();

    // P03 contextual prefill (§4 "context by IDs, visible editable prefill"; A06): an
    // insight/suggestion's own detail sheet offers "Ask about this", seeding Ask's composer
    // with a visible, editable question about that exact finding rather than opening blank.
    // Proves the prefill actually lands in the real input (not just "no page errors") and that
    // it stays editable and unsent until the person acts.
    const prefillCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const prefillPage = await prefillCtx.newPage();
    prefillPage.on('pageerror', e => errors.push(`silent-black prefill: ${e.message}`));
    await prefillPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(nestedModalState));
    await prefillPage.goto(`http://localhost:${PORT}/`); await prefillPage.waitForSelector('.nav');
    await prefillPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const firstInsight = prefillPage.getByRole('button', { name: /^Open insight: / }).first();
    if (await firstInsight.count()) {
      const insightTitle = (await firstInsight.getAttribute('aria-label'))?.replace(/^Open insight: /, '') ?? '';
      const threadLenBefore = nestedModalState.coach.askThread.length;
      await firstInsight.click();
      await prefillPage.getByRole('button', { name: /^Ask Escobar about this$/ }).click();
      await prefillPage.getByRole('heading', { name: 'Ask Escobar' }).waitFor();
      const composer = prefillPage.locator('.ask-input input');
      const seeded = await composer.inputValue();
      if (seeded !== `About "${insightTitle}": `) errors.push(`silent-black: Ask's composer did not seed the expected contextual prefill (got "${seeded}")`);
      const stateAfterOpen = await prefillPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
      if (stateAfterOpen.coach.askThread.length !== threadLenBefore) errors.push('silent-black: opening Ask with a prefill sent a turn automatically instead of just seeding the composer');
      await composer.click();
      await composer.press('End');
      await composer.type('does this affect my next session?');
      if (!(await composer.inputValue()).endsWith('does this affect my next session?')) errors.push('silent-black: Ask\'s prefilled composer was not actually editable');
      await prefillPage.getByRole('button', { name: 'Close' }).click();
    } else errors.push('silent-black: no insight available to open — prefill scenario needs at least one Insights card in this fixture');
    await prefillCtx.close();

    // A01/A03's most direct claim: a typed-but-unsent question must not vanish just from
    // navigating away and back. The one path a real user can trigger navigation from *inside*
    // an already-open Ask sheet is an action button within it (e.g. applying a saved split
    // draft, which calls go('train') internally) — the bottom nav itself is inert while Ask is
    // open (verified above), so a plain nav-bar tab switch can't happen mid-conversation in the
    // first place. This is the scenario the P03.3 "unfinished coach items" fix made safe to
    // exercise; this one specifically checks the typed draft's own text, which that fix's own
    // scenario never asserted on.
    const draftCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const draftPage = await draftCtx.newPage();
    draftPage.on('pageerror', e => errors.push(`silent-black draft-survives-nav: ${e.message}`));
    await draftPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(nestedModalState));
    await draftPage.goto(`http://localhost:${PORT}/`); await draftPage.waitForSelector('.nav');
    await draftPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    await draftPage.getByRole('button', { name: /Ask Escobar a question/ }).click();
    await draftPage.getByRole('heading', { name: 'Ask Escobar' }).waitFor();
    const draftComposer = draftPage.locator('.ask-input input');
    await draftComposer.fill('Should I do this today or wait until tomorrow?');
    await draftPage.getByRole('button', { name: 'Create split: Saved full body' }).click();
    // The click above calls go('train') internally — tab content behind the still-open dialog
    // changes, but the dialog itself never unmounts, so its own `question` state must survive.
    if (await draftComposer.inputValue() !== 'Should I do this today or wait until tomorrow?') errors.push('silent-black: a typed-but-unsent Ask draft was lost after an in-sheet action navigated internally');
    if (!(await draftPage.getByRole('heading', { name: 'Ask Escobar' }).isVisible())) errors.push('silent-black: Ask sheet closed unexpectedly from an in-sheet action\'s internal navigation');
    await draftPage.keyboard.press('Escape');
    await draftPage.getByRole('heading', { name: 'Ask Escobar' }).waitFor({ state: 'hidden' });
    await draftCtx.close();

    const reopenState = structuredClone(unfinishedState);
    reopenState.coach.askThread = [];
    reopenState.coach.dismissed = {};
    reopenState.coach.snoozedUntil = {};
    reopenState.coach.accepted = {};
    reopenState.coach.dismissalEvidence = {};
    const captureCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const capturePage = await captureCtx.newPage();
    await capturePage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(reopenState));
    await capturePage.goto(`http://localhost:${PORT}/`); await capturePage.waitForSelector('.nav');
    await capturePage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const scheduleCard = capturePage.locator('.suggestion').filter({ hasText: 'Schedule' }).first();
    await scheduleCard.getByRole('button', { name: 'Not now' }).click();
    const capturedDismissal = await capturePage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    const scheduleEvidence = capturedDismissal.coach.dismissalEvidence?.['schedule:*'];
    if (!scheduleEvidence?.findings?.length) errors.push('silent-black: explicit proposal dismissal did not capture supporting evidence');
    else {
      scheduleEvidence.day = day(30);
      for (const finding of scheduleEvidence.findings) {
        const kept = finding.sessionIds.map((id, index) => ({ id, fingerprint: finding.sessionFingerprints[index] }))
          .filter(item => capturedDismissal.sessions.find(session => session.id === item.id)?.day <= scheduleEvidence.day);
        finding.sessionIds = kept.map(item => item.id);
        finding.sessionFingerprints = kept.map(item => item.fingerprint);
        if (finding.severity > 0) finding.severity -= 1;
        else finding.confidence = finding.confidence === 'high' ? 'medium' : 'low';
      }
      capturedDismissal.coach.dismissed['schedule:*'] = 2;
      capturedDismissal.coach.snoozedUntil['schedule:*'] = day(1);
    }
    await captureCtx.close();

    const reopenedCopy = /^New evidence since you dismissed this \d+ days ago: \d+ more sessions support it\.$/;
    const reopenedDismissCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const reopenedDismissPage = await reopenedDismissCtx.newPage();
    await reopenedDismissPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(capturedDismissal));
    await reopenedDismissPage.goto(`http://localhost:${PORT}/`); await reopenedDismissPage.waitForSelector('.nav');
    await reopenedDismissPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const reopenedCard = reopenedDismissPage.locator('.suggestion').filter({ has: reopenedDismissPage.getByText(reopenedCopy) });
    await reopenedCard.waitFor();
    await reopenedDismissPage.screenshot({ path: `${OUT}/silent-black-reopened-suggestion.png` });
    await reopenedCard.getByRole('button', { name: 'Not now' }).click();
    const afterReopenedDismiss = await reopenedDismissPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (afterReopenedDismiss.coach.dismissalEvidence?.['schedule:*']?.reopenedOnce !== true) errors.push('silent-black: dismissing a reappearance did not consume its lifetime offer');
    await reopenedDismissCtx.close();

    const reopenedAcceptCtx = await gateContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const reopenedAcceptPage = await reopenedAcceptCtx.newPage();
    await reopenedAcceptPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(capturedDismissal));
    await reopenedAcceptPage.goto(`http://localhost:${PORT}/`); await reopenedAcceptPage.waitForSelector('.nav');
    await reopenedAcceptPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Coach' }).click();
    const reopenedAcceptCard = reopenedAcceptPage.locator('.suggestion').filter({ has: reopenedAcceptPage.getByText(reopenedCopy) });
    await reopenedAcceptCard.getByRole('button', { name: 'Use this schedule' }).click();
    const afterReopenedAccept = await reopenedAcceptPage.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    if (afterReopenedAccept.coach.dismissalEvidence?.['schedule:*']?.reopenedOnce !== true || afterReopenedAccept.coach.accepted?.['schedule:*'] !== day(0)) errors.push('silent-black: accepting a reappearance did not consume and remember it');
    await reopenedAcceptCtx.close();
  }
  await nav.getByRole('button', { name: 'Today' }).click(); await page.getByRole('button', { name: 'Settings' }).click(); await page.waitForTimeout(300); await shot('settings');
  const state = await page.evaluate(() => ({ ...JSON.parse(localStorage.getItem('marc.state.v1')), legacy: !!localStorage.getItem('dailyTrackerPremium') }));
  console.log(theme, 'sessions:', state.sessions.length, 'splits:', state.splits.map(s => s.name).join(','), 'legacy untouched:', state.legacy);
  if (state.sessions.length < 25 || !state.legacy || state.splits.length !== 3) errors.push(`${theme}: legacy import produced unexpected state`);
  await ctx.close();
}
await browser.close();
stopping = true;
server.kill();
if (errors.length) { console.error('Page errors:', errors); process.exit(1); }
console.log('Screenshot gate PASS: 5 themes, no page errors, legacy import verified.');

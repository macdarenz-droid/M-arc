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

// Realistic legacy data so the migration path is exercised end to end.
const day = (offset) => { const d = new Date(); d.setDate(d.getDate() - offset); return d.toISOString().slice(0, 10); };
const iso = (offset, h = 17) => { const d = new Date(); d.setDate(d.getDate() - offset); d.setHours(h, 30, 0, 0); return d.toISOString(); };
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
const themes = ['silent-black', 'paper', 'ember', 'emerald', 'midnight'];
const errors = [];
for (const theme of themes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
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
    const reviewLbCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    const lbCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    const skipCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    const legacyCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    const trajectoryCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
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

    const restoreCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    const lbTrajectoryCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const lbTrajectoryPage = await lbTrajectoryCtx.newPage();
    await lbTrajectoryPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(lbState));
    await lbTrajectoryPage.goto(`http://localhost:${PORT}/`); await lbTrajectoryPage.waitForSelector('.nav'); await openStats(lbTrajectoryPage);
    if (!(await lbTrajectoryPage.getByText(/^Logged top load is rising about/).locator('..').innerText()).includes('2 lb per week')) errors.push('silent-black: lift trajectory did not render in lb');
    await lbTrajectoryCtx.close();

    const expiredState = structuredClone(trajectoryState);
    expiredState.sessions = expiredState.sessions.map((session, index) => { const offset = (7 - index) * 7 + 40; const sessionDay = day(offset); return { ...session, day: sessionDay, startedAt: iso(offset, 10), endedAt: iso(offset, 11) }; });
    const expiredCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const expiredPage = await expiredCtx.newPage();
    await expiredPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(expiredState));
    await expiredPage.goto(`http://localhost:${PORT}/`); await expiredPage.waitForSelector('.nav');
    await expiredPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click(); await expiredPage.getByRole('tab', { name: 'Stats' }).click();
    await expiredPage.getByText('This projection has expired; another logged session is needed to reassess it.', { exact: true }).waitFor();
    await expiredCtx.close();

    const deloadState = structuredClone(trajectoryState);
    deloadState.coach.deload = { from: day(0), to: day(-6), loadFactor: 0.85, effortCap: 'ideal' };
    const deloadCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const deloadPage = await deloadCtx.newPage();
    await deloadPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(deloadState));
    await deloadPage.goto(`http://localhost:${PORT}/`); await deloadPage.waitForSelector('.nav');
    await deloadPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click(); await deloadPage.getByRole('tab', { name: 'Stats' }).click();
    if (await deloadPage.getByText(/^Logged top load is rising about/).count() || await deloadPage.getByText(/^This projection has expired/).count()) errors.push('silent-black: easier week did not suppress lift trajectory');
    await deloadCtx.close();
    if (externalRequests.length) errors.push(`silent-black: lift trajectory made external requests (${externalRequests.join(', ')})`);
    await trajectoryCtx.close();
  }
  await nav.getByRole('button', { name: 'Body' }).click(); await page.waitForTimeout(300); await shot('body');
  if (theme === 'silent-black') { await page.locator('path.muscle').nth(2).click({ force: true }); await page.waitForTimeout(300); await shot('muscle-detail'); await page.keyboard.press('Escape'); await page.getByRole('tab', { name: 'Levels' }).click(); await page.waitForTimeout(250); await shot('levels'); }
  await nav.getByRole('button', { name: 'Coach' }).click(); await page.waitForTimeout(250); await shot('coach');
  if (theme === 'silent-black') { await page.locator('.insight').first().click(); await page.waitForTimeout(300); await shot('insight'); await page.keyboard.press('Escape'); }
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

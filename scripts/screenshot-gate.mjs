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
    await page.getByRole('heading', { name: 'Plan and actual' }).waitFor();
    const finishDebrief = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Plan and actual' }) });
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
  if (theme === 'silent-black') {
    const source = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')));
    const debriefState = structuredClone(source);
    debriefState.active = null;
    debriefState.coach.remoteExplainer = false;
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
        { exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', planEntryId: 'gate-pe-bench', actualSetIndices: [0, 1, 2, 3], sets: [{ kg: 60, reps: 8 }, { kg: 60, reps: 7 }, { kg: 62.5, reps: 6 }, { kg: 62.5, reps: 5 }] },
        { exerciseId: 'lib_dumbbell_lateral_raise', name: 'Dumbbell Lateral Raise', planEntryId: 'gate-pe-lateral', actualSetIndices: [0], sets: [{ kg: 5, reps: 12 }] },
      ], plan: { version: 1, capturedAt: `${currentDay}T09:59:00.000Z`, goal: debriefState.goal, deload: null, entries: planEntries } };
    debriefState.sessions = [priorSession, currentSession];
    const debriefRequests = [];
    const debriefCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
    const debriefPage = await debriefCtx.newPage();
    debriefPage.on('pageerror', error => errors.push(`silent-black debrief: ${error.message}`));
    debriefPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) debriefRequests.push(request.url()); });
    await debriefPage.addInitScript(saved => { localStorage.setItem('marc.state.v1', saved); localStorage.setItem('marc.theme', 'silent-black'); }, JSON.stringify(debriefState));
    await debriefPage.goto(`http://localhost:${PORT}/`); await debriefPage.waitForSelector('.nav');
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefPage.getByRole('button', { name: 'Edit' }).first().click();
    await debriefPage.getByRole('heading', { name: 'Plan and actual' }).waitFor();
    await debriefPage.getByText('Accepted target 62.5 kg × 6', { exact: true }).waitFor();
    await debriefPage.getByText('Starting suggestion, not a target learned from your history.', { exact: true }).waitFor();
    await debriefPage.getByText(/Additional set; logged 62\.5 kg × 5/).waitFor();
    await debriefPage.getByRole('button', { name: 'Show comparison' }).focus(); await debriefPage.keyboard.press('Enter');
    await debriefPage.getByText(/Previous: 60 kg × 10, 1800 kg total/).waitFor();
    await debriefPage.screenshot({ path: `${OUT}/silent-black-session-debrief-history.png` });
    await debriefPage.setViewportSize({ width: 360, height: 800 });
    if (await debriefPage.evaluate(() => document.documentElement.scrollWidth > innerWidth)) errors.push('silent-black: history debrief overflows at 360px');
    await debriefPage.setViewportSize({ width: 390, height: 844 });
    await debriefPage.keyboard.press('Escape');
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Body' }).click();
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefPage.reload(); await debriefPage.waitForSelector('.nav');
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefPage.getByRole('button', { name: 'Edit' }).first().click();
    await debriefPage.getByText('Accepted target 62.5 kg × 6', { exact: true }).waitFor();
    await debriefPage.keyboard.press('Escape');
    await debriefPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Today' }).click();
    await debriefPage.getByRole('button', { name: 'Settings' }).click();
    const debriefDownloadPromise = debriefPage.waitForEvent('download');
    await debriefPage.getByRole('button', { name: 'Export backup' }).click();
    const debriefDownload = await debriefDownloadPromise;
    const debriefBackupPath = join(ROOT, '.tmp', 'debrief-backup.json');
    await debriefDownload.saveAs(debriefBackupPath);
    await debriefCtx.close();

    const debriefRestoreCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    await debriefRestorePage.getByText('Accepted target 62.5 kg × 6', { exact: true }).waitFor();
    await debriefRestoreCtx.close();

    const debriefLbState = structuredClone(debriefState); debriefLbState.preferences.weightUnit = 'lb';
    const debriefLbCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const debriefLbPage = await debriefLbCtx.newPage();
    debriefLbPage.on('request', request => { if (!request.url().startsWith(`http://localhost:${PORT}/`)) debriefRequests.push(request.url()); });
    await debriefLbPage.addInitScript(saved => localStorage.setItem('marc.state.v1', saved), JSON.stringify(debriefLbState));
    await debriefLbPage.goto(`http://localhost:${PORT}/`); await debriefLbPage.waitForSelector('.nav');
    await debriefLbPage.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'History' }).click();
    await debriefLbPage.getByRole('button', { name: 'Edit' }).first().click();
    await debriefLbPage.getByText('Accepted target 138 lb × 6', { exact: true }).waitFor();
    await debriefLbCtx.close();
    if (debriefRequests.length) errors.push(`silent-black: session debrief made external requests (${debriefRequests.join(', ')})`);
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
    const unfinishedCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
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

    const backupCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
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

    const unfinishedRestoreCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    const undoCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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

    const reopenState = structuredClone(unfinishedState);
    reopenState.coach.askThread = [];
    reopenState.coach.dismissed = {};
    reopenState.coach.snoozedUntil = {};
    reopenState.coach.accepted = {};
    reopenState.coach.dismissalEvidence = {};
    const captureCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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
    const reopenedDismissCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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

    const reopenedAcceptCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
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

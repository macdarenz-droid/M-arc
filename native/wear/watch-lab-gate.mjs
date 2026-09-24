// Reuses the existing gate's CapacitorCustomPlatform approach; stubs are not device evidence.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const port = process.env.MARC_WEAR_GATE_PORT || '4176';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', port, '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
try {
  await Promise.race([
    new Promise((resolve, reject) => {
      server.stdout.on('data', data => { if (String(data).includes(port)) resolve(); });
      server.once('error', reject); server.once('exit', code => reject(new Error(`Preview exited: ${code}`)));
    }),
    new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('Preview timeout')), 15000); timer.unref(); })
  ]);
  browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || undefined, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.CapacitorCustomPlatform = { name: 'android' };
    const report = { schema: 1, run: '', active: false, authorized: false, receiverReady: false, devices: [], events: [], dropped: 0, persisted: true, environment: { stub: true } };
    const event = (kind, data = {}) => report.events.push({ n: report.events.length + 1, at: Date.now(), elapsed: performance.now(), kind, data, foreground: true, interactive: true });
    window.__wearCalls = [];
    window.__rejectWear = false;
    window.__exports = [];
    const nativeStubs = {
      Filesystem: {
        writeFile: async options => { window.__exports.push(options); },
        getUri: async () => ({ uri: 'file:///synthetic-backup.json' }),
      },
      Share: { share: async () => ({}) },
    };
    window.Capacitor = { isNativePlatform: () => true, Plugins: {
      WatchBridge: {
        isSupported: async () => ({ supported: false }), permissionState: async () => ({ granted: false }),
        status: async () => ({ state: 'idle' }), addListener: async () => ({ remove: async () => {} })
      },
      WearEngine: { workoutOwnership: async () => {
        const mode = localStorage.getItem('marc.test.owner');
        if (mode === 'failed') throw new Error('Ownership unavailable');
        if (mode === 'slow') return new Promise(resolve => { window.__resolveOwner = resolve; });
        if (mode === 'native') {
          const s = JSON.parse(localStorage.getItem('marc.state.v1'));
          const snapshot = JSON.stringify(s.active);
          const inputs = JSON.stringify({ version: 1, sessionId: s.active.id, capturedAt: new Date().toISOString(),
            restPolicy: { autoRest: s.preferences.autoRest, restDefaultSec: s.preferences.restDefaultSec, rest: s.preferences.rest },
            heartSource: 'ble', heartSamples: [] });
          return { owner: 'native', snapshot, seed: { handoverId: 'h-native', installationId: 'watch-1', snapshot, inputs } };
        }
        return { owner: mode === 'blocked' ? 'blocked' : 'web' };
      }, execute: async options => {
        window.__wearCalls.push(options.action);
        if (window.__rejectWear) throw new Error('Stub permission denied');
        if (options.action === 'begin') { report.active = true; report.run = 'stub-run'; event('begin'); }
        if (options.action === 'authorize') { report.authorized = true; event('authorization_result', { granted: true }); }
        if (options.action === 'devices') report.devices = [{ token: 'device-1', model: 'GT6 STUB', firmware: 'STUB', connected: true }];
        if (options.action === 'connect') { report.receiverReady = true; event('receiver_ready'); }
        if (options.action === 'probe') event('sdk_accepted', { operation: options.op });
        if (options.action === 'stop') { report.active = false; report.receiverReady = false; }
        return structuredClone(report);
      } }
    } };
    // WearEngine uses registerPlugin (unlike the legacy WatchBridge wrapper). Supply
    // Capacitor's native method header so its real proxy routes to this same stub.
    const wearStub = window.Capacitor.Plugins.WearEngine;
    nativeStubs.WearEngine = wearStub;
    window.Capacitor.PluginHeaders = Object.entries(nativeStubs).map(([name, methods]) => ({ name,
      methods: Object.keys(methods).map(name => ({ name, rtype: 'promise' })) }));
    window.Capacitor.nativePromise = (name, method, args) => nativeStubs[name]?.[method]
      ? nativeStubs[name][method](args) : Promise.reject(new Error('Unexpected native stub call'));
    const now = new Date();
    const localDay = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now.toISOString(), profile: { name: 'Gate A', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 }, goal: 'lean',
      splits: [], sessions: [], active: null, customExercises: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: false, reminders: { enabled: false, time: '17:30', style: 'silent' }, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [{ day: localDay, restingHr: 60, source: 'manual' }], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now.toISOString() }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: []
    }));
    if (localStorage.getItem('marc.test.active')) {
      const s = JSON.parse(localStorage.getItem('marc.state.v1'));
      s.active = { id: 's-1', splitId: 'split-1', startedAt: now.toISOString(), pausedMs: 0,
        entries: [{ id: 'e-1', exerciseId: 'lib_barbell_bench_press', name: 'Bench', done: false, skipped: false,
          sets: [{ id: 'set-1', kg: 60, reps: 8, effort: 'ideal', status: 'draft' }] }],
        rest: { endsAt: now.getTime() + 90000, totalSec: 90 } };
      localStorage.setItem('marc.state.v1', JSON.stringify(s));
    }
    if (localStorage.getItem('marc.test.storage-denied')) {
      // Test the browser platform independently of the native bridge stub.
      delete window.CapacitorCustomPlatform;
      window.Capacitor.isNativePlatform = () => false;
      Storage.prototype.getItem = function () { throw new Error('Storage denied'); };
    }
  });
  await page.goto(`http://localhost:${port}/`);
  await page.locator('nav.nav').waitFor();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const version = page.locator('[data-palace="settings.version"]');
  await version.waitFor();
  assert.equal(await page.getByRole('button', { name: 'Watch lab', exact: true }).count(), 0);
  assert.deepEqual(await page.evaluate(() => window.__wearCalls), []);
  const before = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('marc.state.v1')); return JSON.stringify([s.active, s.sessions, s.healthDays]); });
  for (let i = 0; i < 7; i++) await version.click();
  await page.getByRole('button', { name: 'Watch lab', exact: true }).click();
  await page.getByRole('heading', { name: 'Watch lab · Gate A' }).waitFor();
  await page.getByRole('button', { name: 'Begin diagnostic run' }).click();
  await page.getByRole('button', { name: '1. Authorize Wear Engine' }).click();
  await page.getByText('Authorization: granted', { exact: true }).waitFor();
  await page.getByRole('button', { name: '2. Discover paired watches' }).click();
  await page.getByLabel('Watch', { exact: true }).selectOption('device-1');
  await page.getByLabel('Watch app certificate fingerprint', { exact: false }).fill('stub-watch-certificate');
  await page.getByRole('button', { name: '3. Register watch receiver' }).click();
  await page.getByRole('button', { name: 'echo', exact: true }).click();
  await page.locator('pre').filter({ hasText: 'sdk_accepted' }).waitFor();
  assert.ok(!(await page.locator('pre').textContent()).includes('watch_reply'));
  const after = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('marc.state.v1')); return JSON.stringify([s.active, s.sessions, s.healthDays]); });
  assert.equal(after, before, 'Lab must not alter workout or health history');
  await page.evaluate(() => { window.__rejectWear = true; });
  await page.getByRole('button', { name: 'echo', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Stub permission denied' }).waitFor();
  const noCrashReset = async () => {
    for (const name of ['Reset app data', 'Reset app data and reload'])
      assert.equal(await page.getByRole('button', { name, exact: true }).count(), 0);
  };
  await noCrashReset();
  assert.deepEqual(errors, []);
  mkdirSync('screenshots', { recursive: true });
  await page.screenshot({ path: 'screenshots/watch-lab-stub.png' });
  // Rejected or timed-out optional reads must not take over the app (no lab action required).
  await page.clock.install();
  for (const mode of ['failed', 'slow']) {
    await page.evaluate(mode => {
      localStorage.setItem('marc.test.owner', mode);
      localStorage.setItem('marc.test.active', 'yes');
    }, mode);
    await page.reload();
    await page.locator('nav.nav').waitFor({ timeout: 3000 });
    if (mode === 'slow') {
      await page.getByRole('status').filter({ hasText: 'Checking watch workout' }).waitFor();
      await page.waitForFunction(() => !!window.__resolveOwner);
      // Render the shell immediately, but do not allow edits that a late native owner would replace.
      await page.locator('nav.nav button', { hasText: 'Live' }).click();
      await page.getByRole('main', { name: 'Checking watch workout', exact: true }).waitFor();
      assert.equal(await page.getByRole('button', { name: 'Finish', exact: true }).count(), 0);
      assert.equal(await page.getByRole('button', { name: 'More rest', exact: true }).count(), 0);
      assert.equal(await page.getByRole('heading', { name: 'Workout recovery', exact: true }).count(), 0);
      const activeBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1')).active);
      await page.locator('nav.nav button', { hasText: 'History' }).click();
      await page.getByRole('heading', { name: 'Sessions', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Settings and backup', exact: true }).click();
      await page.getByRole('button', { name: 'lb', exact: true }).click();
      await page.getByRole('button', { name: 'Export backup', exact: true }).click();
      await page.waitForFunction(() => window.__exports.length > 0 && !!JSON.parse(localStorage.getItem('marc.state.v1')).lastBackupAt);
      const exported = await page.evaluate(() => JSON.parse(window.__exports[0].data));
      assert.equal(exported.state.preferences.weightUnit, 'lb');
      assert.deepEqual(exported.state.active, activeBefore, 'Checking preserves the live workout while settings and exports work');
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      await page.getByRole('status').filter({ hasText: 'Checking watch workout' }).waitFor();
      await page.clock.fastForward(12001);
    }
    await page.getByRole('status').filter({ hasText: 'You can keep using M/ARC' }).waitFor();
    await page.locator('nav.nav button', { hasText: 'Live' }).click();
    await page.getByRole('button', { name: 'Finish', exact: true }).waitFor();
    assert.equal(await page.getByRole('heading', { name: 'Workout recovery', exact: true }).count(), 0);
    assert.deepEqual(await page.evaluate(() => window.__wearCalls), []);
    await noCrashReset();
  }

  // A prepared checkpoint (even with a failing bridge), a read native owner, and a
  // legacy native active record protect only the live workout. Other screens keep working.
  for (const mode of ['failed', 'native', 'blocked']) {
    await page.evaluate(mode => {
      localStorage.setItem('marc.test.owner', mode);
      localStorage.removeItem('marc.workout.handover.v1');
      if (mode === 'failed') {
        const snapshot = JSON.stringify(JSON.parse(localStorage.getItem('marc.state.v1')).active);
        localStorage.setItem('marc.workout.handover.v1', JSON.stringify({ version: 1, phase: 'prepared',
          seed: { handoverId: 'h-prepared', installationId: 'watch-1', snapshot, inputs: '{}' } }));
      }
    }, mode);
    await page.reload();
    await page.getByRole('status').filter({ hasText: 'Live workout needs recovery' }).waitFor();
    await page.locator('nav.nav button', { hasText: 'Live' }).click();
    await page.getByRole('heading', { name: 'Workout recovery', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Finish', exact: true }).count(), 0);
    assert.equal(await page.getByRole('button', { name: 'More rest', exact: true }).count(), 0);
    await noCrashReset();
    const frozen = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('marc.state.v1'));
      return { active: s.active, marker: localStorage.getItem('marc.workout.handover.v1') };
    });
    await page.screenshot({ path: `screenshots/watch-ownership-${mode}.png` });
    await page.locator('nav.nav button', { hasText: 'History' }).click();
    await page.getByRole('heading', { name: 'Sessions', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Settings and backup', exact: true }).click();
    await page.getByRole('heading', { name: 'Settings', exact: true }).waitFor();
    await page.getByRole('button', { name: 'lb', exact: true }).click();
    await page.getByRole('button', { name: 'Export backup', exact: true }).click();
    await page.waitForFunction(() => window.__exports.length > 0 && !!JSON.parse(localStorage.getItem('marc.state.v1')).lastBackupAt);
    const exported = await page.evaluate(() => JSON.parse(window.__exports[0].data));
    assert.equal(exported.state.preferences.weightUnit, 'lb', 'Settings writes and backup export still work');
    assert.deepEqual(exported.state.active, frozen.active, 'Backup keeps the protected live snapshot');
    assert.equal(await page.evaluate(() => localStorage.getItem('marc.workout.handover.v1')), frozen.marker);
    assert.equal(await page.getByRole('button', { name: 'Restore backup', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Reset workout data', exact: true }).count(), 0);
    assert.deepEqual(errors, [], 'Recovery failures must not reach the crash handler');
  }
  await page.evaluate(() => localStorage.setItem('marc.test.storage-denied', 'yes'));
  await page.reload();
  await page.locator('nav.nav').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Workout recovery', exact: true }).count(), 0);
  await noCrashReset();
  assert.deepEqual(errors, [], 'Unavailable web storage must not create watch recovery');
  console.log('Watch lab browser gate PASS: isolated lab; immediate shell; optional-read failure/timeout; scoped recovery with history/settings/export; web storage denial.');
} finally {
  if (browser) await browser.close();
  server.kill();
  if (server.exitCode === null) await once(server, 'exit');
}

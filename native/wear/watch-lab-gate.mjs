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
    window.Capacitor = { isNativePlatform: () => true, Plugins: {
      WatchBridge: {
        isSupported: async () => ({ supported: false }), permissionState: async () => ({ granted: false }),
        status: async () => ({ state: 'idle' }), addListener: async () => ({ remove: async () => {} })
      },
      WearEngine: { workoutOwnership: async () => {
        const mode = localStorage.getItem('marc.test.owner');
        if (mode === 'failed') throw new Error('Ownership unavailable');
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
    window.Capacitor.PluginHeaders = [{ name: 'WearEngine', methods: [{ name: 'execute', rtype: 'promise' }, { name: 'workoutOwnership', rtype: 'promise' }] }];
    window.Capacitor.nativePromise = (name, method, args) => name === 'WearEngine'
      ? wearStub[method](args) : Promise.reject(new Error('Unexpected native stub call'));
    const now = new Date();
    const localDay = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    localStorage.setItem('marc.state.v1', JSON.stringify({
      version: 1, createdAt: now.toISOString(), profile: { name: 'Gate A', bodyWeightKg: 78, heightCm: 180, sex: 'male', birthYear: 1990 }, goal: 'lean',
      splits: [], sessions: [], active: null, customExercises: [], schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null },
      preferences: { weightUnit: 'kg', restDefaultSec: 90, autoRest: true, haptics: false, reminders: { enabled: false, time: '17:30', style: 'silent' }, watch: { autoConnectOnSession: false }, rest: { mode: 'time', heartTargetPct: 0.6, minSec: 30 } },
      body: [], health: { connected: false }, healthDays: [{ day: localDay, restingHr: 60, source: 'manual' }], weightLog: [], profileHistory: [],
      onboarding: { dismissedAt: [], completedAt: now.toISOString() }, checkIns: [], recoveryModel: { tauScale: {}, observations: {} }, freshMarks: []
    }));
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
  assert.equal(await page.getByText('Reset local data', { exact: true }).count(), 0);
  assert.deepEqual(errors, []);
  mkdirSync('screenshots', { recursive: true });
  await page.screenshot({ path: 'screenshots/watch-lab-stub.png' });
  for (const mode of ['blocked', 'failed']) {
    await page.evaluate(mode => localStorage.setItem('marc.test.owner', mode), mode);
    await page.reload();
    await page.getByRole('heading', { name: 'Workout recovery', exact: true }).waitFor();
    assert.equal(await page.locator('nav.nav').count(), 0, 'No workout controls before ownership is verified');
    assert.equal(await page.getByText('Reset local data', { exact: true }).count(), 0);
    assert.deepEqual(errors, [], 'Recovery failures must not reach the crash handler');
    await page.screenshot({ path: `screenshots/watch-ownership-${mode}.png` });
  }
  console.log('Watch lab browser gate PASS: hidden by default; SDK acceptance distinct; rejection contained; stores unchanged.');
} finally {
  if (browser) await browser.close();
  server.kill();
  if (server.exitCode === null) await once(server, 'exit');
}

// Shared perf helpers for the How-to speed checks (card HT-3b, plan 2.9; HT-8 and HT-10 reuse them):
// CPU throttling, long-task capture, task duration and the median of repeated timed runs. Build and gate
// time only; never bundled (same rule as harness.mjs).

/** Throttles `page`'s CPU by `rate` (4 = the plan's 4x speed-check throttle) via CDP. Returns reset(),
 * which must be awaited before the context closes, or later CDP sessions on the same page inherit the
 * throttle. */
export async function throttleCpu(page, rate = 4) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  return { reset: () => cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }) };
}

/** Starts a PerformanceObserver('longtask') on `page`; call the returned stop() after the action
 * under test to read every task's duration (ms), then disconnects. Must be started before the action,
 * since 'buffered: true' only replays tasks already in the performance timeline at observe() time. */
export async function observeLongTasks(page) {
  await page.evaluate(() => {
    window.__marcLongTasks = [];
    window.__marcLongTaskObserver = new PerformanceObserver(list => {
      for (const e of list.getEntries()) window.__marcLongTasks.push(e.duration);
    });
    window.__marcLongTaskObserver.observe({ type: 'longtask', buffered: true });
  });
  return async () => page.evaluate(() => {
    window.__marcLongTaskObserver?.disconnect();
    return window.__marcLongTasks ?? [];
  });
}

/** Runs `action(i)` `n` times (default 5, the plan's sample size) and returns the median plus every
 * sample, in ms. */
export async function medianOf(action, n = 5) {
  const samples = [];
  for (let i = 0; i < n; i++) samples.push(await action(i));
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return { median, samples };
}

/**
 * Times `run()` on the page's own clock (User Timing marks + a measure), not Node's Date.now() around
 * Playwright calls — the CDP round trips before and after `run()` never enter the window. `run` performs
 * the Playwright actions under test (a click, a wait for a selector, ...) between the two marks. `name`
 * must be unique per call in the page (its marks and measure are cleared before returning).
 */
export async function taskDuration(page, name, run) {
  await page.evaluate(n => performance.mark(`${n}-start`), name);
  await run();
  return page.evaluate(n => {
    performance.mark(`${n}-end`);
    const { duration } = performance.measure(n, `${n}-start`, `${n}-end`);
    performance.clearMarks(`${n}-start`);
    performance.clearMarks(`${n}-end`);
    performance.clearMeasures(n);
    return duration;
  }, name);
}

/**
 * A synthetic main-thread block of `ms`, scheduled as its own task after `delay` ms. Used only to
 * prove the long-task check fails (HT3b-A3's mutation path), never a standing part of the gate.
 * A busy loop run inline inside page.evaluate() never registers with the Long Tasks API — CDP's
 * Runtime.evaluate does not schedule its body as an ordinary page task — so this schedules it with
 * setTimeout instead, which does.
 */
export async function scheduleBusyTask(page, ms, delay = 0) {
  await page.evaluate(([ms, delay]) => {
    setTimeout(() => { const end = performance.now() + ms; while (performance.now() < end) { /* busy */ } }, delay);
  }, [ms, delay]);
}

/** The main thread's TaskDuration so far, in ms (CDP Performance metrics; `cdp` has Performance enabled). */
export const taskDurationMs = async cdp => (await cdp.send('Performance.getMetrics')).metrics.find(m => m.name === 'TaskDuration').value * 1000;

/**
 * HT-10 (A3, plan 2.9 R10): the shimmer's main-thread cost at `rate`x CPU throttle on `page`, the same method as gate
 * block HT-8 so the two pages are measured alike: `n` idle windows and `n` tap windows of `windowMs` each, interleaved,
 * where a tap window starts by clicking `mapSel`; the cost is the median tap window minus the median idle window
 * (what the page does anyway, such as the app's live-workout clock behind the sheet, is not the shimmer's).
 * Returns { idle, runs, median, raw } in ms.
 */
export async function shimmerCost(page, mapSel, windowMs, { rate = 4, n = 3 } = {}) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  try {
    const win = async tap => {
      const m0 = await taskDurationMs(cdp);
      if (tap) await page.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error(`no ${s}`); e.click(); }, mapSel);
      await page.waitForTimeout(windowMs);
      return Math.round(await taskDurationMs(cdp) - m0);
    };
    const idle = [], runs = [];
    for (let k = 0; k < n; k++) { idle.push(await win(false)); runs.push(await win(true)); }
    const med = xs => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
    return { idle, runs, median: med(runs) - med(idle), raw: med(runs) };
  } finally {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await cdp.detach();
  }
}

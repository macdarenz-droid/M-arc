// F-VITEST-RPC-2: a worker-lag guard. vitest's worker answers its runner over RPC with a fixed 60 s limit (birpc's
// DEFAULT_TIMEOUT, no config key in vitest 3.2.7); a synchronous block of the worker's event loop that outlasts it ends
// the run with `Timeout calling "onTaskUpdate"` though every test passed (docs/evidence/vitest-rpc/NOTE.md). This guard
// times every event-loop gap of the worker that runs a test file and fails that file when its largest gap reaches the
// limit, naming the task that ran: the test, else `collect`, `beforeAll` or the hooks between tests.
// - The real setInterval and process.hrtime.bigint are captured when this module loads, so a test's
//   vi.useFakeTimers() cannot hide a block.
// - A 50 ms unref'd interval records every gap over 1 s; every hook boundary below also closes the gap so far against
//   the task that was running, and the last afterAll (a setup file's runs last: sequence.hooks 'stack') closes the final one.
// - Every block of 5 s or more prints one line: `[worker-lag] <file> <s> s at <task>`.
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

const realSetInterval = globalThis.setInterval, realClearInterval = globalThis.clearInterval;
const hrBig = process.hrtime.bigint;
const now = () => Number(hrBig.call(process.hrtime) / 1_000_000n);   // ms
const TICK = 50, RECORD = 1_000, PRINT = 5_000;

export type Block = { ms: number; task: string };

export function installLagGuard(limitMs: number): void {
  const blocks: Block[] = [];
  let task = 'collect', last = now(), file = '?';
  /** Close the gap since the last tick against the task that was running. */
  const tick = () => { const t = now(), gap = t - last; last = t; if (gap > RECORD) blocks.push({ ms: gap, task }); };
  const timer = realSetInterval(tick, TICK);
  (timer as any).unref?.();
  const enter = (name: string) => { tick(); task = name; };

  beforeAll((s: any) => { file = s?.filepath ?? s?.file?.filepath ?? file; enter('beforeAll'); });
  beforeEach(({ task: t }) => {
    const names: string[] = [];
    for (let x: any = t; x && x.type !== 'file'; x = x.suite) if (x.name) names.unshift(x.name);
    enter(`test "${names.join(' > ')}"`);
  });
  afterEach(({ task: t }) => { enter(`test "${t.name}"`); task = `hook after test "${t.name}" (afterEach/afterAll/beforeAll)`; });
  afterAll(() => {
    if (task.startsWith('hook after')) task = 'afterAll';   // after the last test only afterAll hooks run
    tick();
    realClearInterval(timer);
    const rel = file.replace(process.cwd() + '/', '');
    for (const b of blocks) if (b.ms >= PRINT) console.log(`[worker-lag] ${rel} ${(b.ms / 1000).toFixed(1)} s at ${b.task}`);
    const worst = blocks.reduce<Block | null>((a, b) => (!a || b.ms > a.ms ? b : a), null);
    if (worst && worst.ms >= limitMs) {
      throw new Error(`[worker-lag] ${rel}: the worker's event loop was blocked ${(worst.ms / 1000).toFixed(1)} s at ${worst.task} (limit ${limitMs / 1000} s; vitest's worker RPC times out at 60 s). Move that work out of the worker (child.it, nodeChild, an awaited child) — F-VITEST-RPC-2.`);
    }
  });
}

# VITEST-RPC design note

Card: `docs/supervisor/verify/vitest-rpc-card.md` (branch `claude/sup-lib4-cards` @ a2f0da69). Base: main 565ea5a4.

## 1. Harness (scratch, never committed)

- Local box: 4 CPUs, like CI's `ubuntu-latest` (public repo, 4 vCPU; the job logs print no CPU count). vitest 3.2.7, default `forks` pool, so both run 3 workers.
- Each pass: `TZ=<zone> vitest run` with the repo config plus one scratch setup file (in `node_modules/.vitest-rpc/`, ignored by git) and the JSON reporter.
- The setup file logs every event-loop lag over 5 s with the running test's name. It reads time from `process.hrtime`, captured before any test can install fake timers.
- 10 runs × 2 zones on main = 20 passes.

## 2. Evidence

**Main, 20 passes:** 20/20 green, 0 RPC errors, 3,256/3,256 tests each time. So the local rate is 0/20. The cause is still pinned down, and reproduced on demand (below).

**Event-loop blocks over 5 s, per test (max over 20 passes):**

| test | max lag | blocks |
|---|---|---|
| library-ci `D-LIB4c-3 …` | **68.9 s** | 4 in every pass: 19-24 s, 27-37 s, 19-69 s, 19-23 s |
| library-qa (3 tests) | 13.1 s | |
| gate-split, library-shared, library-fidelity, between tests | ≤ 20.4 s | |

library-lint S7 and c15-stamps "mutations, each red" never block (they spawn their generators async). Only D-LIB4c-3 comes near 60 s.

**Cause of the RPC error.** `tests/howto/library-ci.test.ts:309` runs `tools/plates/generate.mjs` through `execFileSync`, 4 times in one test. Each call freezes the worker's event loop for the whole generator run. birpc's timeout in vitest 3.2.7 is a fixed 60 s (`DEFAULT_TIMEOUT = 6e4`). If the runner's `onTaskUpdate` call is in flight when a block over 60 s starts, the timeout timer fires before the reply is read. The test still passes, and the run ends on 1 unhandled error. That is exactly the CI symptom.
- Local main: 1 of 80 blocks went over 60 s (68.9 s). It did not error, because no call was in flight at that moment. That is why the error is intermittent.
- CI is slower on this test: D-LIB4c-3 ran 228-327 s in CI (jobs 117873465483, 117936440025, 117958059923) against 233 s locally, so its blocks there are longer.

**Reproduced on demand (scratch test, 65 s child process):**
- `execFileSync('sleep', ['65'])` in a test: 2/2 tests pass, then `Errors 1 error`, `[vitest-worker]: Timeout calling "onTaskUpdate"`, rc 1. The stack is the same as CI's: `rpc.-pEldfrD.js:53:10`, then `index.B521nVV-.js:59:62`.
- The same 65 s child awaited (`promisify(execFile)`): 2/2 pass, 0 errors, rc 0.

**Second symptom (supervisor lead): library-fidelity `every tuple of the 8 …`, default 5 s timeout.**
- 20 passes on main: 965-1,695 ms, plus one 3,472 ms outlier. That outlier is the only pass where it overlapped the start of library-lint S7.
- Controlled run: the test alone, 5 runs, with N copies of `generate.mjs --check` looping in the background:
  - N = 0: 934-1,017 ms;
  - N = 2: 1,075-1,430 ms;
  - **N = 8: 3,689 / 5,094 (timed out) / 5,118 (timed out) / 4,942 / 4,682 ms.**
- Cause: CPU starvation, not an event-loop block. Two tests start one generator per case all at once, which puts 7-8 node processes on 4 CPUs next to 3 workers:
  - library-lint S7 `cases, each refused …`: 8 at once (`tests/howto/library-lint.test.ts:246`);
  - library-rows `7 mutations, each refused`: 7 at once (`tests/howto/library-rows.test.ts:153`).
  - c15-stamps already runs its generators one at a time for this reason (its comment at `tests/howto/c15-stamps.test.ts:128`).

## 3. Fix options

**A. Make D-LIB4c-3's generator calls async (proposed).** `tests/howto/library-ci.test.ts`:
- l.5: also import `execFile`; add `import { promisify } from 'node:util'`.
- l.289-290: `inTree` takes `(root) => void | Promise<void>` and runs `await edit(tree)`.
- l.309: `gen = (root) => promisify(execFile)(process.execPath, ['tools/plates/generate.mjs'], { cwd: root })`.
- l.310, 319, 325, 328: the 4 callbacks become `async root => { …; await gen(root); }`.

Why nothing is loosened:
- Same child, same arguments, same cwd and inherited env.
- A non-zero exit still throws, as `execFileSync` did. The file's own `run` helper would not: it resolves `{ code }` and uses a cleaned env, so a failed generate would go unnoticed. That is why `run` is not used here.
- The default output limit is 1 MiB on both.
- Assertions are byte-identical; 11 lines in, 10 out.
- Already built in a scratch worktree; typecheck passes.

**B. Bound the two generator fan-outs to 2 at a time (proposed).**
- `tests/howto/library-lint.test.ts:246` and `tests/howto/library-rows.test.ts:153`: `Promise.all(cases.map(f))` becomes `mapLimit(cases, 2, f)`.
- New helper `tests/howto/limit.ts`, about 8 lines. It returns results in input order, so every `for (const x of results)` assertion loop sees the same array.
- Each case still builds its own tree copy and runs the same generator. Assertions unchanged.
- Cost: those two tests take longer. Both files still run alongside library-ci (357 s), the slowest file, so the pass's wall time should not move. Measured in step 3.
- Why 2: N = 2 kept the fidelity test at ≤ 1.43 s, 3.5× under its 5 s budget. N = 8 timed out 2 times in 5.
- No timeout is raised.

**C. Pool or project isolation (not proposed).** Put the heavy files in their own vitest project with `maxWorkers: 1`.
- It touches `vite.config.ts`, a supervisor file.
- It does not cure A: a block over 60 s still times out in any pool.
- It serialises far more than the 2 offenders, and makes the pass slower.

**D. Raise the fidelity test's timeout (not proposed).** The card allows it only inside a proven fix. B removes the cause, so D is not needed.

## 4. Proof plan after the ruling

- 10 runs × 2 zones with the same harness, on the fix head: 0 RPC errors.
- D-LIB4c-3 has no lag line over 5 s.
- Fidelity `every tuple` max stays ≤ 2.5 s, half its budget.
- vitest JSON `numTotalTests` and summed `expect.getState().assertionCalls` per test are equal to main's.
- Mutations:
  - put `execFileSync` back in `gen`: the lag lines return (> 19 s each);
  - with B reverted (limit = cases.length), the N = 8 run times out again.
- Then `npm run check` and `npm run test:tz`.

Files touched: `tests/howto/library-ci.test.ts`, `tests/howto/library-lint.test.ts`, `tests/howto/library-rows.test.ts`, the new `tests/howto/limit.ts`, and this note. Nothing under `src/`, and no supervisor file.

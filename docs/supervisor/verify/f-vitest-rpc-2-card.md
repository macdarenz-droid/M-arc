# F-VITEST-RPC-2: no vitest worker blocks near the 60 s RPC limit, and a guard that keeps it so (tests only)

Owner: supervisor (drafted 11-14; status `drafted`, rulings asked). Base: origin/main `d92830c2` (train 94). Every file:line below was read on that commit. Builder: Opus (finding the blocks and choosing how to move each one is judgement work). It is a tooling card, so it holds no LIB slot.

Sources:
- #417's CI note 6875304498 and the ruling 6875323848 (D-W8B-RPC: one re-run only; this follow-up);
- #365 (F-VITEST-RPC): PR body, READY 6553171511, merge `fe05da01` @ `8a3bf1ff` (train 58, 11-02);
- `f-vitest-rpc-card.md` and `f-vitest-rpc-slow.md` (beside this card);
- `docs/evidence/vitest-rpc/NOTE.md` (VITEST-RPC: the cause, reproduced);
- COACHING-DECISIONS D-LIB13S-RPC, D-SMALL-RPCSYNC and D-SMALL-RPCGUARD;
- the vitest 3.2.7 dist (`package-lock.json:3680-3681`), read from the npm tarball.

## Supervisor rulings (2026-11-14; these win over the text below)
All 4 are accepted as recommended: **D-RPC2-GUARD** (30 s, no override), **D-RPC2-TARGET** (10 s local, 15 s CI), **D-RPC2-NOSPLIT** (F-UNITTZ-SPLIT only when a main unit-tz leg passes 90 min) and **D-RPC2-WIRE** (the one `vite.config.ts` setupFiles line, called out in the PR).
- No test is skipped or weakened, and a move to `child.it` keeps every assertion.
- The guard's red must name the test or hook.
- The 5 paired proof runs and the seeded reds (a failing assertion, and a 35 s block, in source-gate and both unit-tz legs, plus a `child.it` child) are the acceptance.

## Rulings asked

1. **D-RPC2-GUARD (recommended):** a permanent worker-lag guard runs in every vitest worker, including `child.it` children. It fails the file when any event-loop block in it reaches **30 s**, and names the test or hook. That is half of vitest's fixed 60 s RPC limit. There is no env var, flag or second limit.
2. **D-RPC2-TARGET:** every block is at most 10 s on a local full run with 4 CPUs (#365's bar), and at most 15 s in every CI job of the 5 proof runs. That leaves 2× headroom under the guard and 4× under the RPC limit.
3. **D-RPC2-NOSPLIT:** unit-tz is not sharded in this card (see Options).
   - A GATE-SPLIT-form card, F-UNITTZ-SPLIT, is written when a unit-tz leg on main passes 90 min, which is 75 % of its 120-min cap (build-apk.yml:95).
4. **D-RPC2-WIRE:** one added line in `vite.config.ts` (`test.setupFiles`), called out in the PR.
   - The precedent is F-GEN-WALK-SPEED's `globalSetup` line (`e060b5d8`, vite.config.ts:30).
   - `.github/**` does not change.

## Why now

**The symptom.** On #417 head `9fe595d0`, run 43575114292, both unit-tz legs exited 1 after every test had passed:

| job | leg | files | tests | vitest wall | job |
|---|---|---|---|---|---|
| 132387556116 | Asia/Manila | 328 passed | 6621 passed | 3999.60 s | 66.9 min |
| 132387556141 | America/New_York | 328 passed | 6621 passed | 4020.00 s | 67.2 min |

- Each leg logged `Errors 1 error`, an "Unhandled Error": `Error: [vitest-worker]: Timeout calling "onTaskUpdate"`.
- The stack is `rpc.-pEldfrD.js:53:10` (onTimeoutError) ← `index.B521nVV-.js:59:62` (birpc's timer). These are the frames NOTE.md section 2 reproduced on demand with a 65 s `execFileSync` in a test.
- No file is named.

**The recurrences found.**
- The two #417 jobs above.
- **Main itself:** `123c7299` (train 90, 11-13), run 43429547670, job 131899311587, unit-tz (America/New_York). 320 files and 6485 tests passed, then the same error after 4147.55 s (a 69-min job).
- **How they were found:** I scanned the 34 main runs of build-apk.yml since 11-02. Its only other failed unit test job is `cb9a6dae`'s source-gate (11-04). That one failed in the gate step after `278 passed`, not on RPC. Two of the 34 runs' job lists returned a server error and were not read.

**The mechanism (vitest 3.2.7, read in its dist).**
- birpc's `DEFAULT_TIMEOUT = 6e4` (`dist/chunks/index.B521nVV-.js:3`, :21) is armed per call (:57).
- The forks pool's RPC options (`dist/chunks/utils.CAioKnHs.js:25-41`) and `createRuntimeRpc` (`dist/chunks/rpc.-pEldfrD.js:37-55`) set no timeout, only the `[vitest-worker]` message. **No config key changes the 60 s.**
- After a long synchronous block, Node runs the expired timer before it reads the reply that is waiting. So a worker block over 60 s that starts while an `onTaskUpdate` call is in flight ends in this error, with every test green (NOTE.md section 2).
- Run mode uses `max(numCpus - 1, 1)` forks workers (`dist/chunks/coverage.DfSpMS-b.js:2976`), which is 3 on a 4-vCPU runner.

**Why #365 did not hold.** It fixed a list, not the class, and nothing stops a block coming back.
1. **Measured narrowly.**
   - Its targets came from a per-test duration profile (`f-vitest-rpc-slow.md`, main `5bcbddcf`).
   - Its block probe ran locally, on the 15 in-scope files only (READY 6553171511: "Local run of the 15 in-scope files, 4 cores").
   - Blocks in `beforeAll` hooks and in files outside that list were never measured.
2. **Lane files left out.**
   - Its scope excluded lb3, lb4, lb6, lb9, lb10 and lib-strip. LIB-SMALL then guarded only lb4 and lb10, by name: `build(Lb4|Lb10|Held|Plates)Page`, `gen.render` (D-SMALL-RPCGUARD).
   - `lb3-plates.test.ts:236-245` and `lb6-plates.test.ts:338-347` still run the repo's `render()` in a plain `it` in the parent worker. They go through `renderOf` (`tests/walk-cache.ts:102-109`), because F-GEN-WALK-SPEED (`e060b5d8`, 11-09) swapped `gen.render()` for `renderOf()`. A name guard would not see that call.
   - On `9fe595d0` those steps logged 153.6 s and 160.1 s (lb3) and 475.3 s and 479.2 s (lb6). How much of that is one block, and how much is waiting on another worker's cache lock or on yields, is not measured.
3. **The lib2b tree builders block.**
   - `fixtureTree()` → `stageTree()` → `ownRowsTree()` → `node()` is a `spawnSync` of a full `render()` (`tests/howto/fixtures/lib2b/fixture.mjs:63-92`, :95-105, :108-112, :163-166).
   - #365 measured this exact call as a 30.9 s block, locally (lib-4d R2 in the READY table). It moved only lib-4d's call and library-core L2-A4's call (`ownRowsTreeInChild`, `tests/child-test.ts:81`).
   - 16 calls remain, read on main, in 11 files:

     | file | lines |
     |---|---|
     | `library-rows.test.ts` | :38, :41 |
     | `library-ci.test.ts` | :286, :551, :673 |
     | `library-manifest-back.test.ts` | :35, :38 |
     | `tests/library/layers-back.test.ts` | :54, :56 |
     | `library-manifest.test.ts` | :74 |
     | `tests/library/layers-engine.test.ts` | :23 |
     | `library-back-page.test.ts` | :52 |
     | `library-authorqa.test.ts` | :15 |
     | `library-qa-h7.test.ts` | :15 |
     | `library-qa-h10.test.ts` | :13 |
     | `library-qa-h10-child.test.ts` | :31 |

     Files without a folder are in `tests/howto/`.
   - library-rows' file-level `beforeAll` (:36-45) also runs `render()` in the worker three times (:42, :43 via `renderOf`, :44).
   - library-core's `beforeAll` runs it once (:13-18, via `renderOf`).
4. **No guard, and the work keeps growing.**
   - Since #365's profile the suite grew from 272 files and 5,442 tests to 328 and 6,621 (`9fe595d0`).
   - `render()` grows with every shipped wave. library-core.test.ts:18 says it ran past 180 s on `3c6efe61`'s unit-tz. library-ci.test.ts:280-281 says "the map is proven" took 540.1 s at 69 rows.
5. **CI speed varies a lot.**
   - On `9fe595d0`, source-gate's vitest run took 2,478.17 s (job 132387556078, green), against 3,999.60 s and 4,020.00 s for the unit-tz legs. It is the same suite in the same run.
   - Main's unit-tz legs ranged from 35 to 69 min over its last 8 runs (`8a8ffab3` … `d92830c2`).
   - So a block measured locally at 30 s can pass 60 s on a slow leg. #365's targets were local numbers.

Which block fired in the two recurrences is not known. The error names no file, and no lag probe ran in CI (Not verified).

### Options weighed

- **A. Measure, move, guard (recommended).**
  - Measure every worker block in the full suite, locally and in CI. Move each one over the target out of the worker, in #365's forms. Then a permanent guard fails any file whose block reaches 30 s.
  - This removes the cause, a blocked worker event loop. It turns a random crash, which needs a call to be in flight, into a named red that always fires. And it holds as the suite grows, which is where #365 failed.
  - No check is loosened, and the guard is a new check.
- **B. Shard unit-tz per time zone (the GATE-SPLIT form): not chosen.**
  - Every shard still runs 3 workers on its own runner, and a block's length depends on its work and the runner's speed, not on the job's length. So each block still runs once per zone, and the crash stays possible.
  - Sharding only shortens the job. The legs are at 57-69 min against their 120-min cap.
  - It costs 2 more runners, a proof per shard, a verdict job, `.github` lines and the GATE-SPLIT equivalence proof.
  - It is a speed lever for later (D-RPC2-NOSPLIT).
- **C. Raise the RPC timeout: not available, and it would hide a fault.**
  - vitest 3.2.7 has no config key for it (Mechanism, above).
  - Changing it means patching or upgrading the dependency in `node_modules` or `package.json`, which the supervisor owns.
  - A worker blocked for over 60 s is the fault, not a slow harness.
- **D. Fewer workers (`maxWorkers`, or `pool: 'threads'`): not chosen.**
  - A synchronous block stalls a thread's event loop exactly as it stalls a fork's.
  - Fewer workers shortens blocks only by cutting CPU contention, and makes each leg slower. At 2 workers that is about 1.5×, which would put the legs near their cap.
  - It stays a fallback only if Stop 2 fires.
- **The mix:** A now. B is a later speed card, with a trigger. D is the fallback under Stop 2.

## Scope and write_scope

**Do:**
1. **The guard (D-RPC2-GUARD).**
   - `tests/worker-lag.ts` exports `installLagGuard(limitMs)`:
     - When it loads, it captures the real `setInterval` and `process.hrtime.bigint`, so a test's `vi.useFakeTimers()` cannot hide a block.
     - A 50 ms, unref'd interval records every gap over 1 s, with the task running: the test name (set by its own `beforeEach`/`afterEach`), else `collect`, `beforeAll` or `afterAll`.
     - Its `afterAll` also counts the gap since the last tick, so a block in the file's own last hook is caught. Under vitest's default `sequence.hooks: 'stack'` (`coverage.DfSpMS-b.js:3877`), a setup file's `afterAll` runs last.
     - It prints one line per block of 5 s or more: `[worker-lag] <file> <s> s at <task>`.
     - It throws when the file's largest block is at or over `limitMs`, naming the file, the task and the seconds.
   - `tests/worker-lag-setup.ts` is a single call: `installLagGuard(30_000)`.
   - `vite.config.ts`: add `setupFiles: ['tests/worker-lag-setup.ts'],` inside `test:` (:24-31). It then runs in:
     - source-gate's `npm run check` (build-apk.yml:50);
     - unit-tz's `npx vitest run` (:108);
     - the `MARC_PERF` run;
     - every `child.it` child, which loads the same config (`tests/child-test.ts:35-36`; no `--config` unless `MARC_TEST_CHILD_CONFIG`).
2. **Measure (the PLAN).**
   - Run the full suite with the guard on base main, with the limit set to Infinity on a scratch commit that is never merged:
     - locally with 4 CPUs, in both zones;
     - once in CI, on all three unit test jobs.
   - Post a table of every block of 5 s or more: file, task, local s, CI s per job.
   - Mark each block over the target (more than 10 s locally or more than 15 s in CI). That is the move list.
3. **Move each listed block out of the worker,** in #365's forms only:
   - an awaited child: `child.it`, `nodeChild`, `ownRowsTreeInChild`, or the file's own awaited `run`;
   - or yields between steps, so that no stretch passes the target.
   - **Expected forms (the PLAN confirms or argues):**
     - New add-only helpers in `tests/child-test.ts`, `fixtureTreeInChild(opts)` and `stageTreeInChild(opts)`, in the `ownRowsTreeInChild` form (:78-82). The 16 calls become `await …InChild(…)`, with the same options and the same tree returned by path.
     - For `render()` in the worker:
       - **`renderOf` and `inputsMapOf`:** their compute moves to an awaited node child that prints `encMap(render())`. The cache already stores text and gives every caller, the computing one included, `dec(text)` (`tests/walk-cache.ts:80-82`), so callers see the same decode. The key, the lock and `treeKey` are unchanged.
       - **library-rows :42 and :44:** the same child form.
       - **`feelAllOf`:** it holds a module instance (memoLocal), so it moves only if the PLAN measures it over the target, and then the PLAN names the form.
4. **Prove it:** the Acceptance and Mutations below.

**write_scope:**
- new: `tests/worker-lag.ts`, `tests/worker-lag-setup.ts`, `tests/worker-lag.test.ts`, `tests/fixtures/worker-lag/**`;
- `vite.config.ts`: the one `setupFiles` line;
- `tests/child-test.ts`: add-only helpers;
- `tests/walk-cache.ts`: only the compute bodies of `renderOf` and `inputsMapOf`, if the PLAN moves them;
- the hook and test lines in the PLAN's move list. They are expected in the 11 files above, plus `lb3-plates.test.ts`, `lb6-plates.test.ts` and `library-core.test.ts`.
- On 11-14, none of these files is edited by any of the 19 open PRs (checked with the PR files API).

**Not in scope:**
- unit-tz sharding (D-RPC2-NOSPLIT);
- any `.github/**` line: `tests/ci-unittz-split.test.ts` stays as it is;
- pool or worker settings;
- the five A9 `generate --check` children. lb4, lb7, lb8, lb9 and lb10 each logged about 530 s on `9fe595d0`. They are awaited, so they are load, not blocks. Folding them into the run's one render is a possible speed follow-up and is not part of this card.

## Acceptance

Each row is evidence on the READY head unless it says otherwise.

| id | check | evidence |
|---|---|---|
| A1 | The PLAN table: every block of 5 s or more on base main, local (both zones) and CI (source-gate, unit-tz New_York, unit-tz Manila), with file, task and seconds; the move list marked | PLAN comment, with run ids |
| A2 | Every listed block is moved, in #365's forms. Each entry gives file:line before and after. Test bodies, assertions, values, options and timeouts are byte-identical; the diff shows only the wrapper or the awaited call | diff; the reviewer reads every moved line |
| A3 | After the move: the largest block in every file is at most 10 s on a local full run in both zones, and at most 15 s in every CI job of the 5 proof runs (A6). This covers the parent workers and every `child.it` child | the `[worker-lag]` lines; a table of 15 job maxima |
| A4 | The guard is wired and fixed: `vite.config.ts` has the `setupFiles` line, the setup file calls `installLagGuard(30_000)`, and the guard reads no env var | `tests/worker-lag.test.ts` pins (red on main: the file is absent) |
| A5 | Counts: every job of every proof run has the same file and test counts. They equal base main's counts plus the guard's own tests. Nothing is skipped, deleted or loosened | the counts table |
| A6 | Five runs, each paired against the base counts: 5 CI runs of the READY sha (re-run all jobs, one after another; the concurrency group at build-apk.yml:17-19 cancels overlapping runs). Each run has source-gate, unit-tz New_York and unit-tz Manila green, with 0 `Timeout calling` lines. Every other job is green too | 5 run ids; grep counts |
| A7 | Seeded reds in every unit test job, on a scratch branch `claude/f-vitest-rpc-2-seed` (never merged). Each red is posted with its job id: | |
| | (a) one failing assertion (`expect(1).toBe(2)`) in a plain test is red in source-gate, unit-tz New_York and unit-tz Manila; | the three red jobs |
| | (b) a 35 s `execFileSync('sleep', ['35'])` in a plain test is a guard red, naming that test and ≥ 35 s, in all three jobs; | the three red jobs |
| | (c) the same 35 s block inside a `child.it` test turns that parent test red (child exit ≠ 0) in all three jobs. | the three red jobs |
| A8 | If `renderOf` or `inputsMapOf` moved: `node tests/walk-cache/equal.mjs` passes and `tests/walk-cache.test.ts` is green. Two trees from `fixtureTreeInChild` and from `F.fixtureTree()` are equal file for file | output posted |
| A9 | Run time: each unit test job's vitest wall time over the 5 runs is posted next to main's 35-69 min band. A leg slower than main's slowest is a Stop | the times table |
| A10 | The READY head contains the latest main. `npm run check` and `npm run test:tz` pass locally, and CI is green. A fresh Opus reviewer follows READY | CI links |

## Mutations

Each one must give a named red, posted with its lines. The guard's mechanism rows (m1-m6) run as fixtures: `tests/worker-lag.test.ts` starts an awaited child vitest on `tests/fixtures/worker-lag/` with its own config and `installLagGuard(2_000)`. This is the `tests/child-test.test.ts` form, so the real setup file keeps a single limit.

| id | mutation | red |
|---|---|---|
| m1 | A 3 s synchronous block in a test body | the fixture file fails, naming the test and ≥ 3 s |
| m2 | The same block in a `beforeAll` | fails, naming `beforeAll` |
| m3 | The same block at module top level | fails, naming `collect` |
| m4 | The same block in the file's last `afterAll` | fails, naming `afterAll` |
| m5 | The same block after `vi.useFakeTimers()` | fails |
| m6 | The same block inside a `child.it` test | the child fails, and so does its parent test |
| m7 | A 1.5 s block (under the fixture's 2 s limit) | green: control |
| m8 | The real wiring: a 35 s block in a scratch test under the real config | guard red at 30 s (local; CI in A7b) |
| m9 | A 65 s block under the real config | guard red, and the RPC error reproduced (NOTE.md's case): the guard trips on the real failure mode |
| m10 | The `setupFiles` line removed; the limit changed to 31 s; an env read added to the guard | A4's pins, each red |
| m11 | Each moved block put back in the worker (one at a time, local) | its `[worker-lag]` line returns at about its PLAN value; a guard red where that value is 30 s or more |

## Rules

- Read `.claude/skills/builder/SKILL.md` first. Branch `claude/f-vitest-rpc-2` from origin/main `d92830c2` or newer, and name the sha. Open a draft PR.
- **PLAN first.** Post `F-VITEST-RPC-2 PLAN @ <sha>` with A1's table, the move list and the form for each entry. Wait for PLAN RULED, then build. Then post `F-VITEST-RPC-2 READY @ <full sha>`.
- **Only where the work runs may change.** Every `expect`, value, option, timeout, fixture input and test name stays byte-identical. Never add `retry`, `skip`, `todo`, a raised timeout or a narrower `include`.
- **Never touch:**
  - `src/**`, `tools/**`, `qa/**`, `scripts/**`, `.github/**`, `package*.json`, `node_modules/**`;
  - `tests/howto/fixtures/lib2b/fixture.mjs`: its callers move, the fixture does not;
  - `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`;
  - `escobar-worker/**`, `native/wear/**`, signing and keystores, and saved-data shapes (AGENTS.md).
- **No new fan-out.** Moved builds stay sequential where they were sequential, with no new `Promise.all` over children. NOTE.md section 2 shows that 8 parallel generators starve a 5 s test.
- **CI reds are fixed, never re-run.** On this branch, a guard red or an RPC red is a finding to fix (D-W8B-RPC allows one re-run only on other PRs).
- No closing keywords in commits or in the PR body (F-COMMIT-KEYWORDS).

### Stops
Post the question and wait.
1. A block can only move by changing `tools/**`, `src/**` or the lib2b fixture.
2. An RPC timeout appears in a run where every `[worker-lag]` line in that job is under 30 s. That would show the cause is outside the workers, for example the main process starved of CPU. Fallback D then needs a supervisor ruling.
3. A file in the move list gains an open PR from another lane, for example a LIB-SHIP wave editing library-ci.test.ts.
4. A9: a leg is slower than main's slowest (69 min).

## Risks

- **The guard becomes a new flake.** A block near 30 s on a slow leg would turn main red at random. Mitigation:
  - D-RPC2-TARGET: at most 15 s on all 15 proof jobs, so 2× headroom;
  - the red names the block, so it is fixed, not re-run.
- **The cause is not a worker block.** Mitigation:
  - The probe gives the answer. If a recurrence comes with no block near the limit in that job, Stop 2 fires and the guard's numbers are the evidence.
  - The NOTE.md reproduction (m9) shows a worker block does produce this exact error and stack.
- **More child processes cost CPU.** That can slow the legs or starve short tests (NOTE.md section 2; #365's PR body: "each child also costs more CPU"). Mitigation:
  - no new fan-out;
  - A9's times against main's band;
  - Stop 4.
- **A render in a node child differs from one in vite-node.** Mitigation:
  - A8: walk-cache's own equality script and an equal-tree check;
  - the lb* A9 tests still compare every rendered output with the files on disk.
- **Lane clashes.** Every LIB-SHIP wave edits library-ci.test.ts's expected-count lines, and W8c is next. Mitigation:
  - only the hook lines change;
  - merge main with a merge commit;
  - Stop 3.
- **Blocks inside `child.it` children.** Each child has its own 60 s RPC, and a child's crash fails its parent test. Mitigation: the guard and the target apply in the children too (m6, A3).
- **The perf run sees the guard's timer.** Mitigation: it is one callback per 50 ms. Post the `MARC_PERF` budgets' timings before and after.

## Forecast

Each estimate covers build plus review. A CI run takes about 67 min of wall time (`9fe595d0`).
- **The guard, its fixtures and its pins:** about half a day.
- **Measurement (PLAN):** about half a day: 2 local full runs (about 30-45 min each, not re-measured here) and 1 CI run.
- **The moves:** half a day to a day. The 16 tree builds are one helper and mechanical edits. The in-worker renders need judgement.
- **The proof:** 5 sequential CI runs is about 6 h of wall time, plus 1 seed run of about 70 min. Review is about half a day.
- **Calendar:** about 2.5-3 days to merge.
- **Assumptions:**
  - the weekly usage limit allows about 7 full CI runs;
  - no lane opens a PR on the move-list files meanwhile.
- **Uncertainty:**
  - the length of the move list;
  - whether `render()`'s cost can leave the worker without touching `tools/**` (Stop 1);
  - whether CI's slowest legs keep the 15 s target.

## Not verified

- Which block fired in either recurrence. The error names no file, and no probe ran in CI.
- Every block length in this card. None was measured: I did not run the suite, because this checkout has no `node_modules`. The numbers are #365's (local, 11-01) or the tests' own log lines.
- That each of the 16 tree-build calls runs in a parent-worker hook and not in a `child.it` body. They were read, not traced.
- Why the unit-tz legs ran about 1.6× slower than source-gate's vitest on the same sha. It could be runner speed or the cost of the time zone.
- The CI runner's CPU count. The logs print none; NOTE.md section 1 says 4 vCPU, so 3 workers.
- That the main vitest process never delays a reply by 60 s under load (Stop 2 covers it).
- That a setup file's `afterAll` throw fails the file and exits 1 in vitest 3.2.7 (m1 proves it). Also that an interval made before `vi.useFakeTimers()` keeps firing (m5 proves it).
- Recurrences on PR branches other than #417, and in the 2 main runs whose job lists could not be read.

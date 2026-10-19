Card VITEST-RPC: the vitest worker RPC timeout in the unit runs (CI health, 2026-10-19)

id: VITEST-RPC
model: claude-opus-5-5 (root-cause work and a design note with evidence)
mode: auto
title: 'Builder: VITEST-RPC worker RPC timeout'
branch: claude/vitest-rpc (new, from main 565ea5a4). Your first push opens draft PR 'VITEST-RPC: vitest worker RPC timeout in the unit runs'.
lane: CI health. This card holds no LIB builder slot (D-LIB-LANE-ACTIVE counts LIB builders only).

Problem (evidence):
- `source-gate` red twice on #109 at "Unit tests in two more time zones": all tests passed, then the run ended on one unattributed unhandled error, `[vitest-worker]: Timeout calling "onTaskUpdate"`.
  - 013f84e: #109 6259613906.
  - 48d49bb: run 39211807255, the America/New_York pass; #109 6261836050.
- main 565ea5a4 was green with the same tests, so the error is intermittent.
- Likely cause (LIB-8M, unproven): single tests that hold a worker's event loop for minutes, for example library-ci "D-LIB4c-3 …" 254 s, library-lint S7 96 s, and c15-stamps "mutations, each red" 86 s. While blocked, the worker cannot answer the main process's RPC.

Goal: no unit pass (`npm test`, both `npm run test:tz` zones, local and CI) ends on a worker RPC timeout. Every test still runs with every assertion unchanged.

Stops (these override every other line):
1. Never skip, delete, narrow or loosen a test or an assertion, and never lower a test count. Raising a timeout is not a fix on its own; it is allowed only as part of a proven fix, with the note's evidence.
2. Edits to test files that other cards own (library-ci, library-lint, c15-stamps and the like) are limited to what the ruled note names. One example: an `execFileSync` chain becomes an awaited async call, with byte-identical assertions.
3. vite.config.ts, package.json and package-lock.json are supervisor files. You change them only as the ruled note says, and add no dependency.
4. Never write to the owner. Never cancel, re-run or dispatch a CI run that is not yours, and never re-run a run to make it green.

Do:
1. Reproduce on main 565ea5a4 in a clean worktree. Run the time-zone passes with CI's parallelism: read the runner's core count from the workflow and the logs, and match vitest's worker count to it. Repeat until you have an error rate with a count, or 10 clean runs.
   - Record per-test durations with a JSON reporter.
   - Measure event-loop lag in the workers with a scratch setup file that you never commit. It logs the running test whenever lag is over 5 s.
   - Attribute the RPC timeout to the test or tests that block, with log lines.
2. Post a design note on the PR: 'VITEST-RPC NOTE READY @ <sha>'. It holds the evidence from step 1, the cause, and the fix options, each with what it changes and why nothing is loosened. Examples:
   - make the named blocking chains async;
   - move the heavy files to their own pool or project, so they cannot starve RPC;
   - split a long test into files with the same assertions.
   Name every file and line you propose to touch. Then wait for 'VITEST-RPC NOTE RULED'.
3. Build the ruled fix. Then prove it:
   - the same harness gives 0 RPC errors in 10 repeated passes under CI parallelism, against step 1's rate on main;
   - test and assertion counts are equal before and after (vitest's JSON totals);
   - a mutation that puts one blocking chain back brings the lag above the threshold again, or the error back.
4. Run `npm run check` and `npm run test:tz`. Push once, then post 'VITEST-RPC READY: <full sha>'.

finish: merged on main in a merge train. You will notice: nothing in the app; CI stops failing on this error.
write_scope: the files the ruled note names, and this PR's body. Nothing under src/.

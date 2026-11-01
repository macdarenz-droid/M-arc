# Card F-VITEST-RPC: move long synchronous test work out of the vitest worker (tests only)

Status `ready` (supervisor, 11-01 ~02:45 UTC). It is a tooling card, not a drawing lane, so it holds no LIB slot. Branch `claude/f-vitest-rpc` from origin/main `5bcbddcf` or newer. Open a draft PR.

## Why
- vitest's worker answers its runner over RPC with a 60 s limit. A test that runs long synchronous work in the worker blocks that RPC, and under CI load the run exits 1 with `[vitest-worker]: Timeout calling "onTaskUpdate"`, even when every test passed.
- It hit #359 twice and #354 once, and appeared on #358's local `test:tz`. It is not a flake; it is the cause named in D-LIB13S-RPC (#359 6550232146).
- The profile of main `5bcbddcf` (`f-vitest-rpc-slow.md`, beside this card) finds 62 tests of 10 s or more; 45 run in-process. The worst in-process test is lb7-plates "LIB-17 zoom mutations" at 55.6 s, close to the 60 s limit.

## Scope (files no active lane owns)
- tests/howto: lb7-plates, lb8-plates, lb5-plates, lb1-plates, lb2-plates, lib8r-pilot-a3, library-shared, library-qa-h10, library-core, library-cards8, lib-4d.
- tests/library: lib7b, hand-pairs, closeups.
- **Not in scope**, because their lanes do the same move in their own PRs: lb3 (LIB-13s, done), lb4 (LIB-SPLIT), lb6 (#354), lb10 and lib-strip (#358), lb9 (LIB-SUPCORE / HELD-B).

## Do
1. For every in-process test of 10 s or more in scope (the list is in `f-vitest-rpc-slow.md`), move its heavy work into an awaited child process. Use the form already on main: lb7-lb10's `generate --check` children (D-LIB8M-RPC) and LB3's whole-page builds (D-LIB13S-RPC). A cheaper move is fine for a long loop, as long as the work never blocks the worker for more than 5 s at a stretch (yield between steps).
2. **Only where the work runs may change.** Every `expect`, every mutation and every value stays byte-identical in meaning. The diff for each test shows only the harness wrapping. List each moved test with its file:line before and after.
3. Equivalence:
   - For each moved test, run its own mutation red against the new form, then green again.
   - Run the whole suite twice locally and confirm the same test count.
4. Re-run the profiler (`npx vitest run --reporter=json`) and show that no in-scope test blocks the worker for 10 s or more.

## Acceptance
- **A1:** the profile after the change has 0 in-process tests of 10 s or more in scope; each moved test is listed.
- **A2:** the test count is identical before and after; no test is skipped, deleted or loosened. The reviewer reads every moved test's diff.
- **A3:** each moved test's own mutation is red, then green again.
- **A4:** `npm run check` and `npm run test:tz` pass locally, and CI's unit-tz and source-gate are green on the head, with no RPC timeout.

## Never
- Change any assertion, threshold, mutation or expected value.
- Touch src/**, tools/**, qa/**, .github/** or package.json. Raising the RPC limit is a config workaround, not a root cause.
- Edit a file in the "not in scope" list.

Posts, each in a comment of its own: `F-VITEST-RPC READY @ <sha>`, with the before and after profile tables. A fresh Opus reviewer follows, then a merge train.

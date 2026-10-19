Card LIB-4e: re-qualify howto-shard P = 4 (speed; D-LIB4b-P1 follow-up; 2026-10-18)

id: LIB-4e
model: claude-opus-5-5 (root-causing a rare stall; not mechanical)
mode: auto
branch: claude/lib-4e-p4 (new), based on origin/main once LIB-4b and LIB-4c are on main.
depends_on: LIB-4b (#232) and LIB-4c (#246) merged.
lane: a LIB builder slot. It is queued after LIB-4d and the LB1 critical path. It is not on LB1's path, but it is on the speed path for every later batch.

**Why.**
- LIB-4b withdrew P = 4 on 2026-10-18 (#232 6250306424; `7679566f`, DEFAULT_P = 1). One local Chromium 141 run at P = 4 on `e607bb5` had 3 red rows: machine_chest_press, paper, HT9/show-1..3@390. `settleApp` timed out after 8 s, and the cause could not be shown to be independent of P.
- What is known:
  - 4 diagnostic runs and targeted repros did not reproduce it;
  - on CI Chrome 153, P = 4 gave 2 identical dispatches (#246 6250455687);
  - a proven latent mechanism: a feel-map sweep paused by its hold observer stays in `document.getAnimations()` and hangs `settleApp`. The gate's HT-9 Show block shares `settleApp`.
- The cost: at P = 1 the library needs about one CI job per id, roughly 18 min each, so about 154 jobs per full run at 153 ids. P = 4 cut job-seconds about 3.5 times (B7).

**Do:**
1. Measure.
   - Run the HT6/HT9/HT10 families of `--ids golden8` 10 times at P = 4 and 10 times at P = 1 on local Chromium 141, plus at least 3 full runs at P = 4 on a supervisor-pushed scratch ref (Chrome 153).
   - Keep the HT-9 twin's crash diagnosis on. Post the failure count per arrangement, and name every stall the diagnosis printed.
2. Root-cause each stall from what the diagnosis names. Fix the cause where it lives (runner, twin or app), never by making `settleApp` skip or ignore an animation, or by raising a timeout.
3. The latent paused-sweep mechanism:
   - prove whether any library or gate path can reach it, and if one can, fix it;
   - a change to scripts/screenshot-gate.mjs or the app comes only as a proposal on the PR. The supervisor rules (shared, add-only file).
4. Re-adopt P = 4 only when every stall seen has a fixed root cause and the step 1 runs are clean afterwards. Re-run B7's equivalence on the final head: P = 1 against P = 4 must give identical rows and px (par.mjs).
5. With P = 4 back, refresh LIB-4c's per-id seeds and K table from one CI calibration run, the same as C14.

**Acceptance:**
- the step 1 counts are posted;
- every stall is root-caused, each with a test or fixture that is red before its fix;
- B7 is identical on the final head;
- DEFAULT_P's unit test pins the adopted value.

Nothing is loosened: no timeout is raised, no animation is ignored, no row is skipped. If a stall stays unexplained, P stays at 1 and the card reports it.

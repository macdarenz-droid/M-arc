# GATE-SPLIT design

Card GATE-SPLIT (owner approval 2026-10-02, AGENTS.md ownership-table exception). Design note only. Code comes after HT-10 (#166) merges. Decisions are recorded as D-GATESPLIT-* in `docs/COACHING-DECISIONS.md`.

**Goal:** CI per push from about 45 min to about 25 min or less. Every gate block, time zone and theme still runs exactly once per run, and nothing is dropped or loosened.

**Short version:**
- The gate stays one file.
- Each top-level block gets one added line in front of it, `if (gate.runs('<TASK-ID>'))`. No other line of the block changes.
- A CI job set to `MARC_GATE_JOB=k/K` runs only the blocks the shared packer assigns to job k. With the variable unset (local `npm run gate`), it runs everything, as today.
- Every job writes a proof file in HT-10's `writeProof` format.
- One verdict job checks every proof file against the block list generated from the file at that exact sha. The verdict also covers HT-10's shards now and LIB-4's shards later.
- Proposed K = 3 jobs per time zone, about 19-21 min per push.

## 1. Measured time

### 1.1 Whole gate on CI (main `94fd32c`, run 36991137718, Chrome 153.0.8010.12)

| Job | Gate step | Other steps | Job total |
|---|---|---|---|
| `source-gate` (UTC) | 2,397 s (39:57) | 3:38: worker check 11 s, relay 5 s, `npm run check` 76 s, `test:tz` 97 s, Chromium install 20 s | 43:40 |
| `visual-gate-tz` (Pacific/Auckland) | 2,285 s (38:05) | build 11 s, Chromium install 23 s | 38:52 |
| `android-gate` (train 9 run 36902061299, after both gates) | — | APK build 2:24 | 3:07 |

Train 9 took 42.4 min from push to green: `source-gate` 39.2 min, then `android-gate` 3.1 min.

From the CI log timestamps (UTC job), the gate splits into three parts:
- blocks before HT-1: 935 s;
- HT-1 to HT-8: 1,226 s, of which HT-3 284 s, HT-4 254 s, HT-8 266 s, HT-6 229 s, HT-7 133 s, HT-3b 43 s, HT-1 and HT-2 15 s each;
- blocks after HT-8: 235 s.

### 1.2 Per block (local, main `94fd32c`, TZ=UTC, `MARC_CHROMIUM=/opt/pw-browsers/chromium` = Chromium 141.0.7390.37, 4 vCPU)

**Method:**
- A scratch copy of the gate had one timer call inserted before each top-level statement. Nothing else changed, and the copy was deleted afterwards.
- The run **passed**: `Screenshot gate PASS`, exit 0, 2,584 s wall time (CI on Chrome 153: 2,397 s).
- A group is a run of top-level statements under one header comment. These are the units that get assigned to jobs (3.2).

**Chrome 153:**
- I could not run Chrome 153 locally. The container has Chromium 141, and `playwright install` is not allowed here.
- CI's Chrome 153 numbers in 1.1 give the scale: CI/local is 0.93 overall, 0.91 for the HT blocks and 0.95 for the rest.
- The job balance below uses local times. The first CI run of the build replaces them with Chrome 153 times taken from the proofs (4.1).

**Shared setup per gate process** (measured locally): the preview server and the first browser launch take 1.4 s, and teardown takes 0.1 s.

**Shared setup per CI job** (measured on CI): checkout 2-3 s, setup-node 2-4 s, `npm ci` 2-3 s (cached), build 11-15 s, and Chromium install 20-23 s, once 114 s (run 36902061299). That is about 45 s per job, sometimes about 2.5 min.

**Fixtures:** the legacy fixture is built in memory at module load (lines 86-104) and takes under 0.1 s, so it has no separate cost.

90 groups, 2,582 s in total. The groups marked * have no task ID in their header, so the builder names them from the card that added them (`git log -L`). `BASE` is the first theme walk at line 112.

| Group (line) | s | Group (line) | s | Group (line) | s |
|---|---:|---|---:|---|---:|
| BASE (112) | 49.1 | I14 (299) | 31.6 | I18 (393) | 1.6 |
| I15 (423) | 15.8 | I16 (478) | 19.4 | I17 (545) | 8.4 |
| BUG-12 (616) | 9.8 | BUG-10 (709) | 3.8 | R2 (741) | 2.1 |
| QA6-2 (768) | 1.9 | I12 (822) | 2.8 | QA13-3 (879) | 1.3 |
| QA13-4 (932) | 1.3 | QA13-5 (995) | 1.3 | QA13-6 (1035) | 1.3 |
| O4 (1094) | 6.4 | A6 (1154) | 3.4 | QA14-1 (1290) | 3.6 |
| R6 (1347) | 26.5 | Plate* (1651) | 16.4 | QA4-5 (1742) | 6.6 |
| Palace* (1781) | 18.2 | I6.1 (1828) | 3.0 | QA11-1 (1863) | 1.9 |
| ESC-NC (1901, incl. the 1908 loop) | 30.6 | BUG-31 (2054) | 3.5 | ESC-REPORT (2121) | 44.3 |
| Live* (2253) | 25.9 | R5 (2308) | 1.4 | F5.1 (2357) | 8.2 |
| UI-1 (2477) | 25.2 | I6.2 (2573) | 4.1 | A3 (2639) | 11.0 |
| I7 (2764) | 12.0 | F13 (2866) | 86.6 | I1 (3029) | 5.9 |
| A9 (3096) | 5.2 | A1 (3133) | 5.2 | A8 (3223) | 5.0 |
| F9 (3274) | 12.6 | BUG-18 (3378) | 2.0 | F8 (3423) | 9.5 |
| QA5-1b (3478) | 7.5 | QA5-5b (3541) | 35.8 | F5.2 (3576) | 7.3 |
| O3 (3621) | 55.7 | Hotfix* (4047) | 9.9 | QA10-3 (4187) | 12.2 |
| QA10-7 (4330) | 7.7 | I9 (4372) | 2.7 | I10 (4407) | 6.5 |
| I11 (4507) | 7.3 | A5 (4570) | 5.9 | AUD-11 (4655) | 96.7 |
| QA12-3 (4816) | 0.3 | O1.1 (4859) | 3.4 | QA12-1 (4918) | 0.8 |
| O2 (4941) | 12.3 | O1.2 (5070) | 0.4 | BUG-34 (5092) | 10.5 |
| A4 (5226) | 34.2 | COACH-FB (5279) | 6.5 | BUG-8 (5352) | 2.2 |
| BUG-9 (5410) | 11.4 | BUG-19 (5502) | 39.7 | BUG-22 (5708) | 37.2 |
| BUG-15 (5847) | 0.9 | BUG-17 (5890) | 1.7 | LT-3 (5934) | 1.0 |
| ADAPT-4 (5975) | 6.0 | LT-4 (6060) | 2.5 | BUG-23 (6106) | 1.2 |
| FG-OFF (6132) | 9.6 | BUG-27 (6201) | 6.8 | PLAY-1 (6265) | 8.3 |
| HT-1 (6303) | 17.8 | HT-2 (6316) | 22.4 | HT-3 (6366) | 308.1 |
| HT-6 (6400) | 239.2 | HT-3b (6653) | 45.4 | HT-7 (6970) | 147.3 |
| HT-4 (7274) | 295.3 | HT-8 (7376) | 274.0 | COPY-1 (7682) | 8.5 |
| AUD-20 (7740) | 35.5 | BUG-36 (7832) | 37.0 | BUG-37 (7946) | 127.1 |
| AUD-10 (8062) | 10.9 | AUD-12 (8218) | 5.0 | COPY-2 (8300) | 20.3 |

**Limits on these numbers:**
- They come from one local run on one Chromium version, so they are good enough for balancing and not more.
- The Auckland gate was not timed per block locally. On CI it is 0.95 × the UTC job (2,285 / 2,397 s), and no block runs only in one time zone, so the same balance is used for both.

## 2. Job count and assignment

### 2.1 Packing
- **Method:** longest-processing-time packing on the committed times. Groups are sorted by seconds (descending, then key), and each goes to the job with the least total so far (ties go to the lowest index). Within a job, blocks run in file order (3.1).
- **Lower bound:** the longest group, HT-3, at 308 s locally (284 s on CI).

| K per TZ | Max job (local s) | ≈ CI gate step | Gate jobs | Peak jobs at once for one push |
|---|---:|---:|---:|---:|
| 1 (today) | 2,582 | 40 min | 2 | 3 (+ guard) |
| 2 | 1,291 | 20 min | 4 | 8 |
| **3** | **861** | **13.3 min** | **6** | **10** |
| 4 | 646 | 10.0 min | 8 | 12 |
| 5 | 517 | 8.0 min | 10 | 14 |
| 8 | 323 | 5.0 min (HT-3 bound) | 16 | 20 |

### 2.2 Proposal: K = 3 per time zone (D-GATESPLIT-K)

**Assignment** (local seconds, the same for UTC and Pacific/Auckland):
- **Job 1** (861 s, 30 groups): BUG-12, QA13-5, O4, Plate*, QA11-1, ESC-NC, Live*, F5.1, I6.2, A9, A1, F8, QA10-3, I9, I11, AUD-11, O1.1, O2, COACH-FB, BUG-8, BUG-19, BUG-15, BUG-17, LT-3, HT-2, HT-3, HT-3b, AUD-20, BUG-37, AUD-10.
- **Job 2** (860 s, 31 groups): BASE, I14, I18, R2, QA13-4, QA14-1, R6, I6.1, BUG-31, A3, I7, F13, I1, F9, BUG-18, QA5-1b, QA5-5b, Hotfix*, I10, QA12-3, O1.2, BUG-22, BUG-23, BUG-27, PLAY-1, HT-1, HT-7, HT-4, COPY-1, AUD-12, COPY-2.
- **Job 3** (861 s, 29 groups): I15, I16, I17, BUG-10, QA6-2, I12, QA13-3, QA13-6, A6, QA4-5, Palace*, ESC-REPORT, R5, UI-1, A8, F5.2, O3, QA10-7, A5, QA12-1, BUG-34, A4, BUG-9, ADAPT-4, LT-4, FG-OFF, HT-6, HT-8, BUG-36.
- **Plus**, after HT-10 merges: the group `HT-10` (its `MARC_HT10_OWN_JOB=1` skip branch, 60 s budget, D-HT10-A5c-2) and HT-10's clock lines (3.4).

These lists are illustration only. The real assignment is computed by the code from `scripts/gate-times.json` at each sha (3.2), so no one maintains it by hand.

**Expected wall time per push** (estimates from the measurements above):

| Stage | Time |
|---|---|
| `web-build` (checkout, npm ci, build, validate, upload `www`) | ≈ 0.8 min |
| gate job: setup ≈ 0.7 min (2.5 at worst) + gate 13.3 min × about 1.05 for imbalance on Chrome 153 | ≈ 14.7 min (16.5 at worst) |
| `gate-verdict` (download proofs, check) | ≈ 0.5 min |
| `android-gate` | 3.1 min |
| job pick-up gaps | ≈ 0.5 min |
| **Total** | **≈ 19.5 min (≈ 21.5 at worst)**, against 42-47 today |

**Why 3 and not 4:**
- K = 4 saves about 3 min more, but needs 12 runners at once per push.
- SPEED.md measured queueing from about 15 running jobs, and several builder branches often push together.
- At K = 3, two pushes in flight use about 20 jobs, the account's limit.
- K is one number (`K` in `scripts/gate-times.json`). The supervisor may move it to 4 when few lanes are active. Nothing else changes.

**Jobs per push at K = 3:** 13 in total.
- `guard`, `source-checks`, `web-build` and `android-gate`: 1 each.
- `gate` (UTC and Auckland × 3): 6.
- `ht10-gate`: 2.
- `gate-verdict`: 1.

At peak 10 run at once: 6 gate, 2 ht10, `source-checks` and `guard`. The repo is public, so runner minutes are not billed (to verify on the owner's plan; SPEED.md also leaves this open).

**Not measured: `ht10-gate`.**
- HT-10 has not run on main, and its shard budget is 25 min each (D-HT10-A5).
- A shard longer than about 15 min becomes the critical path instead of the gate jobs.
- The same mechanism fixes it: raise `MARC_HT_SHARD`'s N (htShard is modulo over tuples, so any N is valid and proven by `coverProblems`). The supervisor rules on N after HT-10's first CI run (D-GATESPLIT-HT10).

**Gate growth:** every new block adds time. The supervisor re-picks K when the longest gate job passes 15 min on CI. The verdict prints each job's seconds, so this is visible on every run.

## 3. Selecting a block without changing what it checks

### 3.1 The diff shape
Three harness lines and one guard line per top-level statement. Pure insertions: no existing line is edited, moved or deleted.

```diff
 const errors = [];
+const gate = await (await import('./gate-split.mjs')).gateSplit({ errors, OUT, file: fileURLToPath(import.meta.url) });
+if (gate.runs('BASE'))
 for (const theme of themes) {
```
```diff
 // BUG-12: on Stats > Weekly volume, the "avg" label ...
 // ...
+if (gate.runs('BUG-12'))
 {
```
```diff
 // I14: WCAG contrast (>=4.5:1 against the nearest opaque ancestor background) for small/secondary
+if (gate.runs('I14'))
 for (const theme of themes) {
```
```diff
 const bug22Runs = [];
+if (gate.runs('BUG-22'))
 for (const theme of ['silent-black', 'paper']) for (const inset of ['none', 'env48', 'var48', 'raised60']) bug22Runs.push({ theme, inset });
+if (gate.runs('BUG-22'))
 for (const theme of ['silent-black', 'paper']) bug22Runs.push({ theme, inset: 'samsung' });
+if (gate.runs('BUG-22'))
 for (const { theme, inset } of bug22Runs) {
```
```diff
+await gate.done();
 await browser.close();
```

**Why this is safe:**
- `if (x)` followed by a newline and then a statement is valid JavaScript. It guards exactly that one statement, so the block's own lines stay byte-identical.
- A top-level `const`/`let` cannot sit under a bare `if`. Declarations therefore stay unguarded. They only build data (ESC-NC's patterns, `bug22Runs`), and the static test in 4.3 E2 proves that one group alone uses them.
- Keys are the block's task ID. A group of several statements repeats the same key on each one (contiguous only, enforced by the test). A task ID used by two separate groups gets `.1`, `.2` (I6.1/I6.2, F5.1/F5.2, O1.1/O1.2).

**One-time proof** (in the build PR): stripping exactly the added lines (`if (gate.runs('…'))`, the `const gate` line and `await gate.done();`) gives back the base file byte for byte:
`diff <(git show <base>:scripts/screenshot-gate.mjs) <(node scripts/gate-blocks.mjs --strip)` is empty, and the PR shows it. Any edit inside a block makes that diff non-empty.

### 3.2 The runtime: `scripts/gate-split.mjs` (new, GATE-SPLIT's file)

**`gateSplit({ errors, OUT, file })`:**
- It parses its own gate file with `parseAst` from `rollup/parseAst`. Rollup is vite's own dependency; it is resolved through vite with `createRequire`, so no new package is added (D-GATESPLIT-PARSER).
- It builds the group list (3.3), reads `MARC_GATE_JOB` (`k/K`, 1-based, parsed exactly like `MARC_HT_SHARD`), and computes this job's groups with `packShards` (3.5).

**`gate.runs(key)`:**
- It returns `true` when the key is in this job's groups, or for every key when `MARC_GATE_JOB` is unset (local runs are unchanged).
- It closes the previous running group's row and opens a new one. A row is the key, seconds, the change in `errors.length`, and the screenshot files the group wrote (a directory listing before and after, done in Node only, so no page is touched).
- It throws on a key the parse did not find, and on a key reached twice outside its contiguous run.

**`gate.done()`:**
- It closes the last row.
- It checks that the keys reached equal this job's planned keys, in file order, with none missing and none extra. A job that skipped or failed to reach a planned block pushes an error, so the job turns red.
- It writes the proof (4.1).

### 3.3 Generated block list
The block list is not a hand list. It is `Program.body` of the gate file, from the first statement after `const errors = []` up to `await browser.close()`.
- Every statement is either `IfStatement` whose test is `gate.runs('<key>')`, or a `VariableDeclaration`. Anything else is an error.
- The groups are the distinct keys in file order. The count is asserted in three places:
  1. in `tests/gate-split.test.ts`, from the source;
  2. in each job's `gate.done()`, as planned versus reached;
  3. in the verdict, as rows equal to groups × time zones (4.2).

### 3.4 New blocks, the add-only rule, HT-10

**New blocks:**
- A task that adds a block adds its block exactly as today, plus its own guard line `if (gate.runs('<its task ID>'))`.
- The unit test fails with that exact instruction if the line is missing, so it cannot be forgotten.
- It edits nothing else. A key missing from `scripts/gate-times.json` is packed with a default of 60 s, which is above the 90th percentile of measured groups.
- The supervisor refreshes `gate-times.json` from the proofs' timings (`node scripts/gate-times.mjs <proof dir>`, written by GATE-SPLIT) after merges.

**Re-packing:** it moves blocks between jobs, never changes them, and is re-proven by the verdict on every run. The add-only rule for other tasks' blocks is unchanged. The exception covers only the guard lines and the three harness lines, written once by GATE-SPLIT.

**HT-10 (after #166 merges):**
- Gate block `HT-10` is a normal group, `if (gate.runs('HT-10'))` in front of its `if (!ht10Runs()) … else runHt10(…)`.
- The gate jobs set `MARC_HT10_OWN_JOB=1` (8.7 step 6), so in exactly one gate job per time zone the skip branch runs and holds HT-10's own time to 60 s (D-HT10-A5c-2), unchanged.
- HT-10's tuples run in `ht10-gate` (`MARC_HT_SHARD` 1/2, 2/2), outside the gate jobs.
- Locally, with both variables unset, everything runs, as now.

**HT-10's clock** (`const ht10Clock` and its `{ console.log = … }` block above HT-1):
- The declaration stays unguarded.
- The block is guarded with key `HT-10.clock`, which is listed in `ALWAYS` in `gate-split.mjs`. `runs()` returns true for it in every job, and the verdict expects exactly one `HT-10.clock` row per job.
- The test asserts that an `ALWAYS` group never references `errors`, so it cannot carry a check that would then run K times. It only re-wraps `console.log`.

### 3.5 One sharding system (D-GATESPLIT-ONE)
`tools/plates/fidelity/shard.mjs` (HT-10's, shared after merge) stays the one module. GATE-SPLIT only adds exports. No existing export changes, and `tests/howto/shard.test.ts` passes unchanged.

| Piece | HT-10 (`ht10-gate`) | GATE-SPLIT (`gate`) | LIB-4 (`howto-shard-k`) |
|---|---|---|---|
| Selection | `htShard(k, N)`, modulo over sorted (id, theme, state): equal-cost tuples | **new** `packShards(items, K)`, packing on committed seconds: unequal blocks | `packShards` on its committed timing file (plan 5.4 "greedy packing") |
| Env | `MARC_HT_SHARD=k/N` | `MARC_GATE_JOB=k/K`, same parser (**new** `jobFromEnv(name)`, which `shardFromEnv` stays equal to) | its own variable via `jobFromEnv` |
| Proof | `writeProof` rows `{sha,id,check,state,theme,width,result}` | the same rows (4.1) | the same rows (plan 5.4) |
| Verdict | `coverProblems` (today only in `shard.test.ts`) | **one** job, `gate-verdict` (`scripts/ci-verdict.mjs`), with one family per system | added as a family; no separate `howto-verdict` job |

`writeProof` gains one optional field, `meta` (an object written as is). Existing callers do not pass it, so their output is byte-identical; a test pins that. This is the only change to an existing function, and it is additive.

## 4. Proof, verdict, equivalence tests

### 4.1 Proof file per gate job
Each gate job writes `screenshots/gate-proof-<utc|auckland>-<k>of<K>.json` with `writeProof`:
- `sha`: `git rev-parse HEAD`, which must equal `GITHUB_SHA`.
- One row per group that ran: `{ id: <key>, check: 'gate', state: <TZ>, theme: '*', width: null, result: 'pass' | 'fail' }`. The result is `fail` when the group added errors.
- One row per theme the group was seen to use: `{ id: <key>, check: 'gate-theme', state: <TZ>, theme: <theme>, … }`. Seen means a screenshot written by that group whose name starts with a theme name. Groups that write no screenshot have no theme rows (limit in 5).
- `meta`:
  - `job: { k, K }` and `tz`;
  - `www`: sha-256 over the sorted `www/` files;
  - `chrome`: `browser.version()`;
  - `plan`: sha-256 of the packing input (times file plus group list);
  - `seconds` per group;
  - `errors`, the job's whole error list.

### 4.2 `gate-verdict`
`needs:` every gate job and both `ht10-gate` shards, with `if: always()`. It fails when any of the following is true:
1. any needed job's result is not `success`;
2. a manifest's `sha` is not `GITHUB_SHA`, or the manifests' shas differ;
3. the number of gate manifests is not K per time zone, a `k` is missing or repeated, or K differs from `gate-times.json`;
4. `coverProblems(gateRows, expected)` is not empty, where `expected` = the groups generated from the gate file at that sha (3.3) × `['UTC', 'Pacific/Auckland']`, minus `ALWAYS` keys. This catches a missing, duplicated (two manifests) or unexpected item;
5. the gate row count is not groups × 2, and the `ALWAYS` rows are not exactly one per manifest (miscount);
6. a `gate-theme` (key, TZ, theme) appears in two manifests, or a group's theme set differs between UTC and Auckland;
7. `meta.www`, `meta.chrome` or `meta.plan` differ between manifests, or `meta.plan` differs from the verdict's own computation;
8. any row's result is `fail`;
9. the ht10 family: `coverProblems(ht10Rows, ht10RunTuples())` is not empty, or shard k of N is missing or repeated;
10. the time-zone list is a constant in `ci-verdict.mjs` (`GATE_TZS`), not an input. Dropping Auckland from the workflow leaves its rows missing, so the verdict turns red.

**The APK:**
- `android-gate` `needs: [source-checks, gate, ht10-gate, gate-verdict]`, so it starts only when every job and the verdict are green.
- It checks out `GITHUB_SHA`, the same sha every manifest names.
- Recommended (supervisor): it builds from the `www` artifact that the gate jobs tested (`web-build`), so the APK holds those exact bytes. Today each job builds its own `www`, and `sw.js` carries a build-time stamp (`scripts/sw-version.mjs:5`), so separate builds differ.

### 4.3 Equivalence tests: each one, and the mutation that turns it red

| # | What | Where | Mutation shown red |
|---|---|---|---|
| E1 | The block list is generated from the file and its count asserted. Every top-level statement is guarded or a declaration; keys are unique per group and contiguous; `ALWAYS` groups do not reference `errors` | `tests/gate-split.test.ts` (vitest, runs in `npm test`) | delete one guard line; repeat a key in two separate places; add `errors.push` to an `ALWAYS` group |
| E2 | No shared state between groups: every binding declared at top level after `errors` is referenced by one group only; no writes to `process.env` or `globalThis`; no `let` at top level | same test, on the AST | make a second group read `bug22Runs` |
| E3 | Partition: for K = 1..16 and the real group list, the jobs' sets are disjoint and their union is every group; unset selects everything | same test | an off-by-one `k` in `jobFromEnv`; `packShards` dropping its last item |
| E4 | Each job reaches exactly its planned groups (`gate.done()`) | each CI gate job | make one guard return `false` in one job only (`MARC_GATE_SKIP_TEST=<key>`, a test-only seam that exists only in a scratch commit) |
| E5 | Verdict unit tests: wrong sha, a missing manifest, a duplicated manifest, a dropped row, an extra row, a miscount, mixed `www`/`chrome`/`plan`, a `fail` row, a `needs` failure, missing Auckland | `tests/ci-verdict.test.ts` with fixture manifests | each of the ten listed is one test case that must fail |
| E6 | **Dropping a proof row turns the verdict red on CI** | a scratch branch: a commit makes job 2 (UTC) delete one row before upload | verdict red, naming the key; then reverted |
| E7 | Strip equivalence (3.1) | build PR, one time | edit one character inside any block → diff not empty |
| E8 | **5 paired runs:** on one sha, run A = serial (`MARC_GATE_JOB` unset: one job per TZ, as today) and run B = split (K = 3). Five times each. Identical means, per TZ: the same set of (group, result) rows, the same error list (empty when green), the same screenshot file names, the same `gate-theme` rows | `workflow_dispatch` input `arrangement: serial | split` on the GATE-SPLIT branch; the verdict compares | any difference over the 5 pairs blocks adoption; root-cause it, never re-run to green |
| E9 | **Seeded failure red in both arrangements:** a scratch commit breaks one app behaviour that a block outside job 1 checks (e.g. shrink a tap target that F8 checks). Serial: red. Split: exactly the job holding F8 is red, with the same error text, and the verdict is red (`fail` row) | scratch branch | — (this one is the mutation) |
| E10 | Solo run (ordering): `MARC_GATE_JOB=k/90` for k = 1..90, each group alone, in UTC and in Pacific/Auckland. Every group passes alone, so none relies on an earlier group | local, one time (about 45 min each TZ); log in the PR | — |

The build is relied on only after E1-E10 pass on its final head, as the AGENTS.md exception requires.

## 5. Risks and mitigations

**Shared state between blocks (found by reading every top-level statement on `94fd32c`):**
- *The browser.* One shared Chromium serves the non-HT blocks (HT-3, HT-6 and HT-8 launch their own). Today later blocks run in a browser used for up to 40 min; split, each job's browser is fresher. Timing probes may shift either way. E8 compares both arrangements; a shift is a flake for GATE-FLAKE-1 (#179), never a looser threshold.
- *`errors`.* All blocks push to one array. Line 254 removes only BASE's own `gate-injected` entries. HT-6 (6656/6948) counts its own delta. No block reads another's entries.
  - Risk: an async `pageerror` from a context a block left open lands in a later block's delta, or is lost when a job ends sooner.
  - Mitigation: `gate.done()` records `browser.contexts().length` in `meta`, and E8 compares error lists. Adding a hard "no open context" check is a new check; it is proposed, not assumed.
- *`www/` files.* The ESC sheet build-B block (2332-2349) and HT-3b A4 (6816-6833) rewrite `www/sw.js` and delete a chunk, restoring both in `finally`. Each job has its own `www` copy and runs blocks one after another, so this is safe. Blocks must never run concurrently inside one job (not proposed).
- *Top-level data.* `ESC_NC_RE` and `ESC_NC_CRISIS` (1901-1903) are used by the loop at 1908, so ESC-NC is one group with it. `bug22Runs` (5708) is filled and read only by BUG-22. E2 enforces both.
- *Clock.* The legacy fixture uses `new Date()` at load (86-97), and QA7-6 notes wall-clock probes. Shorter jobs cross midnight less often than today's 40 min job, not more.

**Ordering dependencies.**
- Within a job, file order is kept. Across jobs, E10 proves each group passes alone.
- Residual risk: two groups that interfere only when run as a specific pair. E8 and every run's verdict would show it as a difference; it is then root-caused.

**Flaky probes.**
- More jobs means more chances per push for a known flake, though not more probes: each still runs once.
- GATE-FLAKE-1 (#179) stays the only owner. GATE-SPLIT changes no probe and re-runs nothing to green.
- The unverified BUG-34 first-frame flake (SPEED.md) is reported there, not handled here.

**Runner queueing.**
- 10 concurrent jobs per push at K = 3. Two pushes in flight reach about 20, the limit.
- The workflow's `concurrency: cancel-in-progress` per ref already cancels superseded pushes on one branch.
- A queue adds minutes and never skips a job, because the verdict requires all of them.
- If queueing grows, the supervisor lowers K (one number). The proofs stay valid for any K.

**Theme proof.**
- Themes are proven by construction: the block bytes are unchanged (E7) and a group runs whole in one job (E1, E3), so each of its themes runs exactly once.
- The `gate-theme` rows add an observed check for the groups that write theme-named screenshots. Groups that write none rely on construction alone.
- Observing themes inside pages was rejected: it would inject code into the pages under test and change timing probes.

**Parser.**
- `rollup/parseAst` comes through vite, so a vite major update could move it.
- Mitigation: the test fails loudly if the import fails. A direct dev dependency needs the supervisor's OK (AGENTS.md); it is not added now.

**What the supervisor wires in `.github` (add-only; the supervisor does it, not this card).** In `build-apk.yml`:
1. `web-build`: checkout, npm ci, `npm run build`, the "Validate built web source" step, upload `www` as `MARC-www-gate`.
2. `source-checks`: today's `source-gate` steps up to "Unit tests in two more time zones", without the gate.
3. `gate`:
   - `needs: web-build`;
   - matrix `tz: [UTC, Pacific/Auckland]` × `job: [1, 2, 3]`;
   - `env: TZ`, `MARC_GATE_JOB: ${{ matrix.job }}/3`, `MARC_HT10_OWN_JOB: '1'`, `MARC_GATE_PORT` per TZ as today;
   - steps: download `www`, install Chromium, `npm run gate`, upload `screenshots/` as `MARC-gate-<tz>-<job>` (`if: always()`, error if no files);
   - `timeout-minutes: 30` (runaway limit; a job is about 15 min).
4. `ht10-gate` as in 8.7 step 6, plus upload of `screenshots/ht10-proof.json` per shard.
5. `gate-verdict`: `needs: [gate, ht10-gate]`, `if: always()`, download every proof, `node scripts/ci-verdict.mjs`.
6. `android-gate`: `needs: [source-checks, gate, ht10-gate, gate-verdict]`, optionally building from `MARC-www-gate`.
7. `ci-watch.sh`'s required set: `guard`, `source-checks`, `gate` (6), `ht10-gate` (2), `gate-verdict`, `android-gate`.

**Transition:**
- `source-gate` and `visual-gate-tz` stay until E8 passes. The serial arrangement is `workflow_dispatch` only, so a push is never gated twice for long.
- Then the supervisor replaces them in one PR. Nothing ships between: `android-gate` keeps needing the full set.

## 6. Build plan after HT-10 merges

Files and scope:
- `scripts/gate-split.mjs`, `scripts/gate-blocks.mjs` (`--strip`, list), `scripts/gate-times.mjs`, `scripts/gate-times.json`, `scripts/ci-verdict.mjs`;
- additive exports in `tools/plates/fidelity/shard.mjs`;
- `tests/gate-split.test.ts`, `tests/ci-verdict.test.ts`;
- the guard and harness lines in `scripts/screenshot-gate.mjs` (exception only);
- D-GATESPLIT-* entries.

**Order:**
1. E1-E5 and E7 locally.
2. E10 locally.
3. Ask the supervisor to wire the scratch matrix.
4. E6, E8 and E9 on CI.
5. READY.

**Package changes:** none in `package.json` (`npm run gate` is unchanged).

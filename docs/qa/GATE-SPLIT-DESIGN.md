# GATE-SPLIT design

Card GATE-SPLIT (owner approval 2026-10-02, AGENTS.md ownership-table exception). Design note only. Code comes after HT-10 (#166) merges. Decisions are recorded as D-GATESPLIT-* in `docs/COACHING-DECISIONS.md`.

**Goal:** CI per push from about 45 min to about 25 min or less. Every gate block, time zone and theme still runs exactly once per run, and nothing is dropped or loosened.

**Short version:**
- The gate stays one file.
- Each top-level block gets one added line in front of it, `if (gate.runs('<TASK-ID>'))`. No other line of the block changes.
- A CI job set to `MARC_GATE_JOB=k/K` runs only the blocks the shared packer assigns to job k. With the variable unset (local `npm run gate`), it runs everything, as today.
- Every job writes a proof file in HT-10's `writeProof` format.
- One verdict job checks every proof file against the block list generated from the file at that exact sha. The verdict also covers HT-10's shards now and LIB-4's shards later.
- `.github` stays add-only (supervisor ruling, 2026-10-02): `source-gate` and `visual-gate-tz` keep their names and steps and become shard 1/K of their time zone through a job-level env. Shards 2..K and `gate-verdict` are new jobs.
- K = 3 per time zone and `ht10-gate` N = 4, both from one rule: each shard at most 15 min. Expect about 20 min for one push alone (about 22 at worst). With two pushes in flight, the later one can queue to about 30-35 min (2.2).

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
| 2 | 1,291 | 20 min | 4 | 4 + ht10 N |
| **3** | **861** | **13.3 min** | **6** | **6 + ht10 N** |
| 4 | 646 | 10.0 min | 8 | 8 + ht10 N |
| 5 | 517 | 8.0 min | 10 | 10 + ht10 N |
| 8 | 323 | 5.0 min (HT-3 bound) | 16 | 16 + ht10 N |

This table packs with no head start. The proposal in 2.2 adds `source-gate`'s head start.

### 2.2 Proposal: K = 3, ht10 N = 4 (D-GATESPLIT-K, D-GATESPLIT-HT10)

**One rule for both systems: each shard at most 15 min on CI (`SHARD_TARGET_S = 900`).**

**K for the gate:** K = ceil(per-TZ CI load / 900 s), where load = gate seconds + HT-10's skip (at most 60 s, D-HT10-A5c-2) + head start.
- `source-gate` (UTC shard 1) still runs its own steps before the gate: worker and relay checks, `npm run check` and `test:tz`, 3:38 measured.
- So the packer gives it a head start of 200 s: 218 s minus the about 15 s of `npm ci` + build that every shard job also has. That is `offsets: { "UTC/1": 200 }` in `scripts/gate-times.json`, and `packShards(items, K, offsets)` starts that job's total at 200.
- `visual-gate-tz` has no head start; its build is the same as a new shard's.
- **UTC:** (2,397 + 60 + 200) / 900 = 2.95 → K = 3, about 886 s (14.8 min) per shard.
- **Auckland:** (2,285 + 60) / 900 = 2.6 → 3, about 782 s (13.0 min). K is the same for both zones (the larger), so the plan and proofs stay symmetric.

**N for `ht10-gate`:** N = ceil(total ht10 seconds / 900 s).
- Until measured, the total is the budget: 2 shards × 25 min = 3,000 s (D-HT10-A5), so N = 4 and about 12.5 min per shard by budget.
- After HT-10's first CI run, the supervisor re-applies the rule to the measured total. N = 2 if both shards measure at most 15 min.
- htShard is modulo over tuples, so any N is valid, and `coverProblems` proves it.

**Assignment at K = 3** (local seconds with UTC/1's head start of 215 s local-equivalent; Auckland packs the same blocks without the head start):
- **Job 1 = `source-gate` / `visual-gate-tz`** (717 s of blocks, 29 groups): BASE, I15, QA13-3, QA13-5, Palace*, I6.1, BUG-31, ESC-REPORT, Live*, I6.2, A3, A1, BUG-18, QA5-5b, Hotfix*, QA10-3, QA10-7, I9, AUD-11, A4, COACH-FB, BUG-17, LT-3, ADAPT-4, BUG-27, PLAY-1, HT-8, COPY-1, COPY-2.
- **Job 2** (932 s, 31 groups): I14, BUG-12, BUG-10, QA6-2, QA13-4, QA14-1, R6, Plate*, QA4-5, QA11-1, F5.1, I7, A9, F8, F5.2, O3, I10, A5, QA12-3, O1.1, BUG-19, BUG-15, LT-4, BUG-23, HT-1, HT-2, HT-3, HT-7, BUG-36, BUG-37, AUD-10.
- **Job 3** (932 s, 30 groups): I18, I16, I17, R2, I12, QA13-6, O4, A6, ESC-NC, R5, UI-1, F13, I1, A8, F9, QA5-1b, I11, QA12-1, O2, O1.2, BUG-34, BUG-8, BUG-9, BUG-22, FG-OFF, HT-6, HT-3b, HT-4, AUD-20, AUD-12.
- **Plus** `HT-10` and `HT-10.clock` after #166 (3.4).
- These lists illustrate only. The code computes the plan from `scripts/gate-times.json` at each sha (3.2).

**Time per push.** The total is the slowest path, max(gate path, ht10 path), plus what follows it. Estimates come from the measurements in 1.1.

| Path | Steps | Typical | Worst |
|---|---|---:|---:|
| Gate, UTC/1 (`source-gate`) | 3:38 own steps + Chromium 0.4 + 717 s × 0.93 local→CI | ≈ 15.2 min | ≈ 17 (Chromium 2 min) |
| Gate, other shards | setup ≈ 0.75 min + 932 s × 0.93 ≈ 14.4 min | ≈ 15.2 min | ≈ 17 |
| ht10, per shard | setup ≈ 0.75 + 12.5 min (budget / 4) | ≈ 13.3 min | ≈ 15 |
| Then | `gate-verdict` 0.5 + `android-gate` 3.1 + pick-up gaps 0.5 | 4.1 min | 4.1 |
| **One push alone** | | **≈ 19.3 min** | **≈ 21** |

**Capacity**, counted in jobs per push:
- One push: `guard` 1, `source-gate` 1, `visual-gate-tz` 1, `gate-shard` 4, `ht10-gate` 4, `gate-verdict` 1, `android-gate` 1 = **13 jobs**.
- Peak at once: **11**, which is 10 once `guard` (seconds long) ends: 2 existing gate jobs + 4 shards + 4 ht10.
- Today: 4 jobs, peak 3-4.

**Two overlapping pushes** (different branches; the same ref cancels its older run):
- Peak 20-22 against the limit of about 20, with queueing measured from about 15 (SPEED.md). So the later push queues.
- At worst its last 1-2 jobs wait for the first push's shortest shard, about 13-15 min. The later push then lands at about 30-35 min. One push alone, at about 20 min, is under the card's 25.
- **The honest number:** about 20 min per push when pushes do not overlap. About 30-35 min for the later of two overlapping pushes, which is still under today's 42-47 for both.

**Re-picking:** when ht10 is measured, N will likely drop, and so will the peak (N = 2 gives a peak of 8 and two pushes about 16-18, near the queueing threshold). The verdict prints each shard's gate seconds on every run. When any shard passes 900 s, the supervisor re-applies the rule (K or N + 1).

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
- HT-10's tuples run in `ht10-gate` (`MARC_HT_SHARD` k/N, with N = 4 by the 15 min rule until measured; 2.2), outside the gate jobs.
- D-HT10-A5c-2's "30 min goal returns in GATE-SPLIT" lives in the verdict as `JOB_BUDGET_S` (4.2 item 9).
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
Each gate job writes `screenshots/gate-proof-<utc|auckland>-<k>of<K>.json` with `writeProof`. In the serial arrangement, `MARC_GATE_JOB` is `1/1` (unset or empty locally, which runs everything the same way) and the file is `…-1of1.json`.
- `sha`: `git rev-parse HEAD`, which must equal `GITHUB_SHA`.
- One row per group that ran: `{ id: <key>, check: 'gate', state: <TZ>, theme: '*', width: null, result: 'pass' | 'fail' }`. The result is `fail` when the group added errors.
- One `gate-theme` row per theme the group was seen to use: `{ id: <key>, check: 'gate-theme', state: <TZ>, theme: <theme>, … }`.
  - "Seen" means a file the group wrote to `screenshots/` whose name matches the declared pattern `THEME_IN_NAME = /(?:^|[^a-z])(silent-black|paper|ember|emerald|midnight)(?:[^a-z]|$)/`, anywhere in the name, not only at the start.
  - Groups that write no file matching it are listed in `meta.constructionOnly`. The verdict prints that list on every run, and the build PR records it from the first proof, because the theme proof for those groups is by construction only (5).
- `meta`:
  - `job: { k, K }` and `tz`;
  - `www`: sha-256 over the sorted `www/` files, with `sw.js`'s build stamp `marc-\d{14}` normalised to `marc-STAMP`. Each job builds its own `www` as today; the stamp is the build time (`scripts/sw-version.mjs:5`), and Vite's hashed names are content-based;
  - `chrome`: `browser.version()`;
  - `plan`: sha-256 of the packing input (times file, offsets, group list);
  - `seconds` per group, and `gateSeconds` (first guard to `done()`);
  - `files` per group, the screenshot names;
  - `errors`, the job's whole error list.

### 4.2 `gate-verdict`
`needs: [source-gate, visual-gate-tz, gate-shard, ht10-gate]`, with `if: always()`. It fails when any of the following is true:
1. any needed job's result is not `success`;
2. a manifest's `sha` is not `GITHUB_SHA`, or the manifests' shas differ;
3. the number of gate manifests per time zone is wrong, or a `k` is missing or repeated.
   - On `push`, K must equal `gate-times.json`'s K.
   - K = 1 is accepted only when `GITHUB_EVENT_NAME` is `workflow_dispatch` with `arrangement: serial` (E8's arrangement A).
4. `coverProblems(gateRows, expected)` is not empty, where `expected` = the groups generated from the gate file at that sha (3.3) × `GATE_TZS`, minus `ALWAYS` keys. This catches a missing, duplicated (in two manifests) or unexpected item;
5. the gate row count is not groups × 2, or the `ALWAYS` rows are not exactly one per manifest (miscount);
6. a `gate-theme` (key, TZ, theme) appears in two manifests, or a group's theme set differs between UTC and Auckland;
7. `meta.www`, `meta.chrome` or `meta.plan` differ between manifests, or `meta.plan` differs from the verdict's own computation;
8. any row's result is `fail`;
9. **the 30 min goal** (D-HT10-A5c-2: "the 30 min goal returns in GATE-SPLIT") lives here as `JOB_BUDGET_S = 1800`: any manifest's `meta.gateSeconds` over 1,800 s is red. Separately, any shard over `SHARD_TARGET_S = 900` is printed as "re-pick K/N" (2.2) and is not red. New shard jobs also get `timeout-minutes: 30` as a runaway limit; the existing jobs keep their 60 (`.github` is add-only);
10. the ht10 family: `coverProblems(ht10Rows, ht10RunTuples())` is not empty, or shard k of N is missing or repeated;
11. `GATE_TZS = ['UTC', 'Pacific/Auckland']` is a constant in `ci-verdict.mjs`, not an input. Dropping Auckland from the workflow leaves its rows missing, so the verdict turns red.

**The APK:**
- `android-gate.needs` gets `gate-shard`, `ht10-gate` and `gate-verdict` appended, so it starts only when every job and the verdict are green on `GITHUB_SHA`, the sha every manifest names.
- Optional add-only check for the supervisor: a new `android-gate` step computes the same normalised `www` hash and compares it with the verdict's. Both builds come from the same sha, so a mismatch means a non-deterministic build.

### 4.3 Equivalence tests: each one, and the mutation that turns it red

**E1: block list and guards** (`tests/gate-split.test.ts`, vitest, runs in `npm test`).
- The block list is generated from the AST and its count asserted (3.3).
- Every top-level statement after `const errors` is a `gate.runs` guard or a declaration.
- Keys are unique per group and contiguous.
- `ALWAYS` groups do not reference `errors`.
- Mutations: delete one guard line; repeat a key in two separate places; add `errors.push` to an `ALWAYS` group.

**E2: coupling over every module-scope binding** (same test). The bindings are everything declared at top level, before and after `errors`: `ROOT`, `OUT`, `PORT`, `server`, `stopping`, the helpers, `day`/`iso`/`rec`, `completed`, `i`, the `*Days` arrays, `timed`, `legacy`, `browser`, `themes`, `errors`, `gate`, `ESC_NC_*`, `bug22Runs`. Each rule has its own mutation:

| Rule | Mutation shown red |
|---|---|
| R1. No group assigns to a module-scope binding or its members (`=`, `op=`, `++`, `--`, `delete`) | `legacy.preferences = {}` inside a group |
| R2. No group calls a mutating method on one (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`, `set`, `add`, `delete`, `clear`, `Object.assign`/`defineProperty` on it). Two exceptions: `errors.push`, and `errors.splice` only in group `BASE` (line 254, its own injected entries) | `themes.push('x')`; `completed.sort()`; `errors.splice(0)` in a non-BASE group |
| R3. A binding declared after `errors` is referenced by one group only. Only that group may mutate it (BUG-22 fills `bug22Runs`) | a second group reads `bug22Runs` or `ESC_NC_RE` |
| R4. An unguarded declaration after `errors` has an initializer with no `await` and no reference to `errors`, `browser`, `page`, `ctx` or `gate` | `const n = errors.length;` and `const t = await browser.version();` added unguarded |
| R5. No write to `process.env`, `globalThis` or `console` members, no `process.chdir`, and no top-level `let`/`var`/`function`/`class` after `errors`. The one allowed global write is the `HT-10.clock` group's `console.log = …` | `process.env.TZ = 'UTC'` in a group; `console.log = () => {}` in any group other than `HT-10.clock`; `let x = 0;` after `errors` |

**E3: partition** (same test). For K = 1..16, with and without an offset, and for the real group list, the jobs' sets are disjoint and their union is every group. Unset, `''` (treated as unset) and `'1/1'` each select everything, and `'1/1'` names the proof `-1of1.json`.
- Mutations: an off-by-one `k` in `jobFromEnv`; `packShards` dropping its last item; `''` parsed as an error, or `'1/1'` selecting nothing.

**E4: each job reaches exactly its planned groups** (`gate.done()`, every CI gate job).
- Mutation: on a scratch commit only, a guard key in one group is changed to a key the plan gives another job. `done()` reports one planned key not reached and one not planned that ran.

**E5: verdict unit tests** (`tests/ci-verdict.test.ts`, fixture manifests). Each is one case that must fail: wrong sha, a missing manifest, a duplicated manifest, a dropped row, an extra row, a miscount, mixed `www`/`chrome`/`plan`, a `fail` row, a `needs` failure, missing Auckland, K = 1 on a `push` event, `gateSeconds` = 1,801.

**E6: dropping a proof row turns the verdict red on CI.** On a scratch branch, a commit makes `gate-shard` UTC 2/3 delete one row before upload.
- Expected: verdict red, naming the key. Then reverted.

**E7: strip equivalence**, every time.
- `<base>` is the exact `origin/main` commit merged into the build head: the main parent of the latest merge commit, named in the PR.
- `node scripts/gate-blocks.mjs --strip | diff <(git show <base>:scripts/screenshot-gate.mjs) -` must be empty.
- It is re-run and posted after every merge of main, because GATE-FLAKE-1 (#179) and other tasks edit block bodies on main, and those edits must arrive through the base, never through GATE-SPLIT.
- Mutation: edit one character inside any block → the diff is not empty.

**E8: 5 paired runs**, compared by `scripts/gate-compare.mjs <dirA> <dirB>` (new).
- Inputs: the downloaded proof artifacts of run A_i (`arrangement: serial` through `workflow_dispatch`: `source-gate` and `visual-gate-tz` with `MARC_GATE_JOB=1/1`, shard jobs skipped) and of run B_i (`arrangement: split`, K = 3), both on the same sha, for i = 1..5.
- Per TZ, it compares:
  - the set of (group, result) rows;
  - the `gate-theme` rows;
  - `meta.errors`, sorted;
  - the union of `meta.files` (screenshot names), per group.
- The pairs run one after the other: the workflow's `concurrency: cancel-in-progress` would cancel an overlapping run on the same ref. A cancelled run is dispatched again and is not counted.
- Exit 1 with the first difference. All 5 pairs must exit 0. A difference blocks adoption and is root-caused, never re-run to green.
- Unit tests in `tests/gate-compare.test.ts`. Mutations, each red: one screenshot name dropped from one B manifest; one row's result flipped; one extra error string in B; one theme row missing in A.

**E9: seeded failure, red in both arrangements.** A scratch commit shrinks a tap target that F8 checks (an app CSS change; no gate line touched). Both workflow runs must conclude `failure`.
- `scripts/gate-compare.mjs --seeded F8 <dirA> <dirB>` then asserts, per TZ:
  - in A, F8's row is `fail`;
  - in B, exactly the shard whose plan holds F8 (job 2 in 2.2) has a `fail` row, only for F8, and every other shard's rows pass;
  - F8's error strings are identical in A and B;
  - the verdict on B is red.
- It exits 1 with "seed did not bite" when F8 passes in either arrangement.

**E10: solo run (ordering).** `MARC_GATE_JOB=k/N` for k = 1..N, where N = `node scripts/gate-blocks.mjs --count` (90 today, 92 with `HT-10` and `HT-10.clock`; never typed by hand). Each group runs alone, in UTC and in Pacific/Auckland, locally, one time (about 45 min each). Every group must pass alone.
- Planted dependency, to prove E10 bites: on a scratch commit, add two test groups. `ZZ-P` writes `screenshots/.dep`; `ZZ-Q`, later in the file, pushes an error when the file is missing.
- The full serial run passes, and the solo run of `ZZ-Q` fails, so E10 is red.
- The dependency goes through a file, so E2's static rules do not see it; that is why E10 exists.

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
- 11 concurrent jobs per push at K = 3 and ht10 N = 4 (2.2). Two pushes in flight reach 20-22, at or over the limit, and the later push queues to about 30-35 min.
- The workflow's `concurrency: cancel-in-progress` per ref already cancels superseded pushes on one branch.
- A queue adds minutes and never skips a job, because the verdict requires all of them.
- If queueing grows, the supervisor lowers K (one number). The proofs stay valid for any K.

**Theme proof.**
- Themes are proven by construction: the block bytes are unchanged (E7) and a group runs whole in one job (E1, E3), so each of its themes runs exactly once.
- The `gate-theme` rows add an observed check for each group that writes a file matching `THEME_IN_NAME` (4.1), anywhere in the name.
- Groups that write no such file (no screenshot, or names without the theme) are listed in `meta.constructionOnly`. The verdict prints the list and the build PR records it, so it is explicit which groups rely on construction alone.
- Observing themes inside pages was rejected: it would inject code into the pages under test and change timing probes.

**Parser.**
- `rollup/parseAst` comes through vite, so a vite major update could move it.
- Mitigation: the test fails loudly if the import fails. A direct dev dependency needs the supervisor's OK (AGENTS.md); it is not added now.

**What the supervisor wires in `.github`** (supervisor ruling 2026-10-02: add-only; nothing renamed or removed; the supervisor does it, not this card). In `build-apk.yml`:
1. **`source-gate`** (UTC): unchanged steps. Add job-level `env: MARC_GATE_JOB: ${{ inputs.arrangement == 'serial' && '1/1' || '1/3' }}` (`'1/1'` = everything. `''` is falsy in Actions expressions and would fall through to `'1/3'`) and `MARC_HT10_OWN_JOB: '1'` (8.7 step 6). It already uploads `screenshots/`, which holds the proof.
2. **`visual-gate-tz`** (Auckland): unchanged steps. Add the same job-level env, plus a new step that uploads `screenshots/gate-proof-*.json` as `MARC-gate-proof-auckland-1` (`if: always()`). Its existing failure-only upload stays.
3. **New `gate-shard`:**
   - matrix `tz: [UTC, Pacific/Auckland]` × `k: [2, 3]`, with `if: inputs.arrangement != 'serial'`;
   - `env: TZ`, `MARC_GATE_JOB: ${{ matrix.k }}/3`, `MARC_HT10_OWN_JOB: '1'`, and a `MARC_GATE_PORT` per shard;
   - steps: checkout, setup-node, npm ci, `npm run build`, install Chromium, `npm run gate`, upload `screenshots/` as `MARC-gate-<tz>-<k>` (`if: always()`, error if no files);
   - `timeout-minutes: 30`.
4. **`ht10-gate`** as in 8.7 step 6, with a matrix of N shards (N by the rule in 2.2) and an upload of `screenshots/ht10-proof.json` per shard.
5. **New `gate-verdict`:** `needs: [source-gate, visual-gate-tz, gate-shard, ht10-gate]`, `if: always()`. It downloads every proof and runs `node scripts/ci-verdict.mjs`.
6. **`android-gate.needs`:** append `gate-shard`, `ht10-gate`, `gate-verdict`.
7. **`on.workflow_dispatch.inputs.arrangement`:** `split` (default) or `serial`. This is E8's arrangement A; on `push` it is always `split`.
8. **`ci-watch.sh`'s required set:** append `gate-shard` (4), `ht10-gate` (N), `gate-verdict`.

No transition PR is needed. Once wired, each push runs the split arrangement, and `android-gate` keeps needing every job.

## 6. Build plan after HT-10 merges

Files and scope:
- `scripts/gate-split.mjs`, `scripts/gate-blocks.mjs` (`--strip`, `--count`, list), `scripts/gate-times.mjs`, `scripts/gate-times.json` (with `K`, `offsets`), `scripts/ci-verdict.mjs`, `scripts/gate-compare.mjs`;
- additive exports in `tools/plates/fidelity/shard.mjs`;
- `tests/gate-split.test.ts`, `tests/ci-verdict.test.ts`, `tests/gate-compare.test.ts`;
- the guard and harness lines in `scripts/screenshot-gate.mjs` (exception only);
- D-GATESPLIT-* entries.

**Order:**
1. E1-E5 and E7 locally.
2. E10 locally.
3. Ask the supervisor to wire 5 (wiring list).
4. E6, E8 and E9 on CI.
5. READY.
6. E7 is re-run and posted after every merge of main until merge.

**Package changes:** none in `package.json` (`npm run gate` is unchanged).

## 7. Build record (2026-10-04, after HT-10 merged in train 13)

**Changes from the plan above**, all recorded as D-GATESPLIT-* entries:
- **99 groups**; HT-9 and BUG-38 arrived after the design. Untagged legacy blocks are named from their header (D-GATESPLIT-KEYS).
- **R3 refined.** Only a binding that some group mutates must belong to one group. Read-only `ESC_NC_RE` is shared by ESC-NC and HT-9 (D-GATESPLIT-R3).
- **HT-3's `HT3_DUMP` write is replayed** in jobs that do not run HT-3 (D-GATESPLIT-REPLAY).
- **Head-start offsets apply only at the configured K**, so E10's solo packing (K = groups) gives one group per job. The test failed before this fix and passes after.
- **K = 4, not 3**, from the 15 min rule applied to CI's Chrome 153 proof: 2,604 s + 200 s head start = 2,804 s / 900 s → 4, about 701 s per shard. `ht10-gate`, measured on CI, takes 4:03-6:41 per shard, so N = 2 per time zone already meets the rule.
- **The verdict compares a job's groups as sets**, because `writeProof` sorts rows. The local split run caught this; the test fixtures now sort like `writeProof`.

**Measured on CI** (`63f4ad9`, guarded gate, serial):
- `source-gate` gate step: 43:27. `visual-gate-tz`: 42:59. All 99 groups passed and the proof was written.
- 66 groups write no theme-named file, so their theme proof is by construction only (listed in every proof).
- Jobs queued for up to 14 min that night: the train 13 run was in flight at the same time.

# Form Guide Version 1: final plan

Everything below was read from `origin/main` at **1afc7ab**. The only change since 9a37b56 is 3 lines in AGENTS.md (`git diff --stat` checked), so every line number found in the Understand phase still holds. PR #66 was read at head **c613b8d**. If I could not check something, it is marked **unverified**.

---

# PART 1: for the supervisor

## 1. Chosen approach and why

**Approach C (contact solver plus key poses), with grafts.** Both judges picked it:

| | Judge 1 | Judge 2 |
|---|---|---|
| A, hand-keyed | 29 | 30 |
| B, templates | 40 | 38 |
| **C, solver-hybrid** | **41** | **41** |

Why C won:
- The author writes what a coach would say ("hands on the handle", "bar over mid-foot") plus a few key poses. The solver keeps contacts true by construction. The defects reviewers kept finding by eye (bar behind the foot, hands off the handle) become impossible or get caught by a check.
- The solve happens in one place, the sampler's evaluator (`sample.ts:176-207`). So the hash, every check and the WAAPI keyframes all read the same angles. Judge 2 listed every call site: `check/index.ts:71,89,169,187,225,267,385,391,507`, `effort.ts:43,48`, `guideView.ts:71,95`.
- It fixes a real defect. On main, front seated sway turns the pelvis about the floor (`rig/pose.ts:61`, verified), which moves a thigh pad.
- It scales to the other ~138 exercises. The doc lists 28 machine drawings used by 60 exercises (doc:120-140).

**Fatal flaws the judges found, and what this plan does about each:**
1. **Driving the limb from the machine part's travel fails smoothness (c).** This is A's FG-7a and C's V1-13 and V1-18 as written, and it is also the documented rule (`model.ts:56`, doc:120). The (c) limit is 3× (`check/smooth.ts:8`, verified). The judges' scratch runs gave 3.46-12.7× for travel-driven solving and 2.08-2.89× when a joint drives. Both runs used a generic 110/120 arm, not our rig, so this is **unverified on the real rig**.
   → **Fix:** the dominant joint is the driver, as one minimum-jerk curve. One secondary channel is solved to keep the hand or foot on the part's path. The part's travel follows the body. V1-04 re-measures this on the real arms as its first check-in, before any machine work. If a geometry still fails, that exercise stays out of V1 and the decision is logged. No check changes.
2. **B's fix changes what (c) measures.** AGENTS.md forbids that ("skip, loosen or delete a test or guard check"). → Rejected.
3. **A's "merge switched off" is false for the chest press.** Its id is already in `GUIDE_IDS` (`registry.ts:3`), and `playerFor` plays any file in `exercises/` (`FormGuidePlayer.tsx:25-26,34-41`). → The chest-press file lands only in the same slot as the GU-7a stub retirement (V1-20 then V1-21).
4. **`hashes.json` is one line** (`check/hashes.json:1`, imported at `check/node.ts:8`). Parallel lanes would conflict on every merge. → One hash file per exercise (V1-01).
5. **`wrist_pron` is not drawn in the side view.** It is read only by the front frame (FG-6 `pose.ts:79`) and appears 0 times in `figureSide.ts` (both verified). → Research tells may only use channels the view can draw (V1-00 (l), V1-02). If the curl needs a grip turn, it is shown by crossfading the dumbbell drawing (V1-06).
6. **Side seated poses draw no sway.** They rotate by sway only when standing (FG-6 `pose.ts:221`, verified). Yet `secondaryMotion` reads the sway channel value, not the drawing (`check/index.ts:387-397`). So a still figure passes. → New add-only check `swayDrawn` (V1-11).

## 2. Grafted ideas

| From | Idea | Where |
|---|---|---|
| B (V1-T1) | Measure the drive against (c) on the real front and side arms, and the leg press, before any machine card | V1-04 A0, the check-in gate |
| B (V1-R1) | Research validator: tells only on channels the view can draw, ranges inside AAOS, proven on seeded bad JSON | V1-02 |
| B (V1-Q2) | Mistake-sync probe (the 280 ms bug, COACHING-DECISIONS.md:597), plus a seeded broken timeline that proves the probe fails | V1-08 |
| B | A sweep of at least 50 parameter sets per contact type (reach, backrest, pulley height) | V1-04 A11 |
| B | Stricter `secondaryMotion` coverage (drawn sway) | V1-11 `swayDrawn` |
| A and B | One hash file per exercise; pre-seeded slot files for machines and handles | V1-01, V1-09 |
| A | Only the supervisor edits `registry.ts` and `player.test.ts:216`; ids switch on only after they pass | V1-00 (g), V1-24 |
| A | Technique tests per exercise in `tests/formguide/v1/<id>.test.ts`, each proven by a reviewer mutation | every exercise card |
| A (FG-7a A8) | First phone frame-rate reading with an 80-path stand-in machine, before any machine art | V1-09 → DC0 |
| A (FG-6 A5) | A test that fails when `S_BACK` is removed | FG-6 finish |
| Judge 2 | Iterate `solveFrontArm` to a fixed point. It takes the shoulder rise from the old `shoulder_abd` (`pose.ts:124`, verified), so one pass leaves an error | V1-04 A10 |
| Mine | The played-smoothness probe runs (a), (b), (d) and seam checks, **not (c)**. WAAPI plays straight lines between stops, and that spiked 120 Hz acceleration about 5× in the demo (commit 5c0e884). (c) stays proven on the sampled data by fg:check | V1-08 |
| Mine | Split the front muscle overlays (lats, needed by the pulldown) from the long back-view card, so the pulldown is not blocked | V1-12 / V1-22 |
| Mine | Judge pass bar for V1: every applicable row at or above its Pass column (4, doc:22-27). This is stricter than the ship line (total ≥24/30, no mark below 3, doc:19) | exercise definition of done |

## 3. Decisions the supervisor records first (V1-00, as D-FG7 entries)

Each entry states its reason and its fallback.

- **(a)** Adopt Approach C with the grafts above.
- **(b) Drive rule, revised.**
  - Joint is the driver; one solved secondary channel; the part follows the body.
  - The follow travel is always a projection onto a one-dimensional path (line, arc or rotation), never a free 2-D point, so `handsOnHandle` still measures a real gap.
  - `handsOnHandle` limit 0.5 and `machinePivot` limit 0.05 are unchanged (`index.ts:48-50`). What they measure is unchanged.
  - The rubric row "moving parts follow the hand or foot" (doc:26) matches this.
  - The doc:120 and `model.ts:56` wording is updated.
  - Fallback: if a geometry fails on the real rig, that exercise is left out.
- **(c) Sway turns about the support.**
  - Standing: about the sole, unchanged, so the lateral raise hash stays the same.
  - Seated front: the trunk turns about the hips.
  - Back-pad supports: head and neck only.
  - Hanging: about the grip.
  - Plus the add-only `swayDrawn` check. Existing limits stay as they are.
- **(d) Rear delt fly uses the back view.** This matches `patterns.ts:20`. The back overlays include `rear_delts` (`overlays.ts:11`); the front list does not (`overlays.ts:8`). Correct doc:125 ("front") and doc:226.
  - Fallback after two failed likeness rounds: side view with `viewWhy` (the side list has `rear_delts`, `overlays.ts:9`), with the judge's motion-truth mark ≥4. Otherwise it is left out of V1.
- **(e) Triceps exercise is `lib_single_arm_triceps_pushdown`** (doc:205). Fix doc:243. The owner is asked, without blocking work, because `templates.ts:23` uses the two-arm id.
- **(f) Leg press and incline press:** the seated pose on a reclined seat support. If V1-11's sweep or renders show that cannot work, V1-11 adds a `reclined` pose and records why. **Hanging** becomes a real pose; the type already lists it (`model.ts:46`).
- **(g) Switching on:** only the supervisor edits `registry.ts` and the exact list at `player.test.ts:216`. An id switches on only after its judge pass. `lib_lat_pulldown` comes out today: it plays the chest-press stub (`FormGuidePlayer.tsx:55-56`). Judge 2 checked, and I confirmed, that `screenshot-gate.mjs` has 0 references to `lib_lat_pulldown`.
- **(h) The GU-7a stub** is retired only after V1-19's parity block reproduces every assertion of the GU-7a gate block (`screenshot-gate.mjs:5322-5611`). The chest-press file (V1-21) merges right after.
- **(i) Hold tremor** (doc:10) never reaches the stops, because no stop sits inside a hold (`index.ts:125-159`). Decide after V1-05 measures how many pixels it would move at 360 px. It does not block V1.
- **(j) Defaults, with non-blocking owner questions:** the curl uses both arms together; the row uses a V-handle; the curl grip follows research.
- **(k) Frame-rate protocol:** DC0, DC1 and DC2 (section 8).
- **(l) Channels each view can draw.** Derived from the code of `frontFrame` (main `pose.ts:51-120`) and `sideFrame` (FG-6 `pose.ts:191-260`) and published in doc §3. V1-07 adds a perturbation test so the list cannot drift. There is no spine-flexion, scapular-retraction or pelvic-tilt channel (`rig/joints.ts:28-45`, verified). Mistakes must be ones the view can draw.

## 4. FG-6 (PR #66) and the reference PNGs

**PR #66, verified today via the GitHub API and git:**
- Open, not a draft, head `c613b8d`.
- CI 4 of 4 green: android-gate, source-gate, visual-gate-tz and guard, finished 2026-09-28 23:43 UTC.
- The head does **not** contain current main (`git merge-base --is-ancestor` fails for both 9a37b56 and 1afc7ab).
- The PR body still describes the old head 2e31ca4.
- Whether review r2 has happened: **unverified**.

Steps:
1. V1-00 merges the references first.
2. The FG-6 builder, on its own branch:
   - merges `origin/main` with a merge commit;
   - adds a test that fails when `S_BACK` is removed (the PR #66 review found removing it failed nothing);
   - changes the "check bites" test so it breaks code, not a string;
   - updates the PR body to the new head.
3. A fresh reviewer runs r2: the r1 fixes (ANSUR ±0.08, overlap ≥400 units²) plus **A4 likeness judged against the reference PNGs, now on main**.
4. The supervisor merges when every check is green on a head containing the latest main.
5. The one `view.ts` wiring line the PR asks for goes to **V1-06**, not into FG-6.

**Reference PNGs.** Verified at `6c5a1a0` (branch `origin/claude/marc-form-guide-smoothness-fiuy2y`): `docs/design/form-guide-lab/lateral-raise-lab.html` plus 6 PNGs in `reference/`: rest-dark, rest-light, half-light, top-dark, close-top-dark and mistake-top-light.
- V1-00 copies only that folder: `git checkout 6c5a1a0 -- docs/design/form-guide-lab`. Do not merge the branch; what else is on it is **unverified**.
- They cover the front view and the lateral raise only. Side and back likeness use the owner-approved turnaround sheet from `fg:render --sheet` (V1-05, back added by V1-22).
- **Unverified:** whether the PNGs still match today's FG-1 figure. The V1-00 reviewer opens both side by side.

## 5. Card defaults (every card uses these unless it says otherwise)

- **base:** `origin/main` at dispatch (1afc7ab or later). Branch `claude/v1-NN-<slug>`. Open a draft PR after the first push. Merge `origin/main` (merge commit) before review. A card that starts before its dependencies merge branches from main and merges them in before review.
- **reserved_paths (R\*):**
  - watch agent files: `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, the Watch-lab row in `Settings.tsx`, and the watch agent's CI lines;
  - `escobar-worker/**`, `.github/**`, and all signing, `EXPECTED_SHA256` and keystore handling;
  - `package-lock.json`, and `package.json` except a card's named script line;
  - `src/core/models.ts`, `src/core/store.ts`, migrations;
  - `src/app/App.tsx`, `src/main.tsx`;
  - `src/formguide/registry.ts` and the exact list at `tests/formguide/player.test.ts:216` (supervisor only);
  - `src/formguide/research/*.json` (research cards only);
  - another task's blocks in `scripts/screenshot-gate.mjs` and `tests/theme.test.ts`;
  - every path in another open card's write_scope.
- **design_reference (D\*):**
  - doc §1 standard and rubric (doc:9-27), §4 rig and machines (doc:100-141), §5 checks;
  - D-FG1 to D-FG6 plus D-FG7;
  - `docs/design/form-guide-lab/reference/*.png` (after V1-00);
  - the owner-approved turnaround sheet (after V1-05 and V1-06).
- **connectivity (C\*):** offline at runtime. No network calls, no Escobar Worker, no new stored or sent data, no new dependency. Playwright and esbuild are already devDependencies (`package.json:41-42`). Renders use the local Chromium via `MARC_CHROMIUM=/opt/pw-browsers/chromium`.
- **verification (V\*):**
  - While building: focused tests only (`npm test -- tests/formguide/<file>`, `npm run fg:check <id>`).
  - Before review: `npm run check`. If the card touches the player or gate, also `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`.
  - Every fail-before test shows its red run on the base commit in the PR.
  - Full regression runs only in V1-24.
- **check-in (all cards):** a PR comment headed `CHECK-IN V1-NN`, plus a Relay message, at the point the card names. It contains the design choice, the measured numbers and 1-2 renders. Bulk work waits for the supervisor's `go` or `re-guide` in that thread. Until then the builder works only on scaffolding and tests the check-in cannot change.
- **risk_and_recovery (default):**
  - No limit is ever changed.
  - After two failed tries of the same approach with no new evidence, stop and tell the supervisor.
  - Recovery is a plain revert commit of the PR.
- **return (T\*):** a PR body with:
  - the head commit and changed paths;
  - evidence per criterion (test name, gate probe or render path);
  - the mutation list (what was broken and which test failed);
  - measured numbers (ms, bytes, (c) ratios, path counts);
  - what needs a real phone;
  - open risks and tokens used.

**Exercise definition of done (DoD), used by every exercise card:**
1. `research/<id>.json` was merged earlier by the research card. `git diff` shows the exercise PR does not touch it.
2. `npm run fg:check <id>` passes all checks: the 20 in `index.ts`, plus V1-07's, plus V1-11's `swayDrawn`, at unchanged limits. The hash is in `check/hashes/<id>.txt`. The file is ≤2 KB gzip.
3. 2 to 4 technique tests in `tests/formguide/v1/<id>.test.ts`. Each fails when the reviewer breaks the key it guards.
4. `npm run fg:render <id>` output in the PR:
   - the 4 moments, the mistake, compare mode, and the setup pair for machines;
   - a filmstrip, and a `--debug` view with contact markers;
   - all at 360 and 390 px in Silent Black and Paper, plus a 5-theme strip.
5. A fresh-context judge gives every applicable rubric row ≥4 (doc:22-27), against the reference PNGs and the owner sheet.
6. The supervisor looks at every V1 exercise and every new machine (stricter than the doc's 1 in 5, doc:153). The owner sees each new machine's stills before merge (doc:222).
7. The id is switched on by the supervisor after the judge passes, and V1-08's gate block then plays it.

## 6. Lanes and concurrency

At most **5 agents at once** (doc:146), reviewers and judges included. Judges use a freed slot (doc:187).

Lanes:
- **S** supervisor
- **A** solver and checks (strong model)
- **B** rig and views (strong)
- **C** tools and gate (light, then medium)
- **D** player and machine core (strong)
- **E** research (light)
- **F1, F2, F3** exercise and art (strong)

| Wave | Slot 1 | Slot 2 | Slot 3 | Slot 4 | Slot 5 |
|---|---|---|---|---|---|
| 1 (day 1-2) | FG-6 finish (B) | V1-04 (A) | V1-01 → V1-05 (C) | V1-02 → V1-03 (E) | V1-09 early build (D) |
| 2 (FG-6 merged, ~day 2-4) | V1-06 (B) | V1-04 → V1-07 (A) | V1-05 → V1-08 (C) | V1-09 (D) | V1-03 / reviews (E) |
| 3 (~day 5-7) | V1-11 → V1-12 (B) | V1-07 → V1-10 → V1-15 (A → F3) | V1-13 (F1) | V1-19 early build (D) | V1-14 (F2) |
| 4 (~day 7-10) | V1-22 (B) | V1-15 → V1-18 (F3) | V1-13 → V1-17 (F1) | V1-19 (D) | V1-16 (F2) |
| 5 (~day 10-12) | V1-22 finish (B) | V1-21 (F3) | V1-23 (F1) | reviews and judges | reviews and judges |

Supervisor work (V1-00, V1-20, V1-24, switch-on PRs) runs alongside the slots.

**Shared-file order.** Each file has one writer at a time, merged in this order:
- `check/index.ts`: V1-01 → V1-04 → V1-07 → V1-11
- `check/view.ts`: V1-04 → V1-06 → V1-11
- `model.ts`: V1-04 → V1-06
- `guideView.ts`: V1-04 → V1-06 → V1-09
- `ExercisePlayer.tsx`: V1-06 → V1-09 → V1-19
- `rig/pose.ts`: FG-6 → V1-06 → V1-11 → V1-22
- `player/scene.ts`: V1-05 → V1-09
- `effort.ts`: V1-04 → V1-10

`COACHING-DECISIONS.md` takes one appended D-FG entry per card; keep both sides on merge.

**Owner checklist, merge order.** Builds may run ahead; merges may not:
1. V1-00
2. V1-01
3. FG-6
4. V1-02
5. V1-03
6. V1-04
7. V1-05
8. V1-06
9. V1-07
10. V1-08
11. V1-09 (then DC0)
12. V1-10
13. V1-11
14. V1-12
15. V1-13
16. V1-14 (then DC1)
17. V1-15
18. V1-16
19. V1-17
20. V1-18
21. V1-19
22. V1-20
23. V1-21
24. V1-22
25. V1-23
26. V1-24

The back view (V1-22) is placed late on purpose, so its long art work never blocks the rest.

## 7. Cards in dispatch order

### V1-00: Decisions, references, stub fix (S)
- **outcome:**
  - D-FG7 entries (a) to (l).
  - `docs/design/form-guide-lab/**` copied from 6c5a1a0.
  - Doc fixes: doc:3 now points at real files; doc:125 says back; doc:226 fallback; doc:243 uses the single-arm id; §7 V1 list adds the back view, hanging pose and sway rule; §9 lists the V1 cards; doc:120 gets the revised drive rule.
  - `lib_lat_pulldown` removed from `GUIDE_IDS`.
  - The drawable-channel list (l) published.
  - The owner checklist numbered as in §6.
  - One non-blocking message to the owner with the quick questions (§8).
  - The OK for V1-05 to add the `fg:render` script line.
- **base:** default. **depends_on:** none.
- **read_first:** doc:1-30, 100-141, 197-249; `registry.ts`; `player.test.ts:212-218`; `patterns.ts`; `overlays.ts`; main `pose.ts:51-130`; FG-6 `pose.ts:191-290`.
- **write_scope:** `docs/COACHING-DECISIONS.md` (D-FG7), `docs/FORM-GUIDE-PRODUCTION.md`, `docs/design/form-guide-lab/**`, `src/formguide/registry.ts`, `tests/formguide/player.test.ts` (the exact list plus 1 new test).
- **reserved_paths:** R\*, except the registry pair.
- **acceptance:**
  - A1: `git ls-tree origin/main docs/design/form-guide-lab/` lists the HTML and 6 PNGs, with sha256 equal to 6c5a1a0 (listed in the PR).
  - A2: new test "every `GUIDE_IDS` id has an exercise file or is the stub's id (`stubGuide.ts:33`)". Fails before (lat pulldown), passes after.
  - A3: `hasGuide('lib_lat_pulldown')` is false; the exact list is updated in the same commit.
  - A4: doc:125 agrees with `patterns.ts:20`; doc:243 agrees with doc:205.
  - A5: each D-FG7 item has a reason and a fallback.
  - F1: the GU-7a gate block stays green.
- **design_reference:** D\*. **connectivity:** C\*.
- **verification:** `npm test -- tests/formguide/player.test.ts`; CI gate green.
- **check_in:** none (supervisor).
- **risk_and_recovery:** the PNGs may not match today's FG-1 (unverified). If they differ, note it in D-FG7, and the owner-approved sheet becomes the primary likeness reference.
- **return:** T\*.

### FG-6: finish PR #66 (B, existing builder)
- **outcome:** as §4. The scope does not widen.
- **base:** `origin/claude/fg-6-side-figure` @ c613b8d, merged with `origin/main`.
- **depends_on:** V1-00 (references for A4).
- **read_first:** the PR #66 review r1 comments; FG-6 D-FG6 (`COACHING-DECISIONS.md:497ff` on the branch).
- **write_scope:** as the PR (15 files), plus `tests/formguide/side.test.ts` (the new `S_BACK` test).
- **reserved_paths:** R\*, plus `check/view.ts` (goes to V1-06).
- **acceptance:**
  - doc:241 A1 to A4, with A4 re-judged against the PNGs.
  - A5: removing `S_BACK` fails a test.
  - A6: the "check bites" test breaks code, not a string.
  - F1: green on a head containing the latest main.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** V\*.
- **check_in:** none (already in review).
- **risk_and_recovery:** a merge conflict with main is unlikely, since main changed only AGENTS.md. If r2 fails likeness, the builder fixes proportions and the ANSUR test stays at ±0.08.
- **return:** T\*.

### V1-01: Hash file per exercise (C, light)
- **outcome:** `src/formguide/check/hashes/<id>.txt` replaces `hashes.json`. `check/node.ts:8,31` reads the folder. The message at `index.ts:513` names the new path. Fixture `fx.hash` keeps working.
- **base:** default. **depends_on:** none.
- **read_first:** `check/node.ts`, `check/index.ts:504-516`, `scripts/fg-check.mjs`.
- **write_scope:** `src/formguide/check/{node.ts,hashes/**}`, `src/formguide/check/index.ts` (line 513 only), deletion of `hashes.json`, `tests/formguide/hashes.test.ts`.
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: the lateral raise hash is `c1ac61634cd68bd4` from its `.txt` file, and all 20 checks pass.
  - A2: a file with no hash fails `hash`, and the message names `check/hashes/<id>.txt`. This fails before, because the message names `hashes.json`.
  - A3: no import of `hashes.json` remains (grep test).
  - A4: every seeded bad fixture gives the same failing checks as on main (snapshot).
  - A5: `fg:check` wall time is within ±0.3 s of 2.8 s (the Understand measurement).
- **design_reference:** D-FG3. **connectivity:** C\*. **verification:** V\*.
- **check_in:** none (mechanical).
- **risk_and_recovery:** the esbuild bundle may inline JSON differently than a folder read. The node-only fs read is covered by A1 through `npm run fg:check`.
- **return:** T\*.

### V1-02: Research, free weights, cables and rear delt (E, light)
- **outcome:** research JSON for `lib_dumbbell_biceps_curl`, `lib_romanian_deadlift`, `lib_hanging_leg_raise`, `lib_seated_cable_row`, `lib_single_arm_triceps_pushdown`, `lib_lat_pulldown` and `lib_rear_delt_fly`.
  - Each holds ranges, tempo, order, muscles with `peakAt`, and one drawable mistake with at least 2 tells.
  - Each holds the contact facts, with sources: bar over mid-foot, curl grip, row handle line, pulldown grip width, hanging swing.
  - Plus `tests/formguide/research.test.ts`, the validator.
- **base:** default. **depends_on:** V1-00 (triceps id, view, channel list).
- **read_first:** doc:148 (researcher prompt); `model.ts:93-103`; `rig/ranges.ts:12-22`; D-FG7 (l).
- **write_scope:** `src/formguide/research/{7 ids}.json`, `tests/formguide/research.test.ts`, `tests/formguide/fixtures/research-bad/**`.
- **reserved_paths:** R\*, plus `exercises/**`.
- **acceptance:**
  - A1: the validator rejects seeded bad JSON: a missing source, 1 tell, a side tell on `wrist_pron`, and a range outside AAOS. The reviewer removes the channel rule and a test fails.
  - A2: every number has a source.
  - A3: ≤300 words each (doc:148).
  - A4: the RDL mistake is drawable (bar drifts from the legs or knees bend), not spinal rounding.
- **design_reference:** doc:148, D-FG7 (l). **connectivity:** web sources while authoring only. **verification:** V\*.
- **check_in:** after the first file (the curl), before the other 6.
- **risk_and_recovery:** a source may be thin. Flag it, and never invent a number.
- **return:** T\*, plus sources per file.

### V1-03: Research, machines (E, light)
- **outcome:** research JSON for `lib_machine_chest_press`, `lib_incline_machine_press`, `lib_shoulder_press`, `lib_leg_press`, `lib_seated_leg_curl`, `lib_leg_extension` and `lib_seated_calf_raise`.
  - Machine settings are cited, or flagged `unverified_on_machine` (`model.ts:101`).
  - Presses and the leg press get soft-lockout end ranges, with sources.
- **base, depends_on, read_first:** as V1-02, plus doc:120-141 and doc:222.
- **write_scope:** those 7 JSON files.
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: all pass the V1-02 validator.
  - A2: every setting has a source or the flag.
  - A3: press end ranges stop short of full extension, with a source.
- **design_reference, connectivity, verification:** as V1-02.
- **check_in:** after the chest press file.
- **risk_and_recovery:** gym models vary. Flag the settings; the owner checks them at the gym.
- **return:** T\*.

### V1-04: Solver core (A, strong)
- **outcome:** new `src/formguide/solve/`.
  - Opt-in `contacts`, `balance`, `mistake.release` and `mistake.travel`.
  - `follow` drive parts, as a one-dimensional path projection.
  - An `effort.force` field.
  - `poseAt` and `sampleGuide` take an optional Rig. When a file declares contacts, each stop is solved after the curves, deltas and sway.
  - Derived travel is returned beside the channels and hashed only when present.
  - Files without contacts take the old path byte for byte.
  - The Rig gets a `chain`: the front chain wraps `solveFrontArm` in a fixed-point loop.
  - Tests use two fixture machines, one travel-driven and one follow, for comparison.
- **base:** default. **depends_on:** V1-00, V1-01. The side measurements in A0 wait for FG-6 on main.
- **read_first:** `sample.ts:99-219`, `check/index.ts:60-110,265-321,504-516`, `check/effort.ts`, `rig/ik.ts`, `pose.ts:121-130`, FG-6 `pose.ts:266-290`, both judges' fatal flaws.
- **write_scope:**
  - `src/formguide/solve/**` (new);
  - `model.ts` (add-only fields);
  - `sample.ts`;
  - `check/machines.ts` (type only);
  - `check/index.ts` (call sites and `eachSample` travel source only);
  - `check/effort.ts:43,48` only;
  - `check/view.ts` (Rig type, front chain);
  - `player/guideView.ts:71,95` only;
  - `tests/formguide/{solve,driveSmooth}.test.ts`, `tests/formguide/fixtures/solve/**`, `tests/formguide/fixtures/bad/handsOnHandle.follow/**`.
- **reserved_paths:** R\*, plus `rig/pose.ts` (wrap it, don't edit it).
- **acceptance:**
  - **A0 (gate):** `driveSmooth.test.ts` records, on the **real** front arm and the FG-6 side arm and leg, the (c) ratio and contact gap for each geometry: horizontal press, ~35° incline, overhead press, front pulldown, and the 45° sled. It compares (i) travel-driven solving at every stop with (ii) the joint driver plus one solved channel, and asserts the numbers. A geometry is buildable only if (ii) gives (c) ≤3 and gap <0.5.
  - A1: the lateral raise hash `c1ac61634cd68bd4` is unchanged, and every bad fixture's failing set equals main's.
  - A2: on the front two-hand bar fixture, contacts hold ≤1e-6 at every stop of every rep and the mistake. `handsOnHandle`, `bodyOnPad` and `machinePivot` pass at unchanged limits. Fails before: on main the sampler never reads contacts or drives.
  - A3: an unreachable target throws, naming the contact, u and the distance. By contrast, FG-6's `solveSideArm` silently straightens (FG-6 `pose.ts:276`).
  - A4: the bend sign never flips within a rep.
  - A5: a file that keys a channel a contact solves is rejected.
  - A6: contacts with no rig throw. `runChecks` and the player path run on the fixture with no throw, proving every call site is threaded.
  - A7: 3 reps plus the mistake solve in ≤50 ms under `MARC_PERF=1`; the number is recorded.
  - A8: released contacts are not enforced in the mistake.
  - A9: seeded bad file `handsOnHandle.follow` (a follow path missing the hand by 1 unit) fails `handsOnHandle`.
  - A10: the fixed-point `solveFrontArm` residual is ≤1e-6. Fails before: the one-pass residual on a raised-arm fixture is above 1e-6.
  - A11: a sweep of at least 50 contact parameter sets inside declared bounds passes smoothness, `jointRanges` and the anchor checks.
- **design_reference:** doc:120 (revised by D-FG7 (b)); D-FG2 and D-FG3. **connectivity:** C\*.
- **verification:** V\*, plus `npm run fg:check lib_dumbbell_lateral_raise`.
- **check_in:** after A0's numbers and the schema sketch, before threading call sites.
- **risk_and_recovery:**
  - If A0 fails for a geometry, that exercise is marked "left out" in D-FG7 and no check changes.
  - Import cycle: FG-6's `sideGuideRig` imports `poseAt`. The rig is passed as an argument, and `sample.ts` never imports rig code.
- **return:** T\*, plus the A0 table.

### V1-05: `fg:render` and `sceneOf` (C, medium)
- **outcome:** `scripts/fg-render.mjs` plus `src/formguide/check/render.ts`, bundled with esbuild like `fg:check` (`package.json:21`).
  - A pure `sceneOf()` in `player/scene.ts` is used by both the renders and the player.
  - Output goes to `renders/<id>/`: the 4 moments, the mistake, compare mode, the setup pair, and a 12-frame filmstrip per rep, at 360 and 390 px in all 5 themes.
  - `--debug` adds contact markers, pivots and the centre-of-mass line.
  - `--sheet` renders the front, side and back figure at rest.
  - It reports the tremor's pixel movement for D-FG7 (i).
  - Adds the script line in `package.json` (OK given in D-FG7) and `renders/` to `.gitignore`.
- **base:** default. **depends_on:** V1-00. Contact markers need V1-04. Side output works once V1-06 lands.
- **read_first:** `snapshot.ts`, `guideView.ts`, `scripts/fg-check.mjs`, `screenshot-gate.mjs:100-120`.
- **write_scope:** `scripts/fg-render.mjs`, `src/formguide/check/render.ts`, `src/formguide/player/scene.ts`, `tests/formguide/render.test.ts`, `package.json` (1 script line), `.gitignore` (1 line).
- **reserved_paths:** R\* (except the named script line).
- **acceptance:**
  - A1: the lateral raise renders 5 themes × 2 widths, all non-blank (pixel variance >0) and byte-identical across two runs.
  - A2: the player and the renders call the same `sceneOf` (spy test).
  - A3: an id with no rig exits 1 with the rig's reason.
  - A4: ≤60 s per exercise, recorded.
  - A5: `package-lock.json` is unchanged.
  - A6: the debug marker sits on the solved hand within 1 px (after V1-04).
- **design_reference:** doc:151, 161, 197. **connectivity:** local Chromium only. **verification:** V\*.
- **check_in:** after the first lateral-raise contact sheet.
- **risk_and_recovery:** fonts could make PNGs non-deterministic. Pin the Chromium path and the font stack; if they still differ, compare by pixel variance and record why.
- **return:** T\*, plus sample renders.

### V1-06: Side-view wiring, cameras, hand-held parts (B, strong)
- **outcome:**
  - `rigFor` returns FG-6's side rig; the `view.ts:38` branch goes.
  - A back slot points at a stub `figureBack.ts` that gives the reason "back view not drawn yet (V1-22)".
  - The side chain: `solveSideArm`, plus a new `solveSideLeg` that throws when a target is unreachable.
  - `markupOf` draws side markup (the throw at `guideView.ts:147` goes).
  - The camera label follows the view (`ExercisePlayer.tsx:159`).
  - The side hand draws the dumbbell and the end-on barbell (`FIGURE_PARTS`, `view.ts:25`). If the curl research specifies a grip turn, the side dumbbell's drawings crossfade with `wrist_pron` (opacity only).
  - New `VIEWBOXES`, at `standingFront`'s scale: `standingSide`, `seatedSide`, `lyingSide`, `hangingSide` (bar at 2.3 m, COACHING-DECISIONS.md:489), `ankleSide`, `gripFront` and `backFull`.
  - The FG-6 prone fixture moves to `lyingSide`. FG-6 reported prone at -87.3 against a -88 edge; not re-measured.
- **base:** default. **depends_on:** FG-6 and V1-04 merged.
- **read_first:** `check/view.ts`, `guideView.ts:20-28,140-150`, `ExercisePlayer.tsx:150-165`, FG-6 `pose.ts:164-300`, `figureSide.ts`.
- **write_scope:**
  - `check/view.ts`;
  - `rig/figureBack.ts` (stub);
  - `rig/figureSide.ts` (hand-part slot);
  - `rig/pose.ts` (`solveSideLeg`);
  - `model.ts` (VIEWBOXES);
  - `guideView.ts` (`markupOf`);
  - `ExercisePlayer.tsx` (label line);
  - `tests/formguide/fixtures/side/**` (camera field only);
  - `tests/formguide/sideWiring.test.ts`.
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: FG-6's side fixtures pass every check through the real `rigFor`, with no `vi.mock`. Fails before: "no side view figure yet".
  - A2: a side file mounts in vitest and shows "Side view". Fails before: the throw at `guideView.ts:147`.
  - A3: `solveSideLeg` is accurate to ≤1e-6 with a natural knee bend, and throws when unreachable.
  - A4: every camera holds its pose's figure ≥1 unit inside, at rest and at range ends, in both facings.
  - A5: the lateral raise frames and markup are byte-identical.
  - A6: the side dumbbell and barbell are ≤25 paths, token-only, and pass `themes`.
  - F1: a back file fails with the stub's reason, not a crash.
- **design_reference:** D-FG6. **connectivity:** C\*. **verification:** V\* plus the gate.
- **check_in:** after the cameras and rest stills, before the hand parts.
- **risk_and_recovery:** a machine may not fit a camera. The camera set is extended by this lane only.
- **return:** T\*.

### V1-07: New add-only checks (A, strong)
- **outcome:** each new check has its own seeded bad folder (the folder rule, `checks.test.ts:39-40`):
  - `contactsHeld`;
  - `matchesResearch`: tempo, kind, order, muscles and tells equal research, and ≤3 cues of ≤60 characters;
  - `framing`: ≥1 unit margin for both figures across load 0, the part's maximum and lb units, both facings, compare, zoom, every rep and the mistake;
  - `contrast`: text ≥4.5:1, marks ≥3:1 and the figure against the page ≥3:1, in 5 themes, with a minimum text height at 360 px;
  - `balance`: standing files keep the centre of mass over the foot base, using de Leva 1996 segment masses (cited in the code);
  - `targetDrawn`: `fg-t-<muscle>` is present in the drawn markup;
  - `travelRange`: follow travel stays within the research machine range.
  - Also a perturbation test that the D-FG7 (l) channel list matches the rigs.
- **base:** default. **depends_on:** V1-04 and V1-06 merged.
- **read_first:** `check/index.ts` in full, `tests/formguide/fixtures/bad/base.ts`, `tests/formguide/figure.test.ts:61-75`.
- **write_scope:** `src/formguide/check/{contacts,research,framing,contrast,balance,drawn}.ts` (new); `check/index.ts` (new entries only); `tests/formguide/fixtures/bad/<new>/**`; `tests/formguide/checksV1.test.ts`.
- **reserved_paths:** R\*, plus the 20 existing checks' code and fixtures.
- **acceptance:**
  - A1: each check fails its bad file with numbers, and passes the lateral raise.
  - A2: a 12 kg dumbbell clip reproduction fails `framing` (COACHING-DECISIONS.md:489).
  - A3: the PR #58 "20 KG" ink-on-black label fails `contrast`.
  - A4: a front file targeting `lats` fails `targetDrawn` (the front figure draws tint only for side_delts, front_delts and upper_traps), while `targetVisible` passes it.
  - A5: `git diff` shows no `LIMITS` change.
  - A6: `fg:check` stays ≤5 s per file.
- **design_reference:** WCAG 2.2 1.4.3 and 1.4.11. **connectivity:** C\*. **verification:** V\*.
- **check_in:** after the lateral raise is measured on all new checks, before writing the bad files.
- **risk_and_recovery:** the lateral raise may fail `framing` or `contrast`, or the figure may miss 3:1 against the page in some theme (unverified). Stop and report; the drawing or file is fixed, never the limit.
- **return:** T\*.

### V1-08: Generic form-guide gate block and probes (C, medium)
- **outcome:** one add-only block, **FG-V1**, in `screenshot-gate.mjs`. For every `GUIDE_IDS` id with a file, it:
  - opens the Train sheet and takes screenshots (play, compare, Pictures, setup) at 360 and 390 px in Silent Black and Paper;
  - probe 1, played smoothness: seeks WAAPI at 1/120 s, reads the drawn transforms, and runs (a), (b), (d) plus rep-seam jumps (not (c), see §2);
  - probe 2: target area visible at peak effort (ported from demo commit fbaa35d);
  - probe 3: mistake figure within 1 frame of the correct one;
  - probe 4: contrast on the live page;
  - probe 5: chunk gzip sizes (≤150 KB total; 0 B of form-guide code in the main chunk, the FG-4 probes at 5627 and 5635);
  - probe 6: a frame-interval proxy under 4× CPU throttle in compare mode, recorded only.
- **base:** default. **depends_on:** V1-05 and V1-06.
- **read_first:** `screenshot-gate.mjs:5095-5130,5613-5796`; `guideView.ts:63-91`; `waapi.ts`.
- **write_scope:** `scripts/screenshot-gate.mjs` (the FG-V1 block only).
- **reserved_paths:** R\*, plus every other gate block.
- **acceptance:**
  - A1: the lateral raise passes and writes all screenshots.
  - A2: a seeded broken timeline fails probe 1.
  - A3: hiding the `side_delts` tint fails probe 2.
  - A4: a 280 ms mistake offset fails probe 3.
  - A5: `git diff` of the gate file shows added lines only.
  - A6: gate wall time recorded (it runs twice in CI).
- **design_reference:** doc:19 (360 px). **connectivity:** local Chromium. **verification:** the gate locally and in CI.
- **check_in:** after probes 1 and 2 run on the lateral raise.
- **risk_and_recovery:** CI flakiness. Probe 6 has no pass mark until DC0 exists.
- **return:** T\*.

### V1-09: Machines in the player, stand-in machine, frame-rate readout (D, strong)
- **outcome:**
  - `src/formguide/machines/index.ts` holds `MACHINES` with 10 null slots (re-exported by `check/machines.ts`, today `MACHINES = {}` at `:29`).
  - Handle slots `wide_bar`, `v_handle` and `d_handle` in `parts/`.
  - Transform-only primitives: lever `rotate`, carriage `translate`, cable scale-and-rotate from the pulley, stack `translateY` with the plate count from the load.
  - A machine layer driven by the sampled travel.
  - A setup moment (right and wrong) before rep 1 and in Pictures.
  - A long-press on the stage opens a panel: the median and p95 frame time of the last play, and a "stress" toggle that mounts an 80-path stand-in machine behind the lateral raise in compare mode. It stores nothing.
- **base:** default (early build allowed). **depends_on:** V1-04, V1-05 and V1-06 merged.
- **read_first:** doc:118-141; `check/machines.ts`; `ExercisePlayer.tsx`; `snapshot.ts`.
- **write_scope:**
  - `src/formguide/machines/**` (index, primitives, stubs);
  - `check/machines.ts` (re-export);
  - `player/{machineView,fps}.ts` (new), `player/scene.ts`;
  - `guideView.ts` (1 call);
  - `ExercisePlayer.tsx`;
  - `parts/index.ts` (3 slots), `parts/handles/*.ts` (stubs);
  - `src/ui/styles.css` (block V1-09);
  - `tests/formguide/machines.test.ts`; `tests/theme.test.ts` (block V1-09).
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: the fixture machine plays with transforms and opacity only (`noFilters`), with the anchor within 0.5 of the solved hand at every keyframe.
  - A2: the stack rises with the load and shows 0 plates at 0 kg.
  - A3: `setupDiffers` passes.
  - A4: machine ≤80 paths.
  - A5: the lateral raise mounts no machine layer, and FG-4's block stays green.
  - A6: the panel is hidden without a long-press and writes nothing to the store or localStorage (test).
  - A7: a file naming an unbuilt machine fails with "machine <id> is drawn by <card>".
- **design_reference:** doc:114, 120. **connectivity:** C\*. **verification:** V\* plus the gate.
- **check_in:** after the stand-in plays in compare mode in the dev build.
- **risk_and_recovery:** the debug panel adds bytes. Record the chunk size; the supervisor may strip the panel before release.
- **return:** T\*, plus **the APK for DC0**.

### V1-10: Effort for cables and machines (A, strong)
- **outcome:** `force: 'contact'`: the moment arm comes from the contact's force line (hand to pulley; lever tangent). Today the torque model uses only the horizontal, gravity arm (`effort.ts:47-50`).
- **base:** default. **depends_on:** V1-04.
- **read_first:** `check/effort.ts`, `index.ts:348-382`.
- **write_scope:** `check/effort.ts`, `tests/formguide/effort.test.ts`.
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: gravity files are unchanged (lateral raise hash and note).
  - A2: with an overhead pulley, the peak sits where the cable is most perpendicular to the forearm. Fails under gravity, passes under contact.
  - A3: a machine with no force line fails with "no contact force".
- **design_reference:** doc §3 effort. **connectivity:** C\*. **verification:** V\*.
- **check_in:** after A2's fixture numbers.
- **risk_and_recovery:** if the model disagrees with research `peakAt`, `muscleTiming` stays unchanged and the file supplies explicit effort curves.
- **return:** T\*.

### V1-11: Supports, sway about the support, hanging and reclined, joint sweep (B, strong)
- **outcome:**
  - Support options: seat, back pad, grip, floor, lying. Pads come from `MachineDrawing.pads`; `rigFor` gains a machine argument.
  - Sway follows D-FG7 (c). This replaces the pelvis turn about the floor for front seated (`pose.ts:61`).
  - The side hanging pose, and the reclined support.
  - A joint sweep: every joint in 5° steps across AAOS (`ranges.ts:12-22`), in every pose and in front and side views, with neighbours overlapping ≥400 units².
  - ANSUR ±0.08 across views.
  - The add-only `swayDrawn` check: sway must move the drawn head by at least what 0.2° about the file's support gives.
- **base:** default. **depends_on:** V1-06 and V1-07.
- **read_first:** main `pose.ts:51-70`, FG-6 `pose.ts:191-230`, FG-6 overlap and ANSUR tests.
- **write_scope:** `rig/pose.ts` (supports, sway, hanging); `rig/figureSide.ts` (hanging legs only if needed); `check/view.ts` (machine argument); `check/index.ts` (`swayDrawn` entry); `tests/formguide/fixtures/bad/swayDrawn/**`; `tests/formguide/{supports,jointSweep}.test.ts`.
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: standing frames are byte-identical and the lateral raise hash is unchanged.
  - A2: front seated thigh-pad drift is <0.01 over 481 samples. Fails before, because of `pose.ts:61`.
  - A3: hanging keeps the hand on the bar grip ≤1e-6 and swings about it, with feet off the floor.
  - A4: the reclined back drifts <0.01 at backrest angles of 20-60°.
  - A5: no gap in the sweep. The reviewer shrinks the hip block and it fails.
  - A6: `swayDrawn` fails a seated side fixture on FG-6 code (sway drawn only when standing, FG-6 `pose.ts:221`) and passes after.
  - A7: `secondaryMotion` and its [0.2°, 1.5°] band are unchanged.
- **design_reference:** D-FG7 (c) and (f). **connectivity:** C\*. **verification:** V\*.
- **check_in:** after seated and hanging stills and sweep numbers, before the reclined support.
- **risk_and_recovery:** if the reclined support fails, add a `reclined` pose and record it.
- **return:** T\*.

### V1-12: Front overlays (B, strong)
- **outcome:** the front figure draws tint and band for `lats`, `biceps` and `forearms`.
- **base:** default. **depends_on:** V1-11.
- **read_first:** `rig/figureFront.ts`, `overlays.ts:8`.
- **write_scope:** `rig/figureFront.ts` (overlay groups only); `tests/theme.test.ts` (block V1-12).
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: `targetDrawn` passes for a `lats` front fixture (fails before).
  - A2: the front figure stays ≤260 paths, count recorded (202-204 today; target 220, doc:114).
  - A3: the lateral raise markup changes only by the added groups, and its hash is unchanged.
  - A4: 5 themes, no literal colours.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** V\*.
- **check_in:** after the lats render at 360 px.
- **risk_and_recovery:** a path budget overrun. Simplify the band paths; the cap stays.
- **return:** T\*.

### V1-13: Curl, RDL, hanging leg raise (F1, strong)
- **outcome:**
  - **Curl:** `elbow_flex` is the driver; `shoulder_flex` stays in a tight research range; both arms together; the grip per research (crossfade only if needed). Mistake: swing (`torso_lean` and `shoulder_flex` tells).
  - **RDL:** `hip_flex` keys with soft knees; the bar holds a line contact through mid-foot; `balance` solves `ankle_flex`; the near arm covers the near leg (D-FG6); plates come from the load (D-FG5). Mistake: releases the line.
  - **Hanging leg raise:** grip support; `hip_flex` and `knee_flex` keys. Mistake: swing plus faster tempo. No load label (COACHING-DECISIONS.md:600; `load.ts:28`).
- **base:** default. **depends_on:** V1-02, V1-04, V1-05, V1-06, V1-07; V1-11 for the hanging leg raise.
- **read_first:** DoD; the 3 research files; `lib_dumbbell_lateral_raise.ts`.
- **write_scope:** `exercises/{3 ids}.ts`, `check/hashes/{3 ids}.txt`, `tests/formguide/v1/{3 ids}.test.ts`.
- **reserved_paths:** R\*, plus `research/**`.
- **acceptance:**
  - DoD 1-6.
  - A7: curl upper-arm drift stays within research.
  - A8: the RDL bar stays ≤0.5 from the mid-foot line, and the mistake leaves it by >5.
  - A9: hanging-leg-raise hands stay on the bar ≤0.5; the pelvis swing is small in the correct rep and large in the mistake.
  - F1: the reviewer shifts the RDL line 1 unit and `contactsHeld` or `balance` fails.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** `fg:check` and `fg:render` for each.
- **check_in:** after the curl is keyed and rendered, before RDL and the hanging leg raise.
- **risk_and_recovery:** hand keys in the 2 KB cap. Measure the first file; the cap stays.
- **return:** T\*, plus judge sheets.

### V1-14: 45° leg press (F2, strong)
- **outcome:**
  - The `leg_press_45` drawing: sled carriage on a 45° rail, plates from the load, reclined seat and back pad.
  - `knee_flex` is the min-jerk driver; `hip_flex` is solved so the feet stay on the sled along the rail; ankle foot-flat is solved; the sled follows the feet.
  - Soft lockout. Setup moment: backrest angle, right and wrong.
  - Mistake: hips roll off the pad at the bottom, drawn via the release plus `torso_lean`, since there is no pelvic-tilt channel.
- **base:** default. **depends_on:** V1-03, V1-04 (A0 buildable for the sled), V1-07, V1-09, V1-10, V1-11.
- **read_first:** DoD; doc:120, 132.
- **write_scope:** `machines/leg_press_45.ts`, `exercises/lib_leg_press.ts`, its hash and v1 test.
- **reserved_paths:** R\*.
- **acceptance:**
  - DoD.
  - A7: `bodyOnPad` drift <0.01 and feet within 0.5 of the sled on every correct sample.
  - A8: plates follow the load (0 at 0 kg).
  - A9: ≥1 unit framing margin in compare mode.
  - A10: machine ≤80 paths.
  - F1: a sled off its rail fails `machinePivot`.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** as V1-13.
- **check_in:** after the drawing at rest, the setup pair and the path count, before keying.
- **risk_and_recovery:** the heaviest drawing; its merge triggers **DC1**. If the file exceeds 2 KB, report early.
- **return:** T\*, plus **the APK for DC1**.

### V1-15: Side cables: dual pulley, row station, pushdown, row (F3, strong)
- **outcome:**
  - Drawings: the dual pulley (side, high/mid/low; later reused by 21 cable exercises, doc:139), the row station, `d_handle` and `v_handle`.
  - **Pushdown:** the near arm works (the mirror rule); `elbow_flex` is the driver; `shoulder_flex` is tight; the cable follows the hand; the stack rises with the change in cable length. Mistake: elbow drifts plus trunk lean.
  - **Row:** seat support; the feet are on the plate via a contact solving hip and knee (overriding the seated 90/90, `pose.ts:12`); both arm joints are keyed min-jerk; the cable follows. Mistake: torso rocks.
- **base:** default. **depends_on:** V1-02, V1-04, V1-07, V1-09, V1-10, V1-11.
- **read_first:** DoD; doc:138-139.
- **write_scope:** `machines/{dual_pulley,row_station}.ts`, `parts/handles/{d_handle,v_handle}.ts`, `exercises/{lib_single_arm_triceps_pushdown,lib_seated_cable_row}.ts`, their hashes and v1 tests.
- **reserved_paths:** R\*.
- **acceptance:**
  - DoD.
  - A7: the cable end is within 0.5 of the hand at every keyframe, and the stack is monotone with cable length.
  - A8: setup pulley height, right and wrong.
  - A9: parts ≤25 paths, machines ≤80.
  - F1: the reviewer moves the pulley 10 units and the effort peak shifts.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** as V1-13.
- **check_in:** after the pulley stills, before the station and handles.
- **risk_and_recovery:** the pulley is reused widely, so the supervisor gives it a full look.
- **return:** T\*.

### V1-16: Leg extension, seated leg curl, seated calf (F2, strong)
- **outcome:**
  - **Leg extension and leg curl:** levers pivot on the knee with an ankle pad (plus a thigh pad for the curl). `knee_flex` is the driver and the lever follows the shin. Setup: knee in line with the pivot, right and wrong (doc:142).
  - **Calf:** `ankle_flex` is the driver; the forefoot is fixed on the platform edge; the knee pad follows the knee; the `ankleSide` zoom is used.
  - Mistakes: hips lift plus a fast drop; for the calf, bouncing or partial range.
- **base:** default. **depends_on:** V1-03, V1-04, V1-07, V1-09, V1-10, V1-11.
- **read_first:** DoD; doc:108, 131, 135, 141-142.
- **write_scope:** `machines/{leg_extension,leg_curl_seated,calf_seated}.ts`, `exercises/{3 ids}.ts`, their hashes and v1 tests.
- **reserved_paths:** R\*.
- **acceptance:**
  - DoD.
  - A7: `machinePivot` ≤0.05 on every correct sample.
  - A8: calf knee pad ≤0.5 from the knee; forefoot drift <0.01.
  - A9: at 360 px the ankle's travel spans ≥40 CSS px in the zoom.
  - F1: moving the pivot 1 unit fails.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** as V1-13.
- **check_in:** after the leg extension drawing and one rendered rep.
- **risk_and_recovery:** the calf's pivot may not bind to a joint (unverified); report at the check-in.
- **return:** T\*.

### V1-17: Lat pulldown, front view (F1, strong)
- **outcome:**
  - The pulldown station (front, thigh pad, cable to stack) and the `wide_bar` part.
  - Seated front pose with the knees under the pad (static contact).
  - `shoulder_abd` is the min-jerk driver; `elbow_lead` is solved to keep the hands on the bar's vertical line at the research grip width; the bar follows; the `gripFront` zoom is used.
  - Mistake: lean back (`torso_lean`; the trunk shortens by cos, `pose.ts:67`) plus partial range.
- **base:** default. **depends_on:** V1-02, V1-04 (A0 buildable for the pulldown), V1-07, V1-09, V1-11, V1-12.
- **read_first:** DoD; doc:73-94, 137.
- **write_scope:** `machines/pulldown_station.ts`, `parts/handles/wide_bar.ts`, `exercises/lib_lat_pulldown.ts`, its hash and v1 test.
- **reserved_paths:** R\*.
- **acceptance:**
  - DoD.
  - A7: thigh pad drift <0.01 with sway on.
  - A8: lats visible at peak (V1-08 probe 2).
  - A9: the bar stays in the camera in compare mode.
  - A10: the supervisor re-adds the id only after the judge passes.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** as V1-13.
- **check_in:** after the station drawing and one rendered rep.
- **risk_and_recovery:** a lean-back mistake may read poorly in the front view; the judge's legibility mark decides. Fallback: pick another drawable tell.
- **return:** T\*.

### V1-18: Seated press machines, incline press, shoulder press (F3, strong)
- **outcome:**
  - Drawings: `chest_press` (side, with seat and backrest settings; the builder records whether the incline is a setting or its own drawing, per doc:124) and `shoulder_press`.
  - `elbow_flex` is the min-jerk driver; `shoulder_flex` is solved to the handle path; the handle follows; back pad and seat are the supports.
  - Machine presses start with the push (`lift_first`) with a stated why (`patterns.ts:14-15`).
  - The shoulder press gets `bladeRhythm` text (`index.ts:398`).
  - Setup: seat height, right and wrong.
  - Finishes `lib_incline_machine_press` and `lib_shoulder_press`. The chest-press file waits on the branch for V1-21.
- **base:** default. **depends_on:** V1-03, V1-04 (A0 buildable for each press), V1-07, V1-09, V1-10, V1-11.
- **read_first:** DoD; doc:124-126.
- **write_scope:** `machines/{chest_press,shoulder_press}.ts`, `exercises/{lib_incline_machine_press,lib_shoulder_press}.ts`, their hashes and v1 tests.
- **reserved_paths:** R\*, plus `exercises/lib_machine_chest_press.ts` until V1-21.
- **acceptance:**
  - DoD.
  - A7: `handsOnHandle` <0.5 and back-pad drift <0.01 on every correct sample.
  - A8: no elbow reaches 0° in the correct figure, and (c) passes at the turn.
  - A9: `upper_chest` visible in the incline press (`overlays.ts:9`).
- **design_reference:** D\*. **connectivity:** C\*. **verification:** as V1-13.
- **check_in:** after the chest-press drawing, the setup pair and one keyed incline rep.
- **risk_and_recovery:** if a press geometry fails A0 on the real rig, that exercise is left out. No check change.
- **return:** T\*.

### V1-19: Player standard (§1) and GU-7a parity (D, strong)
- **outcome:** the §1 items the player lacks (doc:13-16):
  - readouts: joint angle, hand speed, effort bars, phase bar;
  - an angle arc and one tag outside the face keep-out;
  - a hand-path trace;
  - muscle hotspots with the one-bubble rule (`controller.ts`).
  - Plus a parity gate block that maps every GU-7a assertion to a real guide.
- **base:** default (early build allowed). **depends_on:** V1-09.
- **read_first:** `ExercisePlayer.tsx:144-219`; `controller.ts`; `screenshot-gate.mjs:5322-5611`.
- **write_scope:** `player/{readouts,guides,hotspots}.ts`, `ExercisePlayer.tsx`, `src/ui/styles.css` (block V1-19), `tests/formguide/playerV1.test.ts`, `scripts/screenshot-gate.mjs` (V1-19 block).
- **reserved_paths:** R\*, plus the GU-7a block.
- **acceptance:**
  - A1: readouts match `poseAt` within 1°, and effort within 2%, at 10 sampled times.
  - A2: the tag never overlaps the head at any stop of any merged V1 file; a seeded overlap fails.
  - A3: hotspot targets ≥44 px at 360 px.
  - A4: a table maps each GU-7a assertion to a passing V1-19 assertion.
  - A5: 0 B of form-guide code in the main chunk (FG-4 method).
  - A6: reduced motion still shows Pictures.
  - F1: a guide with no muscles shows no hotspots and does not crash.
- **design_reference:** doc:9-17. **connectivity:** C\*. **verification:** V\* plus the gate.
- **check_in:** after readouts and the tag on the lateral raise.
- **risk_and_recovery:** chunk growth. Record it; lazy-split if needed.
- **return:** T\*.

### V1-20: Retire the GU-7a stub (S)
- **outcome:** the supervisor removes `stubGuide.ts`, the stub path in `FormGuidePlayer.tsx` and the GU-7a gate block, replaced by the V1-19 parity block. The decision is recorded and the owner is told in plain words.
- **base:** default. **depends_on:** V1-19 merged; V1-21 ready at the same head.
- **read_first:** the V1-19 parity table.
- **write_scope:** `player/stubGuide.ts`, `FormGuidePlayer.tsx`, the GU-7a gate block, the stub tests, D-FG entry, and the V1-00 test tightened to "has a file".
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: every GU-7a assertion is mapped and passing.
  - A2: no `GUIDE_IDS` id plays a stub.
  - A3: the gate is green twice on the merged head.
- **design_reference, connectivity, verification:** defaults, plus the gate.
- **check_in:** none.
- **risk_and_recovery:** a gap in the mapping means the stub stays.
- **return:** T\*.

### V1-21: Machine chest press file (F3, strong)
- **outcome:** `lib_machine_chest_press.ts` from V1-18 merges right after V1-20.
- **base:** default. **depends_on:** V1-18, V1-20.
- **read_first, write_scope:** that exercise file, its hash and v1 test.
- **reserved_paths:** R\*.
- **acceptance:**
  - DoD, plus V1-18 A7 and A8.
  - A9: the Train sheet mounts `ExercisePlayer` (V1-08 screenshots).
- **design_reference, connectivity, verification:** defaults.
- **check_in:** none.
- **risk_and_recovery:** revert V1-20 and V1-21 together.
- **return:** T\*.

### V1-22: Back view (B, strong; starts early, merges late)
- **outcome:**
  - The back figure drawn from FG-1's silhouette, with the back overlay list (`overlays.ts:11`).
  - Arm foreshortening.
  - Back frame and chain.
  - Adds the back to the turnaround sheet.
- **base:** default. **depends_on:** V1-06 (slot, `backFull`), V1-05 (`--sheet`), and the owner's sheet approval before overlays and foreshortening.
- **read_first:** doc:100-110; `figureFront.ts`; `pose.ts:51-70`.
- **write_scope:** `rig/figureBack.ts`, `rig/back.ts` (new), `rig/pose.ts` (back frame only), `tests/formguide/back.test.ts`, `tests/theme.test.ts` (block V1-22).
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: ≤260 paths, count recorded.
  - A2: 5 themes, token-only.
  - A3: `targetDrawn` passes for every back-list muscle.
  - A4: ANSUR ±0.08 against the front.
  - A5: the sweep has no gap.
  - A6: judge likeness ≥4 against the sheet.
  - A7: front and side markup unchanged.
  - F1: an arm at 90° flexion is drawn shortened, never longer than its bone.
- **design_reference:** D\*. **connectivity:** C\*. **verification:** V\*.
- **check_in:** the back figure at rest on the sheet, plus **how horizontal abduction maps to existing channels**. The channel list has only `shoulder_abd` and `shoulder_flex` (`joints.ts:31-34`), so a new channel would be a supervisor decision.
- **risk_and_recovery:** two failed likeness rounds trigger the D-FG7 (d) fallback. Cost is about 0.8M tokens (doc:189, estimate).
- **return:** T\*.

### V1-23: Rear delt fly (F1, strong)
- **outcome:**
  - The reverse-fly machine in the back view: handles on carriages, chest pad hidden.
  - Arms at shoulder height; the handles follow the hands; foreshortened.
  - Mistake: shrug (`shrug_cm` tells) plus bent elbows.
- **base:** default. **depends_on:** V1-02, V1-07, V1-09, V1-22.
- **read_first, write_scope:** `machines/pec_deck.ts`, `exercises/lib_rear_delt_fly.ts`, its hash and v1 test.
- **reserved_paths:** R\*.
- **acceptance:**
  - DoD.
  - A7: `rear_delts` and `mid_back` visible at the squeeze.
  - A8: handles ≤0.5 from their paths.
  - A9: traps light up in the mistake.
  - F1: if V1-22 falls back, the side view is used with `viewWhy`, or the exercise is left out.
- **design_reference, connectivity, verification:** as V1-13.
- **check_in:** after the machine drawing.
- **risk_and_recovery:** last in line. It can be dropped from V1 without blocking the release.
- **return:** T\*.

### V1-24: Switch-on and release candidate (S)
- **outcome:**
  - After each exercise passes the judge, a small supervisor PR adds its ids to `registry.ts:3` and `player.test.ts:216`.
  - At the end: full regression (`npm run check`, `test:tz`, the gate twice in CI) on the exact release-candidate commit.
  - The APK is sent after the fingerprint step passes.
  - A contact sheet of all 15.
  - The doc Log (doc:249) records fps, token use per card and chunk sizes, and the §1 checkboxes are ticked with evidence.
- **base:** default. **depends_on:** all cards merged or explicitly left out.
- **write_scope:** `registry.ts`, `player.test.ts` (list), `docs/FORM-GUIDE-PRODUCTION.md` (Log and §1).
- **reserved_paths:** R\*.
- **acceptance:**
  - A1: only DoD-passing ids are on; any left out are named with the reason.
  - A2: regression green on the release-candidate commit.
  - A3: DC2 recorded, with a median ≥30 fps (doc:114). Otherwise a fallback card is opened and all 15 are re-checked and re-rendered.
- **design_reference, connectivity, verification:** defaults.
- **check_in:** none.
- **risk_and_recovery:** any change after the release candidate reruns A2.
- **return:** T\*.

## 8. Owner device checks (medium priority)

1. **DC0** after V1-09. Install the APK, open the Dumbbell Lateral Raise in Silent Black, tap "How to do it", long-press the demo, turn Stress on, use compare mode, play 12 s, and read the median and p95. This also closes the still-open FG-4 A6.
2. **DC1** after V1-14: the same steps on the leg press.
3. **DC2** on the release-candidate APK: all switched-on guides, both themes, readable in real light, plus compare-mode fps on the leg press.
4. **Approve the turnaround sheet**: front and side after V1-06, then the back after V1-22's check-in.
5. **Look at each new machine's stills** before it merges (doc:222).
6. **When convenient:** gym-check the settings flagged `unverified_on_machine`.
7. **Quick answers, not blocking:**
   - single-arm or two-arm pushdown?
   - curl both arms together or alternating, and does the palm turn?
   - V-handle row?
   - 45° or horizontal leg press?
   - which chest, incline and shoulder press machines, and is there a seated calf machine?
   - is the rear delt fly done on a reverse pec deck?
8. Publishing the release stays with the owner.

**Cost (estimate, not measured).** Doc:189 rates give 14 × 90k + 10 machines × 250k + back 0.8M ≈ 4.6M tokens. The foundation cards add more; the designs guessed 7-10M in total. The supervisor posts the estimate before starting, and the owner can stop between waves (doc:187).

**Unverified:**
- PR #66 review r2.
- Whether the PNGs match today's FG-1.
- The judges' (c) numbers on the real rig (V1-04 A0 checks this).
- Whether the lateral raise passes `framing` and `contrast`.
- The horizontal-abduction mapping in the back view.
- Solve time on the phone.
- Machine models at the owner's gym.
- The screenshot-gate line numbers come from the Understand read of 9a37b56. They were not re-read, but that file has not changed since.

---

# PART 2: for the owner

**What we'll build:** moving demos for your 15 split exercises. The lateral raise is done, so 14 are left. Starting today, the wrong demo on the lat pulldown is hidden.

**Order:**
1. **Groundwork, about 5 days.**
   - Finish the side-view figure.
   - A tool that makes pictures of every demo.
   - Stricter automatic checks.
   - A "solver" that keeps hands on handles and feet planted, so nobody fits every joint by hand.
   - Machines in the player.
2. **Exercises in three parallel lanes, about 6 days.** Curl, Romanian deadlift and hanging leg raise; leg press; cables; leg machines; pulldown; presses.
3. **Last:** the back-view figure for the rear delt fly, then the release candidate.

**How we make sure each one looks right:**
- Every demo must pass all automatic checks, and none are loosened.
- A fresh reviewer scores pictures against the reference drawings.
- The supervisor looks at all 15.
- You check them on your phone.

**What we need from you:**
- Approve one picture of the figure from the front, side and back.
- Measure smoothness on your phone three times with a hidden speed readout. You long-press the demo to open it.
- Answer a few optional gym questions.

**Time:** about 11 to 13 working days. That is an estimate.
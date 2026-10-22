Card GATE-FLAKE-5: the "Paper" gate misses are two mechanisms, a lazy How-to chunk that never arrives (HT-8, HT-9 Show) and COPY-2's snap rule reading a dropped frame as a snap (3 sightings, 10-19 to 10-22; 2026-10-22)

id: GATE-FLAKE-5
model: claude-opus-5-5 (not mechanical: timing fixes in three other tasks' blocks that must be shown equal or stricter, and one cause that is not yet known)
mode: auto
title: 'Builder: GATE-FLAKE-5 chunk waits and COPY-2 snap race'
branch: claude/gate-flake-5 (new). Your first push opens draft PR 'GATE-FLAKE-5: chunk waits name their cause; COPY-2 snap is race-free'.
lane: the HT/gate lane, under its own cap. It holds no LIB lane slot (D-LIB-LANE-ACTIVE does not apply). Start when you get this card.

Stops (these override every other line in this card):
1. Nothing is loosened. Every number the Ruling keeps stays. No timeout is raised (every 8000 ms wait stays 8000 ms), no threshold changed, no check removed, no theme, CPU rate or context cut. No chunk, request, page load or run is retried. No page error is filtered or caught. A red run is root-caused with --trace, never re-run to green. If a fix cannot be green under these rules, stop and report on the PR.
2. Edit only the lines the Ruling lists. Any other line of any block: stop and report (.claude/rules/shared-files.md).
3. src/**, public/sw.js and index.html are not this card's. An app defect goes on the PR for the supervisor (a BUG card), never fixed here. Blocking service workers in a context changes the path a probe runs, so it is a supervisor ruling, not a builder fix (Do 7).
4. Never commit scratch work: mutated gate copies, the busy-process loads, temporary module files, a scratch worktree.
5. Never write to the owner.

CI manners: GATE-SPLIT's train has merged, so only the limit of one push per 2 hours until READY applies, unless the supervisor asks for a push. Never use [skip ci]. Never cancel, re-run or dispatch another card's run.

base: origin/main @ 5158609c or newer.
- The three blocks are byte-equal on 59d3d78 (sighting 1's head), c9e8c814 (sighting 2's head) and 5158609c, at the same line numbers (checked: same sha256 of each slice, from its `if (gate.runs(` guard to the next guard):
  - HT-9 Show :7684-7742 (guard :7684, `const tag = 'HT-9 Show';` :7686): 67bbee4ca56469a2e499105081218020c17c946e1d23413d50f2d8e93eca6585
  - HT-8 :7997-8303 (its code ends at :8297; :8298-8303 are COPY-1's comment): 876bf650596a7f61019e57cec82cad757b0e32f8519826c84c4226d0ee5fcab9
  - COPY-2 :8928-9003 (its comment is :8922-8927; its code ends at :8997): f493c7d525c3aa8fa59a6c5226100b517f6dfd0290715531d15b64cf5504248d
  - tools/plates/fidelity/harness.mjs :227-266 (openAppTrain, openCard, openHowTo) is byte-equal on all three heads too. It is read, not edited.
- `node scripts/gate-blocks.mjs --count` is 104 on 5158609c (103 groups outside ALWAYS). Solo jobs under planFor with K = 103: HT-9 `MARC_GATE_JOB=1/103`, HT-8 `2/103`, COPY-2 `26/103` (the LIB-5v reviewer used 26/103). CI (K = 4): HT-8 runs in UTC job 3/4 and Pacific/Auckland job 2/4; HT-9 in UTC 2/4 and Auckland 1/4; COPY-2 in UTC 2/4 and Auckland 3/4. Work these out again with planFor if main moves.
- Merge origin/main with a merge commit before review and again before READY. `git pull --no-rebase` before each push. Never force-push, rebase or amend. If the branch moves without your push, stop and report.

depends_on: none open. Merged: COPY-2 (its swap block, D-COPY2-swap and D-COPY2-swap position), BUG-36 (the swap animation, src/slices/workout/Train.tsx:1074-1084), HT-8 (its block, #166's early chip), HT-9 (the Show block), GATE-SPLIT (shards, gate-times.json, gate-blocks.mjs), GATE-FLAKE-4 (the model: frames recorded in the page plus a race probe, tests/gate/gf4-bug34-race.mjs).

build_prerequisites: none.

merge_prerequisites:
- The supervisor's AGENTS.md exception line for this card, in the scripts/screenshot-gate.mjs row, on main or in the same train (precedent: the third exception, GATE-FLAKE-4). The builder never edits AGENTS.md. The text to commit: "A fourth exception (supervisor, 2026-10-22, plan risk 22, GATE-FLAKE-5): GATE-FLAKE-5 edits only the lines of COPY-2's, HT-8's and HT-9 Show's blocks that its card's Ruling lists (`docs/supervisor/verify/gate-flake-5-card.md`), each proven at least as strict by the card's acceptance rows and mutations."
- A fresh Opus review PASS against this card. The reviewer checks each edited line against the Ruling list.
- Every check green on a head that contains the latest main, with every gate shard green in both time zones, and visual-gate-tz green.
- No collision: see "collision check" below. Checklist order still applies.

shared-file owners:
- scripts/screenshot-gate.mjs: shared, add-only (AGENTS.md). COPY-2's block is COPY-2's, HT-8's is HT-8's, HT-9 Show's is HT-9's (all merged). Only the Ruling's lines change. No block is added, so `--count` stays 104 and tests/gate-split.test.ts is untouched. The guards :7684, :7997 and :8928 stay.
- scripts/gate-times.json: GATE-SPLIT's. Only the "COPY-2", "HT-8" and "HT-9" values, and only under Do 9.
- tools/plates/fidelity/harness.mjs: not edited (Ruling, B3 says why).
- docs/COACHING-DECISIONS.md: append only.
- AGENTS.md: the supervisor's. Not edited.

Root cause, in short (what this card's research proved, and what it could not)
The three sightings are not one Paper defect. Every block involved runs exactly Silent Black and Paper (HT_FULL, harness.mjs:572; HT-9 Show :7694; COPY-2 :8961), so Paper is half the exposure, and nothing in the app or the gate takes a Paper-only path (index.html :19 and :218 set Paper's colours only; no Paper-only font or chunk). Two mechanisms remain.
(A) COPY-2 (sighting 3) is proven: its snap rule (:8985) compares the panel's top between two consecutive requestAnimationFrame samples, but nothing bounds the time between them. When the page drops one frame, one sample pair holds two frames of the ease, and the measured ease's two largest neighbouring frames sum to more than the 25 px limit (12.7 + 15.6 = 28.4; 15.6 + 20.0 = 35.6; 20.0 + 19.9 = 39.9). The reviewer's 35.7 px at 103 ms is frames 2 and 3 in one sample. A 40 ms main-thread stall at the swap's second frame reproduced it 3 of 3 runs, 12 of 12 contexts, including the identical line. The animation itself is correct: plain runs step at most 20.1 px a frame.
(B) HT-8 and HT-9 Show (sightings 1 and 2) are one failure seen through two code paths: a lazy How-to chunk fails to load in a fresh context. Feel (Feel.tsx:48) and the sheet (lazy.tsx:17) catch a failed chunk and show a toast, so HT-8 sees only its 8000 ms wait running out (`locator.waitFor: Timeout 8000ms exceeded.`, the call log that names the locator cut off by :8142). The zoom host (ZoomHost.tsx:169, :188, `void open(...)`) does not catch it, so HT-9 Show gets a page error that names the chunk. Both shapes were reproduced exactly by failing the chunk. What could not be verified: why the chunk failed in CI. On this machine every How-to chunk is served by the app's service worker from its cache (precached at install, 68 requests, 3.35 MB per context), and no request failed in 9 parallel contexts. So in CI either the worker did not control the page or its cache lacked the chunk, and then the network fetch failed. Which one, and why the fetch failed, is not in any log. Part B makes the gate name it, and hunts it under load (Do 6-7).

Ruling D-GF5-R (supervisor, 2026-10-22; plan risk 22, as the LIB-4a and GATE-FLAKE-4 exceptions cite; D-GATEFLAKE-0; precedents GATE-FLAKE-3 #224 and GATE-FLAKE-4):
D-GATEFLAKE-0 allowed only wait and sampling edits in merged blocks, with the assertions byte-identical. Here COPY-2's reversal and snap rules must read replayed frames across a dropped frame, so their text changes, and HT-8's and HT-9 Show's failure lines gain their cause. That is allowed only for the lines below, and only because the Acceptance rows show each change equal or stricter. Line numbers are on main 5158609c.

Part A, COPY-2 (:8922-8997):
- A1 :8922-8927, the comment: wording only. Add one sentence: a sample pair more than 1.5 frames apart (a dropped frame) is checked on the panel's own swap animation, replayed paused at each 1000/60 ms of its time.
- A2 :8950-8960, c2Sample: each sample also records `ts` (the rAF time) and `ct`, the currentTime of the panel's running animation whose first keyframe is a negative translateY (the swap, Train.tsx:1083), else null. At the first frame that has it, keep its keyframes (effect.getKeyframes()) and timing (effect.getTiming()) for A3. The 900 ms window, the 400-frame cap and the fields dlg, title, top and h stay as they are.
- A3 one block inserted after :8976 (after the throttle is back at 1x): the replay. In the page, a new Animation of a KeyframeEffect with A2's keyframes and timing on the same panel, paused. It returns the top at each recorded ct, and for each gap pair (A4) the tops at ct_prev + k x 1000/60 for every k with that time below ct_next, plus ct_next. Then it is cancelled, before the screenshot at :8993. It runs after sampling has ended, so it cannot touch a recorded frame.
- A4 :8983-8984, the reversal rule. A gap pair is two consecutive samples whose ts differ by 25 ms (1.5 x 1000/60) or more. A gap pair with a ct on both sides is checked on its replayed sequence: every neighbouring pair in it, with the same -0.5 px. Every other pair is checked exactly as now.
- A5 :8985-8986, the snap rule. A pair less than 25 ms apart is checked exactly as now. A gap pair with a ct on both sides is checked on its replayed one-frame steps, each against the same snapLimit, instead of on its raw step. A gap pair without a ct on both sides keeps the raw rule. The message keeps "the panel's top snapped X px in one frame at T ms (limit L px)" and adds " (replayed)" when the step is a replayed one.
- A6 one line inserted after A5: the replayed top must match the recorded top within 0.5 px at every sample that has a ct. Otherwise an error names the sample's t, both tops and "the panel moved other than by its swap animation".
- Kept, byte for byte or in value: travel >= 20 px, snapLimit = max(16, travel / 4), the -0.5 px reversal, >= 10 frames, one sheet (ids), the rest rule (0.5 px, 100 ms, 5 samples), the 0.5 px height rule, 900 ms, 400 frames, both themes, 1x and 4x, the seed c2Seed, the waits :8968-8973, the error texts other than A5's suffix, and the screenshot. New: 25 ms (which pairs are gaps), 1000/60 ms (the replay step) and A6's 0.5 px. A6 only adds a way to be red. A4 and A5 change only gap pairs, and the equal-or-stricter argument is S5's.

Part B, HT-8 (:7997-8297) and HT-9 Show (:7684-7736):
- B1 HT-8, one helper inserted after :8018 (after `click`): `loads(page)` attaches a requestfailed listener and returns a function that reads the load state: each failed request (file name, errorText, and "service worker" when r.serviceWorker() is set), the text of the app's toast if one shows ('Could not load the guide.' is howToLoadFailed's, lazy.tsx:10), and whether navigator.serviceWorker.controller is set.
- B2 HT-8, one line inserted after each of :8080 (themeRun), :8151 (reducedRun), :8181 (shimmerCosts' app side) and :8219 (earlyChip): `const st = loads(page)` (or the same with the side's page).
- B3 HT-8 :8090, :8133, :8158 and :8185, the `.feel` waits. They pass only when `dialog.sheet.ht .feel` is visible within 8000 ms, as now. They end early, red, on the first sign the section cannot come: a failed request for the exercise's feel chunk (`/assets/feel-<chromeId>-*.js`) or the app's load-failed toast. The thrown error starts with Playwright's own first line when the 8000 ms run out, and adds B1's load state. A wait that resolves on the toast or a failed request is never a pass. harness.mjs's openHowTo wait (:262) is not edited: its timeout lands in B4's crash line, which now carries B1's state, so the HowToSheet chunk's failure shows there too.
- B4 HT-8 :8142, :8167 and :8265, the crash lines. Each keeps `${theme}: crashed: ${first line}` (reducedRun's and earlyChip's prefixes stay) and adds the call log's "waiting for locator(...)" line when there is one, and B1's load state.
- B5 HT-9 Show, one line inserted after :7695: the same requestfailed record and toast read for each theme's page (the block cannot see HT-8's helper; it is a separate scope).
- B6 HT-9 Show :7722: when a close-up did not open, the error adds the failed requests and the toast.
- Kept: every 8000 ms, 5000 ms, 1000 ms and 9000 ms bound in both blocks; every pass condition; every page error, counted as now (onError at :7695, :8014); no listener is removed; earlyChip's service-worker block (:8218) and its route (:8226) stay; HT-8's pairs >= 200, TRIP 1.2 and the shimmer rounds; HT-9 Show's 17 ids, 10 opens and pending rule.

Every other line of the three blocks stays byte-identical.

outcome: COPY-2 can no longer turn red because the machine dropped a frame, and it now also catches a snap or bounce hidden inside a dropped frame, which main cannot. When a How-to chunk fails, HT-8 and HT-9 Show say which chunk, how it failed and through which path, instead of an 8000 ms timeout with no cause; and the real cause is either found and fixed or narrowed to evidence the supervisor can rule on.
deliverable: one PR.
evidence: S1-S9.
finish: merged, with COPY-2, HT-8 and HT-9 green in every gate shard of both time zones and in visual-gate-tz on the PR's READY head and on the train head; and D-GF5-3 records Part B's cause (found and fixed) or the runs that did not reproduce it plus the open question for the supervisor. You will notice: nothing in the app. Only the gate changes.

design_reference:
- This card's "Root cause, in short", Evidence and Research appendix.
- COACHING-DECISIONS on main: D-COPY2-swap and D-COPY2-swap position (:2096-2097: the measured ease 12.7, 15.7, 19.9, 19.9, 11.5 and the two mutations); the GATE-FLAKE-3 and GATE-FLAKE-4 sections (the models).
- docs/supervisor/HANDOVER.md D-GATEFLAKE-0 (:299) and the HT-8 watch note (:928).
- src/slices/workout/Train.tsx:1066-1093 (the swap); src/ui/motion.ts (sheet 320 ms, drawer cubic-bezier(.32,.72,0,1)).
- src/slices/howto/sections/Feel.tsx:22-56 (whenNear, the load and its catch); src/slices/howto/lazy.tsx:8-19; src/slices/howto/zoom/ZoomHost.tsx:77-82, :108, :169, :188; src/howto/generated/loaders.ts:29-30; public/sw.js (install precache :12, fetch :41-59).
- tests/gate/gf4-bug34-race.mjs (the probe shape: slice, sha256 check, server, wrapped contexts, exit code).

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On main 5158609c: scripts/screenshot-gate.mjs :7684-7736 (HT-9 Show), :7997-8297 (HT-8), :8922-8997 (COPY-2), and :35-46 (visible, launchGone); tools/plates/fidelity/harness.mjs :227-272 and :569-572; the app files under design_reference.
- The CI logs: run 39313591152 attempt 1, job 118269216420 (sighting 1); job 119760945130 (sighting 2). Use the ci-log skill for their lines.

write_scope:
- scripts/screenshot-gate.mjs: the Ruling's lines A1-A6 and B1-B6 only.
- tests/gate/gf5-race.mjs (new): the repro and proof probe.
- scripts/gate-times.json: the three values, only under Do 9.
- docs/COACHING-DECISIONS.md: append the section "GATE-FLAKE-5" (D-GF5-1 to D-GF5-3).

reserved_paths:
- Every other line of scripts/screenshot-gate.mjs, every other block included.
- src/**, public/sw.js, index.html, tools/plates/fidelity/harness.mjs, tools/plates/**.
- tests/gate-split.test.ts, scripts/gate-blocks.mjs, gate-split.mjs, ci-verdict.mjs, gate-times.mjs, error-list.mjs, tests/gate/gf3-c11-race.mjs, tests/gate/gf4-bug34-race.mjs.
- tests/theme.test.ts, src/ui/styles.css, .github/**, package.json, package-lock.json, AGENTS.md.

Do:
1. Branch from origin/main. Run `npm ci` and `npm run build`.
2. The probe first (the test that fails before). Commit tests/gate/gf5-race.mjs with the blocks unchanged, then run S1 on that commit. The probe:
   - Has a header comment like gf4-bug34-race.mjs: what it proves, that it needs `npm run build`, and its usage.
   - `--block copy2|ht8|ht9show` picks one block. It runs that block's bytes unchanged: the slice from its guard to the next guard (HT-9 Show: the guard before `const tag = 'HT-9 Show';`), as an AsyncFunction with the names the slice reads (an unknown name throws, so a missing one cannot pass silently). gate.runs returns true only for that block's key.
   - The HT-8 and HT-9 Show slices `import('../tools/plates/fidelity/harness.mjs')` relative to scripts/. Resolve that without changing the slice: for example, run the slice from a temporary module file in scripts/ that is deleted after the run and never committed. The sha256 check below runs on the slice text, so a changed slice cannot pass.
   - Source: the working tree's scripts/screenshot-gate.mjs. `--gate <file>` runs another copy (the mutations). `--old` runs `git show 5158609c:scripts/screenshot-gate.mjs`; its slice must have the sha256 listed under base, or the probe exits 2 and prints the hash it got.
   - Serves www/ with `vite preview --port 4182 --strictPort`, and launches Chromium from MARC_CHROMIUM.
   - Wraps only what the block calls: browser.newContext (COPY-2, HT-9 Show), and chromium.launch for HT-8 (it launches its own browser, :8013), so the wrapped browser's newContext adds the fault and trace scripts. ctx.close is wrapped for --trace.
   - Options:
     - `--stall ms --at-frame n` (copy2): the main thread is busy for ms in the rAF callback of the swap animation's n-th frame (0-based), counted only once the sheet's h2 is no longer 'Quick check-in'. The init script this card used is in the Research appendix.
     - `--fail-chunk <regex>`: the matching chunk is deleted from the context's service-worker cache (page.evaluate over caches.keys()) once the app is on Train, and ctx.route aborts its network fetch with 'connectionreset'. This is the path the app really uses (checked: Playwright 1.63 routes the service worker's fetch, which fails net::ERR_CONNECTION_RESET, and the page's request then fails net::ERR_FAILED). A fault that only blocks the page's own request is not the gate's path: the worker answers it from its cache.
     - `--delay-chunk <regex> ms`: the same deletion, and the network fetch is held ms before it continues.
     - `--seed name` (copy2; Do 5's seeds); `--runs n`; `--expect green|red` (default green); `--trace` (copy2: per context the frames, the largest frame gap, the gap pairs, the largest raw and replayed step and the replay match; ht8 and ht9show: every failed request with errorText and path, the toast, the worker's controller state, and each chunk request's start and end time).
   - Exits 0 only when exactly n runs ran and each matched --expect. A run is red when the block pushed any error. It prints each run's errors.
3. Part A. Apply A1-A6 to COPY-2's block. Check that `git diff origin/main -- scripts/screenshot-gate.mjs` shows only A1-A6 there.
4. Part B. Apply B1-B6. Check the diff again: only A1-A6 and B1-B6.
5. COPY-2 seeds. Each is an init script that wraps Element.prototype.animate before the app runs and changes only the swap call (the panel's animate whose first keyframe is a negative translateY), or the panel's layout, as named. Use them as they are; never tune one to make it red:
   - `no-anim`: the swap's animate does nothing (the old one-frame swap).
   - `snap-1ms`: the swap's duration is 1 ms (D-COPY2-swap's own mutation).
   - `fast-80`: the swap's duration is 80 ms.
   - `overshoot`: the swap's easing is `cubic-bezier(0.3, 1.8, 0.5, 1)` (D-COPY2-swap's own mutation).
   - `mid-jump`: at the swap's 3rd frame the panel's margin-top grows by 30 px (a layout jump while the animation runs).
6. Hunt Part B's real cause (S3). With 8 busy processes (`node -e 'for(;;){}'`, scratch only, stopped after) and with --trace on the new blocks: `--block ht9show --runs 20` and `--block ht8 --runs 5`. Then once each: the full gate's UTC 3/4 shard as CI packs it (`TZ=UTC MARC_GATE_JOB=3/4`) and the whole gate in Pacific/Auckland (the visual-gate-tz run), both under the same load. Record every failed request: file, errorText, page or worker, and whether the worker controlled the page and had the file in its cache. Record the machine's core count.
7. Decide Part B by what Do 6 shows. Write the result in D-GF5-3 either way.
   - A failure reproduced and its cause lies in how the gate drives the app (for example a block closing or loading something that breaks a fetch): fix it inside B1-B6 if the lines allow it, prove it with S2's rows, and record it. If the lines do not allow it, stop and report.
   - It lies in the app or its service worker (for example the cache missing a precached file, or install failing under load): stop and report it on the PR with the trace, for a BUG card and a supervisor ruling. Do not block the worker in these contexts yourself (earlyChip's `serviceWorkers: 'block'` at :8218 is the precedent the supervisor would rule on).
   - Nothing reproduced: record the runs and counts. B1-B6 ship as they are, so the next CI sighting names the chunk, the error and the path. The supervisor keeps the watch item.
8. Run S4-S6 and `node scripts/gate-blocks.mjs --check`. Run the mutations on scratch copies with --gate. Never commit them.
9. gate-times.json. Time each of the three groups alone, before (main) and after (your head): 3 runs each, TZ=UTC and TZ=Pacific/Auckland, with the solo jobs under base. Take the seconds from screenshots/gate-proof-*.json, meta.seconds. For each group: if the larger after median is within 10% of the larger before median, leave its value alone; otherwise set it to the larger after median x 0.93 (D-GATESPLIT-LIB2's local-to-CI ratio). Record all medians in D-GF5-2.
10. Read only, no edit: list every other block's wait that ends on a lazy How-to chunk appearing (at least HT-3, HT-6, HT-9 C19, Order and main, HT-10, LIB-* that call openHowTo or open a close-up). For each, one line: does a failed chunk show there as a page error, a named error, or only a timeout? This is D-GF5-3's list for the supervisor, as D-GF4-3 was.
11. Append to COACHING-DECISIONS.md a section "## GATE-FLAKE-5: the Paper misses are a dropped-frame snap and a lost How-to chunk (2026-10-22)":
   - D-GF5-1 Decided (cause and fix): the root cause above in short, then A1-A6 and B1-B6, and why each is equal or stricter.
   - D-GF5-2 Reproduction and proof: the probe's commands and counts (S1-S6), the seed table, the replay match, and the gate-times result.
   - D-GF5-3 Not fixed here: Part B's cause (or the runs that did not find it), the app finding below, and Do 10's list.
12. Merge origin/main. Run S6, S7 and S8 on that exact head. Push, and mark READY with the S-row map.

Acceptance (each with mutations that must turn red; list them in the PR):
- S1 Main's reads are red or mute under the faults (the fail-before test). On the commit with the blocks unchanged:
  - `--block copy2 --old --stall 40 --at-frame 1 --runs 3 --expect red` exits 0, with lines of the CI shape (checked: 3 of 3 runs, 12 of 12 contexts red, one line exactly `COPY-2 swap paper 1x CPU: the panel's top snapped 35.7 px in one frame at 103 ms (limit 25.0 px)`).
  - `--block ht9show --old --fail-chunk 'hand-lat-pulldown-' --expect red` exits 0 and prints sighting 2's two lines: `HT-9 Show paper: page error: Failed to fetch dynamically imported module: http://localhost:4182/assets/hand-lat-pulldown-<hash>.js` and `HT-9 Show paper/lat-pulldown: lat-pulldown-step-3-show (hand): no .zx panel opened`, and nothing about the request (checked with a smaller probe: the same page error, no panel, no toast).
  - `--block ht8 --old --fail-chunk 'feel-barbell-back-squat-' --expect red` exits 0 and prints `HT-8: paper: crashed: locator.waitFor: Timeout 8000ms exceeded.` (and the same for each theme), with nothing that names the chunk. `--delay-chunk 'feel-barbell-back-squat-' 9000` gives the same line, so main's log cannot tell a lost chunk from a slow one (checked with a smaller probe: a failed feel chunk gives exactly that first line at :8090's wait, no page error).
  The same commands on the head (without --old): copy2 with --expect green (S2); ht9show and ht8 still red, now naming the cause (S2).
- S2 The new blocks:
  - copy2 is green, both themes at 1x and 4x. Each exits 0: plain `--runs 20`; `--stall 40 --at-frame 1 --runs 10`; `--stall 40 --at-frame 2 --runs 10`; `--stall 25 --at-frame 1 --runs 10`; `--stall 25 --at-frame 2 --runs 10`.
  - ht9show `--fail-chunk 'hand-lat-pulldown-' --expect red` exits 0, and the error names `hand-lat-pulldown-<hash>.js`, `net::ERR_FAILED` for the page and `net::ERR_CONNECTION_RESET` for the service worker.
  - ht8 `--fail-chunk 'feel-barbell-back-squat-' --expect red` exits 0. Each theme's line names the feel chunk, its errorText and the toast 'Could not load the guide.', and the wait ended well before 8000 ms (the PR gives the time).
  - ht8 `--delay-chunk 'feel-barbell-back-squat-' 9000 --expect red` exits 0, red at the 8000 ms bound, and the line says the chunk was requested and not finished.
  - ht8 `--delay-chunk 'feel-barbell-back-squat-' 3000` exits 0 (green: a chunk that arrives in time still passes, as on main).
  - Plain: ht9show `--runs 5` and ht8 `--runs 2` exit 0.
- S3 Real load (Do 6). 8 busy processes. copy2 `--runs 10` exits 0 on the head; record main's (--old) red count under the same load. ht9show `--runs 20` and ht8 `--runs 5`: record every failed request, or none. The PR gives the core count and the gate runs of Do 6.
- S4 Seeded defects stay red. For each COPY-2 seed, `--block copy2 --seed <name> --runs 3 --expect red` exits 0 on the new block with no stall, with `--stall 40 --at-frame 1` and with `--stall 40 --at-frame 2`, and on --old with no stall. If a seed is green on --old, record it and report; do not tune it. Not run while this card was written: the seeds are D-COPY2-swap's two mutations plus three new ones.
  - For Part B, on both --old and the head: `--fail-chunk` red (S1, S2); a seed that adds `dialog.sheet.ht .feel { visibility: hidden }` before the app runs: ht8 red on both (B3's wait must not take a present but hidden section as in).
- S5 Nothing loosened:
  - `git diff origin/main -- scripts/screenshot-gate.mjs` holds only A1-A6 and B1-B6. The PR lists each hunk against its number, and every number the Ruling keeps with its old and new line.
  - COPY-2, equal or stricter. A4 and A5 change only gap pairs with a ct on both sides. Such a pair is green only if every replayed one-frame step is within snapLimit, no replayed neighbour reverses more than 0.5 px, and (A6) the replay matches every recorded top within 0.5 px. So it is green only when the panel moved by its own swap animation alone and that animation is smooth at one-frame steps: a correct ease seen through a dropped frame. Every defect class main catches stays red: no animation (no ct, so the raw rule), a too short or overshooting ease (its replayed steps), a layout jump during the ease (A6). And a snap or bounce inside a dropped frame, which main cannot see, is now red.
  - On the 20 plain runs of S2 and 20 plain `--old` runs: the PR gives each side's count of gap pairs and largest one-frame step. With no gap pair in a context the two rules decide alike, so their results there must be identical.
  - A6's match: the largest difference over all S2 runs (checked while writing this card: 0.01 px in 4 contexts of 19-20 frames on Chromium 141; CI's Chromium 153 is unmeasured, so S8 logs it).
  - Part B: every pass condition and bound is unchanged, so a run that was green on main is green on the head unless a chunk failed (then it is red on both). The PR shows S2's `--delay-chunk 3000` green and the plain rows green on both.
  Mutations (each on a scratch copy run with --gate; each turns the named row red; not run while this card was written):
  - MA1 A6 removed: `--seed mid-jump --stall 40 --at-frame 2` turns green, so S4's mid-jump row is red;
  - MA2 the gap threshold 25 ms raised to 60 ms: the `--stall 40` rows of S2 are red again;
  - MA3 the replay step 1000/60 ms replaced by the whole gap (main's reading): the `--stall 40` rows of S2 are red;
  - MA4 the replay's easing forced to 'linear': A6 is red on plain runs, so S2's plain row is red (A6 really compares);
  - MA5 A4's replayed sequence not checked (raw reversal only): `--seed overshoot` with a stall over its overshoot frames turns green, so that S4 row is red (the builder picks the stall frame from --trace and records it);
  - MB1 B3 treats the toast as a pass: S2's ht8 `--fail-chunk` row turns green with --expect red failing;
  - MB2 B3's bound raised to 9500 ms: S2's `--delay-chunk 9000` row is green, so it is red;
  - MB3 B5 removed: S2's ht9show row no longer names the errorText, so it is red;
  - MB4 B3 takes an attached `.feel` as in: S4's hidden-section seed passes, so it is red.
- S6 `npm run check` and `npm run test:tz` are green. `node scripts/gate-blocks.mjs --check` passes, and `--count` is 104 (or main's count after a merge).
- S7 The full gate is green in both time zones on the final merged head: `TZ=UTC MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, and the same with `TZ=Pacific/Auckland`. The PR quotes COPY-2's, HT-8's and HT-9 Show's log lines from each.
- S8 CI: the READY head's run is green in every gate shard of both time zones and in visual-gate-tz. COPY-2's log line gains (in A5's wording or a new log line) the count of gap pairs and A6's largest difference, so CI's Chromium 153 shows it. A red shard is root-caused, never re-run to green.
- S9 The PR states which Do 7 branch Part B took, with its evidence.

verification: the PR body maps each S row to its command, exit code and run count, on the exact head sha. Before READY, merge origin/main and re-run, on that head: S1's head side, S2's copy2 plain and `--stall 40 --at-frame 1` rows, S6 and S7.

risk_and_recovery:
- A COPY-2 seed this card says is red passes the new block: the fix misses a defect. Fix it inside A1-A6. If that is not possible, stop and report. Never change a seed to make it red.
- A6 fails on a plain run (the replay does not match): the replay is not faithful on that engine. Stop and report with --trace. Never widen the 0.5 px.
- The app changes how the swap moves (Train.tsx:1083): with no matching animation every pair keeps the raw rule, so the old flake can come back but nothing passes wrongly. Report it.
- A replayed animation left running would move the panel in the screenshot: A3 cancels it before :8993. S7's screenshots show it.
- Part B's cause does not reproduce locally: that is Do 7's third branch, not a failure of the card. Never fake a cause.
- The cause is in the app or the service worker: stop at Do 7's second branch. Never block the worker, retry the import or catch the page error to get green.
- The probe's fault must use the worker path (Do 2). A route on the page's own request is not reached when the worker controls the page, so such a probe would test nothing.
- B1's listeners add work to each page: HT-8's 9 parallel contexts are the heaviest. Do 9 times it.
- main changes one of the three blocks, harness.mjs :227-272, Train.tsx's swap, Feel.tsx, ZoomHost.tsx or public/sw.js: merge it, re-run S1-S5, and check the numbers again.
- Another block is red on your head: not yours. Post the job and its error line on the PR for the supervisor. Never edit that block.
- Two failed tries of one approach: stop and report.
- CI load: pushes follow CI manners. A supervisor request is the only extra push.

return: PR number and head sha; one line per S row (command, exit code, run count); the S4 seed table; the gap-pair counts and A6's largest difference; the mutation red lines; Part B's Do 7 branch with its evidence; the three groups' solo seconds before and after in both time zones, and whether gate-times.json changed; the D-GF5-3 list; the CI run id and the three groups' log lines.

App finding for the supervisor (not this card's; src/** is reserved)
- ZoomHost.tsx:169 and :188 call `void open(...)` with no catch, and open awaits the hand chunk (:82). A hand chunk that fails to load is an unhandled rejection, and the user sees nothing: no panel and no toast (checked: Show me with the chunk failed gives no panel and no toast). Feel (Feel.tsx:48) and the sheet (lazy.tsx:17) show 'Could not load the guide.' for the same failure. The gate stays red for it either way: today through the page error, and after an app fix through "no .zx panel opened". The supervisor decides whether it gets a BUG card.

collision check
- At 2026-10-22, the supervisor checks that no origin branch changes the text of :7684-7742, :7997-8303 or :8922-9003 against its merge base, before this card starts. (Not run while this card was written.)

Evidence (the three sightings; every block byte-equal on its head and on 5158609c, see base)
1. 2026-10-19, PR #274 (LIB-13 LB3 plates; changes tools/plates/library/** and tests only), head 59d3d78. Run 39313591152, attempt 1, job 118269216420 `gate-shard (3/4, UTC)`, Chromium 153.0.8010.12. Its only error: `[1/1] HT-8: paper: crashed: locator.waitFor: Timeout 8000ms exceeded.` HT-8's own summary line in that job is complete (230 pixel pairs, 264.2 s), so only Paper's themeRun stopped early. The same shard passed in Pacific/Auckland on that head, and on its one re-run (attempt 2, job 118285405604). Supervisor note: #274 comment 6277704151. Which 8000 ms wait it was (:8090, the feel section; or harness.mjs:262, the sheet's golden figure, reached through openHowTo) is not recorded: :8142 keeps the first line of the message only.
2. 2026-10-22, PR #284 (LIB-7b), branch claude/lib-7b-scratch-2 @ c9e8c814. Run 39759827576, job 119760945130 `visual-gate-tz`, step "Visual gate once more in Pacific/Auckland (RG-14)", preview on 4174. Lines: `[1/4] HT-9 Show paper: page error: Failed to fetch dynamically imported module: http://localhost:4174/assets/hand-lat-pulldown-Cx2R-rn0.js` and `[2/4] HT-9 Show paper/lat-pulldown: lat-pulldown-step-3-show (hand): no .zx panel opened`; summary `33 opened their close-up ... 2 problems, 58.6 s`. ([3/4] and [4/4] are LIB-2 A10/A25 budget lines of that branch, not this card's.) The builder's evidence that the PR did not cause it: #284 comment 6338539064 (the chunk was built, the server stayed up, the same block passed in two other jobs on that commit). lat-pulldown is How-to index 4 (harness HT_PLATES), so the page had been open for tens of seconds: far past the worker's precache.
3. 2026-10-22, PR #282 (LIB-5v), reviewer comment 6337619598, Low 2. A full local gate (104 of 104 groups, 3,658 s) on head 2ad1bf3 gave one error: `COPY-2 swap paper 1x CPU: the panel's top snapped 35.7 px in one frame at 103 ms (limit 25.0 px)` (:8986). COPY-2 alone (`MARC_GATE_JOB=26/103`) was green 5 of 5 on that head and 5 of 5 on main 5158609. CI was green on that head.

Research appendix (2026-10-22, main 5158609c's build, Chromium 141.0.7390.37, Playwright 1.63.0, 4 cores; scratch scripts, not committed)
- COPY-2, plain, 2 runs: green. Per-frame steps of the swap in all 8 contexts: 12.7-12.8, 15.5-15.8, 19.9-20.1, 19.7-19.9, 11.3-11.5, 6.2-6.4, 3.9-4.0 px at 16.6-16.8 ms (D-COPY2-swap measured 12.7, 15.7, 19.9, 19.9, 11.5). travel 100 px, so snapLimit 25.0.
- COPY-2 with a main-thread stall at the swap's frame n (0-based, counted after the title changed): 40 ms at n = 1: red 3 of 3 runs, every context (1x: 35.5-35.7 px at 102-118 ms; 4x: 28.3-28.4 px and 48.3-48.4 px). 25 ms: n = 0 green 2 of 2, n = 1 red 1 of 2, n = 2 red 2 of 2, n = 3 green 2 of 2. A 25 ms stall does not always cost a frame, so S2 uses both 25 and 40 ms.
- The replay (A3's method): a paused Animation of the recorded keyframes and timing (duration 320, easing cubic-bezier(0.32, 0.72, 0, 1)) on the same panel, after the swap had rested, matched every recorded top within 0.01 px at the recorded currentTimes (4 contexts, 19-20 frames each, with the 40 ms stall). Its one-frame steps: 12.75, 15.63, 19.98, 19.85, 11.44, 6.30, 3.95, 2.71; largest 19.98 < 25.
- The stall init script used: `(() => { let n = -1, done = false; const f = () => { if (done) return; const d = [...document.querySelectorAll('dialog.sheet[open]')].pop(); const p = d && d.querySelector('.sheet-panel'); const swapped = d && d.querySelector('h2') && d.querySelector('h2').textContent !== 'Quick check-in'; const an = swapped && p && p.getAnimations().find(x => x.playState === 'running' && /^translateY\(-/.test(x.effect.getKeyframes()[0]?.transform || '')); if (an) { n++; if (n === AT) { const e = performance.now() + STALL; while (performance.now() < e); done = true; return; } } requestAnimationFrame(f); }; requestAnimationFrame(f); })()`
- How-to chunks, one fresh Paper context opened as openAppTrain does: the worker's install sent 68 requests (62 assets plus the core files; www/assets is 62 files, 3,349,295 B), from 1.1 s to 1.5 s after the context opened. Train was ready at 3.8 s. Every later How-to chunk (HowToSheet js and css, loaders, feel-lateral-raise) was answered by the worker (response.fromServiceWorker() true). No request failed.
- The same with 9 contexts at once (HT-8's count): each install ran from about 1.9 s to 4.7 s, before Train was ready (5.4-6.2 s). Every feel chunk came from the worker. No request failed in 9 of 9.
- A failed hand chunk (deleted from the worker's cache, its fetch aborted with 'connectionreset'): the worker's fetch failed net::ERR_CONNECTION_RESET, the page's net::ERR_FAILED, page error `Failed to fetch dynamically imported module: http://localhost:<port>/assets/hand-lat-pulldown-Cx2R-rn0.js`, no panel within 8000 ms, no toast. Without the fault the same Show me opened its panel.
- A failed feel chunk (barbell-back-squat, the same way): openHowTo succeeded, then the `.feel` wait gave `locator.waitFor: Timeout 8000ms exceeded.` with the call log `waiting for locator('dialog.sheet.ht .feel') to be visible`, and no page error.
- Not measured: anything on CI's Chromium 153; the HT-8 and HT-9 Show blocks themselves under the faults (this research used smaller probes of the same calls); the COPY-2 seeds; every mutation; why the chunk failed in CI.

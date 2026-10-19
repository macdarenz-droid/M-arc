Card LIB-8-FIX: pilot A code-review fixes (review 6243689943 and routing 6243704774 on #109; 2026-10-18)

id: LIB-8-FIX
model: claude-opus-5-5
mode: auto
title: 'Builder: LIB-8-FIX pilot A code-review fixes'
branch: claude/lib-8-pilot-a (existing, PR #109, head e6f39ffb). The session that built it is on an account that is gone. You continue on the same branch with merge commits only. Never rebase, amend or force-push. Run `git pull --no-rebase` before each push. If the branch moves without your push, stop and report.

Stops (these override every other line in this card):
1. Lane slot (D-LIB-LANE-ACTIVE: lib4-cards.md section 12 item 2, amended by section 13 amendment 21 on claude/sup-lib4-cards @ 9cf84d4c). Freed slots go, per amendment 21: a D-LIB2b-ORDER chain card or LIB-4c first, then LIB-5 (Do 2 on), then the LIB-7 fixer, LIB-6-PM and LIB-9a's second drawer, then LIB-3b, LIB-4d and LIB-8-FIX. Each of those last three moves ahead of the existing items only when its deadline is next in the merge queue; for LIB-8-FIX that is before pilot A's plan-slot-7 merge. If a park is needed, LIB-3b, LIB-4d and LIB-8-FIX park before LIB-9a and LIB-5. This card holds a LIB lane slot from its start until READY. Start only on the supervisor's 'LIB-8-FIX start', sent as a comment on #109 and as a message to your session; it states the active count. A merge, a CI result, a PR event or your own timer never starts or resumes you. After READY (Do 9) you are WAITING: no new work, no push and no slot until the supervisor sends 'LIB-8-FIX resume'. If the supervisor says park, stop at your next local commit, push nothing and wait for 'LIB-8-FIX resume'.
2. The drawings must not change. The plates page stays f9f87b82da0aea546bbc6f022f8ed680b5149930403c13f2ba3668bbcfc958d7, 1,715,569 B, byte for byte. If any pinned page byte moves, or any plate's flag set changes, stop and report. Never change a spec value, a pose, a bracket's values, plates.json, a card, or the flag envelope to get the bytes back.
3. Gap 6 is stopped (measured at card time, see FX7). Write nothing to pilot-a/build.mjs unless the start message, or a later supervisor PR comment, carries ruling D-LIB8FIX-ENV. Then do only what it says.
4. Out of scope (the LIB-8 merge card): the tests/howto/golden/library/pilot-a.json chain, pilot A batch rows, tools/plates/library/MANIFEST.json, tools/plates/golden.mjs verifyChain (gap 2 needs a supervisor ruling first), and the H6 re-check (gap 4). Touch none of them.

CI manners: GATE-SPLIT's train has merged, so only this applies: at most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci]. Gather local commits into the allowed pushes. Never cancel, re-run or dispatch another card's run.

base: claude/lib-8-pilot-a @ e6f39ffb, then merge origin/main with a merge commit as your first commit (main is b99a9e25 now: train 25 #252 merged LIB-4a #233 @ 0b2d3c18 and #251; its tree equals 1215b47c's; the merge is clean, merge-tree 38a108b5).
- Merge origin/main again before READY.
- Merge commits only.

depends_on: the pilot A code review 6243689943 @ e6f39ff and its routing 6243704774 (#109).

build_prerequisites:
- The 'LIB-8-FIX start' message (Stops 1).
- Ruling D-LIB8FIX-CARRY in that message. Proposed text: "#109's head is unfrozen for this card only. The 16 approvals at e6f39ff (D-PILOTA-R5) count on a later #109 head only when FX8 has run on that exact head and holds there: two builds each give the plates page f9f87b82da0aea546bbc6f022f8ed680b5149930403c13f2ba3668bbcfc958d7, 1,715,569 B, firstDiff -1 against blob d774614a; 17/17 report ok; every plate's flag ids equal Do 2's. This applies to each head this card pushes: the fix heads, the READY head and every main merge after a 'LIB-8-FIX resume'. Each needs its own FX8 run. A head without one carries no approval." Without it, do nothing.
- Gap 6 (FX7) only: ruling D-LIB8FIX-ENV (Stops 3).

merge_prerequisites: this card merges nothing. It lands fix commits on #109. #109 itself merges later under the LIB-8 merge card, in plan slot 7 (after LIB-4a/b/c, LIB-5, LIB-6 and LIB-7; D-LIB5-ORDER). Before that merge card starts:
- a fresh Opus review PASS against this card, on the fix delta (e6f39ff..head);
- every check green on a head that contains the latest main;
- LIB-4d on main (D-LIB4a-SCALE (c), section 13 amendments 20 and 21): pilot A's batch rows hold lib_barbell_row, which lb-test.json also uses.
- D-LIB8FIX-ENV recorded on #109 (gap 6 closed), with any build.mjs change it names inside the reviewed fix delta. If it arrives after READY, it comes with 'LIB-8-FIX resume', the change is pushed under CI manners, FX8 and FX9 re-run on that head, and the fresh review covers it.

hard card: no. No design note. The test designs below are spelled out; anything not spelled out goes to the supervisor as a question on #109.

design_reference:
- Review 6243689943 (findings 1-5, merge-gate gaps 3 and 6, the LB1 section) and routing 6243704774.
- lib4-cards.md section 12 item 2 (D-LIB-LANE-ACTIVE) and section 13 amendment 21 (the freed-slot queue), section 13.2 (D-LIB9-CLONE: copy not import, checked solver, fresh brackets) and section 13 amendment 20 (D-LIB4a-SCALE: LIB-4d owns the generated-file reader and the HT2-A2 timing at scale).
- Plan 3.5 ("Fixtures are derived, not committed").
- HANDOVER: D-PILOTA-R5 (an approval counts only for the commit it ran on).

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md.
- The review and routing comments above; #109's body.
- At e6f39ff: tools/plates/library/specs/dumbbell_bench_press.mjs (:56 bisect, :59-67 supine), specs/incline_dumbbell_press.mjs (:61 bisect, :65-82 reclined), specs/barbell_overhead_press.mjs (:64 H, :155, :198 ARM_Y), eq/inclineBench.mjs, eq/pecDeck.mjs, eq/safetyArms.mjs, eq/parts.mjs, test/build-page.test.mjs, test/ohp-mistake.test.mjs, pilot-a/build.mjs (:25-27 ENVELOPE, :33-45 flagsOf, :102 page order), report.mjs (:21-26 measures).
- On main: tools/plates/generate.mjs (:20 GENERATED_DIRS, :67-68 generatedOnDisk reads every file on disk), tests/howto/generate.test.ts (:93-102, HT2-A2 "plates.mjs writes exactly the 8 modules…"), tests/howto/library-core.test.ts (L2-A2 "golden A e2bea90c…": the length, sha and reversed-list lines, main :457-460), tests/howto/poly.test.ts (the rope composer tests, the pattern to follow), tools/plates/library/qa/envelope.json, qa/node.mjs (:285-290), qa/browser.mjs (:49-53, :167), vite.config.ts:26.

write_scope:
- New: tools/plates/library/pilot-a/.gitignore, one line: `out/`.
- tools/plates/library/pilot-a/out/** (61 files, 12,521,143 B, out/.gitignore included): removed from the index only, with `git rm -r --cached`. The files stay on disk.
- specs/dumbbell_bench_press.mjs: the bisect line (:56) only.
- specs/incline_dumbbell_press.mjs: the bisect line (:61) only.
- specs/barbell_overhead_press.mjs: one added line, `export { H, ARM_Y };`, and the test path in the :155 comment.
- tools/plates/library/test/build-page.test.mjs and test/ohp-mistake.test.mjs: deleted in the same commit as their vitest port (FX6).
- New: tests/howto/lib8-composers.test.ts and tests/howto/lib8-pilot-a.test.ts.
- #109's body (HANDOFF, evidence, mutation list) and its title (Do 9's retitle only).
- Only under D-LIB8FIX-ENV: what that ruling names in pilot-a/build.mjs.

reserved_paths:
- tools/plates/library/eq/** (tested here, never edited; mutations are temporary and never committed).
- Every other spec file, pilot-a/plates.json, pilot-a/cards/**, pilot-a/evidence/**, report.mjs, engine.mjs.
- tools/plates/library/build-page.mjs. It is byte-identical to main. Its :6 comment cites test/build-page.test.mjs, which main never had; leave it as on main and list it in the PR for the merge card.
- tools/plates/generate.mjs, tests/howto/generate.test.ts, tests/howto/library-core.test.ts, vite.config.ts (LIB-4d owns the reader and the timing; D-LIB4a-SCALE (c)).
- tools/plates/golden.mjs, tests/howto/golden/**, tests/howto/fixtures/batches/**, tools/plates/library/batches/**, tools/plates/library/MANIFEST.json (merge card).
- tools/plates/library/qa/** (envelope.json included).
- The root .gitignore. It is not needed: git reads the folder's own .gitignore. It has no owner in the AGENTS.md table; the supervisor last changed it (50a70dc1).
- tools/plates/library/test/** files of other cards (LIB-6 #181, LIB-12 #191 and LIB-7 #193 add layers-page.test.mjs and a fixture there).
- .github/**, package.json, package-lock.json, scripts/**, tests/theme.test.ts, src/**, docs/**.

outcome: pilot A's code passes its review, with the drawings unchanged:
- no derived file is tracked under pilot-a/out/, and the folder is ignored;
- the three composers have vitest tests that catch the review's six defects;
- supine() and reclined() throw when a bracket holds no rising root (stricter than barbell_row's solve(), Do 5);
- pilot A's two node tests run in CI as vitest, reading H and ARM_Y from the spec;
- the hard-coded ENVELOPE stays as it is until the supervisor rules (gap 6 is stopped).

deliverable: fix commits on #109, plus the PR body evidence. No new PR.
evidence: FX1-FX9 below.
finish: a fresh Opus review PASS on the fix delta, on a head that contains the latest main, with every check green. You will notice: nothing visible. No plate, page byte or app screen changes.

Do:
1. On 'LIB-8-FIX start': read your card, #109, its CI and the review. Check that the branch head is e6f39ffb; if not, stop and report. Subscribe to #109's activity.
2. Baseline on e6f39ff (before any edit), recorded in the PR:
   - build the plates page twice into a scratch folder outside the repo: `build({ out: <scratch> })` from pilot-a/build.mjs, with MARC_CHROMIUM=/opt/pw-browsers/chromium. Expect f9f87b82…c958d7, 1,715,569 B, 17/17 ok, both runs. Never run the CLI (`node pilot-a/build.mjs`): it writes pilot-a/out/ inside the repo.
   - record supine(0.43, 0) and the spec's own reclined({ back: 45, seatTilt: 12, seatTop: 0.45, trunk: 0 }) results (full numbers);
   - record each plate's flag ids from the build summary.
3. Merge origin/main (merge commit). On that merge, with out/ still on disk, run `npx vitest run tests/howto/generate.test.ts` and record HT2-A2's result and duration (the before run). With out/ on disk it runs at or past its 5,000 ms limit (card checks: 4,565-4,925 ms green, 6,164 ms red; 342-488 ms with out/ moved aside). Either result is expected and is not a stop.
4. Finding 1: add pilot-a/.gitignore (`out/`); `git rm -r --cached tools/plates/library/pilot-a/out`. Add the FX1 guard test. Then, on a clean checkout of your head (a fresh worktree with no out/ on disk), run generate.test.ts and record HT2-A2 green and its duration (the after run).
5. Finding 3: in both bisect lines add a bracket check that throws `<spec id>: no solution in [lo, hi]` unless f(lo) <= 0 <= f(hi): `if (!(f(lo) <= 0 && f(hi) >= 0)) throw new Error(...)`. This is stricter than barbell_row.mjs:68's same-sign check, because this bisect only moves hi when f(m) > 0, so it needs f rising; it also refuses a reversed bracket and NaN, which the same-sign check lets through. Every current call has f(lo) < 0 < f(hi) (card check, all 21 specs imported), so no value moves. Nothing else in those files changes. reclined() is in scope because it has the same defect, is exported the same way, and dumbbell_shoulder_press.mjs:38 imports it. Add the FX3 tests. Rebuild twice (FX8).
6. Finding 5 and gap 3 (with finding 4): add `export { H, ARM_Y };` to barbell_overhead_press.mjs. Port the two node test files to tests/howto/lib8-pilot-a.test.ts as FX6 says, and delete the node files in the same commit. Update the :155 comment path.
7. Finding 2: write tests/howto/lib8-composers.test.ts (FX2). Run the review's six mutations one at a time and record each red run; restore each.
8. Gap 6: re-run the FX7 flag comparison on your head (a scratch script, never committed) and post the table on #109 with the words "gap 6 stopped". Wait for D-LIB8FIX-ENV before any build.mjs change. Do 9 does not wait for it.
9. Before READY: merge origin/main. Then, in a fresh worktree of that exact head (git worktree add, node_modules linked, no tools/plates/library/pilot-a/out/ on disk), run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, and run the FX8 build twice into a scratch folder outside the repo. Re-read your diff against write_scope and reserved_paths: run `git merge-tree --write-tree origin/main e6f39ff`; if it exits non-zero or prints more than one line (a conflict), stop and report. Then `git diff --stat <that tree> HEAD`. That compares the clean merge of e6f39ff with the main you just merged against your head, so it shows exactly the fix delta (`origin/main...HEAD` would list all of pilot A against main and miss the out/ and node-test removals). It must list only write_scope paths: the 61 out/ removals, the new pilot-a/.gitignore, the three spec edits, the two node-test deletions and the two new vitest files, plus build.mjs only under D-LIB8FIX-ENV. Fill the PR body and the HANDOFF block, then retitle it 'LIB-8: pilot A (19 pattern plates) [ready for review: LIB-8-FIX delta; merges in plan slot 7]', keep it a draft, and ask the supervisor for the review.

Acceptance (each with mutations that must turn red; list them in the PR):
- FX1 (finding 1) out/ is not tracked and is ignored. lib8-pilot-a.test.ts: `git ls-files -- tools/plates/library/pilot-a/out` prints nothing, and `git check-ignore -q <path>` succeeds, run from the repo root once for each of tools/plates/library/pilot-a/out/pilot-a-plates.html and tools/plates/library/pilot-a/out/shots/x.png (-q takes one path per call: with two it exits 128; check-ignore matches paths that are not on disk, as in a CI checkout). It fails before (61 tracked files) and passes after. HT2-A2 is green on the merge with main, on a clean checkout, with its duration next to the before run.
  Mutations: one out/ file re-added with `git add -f` turns the guard red; the `out/` line removed from the folder's .gitignore turns it red.
- FX2 (finding 2) Composer tests in tests/howto/lib8-composers.test.ts, importing tools/plates/library/eq/*.mjs directly (as poly.test.ts does for rope.mjs), with PRIMITIVES from tools/plates/library/engine.mjs:
  - each composer: every item's type is a PRIMITIVES key and PRIMITIVES[type](item, cam) draws at least one path with no NaN (side cam for inclineBench and safetyArms, front cam for pecDeck); the item count is exact (inclineBench 7; pecDeck PEC_DECK_ITEMS 10, +2 with uprights, -2 with direct; safetyArms 4, 5 with hookY); two calls give deep-equal output;
  - inclineBench: each pad's centre line sits pad/2 inside its face at the hinge (seat along the seat normal, back along the back normal; the sign is checked, not only the size); the seat post runs from the seat pad's underside down to the floor beam's height;
  - pecDeck: per side, the boss is at the pivot, the level arm runs from the pivot to a corner at the pivot's height, the drop starts at that corner, and the handle ends at the grip;
  - safetyArms: the arm's top is at armY; with hookY the hook sits on the front upright's rear face and every point is at or behind it (toward -z); hookY: null gives output deep-equal to no hookY.
  Mutations (the review's six, each red): inclineBench `mul(n, -d)` → `mul(n, d)`; inclineBench seat post deleted; pecDeck `corner = [p[0], g[1], g[2]]`; pecDeck pivot bosses deleted; safetyArms arm top raised 7.5 cm above armY; safetyArms hook `s = 1`. Also: one item type misspelled turns the PRIMITIVES check red.
- FX3 (finding 3) Checked solvers, in lib8-pilot-a.test.ts:
  - supine(0.43, 0, { lift: 0.3 }) and supine(0.43, 0, { tilt: -60 }) throw /no solution in \[-40, 30\]/ (at e6f39ff they return trunk -40.0000, a bracket end);
  - reclined({ back: 120, seatTop: 0.45 }) throws /no solution in \[-100, 20\]/ (at e6f39ff it returns tilt -100.0000, neck -40.0000);
  - supine(0.43, 0, { tilt: 90 }) throws /no solution in \[-40, 30\]/ (a reversed bracket: f(-40) = +0.119, f(30) = -0.135; at e6f39ff it returns trunk -40, and a same-sign check lets it through and throws later, naming the neck bracket [-40, 60]);
  - supine(0.43, 0) and the spec's reclined() call return exactly the values recorded in Do 2;
  - the 21 spec files named by pilot-a/plates.json (its 19 ids, held plates included, plus the 2 extras[].spec alternates) still import. The list comes from plates.json, never from a listing of specs/ (LIB-9a #245 adds 13 specs there at 42576484, 11 at e035bdf3, and the OHP_SPEC temp copies sit beside the spec). The imports take 1.3-2.1 s (card checks); no timeout is set.
  Mutations: the check removed from either bisect turns its throw test red; the check replaced by barbell_row's same-sign check turns the tilt 90 test red; a bracket moved past the root (supine's trunk bracket [-40, -10], root -3.555) throws (D-LIB9-CLONE (b)).
- FX4 (finding 4) No `node --test` run line is left for pilot A's files. The two files move to vitest (FX6), so `node --test tools/plates/library/test/` no longer names them. Each new vitest file's header gives its run line (`npx vitest run tests/howto/<file>`).
- FX5 (finding 5) The ported OHP tests read H and ARM_Y from the spec module they test: `const mod = await import(SPEC)`; `mod.H`, `mod.ARM_Y`, `mod.default`, with the OHP_SPEC override kept. The test holds no 1.75 or 0.08 literal. Record once in the PR, from a scratch probe and not in the test, that mod.ARM_Y === lmStart.grips[1] - 0.08 (both 1.3771049801680069 at e6f39ff). The Mistake elbow sits 16.1 cm above ARM_Y, 11.1 cm more than the test's 5 cm margin.
  Mutation: in an OHP_SPEC temp copy (beside the spec, never committed), ARM_Y = BAR0[1] + 0.05 turns the ported test red. The e6f39ff node test stays green on the same copy (the drift the finding names).
- FX6 (gap 3) Both node test files run in CI as vitest, each assertion mapped in the PR:
  - build-page.test.mjs test 1 (golden A rebuild, length and sha) and test 2 (a reversed list changes the sha) are already on main in library-core.test.ts L2-A2 "golden A e2bea90c…". They map to its length, sha and swapped lines (main's library-core.test.ts:457-460). LIB-4a (on main since b99a9e25) changed only that test's registry-ids line; the mapped length, sha and swapped lines are unchanged. They are not copied, so no test runs twice. Test 1's `firstDiff === -1` assertion is implied, not dropped: L2-A2 (main library-core.test.ts:457-458) pins the rebuilt page's length and sha256 to PINS (e2bea90c…, 860,766 B), and golden.test.ts:55-58 pins the committed FIXTURE to the same values (:55 sha256 e2bea90c…, :56 860,766 B, :58 `expect(g.PINS).toMatchObject({ pageSha256: g.sha256(fixture), pageBytes: 860766 })`). Same length and sha256 means the same bytes. firstDiff only named the first differing byte on failure.
  - test 3 (a vendored builder of another shape is refused) → lib8-pilot-a.test.ts, the same two cases. Each one asserts that the message names its anchor (stricter, not looser): /"const GROUPS = \[" must occur exactly once/ and /"<h1>Option 2 · Technical Plate<\/h1>" must occur exactly once/;
  - ohp-mistake.test.mjs's two tests → lib8-pilot-a.test.ts, the same assertions (FX5);
  - the two node files are deleted in the same commit; `npm test` lists the new tests.
  No new test sets a timeout: tests 1-2 keep L2-A2's existing one, and the ported tests take under 5 ms each.
  Mutations: the OHP Mistake shoulder moved 1 cm (OHP_SPEC copy: `const mistakePose = { ...endBody, scap: { elev: SCAP_TOP + 1 }, reach: {`; shoulder offset 1.00 cm, measured) turns test 1 of the OHP pair red; between()'s check (build-page.mjs:31) removed (temp, never committed) turns test 3's GROUPS case red, because the message becomes `build-page: "" must occur exactly once`; once()'s check (:38) removed (temp) turns its h1 case red (no throw). build-page.mjs stays byte-identical to main.
- FX7 (gap 6) STOPPED at card time. What qa/envelope.json holds on main does not keep the flags' meaning:
  - F2: pilot A's coverage is the share of occupied grid cells (report.mjs:23-26). LIB-3's F2 is the figure's box area (qa/browser.mjs:49-53), pinned at [0.191, 0.549]. These are different measures.
  - F3: pilot A takes the longest leader in the normal render. LIB-3 takes leaderMax over the normal and Mistake renders (node.mjs:103), pinned at [49.33, 82.26]. LIB-3 also checks both ends; pilot A's text says "approved up to".
  - F4: the same count, but LIB-3 checks both ends ([2, 6]).
  - F1: the same measure and range.
  Read as LIB-3 reads them, the flags change on 16 of 17 plates. Flags also set the page order (build.mjs:102, flagged first within a tier), so the pinned page bytes would move (Stops 2). Even reading only F1 and the upper ends changes F2 on 4 plates, because F2 is another measure.
  Evidence: the table posted in Do 8, re-run on your head.
  Recommendation for D-LIB8FIX-ENV: keep ENVELOPE's values. They set only the sheet's flag lines and the page order, and never stand in for LIB-3's flags. Plan 3.3 ("A flagged plate cannot merge without the owner's yes") is met only by the merge card's gap 4 run: LIB-3's own qa with qa/envelope.json (plan 3.5, last bullet). Every plate that run flags needs the owner's named exemption before the merge. In pilot-a/build.mjs, replace only the :26 sentence "Re-measured by LIB-3 once it merges (plan 3.5, last bullet)." with "Kept for this sheet and page order only (D-LIB8FIX-ENV): F2 and F3 here are other measures than LIB-3's; LIB-3's qa flags (qa/envelope.json) gate the merge." A comment changes no page byte; FX8 is re-run after it.
- FX8 (Stops 2) Drawings unchanged on the fix head and on the READY head: two builds give f9f87b82…c958d7 and 1,715,569 B, with firstDiff -1 against `git show e6f39ff:tools/plates/library/pilot-a/out/pilot-a-plates.html` (blob d774614a); 17/17 report ok; every plate's flag ids equal Do 2's. (Probe at card time: with both checked bisects, the build gave this exact sha and 17/17 ok.)
- FX9 On the READY head (latest main merged in): `npm run check`, `npm run test:tz` (both zones) and the gate are green. The diff against e6f39ff touches only write_scope paths, apart from the main merges.
  Nothing is loosened: no assertion, tolerance, timeout, bracket value or envelope changes. No test is cut. Each deleted node test has its mapped vitest twin.

verification: the PR body maps FX1-FX9 to a test or run, with commands and outputs, and lists every mutation with its red line. It also lists the reserved items (the build-page.mjs:6 comment; the HT2-A2 local-disk note) for the merge card. Evidence counts only for the exact head it ran on.

risk_and_recovery:
- An out/ folder on local disk still slows HT2-A2, ignored or not: generatedOnDisk reads every file on disk under tools/plates/library, not the git index. CI is unaffected (a fresh checkout has no out/). So build only into a scratch folder (Do 2), and take test evidence on a clean worktree. Never edit generate.mjs or generate.test.ts; LIB-4d owns the reader (D-LIB4a-SCALE (c)). List the local-disk effect in the PR for LIB-4d.
- The checked solver throws in a pilot A spec, or a page byte moves: stop and report (Stops 2). Never widen a bracket or change a value.
- Spec bytes change (dumbbell_bench_press, incline_dumbbell_press, barbell_overhead_press), so six specs' inputs closures move: those three, plus dumbbell_shoulder_press (imports reclined, :38), dumbbell_fly (imports supine, :51) and dumbbell_fly__alt (imports dumbbell_fly, :4). List all six in the PR for the merge card's gap 1 pin. No pin exists yet (gap 1 is the merge card's). LIB-9a copies and never imports (D-LIB9-CLONE (a)); #245 @ 42576484 imports no pilot A spec (its 13 specs and 5 new eq files import only ../engine.mjs, eq/ files, ./polybar.mjs and ./parts.mjs). Re-check that on #245's head before READY. If an import appears, report it.
- The 13 MB of out/ blobs stay in past history. Untracking only stops future growth. Never rewrite history.
- The owner's review sheet leaves the repo with out/. Builders never write to the owner. If a private page of the sheet is wanted, the supervisor decides and publishes it.
- Another unchecked bisection exists in specs with fixed inputs only (dumbbell_shoulder_press `bis` :115, box_jump :88, triceps_pushdown :64/:82, rope_triceps_pushdown :69, upright_row :69). They are not exported, and their outputs sit inside the pinned page bytes. List them in the PR for the merge card. Do not change them here.
- A main merge conflicts, or a later main changes a mapped L2-A2 line: stop and report. Never edit library-core.test.ts.
- Two failed tries of one approach: stop and report.
- CI load: pushes follow CI manners. A supervisor request is the only extra push.

return:
- PR #109 head sha, and the merge commits' shas;
- HT2-A2 before and after durations, and the FX1 guard's red runs;
- the six composer mutation red lines, plus the type-misspelling one;
- the FX3 throw messages, and the Do 2 values matched;
- FX8: two page shas and byte counts, firstDiff, 17/17, and the flag table;
- FX6's assertion map;
- the gap 6 table comment id and the D-LIB8FIX-ENV state;
- check, test:tz and gate output on the final head.

Collision check (card time, every open PR head against main's merge base; exact files):
| Path in write_scope | Open PRs that touch it | Effect |
| pilot-a/.gitignore (new), pilot-a/out/** | #190 (do-not-merge spike, branched from pilot A) | none: #190 never merges |
| specs/dumbbell_bench_press.mjs, specs/incline_dumbbell_press.mjs, specs/barbell_overhead_press.mjs | #190 only | none; #245 (LIB-9a) @ 42576484 adds 13 specs to the same folder and imports none of these, so the FX3 import list is read from plates.json |
| tools/plates/library/test/build-page.test.mjs, ohp-mistake.test.mjs (deleted) | #190 only | none; #181, #191 and #193 add other files in the same folder (layers-page.test.mjs, fixtures/options-without-pull-up-leg-press.mjs), so there is no file overlap |
| tests/howto/lib8-composers.test.ts, lib8-pilot-a.test.ts (new) | none | none |
| read-only refs: library-core.test.ts L2-A2 | #246 (LIB-4c) @ 0e703495 only (#233/#252 merged; #232 @ 575fa75b does not touch it) | inside L2-A2 it changes only the registry-ids line, to main's text; the mapped lines (main :457-460: length, sha, swapped) are unchanged |
| read-only refs: eq/inclineBench, pecDeck, safetyArms | #190 only | none; #245 adds other eq/ files |
| reserved: generate.mjs, generate.test.ts, vite.config.ts, qa/envelope.json, root .gitignore | none | none |
Merge-tree at card time: e6f39ff with main b99a9e25 is clean (38a108b5); e6f39ff with each of #244, #245, #246, #232, #181, #191, #193 and #249 is clean.

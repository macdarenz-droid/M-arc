Card LIB-4c: library CI (2026-10-17, final). Where this text and lib4-cards section 5 differ, this text wins: header, Do, acceptance and risk. Where the plan (claude/howto-options @ 4a9fd86) differs, these win: lib4-cards section 1, its 11.1 items, and section 12's D-LIB-CIMANNERS, D-LIB-LANE-ACTIVE, D-LIB4c-1 and D-LIB-SCRATCHIDS. Their LIB-4c text is repeated under 'Rulings in force'. The supervisor amends the plan to match before your READY (D-LIB4-DOCS-2); that changes no rule here.

id: LIB-4c
model: claude-opus-5-5
mode: auto
title: 'Builder: LIB-4c library CI'
branch: claude/lib-4c-library-ci (new). Open draft PR 'LIB-4c: library CI' with your first push. CI manners say when that is.

base: origin/claude/lib-4b-runner @ 379cdf4ca304f4868565ab2ec24d816440f0c3f5. This was LIB-4b's newest head at 18:00 UTC. It carries B5's fixture under D-LIB4b-F5 and COPY_EDITS, which you read.
- At start, run `git ls-remote origin refs/heads/claude/lib-4b-runner`. If it has moved, base on the newest head and give its sha in the check-in.
- 379cdf4 holds main 49a2853, LIB-2b 5af33b4, LIB-4a cbc7698 and GATE-SPLIT through e9f46f2.
- These files are byte-identical to #194's head 06ce286: scripts/ci-verdict.mjs, scripts/gate-split.mjs, scripts/gate-times.mjs, scripts/gate-compare.mjs, scripts/gate-blocks.mjs, tools/plates/fidelity/shard.mjs, tests/ci-verdict.test.ts and .github/**.
- Two known differences:
  - scripts/gate-times.json lacks 06ce286's measured OLD-ANDROID-1 entry;
  - tests/gate-split.test.ts pins E1 at 102 (LIB-4a's +1).
  Both reconcile through the main merge after the GATE-SPLIT train. Never edit either file, except to resolve a merge conflict in it:
  - keep both sides exactly (AGENTS add-only rule);
  - run `npx vitest run tests/gate-split.test.ts`;
  - report the resolution on the PR.
  Never change an entry or a pin. If both sides cannot be kept as they are (two values for one entry or one pin), stop and report.
  - One conflict is known in advance and pre-ruled: the E1 pin in tests/gate-split.test.ts (main after the GATE-SPLIT train: 101; your base: 102, which also counts LIB-4a's block). Resolve it to the number `node scripts/gate-blocks.mjs --count` prints on the merged tree, keep the comment that names every added block, and run `npx vitest run tests/gate-split.test.ts` (an exact toBe proves it). Any other pin or entry conflict: stop and report.

Merging in:
- Use merge commits only. Never rebase, amend or force. Run `git pull --no-rebase` before every push. If the branch moves without your push, stop and report.
- Merge, in this order:
  1. LIB-2b's final passed head. This is the sha in the last 'REVIEW LIB-2b delta ... PASS' on #234. It will be later than ccf0250, because the HANDCSS fix is in progress. Once LIB-2b is on main, merge origin/main instead.
  2. LIB-4a's head that carries the D-LIB2b-ORDER write-ids fix (#233, after 66f5cef).
  3. LIB-4b's newer heads at milestones, then its READY head, then its final head.
  4. origin/main after every train. The first is the GATE-SPLIT train (#194 + #219, est. ~22:00 UTC).
- Known inherited red: source-gate fails only tests/howto/lib-4a.test.ts A1/A2 ('shipped, but its batch file has no pages'). That is 1 of 219 test files. Seen on 379cdf4 (job 117457903455) and 624d7e8 (job 117449657758).
  - LIB-4a owns it (11.1 item 15). Never touch tools/plates/library/scale/write-ids.mjs or lib-4a.test.ts.
  - Report any other red.

depends_on: LIB-2, LIB-3, HT-10, GATE-SPLIT (#194 + #219), LIB-2b, LIB-4a, LIB-4b

build_prerequisites: none for Do 0-9. Three hold points:
- H1: the final C4 class-3 evidence and the final C9 evidence run on a head that holds LIB-2b's final passed head.
- H2: nothing touches scripts/ci-verdict.mjs until #194 is on main, on your branch or on a scratch tree.
- H3: C11-C14 run only after all of these:
  - H1 and H2;
  - the supervisor has pushed claude/sup-lib4-ci;
  - LIB-4b has posted B5, B7 (adopted P, D-LIB4-PAR) and B8 (LIB_ONCE seconds) on #232.

merge_prerequisites:
- #194, #219, LIB-2b, LIB-4a and LIB-4b merged, in that order (D-LIB2b-ORDER).
- A fresh Opus review PASS.
- Green on a head that contains the latest main.
- One train together with claude/sup-lib4-ci, after the wiring branch re-merges this card's final head.
- Checklist slot 3c.
- C13 and C14 ran on the final runner and scripts. Re-run them if review changes either.
- The supervisor's add-only agent-guard line is on main. Under plan 3.5, it requires '[golden update]' on non-merge commits that touch tools/plates/library/MANIFEST.json.

shared-file owners:
- scripts/ci-verdict.mjs: GATE-SPLIT's. You touch the CLI block only (:123-137 @ 06ce286, D-GATESPLIT-ONE).
- .github/** and docs/supervisor/**: the supervisor's.
- docs/howto/library/LIB-4-DESIGN.md: LIB-4b's. You add one CI section.
- tools/plates/generate.mjs and tools/plates/lib/**: the HT-2 core. It is frozen; its header says 'a change to it is its own PR'.
  - Never edit it here. coreFiles() (lib/inputs.mjs:15) feeds generate.mjs's bytes into every generated file's inputsSha256 (:31).
  - So one changed byte rewrites every generated header. That collides with LIB-2b, LIB-5 and the passed heads #181, #193, #191 and #109.
- docs/COACHING-DECISIONS.md: append only.
- You touch none of AGENTS.md's add-only shared files (scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css). You add no gate block, so there is no gate-times entry and no E1 count change.

CI manners (D-LIB-CIMANNERS, section 12 item 1, verbatim; it replaces every older push rule here):
CI manners while GATE-SPLIT's E8 proof runs: push nothing until the supervisor sends you 'E8 done' (by a message to your session, and as a comment on your PR if it exists). After 'E8 done' and until the GATE-SPLIT train has merged, before each push check that no M/ARC gate run is in progress on claude/sup-gate-split-ci, claude/gate-split, claude/sup-gate-split-e6, claude/sup-gate-split-e9 or claude/sup-merge-train-* (curl the Actions API); if one is, wait. Then at most one push per 2 hours until READY unless the supervisor asks for one. Never use [skip ci].

Applying it here:
- The check, run right before each push until the supervisor tells you the GATE-SPLIT train has merged (section 12 item 1). It must print nothing. A branch name means wait, and so does API-ERROR (rate limit or no answer). A queued run counts as in progress. Re-check at most every 10 minutes:
  `for s in queued in_progress; do curl -sS "https://api.github.com/repos/macdarenz-droid/M-arc/actions/workflows/build-apk.yml/runs?status=$s&per_page=100" | jq -rs 'if (.[0].workflow_runs|type)=="array" then .[0].workflow_runs[].head_branch else "API-ERROR" end'; done | grep -E '^(API-ERROR|claude/(gate-split|sup-gate-split-(ci|e6|e9)|sup-merge-train-.+))$'`
- These rules win over the builder skill's 'push after every finished task' and 'push before you pause'.
- Until 'E8 done', commit locally and keep your HANDOFF text in your session. Open the draft PR with your first allowed push, then subscribe to its activity.
- Dispatches follow Do 10's rules.
- Never write to the owner.

Lane (D-LIB-LANE-ACTIVE): you hold an active slot from your start; local work before 'E8 done' is active work. You are WAITING only when you have no permitted work in hand (for example, Do 0-9 done and H1-H3 not met). Then post 'WAITING LIB-4c: <what you wait for>' on the PR (before it exists, to the supervisor by send_message, or without that tool as a block in your session) and stop. Resume only on the supervisor's exact words 'LIB-4c resume' (sent to your session or posted on your PR), never on a PR event, a prerequisite post or your own timer.

hard card: the Do 0 check-in.
- Before the PR exists, send it to the supervisor session (session_01SNCyDETVkqVxtLoQxn2Ue9) with send_message. If you do not have that tool, write it in your session as a block headed 'CHECK-IN LIB-4c' and carry on; the supervisor reads it there.
- Post it unchanged as the PR's first comment when the PR opens.
- Keep building Do 1-8 while the supervisor reads it.

outcome: every push proves the shipped library ids exactly once:
- all ids on main, on claude/sup-merge-train-N heads and on workflow_dispatch;
- the affected ids on every other push;
- gate-verdict is red on any gap.

deliverable: the scripts, L0-lib, the tests and the scratch-branch CI evidence (C11-C14). This is the implementation phase. Release-candidate acceptance is LIB-23.
evidence: the acceptance rows, each mapped in the PR body to a test or a CI run id.
finish:
- merged in one train with the wiring;
- the first main run is green and prints 'library: full (0 of 0)'.
You will notice: nothing visible.

Rulings in force (LIB-4c text, lib4-cards section 12 on claude/sup-lib4-cards):
- D-LIB-CIMANNERS (item 1): the CI manners text above, verbatim.
- D-LIB-LANE-ACTIVE (item 2): see 'Lane' above. LIB-4c never parks.
- D-LIB4c-1 (a), scratch inputs. D-LIB4-FIXTURE-3 (11.1 item 3), D-LIB4b-F5 (item 17) and D-LIB4b-COPYEDITS (item 19) extend to your scratch ids on claude/lib-4c-scratch, with the same limits: marked scratch, never pinned on main, never shipped. Do 10 and C16 give the details.
- D-LIB4c-1 (b), L0-lib, as widened: see Do 8b and C0.
- D-LIB4c-1 (c) is withdrawn. generate.mjs is not edited; class 3 is built inside ci/affected.mjs (Do 3).
- D-LIB4c-1 (d): class 1 adds the research card named by an id's How-to research.card, and that card's quotes file. Every other docs/research/howto/** path is class 4, ahead of class 5's docs/**.
- D-LIB-SCRATCHIDS: scratch fixtures never target an LB1 or LB2 id. The library id is 'lib_' plus the name. The lists are from docs/howto/library/arch/batchlines.md @ 4a9fd86:
  - LB1: chin_up, hanging_knee_raise, assisted_pull_up, inverted_row, close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown, straight_arm_pulldown, chest_supported_row, resistance_band_row, incline_machine_press, shoulder_press, horizontal_leg_press, leg_press_calf_raise.
  - LB2: dumbbell_bench_press, barbell_bench_press, incline_dumbbell_press, incline_barbell_bench_press, decline_bench_press, close_grip_bench_press, dumbbell_shoulder_press, barbell_overhead_press, arnold_press, dumbbell_fly, skull_crusher, dumbbell_pullover.

design_reference:
- Plan 3.5, 3.6 and 5.4 (claude/howto-options @ 4a9fd86), as amended by lib4-cards section 1: D-LIB4-SHARD, -MODE, -VERDICT, -ENTRY, -PAR, -QUEUE, -FIXTURE, -FIXTURE-2 and -SCOPE.
- lib4-cards 11.1 items:
  - 3, 5 and 7;
  - 8: LIB_ONCE.run has 4 rows;
  - 9: class 1 includes <batch>.layers.html, and C9 asserts committed == rebuilt == pin;
  - 13: X9c, the 1,800 s verdict;
  - 14, 15, 16 (f), 17 and 19.
- D-LIB2b-PAGES (4): L1 rebuilds layers pages through layersSpecOf and LIB-6's build-layers-page.mjs.
- The rulings above.

connectivity: none in the app. No stored or sent user data, no new service and no new dependency. In CI, the only network step is `git fetch --depth=1 origin main` inside howto-rebuild.mjs; gate-verdict fetches nothing (Do 4, Do 6).

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- docs/supervisor/verify/lib4-cards.md on claude/sup-lib4-cards @ eb77d98: sections 1, 2, 5, 6, 7, 8, 11.1 (items 1-19) and 11.3; and section 12 items 1, 2, 5, 6 and 11 once posted (use the newest sha).
- Plan 3.5-3.6 (:332-400) and 5.4 (:550-601).
- GATE-SPLIT design 2.2, 3.5 and 4.1-4.3 (docs/qa/GATE-SPLIT-DESIGN.md on #194; E6, E8).
- On 06ce286:
  - shard.mjs: htTuples, coverProblems, writeProof, jobFromEnv, packShards;
  - ci-verdict.mjs :14-35 (REQUIRED_NEEDS at :20) and :105-137 (collect, the CLI);
  - gate-split.mjs (wwwHash, planHash);
  - gate-times.mjs (refreshTimes);
  - gate-compare.mjs (compareRuns, the pattern for compare.mjs).
- .github/workflows/build-apk.yml on #219 @ 82d896d:
  - :3-19: push on '**' and workflow_dispatch; concurrency group marc-gate-${{ github.ref }} with cancel-in-progress;
  - :206-229: gate-verdict (checkout, npm ci, MARC_NEEDS, timeout-minutes 10) and android-gate.
- On your merged head:
  - registry.mjs (rows, shippedIds, shippedRows, sourceOf, registryInputs: it lists src/data/exercises.json and every batch file);
  - gen/*.mjs, each plugin's inputs, inputsFor and libraryInputs;
  - generate.mjs, read only: loadPlugins (:22-37, exported) and render() (:40-63);
  - lib/inputs.mjs (coreFiles, inputsSha256, hashPaths, parseHeader);
  - inputs-closure.mjs (closureOf, which scans data sources only; LOCKED);
  - layers-spec.mjs (layersSpecOf);
  - batch-golden.mjs (pagesOf, batchGolden, pinOf, layersPage, platesPage);
  - build-page.mjs (buildPlatesPage) and plates-page.mjs (pageConfig);
  - LIB-4b's fidelity.mjs (libraryFidelity, onceStates);
  - fidelity/tuples.mjs (LIB_ONCE, libraryTuples) and fidelity/rows.mjs;
  - fidelity/fixture.mjs: SCRATCH, POOL, COPY_EDITS, f5Reason, and stage/page/pin/budgets/pagesFile, all taking a `scratch` list. leg_press is unusable, per its COPY_EDITS note;
  - tests/howto/fixtures/lib2b/fixture.mjs (fixtureTree = stageTree + pinTree);
  - LIB-4-DESIGN.md sections 1-5.
- #181 @ 9b8f76e: tools/plates/library/build-layers-page.mjs (makeMirror :12; the URL-loaded RENDERER_URL :16, REGION_FIX_URL :17 and GOLDEN_B_OPTIONS_URL :31; the spec.files copy :110) and render/** (closeups.mjs, closeups-8.mjs, region-fix.mjs, legacy.mjs).
- LIB-1 report R2/R3 (#209 issuecomment-5977306108): 280.8 s per id.

Interface, fixed now (claude/sup-lib4-ci codes against it):
- `node scripts/howto-rebuild.mjs`:
  - does its own `git fetch --depth=1 origin main`;
  - writes howto-pages/ (the pages plus plan.json) and screenshots/howto-rebuild-proof.json;
  - appends ks=<JSON array 1..K>, K=<n> and mode=<full|affected> to $GITHUB_OUTPUT.
- `node scripts/howto-shard.mjs`:
  - env MARC_LIB_SHARD=k/K and TZ=UTC;
  - reads howto-pages/;
  - writes screenshots/howto-proof-<k>of<K>.json, plus evidence under screenshots/howto-evidence/.
- Artifacts:
  - MARC-howto-rebuild-proof and MARC-howto-proof-<k>: proof JSON only;
  - howto-pages: short retention;
  - howto-evidence-<k>: not a MARC-* name.
- The verdict:
  - reads MARC_NEEDS (howto-rebuild and howto-shard must be present, with result success), GITHUB_SHA, GITHUB_REF and GITHUB_EVENT_NAME;
  - prints 'library: <mode> (<n> of <N>)' in the PASS line, and appends the same line to $GITHUB_STEP_SUMMARY;
  - only 'library: full' counts as merge evidence.

write_scope:
- New:
  - tools/plates/library/ci/{plan,mode,affected,verdict,times,compare,scratch}.mjs. scratch.mjs builds the C11-C14 scratch tree and never runs in main CI;
  - tools/plates/library/ci/times.json;
  - scripts/howto-rebuild.mjs and scripts/howto-shard.mjs;
  - tests/howto/library-ci.test.ts;
  - tools/plates/library/MANIFEST.json and tests/howto/library-manifest.test.ts (L0-lib).
- scripts/ci-verdict.mjs: the CLI block :123-137 only, about 10 lines, and only after #194 merges. They are:
  - a dynamic import;
  - collectLibrary(dir);
  - a libraryVerdict call;
  - merging its problems and notes;
  - the PASS-line text;
  - one step-summary line.
- docs/howto/library/LIB-4-DESIGN.md: one new 'CI' section.
- docs/COACHING-DECISIONS.md: append D-LIB4c-* entries.

reserved_paths:
- In ci-verdict.mjs, everything outside :123-137: verdict(), collect(), REQUIRED_NEEDS and the constants.
- tests/ci-verdict.test.ts and tests/gate-split.test.ts.
- tools/plates/generate.mjs and tools/plates/lib/** (the frozen HT-2 core), and tools/plates/gen/** (LIB-2b's).
- tools/plates/fidelity/shard.mjs and harness.mjs.
- scripts/gate-*.mjs, scripts/gate-times.json, scripts/screenshot-gate.mjs, scripts/ht10-gate.mjs, scripts/error-list.mjs.
- .github/**, docs/supervisor/**, package.json, package-lock.json. No new dependency: esbuild and playwright are already there.
- LIB-4b's paths: fidelity.mjs, fidelity/** (fixture.mjs included), tests/howto/library-fidelity.test.ts, and LIB-4-DESIGN sections 1-5.
- LIB-4a's paths: scale/**, tests/howto/lib-4a.test.ts, and the harness control lines.
- LIB-2b's paths:
  - library/{candidate,layers-spec,inputs-closure,batch-golden,registry}.mjs;
  - tests/howto/fixtures/lib2b/**.
- tools/plates/library/qa/**, src/**, and tests/howto/golden/**. This branch holds no pin; scratch pins live only on scratch refs.
- tools/plates/library/ci/times.json once C14 has run. Only the supervisor refreshes its values, and batch PRs never edit it.

Do:
0. The day-1 check-in, a few lines:
   - the base sha;
   - the L0-lib file set as ruled (Do 8b): its three builder parts, and whether the run-time read list comes from the builders' static input lists or from an fs-read trace;
   - the class-3 source (Do 3);
   - your scratch set (D-LIB4c-1 a, D-LIB-SCRATCHIDS);
   - planK at the seed times for that set (it must be >= 2);
   - the exact scratch.mjs commands.
   The scratch set is 6 target ids, two per usable pool source (lat_pulldown, seated_cable_row, machine_chest_press). Each id:
   - is in src/data/exercises.json;
   - is outside LB1 and LB2, with no How-to on main;
   - is not a row in any batch file of the scratch tree's inputs;
   - is not an id another fixture uses (lib_cable_lateral_raise, and LIB-4b's three in SCRATCH);
   - has its own pair key (lib4c-scratch-a..f).
   If fixture.mjs cannot build two per source, use as many as it can, never fewer than 4, and say why.
1. plan.mjs:
   - libraryIds() = the shipped rows whose mode is not 'golden'.
   - planK(items, times) = the smallest K >= 1 for which every packShards shard has c0 + offset + the sum of planned seconds <= 900.
     - Shard 1's offset is LIB_ONCE.run plus LIB_ONCE.shard(1).
     - If one id alone is over 900, each id gets its own shard and a note is printed.
     - K = 1 with 0 ids.
   - libraryPlan({ ids, times }) returns { K, shards, hash }, where hash = sha256 over the sorted ids, times, K, c0, offsets and target.
2. mode.mjs, modeOf({ ref, event }):
   - full on ^refs/heads/(main|claude/sup-merge-train-\d+)$ and on any workflow_dispatch;
   - affected on every other push.
3. affected.mjs, affectedIds({ changed, base, root }). changed = null when the fetch failed, and null selects every id. The first matching class wins:
   - Class 1 selects one id from its own files:
     - its batch row (git show FETCH_HEAD:<batch>);
     - tools/plates/library/specs/<id>* and tools/plates/library/howto/<id>.howto.mjs;
     - its entries in tests/howto/golden/library/*.json;
     - tests/howto/golden/library/<batch>.layers.html, which selects that batch's ids;
     - the research card named by its How-to's research.card, and that card's quotes file;
     - its per-id generated files (src/howto/generated/{ht,posture,feel}-*.ts and src/slices/howto/css/zoom-*.css) whose inputsSha256 differs from base. Its handpair-<key> chunk selects every id on that key.
   - Class 2 selects the ids whose rows differ, for the registry-derived files: src/howto/{ids,lib-id,coverage}.ts, src/howto/generated/{index,loaders}.ts and tools/plates/library/ids-node.mjs.
   - Class 3 covers a path under tools/plates/**, other than generate.mjs, tools/plates/lib/** and tools/plates/gen/**, that some generated output lists in its per-output inputs at HEAD.
     - affected.mjs builds that map itself. It runs the exported loadPlugins() in order and calls each plugin's outputs() with the ctx render() passes: prev, plus a hashFor built from lib/inputs.mjs's inputsSha256 the same way. It takes o.inputs, falling back to mod.inputs(), and joins them per path across writers, as render() does.
     - A path listed only by one or more library ids' per-id files (class 1's list) selects those ids.
     - A path that any other output lists selects all ids. That includes the 8's files, ids.ts, loaders.ts, index.ts and sources.json.
     - A path outside tools/plates/** is never class 3. For example, src/data/exercises.json is in every output through registryInputs, and it stays class 4.
     - Class 3 is active only after C4 proves the map. Until then, or if the map cannot be proven, these paths fall to class 4.
   - Class 4 selects all ids:
     - src/data/exercises.json;
     - src/slices/howto/** and src/howto/** not in classes 1-2, and the esbuild import closure of src/slices/howto/lazy.tsx;
     - src/ui/styles.css and the font assets;
     - index.html, vite.config.ts, tsconfig.json, package*.json;
     - tools/plates/** not in classes 1-3;
     - tests/howto/**;
     - scripts/howto-*.mjs and scripts/ci-verdict.mjs;
     - .github/**;
     - every docs/research/howto/** path not in class 1.
   - Class 5 selects 0 ids:
     - docs/** otherwise, root *.md, .claude/**;
     - escobar-worker/**, relay/**, native/**;
     - scripts/screenshot-gate.mjs, scripts/gate-*.mjs, scripts/ht10-gate.mjs;
     - tests outside tests/howto/**;
     - other src/**.
   - Class 6 (anything else) selects all ids.
4. scripts/howto-rebuild.mjs:
   - Fetch, then run `git diff --name-only FETCH_HEAD HEAD`.
   - L1: rebuild every page pinned in tests/howto/golden/library/*.json, on parallel processes:
     - plates pages through buildPlatesPage;
     - layers pages through layersSpecOf plus LIB-6's build-layers-page.mjs, imported lazily;
     - require rebuilt == committed == pin;
     - a page kind with no builder at this sha is red.
   - Write howto-pages/ and the rebuild proof with writeProof. Its meta holds mode, base, changed, plan, seconds R, the page shas, and the seconds affectedIds took. It also holds the base-side values affectedIds read: each changed batch file's base rows, and each changed per-id generated file's base inputsSha256.
   - Append the outputs to $GITHUB_OUTPUT.
   - The 1,800 s budget applies.
5. scripts/howto-shard.mjs:
   - jobFromEnv('MARC_LIB_SHARD');
   - recompute the plan hash from plan.json;
   - re-check the page shas against the rebuild proof;
   - run onceStates(browser, port, k), then libraryFidelity(browser, port, { ids, pages, P }) at LIB-4b's adopted P;
   - write the proof. Its meta holds job, tz, www (wwwHash), chrome, plan, mode, ids, pageShas, px, seconds and shardSeconds.
6. verdict.mjs: collectLibrary(dir) and libraryVerdict({ lib, rebuild, gate, sha, ref, event, needs, root }). It is red on every D-LIB4-VERDICT item:
   - a wrong sha; a missing, duplicate or extra shard; shard ids that differ from the plan;
   - a coverProblems miss against libraryTuples plus LIB_ONCE;
   - a fail row, or a state that does not begin with <check>/ and end with @<width or *>;
   - the rebuild proof does not cover every pinned page exactly once and passing, or a shard's page shas differ from the rebuild proof;
   - www differs from the gate family's, chrome differs, or tz is not UTC;
   - shardSeconds > 1,800 (over 900 is a note), or affected mode on a full ref;
   - libraryIds plus the 8 differ from shippedIds();
   - howto-rebuild or howto-shard is missing or not success.
   In affected mode the verdict recomputes the id set at HEAD with affectedIds, from the proof's base sha, changed list and base-side values. gate-verdict does not fetch, and the verdict never copies the proof's ids. If that recompute takes more than 2 min, report it, because gate-verdict has timeout-minutes 10.
7. times.json = { default, c0, once, ids: {} }:
   - seed default = 280.8 (LIB-1 R2) and once from LIB-4b's B8, then replace both from C14;
   - times.mjs reuses refreshTimes if its input shape fits. Otherwise it is a thin wrapper with no copied logic.
8. compare.mjs: compares N library proof sets on one sha (rows, results, and px per pixel tuple) and exits 1 on the first difference.
8b. L0-lib (D-LIB4c-1 b, widened). tools/plates/library/MANIFEST.json covers every library row that has a plate entry in a batch golden file. For each such row it lists each of these files, with its sha256 and the approving entry's hash:
   - closureOf(spec) and closureOf(How-to source);
   - the builder files of that row's pinned pages, in three parts:
     - the esbuild metafile import closure. Its entry points are build-page.mjs, plates-page.mjs, LIB-6's build-layers-page.mjs, each module the builders load by URL at run time (render/closeups.mjs, render/region-fix.mjs, and the batch's options module, render/closeups-8.mjs for the 8), and the hand loader tools/plates/library/hands/pairs.mjs;
     - the MANIFEST.json of every locked tree (inputs-closure.mjs LOCKED: tools/plates/layers/ and tools/plates/vendor/) that a builder imports from or reads from. For example, build-page.mjs (:17, :43, :63) reads tools/plates/vendor/artifact/build-page.mjs, and build-layers-page.mjs builds a layers mirror (makeMirror);
     - each non-locked file a builder reads at run time, by explicit path: the batch page JSON that pageConfig reads (plates-page.mjs:20), each file buildLayersPage copies from spec.files (:110 @ 9b8f76e), the batch's layersConfig and options module, and the files the hand loader's inputsFor(key) lists.
   Rules:
   - Files that do not exist at that sha are not listed. C9 already turns a pinned page with no builder red.
   - closureOf is for data sources only. It refuses file reads outside the locked trees (inputs-closure.mjs:33), and its header says page-builder code keeps its static input lists. So it is not run on builder code.
   - Take the run-time read list from the builders' static input lists, or from an fs-read trace of one real page build per kind. Say which in the check-in, and post the trace if you used one.
   - Entries change only in the commit that adds or replaces that pin.
   - The count is exact: 0 on main.
   - MANIFEST.json is not a LOCKED tree in inputs-closure.mjs.
   - Once the supervisor's guard line is in, a non-merge commit that touches MANIFEST.json carries '[golden update]' (one exemption: creating it as exactly {"rows": {}}; lib4-cards.md 12 item 19).
9. Post 'ready for wiring' with the interface. The supervisor may already have drafted the wiring.
10. Scratch evidence (H3).
    - scratch.mjs builds the tree from:
      - this head;
      - the ci-verdict.mjs seam as a scratch commit, with the same bytes Do 11 commits;
      - claude/sup-lib4-ci;
      - #181 @ 9b8f76e;
      - your scratch set, built with fixture.mjs's stage, page, pin, budgets and pagesFile using your own `scratch` list.
    - Scratch inputs:
      - per id, a scratch research card in LIB-3's shape. Its plateFacts are measured from the copied spec's own engine report, and its topFault equals the spec's mistakeFault;
      - plate entries carry exemptions ['F5'] with f5Reason()'s text verbatim;
      - only fixture.mjs's COPY_EDITS cues change. Re-derive the refusal each one answers with your target id, because the listed strings name LIB-4b's ids;
      - budgets at measured + 10 %, on the scratch tree only.
    - Post on the PR:
      - your head sha and the seam's ci-verdict.mjs sha256;
      - the wiring sha and #181's sha;
      - the exact commands;
      - the expected sha256 of the scratch batch golden file.
    - You push only claude/lib-4c-library-ci. The supervisor pushes these from your posted commands:
      - claude/lib-4c-scratch: a draft PR marked '[do not merge]', closed and deleted afterwards;
      - its refresh;
      - the three C12 seeded refs.
    - Dispatch rules:
      - Have one run in flight at a time across all scratch refs.
      - Never dispatch while a run is queued or in progress on main, claude/sup-merge-train-*, claude/gate-split or claude/sup-gate-split-*. This command must print nothing ('CHECK FAILED' means wait): `for s in queued in_progress; do curl -sS "https://api.github.com/repos/macdarenz-droid/M-arc/actions/runs?status=$s&per_page=100" | jq -rn 'input | .workflow_runs[] | .head_branch' 2>/dev/null || echo "CHECK FAILED"; done | grep -E '^(CHECK FAILED|main|claude/sup-merge-train-.+|claude/gate-split|claude/sup-gate-split-.+)$'`
      - Never dispatch on a ref that has a run queued or in progress. The concurrency group marc-gate-<ref> has cancel-in-progress, so the dispatch would cancel that run. A cancelled run is re-dispatched and not counted.
    - Order:
      1. C11: the supervisor's first push of claude/lib-4c-scratch. Let its run finish.
      2. C14: 2 full dispatches, one after the other.
      3. Commit times.json from C14 on your branch (one push, under CI manners) and post the refresh commands. The supervisor refreshes the scratch ref. Let its run finish.
      4. C12: the 3 seeded refs, one at a time.
      5. C13 last: 5 sequential full dispatches on the refreshed scratch sha.
11. After #194 is on main and C11-C14 are done:
    - merge origin/main;
    - write the LIB-4-DESIGN CI section and the D-LIB4c-* decisions;
    - commit the ci-verdict.mjs CLI seam as your last non-merge commit. It must be byte-identical to the scratch tree's seam (the sha256 posted in Do 10); if it differs, re-run C11-C13.
    After the seam, only merge commits and review fixes follow, and C10 re-runs after each.

Acceptance (each new test bites: break it, see red, restore it; list the mutations in the PR):
- C0 L0-lib. library-manifest.test recomputes the Do 8b set, requires MANIFEST.json to list exactly that set, and checks every file against its sha256 and its approving golden entry hash.
  - The count is exact: 0 on main, and 1 row on LIB-2b's fixtureTree() (stageTree + pinTree).
  - Mutations, each red:
    - one byte changed in a pinned row's spec;
    - one byte changed in a pinned row's page builder (build-page.mjs);
    - one byte changed in the batch page JSON that pageConfig reads;
    - a run-time read file left out of the set (for example, the layersConfig dropped from the row's list);
    - one listed hash changed in a locked tree's MANIFEST.json;
    - an unlisted closure file;
    - a wrong golden hash.
- C1 Each shipped id is in exactly one shard, for N in {0, 1, 4, 8, 14, 145, 153}, every K in 1..max(16, N), and the real registry. Mutations, each red: drop the last item; an off-by-one k; a duplicate id.
- C2 Integer-aware K, on a fixture with t = 271 and c0 = 30: K(0) = 1, K(4) = 2, K(14) = 5, K(145) = 49, and every packed shard <= 900. Mutation: ceil(load/900) gives 46, with shards over 900, which is red.
- C3 Mode by ref, as a table: main, sup-merge-train-21, sup-merge-train-18b, claude/x, a dispatch on claude/x (split and serial), and a tag push. Mutations, each red: a train treated as affected; train-18b treated as full.
- C4 The affected rule is ordered and fail-safe. On a real temporary git repo, one commit per case:
  - one id's row selects that id; one id's spec selects that id;
  - <batch>.layers.html selects that batch's ids;
  - the research card named by one id selects that id; docs/research/howto/reviews.json selects all;
  - exercises.json selects all, although every output lists it; src/ui/primitives.tsx selects all;
  - screenshot-gate.mjs alone selects 0; docs only selects 0;
  - an unknown path selects all; ids.ts selects the changed rows; changed = null selects all;
  - class-3 map proof: for every generated file at HEAD, on the real tree and on LIB-2b's fixtureTree, inputsSha256(its header's writers, affected.mjs's collected inputs) equals its header's inputsSha256;
  - on the fixtureTree, a new composer imported only by the fixture id's spec selects that id, and one also imported by the 8's sources selects all;
  - no class-5 path is in the esbuild import closure of howto-shard.mjs, howto-rebuild.mjs or lazy.tsx.
  Mutations, each red:
  - each class flipped;
  - a class-5 path imported by the runner;
  - one collected input dropped (the hash proof);
  - class 3 claiming src/data/exercises.json.
- C5 The verdict family: one fixture per D-LIB4-VERDICT item, each red. It includes:
  - a LIB_ONCE.run row missing or proven twice;
  - shardSeconds 1801 (900-1800 gives a note);
  - a howto-shard need missing or skipped;
  - the affected recompute against a proof whose id list was edited.
  Each fixture is its own mutation.
- C6 Zero ids: K = 1, and shard 1 holds exactly LIB_ONCE.shard(1) plus the 4 LIB_ONCE.run rows, which is green. Shard 1's proof missing is red. Mutation: accept a skipped job, which must be red.
- C7 C-TZ: no Date, Intl or toLocale in src/slices/howto/**, src/howto/**, or the built HowToSheet-, ht-, hand-, handpair-, feel-, posture-, zoom- and loaders- chunks. Date.now() and performance.now() are allowed. Mutations, each red: a fixture file with new Date(); a built chunk with toLocaleString.
- C8 The 4 LIB_ONCE.run rows appear exactly once, in shard 1. Mutations, each red: the selftest exits non-zero; a guard row also in shard 2; one row dropped.
- C9 L1: committed == rebuilt == pin for every pinned page, on parallel processes, with R recorded. Mutations, each red: one byte in a page source; one byte in a committed layers page; a changed pin; an unknown kind; a layers page with no builder at this sha.
- C10 The seam is CLI-only. GATE-SPLIT's tests are unedited and green, and `git diff <#194 merge> -- scripts/ci-verdict.mjs` stays inside :123-137.
- C10b The HT-2 core is untouched: `git diff <base> -- tools/plates/generate.mjs tools/plates/lib` is empty, and `node tools/plates/generate.mjs --check` is green.
- C11 Affected run on CI: the first push of claude/lib-4c-scratch prints 'library: affected (n of n)' with its reasons (.github/**, new rows).
- C12 Seeded defects on CI, each on its own ref and each red:
  - a 1 px change in one scratch page, naming that id;
  - times.json edited in the shard job after the plan (the plan hash);
  - one row dropped from shard 2's proof before upload, naming the tuple (plan 5.4:577; GATE-SPLIT E6).
- C13 5 consecutive full dispatch runs on one sha, at K >= 2 and LIB-4b's adopted P. compare.mjs exits 0 on rows, results and px. A cancelled run is re-dispatched and not counted. Any difference blocks LB1 and is root-caused, never re-run to green.
- C14 CI calibration: a table from >= 2 full runs on Chrome 153. It gives t per family (PQH and offline included), c0, once, setup, R and shard seconds. times.json is committed from it, and a K table is given at N in {0, 4, 14, 145, 153}.
- C15 No regression: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` on the merged head, then one full train-head run.
- C16 Scratch inputs (D-LIB4c-1 a). scratch.mjs checks these on the scratch tree, and you post its output:
  - the set is outside LB1 and LB2, per the lists above;
  - each id's measured F5 ratio equals the 8's 3.57:1;
  - a byte diff shows that the copied sources differ from the 8's only in the id, name, research-card and import lines and the ruled COPY_EDITS.
  Mutations, each red:
  - the card removed: the generator throws QaRefused, naming that id and PQ-H6;
  - the F5 exemption removed from one id: only that id's PQH F5 row is red;
  - one copy edit reverted: QaRefused ... PQ-H8, naming that id;
  - an LB1 id in the set: scratch.mjs refuses it.

verification: map every criterion to a test or a run id in the PR body. Before READY, merge origin/main and run C15 on that exact head. The supervisor posts the amended plan sha before your READY (D-LIB4-DOCS-2); cite it in the PR body in place of 4a9fd86.

risk_and_recovery:
- The inherited LIB-4a red: never fix it here; merge LIB-4a's fixed head.
- Unpushed work until 'E8 done' (about 4 h) is lost if the container restarts. Commit often and keep HANDOFF current in your session. The supervisor sends 'E8 done' as soon as E8 ends.
- The busy checks read the public Actions API without a login (about 60 requests per hour per IP). A failed call prints 'CHECK FAILED', which counts as busy: wait and re-check, never push or dispatch past it.
- A builder file gains a new run-time read: its own bytes change, so C0 turns red until that pin's commit re-lists the set. Re-run the trace or re-read the static lists for that commit.
- LIB-4b's contract churns (libraryFidelity, onceStates, LIB_ONCE, fixture.mjs): merge its heads at milestones and re-run C5, C6, C8 and C16. LIB-4b owns that contract, and changes to it are ruled on #232.
- LIB-2b's final delta changes inputs-closure, layersSpecOf, pagesOf or a plugin's inputs: re-run C0, C4 and C9.
- #194 changes before it merges: re-merge it and re-run C10.
- The plugins' outputs() turn out not callable outside render(), or the class-3 hash proof fails: class 3 stays off, and its paths stay all-ids. Never edit generate.mjs to fix it.
- The verdict's affected recompute is slow: report it, with its seconds, before the wiring is final.
- The wiring and this card land apart: gate-verdict turns red either way, so they merge in one train.
- Affected mode misses an input: the train head runs in full mode, so the cost is one train cycle, never a bad merge.
- D-LIB9-ENGINE is open (LIB-6-PM): evidence holds only for #181 @ 9b8f76e. If the scratch tree moves to a newer #181, re-run C9 and C11-C13.
- K comes out 3 on the scratch: C13 still needs only K >= 2; report the cost.
- Runner capacity: D-LIB4-QUEUE's triggers apply.
- Two failed tries of one approach with no new evidence: stop and report, on the PR or to the supervisor if there is no PR yet.

return:
- the PR number and full head sha;
- the base sha used;
- the check-in link;
- the seam's sha256;
- the C11-C14 run ids;
- the calibration and K tables;
- the compare.mjs output for C13;
- the scratch shas the supervisor pushed.
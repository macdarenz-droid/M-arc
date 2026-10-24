Card LIB-20: E-R5 engine fields, one `[golden update]` re-vendor (2026-10-24; status `ready`; rulings D-LIB20-* proposed below, the supervisor confirms them in 'LIB-20 start')

Why now: the supervisor ruled E-R5 a GO under the owner's delegation (#278 6381385131: D-ER5-GO and D-ER5-YAW). LIB-20 lands six engine fields in the vendored golden-A engine. With every field at its default, every approved byte stays the same.

Sources (every file:line below was opened at these heads; [unverified] marks the rest):
- main `0f1f73de` (GATE-FLAKE-5 #292 on top of F-CI-1 #303 `1ffd0dac`);
- the plan: claude/howto-options @ `b41ac833`, docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md: 2 :113-118 (the vendoring path), 2.4 :185-230, LB9 row :718, row 20 :817, calendar :928;
- the spike: #190 @ `82ae2d40` (claude/lib-engine-spike; reference only, never merged): tools/plates/library/spike/REPORT.md, and its diff to vendor/engine/body.mjs and plate.mjs;
- rulings on #278: 6276882489 (E-R5 SCOPE RULED, D-LIB11-ER5), 6277782675 (advisory scores), 6381385131 (D-ER5-GO, D-ER5-YAW);
- docs/COACHING-DECISIONS.md on main: D-SPIKE-pitch (:2222), -L1-blind (:2223), -hinge (:2224), -lat (:2225), -one-card (:2226), -status (:2243);
- the precedents: LIB-26 (flat palm: source `f2147005` on claude/howto-options, re-vendor `50fe854b` on main) and LIB-25 (poly: `7859292`, `de00174f`, `48153c41`; re-vendor `8480052d`).

id: LIB-20
model: claude-opus-5-5 (an edit to locked engine files; the default-path proof, the yaw axis and the mutation design need judgement)
mode: auto
title: 'Builder: LIB-20 E-R5 engine fields'
branch: claude/lib-20-engine (new; no such branch on origin at 2026-10-24 ~08:00 UTC). Your first push opens draft PR '[golden update] LIB-20: E-R5 engine fields, no approved byte moves'.
size: M
slot: plan 7 row 20 (:817). D-ER5-GO: build ahead now; merge in plan order, before the LB7 ship card (plan 2.4:224). The supervisor names the checklist slot in 'LIB-20 start' [slot number unverified].

base: the latest origin/main when the session starts (`0f1f73de` or later).
- Re-read every main line cited here on your start head, and use the line you find there.
- Not on main at card time: pilot A (#109 @ `dcac4a38`), pilot B (#278 @ `d3b231d6`). tools/plates/library/MANIFEST.json is `{"rows": {}}`: no library row is pinned.
- Merge origin/main into this branch with a merge commit each time a library pin lands on main (pilot A's first), and before READY. Then re-run 20-A3 (Do 9).
- Run `git pull --no-rebase` before each push. Never rebase, amend or force-push, on this branch or on claude/howto-options.

depends_on: LIB-2 (merged; plan row 20 :817). LIB-4c's C0 and L1 runner are on main (ci/manifest.mjs, scripts/howto-rebuild.mjs).

build_prerequisites: 'LIB-20 start', with the live active-builder count (D-LIB-LANE-ACTIVE) and the D-LIB20-* rulings confirmed or changed.

merge_prerequisites:
- A fresh Opus review PASS against this card, with "golden update" in the PR title (plan 3.5 step 6).
- Every check green on a head that contains the latest main.
- Every lower-numbered checklist item merged (AGENTS merge rule). It merges before the LB7 ship card (D-ER5-GO; lib-17-card.md D-LIB17-ER5).
- 20-A3 re-run on the final head, after the last merge of main.
- The builder never merges.

Stops (these override every other line in this card):
1. **An approved pixel moves.** One byte changes in golden A, golden B, a committed ref fixture of the 8 or of `_test_front`, `_test_side`, `_test_poly`, `_test_flat`, the lib2b layers fixture, a generated file's body, or any pinned library page. STOP and report on the PR, with the file and the first differing byte. Never re-pin, and never edit a fixture to match.
2. **golden B's engine.** tools/plates/layers/** never changes. It is a separate copy (REPORT.md:22).
3. **A library pin lands while you build.** C0 then needs D-LIB20-L0 (b). Write library MANIFEST.json rows only as that ruling says, and only after 'LIB-20 start' confirmed it. If it was not confirmed, stop and report.
4. **A seventh field.** If a scratch render shows another missing engine field, report it. Never add it here.
5. **Checks.** No test, guard, tolerance, budget, timeout or count is relaxed. A literal value pinned in a test moves only to the new true value, in the `[golden update]` commit, listed old → new in the PR body (20-A1).
6. **Two failed tries** of one approach with no new evidence: stop and report.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply. From the first push it lives in the PR body (builder SKILL.md :26-27). Never write to the owner.
- Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` as detached processes: `setsid nohup <cmd> > <log> 2>&1 &`, then poll the log. Keep a send_later check-in every 20 minutes while one runs (idle containers are reclaimed). A stopped or killed run is never evidence.
- A CI failure on `[vitest-worker]: Timeout calling "onTaskUpdate"` is a real defect (D-LIB8M-RPC (b)). Run renders in an awaited child process, never in the worker. Report such a red; never re-run to green.
- A job cut off at its F-CI-1 cap is not evidence either way. Report it with the step times, and re-run only as the supervisor says.

hard card: yes. Write the design note (Do 2) in the PR body before any engine edit, and post it with your first push.

outcome:
Gap today (main `0f1f73de`):
- The vendored engine cannot turn the body on its side, twist the chest, bend the trunk sideways, turn the hips, raise the camera, or keep a trunk's depth seen end-on.
  - `normPose` reads `trunk` as a number only (body.mjs:92).
  - `fk` builds the pelvis frame from `tilt` alone (body.mjs:112).
  - `makeCamera` has one level projection (plate.mjs:31).
  - The front view draws the trunk under the legs (plate.mjs:138).
- So side_plank, russian_twist, dumbbell_fly and the rear-delt fly cannot be drawn (plan 2.4; D-ER5-GO "Why GO").
After this card:
- Six fields exist in the vendored engine. All default to 0 or off:
  - `root.roll`: the whole body turns about the forward axis (REPORT.md:12);
  - `trunk.yaw`: the thorax and head turn about the trunk's long axis (:13);
  - `trunk.lat`: the thorax bends sideways (:14);
  - `camera.pitch`: front view only, screen-up = y cos p − z sin p (:11);
  - `torso: 'volume'` with its depth order: a trunk nearer the camera than the knees is drawn over the legs, its head over that (:15; D-SPIKE-hinge);
  - `root.yaw` (new, not in the spike; D-ER5-YAW): the pelvis turns about the vertical axis, so the hips and knees swing with the trunk (plan 2.4:216-221).
- With every field absent or at its default, every page and fixture on main rebuilds byte for byte.
- Two new engine test specs pin front views as committed ref fixtures. One is a default-path front view, so a pitch regression turns a check red (D-SPIKE-L1-blind).
- No exercise is drawn. No plate, spec, batch row, pin or sheet changes.

deliverable: one PR (claude/lib-20-engine) and one source commit on claude/howto-options.
evidence: 20-A1..20-A15 below, with every mutation and its red line.
finish: merged on main in its slot. You will notice: nothing visible. No app pixel and no approved plate changes.

The vendoring path (plan 2 :113-118; HOWTO-BUILD-PLAN 2.8 on claude/howto-options; the LIB-25 and LIB-26 precedents). Never hand-edit a vendored or generated file:
1. Make the change at the source: claude/howto-options, `docs/howto/technical-plate/`. Today the source blobs equal the vendored ones (body.mjs `c4b01707`, plate.mjs `6113e70e`, SPEC.md `d5abe2e4`; checked 2026-10-24), so the spike's hunks apply to the source unchanged.
2. Commit only the files in write_scope (a), with `[golden update]` and the trailers. Run `git pull --no-rebase`, then push (never force). Post the short sha on the PR.
3. Copy each changed or new file byte for byte into tools/plates/vendor/ (`git show <src>:docs/howto/technical-plate/<p> > tools/plates/vendor/<p>`).
4. Update each changed entry in tools/plates/vendor/MANIFEST.json: `source` `<src7>:docs/howto/technical-plate/<p>`, `sha256`, `gitBlob`. Compute them with a script, as the spike's revendor.mjs did (spike/revendor.mjs:8-14), but with the real source sha, never `SPIKE`.
5. Add `{ "commit": "<src7>", "why": "golden update, LIB-20 E-R5" }` to tools/plates/pins.json `vendorSources`, and extend `vendorSourceMessage` to name it. golden.mjs builds its source check from that list (golden.mjs:26).
6. Add the two new test specs to the probe's list (golden.mjs:217). Write their four ref fixtures from the probe's output, never by hand.
7. Run `node tools/plates/generate.mjs`, then `node tools/plates/generate.mjs --check`. Only GENERATED headers and `hashes:` lines may move (LIB-25 and LIB-26 moved 11 files that way: 8 ht-*.ts, generated/index.ts, ids.ts, plate.css).
8. Update the literal pins that name the vendor set, to their new true values only: vendor.test.ts (:36 the spec list, :43-47 the source map, :92 the list sha256), golden.test.ts:139 (the committed test-fixture names) and library-core.test.ts:134 (the message text).
Steps 3-8 go in one commit on this branch, `[golden update] LIB-20: E-R5 engine fields re-vendored`. Under D-LIB20-L0 (b) the library MANIFEST.json rewrite joins that commit. Nothing else goes in it.

design_reference:
- REPORT.md :7-15 (the fields), :17-35 (identity and mutations), :37-48 (renders; none critic-approved).
- The spike's code at `82ae2d40`, read with `git show`, never merged:
  - body.mjs: normPose :91-94, fk :112-118, bodyShapes :301-315, volumeTrunk, polyD and hull :367-401;
  - plate.mjs: makeCamera :28-37, drawPose :43, front order :143.
- The scratch spec tools/plates/library/spike/specs/russian_twist.mjs (for Do 8 only).
- The advisory scores (6277782675). They rate the spike's renders, not the fields.

connectivity: none. Node and local Chromium only. No stored or sent user data, no network call, no new dependency, no new provider.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and its gotchas; this card; D-ER5-GO and the D-SPIKE-* entries.
- On main at start:
  - tools/plates/vendor/engine/body.mjs :86-118, :278-310; plate.mjs :20-40, :78, :120-140; SPEC.md; MANIFEST.json;
  - tools/plates/golden.mjs :22-58, :191-262; tools/plates/pins.json;
  - tests/howto/vendor.test.ts :30-95; golden.test.ts :11-35, :136-165; library-core.test.ts :125-140;
  - tools/plates/generate.mjs :1-20; tools/plates/lib/inputs.mjs;
  - tools/plates/library/ci/manifest.mjs (all); inputs-closure.mjs (LOCKED); scripts/howto-rebuild.mjs :1-25 and its `--page` mode;
  - scripts/screenshot-gate.mjs: HT-2's L1 rebuild (:6523-6536) and L0-B (:7513-7519). Read only.
- On claude/howto-options: docs/howto/technical-plate/engine/{body,plate}.mjs and SPEC.md, and LIB-26's source commit `f2147005` as the shape to follow.
- LIB-26's re-vendor `50fe854b` (`git show --stat` and its test diffs).

write_scope:
(a) On claude/howto-options, docs/howto/technical-plate/ only:
- engine/body.mjs, engine/plate.mjs: the six fields;
- engine/SPEC.md: one line per field, with its default, its view scope and the Mistake merge rule (D-LIB20-TRUNK);
- new exercises/_test_er5.mjs and exercises/_test_pitch.mjs (D-LIB20-FIXTURE).
A review fix is a new `[golden update]` source commit, re-vendored the same way.
(b) On claude/lib-20-engine:
- tools/plates/vendor/: the verbatim copies of (a), and their MANIFEST.json entries;
- tools/plates/pins.json: one vendorSources entry and the message;
- tools/plates/golden.mjs: the probe list (:217) only;
- tests/howto/golden/ref-fixtures/_test_er5.{n,m}.html and _test_pitch.{n,m}.html (new, from the probe);
- the literal pins of step 8;
- the generated files' header and `hashes:` lines, written by generate.mjs;
- tools/plates/library/MANIFEST.json, only under D-LIB20-L0 (b);
- new tests/howto/engine-er5.test.ts (20-A5..A12);
- new docs/evidence/lib-20/*.png: the two test specs, normal and Mistake, Paper and Silent Black (as LIB-26 did);
- docs/COACHING-DECISIONS.md: appended D-LIB20-* entries only, including one line that D-ER5-GO settles D-SPIKE-status;
- the PR body.

reserved_paths:
- tools/plates/layers/** (golden B), tests/howto/golden/howto-layers.html, tests/howto/golden/technical-plates.html, tests/howto/golden/GOLDEN.json (no approved byte moves, so no entry: plan 3.5 "needs no owner session").
- tests/howto/golden/library/**, and every existing ref fixture.
- tools/plates/library/** except MANIFEST.json under D-LIB20-L0 (b). That covers specs, batches, eq/**, qa/**, ci/**, render/**, hands/** and spike/**.
- tools/plates/generate.mjs, tools/plates/lib/**, tools/plates/gen/** (the frozen core and its plugins).
- src/** except the generated header lines; tests/howto/budgets.json.
- Shared add-only files (AGENTS.md): scripts/screenshot-gate.mjs and tests/theme.test.ts. No gate block is added or edited.
- .github/**, package.json, package-lock.json.
- AGENTS.md, CLAUDE.md, docs/supervisor/**, the plan docs on claude/howto-options.
- The spike's files. Nothing under tools/plates/library/spike/** comes over, and no `SPIKE` label or `// ENGINE SPIKE` comment lands.

Do:
1. On 'LIB-20 start': open the branch. Baseline on main, recorded in the PR body:
   - golden A's rebuild sha256 and bytes (`e2bea90c…`, 860,766 B);
   - golden B's L0-B pageSha256;
   - the sha256 of every committed ref fixture;
   - the lib2b layers fixture's sha256;
   - `generate --check` clean;
   - every pinned library page from `rebuildAll` (0 rows on `0f1f73de`).
2. Design note (PR body, posted with the first push). Settle each point with a measured fact, or name the options:
   - (a) each field's maths and its exact default-path code. Reuse the original expression at 0, as the spike did ("At 0 the original projection function is used", REPORT.md:11). Never multiply by cos 0;
   - (b) `root.yaw`: its axis and its place in the rotation order (D-LIB20-YAW). With planted feet the legs' IK keeps the feet still while the hips and knees turn;
   - (c) the `trunk` shape: a number or `{ flex, yaw, lat }`. `null` must stay 0. The spike reads `null.flex` and throws (body.mjs:92 at `82ae2d40`: `typeof null === 'object'`);
   - (d) the Mistake merge: `mergeDeep(poses.end, mistake.pose)` (plate.mjs:78) swaps a numeric `trunk` for an object and silently drops `flex` (plate.mjs:20-26). Pick one rule (D-LIB20-TRUNK);
   - (e) the depth order: the `chest` and `headF` groups (plate.mjs:138 front order), and proof that they are empty, so they add no byte, when `torso` is not 'volume';
   - (f) the two test specs (D-LIB20-FIXTURE): pose, camera and which field each tile draws;
   - (g) the mutation list for 20-A5..A12;
   - (h) every file:line it will touch.
3. Tests first: write tests/howto/engine-er5.test.ts against the fields. Run it on main and record the reds: the fields do not exist yet.
4. The source commit (vendoring path, steps 1-2). Before you push it, rebuild golden A from the source files in a scratch mirror (golden.mjs `makeMirror` on a copy, as the spike's identity.mjs did) and check `e2bea90c…`.
5. Re-vendor (steps 3-8), in the one `[golden update]` commit.
6. The default-path proof (20-A2..A4) and the mutation table (20-A5). Each mutation runs on a scratch copy and is never committed.
7. Per-field tests green (20-A6..A12).
8. The russian_twist scratch render (20-A9, D-LIB20-SCRATCH). Commit nothing from it.
9. Pinned pages after merging main (20-A3). Each time origin/main brings a new or changed file under tests/howto/golden/library/**:
   - merge it with a merge commit;
   - rebuild each pinned page: `node scripts/howto-rebuild.mjs --page tests/howto/golden/library/<file>.json <kind> <scratch out>`, for every page kind the file pins;
   - check each sha256 equals its pin entry;
   - run lib8-pin.test.ts A10 if pilot A is on main;
   - run C0 (tests/howto/library-manifest.test.ts). If C0 is red only on the files this card changed, apply D-LIB20-L0 (b); any other red: STOP 1.
   Early warning, not a merge gate: build pilot A's plates page at #109's head in a temporary worktree outside the repo, once with main's engine and once with this branch's vendored engine; they must be identical. Do the same for pilot B (#278) once. Never commit or push either worktree.
10. Perf and size (20-A14).
11. Before READY:
    - merge origin/main with a merge commit;
    - re-run 20-A1..A15 on that head;
    - re-read your diff against write_scope;
    - fill the HANDOFF block;
    - post "LIB-20 READY: <sha>".

Acceptance (each with evidence and the mutations that must turn red; list each red line in the PR):
- **20-A1 Re-vendor.**
  - The source commit touches only write_scope (a).
  - Each vendored file's git blob equals the source blob (`git show <src7>:<p> | git hash-object --stdin`).
  - verifyVendor is clean and vendor.test.ts is green.
  - Every literal pin that moved is listed old → new; none is removed.
  - Mutations, each red: one byte in vendored body.mjs (L0 names it); `<src7>` left out of vendorSources (the source check names it); an old gitBlob kept in MANIFEST.json.
- **20-A2 L1 on golden A and the 8.**
  - Gate HT-2 rebuilds golden A to `e2bea90c…`, 860,766 B.
  - The probe reproduces all 8 plates from the vendored specs (golden.test.ts :11-35).
  - Every existing ref fixture is byte-unchanged: `git diff --stat origin/main -- tests/howto/golden/ref-fixtures` lists only the four new files.
  - golden B's L0-B pin is unchanged, and tools/plates/layers/** has 0 changed files.
  - The lib2b layers fixture rebuilds byte for byte (library-rows.test.ts).
- **20-A3 Every pinned page on main at merge time.**
  - `rebuildAll` on the final head gives every pinned library page its pinned sha (scripts/howto-rebuild.mjs; C9 in library-ci.test.ts).
  - C0 is green.
  - Do 9 ran after each merge of main that brought a pin. The PR lists each pinned page, its sha and the head it was checked on. That includes pilot A's page if #109 landed first.
  - Mutation, red: on a scratch copy holding a pin, `roll ?? 1` turns that page's L1 row red.
- **20-A4 A pinned engine-drawn front view (D-SPIKE-L1-blind).**
  - `_test_er5.n` is a front view with every field absent, committed as an HT1-A4 ref fixture.
  - Mutation `pitch ?? 1` (plate.mjs default): HT1-A4 turns red on `_test_er5.n` (golden.test.ts:144). Record whether `_test_front.n` also turns red [unverified: no one has run it]. Golden A stays identical, the blind spot REPORT.md:29 found; record it.
  - If neither fixture turns red: STOP and report.
- **20-A5 Defaults keep today's output.**
  - For each of the 11 vendored specs, every field set explicitly to 0 or off renders byte-identical to the field absent (renderPlate, normal and Mistake).
  - `trunk: 20` ≡ `trunk: { flex: 20 }`, and `trunk: null` ≡ `trunk: 0` ≡ absent.
  - Mutations, each red (the PR names every check that turns red, as REPORT.md:27-32 did): the default 0 → 1 for roll, trunk.yaw, trunk.lat, root.yaw and pitch; `torso` default 'volume'; the spike's `typeof p.trunk === 'object'` read (`null` throws).
- **20-A6 `root.roll`.**
  - At roll 90 in front view the shoulder line is vertical: the two shoulders' x differ by under 1 px, and y differs by the shoulder width ± 1 px.
  - Every bone length is unchanged (a rigid turn).
  - Mutations, each red: the rotation dropped; the sign flipped; roll applied to the thorax only.
- **20-A7 `trunk.yaw`.**
  - At yaw 90 in front view the shoulder line foreshortens to under 10 % of its width at 0 (plan 2.4: "a foreshortened shoulder line").
  - The pelvis landmarks are unchanged.
  - Mutations, each red: yaw applied to the pelvis frame; yaw dropped.
- **20-A8 `trunk.lat`.**
  - At lat 20 the shoulders' midpoint moves sideways from the pelvis midpoint, in the sign the note fixes.
  - The pelvis and the planted feet are unchanged.
  - Mutations, each red: lat dropped; the bend applied before the flex instead of after (the spike's order, body.mjs:117 at `82ae2d40`).
- **20-A9 `root.yaw` (D-ER5-YAW).**
  - Standing, tilt 0, both feet planted: at yaw 30 the hips' front-view width is cos 30 × the width at 0 (± 1 px).
  - The knees move and the feet stay within 0.5 px.
  - Scratch only (D-LIB20-SCRATCH): render russian_twist's Mistake (hips and knees swinging with the trunk: plan 2.4:216-221; LIB-11 #278 6277350376) from the spike's spec, with `root.yaw` turning with the chest. Use Paper and Silent Black at 390 px.
  - Post on the PR the reproduction command, the input sha and the measured knee-midpoint shift between end and Mistake, in px, beside qa/envelope.json `deviationMin` (11.39). It is information only. No plate is drawn, judged or pinned here.
  - Mutations, each red: yaw applied to the thorax only (the hips do not turn); the axis set to forward instead of vertical.
- **20-A10 `camera.pitch`.**
  - In front view a point at height y and depth z lands at screen-up y cos p − z sin p (exact to 0.01 px).
  - A side-view spec renders byte-identical at pitch 0 and pitch 30.
  - Mutations, each red: pitch honoured in side view; the sign flipped.
- **20-A11 Volume trunk and depth order.**
  - With `torso: 'volume'` the trunk and head are closed hull paths (`torso.<n>`, `head.<n>`).
  - In front view a trunk nearer the camera than the knees goes in `chest`, drawn after `legs`, with the head in `headF` after `chest`. Check the order in the SVG.
  - `_test_pitch.{n,m}` pin it: front view, `camera.pitch` 15, `torso: 'volume'`, a hinged trunk.
  - Mutations, each red: the depth test inverted; `chest` drawn before `legs`; `headF` dropped.
- **20-A12 The Mistake merge (D-LIB20-TRUNK).** A Mistake that sets `trunk: { yaw }` over a numeric end trunk either keeps the end's flex, or throws with a message naming the spec. The note picks one. Mutation, red: the silent drop (the plain mergeDeep).
- **20-A13 Generated files.**
  - `generate --check` is clean.
  - Every generated file that moved differs only in its GENERATED header and `hashes:` lines, proven by the committed body hashes (D-LIB2-files), whose test is unedited and green.
  - tests/howto/budgets.json is unedited and green. If a budget goes red: stop and report; never raise it.
- **20-A14 Perf and size (recorded).**
  - Golden A build time on main and on the head (median of 3).
  - One `_test_pitch` render with and without the volume trunk: time and SVG bytes.
  - The vendored body.mjs and plate.mjs byte growth.
  - No app chunk grows, because the engine is not bundled (src/** names tools/plates/vendor only in comments, PlateView.tsx:2, usePlateState.ts:2).
- **20-A15 No regression, on the READY head:**
  - `npm run check`;
  - `npm run test:tz` (both zones);
  - `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, detached;
  - CI green on a head that contains the latest main, with the howto-rebuild plan in full mode (vendor paths select all ids, ci/affected.mjs classes 3-4);
  - origin/main merged with a merge commit;
  - the diff touches only write_scope;
  - the HANDOFF block filled.

verification: the PR body maps 20-A1..A15 to a test or run, with commands and outputs. It lists every mutation with its red line. Evidence counts only for the exact head it ran on.

risk_and_recovery:
- **Engine regression on the default path** (any of the six). Mitigation: each field reuses the original expression when it is 0 or off (REPORT.md:11); 20-A2..A5 rebuild every approved byte; the default mutations prove those checks can fail. If one byte moves: Stop 1.
- **L1 blind to pitch** (REPORT.md:29, :34-35). Mitigation: 20-A4's default front-view fixture, and its mutation.
- **A later batch's specs.** Plates drawn now on open PRs (LB1-LB8) set none of the six fields, so with defaults they stay the same. Do 9's pilot A and pilot B checks catch an early surprise. When LIB-20 lands, each open batch merges main, rebuilds twice and re-runs QA (lib-17-card.md, lib-18-card.md, lib-22-card.md).
- **C0 after a pin** (pilot A is checklist item 6 and may pin first). Every pinned row lists tools/plates/vendor/MANIFEST.json, tools/plates/pins.json and golden.mjs with their sha256 (ci/manifest.mjs:53-66; inputs-closure.mjs LOCKED). This card changes all three, so C0 turns red on every pinned row. Mitigation: D-LIB20-L0. Stop 3 if it is not confirmed.
- **The Mistake merge drops flex** (plate.mjs:20-26, :78). Mitigation: D-LIB20-TRUNK and 20-A12. Later batches then cannot lose a trunk flex by accident.
- **The spike's `null` trunk throw** (82ae2d40 body.mjs:92). Mitigation: 20-A5's `null` test.
- **Perf.** The volume trunk adds about 36 + 12 hull sections per pose (spike: strips 0.465-0.9 step 0.012 and 0.874-0.995 step 0.01) [estimate from the spike's code]. Only specs that opt in pay for it. 20-A14 records the cost for LB9's and the fly batches' budgets.
- **File size.** Plates with `torso: 'volume'` carry more path data. No such plate ships here. Each later batch's chunk budget catches it under the budgets rule. The engine is not in the app bundle.
- **claude/howto-options is shared** with the supervisor's plan edits. Mitigation: only docs/howto/technical-plate/** in your commits; `git pull --no-rebase`; never force. The MANIFEST names your own commit's sha, which stays in the branch history.
- **#109 also edits golden.mjs** (verifyChain, :143-166 at `dcac4a38`). This card edits only :217, so the hunks are apart [merge not run]. If they collide, keep both sides.
- **Generated headers conflict** when main moves. Never resolve a header by hand. Take either side, then run generate.mjs and `--check`.
- **The calibrated critic has not seen** any of the spike's renders (REPORT.md:47-48; 6277782675). This card makes no drawing claim. Each exercise's batch draws its plate to the plate bar.

Out of scope:
- Drawing side_plank, russian_twist, dumbbell_fly or bent_over_dumbbell_rear_delt_fly, or bicycle_crunch. Each exercise's own batch draws it under the calibrated panel (D-ER5-GO "Why GO").
- Any spec, batch row, How-to, pin, sheet, layers page or close-up.
- golden B's engine (tools/plates/layers/**).
- The `poly` primitive and the hands. They are on main already.

return:
- the PR number and head sha; the source commit sha on claude/howto-options;
- Do 1's baseline shas;
- the design note's comment id and the D-LIB20-* rulings as applied;
- 20-A1..A15 outputs, and the mutation table with every red line;
- the russian_twist scratch numbers and reproduction command;
- the pinned pages checked, each with its sha and head;
- check, test:tz and gate output on the final head;
- the HANDOFF block.

Resume rule: when you are WAITING or parked, you resume only on the supervisor's exact words 'LIB-20 resume', sent to your session or posted on your PR. A prerequisite post alone is not a resume.

Collision check (card time; re-run at start against every open PR):
| Path in write_scope | Open PRs that touch it at card time | Effect |
|---|---|---|
| vendor/engine/body.mjs, plate.mjs, vendor/MANIFEST.json | #190 (the spike; never merges) | none |
| tools/plates/golden.mjs | #109 (verifyChain) | different hunk; keep both sides |
| pins.json, vendor.test.ts, golden.test.ts, library-core.test.ts, ref-fixtures/** | none | none |
| tools/plates/library/MANIFEST.json | #109's pin commit, after 'PILOT A PIN GO' | D-LIB20-L0 |
| generated header lines (src/howto/**) | every PR that regenerates | regenerate after each main merge |
| docs/COACHING-DECISIONS.md | most open PRs | append-only; keep both sides |
| claude/howto-options docs/howto/technical-plate/** | none (the supervisor edits the plan docs only) | pull --no-rebase; never force |
Checked 2026-10-24 over the 31 open PRs' file lists for tools/plates/{vendor/**, golden.mjs, pins.json, library/MANIFEST.json}, the three tests and ref-fixtures/**.

---

Rulings (D-LIB20-*, proposed in this card on 2026-10-24; 'LIB-20 start' confirms or changes each):
1. D-LIB20-PATH: the vendoring path above. Plan 2 :116-118 and 2.8 step 4 require a source commit on claude/howto-options and a verbatim re-vendor. LIB-25 and LIB-26 did exactly that. The spike's direct edit under a `SPIKE` label (REPORT.md:4-5) is not a re-vendor.
2. D-LIB20-FIXTURE: two new engine test specs, made at the source and re-vendored, each with `.n` and `.m` ref fixtures under HT1-A4.
   - `_test_er5`: a front view. Its normal tile sets no new field (the D-SPIKE-L1-blind default pin, distinct from `_test_front`'s standing pose). Its Mistake sets `root.roll`, `trunk.yaw`, `trunk.lat` and `root.yaw` to non-zero values.
   - `_test_pitch`: a front view with `camera.pitch` 15 and `torso: 'volume'`, and a hinged trunk nearer the camera than the knees, so `chest` and `headF` are drawn.
   - Why: a fixture that only sets fields cannot catch a default change, and a default-only fixture cannot pin the new code paths. The 8 and pilot A use none of the fields.
3. D-LIB20-L0: library MANIFEST.json under this card.
   - (a) If no library row is pinned at the merge head, MANIFEST.json is untouched.
   - (b) If rows are pinned, the `[golden update]` commit rewrites it with `manifestText(await manifestOf())`, the call the pin commit and ci/scratch.mjs:148 use, after 20-A3 shows every pinned page byte-identical. The diff may change only the sha256 of tools/plates/vendor/MANIFEST.json, tools/plates/pins.json and tools/plates/golden.mjs inside existing rows. Entry hashes, row ids and file lists stay. A recorded diff check against the merge base proves it, posted with the commit (CI's depth-1 checkout has no merge base).
   - Why: plan 3.5 says an engine change that moves no approved byte needs no owner session, and its proof is L1. ci/manifest.mjs:14 and agent-guard.sh:69 say rows change only in a pin commit; this is the one other case, and it is tagged `[golden update]` as agent-guard rule 4 requires. The supervisor confirms it before any pin lands, or rules instead that pins wait for LIB-20.
4. D-LIB20-YAW: `root.yaw` turns the pelvis frame about the world vertical through the root, outermost: `Rp = rotY(yaw) · rotZ(roll) · rotX(tilt)`, each factor present only when non-zero. The note may pick another order only with a measured reason (20-A9). Why: "hips and knees swinging with the trunk" (plan 2.4:217-218) is a turn of the hips about the vertical with the feet planted.
5. D-LIB20-TRUNK: `trunk` is a number or `{ flex, yaw, lat }`; absent, `null` and 0 mean 0. The Mistake merge never drops a flex silently (20-A12). SPEC.md states the rule.
6. D-LIB20-SCRATCH: russian_twist's root.yaw render is scratch only (outside the repo, never committed). Post its numbers and command. Its plate is LB9's, under the calibrated panel. This matches LIB-11's Do 8 rule, "render in scratch and commit nothing" (6276882489).

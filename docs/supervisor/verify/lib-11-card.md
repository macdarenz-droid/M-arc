Card LIB-11: pilot B, 5 anchor plates, the `smith` and `legCurlMachine` composers, and the E-R5 renders for the owner's go/no-go (2026-10-19; rulings D-LIB11-* recorded below; critic lib-11-critic.md applied, table at the end). Build-ahead now; the pin phase waits for #109 on main and 'PILOT B PIN GO'. One branch, one PR.

id: LIB-11
model: claude-opus-5-5 (plates, composers, the note and the E-R5 renders are judgement work, plan 3.1)
mode: auto
title: 'Builder: LIB-11 pilot B'
branch: claude/lib-11-pilot-b (new). Your first push opens draft PR 'LIB-11: pilot B (5 anchor plates) [build-ahead; merges in plan slot 10]'.

base: the latest origin/main when the session starts (565ea5a462c19a593493cfbded02c9074deda811, train 30, or later). Never an unmerged head.
- Every main line number cited here was read at `565ea5a4`. Re-read each one on your start head, and use the line you find there.
- Read #109 (pilot A, `48d49bb8` or the head the supervisor names), #265 (LB2, `2dcbac15`), #191 (LIB-12, `c99cb66d`) and #190 (engine spike, `82ae2d40`) only with `git show <sha>:<path>`. To render one of their plates beside a pilot B plate, check that head out into a temporary `git worktree` outside the repo tree. Never commit it, never merge it.
- Code copied from an unmerged head names its source sha in a comment (D-LIB11-SMITH).
- Where the plan (claude/howto-options @ `a5e87d9e`) differs from lib4-cards sections 12-25, the D-LIB13-* rulings or the D-LIB11-* rulings, those win.
- Merge origin/main into this branch, with a merge commit, each time pilot A (#109), LIB-12 (#191), LB1 (#245), LB2 (#265's ship) or VITEST-RPC (#276) lands. The steps that need them wait (build_prerequisites).
- Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on (plan 7 row 10, :768): LIB-8. What that means here:
- Every pilot B plate goes on a sheet only after the anchors it uses are pinned on main with pilot A (plan 3.1:258-264; D-LIB-O5 14.8 point 5):
  - smith_machine_bench_press: the supine-bench anchor dumbbell_bench_press (pilot A, approved @ `013f84e`, 21.4);
  - push_up: the plank-class anchor plank (pilot A, approved @ `013f84e`) and the floor-horizontal convention D-LIB8-floor;
  - cable_fly: the engine-drawn front-view anchor upright_row (pilot A, approved @ `94c551f`, 21.6; plan 2.2:161);
  - crunch: the floor-horizontal convention D-LIB8-floor (pilot A's plank and mountain_climbers);
  - seated_leg_curl: no pilot A anchor (census closest: golden leg_press);
  - any id R-PB makes drawable:false: the drawable-fault convention (plan 1:85-88), anchored by dumbbell_biceps_curl's F7 (plan 2.2:162; D-LIB8M-TF1 4) on pilot A.
- Not in the plan row, but real (D-LIB11-RPB): the pilot B research head; LIB-12 #191 on main for the sheet's hand kinds; the spike #190 and the supervisor's E-R5 scope text for the renders; VITEST-RPC, or the supervisor's RPC rulings, for READY.

build_prerequisites (the supervisor posts each on the PR or on claude/sup-lib4-cards, or sends it to your session while no PR exists. If one is missing when you reach its step, do any other permitted step; set WAITING only when none is left, per D-LIB-LANE-ACTIVE):
- To start: 'LIB-11 start', with the active-builder count, LIB-11's place in the freed-slot queue, and who parks if LIB-5 returns with CHANGES or LIB-10 resumes after pilot A merges.
- Research: R-PB is READY @ `632cfbae` (#277) and its focused verify is running. The supervisor posts 'PILOT B research head <sha>' after it merges into claude/libht-research.
- At start (no research head needed): Do 1, Do 3, Do 4, Do 5 a0 and Do 2 a (the right-poses slice: smith_machine_bench_press, seated_leg_curl, crunch, cable_fly). push_up is bulk: it waits for 'PILOT B BULK GO'.
- Do 5 a, Do 2 b (the Mistakes slice), every Mistake and every tell: 'PILOT B research head <sha>'. Until then no Mistake is drawn (D-LIB11-RPB).
- Do 5 b: 'PILOT B MAPS RULED @ <sha>', naming the research head, after your 'PILOT B NOTE AMENDED'. 'PILOT B NOTE RULED' alone does not open Do 5 b.
- Do 6 bulk: 'PILOT B BULK GO', after the supervisor's look at the Mistakes slice.
- Do 7 evidence: 'CARD FIELDS VERIFIED @ <sha>' for the 5 cards.
- Do 8 (E-R5 renders): 'E-R5 SCOPE RULED' (the supervisor's proposal text in plan 2.4 and row 20, D-LIB11-ER5) and the research head.
- Do 10 (sheet): #109 and #191 on main and merged in.
- Do 11 (pin): 'PILOT B PIN GO @ <head>' (D-LIB8M-PIN pattern), with #109 on main and merged in (D-LIB8M-CHAIN's verifyBatchChain, D-LIB8M-PAGES' shape), and D-LIB11-SCRATCHIDS ruled.
- A14 and READY: VITEST-RPC (#276, ruled and building) is on main and merged in, or every red caused by the RPC timeout has been ruled by the supervisor. Such a red is never re-run (D-LIB8M-RPC (b)).

merge_prerequisites (the supervisor merges this PR in a train):
- Every lower-numbered item on the owner's checklist has merged (AGENTS merge rule): plan 7 rows 1-9 with the supervisor's sub-slots, in today's order: LIB-5 Do 9 → LIB-6 #181 + LIB-6-PM → LIB-7 #193 + LIB-7-FIX → LIB-7b (6b) → LIB-12 #191 + LIB-12-FIX (6c) → LIB-8M #109 (7) → LIB-5v (7a) → LIB-7c (7b) → LB1 #245 (8) → LB2, LIB-10's ship (9). Only the stalled-batch rule (plan 6.3, owner decision 8) can move LIB-11, as D-LIB8M-ORDER allowed for #109 (D-LIB11-SLOT).
- Pilot A is on main, with the anchors in depends_on pinned.
- 'PILOT B PIN GO' is posted, and the pin commit equals the GO on the pin paths in write_scope only.
- A fresh Opus review PASS against this card, on that exact head.
- Every check green on a head that contains the latest main, with `library: full` in gate-verdict (D-LIB4-MODE; D-LIB4-VERDICT). A red caused by the RPC timeout is ruled by the supervisor, never re-run.
- Every D-LIB4-ENTRY condition holds before any pilot B id is approved-plate, pinned or in batches/.
- The app after the merge: nothing changes on screen. The pinned ids are stage 'approved-plate', status 'pending', no button (plan 6.1:665; D-LIB8M-GENERATED). HT-11 is not needed: a pinned row adds no chunk.
- Not merge gates (D-LIB11-SLOT): the owner's E-R5 go/no-go, the hand-kind looks and the text-only feel state. They are recorded on the sheet and gate LIB-20, LIB-12's key shipping and the layers lane.

Rulings this card relies on. These are summaries; where the posted text differs, the posted text wins.
- D-LIB9-ENGINE: specs import only tools/plates/library/engine.mjs (the vendor engine). poly and flat palm are allowed. Nothing imports tools/plates/layers/.
- D-LIB9-AUTHORQA: candidateOf(id, { all, authoring: true }) (candidate.mjs:84). Its default path stays unchanged.
- D-LIB10-PA's mode rule: every pilot B row is mode 'H' (candidate.mjs:94 throws for 'P'). The template-parent link lives on later children.
- D-LIB11-TEMPLATES (ruling 9): LIB-11 builds no template. CFLY, PUSHUP and SUPCORE are built by their batch cards after pilot B is pinned, proven against the pinned parent, as D-LIB10-TEMPLATES did for BENCH and SEATPRESS (amends plan 3.1:249).
- D-LIB10-BENCH-H: BENCH is not built, and PARAMS has no Smith value (derive.mjs:4-12: neither load.primitive nor bar.kind names one). smith_machine_bench_press is H (plan 6.2 marks it T).
- D-LIB9-CARDFIELDS with 13 Q1 (topFault) and Q3 (tempo map); D-LIB8M-TEMPO (one map rule for every batch); D-LIB8M-FACTS with 22's exact scope (D-LIB10-CF1); D-LIB5-TEMPO8 rules 10-15 (14.7); D-LIB9-FACTPOSE.
- LR-31 rollout (RULINGS.md row LR-31): a card's rankNote and pick are settled "before its batch's D-LIB9-CARDFIELDS fields are written". R-LB2-20 deferred smith_machine_bench_press and cable_fly to this pass (R-PB).
- D-LIB9-F5 (14.4): `exemptions: ['F5']` only for the selected Mistake tell in Midnight at exactly 3.57.
- D-LIB8-floor (#109 5950197626): floor-horizontal plates use the approved floor line, scale up to ×1.35, and raise F1 for the owner's named yes.
- D-LIB9-CLONE (13.2): copy, never import, a pilot A or LB2 spec; every copied root finder throws on a bracket with no root; re-derive each bracket and record what it solves to.
- D-LIB8M-CARDTRUE (16; 21.2-21.6): the plate follows the card. A plate with no card-true drawing that passes every hard check, or that fails its last critic run, is HELD: stage review, off the page, rows and pin, on the follow-up list, reported. Never exempted.
- D-LIB8M-PAGESET: a held id gets no row and is off the page.
- D-LIB13-LANDMINE-2 and D-LIB13-TBAR (#274 6265033303, 6265126577, 6265616772): research first (route 1), HELD second (route 3). A drawing convention came only after research recorded the size as a gap on the cards: one real catalogue value, recorded in DESIGN.md with its source, and a sheet flag "<part>: drawing convention (<value>)". Never a moved trace, trim, landmark or threshold, and never a value picked to pass a check without the supervisor's ruling.
- D-LIB8-shrug, Q-D5-3 and LIB-ZOOM (lib-zoom-card.md:12): a right pose is never moved or exaggerated to pass PQ-H3. A small-motion plate is HELD until LIB-ZOOM's convention is ruled for it. No zoom view shows an angle number.
- D-LIB10-SKULL1 and Q-D5-4: 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key.
- D-CRITIC-CAL3 (13.5), with 13.7's facts diff and 13.6's segment-length rule; D-LIB10-PANEL1 (24) and D-LIB10-ANCHORS (15 item 8) for the anchors.
- D-PILOTA-R5 and D-LIB8M-CARRY: an approval counts only for the head it ran on.
- D-LIB-O5 (14.8) and D-LIB8M-CHAIN, -ENTRY, -PIN, -PAGES, -GENERATED, -QA, -SHEET, -CARDS (16): the pin mechanics, as pilot A used them.
- D-LIB12FIX-SHIP (2), D-LIB12FIX-SLOT (b) and D-LIB12FIX-ROPE (20): palm-flat, ball-contact and battle-rope are shown on pilot B with the R8 panel's scores; battle_ropes' camera is ruled on this look.
- D-LIB-SCRATCHIDS (lib4-cards :1098-1103) and D-LIB11-SCRATCHIDS (to be ruled; see Supervisor follow-ups).
- D-LIB-LANE-ACTIVE: you hold a LIB drawing slot from your start. WAITING only when no permitted step is left.
- D-LIB9a-HOWTOID: a How-to source here holds only `research` and `id`.
- D-LIBHANDS-COUNT (20): binds only a card that adds hand modules. LIB-11 adds none.
- D-SPIKE-status (COACHING-DECISIONS.md:2137 on main): pitch, volume trunk and trunk.lat are proposals until the supervisor updates plan 2.4 and row 20 and the owner answers on renders.
- D-LIB11-RPB, -ER5, -RENDERS, -TEXTONLY, -HANDS, -ONECARD, -SMITH, -SLOT, -TEMPLATES and -SMALL: ruled (section "Rulings recorded").

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Every plate meets the bar of the 8, pilot A, LB1 and LB2: every plan 3.4 item at 4 or more (R8 and R9 stay unscored, as in 13.1); R10 on the tier-A smith_machine_bench_press.
- No check, envelope, threshold, rubric item or test is relaxed, skipped or exempted to save time. A plate below the bar is redrawn, and you report the time it cost.
- Every word on a plate follows the owner's UI copy rule (AGENTS.md, 2026-10-01) and PQ-H8.

shared-file owners:
- None of the AGENTS shared add-only files is touched.
- tools/plates/vendor/**, tools/plates/layers/**, tools/plates/pins.json and tools/plates/golden.mjs: read only. The spike's changed files never enter this branch or a worktree of main (Do 8).
- Pilot A's files (#109), LB1's (#245), LB2's (#265), LB3's (#274), LIB-12's hands/** (#191) and the spike's spike/** (#190): read only. Composers on main (eq/parts.mjs, eq/rope.mjs) may be imported; pilot A's composers (inclineBench, safetyArms, pecDeck) only once #109 is on main, and never edited or forked (D-LIB10-NOTE Q2 2). Specs are copied, never imported.
- candidate.mjs, registry.mjs, derive.mjs, plates-page.mjs and qa/** (qa/param-ranges.json included): untouched.
- docs/research/howto/cards/** and quotes/** belong to claude/libht-research. Here they are byte copies of the 5 pilot B cards from the named research head, plus their three keys. The supervisor merges the field commit back.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. Your first push carries the note and opens the draft PR. Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full qa.mjs run, the E-R5 renders) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`. While it runs, check its log about every 20 minutes so the container is not reclaimed. A run lost to a reclaim, a timeout or a session limit is never evidence: re-run it whole on the same head.
- A CI failure on `[vitest-worker]: Timeout calling "onTaskUpdate"` is a real defect (D-LIB8M-RPC (b)); its fix is VITEST-RPC. Keep each test's child processes well under vitest's 60 s limit. Never re-run to green.

hard card: the design note and both slices come before any bulk drawing.

outcome: pilot B's anchor plates, the `smith` and `legCurlMachine` composers and the cards' machine fields, pinned on main at stage approved-plate with no button; plus the E-R5 renders and the pilot B hand kinds on the owner's sheet.
- Every pinned plate passes every LIB-3 hard check (runQa, node and browser halves), PQ-H10 included.
- The raised LIB-3 flags are exactly the ruled set. Every non-F5 flag carries the owner's named yes; F5 follows D-LIB9-F5.
- The cards' machine fields have the content verifier's VALID verdict.
- A plate that cannot pass card-true is held and listed, never exempted.
- Nothing ships: no button, no layers page, no app change.
deliverable: the specs, composers, rows, tempo map, pilot B build, QA and sheet scripts, design note, card copies with their keys, tests, and (pin phase) the batch file, page config, golden chain and MANIFEST rows.
evidence: the per-id QA table at the head sha; the plates-page sha256 from two identical builds; the unit tests with their mutations; the recorded leak and ceiling checks (A7); the content verifier's verdict; the critic's verdict; the E-R5 renders with their reproduction inputs (A15) and the hand renders with their shas; after the pin, A8-A8d.
finish:
- 'PILOT B PLATES READY @ <sha> (plates page <sha256>)' is posted, the critic run is VALID with every plate at the bar or held, and the supervisor's per-exercise approvals are recorded (head-only);
- 'PILOT B SHEET READY' is posted and the sheet has gone to the owner, with the E-R5 renders or, without 'E-R5 SCOPE RULED', an E-R5 status line (the renders then follow on a changed-ids sheet, plan 3.5; neither gates the pin);
- 'PILOT B CLONE DIFF' is posted and ruled;
- the pin commit equals 'PILOT B PIN GO', and the PR is retitled '[ready for review]'.
Then stop. The supervisor merges it in slot 10. You will notice: nothing in the app.
forecast [est]: about 40 Opus-hours at plan 9's pace (:869-870, :872): 5 H plates × 4 h; smith 3 h (rails, hooks, stops, a moving bar) and legCurlMachine 2 h; QA and critic 0.75 h per id; E-R5 re-renders about 3 h for side_plank and russian_twist, plus about 2 h per extra E-R5 id (dumbbell_fly, the rear-delt fly); note, cards and tests about 5 h; sheet and pin about 4 h. LB1 needed 4 review and 4 critic rounds; LB2's first panel passed 5 of 5; allow up to twice that. Waits this card cannot forecast: R-PB's verify and merge (expected within about 2 hours), #109's pin (the owner's pilot A flag answers are still due), #191's merge, VITEST-RPC, 1-2 critic rounds, the owner's sheet answers.

Pilot B ids (plan 6.1:659-664 @ `a5e87d9e`; census docs/howto/library/inputs/census.json @ `4a9fd86`; card facts read at research `892d6516`; the named research head decides):
- smith_machine_bench_press (tier A; plan "(T, pB)" under BENCH in LB6, :705; H here, D-LIB10-BENCH-H; census view side, pose supine, gap `smith`; card parent barbell_bench_press). Start: bar unhooked on straight arms over the mid-chest (c2, c5). End: bar touches the mid-chest, elbows at about 45 degrees (c3). Equipment: rails, bar, hooks, "completely straight bar path" (c8); safety stops just below the bar's lowest point (c4, c3). Mistake at `892d6516`: back arched (c7), no rankNote; R-PB reports PICK CHANGED (R-LB2-20 expected elbow flare). R10: stops set, bar path clear of the neck. Tempo 1/2/0 (c12, ACSM, WEAK).
- cable_fly (tier B; P:CFLY in LB6; census view front, stand; existing parts: two cable columns at ±x, single handles). Mistake: elbows bending into a press (c6); R-PB reports no pick change. Tempo 1/2/1 (c5 sources the 1 s pause at the front; c12).
- push_up (tier C; P:PUSHUP in LB7; census view side, plank pose; floor only; palm-flat hand). Mistake: hips sag and the low back arches (c5, "most common"). Tempo 1/2/0 (c13, WEAK convention). Floor plate: D-LIB8-floor, F1 expected.
- seated_leg_curl (tier C; LB8; census view side, seat; gap `legCurlMachine`, compose). Start: knees in line with the pivot (c1), thigh pad just above the knees (c2), ankle pad just above the shoes (c3). Mistake at `892d6516`: ankle pad set high on the calves (c3; R-W1-7), a pad setting that LR-31 excludes; R-PB reports PICK CHANGED. Tempo 1/2/0 (c7, c13; tempo.text names it a convention).
- crunch (tier B; P:SUPCORE in LB9; census view side, supine floor; the floor-supine anchor itself). Start: heels about 30-45 cm from the tailbone (c1). End: upper back and shoulder blades just off the floor (c3, c4). Mistake: jerking up with the hip flexors, pelvis tipping, low back lifting (c6, "usually"). Tempo 1/2/1 (R-PB's LR-33 fixes the pause claim). Floor plate: F1 expected. Small-motion risk (Do 1, Do 2).
- E-R5 render subjects (not plates; no row): side_plank (tier C; front; hold '5-60 s', c9) and russian_twist (tier C; front). R-PB reports for both: top fault changed, plate.mistake unchanged (hips sinking; hips and knees swinging), drawable false. The spike's renders (#190 `82ae2d40`, REPORT.md) drew russian_twist's Mistake as the arms-only twist, which is not the card's plate.mistake, so both are re-rendered here.
- Composers: smith (users: smith_machine_bench_press, smith_machine_incline_press, smith_machine_shoulder_press, smith_machine_shrug, smith_machine_squat; plan 2.1:137) and legCurlMachine (users: seated_leg_curl, lying_leg_curl, standing_leg_curl; :138). The composer is approved on its anchor before any other user (plan 2.1; 3.1:258).
- The R-PB report lines above are from 'PB RESEARCH READY' @ `632cfbae`, before its verify. Only the named research head counts.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On claude/sup-lib4-cards (`a3c69378` or later): this card; pb-research-card.md; lib-8-merge-card.md (the pin pattern: Do 4, 8, 9, 12, 13, the owner's sheet, A1-A19); lib-13-card.md and lib-10-card.md (build-ahead pattern); lib-zoom-card.md; lib4-cards.md sections 12 items 1, 2, 4, 6-9; 13 (Q1-Q5, 13.1-13.8); 14.4, 14.7, 14.8; 15 and 15.1; 16; 20 (D-LIB12FIX-SHIP, -SLOT, -ROPE); 21-25.
- On #274: D-LIB13-LANDMINE-2 (6265033303, 6265126577) and D-LIB13-TBAR (6265616772). On #277: the R-PB table and its PICK CHANGED lines.
- The plan @ `a5e87d9e`: 1 (:62-110, the conventions); 2.1-2.4 (:120-195); 3.1-3.5 (:232-372); 4.2 (:420-441); 6.1-6.2 (:633-727); 7 rows 10, 17, 20 (:768, :775, :778); 8 decisions 5 and 7 (:820, :824).
- #109 @ `48d49bb8`: DRAWING-GUIDE.md (:29, the trace point); specs dumbbell_bench_press, plank, upright_row, pec_fly, mountain_climbers; eq/safetyArms.mjs; pilot-a/build.mjs (sheet part), plates.json, MERGE.md, tempo.json; batches/pilot-a.json; pages/pilot-a.json; tests/howto/lib8-pin.test.ts.
- #265 @ `2dcbac15`: lb2/DESIGN.md (sections 1, 4, 7, 8, 13), lb2/build.mjs, lb2/qa.mjs, specs/barbell_bench_press.mjs and close_grip_bench_press.mjs (its `flare` Mistake), eq/declineBench.mjs, tests/howto/lb2-plates.test.ts.
- #190 @ `82ae2d40`: tools/plates/library/spike/REPORT.md, render.mjs, specs/*.mjs; `git diff --name-only c19805aa 82ae2d40` (its changed set).
- #191 @ `c99cb66d`: hands/hand-palm-flat.mjs, hand-ball-contact.mjs, hand-battle-rope.mjs, pairs.mjs (renderPair :254), words/*.json.
- Main: derive.mjs (PARAMS :4-12); candidate.mjs :76-130; registry.mjs :30-56; build-page.mjs :84-85 (verifyVendor); golden.mjs :27, :42-58, :115-116; qa/index.mjs; qa/node.mjs; qa/envelope.json (traceLenMin 22.11, deviationMin 11.39, H9lineTypes barbell, cable, cableColumn, line, stack); ci/scratch.mjs :18-39; eq/parts.mjs; vendor engine SPEC.md and equipment.mjs.
- Research on the named head: cards/ and quotes/ for the 7 ids, CARD-V2.md, RULINGS.md (LR-31, LR-33, LR-36), verify/g5.md, verify/w1.md.

design_reference: DRAWING-GUIDE.md; pilot A's approved plates (dumbbell_bench_press for the bench, plank and mountain_climbers for the floor class, upright_row and pec_fly for the front view); LB2's approved barbell_bench_press and close_grip_bench_press (@ `2dcbac1`, D-LIB10-CRIT1); the 8 (leg_press for the seated machine); the plan 3.4 rubric; the census views.
connectivity: none. Node and local Chromium (/opt/pw-browsers/chromium) only. Specs and composers read no files and fetch nothing. Facts come only from the copied cards and quotes. No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/specs/<id>.mjs for the 5 (row src 'library/specs/<id>.mjs');
  - tools/plates/library/eq/smith.mjs and eq/legCurlMachine.mjs, plus any composer the ruled note names, one new file each;
  - tools/plates/library/pilot-b/{rows.json,tempo.json,build.mjs,qa.mjs,sheet.mjs,plates.json,DESIGN.md,cards.sha.json}. rows.json holds batch 'PILOT-B', censusRef 4a9fd86, the drawn non-held ids only, mode 'H', view per row, stage drawing or review only. plates.json holds `plates[]` (tier, closest, view, class, `held` per held id), `cards`, `handsNote` and `hands[]`, as pilot A's;
  - tools/plates/library/pilot-b/evidence/lib12-<key>-silent-black.png and -paper.png for palm-flat, ball-contact and battle-rope, plus lib12-palm-flat-hand-ahead-silent-black.png and -paper.png (8 files, Do 10). Nothing else under evidence/;
  - tools/plates/library/howto/lib_<id>.howto.mjs for the 5 (`research` and `id` only);
  - docs/research/howto/cards/<id>.json and quotes/<id>.json for the 5: byte copies, then the three keys on cards/;
  - tests/howto/lib11-pilot-b.test.ts (node only).
- Pin phase only (Do 11), in one commit tagged `[golden update]`: tools/plates/library/batches/pilot-b.json, tools/plates/library/pages/pilot-b.json, tests/howto/golden/library/pilot-b.json, and the pilot B rows of tools/plates/library/MANIFEST.json; the deletion of pilot-b/rows.json; tests/howto/lib11-pilot-b.test.ts (ceiling block → pinned block only); pilot-b/build.mjs, qa.mjs and sheet.mjs switched from rows.json to the registry's batches/pilot-b.json rows (no other change); under D-LIB11-SCRATCHIDS (a) only, the ruled lines of tools/plates/library/ci/scratch.mjs. Generated files change only through `node tools/plates/generate.mjs` (coverage.ts: one stage line per pinned id; ids.ts, loaders.ts, ids-node.mjs and the plates-plugin outputs: line 1).
- docs/COACHING-DECISIONS.md: append only. On a main merge keep both sides there, and, after the pin, in tools/plates/library/MANIFEST.json.
- Plates pages, sheets, QA reports and the E-R5 renders are not committed. build.mjs, qa.mjs and sheet.mjs write to a temp directory and print the sha256 and the table.

reserved_paths:
- tests/howto/golden/** and tools/plates/library/batches/**, pages/** and MANIFEST.json, except the pin commit's paths above.
- src/** (every generated file included, except through generate in Do 11), tools/plates/gen/** and tools/plates/generate.mjs.
- In tools/plates/library/: {derive,candidate,registry,plates-page,build-page,layers-spec,inputs-closure,batch-golden,engine,bodies,ids-encoding,ids-node,chunk-set,fidelity}.mjs and the folders qa/, hands/, render/, pilot-a/, lb1/, lb2/, lb3/, spike/, fidelity/, ci/ (except D-LIB11-SCRATCHIDS (a)'s lines), shared/, lint/, research/, scale/ and budgets/. tools/plates/golden.mjs and tools/plates/pins.json.
- Existing eq files and specs (main's, pilot A's, LB1's, LB2's, LB3's).
- tools/plates/vendor/** and tools/plates/layers/**.
- docs/research/howto/*.json; every card and quotes file but the 5 (side_plank and russian_twist included).
- tests/howto/library-lint.test.ts, tests/howto/library-ci.test.ts, every other existing test, scripts/**, tests/theme.test.ts, src/ui/styles.css, .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The paths of LIB-20, LIB-ZOOM, LIB-12-FIX, LIB-7c, LIB-5 Do 9, LIB-5v, HT-11, VITEST-RPC, LIB-13 and the LIB-8 merge card.

Do:
1. The design note, in pilot-b/DESIGN.md, posted with your first push as 'PILOT B NOTE READY @ <sha>'. One row per id:
   - mode H, with the reason (D-LIB10-PA; for smith, D-LIB10-BENCH-H and the missing Smith PARAMS value);
   - the clone source (pilot A or LB2 spec and head; D-LIB11-SMITH: smith copies barbell_bench_press @ `2dcbac1`, with dumbbell_bench_press as the supine anchor), the census closest, and each anchor's approving sha;
   - the composers: smith (rails, bar, hooks, safety stops; c8's straight bar path) and legCurlMachine (seat, back pad, thigh pad, ankle-pad lever about a pivot level with the knee, side handles; c1-c5). For each, every later user and what it will need (incline bench under the bar, standing squat, shrug height; lying and standing curl lever), so the anchor is not redrawn for them. Which parts move between end and Mistake, and whether each is `poly` or an H9 line type (PQ-H9; plate.mjs:213). Smith's stops are drawn by smith.mjs itself from primitives, never a fork of pilot A's safetyArms;
   - the pose-class and convention anchors each id uses (depends_on);
   - the expected flags, in two lists:
     - LIB-3 flags (A4's equality): F5 on every plate (14.4); F1 on push_up and crunch (D-LIB8-floor); F7 only where R-PB makes drawable false; any other with its reason;
     - sheet flags: each drawing convention the supervisor rules (D-LIB13-LANDMINE-2), and the two new rigs;
   - smith's R10 items (stops set, bar path clear of the neck, bar hooks);
   - the hand zoom and the pair key that would draw it (palm-flat for push_up; the closest LIB-7 key for smith's bar and cable_fly's handles). Build none;
   - the census view;
   - the tempo map for the supervisor to rule (Q3; 14.7; D-LIB8M-TEMPO), and a pose map wherever the drawn start differs from the card's plate.start (the Mistake is drawn against the end pose, plate.mjs:78, :208);
   - the facts plan under D-LIB8M-FACTS and 22's scope: at least smith's end elbow angle (about 45 degrees, c3) and crunch's heel distance (30-45 cm, c1: midpoint 37.5 cm with a note, since 15 cm ≥ 2 × LIMITS.cm); if the report has no such angle and the plate no measure, report it and invent no key;
   - "Unsourced numbers" for every size the card does not give (smith rail spacing, hook heights and the rail angle 0° (vertical); the leg-curl lever length; column height and spacing), and which of them are proposed as a drawing-convention flag;
   - a template feasibility screen, non-binding, for CFLY (low_to_high and high_to_low need a pulley height), PUSHUP (incline, pike, diamond) and SUPCORE (5 children): which differences PARAMS (derive.mjs:4-12) can express, and which would need a new key. Draw each parent so a later template can copy its code unchanged;
   - the small-motion pre-check (D-LIB11-SMALL): the note fixes crunch's px/m by D-LIB8-floor's fill-the-width rule (cap ×1.35) and its trace point by DRAWING-GUIDE.md:29 (the shoulder-blade lift, c3 and c4), before anything is measured. Neither moves after the measure;
   - the E-R5 render plan (Do 8);
   - risks.
   Wait for 'PILOT B NOTE RULED' before any bulk. After 'PILOT B research head', post 'PILOT B NOTE AMENDED @ <sha>' with the Mistake rows, the fault→key map (13 Q1(a)), and every tempo-map or pose-map change from R-PB's 'PICK CHANGED' and 'STOP' lines. Wait for 'PILOT B MAPS RULED @ <sha>' before Do 5 b.
2. The slices, before any bulk:
   a. At start: 'PILOT B SLICE READY @ <sha> (right poses)': smith_machine_bench_press with eq/smith.mjs (tier A, the smith anchor), seated_leg_curl with eq/legCurlMachine.mjs (its anchor), crunch (the floor-supine anchor and the small-motion risk) and cable_fly (the front-view anchor and the clutter risk). Post 390 px renders in Paper and Silent Black beside dumbbell_bench_press, plank and upright_row (pilot A, from a temporary worktree) and leg_press (golden), A2's composer tests and the two-build plates-page sha256. No QA table: a plate with no Mistake breaks extractPlates for the whole page (golden.mjs:115-116), so QA starts with the Mistakes slice. crunch's trace length may be read earlier from the engine report at the plate's px/m by a scratch script, never committed and never posted as QA.
   b. After the research head: 'PILOT B SLICE READY @ <sha> (Mistakes)': the four slice plates' Mistakes, the authoring QA table, and crunch's H3 trace and deviation. Before Do 5 b, every id shows H6:no-card and F7 'no card top fault'; these are expected.
   The bulk (push_up, then any remaining drawing) starts on 'PILOT B BULK GO'.
3. Composers, each `(lm, ctx) => item[]` returning PRIMITIVES types only, in LB2's declineBench pattern (existing primitives and eq/parts.mjs helpers; assumed sizes under "Unsourced numbers" in each spec that uses it). No file reads. A per-pose drawn-item test on the real spec (13.1), as lb2-plates.test.ts:106-174.
4. The build, QA and sheet hooks, copied from lb2/build.mjs and lb2/qa.mjs @ `2dcbac1` (and pilot-a/build.mjs's sheet part for sheet.mjs). Both read pilot-b/rows.json through registry rows() (registry.mjs:30), with `batches` set to every batches/ file plus ['tools/plates/library/pilot-b/rows.json', <its data>], passed as groupsConfig's and candidateOf's `all`. Never write under batches/ before Do 11. Never import anything under lb2/ or pilot-a/.
5. Cards (the 5):
   a0. At start: copy the 5 cards and quotes byte for byte from `892d6516` (LR-29 verified) and commit them, with pilot-b/cards.sha.json naming `892d6516` and each copy's sha256. lb2/build.mjs's cardOf reads them for each row's sources (lb2/build.mjs:17-23 @ `2dcbac1`). If 'PILOT B research head' is already posted when you reach this step, copy from it instead (a).
   a. When 'PILOT B research head <sha>' is posted: copy the 5 cards and quotes again from it, byte for byte, and update cards.sha.json to that head. That is the only diff in the copied data.
   b. After 'PILOT B MAPS RULED': add top-level plateFacts, tempo and topFault per D-LIB9-CARDFIELDS, 13 Q1, the ruled maps, 14.7's form rules and D-LIB8M-FACTS with 22's scope. The three keys go in as one text block before the final brace (D-LIB8M-CARDS); the test replaces that block by `\n}` and compares the bytes with the research-head copy. Each value names the claim whose quote states it. No value comes from a spec. Post 'PILOT B CARD FIELDS READY @ <sha>' and wait. The supervisor runs a fresh, blind Opus verifier on a copy of the 5 cards, their quotes, pilot-b/tempo.json, the ruled maps and the drawn tells, with a rules file, Q1's two topFault checks and one planted wrong number. Fix only what it names, re-run qa.mjs for the ids that changed (H6 must pass), and post 'PILOT B CARD FIELDS FIX @ <sha>'. A focused re-verify with a new plant runs on the changed cards. 'CARD FIELDS VERIFIED @ <sha>' follows.
   - If the research head moves for a pilot B card: copy it again, re-apply its keys, update cards.sha.json; the verifier re-runs for that card and its plate is QA'd again.
6. Draw, following DRAWING-GUIDE.md: callouts from the card's checkpoints, tells from its mistake, the ruled tempo. The slice's right poses at start; Mistakes after the research head; push_up on BULK GO. LB1's and LB2's lessons, each with a drawn-item test where it applies (A13):
   - The Mistake reads as a pose outside the solid end figure: red parts clear it by at least 6 px, or are red dashed lines over it (13.1; 13.7). An arch on a bench follows 21.6's lesson: one red dashed back curve off the pad with a visible gap, never a dome over the belly.
   - 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key. A one-tell plate needs a ruling.
   - Callout boxes in open space; no leader within about 6 px of the Trace, a bar, a rail, a cable or the lever (13.1). cable_fly's two columns and cables are the clutter risk: it is in the slice for that reason.
   - A hidden start part is a dashed phantom (Q2 (c)). Ghosts follow the real joint path; a straight limb never bends between poses (13.3).
   - Tests assert on drawn items, never on the spec's own formula.
   - A cue table per id: the card's `what` and claim, the plate cue, the word count (Q-D5-6).
   - If one card's facts cannot all hold on the body at once, post 'PILOT B STOP <id> @ <sha>' with the per-card conflict. Never tune a value off the card.
   - If an unsourced size decides a hard check, post the measured table and stop that plate ('PILOT B STOP <id> @ <sha>'). The supervisor rules research (route 1) or a drawing convention (D-LIB13-LANDMINE-2, -TBAR). Never pick a value to pass a check without that ruling.
   - Small motion: if a card-true trace or Mistake deviation is below the envelope, the plate is HELD (never exaggerated, never zoomed here) and joins the LIB-ZOOM question (D-LIB11-SMALL). Post 'PILOT B HELD <id> @ <sha>' at once: a held anchor leaves its composer or pose class without an anchor, and its batch re-plans.
7. QA (after the verifier's verdict): build.mjs builds the plates page twice into a temp directory, and the bytes must match. qa.mjs runs runQa's node and browser halves per id and prints the table (hard checks, raised flags with F5's element and value, metrics). A measured LIB-3 flag that differs from the ruled set is posted with its value and range and ruled before READY. No flag is dropped or exempted.
8. E-R5 renders (scratch, never committed; D-LIB11-RENDERS), after 'E-R5 SCOPE RULED' and the research head:
   - Check #190's head `82ae2d40` out into a temporary worktree outside the repo tree. It carries the spike's full changed set as the spike has it: vendor/engine/body.mjs, vendor/engine/plate.mjs, vendor/MANIFEST.json and tools/plates/golden.mjs (`git diff --name-only c19805aa 82ae2d40`), so verifyVendor passes there. Never copy those files into this branch or into a worktree of main, and never edit pins.json, golden.mjs or MANIFEST.json anywhere. Add only new scratch specs and helpers under that worktree's tools/plates/library/spike/. Never stage, commit or push from it.
   - Draw side_plank and russian_twist from their cards at the research head: the right poses and each card's own plate.mistake, never the arms-only twist. Where the card is drawable false, the post says the top fault is not drawn (as F7 would). russian_twist draws clasped hands and no ball: its variantLine says every line holds with clasped hands too (c2), and medBallOptional is LB9's composer. No composer is built.
   - Re-render dumbbell_fly (pitch 45) and bent_over_dumbbell_rear_delt_fly (pitch 15 with the volume trunk) from the spike's own specs, as the scope text names them (D-LIB11-ER5), noting any difference from their current cards' plate.mistake.
   - Render at 390 px in Silent Black and Paper, normal and Mistake. Run the engine report and post its ok and contact numbers.
   - Post 'PILOT B E-R5 RENDERS @ 82ae2d40' with: the spike head sha; the sha256 of each of the four changed files; each PNG's sha256; which engine fields each render uses (roll, yaw, lat, pitch, volume); the full text of each scratch spec and helper; the scratch diff (`git status --porcelain` and the new files); and the exact render command. With these the supervisor reproduces the PNG sha256s from `82ae2d40` plus the posted text. If a card's Mistake needs a field the spike lacks (for example a pelvis turn for "hips and knees swinging"), say so; never draw another fault instead.
9. Post 'PILOT B PLATES READY @ <sha> (plates page <sha256>)' with the per-id table. The supervisor runs the calibrated critic (plan 3.4; 13.5):
   - Anchors: golden B's pull_up and lat_pulldown until pilot A is pinned (D-LIB10-PANEL1); after the pin, D-LIB10-ANCHORS' pair (barbell_overhead_press, pull_up) with its one-item exception. 13.7's facts diff runs first. A hidden anchor is never a visible reference.
   - Visible references: the PA2 reference plus the depends_on anchors at their approving heads.
   - Two plants rebuilt on pilot B plates at the head (an R4 leader on the wrong landmark, an R5 Mistake drawn the wrong way); each passes report ok.
   - The E-R5 renders join the panel as advisory tiles: scored, never approved.
   - Fix only what the critic names; a fix never edits a card. If a fix would break a hard check, a pinned test or a ruling, post 'PILOT B STOP <id> @ <sha>' with the evidence. One fix round, posted as 'PILOT B FIX READY @ <sha>', then one fresh recheck on the changed plates. A plate that fails its recheck is held ('PILOT B HELD <id> @ <sha>').
10. Sheet (after #109 and #191 on main and merged in), in sheet.mjs, D-LIB8M-SHEET's pattern:
    - Each plate's aside lists LIB-3's flags from the Do 7 report (a JSON in the scratch folder, passed in, never committed) as its only F-lines, with "predicted / measured" where they differ (21.3 point 3). Sheet flags (drawing conventions, new rigs) are separate lines. The critic's scores replace 'pending'.
    - Hand renders: palm-flat (push_up, both faults: 'cupped-palm' and 'hand-ahead'), ball-contact (wall_ball) and battle-rope (battle_ropes), with renderPair (pairs.mjs:254; `{ fault }` for the second palm-flat fault) at 390 px in Silent Black and Paper from main, saved as the 8 evidence PNGs, with their `hands` entries in plates.json. The supervisor supplies the R8 scores from the D-LIB12FIX-SLOT (b) panel.
    - battle_ropes' camera (D-LIB12FIX-ROPE): (i) is the committed render; (ii) is shown only from a render the supervisor supplies (LIB-12's lane), otherwise as one text line; (iii) is one text line. The sheet asks the owner to choose (i), (ii) or (iii).
    - Dip bar, kettlebell, ab wheel and implements: one "no drawing yet" line each (GAPS on #191 @ `c99cb66d`; D-LIB11-HANDS).
    - An E-R5 section: sheet.mjs takes the Do 8 PNG folder as an input, as it takes the Do 7 JSON, and prints the spike head sha, the engine fields per render and the critic's advisory scores. Without 'E-R5 SCOPE RULED', an E-R5 status line instead; the renders follow on a changed-ids sheet (plan 3.5). The text-only feel state: a status line, unless the layers lane supplies its render (D-LIB11-TEXTONLY).
    - Build the sheet and the page twice into the scratch folder; the sheet prints the plates-page sha. Prove once, with a temporary uncommitted batches/pilot-b.json in a scratch tree, that the registry rebuild gives the same page sha.
    - Post 'PILOT B SHEET READY @ <head> (plates page <sha>, sheet <sha>)' with the per-plate flag list and the held list. WAITING. The supervisor publishes the private page and sends it.
11. Pin (after 'PILOT B PIN GO @ <head>'; D-LIB8M-PIN, -ENTRY, -PAGES, -PAGESET):
    - If the GO leaves out an id, hold it, rebuild the page and the sheet without it, and post the sheet line again. Pin only after an approval that names the new page sha.
    - One commit, message tagged `[golden update]`, holding exactly the pin paths in write_scope: batches/pilot-b.json (batch 'PILOT-B', censusRef, the full `pages` object at D-LIB2b-PAGES (1)'s paths without creating the two layers files, one row per pinned id with `sources`, stage 'approved-plate'); pages/pilot-b.json; tests/howto/golden/library/pilot-b.json (base = GOLDEN.json's last entry by prefix hash; one 'page' entry; one 'plate' entry per id with its 9 fragments and exemptions exactly as the GO names; approvedBy 'supervisor', decision 'D-LIB-PILOTB', approval equal to the GO's comment link, date, why); the MANIFEST rows (LIB-4c's C0 shape); pilot-b/rows.json deleted, and build.mjs, qa.mjs and sheet.mjs switched to the registry's rows; the test's ceiling block replaced by its pinned block; under D-LIB11-SCRATCHIDS (a), ci/scratch.mjs's scratch-e target swapped and the pilot B ids added to setProblems' refused list, with the fixture test re-run and the changed lines listed; `node tools/plates/generate.mjs`.
    - Then run the default path: runQa on candidateOf(id) (pinned exemptions) for every pinned id; ok must be true (A8c).
12. Before READY:
    - Merge origin/main.
    - Post 'PILOT B CLONE DIFF @ <head>' (D-LIB11-SMITH): for every file copied from #265 or #109, `git diff <source sha>:<path> <target>:<path>`, where target is origin/main once the source PR has merged, else that PR's latest head. If a copied hunk differs, the supervisor rules it before READY.
    - In a fresh worktree of that exact head run `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (detached), `node tools/plates/generate.mjs --check`, LIB-4c's C0 and `node scripts/howto-rebuild.mjs --page tests/howto/golden/library/pilot-b.json page <scratch out>`.
    - Check the diff lists only write_scope paths; fill the PR body (A1-A16 with A8b-A8d, every mutation with its red line, the HANDOFF block); retitle '[ready for review]'; ask the supervisor for the review.

Acceptance (each mutation must turn red, then be restored; list each one in the PR with its red line):
- A1 The note and both slices are posted before the bulk, with a cited mode reason per id, and the bulk starts on its GO. No Mistake is drawn before the research head; Do 5 b starts only on MAPS RULED. Evidence: PR comment links.
- A2 Composers use PRIMITIVES types only; moving parts are poly or one of the envelope's H9lineTypes. In every drawn pose (start, via, end, Mistake): the smith bar's centre stays on one straight line along the rails (c8, "completely straight bar path"; the rail angle 0° is an unsourced number), its hooks sit on the rails, and the stop tops sit below the bar's lowest drawn point (c4); the leg-curl lever turns about a pivot within 1 cm of the knee joint (c1), the thigh pad touches the thigh just above the knee (c2), and the ankle pad sits on the lower leg just above the shoe in each right pose (c3). Mutations, each red: {type: 'wedge'} → H9.type; the smith bar moved 2 cm off its line in the Mistake; a hook 1 cm off its rail; a stop raised above the bar's lowest point; the pivot moved 3 cm; the thigh pad 3 cm off the thigh; the ankle pad moved 5 cm up the calf in the end pose.
- A3 Closures are pure and drawn by the vendor engine: closureOf(spec) passes, contains tools/plates/vendor/MANIFEST.json, and has no path under tools/plates/layers/, no specs/ file but its own and no spike/ file. Mutations: readFileSync in a composer; a spec importing tools/plates/layers/engine/body.mjs; a spec importing a pilot A or LB2 spec. Each red.
- A4 For every id in pilot-b/rows.json (later batches/pilot-b.json), every PQ-H1..H10 check passes in runQa node and browser, and the raised LIB-3 flags equal the ruled set exactly. Browser-half evidence is qa.mjs output at the head; flag-set equality is checked on qa.mjs's table. Mutations on one plate: LIB-3's M1-M7 (qa/mutations.mjs); a colour literal (H2.colour); its F5 tell chrome changed so F5 reads 3.40 (run in a temporary worktree, never committed; its qa.mjs table line goes in the list); and, if any card is drawable false, its topFault set equal to its drawn key → the F7 expectation fails.
- A5 pilot-b/rows.json holds exactly the drawn ids that are not held, each once, counted in the raw text; each held id is in DESIGN.md's held table with its ruling. Mutations: drop a row; duplicate a row; a pilot A id added; a held id added.
- A6 PQ-H6: facts within ±2° or ±1 cm, tempo equal to the card's, one form per fact. Mutations: a fact +3°; the card path removed (H6:no-card); a fact with both `joint` and `measure: true`.
- A7 Before the pin commit, nothing is pinned (D-LIB10-AHEAD's ceiling). The test asserts:
  - every row is drawing or review, and none of the 5 is in shippedIds();
  - a structural scan finds no pilot B id (lib_<id>, <id> or its hyphen slug, compared as whole field values, or as the specs/<id>.mjs path): in every batches/ file, in the `rows` keys and each row's `src`, `slug`, `prefix` and `chromeId`; in every tests/howto/golden/library JSON, in each entry's `id`; in every layers HTML there, in the `id="card-…"`, `data-ex` and `data-id` attributes; in file names (/pilot-b/i); and no text in either folder names `"batch": "PILOT-B"`;
  - controls that stay green: a batch row whose sources line reads "walkout from a push-up"; a row keyed lib_cable_crunch with slug cable-crunch; a row keyed lib_incline_push_up;
  - over exercises.json: every real id that contains a pilot B id (crunch: cable_crunch, machine_crunch, reverse_crunch, bicycle_crunch; push_up: incline_push_up, pike_push_up, diamond_push_up; cable_fly: low_to_high_cable_fly, high_to_low_cable_fly) is listed, and none of them matches the scan.
  Mutations: a row set to approved-plate; rows.json copied into batches/; a golden entry with id lib_crunch; a page-only `{"entries":[{"kind":"page","batch":"PILOT-B"}]}` in a file named other.json. No test reads origin/main.
  Recorded checks (not unit tests):
  - Leak check, before every post and on every head: `git diff --exit-code origin/main...HEAD -- tools/plates/vendor tools/plates/library/spike tools/plates/library/hands tools/plates/pins.json tools/plates/golden.mjs tools/plates/gen tests/howto/library-lint.test.ts`, its empty output pasted. Seeded once in a temporary worktree: one uncommitted byte in tools/plates/vendor/engine/body.mjs gives exit 1.
  - Ceiling check, pre-pin heads only: `git diff --exit-code origin/main...HEAD -- tools/plates/library/batches tests/howto/golden src tools/plates/library/pages tools/plates/library/MANIFEST.json`. After the pin, A8's `git diff <parent> <pin>` takes over.
- A8 After the pin commit (the test's pinned block replaces A7's ceiling block in the same commit): exactly the pinned ids have one row each in batches/pilot-b.json at approved-plate, and A7's structural scan finds them in no other batches/ or golden file. The test asserts approvedBy 'supervisor', decision 'D-LIB-PILOTB' and an approval equal to the GO's comment link on every entry; verifyBatchChain passes; the page entry's sha equals the sheet's printed sha; each id has MANIFEST rows; coverage.ts gives each 'approved-plate' with status 'pending'; loaders.ts has no entry for them; batches/pilot-b.json has no 'layers-page' entry, and neither layers path exists. generate --check exits 0, and `git diff <parent> <pin> -- src/ tools/plates/library/ids-node.mjs` shows only line 1 plus one stage line per pinned id. Mutations: coverage.ts reverted (generate --check red, naming it); one fragment sha changed in the chain; approvedBy 'owner' on a plate entry (red by the test's own assertion).
- A8b (page) buildPlatesPage(await pageConfig('tools/plates/library/pages/pilot-b.json')) equals the page entry's sha and bytes. Mutations: two ids swapped; one sources line changed.
- A8c (exemptions and post-pin QA) Each plate entry's exemptions equal the GO's list. runQa on candidateOf(id) gives ok true. F5 = 3.57 wherever 'F5' is exempted. Mutations: an exemption the GO does not name; the candidate's exemptions set to [] (applied to the candidate); tell chrome at 3.40.
- A8d (L0-lib and L1) C0 is green with pilot B's MANIFEST rows, and the pin commit carries [golden update]. howto-rebuild proves pilot-b.json's page locally and on the train head's full run. Mutations: a spec byte → C0; a pages/pilot-b.json byte → C0 and L1; a MANIFEST row removed → C0; on a scratch ref the supervisor pushes, one smith.mjs geometry constant → L1 red.
- A9 The plates page is deterministic (PQ-H7): two equal sha256 values, before and after the pin.
- A10 A card differs from its research-head copy only in the three-key block (cards.sha.json; Do 5 b's compare). The test holds its own copy of the tempo table as ruled by MAPS RULED and builds each card's tempo only from it and plate.tempo. Each fact's pose equals the ruled pose map's image of the pose its quote states. Mutations: any other card key edited; (i) a Rest phase added to one card and its spec; (ii) a constant added to tempo.json; (iii) a Hold s that differs from the card's pause (card and spec); (iv) a Hold of 0 s added to push_up (card and spec); (v) a Hold removed from cable_fly or crunch (if ruled) in card, spec and tempo.json; (vi) up and down swapped for one id with card and spec rebuilt; a start fact named with the unmapped pose.
- A11 The content verifier is VALID (its plant caught) on the 5 cards' fields at the head's cards.sha.json, with Q1's two topFault checks, before any Do 7 evidence. Evidence: 'CARD FIELDS VERIFIED @ <sha>'.
- A12 The critic run is VALID under 13.5's rule; the supervisor's approvals are recorded per exercise on the exact head; each held plate has its reason and ruling on the PR.
- A13 Do 6's lessons, smith's R10 items and the cue table are tested on drawn items. Mutations: a red Mistake part moved inside the figure's 6 px clearance; a leader within 6 px of a rail or cable; one R10 item removed (a stop deleted); a cue over 15 words. Each red.
- A14 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` locally on the merged head, and CI on that head. VITEST-RPC is on main and merged in, or each RPC red is ruled by the supervisor (never re-run). The PR body reports the seconds of every child process the new test starts.
- A15 E-R5 renders: posted with the spike head sha `82ae2d40`, the four changed files' sha256s, each PNG's sha256 and the reproduction inputs (Do 8). The leak check (A7) shows no vendor/, spike/, pins.json or golden.mjs change on every head. No unit test (evidence only).
- A16 Hand renders: the 8 PNGs are rendered by renderPair from main at the sheet head, and their sha256s are in the PR body; hands/** is unchanged (A7's leak check).

verification: the per-id QA table, both plates-page sha256 values, A7's recorded checks, the E-R5 and hand render shas, and (after the pin) A8-A8d, all at the exact head sha. The verifier's and the critic's comments name that sha.

risk_and_recovery:
- LR-31 changes a pick (R-PB reports smith_machine_bench_press and seated_leg_curl): the Mistake follows the new pick. If the new top fault cannot be seen side-on, drawable is false, plate.mistake names the next drawable fault, and F7 needs the owner's named yes (drawable-fault convention, plan 1:85-88). A STOP card waits for the supervisor's ruling; its plate waits, the others go on.
- The arch Mistake on a bench has failed before (incline_dumbbell_press, held at its last run, 21.6). If smith keeps an arch, use 21.6's common fix (back curve off the pad, a gap marker) in the first draft. If elbow flare wins, LB2's flare Mistake (close_grip_bench_press.mjs @ `2dcbac1`, key `flare`, :93-170) is the copy source.
- crunch's card-true trace or deviation is below the envelope [unverified until drawn]: HELD, joins LIB-ZOOM; never exaggerated. SUPCORE then has no anchor, and LB9 re-plans.
- A held or rejected anchor re-plans only its dependents (plan risk 3): smith → LB6's 5 Smith ids; cable_fly → CFLY; push_up → PUSHUP (LB7); seated_leg_curl → LB8's curls; crunch → SUPCORE (LB9).
- cable_fly's front view with two columns and crossing cables crowds the labels [unverified until drawn]: it is in the slice; H4 and the 6 px leader rule catch it; R4 and R7 judge it on the slice look.
- An unsourced size decides a hard check: post the measured table and stop that plate; the supervisor rules research (route 1) or a drawing convention (D-LIB13-LANDMINE-2, -TBAR). If neither gives a card-true drawing, HELD.
- The spike's engine cannot draw a card's Mistake (russian_twist's hips and knees may need a pelvis turn that trunk.yaw does not give) [unverified]: post it with the renders; the owner's go/no-go is then on what the engine can draw, and LIB-20's scope is ruled from it. Never swap in the arms-only twist.
- The spike files leak into the branch or a main worktree: A7's leak check (vendor/, spike/, pins.json, golden.mjs) catches it before each post.
- LIB-4c's scratch fixture targets lib_smith_machine_bench_press (ci/scratch.mjs:25; :26 targets a later smith user): after the pin, its put() would overwrite the real spec in its scratch copy and the registry would throw on the duplicate id (D-LIB-SCRATCHIDS). D-LIB11-SCRATCHIDS decides who fixes it before the pin.
- #109 is late, or the owner changes a pilot A anchor: the slices and right poses go ahead; the sheet and the pin wait; a moved anchor re-runs the critic for its pilot B dependants.
- #191 is late: the sheet waits, or the supervisor sends the plates with the hand kinds marked "pending" and a changed-ids sheet follows (plan 3.5).
- LIB-11 blocks LB3's merge (LIB-13 ruling 11): build now so READY comes before LB2's ship; the stalled-batch rule applies if the sheet waits more than 2 days (D-LIB11-SLOT).
- A long run is lost to a container reclaim: check in every 20 minutes; a lost run is re-run whole.
- Two failed tries of one approach with no new evidence: stop and report on the PR.

return:
- the PR number and head sha;
- links to the note, the amended note, both slices, the card-fields line, the E-R5 renders line, the ready line, the sheet line and the clone-diff line;
- the per-id table (mode, clone source, composer, hard checks, flags, held or not);
- the plates-page sha256 (before and after the pin) and the sheet sha;
- the mutation list and the recorded leak and ceiling checks;
- the output of check, test:tz, the gate, generate --check, C0 and the L1 rebuild.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-11 resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

Out of scope (each with the reason):
- Layers, app modules, buttons and C15 stamps for the 5: their batch ship cards (LB6-LB9; plan 6.1:665).
- The CFLY, PUSHUP and SUPCORE templates: their batch cards after the pin (D-LIB11-TEMPLATES).
- Any engine change, and E-R5's landing on main: LIB-20, after the owner's go (plan 2.4; row 20). Writing the scope into plan 2.4 is the supervisor's (D-LIB11-ER5).
- LR-34 checks of smith's 5 inherited grip and zoom lines, LIB-MUSCLE (push_up's and side_plank's `core`), the copy-lint readiness pass on shown lines, and variant lines: the batch research before each ship. None is a plate field.
- The text-only feel state's design and build (D-LIB11-TEXTONLY) and new hand pairs (dip bar, kettlebell, ab wheel, implements: research and LIB-12's lane).
- bicycle_crunch: no research card; status line only.

---

Owner's sheet (Do 10; the supervisor sends it, with or soon after LB2's sheet, plan 6.1:659)
- The supervisor approves each exercise under the owner's 10-01 delegation (14.8 point 5). The owner monitors and may flag any plate.
- He answers per plate only each raised LIB-3 flag other than F5, by name (D-LIB8FIX-ENV): expected F1 on push_up and crunch (drawn larger, the approved floor line, D-LIB8-floor), any F7 from R-PB, and any other flag Do 7 raises. Each shows plan 8 decision 9's default ("approve as named exemptions"). Sheet flags (a ruled drawing convention, a new rig) are shown as their own lines.
- He sees, per plate: normal and Mistake beside the anchor or closest approved plate, a Paper thumbnail, the critic's scores. New rigs flagged: smith and legCurlMachine, each with its later users.
- His decisions on this sheet (none gates the pin):
  - decision 5, roll and yaw: go or no-go on the E-R5 renders, in the scope the supervisor wrote into plan 2.4 (side_plank, russian_twist, dumbbell_fly, the rear-delt fly), or a status line if that scope is not ruled yet (default: if E-R5 fails, the named list at the release candidate);
  - decision 7, the text-only feel state (default yes): a status line unless the layers lane has its render;
  - the hand kinds palm-flat (both faults), ball-contact and battle-rope with their R8 scores (D-LIB12FIX-SHIP (2)), and battle_ropes' camera (i), (ii) or (iii) (D-LIB12FIX-ROPE). Dip bar, kettlebell, ab wheel, implements: "no drawing yet" lines.
- Held plates: one line each, with the reason.

---

Rulings recorded (D-LIB11-*, supervisor 2026-10-19 ~11:45 UTC, on the draft's open points):
1. D-LIB11-RPB: the R-PB brief was issued (pb-research-card.md @ `a3c69378`; research session_01UnpUkKrqrJbEAKHWNwjLAv; branch claude/libht-research-pb). Its verify is focused on the changed fields, with 2 plants (one on tier-A smith). No Mistake is drawn before 'PILOT B research head <sha>'. Status: READY @ `632cfbae` (#277), focused verify running.
2. D-LIB11-ER5: before the E-R5 renders go to the owner, the supervisor writes the spike's real scope (roll, yaw, trunk.lat, camera pitch, volume trunk) into plan 2.4 and row 20 as a proposal, with dumbbell_fly and the rear-delt fly in the same section, so the owner gives one answer. LIB-11 only produces the renders.
3. D-LIB11-RENDERS: scratch worktree, PNGs on the sheet only, spike shas recorded, nothing committed. The coordinator's direction (2026-10-19): the scratch worktree carries the spike's full changed set (engine files, MANIFEST.json, golden.mjs) as the spike has it; the spike head sha is recorded with the PNGs.
4. D-LIB11-TEXTONLY: not LIB-11's work. A status line goes on the sheet unless the layers lane has it ready.
5. D-LIB11-HANDS: show the three drawn kinds; the others are "no drawing yet" lines. The supervisor amends the plan's 6.1:663 list.
6. D-LIB11-ONECARD: one card and one PR; the pin is Do 11, gated on #109 on main and 'PILOT B PIN GO'.
7. D-LIB11-SMITH: accepted, with a condition. Code copied from an unmerged head (#265 @ `2dcbac1`) names its source sha in a comment. Before READY, diff it against that file on main once #265 merges, or against #265's latest head, and post the result (Do 12's CLONE DIFF).
8. D-LIB11-SLOT: start now in the free slot; merge slot 10; the stalled-batch rule applies after 2 days of sheet wait.
9. D-LIB11-TEMPLATES: no template in LIB-11.
10. D-LIB11-SMALL: measure crunch in the slice. If card-true fails PQ-H3, crunch is HELD with the shrugs and t_bar_row under LIB-ZOOM; never exaggerate.
- VITEST-RPC (coordinator, 2026-10-19): #276 is ruled and building. Before READY it is on main, or a red caused by RPC is ruled by the supervisor and never re-run.

Supervisor follow-ups (not the builder's):
- D-LIB11-SCRATCHIDS (critic M4), to be ruled before 'PILOT B PIN GO'. The options are (a) the pin commit swaps scratch-e's target (ci/scratch.mjs:25) for an id outside LB1, LB2 and pilot B with the same source, key and COPY_EDITS, adds the 5 pilot B ids to setProblems' refused list (:35-39), re-runs the fixture test and lists the changed lines, with ci/scratch.mjs opened for those lines only; or (b) a supervisor fix before the next scratch run. Recommended: (a). It is the D-LIB-SCRATCHIDS pattern: the push that first moves a batch's rows into batches/ makes the swap. scratch-f (:26, lib_smith_machine_incline_press) is LB6's to swap.
- Write the E-R5 scope into plan 2.4 and row 20 (ruling 2), and post 'E-R5 SCOPE RULED'.
- Amend plan 6.1:663 (ruling 5).
- Post 'PILOT B research head <sha>' when #277 merges, and supply the D-LIB12FIX-SLOT (b) R8 scores for the sheet.

---

Facts verified (2026-10-19; DIFFERS marks a disagreement with the brief or the plan)
- Heads: main `565ea5a4`; plan `a5e87d9e`; research `892d6516`; cards `a3c69378`; #109 `48d49bb8`, #265 `2dcbac15`, #191 `c99cb66d`, #190 `82ae2d40` (open, draft, '[do not merge]'); #277 `632cfbae` (open).
- The 5 ids are as plan 6.1:660-661 names them. Research cards exist for all 7 on `892d6516`; bicycle_crunch has none.
- LR-29: smith_machine_bench_press and cable_fly passed g5 (2026-09-30) and #263's three verifies (fix rounds 1-5, last `7bced914`). push_up, seated_leg_curl, crunch, side_plank and russian_twist passed w1 (run valid 2/2, recheck PASS @ `d2e5b129`, 2026-10-03). None had a rankNote at `892d6516`, so LR-31 had not run; R-PB runs it.
- Composers: on main only eq/parts.mjs and eq/rope.mjs; on #109 inclineBench, pecDeck, safetyArms; on #265 declineBench. `smith` and `legCurlMachine` exist nowhere: both are new.
- E-R5 is plan 2.4's root.roll and trunk.yaw in the locked body.mjs. DIFFERS: the spike also prototyped trunk.lat, camera.pitch and a volume trunk, and side_plank's Mistake needs trunk.lat, while russian_twist used pitch 20 and the volume trunk (D-SPIKE-status: proposals).
- E-R5 and LIB-20: the renders do not depend on LIB-20; they run on the spike head. LIB-20 lands the change on main and depends on the owner's go and LIB-2 (merged).
- The spike changed four non-spike files (body.mjs, plate.mjs, vendor/MANIFEST.json, golden.mjs). Main moved golden.mjs's source regex into pins.json, so the spike's files do not drop into a main worktree; Do 8 renders on the spike head.
- DIFFERS: the spike's russian_twist Mistake is the arms-only twist; the card's plate.mistake is hips and knees swinging.
- DIFFERS: plan 6.1:663 lists dip bar, kettlebell, ab-wheel and implement hands for pilot B; on #191 they are GAPS. Only palm-flat, ball-contact and battle-rope are drawn.
- DIFFERS: plan 6.2:705 marks smith_machine_bench_press T under BENCH; it is H (D-LIB10-BENCH-H; no Smith PARAMS value).
- DIFFERS: plan 7 row 10 names only LIB-8; the research head, #191, the spike plus the scope text, and VITEST-RPC also gate steps.
- LIB-4c's scratch fixture targets lib_smith_machine_bench_press (ci/scratch.mjs:25).
- Merge: plan row 10, after rows 1-9 and their sub-slots. LIB-13 merges only after LIB-11 (D-LIB13 ruling 11).

---

Findings applied (lib-11-critic.md: 5 high, 9 medium, 12 low). Line numbers are in this file.

| Finding | Status | Where (line) and note |
|---|---|---|
| H1 | applied | :189 (Do 5 a0: the 5 cards copied from `892d6516` at start, or from the research head if it is already posted); :30 (a0 in the start step); :183 (right-poses slice: renders, A2 tests and the two-build page sha, with no QA table; the extractPlates sentence; crunch's early trace from a scratch script only); :184 (Mistakes slice after the research head, with the QA table and crunch's H3); :33 (BULK GO after the Mistakes slice). Only the Mistakes slice waits for the head (coordinator: expected within about 2 h). |
| H2 | applied in the coordinator's form | :205 (render on #190's head `82ae2d40`, which carries the spike's full changed set as the spike has it: body.mjs, plate.mjs, MANIFEST.json, golden.mjs; never copied into this branch or a main worktree; pins.json, golden.mjs and MANIFEST.json never edited); :209 (the spike head sha and the four files' sha256s go with the PNGs); :248 (leak check adds pins.json and golden.mjs); :84, :155 (read-only and reserved). Not applied: the critic's scratch edits to MANIFEST.json and pins.json `vendorSources` on a main worktree. The coordinator's H2 direction replaces them, and :341 records why a main drop-in fails the lock. |
| H3 | applied | :243 (structural scan of rows keys, src, slug, prefix, chromeId, golden entry ids, layers HTML attributes and file names, plus no `"batch": "PILOT-B"` text); :244 (the three controls); :245 (exercises.json: crunch 4, push_up 3, cable_fly 2, none matches); :246 (the page-only mutation goes in other.json); :250 (A8's "none elsewhere" uses the structural scan). |
| H4 | applied | :181 ('PILOT B NOTE AMENDED' after the research head, with the Mistake rows, the fault→key map and every tempo-map or pose-map change from PICK CHANGED and STOP); :32 and :191 (Do 5 b opens only on 'PILOT B MAPS RULED @ <sha>' naming the research head; NOTE RULED alone does not); :255 (A10's tempo table follows MAPS RULED). |
| H5 | applied | :250 (A8 asserts 'supervisor', 'D-LIB-PILOTB' and the GO's comment link on every entry); :251 (A8b page via pages/pilot-b.json, 2 mutations); :252 (A8c exemptions equal the GO, post-pin ok, F5 3.57, 3 mutations); :253 (A8d C0, [golden update], howto-rebuild, 4 mutations); :227 (Do 11's default-path run maps to A8c). |
| M1 | applied, option (a) (the critic's recommendation) | :183 (cable_fly joins the right-poses slice as the front-view anchor and the clutter risk); :30 (the start step names the 4 slice ids; push_up is bulk); :185 (push_up on BULK GO); :196 and :270 (the clutter risk is judged on the slice). The draft's "right poses of all 5" line is gone. |
| M2 | applied | :148 (pin paths: rows.json deletion, the test's ceiling block → pinned block only, the three scripts switched to the registry rows, and ci/scratch.mjs lines under D-LIB11-SCRATCHIDS (a)); :43 (the pin commit equals the GO on the pin paths only); :226 (Do 11 lists them). |
| M3 | applied | :248 (leak check before every post and on every head, seeded once); :249 (ceiling check on pre-pin heads only; after the pin, A8's `git diff <parent> <pin>` takes over); :260 (A15 relies on the leak check). |
| M4 | applied as a ruling request (the ruling is the supervisor's) | :327 (D-LIB11-SCRATCHIDS options (a) and (b), recommended (a); scratch-f stays LB6's); :37 (Do 11 waits for the ruling); :226 (Do 11 carries (a)'s swap); :148, :155 (scratch.mjs opened for (a)'s lines only); :274 (risk); :70 (rulings list). |
| M5 | applied | :219 ((i) the committed render; (ii) only from a supervisor-supplied render, else one text line; (iii) one text line; the owner chooses); :308 (owner's sheet). |
| M6 | applied | :209 (full text of each scratch spec and helper, the scratch diff and the exact render command, so the supervisor reproduces the PNG shas from `82ae2d40` plus the posted text); :221 (sheet.mjs takes the PNG folder as an input); :206 (clasped hands, no ball, no composer). Note: the card's variantLine says the LB9 plate draws the ball. The render rests on the same line's "every line holds with clasped hands too (c2)". |
| M7 | applied | :63 (ruling summary: research first, HELD second, a convention only after research records the gap, never a value picked to pass without a ruling); :201 (Do 6: post the measured table and stop; the supervisor rules route 1 or a convention); :176 ("proposed as"); :271 (risk). |
| M8 | applied | :255 (A10 (iii) and (iv), with push_up as the pause-0 card); :256 (A11 with Q1's two topFault checks); :191 (Do 5 b: focused re-verify with a new plant, qa.mjs re-run, H6 must pass). |
| M9 | applied | :178 (crunch's px/m by D-LIB8-floor's fill-the-width rule, cap ×1.35, and its trace point by DRAWING-GUIDE.md:29, the shoulder-blade lift c3 and c4, both fixed before measuring). |
| L1 | applied | :25 (D-LIB11-RPB); :48 (D-LIB11-SLOT); :54 (D-LIB11-TEMPLATES, ruling 9; D-LIB10-TEMPLATES cited for BENCH and SEATPRESS only). |
| L2 | applied | :143 (`plates[]` with tier, closest, view, class and per-id `held`; `cards`, `handsNote`, `hands[]`). |
| L3 | applied | :236 (one straight line along the rails in c8's words; mutations: a hook 1 cm off its rail, the thigh pad 3 cm off the thigh); :176 (rail angle 0° among the Unsourced numbers). |
| L4 | applied | :169-171 (LIB-3 flags for A4's equality and sheet flags, in two lists); :238 (A4: browser-half evidence and flag-set equality on qa.mjs's table); :217 (sheet flags as their own lines). |
| L5 | applied, with 2 more PNGs (8 in total) | :218 (the supervisor supplies the R8 scores from the D-LIB12FIX-SLOT (b) panel; palm-flat shows both faults through `{ fault }`); :144 (8 evidence files); :261 (A16 counts 8). |
| L6 | applied, with ruling 7's target | :230 ('PILOT B CLONE DIFF @ <head>' for every file copied from #265 or #109; a differing hunk is ruled before READY); :109 (finish). Ruling 7 sets the target: origin/main once the source PR has merged, else that PR's latest head. The critic's form diffs against origin/main only. |
| L7 | applied | :24 (the drawable-fault convention anchor for any id R-PB makes drawable:false). |
| L8 | applied | :28 ('LIB-11 start' names who parks if LIB-5 returns with CHANGES or LIB-10 resumes). |
| L9 | applied | :221 (without 'E-R5 SCOPE RULED', an E-R5 status line; the renders follow on a changed-ids sheet; neither gates the pin); :108 (finish). |
| L10 | applied | :250 ("one stage line per pinned id"). |
| L11 | applied | :191 (one text block before the final brace; the test replaces it by `\n}` and compares the bytes). |
| L12 | applied | :335 (cards head `a3c69378`); :112 (+ about 2 h per extra E-R5 id); :200-202 and :215 ('PILOT B STOP', 'PILOT B HELD', 'PILOT B FIX READY'); :149 (MANIFEST.json kept on both sides on main merges after the pin). |

Coordinator items (not critic findings): R-PB READY @ `632cfbae` (#277), with the placeholder kept: :29, :314 and the R-PB lines in "Pilot B ids". E-R5 in a scratch worktree with the spike's full changed set, never committed, with the spike head sha recorded: :205, :209, :316. VITEST-RPC on main before READY, or RPC reds ruled by the supervisor and never re-run: :38, :45, :259, :324.

Count: 26 of 26 applied. H2 is in the coordinator's form, M4 is a ruling request with a recommendation, and L6 uses ruling 7's target. None is unapplied.

Supervisor rulings on the final card (2026-10-19 ~12:15 UTC):
- Research head: 'PILOT B research head 38d5f9c608b492587b3f923382ccb02bea8f1345' was posted on #277 (6266806550). It is the merge of #277 into claude/libht-research, after a focused LR-29 verify (VALID; pb-research-verify.md @ 712e2433). Do 5 a copies the 7 cards from it, and the Mistakes slice may start. The PICK CHANGED on smith (flared elbows) and seated_leg_curl (pushing with the calves) are verified.
- D-LIB11-SCRATCHIDS: option (a). The pin commit swaps the LIB-4c scratch fixture's target off lib_smith_machine_bench_press, to a non-pilot-B id with the same sources, as D-LIB13-SCRATCHIDS does. New scratch fixtures never target a pilot B id.
- Owner, 12:10 UTC: "Pilot a ok" (#109 6266791221). Pilot A's flags are accepted as named exemptions. #109's PIN GO still waits for LIB-7b, LIB-12 on main and its R8 panel. LIB-11's steps that need #109 on main wait for that.

DRAFT (supervisor, 2026-10-22): not ready. Waits for the LB4 LR-29 verify (#285) and the owner's choice on the no-seconds tempo strip; PROPOSED rulings are not rulings yet.

Card LIB-14: LB4 plates, build-ahead, 6 ids (draft 2026-10-22; not ready). The 7 rulings marked "PROPOSED, needs the supervisor's ruling" in the last sections must be ruled before 'LIB-14 start'. The other 8 LB4 ids are blocked (section "LB4 ids") and go in a later card. The ship phase (layers, pin, button) is a later card on the same branch and PR.

Every claim marked "UNVERIFIED:" could not be checked when this was drafted. The supervisor checks each one before the card is `ready`.

id: LIB-14
model: claude-opus-5-5 (plates, a composer and the mode proof are judgement work, plan 3.1)
mode: auto
title: 'Builder: LIB-14 LB4 plates'
branch: claude/lib-14-lb4 (new; no such branch at 2026-10-22 ~07:00 UTC). Your first push opens draft PR 'LIB-14 (build-ahead): LB4 plates, nothing ships'.

base: the latest origin/main when the session starts (`5158609c`, LIB-7 #193 on top of train 33, or later), never an unmerged head.
- Every main line number cited here was read at `5158609c`. Re-read each one on your start head, and use the line you find there.
- On main at `5158609c`: LIB-3c (qa/param-ranges.mjs; the child proof, qa/node.mjs:333-348), VITEST-RPC (train 31, `7307b303`), LIB-5 Do 9's back box (train 32, `07ad7f1c`), LIB-6 + LIB-6-PM with S5-L (train 33, `2647c3a6`) and LIB-7 (#193).
- Not on main: pilot A (#109), LIB-12 (#191), HT-11 (#273), LB1-LB3 (#245, #265, #274) and LIB-5v (#282).
- Copy LB3's build.mjs, qa.mjs and test patterns with `git show <#274 head>:<path>` (#274 @ `8781ed0a` holds tools/plates/library/lb3/{build,qa}.mjs and tests/howto/lb3-plates.test.ts). Never import anything under lb2/ or lb3/.
- Where the plan (claude/howto-options @ `b41ac833`) differs from lib4-cards sections 12-29 or the D-LIB14-* rulings, those win.
- Merge origin/main into this branch, with a merge commit, each time pilot A (#109), LIB-12 (#191), HT-11, LB1, LB2, LB3 or LIB-5v lands. The steps that need them wait (build_prerequisites).
- Never merge an unmerged head. Read them with `git show <sha>:<path>`. To render a pilot A plate beside an LB4 plate, check that head out into a temporary `git worktree` outside the repo tree. Never commit it, and never merge it.
- Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on (plan 7 row 14, LIBRARY-HOWTO-ARCHITECTURE.md:811): LIB-12 and LIB-13. Both govern the merge only. Plan 6.3:781-784: a batch's dependency on the previous batch is checklist order only; its real prerequisites are plan 6.2's "Needs before it" (:713: "LIB-12 (cupped, front-rack); `wall`"). The anchor rule (plan 3.1:293-299) also gates each plate going on a sheet:
- front_squat and bodyweight_squat: only their source among the 8, barbell_back_squat (approved, census batch B00).
- goblet_squat and step_up: the engine dumbbell primitive anchor dumbbell_biceps_curl (pilot A; plan 2.2:162).
- step_up and pistol_squat: the single-leg anchor single_leg_romanian_deadlift (pilot A; plan 2.2:156; census: 6 users, both of these among them).
- step_up: the split anchor reverse_lunge (pilot A; plan 2.2:155; census: 9 users, step_up among them). reverse_lunge is HELD (D-LIB8M-NOSTRIP, lib4-cards.md:3305-3309), and its pick changed to drawable false at #285 @ `4c9eb363`. See D-LIB14-STEPUP.
- wall_sit: the hold-plate convention (plank, pilot A, pinned per pilot-a/plates.json @ #109 `ff7c5c4f`; plan 1:80-81), the `wall` composer (its own anchor, plan 2.1:139) and the wall pose class (its only user, approved on its own batch sheet, plan 2.2:165).
- pistol_squat: the drawable-fault convention (dumbbell_biceps_curl, pilot A; plan 1:85-88), if its named research head keeps drawable false.
That yes is pilot A's plates pinned on main with the approvals D-LIB-O5 allows (lib4-cards 14.8 point 5), and the owner's named answers on the pilot A sheet. The owner said "Pilot a ok" (10-19 12:10; HANDOVER 8.0o C, #109 row, on claude/sup-handover-1445 @ `83b24fd9`). Pilot A is not pinned on main yet.

build_prerequisites (the supervisor posts each on the PR or on claude/sup-lib4-cards, or sends it to your session while no PR exists. If one is missing when you reach its step, go on with any other permitted step; set WAITING only when none is left, per D-LIB-LANE-ACTIVE):
- To start: 'LIB-14 start', which names the active-builder count and LIB-14's place in the freed-slot queue; 'LB4 research head <sha>', the head the supervisor names after the LR-29 verify of #285 passes for these six cards (link it in the PR body); and the rulings D-LIB14-AHEAD, -MODES, -NOSECS, -SLICE, -STEPUP, -ANCHORS and -PISTOL.
- At start: Do 1, Do 4 (wall), Do 5, Do 6 a, and the H slice (Do 2) with its drawn-item tests. Copy pilot A code with `git show` from #109 @ `ff7c5c4f`, or a later #109 head the supervisor names. Copy the 8's squat code from tools/plates/vendor/exercises/barbell_back_squat.mjs on main.
- Do 6 b: the note's tempo map, pose map and fault→key map ruled on the PR ('LB4 NOTE RULED'; 13 Q3; 13 Q1(a); D-LIB8M-TEMPO).
- Bulk (Do 7): 'LB4 BULK GO', after the supervisor's slice look.
- A D row, if the note proves one: D-LIB10-RANGES's `D:barbell_back_squat` family row ruled and on main (lib4-cards :3115, :3118); qa/param-ranges.json names no family at `5158609c`.
- Do 8 evidence: 'CARD FIELDS VERIFIED @ <sha>' for the cards it covers (lib4-cards :1143: after the fields are written, before QA).
- Do 8 and Do 9 for any row held under D-LIB14-NOSECS: that ruling's release condition.
- Do 9 (the critic run) and every approval: the ready line, and D-LIB14-ANCHORS.

merge_prerequisites: never merges as this card. The ship card merges these six only when all of these hold:
- Every lower-numbered item on the owner's checklist has merged (AGENTS merge rule): HANDOVER 8.0o D items 1-14 (#274 LIB-13 is 14), LIB-12 (#191) and LIB-13 included.
- LIB-12 (#191) is on main (plan :713, :811). front_squat and goblet_squat have no hand close-up: D-LIB12FIX-R8-GAPS (lib4-cards :4194-4198) put them in GAPS (#191 @ `8bea5afc`: hands/hand-front-rack.mjs:26-29, hands/hand-cupped.mjs:25-29). They ship with no close-up unless F-LIB12-R8B redraws front-rack and cupped-goblet and an R8 panel passes them first. The owner's changed-ids sheet says so before PILOT A PIN GO (lib4-cards :4198).
- Pilot A's yes, as defined in depends_on, is on main.
- Every D-LIB4-ENTRY condition holds (plan 5.4:633-634; lib4-cards :1055-1070). UNVERIFIED: which conditions hold today.
- The D-LIB5-FAMILY comparator is on main, and the supervisor has ruled the inherit[] map for the card children. tools/plates/library/lint/family.mjs:1-3 on main still refuses any inheritance until LIB-9's comparator. Card children here: front_squat and goblet_squat (parent barbell_back_squat, shipped, the 8); wall_sit (parent bodyweight_squat, same batch). wall_sit does not ship unless bodyweight_squat ships (D-LIB10-PARENTS, lib4-cards :3193-3196).
- The back box: on main (train 32 and 33). front_squat (redFlags wrist, back, knee) and goblet_squat (back, knee) list 'back'.
- LIB-5v (#282) is on main before goblet_squat ('Dumbbell / Kettlebell') or step_up ('Dumbbells / Bodyweight') ships (D-LIB5-VARIANT 6; D-LIB13-VLINE, lib-13-card.md:400). Both cards carry a plate.variantLine; src/data/exercises.json on main names two kinds for both.
- pistol_squat's F7 has the owner's named yes on the LB4 sheet, if drawable stays false (plan 3.3:337-339).
- step_up's split anchor is owner-approved and pinned (D-LIB14-STEPUP).
- The five rows held under D-LIB14-NOSECS have their tempo strip design ruled and on main, then pass QA and the critic.
- A calibrated critic has scored R8 and R9 at 4 or more for every LB4 plate that ships (13.1). R8 is null for an id with no close-up.

Rulings this card relies on. These are summaries; where the posted text differs, the posted text wins.
- D-LIB9-ENGINE: specs import only tools/plates/library/engine.mjs (the vendor engine). poly and flat palm are allowed. Nothing imports tools/plates/layers/.
- D-LIB9-AUTHORQA: candidateOf(id, { all, authoring: true }) (candidate.mjs:84). Its default path stays unchanged.
- D-LIB9-CARDFIELDS (lib4-cards :1135-1147), with 13 Q1 (topFault) and Q3 (tempo map):
  - drawable:true: topFault is plate.mistake's key, and the spec's first tell carries it;
  - drawable:false: topFault is the ruled key of the card's named top fault, which differs from the drawn key, and F7 stays raised (D-LIB8M-TF1 4);
  - tempo: D-LIB8M-TEMPO (lib4-cards :3293-3303). The concentric takes up, the eccentric takes down, Hold takes pause right after the concentric only if pause > 0. Any other static phase is a constant only with a quote that states its seconds. A range is the quote's string. No Rest.
- D-LIB8M-FACTS, with 22's exact scope (D-LIB10-CF1), and D-LIB13-FACTS2 / D-LIB11-FACTS2 (contact facts; PANELS.md section 3, `{kind:'contact', landmark, pose, cardPose, claim}`). An equipment number becomes a fact only when the plate shows it with a measure callout.
- D-LIB5-TEMPO8 rules 10-15 (14.7); D-LIB9-FACTPOSE: a setup instruction states the start pose only; a contact is never carried to another pose by inference.
- D-LIB9-F5 (14.4): `exemptions: ['F5']` only for the selected Mistake tell in Midnight at exactly 3.57.
- D-LIB9-CLONE (13.2): copy, never import a pilot A or vendor spec; every copied root finder throws on a bracket with no root; re-derive each bracket and record what it solves to.
- D-LIB8M-NOSTRIP (lib4-cards :3305-3311): a plate with no sourced seconds has no tempo strip. The vendored builder draws none (vendor/artifact/build-page.mjs:174), PQ-H2 needs one (qa/node.mjs:93 'H2.chrome:tempo'), and the extractor throws for every id on the page (tools/plates/golden.mjs:116). Research is not asked. Never exempted.
- D-LIB8M-CARDTRUE and D-LIB8M-PAGESET: the plate follows the card. A plate with no card-true drawing that passes every hard check, or that fails its last critic run, is HELD: stage review, off the page and the rows file, on the follow-up list, reported. A held id gets no row.
- D-LIB10-CHILDPROOF (lib4-cards :3134-3150) and D-LIB10-RANGES (:3112-3130): on main with LIB-3c. Its deadline names LB4's three D rows (:3148). LIB-14 never edits qa/param-ranges.json.
- D-LIB10-BENCH-H and D-LIB10-BBELBOW: an id that cannot meet its own card through PARAMS is H. If one card's facts cannot all hold on the body at once, stop and post the per-card conflict; never tune a value off the card.
- D-LIB10-SKULL1 and Q-D5-4: 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key. A one-tell plate needs a per-id ruling.
- D-CRITIC-CAL3 (13.5), with 13.7's facts diff and 13.6's segment-length rule; D-LIB10-PANEL1 (24). The method is PANELS.md (claude/sup-handover-1445 @ `83b24fd9`) sections 1, 3, 5 and 7.
- D-LIB8-shrug and Q-D5-3: a right pose or a fault is never moved or exaggerated off its card to pass a check.
- D-PILOTA-R5 and D-LIB8M-CARRY: an approval counts only for the head it ran on.
- D-LIB-LANE-ACTIVE (lib4-cards :1023-1041): at most 4 active LIB builders. You hold a LIB drawing slot from your start. WAITING only when no permitted step is left.
- D-LIB9a-HOWTOID: a How-to source here holds only `research` and `id`.
- LR-31, LR-33 (RULINGS.md:40 on claude/libht-research), LR-36 and D-SUP-PROTECT (#287 6334491971; cited on #285 6334510953): research applied them on #285; this card never edits a card's research fields.
- D-LIBHANDS-COUNT (20): binds only a card that adds hand modules. LIB-14 adds none.
- D-LIB14-AHEAD, -MODES, -NOSECS, -SLICE, -STEPUP, -ANCHORS and -PISTOL: PROPOSED (section "Proposed rulings" below). None binds until the supervisor rules it.

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Every plate meets the bar of the 8, pilot A and LB1-LB3: every plan 3.4 item at 4 or more (R8 and R9 stay unscored here, as in 13.1).
- No check, envelope, threshold, rubric item or test is relaxed, skipped or exempted to save time. A plate below the bar is redrawn, and you report the time it cost.

shared-file owners:
- None of the AGENTS shared add-only files is touched. scripts/screenshot-gate.mjs, tests/theme.test.ts and src/ui/styles.css on main name none of the six ids (checked at `5158609c`).
- tools/plates/vendor/** and tools/plates/layers/**: read only.
- Pilot A's files (#109), LB1's (#245), LB2's (#265), LB3's (#274), LIB-ZOOM's (#279) and LIB-12's hands/** (#191): read only. Composers on main (eq/parts.mjs, eq/rope.mjs) may be imported; specs are copied, never imported.
- candidate.mjs, registry.mjs, derive.mjs, plates-page.mjs and qa/** (qa/param-ranges.json included): untouched. Family rows reach main only by D-LIB10-RANGES 4b.
- docs/research/howto/cards/** and quotes/** belong to claude/libht-research. Here they are byte copies of the 6 LB4 cards from the named research head, plus their three keys. None of the six exists on main at `5158609c`. The supervisor merges the field commit back, only after #285 is merged into claude/libht-research.
- #191's tests pin claim texts of these two cards (hands/lib12-claims.json @ `8bea5afc`: front_squat c3, c4, c7; goblet_squat g1, g2, g5, g6). All seven equal #285 @ `4c9eb363` (checked). Never change a claim to fit; report if the named head changes one.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. Your first push carries the design note and opens the draft PR. Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full qa.mjs run) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`, and poll its log. A stopped run is never evidence.
- A CI failure on `[vitest-worker]: Timeout calling "onTaskUpdate"` is a real defect (D-LIB8M-RPC (b)); VITEST-RPC is on main. Keep each test's child processes well under vitest's 60 s limit. Report such a red on the PR; never re-run to green.

hard card: the design note and the H slice come before any bulk drawing.

outcome: LB4's 6 build-ahead plates, the `wall` composer and the 6 cards' machine fields exist on this branch at stage drawing or review.
- Every plate in lb4/rows.json passes every LIB-3 hard check (runQa, node and browser halves), PQ-H10 included.
- The raised flags are exactly the ruled expected set.
- The cards' machine fields have the content verifier's VALID verdict.
- A plate that cannot pass card-true is held and listed, never exempted. A plate held under D-LIB14-NOSECS is drawn, unit-tested and listed with its release condition.
- Nothing ships: none of the 6 gets a button, pin or batches/ row; no layers page; no app change.
deliverable: the specs, the `wall` composer, rows, tempo map, LB4 plates-page build and QA scripts, design note and tests.
evidence: the per-id QA table at the head sha; the plates-page sha256 from two identical builds; the unit tests with their mutations; the recorded diff checks (A9); the content verifier's verdict; then the critic's verdict.
finish:
- 'LB4 PLATES READY @ <sha> (plates page <sha256>)' is posted;
- the critic run is VALID under PANELS.md section 1 with every plate on the page at the bar, or each failing plate has had its one fix round and recheck and is held;
- the supervisor's per-exercise approvals are recorded on the PR (head-only).
- If D-LIB14-NOSECS (a) is ruled: the plates page holds only wall_sit until the no-seconds tempo strip lands. READY then covers wall_sit plus the five drawn-and-held specs; their QA and critic run in a later step on the same PR.
Then stop; the ship card takes over the branch. You will notice: nothing in the app.
forecast [est]: about 30 Opus-hours at plan 9's pace (:894-897): 6 H plates × 4 h; the `wall` composer 2 h; QA and critic 0.75 h per id. A D row the note proves saves about 2.5 h. The QA and critic of the five NOSECS rows wait for the strip design; their cost moves, it does not shrink. LB1 needed 4 review and 4 critic rounds; LB3's first panel passed 4 of 7 and its recheck 5 of 7 (lib4-cards 29). So allow up to about twice that. The calendar depends on a free lane slot, the named research head, the no-seconds strip design and pilot A's pin (sheets only), which this card cannot forecast.

LB4 ids (plan 6.2 :713 and :736-738 @ `b41ac833`; census docs/howto/library/inputs/census.json @ `4a9fd86`, identical at `b41ac833`; card facts below read at #285's READY head `4c9eb363`, where the six cards and quotes are byte-identical to 'LB4 FIRST SIX @ da5e4b64'; re-read them on the named head):
- The row "14 | 5 | D3 P1 T5 H5": front_squat*, goblet_squat*, bodyweight_squat (D); reverse_lunge (P:SPLIT, pA); bulgarian_split_squat, walking_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat (T, SPLIT); box_jump* (pA), jump_squat*, wall_sit, step_up, pistol_squat* (H). Tier A (*) is 5.
- Drawn here (6; D-SUP-LB4-ORDER, lb4-research-card.md:27-28), with the facts that bear on mode:
  - front_squat (A; plan D; card parent barbell_back_squat; census closest barbell_back_squat, view side, pose stand): bar between throat and shoulders (c2), elbows high (c4, c7), toes out (c8); end hip crease at or below the knee top (c11), torso upright (c10, c12). Mistake: elbows drop and the chest falls forward (c7), drawable true. Rack upright with safety bars just below the bottom (c14). Tempo: up, down, pause null (c21 names a bottom pause and slow eccentrics as variations only). Hand close-up: front-rack key, in GAPS.
  - goblet_squat (A; plan D; card parent barbell_back_squat): dumbbell upright at the chest, elbows near the ribs (g2); end hips at or below the knees (g4), weight at chest height (g5). Mistake: chest droops, weight drifts off the chest, torso leans far forward (g6), drawable true. Tempo null (g7). variantLine (Dumbbell / Kettlebell). Hand close-up: cupped key, in GAPS.
  - bodyweight_squat (C; plan D; no card parent): feet slightly wider than hips, toes slightly out, hands by the sides (b1); end thighs about parallel (b4), shin and torso parallel, heels down (b6). Mistake: heels lift at the bottom (b4; LR-31 step 3 + LR-36), drawable true. Tempo null (b7).
  - wall_sit (C; plan H; card parent bodyweight_squat): entry standing with back and buttocks on the wall (w2, w5); held pose hips and knees at about 90° (w2), knees above the ankles and back flat on the wall (w4). Mistake: feet too close to the wall, knees past the toes (w8), drawable true. Hold card: tempo.text "Set / Hold 30-60 s / Rest" (w6: "30-60-second holds"); up, down, pause null; rest not sourced. Census: equipmentGaps ['wall'], "Isometric hold: no start to end travel."
  - step_up (B; plan H; no card parent; census poses split and single): one whole foot on the box (c1, c6), torso upright (c6), dumbbells at the sides (c5); end standing tall on the box (c1). Mistake: throwing the trunk forward (c1), drawable true. Box: Simenz used 45.7 cm (c11); no source sets a height. Tempo null (c2). variantLine (Dumbbells / Bodyweight).
  - pistol_squat (A; plan H; no card parent; census pose single): standing on one leg, arms and free leg forward (p1); end standing knee fully bent, hamstring near the calf (p2, p3), foot flat (p3), free leg straight (p5). Top fault: bouncing out of the bottom, speed only, drawable false (LR-31 step 3). plate.mistake: the standing heel lifts at the bottom (p8). F7 expected. Tempo null (p8; Physitrack's "Pause briefly" after standing is named in text, no seconds).
- Not drawn here (8):
  - box_jump and reverse_lunge: pilot A plates, held (D-LIB8M-NOSTRIP, lib4-cards :3305-3309). D-SUP-LB4-PACOPY and D-SUP-LB4-REVLUNGE (#285 6334410062, 6334477674, corrected 6334510953) changed their cards; reverse_lunge's plate.mistake becomes the flared ribcage, drawable true (F-LB4-1), to be redrawn at re-approval.
  - The 5 SPLIT children (bulgarian_split_squat, walking_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat): the template's byte proof needs its parent reverse_lunge pinned (D-LIB10-TEMPLATES, lib4-cards :3161-3164), and it is held.
  - jump_squat: the airborne convention stays open until the no-seconds strip exists (lib4-cards :3310); its anchor box_jump is held.
- Tempo, all 14: #285's READY note says every LB4 card keeps up, down and pause null (6334536097). Only wall_sit has a sourced static phase (the Hold range). See D-LIB14-NOSECS.
- Composer (census gap): `wall` (wall_sit; anchor wall_sit; its other user is wall_ball in LB10, census batch B28; plan 2.1:139). It lands in this PR, as a composer lands in its anchor's PR (plan 2.1:129-130). Everything else is a vendor primitive (barbell, rackUpright, dumbbell with its `axis` option, box, floor; vendor/engine/equipment.mjs:30-32) or eq/parts.mjs on main.
- Scratch fixtures on main name none of the six (tools/plates/library/ci/** and tests/howto/library-ci.test.ts at `5158609c`). src/howto/coverage.ts:100-154 lists them at stage "queued"; src/** is reserved.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On claude/sup-lib4-cards: this card; lib-13-card.md (LB3's card, the closest model) and its critic lib-13-critic.md; lib-10-card.md and lib-9a-card.md; lib-zoom-card.md; lb4-research-card.md; lib4-cards.md sections 12 items 2, 4, 9; 13 (Q1-Q5, 13.1-13.8); 14.4, 14.7, 14.8; 15 and 15.1; 16 (D-LIB8M-TEMPO, -NOSTRIP, -CARDTRUE, -PAGESET); 20; 21-29.
- On claude/sup-handover-1445 @ `83b24fd9`: docs/supervisor/verify/PANELS.md; HANDOVER 8.0o C-E and 8.0p.
- On #285: 'LB4 FIRST SIX' (6334381756), 'LB4 RESEARCH READY' (6334536097), D-SUP-LB4-PACOPY, D-SUP-LB4-REVLUNGE and its correction.
- The plan @ `b41ac833`: 1 (:80-96, hold, drawable-fault and airborne conventions); 2.1-2.2 (:120-165); 3.1 (:267-304); 3.2-3.5 (:306-408); 6.1 (:668-704); 6.2 (:706-738); 6.3 (:768-784); 7 row 14 (:811); 9 (:890-916).
- Pilot A @ `ff7c5c4f`: tools/plates/library/DRAWING-GUIDE.md; specs single_leg_romanian_deadlift, plank, dumbbell_biceps_curl; pilot-a/plates.json; pilot-a/tempo.json (plank's Hold row, :17).
- LB3 @ #274 `8781ed0a`: lb3/DESIGN.md, lb3/build.mjs, lb3/qa.mjs, eq/landmine.mjs and eq/romanChair.mjs (composer pattern), tests/howto/lb3-plates.test.ts.
- LB1 @ #245 `9e5d9666`: lb1/DESIGN.md section 1 (why all 9 planned D rows became H).
- Main: derive.mjs (PARAMS :4-12, paramProblems :15-30, derive :39-45); vendor/engine/plate.mjs:81-95 (the engine reads only `spec.camera` of the PARAMS paths); vendor/exercises/barbell_back_squat.mjs (:126 tempo); candidate.mjs :73, :76-130; registry.mjs :30-56; qa/node.mjs (:93, :158, :176, :333-348); qa/envelope.json (traceLenMin 22.11, deviationMin 11.39); tools/plates/golden.mjs:116; vendor/artifact/build-page.mjs:149-153, :174; eq/parts.mjs.
- Research on the named head: cards/ and quotes/ for the 6, CARD-V2.md, RULINGS.md (LR-31, LR-33, LR-36), and the LB4 verify file the supervisor names.
- Census @ `4a9fd86`: the 6 rows (closestApproved, poses, equipmentGaps, view, handArchetype).

design_reference: DRAWING-GUIDE.md; the 8's barbell_back_squat; pilot A's approved single_leg_romanian_deadlift and plank; LB1-LB3's approved plates; the plan 3.4 rubric; the census views.
connectivity: none. Node and local Chromium (/opt/pw-browsers/chromium) only. Specs and composers read no files and fetch nothing. Facts come only from the copied cards and quotes. No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/specs/<id>.mjs for each drawn id (row src 'library/specs/<id>.mjs');
  - tools/plates/library/eq/wall.mjs, plus any composer the ruled note names, one new file each;
  - tools/plates/library/lb4/{rows.json,tempo.json,build.mjs,qa.mjs,DESIGN.md,cards.sha.json}. rows.json holds batch 'LB4', censusRef 4a9fd86, the drawn non-held ids only, view per row, the ruled mode (a D row also names its parent and params, each param citing the claim on the row's own verified card, D-LIB10-RANGES item 3), and stage drawing or review only;
  - tools/plates/library/howto/lib_<id>.howto.mjs for the 6 (`research` and `id` only);
  - docs/research/howto/cards/<id>.json and quotes/<id>.json for the 6: byte copies, then the three keys on cards/;
  - tests/howto/lb4-plates.test.ts (node only).
- docs/COACHING-DECISIONS.md: append only (6 open branches also append; keep both sides).
- Plates pages and QA reports are not committed. build.mjs and qa.mjs write to a temp directory and print the sha256 and the table.

reserved_paths:
- tools/plates/library/batches/** and tests/howto/golden/**.
- src/** (every generated file and src/howto/coverage.ts included), tools/plates/gen/** and tools/plates/generate.mjs.
- In tools/plates/library/: {derive,candidate,registry,plates-page,build-page,layers-spec,inputs-closure,batch-golden,engine,bodies,ids-encoding,ids-node,chunk-set,fidelity}.mjs, MANIFEST.json, and the folders qa/, hands/, render/, pages/, pilot-a/, lb1/, lb2/, lb3/, fidelity/, ci/, shared/, lint/, research/, scale/ and budgets/.
- Existing eq files and specs (main's, pilot A's, LB1's, LB2's, LB3's).
- The other 8 LB4 ids' specs, How-to sources, cards and quotes.
- tools/plates/vendor/** and tools/plates/layers/**.
- docs/research/howto/*.json and docs/research/howto/shared/** (back-pain-box.json, front-rack-exemption.json and unrack-rerack.json name front_squat or goblet_squat).
- tests/howto/library-lint.test.ts, tests/howto/library-ci.test.ts, tests/library/**, scripts/**, tests/theme.test.ts, src/ui/styles.css, .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The paths of HT-11, LIB-12-FIX, LIB-ZOOM, LIB-5v, LIB-7b, LIB-7c, LIB-13 and the LIB-8 merge card.

Do:
1. The design note, in lb4/DESIGN.md, posted on the draft PR with your first push as 'LB4 NOTE READY @ <sha>'. Wait for 'LB4 NOTE RULED' before Do 6 b. One row per drawn id, plus a line each for the 8 ids not drawn here, with their block:
   - mode, per D-LIB14-MODES: D only if the child differs from barbell_back_squat only through PARAMS keys the engine reads (`camera`, plate.mjs:81-95), and its card's tempo, checkpoints, Mistake and tells equal the parent's. Otherwise H, listing what falls outside (plan 3.1:268-273). Name every change from the plan's D3 H3 for these six.
   - the clone source (the 8's squat, or the pilot A spec and head), the census closest, and each anchor's approving sha.
   - the composer: `wall` (user and anchor wall_sit; later user wall_ball, LB10). A new shared composer is approved on its anchor plate before any other user is approved.
   - pose-class and convention anchors each id uses (depends_on), and step_up's split-anchor gap (D-LIB14-STEPUP).
   - the expected flags: F5 on every plate (14.4); F7 on pistol_squat with the reason (drawable false), if the named head keeps it; any other with its reason.
   - the R10 items each tier-A card requires (front_squat, goblet_squat, pistol_squat).
   - the hand zoom and the pair key that would draw it. Build none. front_squat (front-rack) and goblet_squat (cupped) are in GAPS on #191; step_up (census handArchetype hold) has no key yet; the other three have hand archetype none (hands/census-scope.json:91-145 on main).
   - the census view.
   - the tempo map, for the supervisor to rule (13 Q3; 14.7; D-LIB8M-TEMPO). wall_sit: Hold ← the w6 quote's range string, as plank's Hold '10–60' (pilot-a/tempo.json:17 @ `ff7c5c4f`; lib4-cards :3299). The five null cards: no map row until D-LIB14-NOSECS's release. Never add seconds.
   - a pose map wherever the drawn start differs from the card's plate.start (13 Q2 (b)). The Mistake is drawn against the end pose (13 Q2 (f)): wall_sit's entry and held pose, and step_up's box start, need a stated map.
   - the fault→key map (13 Q1(a)): each card's plate.mistake → the key its first tell carries; for pistol_squat, also the ruled key for its top fault (bouncing), which must differ from the drawn key.
   - the facts plan under D-LIB8M-FACTS, 22's scope and D-LIB13-FACTS2's contact facts. For example wall_sit's 90° hips and knees (w2) and back on the wall (w4); step_up's 45.7 cm box (c11) is a study's setup, so it becomes a fact only with a measure callout and a ruling.
   - every number the card does not give, for the spec headers' "Unsourced numbers" (13.3 must-fix 14): the wall's height and the box size included.
   - a PQ-H3 estimate per Mistake: deviation at the tell anchor against deviationMin 11.39 px, and wall_sit's Trace against traceLenMin 22.11 px (qa/envelope.json). The heel lifts of bodyweight_squat and pistol_squat may be small [unverified until drawn]. A too-small fault is reported with its card-true size; never enlarged (Q-D5-3). Any zoom route is the supervisor's ruling, as D-LIB13-SHRUG did for the shrugs.
   - Risks.
2. The H slice (D-LIB14-SLICE), posted as 'LB4 SLICE READY @ <sha>'. Bulk starts only on 'LB4 BULK GO'.
   - wall_sit with eq/wall.mjs (the composer's anchor, the hold convention, and the one row with a strip); pistol_squat (single leg, drawable-fault F7); front_squat (the 8's closest clone, the D question, the rack).
   - Post 390 px renders in Paper and Silent Black beside barbell_back_squat and single_leg_romanian_deadlift (pilot A, from a temporary worktree), the unit tests, the two-build plates-page sha256 and the Do 8 QA table for the rows in rows.json.
   - A row held under D-LIB14-NOSECS posts renders and drawn-item tests only, as that ruling says.
   - Authoring QA runs now; it counts as evidence only after Do 6's verdict. Before Do 6 b, every drawn id shows H6:no-card and F7 'no card top fault'. These are expected.
   - The slice post shows A9 and every mutation red and then restored.
3. D rows, only if the ruled note proves one: its spec is `derive(<the 8's squat spec>, row.params)` and nothing else. PQ-H10's child proof (qa/node.mjs:333-348) must pass on all 9 fragments. Never edit the parent.
4. The `wall` composer, `(lm, ctx) => item[]` returning PRIMITIVES types only, in LB3's pattern (eq/romanChair.mjs @ `8781ed0a`: existing primitives and eq/parts.mjs helpers; its assumed sizes go under "Unsourced numbers" in each spec that uses it). The wall is static, so no `poly` twin is needed (PQ-H9, plan 2.1:126-128). No file reads. A per-pose drawn-item test on the real spec (13.1).
5. The build and QA hook (copied from lb3/build.mjs and lb3/qa.mjs @ `8781ed0a`). Both read lb4/rows.json through registry rows() (registry.mjs:30), with `batches` set to every batches/ file plus ['tools/plates/library/lb4/rows.json', <its data>], and pass that set as groupsConfig's and candidateOf's `all`. Never write under batches/.
   - build.mjs: builds the LB4 plates page on main's tools.
   - qa.mjs: runQa per id through candidateOf(id, { all, authoring: true }).
6. Cards (the 6, once):
   a. At start, once 'LB4 research head' is posted: copy the 6 cards and quotes byte for byte from it and commit them, with lb4/cards.sha.json holding the research head sha and each copy's sha256 (in the canonical form the test states).
   b. After 'LB4 NOTE RULED': add top-level plateFacts, tempo and topFault per D-LIB9-CARDFIELDS, 13 Q1, the ruled maps, 14.7's form rules and D-LIB8M-FACTS with 22's scope. Each value names the claim whose quote states it. No value comes from a spec. cards.sha.json keeps each card's sha256 without those three keys. The five NOSECS cards get `tempo` only as D-LIB14-NOSECS says.
   - Post 'LB4 CARD FIELDS READY @ <sha>' and wait. The supervisor runs the blind verify of PANELS.md section 3 (one planted error, the pose map in rules.md, Q1's topFault checks; lib4-cards :1143).
   - Fix only what it names, re-run qa.mjs for the rows that changed (H6 must pass), and post 'LB4 CARD FIELDS FIX @ <sha>'. A focused re-verify with a new plant runs on the changed cards. 'CARD FIELDS VERIFIED @ <sha>' follows.
   - If the research head moves for an LB4 card: copy it again, re-apply its keys, update cards.sha.json. If a cited claim changed, the verifier re-runs for that card and its plate is QA'd again.
7. Draw the bulk on 'LB4 BULK GO', following DRAWING-GUIDE.md: bodyweight_squat (wall_sit's card parent), goblet_squat, step_up. LB1-LB3's lessons, each with a drawn-item test where it applies (A15):
   - The Mistake reads as a pose outside the solid end figure: red parts clear it by at least 6 px, or are drawn as red dashed lines over it (13.1; 13.4 must-fix 1; 13.7).
   - 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key (Q-D5-4; D-LIB10-SKULL1).
   - Callout boxes sit in open space; leaders meet their anchor from the open side. No leader runs within about 6 px of the Trace, a bar, the box or the wall.
   - A hidden start part is redrawn as a dashed phantom (Q2 (c)). Ghosts follow the real joint path; a straight limb never bends between poses (13.3 must-fix 1, 3).
   - Tests assert on drawn items, never on the spec's own formula (13.1; 13.4 must-fix 3).
   - A cue table per id: the card's `what` and claim, the plate cue, the word count (Q-D5-6).
   - Card truth wins over a critic's fix (PANELS.md 1 point 5; D-LIB13-ONEARM). If one card's facts cannot all hold on the body at once, stop and post the per-card conflict.
8. QA (after the verifier's verdict on the cards it covers):
   - build.mjs builds the LB4 plates page twice, to a temp directory; the bytes must match;
   - qa.mjs runs runQa's node and browser halves (Chromium at /opt/pw-browsers/chromium) per id and prints the table: hard checks, raised flags (F5's element and value shown) and metrics.
   - A measured flag that differs from the ruled expected set is posted with its value and range, and ruled before READY. No flag is dropped or exempted.
9. Post the ready line with the per-id table. Then the supervisor runs the calibrated critic per PANELS.md section 1:
   - Anchors per D-LIB14-ANCHORS; a hidden anchor is never the visible reference. 13.7's facts diff runs before the round.
   - Two plants rebuilt on LB4 plates at the head, each on a different candidate and a named rubric item.
   - The brief carries 13.6's rule: any pose fix keeps the drawn segment lengths and states them.
   - Fix only what the critic names. A fix never edits a card. If a fix would break a hard check, a pinned test or a ruling, post the conflict with its evidence.
   - One fix round, then one fresh calibrated recheck on the changed plates. A plate that fails its recheck gets a second focused round only by ruling (D-LIB13-PANEL2), else it is held (D-LIB8M-CARDTRUE).

Acceptance (each mutation must turn red, then be restored; list each one in the PR with its red line):
- A1 The note and the slice are posted before the bulk, with a cited mode reason per id, and the bulk starts on its GO. wall_sit is approved before any other `wall` user. Evidence: PR comment links and approval comments.
- A2 `wall` uses PRIMITIVES types only. In every drawn pose (entry, held, Mistake) its face sits at one fixed x (±1 px), and wall_sit's back contact holds where the ruled facts place it (w4; D-LIB13-FACTS2). Mutations: {type: 'wedge'} turns H9.type red; the wall moved 2 cm in the Mistake is red; the back moved 2 cm off the wall in the held pose is red.
- A3 Closures are pure and drawn by the vendor engine. For each id, closureOf(spec) passes, contains tools/plates/vendor/MANIFEST.json, has no path under tools/plates/layers/ and no specs/ file but its own. Mutations: readFileSync added to the composer makes closureOf throw; a spec importing tools/plates/layers/engine/body.mjs → red; a spec importing a pilot A spec → red.
- A4 For every id in lb4/rows.json, every PQ-H1..H10 check passes in runQa node and browser, and the raised flags equal the ruled expected set exactly. Mutations on one LB4 plate, each red: LIB-3's M1-M7 as named in qa/mutations.mjs; a colour literal (H2.colour); its F5 tell chrome changed so F5 reads 3.40 (in a temporary worktree, never committed); and, once pistol_squat is in rows.json, its topFault set equal to its drawn key → the F7 expectation fails.
- A5 lb4/rows.json holds exactly the drawn ids that are not held, each once, counted in the raw text. Each held id is in DESIGN.md's held table with its ruling and in no rows file. None of the 8 ids not drawn here is in lb4/rows.json. Mutations: drop a row; duplicate a row; a held id added; box_jump added.
- A6 PQ-H6: facts within ±2° or ±1 cm, tempo equal to the card's, F7 only where the note names it, one form per fact. Mutations: a fact +3° turns H6 red; the card path removed gives H6:no-card; a fact with both `joint` and `measure: true` → red.
- A7 Only if a D row is ruled: PQ-H10 with the child proof. Mutations: derive, then set tempo → H10.child:tempo; a param outside its `D:barbell_back_squat` range → H10.value; a raw-spec key → H10.raw.
- A8 The NOSECS hold (if D-LIB14-NOSECS (a) is ruled): each held spec builds, its drawn-item tests pass, and it is in no rows file and on no page. Mutation: one held row added to rows.json → A5 red, and the page build's extract throws (golden.mjs:116).
- A9 Nothing ships (D-LIB14-AHEAD). lb4-plates.test asserts:
  - every lb4 row's stage is drawing or review;
  - none of the 6 drawn here is in shippedIds(), in any batches/ file, or in tests/howto/golden/library/, matched as whole tokens (`\b(lib_)?<id>\b`, and `(^|[^a-z0-9-])<slug>([^a-z0-9-]|$)` for the hyphen form). No file name there matches /lb4/i, and no text names `"batch": "LB4"`;
  - no LB4 spec, composer, How-to or test imports anything under hands/;
  - generate --check is green and unchanged. The PR body reports the seconds its child process took.
  Mutations, shown in the slice post: one row set to shipped; one set to approved-plate; rows.json copied into batches/; a file naming an LB4 id in tests/howto/golden/library/; a page-only lb4.json `{"entries":[{"kind":"page","batch":"LB4"}]}`; front-squat.layers.html with `data-id="front-squat"`. Control: a file naming only lib_box_jump and lib_reverse_lunge (pilot A, not drawn here) stays green against the 6 drawn ids. The test also asserts, over exercises.json, that no real id other than lib_<id> contains any of the 6 (checked on main `5158609c`: none does).
  Recorded check (not a unit test): before each milestone post, run `git diff --exit-code origin/main...HEAD -- tools/plates/library/batches tests/howto/golden tools/plates/library/hands tests/howto/library-lint.test.ts src tools/plates/gen` on the merged head and paste its empty output. Seed it once in a temporary worktree: one uncommitted byte changed in tests/howto/library-lint.test.ts must give exit 1.
- A10 The plates page is deterministic (PQ-H7): two equal sha256 values.
- A11 A card differs from its research-head copy only in the three keys (cards.sha.json). The test holds its own copy of the ruled tempo table and builds each card's tempo only from it and plate.tempo. Each fact's pose equals the ruled pose map's image of the pose its quote states. Mutations, each red: any other card key edited; a Rest phase added to wall_sit's card and spec; wall_sit's Hold constant changed from its quote's string; seconds added to one NOSECS card's tempo and spec; a start fact named with the unmapped pose.
- A12 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head.
- A13 The content verifier is VALID (its plant caught) on the 6 cards' fields at the head's cards.sha.json, with Q1's topFault checks, before any Do 8 evidence. Evidence: 'CARD FIELDS VERIFIED @ <sha>'.
- A14 The critic run is VALID under PANELS.md section 1, and the supervisor's approvals are recorded per exercise. Each held plate has its reason and ruling on the PR.
- A15 Do 7's lessons, Do 1's R10 items and the Q-D5-6 cue table are tested on drawn items. Mutations, each red: a red Mistake part moved inside the figure's 6 px clearance; a leader within 6 px of the wall; one tier-A R10 item removed; a cue over 15 words.

verification: the per-id QA table, both plates-page sha256 values and the A9 recorded diff check at the exact head sha. The verifier's and the critic's comments name that sha.

risk_and_recovery:
- The named research head differs from `4c9eb363` for an LB4 card (the LR-29 verify, D-SUP-PROTECT): the note follows the head. A pick changed after drawing re-plans that Mistake, re-proposes its fault→key entry, and re-runs the verifier and QA for that card.
- No tempo seconds on 5 of 6 cards: D-LIB14-NOSECS. Never invent seconds, never exempt H2.chrome:tempo, never ask research for seconds (lib4-cards :3308).
- A D row fails the D test (expected; LB1's 9 did, lb1/DESIGN.md 1 @ `9e5d9666`): it is H, about +2.5 Opus-hours [est].
- The `wall` reads wrongly side-on, or the back does not stay on it [unverified until drawn]: A2's geometry tests catch it; R2 and R3 judge it on wall_sit.
- A Mistake below H3's deviationMin (bodyweight_squat's or pistol_squat's heel lift) [unverified until drawn]: report its card-true size; the supervisor rules (held, or a zoom ruling). Never enlarged.
- wall_sit's Trace (entry to held pose) is below traceLenMin [unverified until drawn]: as D-LIB13-TBAR, report it; it is held, never exempted.
- step_up's split anchor stays held at sheet time: D-LIB14-STEPUP.
- pistol_squat's drawable false adds a seventh drawable-fault id to plan 3.3:339's "6": a supervisor docs action (D-LIB14-PISTOL).
- A plate cannot pass a hard check card-true: it is HELD and reported (D-LIB8M-CARDTRUE). Any zoom view shows no angle number (owner, lib-zoom-card.md:12, :34).
- Pilot A, LIB-12, HT-11 or LB1-LB3 lands mid-card: merge main in, rebuild the plates page twice and re-run QA. Approvals are head-only.
- Another branch's COACHING-DECISIONS entries land first: resolve the append conflict by keeping both sides.
- Two failed tries of one approach with no new evidence: stop and report on the PR.

return:
- the PR number and head sha;
- links to the note, the slice, the card-fields line and the ready line;
- the per-id table (mode, clone source, composer, hard checks, flags, held or not, and why);
- the plates-page sha256;
- the mutation list and the A9 recorded diff check;
- the output of check, test:tz and the gate.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-14 resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

---

Proposed rulings (D-LIB14-*). Each is PROPOSED, needs the supervisor's ruling. None binds the builder until ruled.

1. D-LIB14-AHEAD (PROPOSED, needs the supervisor's ruling): as D-LIB10-AHEAD (lib4-cards :3156-3159) and D-LIB13-AHEAD (lib-13-card.md:317), with LB4 names.
   - LIB-14 may push with its drawn LB4 rows at stage drawing or review in tools/plates/library/lb4/rows.json. Nothing goes under batches/, tests/howto/golden/, src/ or tools/plates/gen/, and its A9 test enforces this.
   - Every D-LIB4-ENTRY condition holds before any LB4 id is approved-plate, pinned, in batches/ or shipped.
   - Why: D-LIB4-ENTRY-2 (lib4-cards :1055-1070) names LIB-9 only, and :3159 extended its reason to LB2: K cannot rise while no id ships. D-LIB13-AHEAD did the same for LB3. The ceiling is a committed test with mutations. Plan 6.3:781-784 makes a batch's tie to the one before it checklist order only, and plan 3.1:293-299 gates sheets and D/T starts, not H drawing. A D row starts only after its source among the 8 is approved, which holds.

2. D-LIB14-MODES (PROPOSED, needs the supervisor's ruling): the note proves each id's mode. A D row exists only if the child differs from barbell_back_squat only through `camera` (the one PARAMS path the engine reads, plate.mjs:81-95; derive.mjs:4-12) and its card's tempo, checkpoints, Mistake and tells equal the parent's. Otherwise it is H.
   - Expected: all six H. At `4c9eb363` the three D cards have null tempo against the squat's Lower 2 / Drive up 1 / Brace 1 (vendor barbell_back_squat.mjs:126), and each names its own Mistake. LB1's 9 D rows failed the same test (lb1/DESIGN.md section 1 @ #245 `9e5d9666`). LB4's plan marks then read D0 P1 T5 H8.
   - Why: plan 3.1:272 ("An id that needs anything outside PARAMS becomes H"); H6 compares the spec's tempo with the card's exactly (qa/node.mjs:176).

3. D-LIB14-NOSECS (PROPOSED, needs the supervisor's ruling): front_squat, goblet_squat, bodyweight_squat, step_up and pistol_squat have no tempo seconds (up, down and pause null; #285 6334536097; LR-33 keeps null). Without seconds there is no tempo strip, and a card without one fails PQ-H2 and breaks the page extractor for every id (D-LIB8M-NOSTRIP, lib4-cards :3307, :3311).
   - (a) Recommended: draw the five now (specs, drawn-item tests, plateFacts and topFault, the CARD FIELDS verify of those two keys). Hold them off lb4/rows.json and the plates page (D-LIB8M-PAGESET) until the "tempo strip for plates with no sourced seconds" design is ruled and on main. Then add their tempo key under that design, run a focused re-verify of tempo, QA them and run their critic on this PR. Renders for the slice look come from a temporary page built outside the repo tree; they are never QA or critic evidence. Never exempted.
   - (b) Rejected by current rulings: research adds a drawing-convention up and down, as back_extension's c21 (WEAK) did. LR-33 keeps null on a card with no seconds at all (RULINGS.md:40), the LB4 brief forbids it (lb4-research-card.md:52), and D-LIB8M-NOSTRIP says research is not asked (:3308). Changing that is a research ruling, and the tempo strip is shown to users, so it may be an owner choice.
   - (c) Rejected: drop the five from the build-ahead. The drawings do not depend on the strip, so drawing now takes them off the critical path.
   - Why: wall_sit is the only LB4 card with a sourced static phase (w6's Hold range; plank's Hold '10–60' is the precedent, lib4-cards :3299). The no-seconds design is on the follow-up list (lib4-cards :3410; pilot-a/plates.json held lines for box_jump and reverse_lunge). It now blocks 13 of LB4's 14 ids.

4. D-LIB14-SLICE (PROPOSED, needs the supervisor's ruling): the H slice is wall_sit (the `wall` anchor, the hold convention, the one row with a strip), pistol_squat (single leg, drawable-fault F7) and front_squat (the closest clone of the 8, the D question, the rack). Bulk: bodyweight_squat, goblet_squat, step_up, in one GO.
   - Why: plan 6.3:771-772 and cards.md "hard cards": the representative and the highest-risk cases first. Six ids need no second drawer.

5. D-LIB14-STEPUP (PROPOSED, needs the supervisor's ruling): step_up is drawn H now. It goes on a sheet only after the split anchor (reverse_lunge) is owner-approved and pinned (plan 3.1:297), or after the supervisor names another split anchor by ruling. Until then it rolls (plan 3.5:376).
   - Why: census poses ['split', 'single'] put step_up in the split class (9 users, anchor reverse_lunge). reverse_lunge is held (D-LIB8M-NOSTRIP), and its pick changed to drawable false at #285 `4c9eb363`, so its plate will be redrawn at re-approval. The anchor rule gates sheets, not H drawing.

6. D-LIB14-ANCHORS (PROPOSED, needs the supervisor's ruling): D-LIB10-PANEL1 unchanged. Hidden anchors are golden B's pull_up and lat_pulldown until pilot A is pinned (PANELS.md 1 step 1), then D-LIB10-ANCHORS' pair, with its pilot A one-item exception. Visible references: barbell_back_squat (the 8) and pilot A's single_leg_romanian_deadlift and plank at their approving heads; none is a hidden anchor in the same round. Golden-B follow-ups 19-21 stay excepted as recorded.

7. D-LIB14-PISTOL (PROPOSED, needs the supervisor's ruling): if the named head keeps pistol_squat drawable false, F7 is expected and needs the owner's named yes on the LB4 sheet. topFault is the ruled key of "bouncing out of the bottom", which must differ from the drawn heel-lift key (D-LIB8M-TF1 4). The supervisor amends the plan as a docs action on claude/howto-options (plan 1:85-88's list; 3.3:339's "6 drawable-fault ids"), as D-LIB8M-SLRDL did (lib4-cards :3290).

Supervisor follow-ups (not the builder's):
- Rule the 7 proposals above, then mark this card `ready`.
- Name 'LB4 research head <sha>' after the LR-29 verify of #285 (RESEARCH READY @ `4c9eb363`) passes for the six cards. UNVERIFIED: whether that verify runs on the six first or on all 14 together (lb4-research-card.md:61 verifies the 14 before merge).
- Card the no-seconds tempo-strip design now (D-LIB14-NOSECS). It is a design shown to the owner, and it gates box_jump, reverse_lunge, jump_squat and the five here.
- 'LIB-14 start' names the active-builder count. HANDOVER 8.0p (06:05 UTC) had 3 of 4 active (LIB-13 #274, LIB-5v #282, LIB-7b #284). UNVERIFIED: the live count when it starts.
- Merge LIB-14's card-field commit back into claude/libht-research only after #285 is merged there.
- Card the other 8 LB4 ids when their blocks clear.

---

Collision check (cards.md step 1; `git diff --name-only origin/main...<branch>` at main `5158609c`, 2026-10-22 ~07:00 UTC):

| PR | branch @ head | files | overlap with write_scope | pins on the six ids |
|---|---|---|---|---|
| #191 LIB-12 | lib-12-hand-views @ `8bea5afc` | 100 | docs/COACHING-DECISIONS.md (append) | hand-front-rack.mjs, hand-cupped.mjs (GAPS), census-scope.json, lib12-claims.json, tests/library/hand-views.test.ts, lib12-fix.test.ts: read only here; claims equal `4c9eb363` |
| #109 pilot A | lib-8-pilot-a @ `ff7c5c4f` | 102 | docs/COACHING-DECISIONS.md (append) | pilot-a/plates.json hands (goblet_squat cupped, front_squat front-rack sheet renders); src/howto/coverage.ts (reserved) |
| #245 LB1 | lib-9-lb1 @ `9e5d9666` | 67 | none | none (cards/hanging_knee_raise.json says "step-up" in prose) |
| #279 LIB-ZOOM | lib-zoom @ `754176a0` | 90 | none | as #245 |
| #265 LB2 | lib-10-lb2 @ `2dcbac15` | 35 | docs/COACHING-DECISIONS.md (append) | none |
| #271 LIB-7c | lib-7c-lb1-hands @ `88ad31bd` | 20 | docs/COACHING-DECISIONS.md (append) | none |
| #274 LB3 | lib-13-lb3 @ `8781ed0a` | 42 | docs/COACHING-DECISIONS.md (append) | none |
| #278 pilot B | lib-11-pilot-b @ `d3b231d6` | 29 | none | none |
| #273 HT-11 | ht-11-delta @ `e0722148` | 33 | none | none |
| #282 LIB-5v | lib-5v-variant-line @ `f23a549b` | 13 | docs/COACHING-DECISIONS.md (append) | none |
| #284 LIB-7b | lib-7b-hand-blocks @ `b5e31e08` | 1 | none | none |
| #285 LB4 research | libht-research-lb4 @ `4c9eb363` (vs claude/libht-research) | 16 | the six cards/*.json: the byte-copy source, research-owned | — |

- Shared add-only files on main (scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css): no line names any of the six. LIB-14 touches none.
- Result: no unsettled collision. The only shared write is the append-only COACHING-DECISIONS.md (keep both sides). #191's GAPS blocks and #109's sheet hands are read only and named in read_first.

UNVERIFIED items (each checked by the supervisor before `ready`):
- UNVERIFIED: Which D-LIB4-ENTRY conditions hold today.
- UNVERIFIED: The live active-builder count, and whether LIB-14 takes the 4th slot.
- UNVERIFIED: Whether the LR-29 verify of #285 can name a head for the six before the other 8 pass.
- UNVERIFIED: Whether the named head keeps pistol_squat's drawable false and every other pick; D-SUP-PROTECT may move a pick in the verify.
- UNVERIFIED: Whether wall_sit's Trace and the two heel-lift Mistakes pass PQ-H3 (unknown until drawn).
- UNVERIFIED: Whether the vendor dumbbell's `axis` option draws goblet_squat's upright dumbbell to the bar (unknown until drawn).
- UNVERIFIED: Whether the owner's "Pilot a ok" (10-19) covers the held box_jump and reverse_lunge plates as anchors. This card assumes it does not.

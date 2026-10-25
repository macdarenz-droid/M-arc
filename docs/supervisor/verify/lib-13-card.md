Card LIB-13: LB3 plates, build-ahead, 8 ids (2026-10-19; rulings D-LIB13-* recorded below). The three shrugs are LIB-13s (last section), on the same branch and PR. The ship phase (layers, pin, button) is a later card on the same branch and PR.

id: LIB-13
model: claude-opus-5-5 (plates, composers and any template are judgement work, plan 3.1)
mode: auto
title: 'Builder: LIB-13 LB3 plates'
branch: claude/lib-13-lb3 (new). Your first push opens draft PR 'LIB-13 (build-ahead): LB3 plates, nothing ships'.

base: the latest origin/main when the session starts (565ea5a462c19a593493cfbded02c9074deda811, train 30, or later), never an unmerged head (ruling 1). LIB-3c #264 is on main, so D-LIB9-AUTHORQA, the fresh-import PQ-H7, qa/param-ranges.json and the child proof are there.
- Every main line number cited here was read at `565ea5a4`. Re-read each one on your start head, and use the line you find there.
- Not LIB-10's head `2dcbac1` (#265). The LIB-10 card's base rule (lib-10-card.md:9-13) starts from main and never merges an unmerged head, and branching from #265 merges it. LB3 needs no LB2 file: its clone sources are pilot A's row and hinge specs on #109, and its composers are new. #265 still moves, and its 35 changed paths would enter LB3's diff and review.
- Copy LB2's build.mjs, qa.mjs and test patterns with `git show 2dcbac1:<path>`. Never import anything under lb2/.
- Where the plan (claude/howto-options @ `a5e87d9e`) differs from lib4-cards sections 12-24 or the D-LIB13-* rulings, those win.
- Merge origin/main into this branch, with a merge commit, each time pilot A (#109), LB1 (#245), LB2 (#265's ship), HT-11, VITEST-RPC, LIB-5 Do 9 (#270) or LIB-ZOOM lands. The steps that need them wait (build_prerequisites).
- Never merge an unmerged head (#109, #245, #265 or any other). Read them with `git show <sha>:<path>`. To render a pilot A plate beside an LB3 plate, check that head out into a temporary `git worktree` outside the repo tree. Never commit it, and never merge it.
- Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on (plan 7 row 13, :771): HT-11 and LIB-10. HT-11 and LB2 govern the merge only. Pilot A's yes also gates:
- every T child's start (plan 3.1:258-264);
- every LB3 plate going on a sheet: the hinge anchors romanian_deadlift and barbell_row (plan 2.2:152); the engine-dumbbell anchor dumbbell_biceps_curl (plan 2.2:162) for one_arm_dumbbell_row and dumbbell_romanian_deadlift (and LIB-13s's dumbbell_shrug); the drawable-fault convention (plan 1:85-88; the curl's F7 named yes, D-LIB8M-TF1 4) for one_arm_dumbbell_row; and the 4 reused plates. LIB-13s's dumbbell_shrug also needs the front-view anchor upright_row (:161).
That yes is pilot A's plates pinned on main with the approvals D-LIB-O5 allows (14.8 point 5), and the owner's named answers on the pilot A sheet (sent ~07:1x 10-19 @ `48d49bb`; no answer yet). LB3 reuses whatever LIB-8M pins.

build_prerequisites (the supervisor posts each on the PR or on claude/sup-lib4-cards, or sends it to your session while no PR exists. If one is missing when you reach its step, go on with any other permitted step; set WAITING only when none is left, per D-LIB-LANE-ACTIVE):
- To start: 'LIB-13 start', which names the active-builder count, LIB-13's place in the freed-slot queue and the park order if LIB-10 resumes after pilot A merges; 'LB3 research head 2dd60ae0349b06a4aac88a11347edac5536f8424', the merge of #272 into claude/libht-research that the supervisor posts (link it in the PR body); D-LIB13-AHEAD (ruling 2).
- At start: Do 1, Do 4's landmine and romanChair, Do 5, Do 6 a, and the H slice (Do 2 a) with its QA. Copy pilot A code with `git show` from #109 @ `48d49bb`, or a later #109 head the supervisor names.
- Do 6 b: the note's tempo map, pose map and fault→key map ruled on the PR ('LB3 NOTE RULED'; Q3; 13 Q1(a); D-LIB8M-TEMPO).
- Each family's bulk (Do 7): 'LB3 <family> BULK GO', after the supervisor's look at that family's slice.
- A T slice, any template and any T child: only if the note's table makes dumbbell_romanian_deadlift's family T (ruling 4). Then pilot A's yes (depends_on) is on main and merged in, and D-LIB10-FACTS's schema and D-LIB10-RANGES family rows are ruled for that template (route 15 (i) 4b). A T row's QA counts only on a head where those rows are on main and merged in.
- Do 8 evidence: 'CARD FIELDS VERIFIED @ <sha>' for the cards it covers.
- A12 and READY: VITEST-RPC on main and merged in (D-LIB8M-RPC (b)). Until then, a red caused by the RPC timeout is ruled by the supervisor, never re-run.
- Do 9 (the critic run) and every approval: the ready line, and D-LIB13-ANCHORS (ruling 8).

merge_prerequisites: never merges as this card. The ship card merges LB3 only when all of these hold:
- Every lower-numbered item on the owner's checklist has merged, LIB-11 (pilot B) included (AGENTS merge rule; ruling 11).
- HT-11 is on main (plan 5.1:490-493; ht-11-card.md finish).
- LB1 (#245) and LB2 (LIB-10's ship card on #265) have merged.
- Pilot A's yes, as defined in depends_on, is on main.
- Every D-LIB4-ENTRY condition holds.
- F-LB3-1 is on main: barbell_row's, barbell_shrug's and romanian_deadlift's risks[breath] read "Heavy reps with a held breath send blood pressure very high." (R-LB3-11 @ `c6d2930b`; re-copied into #109 by LIB-8M under the supervisor's diff check before #109 merges). The D-LIB5-FAMILY comparator is green for pendlay_row, t_bar_row and landmine_row against barbell_row.
- The D-LIB5-FAMILY comparator is on main, and the supervisor has ruled the inherit[] map for LB3's card children. Counted at `c6d2930b`; recount on 2dd60ae0349b06a4aac88a11347edac5536f8424: pendlay_row 5, t_bar_row 4, landmine_row 5 (parent barbell_row); dumbbell_romanian_deadlift 2, conventional_deadlift 4, single_leg_romanian_deadlift 2 (parent romanian_deadlift); sumo_deadlift 5 (parent conventional_deadlift, same batch). A child whose card parent is below shipped does not ship (D-LIB10-PARENTS).
- The back box is on main: LIB-5 Do 9 (#270) and LIB-6-PM's back patches with S5-L (LR-28; D-LIB5-PAGE, lib4-cards :2689). 7 of the 8 cards drawn here list redFlags 'back'.
- The variant-line field card (LIB-5v) is on main before t_bar_row ('T-Bar / Machine') or back_extension ('Bodyweight / Machine') ships (D-LIB5-VARIANT 6).
- one_arm_dumbbell_row's F7 (drawable false) has the owner's named yes on the LB3 sheet (13 Q1; D-LIB8FIX-ENV).
- A calibrated critic has scored R8 and R9 at 4 or more for every LB3 plate that ships (13.1).
- The shrugs ship only through LIB-13s; otherwise they roll (plan 3.5:341).

Rulings this card relies on. These are summaries; where the posted text differs, the posted text wins.
- D-LIB9-ENGINE: specs import only tools/plates/library/engine.mjs (the vendor engine). poly and flat palm are allowed. Nothing imports tools/plates/layers/.
- D-LIB9-AUTHORQA: candidateOf(id, { all, authoring: true }) (candidate.mjs:84). Its default path stays unchanged.
- D-LIB9-CARDFIELDS, with 13 Q1 (topFault) and Q3 (tempo map):
  - drawable:true: topFault is plate.mistake's key, and the spec's first tell carries it;
  - drawable:false: topFault is the ruled key of the card's named top fault, which differs from the drawn key, and F7 stays raised (D-LIB8M-TF1 4: the curl's 'wrist-bend');
  - tempo: D-LIB8M-TEMPO, one map rule for every batch. The concentric takes up, the eccentric takes down, Hold takes pause right after the concentric only if pause > 0. Any other static phase is a constant only with a quote that states its seconds. A range is the quote's string. No Rest.
- D-LIB8M-FACTS, with 22's exact scope (D-LIB10-CF1): every number a claim gives in plate.start or plate.end becomes a plate fact. An equipment number becomes a fact only when the plate shows it with a measure callout. A quoted range [a, b] is written as its midpoint with a note holding the quote and the range, only when b − a ≥ 2 × LIMITS.angleDeg for an angle, or b − a ≥ 2 × LIMITS.cm for a length (H6's ±1 cm); otherwise it needs a ruling. If the engine report has no such angle and the plate has no measure, report it and do not invent a key (22 point 1).
- D-LIB5-TEMPO8 rules 10-15 (14.7): kind on every fact; one form per fact (never both `joint` and `measure: true`; a measure fact carries no joint, 21.5 point 4); pose is the spec's pose name.
- D-LIB9-FACTPOSE (#245 6243105672): a fact's pose is the pose its quote states; a setup instruction states the start pose only; a contact is never carried to another pose by inference.
- D-LIB9-F5 (14.4): `exemptions: ['F5']` only for the selected Mistake tell in Midnight at exactly 3.57.
- D-LIB9-CLONE (13.2): copy, never import a pilot A spec; every copied root finder throws on a bracket with no root; re-derive each bracket and record what it solves to.
- D-LIB8M-CARDTRUE (16; 21.2-21.6): the plate follows the card. A card value is never moved to fit a drawing. A plate with no card-true drawing that passes every hard check, or that fails its last critic run, is HELD: stage review, off the page and the rows file, on the follow-up list, reported. Never exempted.
- D-LIB8M-PAGESET: a held id gets no row and is off the page.
- D-LIB10-BENCH-H and D-LIB10-BBELBOW (#265 6256170884, 6256266008): a child that cannot meet its own card through PARAMS and facts is H; a template whose children all fail is not built. If one card's facts cannot all hold on the body at once, stop and post the per-card conflict; never tune a value off the card.
- D-LIB10-NOTE (#265 6255216039) Q1-Q2, for any family ruled T: a param read from a relational claim (Q1 (a), with its conditions); an unsourced template default (Q1 (b)); the bottom rule stated completely and a feasibility table posted before the first child's approval freezes the template (Q1 (c)); never edit or fork a pilot A composer, and stop and propose a composer for a ruling instead (Q2 2).
- D-LIB10-RANGES, D-LIB10-CHILDPROOF and D-LIB3c-SHARED (15, 15.1): on main with LIB-3c. LIB-13 never edits qa/param-ranges.json.
- D-LIB10-TEMPLATES, D-LIB10-FACTS, D-LIB10-PARENTS (15 items 4, 7, 9), read for LB3's families.
- D-LIB10-SKULL1 and Q-D5-4: 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key. A one-tell plate needs a per-id ruling.
- D-CRITIC-CAL3 (13.5), with 13.7's facts diff and 13.6's segment-length rule; D-LIB10-PANEL1 (24) for the anchors.
- D-LIB8-shrug (docs/supervisor/HANDOVER.md:1471 on main): a right pose is never moved or exaggerated off its card to pass a check (Q-D5-3); the shrug is held until a sourced elevation exists.
- D-PILOTA-R5 and D-LIB8M-CARRY: an approval counts only for the head it ran on.
- D-LIB-LANE-ACTIVE: you hold a LIB drawing slot from your start. WAITING only when no permitted step is left.
- D-LIB9a-HOWTOID: a How-to source here holds only `research` and `id`.
- LR-31, LR-33 and LR-36 (RULINGS.md on claude/libht-research): research applied them on #272 (R-LB3-1..11); this card never edits a card's research fields.
- D-LIBHANDS-COUNT (20): binds only a card that adds hand modules. LIB-13 adds none.
- D-LIB13-AHEAD, -PA, -MODES, -LANDMINE, -SUPPORT, -SHRUG, -ANCHORS and -SCRATCHIDS: ruled (section "Rulings recorded" below).

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Every plate meets the bar of the 8, pilot A, LB1 and LB2: every plan 3.4 item at 4 or more (R8 and R9 stay unscored here, as in 13.1).
- No check, envelope, threshold, rubric item or test is relaxed, skipped or exempted to save time. A plate below the bar is redrawn, and you report the time it cost.

shared-file owners:
- None of the AGENTS shared add-only files is touched.
- tools/plates/vendor/** and tools/plates/layers/**: read only.
- Pilot A's files (#109: specs/, eq/inclineBench.mjs, eq/safetyArms.mjs, eq/pecDeck.mjs, pilot-a/**, tools/plates/library/DRAWING-GUIDE.md), LB1's files (#245) and LB2's files (#265: lb2/**, its specs, eq/declineBench.mjs): read only. Composers on main (eq/parts.mjs, eq/rope.mjs) may be imported; specs are copied, never imported.
- candidate.mjs, registry.mjs, derive.mjs, plates-page.mjs and qa/** (qa/param-ranges.json included): untouched. Family rows reach main only by D-LIB10-RANGES 4b.
- docs/research/howto/cards/** and quotes/** belong to claude/libht-research. Here they are byte copies of the 8 LB3 cards from 2dd60ae0349b06a4aac88a11347edac5536f8424, plus their three keys. The supervisor merges the field commit back, only after #272 is merged into claude/libht-research.
- The 5 pilot A ids' research cards (barbell_row, romanian_deadlift, single_leg_romanian_deadlift, upright_row, barbell_shrug): never written here. They reach this branch when main, holding LIB-8M, is merged in.
- F-LB3-1 (R-LB3-3; R-LB3-11) is not this card's work. Research applied the breath line to barbell_row, barbell_shrug and romanian_deadlift on #272 (R-LB3-11 @ `c6d2930b`). #109 (LIB-8M) re-copies those three lines under a supervisor diff check before #109 merges. This card never edits a pilot A card.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. Your first push carries the design note and opens the draft PR. Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full qa.mjs run) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`, and poll its log. A tool background job stops at about 2 hours, and a stopped run is never evidence.
- A CI failure on `[vitest-worker]: Timeout calling "onTaskUpdate"` is a real defect (D-LIB8M-RPC (b)); its fix is VITEST-RPC. Keep each test's child processes well under vitest's 60 s limit. Until VITEST-RPC is on main, the supervisor rules such a red. Never re-run to green.

hard card: the design note and the H slice come before any bulk drawing. A T family, if ruled, gets its own slice (template, parent byte proof, one child) before its bulk.

outcome: LB3's 8 non-shrug plates, the two new composers, any ruled template and the 8 cards' machine fields exist on this branch at stage drawing or review.
- Every plate in lb3/rows.json passes every LIB-3 hard check (runQa, node and browser halves), PQ-H10 included.
- The raised flags are exactly the ruled expected set.
- Any template rebuilds its parent's pinned plate byte for byte.
- The cards' machine fields have the content verifier's VALID verdict.
- The 4 pinned pilot A plates are reused unchanged.
- A plate that cannot pass card-true is held and listed, never exempted.
- Nothing ships: none of the 8 gets a button, pin or batches/ row; no layers page; no app change.
deliverable: the specs, composers, any ruled template, rows, tempo map, LB3 plates-page build and QA scripts, design note and tests.
evidence: the per-id QA table at the head sha; the plates-page sha256 from two identical builds; any template's byte proof; the unit tests with their mutations; the recorded diff checks (A9); the content verifier's verdict; then the critic's verdict.
finish:
- 'LB3 PLATES READY @ <sha> (plates page <sha256>)' is posted;
- the critic run is VALID under 13.5's rule with every plate at the bar, or each failing plate has had its one fix round and recheck and is held;
- the supervisor's per-exercise approvals are recorded on the PR (head-only).
- The shrugs never block LIB-13's READY. dumbbell_shrug and cable_shrug sit in DESIGN.md's held table (D-LIB8-shrug) until LIB-13s draws them with barbell_shrug.
Then stop; LIB-13s, then the ship card, take over the branch. You will notice: nothing in the app.
forecast [est]: about 40-48 Opus-hours at plan 9's pace (:869-870, :872): 8 H plates × 4 h; landmine and romanChair 2 h each; QA and critic 0.75 h per id. A ruled template adds about 4 h and saves about 2.5 h per T child. LIB-13s is not in this forecast: about 13 h (3 shrugs × 4 h plus QA). LB1 needed 4 review and 4 critic rounds; LB2's first panel passed 5 of 5. So allow up to about twice that. The calendar depends on a free lane slot, pilot A's merge (T children, reuse), VITEST-RPC and HT-11 (merge only), which this card cannot forecast.

LB3 ids (plan 6.2 :673 and :693-696 @ `a5e87d9e`; census docs/howto/library/inputs/census.json @ `4a9fd86` has all 15 rows, in batches B04, B22 and B15; card facts below read at #272's final head `c6d2930b`, whose cards equal the #272 merge; re-read them on 2dd60ae0349b06a4aac88a11347edac5536f8424):
- The row "15 | 11 | P3 T7 H5" reads: 15 ids; 11 tier A (marked * in :693-696, legend :630; the cards' `tier` A, not the census `tier`); 3 template parents (barbell_row P:HROW, romanian_deadlift P:HINGE, barbell_shrug P:SHRUG, all pilot A); 7 template children (pendlay_row, t_bar_row, landmine_row in HROW; dumbbell_romanian_deadlift, conventional_deadlift, sumo_deadlift in HINGE; cable_shrug in SHRUG); 5 hand-drawn (one_arm_dumbbell_row, single_leg_romanian_deadlift, back_extension, upright_row, dumbbell_shrug). Plan 3.1:253 sizes HROW 4, HINGE 4, SHRUG 3 (SHRUG's third member is LB6's smith_machine_shrug, :706). "Needs: HT-11; landmine, romanChair" are the size gate (5.1) and the two new composers (2.1 :140-141).
- Reused, pinned by LIB-8M (ruling 3; CARD FIELDS VERIFIED @ `1d2a809`): barbell_row (P:HROW; topFault 'swing'), romanian_deadlift (P:HINGE; 'round'), single_leg_romanian_deadlift ('round'), upright_row ('chin'; approved @ `94c551f`). No row here: a second row throws (registry.mjs:35).
- The shrugs (dumbbell_shrug, cable_shrug, and barbell_shrug, held on pilot A per pilot-a/plates.json @ `48d49bb`): LIB-13s, not this card (ruling 6).
- Drawn here (8), with the facts that bear on mode:
  - pendlay_row (A; plan T; card parent barbell_row): bar on the floor at the start, dead stop each rep (c3), torso parallel (c2). Mistake: the rounded back at the start (c8, c23). Tempo 1/2/0 (c14); the floor stop has no seconds. H now (ruling 4).
  - t_bar_row (A; plan T; parent barbell_row): landmine rig with a V-handle 8-10 in from the plates (c1). Tempo 1/2/1 (c15, a named convention). Mistake: rounded back (c7).
  - landmine_row (A; plan T; parent barbell_row): landmine rig; its layout is "inferred from c1, c2" (unsourced). Tempo 1/2/0 (c12). Mistake: rounded lower back (c9, c11).
  - one_arm_dumbbell_row (C; plan H): support-class anchor (plan 2.2:159). drawable false: the top fault is momentum (speed only); plate.mistake is short range, "the arm never straightens at the bottom, or the shoulder blade is not pulled back at the top" (c10). F7 expected.
  - dumbbell_romanian_deadlift (A; plan T; parent romanian_deadlift): dumbbells in front of the thighs (c1). Mistake: the back arching to stand up (c10). Tempo 1/2/0 (c20). Its mode is the one the note's table decides (ruling 4).
  - conventional_deadlift (A; plan T; parent romanian_deadlift): bar on the floor, 22.5 cm up (c23, plate.equipment). Mistake: the lower back rounds as the bar leaves the floor (c8). Tempo 1/2/0 (c12); tempo.text names the bottom dead start with no seconds (R-LB3-7). H now (ruling 4).
  - sumo_deadlift (A; plan T; parent conventional_deadlift): wide stance, toes out, hands inside the knees, trunk more upright (c1-c4, c13). Mistake: hips shoot up first (c12). Tempo 1/2/0 (c21). H now (ruling 4).
  - back_extension (A; plan H): 45-degree Roman chair (romanChair; c1, c2); census poses hinge and support. Mistake: the back rounding over the pad (c6, c19). Tempo 1/2/1, claim [c8, c21]: c8 sources the 1 s hold at the top; c21 (WEAK) names up 1 and down 2 a drawing convention. Its variantLine is sourced (R-LB3-9).
- Composers (census gaps): landmine (t_bar_row and landmine_row, plan 2.1:140: "both users are in one batch and on one sheet"); romanChair (back_extension, single use, :141). Everything else is a vendor primitive (barbell, dumbbell, vHandle, bench, backPad, kneePad, box, floor; equipment.mjs) or eq/parts.mjs on main.
- Scratch fixtures on main already name 3 of the 8: ci/scratch.mjs:22-24 (lib_one_arm_dumbbell_row, lib_t_bar_row, lib_landmine_row) and library-ci.test.ts:160, :187-196. They write only into temp trees. Never run or add a fixture that writes an LB3 id into the real tree (ruling 10).

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On claude/sup-lib4-cards: this card; lib-10-card.md (LB2's card) and lib-9a-card.md (LB1's); lib-zoom-card.md; ht-11-card.md; lb3-research-verify.md (R-LB3-1..11, F-LB3-1..4); lib4-cards.md sections 12 items 1, 2, 4, 6-9; 13 (Q1-Q5, 13.1-13.8); 14.4, 14.7, 14.8; 15 and 15.1; 16 (D-LIB8M-TEMPO, -CARDTRUE, -PAGESET, -CARDS); 20 (D-LIBHANDS-COUNT); 21-24.
- On #265: D-LIB10-NOTE (6255216039), D-LIB10-BENCH-H (6256170884), D-LIB10-BBELBOW (6256266008).
- The plan @ `a5e87d9e`: 1 (:85-94, the drawable-fault rule and the small-motion zoom); 2.1-2.2 (:120-165); 3.1 (:232-269); 3.2-3.5; 5.1 (:489-507); 6.1-6.2; 7 row 13 (:771); 9.
- Pilot A @ `48d49bb` (or the head the supervisor names): tools/plates/library/DRAWING-GUIDE.md; specs barbell_row, romanian_deadlift, single_leg_romanian_deadlift; pilot-a/plates.json; pilot-a/tempo.json.
- LB2 @ `2dcbac1`: lb2/DESIGN.md (sections 1, 4, 7, 8, 13), lb2/build.mjs, lb2/qa.mjs, eq/declineBench.mjs, tests/howto/lb2-plates.test.ts (composer tests :73-174, A3 :403-438, A5 :440, A9 :478-545, A11 :555, A4 :678-706).
- Main: derive.mjs (PARAMS :4-12, paramProblems :15-30); candidate.mjs :70-73, :76-130; registry.mjs :30-56, :79; qa/index.mjs; qa/node.mjs; qa/envelope.json (traceLenMin 22.11, deviationMin 11.39); qa/param-ranges.json; eq/parts.mjs; vendor engine SPEC.md and equipment.mjs.
- Research on 2dd60ae0349b06a4aac88a11347edac5536f8424: cards/ and quotes/ for the 8, CARD-V2.md, RULINGS.md (LR-31, LR-33, LR-36), docs/research/howto/verify/lb3.md.
- Census @ `4a9fd86`: the 8 rows (closestApproved, poses, equipmentGaps, view).

design_reference: DRAWING-GUIDE.md; pilot A's approved plates (barbell_row and romanian_deadlift for the rows and hinges, single_leg_romanian_deadlift); LB1's and LB2's approved plates; the 8; the plan 3.4 rubric; the census views.
connectivity: none. Node and local Chromium (/opt/pw-browsers/chromium) only. Specs, templates and composers read no files and fetch nothing. Facts come only from the copied cards and quotes. No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/specs/<id>.mjs for each drawn id (row src 'library/specs/<id>.mjs');
  - tools/plates/library/eq/landmine.mjs and eq/romanChair.mjs, plus any composer the ruled note names, one new file each;
  - tools/plates/library/templates/<family>.mjs only if ruling 4's table makes that family T;
  - tools/plates/library/lb3/{rows.json,tempo.json,build.mjs,qa.mjs,DESIGN.md,cards.sha.json}. rows.json holds batch 'LB3', censusRef 4a9fd86, the drawn non-held ids only, view per row, the ruled mode (a T row also names its template, its parent and params, each param citing the claim on the row's own verified card, D-LIB10-RANGES item 3), and stage drawing or review only;
  - tools/plates/library/howto/lib_<id>.howto.mjs for the 8 (`research` and `id` only);
  - docs/research/howto/cards/<id>.json and quotes/<id>.json for the 8: byte copies, then the three keys on cards/;
  - tests/howto/lb3-plates.test.ts (node only).
- docs/COACHING-DECISIONS.md: append only (when LB2's entries land on main first, keep both sides).
- Plates pages and QA reports are not committed. build.mjs and qa.mjs write to a temp directory and print the sha256 and the table.

reserved_paths:
- tools/plates/library/batches/** and tests/howto/golden/**.
- src/** (every generated file included), tools/plates/gen/** and tools/plates/generate.mjs (HT-11's).
- In tools/plates/library/: {derive,candidate,registry,plates-page,build-page,layers-spec,inputs-closure,batch-golden,engine,bodies,ids-encoding,ids-node,chunk-set,fidelity}.mjs, MANIFEST.json, and the folders qa/, hands/, render/, pages/, pilot-a/, lb1/, lb2/, fidelity/, ci/, shared/, lint/, research/, scale/ and budgets/.
- Existing eq files and specs (main's, pilot A's, LB1's, LB2's).
- The shrugs' specs, How-to sources, cards and quotes (dumbbell_shrug, cable_shrug, barbell_shrug): LIB-13s's.
- tools/plates/vendor/** and tools/plates/layers/**.
- docs/research/howto/*.json, and the 5 pilot A LB3 ids' cards and quotes.
- tests/howto/library-lint.test.ts, tests/howto/library-ci.test.ts, scripts/**, tests/theme.test.ts, src/ui/styles.css, .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The paths of HT-11, VITEST-RPC, LIB-ZOOM, LIB-5 Do 9, LIB-6-PM, LIB-5v, LIB-7c, LIB-12-FIX and the LIB-8 merge card.

Do:
1. The design note, in lb3/DESIGN.md, posted on the draft PR with your first push as 'LB3 NOTE READY @ <sha>'. Wait for 'LB3 NOTE RULED' before Do 6 b. One row per drawn id, plus a line each for the 4 reused ids and the 3 shrugs (LIB-13s):
   - mode: T only if the child differs from its template parent only through derive.mjs PARAMS keys (:4-12) and the D-LIB10-FACTS schema. Otherwise H, listing what falls outside (plan 3.1:239-248). A template is built only if at least 3 of its members, parent included, pass that test (plan 3.1:240); otherwise its children are H (D-LIB10-BENCH-H; D-LIB10-TEMPLATES). Plan 6.2 expects P3 T7 H5; name every change. Ruling 4 already makes pendlay_row, conventional_deadlift and sumo_deadlift H. The note's table decides dumbbell_romanian_deadlift and the HROW and HINGE templates, weighing at least these, checked on main and #109:
     - PARAMS has no key for a floor start or a dead stop, for toe-out or hands inside the knees, or for a landmine rig ('landmine' is in neither load.primitive nor bar.kind);
     - facts never hold poses (D-LIB10-FACTS);
     - a rig with its own anchor (landmine) joins a family only after that anchor's plate is pinned (plan 3.1:243-245; 15 (i) 3), as D-LIB10-DECLINE ruled for decline.
   - for any family proposed T: the Q1 (c) feasibility table (each child's solved values against its card's facts, as numbers), the PARAMS keys and proposed range per key with each bound's source, the facts schema and fault builders, the byte-proof plan, and per T child the claim on its own card that states each param value (D-LIB10-RANGES item 3). Post the table before the first child's approval freezes the template (plan 3.1:251).
   - the clone source (pilot A spec and head), the census closest among the 8, and each anchor's approving sha.
   - composers: landmine (users t_bar_row and landmine_row; anchor landmine_row, ruling 5), romanChair (back_extension), and any other with its anchor and every later user. A new shared composer is approved on its anchor plate before any other user is approved. Pilot A's safetyArms and inclineBench are never edited or forked (D-LIB10-NOTE Q2 2).
   - pose-class and convention anchors each id uses (plan 2.2; plan 1): hinge (pilot A); support (one_arm_dumbbell_row, in LB3; back_extension is its other LB3 user, ruling 7); engine dumbbell primitive (dumbbell_biceps_curl, pilot A); the drawable-fault convention (one_arm_dumbbell_row).
   - the expected flags: F5 on every plate (14.4); F7 on one_arm_dumbbell_row with the reason (drawable false, plan 1:85-88); any other with its reason.
   - the R10 items each tier-A card requires (7 of the 8 are tier A).
   - the hand zoom and the pair key that would draw it, naming an existing key from LIB-7 (#193) or LIB-7c (#271) where one fits. Build none, and list the cards with no key yet. Draw each card's recorded wrist convention (R-LB3-5). If F-LB3-3 rules otherwise, the affected hands are redrawn, re-QA'd and re-critiqued for that id. Flag where a later key would map a pinned id (barbell_row, romanian_deadlift, single_leg_romanian_deadlift, upright_row): under D-LIB7FIX-PERKEY's exception that key adds to the row's MANIFEST set.
   - the census view.
   - the tempo map, for the supervisor to rule (Q3; 14.7; D-LIB8M-TEMPO), and a pose map wherever the drawn start differs from the card's plate.start (Q2 (b)). The Mistake is drawn against the end pose (plate.mjs:78, :208; Q2 (f)), so a fault at the card's start pose needs a map: likely pendlay_row, conventional_deadlift and sumo_deadlift; confirm on the named head. A static phase other than the Hold after the concentric is a constant only with a quote that states its seconds (pendlay_row's floor stop and conventional_deadlift's dead start have none).
   - the fault→key map (13 Q1(a)): each card's plate.mistake → the key its first tell carries; for one_arm_dumbbell_row, also the ruled key for the card's top fault (momentum), which must differ from the drawn key.
   - the facts plan under D-LIB8M-FACTS and 22's scope. Equipment numbers become facts only with a measure callout: for example conventional_deadlift's 22.5 cm bar height (c23), back_extension's 45° chair and t_bar_row's 8-10 inch handle position (c1).
   - every number the card does not give, for the spec headers' "Unsourced numbers" (13.3 must-fix 14), landmine_row's inferred layout included.
   - how the work splits if a second drawer joins: rows (landmine composer, landmine_row, t_bar_row, pendlay_row, one_arm_dumbbell_row) against hinges (romanChair, conventional_deadlift, sumo_deadlift, dumbbell_romanian_deadlift, back_extension). Drawer A owns lb3/rows.json, DESIGN.md, cards.sha.json, build.mjs, qa.mjs and lb3-plates.test.ts; drawer B adds only its own specs and its composer, and hands its rows lines to A. Risks.
2. Slices, each before its family's bulk. Post each as 'LB3 SLICE READY @ <sha> (<family>)'; the family's bulk starts only on 'LB3 <family> BULK GO'.
   a. The H slice (at start; ruling 12): landmine_row with eq/landmine.mjs (the shared composer's anchor; its bar moves), one_arm_dumbbell_row (the support anchor; drawable-fault F7) and conventional_deadlift (the floor start and the pose map that pendlay_row and sumo_deadlift reuse). Post 390 px renders in Paper and Silent Black beside barbell_row and romanian_deadlift (pilot A, from a temporary worktree), the unit tests, the two-build plates-page sha256 and the Do 8 QA table. Authoring QA runs now; it counts as evidence only after Do 6's verdict. Before Do 6 b, every drawn id shows H6:no-card and F7 'no card top fault'. These are expected, and are not defects to fix.
   b. A T slice, only for a family ruling 4's table makes T, after pilot A's yes is on main and merged in: the template with its parent byte proof (Do 3) and its first child.
   - Each slice post shows A9 and every mutation red and then restored.
3. Templates, only if ruled (ruling 4), as `make(params, facts)` in tools/plates/library/templates/<family>.mjs:
   - copy the parent's code (D-LIB9-CLONE (a)-(c)); never import a pilot A spec;
   - unknown params or facts keys throw. facts hold only what D-LIB10-FACTS allows: never poses, equipment, camera, trace, measure, checks, datum or ghosts;
   - byte proof: make(parentParams, parentFacts), rebuilt alone, equals all 9 of the parent's pinned fragments. Never edit the parent to make it pass.
   - A T child's spec exports its `facts` and `export default make(<its row's params>, facts)`, and nothing else (D-LIB10-CHILDPROOF).
4. Composers, each `(lm, ctx) => item[]` returning PRIMITIVES types only, in LIB-10's declineBench pattern (eq/declineBench.mjs @ `2dcbac1`: existing primitives and eq/parts.mjs helpers; its assumed sizes go under "Unsourced numbers" in each spec that uses it):
   - landmine: the floor pivot, the bar from the pivot to the plates on the free end, as each card places them (t_bar_row c1; landmine_row c1, c2, c4). The bar moves with the hands, so it is a `poly` or an H9 line type in every pose (PQ-H9; plan 2.1:126-128; plate.mjs:213). t_bar_row's V-handle is the vendor vHandle;
   - romanChair: the hip pad at the top of the thighs, the foot plate and heel pad, the frame (back_extension c1-c3); static, so no `poly` twin is needed;
   - any other the ruled note names.
   No file reads. A per-pose drawn-item test on the real spec (13.1), as lb2-plates.test.ts:106-174.
5. The build and QA hook (copied from lb2/build.mjs and lb2/qa.mjs @ `2dcbac1`). Both read lb3/rows.json through registry rows() (registry.mjs:30), with `batches` set to every batches/ file plus ['tools/plates/library/lb3/rows.json', <its data>], and pass that set as groupsConfig's and candidateOf's `all`. Never write under batches/.
   - build.mjs: builds the LB3 plates page on main's tools.
   - qa.mjs: runQa per id through candidateOf(id, { all, authoring: true }).
6. Cards (the 8, once):
   a. At start, once 'LB3 research head' is posted: copy the 8 cards and quotes byte for byte from 2dd60ae0349b06a4aac88a11347edac5536f8424 and commit them, with lb3/cards.sha.json holding the research head sha and each copy's sha256 (in the canonical form the test states).
   b. After 'LB3 NOTE RULED' (the tempo map, pose map and fault→key map): add top-level plateFacts, tempo and topFault per D-LIB9-CARDFIELDS, 13 Q1, the ruled maps, 14.7's form rules and D-LIB8M-FACTS with 22's scope. Each value names the claim whose quote states it. No value comes from a spec. cards.sha.json keeps each card's sha256 without those three keys.
   - Post 'LB3 CARD FIELDS READY @ <sha>' and wait. The supervisor runs a fresh, blind Opus content verifier on a copy of the 8 cards, their quotes, lb3/tempo.json, the ruled fault→key map, the ruled pose map, the drawn plates' tells and a rules file holding every rule above (the pose map included; the 21.5 point 4 lesson), with one planted wrong number and Q1's two topFault checks.
   - Fix only what it names, re-run qa.mjs for the drawn ids that changed (H6 must pass), and post 'LB3 CARD FIELDS FIX @ <sha>'. A focused re-verify with a new plant runs on the changed cards. 'CARD FIELDS VERIFIED @ <sha>' follows (21.5-21.7; 22).
   - Each T row's params, and the claim each one cites, go to the same verifier: in this run if the row exists then; otherwise a params-only run with one planted wrong value on the head that adds the row, before its QA counts.
   - If the research head moves for an LB3 card: copy it again, re-apply its keys, update cards.sha.json. If a cited claim changed, the verifier re-runs for that card and its plate is QA'd again.
7. Draw by family, following DRAWING-GUIDE.md: callouts from the card's checkpoints, tells from its mistake, and the ruled tempo. Order, each on its BULK GO:
   a. floor-start hinges: pendlay_row and sumo_deadlift (conventional_deadlift's pose map); dumbbell_romanian_deadlift (romanian_deadlift's code, copied, unless ruled T);
   b. t_bar_row, approved only after landmine_row (the landmine anchor);
   c. back_extension with romanChair, approved only after one_arm_dumbbell_row (the support anchor);
   d. a ruled T family, after its slice look.
   LB1's and LB2's lessons, each with a drawn-item test where it applies (A15):
   - The Mistake reads as a pose outside the solid end figure: red parts clear it by at least 6 px, or are drawn as red dashed lines over it. Test the clearance with the engine's bodyShapes at the plate's px/m (13.1; 13.4 must-fix 1; 13.7).
   - 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key (Q-D5-4). A one-tell plate needs a recorded reason, ruled per id (D-LIB10-SKULL1). Tell words say what is drawn (13.4 must-fix 4).
   - Callout boxes sit in open space and leaders meet their anchor from the open side. No leader runs within about 6 px of the Trace, a bar, a cable or the landmine bar (13.1).
   - A hidden start part is redrawn as a dashed phantom (Q2 (c)).
   - Ghosts follow the real joint path, through `via` keys where needed. A straight limb never bends between poses (13.3 must-fix 1 and 3).
   - Tests assert on drawn items, never on the spec's own formula (13.1; 13.4 must-fix 3).
   - A cue table per id: the card's `what` and claim, the plate cue, the word count (Q-D5-6).
   - If one card's facts cannot all hold on the body at once, stop and post the per-card conflict (D-LIB10-BENCH-H; D-LIB10-BBELBOW). Never tune a value off the card.
8. QA (after the verifier's verdict on the cards it covers; T rows also need their ruled family rows on main):
   - build.mjs builds the LB3 plates page twice, to a temp directory; the bytes must match;
   - qa.mjs runs runQa's node and browser halves (Chromium at /opt/pw-browsers/chromium) per id and prints the table: hard checks, raised flags (F5's element and value shown) and metrics.
   - A measured flag that differs from the ruled expected set is posted with its value and range, and ruled before READY (ruling 13). No flag is dropped or exempted.
9. Post the ready line with the per-id table. Then the supervisor runs the calibrated critic (plan 3.4; the pilot-a-critic.js pattern):
   - Anchors per ruling 8: golden B's pull_up and lat_pulldown, on their golden-B facts, until pilot A is pinned (D-LIB10-PANEL1); a hidden anchor is never the visible reference. 13.7's facts diff runs before the round.
   - Two plants rebuilt on LB3 plates at the head (an R4 leader on the wrong landmark, an R5 Mistake drawn the wrong way); each passes report ok, and only the planted state differs.
   - The panel may run on the drawn plates without waiting for those still blocked (D-LIB10-PANEL1).
   - The brief carries 13.6's rule: any pose fix a critic proposes keeps the drawn segment lengths and states them.
   - Fix only what the critic names. A fix never edits a card. If a fix would break a hard check, a pinned test or a ruling, post the conflict with its evidence, and the supervisor rules.
   - One fix round, then one fresh calibrated recheck on the changed plates. A plate that fails its recheck is held (D-LIB8M-CARDTRUE; 21.3 point 2, 21.6) and reported.
   - Pilot A's "nothing drawn under a label" report check is advisory for LB plates until ruled after #109 merges (24).

Acceptance (each mutation must turn red, then be restored; list each one in the PR with its red line):
- A1 The note and each family's slice are posted before that family's bulk, with a cited mode reason per id, and each bulk starts on its GO. landmine_row is approved before t_bar_row, and one_arm_dumbbell_row before back_extension. Evidence: PR comment links and approval comments.
- A2 Composers use PRIMITIVES types only, and their moving parts are poly or one of the envelope's H9lineTypes. In every drawn pose (start, via, end, Mistake) the landmine bar's pivot end sits at one fixed floor point (±1 px). Its free end is within 1 cm of the grip on landmine_row (c4), and on t_bar_row the vHandle hooks under the bar 8-10 in from the plates (c1). romanChair's hip pad sits under the top of the thighs in every pose (c1, c2). Mutations:
  - {type: 'wedge'} turns H9.type red;
  - the landmine's moving bar swapped for a rackUpright gives exactly ['H9.moving-line:eq<i>.rackUpright.<j>'], after premise assertions that the swap replaced one item and that it moves (Q4 (a)-(b));
  - the pivot moved 2 cm in the Mistake is red; the bar end moved off the grip is red; the pad moved 5 cm is red.
- A3 Closures are pure and drawn by the vendor engine. For each id, closureOf(spec) passes, contains tools/plates/vendor/MANIFEST.json, has no path under tools/plates/layers/, no specs/ file but its own and no template but its own. Mutations:
  - readFileSync added to a composer makes closureOf throw;
  - a spec importing tools/plates/layers/engine/body.mjs → red;
  - a spec importing a pilot A spec → red.
- A4 For every id in lb3/rows.json, every PQ-H1..H10 check passes in runQa node and browser, and the raised flags equal the ruled expected set exactly. Mutations on one LB3 plate, each red:
  - LIB-3's M1-M7 as named in qa/mutations.mjs;
  - a colour literal (H2.colour);
  - its F5 tell chrome changed so F5 reads 3.40 (14.4 point 2);
  - one_arm_dumbbell_row's topFault set equal to its drawn key → the F7 expectation fails.
  Browser-half evidence is qa.mjs output at the head. The F5 3.40 mutation runs qa.mjs in a temporary worktree with the tell chrome changed, never committed. Its table line goes in the mutation list. Flag-set equality is checked on qa.mjs's table.
- A5 lb3/rows.json holds exactly the drawn ids that are not held, each once, counted in the raw text. Each held id is in DESIGN.md's held table with its ruling and in no rows file. Once pilot A is on main, its 4 LB3 rows sit in pilot A's batch file. No shrug is in lb3/rows.json. Mutations: drop a row; duplicate a row; a reused id added; a held id added.
- A6 PQ-H6: facts within ±2° or ±1 cm, tempo equal to the card's, F7 only where the note names it, and one form per fact. Mutations:
  - a fact +3° turns H6 red;
  - the card path removed gives H6:no-card;
  - a fact with both `joint` and `measure: true` → red.
- A7 and A8 apply only if a template is built: LIB-10's A7 (byte proof; unknown keys throw; a template constant byte, a facts key outside the schema and one parent fragment changed in memory, each red) and A8 (PQ-H10 with the child proof; make-then-edit tempo → H10.child; a param outside the family range → H10.value; a raw-spec key → H10.raw; a value ruled for another family, or, if none exists, a value ruled for no key of this family → red).
- A9 Nothing ships (ruling 2). lb3-plates.test asserts:
  - every lb3 row's stage is drawing or review;
  - none of the 8 drawn here, and none of the 3 shrugs, is in shippedIds(), in any batches/ file, or in tests/howto/golden/library/, matched as whole tokens (`\b(lib_)?<id>\b`, and `(^|[^a-z0-9-])<slug>([^a-z0-9-]|$)` for the hyphen form). No file name there matches /lb3/i, and no text names `"batch": "LB3"`. Before pilot A is on main, the 4 reused ids are in neither either;
  - once pilot A is on main: each of the 4 reused ids has exactly one registry row, whose `batchFile` is pilot A's batch file, and no lb3/ file names it;
  - no LB3 spec, composer, How-to or test imports anything under hands/;
  - generate --check is green and unchanged. The PR body reports the seconds its child process took.
  Mutations, shown in the slice post: one row set to shipped; one set to approved-plate; rows.json copied into batches/; a file naming an LB3 id in tests/howto/golden/library/; a page-only lb3.json `{"entries":[{"kind":"page","batch":"LB3"}]}`; back-extension.layers.html with `data-id="back-extension"`; a batches/ file naming lib_upright_row before pilot A is on main. Controls run against the drawn-id scan only: a file naming only lib_romanian_deadlift and lib_single_leg_romanian_deadlift (pilot A) stays green against the 8 drawn ids. The test also asserts, over exercises.json, that no real id other than lib_<id> contains any of the 8 drawn ids (checked on main: none does; only romanian_deadlift, a reused id, sits inside lib_dumbbell_romanian_deadlift and lib_single_leg_romanian_deadlift).
  Recorded check (not a unit test): before each milestone post, run `git diff --exit-code origin/main...HEAD -- tools/plates/library/batches tests/howto/golden tools/plates/library/hands tests/howto/library-lint.test.ts src tools/plates/gen` on the merged head and paste its empty output. Seed it once in a temporary worktree: one committed byte (a throwaway commit; the three-dot diff never sees uncommitted bytes) changed in tests/howto/library-lint.test.ts must give exit 1.
- A10 The plates page is deterministic (PQ-H7): two equal sha256 values.
- A11 A card differs from its research-head copy only in the three keys (cards.sha.json). The test holds its own copy of the ruled tempo table and builds each card's tempo only from it and plate.tempo. Each fact's pose equals the ruled pose map's image of the pose its quote states. Mutations, each red:
  - any other card key edited;
  - (i) a Rest phase added to one card and its spec;
  - (ii) a constant added to tempo.json;
  - (iii) a Hold s that differs from the card's pause, set in card and spec;
  - (iv) a Hold of 0 s added to a pause-0 card;
  - (v) the Hold removed from each card whose ruled map has one (t_bar_row and back_extension), in card, spec and tempo.json;
  - (vi) up and down swapped for one id, with card and spec rebuilt to match;
  - a start fact named with the unmapped pose.
- A12 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head, with VITEST-RPC on main and merged in.
- A13 The content verifier is VALID (its plant caught) on the 8 cards' fields at the head's cards.sha.json, with Q1's two topFault checks, before any Do 8 evidence. Evidence: 'CARD FIELDS VERIFIED @ <sha>'. For each T row, the verifier has also checked each param against the claim rows.json cites.
- A14 The critic run is VALID under 13.5's rule, and the supervisor's approvals are recorded per exercise. Each held plate has its reason and ruling on the PR.
- A15 Do 7's lessons, Do 1's R10 items and the Q-D5-6 cue table are tested on drawn items. Mutations, each red: a red Mistake part moved inside the figure's 6 px clearance; a leader within 6 px of the landmine bar; one tier-A R10 item removed; a cue over 15 words.

verification: the per-id QA table, both plates-page sha256 values, the A9 recorded diff check and any template's byte proof at the exact head sha. The verifier's and the critic's comments name that sha.

risk_and_recovery:
- The named research head differs from `c6d2930b` for an LB3 card: the note follows the head. A pick changed after drawing re-plans that Mistake, re-proposes its fault→key entry, and re-runs the verifier and QA for that card.
- Pilot A's merge is late, or the owner changes a pilot A plate: T work waits; the H plates, composers and cards go ahead; LB3 reuses whatever LIB-8M pins.
- The comparator refuses a child over an inherited field that differs from its parent: stop and report. Never edit the parent card here, and never loosen the comparator.
- A planned T child needs anything outside PARAMS or the facts schema: it becomes H (about +2.5 Opus-hours [est]). If that leaves a family below 3 members, the template is not built (D-LIB10-BENCH-H).
- A template cannot rebuild its parent byte for byte [unverified until tried]: fix the template, never the parent. After two failed approaches, report; the supervisor rules.
- The landmine bar reads wrongly side-on, or does not stay attached to the pivot and hands in every pose [unverified until drawn]: A2's geometry tests catch it; R2 judges it on the anchor first.
- dumbbell_romanian_deadlift and sumo_deadlift carry a card variantLine although their exercises.json equipment has no '/' (at `c6d2930b`). D-LIB5-VARIANT 1 makes a shown line on such a row red; how the card's line reaches the shown field is LIB-5v's [unverified]. LIB-13 never edits it; report it if the lint names it.
- one_arm_dumbbell_row's F7 needs the owner's named yes: shown on the LB3 sheet with its drawable-fault note; never removed by a key choice.
- The support anchor is rejected on the sheet: back_extension is redrawn and shown again (ruling 7).
- A plate cannot pass a hard check card-true: it is HELD and reported (D-LIB8M-CARDTRUE). Any design option goes to the owner through the supervisor (LIB-ZOOM precedent). Any zoom view shows no angle number (owner, lib-zoom-card.md:12, :34); plate labels keep their sourced angles.
- HT-11 lands mid-card: merge main in, rebuild the plates page twice and re-run QA. Approvals are head-only, so a moved plate re-runs the critic for that id only.
- VITEST-RPC is late: A12 and READY wait; an RPC red is ruled by the supervisor, never re-run.
- LB2 lands with its own COACHING-DECISIONS entries: resolve the append conflict by keeping both sides.
- The gate names lib_barbell_row (a reused id) on 2 lines (scripts/screenshot-gate.mjs:8573, :8930 on main) and none of the 8 drawn ids. Whether a How-to button moves those pixels is for the ship card [unverified].
- A scratch fixture that writes an LB3 id into the real tree: stop and report (ruling 10).
- Two failed tries of one approach with no new evidence: stop and report on the PR.

return:
- the PR number and head sha;
- links to the note, each slice, the card-fields line and the ready line;
- the per-id table (mode, clone source or template, composer, hard checks, flags, held or not);
- the plates-page sha256 and any template's byte proof;
- the mutation list and the A9 recorded diff check;
- the output of check, test:tz and the gate.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-13 resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

---

Rulings recorded (D-LIB13-*, supervisor 2026-10-19 ~10:15 UTC, amended after the card critic):
1. Base: the latest origin/main when the session starts (565ea5a4 or later), never an unmerged head.
2. D-LIB13-AHEAD: as D-LIB10-AHEAD (15 item 3) with LB3 names. Rows sit at drawing or review in lb3/rows.json only; nothing goes under batches/, golden/, src/ or gen/; every D-LIB4-ENTRY condition holds before any LB3 id is approved-plate, pinned, in batches/ or shipped. Plan 6.1:636 gates sheets and T children, not H drawing.
3. D-LIB13-PA: reuse the 4 pinned pilot A plates unchanged, with no LB3 row and no new critic. barbell_shrug stays held (D-LIB8-shrug) and moves with the shrugs (LIB-13s).
4. D-LIB13-MODES: the note proves each id's mode with the feasibility table; a template is built only with at least 3 qualifying members. pendlay_row, conventional_deadlift and sumo_deadlift are H now: their floor-start poses fall outside PARAMS (derive.mjs:4-12) and facts (D-LIB10-FACTS). The note's table decides only dumbbell_romanian_deadlift and the HROW and HINGE templates.
5. D-LIB13-LANDMINE: landmine_row is the landmine anchor. Both landmine users are drawn H; landmine_row is approved before t_bar_row; both go on the LB3 sheet with the composer flagged as a new rig (plan 2.1:140).
6. D-LIB13-SHRUG: no shrug is drawn until LIB-ZOOM's convention is ruled and the supervisor extends it to the shrugs. The shrugs are LIB-13s, after LIB-13's READY. Do 6 writes the 8 cards' keys.
7. D-LIB13-SUPPORT: plan 3.1:266-269's same-sheet exception. one_arm_dumbbell_row is drawn first (H slice) and approved before back_extension; both are shown together on the LB3 sheet with the anchor flagged; back_extension is redrawn if the owner rejects the anchor.
8. D-LIB13-ANCHORS: D-LIB10-PANEL1 unchanged. Golden B's pull_up and lat_pulldown until pilot A is pinned, then D-LIB10-ANCHORS' pair (barbell_overhead_press and pull_up), with its pilot A one-item exception. Visible references: the PA2 reference plus pilot A's approved barbell_row and romanian_deadlift at their approving heads; neither is ever a hidden anchor in the same round.
9. back_extension's variantLine: sent to #272 as R-LB3-9 (6264026949) and fixed there. LIB-13 starts from the named research head that carries it.
10. D-LIB13-SCRATCHIDS: new scratch fixtures never target an LB3 id. The push that first moves LB3 rows into batches/ (the ship card) swaps LIB-4c's LB3 targets (ci/scratch.mjs:22-24; library-ci.test.ts:160, :187-196) for non-LB3 ids with the same sources, as LIB-9 does for LB1.
11. Slot: the AGENTS merge rule is not waived. LIB-13 builds ahead and merges only after every lower-numbered checklist item has merged, LIB-11 included. The supervisor schedules LIB-11 so it does not block. Reordering the checklist is the owner's call and is not asked for now. (The draft's recommendation, that LIB-11 does not block, was rejected: ruling 11.)
12. H slice: three plates (landmine_row, one_arm_dumbbell_row, conventional_deadlift).
13. Expected flags: A4 uses equality against the ruled set; any measured difference is posted with its value and range and ruled before READY.
- F-LB3-1 route (supervisor, with the critic's H1): R-LB3-11 on #272 changes the three parents' breath line; LIB-8M re-copies those three lines into #109 under the supervisor's diff check before #109 merges; LIB-13 never edits a pilot A card.

Supervisor follow-ups (not the builder's):
- 'LIB-13 start' names LIB-13's place in the freed-slot queue and the park order when LIB-10 resumes after pilot A merges (D-LIB-LANE-ACTIVE).
- Record ruling 7 as a plan amendment on claude/howto-options (2.2's support row; 3.1:266-269's exception), as a docs action like D-LIB8M-SLRDL's, so the plan and the card agree.
- Merge LIB-13's card-field commit back into claude/libht-research only after #272 is merged there.
- F-LB3-4: barbell_shrug's 7 copy-lint hits are fixed in the research pass before LIB-13s.

Carried from LIB-10's critic (lib-10-critic.md), so the same holes do not reopen:
- B1: A9 lets pilot A's 4 reused LB3 ids sit in pilot A's batch and golden files once pilot A is on main; the /lb3/i rule is scoped to batches/ and golden/.
- B2: no spec is told to copy a template that does not exist; H specs copy pilot A code from a named #109 head.
- H1, H2, M1: Do 6 b waits for the named, verified research head and the ruled tempo, pose and fault→key maps.
- H3, L1: LIB-13 writes no pilot A card; their keys came from LIB-8M's blind pass.
- H4, H5: registry.mjs and qa/param-ranges.json stay untouched; family rows reach main only by 15 (i) 4b.
- M2: depends_on says what pilot A's yes gates.
- M5: a template is never built for fewer than 3 members.
- M6: both in-batch anchors (landmine, support) are approved before their other users.
- M8: detached processes.
- L3: A9 has the page-only and layers-html mutations.
- L4: no angle numbers in a zoom view.
- L5: R8 and R9 are owed before LB3 ships.
- L6: the gate risk line counts lines on main.
- L8: pilot A plates are rendered from a temporary worktree.
- L11: ruling 8 keeps D-LIB10-ANCHORS' pilot A one-item exception.

---

LIB-13s: the three LB3 shrugs (short section; its full card comes later)
- Ids: dumbbell_shrug (B; plan H; card parent barbell_shrug; view front, so the front-view anchor upright_row), cable_shrug (B; plan T under SHRUG; parent barbell_shrug; view side), barbell_shrug (A; P:SHRUG; held on pilot A, pilot-a/plates.json @ `48d49bb`).
- Branch and PR: claude/lib-13-lb3, the same PR, after LIB-13's READY.
- Start: only after LIB-ZOOM's convention is ruled and the supervisor extends it to the shrugs (ruling 6). LIB-ZOOM starts only after LB1 merges (lib-zoom-card.md:6).
- Why: no shrug card gives an elevation number, and pilot A's 5 cm shrug is 7 px at 146.29 px/m (barbell_shrug.mjs header @ #109) against H3's 22.11 px trace minimum (qa/envelope.json). D-LIB8-shrug holds all three until a sourced elevation exists or a zoom convention is ruled. No shrug is exaggerated to pass, and no zoom view shows an angle number.
- Scope: draw and QA the three together; Do 6 for their 3 cards (pose names from their own specs; topFault through the ruled map, then carried by each first tell); their critic run. The extension that assigns barbell_shrug names the files it opens (its spec, its held line in pilot-a/plates.json, its card); until then they stay reserved. F-LB3-4 (barbell_shrug's copy-lint hits) is fixed in research first.
- Ship: dumbbell_shrug and cable_shrug cannot ship before barbell_shrug (card parent; D-LIB10-PARENTS). If LIB-13s is late, LB3 ships without the shrugs (plan 3.5:341).
- forecast [est]: about 13 Opus-hours (3 × 4 h plus QA), after the convention exists.

---

Findings applied (lib-13-critic.md: 3 high, 9 medium, 11 low). Line numbers are in this file.

| Finding | Status | Where (line) and note |
|---|---|---|
| H1 | applied, with the supervisor's route | :86 (not this card's work; R-LB3-11 on #272; LIB-8M re-copies under a diff check before #109 merges); :39 (merge_prerequisite, comparator green for pendlay_row, t_bar_row, landmine_row); :288 (risk line); :329 (route recorded). The critic's "focused CARD FIELDS re-verify" clause is replaced by the supervisor's diff-check route. |
| H2 | applied | :263-264 (registry-row and hands-import bullets replace the origin/main equalities); :267 (recorded `git diff --exit-code` check, seeded once). |
| H3 | applied | :205 (Do 6 a at start, byte copies and cards.sha.json); :207 (Do 6 b after the ruled maps); :25 (Do 6 a in the start step); :188 (H6:no-card and F7 expected before Do 6 b). |
| M1 | applied | :34 (merge_prerequisite: AGENTS merge rule, LIB-11 included); :326 (ruling 11, the draft's recommendation marked rejected). |
| M2 | applied | :20 (engine-dumbbell anchor and the drawable-fault convention in depends_on); :177 (Do 1 anchor bullet). dumbbell_shrug's part moves to LIB-13s. |
| M3 | applied (first option) | :319 (ruling 4: pendlay_row, conventional_deadlift, sumo_deadlift are H now; the table decides dumbbell_romanian_deadlift, HROW and HINGE); :170 (Do 1 mode bullet). |
| M4 | applied (preferred fix: the split) | :321 (ruling 6: Do 6 writes the 8 cards' keys); :361 (the shrugs' keys in LIB-13s). |
| M5 | applied, adapted to the split | :111 (finish: the shrugs never block READY; held table until LIB-13s); :361 (the extension names the files it opens; reserved until then); :162 (shrug files reserved for LIB-13s). |
| M6 | applied | :207 (pose map in the verifier's inputs and rules file); :269 (A11 fact pose = map image); :277 (mutation). |
| M7 | applied | :240 (A2 geometry: pivot, grip, vHandle, hip pad); :243 (three mutations). |
| M8 | applied, with the supervisor's ruling | :30 (build_prerequisite: VITEST-RPC on main before A12 and READY; an RPC red is ruled by the supervisor, never re-run); :93 (CI manners); :265 (generate --check seconds in the PR body); :278 (A12). |
| M9 | applied | :253 (A4 browser-half evidence route). |
| L1 | applied | :67 (HANDOVER.md:1471 on main); :113 (:869-870, :872); :170 (plan 3.1:239-248); :127 (back_extension claim [c8, c21], c21 a WEAK convention); :10 (re-read main line numbers on the start head). |
| L2 | applied | :266 (controls on the drawn-id scan only; lib_upright_row mutation added; the smith_machine_shrug control dropped). |
| L3 | applied | :259 (A8 fallback). |
| L4 | applied, adapted to the split | :113 (LIB-13s's 13 h kept out of LIB-13's forecast); :363 (LIB-13s forecast). |
| L5 | applied | :281 (A15 with four mutations); :216 (Do 7 lessons point to A15). |
| L6 | applied | :169 ('LB3 NOTE READY', 'LB3 NOTE RULED'); :187 ('LB3 SLICE READY', 'LB3 <family> BULK GO'); :26-27 (gates). |
| L7 | applied | :180 (Do 1 hand bullet: each card's recorded wrist convention; F-LB3-3 redraw). |
| L8 | applied | :24 (the start message names the queue place and park order); :332 (supervisor follow-up). |
| L9 | applied | :84 (merge-back only after #272 is merged; #272 has since merged as 2dd60ae0 per lb3-research-verify.md @ 68a012e7); :334. |
| L10 | applied | :54 (length range bound 2 × LIMITS.cm). |
| L11 | applied (supervisor action) | :333 (record ruling 7 as a plan amendment on claude/howto-options). |
| Size | applied as ruled | :1, :97-99 (LIB-13 = 8 ids); :356-363 (LIB-13s section). |

Count: 23 of 23 applied (H1 with the supervisor's route in place of the critic's re-verify clause), 0 not applied.

Supervisor rulings on the final card (2026-10-19 ~10:05 UTC):
- Research head: 'LB3 research head 2dd60ae0349b06a4aac88a11347edac5536f8424' was posted on #272 (6264368447). It is the merge of #272 into claude/libht-research. Do 6 a copies from it.
- D-LIB13-VLINE: copy.variantLine is set only for a row whose exercises.json equipment names two kinds (the '/' rule, D-LIB5-VARIANT; lib-5v V3/V6). dumbbell_romanian_deadlift ('Dumbbells') and sumo_deadlift ('Barbell') have one kind, so their card plate.variantLine is a drawing note and is never shown; their content carries no copy.variantLine. back_extension ('Bodyweight / Machine') shows its line. Research follow-up F-LB3-5: move those two texts to notes in the next research pass.
- D-LIB8M-CF3: CARD FIELDS covers plate facts (D-LIB8M-FACTS), not risks. Pilot A's verdict carries over the F-LB3-1 re-copy when the supervisor's diff check on #109 shows only the three risks[breath] lines changed against 1d2a809.

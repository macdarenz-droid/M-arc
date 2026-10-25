Card LIB-16: LB6 plates, build-ahead, H slice only, 3 ids (2026-10-22; status `ready`; rulings D-LIB16-* recorded below). LB6's 1 D row, 2 P rows and 10 T rows are not in this card (section "LB6 ids"); they go in a later card. The ship phase (layers, pin, button) is a later card.

No owner item blocks the start. All 3 cards have tempo seconds, so D-LIB14-NOSECS holds none of them (D-LIB16-SECS).

id: LIB-16
model: claude-opus-5-5 (plates, two composers and the size, anchor and fact calls are judgement work, plan 3.1)
mode: auto
title: 'Builder: LIB-16 LB6 H plates'
branch: claude/lib-16-lb6 (new; no such branch on origin at 2026-10-22 ~13:30 UTC). Your first push opens draft PR 'LIB-16 (build-ahead): LB6 H plates, nothing ships'.
slot: plan 7 order 17 (LIB-17 in the plan, LB6; LIBRARY-HOWTO-ARCHITECTURE.md:814 @ `b41ac833`, depends_on LIB-11 and the plan's LIB-16). This card's id is LIB-16 (D-LIB16-SCOPE). It draws LB6's H rows ahead and never merges as this card. The ship card merges after the LB5 ship cards, which follow LIB-14 (#289) and items 1-14 of the owner's checklist (HANDOVER 8.0o D :920-934 @ `eb9f2eff`; pilot B #278 is item 12).

base: the latest origin/main when the session starts (`5158609c`, LIB-7 #193 on top of train 33, or later), never an unmerged head.
- Every main line number cited here was read at `5158609c`. Re-read each one on your start head, and use the line you find there.
- On main at `5158609c`: LIB-3c (qa/param-ranges.mjs and .json, the child proof), VITEST-RPC, LIB-5 Do 9's back box, LIB-6 and LIB-6-PM, LIB-7 (#193: hands/** with hand-d-handle.mjs), eq/rope.mjs and eq/parts.mjs, and the vendor PRIMITIVES with `poly` (tools/plates/vendor/engine/equipment.mjs:316; `chestPress` :248, `poly` :305).
- Not on main: pilot A (#109), LIB-12 (#191), pilot B (#278), HT-11 (#273), LB1-LB5 (#245, #265, #274, #289, #290), LIB-ZOOM (#279), LIB-5v (#282) and LIB-7b (#284).
- Research head: 'LB6 research head a8e66f32e34e1746075ffa4da35ea18c80dd4776' on claude/libht-research (link it in the PR body). It holds the LB6 merge `3812989f` (#287: LR-29 VALID on all 13, R-LB6-1..10 applied and rechecked; lb6-research-verify.md, docs/research/howto/verify/lb6.md), then F-LB5-1 (#291, cross_body_hammer_curl only). The 3 cards and their quotes are byte-identical at `3812989f` and `a8e66f32` (sha256 checked 2026-10-22).
- Copy LB3's build.mjs, qa.mjs and test patterns with `git show a6f4bd07:<path>`: #274's head where all 7 drawn LB3 plates are approved (lib4-cards 31). It holds tools/plates/library/lb3/{build,qa}.mjs, eq/landmine.mjs and eq/romanChair.mjs (the composer pattern) and tests/howto/lb3-plates.test.ts. Never import anything under lb1/ to lb5/.
- Where the plan (claude/howto-options @ `b41ac833`) differs from lib4-cards sections 12-31 or the D-LIB16-* rulings, those win.
- Merge origin/main into this branch, with a merge commit, each time pilot A (#109), pilot B (#278), LIB-12 (#191), LB1 (#245), LIB-ZOOM (#279), LIB-7b (#284), LB4 (#289) or LB5 (#290) lands. The steps that need them wait (build_prerequisites).
- Never merge an unmerged head. Read them with `git show <sha>:<path>`. Never commit one, never merge one.
- Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on (plan 7 row 17, :814): LIB-11 (pilot B) and the plan's LIB-16 (LB5b). Both govern the merge only (D-LIB16-PILOTB). Plan 6.3:781-784: a batch's tie to the one before it is checklist order; its real prerequisites are plan 6.2's "Needs before it" (:715: "pilot B answered; `smith`, `pecDeck`, `latRaiseMachine`, `hipAbdAddMachine`, `pulloverMachine`, `crunchMachine`"). For the 3 H rows these are `pulloverMachine` and `crunchMachine`, which land in this PR, and pilot B's answer, which gates their sheet and merge (D-LIB16-PILOTB). The anchor rule (plan 3.1:293-299) gates each plate going on a sheet, not H drawing. Per id (census `4a9fd86`, identical at `b41ac833`; anchors from plan 2.1-2.2):
- cable_chest_press: census closest machine_chest_press (one of the 8, approved; census.json:928). Poses stand and split, so the split anchor reverse_lunge (pilot A; plan 2.2:155; byPoseTag.split, 9 ids, cable_chest_press first; D-LIB16-SPLIT). Single handle: an existing primitive with a new parameter, no anchor (plan 2.1:142).
- machine_pullover: census closest lat_pulldown (the 8; census.json:3668). `pulloverMachine`, single use, its own anchor (plan 2.1:141). Pose seat (no plan 2.2 class).
- machine_crunch: census closest hanging_leg_raise (the 8; closeness N, "new movement"; census.json:6505). `crunchMachine`, single use, its own anchor (plan 2.1:141). Pose seat. Not a SUPCORE child (D-LIB16-CRUNCH).
No row uses a pilot B plate, template, rig or pose class, or any pilot A plate but reverse_lunge (cable_chest_press's sheet only). reverse_lunge is held (D-LIB8M-NOSTRIP) and its pick changed (D-SUP-LB4-REVLUNGE; D-LIB14-STEPUP), so it is redrawn, owner-approved and pinned before cable_chest_press goes on a sheet.

build_prerequisites (the supervisor posts each on the PR or on claude/sup-lib4-cards, or sends it to your session while no PR exists. If one is missing when you reach its step, go on with any other permitted step; set WAITING only when none is left, per D-LIB-LANE-ACTIVE):
- To start: 'LIB-16 start', which names the live active-builder count and LIB-16's place in the freed-slot queue. The research head (base) and the rulings D-LIB16-AHEAD, -SCOPE, -PILOTB, -SECS, -CLONE, -COMPOSERS, -HANDLE, -SPLIT, -SIZE, -LOCK, -FACTS, -TEMPO, -VLINE, -CRUNCH, -SLICE, -ANCHORS and -SCRATCHIDS are recorded on this card.
- At start: Do 1, Do 4 (both composers), Do 5, Do 6 a, and the H slice (Do 2) with its drawn-item tests. Copy the 8's code from tools/plates/vendor/exercises/{machine_chest_press,lat_pulldown,hanging_leg_raise}.mjs on main. Import eq/parts.mjs from main.
- Do 6 b: the note's tempo map, pose map, fault→key map and size table ruled on the PR ('LB6 NOTE RULED'; 13 Q3; 13 Q1(a); D-LIB8M-TEMPO; D-LIB16-SIZE).
- Bulk (Do 7): 'LB6 BULK GO', after the supervisor's slice look.
- Do 8 evidence: 'CARD FIELDS VERIFIED @ <sha>' for the cards it covers (lib4-cards :1143: after the fields are written, before QA).
- Do 9 (the critic run) and every approval: the ready line, and D-LIB16-ANCHORS.
- A row held under D-LIB16-SIZE or D-LIB16-LOCK: LIB-ZOOM (#279) on main and merged in, then 'LIB-16 resume'.

merge_prerequisites: never merges as this card. The ship card merges these 3 only when all of these hold:
- Every lower-numbered item on the owner's checklist has merged (AGENTS merge rule): HANDOVER 8.0o D items 1-14 (pilot B #278 is 12), LIB-14 (#289) and the LB5 ship cards (plan 7 rows 15-16, :812-813).
- Pilot B is answered by the owner (LIB-11 Do 10) and pinned (plan 6.1:694; 6.2:715; D-LIB16-PILOTB).
- Every D-LIB4-ENTRY condition holds (plan 5.4:633-634; lib4-cards :1055-1070). The records show them met at `5158609c` (lib-14-card.md:45 lists them). The ship card re-checks all of them on its head.
- The shared-key clause (lib4-cards :664) does not arise: none of the 3 ships a hand close-up. cable_chest_press is a d-handle GAP on main (hands/hand-d-handle.mjs:23, "c3: the claim names no bend direction ..."; hands/DESIGN.md:92). machine_pullover and machine_crunch have the `balance` archetype (hands/census-scope.json:62, :114), for which no key exists on main, #191 or #284. machine_pullover's card carries a hand zoom ('pullover-hands', zooms[1]); the ship card reports it as a gap or a later key card draws it.
- The back box is on main (trains 32 and 33). machine_crunch lists 'back' and is in its appliesTo (box-cap.test.ts:132; shared/back-pain-box.json, 35 ids, owner-approved). cable_chest_press lists 'back' (redFlags shoulder, back) but is not in appliesTo at main or at the research head. An appliesTo change followed the owner's decision 6 before (lib4-cards :1216), so the ship card routes it and does not ship cable_chest_press's back link until it is settled. machine_pullover lists none.
- No variant line (D-LIB16-VLINE), so LIB-5v is not a prerequisite here.
- reverse_lunge is redrawn, owner-approved and pinned before cable_chest_press goes on a sheet (D-LIB16-SPLIT). Otherwise it rolls (plan 3.5:376).
- `pulloverMachine` and `crunchMachine` are approved on the LB6 sheet as new rigs, each with its anchor plate (plan 2.1:129-130).
- A row held under D-LIB8-shrug ships only after LIB-ZOOM (#279) is on main and its zoom plate passes QA and the critic here (D-LIB16-SIZE). Otherwise it rolls.
- The LIB-4b scratch target is moved off cable_chest_press by the push that first moves it into batches/ (D-LIB16-SCRATCHIDS).
- A calibrated critic has scored R8 and R9 at 4 or more for every LB6 plate that ships (13.1). R8 is null for an id with no close-up.

Rulings this card relies on. These are summaries; where the posted text differs, the posted text wins.
- D-LIB9-ENGINE: specs import only tools/plates/library/engine.mjs (the vendor engine). poly and flat palm are allowed. Nothing imports tools/plates/layers/.
- D-LIB9-AUTHORQA: candidateOf(id, { all, authoring: true }) (candidate.mjs:84). Its default path stays unchanged.
- D-LIB9-CARDFIELDS (lib4-cards :1135-1147), with 13 Q1 (topFault) and Q3 (tempo map):
  - drawable:true (all 3 here): topFault is plate.mistake's key, and the spec's first tell carries it;
  - tempo: D-LIB8M-TEMPO (lib4-cards :3293-3303). The concentric takes up, the eccentric takes down, Hold takes pause right after the concentric only if pause > 0. Any other static phase is a constant only with a quote that states its seconds; a constant is allowed, never required. A range is the quote's string. No Rest.
- D-LIB8M-FACTS, with 22's exact scope (D-LIB10-CF1), and D-LIB13-FACTS2 / D-LIB11-FACTS2 (contact facts; PANELS.md section 3 and the section 7 rules, `{kind:'contact', landmark, pose, cardPose, claim}`), with D-LIB16-FACTS. An equipment number becomes a fact only when the plate shows it with a measure callout. A quoted range is its midpoint with a note only when it is at least 4 wide (PANELS.md 7).
- D-LIB5-TEMPO8 rules 10-15 (14.7); D-LIB9-FACTPOSE: a setup instruction states the start pose only; a contact is never carried to another pose by inference.
- D-LIB9-F5 (14.4): `exemptions: ['F5']` only for the selected Mistake tell in Midnight at exactly 3.57.
- D-LIB9-CLONE (13.2): copy, never import a vendor spec; every copied root finder throws on a bracket with no root; re-derive each bracket and record what it solves to.
- D-LIB8M-CARDTRUE and D-LIB8M-PAGESET: the plate follows the card. A plate with no card-true drawing that passes every hard check, or that fails its last critic run, is HELD: stage review, off the page and the rows file, on the follow-up list, reported. A held id gets no row.
- D-LIB8-shrug and Q-D5-3 (lib4-cards :1596-1690): a right pose or a fault is never moved or exaggerated off its card to pass a check. A fault too small for PQ-H3 card-true is held, with LIB-ZOOM's zoom circle as its route (#290 6340075388 and 6340849204, F-LIB15-1).
- D-LIB10-NOTE Q2 point 2 (#265 6255216039): pilot A's composers are never edited or forked (lib-13-card.md:176). D-LIB16-COMPOSERS applies the same to every composer on another open PR.
- D-LIB10-BENCH-H and D-LIB10-BBELBOW: if one card's facts cannot all hold on the body at once, stop and post the per-card conflict; never tune a value off the card.
- D-LIB10-SKULL1 and Q-D5-4: 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key. A one-tell plate needs a per-id ruling. (The card's own plate.tells are right-pose tells, CARD-V2:37; each of the 3 has 2.)
- D-LIB13-VLINE (lib-13-card.md:400): a variant line is shown only for an id whose exercises.json equipment names two kinds.
- D-CRITIC-CAL3 (13.5), with 13.7's facts diff and 13.6's segment-length rule; D-LIB10-PANEL1 (24). The method is PANELS.md (claude/sup-handover-1445 @ `eb9f2eff`, unchanged since `a2375fb1`) sections 1, 3, 5 and 7.
- D-PILOTA-R5 and D-LIB8M-CARRY: an approval counts only for the head it ran on.
- D-LIB-LANE-ACTIVE (lib4-cards :1023-1041): at most 4 active LIB builders. You hold a LIB drawing slot from your start. WAITING only when no permitted step is left; then you hold no slot.
- D-LIB9a-HOWTOID: a How-to source here holds only `research` and `id`.
- LR-31, LR-33, LR-36 (RULINGS.md:38, :40, :43 @ `a8e66f32`), D-SUP-PROTECT, D-SUP-LB6-CCP and R-LB6-1..10: research applied them, and the LR-29 verify passed. This card never edits a card's research fields.
- D-LIBHANDS-COUNT (20): binds only a card that adds hand modules. LIB-16 adds none.
- D-LIB14-NOSECS (lib-14-card.md:288-294): applies to no row here at `a8e66f32` (D-LIB16-SECS).
- D-LIB16-*: recorded below ("Rulings recorded").

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Every plate meets the bar of the 8, pilot A and LB1-LB3: every plan 3.4 item at 4 or more (R8 and R9 stay unscored here, as in 13.1).
- No check, envelope, threshold, rubric item or test is relaxed, skipped or exempted to save time. A plate below the bar is redrawn, and you report the time it cost.

shared-file owners:
- None of the AGENTS shared add-only files is touched. scripts/screenshot-gate.mjs, tests/theme.test.ts and src/ui/styles.css on main name none of the 3 ids (checked at `5158609c`).
- tools/plates/vendor/** and tools/plates/layers/**: read only.
- Main's eq/parts.mjs may be imported, never edited. eq/rope.mjs is not used. Pilot A's (#109), pilot B's (#278, eq/smith.mjs and eq/legCurlMachine.mjs included), LB1's (#245, eq/dHandle.mjs included), LB2's (#265), LB3's (#274), LB4's (#289), LB5's (#290), LIB-ZOOM's (#279), LIB-12's hands/** (#191) and LIB-7b's (#284) files: read only. Specs are copied from main's vendor only, never imported.
- tools/plates/library/hands/** on main (LIB-7's keys, claims.json, census-scope.json, DESIGN.md): read only. claims.json pins no claim of these 3 cards (checked at `5158609c`).
- tools/plates/library/fidelity/** and tools/plates/library/ci/** (LIB-4b's and LIB-4c's scratch fixtures): read only, never run in this tree (D-LIB16-SCRATCHIDS).
- candidate.mjs, registry.mjs, derive.mjs, plates-page.mjs and qa/** (qa/param-ranges.json included): untouched.
- docs/research/howto/cards/** and quotes/** belong to claude/libht-research. Here they are byte copies of the 3 LB6 H cards from the research head, plus their three keys. None of the 3 exists on main at `5158609c`. #287 is merged into claude/libht-research (`3812989f`), so the supervisor merges the field commit back after 'CARD FIELDS VERIFIED'.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. Your first push carries the design note and opens the draft PR. Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full qa.mjs run) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`, and poll its log. A stopped run is never evidence. Keep a send_later check-in every 20 minutes while one runs (idle containers are reclaimed).
- A CI failure on `[vitest-worker]: Timeout calling "onTaskUpdate"` is a real defect (D-LIB8M-RPC (b)); VITEST-RPC is on main. Keep each test's child processes well under vitest's 60 s limit. Report such a red on the PR; never re-run to green.

hard card: the design note and the H slice come before any bulk drawing.

outcome: LB6's 3 H plates, the `pulloverMachine` and `crunchMachine` composers and the 3 cards' machine fields exist on this branch at stage drawing or review.
- Every plate in lb6/rows.json passes every LIB-3 hard check (runQa, node and browser halves), PQ-H10 included.
- The raised flags are exactly the ruled expected set.
- The cards' machine fields have the content verifier's VALID verdict.
- A plate that cannot pass card-true is held and listed, never exempted.
- Nothing ships: none of the 3 gets a button, pin or batches/ row; no layers page; no app change.
deliverable: the specs, the two composers, rows, tempo map, size table, LB6 plates-page build and QA scripts, design note and tests.
evidence: the per-id QA table at the head sha; the plates-page sha256 from two identical builds; the unit tests with their mutations; the recorded diff checks (A9); the content verifier's verdict; then the critic's verdict.
finish:
- 'LB6 PLATES READY @ <sha> (plates page <sha256>)' is posted for the drawn rows whose cards are verified, with each held row listed with its ruling and route;
- the critic run is VALID under PANELS.md section 1 with every plate on the page at the bar, or each failing plate has had its one fix round and recheck and is held;
- the supervisor's per-exercise approvals are recorded on the PR (head-only).
- If a row is held under D-LIB16-SIZE or -LOCK: after LIB-ZOOM (#279) is on main and merged in, and on 'LIB-16 resume', its zoom plate is drawn under LIB-ZOOM's convention, joins rows.json and the page, and gets its focused CARD FIELDS re-verify (if a key changed), QA and critic; then READY is posted again.
Then stop; the ship card takes over the branch. You will notice: nothing in the app.
forecast [est]: about 18 Opus-hours at plan 9's pace (:894-897): 3 H plates × 4 h; the two single-use composers 2 h each; QA and critic 0.75 h per id (about 2.25 h). LB1 needed 4 review and 4 critic rounds; LB3's first panel passed 4 of 7, its recheck 5 of 7, and two focused rounds took it to 7 of 7 (lib4-cards 29-31). So allow up to about twice that (about 36 h). A held row's zoom plate (about 4 h) waits for LIB-ZOOM on main; its cost moves, it does not shrink. The calendar depends on a free lane slot and, for sheets and the merge, on pilot A's and pilot B's pins, which this card cannot forecast.

LB6 ids (plan 6.2 :715 and :744-748 @ `b41ac833`; census docs/howto/library/inputs/census.json @ `4a9fd86`, identical at `b41ac833`; card facts below read at the research head `a8e66f32`; re-read them there):
- The row "LB6 | Smith, cable press and fly, lever machines, front-view seated machines | 16 | 4 | D1 P2 T10 H3" (:715). The ids (:744-748): smith_machine_bench_press* (T, pB), smith_machine_incline_press* (T), smith_machine_shoulder_press* (T), smith_machine_shrug (T), smith_machine_squat* (D), cable_chest_press, cable_fly (P:CFLY, pB), low_to_high_cable_fly (T), high_to_low_cable_fly (T), machine_pullover, machine_crunch, pec_fly (P:FSEAT, pA), machine_lateral_raise (T), rear_delt_fly (T), hip_abduction (T), hip_adduction (T). Tier A (*) is 4, none of them H.
- The 3 H rows are the ids with no D, P or T mark: cable_chest_press (:745), machine_pullover (:746), machine_crunch (:747). The LR-29 verify agrees with each pick (lb6-research-verify.md:23-25: "cable_chest_press: step 2, settled by D-SUP-LB6-CCP"; "pullover: step 2"; "crunch: step 3, with 'Straining neck' not counted") and with every tempo (LR-33 13/13, :43). Census: view, poses, equipmentGaps, closest, hand.
  - cable_chest_press (tier C; side; stand, split; no equipment gap (cable exists, singleHandle exists-param); closest machine_chest_press; hand push): one column behind, pulley at chest height, single handles (c1); staggered stance, feet planted (c2); start: spine neutral and braced (c6), handles at about nipple height (c4), elbows just below 90 degrees, wrists over the elbows (c3); end: arms pressed straight ahead to almost-straight elbows, not locked (c3, c5), body still (c7). Mistake: the elbows locked straight at the front (c17, c5), drawable true; handlingMistakes[0] is the same fault. Tempo up 2, down 2, pause 0 (c15, c16: Motra 2-1-2, its 1 s bottom pause named in text only). variantLine null. Hand: d-handle GAP on main. redFlags shoulder, back.
  - machine_pullover (tier B; side; seat; gap pulloverMachine; closest lat_pulldown; hand balance): seat set so the shoulders sit just below the pivot (c1); belt on, back and head on the pad (c2, c7); start: backs of the upper arms on the elbow pads, open hands on the bar, movement arm near or slightly behind the head (c3, c6); end: arm pulled down to the midsection, held close to the seat belt (c4), back and head still on the pad (c7). Mistake: the back arched off the pad, the lower back and head pulling away from it as the arm comes down (c8), drawable true; handlingMistakes[0] the same. Tempo up 2, down 2, pause 1 (c14: ACSM WEAK; the 1 s is a WEAK drawing convention for Marquette's and Virtuagym's pause at the belt, which give no seconds, LR-33). variantLine: a drawing note (elbow-pad machine drawn), never shown. redFlags none. The anchor source mq-pullover (c1-c7) answers 403; its quotes are carried from g5, not re-fetched (R-LB6-8; F-LB6-3).
  - machine_crunch (tier B; side; seat; gap crunchMachine; closest hanging_leg_raise, closeness N; hand balance): start: seated upright, hips pressed against the back of the seat, shins against the roller (c2), hands on the handles (c3), abs tight (c2); end: spine curled so the ribs come toward the pelvis (c4), hips still back (c2). Mistake: the arms dragging the handles down while the trunk stays upright, instead of the abs curling the trunk (c14), drawable true; handlingMistakes[0] the same. Tempo up 2, down 2, pause 0 (c15: Motra 2-1-2, its 1 s bottom pause named in text only). variantLine: a drawing note (draw the shin-roller machine with handles by the shoulders, ACE's), never shown. redFlags back.
- Not in this card (13): smith_machine_squat (D: its parent spec and PARAMS are a later card's call); cable_fly and smith_machine_bench_press (pilot B plates) and pec_fly (pilot A), reused as their pilots pin them (D-LIB10-PA's pattern); the 9 other T rows, whose template parents (CFLY, FSEAT, BENCH, SEATPRESS, SHRUG) and rigs (`smith`, `pecDeck`, `latRaiseMachine`, `hipAbdAddMachine`) are pilot plates or need them pinned (D-LIB10-TEMPLATES, lib4-cards :3161-3164; plan 3.1:293-294). Neither pilot is on main.
- Tempo: every one of the 16 LB6 cards has up and down in seconds at `a8e66f32` (checked 2026-10-22). So every drawn row has a tempo strip (D-LIB16-SECS).
- Composers (census gaps): `pulloverMachine` (machine_pullover) and `crunchMachine` (machine_crunch), single use (plan 2.1:141). Each lands in this PR, as a composer lands in its anchor's PR (plan 2.1:129-130). Everything else is a vendor primitive (cableColumn, pulley, cable, stack, seat, backPad, chestPress, line, poly, floor; equipment.mjs:316 on main) or eq/parts.mjs on main (D-LIB16-COMPOSERS, -HANDLE).
- On main the 3 ids are named only by: src/howto/coverage.ts:23, :71, :123 and src/howto/lib-id.ts (stage "queued"; src/** is reserved); hands/** (above); tests/howto/box-cap.test.ts:132 (machine_crunch in the back box's appliesTo); and LIB-4b's scratch fixture, which targets lib_cable_chest_press (fidelity/fixture.mjs:29; ci/scratch.mjs:32 TAKEN; docs/howto/library/LIB-4-DESIGN.md:93, :149; D-LIB16-SCRATCHIDS). batches/ holds only README.md, and tests/howto/golden/library/ does not exist.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On claude/sup-lib4-cards: this card; lib-15-card.md and lib-14-card.md (the closest models); lib-13-card.md and lib-13-critic.md; lib-10-card.md; lib-zoom-card.md; lb6-research-card.md and lb6-research-verify.md; lib4-cards.md sections 12 items 2, 4, 6 (D-LIB-SCRATCHIDS :1098-1103), 9; 13 (Q1-Q5, 13.1-13.8); 14.4, 14.7, 14.8; 15 (items 3-5) and 15.1; 16 (D-LIB8M-TEMPO :3293-3303, -NOSTRIP, -CARDTRUE, -PAGESET, D-LIB8-shrug at :1596-1690); 20; 21-31.
- The four lessons from today's builders: #289 6341470610 (CARD FIELDS fix) and 6341498444 (slice look); #290 6340075388 and 6340849204 (held under D-LIB8-shrug, LIB-ZOOM route).
- On claude/sup-handover-1445 @ `eb9f2eff`: docs/supervisor/verify/PANELS.md; HANDOVER 8.0o C-E and 8.0p.
- The plan @ `b41ac833`: 1 (:80-96, drawable-fault and small-motion zoom); 2.1-2.2 (:120-165); 3.1 (:267-304); 3.2-3.5 (:306-408); 6.1 (:668-704, pilot B :694); 6.2 (:706-748); 6.3 (:768-784); 7 rows 15-17 (:812-814); 9 (:890-916).
- Main: derive.mjs (PARAMS :4-12); vendor/engine/plate.mjs:81-95 and renderPlate (:68); vendor/engine/body.mjs (the trunk bends at one lumbar pivot, :22, :112-116, with pelvis tilt; landmarks :164-168); vendor/engine/equipment.mjs (chestPress :248, poly :305, PRIMITIVES :316); vendor/exercises/machine_chest_press.mjs (end elbows 18° short of straight :45; "round and lock" Mistake :67-70; upper back off the pad check :152), lat_pulldown.mjs, hanging_leg_raise.mjs; candidate.mjs :73, :76-131; registry.mjs :30-56; qa/node.mjs (H3 :101-144, deviation :126-137; H6 :176); qa/envelope.json (traceLenMin 22.11, deviationMin 11.39); eq/parts.mjs; hands/hand-d-handle.mjs:16-29 and hands/DESIGN.md:85-106; fidelity/fixture.mjs:26-30 and ci/scratch.mjs:32, :40.
- LB3 @ #274 `a6f4bd07`: lb3/DESIGN.md, lb3/build.mjs, lb3/qa.mjs, eq/landmine.mjs and eq/romanChair.mjs (composer pattern), tests/howto/lb3-plates.test.ts.
- LB5 @ #290 `92a3a52f`: lb5/DESIGN.md :55, :101, :252, :308 (a single D-handle from primitives; an undrawable twist; the engine's missing forearm rotation).
- LB4 @ #289 `4adde423`: lb4/DESIGN.md §10-11 and its fixed heel-lift and arm tests (the 6341498444 items 1-2 pattern).
- Research @ `a8e66f32`: cards/ and quotes/ for the 3, CARD-V2.md (:36 drawable; :37 tells; :73), RULINGS.md (LR-31, LR-33, LR-36), verify/lb6.md.
- Census @ `4a9fd86`: the 3 rows (:928, :3668, :6505) and aggregates.byPoseTag (split, seat).

design_reference: DRAWING-GUIDE.md (pilot A @ `ff7c5c4f`, read with git show); the 8's machine_chest_press, lat_pulldown and hanging_leg_raise; LB1's eq/assistMachine.mjs and eq/chestRowMachine.mjs (#245 @ `9e5d9666`, lever machines with a `poly` lever) and LB3's eq/romanChair.mjs (#274 @ `a6f4bd07`) for the pattern of a composed machine, with their tests on drawn items, not helper maths (lib4-cards :1390); the plan 3.4 rubric; the census views.
connectivity: none. Node and local Chromium (/opt/pw-browsers/chromium) only. Specs and composers read no files and fetch nothing. Facts come only from the copied cards and quotes. No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/specs/<id>.mjs for each drawn id (row src 'library/specs/<id>.mjs');
  - tools/plates/library/eq/pulloverMachine.mjs and eq/crunchMachine.mjs, plus any composer the ruled note names, one new file each;
  - tools/plates/library/lb6/{rows.json,tempo.json,sizes.json,build.mjs,qa.mjs,DESIGN.md,cards.sha.json}. rows.json holds batch 'LB6', censusRef 4a9fd86, the drawn non-held ids only, view per row, mode 'H', and stage drawing or review only;
  - tools/plates/library/howto/lib_<id>.howto.mjs for the 3 (`research` and `id` only);
  - docs/research/howto/cards/<id>.json and quotes/<id>.json for the 3: byte copies, then the three keys on cards/;
  - tests/howto/lb6-plates.test.ts (node only).
- docs/COACHING-DECISIONS.md: append only (open PRs that also append: #92, #109, #191, #265, #271, #274, #282, #284, #289, #290; keep both sides).
- Plates pages, screenshots and QA reports are not committed. build.mjs and qa.mjs write to a temp directory and print the sha256 and the table.

reserved_paths:
- tools/plates/library/batches/** and tests/howto/golden/**.
- src/** (every generated file, src/howto/coverage.ts and src/howto/lib-id.ts included), tools/plates/gen/** and tools/plates/generate.mjs.
- In tools/plates/library/: {derive,candidate,registry,plates-page,build-page,build-layers-page,layers-spec,inputs-closure,batch-golden,engine,bodies,ids-encoding,ids-node,chunk-set,fidelity}.mjs, MANIFEST.json, coverage-archetypes.json, and the folders qa/, hands/, render/, pages/, pilot-a/, pilot-b/, lb1/ to lb5/, fidelity/, ci/, shared/, lint/, research/, scale/, templates/ and budgets/.
- Existing eq files and specs (main's and every open PR's), eq/parts.mjs and eq/rope.mjs included.
- The other 13 LB6 ids' specs, How-to sources, cards and quotes.
- tools/plates/vendor/**, tools/plates/layers/** and tools/plates/golden.mjs.
- docs/research/howto/*.json, docs/research/howto/shared/** (the back box included) and docs/howto/**.
- tests/howto/library-lint.test.ts, tests/howto/library-ci.test.ts, tests/howto/library-fidelity.test.ts, tests/howto/box-cap.test.ts, tests/howto/fixtures/**, tests/library/**, scripts/**, tests/theme.test.ts, src/ui/styles.css, .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The paths of HT-11, LIB-11, LIB-12, LIB-ZOOM, LIB-5v, LIB-7b, LIB-7c, LIB-13, LIB-14, LIB-15, GATE-FLAKE-5, the LIB-8 merge card and the no-seconds strip card.

Do:
1. The design note, in lb6/DESIGN.md, posted on the draft PR with your first push as 'LB6 NOTE READY @ <sha>'. Wait for 'LB6 NOTE RULED' before Do 6 b. One row per id, plus a line each for the 13 LB6 ids not drawn here, with their reason:
   - mode: H for all 3 (plan 6.2 :715, :745-747). List per id what falls outside PARAMS (derive.mjs:4-12), citing the lines.
   - the clone source per D-LIB16-CLONE and the census closest.
   - the composers per D-LIB16-COMPOSERS: `pulloverMachine` (seat, back pad, belt, foot bar, movement arm with elbow pads on a pivot near shoulder height; c1-c4) and `crunchMachine` (seat with back pad, shin roller, handles on a pivoting arm by the shoulders; c2, c3 and the card's drawn-machine note). Which parts move between the end pose and the Mistake, so carry `poly` (PQ-H9).
   - the single handle and the cable path for cable_chest_press (D-LIB16-HANDLE; Do 7's cable rule).
   - pose-class and convention anchors each id uses (depends_on), with D-LIB16-SPLIT.
   - the expected flags: F5 on every plate (14.4); no F7 (all 3 drawable true); no F1 at the reference scale; any other with its reason.
   - no tier-A card, so no R10 items.
   - the hand per id (merge_prerequisites lists them). Build none.
   - the census view: side for all 3.
   - the tempo map (D-LIB16-TEMPO), in the form of pilot A's rows (pilot-a/tempo.json @ `ff7c5c4f`; dumbbell_biceps_curl.mjs:145 'Curl 1, Lower 2'). No Rest. Never add seconds.
   - a pose map wherever the drawn start differs from the card's plate.start (13 Q2 (b)). The Mistake is drawn against the end pose (13 Q2 (f)).
   - the fault→key map (13 Q1(a)): each card's plate.mistake → the key its first tell carries. All 3 are drawable true, so topFault is that key.
   - the facts plan under D-LIB8M-FACTS, 22's scope, D-LIB13-FACTS2 and D-LIB16-FACTS, with every candidate it names and a "not facts" list with each reason.
   - the size table (D-LIB16-SIZE, lb6/sizes.json): every number the card does not give (pulley height, handle, seat, pads, roller, lever and pivot geometry, the stance length, each Mistake's magnitude, cable_chest_press's end elbow bend per D-LIB16-LOCK), each with its basis. These also go in the spec headers' "Unsourced numbers" (13.3 must-fix 14).
   - a PQ-H3 estimate per Mistake against deviationMin 11.39 px and per Trace against traceLenMin 22.11 px (qa/envelope.json), from the sizes in the table. cable_chest_press's lock is likely small (about 6-7 px [est], D-LIB16-LOCK), and machine_pullover's arch may be [unverified until drawn]. A too-small fault is reported with its card-true size and held (D-LIB16-SIZE); never enlarged.
   - Risks.
2. The H slice (D-LIB16-SLICE), posted as 'LB6 SLICE READY @ <sha>'. Bulk starts only on 'LB6 BULK GO'.
   - machine_crunch with eq/crunchMachine.mjs (new movement, a moving lever, the curl-not-hinge end); cable_chest_press (the split stance, the cable path, the elbow-lock size).
   - Post 390 px renders in Paper and Silent Black beside the closest approved plate: hanging_leg_raise and machine_chest_press (beside machine_crunch); machine_chest_press (beside cable_chest_press). Add the unit tests, the two-build plates-page sha256, the Do 8 QA table for the rows in rows.json, and each Mistake's measured H3 deviation and Trace length beside its size-table row.
   - Authoring QA runs now; it counts as evidence only after Do 6's verdict. Before Do 6 b, every drawn id shows H6:no-card and F7 'no card top fault' (qa/node.mjs:360). These are expected.
   - The slice post shows A9 and every mutation red and then restored.
3. No D row. If the note finds a reason a row might meet the D test (plan 3.1:268-272), post it with evidence; the mode changes only by a new ruling.
4. The two composers, each `(lm, ctx) => item[]` returning PRIMITIVES types only, in LB3's pattern (eq/romanChair.mjs @ `a6f4bd07`: existing primitives and eq/parts.mjs helpers). A part that moves between the end pose and the Mistake carries `poly` (PQ-H9, plan 2.1:126-128). No file reads. Per-pose drawn-item tests on the real spec (13.1), never on helper maths (lib4-cards :1390).
5. The build and QA hook (copied from lb3/build.mjs and lb3/qa.mjs @ `a6f4bd07`). Both read lb6/rows.json through registry rows() (registry.mjs:30), with `batches` set to every batches/ file plus ['tools/plates/library/lb6/rows.json', <its data>], and pass that set as groupsConfig's and candidateOf's `all`. Never write under batches/.
   - build.mjs: builds the LB6 plates page on main's tools, from rows.json's ids only.
   - qa.mjs: runQa per id through candidateOf(id, { all, authoring: true }).
6. Cards (the 3, once):
   a. At start: copy the 3 cards and quotes byte for byte from the research head `a8e66f32` and commit them, with lb6/cards.sha.json holding the research head sha and each copy's sha256 (in the canonical form the test states).
   b. After 'LB6 NOTE RULED': add top-level plateFacts, tempo and topFault per D-LIB9-CARDFIELDS, 13 Q1, the ruled maps, 14.7's form rules, D-LIB8M-FACTS with 22's scope and D-LIB16-FACTS. Each value names the claim whose quote states it. No value comes from a spec. cards.sha.json keeps each card's sha256 without those three keys.
   - Post 'LB6 CARD FIELDS READY @ <sha>' and wait. The supervisor runs the blind verify of PANELS.md section 3 (one planted error, the pose map in rules.md, Q1's topFault checks; lib4-cards :1143).
   - Fix only what it names, re-run qa.mjs for the rows that changed (H6 must pass), and post 'LB6 CARD FIELDS FIX @ <sha>'. A focused re-verify with a new plant runs on the changed cards. 'CARD FIELDS VERIFIED @ <sha>' follows.
   - If the supervisor names a later research head that changes an LB6 H card (F-LB6-3's Marquette re-fetch included): copy it again, re-apply its keys, update cards.sha.json. If a cited claim changed, the verifier re-runs for that card and its plate is QA'd again.
7. Draw the bulk on 'LB6 BULK GO', following DRAWING-GUIDE.md: machine_pullover with eq/pulloverMachine.mjs. LB1-LB5's lessons, each with a drawn-item test where it applies (A15), on every plate (the slice's two included):
   - The Mistake reads as a pose outside the solid end figure: red parts clear it by at least 6 px, or are drawn as red dashed lines over it (13.1; 13.4 must-fix 1; 13.7). The fault part is drawn on top of anything that would hide it (lib4-cards 30-31, one_arm's R5).
   - 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key (Q-D5-4; D-LIB10-SKULL1). Each tell's anchor sits on an item drawn in that pose; a fault that moves equipment shows it with the 8's drift arrow from the end position (6341498444 item 3).
   - Callout boxes sit in open space; leaders meet their anchor from the open side and never run across the figure (6341498444 item 6). No leader runs within about 6 px of the Trace, a cable, a lever, a pad or the seat. An angle callout draws its arc with its expected value (6341498444 item 5; DRAWING-GUIDE §2).
   - No foot through the floor: every drawn foot's heel, ball and toe sit on or above the floor line in every pose. A heel that lifts (none of the 3 cards asks for one) pivots about the ball until the toe pad touches the floor, as pilot A's reverse_lunge.mjs:17-22 and :126, with a `toe.r` floor check for that pose (6341498444 item 1). cable_chest_press's feet stay planted (c2).
   - A bent arm reads as bent: where the card bends the elbow (machine_pullover's arms on the elbow pads, c3; machine_crunch's arms on the handles, c3), the drawn elbow bend is about 150° or less and the two elbows do not meet in one stub (6341498444 item 2). cable_chest_press's end elbow is the ruled bend (D-LIB16-LOCK), never 180°.
   - A cable runs from its pulley to the handle in every pose and is never drawn on top of the trunk, head or near arm: it passes on the body's far side, drawn behind the figure, or clear of the outline (cable_chest_press; census note "one column shows in side view").
   - A hidden start part is redrawn as a dashed phantom (Q2 (c)). Ghosts follow the real joint path; a straight limb never bends between poses (13.3 must-fix 1, 3).
   - Tests assert on drawn items, never on the spec's own formula (13.1; 13.4 must-fix 3).
   - A cue table per id: the card's `what` and claim, the plate cue, the word count (Q-D5-6).
   - Card truth wins over a critic's fix (PANELS.md 1 point 5; D-LIB13-ONEARM). If one card's facts cannot all hold on the body at once, stop and post the per-card conflict.
8. QA (after the verifier's verdict on the cards it covers):
   - build.mjs builds the LB6 plates page twice, to a temp directory; the bytes must match;
   - qa.mjs runs runQa's node and browser halves (Chromium at /opt/pw-browsers/chromium) per id and prints the table: hard checks, raised flags (F5's element and value shown) and metrics.
   - A measured flag that differs from the ruled expected set is posted with its value and range, and ruled before READY. No flag is dropped or exempted.
9. Post the ready line with the per-id table. Then the supervisor runs the calibrated critic per PANELS.md section 1:
   - Anchors per D-LIB16-ANCHORS; a hidden anchor is never the visible reference. 13.7's facts diff runs before the round.
   - Two plants rebuilt on LB6 plates at the head, each an extra copy of a different candidate with a named rubric item (PANELS.md 1 step 1). If held rows leave fewer than 2 candidates on the page, the run waits for the supervisor's ruling on the plants; it never runs with one plant.
   - The brief carries 13.6's rule: any pose fix keeps the drawn segment lengths and states them.
   - Fix only what the critic names. A fix never edits a card. If a fix would break a hard check, a pinned test or a ruling, post the conflict with its evidence.
   - One fix round, then one fresh calibrated recheck on the changed plates. A plate that fails its recheck gets a second focused round only by ruling (D-LIB13-PANEL2), else it is held (D-LIB8M-CARDTRUE).

Stops (post on the PR with the evidence and wait for a ruling; never work around one):
- S1 A fault the engine cannot draw: no body joint or equipment part moves for it (as cross_body_hammer_curl's wrist twist: the engine has no forearm rotation, lb5/DESIGN.md:252 @ `92a3a52f`). The plate is held; it is never drawn with an empty or substitute Mistake, and the next fault is research's call by LR-31's steps (#290 6340075388 item 2). None of the 3 is expected to hit this: the engine bends the trunk at one lumbar pivot with a pelvis tilt (body.mjs:22, :112-116), which can draw the crunch's curl and the pullover's arch, and the elbow's bend draws the press's lock [unverified until drawn].
- S2 A Mistake below deviationMin or a Trace below traceLenMin at its ruled size: the plate is held under D-LIB8-shrug (D-LIB16-SIZE). Post the measured value. Never enlarge, widen, crop or re-scale to pass.
- S3 One card's facts cannot hold on the body together, for example cable_chest_press's start: elbows just below 90° (c3), handles at about nipple height (c4) and about one inch short of the chest (c5), in a side view with no arm abduction [unverified until drawn]. Post the per-card conflict (D-LIB10-BENCH-H).
- S4 A size or pose ruled in the note would need to change after H3 is measured: post it with a reason that is not PQ-H3.
- S5 Anything would run LIB-4b's or LIB-4c's scratch fixture in this tree, or write an LB6 id into batches/ or tests/howto/golden/ (D-LIB16-SCRATCHIDS).
- S6 Two failed tries of one approach with no new evidence.

Acceptance (each mutation must turn red, then be restored; list each one in the PR with its red line):
- A1 The note and the slice are posted before the bulk, with a cited mode reason per id, and the bulk starts on its GO. Evidence: PR comment links. Recorded check (a process item, so no mutation): `git log --diff-filter=A` shows machine_pullover's spec and eq/pulloverMachine.mjs first committed after the 'LB6 BULK GO' comment's time.
- A2 Both composers use PRIMITIVES types only. In every drawn pose (start, end, Mistake) each static part (seat, back pad, frame, foot bar, shin roller) sits at one fixed place (±1 px), and each part that moves between the end pose and the Mistake carries `poly`, so it is drawn in the Mistake view (vendor/engine/plate.mjs:213 draws a changed item there only with `poly`; plan 2.1:126-128). The contacts the ruled facts place hold on the drawn items in the poses they name: for example machine_pullover's back on the pad at start and end and off it in the Mistake (c7, c8), and machine_crunch's shins on the roller at start (c2). Mutations, each red: {type: 'wedge'} → H9.type; machine_pullover's back pad moved 2 cm in the Mistake; the part the note names as moving between end and Mistake drawn with `line` instead of `poly` → this test is red (it is missing from the Mistake view; H9 alone passes a moving `line`, qa/envelope.json H9lineTypes, qa/node.mjs:263-266); machine_pullover's back moved 2 cm off the pad in the end pose; machine_crunch's shins moved 2 cm off the roller at start.
- A3 Closures are pure and drawn by the vendor engine. For each id, closureOf passes on its spec, contains tools/plates/vendor/MANIFEST.json, has no path under tools/plates/layers/, tools/plates/vendor/exercises/, hands/, fidelity/ or ci/, and no specs/ file but its own. Mutations: readFileSync added to a composer makes closureOf throw; a spec importing tools/plates/layers/engine/body.mjs → red; a spec importing tools/plates/vendor/exercises/machine_chest_press.mjs → red.
- A4 For every id in lb6/rows.json, every PQ-H1..H10 check passes in runQa node and browser, and the raised flags equal the ruled expected set exactly. Mutations on one LB6 plate, each red: LIB-3's M1-M7 as named in qa/mutations.mjs; a colour literal (H2.colour); its F5 tell chrome changed so F5 reads 3.40 (in a temporary worktree, never committed).
- A5 lb6/rows.json holds exactly the drawn ids that are not held, each once, counted in the raw text, and every row's mode is 'H'. Each held id is in DESIGN.md's held table with its ruling and in no rows file. None of the 13 LB6 ids not in this card is in lb6/rows.json. Mutations: drop a row; duplicate a row; a held id added; cable_fly added; smith_machine_squat added; one row's mode set to 'D'.
- A6 PQ-H6: facts within ±2° or ±1 cm, tempo equal to the card's, one form per fact. Mutations: a fact +3° turns H6 red; the card path removed gives H6:no-card; a fact with both `joint` and `measure: true` → red.
- A7 The tempo strip follows the card on every row (D-LIB16-SECS, -TEMPO). For each id, the spec's tempo array is built only from the ruled lb6/tempo.json row and the card's plate.tempo. Mutations, each red: a Hold phase added to cable_chest_press (pause 0); machine_pullover's Hold removed; a 1 s bottom-pause phase added to machine_crunch; a Rest phase added.
- A8 No F7 (all 3 drawable true): once its card keys are written, each row's topFault equals the key its first tell carries, and F7 is not raised. Mutation: machine_pullover's card copied with topFault set to another of its tell keys → F7 is raised and the A4 expected-set test is red.
- A9 Nothing ships (D-LIB16-AHEAD). lb6-plates.test asserts:
  - every lb6 row's stage is drawing or review;
  - none of the 3 is in shippedIds(), in any batches/ file, or in tests/howto/golden/library/, matched as whole tokens (`\b(lib_)?<id>\b`, and `(^|[^a-z0-9-])<slug>([^a-z0-9-]|$)` for the hyphen form). No file name there matches /lb6/i, and no text names `"batch": "LB6"`;
  - the matcher is exact: over src/data/exercises.json no real id other than its own contains one of the 3 as a substring (checked on main `5158609c`), and the matcher matches neither "lib_cable_chest_press_v2" nor "seated-machine-crunch";
  - no LB6 spec, composer, How-to or test imports anything under hands/, fidelity/ or ci/;
  - generate --check is green and unchanged. The PR body reports the seconds its child process took.
  Mutations, shown in the slice post: one row set to shipped; one set to approved-plate; rows.json copied into batches/; a file naming an LB6 H id in tests/howto/golden/library/; a page-only lb6.json `{"entries":[{"kind":"page","batch":"LB6"}]}`; machine-crunch.layers.html with `data-id="machine-crunch"`; the token matcher swapped for a plain substring test → the "lib_cable_chest_press_v2" control is red. Control: a file naming only lib_cable_fly, lib_pec_fly and lib_smith_machine_bench_press (LB6, not in this card) stays green.
  Recorded check (not a unit test): before each milestone post, run `git diff --exit-code origin/main...HEAD -- tools/plates/library/batches tests/howto/golden tools/plates/library/hands tools/plates/library/fidelity tools/plates/library/ci tests/howto/library-lint.test.ts tests/howto/library-fidelity.test.ts src tools/plates/gen` on the merged head and paste its empty output. Seed it once in a temporary worktree: one committed byte (a throwaway commit; the three-dot diff never sees uncommitted bytes) changed in tests/howto/library-lint.test.ts must give exit 1.
- A10 The plates page is deterministic (PQ-H7): two equal sha256 values. Mutation: a `Date.now()` added to one LB6 spec's alt text (temporary worktree) → the two sha256 values differ.
- A11 A card differs from its research-head copy only in the three keys (cards.sha.json). The test holds its own copy of the ruled tempo table and builds each card's tempo only from it and plate.tempo. Each fact's pose equals the ruled pose map's image of the pose its quote states. Mutations, each red: any other card key edited; seconds changed on one card's tempo and spec; a start fact named with the unmapped pose.
- A12 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head. No mutation of its own: every unit-test mutation in A2-A11 and A15-A17 is also red in `npm test`.
- A13 The content verifier is VALID (its plant caught) on each card's fields at the head's cards.sha.json, with Q1's topFault checks, before any Do 8 evidence for that card. Evidence: 'CARD FIELDS VERIFIED @ <sha>'. Mutation: the verifier's planted error (PANELS.md 3); a run that misses it does not count.
- A14 The critic run is VALID under PANELS.md section 1, and the supervisor's approvals are recorded per exercise. Each held plate has its reason and ruling on the PR. Mutation: Do 9's two plants; a round that misses either does not count.
- A15 Do 7's lessons and the Q-D5-6 cue table are tested on drawn items. Mutations, each red: a red Mistake part moved inside the figure's 6 px clearance; a leader within 6 px of the cable or a pad; a leader crossing the figure's outline; cable_chest_press's cable drawn over the trunk; one toe 1 px below the floor line in any pose; machine_pullover's start elbow set to 170°; cable_chest_press's end elbow set to 180°; one tell's anchor moved to a point with no drawn item; a cue over 15 words.
- A16 No other card's composer is copied, forked or imported (D-LIB16-COMPOSERS, -HANDLE): tools/plates/library/eq/ on this branch holds exactly main's files plus eq/pulloverMachine.mjs, eq/crunchMachine.mjs and any composer the ruled note names. Mutation: a copy of #245's eq/dHandle.mjs added under eq/ under another name → red.
- A17 Sizes are fixed before H3 and never sized by it (D-LIB16-SIZE): every unsourced number in each spec equals its row in lb6/sizes.json, in the form the note proposes (for example an exported table the test reads), and every row has a basis that is a claim id, an approved plate's file:line, or a stated reason, never PQ-H3. Mutations, each red: one Mistake size changed in its spec only; a sizes.json row with an empty basis; a row whose basis names PQ-H3 or deviationMin; a spec number missing from sizes.json.

verification: the per-id QA table, both plates-page sha256 values and the A9 recorded diff check at the exact head sha. The verifier's and the critic's comments name that sha.

risk_and_recovery:
- cable_chest_press's elbow lock is below deviationMin at its ruled bend [est 6-7 px]: held under D-LIB16-LOCK and -SIZE, routed to LIB-ZOOM. The slice still shows it, marked held.
- machine_pullover's arch is below deviationMin at its ruled size [unverified until drawn]: held the same way (zoom circle on the back and pad), never enlarged.
- The cable of cable_chest_press cannot reach the handle without crossing the figure in side view [unverified until drawn]: draw it on the far side behind the figure; if it still reads as through the body, report it with renders (Do 7).
- The pullover's or the crunch's lever geometry cannot keep a contact the ruled facts place in every drawn pose (the elbow pads, the shin roller) [unverified until drawn]: post the conflict (S3); never move a fact.
- machine_crunch's Mistake (trunk upright, arms pulling the handles) conflicts with how its lever moves the handles: the card records the ACE and Fitbod against Motra conflict (plate.mistake.why, notes) and draws Motra's fault; if the lever cannot move without the trunk, post it with renders.
- The Marquette source (mq-pullover, machine_pullover c1-c7) answers again and differs from the carried quotes (F-LB6-3): the supervisor names the new head; the card is re-copied, the verifier re-runs for it and its plate is QA'd again.
- A later research head changes one of the 3 cards (D-SUP-PROTECT): the note follows the head; a changed pick re-plans the Mistake and its fault→key entry, and re-runs the verifier and QA for that card. A head that sets a tempo to null puts that row under D-LIB14-NOSECS.
- Pilot A, pilot B, LIB-12, LB1, LB4, LB5, LIB-7b or LIB-ZOOM lands mid-card: merge main in, rebuild the plates page twice and re-run QA. Approvals are head-only.
- A plate cannot pass a hard check card-true: it is HELD and reported (D-LIB8M-CARDTRUE). Any zoom view shows no angle number (owner, lib-zoom-card.md:12).
- Another branch's COACHING-DECISIONS entries land first: resolve the append conflict by keeping both sides.

return:
- the PR number and head sha;
- links to the note, the slice, the card-fields line and the ready line;
- the per-id table (mode, clone source, composer, hard checks, flags, held or not, and why);
- the size table with each measured H3 value;
- the plates-page sha256;
- the mutation list and the A9 recorded diff check;
- the output of check, test:tz and the gate.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-16 resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

---

Rulings recorded (D-LIB16-*, supervisor session_01PeNM9HeWPrhrcscMwXzupy, 2026-10-22 ~13:40 UTC). Each was proposed in the draft and checked against the sources named.

1. D-LIB16-AHEAD: as D-LIB15-AHEAD (lib-15-card.md:284-287), with LB6 names.
   - LIB-16 may push with its drawn LB6 rows at stage drawing or review in tools/plates/library/lb6/rows.json only. Nothing goes under batches/, tests/howto/golden/, src/ or tools/plates/gen/, and its A9 test enforces this.
   - Every D-LIB4-ENTRY condition holds before any LB6 id is approved-plate, pinned, in batches/ or shipped.
   - Why: D-LIB4-ENTRY-2 (lib4-cards :1055-1070) names LIB-9 only, and its reason (K cannot rise while no id ships) holds here, as D-LIB10-AHEAD (:3156-3159) and D-LIB13/14/15-AHEAD found.

2. D-LIB16-SCOPE: one build-ahead card and branch for LB6's 3 H rows (cable_chest_press, machine_pullover, machine_crunch; plan :745-747).
   - Name: up to LIB-14 the card ids equal plan 7's row ids. LIB-15 took plan rows 15 and 16 (both LB5 halves, D-LIB15-SCOPE), so this LB6 card takes the next id, LIB-16. It fills plan 7 row 17 (:814, named LIB-17 there). The plan's row names stay as they are; the LB5b ship card is still plan row 16 (:813). Every post and branch here says "LIB-16" and "LB6" together, so the two never mix.
   - The other 13 rows cannot start here: smith_machine_squat is D; cable_fly and smith_machine_bench_press are pilot B plates and pec_fly is pilot A's (reused as pinned, D-LIB10-PA's pattern); the 9 T rows need their template parent or rig anchor pinned (D-LIB10-TEMPLATES, lib4-cards :3161-3164; plan 3.1:293-294), and neither pilot is on main.
   - This card never merges. The ship card for LB6 merges in plan order (row 17).

3. D-LIB16-PILOTB: pilot B's answer gates the sheet and the merge of the 3 H rows, not their drawing.
   - Plan 6.1:694 says pilot B is "answered before LB6 starts", and 6.2:715 lists "pilot B answered" first in LB6's needs. Read against plan 3.1:293-299 (the anchor rule names what must be owner-approved before a plate is started, a T child or a D plate, or put on a sheet) and against the pilot A line in the same section (6.1:671-672, which names the LB1 and LB2 users of its anchors), "LB6 starts" means the LB6 rows that derive from a pilot B anchor: the 4 other `smith` rows (smith_machine_incline_press, smith_machine_shoulder_press, smith_machine_shrug, smith_machine_squat) and the 2 CFLY children (low_to_high_cable_fly, high_to_low_cable_fly), and LB6's sheet.
   - None of the 3 H rows derives from a pilot B plate, template, rig or pose class: their closests are the 8's machine_chest_press, lat_pulldown and hanging_leg_raise; their composers are single use with themselves as anchors; their classes are split (pilot A's reverse_lunge) and seat (no anchor). machine_crunch is not a SUPCORE child (D-LIB16-CRUNCH).
   - Precedent: LB2's needs read "pilot A answered" (6.2:711), and LIB-10's H build-ahead opened #265 on 10-18 20:49 UTC, before "Pilot a ok" (10-19 12:10, HANDOVER:1433); D-LIB10-AHEAD let it build and kept pilot A's yes for its T children and its merge.
   - Why nothing is loosened: no pilot-B-dependent row starts; the 3 rows go on no sheet and merge nowhere before pilot B is answered and pinned (merge_prerequisites). This is a reading of the plan's dependency, recorded here as cards.md asks, not a waiver.

4. D-LIB16-SECS: all 3 cards give up and down in seconds at `a8e66f32` (cable_chest_press 2/2/0, machine_pullover 2/2/1, machine_crunch 2/2/0). So D-LIB14-NOSECS applies to none of them: every drawn row has a tempo strip and goes on rows.json, the page, QA and the critic. The other 13 LB6 cards also have seconds (checked at `a8e66f32`), so no LB6 id waits for the no-seconds strip.
   - machine_pullover's pause 1 is a WEAK drawing convention for a pause at the belt whose sources give no seconds (c14, LR-33); it is drawn as its card says, and the tempo test pins it (A7).

5. D-LIB16-CLONE: each id clones from its census closest, one of the 8 on main: cable_chest_press from machine_chest_press, machine_pullover from lat_pulldown, machine_crunch from hanging_leg_raise (plan 3.1:290; census.json:928, :3668, :6505). The census marks machine_crunch's closeness N (a new movement) and lists the "pivot-arm handle (chest-press lever)" for both lever machines, so machine_crunch and machine_pullover may also copy machine_chest_press's seat and lever code. Copy, never import (D-LIB9-CLONE).

6. D-LIB16-COMPOSERS: `pulloverMachine` and `crunchMachine` are single-use composers; machine_pullover and machine_crunch are their anchors, and they land in this PR (plan 2.1:129-130, :141). Neither exists on main or on any open PR (checked at the heads in the collision table).
   - Each returns PRIMITIVES types only (equipment.mjs:316 on main, `poly` and `chestPress` included) and may use eq/parts.mjs. A part that moves between the end pose and the Mistake carries `poly` (PQ-H9).
   - No composer on another open PR is imported, copied or forked (#245's dHandle, assistMachine and chestRowMachine; #278's smith and legCurlMachine; #109's pecDeck and inclineBench), as D-LIB10-NOTE Q2 2 rules for pilot A's. They are read as patterns only.

7. D-LIB16-HANDLE: cable_chest_press's single handle is drawn in its own spec from vendor primitives (`line`, `poly`), as LB5's note did for bayesian_cable_curl (lb5/DESIGN.md:55, :308 @ `92a3a52f`): the vendor `vHandle` (equipment.mjs:128) is a two-grip handle. It never copies or imports LB1's eq/dHandle.mjs (#245, unmerged).
   - If #245 is on main before the slice is drawn, the note may propose importing main's eq/dHandle.mjs instead, so the shared single handle has one drawing; that is ruled with the note. Plan 2.1:142 gives the single handle no anchor, so neither choice gates a sheet.

8. D-LIB16-SPLIT: cable_chest_press is drawn H now. It goes on no sheet until reverse_lunge, the split anchor, is redrawn to its new pick, owner-approved and pinned (plan 3.1:297; 2.2:155). Until then it rolls (plan 3.5:376). No other split anchor is substituted.
   - Why: the census tags cable_chest_press split (poses stand and split; byPoseTag.split, 9 ids) for its staggered stance (c2). reverse_lunge is held (D-LIB8M-NOSTRIP) and its pick changed (D-SUP-LB4-REVLUNGE), as D-LIB14-STEPUP and D-LIB15-SPLIT record.

9. D-LIB16-SIZE (lessons 6341498444 item 1 and #290 6340849204): no unsourced size serves PQ-H3.
   - Every number the card does not give, each Mistake's magnitude included, is fixed in the note's size table (lb6/sizes.json) before H3 is measured, with a basis: a claim id, an approved plate's value (file:line) used as a convention, or a stated physical reason. PQ-H3 is never a basis.
   - The slice and READY posts give each Mistake's measured deviation and Trace length beside its size row.
   - If a plate is red on H3.deviation or H3.trace at its ruled size, it is HELD under D-LIB8-shrug (lib4-cards :1596-1690; #290 6340075388 and 6340849204): kept as drawn, in the held table, its size marked as drawn, not sourced. Its route is a zoom circle under LIB-ZOOM's convention once #279 is on main, built by this card on 'LIB-16 resume' or by its follow-up (as F-LIB15-1). If research later finds a sourced size, that size is drawn instead.
   - Never widen, crop, re-scale or move a fault off its card to pass (Q-D5-3).

10. D-LIB16-LOCK: cable_chest_press's end and Mistake.
    - The card gives no number for "almost locked" (c5) or the "slight elbow bend" (c17). The proposed basis for the end bend is the 8's machine_chest_press, approved, whose end draws the same cue ("press until your elbows are fully extended, but not locked") as elbows 18° short of straight (machine_chest_press.mjs:45, :9). The note may name a quote instead; the bend is ruled with the note.
    - The Mistake changes only the elbows, to straight (c17, c5). The 8's own Mistake also rolls the shoulders forward ("round and lock", :67-70) from its own card; cable_chest_press's card names only the lock, so that part is never copied.
    - [est] the elbow tell anchor then moves about 4-5 cm, 6-7 px at the reference 146.29 px/m, under deviationMin 11.39. If H3 is red, D-LIB16-SIZE holds it, with the zoom circle on the elbow as its route.

11. D-LIB16-FACTS (lessons 6341470610 items 1-4). The note proposes; the blind verify (PANELS.md 3 and 7) decides. Candidates read at `a8e66f32`:
    - A hand contact is checked at the wrist (PANELS.md 7). Candidates: machine_pullover c3 "Position the hands on the movement arm" and machine_crunch c3 "Grasp the handles in both hands" (start).
    - A "keep" or "remain" cue covers every drawn pose, unless the quote's own words tie it to one phase. Candidates: cable_chest_press c2 "Keep the feet planted on the floor" (heel and ball, both feet, start and end); machine_pullover c7 "Torso and head should remain back touching the back pad" (start and end; a back on a flat pad ends at `buttock`, D-LIB11-SACRUM). cable_chest_press c3 "Keep the elbows just below 90 degrees" sits in the start setup and would contradict c5's almost-locked end, so the note proposes it as a start fact and names that reading; if the verifier reads it for every pose, it is a per-card conflict (S3), never tuned.
    - Contacts only for drawn poses. machine_pullover c2 "place feet on the foot bar" and c5 describe getting in and out; c3 takes the feet off ("Take feet off foot bar") before the drawn start. So no foot-bar fact, as step_up's c5 was declined.
    - No contact from a height or a place near the body: cable_chest_press c1 "chest height", c4 "roughly where your nipples are" and c5 "about one inch before touching the chest" say where an item is, not that it touches. machine_pullover c4 "Hold the bar in tight to the seat belt" is equipment on equipment, with no body landmark.
    - Every number a quote gives for a drawn pose is a fact when the body model has the joint; otherwise it goes in DESIGN.md's "not facts" with that reason (front_squat c8's rule). Candidates: cable_chest_press c3 "just below 90 degrees" (elbow, start); c7 "Keep your elbows at a 45-degree angle from your body throughout the movement" (the upper arm to the trunk, as PANELS.md 7's `sh.r.elev` ruling for smith_machine_bench_press, or "not facts" with the reason); c5's "about one inch" (no fact kind for a gap); machine_crunch c3, Motra's "grasp the handles with elbows bent at 90 degrees" (elbow, start, if the note shows Motra's machine is the drawn kind; else "not facts").
    - A fact cites the claim whose quote states it (6341470610 item 3: bodyweight_squat's facts moved from b6 to b7).

12. D-LIB16-TEMPO: the tempo map, for the note to propose and the supervisor to rule (13 Q3; D-LIB8M-TEMPO):
    - cable_chest_press: press ← up 2, return ← down 2. machine_pullover: pull ← up 2, Hold ← pause 1, return ← down 2. machine_crunch: crunch ← up 2, return ← down 2. Phase names follow pilot A's form; the order follows the drawn order.
    - Motra's 1 s bottom pause (cable_chest_press c16, machine_crunch c15) has its seconds in a quote, so a constant phase is allowed but never required (D-LIB8M-TEMPO; barbell_overhead_press: "No bottom rest from c20"). It is not drawn: research left it in tempo.text on purpose (LR-33; R-LB6-7), and the strip then equals the card's up, down and pause. A7 pins it.

13. D-LIB16-VLINE: src/data/exercises.json on main names one kind for each of the 3 ('Cable', 'Machine', 'Machine'), so none shows a variant line (D-LIB13-VLINE). The plate.variantLine on machine_pullover and machine_crunch is a drawing note, never shown. machine_crunch's ("Drawn: shin roller and handles by the shoulders") and machine_pullover's (the elbow-pad machine) bind the drawing. Research follow-up F-LB6-5: move both texts to `notes` in the next pass, as F-LB5-2. It changes neither the drawing nor the three keys.

14. D-LIB16-CRUNCH: machine_crunch is H and uses no SUPCORE template.
    - Pilot B's note lists it among "SUPCORE (5 children: cable_crunch, machine_crunch, reverse_crunch, bicycle_crunch, ...)" (pilot-b/DESIGN.md:183 @ #278 `d3b231d6`). The plan marks it H (:747, no mark; :715 H3). SUPCORE's parent is pilot B's floor-supine crunch (6.1:696), and a template's members share one body setup (3.1:275). machine_crunch is seated (census poses seat).
    - Pilot B's line is a builder's remark on PARAMS. It is read only, never edited here, and it changes no mode.

15. D-LIB16-SLICE: the H slice is machine_crunch (closeness N, a new movement; the `crunchMachine` lever pattern; the curl-not-hinge end) and cable_chest_press (the split stance, the cable path in side view, the elbow-lock size). Bulk: machine_pullover, on 'LB6 BULK GO'.
    - Why: plan 6.3:771-772 and cards.md "hard cards": the representative and the highest-risk cases first. machine_pullover reuses the seated lever-machine pattern that the slice look checks on machine_crunch, so it gains from waiting; its own size risk (the arch) is fixed in the size table before drawing (D-LIB16-SIZE).

16. D-LIB16-ANCHORS: D-LIB10-PANEL1 unchanged, as D-LIB15-ANCHORS (lib-15-card.md:328). Hidden anchors are golden B's pull_up and lat_pulldown until pilot A is pinned (PANELS.md 1 step 1), then D-LIB10-ANCHORS' pair (barbell_overhead_press and pull_up), with its pilot A one-item exception. Visible references: the 8's machine_chest_press, hanging_leg_raise and, once it is no longer a hidden anchor, lat_pulldown. While lat_pulldown is hidden, machine_pullover's visible reference is machine_chest_press. Golden-B follow-ups 19-22 stay excepted as recorded (PANELS.md 1 @ `eb9f2eff`; lib4-cards 29-31).

17. D-LIB16-SCRATCHIDS: as D-LIB-SCRATCHIDS (lib4-cards :1098-1103) and D-LIB13-SCRATCHIDS (lib-13-card.md:325).
    - LIB-4b's B5 fixture targets lib_cable_chest_press (fidelity/fixture.mjs:29, from machine_chest_press, key lib4b-scratch-c; ci/scratch.mjs:32 lists it as TAKEN; LIB-4-DESIGN.md:93, :149). Its stage() writes specs/cable_chest_press.mjs and howto/lib_cable_chest_press.howto.mjs in a scratch tree (:97-98), the same paths this card creates.
    - No clash now: the fixture runs only in a scratch tree, and in main CI library-fidelity.test.ts calls transformSources only, which writes nothing (:269-326). This card keeps its rows out of batches/ (A9), and never runs either fixture in its tree (S5).
    - The push that first moves cable_chest_press into batches/ (the ship card) swaps that target for a non-LB1-LB6 id with the same source, key and COPY_EDITS, re-runs the fixture test, and lists the changed lines. New scratch fixtures never target an LB6 id.

Supervisor follow-ups (not the builder's):
- Send 'LIB-16 start' with the live active-builder count: LIB-7b, LIB-14 and LIB-15 make 3 of 4 (LIB-7b an enabler), so LIB-16 is the third drawing slot. Re-count before sending.
- Add LIB-16 (LB6 H build-ahead) to the owner's checklist after the LB5 ship cards, in plan row 17's place.
- Research follow-ups on claude/libht-research: F-LB6-5 (two variantLine texts to notes; D-LIB16-VLINE) in the next pass; F-LB6-3 (re-fetch Marquette) stays open. Name any new head on this PR.
- Plan docs action on claude/howto-options: record D-LIB16-PILOTB's reading at 6.1:694 and the card-id mapping of D-LIB16-SCOPE.
- Merge LIB-16's card-field commit back into claude/libht-research after 'CARD FIELDS VERIFIED' (#287 is merged there as `3812989f`).
- Send 'LIB-16 resume' once LIB-ZOOM is on main, for any row held under D-LIB16-SIZE.
- For the ship card: the back box's appliesTo omits cable_chest_press, which links 'back' (merge_prerequisites); the D-LIB16-SCRATCHIDS swap; machine_pullover's hand zoom has no `balance` key; card LB6's D, P and T rows once both pilots are pinned on main.

---

Collision check (cards.md step 1; `git diff --name-only origin/main...<head>` at main `5158609c`, 2026-10-22 ~13:30 UTC; research PRs against claude/libht-research `a8e66f32`). Searched for the 3 ids in both spellings, `pulloverMachine`, `crunchMachine`, lb6, and the write_scope paths:

| PR | branch @ head | files | overlap with write_scope | pins on the 3 ids |
|---|---|---|---|---|
| #109 pilot A | lib-8-pilot-a @ `ff7c5c4f` | 102 | docs/COACHING-DECISIONS.md (append) | none |
| #191 LIB-12 | lib-12-hand-views @ `8bea5afc` | 100 | docs/COACHING-DECISIONS.md (append) | hand-d-handle.mjs:23 (cable_chest_press GAP), census-scope.json:14, :62, :114, :197: the same lines as main; read only |
| #245 LB1 | lib-9-lb1 @ `9e5d9666` | 67 | none | none (eq/dHandle.mjs: read only, D-LIB16-HANDLE) |
| #265 LB2 | lib-10-lb2 @ `2dcbac15` | 35 | docs/COACHING-DECISIONS.md (append) | none (its A9 control names lib_smith_machine_bench_press only) |
| #271 LIB-7c | lib-7c-lb1-hands @ `88ad31bd` | 20 | docs/COACHING-DECISIONS.md (append) | none |
| #273 HT-11 | ht-11-delta @ `e0722148` | 33 | none | none |
| #274 LB3 | lib-13-lb3 @ `a6f4bd07` | 42 | docs/COACHING-DECISIONS.md (append) | none |
| #278 pilot B | lib-11-pilot-b @ `d3b231d6` | 29 | none | pilot-b/DESIGN.md:183 (machine_crunch as a SUPCORE child; D-LIB16-CRUNCH); lib11-pilot-b.test.ts:325-326 (lib_machine_crunch in its substring control): read only |
| #279 LIB-ZOOM | lib-zoom @ `754176a0` | 90 | none | none (its convention is the held rows' route, D-LIB16-SIZE) |
| #282 LIB-5v | lib-5v-variant-line @ `2ad1bf3c` | 13 | docs/COACHING-DECISIONS.md (append) | none |
| #284 LIB-7b | lib-7b-hand-blocks @ `3aa1729a` | 33 | docs/COACHING-DECISIONS.md (append) | none (its hands/**, layers-spec.mjs, build-layers-page.mjs, gen/** and src/howto/generated/** are reserved here) |
| #289 LIB-14 | lib-14-lb4 @ `4adde423` | 30 | docs/COACHING-DECISIONS.md (append) | none (LB4 ids only) |
| #290 LIB-15 | lib-15-lb5 @ `92a3a52f` | 34 | docs/COACHING-DECISIONS.md (append) | none (LB5 ids only) |
| #292 GATE-FLAKE-5 | gate-flake-5 @ `344b3c7e` | 2 | none (scripts/screenshot-gate.mjs is a shared add-only file this card never touches) | none |
| #288 LB7 research | libht-research-lb7 @ `f1917bf6` | 27 | none | none |
| #259 LP research | libht-research-lp @ `dd54051e` | 1 | none | none |

- Other open PRs (#1, #3, #88, #92, #94, #144, #149, #158, #188, #190, #192, #197, #209, #221): no write_scope overlap except the COACHING-DECISIONS append on #92. #190 and #209 are do-not-merge.
- Shared add-only files on main (scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css): no line names any of the 3. LIB-16 touches none.
- Main: LIB-4b's scratch target is cable_chest_press, settled by D-LIB16-SCRATCHIDS (no write until the ship card, which swaps it). machine_crunch's back-box appliesTo entry (box-cap.test.ts:132) is read only.
- Result: no unsettled collision. The only shared write is the append-only COACHING-DECISIONS.md (keep both sides). #191's GAP line, #278's SUPCORE note and main's scratch fixture are read only and named in read_first.

Open items (none blocks the start):
- Pilot B's owner answer and pin (D-LIB16-PILOTB) and pilot A's pin with a redrawn reverse_lunge (D-LIB16-SPLIT): gate the sheet and the merge only.
- Unknown until drawn: whether cable_chest_press's lock and machine_pullover's arch pass PQ-H3 at their ruled sizes; whether the cable reads clear of the figure; whether the lever composers keep every ruled contact (risk_and_recovery).
- At ship time, not now: the back box's appliesTo and cable_chest_press's 'back' link (an appliesTo change went through the owner's decision 6 before); the D-LIB16-SCRATCHIDS swap; machine_pullover's hand zoom.
- The live active-builder count: named in 'LIB-16 start'.

---

Critic pass (2026-10-22, one fresh read of the draft by its author):
- Fields: id, model, mode, title, branch, slot, base, depends_on, build_prerequisites, merge_prerequisites, shared-file owners with write_scope and reserved_paths, read_first, design_reference, connectivity, outcome, deliverable, evidence, finish, forecast, Do 1-9, Stops S1-S6, acceptance A1-A17, verification, risk_and_recovery, return and the resume rule: all present.
- Corrected in this pass: LB2's plan row is :711 (was :712); the LB5 ship rows are 15-16, :812-813 (was 15-17); A2's `line` mutation now fails the card's own Mistake-view test, because H9 passes a moving `line` (qa/envelope.json H9lineTypes holds 'line'; plate.mjs:213 draws a changed item in the Mistake only with `poly`); A3's closure check now names tools/plates/vendor/exercises/, so its import mutation bites; Do 2 also expects F7 'no card top fault' before Do 6 b (qa/node.mjs:360); Do 9 no longer invents a plant arrangement (PANELS.md 1 needs two different candidates); D-LIB10-NOTE Q2 2 is cited for pilot A only, with D-LIB16-COMPOSERS extending it; #188 is off the COACHING-DECISIONS list (its diff touches one other file); S1 no longer credits the lumbar pivot with the elbow lock.
- Ids: the 3 H rows match plan :745-747 (no mark) and :715 (H3), the census rows (:928, :3668, :6505) and lb6-research-verify.md:23-25. Every card, quote, tempo and drawable field was read at `a8e66f32`, byte-identical at `3812989f`. All 16 LB6 cards have seconds.
- Lessons carried: 6341470610 (wrist contacts, "keep" cues, drawn poses only, no contact from a height) → D-LIB16-FACTS; 6341498444 (no foot through the floor with a toe check, bent arms not stubs, no unsourced size serving PQ-H3, no leader across the body, labels on drawn items, angle arcs) → Do 7, A15, A17, D-LIB16-SIZE; #290 6340075388 and 6340849204 (D-LIB8-shrug hold with the LIB-ZOOM route; an undrawable fault held, never drawn empty) → D-LIB16-SIZE, -LOCK and S1.
- Loosening: none. No check, envelope or flag changes. D-LIB16-SPLIT and -SCRATCHIDS take the stricter reading. D-LIB16-TEMPO follows the card's own up, down and pause. D-LIB16-PILOTB is the one reading of a plan line (6.1:694); it is grounded in the anchor rule and the LB2 precedent, and it keeps pilot B's answer as a sheet and merge gate. If the supervisor rejects that reading, this card's status becomes "Blocked on: pilot B's owner answer (LIB-11 Do 10)".
- Every acceptance item has a mutation or, for the process item A1, a recorded check. A12 relies on the others' mutations; A13 and A14 on their plants.
- Buildable: every input exists on main (the 8's specs, PRIMITIVES with `poly` and `chestPress`, eq/parts.mjs), at `a8e66f32`, or at #274 `a6f4bd07` (git show). Nothing waits for an unmerged head except a held row's zoom plate (LIB-ZOOM), which is outside the start.
- Status `ready`: nothing blocks the start. The lane slot (3 of 4 active now) is named in 'LIB-16 start'.

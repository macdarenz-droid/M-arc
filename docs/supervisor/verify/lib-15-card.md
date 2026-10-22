Card LIB-15: LB5 plates, build-ahead, H slice only, 9 ids (2026-10-22; status `ready`; rulings D-LIB15-* recorded below). LB5's 2 P rows (pilot A reuse) and 8 T rows are not in this card (section "LB5 ids"); they go in a later card. The ship phase (layers, pin, button) is a later card.

No owner item blocks the start. All 9 cards have tempo seconds, so D-LIB14-NOSECS holds none of them (D-LIB15-SECS).

id: LIB-15
model: claude-opus-5-5 (plates, a composer and the anchor and flag calls are judgement work, plan 3.1)
mode: auto
title: 'Builder: LIB-15 LB5 H plates'
branch: claude/lib-15-lb5 (new; no such branch on origin at 2026-10-22 ~11:20 UTC). Your first push opens draft PR 'LIB-15 (build-ahead): LB5 H plates, nothing ships'.
slot: plan 7 orders 15 (LIB-15, LB5a triceps) and 16 (LIB-16, LB5b curls) (LIBRARY-HOWTO-ARCHITECTURE.md:812-813 @ `b41ac833`). This card draws the H rows of both halves ahead (D-LIB15-SCOPE) and never merges as this card. The ship cards merge after LIB-14 (#289), which follows item 14 (#274) of the owner's checklist (HANDOVER 8.0o D :909-923 @ `a2375fb1`).

base: the latest origin/main when the session starts (`5158609c`, LIB-7 #193 on top of train 33, or later), never an unmerged head.
- Every main line number cited here was read at `5158609c`. Re-read each one on your start head, and use the line you find there.
- On main at `5158609c`: LIB-3c (qa/param-ranges.mjs and .json, the child proof), VITEST-RPC, LIB-5 Do 9's back box, LIB-6 and LIB-6-PM, LIB-7 (#193: hands/hand-curl.mjs, hand-ez.mjs, hand-rope.mjs, hand-d-handle.mjs), and the `rope` composer (tools/plates/library/eq/rope.mjs, LIB-25 `8480052d`; identical on #109 @ `ff7c5c4f`).
- Not on main: pilot A (#109), LIB-12 (#191), HT-11 (#273), LB1-LB4 (#245, #265, #274, #289), LIB-ZOOM (#279), LIB-5v (#282) and LIB-7b (#284).
- Research head: 'LB5 research head 3812989f59c000705731f7944d7a1a275e86045d' on claude/libht-research (link it in the PR body). It holds the LB5 merge `befca2cd` (#286: LR-29 VALID on all 16, R-LB5-1..7 applied and rechecked; lb5-research-verify.md, docs/research/howto/verify/lb5.md), then LB6 (#287). The 9 cards and quotes are byte-identical at `befca2cd` and `3812989f` (checked).
- Copy LB3's build.mjs, qa.mjs and test patterns with `git show a6f4bd07:<path>`: #274's head where all 7 drawn LB3 plates are approved (lib4-cards 31). It holds tools/plates/library/lb3/{build,qa}.mjs and tests/howto/lb3-plates.test.ts. Never import anything under lb2/, lb3/ or lb4/.
- Where the plan (claude/howto-options @ `b41ac833`) differs from lib4-cards sections 12-31 or the D-LIB15-* rulings, those win.
- Merge origin/main into this branch, with a merge commit, each time pilot A (#109), LIB-12 (#191), HT-11, LB1-LB4, LIB-ZOOM, LIB-5v or LIB-7b lands. The steps that need them wait (build_prerequisites).
- Never merge an unmerged head. Read them with `git show <sha>:<path>`. To render a pilot A plate beside an LB5 plate, check that head out into a temporary `git worktree` outside the repo tree. Never commit it, and never merge it.
- Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on (plan 7 rows 15-16, :812-813): LIB-14, then LIB-15 for LIB-16. Both govern the merge only. Plan 6.3:781-784: a batch's dependency on the previous batch is checklist order only; its real prerequisites are plan 6.2's "Needs before it" (:714: "`rope`, `preacherPad`; curl and rope hands"). The anchor rule (plan 3.1:293-299) gates each plate going on a sheet, not H drawing. Per id (census `4a9fd86`, identical at `b41ac833`; anchors from plan 2.1-2.2):
- overhead_cable_triceps_extension: census closest lat_pulldown (the 8). The `rope` composer's anchor rope_triceps_pushdown (pilot A; plan 2.1:135). The standing overhead class anchor barbell_overhead_press (pilot A; plan 2.2:163; census tags stand and overhead).
- dumbbell_overhead_triceps_extension: barbell_overhead_press (as above); the engine dumbbell anchor dumbbell_biceps_curl (pilot A; plan 2.2:162); the split anchor reverse_lunge (D-LIB15-SPLIT).
- cross_body_hammer_curl: dumbbell_biceps_curl; the engine front-view anchor upright_row (pilot A; plan 2.2:161; census view front); the drawable-fault convention (D-LIB15-XBODY, D-LIB15-F7).
- cable_curl: census closest lat_pulldown (the 8).
- bayesian_cable_curl: lat_pulldown; the split anchor reverse_lunge (plan 2.2:155; census poses stand and split, 9 users; D-LIB15-SPLIT).
- preacher_curl: census closest machine_chest_press (the 8); `preacherPad`, single use, its own anchor (plan 2.1:141); EZ bar under D-LIB10-NOTE Q3 (D-LIB15-PREACHER).
- incline_dumbbell_curl: dumbbell_biceps_curl; pilot A's `inclineBench` (anchors incline_dumbbell_press and dumbbell_shoulder_press, plan 2.1:134); the incline class anchor incline_dumbbell_press (plan 2.2:158; 4 users); the drawable-fault convention (D-LIB15-INCLINE, D-LIB15-F7).
- concentration_curl and wrist_curl: dumbbell_biceps_curl; wrist_curl also the drawable-fault convention and the small-motion zoom (plan 1:89-94; D-LIB15-WRIST, D-LIB15-F7).
The yes these need is pilot A's plates pinned on main with the approvals D-LIB-O5 allows (lib4-cards 14.8 point 5) and the owner's named answers on the pilot A sheet. The owner said "Pilot a ok" (10-19 12:10, #109 6266791221): the 13 non-held plates are approved, F1-F4 and F7 as named exemptions, and the held plates stay held (HANDOVER:1422 @ `a2375fb1`). So rope_triceps_pushdown, barbell_overhead_press, dumbbell_biceps_curl, upright_row and dumbbell_shoulder_press have his yes. incline_dumbbell_press (Mistake arch does not read, lib4-cards 21.6) and reverse_lunge (D-LIB8M-NOSTRIP) are held (pilot-a/plates.json @ `ff7c5c4f`). Pilot A is not pinned on main yet (PIN GO waits for LIB-7b, LIB-12 and its R8 panel; HANDOVER 8.0o C, #109 row).

build_prerequisites (the supervisor posts each on the PR or on claude/sup-lib4-cards, or sends it to your session while no PR exists. If one is missing when you reach its step, go on with any other permitted step; set WAITING only when none is left, per D-LIB-LANE-ACTIVE):
- To start: 'LIB-15 start', which names the live active-builder count and LIB-15's place in the freed-slot queue. The research head (base) and the rulings D-LIB15-AHEAD, -SCOPE, -SECS, -CLONE, -INCLINE, -SPLIT, -XBODY, -F7, -WRIST, -PREACHER, -VLINE, -SLICE and -ANCHORS are recorded on this card.
- At start: Do 1, Do 4 (preacherPad), Do 5, Do 6 a, and the H slice (Do 2) with its drawn-item tests. Copy pilot A code with `git show` from #109 @ `ff7c5c4f`, or a later #109 head the supervisor names. Copy the 8's code from tools/plates/vendor/exercises/{lat_pulldown,machine_chest_press}.mjs on main. Import eq/rope.mjs and eq/parts.mjs from main.
- incline_dumbbell_curl's spec, render and rows: pilot A (#109) on main and merged in (D-LIB15-INCLINE). Until then it is in the note only.
- Do 6 b: the note's tempo map, pose map and fault→key map ruled on the PR ('LB5 NOTE RULED'; 13 Q3; 13 Q1(a); D-LIB8M-TEMPO). For cross_body_hammer_curl, also the research head that fixes its `drawable` field (D-LIB15-XBODY).
- Bulk (Do 7): 'LB5 BULK GO', after the supervisor's slice look.
- Do 8 evidence: 'CARD FIELDS VERIFIED @ <sha>' for the cards it covers (lib4-cards :1143: after the fields are written, before QA).
- Do 9 (the critic run) and every approval: the ready line, and D-LIB15-ANCHORS.

merge_prerequisites: never merges as this card. The ship cards merge these 9 only when all of these hold:
- Every lower-numbered item on the owner's checklist has merged (AGENTS merge rule): HANDOVER 8.0o D items 1-14, then LIB-14 (#289); for the curls (LB5b), the LB5a ship card too (plan :813).
- Pilot A's yes, as defined in depends_on, is on main: rope_triceps_pushdown (the `rope` anchor) pinned before overhead_cable_triceps_extension is approved, and barbell_overhead_press, dumbbell_biceps_curl and upright_row pinned for their users (anchor rule, plan 3.1:293-299: the anchor of each shared rig and of each pose class with 3 or more users).
- Every D-LIB4-ENTRY condition holds (plan 5.4:633-634; lib4-cards :1055-1070). The records show them met at `5158609c` (lib-14-card.md:45 lists them). The ship card re-checks all of them on its head.
- The shared-key clause (lib4-cards :664): four rows ship a close-up from a key other ids share (main @ `5158609c`: hand-curl.mjs:16 incline_dumbbell_curl and :20 cross_body_hammer_curl on the dumbbell variant; :22 cable_curl on the bar variant; hand-ez.mjs:17 preacher_curl). LIB-7b (#284) is on main and that proof passes before any of them ships a close-up. The other five ship with no close-up: hand-rope.mjs:32, hand-d-handle.mjs:22 and hand-curl.mjs:26-27 list overhead_cable_triceps_extension, bayesian_cable_curl, concentration_curl and wrist_curl as GAPS; dumbbell_overhead_triceps_extension goes to LIB-12's cupped key (hands/DESIGN.md:102 on main), where #191 lists it as a GAP (hand-cupped.mjs:30 @ `8bea5afc`).
- The back box: on main (trains 32 and 33). overhead_cable_triceps_extension (redFlags shoulder, back, elbow) and dumbbell_overhead_triceps_extension (elbow, back, shoulder) list 'back'.
- LIB-5v (#282) is on main before preacher_curl ('Machine / EZ Bar') or wrist_curl ('Dumbbell / Barbell') ships (D-LIB5-VARIANT 6; D-LIB13-VLINE, lib-13-card.md:400; D-LIB15-VLINE).
- incline_dumbbell_press is redrawn, owner-approved and pinned before incline_dumbbell_curl goes on a sheet (D-LIB15-INCLINE). reverse_lunge is redrawn, owner-approved and pinned before bayesian_cable_curl or dumbbell_overhead_triceps_extension goes on a sheet (D-LIB15-SPLIT). Otherwise each rolls (plan 3.5:376).
- preacher_curl, the preacherPad anchor, is approved on the LB5 sheet with the composer flagged as a new rig. If it reuses skull_crusher's EZ plate size as a convention, skull_crusher is pinned first (D-LIB10-NOTE Q3 condition 2; D-LIB15-PREACHER).
- The F7 ids (cross_body_hammer_curl, incline_dumbbell_curl, wrist_curl) and wrist_curl's F1, if ruled, each have the owner's named yes on the LB5 sheet (plan 3.3:337-339; D-LIB15-F7, D-LIB15-WRIST).
- A calibrated critic has scored R8 and R9 at 4 or more for every LB5 plate that ships (13.1). R8 is null for an id with no close-up.

Rulings this card relies on. These are summaries; where the posted text differs, the posted text wins.
- D-LIB9-ENGINE: specs import only tools/plates/library/engine.mjs (the vendor engine). poly and flat palm are allowed. Nothing imports tools/plates/layers/.
- D-LIB9-AUTHORQA: candidateOf(id, { all, authoring: true }) (candidate.mjs:84). Its default path stays unchanged.
- D-LIB9-CARDFIELDS (lib4-cards :1135-1147), with 13 Q1 (topFault) and Q3 (tempo map):
  - drawable:true: topFault is plate.mistake's key, and the spec's first tell carries it;
  - drawable:false: topFault is the ruled key of the card's named top fault, which differs from the drawn key, and F7 stays raised (D-LIB8M-TF1 4);
  - tempo: D-LIB8M-TEMPO (lib4-cards :3293-3303). The concentric takes up, the eccentric takes down, Hold takes pause right after the concentric only if pause > 0. Any other static phase is a constant only with a quote that states its seconds. A range is the quote's string. No Rest.
- D-LIB8M-FACTS, with 22's exact scope (D-LIB10-CF1), and D-LIB13-FACTS2 / D-LIB11-FACTS2 (contact facts; PANELS.md section 3, `{kind:'contact', landmark, pose, cardPose, claim}`). An equipment number becomes a fact only when the plate shows it with a measure callout. A quoted range is its midpoint with a note only when it is at least twice H6's tolerance wide (lib-13-card.md:54).
- D-LIB5-TEMPO8 rules 10-15 (14.7); D-LIB9-FACTPOSE: a setup instruction states the start pose only; a contact is never carried to another pose by inference.
- D-LIB9-F5 (14.4): `exemptions: ['F5']` only for the selected Mistake tell in Midnight at exactly 3.57.
- D-LIB9-CLONE (13.2): copy, never import a pilot A or vendor spec; every copied root finder throws on a bracket with no root; re-derive each bracket and record what it solves to.
- D-LIB8M-CARDTRUE and D-LIB8M-PAGESET: the plate follows the card. A plate with no card-true drawing that passes every hard check, or that fails its last critic run, is HELD: stage review, off the page and the rows file, on the follow-up list, reported. A held id gets no row.
- D-LIB8-shrug and Q-D5-3: a right pose or a fault is never moved or exaggerated off its card to pass a check.
- D-LIB10-NOTE (#265 6255216039): Q2 point 2, pilot A's composers are never edited or forked (lib-13-card.md:176); Q3, the EZ bar.
- D-LIB10-BENCH-H and D-LIB10-BBELBOW: if one card's facts cannot all hold on the body at once, stop and post the per-card conflict; never tune a value off the card.
- D-LIB10-SKULL1 and Q-D5-4: 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key. A one-tell plate needs a per-id ruling. (Every one of the 9 cards has 2 tells at `3812989f`.)
- D-LIB13-VLINE (lib-13-card.md:400): a variant line is shown only for an id whose exercises.json equipment names two kinds.
- D-CRITIC-CAL3 (13.5), with 13.7's facts diff and 13.6's segment-length rule; D-LIB10-PANEL1 (24). The method is PANELS.md (claude/sup-handover-1445 @ `a2375fb1`) sections 1, 3, 5 and 7.
- D-PILOTA-R5 and D-LIB8M-CARRY: an approval counts only for the head it ran on.
- D-LIB-LANE-ACTIVE (lib4-cards :1023-1041): at most 4 active LIB builders. You hold a LIB drawing slot from your start. WAITING only when no permitted step is left; then you hold no slot.
- D-LIB9a-HOWTOID: a How-to source here holds only `research` and `id`.
- LR-31, LR-33 (RULINGS.md:38, :40 @ `3812989f`), LR-36 and D-SUP-PROTECT (#287 6334491971): research applied them, and the LR-29 verify passed. This card never edits a card's research fields.
- D-LIBHANDS-COUNT (20): binds only a card that adds hand modules. LIB-15 adds none.
- D-LIB14-NOSECS (lib-14-card.md:288-294): applies to no row here at `3812989f` (D-LIB15-SECS).
- D-LIB15-*: recorded below ("Rulings recorded").

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Every plate meets the bar of the 8, pilot A and LB1-LB3: every plan 3.4 item at 4 or more (R8 and R9 stay unscored here, as in 13.1).
- No check, envelope, threshold, rubric item or test is relaxed, skipped or exempted to save time. A plate below the bar is redrawn, and you report the time it cost.

shared-file owners:
- None of the AGENTS shared add-only files is touched. scripts/screenshot-gate.mjs, tests/theme.test.ts and src/ui/styles.css on main name none of the 9 ids (checked at `5158609c`).
- tools/plates/vendor/** and tools/plates/layers/**: read only.
- Main's composers eq/rope.mjs and eq/parts.mjs may be imported, never edited. Pilot A's files (#109, eq/inclineBench.mjs, eq/safetyArms.mjs and eq/pecDeck.mjs included), LB1's (#245), LB2's (#265), LB3's (#274), LB4's (#289), LIB-ZOOM's (#279), LIB-12's hands/** (#191) and LIB-7b's (#284): read only. Specs are copied, never imported.
- tools/plates/library/hands/** on main (LIB-7's keys, claims.json, census-scope.json): read only. claims.json pins six claim texts of these cards (cable_curl c1, c9; cross_body_hammer_curl c1; incline_dumbbell_curl c11; preacher_curl c1, c8) at research `95342b1`; all six equal `3812989f` (checked 2026-10-22). Never change a claim to fit; report if a later named head changes one.
- candidate.mjs, registry.mjs, derive.mjs, plates-page.mjs and qa/** (qa/param-ranges.json included): untouched.
- docs/research/howto/cards/** and quotes/** belong to claude/libht-research. Here they are byte copies of the 9 LB5 H cards from the research head, plus their three keys. None of the 9 exists on main at `5158609c`. #286 is merged into claude/libht-research (`befca2cd`), so the supervisor merges the field commit back after 'CARD FIELDS VERIFIED'.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. Your first push carries the design note and opens the draft PR. Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full qa.mjs run) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`, and poll its log. A stopped run is never evidence. Keep a send_later check-in every 20 minutes while one runs (idle containers are reclaimed).
- A CI failure on `[vitest-worker]: Timeout calling "onTaskUpdate"` is a real defect (D-LIB8M-RPC (b)); VITEST-RPC is on main. Keep each test's child processes well under vitest's 60 s limit. Report such a red on the PR; never re-run to green.

hard card: the design note and the H slice come before any bulk drawing.

outcome: LB5's 9 H plates (8 at once, incline_dumbbell_curl after pilot A is on main), the `preacherPad` composer and the 9 cards' machine fields exist on this branch at stage drawing or review.
- Every plate in lb5/rows.json passes every LIB-3 hard check (runQa, node and browser halves), PQ-H10 included.
- The raised flags are exactly the ruled expected set.
- The cards' machine fields have the content verifier's VALID verdict.
- A plate that cannot pass card-true is held and listed, never exempted.
- Nothing ships: none of the 9 gets a button, pin or batches/ row; no layers page; no app change.
deliverable: the specs, the `preacherPad` composer, rows, tempo map, LB5 plates-page build and QA scripts, design note and tests.
evidence: the per-id QA table at the head sha; the plates-page sha256 from two identical builds; the unit tests with their mutations; the recorded diff checks (A9); the content verifier's verdict; then the critic's verdict.
finish:
- 'LB5 PLATES READY @ <sha> (plates page <sha256>)' is posted for the drawn rows whose cards are verified, with incline_dumbbell_curl listed as waiting for pilot A on main, and cross_body_hammer_curl as waiting for F-LB5-1 if it has not landed;
- the critic run is VALID under PANELS.md section 1 with every plate on the page at the bar, or each failing plate has had its one fix round and recheck and is held;
- the supervisor's per-exercise approvals are recorded on the PR (head-only).
- After pilot A is on main and merged in, and on 'LIB-15 resume': incline_dumbbell_curl is drawn, joins rows.json and the page, and gets its CARD FIELDS (focused re-verify), QA and critic; then READY is posted again for all 9.
Then stop; the ship cards take over the branch. You will notice: nothing in the app.
forecast [est]: about 45 Opus-hours at plan 9's pace (:894-897): 9 H plates × 4 h; the `preacherPad` composer 2 h; QA and critic 0.75 h per id (about 7 h). The `rope` is on main, so it costs nothing here. incline_dumbbell_curl's share (about 5 h) waits for pilot A on main; its cost moves, it does not shrink. LB1 needed 4 review and 4 critic rounds; LB3's first panel passed 4 of 7, its recheck 5 of 7, and two focused rounds took it to 7 of 7 (lib4-cards 29-31). So allow up to about twice that. The calendar depends on a free lane slot, pilot A's merge (incline only) and its pin (sheets only), which this card cannot forecast.

LB5 ids (plan 6.2 :714 and :739-743 @ `b41ac833`; census docs/howto/library/inputs/census.json @ `4a9fd86`, identical at `b41ac833`; card facts below read at the research head `3812989f`; re-read them there):
- The row "LB5 | Arms (PR a: 6 triceps; PR b: 13 curls) | 19 | 2 | P2 T8 H9" (:714). LB5a (:739-740): triceps_pushdown (P:PUSHDOWN, pA), rope_triceps_pushdown (T, pA), straight_bar_triceps_pushdown (T), single_arm_triceps_pushdown (T), overhead_cable_triceps_extension*, dumbbell_overhead_triceps_extension*. LB5b (:741-743): dumbbell_biceps_curl (P:CURL, pA), alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, reverse_curl (T), cross_body_hammer_curl, cable_curl, bayesian_cable_curl, preacher_curl, incline_dumbbell_curl, concentration_curl, wrist_curl. Tier A (*) is 2, both H.
- The 9 H rows are the ids with no P or T mark (D-SUP-LB5-ORDER, lb5-research-card.md:28). Every pick and tempo below matches the LR-29 verify (lb5-research-verify.md:33-50). Census: view, poses, equipmentGaps, closest.
  - overhead_cable_triceps_extension (A; side; stand, overhead; gap rope; closest lat_pulldown): back to the low pulley, one step forward, slight lean from the hips, upper arms by the ears, rope behind the head (start, c1, c3-c5); end arms straight overhead, elbows not locked, upper arms by the ears (c6, c7). Mistake: the lower back arching as the rope is pushed overhead (c9), drawable true. Tempo up 1, down 2, pause 1 (c21 WEAK convention; c13's bottom pause named in text). variantLine (pulley height): a drawing note, never shown (D-LIB15-VLINE). Hand: rope GAP.
  - dumbbell_overhead_triceps_extension (A; side; stand, overhead; closest dumbbell_lateral_raise): top start, split stance (c1), braced, arms vertical, dumbbell hanging vertically over the head (c3, c4); end elbows bent to about 90° with the dumbbell behind, not touching, the head, upper arms vertical (c5, c6). Mistake: the back arching as the dumbbell is pressed up (c9, c12), drawable true. Tempo 1/2/1 (c18). variantLine (seated version): a drawing note (D-LIB15-VLINE). Hand: cupped, GAP on #191.
  - cross_body_hammer_curl (C; front; stand; closest dumbbell_lateral_raise): standing, dumbbells in front, palms facing the body (c1, c14); end the working dumbbell raised in an arc to near the opposite shoulder, elbow in place, wrist straight, shoulders level (c2, c5, c7). Top fault (handlingMistakes[0]): the arm fully straight at the bottom (c15), which the front view cannot show. plate.mistake: the wrists twisting off neutral (c7, c5); field drawable true, but its rankNote says "drawable is false" (D-LIB15-XBODY). Tempo 1/2/1 (c11). Hand: curl, dumbbell variant, neutral.
  - cable_curl (C; side; stand; closest lat_pulldown): a step back from the low pulley, straight bar, palms up, elbows slightly bent at the bottom and close to the torso (c1-c3, c9, c13); end elbows fully bent, bar near the shoulders, upper arms still or slightly forward (c3, c8, c9). Mistake: the arms fully extended at the bottom (c13), drawable true. Tempo 1/2/0 (c10). variantLine (single handle): a drawing note (D-LIB15-VLINE). Hand: curl, bar variant.
  - bayesian_cable_curl (C; side; stand, split; closest lat_pulldown): facing away from the low pulley, one step forward, slight forward lean, the working arm straight and behind the torso, no more than about 45° behind vertical (c1-c4); end elbow bent, handle toward the shoulder, upper arm unchanged (c4, c5, c7). Mistake: the upper arm swinging forward (c5), drawable true. Tempo 1/2/0 (c12). Hand: d-handle GAP.
  - preacher_curl (C; side; seat; gap preacherPad; closest machine_chest_press): seated, chest and upper arms on the pad, pad top under the armpits, elbows nearly straight, EZ bar underhand, wrists straight (c1, c2, c7, c8); end elbows bent, bar near the shoulders, upper arms still on the pad (c4). Mistake: the upper arms lifting off the pad as the body heaves the bar up (c5), drawable true. Tempo 1/2/0 (c14). variantLine shown ('Machine / EZ Bar'). Hand: ez key, curl variant.
  - incline_dumbbell_curl (C; side; incline; gap inclineBench; closest dumbbell_lateral_raise): seated back on an incline of about 45-65° (c1), arms hanging straight behind the torso line, palms forward, wrists straight (c2, c3, c11); end elbows bent without drifting forward, upper arms behind the torso (c3, c4). Top fault: the wrists bending (c11). plate.mistake: the elbows drifting forward (c4, c3), drawable false. Tempo 1/2/0 (c12). Hand: curl, dumbbell variant, under.
  - concentration_curl (C; side; seat; closest dumbbell_lateral_raise): seated on the bench edge, knees wide, hinged forward, the back of the working upper arm on the inner thigh, upper arm near vertical, arm straight (c1, c2, c8); end elbow bent, triceps still on the thigh (c6, c7). Mistake: the elbow wedged into the knee instead of the upper arm on the inner thigh (c4, c3), drawable true. Tempo 1/2/1 (c12). Hand: curl GAP.
  - wrist_curl (C; side; seat; closest dumbbell_lateral_raise): seated, forearm on the thigh, the hand hanging past the knee, palm up, closed grip (c1, c2, c5); end wrist curled up, grip closed, forearm still (c1, c3-c5). Top fault: the weight rolling to the fingertips (c5). plate.mistake: the arms extending or the body leaning (c3), drawable false. Tempo up 2, down 2, pause 0 (c10). variantLine shown ('Dumbbell / Barbell'). Hand: exempt GAP.
- Not in this card (10): the 2 P rows (triceps_pushdown, dumbbell_biceps_curl) and rope_triceps_pushdown are pilot A plates, reused as pilot A pins them (D-LIB10-PA's pattern); the 7 other T rows need their template parent pinned, because the byte proof needs the parent's pin (D-LIB10-TEMPLATES, lib4-cards :3161-3164), and pilot A is not on main.
- Tempo: every one of the 9 has up and down in seconds (cards at `3812989f`; lb5-research-verify.md:35-43). So every drawn row has a tempo strip (D-LIB15-SECS).
- Composer (census gap): `preacherPad` (preacher_curl, single use; plan 2.1:141). It lands in this PR, as a composer lands in its anchor's PR (plan 2.1:129-130). `rope` is on main (eq/rope.mjs). `inclineBench` is pilot A's (#109 only). Everything else is a vendor primitive (cableColumn, pulley, cable, latBar, vHandle, stack, bench, seat, backPad, barbell, dumbbell with its `axis` option, floor; equipment.mjs:304 lists the 20) or eq/parts.mjs on main.
- Scratch fixtures on main name none of the 9 (tools/plates/library/ci/** and tests/howto/library-ci.test.ts at `5158609c`). src/howto/coverage.ts:51-52, :83-88, :90 lists them at stage "queued"; src/** is reserved.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On claude/sup-lib4-cards: this card; lib-14-card.md and lib-13-card.md (the closest models) and lib-13-critic.md; lib-10-card.md; lib-zoom-card.md; lb5-research-card.md and lb5-research-verify.md; lib4-cards.md sections 12 items 2, 4, 9; 13 (Q1-Q5, 13.1-13.8); 14.4, 14.7, 14.8; 15 (items 3-5) and 15.1; 16 (D-LIB8M-TEMPO, -NOSTRIP, -CARDTRUE, -PAGESET, D-LIB8-shrug at :1596-1690); 20; 21-31 (21.6 for incline_dumbbell_press).
- On claude/sup-handover-1445 @ `a2375fb1`: docs/supervisor/verify/PANELS.md; HANDOVER 8.0o C-E and 8.0p.
- On #265: D-LIB10-NOTE (6255216039), Q2 and Q3 (the EZ bar); lb2/DESIGN.md @ `2dcbac15` :141-142 (EZ) and :266-269 (ids waiting for pilot A's inclineBench).
- The plan @ `b41ac833`: 1 (:80-96, hold, drawable-fault, small-motion zoom and airborne conventions); 2.1-2.2 (:120-165); 3.1 (:267-304); 3.2-3.5 (:306-408); 6.1 (:668-704); 6.2 (:706-743); 6.3 (:768-784); 7 rows 14-16 (:811-813); 9 (:890-916).
- Pilot A @ `ff7c5c4f`: tools/plates/library/DRAWING-GUIDE.md; specs rope_triceps_pushdown, dumbbell_biceps_curl, barbell_overhead_press, upright_row, dumbbell_shoulder_press, incline_dumbbell_press; eq/inclineBench.mjs; pilot-a/plates.json; pilot-a/tempo.json.
- LB3 @ #274 `a6f4bd07`: lb3/DESIGN.md, lb3/build.mjs, lb3/qa.mjs, eq/landmine.mjs and eq/romanChair.mjs (composer pattern), tests/howto/lb3-plates.test.ts.
- LB2 @ #265 `2dcbac15`: specs/skull_crusher.mjs (the EZ bar end-on, EZ_PLATE_D :49).
- LIB-ZOOM @ #279 `754176a0`: its design note, for wrist_curl only (D-LIB15-WRIST).
- Main: derive.mjs (PARAMS :4-12, with camera.maxScale :5; paramProblems; derive); vendor/engine/plate.mjs:81-95 (the engine reads only `spec.camera` of the PARAMS paths) and renderPlate (:68); vendor/exercises/lat_pulldown.mjs and machine_chest_press.mjs; candidate.mjs :73, :76-131, :95; registry.mjs :30-56; qa/node.mjs (:93, :156, :158, :176, :337-349); qa/envelope.json (traceLenMin 22.11, deviationMin 11.39); tools/plates/golden.mjs:116; vendor/artifact/build-page.mjs:149-153, :174; eq/rope.mjs; eq/parts.mjs; hands/DESIGN.md:71-106 and the four key modules named in merge_prerequisites.
- Research @ `3812989f`: cards/ and quotes/ for the 9, CARD-V2.md (:36 drawable; :73), RULINGS.md (LR-31, LR-33, LR-36), verify/lb5.md.
- Census @ `4a9fd86`: the 9 rows (closestApproved, poses, equipmentGaps, view, handArchetype) and aggregates.byPoseTag (split, incline, overhead).

design_reference: DRAWING-GUIDE.md; the 8's lat_pulldown and machine_chest_press; pilot A's approved dumbbell_biceps_curl, rope_triceps_pushdown, barbell_overhead_press, upright_row and dumbbell_shoulder_press; LB1-LB3's approved plates (LB3's one_arm_dumbbell_row for a drawable-false Mistake); the plan 3.4 rubric; the census views.
connectivity: none. Node and local Chromium (/opt/pw-browsers/chromium) only. Specs and composers read no files and fetch nothing. Facts come only from the copied cards and quotes. No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/specs/<id>.mjs for each drawn id (row src 'library/specs/<id>.mjs');
  - tools/plates/library/eq/preacherPad.mjs, plus any composer the ruled note names, one new file each;
  - tools/plates/library/lb5/{rows.json,tempo.json,build.mjs,qa.mjs,DESIGN.md,cards.sha.json}. rows.json holds batch 'LB5', censusRef 4a9fd86, the drawn non-held ids only, view per row, mode 'H', and stage drawing or review only;
  - tools/plates/library/howto/lib_<id>.howto.mjs for the 9 (`research` and `id` only);
  - docs/research/howto/cards/<id>.json and quotes/<id>.json for the 9: byte copies, then the three keys on cards/;
  - tests/howto/lb5-plates.test.ts (node only).
- docs/COACHING-DECISIONS.md: append only (10 open PRs also append: #92, #109, #188, #191, #265, #271, #274, #282, #284, #289; keep both sides).
- Plates pages, screenshots and QA reports are not committed. build.mjs and qa.mjs write to a temp directory and print the sha256 and the table.

reserved_paths:
- tools/plates/library/batches/** and tests/howto/golden/**.
- src/** (every generated file and src/howto/coverage.ts included), tools/plates/gen/** and tools/plates/generate.mjs.
- In tools/plates/library/: {derive,candidate,registry,plates-page,build-page,build-layers-page,layers-spec,inputs-closure,batch-golden,engine,bodies,ids-encoding,ids-node,chunk-set,fidelity}.mjs, MANIFEST.json, and the folders qa/, hands/, render/, pages/, pilot-a/, lb1/, lb2/, lb3/, lb4/, fidelity/, ci/, shared/, lint/, research/, scale/, templates/ and budgets/.
- Existing eq files and specs (main's, pilot A's, LB1's, LB2's, LB3's, LB4's), eq/rope.mjs and eq/inclineBench.mjs included.
- The other 10 LB5 ids' specs, How-to sources, cards and quotes.
- tools/plates/vendor/**, tools/plates/layers/** and tools/plates/golden.mjs.
- docs/research/howto/*.json and docs/research/howto/shared/**.
- tests/howto/library-lint.test.ts, tests/howto/library-ci.test.ts, tests/library/**, scripts/**, tests/theme.test.ts, src/ui/styles.css, .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The paths of HT-11, LIB-12-FIX, LIB-ZOOM, LIB-5v, LIB-7b, LIB-7c, LIB-13, LIB-14, the LIB-8 merge card and the no-seconds strip card.

Do:
1. The design note, in lb5/DESIGN.md, posted on the draft PR with your first push as 'LB5 NOTE READY @ <sha>'. Wait for 'LB5 NOTE RULED' before Do 6 b. One row per id (incline_dumbbell_curl included, marked "waits for pilot A on main"), plus a line each for the 10 LB5 ids not drawn here, with their reason:
   - mode: H for all 9 (plan 6.2 :714, :739-743). List per id what falls outside PARAMS (derive.mjs:4-12), citing the lines.
   - the clone source per D-LIB15-CLONE (the 8's spec, or the pilot A spec and head), the census closest, and each anchor's approving sha.
   - the composer: `preacherPad` (user and anchor preacher_curl; single use). Its pad angle and height, the seat and the bar's plate size go under "Unsourced numbers" (13.3 must-fix 14). The EZ bar per D-LIB15-PREACHER.
   - pose-class and convention anchors each id uses (depends_on), with D-LIB15-SPLIT's two ids and D-LIB15-INCLINE.
   - the expected flags: F5 on every plate (14.4); F7 on cross_body_hammer_curl, incline_dumbbell_curl and wrist_curl (D-LIB15-F7); F1 on wrist_curl only if D-LIB15-WRIST's zoom route is ruled; any other with its reason.
   - the R10 items each tier-A card requires (overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension).
   - the hand key per id (merge_prerequisites lists them). Build none.
   - the census view (cross_body_hammer_curl front; the other 8 side).
   - the tempo map, for the supervisor to rule (13 Q3; 14.7; D-LIB8M-TEMPO): per id, concentric up s, Hold pause s only if pause > 0, eccentric down s, in the form of pilot A's rows (pilot-a/tempo.json @ `ff7c5c4f`; dumbbell_biceps_curl.mjs:145 'Curl 1, Lower 2'; rope_triceps_pushdown.mjs:176). No Rest. A bottom pause named only in tempo.text (overhead_cable_triceps_extension's c13) is never a phase without its seconds. Never add seconds.
   - a pose map wherever the drawn start differs from the card's plate.start (13 Q2 (b)): for example dumbbell_overhead_triceps_extension's card start is the top. The Mistake is drawn against the end pose (13 Q2 (f)).
   - the fault→key map (13 Q1(a)): each card's plate.mistake → the key its first tell carries; for the three F7 ids, also the ruled key for the top fault (handlingMistakes[0]), which must differ from the drawn key.
   - the facts plan under D-LIB8M-FACTS, 22's scope and D-LIB13-FACTS2's contact facts. For example dumbbell_overhead_triceps_extension's end elbow about 90° (c5); bayesian_cable_curl's upper arm no more than about 45° behind vertical (c2, c3); incline_dumbbell_curl's bench 45-65° (c1, an equipment number: a fact only with a measure callout); the contacts of preacher_curl (upper arms on the pad, c4) and concentration_curl (triceps on the inner thigh, c7).
   - every number the card does not give, for the spec headers' "Unsourced numbers": pulley heights, bar and dumbbell sizes, bench and seat heights, the pad geometry.
   - a PQ-H3 estimate per Mistake against deviationMin 11.39 px and per Trace against traceLenMin 22.11 px (qa/envelope.json). Small ones may be cross_body_hammer_curl's wrist twist seen front-on, cable_curl's last few degrees of elbow extension and wrist_curl's hand travel [unverified until drawn]. A too-small fault is reported with its card-true size; never enlarged (Q-D5-3).
   - Risks.
2. The H slice (D-LIB15-SLICE), posted as 'LB5 SLICE READY @ <sha>'. Bulk starts only on 'LB5 BULK GO'.
   - overhead_cable_triceps_extension (tier A, the rope on main, the overhead class); preacher_curl with eq/preacherPad.mjs (the composer's anchor, the seat, the EZ bar); wrist_curl (small motion, drawable false); cross_body_hammer_curl (the only front view, drawable-fault).
   - Post 390 px renders in Paper and Silent Black beside the closest approved plate: lat_pulldown and pilot A's rope_triceps_pushdown and barbell_overhead_press (beside overhead_cable_triceps_extension); machine_chest_press (beside preacher_curl); dumbbell_biceps_curl (beside wrist_curl); upright_row and dumbbell_biceps_curl (beside cross_body_hammer_curl). Pilot A plates come from a temporary worktree. These are for the slice look only; the critic's references follow D-LIB15-ANCHORS. Add the unit tests, the two-build plates-page sha256 and the Do 8 QA table for the rows in rows.json.
   - Authoring QA runs now; it counts as evidence only after Do 6's verdict. Before Do 6 b, every drawn id shows H6:no-card and F7 'no card top fault'. These are expected.
   - The slice post shows A9 and every mutation red and then restored.
3. No D row. If the note finds a reason a row might meet the D test (plan 3.1:268-272), post it with evidence; the mode changes only by a new ruling.
4. The `preacherPad` composer, `(lm, ctx) => item[]` returning PRIMITIVES types only, in LB3's pattern (eq/romanChair.mjs @ `a6f4bd07`: existing primitives and eq/parts.mjs helpers). The pad is static, so no `poly` twin is needed (PQ-H9, plan 2.1:126-128); a moving part would need one. No file reads. A per-pose drawn-item test on the real spec (13.1).
5. The build and QA hook (copied from lb3/build.mjs and lb3/qa.mjs @ `a6f4bd07`). Both read lb5/rows.json through registry rows() (registry.mjs:30), with `batches` set to every batches/ file plus ['tools/plates/library/lb5/rows.json', <its data>], and pass that set as groupsConfig's and candidateOf's `all`. Never write under batches/.
   - build.mjs: builds the LB5 plates page on main's tools, from rows.json's ids only.
   - qa.mjs: runQa per id through candidateOf(id, { all, authoring: true }).
6. Cards (the 9, once):
   a. At start: copy the 9 cards and quotes byte for byte from the research head `3812989f` and commit them, with lb5/cards.sha.json holding the research head sha and each copy's sha256 (in the canonical form the test states).
   b. After 'LB5 NOTE RULED': add top-level plateFacts, tempo and topFault per D-LIB9-CARDFIELDS, 13 Q1, the ruled maps, 14.7's form rules and D-LIB8M-FACTS with 22's scope. Each value names the claim whose quote states it. No value comes from a spec. cards.sha.json keeps each card's sha256 without those three keys. cross_body_hammer_curl's keys wait for D-LIB15-XBODY's research fix. incline_dumbbell_curl's keys are written when it is drawn (its pose map and fact keys depend on its plate), with a focused re-verify (finish).
   - Post 'LB5 CARD FIELDS READY @ <sha>' and wait. The supervisor runs the blind verify of PANELS.md section 3 (one planted error, the pose map in rules.md, Q1's topFault checks; lib4-cards :1143).
   - Fix only what it names, re-run qa.mjs for the rows that changed (H6 must pass), and post 'LB5 CARD FIELDS FIX @ <sha>'. A focused re-verify with a new plant runs on the changed cards. 'CARD FIELDS VERIFIED @ <sha>' follows.
   - If the supervisor names a later research head that changes an LB5 H card (D-LIB15-XBODY's fix included): copy it again, re-apply its keys, update cards.sha.json. If a cited claim changed, the verifier re-runs for that card and its plate is QA'd again.
7. Draw the bulk on 'LB5 BULK GO', following DRAWING-GUIDE.md: dumbbell_overhead_triceps_extension, cable_curl, bayesian_cable_curl, concentration_curl; then incline_dumbbell_curl once pilot A is on main and merged in (D-LIB15-INCLINE). LB1-LB4's lessons, each with a drawn-item test where it applies (A15):
   - The Mistake reads as a pose outside the solid end figure: red parts clear it by at least 6 px, or are drawn as red dashed lines over it (13.1; 13.4 must-fix 1; 13.7). The fault part is drawn on top of anything that would hide it (lib4-cards 30-31, one_arm's R5).
   - 2-3 tells, each a visible sign of the card's one fault, the first carrying the ruled key (Q-D5-4; D-LIB10-SKULL1).
   - Callout boxes sit in open space; leaders meet their anchor from the open side. No leader runs within about 6 px of the Trace, a cable, a bar, the pad or the bench.
   - A cable runs from its pulley to the hands in every pose and never through the body or head (overhead_cable_triceps_extension's card: "draw it clear of the neck and head").
   - A hidden start part is redrawn as a dashed phantom (Q2 (c)). Ghosts follow the real joint path; a straight limb never bends between poses (13.3 must-fix 1, 3).
   - Tests assert on drawn items, never on the spec's own formula (13.1; 13.4 must-fix 3).
   - A cue table per id: the card's `what` and claim, the plate cue, the word count (Q-D5-6).
   - Card truth wins over a critic's fix (PANELS.md 1 point 5; D-LIB13-ONEARM). If one card's facts cannot all hold on the body at once, stop and post the per-card conflict.
8. QA (after the verifier's verdict on the cards it covers):
   - build.mjs builds the LB5 plates page twice, to a temp directory; the bytes must match;
   - qa.mjs runs runQa's node and browser halves (Chromium at /opt/pw-browsers/chromium) per id and prints the table: hard checks, raised flags (F5's element and value shown) and metrics.
   - A measured flag that differs from the ruled expected set is posted with its value and range, and ruled before READY. No flag is dropped or exempted.
9. Post the ready line with the per-id table. Then the supervisor runs the calibrated critic per PANELS.md section 1:
   - Anchors per D-LIB15-ANCHORS; a hidden anchor is never the visible reference. 13.7's facts diff runs before the round.
   - Two plants rebuilt on LB5 plates at the head, each on a different candidate and a named rubric item.
   - The brief carries 13.6's rule: any pose fix keeps the drawn segment lengths and states them.
   - Fix only what the critic names. A fix never edits a card. If a fix would break a hard check, a pinned test or a ruling, post the conflict with its evidence.
   - One fix round, then one fresh calibrated recheck on the changed plates. A plate that fails its recheck gets a second focused round only by ruling (D-LIB13-PANEL2), else it is held (D-LIB8M-CARDTRUE).

Acceptance (each mutation must turn red, then be restored; list each one in the PR with its red line):
- A1 The note and the slice are posted before the bulk, with a cited mode reason per id, and the bulk starts on its GO. Evidence: PR comment links. Recorded check (a process item, so no mutation): `git log --diff-filter=A` shows each bulk spec's first commit after the 'LB5 BULK GO' comment's time.
- A2 `preacherPad` uses PRIMITIVES types only. In every drawn pose (start, end, Mistake) the pad sits at one fixed place (±1 px), and preacher_curl's upper-arm contact holds where the ruled facts place it in the start and end poses (c4; D-LIB13-FACTS2), and is off the pad in the Mistake (c5). Mutations: {type: 'wedge'} turns H9.type red; the pad moved 2 cm in the Mistake is red; the upper arm moved 2 cm off the pad in the end pose is red.
- A3 Closures are pure and drawn by the vendor engine. For each id, closureOf passes on its spec, contains tools/plates/vendor/MANIFEST.json, has no path under tools/plates/layers/ and no specs/ file but its own. Mutations: readFileSync added to the composer makes closureOf throw; a spec importing tools/plates/layers/engine/body.mjs → red; a spec importing a pilot A spec → red.
- A4 For every id in lb5/rows.json, every PQ-H1..H10 check passes in runQa node and browser, and the raised flags equal the ruled expected set exactly. Mutations on one LB5 plate, each red: LIB-3's M1-M7 as named in qa/mutations.mjs; a colour literal (H2.colour); its F5 tell chrome changed so F5 reads 3.40 (in a temporary worktree, never committed); and on one F7 id in rows.json, its topFault set equal to its drawn key → the F7 expectation fails.
- A5 lb5/rows.json holds exactly the drawn ids that are not held, each once, counted in the raw text, and every row's mode is 'H'. Each held id is in DESIGN.md's held table with its ruling and in no rows file. None of the 10 LB5 ids not in this card is in lb5/rows.json, and incline_dumbbell_curl is not in it while pilot A is not on main. Mutations: drop a row; duplicate a row; a held id added; rope_triceps_pushdown added; incline_dumbbell_curl added on a head without pilot A; one row's mode set to 'D'.
- A6 PQ-H6: facts within ±2° or ±1 cm, tempo equal to the card's, F7 only where the note names it, one form per fact. Mutations: a fact +3° turns H6 red; the card path removed gives H6:no-card; a fact with both `joint` and `measure: true` → red.
- A7 The tempo strip follows the card on every row (D-LIB15-SECS). For each id, the spec's tempo array is built only from the ruled lb5/tempo.json row and the card's plate.tempo. Mutations, each red: a Hold phase added to a pause-0 card (cable_curl); overhead_cable_triceps_extension's Hold removed; wrist_curl's up set to 1; a Rest phase added.
- A8 The F7 ids (D-LIB15-F7). For each of cross_body_hammer_curl, incline_dumbbell_curl and wrist_curl in rows.json, F7 is raised, and, once its card keys are written, its topFault differs from the key its first tell carries. Mutation: cross_body_hammer_curl's card copied with drawable true and topFault equal to the drawn key → the test's F7 expectation is red.
- A9 Nothing ships (D-LIB15-AHEAD). lb5-plates.test asserts:
  - every lb5 row's stage is drawing or review;
  - none of the 9 is in shippedIds(), in any batches/ file, or in tests/howto/golden/library/, matched as whole tokens (`\b(lib_)?<id>\b`, and `(^|[^a-z0-9-])<slug>([^a-z0-9-]|$)` for the hyphen form). No file name there matches /lb5/i, and no text names `"batch": "LB5"`;
  - the matcher is exact: over exercises.json, the only real id that contains one of the 9 as a substring, other than its own, is lib_bayesian_cable_curl, which contains cable_curl (checked on main `5158609c`); the cable_curl matcher matches neither "lib_bayesian_cable_curl" nor "bayesian-cable-curl";
  - no LB5 spec, composer, How-to or test imports anything under hands/;
  - generate --check is green and unchanged. The PR body reports the seconds its child process took.
  Mutations, shown in the slice post: one row set to shipped; one set to approved-plate; rows.json copied into batches/; a file naming an LB5 H id in tests/howto/golden/library/; a page-only lb5.json `{"entries":[{"kind":"page","batch":"LB5"}]}`; preacher-curl.layers.html with `data-id="preacher-curl"`; the cable_curl matcher swapped for a plain substring test → the bayesian row is red. Control: a file naming only lib_dumbbell_biceps_curl, lib_rope_triceps_pushdown and lib_hammer_curl (LB5, not in this card) stays green.
  Recorded check (not a unit test): before each milestone post, run `git diff --exit-code origin/main...HEAD -- tools/plates/library/batches tests/howto/golden tools/plates/library/hands tests/howto/library-lint.test.ts src tools/plates/gen` on the merged head and paste its empty output. Seed it once in a temporary worktree: one uncommitted byte changed in tests/howto/library-lint.test.ts must give exit 1.
- A10 The plates page is deterministic (PQ-H7): two equal sha256 values. Mutation: a `Date.now()` added to one LB5 spec's alt text (temporary worktree) → the two sha256 values differ.
- A11 A card differs from its research-head copy only in the three keys (cards.sha.json). The test holds its own copy of the ruled tempo table and builds each card's tempo only from it and plate.tempo. Each fact's pose equals the ruled pose map's image of the pose its quote states. Mutations, each red: any other card key edited; seconds changed on one card's tempo and spec; a start fact named with the unmapped pose.
- A12 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head. No mutation of its own: every unit-test mutation in A2-A11, A15 and A16 is also red in `npm test`.
- A13 The content verifier is VALID (its plant caught) on each card's fields at the head's cards.sha.json, with Q1's topFault checks, before any Do 8 evidence for that card (the 7 first; cross_body_hammer_curl after F-LB5-1; incline_dumbbell_curl when drawn, each by a focused re-verify with a new plant). Evidence: 'CARD FIELDS VERIFIED @ <sha>'. Mutation: the verifier's planted error (PANELS.md 3); a run that misses it does not count.
- A14 The critic run is VALID under PANELS.md section 1, and the supervisor's approvals are recorded per exercise. Each held plate has its reason and ruling on the PR. Mutation: Do 9's two plants; a round that misses either does not count.
- A15 Do 7's lessons, Do 1's R10 items and the Q-D5-6 cue table are tested on drawn items. Mutations, each red: a red Mistake part moved inside the figure's 6 px clearance; a leader within 6 px of a cable or the pad; overhead_cable_triceps_extension's cable moved through the head; one tier-A R10 item removed; a cue over 15 words.
- A16 No pilot A composer is copied or forked (D-LIB15-INCLINE; D-LIB10-NOTE Q2 2): tools/plates/library/eq/ on this branch holds exactly main's files plus eq/preacherPad.mjs and any composer the ruled note names, and once pilot A is on main, incline_dumbbell_curl's spec imports '../eq/inclineBench.mjs'. Mutation: a copy of #109's inclineBench.mjs added under eq/ under another name → red.

verification: the per-id QA table, both plates-page sha256 values and the A9 recorded diff check at the exact head sha. The verifier's and the critic's comments name that sha.

risk_and_recovery:
- The supervisor names a later research head that changes an LB5 H card (D-SUP-PROTECT, D-LIB15-XBODY's fix): the note follows the head. A pick changed after drawing re-plans that Mistake, re-proposes its fault→key entry, and re-runs the verifier and QA for that card.
- A later research head sets one card's tempo to null: that row follows D-LIB14-NOSECS (held off the page, QA and the critic until the strip card is on main). Never invent seconds.
- The rope's cable, run from a low pulley behind the trunk to the hands behind the head, crosses the body or head [unverified until drawn]: A15's cable test catches it; redraw with the rope composer's `ferrule` override (eq/rope.mjs ropeGeometry), never by editing eq/rope.mjs. If it cannot be drawn card-true, report it.
- A Mistake below H3's deviationMin, or a Trace below traceLenMin (wrist_curl, cross_body_hammer_curl, cable_curl are the likely ones) [unverified until drawn]: report its card-true size; never enlarged. wrist_curl follows D-LIB15-WRIST; any other id is held under D-LIB8-shrug, and a zoom route is the supervisor's ruling.
- The front-view twist of cross_body_hammer_curl does not read (the dumbbell axis seen face-on) [unverified until drawn]: report it with its render; the card's next drawable fault is research's call (LR-31 steps), never chosen here.
- The vendor dumbbell's `axis` option does not draw dumbbell_overhead_triceps_extension's vertical dumbbell held in both hands [unverified until drawn]: report it; a new composer only by the note's ruling.
- preacher_curl's EZ bar does not read side-on (R2 below 4): D-LIB10-NOTE Q3 condition 3 applies (an EZ composer goes into the note and is ruled before drawing; skull_crusher is its anchor).
- The split anchor stays held at sheet time: bayesian_cable_curl and dumbbell_overhead_triceps_extension roll (D-LIB15-SPLIT). incline_dumbbell_press stays held: incline_dumbbell_curl rolls (D-LIB15-INCLINE).
- Pilot A merges late: incline_dumbbell_curl waits; READY covers the other rows and lists it.
- A plate cannot pass a hard check card-true: it is HELD and reported (D-LIB8M-CARDTRUE). Any zoom view shows no angle number (owner, lib-zoom-card.md:12).
- Pilot A, LIB-12, HT-11, LIB-7b or LB1-LB4 lands mid-card: merge main in, rebuild the plates page twice and re-run QA. Approvals are head-only.
- A scratch fixture that writes an LB5 id into the real tree: stop and report (as D-LIB13-SCRATCHIDS).
- Another branch's COACHING-DECISIONS entries land first: resolve the append conflict by keeping both sides.
- Two failed tries of one approach with no new evidence: stop and report on the PR.

return:
- the PR number and head sha;
- links to the note, the slice, the card-fields line and the ready line;
- the per-id table (mode, clone source, composer, hard checks, flags, held or not, and why);
- the plates-page sha256;
- the mutation list and the A9 recorded diff check;
- the output of check, test:tz and the gate.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-15 resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

---

Rulings recorded (D-LIB15-*, supervisor session_01PeNM9HeWPrhrcscMwXzupy, 2026-10-22 ~11:30 UTC). Each was proposed in the draft and checked against the sources named.

1. D-LIB15-AHEAD: as D-LIB14-AHEAD (lib-14-card.md:280-283), with LB5 names.
   - LIB-15 may push with its drawn LB5 rows at stage drawing or review in tools/plates/library/lb5/rows.json only. Nothing goes under batches/, tests/howto/golden/, src/ or tools/plates/gen/, and its A9 test enforces this.
   - Every D-LIB4-ENTRY condition holds before any LB5 id is approved-plate, pinned, in batches/ or shipped.
   - Why: D-LIB4-ENTRY-2 (lib4-cards :1055-1070) names LIB-9 only, and its reason (K cannot rise while no id ships) holds here, as D-LIB10-AHEAD (:3156-3159), D-LIB13-AHEAD and D-LIB14-AHEAD found. Plan 6.3:781-784 makes a batch's tie to the one before it checklist order only, and plan 3.1:293-299 gates sheets and D/T starts, not H drawing.

2. D-LIB15-SCOPE: one build-ahead card and branch for LB5's 9 H rows across LB5a and LB5b.
   - Why: D-SUP-LB5-ORDER (lb5-research-card.md:28) put the H slice first across both halves, and the research verified them together. The P rows are pilot A plates, reused as pinned (D-LIB10-PA's pattern), and rope_triceps_pushdown is pilot A's T row. The other 7 T rows cannot start: a T child's byte proof needs its parent pinned, and pilot A is not on main (D-LIB10-TEMPLATES, lib4-cards :3161-3164; plan 3.1:293-294 "no T child ... is started").
   - The ship split stays the plan's: PR a (6 triceps, slot 15) and PR b (13 curls, slot 16) (plan 6.2:714; 7 :812-813). Which branch carries each ship PR is the ship cards' decision. This card never merges.

3. D-LIB15-SECS: all 9 cards give up and down in seconds at `3812989f` (overhead_cable_triceps_extension 1/2/1, dumbbell_overhead_triceps_extension 1/2/1, cross_body_hammer_curl 1/2/1, cable_curl 1/2/0, bayesian_cable_curl 1/2/0, preacher_curl 1/2/0, incline_dumbbell_curl 1/2/0, concentration_curl 1/2/1, wrist_curl 2/2/0; lb5-research-verify.md:35-43). So D-LIB14-NOSECS's rule applies to none of them: every drawn row has a tempo strip and goes on rows.json, the page, QA and the critic. The 7 other non-pilot LB5 cards also have seconds (:44-50), and the 3 pilot A ids are approved plates with strips (none is held in pilot-a/plates.json @ `ff7c5c4f`), so no LB5 id waits for the no-seconds strip.
   - The three pause-1 cards whose pause is a WEAK drawing convention (overhead_cable_triceps_extension c21, dumbbell_overhead_triceps_extension c18, concentration_curl c12) draw it as their card says (LR-33); the tempo test pins it (A7).

4. D-LIB15-CLONE: dumbbell_lateral_raise, the census closest of 5 of the 9 (dumbbell_overhead_triceps_extension, cross_body_hammer_curl, incline_dumbbell_curl, concentration_curl, wrist_curl), has no spec (it is drawn by ref-src: 'H6:not-engine', qa/node.mjs:156 on main; lib4-cards :2635, :3043). Those 5 clone from the anchor spec of the class they use (plan 3.1:290: "Cloned from the closest approved or anchor spec"): dumbbell_biceps_curl (engine dumbbell anchor, plan 2.2:162) for all 5, plus barbell_overhead_press for dumbbell_overhead_triceps_extension's overhead pose and upright_row for cross_body_hammer_curl's front view. The 4 others clone from their census closest (lat_pulldown, machine_chest_press, vendor on main) or the anchor of the rig they use (rope_triceps_pushdown for the rope). Copy, never import (D-LIB9-CLONE).

5. D-LIB15-INCLINE: incline_dumbbell_curl is drawn only after pilot A (#109) is on main and merged in. It imports pilot A's eq/inclineBench.mjs from main; it is never copied or forked here.
   - Why: inclineBench is on #109 only (`ff7c5c4f`; not on main at `5158609c`), and a pilot A composer is never edited or forked (D-LIB10-NOTE Q2 2; lib-13-card.md:176). LB2 did the same for arnold_press and incline_barbell_bench_press (lb2/DESIGN.md:266-269 @ `2dcbac15`).
   - Its sheet waits for incline_dumbbell_press, the incline class anchor (plan 2.2:158; census tags 4 users), which pilot A holds (its arch does not read, lib4-cards 21.6) and LB2 redraws after #109 merges. If it is not approved and pinned at the ship card's slot, incline_dumbbell_curl rolls (plan 3.5:376).

6. D-LIB15-SPLIT: bayesian_cable_curl and dumbbell_overhead_triceps_extension are drawn H now. Neither goes on a sheet until reverse_lunge, the split anchor, is redrawn to its new pick, owner-approved and pinned (plan 3.1:297; 2.2:155). Until then each rolls (plan 3.5:376). No other split anchor is substituted.
   - Why: the census tags bayesian_cable_curl split (byPoseTag.split, 9 ids). dumbbell_overhead_triceps_extension's card draws a split stance (c1; its variantLine: "Drawn standing in a split stance"), the same kind of stagger the census tags split for bayesian_cable_curl, although its census row tags only stand and overhead. The stricter reading is taken: the anchor rule binds any pose class a plate draws. reverse_lunge is held (D-LIB8M-NOSTRIP) and its pick changed (D-SUP-LB4-REVLUNGE), as D-LIB14-STEPUP records.
   - The note may post evidence that dumbbell_overhead_triceps_extension's drawn stance is not the split class; its class changes only by a new ruling.
   - overhead_cable_triceps_extension's card allows feet shoulder-width or staggered (c4). Draw shoulder-width; a staggered drawing brings it under this ruling.

7. D-LIB15-XBODY: cross_body_hammer_curl's `plate.mistake.drawable` is `true` at `3812989f`, but its own rankNote says "drawable is false: the front view cannot show a small elbow bend toward the camera (viewWhy), so handlingMistakes[0] stays the range fault and plate.mistake names the next fault". CARD-V2:36 sets drawable false when the top fault needs a view the plate lacks. The field is therefore wrong; the pick and the drawing are right.
   - Route: research follow-up F-LB5-1 on claude/libht-research: that one field to false, nothing else, with the supervisor's focused recheck, and the head named on this PR. LIB-15 never edits it (D-SUP-PROTECT).
   - Until that head is merged in: cross_body_hammer_curl is drawn and authoring-QA'd (H6:no-card and F7 'no card top fault' expected), and its Do 6 b keys, Do 8 evidence and critic wait. Its expected flag is F7 (D-LIB15-F7). Writing topFault from the true field would hide the F7 the owner must name, so it is never done.
   - Why it was missed: the LR-29 verify agreed with the pick ("true (drawn fault)", lb5-research-verify.md:37) and did not test the field against the rankNote.

8. D-LIB15-F7: F7 is expected on cross_body_hammer_curl, incline_dumbbell_curl and wrist_curl. Each needs the owner's named yes on the LB5 sheet (plan 3.3:337-339). Each topFault is the ruled key of its handlingMistakes[0] (the range fault, the wrist bend and the grip opening), which must differ from the drawn key (D-LIB8M-TF1 4); the CARD FIELDS verifier checks it (13 Q1). LB3's one_arm_dumbbell_row and pilot A's dumbbell_biceps_curl are the approved examples. The supervisor amends the plan's drawable-fault list as a docs action on claude/howto-options (plan 1:85-88; 3.3:339's "6"), as D-LIB14-PISTOL did.

9. D-LIB15-WRIST: wrist_curl is drawn at the reference scale first, and PQ-H3 is measured on its card-true pose (plan 1:89-94: "PQ-H3 decides which ids need it").
   - If H3 passes, no zoom and no F1.
   - If H3 fails, plan 1's `camera.maxScale` route (F1, an owner-named exemption, never a margin) is used only if the supervisor rules it on the PR after seeing the zoomed render with the whole figure, bench and dumbbell in frame (R7). The shrug failed R7 that way (lib4-cards :1676). Otherwise wrist_curl is held under D-LIB8-shrug and moves with LIB-ZOOM's convention once the supervisor extends it, as D-LIB13-SHRUG did for the shrugs.
   - Never exaggerate the wrist range off the card to pass H3 (Q-D5-3). No zoom view shows an angle number (owner, lib-zoom-card.md:12).

10. D-LIB15-PREACHER: `preacherPad` is a single-use composer; preacher_curl is its anchor, and it lands in this PR (plan 2.1:129-130, :141). The EZ bar follows D-LIB10-NOTE Q3 (#265 6255216039): the vendor barbell end-on, no composer.
    - preacher_curl's plate size is its own unsourced number in its header. If the note instead reuses skull_crusher's EZ_PLATE_D as a convention, or a row takes `bar.kind: 'ez'`, Q3's condition 2 applies: skull_crusher is its anchor, and preacher_curl is not approved before skull_crusher is pinned.
    - If R2 scores below 4 because the bar does not read as an EZ bar, Q3's condition 3 applies.

11. D-LIB15-VLINE: per D-LIB13-VLINE (lib-13-card.md:400), only preacher_curl ('Machine / EZ Bar') and wrist_curl ('Dumbbell / Barbell') show a variant line; src/data/exercises.json on main names one kind for the other 7. The plate.variantLine on overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension and cable_curl is a drawing note, never shown. Research follow-up F-LB5-2: move those three texts to `notes` in the next research pass (as F-LB3-5). It does not touch the drawing or the three keys.

12. D-LIB15-SLICE: the H slice is overhead_cable_triceps_extension (tier A, the rope, the overhead class), preacher_curl (the `preacherPad` anchor, the seat, the EZ bar), wrist_curl (the small-motion and drawable-false risk) and cross_body_hammer_curl (the only front view, drawable-fault). Bulk: dumbbell_overhead_triceps_extension, cable_curl, bayesian_cable_curl, concentration_curl in one GO; incline_dumbbell_curl after pilot A is on main.
    - Why: plan 6.3:771-772 and cards.md "hard cards": the representative and the highest-risk cases first. Four because two new risks (small motion, front-view rotation) and two rigs (rope overhead, the new pad) each need their own check; nine ids need no second drawer.

13. D-LIB15-ANCHORS: D-LIB10-PANEL1 unchanged, as D-LIB14-ANCHORS (lib-14-card.md:302). Hidden anchors are golden B's pull_up and lat_pulldown until pilot A is pinned (PANELS.md 1 step 1), then D-LIB10-ANCHORS' pair (barbell_overhead_press and pull_up), with its pilot A one-item exception. Visible references: the 8's lat_pulldown and machine_chest_press, and pilot A's dumbbell_biceps_curl, rope_triceps_pushdown, barbell_overhead_press and upright_row at their approving heads. A plate is never a hidden anchor and a visible reference in the same round: while lat_pulldown is a hidden anchor, overhead_cable_triceps_extension, cable_curl and bayesian_cable_curl use rope_triceps_pushdown or dumbbell_biceps_curl as their visible reference, and after the pin barbell_overhead_press is not a visible reference. Golden-B follow-ups 19-22 stay excepted as recorded (PANELS.md 1 @ `a2375fb1`; lib4-cards 29-31).

Supervisor follow-ups (not the builder's):
- Send 'LIB-15 start' with the live active-builder count. HANDOVER 8.0p had 3 of 4; LIB-14 (#289) has started since, and LIB-5v is READY in review, so re-count before sending.
- Add LIB-15 to the owner's checklist after LIB-14 (#289), and the LB5b ship after the LB5a ship.
- Research follow-ups on claude/libht-research: F-LB5-1 (cross_body_hammer_curl drawable → false; D-LIB15-XBODY) before Do 6 b; F-LB5-2 (three variantLine texts to notes; D-LIB15-VLINE) in the next pass. Name the new head on this PR.
- Plan docs action on claude/howto-options: D-LIB15-F7 (plan 1:85-88; 3.3:339).
- Merge LIB-15's card-field commit back into claude/libht-research after 'CARD FIELDS VERIFIED' (#286 is merged there as `befca2cd`).
- Send 'LIB-15 resume' once pilot A is on main, for incline_dumbbell_curl.
- Card LB5's T rows once pilot A is pinned on main.
- For the ship card: each F7 id's top fault is taught in its layers (plan 1:88). incline_dumbbell_curl's curl pair draws 'bent-back' (hand-curl.mjs:16, faults BOTH). The hand keys draw neither cross_body_hammer_curl's range fault nor wrist_curl's grip opening (hand-curl.mjs:27 marks wrist_curl exempt), so their card zooms carry them, or the ship card reports the gap.

---

Collision check (cards.md step 1; `git diff --name-only origin/main...<head>` at main `5158609c`, 2026-10-22 ~11:20 UTC; research PRs against claude/libht-research `3812989f`):

| PR | branch @ head | files | overlap with write_scope | pins on the 9 ids |
|---|---|---|---|---|
| #109 pilot A | lib-8-pilot-a @ `ff7c5c4f` | 102 | docs/COACHING-DECISIONS.md (append) | eq/inclineBench.mjs (incline_dumbbell_curl imports it once on main); specs copied with git show; none edited |
| #191 LIB-12 | lib-12-hand-views @ `8bea5afc` | 100 | docs/COACHING-DECISIONS.md (append) | hand-cupped.mjs:30 GAP dumbbell_overhead_triceps_extension; tests/library/hand-views.test.ts (cupped gaps): read only |
| #245 LB1 | lib-9-lb1 @ `9e5d9666` | 67 | none | none |
| #265 LB2 | lib-10-lb2 @ `2dcbac15` | 35 | docs/COACHING-DECISIONS.md (append) | lb2/DESIGN.md:142 names preacher_curl as a later EZ user (D-LIB15-PREACHER): read only |
| #271 LIB-7c | lib-7c-lb1-hands @ `88ad31bd` | 20 | docs/COACHING-DECISIONS.md (append) | none |
| #273 HT-11 | ht-11-delta @ `e0722148` | 33 | none | none |
| #274 LB3 | lib-13-lb3 @ `a6f4bd07` | 42 | docs/COACHING-DECISIONS.md (append) | none |
| #278 pilot B | lib-11-pilot-b @ `d3b231d6` | 29 | none | none |
| #279 LIB-ZOOM | lib-zoom @ `754176a0` | 90 | none | none (its convention may later cover wrist_curl, D-LIB15-WRIST) |
| #282 LIB-5v | lib-5v-variant-line @ `2ad1bf3c` | 13 | docs/COACHING-DECISIONS.md (append) | none |
| #284 LIB-7b | lib-7b-hand-blocks @ `3aa1729a` | 33 | docs/COACHING-DECISIONS.md (append) | none (its hands/**, layers-spec.mjs, build-layers-page.mjs, gen/** and src/howto/generated/** are reserved here) |
| #289 LIB-14 | lib-14-lb4 @ `2c2c6c3e` | 21 | docs/COACHING-DECISIONS.md (append) | none (LB4 ids only) |
| #288 LB7 research | libht-research-lb7 @ `db914b11` | 27 | none | none (two prose mentions; no LB5 card file) |
| #259 LP research | libht-research-lp @ `dd54051e` | 1 | none | none |

- Other open PRs (#1, #3, #88, #92, #94, #144, #149, #158, #188, #190, #192, #197, #209, #221): no write_scope overlap except the COACHING-DECISIONS append on #92 and #188. #190 and #209 are do-not-merge.
- Shared add-only files on main (scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css): no line names any of the 9. LIB-15 touches none.
- Main's hands/claims.json pins six claim texts of these cards; all equal the research head (shared-file owners). LIB-15 changes no claim.
- Result: no unsettled collision. The only shared write is the append-only COACHING-DECISIONS.md (keep both sides). #109's inclineBench, #191's cupped GAP and #265's EZ note are read only and named in read_first.

Open items (none blocks the start):
- F-LB5-1 (D-LIB15-XBODY): gates cross_body_hammer_curl's Do 6 b keys only.
- Pilot A on main: gates incline_dumbbell_curl's drawing (D-LIB15-INCLINE) and every sheet.
- Unknown until drawn: whether wrist_curl's Trace, cross_body_hammer_curl's twist and cable_curl's extension pass PQ-H3; whether the rope's cable clears the head; whether the vendor dumbbell's `axis` option draws the overhead dumbbell (risk_and_recovery).
- At sheet time only, the owner's: the named yes for each F7 id and, if ruled, wrist_curl's F1 (plan 3.3:337-339). These are not decisions now.
- The live active-builder count: named in 'LIB-15 start'.

---

Critic pass (2026-10-22, one fresh read of the draft by its author):
- Fields: id, model, mode, title, branch, slot, base, depends_on, build_prerequisites, merge_prerequisites, shared-file owners with write_scope and reserved_paths, read_first, design_reference, connectivity, outcome, deliverable, evidence, finish, forecast, acceptance A1-A16, verification, risk_and_recovery, return and the resume rule: all present.
- Line numbers re-read and corrected: lib-13-card.md :400 (was :399), lib4-cards :1676 (was :1690), qa/node.mjs:156 on main (lib4-cards' :154 is an older main), lb2/DESIGN.md :266-269, bayesian_cable_curl's 45° claims (c2, c3), the forecast sum (45 h, was 37), the clone count in D-LIB15-CLONE (5 ids, was 6).
- Ids: the 9 match plan :739-743 (no P or T mark), the census rows and lb5-research-verify.md:35-43. Every card, its tempo and its drawable field were read at `3812989f`; that read found D-LIB15-XBODY.
- Loosening: none. No check, envelope or flag changes. D-LIB15-SPLIT and D-LIB15-XBODY take the stricter reading. D-LIB15-WRIST allows F1 only by a ruling on the render, and the owner names it at the sheet.
- Every acceptance item has a mutation or, for the process item A1, a recorded check. A12 relies on the others' mutations; A13 and A14 on their plants.
- Buildable: every input exists on main, at `3812989f`, at #109 `ff7c5c4f` (git show), or at #274 `a6f4bd07`. incline_dumbbell_curl alone waits for an unmerged head (pilot A), and it is outside the start.
- Status `ready`: nothing blocks the start. The lane slot is named in 'LIB-15 start'.


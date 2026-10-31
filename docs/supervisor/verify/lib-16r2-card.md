Card LIB-16R2: LB6 resume 2, the 9 T/D rows drawn H (2026-10-31; status `ready`: the supervisor confirmed rulings D-LIB16R2-1 to -9 below as written (lib4-cards §48). It starts on 'LIB-16 resume 2 start' when a LIB slot frees.)

Sources (every file:line was read at these heads; [est] marks an estimate, [unverified] what no run here checked):
- main `6d34542c` (train 51). Scratch worktree of `6d34542c`, npm ci: the LB6 page is `e4260472226871f1f615902aba5d1cbf34005bc8adf72ea7736b9d002d526848` (407200 B, two equal builds, lb6/build.mjs); pilot A L1 `5d0e562f…5ba8`/1325644 (lib8-pin.test.ts:39); pilot B `ff3e017c…583f` (lib11-pilot-b.test.ts:279).
- claude/sup-lib4-cards `49f2a947` (lib4-cards.md, lib-16-card.md, lib-15r2-card.md, lib-11-card.md, lib-strip-card.md); claude/sup-handover-1445 `02c8d00a` (HANDOVER.md, verify/PANELS.md); #349 head `2e60be01` (templates/CURL.mjs, PUSHDOWN.mjs); plan claude/howto-options `d8d4b2e6` (docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md); census `4a9fd86`.
- Research head `a48b059400a74d5c9e3aceed21cf1aa67ab6f118`. The 9 cards and quotes have the same blobs as at the LB6 research head `a8e66f32` (LR-29 VALID on all 13, lb6/DESIGN.md:4-6; checked 10-31). None is on main yet.
- Scratch measures (scripts in the supervisor's scratchpad, never committed): plate scales from `renderPlate(...).report.camera.pxPerM`; landmark moves from `landmarksOf` (engine.mjs:3); composer search over all 420 origin refs (`git ls-tree -r` and `git grep latRaiseMachine|hipAbdAddMachine -- 'tools/**/*.mjs'`).

id: LIB-16R2
model: claude-opus-5-5 (9 H plates, two composers, a front-view zoom and the clearance calls: judgement work)
mode: auto
title: 'Builder: LIB-16 resume 2, LB6 T/D rows drawn H'
branch: claude/lib-16-resume-2 (new, from the latest main; claude/lib-16-lb6 and claude/lib-16-resume are the old branches). First push opens draft PR 'LIB-16 resume 2: LB6 smith, fly and seated-machine rows (build-ahead, nothing ships)'.
slot: plan 7 order 17 (LIB-17 in the plan = LB6, plan :817). The supervisor names the checklist slot in the start message.
lane: **one** LIB slot under D-LIB-LANE-ACTIVE (lib4-cards :1023). HANDOVER :848 had 4 of 4 active at 10-31 11:00 (LIB-8R, LIB-21 resume 2, LIB-SPINE, LIB-15 resume 2). LB7's three PUSHUP rows are a separate card (lib-17r3-card.md), because the write scopes are disjoint (collision check below) and LB7's rows then reach a panel without waiting behind nine LB6 rows. Start order: this card first (the longer job), LB7 on the next free slot.

## Why now
- Every parent and rig anchor these rows use is pinned on main: cable_fly (tests/howto/golden/library/pilot-b.json:79), smith_machine_bench_press (:21), pec_fly (pilot-a.json:232), dumbbell_shoulder_press (:81), upright_row (:202); the composers eq/smith.mjs, eq/pecDeck.mjs and eq/inclineBench.mjs are on main and pinned (MANIFEST.json:216, :32, :30).
- lb6/DESIGN.md:46-51 held them only for "pilot B pinned" and "the pilots pinned"; both are on main now.
- The inventory's next-card order (lib4-cards :4506) puts this card third, after LIB-SPINE (near READY, HANDOVER :847) and LB5 resume 2 (in its last recheck, HANDOVER :844).

## Modes: all 9 are H (measured against PARAMS)
A T or D row may set only derive.mjs's 7 PARAMS keys (derive.mjs:4-12: camera.maxScale, grip.width, bar.kind, bench.angle, load.primitive, handedness, stance.width). Any other key is `H10.unknown` (qa/node.mjs:307), and a family row may name only these keys (qa/param-ranges.mjs:30). So a row whose pose, stance, rig or moving limb differs from its parent's in any other way is H (plan 3.1:272; D-LIB15R2-MODES, lib-15r2-card.md:138-141).

| id | tier | view | plan mark | mode and why (outside PARAMS) | clone source (copy, never import; D-LIB9-CLONE) | rig | sheet waits for | F7 |
|---|---|---|---|---|---|---|---|---|
| low_to_high_cable_fly | C | front | T (CFLY) | **H**: pulleys between knee and hip (c1) and a low-out to high-in arc (c4, c5). cable_fly fixes the handles at chest height (cable_fly.mjs:63) and the pulley 5 cm over the shoulder (:45); no PARAMS key sets pulley height or the arc | cable_fly (pilot B) | vendor cableColumn; spec handle (D-LIB16-HANDLE) | nothing | yes (drawable false; top fault lean c7 needs a side view) |
| high_to_low_cable_fly | B | front | T (CFLY) | **H**: pulleys at the top of the head (c1), hands meet below the chest (c5); same reason | cable_fly | same | nothing | yes |
| machine_lateral_raise | C | front | T (FSEAT) | **H**: a new rig and shoulder abduction from the sides (c3-c5) against pec_fly's horizontal sweep; plan 3.1:280's "machine composer" and "moving limb" are not PARAMS keys | pec_fly (seated front view); cable_lateral_raise (LB7 on main, the front-view abduction arc) | **latRaiseMachine** (new) | its own plate (plan 2.1:141) | yes |
| rear_delt_fly | C | front | T (FSEAT) | **H**: seated facing the pad (c1) and the reverse sweep (c4); no PARAMS key for either | pec_fly | eq/pecDeck.mjs unedited (D-LIB16R2-PECDECK) | nothing | yes |
| hip_abduction | C | front | T (FSEAT) | **H**: the legs move (c3), new rig | pec_fly (seated base); the engine's hip `abd` (body.mjs:82, :112) | **hipAbdAddMachine** (new) | both users on one sheet (plan 2.1:140) | yes |
| hip_adduction | C | front | T (FSEAT) | **H**: as hip_abduction, inner-thigh pads (c1) | pec_fly | hipAbdAddMachine | same | yes |
| smith_machine_squat | A | side | D | **H**: PARAMS has no Smith value (D-LIB10-BENCH-H, lib-11-card.md:55); the vendor engine reads only `spec.camera` of the PARAMS paths (lb6/DESIGN.md:18-20); the parent's tempo Lower 2 / Drive up 1 / Brace 1 (vendor barbell_back_squat.mjs:126) is not the card's 3/1/0 (c22), and H6 compares tempo exactly (qa/node.mjs:172). The D-LIB14-MODES form (COACHING-DECISIONS.md:2739) | barbell_back_squat (the 8, vendor) for the squat; smith_machine_bench_press for the rig code | eq/smith.mjs (`base`, `stopY`; smith.mjs:15-18) | nothing | no |
| smith_machine_shoulder_press | A | side | T (SEATPRESS) | **H**: no Smith value; SEATPRESS is not built (D-LIB10-TEMPLATES, lib4-cards :3161-3164: arnold_press is H, lb2/rows.json) | dumbbell_shoulder_press (pilot A, seated base); smith_machine_bench_press (rig, bar, flare Mistake) | smith + inclineBench at 20° from vertical (c1 ~70°; inclineBench.mjs:13) | nothing | no |
| smith_machine_incline_press | A | side | T (BENCH) | **H**: no Smith value; BENCH is not built (D-LIB10-BENCH-H); and 'incline' may not enter a family before its anchor is pinned (D-LIB10-RANGES 3, lib4-cards :3116; the D-LIB10-DECLINE form, :3174-3178) | smith_machine_bench_press; incline_barbell_bench_press (LB2, the incline supine solve) | smith + inclineBench at 60° from vertical (card equipment: 30°) | **incline_dumbbell_press pinned** (incline class anchor, plan :158; lb2/rows.json:24-31 is stage `drawing`; not in either golden file) | no |

- So no template, no family row in qa/param-ranges.json and no supervisor ranges PR (the D-LIB15R2-RANGES route is unused). A T route would first need new PARAMS keys in derive.mjs (pulley height; machine composer and moving limb; a Smith value), a QA card of its own. It is not proposed: a pulley-height key would serve two rows, and the FSEAT rows would still differ in rig, seat side and moving limb from pec_fly beyond any one key. CFLY and FSEAT are not built, as BENCH was not (D-LIB10-BENCH-H). LB6's plan marks become D0 P2 T1 H13, the T being smith_machine_shrug, whose mode stays LIB-13s's call (supervisor docs action).
- D-LIB15R2-TPARENT does not apply: no row is a T child, so A15-style drawn-item tests bind every drawn item of every row in full. A defect copied from a clone source is this row's to fix, never excused as parent-fixed.
- The census puts none of the 9 in the split class (byPoseTag.split, 9 ids, none here), so D-LIB16-SPLIT does not hold any of them.

## Measured (scratch, main `6d34542c`; bars 22.11 / 11.39 px, qa/envelope.json:12-13)
- **Composers:** `latRaiseMachine` and `hipAbdAddMachine` exist on no origin ref (420 refs, 10-31): no eq/ file and no .mjs reference. They are new work here (plan 2.1:140-141).
- **Plate scales:** pec_fly 146.29 px/m (REF_CAMERA, pec_fly.mjs:121), cable_fly 124.00 (cable_fly.mjs:49), smith_machine_bench_press 146.29, dumbbell_shoulder_press 146.29.
- **rear_delt_fly's drawn fault, the shrug (c17):** 5 cm of `scap.elev` moves `shoulder.r` 0.0500 m and the `ear` 0.0000 m (the head does not ride the scapula; body.mjs:143). At 146.29 px/m that is **7.31 px < 11.39**; passing at plate scale needs 7.79 cm, which no claim gives (the cross_body_hammer_curl finding, lb5/DESIGN.md:333). So it needs a Mistake zoom (D-LIBZOOM-EXTEND, lib4-cards :4358-4369): k 2 gives 14.6 px [est, from resistance_band_pull_apart's measured 7.3 → 14.6 px, lb7/DESIGN.md:388]. Its place is the risk: cable_rear_delt_fly found none (D-LIB17-RDFHOLD, lb7/DESIGN.md:408), and the pec deck housing sits above the shoulders (pecDeck.mjs:2).
- **machine_lateral_raise's drawn fault, arms over shoulder level (c5):** the elbow moves 0.0567 / 0.0850 / 0.1130 / 0.1685 m from 90° to 100 / 105 / 110 / 120° abduction, so 8.3 / 12.4 / 16.5 / 24.6 px at 146.29. The bar needs about 14° past horizontal [est, between the measured 100° and 105°]. The drawn size goes under "Unsourced numbers" and is never enlarged to pass (Q-D5-3).
- **hip_abduction / hip_adduction (seated, hip flexion 90°, knee 90°):** the knee moves 0.0745 / 0.1466 / 0.2144 / 0.2756 m at 10 / 20 / 30 / 40° abduction, so 10.9 / 21.4 / 31.4 / 40.3 px. So both Mistakes (a short range; a wide start) and both Traces should clear the bars at a card-true range [est until drawn].
- **high_to_low_cable_fly's drawn fault, the hands crossing (c8):** at cable_fly's 124 px/m the bar needs a crossing of 9.19 cm per hand (11.39 / 124). No claim gives the size; if the drawn crossing is smaller, a Mistake zoom follows (the dumbbell_overhead_triceps_extension route), never a bigger crossing.
- **D needs:** the vendor engine reads `spec.camera` only (vendor/engine/plate.mjs:95), so a D smith_machine_squat would draw the free back squat unchanged.

## Files it may touch (write_scope)
- New: tools/plates/library/specs/{low_to_high_cable_fly, high_to_low_cable_fly, machine_lateral_raise, rear_delt_fly, hip_abduction, hip_adduction, smith_machine_squat, smith_machine_shoulder_press, smith_machine_incline_press}.mjs; tools/plates/library/eq/{latRaiseMachine, hipAbdAddMachine}.mjs; tools/plates/library/howto/lib_<the 9 ids>.howto.mjs (`id` and `research` only, D-LIB9a-HOWTOID).
- tools/plates/library/lb6/{rows.json, tempo.json, sizes.json, cards.sha.json, DESIGN.md (a 'Resume 2' section), qa.mjs (the expected-flag list), build.mjs only if a held map is needed}; tests/howto/lb6-plates.test.ts (its own blocks: NOT_HERE :19-20, COMPOSERS :26, A5 :99-152, A16 :880-913).
- tests/howto/fixtures/eq-composers.json: add the two names under "LIB-16" only (its rule, :2: "A lane that adds a composer adds it here in its own PR").
- docs/research/howto/cards/ and quotes/ for the 9 ids: byte copies from `a48b0594`, then the 3 keys. The supervisor merges the field commit back to research.
- docs/COACHING-DECISIONS.md: append one entry (keep both sides on a merge).
- **Never:**
  - qa/**, derive.mjs, candidate.mjs, registry.mjs, build-page.mjs, plates-page.mjs, golden.mjs, MANIFEST.json, zoom/**, vendor/**, layers/**, strip/**, templates/**;
  - every existing eq/ file (smith, pecDeck, inclineBench and parts are imported only; all four are pinned in pilot closures);
  - batches/**, tests/howto/golden/**, pages/**, pilot-a/**, pilot-b/**, src/**, gen/**;
  - the 3 approved LB6 specs (cable_chest_press, machine_pullover, machine_crunch), every pilot spec and every other lane's files, lib-strip.test.ts, fixtures/held-pairing.json;
  - .github/**, scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css, package*.json.
- **Collision check** (10-31, `git diff --name-only origin/main...<head>` on every open LIB PR): #349 `2e60be01` writes templates/CURL.mjs, PUSHDOWN.mjs, lb2:704, lb3:114, lib11-pilot-b:274 and COACHING-DECISIONS; #348 `d5ab6a2c` writes vendor/engine/body.mjs, plate.mjs, both MANIFESTs and COACHING-DECISIONS; #340 `b5a18525` writes MANIFEST.json and COACHING-DECISIONS; #346 `8c4d3264` and #337 `13049ba4` none of these paths. LB7's card (lib-17r3) writes lb7/**, strip/rows.json and lib-strip.test.ts, none of them here. Neither card writes templates/, param-ranges.json or a shared test. **The only shared write is the COACHING-DECISIONS append.** After LIB-SPINE (#348, opt-in engine fields, "no approved byte moves") merges, merge main and re-run A2.

## Do (waves, so the approvable rows reach a panel first)
1. **RESUME PLAN** in lb6/DESIGN.md, posted as 'LB6 R2 PLAN READY @ <sha>'; wait for 'LB6 R2 PLAN RULED'. Base: the latest main. It gives:
   - the mode table above with each row's reason, re-checked on your base; the clone source and every copied bracket's solved value (D-LIB9-CLONE);
   - per row: the pose map, the fault→key map, the tempo map (D-LIB8M-TEMPO; the cards' bottom pauses are named, not drawn, as lb7/DESIGN.md:181-183), the facts plan (D-LIB8M-FACTS, D-LIB13-FACTS2; contacts at both ends of a segment, PANELS §3), the unsourced numbers;
   - the clearance table (D-LIB16R2-CLEAR): every load or machine part against the body in each drawn pose, measured in px, with the card's own contacts as the only exceptions (for example the squat bar on the upper traps, c1, and the hip pads on the thighs, c1). The tight clearances: the squat bar off the neck (c1), the shoulder-press bar just missing the nose (c3), the cables off the thighs and the head;
   - a PQ-H3 estimate per row from the measures above, and each zoom's region and k (rear_delt_fly at least);
   - both composers' parts, sizes (lb6/sizes.json) and moving parts with `poly` (PQ-H9);
   - the expected flags (F5 on all, D-LIB9-F5; F7 on the 6 drawable-false rows).
2. **Cards at start:** copy the 9 cards and quotes from `a48b0594` and update cards.sha.json.
3. **Wave 1, no new composer** (low_to_high_cable_fly, high_to_low_cable_fly, smith_machine_squat, smith_machine_shoulder_press, smith_machine_incline_press):
   - draw each from its clone source; QA (Do 6); 'LB6 R2 PLATES READY 1 @ <sha> (page <sha256>)';
   - the supervisor runs PANELS §1 on them (hidden anchors golden B's pull_up and lat_pulldown, D-LIB14-ANCHORS, lib4-cards :4421; 2 plants; R10 for the 3 tier-A smith rows).
4. **Card fields** after RULED, for all 9: the 3 keys, then 'LB6 R2 CARD FIELDS READY @ <sha>'. PANELS §3 once, one plant; fix only what it names.
5. **Wave 2, the composers and the zoom:** eq/hipAbdAddMachine.mjs with hip_abduction (its anchor) and hip_adduction; eq/latRaiseMachine.mjs with machine_lateral_raise; rear_delt_fly on pecDeck with its Mistake zoom. Each composer follows the pecDeck pattern (frontBar, perItem; PRIMITIVES only, equipment.mjs:316; no file reads). QA, then 'LB6 R2 PLATES READY 2 @ <sha> (page <sha256>)' and a PANELS §1 run.
6. **QA** for every row in rows.json: two builds of the LB6 page with equal sha256, then runQa node and browser per id on candidateOf(id, { all, authoring: true }), zero exemptions. Post the table. One fix round per wave, then a focused recheck; a second failure holds the id (D-LIB8M-CARDTRUE, or D-LIB13-PANEL2 when ruled).
7. **Merge** origin/main with a merge commit, re-run A2 and A10, post 'LB6 R2 READY @ <sha>'. A fresh Opus review follows. If wave 2 is not approved when wave 1 is, D-LIB16R2-WAVES applies.

Stops (post on the PR and wait; never work around one):
- S1 Any pilot A, pilot B or other LB page byte moves, an approved LB6 plate's fragment moves, an existing eq/ file would need an edit, or C0 is not [].
- S2 A bar is met only with k > 4, r < 52, a trim change, a second label move, or a fault or body change. The row is held; never loosened.
- S3 A card's facts cannot hold on the body together (D-LIB10-BENCH-H form), for example smith_machine_shoulder_press's bar just missing the nose (c3) with the upper arms about parallel (c6) and the elbows in front of the shoulders (c5) [unverified until drawn].
- S4 rear_delt_fly has no zoom place at any ladder k (the D-LIB17-RDFHOLD form): it is held with its route.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
- **A1 Scope.** rows.json holds exactly the drawn, unheld ids (the 3 approved and the released new ones), each once, every row mode 'H' with no `parent`, `template` or `params` (the existing all-H assert, lb6-plates.test.ts:99, stays byte for byte). NOT_HERE shrinks to smith_machine_bench_press, smith_machine_shrug, cable_fly and pec_fly, each still red if added. A held id is in DESIGN.md's held table with its route and in no rows file.
  Mutations: smith_machine_shrug added; cable_fly added; one row set to 'T'; a row duplicated.
- **A2 Nothing else moves.** The 3 approved LB6 plates' 27 fragment shas equal their values on page `e4260472…6848`: the block at lb6-plates.test.ts:1300 pins machine_pullover and machine_crunch today (:1301); those values stay byte for byte, and cable_chest_press's 9 are added at this base. Pilot A L1 `5d0e562f…`/1325644, pilot B `ff3e017c…`, and every other registry page's sha are equal before and after (listed in the PR). eq/smith.mjs, pecDeck.mjs, inclineBench.mjs and parts.mjs are byte-identical to main. C0 is []. `git diff --exit-code origin/main...HEAD` is empty on the Never paths.
  Mutation (temporary worktree): one byte in machine_crunch.mjs's alt turns its fragment check red; one byte in eq/smith.mjs turns C0 and pilot B red.
- **A3 Composers** (D-LIB16R2-COMPOSERS). Both return PRIMITIVES items only, read no file, and are listed under "LIB-16" in eq-composers.json; every lane's A16 block stays green. Per drawn pose: each static part at one place (±1 px); each moving pad carries `poly` and is drawn in the Mistake view; the arm pads rest just above the elbows (machine_lateral_raise c3) and the leg pads on the outer (hip_abduction c1) or inner thighs (hip_adduction c1), each contact checked at both segment ends.
  Mutations: a moving pad without `poly` (PQ-H9 red); a pad 2 cm off its limb; a copy of crunchMachine saved as latRaiseMachine (A16 red).
- **A4 Card-true poses** (drawn-item tests on every row, in full). At least: low_to_high_cable_fly's pulleys between knee and hip height (c1) and its hands meeting above the chest (c5); high_to_low_cable_fly's pulleys at about head-top height (c1) and its hands meeting below chest level (c5); machine_lateral_raise's end upper arm horizontal ±5° (c5); rear_delt_fly's end arms in line with the shoulders (c5) and its chest on the pad in world coordinates (c1, c6); hip_abduction's start knees together (c4); hip_adduction's end pads nearly touching (c3); each smith bar centre on its rail in every pose (smith.mjs:37 throws, c8); smith_machine_squat's feet 7.6-15.2 cm ahead of the rail (c2, Motra's 3-6 in); the benches at the card angles (shoulder press ~70°, c1; incline 30°, card equipment).
  Mutations: the squat feet under the rail; the lateral raise ended at 100°; the low-to-high pulleys at shoulder height.
- **A5 Clearance** (D-LIB16R2-CLEAR, the BARSTART lesson). Every load and machine part clears the body outline by 2 px or more on the plate, in every drawn pose, except the contacts the PLAN lists from the cards.
  Mutation per row: its clearance-setting value set to 0 (for example the shoulder-press bar line on the nose) turns it red.
- **A6 Zoom rows** (D-LIBZOOM-EXTEND). Each zoom is the PLAN's region and k, no H2.zoom, H3.zoom or H4.zoom key is red, the ring closes inside the frame (D-LIB22-RINGFIT, lib4-cards :4448), and no smaller ladder k passes every check. Mutations: rear_delt_fly's zoom removed (H3.deviation, 7.31 px); its k one rung lower.
- **A7 QA.** Every hard check passes per id, node and browser. The raised flags equal the ruled set exactly (qa.mjs): F5 on all, F7 on the 6 drawable-false ids, and each of their topFaults differs from the drawn key. Mutations: LIB-3's M1-M7 (qa/mutations.mjs) on one new plate; one F7 id's topFault set to its drawn key.
- **A8 Cards.** Each of the 9 cards differs from its `a48b0594` blob only in the 3 keys (cards.sha.json); validateCardFile gives []; the tempo follows D-LIB8M-TEMPO; CARD FIELDS VERIFIED with the plant caught. Mutations: another key edited; one second changed on a card and its spec; the verifier's plant.
- **A9 Nothing ships.** The A9 asserts (lb6-plates.test.ts:154) cover the 9 new ids. Mutation: one row set to shipped.
- **A10 Panel and green.** Each wave is VALID under PANELS §1, both plants caught, R11 scored for each zoom plate, R10 for the tier-A rows. Approvals are per id at that head. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head, and CI is green.

## Rulings (confirmed by the supervisor, 2026-10-31)
1. **D-LIB16R2-LANE:** one lane for LB6, separate from LB7's (disjoint write scopes; only the COACHING-DECISIONS append is shared).
2. **D-LIB16R2-MODES:** all 9 rows are H, with the reasons in the mode table; CFLY and FSEAT are not built; LB6 marks D0 P2 T1 H13 (supervisor docs action).
3. **D-LIB16R2-SQUAT:** smith_machine_squat is H, not D (D-LIB14-MODES form): a D child can change only `spec.camera` in the vendor engine, PARAMS has no Smith value, and its tempo differs from the parent's.
4. **D-LIB16R2-INCLINE:** smith_machine_incline_press is drawn H now; its sheet waits for incline_dumbbell_press to be pinned, as incline_dumbbell_curl's does (lib-15r2-card.md:54); otherwise it rolls (plan 3.5:376).
5. **D-LIB16R2-COMPOSERS:** latRaiseMachine (single use, anchor machine_lateral_raise) and hipAbdAddMachine (anchor hip_abduction; both users on the LB6 sheet) land in this PR as new eq/ files, front view, PRIMITIVES only, named in eq-composers.json under LIB-16.
6. **D-LIB16R2-PECDECK:** rear_delt_fly uses eq/pecDeck.mjs unedited. Its seat, pad and column are drawn at z 'back' (pecDeck.mjs:18-20), so the front view shows no depth; "chest on the pad" (c1, c6) is a world-coordinate contact fact, and the alt text names the chest pad. A panel finding that the pad reads as a back pad comes back to the supervisor; pecDeck.mjs is never edited (it is in pec_fly's pinned closure, MANIFEST.json:32).
7. **D-LIB16R2-F7:** F7 is expected on low_to_high_cable_fly, high_to_low_cable_fly, machine_lateral_raise, rear_delt_fly, hip_abduction and hip_adduction (cards' plate.mistake.drawable false). Each is named at the sheet.
8. **D-LIB16R2-CLEAR:** the BARSTART lesson (#349 6542437139) applied from the start: a 2 px clearance test per row for every load and machine part, card contacts excepted, each with a 0-value mutation. Not a loosening: it adds checks only.
9. **D-LIB16R2-WAVES:** wave 1 goes to its panel first. If wave 2 is not approved when wave 1 is, the PR goes to review with only its approved rows (the D-LIB17-SPLIT form, lib4-cards :4470), and wave 2 continues as 'LIB-16 resume 3' on a new branch from main.
- Also for the supervisor, not this card: **D-TEMPLDIR-LIST**, the general fix for the "no templates folder" asserts (lib-17r3-card.md, last section).

## Risks and mitigations
- **rear_delt_fly has no zoom place** (the housing over the shoulders). Mitigation: measure the ladder in the PLAN; hold it under S4 with its route; it never blocks the other 8.
- **The front views read wrongly:** the pec deck pad in front of the chest drawn behind it (D-LIB16R2-PECDECK); low_to_high_cable_fly's hands meeting "at about face level" (card plate.end) cover the face in a front view. Mitigation: card truth wins (PANELS §1 point 5); a critic's finding on a card-true choice goes to the supervisor; a research follow-up if a source supports chin height.
- **A drawn fault falls under its bar** (high_to_low's crossing, machine_lateral_raise's over-raise). Mitigation: draw the card's fault at a plausible size listed as unsourced, then zoom; never enlarge (S2).
- **The two new composers draw a seated front-view lower body for the first time** (census note: "seated front view exists only in the engine gallery"; pec_fly's approved plate now shows the seated legs). Mitigation: hip_abduction first in wave 2; the composer's static parts are pinned per pose by A3.
- **A load part passes through the body** (the barbell_curl lesson). Mitigation: A5 from the first push; each clearance is in the PLAN before drawing.
- **LIB-SPINE merges mid-lane** (body.mjs changes). Mitigation: no row here uses its opt-in fields; merge main and re-run A2 and C0 at each milestone.
- **The incline anchor stays held**, so smith_machine_incline_press's sheet rolls. Mitigation: its approval stands; only the sheet waits.
- **Usage.** The owner's 80 % pause applies (PANELS §9). Mitigation: post WAITING with a HANDOFF block.

## Forecast [est]
- Builder, about 60 Opus-hours: PLAN 3 h; 9 H rows × 4.75 h = 43 h (plan 9: 4 h + 0.75 h QA, plan :894-897); 2 composers × 2 h = 4 h; rear_delt_fly's zoom 2 h; cards 4 h; tests and tooling 4 h.
- LB lanes needed 2-4 fix rounds (lib-15-card forecast), so allow up to about 110 h.
- Supervisor: the PLAN ruling; one CARD FIELDS verify plus a re-verify (9 cards); two panels plus rechecks; the review; the plan-marks docs action.
- Wave 1 can reach its panel about 1.5 days after start [est]. The calendar depends on the slot, the panel queue and LIB-SPINE's merge.
- Rows released if every step passes: 9 (smith_machine_incline_press's sheet waits for its anchor; rear_delt_fly is at risk under S4).
- Nothing visible ships, so no APK.

return: PR and head sha; links to PLAN, PLATES READY 1 and 2, CARD FIELDS and READY; the per-id table (mode, clone source, zoom region and k, flags, held or not); the LB6 page sha256 from two builds; A2's fragment table and diff output; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-16 resume 2' (sent to the session or posted on the PR).

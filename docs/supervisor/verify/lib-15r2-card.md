Card LIB-15R2: LB5 resume 2, the zoom rows and the T/H rows (2026-10-31; status `ready`; the supervisor confirmed rulings D-LIB15R2-1 to -9 below, lib4-cards §48. It starts on 'LIB-15 resume 2 start' when a LIB slot frees.)

Sources (every file:line was read at these heads; [unverified] marks the rest):
- main `151de0b8` (train 47) and #347 head `1f024b1f` (train 48: F-ZOOM-PITCH #342 + LB4 #289). Every number below was measured in a scratch worktree of `1f024b1f` and again on `151de0b8`: the two sweeps are identical, as D-ZOOM-PITCH says for unpitched plates (zoom/DESIGN.md:179 @ `1f024b1f`). No LB5 spec carries `camera.pitch`.
- At `1f024b1f`: C0 = [] (manifestProblems, 2.8 s); the LB5 page is `921cb1d52c6aea2e92db2eb01b216977242c58720e22c23b7601a9a986db1fd0` (380870 B, two equal builds, lb5/build.mjs). Pilot A L1 `5d0e562f…5ba8` (lib8-pin.test.ts:39), pilot B `ff3e017c…583f` (lib11-pilot-b.test.ts:279).
- claude/sup-lib4-cards `8870cc7e` (lib4-cards.md, lib-15-card.md, lib-8r-card.md, f-zoom-2-card.md, f-zoom-pitch-card.md); claude/sup-handover-1445 `9e69aebd` (HANDOVER.md, PANELS.md); plan claude/howto-options `c35e0a45`.
- Research head `a48b059400a74d5c9e3aceed21cf1aa67ab6f118` (claude/libht-research). The 7 T cards and quotes have the same blobs as at the LB5 research head `3812989f` (LR-29 VALID on all 16, lb5/DESIGN.md:5). The 4 zoom rows' cards on main equal `a48b0594` and already hold their 3 keys; incline_dumbbell_curl's card on main equals `a48b0594` and has no keys yet.
- hands/claims.json pins 12 claim texts of these cards (research `95342b1`); all 12 equal `a48b0594` (checked 10-31).

id: LIB-15R2
model: claude-opus-5-5 (zoom placement, two first-ever templates, 4 H redraws and the mode calls: judgement work)
mode: auto
title: 'Builder: LIB-15 resume 2, LB5 zoom rows and T/H rows'
branch: claude/lib-15-resume-2 (new, from the latest main; claude/lib-15-lb5 @ `e9f09858` is the old, merged branch). First push opens draft PR 'LIB-15 resume 2: LB5 zoom rows, T and H rows (build-ahead, nothing ships)'.
slot: plan 7 orders 15 (LB5a) and 16 (LB5b) (plan :812-813). The supervisor names the checklist slot in 'LIB-15 resume 2 start'.
lane: **one** LIB slot under D-LIB-LANE-ACTIVE (lib4-cards :1023). HANDOVER :829 had 4 of 4 active at 10-31 02:00; F-ZOOM-PITCH's slot frees when train 48 merges. The start message names the live count.
- Why one lane, not LB5a + LB5b: both halves must write the same lb5/ files: rows.json (the only rows file, lb5/build.mjs:19), tempo.json, cards.sha.json, DESIGN.md, qa.mjs (the expected-flag lists F7_IDS and F2_IDS, :48-50), build.mjs (SHEET_NOTES, :67-72) and tests/howto/lb5-plates.test.ts (HELD :28, OTHER :18-19, F7_IDS :25). Two branches would conflict on every push and each A5/A9 test would see the other's rows half-done. The work is also short per row; one builder with waves (Do) ships approved rows as early as two would.

## Why now
- The zoom route for held rows is on main (D-LIBZOOM-EXTEND, lib4-cards :4358-4369), with zoom.pair (F-ZOOM-2) and the pitch fix (F-ZOOM-PITCH, train 48). The 4 LB5 zoom rows have waited on it since lb5/DESIGN.md:330-335.
- The T rows' blocker is gone: "the byte proof needs triceps_pushdown / dumbbell_biceps_curl pinned" (lb5/DESIGN.md:71-72; D-LIB10-TEMPLATES, lib4-cards :3161-3164). Both parents are now pinned in pilot A (below).
- incline_dumbbell_curl waited for pilot A on main (lb5/DESIGN.md:12, :338). eq/inclineBench.mjs is on main.

## Zoom rows: measured (scratch, at `1f024b1f` and `151de0b8`; bars 22.11 / 11.39, qa/envelope.json:12-13; ladder 1.5-4, lb8-plates.test.ts:4762)

| id | plate scale (px/m) | failing bar | k 1.5 / 2 / 2.5 / 3 / 3.5 / 4 | circle; source ring | full QA at the pick | verdict |
|---|---|---|---|---|---|---|
| dumbbell_overhead_triceps_extension | 141.6; trace 46.26; deviation 10.56 (`arch`) | deviation | 15.85 / 21.13 / 26.41 / 31.69 / 36.98 / 42.26 | k 1.5: (260, 192); (167.16, 191.76) r 34.67, inside the frame | k 1.5: all 10 hard checks pass, node and browser. Flags F3 47.3 (< 49.33) and F4 0 (< 2) to fix or name, plus F5 | **released**, k 1.5 |
| cross_body_hammer_curl (front, no pitch) | 146.29; trace 52.58; deviation 7.31 (`shrug`) | deviation | 10.97 / 14.63 / 18.29 / 21.94 / 25.60 / 29.26 | k 2: (76, 172); (145.85, 124.67) r 26, inside | k 2: no zoom key is red. Owed, as renegade_row's were: H4.overlap normal arc\|shoulders and Mistake shrug\|ear (both red without the zoom too), and H1.ink:mistake:shrug (the `shrug` box sits on the source ring at (137, 100)). Flags F2 0.164, F4 0 to fix or name | **released**, k 2, with those fixes |
| wrist_curl | 146.29; trace 5.17 (raw path 15.54, trim [4, 6]); deviation 39.6 passes | trace | as drawn: no place at any k. With the "Forearm supported" box moved: 12.63 / 20.06 / 28.32 / 34.97 / 43.06 / 50.51 | k 3, box {112, 200}: (178, 140); (288.75, 251.62) r 17.33, inside | k 3 with that box: all 10 hard checks pass, node and browser. k 2.5 meets the bar but its ring (r 20.8) lies under the measure-arc label: H1.ink:normal:arc at (310, 251). Flags F3 94.8 (a Mistake tell leader, > 82.26) to fix or name; F2, F5, F7 as ruled | **released on D-LIB15R2-WRISTBOX**; else held |
| overhead_cable_triceps_extension | 133.79; trace 69.96; deviation 9.98 (`arch`) | deviation | no place at any k: figure and equipment ink alone blocks every r 52 place (labels and leaders switched off) | none | n/a | **held**: only a smaller circle, a bigger arch or a moved figure could pass, and each is a loosening or off the card |

- wrist_curl's blocker is placement, not the bar. The zoom keeps the plate's trim in screen px (f-zoom-2-card.md (b); zoom/inline.mjs:153), so the trace in the circle is about k × 15.54 − 10 px. No trim change is needed. With the box as drawn (wrist_curl.mjs:103, {254, 200}), the link from the source ring crosses that box at every place; with it moved, 118 box positions placed a circle at k ≤ 3 and {112, 200} and {104, 196} passed full QA (9 others did not).
- The F4 note's estimate (5.2 px × 4 = 20.8) assumed a trim that scales with k; the measure above replaces it.
- overhead_cable_triceps_extension follows cable_rear_delt_fly (f-zoom-2-card.md (c); D-LIB17-RDFHOLD, lib4-cards :4450). Its route is a sourced arch size (lb5/DESIGN.md:334) or a new readability convention ruled by the supervisor. It stays drawn and off rows.json.
- The Trace smoothness test (lb5-plates.test.ts:443-449: no turn over 6° or 2.5× the median) binds every row. cross_body_hammer_curl (10.8°, median 0.2°) and wrist_curl (4.0°, median 1.0°) are redrawn smooth first (lb5/DESIGN.md:422-423). The zoom numbers are then measured again; a row that falls below its bar is held.

## T and H rows (cards at research `a48b0594`; parents pinned on main)

Parents (registry rows in batches/pilot-a.json; plate entries in tests/howto/golden/library/pilot-a.json, approval #109 6382619662 @ `b68159de`):
- CURL: lib_dumbbell_biceps_curl, mode H (batches/pilot-a.json:160), entry pilot-a.json:261, normalSvg `eef9613e…8beb`, exemptions F2 F4 F5 F7; spec blob `8b13d7ab`. Feet shoulder-width (FOOT_X 0.14, dumbbell_biceps_curl.mjs:48), both arms supinated, dumbbell end-on (:123), Mistake elbows forward (:61-63, :154-157), tempo Curl 1 / Lower 2 (:145).
- PUSHDOWN: lib_triceps_pushdown, mode H (batches/pilot-a.json:224), entry pilot-a.json:383, normalSvg `066dd96d…13c9`, exemption F5; spec blob `ed31fa37`. Straight bar end-on (latBar, triceps_pushdown.mjs:167), 11° lean from the hips (:36), feet hip width (:38), Mistake lean and arch (:121, :197), tempo Press 1 / Hold 1 / Return 2 (:186).
- No template exists on main: no tools/plates/library/templates/ folder, and qa/param-ranges.json `families` is {} at `151de0b8` and `1f024b1f`. CURL and PUSHDOWN are the first. A T row needs its template file (candidate.mjs:113-114), the parent proof `make(parentParams, parentFacts)` (:131; qa/node.mjs:328-332) and a family row (qa/param-ranges.mjs; D-LIB10-RANGES 4, 4b, lib4-cards :3112-3123). Empty params are refused (qa/node.mjs:301, H10.empty).

| id | card parent | mode (D-LIB15R2-MODES) | what changes from the parent | new composer | drawable / F7 | sheet waits for |
|---|---|---|---|---|---|---|
| straight_bar_triceps_pushdown | triceps_pushdown | **T PUSHDOWN** | params `bar.kind: 'straight'` (c1; the parent's own bar, needed because {} is H10.empty). Poses, rig and the lean-and-arch builder are the parent's (c3, c4, c11 = the parent's c3, c4, c11). Facts: its own callouts, tells, cues, alt; tempo 1/2/1 (c12) = the parent's | none | true (c11) | the PUSHDOWN family row |
| barbell_curl | dumbbell_biceps_curl | **T CURL** | params `load.primitive: 'barbell'` (c1 "Grip a bar") and `stance.width` at hip width (c2; value and basis in the PLAN, e.g. triceps_pushdown's 0.22, :38). Bar end-on in the hands (vendor barbell). Mistake: the elbow-drift builder, one direction named in the PLAN (c5 back, c4 forward). Tempo 1/2/0 (c13) = the parent's | none | false; top fault wrists (c8): **F7** | CURL family row |
| ez_bar_curl | dumbbell_biceps_curl | **T CURL** | params `load.primitive: 'barbell'` (c1; the EZ bar end-on, D-LIB15R2-EZ). Stance c3 allows the parent's. Mistake: elbows forward at the top (c4, c5), the parent's builder. Tempo 1/2/1 (c14): adds Hold 1 | none | false; wrists (c8): **F7** | CURL family row |
| reverse_curl | none (`inherit` []) | **T CURL** (registry parent dumbbell_biceps_curl, D-LIB10-PARENTS, lib4-cards :3193-3197) | params `load.primitive: 'barbell'` (c1 overhand bar; EZ bar end-on, D-LIB15R2-EZ). Stance c2 allows the parent's. A new builder `swing` (c5). Tempo 1/2/0 (c15) | none | true (c5) | CURL family row; at ship, the variant line 'EZ Bar / Barbell' (src/data/exercises.json; D-LIB13-VLINE) |
| single_arm_triceps_pushdown | triceps_pushdown | **H** | outside PARAMS: torso vertical (c16, "torso aligned vertically") against the parent's 11° lean (:36); one arm (free-arm pose); single handle (c2). Clone triceps_pushdown (copy, D-LIB9-CLONE) | none: eq/dHandle.mjs on main (anchor single_arm_lat_pulldown, dHandle.mjs:1) | true (c17) | the dHandle anchor's pin, if the PLAN counts it as a shared rig (plan 3.1:298) |
| alternating_dumbbell_curl | dumbbell_biceps_curl | **H** | outside PARAMS: split stance (c3) and one arm curled while the other stays at the start (c1). Clone dumbbell_biceps_curl, with bayesian_cable_curl's split stance (lb5/DESIGN.md:391) | none | false; wrist (c7): **F7** | reverse_lunge pinned (D-LIB15R2-SPLIT) |
| hammer_curl | dumbbell_biceps_curl | **H** | outside PARAMS: split stance (c2) and neutral grip (c1), so the dumbbell is drawn side-on (vendor `dumbbell` `axis`, as dumbbell_overhead_triceps_extension) | none | true (c6, c4) | reverse_lunge pinned (D-LIB15R2-SPLIT) |
| incline_dumbbell_curl | none | **H** (plan; D-LIB15-INCLINE) | clone dumbbell_biceps_curl; imports `../eq/inclineBench.mjs` from main (lb5-plates.test.ts:360-361) | none | false; wrists (c11): **F7** | incline_dumbbell_press pinned (LB2 row at stage drawing, lb2/rows.json:24-30) |

- No new composer. The two templates are new tool files, not composers.
- PUSHDOWN keeps plan 3.1:275's eligibility (4 members: triceps_pushdown, rope_triceps_pushdown, straight_bar_triceps_pushdown, single_arm_triceps_pushdown), although only one child is T.

## Files it may touch (write_scope)
- New: tools/plates/library/specs/{straight_bar_triceps_pushdown, single_arm_triceps_pushdown, alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, reverse_curl, incline_dumbbell_curl}.mjs; tools/plates/library/templates/{CURL, PUSHDOWN}.mjs; tools/plates/library/howto/lib_<the 7 T-card ids>.howto.mjs (`id` and `research` only, D-LIB9a-HOWTOID).
- Edited, only as ruled: specs/{dumbbell_overhead_triceps_extension, cross_body_hammer_curl, wrist_curl}.mjs. Allowed: the `zoom` field, the ruled box moves, the layout and flag fixes in the table, and the Trace re-keying (cross_body_hammer_curl, wrist_curl). No pose, fault size, fact or equipment value changes.
- tools/plates/library/lb5/{rows.json, tempo.json, DESIGN.md (a 'Resume 2' section; the held table updated), cards.sha.json, build.mjs (SHEET_NOTES), qa.mjs (EXPECTED lists)}; tests/howto/lb5-plates.test.ts.
- docs/research/howto/cards/ and quotes/ for the 7 T ids: byte copies from `a48b0594`, then the 3 keys on those 7 and on incline_dumbbell_curl. The supervisor merges the field commit back to research.
- docs/COACHING-DECISIONS.md: append one entry (keep both sides on a merge).
- **Never:**
  - qa/** (param-ranges.json comes only from the supervisor's PR, D-LIB10-RANGES 4b), zoom/**, vendor/**, layers/**, derive.mjs, candidate.mjs, registry.mjs, build-page.mjs, plates-page.mjs, golden.mjs, MANIFEST.json;
  - batches/**, tests/howto/golden/**, pages/**, pilot-a/**, pilot-b/**, src/**, gen/**;
  - every existing eq/ file (inclineBench, dHandle, rope and parts are imported only);
  - specs/overhead_cable_triceps_extension.mjs, the 4 approved LB5 specs (preacher_curl, cable_curl, bayesian_cable_curl, concentration_curl), every pilot A spec (dumbbell_biceps_curl.mjs and triceps_pushdown.mjs included) and every other lane's files;
  - .github/**, scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css, package*.json.
- Collision check (10-31; `git diff --name-only origin/main...<head>`): #337 `1273e4f6`, #340 `4dc78aad`, #343 `037b02a4`, #345 `b267266b` and #346 `101dec25` touch none of these paths. #347 `1f024b1f` touches qa/engine.mjs and zoom/inline.mjs (read only here). The only shared write is the COACHING-DECISIONS append.

## Do (waves, so the approvable rows reach a panel first)
1. **RESUME PLAN** in lb5/DESIGN.md, posted as 'LB5 R2 PLAN READY @ <sha>'. Wait for 'LB5 R2 PLAN RULED'. Base: main with train 48; if it has not merged, start on `151de0b8` and merge main when it lands (the numbers above do not move). The plan gives:
   - the zoom table above, re-measured on your base, with each row's region and k; the wrist_curl box position; the fix or named-flag proposal for each listed flag;
   - the mode map and why (table above); the plan-marks change (LB5 becomes P2 T4 H13; rope_triceps_pushdown is pinned H, batches/pilot-a.json) is a supervisor docs action;
   - per template: parentParams and parentFacts; the closed facts schema; the fault builders and their bounded magnitudes (D-LIB10-FACTS, lib4-cards :3179-3184); the proposed family rows, each bound or value with its basis (D-LIB10-RANGES 3), for the supervisor's PR;
   - per T row: params, each with its own card claim; per H row: the clone source;
   - the tempo, pose and fault→key maps for the 8 new cards (as lb5/DESIGN.md:154-217); the facts plan (D-LIB8M-FACTS, D-LIB13-FACTS2); the unsourced numbers; a PQ-H3 estimate per new row;
   - the expected flags per row (F7 on alternating_dumbbell_curl, barbell_curl, ez_bar_curl, incline_dumbbell_curl; the CURL children's inherited F2/F4 [unverified until drawn]).
2. **Cards at start:** copy the 7 T cards and quotes from `a48b0594` and update cards.sha.json.
3. **Wave 1, the zoom rows**, in this order: dumbbell_overhead_triceps_extension (passes at k 1.5 today), then cross_body_hammer_curl, then wrist_curl.
   - Apply the zoom fields, the ruled box moves and the fixes; re-key the two Traces smooth; re-measure.
   - Move each zoom row into rows.json and out of HELD; overhead_cable_triceps_extension stays held with its route.
   - QA (Do 6), then 'LB5 R2 PLATES READY 1 @ <sha> (page <sha256>)'.
   - The supervisor runs PANELS §1 on the 3 plates: hidden anchors golden B's pull_up and lat_pulldown (D-LIB14-ANCHORS, lib4-cards :4421), 2 plants, R11 for every zoom plate.
4. **Card fields** after RULED: write the 3 keys on the 8 new cards (incline_dumbbell_curl's once drawn), then 'LB5 R2 CARD FIELDS READY @ <sha>'. The supervisor runs PANELS §3 once for the 8 (one plant). Fix only what it names; a focused re-verify follows.
5. **Wave 2a, the H rows:** incline_dumbbell_curl, single_arm_triceps_pushdown, alternating_dumbbell_curl, hammer_curl, following DRAWING-GUIDE.md and the lane lessons (lib-15-card Do 7).
6. **Wave 2b, the T rows.** Templates first:
   - templates/CURL.mjs and templates/PUSHDOWN.mjs copy their parent's code (D-LIB9-CLONE). `make(parentParams, parentFacts)`, rebuilt alone, must equal the parent's 9 pinned fragments before any child is drawn.
   - Then barbell_curl, ez_bar_curl, reverse_curl, straight_bar_triceps_pushdown, each as `export const facts = {...}; export default make(<row.params>, facts)`.
   - Their QA counts only after the supervisor's family rows are on main and merged in.
7. **QA** for every row in rows.json: two builds of the LB5 page with equal sha256, then runQa node and browser per id on candidateOf(id, { all, authoring: true }), zero exemptions. Post the table. Then 'LB5 R2 PLATES READY 2 @ <sha> (page <sha256>)' and a PANELS §1 run on the wave 2 plates. One fix round, then a focused recheck; a second failure holds the id (D-LIB8M-CARDTRUE).
8. **Merge** origin/main with a merge commit, re-run A2 and A12, post 'LB5 R2 READY @ <sha>'. A fresh Opus review follows. If wave 2 is not approved when wave 1 is, D-LIB15R2-WAVES applies.

Stops (post on the PR and wait; never work around one):
- S1 Any pilot A, pilot B or other LB page byte moves, any of the 4 approved LB5 plates' fragments moves, or C0 is not [].
- S2 A zoom bar is met only with k > 4, r < 52, a trim change, a second label move or a body, fault or equipment change. The row is held; never loosened.
- S3 A template's parent proof fails after two tries with no new evidence. Its T rows become H only by a new ruling.
- S4 A card's facts cannot hold together on the body (D-LIB10-BENCH-H), or a fault the engine cannot draw (never edit the engine).
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
- **A1 Scope.** rows.json holds exactly the drawn, unheld ids (the 4 approved, the released zoom rows and the 8 new), each once, each with the ruled mode; T rows carry `parent`, `template` and `params`. overhead_cable_triceps_extension is in no rows file and is in DESIGN.md's held table with its route. OTHER (lb5-plates.test.ts:18-19) shrinks to the 3 pilot A ids, and each is still red if added.
  Evidence: lb5-plates A5. Mutations: overhead_cable_triceps_extension added; rope_triceps_pushdown added; a T row set to H; a row duplicated.
- **A2 Nothing else moves** (recorded check plus test).
  - The 4 approved LB5 plates' 9 fragment shas each equal their values on page `921cb1d5…1fd0` (36 equalities), so their approvals carry.
  - Pilot A L1 gives `5d0e562f…`/1325644, pilot B gives `ff3e017c…`, and every other registry page's sha is equal before and after (listed in the PR).
  - C0 is []. `git diff --exit-code origin/main...HEAD` is empty on the Never paths.
  Mutation (temporary worktree): one byte in preacher_curl.mjs's alt turns its fragment check red; one byte in specs/dumbbell_biceps_curl.mjs turns C0 red on the 13 pilot A rows and L1 red.
- **A3 Zoom rows** (D-LIBZOOM-EXTEND).
  - Each zoom is the PLAN's region and k. No H2.zoom, H3.zoom or H4.zoom key is red. The source ring closes inside the frame (D-LIB22-RINGFIT, lib4-cards :4448), and no smaller ladder k passes every check (the lb8-plates.test.ts:4760-4776 form).
  - Pinned (±0.01): dumbbell_overhead_triceps_extension 15.85 at k 1.5; cross_body_hammer_curl 14.63 at k 2; wrist_curl 34.97 at k 3, or the re-measured values after the Trace re-keying, posted with their basis.
  Mutations: cross_body_hammer_curl at k 1.5 (10.97); wrist_curl at k 2 (20.06); the dumbbell extension's zoom removed (H3.deviation, 10.56); "15°" planted in a zoom (H2.zoom:angle); wrist_curl's box back at {254, 200} (no place).
- **A4 Only ruled moves.** For each zoom row, the spec export minus `zoom` and the ruled boxes, JSON-serialised, equals its sha256 at `151de0b8` (pinned in the test). Each moved box's leader still ends on its named part (D-LIB18-ZOOMPLACE, lib4-cards :4412).
  Mutations: a second box moved; a pose value changed by 1°.
- **A5 Templates.** The parent proof through each template equals the pinned fragments (H10.byte clear). Every T row passes H10.child. Each facts schema is closed.
  Mutations: one byte of a template constant (H10.byte); a `poses` key in facts (throws); a T spec built with params other than row.params (H10.child); `template` removed from a row (candidateOf throws).
- **A6 Params.** Each T row's params are PARAMS keys inside its family row on main, each with its own card claim in rows.json.
  Mutations: `bar.kind: 'rope'` on straight_bar_triceps_pushdown (H10.value); a param with no claim; params {} (H10.empty).
- **A7 QA.** Every hard check passes per id, node and browser. The raised flags equal the ruled set exactly (qa.mjs EXPECTED). F7 is raised on the 6 ruled ids, and each of their topFaults differs from the drawn key.
  Mutations: LIB-3's M1-M7 (qa/mutations.mjs) on one new plate; one F7 id's topFault set to its drawn key.
- **A8 Modes are card-true** (drawn-item tests). single_arm_triceps_pushdown's torso is within ±2° of vertical (c16); alternating_dumbbell_curl's and hammer_curl's feet are split front-to-back (c3, c2); hammer_curl's dumbbell axis is sagittal (c1); the T children's poses equal their parent's.
  Mutations: single_arm_triceps_pushdown's torso leaned 11°; hammer_curl's dumbbell end-on.
- **A9 Cards.** Each of the 8 cards differs from its `a48b0594` blob only in the 3 keys (cards.sha.json), and validateCardFile gives []. The tempo follows D-LIB8M-TEMPO. CARD FIELDS VERIFIED, with the plant caught.
  Mutations: another key edited; seconds changed on one card and its spec; the verifier's plant.
- **A10 Trace smoothness.** lb5-plates.test.ts:443-449 holds on every row, cross_body_hammer_curl and wrist_curl included. Mutation: cross_body_hammer_curl's main keys (10.8°).
- **A11 Nothing ships.** The existing A9 asserts cover the new ids. The `hammer_curl` matcher does not match `lib_cross_body_hammer_curl`, the only other substring hit in exercises.json (checked 10-31). Mutations: one row set to shipped; the hammer_curl matcher swapped for a plain substring test.
- **A12 Panel and green.** Each wave is VALID under PANELS §1, with both plants caught and R11 scored for each zoom plate. Approvals are per id, at that head. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head, and CI is green.
  Mutation: the panel plants. A12 relies on the mutations above.

## Rulings recorded (confirmed by the supervisor, 2026-10-31)
1. **D-LIB15R2-LANE:** one lane (lane line above).
2. **D-LIB15R2-ZOOM:**
   - Released: dumbbell_overhead_triceps_extension at k 1.5, cross_body_hammer_curl at k 2, wrist_curl at k 3 (with ruling 3).
   - Held: overhead_cable_triceps_extension. It has no r 52 place at any k, because ink alone blocks every place. This is the D-LIB17-RDFHOLD form. Route: a new placement convention by supervisor ruling, never a smaller circle or a loosened check.
3. **D-LIB15R2-WRISTBOX:** wrist_curl's normal-view "Forearm supported" box (wrist_curl.mjs:103) may move under D-LIB18-ZOOMPLACE's terms, as D-LIB21-SUPERMAN allowed for superman's `low` box (lib4-cards :4465). This is not a loosening: no check, trim, pose or fact moves. k 3 is the smallest ladder k that passes every check with one moved box.
4. **D-LIB15R2-MODES:**
   - T: straight_bar_triceps_pushdown (PUSHDOWN); barbell_curl, ez_bar_curl, reverse_curl (CURL).
   - H: single_arm_triceps_pushdown, alternating_dumbbell_curl, hammer_curl, with the reasons in the table.
   - Why: plan 3.1:272 and D-LIB10-FACTS: a pose or stance outside PARAMS makes the row H, as D-LIB10-BENCH-H and D-LIB14-MODES did.
5. **D-LIB15R2-EZ:** an EZ bar is the vendor barbell end-on with the template's own plate size, and no row takes `bar.kind: 'ez'` (D-LIB10-NOTE Q3; preacher_curl's D-LIB15-PREACHER). So skull_crusher does not gate ez_bar_curl or reverse_curl. The camber is frontal (lb5/DESIGN.md:89-90).
6. **D-LIB15R2-RANGES:** the CURL and PUSHDOWN family rows reach main through one supervisor PR, claude/sup-param-ranges (D-LIB10-RANGES 4b), with a fresh review, before any T row's QA counts.
7. **D-LIB15R2-SPLIT:** D-LIB15-SPLIT's stricter reading binds alternating_dumbbell_curl (c3) and hammer_curl (c2). They are drawn now, and their sheets wait for reverse_lunge, which is held behind F-REVLUNGE-ARCH and LIB-SPINE (lib4-cards :4487).
8. **D-LIB15R2-F7:** F7 is expected on alternating_dumbbell_curl, barbell_curl and ez_bar_curl, in addition to D-LIB15-F7's three. Each is named at the sheet (plan 3.3:337-339).
9. **D-LIB15R2-WAVES:** wave 1 goes to its panel first. If wave 2 is not approved when wave 1 is, the PR goes to review with only its approved rows (the D-LIB17-SPLIT form, lib4-cards :4470), and wave 2 continues as 'LIB-15 resume 3' on a new branch from main.

## Risks and mitigations
- **A template's parent proof misses by a byte** (START_FORE and MIS_ARM are probe-built, dumbbell_biceps_curl.mjs:89-114). Mitigation: copy the code verbatim and prove the parent before any child; S3.
- **The Trace re-keying moves a zoom number** below its bar. Mitigation: re-measure; hold the row (S2).
- **wrist_curl's moved box fails a later critic item** (R4 or R7). Mitigation: {104, 196} is a second measured position; otherwise the row is held.
- **The engine fist cannot show reverse_curl's overhand grip** (no forearm rotation, lb5/DESIGN.md:302) [unverified until drawn]. Mitigation: card truth wins (PANELS §1 point 5). The grip is the hand close-up's job at ship.
- **straight_bar_triceps_pushdown draws the same as its parent.** That is card-true (its cards c1, c3, c4 and c11 match the parent's). Mitigation: the panel sees it beside its parent; H10.child proves the drawing.
- **The split and incline anchors stay held at sheet time** (reverse_lunge, incline_dumbbell_press): dumbbell_overhead_triceps_extension, bayesian_cable_curl, alternating_dumbbell_curl, hammer_curl and incline_dumbbell_curl roll (plan 3.5:376). Mitigation: their approvals stand; only their sheets wait.
- **The family-rows PR is late.** Mitigation: waves 1 and 2a do not need it.
- **Another lane changes a shared input** (eq/parts.mjs and eq/rope.mjs are in 17 and 13 pinned closures). Mitigation: import only; A2 and C0 at every milestone.
- **Usage.** The owner's 80 % pause applies (PANELS §9). Mitigation: post WAITING with a HANDOFF block.

## Forecast [est]
- Builder, about 53 Opus-hours:
  - PLAN 3 h;
  - wave 1: 7.5 h (about 2 h per zoom, as lib-8r-card.md's forecast, plus the layout and re-key fixes);
  - wave 2a: 4 H rows × 4.75 h = 19 h (plan 9 :894, :897);
  - 2 templates × 3 h = 6 h [est; no plan pace for a template on a pinned parent];
  - 4 T rows × 2.25 h = 9 h;
  - cards 4 h; tests and tooling 4 h.
- LB lanes needed 2-4 fix rounds (lib-15-card forecast), so allow up to about 100 h.
- Supervisor: the PLAN ruling; the family-rows PR and its review; one CARD FIELDS verify plus a re-verify (8 cards); two panels plus rechecks; the sheet calls.
- Wave 1 can reach its panel about a day after start [est]. The calendar depends on the lane slot, the panel queue and train 48.
- Rows released if every step passes: 11 (3 zoom + 4 H + 4 T). overhead_cable_triceps_extension stays held.
- Nothing visible ships, so no APK.

return: PR and head sha; links to PLAN, PLATES READY 1 and 2, CARD FIELDS and READY; the per-id table (mode, zoom region and k, flags, held or not); the LB5 page sha256 from two builds; A2's fragment table and diff output; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-15 resume 2' (sent to the session or posted on the PR).

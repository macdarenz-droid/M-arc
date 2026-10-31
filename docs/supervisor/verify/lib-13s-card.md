Card LIB-13S: the LB3 shrugs and t_bar_row, drawn H with zooms (2026-10-31; status `ready`: the supervisor confirmed rulings D-LIB13S-1 to -10 below as written (lib4-cards §48). It starts on 'LIB-13s start' when a LIB slot frees.)

Sources (every file:line was read at these heads; [est] marks an estimate, [unverified] what no run here checked):
- main `de3f503c` (train 52), scratch worktree, npm ci. Train 53 then merged (#357 → main `6b32d576`). Its diff touches no file under qa/, zoom/, vendor/, lb3/, eq/ or specs/{barbell_shrug, t_bar_row}.mjs, so every number below holds on `6b32d576`. The test lines quoted from lb3-plates.test.ts and lib8-pin.test.ts were re-read at `6b32d576`.
- The LB3 page on main is `6ff09d4c144f90d7210f951eb23fe81b42f55d20478bc4b8bb1d2b3980d008c6` (705596 B; two equal builds, lb3/build.mjs:37). That is the approved panel page (D-LIB13-PANEL3, lib4-cards §31). Pilot A L1 is `5d0e562f…`/1325644 (lib8-pin.test.ts) and pilot B is `ff3e017c…` (lib11-pilot-b.test.ts:279).
- claude/sup-lib4-cards `aa985b8b` (lib4-cards.md, lib-13-card.md, lib-15r2-card.md, lib-16r2-card.md, lib-17r3-card.md); claude/sup-handover-1445 `af199b64` (HANDOVER.md, verify/PANELS.md); plan claude/howto-options `d8d4b2e6`; #354 comments 6543628951 (LB6 R2 PLAN RULED), 6544339239 (cflb6r2) and 6544652523 (mx12).
- Research head `a48b059400a74d5c9e3aceed21cf1aa67ab6f118`. The card and quotes blobs of barbell_shrug, dumbbell_shrug, cable_shrug and t_bar_row equal those at the LB3 research head `892d6516`. smith_machine_shrug's equal those at the LB6 head `a8e66f32` (LR-29 VALID). validateCardFile gives [] on all 5. t_bar_row's card is already on main: it equals `a48b0594` plus its 3 keys (topFault 'round', plateFacts [], tempo Pull 1 / Hold 1 / Lower 2).
- Scratch measures (scripts in the supervisor's scratchpad `lb13s/s/`, never committed): zoomOf / clippedTrace ladders (zoom/inline.mjs:129, qa/zoom.mjs:48); full runQa node and browser on scratch LB3 pages; drawn-outline distances on `bodyShapes` with the engine's spline; spec variants written into the scratch worktree only. dumbbell_shrug was measured on a scratch front-view prototype (upright_row's stance, dumbbells at the grips), not a drawn spec.

id: LIB-13S
model: claude-opus-5-5 (5 plates with zooms, clearance fixes, a front view and a Smith rig: judgement work)
mode: auto
title: 'Builder: LIB-13s, LB3 shrugs and t_bar_row with zooms'
branch: claude/lib-13s (new, from the latest main; claude/lib-13-lb3 is merged, so lib-13-card.md:358's "same branch and PR" no longer applies). The first push opens draft PR 'LIB-13s: shrugs and t_bar_row with zooms (build-ahead, nothing ships)'.
slot: plan 7 order 13 (LIB-13 = LB3, plan :810). The supervisor names the checklist slot in the start message.
lane: **one** LIB slot under D-LIB-LANE-ACTIVE (lib4-cards :1023). HANDOVER :856 had 2 active at 10-31 14:40 (LIB-16 resume 2, LIB-17 resume 3). The owner's 10-31 note names this card for a free slot (HANDOVER :857). smith_machine_shrug is an LB6 id (plan :745). It is drawn here with its parent: lb6/rows.json is LIB-16R2's file, and #354's NOT_HERE keeps it out of LB6 (lib-16r2-card.md A1).

## Why now
- lib-13-card.md ruling 6 (:321) holds the shrugs until LIB-ZOOM's convention is ruled and extended to them. D-LIBZOOM-EXTEND does both (lib4-cards :4358-4369: "any held row whose drawn fault or fact is too small at plate scale (the D-LIB8-shrug holds)"). The held inventory counts these 4 LB3 rows in its group D (route on main, no lane started; held-inventory.md §5 row D, §6).
- A normal-view zoom on a Trace has an approved precedent: wrist_curl at k 3 (mx8, lib4-cards §48).
- t_bar_row's anchor landmine_row is approved (lib4-cards :4233, @ `8781ed0`). smith_machine_shrug's rig (eq/smith.mjs) is pinned and already names it as a later user, needing only `stopY` (smith.mjs:18).
- No row needs a new composer or template, and no other lane writes LB3 files (collision check below).

## Modes: all 5 are H
A T row may set only derive.mjs's 7 PARAMS keys (derive.mjs:4-12). It may not change the view (derive.mjs:19). LB3's own rule builds a template only if at least 3 members, parent included, qualify (lb3/DESIGN.md:19-23; D-LIB13-MODES, lib-13-card.md :319).

| id | tier | view | plan mark | mode and why | clone source (copy, never import; D-LIB9-CLONE) | rig | drawable / F7 |
|---|---|---|---|---|---|---|---|
| barbell_shrug | A | side | P:SHRUG (pA) | **H**: the existing pilot A spec, held (pilot-a/plates.json:55-60). Reserved for this card (D-LIB8R-SCOPE, lib4-cards §46). SHRUG is not built (ruling 2) | itself (specs/barbell_shrug.mjs on main) | vendor barbell (plates at z back), floor | false: top fault rolling (c3); drawn bent arms (c4). **F7** |
| t_bar_row | A | side | T (HROW) | **H**, unchanged (lb3/DESIGN.md:26-30, :53): the landmine rig is not a `load.primitive` or `bar.kind` value (derive.mjs:7-9), and HROW is not built | itself (specs/t_bar_row.mjs on main) | eq/landmine.mjs unedited, vendor vHandle | true (c7) |
| cable_shrug | B | side | T (SHRUG) | **H**: its pose and stance are inside PARAMS (`load.primitive: 'cable'`; c2, c4 match the parent's c2, c4). But SHRUG has 2 qualifying members of 3 (barbell_shrug, cable_shrug; smith_machine_shrug fails), under lb3/DESIGN.md:23's 3. It is the dumbbell_romanian_deadlift case (lb3/DESIGN.md:31-35) | barbell_shrug | vendor cableColumn, low pulley, straight bar | true (c5) |
| dumbbell_shrug | B | front | H | **H**: front view (a child never changes the view, derive.mjs:19). The dumbbells hang at the sides (c1), against the parent's bar in front (c4): a hand place, which is a pose | upright_row (pilot A, front, standing); barbell_shrug for the shrug | vendor dumbbell ×2, end-on | true (c6) |
| smith_machine_shrug | B | side | T (SHRUG) | **H**: PARAMS has no Smith value (D-LIB16R2-SQUAT, lib-16r2-card.md). The "slight elbow bend" (c1) is a pose, against the parent's full reach (barbell_shrug.mjs:57). The head-forward fault (c3) is a new builder | barbell_shrug; smith_machine_bench_press (pilot B) for the rig | eq/smith.mjs unedited (`stopY`, `base`) | true (c3) |

- No template, no family row and no ranges PR. LB3's mark for cable_shrug and LB6's for smith_machine_shrug change from T to H, so LB6 becomes D0 P2 T0 H14 (supervisor docs action).
- D-LIB15R2-TPARENT does not apply: there is no T child, so the drawn-item tests bind every drawn item of every row in full.
- LB5 built PUSHDOWN for one T child by counting every family member (lib-15r2-card.md, "PUSHDOWN keeps plan 3.1:275's eligibility"). That reading does not change the result here. A T child's H10 needs its parent's plate entry in tests/howto/golden/library (candidate.mjs:36-48), and barbell_shrug is in no batch or golden file (lib8-pin.test.ts:38 STILL_HELD). Pinning it is a pilot-lane step (the PILOT-A2 form: batch, plates and layers pages, golden entries), outside a build-ahead lane.

## Measured (scratch; bars 22.11 / 11.39 px, qa/envelope.json:12-13; ladder 1.5-4, zoom/inline.mjs:15; every plate 146.29 px/m)

**PQ-H3 and zooms** (the zoom keeps the plate's Trace trim in screen px, zoom/inline.mjs:154-156; f-zoom-2-card (b)):

| id | plate scale | failing bar | zoom ladder k 1.5 / 2 / 2.5 / 3 / 3.5 / 4 | circle; source ring | full QA at the pick | verdict |
|---|---|---|---|---|---|---|
| barbell_shrug | Trace 7.01 px (5 cm `scap.elev`, shoulderTop.r rises 7.31 px; trim [0, 0], barbell_shrug.mjs:172); deviation 28.92 (`elbows`) | Trace | 10.52 / 14.02 / 17.52 / 21.02 / **24.54** / 28.04 | k 3.5: (110, 274); (176, 122.99) r 14.86, inside the frame | k 3.5, with the CLEAR fix below: every hard check passes except H6 (no card keys yet). Flags F2 0.139, F3 45.79, F4 0, F5 3.57, F7 | **released at k 3.5** after the CLEAR fix |
| t_bar_row | Trace 0 (raw 16.9 px, trim [10, 12], t_bar_row.mjs:179; hand rise 10.8 cm); deviation 13.05 (`round`) passes | Trace | trim as is: 3.17 / 10.56 / 19.37 / **27.47** / 35.74 / 43.67. Trim [0, 0]: 24.3 at k 1.5 | k 3: (200, 128); (258.62, 281.07) r 17.33, inside | on main: **H1.engine red** (feet plant 1.0 cm > 0.5, all 3 poses; plate.mjs:294) and **H2.alt** (53 words > 51). With the feet fix (ruling 5): only H2.alt left; k 3 gives 27.23 px; flag F5 only | **released at k 3** after the feet and alt fixes. No trim change (k 3 passes with the spec's own trim) |
| cable_shrug | the parent's body and trace point: 7.01 px [est until drawn] | Trace | as barbell_shrug [est] | [est]: the column stands ahead of the toes, right of the parent's circle (x 58-162) | n/a | k 3.5 [est] |
| dumbbell_shrug (front) | prototype: Trace 7.01 px (shoulderTop.r rises 7.31 px). Tells: the dumbbell (grip.l) moves 21.94 px; the elbow only 10.20 px | Trace | prototype: 10.52 / 14.02 / 17.52 / 21.02 / **24.54** / 28.04 | prototype k 3.5: (76, 188); (145.85, 123.71) r 14.86, inside | n/a | k 3.5 [est until drawn: the drawn labels may move the place] |
| smith_machine_shrug | Trace as the parent's [est]; Mistake: neck flexion moves the crown (`head`) 9.78 / 13.01 / 16.22 px at 15 / 20 / 25°, the `ear` 5.11 / 6.80 / 8.48 px | Trace; Mistake if its drawn size is under 11.39 | normal k 3.5 [est]; Mistake at the smallest passing k, e.g. 15° on `head`: 14.67 at k 1.5 | [est] | n/a | normal k 3.5 [est]; Mistake zoom only if the PLAN's size needs it |

- So at k 3, every shrug's Trace is 21.02 px, under 22.11. k 3.5 is the smallest ladder k (A3).
- Each shrug's elevation is the parent's unsourced 5 cm (barbell_shrug.mjs:55; 7 cm "read as exaggerated", :17-18). dumbbell_shrug c10's "slightly longer range" gives no number, so it is never enlarged to pass (Q-D5-3).
- The engine neck only flexes (body.mjs:124, `rotX(q.neck)`), so smith_machine_shrug's "head pushed forward" (c3) draws as a tipped head. Its size is unsourced and the PLAN names it. No size is chosen to pass a bar.

**Clearance** (D-LIB16R2-CLEAR scope as ruled on #354 6543628951 point 1: parts in the body's own plane are tested at 2 px = 1.37 cm; parts beside the body in depth are listed, not tested; the bar shaft binds, not the end-on plates, per the BARSTART amendment, lib4-cards :4521):

| id | part, pose | on main | fix (measured in scratch) |
|---|---|---|---|
| barbell_shrug | bar shaft to thigh, start and end | **0.44 px** (BAR_GAP 3 mm, barbell_shrug.mjs:56). Not a card contact: c4 says "in front of your body" | BAR_GAP 15 mm: 2.19 px (14 mm: 2.05) |
| barbell_shrug | bar shaft, Mistake (M_PULL 15 cm, :124-128) | **−3.26 px, inside the torso**. The bar is solved on the near thigh alone (thighFront, :80-86); at 0.94 m the belly is ahead of the thigh | solve on the front of both thighs and the torso: 2.17 px. The `elbows` deviation becomes 25.76 px (passes) |
| t_bar_row | plate to torso, end | 0.46 px: c23's contact ("before the plates make contact with your torso"), excepted | none |
| t_bar_row | bar to rounded torso, Mistake (MIST_A, t_bar_row.mjs:129) | **0.47 px**. c23 covers the plates at the right end, not the bar in the Mistake | the Mistake rise stops at 16 mm on the raw outline: bar 2.14 px, plate 3.37 px. Deviation 13.05 and the zoom unchanged |
| t_bar_row | landmine bar from the pivot to the hook, against the legs | −7.4 to −9.7 px in 2D. It runs between the straddled legs (c24): listed | none |
| dumbbell_shrug (prototype) | end-on hex (11.9 cm across, equipment.mjs:30) to thigh, front view | hands at x ±0.26 m: 2.57 / 3.07 / 4.07 px (start / end / Mistake); ±0.255: 1.84; ±0.25: 1.10 | hands at ±0.26 m or wider (shoulder joints at ±0.227 m) |
| cable_shrug | bar shaft | as barbell_shrug's fix: 2.19 / 2.17 px [est] | |
| cable_shrug | cable to legs, low pulley top 0.205 m (cable_curl.mjs:74's 16 cm pulley) at z 0.25-0.45 m (toe tip 0.210) | ≥ 4.22 px. The cable also passes in front of the legs in depth, so it is listed either way | |
| smith_machine_shrug | Smith bar end (r 2.5 cm, smith_machine_bench_press.mjs:50) to thighs | body front is z 0.080-0.083 m over heights 0.65-0.85 m (0.099 at 0.90) | rail z ≥ 0.122 m keeps 2 px for any bar travel inside 0.65-0.85 m [computed]. Rails, hook rail, stops, frame and base are listed |

**t_bar_row's feet** (found here; H1.engine is red on main): the plant error is 1.0 cm at FOOT_X 0.2266 m with toes out 5° (t_bar_row.mjs:41), whatever the knee angle (20 / 25 / 30°: 1.0 cm). Measured stance by plant error: 0.20 / 5°: 0.8 cm; 0.19 / 5°: 0.7; 0.165 / 5° (landmine_row's stance): 0.5; 0.2266 / 20°: 0.6; **0.19 / 17°: 0.4**; 0.18 / 20°: 0.3. This is upright_row's engine limit ("the engine's foot does not model eversion", upright_row.mjs:15-18: FOOT_X 0.18 with toes out 17°). The side view drops x (plate.mjs:44-45), so the stance width does not show. The 17° toe-out shortens the drawn foot by about 4 % (cos 17° = 0.956).

**F-LB3-4 is open** at `a48b0594`. barbell_shrug.json last changed in `c6d2930b`, inside LB3's research head `892d6516`. Its shown copy still has semicolons, for example posture[1].point "Arms straight; the shoulders do the lifting." (lb3-research-verify.md: 5 semicolons, one label over 5 words, one row over 6 words).

## Files it may touch (write_scope)
- New: tools/plates/library/specs/{dumbbell_shrug, cable_shrug, smith_machine_shrug}.mjs; tools/plates/library/howto/lib_{barbell_shrug, dumbbell_shrug, cable_shrug, smith_machine_shrug}.howto.mjs (`id` and `research` only, D-LIB9a-HOWTOID).
- Edited, only as ruled:
  - specs/barbell_shrug.mjs: the `zoom` field, BAR_GAP and the body-front solve, the flag fixes the PLAN names. No other pose, fault-size or fact change.
  - specs/t_bar_row.mjs: the `zoom` field, FOOT_X / TOE_OUT, the Mistake stop at 2 px and the alt text (≤ 51 words). Trace trim, plate size, HOOK and the card-true end stay.
- tools/plates/library/lb3/{rows.json, tempo.json, cards.sha.json (a separate LIB-13s section; the 8 entries and `researchHead` stay byte for byte), DESIGN.md (a 'LIB-13s' section; held table section 13), build.mjs (SHEET_HELD :88-93, sheet notes), qa.mjs (expected flags)}.
- tests/howto/lb3-plates.test.ts: LIB-13's own blocks, which LIB-13s inherits (lib-13-card.md :1): SHRUGS :17, HELD :65, A5 :69-116 (the templates line :114 stays byte for byte), A9 :118, A11 :201 (new cards from `a48b0594`), a new approved-fragments block, and new drawn-item, clearance and zoom blocks.
- docs/research/howto/cards/ and quotes/ for barbell_shrug, dumbbell_shrug, cable_shrug, smith_machine_shrug: byte copies from `a48b0594`, then the 3 keys. The supervisor merges the field commit back to research.
- docs/COACHING-DECISIONS.md: append one entry (keep both sides on a merge).
- **Never:**
  - qa/**, zoom/**, vendor/**, layers/**, strip/**, templates/**, derive.mjs, candidate.mjs, registry.mjs, build-page.mjs, plates-page.mjs, golden.mjs, MANIFEST.json;
  - every eq/ file: smith.mjs is pinned in 4 closures (MANIFEST.json:344, :979, :1246, :1409 at `6b32d576`); landmine.mjs and parts.mjs are imported only;
  - batches/**, tests/howto/golden/**, pages/**, pilot-a/** (plates.json's held line stays until a pin card), pilot-b/**, src/**, gen/**;
  - the 7 approved LB3 specs, every other pilot A and B spec, lb6/**, lb7/** and every other lane's files;
  - lib8-pin.test.ts (STILL_HELD stays green unedited: lb3/rows.json is not a file it scans, :118-119), lib8-pilot-a.test.ts, lib-zoom.test.ts, f-zoom-2.test.ts, library-ci.test.ts, tests/howto/fixtures/** (no composer, no held marker);
  - .github/**, scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css, package*.json.
- **Collision check** (10-31, `git diff --name-only origin/main...<head>`): #354 `2b128090` writes lb6/**, two new eq/ files and eq-composers.json; #356 `29a48852` writes lb7/**, strip/** and COACHING-DECISIONS; #348 `bf4b8d4d` writes vendor/engine/{body, plate, SPEC}, the MANIFESTs and COACHING-DECISIONS. None writes lb3/**, specs/{barbell_shrug, t_bar_row}.mjs or lb3-plates.test.ts. **The only shared write is the COACHING-DECISIONS append.** After LIB-SPINE (#348) merges, merge main and re-run A2.

## Do (waves: the two existing specs reach a panel first, and the clones copy the approved parent)
1. **PLAN** in lb3/DESIGN.md, posted as 'LB3 S PLAN READY @ <sha>'; wait for 'LB3 S PLAN RULED'. Base: the latest main. It gives:
   - the mode table above, re-checked on your base; each clone source and every copied bracket's solved value (D-LIB9-CLONE);
   - per row: the pose map (spec start = card start, the bottom), the fault→key map, the tempo map (D-LIB8M-TEMPO). The tempos: barbell 1/2/0 (c7); dumbbell 1/2/1 (c11); cable 1/2/1 (c7, c16); smith 2/2/0 (c11), whose 1 s bottom pause is named, not drawn, as the card's text says;
   - the facts plan (D-LIB8M-FACTS, D-LIB13-FACTS2; PANELS §3). A setup quote states the start pose only (D-LIB9-FACTPOSE), and a contact is checked at both ends of a segment. The cflb6r2 findings (#354 6544339239) are the model;
   - the unsourced numbers: SHRUG 5 cm, M_PULL, smith's elbow bend and head angle, the cable pulley place, the dumbbell grip width, t_bar_row's stance;
   - the clearance table above, re-measured with every tested and listed part named;
   - each zoom's view, k and place, and the flag fix-or-name list (barbell_shrug: F2 0.139, F3 45.79, F4 0, where ghosts are off by design, barbell_shrug.mjs:34);
   - the expected flags: F5 on all (D-LIB9-F5), F7 on barbell_shrug only, and t_bar_row's sheet note "plate size: drawing convention (228 mm)" (lb3/DESIGN.md:283-287).
2. **Cards at start:** copy the 4 shrug cards and quotes from `a48b0594`; update cards.sha.json and tempo.json.
3. **Wave 1, the two existing specs:**
   - barbell_shrug: the CLEAR fix (ruling 4), then `zoom: { view: 'normal', k: 3.5 }`.
   - t_bar_row: the feet (ruling 5), the Mistake stop at 2 px, the alt, then `zoom: { view: 'normal', k: 3 }`. Add its drawn-item tests: lib-13-card A2's t_bar_row half, the pivot at one floor point ±1 px in every pose and the V-handle hook 8-10 in from the plates (c1).
   - QA (Do 6), then 'LB3 S PLATES READY 1 @ <sha> (page <sha256>)'.
   - The supervisor runs PANELS §1: hidden anchors golden B's pull_up and lat_pulldown (D-LIB14-ANCHORS, lib4-cards :4421), 2 plants, R10 for both (tier A), R11 for both zooms.
4. **Card fields** after RULED, for the 4 shrug cards: the 3 keys, then 'LB3 S CARD FIELDS READY @ <sha>'. PANELS §3 once, one plant; fix only what it names. t_bar_row's keys stay as on main.
5. **Wave 2, the clones**, from barbell_shrug's wave-1 bytes once approved:
   - cable_shrug: the parent plus a low-pulley column ahead of the toes ("Stand close to the pulley", c2);
   - dumbbell_shrug: front view, dumbbells at the sides, its Mistake tell on the dumbbell;
   - smith_machine_shrug: smith(`stopY` under the start bar's lowest point, `base` under the rails behind the feet: the mx12 lesson, #354 6544652523 point 3), rail z from the clearance table, slight elbow bend, the head Mistake.
   - QA, then 'LB3 S PLATES READY 2 @ <sha> (page <sha256>)' and a PANELS §1 run (R11 on every zoom).
6. **QA** for every row in rows.json: two builds of the LB3 page with equal sha256, then runQa node and browser per id on candidateOf(id, { all, authoring: true }), with zero exemptions. Post the table. One fix round per wave, then a focused recheck. A second failure holds the id (D-LIB8M-CARDTRUE, or D-LIB13-PANEL2 when ruled).
7. **Merge** origin/main with a merge commit, re-run A2 and A9, and post 'LB3 S READY @ <sha>'. A fresh Opus review follows. If wave 2 is not approved when wave 1 is, ruling 9 applies.

Stops (post on the PR and wait; never work around one):
- S1 Any page other than LB3's moves a byte, an approved LB3 plate's fragment moves, an eq/ file would need an edit, or C0 is not [].
- S2 A bar is met only with k > 4, r < 52, a trim change, a label move, or a bigger fault or shrug. The row is held; nothing is loosened.
- S3 A card's facts cannot hold on the body together (the D-LIB10-BENCH-H form). For example, smith_machine_shrug's bar at mid-thigh (c1) with a slight elbow bend and a 2 px gap on its rail [unverified until drawn].
- S4 A zoom finds no place at any ladder k (the D-LIB17-RDFHOLD form). The row is held with its route.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
- **A1 Scope.** lb3/rows.json holds the 7 approved ids and the released new ones, each once, every row mode 'H' with no `parent`, `template` or `params`. Each held id is in DESIGN.md's held table with its route and in no rows file. REUSED (the 4 pilot A ids) are still never LB3 rows. barbell_shrug is in no batches/ or golden file (lib8-pin.test.ts:38, unedited).
  Mutations: barbell_row added; a row set to 'T'; a row duplicated; lib_barbell_shrug written into batches/pilot-a.json (lib8-pin red).
- **A2 Nothing else moves.** A new block in the lb6-plates.test.ts:1301 form pins the 7 approved LB3 plates' 63 fragment shas, as on page `6ff09d4c…08c6`. Pilot A L1, PILOT-A2, pilot B and every other registry page sha are equal before and after (listed in the PR). eq/landmine.mjs, eq/smith.mjs and eq/parts.mjs are byte-identical to main. C0 is []. `git diff --exit-code origin/main...HEAD` is empty on the Never paths.
  Mutations (temporary worktree): one byte in landmine_row.mjs's alt turns its fragment check red; one byte in eq/smith.mjs turns C0 and pilot B red.
- **A3 Zooms** (D-LIBZOOM-EXTEND, lib4-cards :4358-4369). Each zoom is the PLAN's view and k. No H2.zoom, H3.zoom or H4.zoom key is red. The source ring closes inside the frame (D-LIB22-RINGFIT, :4448), and no smaller ladder k passes (the lb8-plates.test.ts:4762-4778 form). Pinned (±0.01): barbell_shrug 24.54 at k 3.5; t_bar_row 27.23 at k 3, or the re-measured values with their basis.
  Mutations: barbell_shrug at k 3 (21.02, H3.zoom:trace); t_bar_row's zoom removed (H3 Trace 0); t_bar_row's trim set to [0, 0] (k 1.5 then passes, so the smallest-k assert is red); a planted "15°" (H2.zoom:angle).
- **A4 Card-true poses** (drawn-item tests on every row, in full).
  - Every shrug: the shoulder joint rises 5 cm ±0.2 (barbell_shrug.mjs's `shoulder rise` check form).
  - Straight arms (elbow within the PLAN's bound) on barbell_shrug (c4), cable_shrug (c5) and dumbbell_shrug (c3); a slight bend on smith_machine_shrug, in the PLAN's range (c1).
  - smith_machine_shrug: the bar centre on its rail in every pose (smith.mjs:37 throws); the start bar between the hip and knee landmarks' heights (c1 "mid-thigh").
  - dumbbell_shrug: the grips beside the thighs (c1).
  - cable_shrug: the low pulley ahead of the toes, with the cable from the pulley to the bar (c1, c2).
  - t_bar_row: the pivot fixed ±1 px; the V-handle hook 8-10 in from the plates (c1); the chest-parallel back (c3); the end at c23's first contact; each foot plant ≤ 0.5 cm.
  Mutations: dumbbell_shrug's rise set to 7 cm; smith's elbows straight (0°); t_bar_row's hook at 6 in.
- **A5 Clearance** (ruling 4). Every tested part clears the drawn body outline by 2 px or more in every drawn pose. The only exception is c23's end plate on t_bar_row, and every listed part is named in DESIGN.md.
  Mutations: barbell_shrug's BAR_GAP back to 3 mm (0.44 px); its Mistake bar solved on the thigh alone (−3.26 px); t_bar_row's Mistake back to CLEAR 5 mm (0.47 px); dumbbell grips at ±0.25 m (1.10 px).
- **A6 QA.** Every hard check passes per id, node and browser. The raised flags equal the ruled set exactly (qa.mjs).
  Mutations: LIB-3's M1-M7 (qa/mutations.mjs) on one new plate; t_bar_row's FOOT_X back to 0.2266 (H1.engine contact 1.0 cm); barbell_shrug's topFault set to 'elbows' (F7 expectation red); t_bar_row's old 53-word alt (H2.alt).
- **A7 Cards.** Each of the 4 shrug cards differs from its `a48b0594` blob only in the 3 keys (cards.sha.json), and validateCardFile gives []. t_bar_row's card is byte-identical to main. CARD FIELDS is VERIFIED with the plant caught.
  Mutations: another key edited; one second changed on a card and its spec; the verifier's plant.
- **A8 Nothing ships.** The A9 asserts (lb3-plates.test.ts:118) cover the 5 ids. Mutation: one row set to shipped.
- **A9 Panel and green.** Each wave is VALID under PANELS §1, both plants caught, R11 scored for every zoom plate and R10 for barbell_shrug and t_bar_row. Approvals are per id at that head. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head, and CI is green.

## Rulings (confirmed by the supervisor, 2026-10-31)
1. **D-LIB13S-LANE:** one LIB slot on a new branch claude/lib-13s. smith_machine_shrug is drawn and shown on the LB3 page with its parent. Its LB6 sheet place is decided at sheet time.
2. **D-LIB13S-MODES:** all 5 rows are H, for the reasons in the mode table. SHRUG is not built: 2 qualifying members of 3 (lb3/DESIGN.md:23, the D-LIB13-MODES form). The marks change: cable_shrug T→H; smith_machine_shrug T→H, so LB6 is D0 P2 T0 H14 (supervisor docs action).
3. **D-LIB13S-ZOOM:** D-LIBZOOM-EXTEND covers the shrug Trace holds (D-LIB8-shrug) and t_bar_row's (D-LIB13-TBAR, F-LB3-6). Normal-view zooms: k 3.5 on each shrug, and k 3 on t_bar_row with its own trim [10, 12]. No D-LIB21-SUPERMAN trim change is needed. smith_machine_shrug may add a Mistake zoom (D-LIB16-ZOOMVIEWS) only if the PLAN's head size is under 11.39 px.
4. **D-LIB13S-CLEAR:** the D-LIB16R2-CLEAR test and the 6543628951 point 1 scope apply, with two named fixes:
   - barbell_shrug's bar: BAR_GAP 15 mm, solved on the front of both thighs and the torso;
   - t_bar_row's Mistake: it stops when the bar or hook ring comes within 2 px.
   The only contact exception is c23's end plate. This adds checks only.
5. **D-LIB13S-TBARFEET:** t_bar_row draws the widest stance the engine plants within 0.5 cm (measured: 0.19 m with toes out 17°, 0.4 cm), in upright_row's form (upright_row.mjs:15-18). It is listed under "Unsourced numbers" against c2's "about shoulder-width" (45 cm on this body). The side view does not show width (plate.mjs:44-45). The plate.mjs:294 limit is unchanged.
6. **D-LIB13S-TOPFAULT:** barbell_shrug's topFault is 'roll' (rolling, c3, drawable false). F7 is raised and named, and the drawn key is 'elbows' (c4), as in D-LIB8M-TF1 4's curl form. The other 3 shrug cards are drawable true, so each topFault is its drawn key.
7. **D-LIB13S-FLAGS:** barbell_shrug's F2 0.139, F3 45.79 and F4 0 are fixed or named in the PLAN, each with its value and range (the 17.3 form of LB5). F4 0 follows from ghosts being off by design (a 5 cm move, barbell_shrug.mjs:34).
8. **D-LIB13S-FLB34:** start without waiting for F-LB3-4 (open, above). It gates the ship card's layer copy, not plates. When research fixes it, the supervisor re-copies barbell_shrug's card under a diff check; the 3 keys do not change.
9. **D-LIB13S-WAVES:** wave 1 (barbell_shrug, t_bar_row) goes to its panel first, and wave 2 clones barbell_shrug's approved bytes. If wave 2 is not approved when wave 1 is, the PR goes to review with its approved rows (the D-LIB17-SPLIT form, lib4-cards :4470), and wave 2 continues as 'LIB-13s resume' on a new branch.
10. **D-LIB13S-SHIP:** nothing ships. dumbbell_shrug, cable_shrug and smith_machine_shrug (card parent barbell_shrug) cannot ship before barbell_shrug (D-LIB10-PARENTS). barbell_shrug ships only through a later pin, PILOT-A3 or the LB3 ship card, not this card.

## Risks and mitigations
- **A front-view or Smith zoom finds no place** once the real labels are drawn (the prototype found (76, 188); the Smith frame stands near the parent's circle) [est]. Mitigation: measure the ladder in the PLAN; hold the row under S4 with its route; it never blocks the others.
- **The bar 2 px off the thighs reads as "not at the thighs"** (plate.start's words). Mitigation: card truth wins (PANELS §1 point 5), since c4's quote says "in front of your body"; a critic finding goes to the supervisor.
- **dumbbell_shrug's bent arms foreshorten in the front view** and may read as one red smear, as both cable flies did in mx12 (#354 6544652523 points 1-2). Mitigation: the tell on the dumbbell (21.94 px), one arrow per hand, and the D-LIB18-ZOOMPLACE route if it still cannot read.
- **smith_machine_shrug's tipped head reads as looking down,** not "pushed forward" (no head translation in the engine). Mitigation: the tell on the crown; a panel finding comes back to the supervisor; S3 if it cannot read.
- **t_bar_row's narrower stance or 17° toe-out draws a visibly different foot** [est: 4 % shorter]. Mitigation: R2 judges it; the measured alternative is 0.165 m with toes out 5° (0.5 cm, landmine_row's approved stance).
- **The wave-1 panel changes barbell_shrug** after the clones start. Mitigation: wave 2 starts only on the wave-1 approval (ruling 9).
- **LIB-SPINE merges mid-lane** (body.mjs). Mitigation: no row uses its opt-in fields; merge main and re-run A2 and C0 at each milestone.
- **Usage.** The owner said 10-31 not to pause this week (HANDOVER :857); after the 11-05 reset the 80 % pause applies (PANELS §9). Mitigation: post WAITING with a HANDOFF block.

## Forecast [est]
- Builder, about 30 Opus-hours:
  - PLAN 2 h;
  - wave 1: barbell_shrug 2.5 h, t_bar_row 3 h (fixes, zoom, its new drawn-item tests);
  - wave 2: 3 H rows × 4.75 h = 14.25 h (plan :894-897), plus 1 h for a possible Smith Mistake zoom;
  - cards 3 h; tests and tooling 4 h.
- LB lanes needed 2-4 fix rounds (lib-16r2-card.md forecast), so allow up to about 55 h.
- Supervisor: the PLAN ruling; one CARD FIELDS verify (4 cards) plus a re-verify; two panels plus rechecks; the review; the plan-marks docs action.
- Wave 1 can reach its panel about half a day after start [est]. The calendar depends on the slot, the panel queue and LIB-SPINE's merge.
- Rows released if every step passes: 5. None ships here (ruling 10), so there is no APK.

return: PR and head sha; links to PLAN, PLATES READY 1 and 2, CARD FIELDS and READY; the per-id table (mode, clone source, zoom view and k, clearances, flags, held or not); the LB3 page sha256 from two builds; A2's fragment table and diff output; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-13s resume' (sent to the session or posted on the PR).

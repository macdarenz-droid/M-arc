Card PILOT-A3: pilot A resume 2. reverse_lunge redrawn with `trunk.bow` (F-REVLUNGE-ARCH) and dumbbell_fly's F-FLY-START fixes, pinned as the new one-row-per-id batch PILOT-A3 (2026-10-31; status `ready`: the supervisor confirmed the D-A3-* rulings below as written (lib4-cards §48).. It starts on 'PILOT-A3 start' after train 54 (#360, LIB-SPINE #348) is on main.)

Sources (every file:line was read at these heads; [est] marks an estimate, [unverified] what no run here checked):
- #348 head `bf4b8d4d` (LIB-SPINE; review PASS 6543706242, DIFF-CHECK 6547113887; in train 54, #360 `fd15e249`). It contains main `6b32d576` (train 53). Every file:line below is at `bf4b8d4d` unless another head is named.
- claude/sup-lib4-cards `dd30aa1a`: lib-spine-card.md (D-SPINE-*), lib4-cards.md §47-§48, lib-8r-card.md, lib-small-card.md, lib-16r2-card.md. claude/sup-handover-1445 `bf7ced16`: verify/PANELS.md, HANDOVER.md.
- #340 comments 6540319537 (mx7: dumbbell_fly held, F-FLY-START), 6539264024 (mx6: reverse_lunge held), 6538120823 and 6534832450 (earlier rounds); #348 6543706242 (review Low 2: measure a bow tell against `bow: 0`), 6547101968 (REPIN: page shas).
- Scratch: a detached worktree of `bf4b8d4d`, npm ci. A scratch rows file (pilot-a2/rows.json, batch "PILOT-A3", both ids stage drawing, never committed) let pilot-a2/qa.mjs and build.mjs run LIB-3's runQa, node and browser, with zero exemptions. Spec edits were made only in that worktree and restored after each run. Scripts in the supervisor's scratchpad (`spinefollow/scripts/`): rl-bow.mjs, rl-variant.mjs, rl-ring.mjs, rl-export.mjs, rl-db.mjs, fly.mjs, fly-variant.mjs, fly-chunk.mjs, fly-start.mjs. Base pages (two equal builds): PILOT-A2 `3e225bc12531e6c395e5a532a77736ebaeb9cdc276c55709d8ac4c73ef78bb0b` (280,533 B, library-ci.test.ts:619); pilot A `5d0e562f…5ba8` (1,325,644 B), pilot B `ff3e017c…583f` (409,765 B) (#348 6547101968).

id: PILOT-A3
model: claude-opus-5-5 (a Mistake redraw on a new engine field, a zoom call, two R2/R5 fixes under a 106 B chunk margin, a test move and a pin: judgement work)
mode: auto
title: 'Builder: PILOT-A3, reverse_lunge on trunk.bow and dumbbell_fly F-FLY-START (pilot A resume 2)'
branch: claude/lib-8-resume-2 (new, from the latest main, which must contain #348; no such branch on origin at 10-31). First push opens draft PR 'PILOT-A3: reverse_lunge (trunk.bow) and dumbbell_fly (F-FLY-START) as batch PILOT-A3'.
slot: pilot A's lane (LIB-8R's; HANDOVER:859 keeps the LIB-8R session for PILOT-A3). The supervisor names the checklist slot in 'PILOT-A3 start'.
lane: one LIB slot under D-LIB-LANE-ACTIVE (lib4-cards:1023). Open lanes at 10-31: #354, #356, #358, #359 [count at start unverified]. Pilot A's lane merges as soon as it is approved and reviewed, ahead of step_up and of any row whose sheet anchors on these ids (lib4-cards:4471).

## Why now
- Both ids have a route that is now buildable:
  - reverse_lunge: held after three rounds; its 12° arch drew as an upper-trunk shift (#340 6539264024). Route F-REVLUNGE-ARCH (lib4-cards:4487) is `trunk.bow`, which #348 adds (body.mjs:141-177; SPEC.md:66-72). D-SPINE-REVLUNGE-ROUTE (lib-spine-card.md:131-134): PILOT-A2 is pinned, so this is a one-row batch PILOT-A3 with first entries, approvedBy 'supervisor', never a second PILOT-A2 page entry (golden.mjs:156-160).
  - dumbbell_fly: held after its second focused round on R2 and R5. mx7 gave buildable fixes and routed it to "a fresh round 1 in PILOT-A3 with reverse_lunge" (#340 6540319537; lib4-cards:4511).
- Waiting behind reverse_lunge's pin: step_up and 5 SPLIT T rows, plus the sheets of bayesian_cable_curl, dumbbell_overhead_triceps_extension and cable_chest_press (lib-spine-card.md:23-24).

## Scope (one row per id, both H, census view)
| id | tier | view | what changes | what stays byte-identical |
|---|---|---|---|---|
| reverse_lunge | B | side | Mistake only: `trunk: { flex: 0, bow: M_ARCH }` (D-A3-REVBOW), one tell on the waist's back edge (D-A3-REVTELL), zoom k 3 (D-A3-REVZOOM). start/via/end trunks written `{ flex: 0 }` (D-SPINE-MIX) | the normal render (svg `0744dcf3…`, overlay `cbf84381…`, lib8r-pilot-a2.test.ts:165); poses, sizes, facts, tempo, callouts |
| dumbbell_fly | A | front, pitch 45, volume | R2: the dashed start dumbbells side-on (D-A3-FLYSTART). R5: the faulty hand drawn as a dashed outline on top (D-A3-FLYHAND) | poses, M_WRIST 30, zoom k 2.5 and its place, facts, tempo, callouts |

Neither card's three keys change (plateFacts, tempo, topFault; lib8r-pilot-a2.test.ts:84-87), so no CARD FIELDS verify is needed (D-A3-NOCF).

## Measured (scratch on `bf4b8d4d`; plate px at 146.29 px/m; bars traceLenMin 22.11 and deviationMin 11.39 px, qa/envelope.json:12-13; zoom k 1.5-4, zoom/inline.mjs:15; inside a zoom H3 uses deviation × k, qa/zoom.mjs:65, :125)

### reverse_lunge
- **Held #340 Mistake** (root tilt 15, trunk -12; reverse_lunge.mjs:89-90): head, shoulder.r, chest, backUpper, backMid and lumbar all shift 5.27 px. This is the "upper trunk shifted" the critics saw (6539264024). Its tell (along sternum→lumbar t 0.7, :139) moves 5.27 px, so at k 2.5 it reads 13.18 px.
- **`bow: 12`** = the end pose with `trunk: { flex: 0, bow: 12 }`. Landmark moves against the end pose (px):

  | landmark | px | | landmark | px |
  |---|---|---|---|---|
  | head, chin, neck, shoulder.r, shoulderTop.r, elbow.r, grip.r, sternum, chest, backUpper | 0.00 | | lumbar | 4.10 (2.71 cm forward, 0.72 cm up) |
  | hips, hip.r, knee.r, knee.l, toe.l, heel.r | 0.00 | | sacrum | 4.28 |
  | backMid | 0.70 | | buttock | 4.30 |
  | seat | 3.09 | | navel | 4.65 |

  - The torso outline departs from the end outline by at most 4.24 px. The departure above 1.75 px (half the mask's 3.5 px stroke, plate.mjs:245) spans world y 0.306-0.409 H, about screen y 234-261: the waist and low back. The thorax outline does not move.
  - Seen in the scratch shot: a concave red back line in the circle. It no longer reads as a shift.
- **Against `bow: 0`** (review Low 2; COACHING-DECISIONS.md:2948): the trunk is not flexed (flex 0), so `{ flex: 0 }`, `{ flex: 0, bow: 0 }` and main's `trunk: 0` all give 0.0000 px at every landmark and 0.00 px on the torso outline. The lumbar tell is 4.1036 px against either end. The normal render bytes are the same with the end written `{ flex: 0, bow: 0 }`.
- **Tell anchors**, faultOf on the real camera (zoom/inline.mjs:57-72):

  | anchor | plate px | ×1.5 | ×2 | ×2.5 | ×3 | ×3.5 | ×4 | smallest k ≥ 11.39 |
  |---|---|---|---|---|---|---|---|---|
  | lumbar (waist back edge) | 4.10 | 6.16 | 8.21 | 10.26 | **12.31** | 14.36 | 16.41 | 3 |
  | sacrum | 4.28 | 6.42 | 8.56 | 10.69 | 12.83 | 14.97 | 17.11 | 3 |
  | buttock | 4.30 | 6.45 | 8.61 | 10.76 | 12.91 | 15.06 | 17.21 | 3 |
  | navel | 4.65 | 6.98 | 9.30 | 11.63 | 13.95 | 16.28 | 18.60 | 2.5 |
  | along lumbar→sacrum t 0.5 | 4.11 | 6.16 | 8.22 | 10.27 | 12.33 | 14.38 | 16.44 | 3 |
  | held anchor (sternum→lumbar t 0.7) | 2.87 | 4.31 | 5.74 | 7.18 | 8.62 | 10.05 | 11.49 | 4 |
  | backMid | 0.70 | | | | | | 2.79 | none |
- **Full QA**, node and browser, zero exemptions, the chest arrow removed (the chest moves 0.00 px):

  | variant | hard checks | zoom circle / source ring | deviation in zoom | flags |
  |---|---|---|---|---|
  | 'Low back arches' on lumbar, k 3 | all 10 pass | (118, 126) r 52 / (173.56, 242.31) r 17.33 | 12.31 | F3 46.91, F4 0, F5 3.57 |
  | 'Ribs flare' on lumbar, k 3 | all 10 pass | (114, 132) / same ring | 12.31 | F3 46.9, F4 0, F5 |
  | 'Pelvis tips' on sacrum, k 3 | all 10 pass | (122, 110) / (168.2, 250.24) r 17.33 | 12.83 | F3 46.9, F4 0, F5 |
  | 'Pelvis untucked' on sacrum, k 3 | **H1.ink:mistake:flare** (the auto-placed box sits on ink; it needs a tell `box`) | (122, 110) | 12.83 | same |
  | 'Pelvis untucked' on sacrum, k 2.5 | H1.ink plus **H3.zoom:deviation** | | 10.69 | |
  | 'Ribs flare' on navel, k 2.5 | all 10 pass | (112, 164) / (200.31, 245.91) r 20.8 | 11.63 | F4 0, F5 (leaderMax 51.0, so no F3) |

  - The trace is 69.67 px. The flag set F3, F4, F5 equals round 3's (pilot-a2/qa.mjs:50 at `531213f7`).
  - No label box moved in any passing row.
- **What each source ring holds** in both poses (rl-ring.mjs):
  - lumbar k 3: elbow.r, backMid, lumbar, sacrum;
  - sacrum k 3: elbow.r, lumbar, sacrum;
  - the held k 2.5 ring: elbow.r, backMid, lumbar.
  - The hanging near arm (elbow dot at (184.2, 245.0)) overlaps the waist in the side view, so every waist ring holds it. The lumbar ring is centred at x 173.6, behind the arm, where round 3's was at x 183.3, on the arm (6539264024: "the ring still sits on the arm").
- **D-SPINE-MIX:** with main's `trunk: 0` in the key poses, a bow Mistake throws "trunk.bow needs the object form … (D-SPINE-MIX)" (plate.mjs:41-42). Every key pose must write `{ flex: 0 }`.
- **Pins:**
  - The normal render is unchanged with the redraw: svg `0744dcf3…`, overlay `cbf84381…` (lib8r-pilot-a2.test.ts:165).
  - The export sha (:164, :168) moves to `c1aec51d…` only because `trunk: 0` becomes `{ flex: 0 }`. With `{ flex: x }` mapped back to x it is `026964f9…`, the pinned literal (D-A3-REVEXPORT).
- **Load clearance** (D-A3-CLEAR): the dumbbells hang beside the thighs in depth. They do not move: grip 0.00 px. In 3D, with each head as its circumscribed cylinder (r 0.0595 m, a conservative model), they clear the legs by:
  - start 1.5 / 1.5 cm;
  - via 1: 0.3 / 0.4 cm;
  - via 2: 0.3 / 3.8 cm;
  - end: 0.1 cm (db.l against the rear thigh) and 9.7 cm (rl-db.mjs).
- **The PILOT-A2 tests on the redrawn spec:** lib8r-pilot-a2.test.ts has 5 red and 103 green. The red ones:
  - :147 (the tell text /Ribs flare/);
  - :166 (the export sha);
  - :193 (R5 "rib front and low back forward ≥ 2 cm"; chest is 0 cm and backMid 0.46 cm by design);
  - :210 (R11 "the ring holds the rib front");
  - :329 (zoom k 2.5).
  - lib8-pin.test.ts and lib8-pilot-a.test.ts stay green.

### dumbbell_fly
- **R2, the start dumbbells.**
  - Today each is a hex ring in the x-y plane (dumbbell_fly.mjs:79, :133). Under pitch 45 it projects end-on, 17.4 × 10.7 px.
  - The engine draws every pitched dumbbell side-on (equipment.mjs:33-41; proj = sin 45 = 0.707 > 0.35): the end dumbbell measures 15.1 × 28.0 px.
  - One closed side-on silhouette per dumbbell gives 15.1 × 28.0 px, equal to the end dumbbell. It has 13 points, the primitive's sizes (DB :78), in the x-z plane at the start grip. Its bbox is x 139.3-154.4 / 203.6-218.7 and y 111.1-139.1, centred on the start grips (146.8, 125.1) and (211.2, 125.1).
  - Its clearances: 3.4 px from the bench pad poly; 8.0 px from the drawn Trace (12 px past its start trim).
  - On screen it covers the start forearm by up to 4.6 px. In 3D the head surface is ≥ 6.3 cm from the forearm axis (forearm radius ≤ 0.026 H = 4.55 cm, RADII.forearm), and the head is nearer the camera. So this is depth, not contact (D-A3-CLEAR).
- **R5, the wrist.**
  - The engine bends the hand 30.0° from the forearm in 3D (M_WRIST, :92-94). On screen the hand turns 23.0° (end 0.0°), both sides, as the critic's "about 22°" predicted.
  - The grip moves 4.97 px; the hand's drawn length goes from 11.84 to 12.71 px.
  - The bend does not read because the Mistake layer outlines only the changed parts through a mask that hides the inside of the faulty body (plate.mjs:233-246). The faulty hand lies under the dashed fist and the solid end hand [the exact occlusion is unverified; the shot shows only the shifted fist and dumbbell].
  - A Mistake `dashed` guide is drawn after the masked pose, on top and unmasked (plate.mjs:250-252, :293). Drawn as the closed outline of the Mistake pose's own hand poly (handPoly, :116-119), it shows the 23° wedge inside the zoom.
  - The zoom stays at k 2.5: 12.42 px (k 2 gives 9.94). Its circle stays at (66, 256) r 52 and its source ring at (52.88, 178.14) r 20.8, which holds the wrist (12.0 px from the centre).
- **H7 chunk** (limit 153,600 B raw = 150 KiB; qa/node.mjs:20, :198):

  | variant | raw B | H7 |
  |---|---|---|
  | held | 152,973 | |
  | silhouette only | 153,297 | |
  | silhouette + hand guides | **153,494** | pass, 106 B left |
  | three rectangles per dumbbell + guides | 153,910 | **H7.chunk-raw** red |
- **Full QA** (silhouette + guides, k 2.5): all 10 hard checks pass, node and browser, zero exemptions. Flags: F3 115.0 and F5, the set ['F3', 'F5'] (pilot-a2/qa.mjs:50). Trace 85.49 px.
- **Tests:** every dumbbell_fly assertion in lib8r-pilot-a2.test.ts stays green on this variant.

## Files it may touch (write_scope)
- tools/plates/library/specs/reverse_lunge.mjs, only these:
  - pose()'s trunk (:70);
  - MISTAKE (:89-90);
  - the guides (:136);
  - the tell (:139);
  - the zoom (:142);
  - the header comment lines (:31-33, :83-88).
- tools/plates/library/specs/dumbbell_fly.mjs, only these:
  - the start phantom (:77-79, :133);
  - the Mistake guides (:163);
  - its header comment (:26-27, :30-33).
  makeFly's signature and the alt's import stay (dumbbell_fly__alt.mjs).
- tools/plates/library/pilot-a3/** (new): DESIGN.md (the RESUME PLAN), rows.json (until the pin), sizes.json, tempo.json, cards.sha.json, build.mjs, qa.mjs. Copy them from pilot-a2/ (`3e225bc1` head), never import them.
- tools/plates/library/pilot-a2/sizes.json, tempo.json, cards.sha.json: only the two ids' rows, moved to pilot-a3/. pilot-a2/qa.mjs:50: only `lib_dumbbell_fly` leaves EXPECTED. pilot-a2/DESIGN.md: one line in §11 naming the move (D-A3-TESTHOME).
- tests/howto/lib8r-pilot-a3.test.ts (new). In tests/howto/lib8r-pilot-a2.test.ts, only the lines D-A3-TESTHOME lists.
- The pin commit only: the D-A3-PINLINES files. These are:
  - batches/pilot-a3.json, pages/pilot-a3.json, tests/howto/golden/library/pilot-a3.json;
  - MANIFEST.json, new rows only;
  - pilot-a/plates.json, the held strings of the two ids (:71-…, :143-…), and pilot-a/MERGE.md:28-29;
  - the generated lines.
- docs/COACHING-DECISIONS.md: append one entry (keep both sides on a merge).
- **Never:**
  - vendor/**, layers/**, qa/**, zoom/**, golden.mjs, registry.mjs, candidate.mjs, build-page.mjs, plates-page.mjs, eq/**;
  - every other spec, box_jump.mjs and the rear-delt fly's specs among them (both pinned, MANIFEST closure);
  - batches/pilot-a.json, pilot-a2.json and pilot-b.json; pages/pilot-a*.json and pilot-b.json; tests/howto/golden/library/pilot-a.json, pilot-a2.json and pilot-b.json;
  - docs/research/** (no card key changes);
  - lb*/**, strip/**, src/** (except the generated lines), .github/**, scripts/screenshot-gate.mjs, tests/theme.test.ts, package*.json.
- **Collision check** (10-31, files of each open PR): no open PR writes pilot-a*/**, these two specs, lib8*.test.ts, library-manifest.test.ts, library-ci.test.ts or ci/scratch.mjs. The only shared write is the COACHING-DECISIONS append (#356). Train 54 (#360) holds only #348.

## Do (waves; nothing is drawn before PLAN RULED)
1. **Wave 0, PLAN.** Base: the latest main with #348 in. Copy pilot-a3/ from pilot-a2/. Write the RESUME PLAN in pilot-a3/DESIGN.md and post 'PILOT-A3 PLAN READY @ <sha>'. Wait for 'PILOT-A3 PLAN RULED'. The plan gives:
   - this card's measures repeated on the base, with the D-A3-* choices;
   - reverse_lunge's tell text and anchor (D-A3-REVTELL), its cue (≤ 15 words, qa/node.mjs:20) and its zoom k;
   - the fly's silhouette points and guide definition, and its chunk bytes;
   - the 2 px table (D-A3-CLEAR);
   - the expected flags: reverse_lunge F3, F4, F5; dumbbell_fly F3, F5;
   - the D-A3-TESTHOME line map (old line → new test).
2. **Wave 1, draw both** (after RULED).
   - reverse_lunge: the Mistake per D-A3-REVBOW, -REVTELL and -REVZOOM.
   - dumbbell_fly: D-A3-FLYSTART and -FLYHAND.
   - Move the two ids' rows and assertions (D-A3-TESTHOME) and write lib8r-pilot-a3.test.ts with each acceptance row and its red mutation.
   - Build pilot-a3/build.mjs twice (equal sha256). Then pilot-a3/qa.mjs, node and browser, per id on candidateOf(id, { all, authoring: true }) with zero exemptions. Post the table.
3. **Blind TOPFAULT pass** on reverse_lunge's new tell (D-LIB8M-TF1 method, lib-8r-card.md Do 5). If the answer is not 'flare', the PLAN's alternative tell is used (D-A3-REVTELL).
4. **Panel.** Post 'PILOT-A3 PLATES READY @ <sha> (page <sha256>)'. The supervisor runs PANELS §1 (PANELS.md:5-37) once on both:
   - a fresh round 1 (#340 6540319537);
   - hidden anchors pull_up and lat_pulldown (D-LIB14-ANCHORS), 2 plants;
   - R10 for dumbbell_fly (tier A), R11 for both zooms;
   - target items: reverse_lunge R5 and R11 (lib-spine-card.md:154); dumbbell_fly R2, R5 and R11.
   - One fix round, then a focused recheck. A second fail holds the id (D-LIB8M-CARDTRUE).
5. **Sheet and PIN GO** (lib-8r-card.md Do 6). 'PILOT-A3 PIN GO @ <head>' names the ids, the page sha, the exemptions and the approval comment.
6. **Pin**: one `[golden update]` commit in the form of PILOT-A2's:
   - batches/pilot-a3.json (stage approved-plate, mode H, censusRef 4a9fd86), pages/pilot-a3.json, and tests/howto/golden/library/pilot-a3.json (base {8, e48d731d…} as pilot-a2.json; one page entry and one plate entry per id; first entries, approvedBy 'supervisor', decision 'D-LIB-PILOTA3');
   - MANIFEST rows for the new ids, then `node tools/plates/generate.mjs`;
   - the D-A3-PINLINES edits; delete pilot-a3/rows.json.
   The supervisor diff-checks the commit against the GO.
7. **Ready.** Merge origin/main with a merge commit, re-run A2 and A11, and post 'PILOT-A3 READY @ <sha>'. A fresh Opus review follows.

Stops (post on the PR and wait; never work around one):
- S1 Any pilot A, PILOT-A2 or pilot B byte, fragment or MANIFEST row moves, or C0 is not [].
- S2 A fix would need an engine, zoom, qa or golden.mjs edit, or a bow other than 12 (never enlarged).
- S3 A bar is met only with k > 4, a second moved box on one plate, or by dropping a part. For the fly: no way to stay ≤ 153,600 B with both fixes; never a ghost or part dropped to make room without a ruling.
- S4 The blind TOPFAULT pass maps neither tell option to 'flare'.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
| # | Row | Evidence | Red mutation |
|---|---|---|---|
| A1 | Scope | pilot-a3 rows (then batches/pilot-a3.json) hold exactly the approved ids among lib_reverse_lunge and lib_dumbbell_fly, each once, mode H, census view; no PILOT-A2 file names them | box_jump added; a row duplicated; reverse_lunge left in lib8-pin STILL_HELD after the pin |
| A2 | Nothing else moves | `git diff --exit-code origin/main...HEAD` empty on the Never paths. Pages pilot A `5d0e562f…`/1,325,644, PILOT-A2 `3e225bc1…`/280,533 and pilot B `ff3e017c…`/409,765. 153 + 18 fragment equalities (pilot A 13×9, pilot B 4×9, PILOT-A2 2×9). Every lane page main builds is equal. C0 is [] | One byte in box_jump.mjs's alt (temporary worktree): C0 red |
| A3 | Bow true at true size | 10 upper landmarks (head … backUpper) and hips, knees and feet move ≤ 1e-9 m. lumbar 4.10, sacrum 4.28, buttock 4.30 and navel 4.65 px (±0.05). bow = M_ARCH = M_TILT = 12. The same against the end written `{ flex: 0, bow: 0 }` (Low 2) | The held #340 Mistake (tilt 15, trunk -12): head 5.27 px, red. bow 16: red. A number trunk in the end pose: the D-SPINE-MIX throw (measured message) |
| A4 | reverse_lunge zoom | `{ view: 'mistake', k: 3 }`; 12.31 px inside the zoom. The source ring holds lumbar, sacrum and backMid in both poses. No box moved. H3.zoom and H4.zoom green | k 2.5: H3.zoom:deviation (10.26 px). The held anchor at k 3: 8.62 px, red |
| A5 | reverse_lunge normal plate | Normal svg `0744dcf3…` and overlay `cbf84381…` unchanged. The export sha after D-A3-REVEXPORT's normalisation is `026964f9…` | REAR_HEEL 46 (the existing :173 mutation); a `yaw: 0` key added to one trunk (the normaliser maps only a lone `flex`) |
| A6 | Fly start dumbbells | Two dashed side-on silhouettes, each 15.1 × 28.0 px = the end dumbbell's bbox (±0.2 px), centred on the start grips; ≥ 2 px from the bench pad (3.4) and the drawn Trace (8.0) | The hex ring restored: bbox 17.4 × 10.7 px ≠ 15.1 × 28.0, red. The silhouette at the end grip: red |
| A7 | Fly wrist bend | Each side's Mistake guide is the closed outline of the Mistake pose's hand poly. Its axis is 23.0° ± 0.5° on screen from the forearm (30.0° in 3D, M_WRIST) and inside the source ring. Zoom k 2.5, 12.42 px | A guide on the end hand (0°): red. k 2: H3.zoom:deviation (9.94 px). M_WRIST 31: sizes red |
| A8 | Fly chunk | H7 raw ≤ 153,600 B (153,494 measured) | Three rectangles per dumbbell: 153,910 B, H7.chunk-raw |
| A9 | 2 px clearance (D-A3-CLEAR) | Load and machine parts in the body's plane ≥ 2 px from every body outline in every drawn pose, card contacts excepted. Parts beside the body in depth are listed with their 3D gap | The fly silhouette moved 1.5 px toward the pad (3.4 → 1.9 px): red [designed]. A reverse_lunge dumbbell moved 2 cm toward the rear thigh: the 3D listing goes negative, red |
| A10 | QA | All 10 hard checks, node and browser, zero exemptions, per id. Flags exactly reverse_lunge F3, F4, F5 and dumbbell_fly F3, F5; F5 3.57 | LIB-3 M1-M7 (qa/mutations.mjs) on one plate; reverse_lunge's topFault set to another key |
| A11 | PILOT-A3 chain | verifyBatchChain []. The page entry is the two-build sha; each plate entry's 9 fragments equal extractPlates of that page. No layers entry or file. No other batch's id appears in PILOT-A3 files | A second page entry, supersedes 0, by 'supervisor': verifyChain red (golden.mjs:159). One fragment edited. `"lib_crunch"` written in. A layers-page entry |
| A12 | Pin lines and held markers (D-A3-PINLINES) | lib8-pin STILL_HELD = barbell_shrug and incline_dumbbell_press. A MOVED_A3 list is in exactly batches/pilot-a3.json and golden/library/pilot-a3.json. library-manifest lists 13 + 4 + 2 + PILOT-A3 rows. library-ci lists the pilot-a3 page. ci/scratch.mjs refuses PILOT-A3 ids | A moved id added to batches/pilot-a2.json; scratch target lib_reverse_lunge; one PILOT-A3 MANIFEST row dropped |
| A13 | Tests moved, none lost (D-A3-TESTHOME) | Each moved assertion appears in lib8r-pilot-a3.test.ts, verbatim or a named stricter form. The PR lists old line → new line. lib8r-pilot-a2.test.ts keeps every PILOT-A2-row assertion byte for byte | A moved assertion deleted from the map: the mapping test red |
| A14 | Generated, green, nothing ships | `generate --check` green. The src/** diff is only the stage lines through generate.mjs. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head; CI green | One row set to shipped |
| A15 | Panel and TOPFAULT | PANELS §1 VALID (both plants caught), medians ≥ 4 per id at that head. The blind pass answers 'flare' | The two plants; the verifier's plant |

## Proposed rulings (for the supervisor before 'PILOT-A3 start')
1. **D-A3-BATCH:** PILOT-A3 is a new batch.
   - Its own batch, page and chain files, first entries, approvedBy 'supervisor', decision 'D-LIB-PILOTA3', base as pilot-a2.json.
   - If only one id is approved when the other is held for good, PILOT-A3 pins that one alone (D-LIB17-SPLIT form, lib4-cards:4470).
   - The other goes to a later one-row batch (PILOT-A4), never a second PILOT-A3 page entry (golden.mjs:156-160).
2. **D-A3-REVBOW:** the reverse_lunge Mistake is the end pose plus `trunk: { flex: 0, bow: M_ARCH }`.
   - The key poses write `{ flex: 0 }`.
   - M_ARCH = M_TILT = 12, unchanged: the pelvis tips 12° under the held thorax, which is the 12° lumbar extension (lib-spine-card.md:126).
   - The chest arrow (:136) goes: it measures 0.00 px.
   - The M_TILT basis in sizes.json is rewritten to the bow (its "rib front forward" text is no longer true).
3. **D-A3-REVTELL:** key 'flare' (the topFault), text 'Low back arches', anchor `{ at: 'lumbar', pose: 'mistake' }`.
   - The cue keeps c18's words, for example 'The ribcage flares and the pelvis stays untucked, arching the low back.' (12 words).
   - Why: only the waist and pelvis move, so a label naming the ribs puts its leader on a part that does not move (R4, R5). lumbar is the anchor LIB-SPINE planned (lib-spine-card.md:113), and it passes all 10 checks as auto-placed.
   - Alternative if the blind pass rejects it: 'Pelvis untucked' on sacrum at k 3 (12.83 px), the negation of c18's cue "tuck the pelvis under". It needs a tell `box` (auto-placed it is H1.ink red).
4. **D-A3-REVZOOM:** `{ view: 'mistake', k: 3 }`, the smallest ladder k that passes (D-LIB22-RINGFIT, lib4-cards:4448).
   - The ring holds the elbow dot, because the hanging arm overlaps the waist in the side view.
   - Not chosen: k 3.5 on sacrum would put the elbow dot outside the ring (16.8 px > r 14.86) [unverified by QA], but it is not the smallest k.
5. **D-A3-REVEXPORT:** the D-LIB8R-REVLUNGE export-sha check (lib8r-pilot-a2.test.ts:164) maps a trunk that is exactly `{ flex: x }` to x before hashing.
   - The literal `026964f9…` and the NORMAL bytes stay.
   - It is as strict as before: any other change still moves the sha. The normal render bytes are checked unchanged.
6. **D-A3-FLYSTART:** one dashed side-on silhouette per start dumbbell, from the dumbbell primitive's sizes, in place of the hex ring.
   - Three rectangles would break H7 (153,910 > 153,600 B).
7. **D-A3-FLYHAND:** the faulty hand as one closed Mistake `dashed` guide per side, the Mistake pose's own hand poly.
   - No enlargement: M_WRIST stays 30, and the drawn length is the engine's.
   - Inside the zoom it shows the 23.0° screen bend.
8. **D-A3-TESTHOME:** the two ids leave PILOT-A2's lane files.
   - Their rows in pilot-a2/sizes.json, tempo.json and cards.sha.json move to pilot-a3/, and `lib_dumbbell_fly` leaves pilot-a2/qa.mjs:50.
   - Every assertion naming them in lib8r-pilot-a2.test.ts moves to lib8r-pilot-a3.test.ts: :13-15, :47, :61-67, :73-74, :85-87, :128, :134, :147-153, :157-158, :162-217, :246-264, :266-283 and :330-331, with IDS reduced to ROWS.
   - Why: after the pin these ids are PILOT-A3's, :61-67 must change anyway (their held lines go), and the sizes basis must change. pilot-a2/** is in no MANIFEST row (checked: 0 of 117 closure inputs), so C0 is unaffected.
   - Alternative: keep the data in pilot-a2/ and edit only the 5 red assertions plus the M_TILT basis.
9. **D-A3-PINLINES:** the pin commit may edit exactly these lines:
   - lib8-pin.test.ts:35-39 and :120-129;
   - library-manifest.test.ts:36-40;
   - library-ci.test.ts:615-621 (the pilot-a3 page between pilot-a2 and pilot-b);
   - ci/scratch.mjs:36-37 and :47;
   - pilot-a/plates.json, the two held strings; pilot-a/MERGE.md:28-29;
   - the generated src/howto lines and ids-node.mjs line 1, through generate.mjs only (D-LIB8R-PINLINES form, lib-8r-card.md ruling 7).
10. **D-A3-CLEAR:** D-LIB16R2-CLEAR's ruled scope (#354 6543628951 point 1; D-SMALL-9).
    - Tested at 2 px: the bench pad and the fly's dumbbells in the body's plane.
    - Listed with 3D gaps, not tested: reverse_lunge's dumbbells and the fly's start heads against the start forearm (beside the body in depth).
    - The hands on the handles are the card contacts.
11. **D-A3-NOCF:** no CARD FIELDS verify. No card key changes; the blind TOPFAULT pass covers the new tell.

## Risks and mitigations
- **The bow reads as "belly out", not "ribs flare".** The navel moves 4.65 px and the ribs 0 px. Mitigation: the tell names the low back; the zoom ring sits on the back edge, where the dashed line departs; the cue keeps c18's words; the TOPFAULT pass is S4. Never a larger bow.
- **R11: the ring still holds the arm.** Measured: the elbow dot is inside every waist ring. The ring centre now sits 9.7 px behind round 3's. Mitigation: the panel judges at k 3. The k 3.5 option is recorded in D-A3-REVZOOM.
- **Fly chunk margin is 106 B.** Any added byte (a label move, a longer cue) breaks H7. Mitigation: A8 pins the bytes. The guides can be open 4-point paths if a later fix needs room [est: about 40 B]. No ghost or part is dropped without a ruling (S3).
- **The red hand guide is thin at k 2.5** (2.9 px half width × 2.5 on screen). Mitigation: it is the true size; a critic finding goes to the supervisor. Never a wider hand.
- **PILOT-A2's proof loses lines in the move.** Mitigation: A13 maps every moved line; the PILOT-A2-row assertions stay byte for byte; A2 rebuilds its page and 18 fragments.
- **Only one id passes.** D-A3-BATCH's split, and step_up waits only on reverse_lunge.
- **LIB-SPINE's SPEC.md bow line still lacks the Low 2 note** (F-SPINE-BOW0, HANDOVER:863). Not this lane's: flex is 0 here, so measured against `bow: 0` the tell is equal (A3).

## Forecast [est]
- Builder, about 11 Opus-hours: PLAN 1.5 h; reverse_lunge redraw and tests 2.5 h; fly fixes and tests 2 h; the test move 2 h; QA 1 h; pin 2 h. With one fix round, about 16 h.
- Supervisor: the 11 rulings, one PLAN ruling, one TOPFAULT blind pass, one panel (2 plates) plus a recheck, PIN GO, a diff-check and a fresh review (about 1.5 h).
- Calendar: a panel about a day after start [est]; pin and train after the recheck. Implementation, release-candidate acceptance and store publication are tracked separately; nothing visible ships, so no APK.
- If both pass, 2 held rows are released, and with them step_up and the SPLIT T card's 5 rows' start (lib-spine-card.md:23).

return: PR and head sha; links to PLAN, PLATES READY, PIN GO and READY; the per-id table (view fields, zoom place and k, flags, chunk bytes, held or not); the page sha256 from two builds; A2's fragment tables and diff output; the D-A3-TESTHOME line map; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'PILOT-A3 resume' (sent to the session or posted on the PR).

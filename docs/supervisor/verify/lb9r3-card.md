Card LIB-21R3: LB9 resume 3. cable_crunch redrawn on LIB-SPINE's spine segments; bicycle_crunch stays held, and its F-BICYCLE-REACH note is written (2026-10-31; status `ready`: the supervisor confirmed the D-LB9R3-* rulings below as written (lib4-cards §48). One amendment to D-LB9R3-SPLIT: before the split is used, the builder fetches both cited sources (curl) and confirms the numbers verbatim; if either cannot be confirmed, the split is the equal split (0.25 each), listed under "Unsourced numbers" as a drawing convention, and the panel judges. It starts on 'LIB-21 resume 3 start' after train 54 (#360, LIB-SPINE #348) is on main.)

Sources (every file:line was read at these heads; [est] marks an estimate, [unverified] what no run here checked):
- #348 head `bf4b8d4d` (LIB-SPINE; review PASS 6543706242, DIFF-CHECK 6547113887; in train 54, #360 `fd15e249`). It contains main `6b32d576`. Every file:line below is at `bf4b8d4d` unless another head is named.
- claude/sup-lib4-cards `dd30aa1a`: lib-spine-card.md (D-SPINE-SEGS :124, -BICYCLE :135, the measured table :114-115, the panel route :151-155), lib4-cards.md §44-§48, lib-21-card.md, lib-small-card.md, lib-16r2-card.md. claude/sup-handover-1445 `bf7ced16`: verify/PANELS.md.
- lb9/DESIGN.md:309-310 (D-LIB21-CCHOLD), :353-376 (D-LIB21-ROPENIT, -CCFLAGS), :395-398, :473-474 (held tables).
- Scratch: a detached worktree of `bf4b8d4d`, npm ci. A scratch rows file named lib_cable_crunch (never committed) let pilot-a2/qa.mjs run LIB-3's runQa, node and browser, with zero exemptions. tests/howto/lb9-plates.test.ts was run in full on each variant. Spec edits were made only in that worktree and restored. Scripts in the supervisor's scratchpad (`spinefollow/scripts/`): cc-variant.mjs, cc-measure.mjs. The LB9 page on the base is `2042e497f92a437a176e54ac88eada6eee7a5df4af522cb08e97521ad1167c55` (two equal builds, lb9/build.mjs).
- Split sources (web, 10-31):
  - Pearcy M, Portek I, Shepherd J, "Three-dimensional x-ray analysis of normal movement in the lumbar spine", Spine 1984;9(3):294-7, as quoted in research protocol NL63033.096.18 v2.0 (clinicaltrials.gov NCT03737227, Prot_SAP_000.pdf §5.5). Mean flexion L1-L2 8°, L2-L3 10°, L3-L4 12°, L4-L5 13°, L5-S1 9° (n 11). [The primary is unverified; the quote is secondary.]
  - J Biomech 2016;49(6):913-918 (abstract as reproduced by the Sharif University repository record). Peak voluntary trunk flexion 118.4 ± 13.9°: thoracic (T1-T12) 20.5 ± 6.5° (lower thoracic 14.8 ± 5.4°, upper 5.8 ± 3.1°), lumbar (T12-S1) 50.2 ± 7.0°, pelvis 47.8 ± 6.9°. [Authors and title unverified; the record names a related thesis by Hajibozorgi M, 2015.]

id: LIB-21R3
model: claude-opus-5-5 (a redraw on a new engine field with a sourced split, a card-truth limit and a design note: judgement work)
mode: auto
title: 'Builder: LIB-21 resume 3, LB9 cable_crunch on spine segments; F-BICYCLE-REACH note'
branch: claude/lib-21-resume-3 (new, from the latest main, which must contain #348; claude/lib-21-lb9, -resume and -resume-2 are the old branches). First push opens draft PR 'LIB-21 resume 3: LB9 cable_crunch on spine segments (build-ahead, nothing ships)'.
slot: plan 7 order 21 (LIB-21 = LB9). The supervisor names the checklist slot in the start message.
lane: one LIB slot under D-LIB-LANE-ACTIVE (lib4-cards:1023). Open lanes at 10-31: #354, #356, #358, #359 [count at start unverified]. LIB-SPINE's card orders it after reverse_lunge's redraw (lib-spine-card.md:16). The two write scopes are disjoint, so they may build in parallel if slots allow. Merges follow the checklist order.

## Why now
- cable_crunch has been held since the slice for one reason (D-LIB21-CCHOLD, lb9/DESIGN.md:310): the curl folds at the one lumbar pivot, so the end hip-shoulder chord is 73.6 / 150.6 px at 780 (0.488). #348 adds per-pivot `trunk.flex` arrays (body.mjs:155-166; SPEC.md:58-65; D-SPINE-SEGS). The split belongs to the spec, a lane size with a basis (lib-spine-card.md:124-125).
- Its R2 and R7 fixes and its verified card fields are kept (lb9/DESIGN.md:310, :356, :362-368). The open item is R1 (lib-spine-card.md:155).
- bicycle_crunch: LIB-SPINE's view depth fixes the draw order, but the spread spine does not close the elbow-to-knee reach (0.377 m against 0.366 m single; 0.181 against 0.183 m at the grid's limits; lib-spine-card.md:115). D-SPINE-BICYCLE (:135) asks this resume for the F-BICYCLE-REACH note, and no ruled route to draw it exists (searched: lib4-cards, HANDOVER, #348 comments). So it stays held, with no spec (lb9-plates.test.ts:864).
- Not in this card: pallof_press (D-LIB21-PALLOFHOLD; F-RESEARCH-2 found no sourced size, lib4-cards:4489) and russian_twist (F-RTWIST-TELL; neither option passes, lb9/DESIGN.md:487). Both stay held.

## The split (D-LB9R3-SPLIT; measured against the alternatives)
- **Rule** [est mapping, sourced numbers]: each pivot carries the motion segments between it and the pivot below; the lowest carries L5-S1. The pivots are L5/S1 .60, L3 .62, T12 .68 and T7 .75 (body.mjs:34). So:
  - L5/S1: L5-S1 9°;
  - L3: L4-L5 + L3-L4 = 25°;
  - T12: L2-L3 + L1-L2 = 18°;
  - T7: the thoracic 20.5°. The thorax above T7 is rigid in the engine, so the upper thoracic 5.8° is carried here too.
- The lumbar shares (Pearcy, L1-S1 52°) are scaled to the J Biomech lumbar total of 50.2°: 8.69 / 24.13 / 17.38. With the thoracic 20.5° the total is 70.7°.
- **Fractions: 0.123 / 0.341 / 0.246 / 0.290** (sum 1.000).
- At the solved end (TRUNK_END 102.33°) the pivots turn 12.59 / 34.89 / 25.17 / 29.68°.

## Measured (scratch on `bf4b8d4d`; 146.29 px/m; bars 22.11 / 11.39 px, qa/envelope.json:12-13)
| split | TRUNK_END (solved to ELBOW_GAP 2 cm) | chord end/start | Trace | deviation (Mistake, tell `seat`) | back curve: largest share of the total turn (sum of absolute turns) in one 0.02 H window | rope min / frames (cm) | QA (node and browser, zero exemptions) |
|---|---|---|---|---|---|---|---|
| single pivot (main) | 99.92° | 0.488 (73.6 / 150.6 at 780) | 58.3 | 28.1 | 42 % at .620 H (the fold) | 0.30 / 0.23 | all 10 pass; F2 0.622, F3 26.05, F5 |
| **sourced 0.123/0.341/0.246/0.290** | **102.33°** | **0.569** (85.7) | **33.60** | **29.95** | **22 %** | 0.30 / 0.25 | all 10 pass; F2 0.622, F3 32.9 (26.045 with the box move below), F5 |
| 0.15/0.2/0.3/0.35 (LIB-SPINE) | 100.73° | 0.588 | 28.0 | 30.9 | 23 % | 0.30 / 0.25 | all 10 pass; F3 38.6 |
| equal 0.25 ×4 | 103.67° | 0.564 | 37.2 | 29.2 | 18 % | 0.30 / 0.24 | all 10 pass; F3 28.9 |
| 0.35/0.3/0.2/0.15 | 104.87° | 0.546 | 47.7 | 27.9 | 25 % | 0.30 / 0.23 | all 10 pass; F3 26.0 |

- **Back curve:** the back surface (z -0.062 H, backMid's depth) is sampled through fk's skin map every 0.005 H from .55 to .80 H at the end pose. The net turn equals the flexion (99.9° and 102.3°).
  - With segments, each pivot's blend zone is bracketed by small counter-turns of -3 to -7° per 0.005 H step (37.8° in total on the sourced split; 4.0° on the single pivot). A step is about 1.3 px at plate scale [the visible effect is unverified at 780 px].
  - The scratch shot reads as a rounded C curl, not a fold (my look; the panel decides).
- **lb9-plates.test.ts on the sourced split** (169 tests):
  - Box as on main: 3 red.
    - :833, the named F3 (32.9 against 26.05);
    - :1274, the "Rope by head" leader 4.78 px from the rope (needs ≥ 6);
    - :1278, the D-LIB21-ROPENIT mutation at {200, 232} now reads 6.57 px, so it is no longer red.
  - With the box at **{200, 234}**: 1 red, only that mutation.
    - The leader gap is 6.43 px; F3 is 26.045 (the named 26.05 ± 0.1 holds); F2 is 0.622.
    - Every A18 test passes: rope 3D ≥ 0.16 cm (start, head); the end arm-to-thigh 2.53 cm; the balance, with com z at the end -0.040 m inside the base -0.630 to 0.049 m.
- **The box search** (minGap of lb9-plates.test.ts:1261-1273, 6 px grid). The QA runs were node and browser.
  - Right of or below {200, 246}: no passing spot.
    - {206-224, 234-246} clear the gap, but QA reds H1.engine:normal:figure (the label on the figure);
    - {194, 222-270} and {200, 240-270} are under 6 px.
  - {200, 234}, {200, 228} and {194, 228} pass all 10 checks. **{200, 234}** is the nearest to the box on main (12 px up).
- **The Mistake** (the hips pull; spine straight, now `{ flex: [0, 0, 0, 0] }`) is re-solved by the spec's own Newton solve (cable_crunch.mjs:227): QM th 43.62, tilt 77.86 (main: 41.40, 88.37). The centre of mass is the end's (z -0.040 m).
- **2 px rule** (D-LB9R3-CLEAR):
  - The cable and the ferrule lie in the body's plane, x = 0. They stay ≥ 15.80 px from every body outline in the start, 8 vias, end and Mistake (least at the start, head), the same on every split.
  - The rope strands sit beside the head in depth (x = ±GX). They are listed with their 3D clearance: ROPE_MIN 0.30 cm, frames 0.25 cm.
  - The column is far from the body.
- **Capping the curl at the sourced 70.7°** (fixed TRUNK_END) does not work:
  - elbow gap 20.55 cm, which is not "near" (c5);
  - Trace 17.9 px, **H3.trace red**.
  - So the end keeps the ELBOW_GAP solve (D-LB9R3-ANGLE).
- **D-SPINE-MIX:** every pose must write the array form. That is the start (cable_crunch.mjs:180), the curl (:202), the Mistake solve (:225) and the Mistake (:229), plus info's trunk read (:302). Otherwise plate.mjs:40 throws.

## Files it may touch (write_scope)
- tools/plates/library/specs/cable_crunch.mjs, only these:
  - the trunk lines :180, :202, :225 and :229;
  - a new SPLIT constant in SIZES (:57);
  - info's trunk read (:302);
  - the "Rope by head" box (:279);
  - the header comment's End and Path lines (:35-39).
  The rope, column, poles, knees, checks, tells and callouts stay.
- tools/plates/library/lb9/rows.json (add lib_cable_crunch: H, side, stage drawing).
- lb9/build.mjs: HELD (:70) loses cable_crunch.
- lb9/sizes.json: a SPLIT row with its basis, and the ELBOW_GAP (:129) and VIA_N (:139) basis numbers (99.9° → the solved value).
- lb9/DESIGN.md: a 'Resume 3' section, the held tables (:310, :398, :474) and the F-BICYCLE-REACH section.
- lb9/qa.mjs: only if a named flag moves (it does not with the box at {200, 234}).
- tests/howto/lb9-plates.test.ts, its own blocks only:
  - HELD (:108);
  - the build.HELD assert (:868);
  - the D-LIB21-ROPENIT comment and mutation (:1277-1281);
  - new blocks for A3-A6.
- docs/COACHING-DECISIONS.md: append one entry.
- **Never:**
  - vendor/**, layers/**, qa/** (other than lb9/qa.mjs as above), zoom/**, golden.mjs, registry.mjs, candidate.mjs, build-page.mjs, plates-page.mjs, MANIFEST.json, batches/**, pages/**, tests/howto/golden/**;
  - eq/** (rope.mjs is imported only, D-LIB21-ROPE);
  - every other spec, and no bicycle_crunch.mjs;
  - docs/research/** (cable_crunch's verified fields stay; lb9/cards.sha.json:5, :15);
  - pilot-a*/**, every other lane's files, src/**, .github/**, scripts/screenshot-gate.mjs, tests/theme.test.ts, package*.json.
- **Collision check** (10-31, files of each open PR): no open PR writes lb9/**, lb9-plates.test.ts or cable_crunch.mjs. The only shared write is the COACHING-DECISIONS append (#356). PILOT-A3's card writes none of these files.

## Do (two waves)
1. **Wave 0, PLAN** in lb9/DESIGN.md 'Resume 3'. Post 'LB9 R3 PLAN READY @ <sha>' and wait for 'LB9 R3 PLAN RULED'. Base: the latest main with #348 in. It gives:
   - this card's split table, re-measured on the base;
   - the split rule and its sources;
   - the sizes.json SPLIT row text;
   - the D-LB9R3-ANGLE numbers;
   - the box move;
   - the expected flags: F2 0.622, F3 26.05 and F5 (D-LIB21-CCFLAGS unchanged).
   The supervisor has the two sources verified (LR-29 form, PANELS.md §8) before the basis is ruled.
2. **Wave 1, cable_crunch** (after RULED).
   - The array trunk in every pose, the SPLIT row, the box at {200, 234} and the rows.json and HELD moves.
   - The tests below, each with its red mutation.
   - Build the LB9 page twice (equal sha256). Run lb9/qa.mjs, node and browser, on every LB9 row with zero exemptions and the ruled flag set.
   - Post 'LB9 R3 PLATES READY @ <sha> (page <sha256>)'.
   - The supervisor runs PANELS §1 (PANELS.md:5-37): cable_crunch alone, target item R1 (D-LIB13-PANEL2: its second round on R1; R2 and R7 kept), hidden anchors pull_up and lat_pulldown, 2 plants. One fix round, then a focused recheck. A second fail holds it (D-LIB8M-CARDTRUE).
3. **Wave 1b, F-BICYCLE-REACH note** (in parallel with 2; no spec, no panel), in lb9/DESIGN.md. Post 'F-BICYCLE-REACH NOTE READY @ <sha>'. The supervisor rules what c5's "nears" means as a drawn gap (D-SPINE-BICYCLE). The note gives:
   - c4, c5's "Lift shoulders until elbow nears opposite knee", c1, c6 and c8 quoted;
   - the reach as the elbow-cap surface to the knee surface in 3D, with A18's capsules, and the screen gap at pitch 75, 80 and 88 with `depth: 'view'`;
   - a grid within the card's limits: knees 90° at the start (c1); the trunk curl on this card's split; trunk yaw; hip flexion of the bent knee "toward the chest" (plate.end); the other leg 15-30 cm off the floor (c5); the lower back down and the hips still (c6, c8);
   - the smallest gap reachable with every limit held, and which limit binds;
   - the options for the ruling, each with its gap. One is the cable_crunch convention of ELBOW_GAP 2 cm surface to surface (lb9/sizes.json:129).
   No check is loosened, and nothing is drawn until a ruling and a new card.
4. **Ready.** Merge origin/main with a merge commit, re-run A2 and A8, and post 'LIB-21 R3 READY @ <sha>'. A fresh Opus review follows.

Stops (post on the PR and wait; never work around one):
- S1 An approved LB9 fragment, a pilot A, PILOT-A2 or pilot B byte, or C0 moves.
- S2 The split cannot reach ELBOW_GAP with the hips still and every A18 test green, or a fix needs an engine, eq/rope.mjs or qa edit.
- S3 A bar is met only by a trimmed Trace, a second moved box, or a change of HINGE, ELBOW_GAP or the Mistake's solve conditions.
- S4 The two sources do not verify. The split then waits for research; it is never replaced by an unsourced split.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
| # | Row | Evidence | Red mutation |
|---|---|---|---|
| A1 | Scope | lb9/rows.json gains lib_cable_crunch once (H, side, no parent or template). HELD (build.mjs:70, test :108, :868) is pallof_press and russian_twist. bicycle_crunch has no spec and is in no rows file | bicycle_crunch added to rows.json; cable_crunch left in HELD; a row set to 'T' |
| A2 | Nothing else moves | APPROVED_FRAGS (lb9-plates.test.ts:1002) byte-equal on the new LB9 page. Pilot A `5d0e562f…`, PILOT-A2 `3e225bc1…` and pilot B `ff3e017c…` equal. C0 []. `git diff --exit-code origin/main...HEAD` empty on the Never paths | One byte in superman.mjs's alt (temporary worktree): its fragment check red |
| A3 | Segments, sourced | Every key pose and the Mistake write `{ flex: [4 angles] }`. Each pose's angles are SPLIT × its total; SPLIT equals lb9/sizes.json's row, with a basis naming both sources | A number trunk in the Mistake: the D-SPINE-MIX throw. SPLIT edited in the spec only: the sizes test red (A17 form) |
| A4 | A curl, not a fold | No 0.02 H window of the end pose's back curve holds more than 30 % of its total turn (sum of the absolute turns, 0.005 H steps) [threshold proposed; 22 % measured] | SPLIT [0, 1, 0, 0], all at L3: 69 %, red (measured; main's number trunk gives 42 %) |
| A5 | End card-true | Each elbow cap is 2 cm from its thigh (ELBOW_GAP, c5); hips unchanged from the start (c3); Trace 33.60 ≥ 22.11 px; deviation 29.95 ≥ 11.39 px; the A18 tests (rope, arm and thigh, balance, knees) unchanged and green | TRUNK_END fixed at 70.7°: elbow gap 20.55 cm and H3.trace 17.9 px, red (measured) |
| A6 | Box and flags | "Rope by head" box {200, 234}; leader gap 6.43 ≥ 6 px. F3 26.05 ± 0.1 and F2 0.622 ± 0.001 hold (lb9/qa.mjs:53, :57) | The box back at {200, 246}: 4.78 px, red (measured). It replaces the {200, 232} mutation, which reads 6.57 px on the new end |
| A7 | 2 px clearance (D-LB9R3-CLEAR) | The cable and the ferrule ≥ 2 px from every body outline in every drawn pose (15.80 measured). The rope strands are listed with ROPE_MIN 0.30 cm and frames 0.25 cm | The ferrule moved 13 px onto the head on screen: red [designed]. The existing A18 mutation (a midline strand through the head) |
| A8 | QA and green | lb9/qa.mjs, node and browser, zero exemptions: all 10 hard checks on every LB9 row; flags = the ruled set. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head; CI green | LIB-3 M1-M7 on cable_crunch; cable_crunch's F2 named at 0.645 (the existing :824 mutation) |
| A9 | F-BICYCLE-REACH note | The note is in DESIGN.md with every item of Do 3 and its numbers. No bicycle_crunch spec (test :864) | (recorded check, no mutation) |
| A10 | Panel | PANELS §1 VALID (both plants caught), R1 median ≥ 4 at that head | The two plants |

## Proposed rulings (for the supervisor before 'LIB-21 resume 3 start')
1. **D-LB9R3-SPLIT:** cable_crunch's SPLIT is 0.123 / 0.341 / 0.246 / 0.290 (L5/S1, L3, T12, T7).
   - The numbers are the sourced flexion (Pearcy 1984 lumbar levels, scaled to the J Biomech 2016 lumbar total, plus its thoracic 20.5°). The level-to-pivot rule is stated [est].
   - Recorded in lb9/sizes.json after the two sources verify (S4).
   - Why not LIB-SPINE's 0.15/0.2/0.3/0.35: it is weighted toward c3's "curl upper body" and c5's "without rounding lower back excessively", but no source gives its numbers. Its Trace (28.0 px) is the closest to the bar.
2. **D-LB9R3-ANGLE:** the end keeps the ELBOW_GAP solve: 102.33°, about 1.45 × the sourced 70.7° peak spinal flexion.
   - The card asks for the hips still (c3), the elbows near the thighs (c5) and "curling the spine as much as you can" (c4). The pelvis's 47.8° that real lifters add is ruled out by c3.
   - Capping at 70.7° breaks c5 and H3.trace (measured).
   - Main's held drawing already turned 99.9° at one pivot. Recorded as a named card-truth limit for the panel's R1, never hidden.
3. **D-LB9R3-ROPEBOX:** the "Rope by head" box {200, 246} → {200, 234}.
   - This is one moved box in the D-LIB21-SUPERMAN form (lib4-cards:4465): the nearest 6 px grid spot that keeps the 6 px leader gap and passes every check.
   - The D-LIB21-ROPENIT mutation becomes "the box at {200, 246}" (4.78 px). No check moves.
4. **D-LB9R3-CURL:** a new test (A4). No 0.02 H window of the back curve holds more than 30 % of its total turn.
   - It makes "curl, not fold" (R1, D-LIB21-CCHOLD) a gate, so it is stricter than today, where nothing is tested.
5. **D-LB9R3-CLEAR:** D-LIB16R2-CLEAR's ruled scope (#354 6543628951 point 1; D-SMALL-9).
   - Tested at 2 px: the cable and the ferrule in the body's plane.
   - Listed with their 3D clearance: the rope strands beside the head.
   - The hands on the rope ends are the card contact (c2).
6. **D-LB9R3-BICYCLE:** bicycle_crunch stays held under D-SPINE-BICYCLE.
   - This resume writes only the F-BICYCLE-REACH note (Do 3). The ruling on "nears" and any spec come later, on a new card.
7. **D-LB9R3-PANEL:** cable_crunch's round is the second on R1 (D-LIB13-PANEL2), with R2 and R7 as fixed items. A fail after its one fix round holds it.

## Risks and mitigations
- **The segmented back shows small counter-turns at each blend zone** (-3 to -7° per 0.005 H step, measured). They come from the engine's SPINE_HW blend, not this lane. Mitigation: renders at 780 px in the PLAN; a critic finding goes to the supervisor, and an engine change is S2 (a LIB-SPINE follow-up), never a lane edit.
- **R1 may still fail on magnitude** (102° of spinal flexion; D-LB9R3-ANGLE). Mitigation: the limit is named on the sheet; the panel judges the shape, and the angle is the card's.
- **The split's sources are secondary quotes.** Mitigation: S4 and the research verify before RULED.
- **The Trace shortens** (58.3 → 33.6 px). It stays 11.5 px over the bar; the trim [10, 12] is unchanged (lb9/sizes.json).
- **A named flag drifts** if any label moves later. Mitigation: A6 pins both flags; only the one ruled box moves.
- **bicycle_crunch is expected to ship.** It cannot until the "nears" ruling and a new card (D-SPINE-BICYCLE). This card releases cable_crunch only.

## Forecast [est]
- Builder, about 8 Opus-hours: PLAN and re-measure 2 h; the redraw and tests 3 h; the F-BICYCLE-REACH note 2 h; QA and READY 1 h. With one fix round, about 12 h.
- Supervisor: the 7 rulings, one PLAN ruling, the source verify (research lane, no LIB slot), one panel (1 plate) plus a recheck, the "nears" ruling, and a fresh review (about 1 h).
- Calendar: a panel about a day after start [est]. Implementation, release-candidate acceptance and store publication are tracked separately; nothing visible ships, so no APK.
- Rows released if it passes: 1 (cable_crunch). bicycle_crunch waits on the ruling.

return: PR and head sha; links to PLAN, PLATES READY, the F-BICYCLE-REACH note and READY; the split table re-measured; the LB9 page sha256 from two builds; A2's fragment table and diff output; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-21 resume 3' (sent to the session or posted on the PR).

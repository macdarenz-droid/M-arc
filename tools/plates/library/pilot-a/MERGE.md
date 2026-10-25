# Pilot A merge

The one pilot A merge document (card LIB-8M, `docs/supervisor/verify/lib-8-merge-card.md` @ 1e85584a; rulings
D-LIB8M-*, lib4-cards.md section 16 at the same sha). DRAWING-GUIDE.md stays the drawing guide.

Heads: research `claude/libht-research` @ 7d7c52e1a69debb0735dc6bb4a3d73ea46740ed5 (<RESEARCH_HEAD>, #109 6256769577);
census `claude/howto-options` @ 4a9fd86 (docs/howto/library/inputs/census.json blob 70553d5d, the same blob as at 1f15570
and 6550ce2; LB1 names 4a9fd86 too); #109 @ 3322d3d (cards copied, nothing redrawn).

## a. Pinned and held

Pinned (14, D-LIB8M-SCOPE), in the page order build.mjs gives at 3322d3d (tier, then flagged first, then list order):

| Tier | Ids |
|---|---|
| A | barbell_row, single_leg_romanian_deadlift, dumbbell_bench_press, incline_dumbbell_press, dumbbell_shoulder_press, barbell_overhead_press, romanian_deadlift |
| B | upright_row, pec_fly |
| C | dumbbell_biceps_curl, rope_triceps_pushdown, plank, mountain_climbers, triceps_pushdown |

The order is build.mjs's (ENVELOPE flags, D-LIB8FIX-ENV). A redraw that changes an ENVELOPE flag moves a plate within its
tier; Do 8 writes pages/pilot-a.json from the order at that head.

Held (5), each with `held` in plates.json, no batch row, no chain entry, never exempted:

| Id | Reason | Follow-up list entry |
|---|---|---|
| barbell_shrug | the small-motion zoom (D-LIB8-shrug) | the shrug zoom |
| dumbbell_fly | needs a raised foot-end camera (plan 2.8) | dumbbell_fly (LIB-20 pitch) |
| bent_over_dumbbell_rear_delt_fly | needs a front-view bent-over torso | the rear-delt fly front view |
| box_jump | no tempo strip without sourced seconds (D-LIB8M-NOSTRIP) | a tempo strip for plates with no sourced seconds |
| reverse_lunge | the same (D-LIB8M-NOSTRIP) | the same |

## b. Tempo (tempo.json)

Rule (D-LIB8M-TEMPO): the concentric phase takes `up`, the eccentric `down`; Hold takes `pause` right after the
concentric, only if pause > 0. Any other static phase, and a cycle plate's Work and Rest, is a constant only with a quote
that states its seconds; a range is the quote's string. Phase names, order and move flags are labels from the spec.

| Id | Card plate.tempo (claim) | Built tempo | Spec today | Change |
|---|---|---|---|---|
| dumbbell_bench_press | up 1, down 2, pause 0 (c15) | Lower←down 2, Press←up 1 | same | none |
| incline_dumbbell_press | 1, 2, 0 (c14) | Lower←down 2, Press←up 1 | same | none |
| dumbbell_shoulder_press | 1, 2, 0 (c12) | Press←up 1, Lower←down 2 | same | none |
| barbell_overhead_press | 1, 2, 1 (c20, c17) | Press←up 1, Hold←pause 1, Lower←down 2 | Press 1, Lower 2 | add Hold 1 (R-LB2-6; spec :241 and :52) |
| barbell_row | 1, 2, 0 (c13) | Pull←up 1, Lower←down 2 | same | none |
| romanian_deadlift | 1, 2, 0 (c20) | Lower←down 2, Stand←up 1 | same | none |
| single_leg_romanian_deadlift | 1, 2, 1 (c16) | Lower←down 2, Stand←up 1, Balance←pause 1 | same | none |
| dumbbell_biceps_curl | 1, 2, 0 (c9) | Curl←up 1, Lower←down 2 | same | none |
| upright_row | 1, 2, 0 (c10) | Pull←up 1, Lower←down 2 | same | none |
| triceps_pushdown | 1, 2, 1 (c12) | Press←up 1, Hold←pause 1, Return←down 2 | same | none |
| rope_triceps_pushdown | 1, 3, 1 (c13) | Press←up 1, Hold←pause 1, Return←down 3 | same | none |
| pec_fly | 2, 2, 2 (c12) | Close←up 2, Hold←pause 2, Open←down 2 | same | none |
| plank | hold "10-60 s" (c12, c6) | Hold = '10–60' (c12: "Hold: 10–60 seconds") | same | none |
| mountain_climbers | work "15 s", rest "15 s" (c13) | Work 15 move, Rest 15 (c13: "15 seconds of work and 15 seconds of rest") | same | none |

No card second differs from its spec except the ruled OHP Hold, so there is no CARDTRUE tempo item. OHP's bottom rest
(c20, "Rest at the bottom for a second") gets no constant (Q3: allowed, never required). The SLRDL Balance phase is the
static phase right after the concentric Stand, so it takes `pause`.

## c. plateFacts

Rules: 14.7 rules 10-15 (kind 'angle' on every angle row, the quantity measured, the spec's pose name, one form per
fact) and D-LIB9-FACTPOSE (a fact's pose is the pose its quote states; a setup quote is the start pose only). Every value
is from a verified quote; none is read from a spec or a render. H6 checks an angle fact on the joint path
(rep.angles[pose][joint]) or the measure path (spec.measure.expect and the drawn measure, ±2°; qa/node.mjs:160-164).

| Id | Proposal | Quantity, quote |
|---|---|---|
| incline_dumbbell_press | `{ kind: 'angle', measure: true, pose: 'start', deg: 45, claim: 'c1' }` | back-pad angle from vertical (the spec's measure, expect 45); c1 Human Kinetics: "the back pad of the bench is set at an upward angle (approximately 45 degrees)". A setup quote, so pose 'start'; the bench is static, so the drawn value is the same in every pose |
| romanian_deadlift | `{ kind: 'angle', measure: true, pose: 'end', deg: 165, claim: 'c4' }` | knee inside angle (the spec's measure, vertex knee.r, hip to ankle, expect 165); c4: "you lock your knees at a slight bend (about 15°)". 165 = 180 − 15. **Question 1** |
| the other 12 | `[]` (no fact) | No verified quote states a single number H6 can check: single_leg_romanian_deadlift c10 "15-20 degrees of knee flexion" and pec_fly c4 "75 to 90 degrees" are ranges, and pec_fly's quote is about the elbow-pad version; every other card number is a load, EMG or injury figure. **Question 2** |

## d. Redraws

Each changes only the spec's `mistake` object, its own constants and helpers, and the header lines about the Mistake
(Do 6). Poses, callouts, measure, trace, checks, equipment and reclined() stay. The old first tell keys (for A4's
mutation) are: shoulder press 'arch', incline press 'tilt', curl 'lean', pushdown 'elbows', rope pushdown 'elbows'. New
keys are labels only; the blind TOPFAULT pass picks among the redrawn tells.

1. **dumbbell_shoulder_press** (c10: "Lowering the dumbbells behind the head, into the behind-the-neck position.")
   - Change: the arch Mistake (pelvis tilt, lumbar line and gap fill) goes. The Mistake pose lowers the dumbbells behind the head: the upper arms swing back, so the grips sit behind the head's back outline at about ear height, and the forearms stay vertical.
   - Tells: 'behind', "The dumbbells drop behind your head." (first); 'elbows', "The elbows pull back behind your shoulders.".
   - 2 s read: in side view the red arm outline and dumbbell end behind the head, with the normal dumbbell in front of the face; the gap between them is the fault.
   - Same: the seat, back pad and bench (inclineBench), poses, callouts, measure (elbow 180) and tempo.
   - Risk: the faulty arm crosses the head outline. The engine masks the faulty outline inside the faulty body, so the arm may need Mistake guides, as the OHP Mistake did (critic R5). If it cannot read clearly, it goes back to the critic as a fix round.
2. **incline_dumbbell_press** (c8: "Low back arching off the bench as the dumbbells go up.")
   - Change: the forearm-tilt Mistake (ghost forearm, drift arrow) goes. It uses pilot A's approved arch method, the e6f39ff dumbbell_shoulder_press Mistake: the pelvis tips, a dashed red lumbar line bows off the pad, and the gap between pad and back is cleared (section 13 "shoulder_press: ACCEPT").
   - Tells: 'arch', "Your low back arches off the bench as you press." (first); 'hips', "Your hips tip and your belly pushes up.".
   - 2 s read: a visible gap under the low back on a 45° pad.
   - Same: the bench, poses, callouts, measure (45°) and tempo.
3. **dumbbell_biceps_curl** (c6: "Wrists bending up or down during the curl instead of staying straight, in line with the forearm.")
   - Drawable: yes. The engine has a sagittal wrist joint (vendor body.mjs:94, :132 `rotX(-q.wrist)`), and the side view shows sagittal rotation. One direction is drawn: the wrist curled (flexed), at mid-curl.
   - Change: the lean and hip-drive Mistake goes. The Mistake pose bends the near wrist so that the dumbbell and hand break the forearm line.
   - Tells: 'wrist', "Your wrist bends instead of staying in line with the forearm." (first); 'grip', "The dumbbell tips toward you.".
   - 2 s read: a red kink at the wrist, with a dashed straight-line guide continuing the forearm.
   - [unverified until rendered] The hand is small at plate scale. If the kink does not read in 2 s, the note goes back to research under R-LB2-4 (drawable false), and no drawing is forced.
4. **triceps_pushdown** (c11: "Leaning too far forward over the bar or arching the back to press it down.")
   - Change: the elbow-drift part goes (it is not the card's fault). The lean becomes the whole Mistake: the trunk tips forward over the bar from the hips, upper arms at the sides.
   - Tells: 'lean', "You lean far forward over the bar to push it down." (first); 'arch', "Your back arches as you press.".
   - 2 s read: the red torso outline tipped well past the normal torso, head over the bar.
   - Same: cable, pulley, bar, poses, callouts (the "Not locked" measure) and tempo.
5. **rope_triceps_pushdown** (c12, the same fault with the rope): the same plan as 4 with the rope composer. The cable twin stays in the Mistake pose (rope.mjs mistakeTwin).

single_leg_romanian_deadlift is not a sixth redraw yet (D-LIB8M-SLRDL). At 7d7c52e its plate.mistake is the rounding (c7), drawable true, and handlingMistakes[0] is the rounding: branch (b). Its first drawn tell is 'round'. It becomes a sixth redraw only if the blind pass answers 'low' or 'several'. Its spec's `pilot.drawableFault` line now contradicts the card. **Question 3.**

## e. Expected LIB-3 flags

LIB-3's measures have not run on pilot A yet; Do 9 measures them. The expected set:

| Flag | Ids | Reason |
|---|---|---|
| F1 | plank (174.22 px/m), mountain_climbers (191.92) | the approved floor line, D-LIB8-floor; outside [123.91, 146.29] |
| F5 | all 14, value exactly 3.57 | the selected Mistake tell in midnight, the 8's locked chrome (D-LIB9-F5) |
| F7 | none | all 14 cards are drawable true at 7d7c52e (SLRDL branch (b)); the redraws draw the card's fault first |
| F3 | mountain_climbers | its normal leader is 116.4 px, over 82.26; Mistake leaders and the 49.33 lower end are unmeasured |
| F4 | barbell_row (0 boxed), single_leg_romanian_deadlift, dumbbell_bench_press, incline_dumbbell_press, dumbbell_shoulder_press, dumbbell_biceps_curl (1 each) | pilot A's count is under LIB-3's lower end of 2. The redraws may change the count |
| F2 | not predicted | LIB-3's F2 is the figure's box area (qa/browser.mjs:49-53); pilot A measured another quantity |

[unverified] Every row except F1 is a prediction from pilot A's own measures at 3322d3d. Do 9 posts the measured set, and
I report any difference before any other step.

## f. Rows, pages and the page config (Do 8)

- tools/plates/library/batches/pilot-a.json: `{ "batch": "PILOT-A", "censusRef": "4a9fd86", "pages": { "plates": "tools/plates/library/pages/pilot-a.json", "layers": "tests/howto/golden/library/pilot-a.layers.html", "layersConfig": "tools/plates/library/pages/pilot-a.layers.json" }, "rows": { "lib_<id>": { "src": "library/specs/<id>.mjs", "slug": "<id with hyphens>", "prefix": "<the page's svg id prefix>", "chromeId": "<id with hyphens>", "mode": "H", "view": "<census view>", "sources": [<sourceLines(card)>], "stage": "review" } } }`, one row per pinned id. Views: upright_row and pec_fly 'front', the other 12 'side'. Neither layers file is created (D-LIB8M-PAGES).
- tools/plates/library/pages/pilot-a.json: build.mjs's groups (ids `lib_<id>`, in the order above) and its plates-page heading.
- tools/plates/library/howto/lib_<id>.howto.mjs: `id` and `research.card` ('docs/research/howto/cards/<id>.json') only.
- Equality: pageConfig(pages/pilot-a.json) gives the same groups, the same spec paths (cardIdOf(row) = <id>; tools/plates/library/specs/<id>.mjs), the same sources (the same sourceLines of the same card) and the same heading as build.mjs. So buildPlatesPage gives the same bytes. lib8-pin.test.ts (A10) asserts that, and that two builds are equal.

## Questions for the note ruling

1. romanian_deadlift's fact: is 165 (= 180 − the quoted 15° bend, the inside angle the measure states) an allowed value, or does the fact need a quote that states 165 or a knee "bend from straight" measure? The alternative is `[]` for this id too.
2. plateFacts `[]`: H6 returns 'H6:no-card' when plateFacts is missing (qa/node.mjs:155), and no hard check may be exempted (Stops 3). So `[]` is the only way for tempo to be checked on an id with no sourced number. LIB-5's rule for the 8 ("never []", lib4-cards 14 item 24) kept their 'H6:no-card' exemption, which pilot A cannot have. Is `[]` allowed for these 12 (or 13) ids?
3. single_leg_romanian_deadlift's `pilot.drawableFault` (spec :183) says the top fault is c5 and cannot be drawn. The card at 7d7c52e now says c7, drawable true. That line is outside the `mistake` object, and it raises build.mjs's sheet F7, which also sets the page order (SLRDL is now second in tier A). Removing it moves the page order but no fragment. May Do 6 remove it?

## Changes after the ruling

- D-LIB8M-DEG, D-LIB8M-NOFACTS and D-LIB8M-SLRDLLINE (#109 6257000888): the three questions are answered as proposed.
- D-LIB8M-MISTAKEPARTS (6257123813): for the redraw ids, a `checks` entry with `pose: 'mistake'` and an `equipment` term that draws only when `ctx.mistake` is set count as part of the Mistake.
- dumbbell_biceps_curl (R-LB2-27, research f57e7944ebb366a71f812146287ff0c4a6d2edef, #109 6257414726):
  - The bent wrist (c6) does not read in the side view (6257128107). Its card is now drawable false; plate.mistake is the elbows drifting (c4), and handlingMistakes[0] stays the bent wrist.
  - The curl is the fifth redraw. Its Mistake: the elbows drift forward near the top. Tells: 'elbows' (first), then 'shoulder'.
  - Its Mistake-pose check needs the elbow 10 cm in front of the shoulder joint's plane; the correct pose is 10 cm short of it.
  - Expected flags gain F7 on dumbbell_biceps_curl: the drawn fault (elbows) is not the card's top fault (the bent wrist). It stays raised for the owner's named exemption (section 13 Q1, drawable false).
- Research head for all 14 cards: f57e7944. Only the curl card differs from 7d7c52e1.
- Critic panel and TOPFAULT (D-LIB8M-CRIT1, D-LIB8M-TF1; lib4-cards.md section 21 @ 47ade203; #109 6258287101, 6258289883):
  - fix round: the incline press arch is a dashed back outline off the pad, with its tells byte-identical. The bench tells are reordered so 'arch' is first.
  - triceps_pushdown, rope_triceps_pushdown, upright_row, pec_fly and plank now have one tell, which names the card's one fault: 'lean', 'lean', 'chin', 'short', 'sag'.
  - A4 now reads: F7 is not raised, except on dumbbell_biceps_curl (D-LIB8M-TF1 4). A4's redraw set adds dumbbell_bench_press and the five ids above.
  - The expected flags (e) add F7 on dumbbell_biceps_curl, a drawable-fault plate (bent wrist, c6, not visible side-on; R-LB2-27). Its topFault is 'wrist-bend'.
- incline_dumbbell_press held (D-LIB8M-CARDTRUE, D-LIB8M-CRIT3; lib4-cards.md 21.6 @ b3b904e9): the arch still does not read at phone size after its last critic run.
  - A `held` line in plates.json; no batch row, no How-to file, off the page and the pin. Pilot A pins 13 ids; 6 are held.
  - Its card copy, quotes and the three keys stay as verified (A6 and A7 still check them); its tempo.json row stays with its card.
  - Its coverage stage reads `queued`, like the other held ids: the registry takes a stage only from a batch row, and a held id has none (A11).
  - Follow-up: its Mistake redraw goes to LB2 (LIB-10, D-LIB10-PA).
  - The page drops its article and nothing else: no fragment of the 13 moved, and their order is unchanged.
- plank held (D-LIB8M-PLANKHOLD, #109 6381763639): routed R1 makes the top fault "Hips hiked up." (D-SUP-LB9-PLANK), and the drawn Mistake is the sag, so the redraw goes to LIB-21.
  - It gets a `held` line, and its batch row and How-to file are removed. Pilot A pins 12 ids and holds 7. Its card copy and keys stay.
  - The page drops its article and nothing else (b97795e9…, 1,237,093 B; 0 fragments of the 12 moved).

LB6 research verify (LR-29) on #287 @ d5fb65b3: result, rulings and findings (2026-10-22)

**Ruled by the supervisor (session_01PeNM9HeWPrhrcscMwXzupy, 2026-10-22): R-LB6-4 to R-LB6-10 are accepted as written. R-LB6-4 and R-LB6-5 apply D-SUP-PROTECT and LR-31 step 1 literally (a "most people" frequency hit about this exercise's own fault counts; a speed-only fault is never drawable).**

LB6 research verify (LR-29) on #287 @ d5fb65b3d4505491e6854016692ed39ebb8297a1: result, proposed rulings and findings (2026-10-22)

## Run
- History-free copy of the 13 cards and their quotes in three blind groups (h1 5 cards, h2 4, h3 4). Each group had one fresh Opus critic and 2 plants; plantScope was every field. The critics re-fetched every source with curl (PubMed through NCBI efetch). Copy check: orig/ is byte-identical to the head, and only the 7 planted files differ from it; rules/RULINGS.md and rules/CARD-V2.md match the head.
- h1 (smith_machine_squat, cable_chest_press, machine_pullover, machine_crunch, smith_machine_incline_press): **VALID**. P1a (tier A, squat feel.rows[2].fix "Cut the depth and finish the set.") was caught as a blocker. P1b (incline LR-31 pick swapped to the arch) was caught as a high. 35 of 36 sources were fetched, and 158/158 checked quotes are verbatim. The 10 mq-pullover quotes were not checked: the page gives 403 and web.archive.org is blocked.
- h2 (smith_machine_shoulder_press, smith_machine_shrug, low_to_high_cable_fly, high_to_low_cable_fly): **VALID**. P2a (tier A, shoulder press risks[0] "thumbless grip") was caught as a blocker. P2b (high_to_low c7 credited to ace-top3-chest) was caught, rated blocker. 25/25 sources fetched; 118/120 quotes verbatim on the copy, and both misses are P2b. At the head the count is 120/120.
- h3 (machine_lateral_raise, rear_delt_fly, hip_abduction, hip_adduction): **VALID**. h3 has no tier-A card. P3a (rear_delt_fly feel.rows[2].fix weakened to "Shorten the range") was caught as a blocker and counts as the safety plant. P3b (hip_adduction tempo 3-1-2, down 3) was caught as a high. 19 of 20 sources were fetched, and 117/117 checked quotes are verbatim. laf-lat-raise gave 429 to the critic. This verifier re-fetched it once with a Safari user agent and Accept, Accept-Language, Referer and Sec-Fetch headers: HTTP 200, 4/4 quotes verbatim at their stated places, no frequency word on the page. So h3 is 121/121.
- Totals at the head: 399 of 409 quotes verified verbatim. The 10 unverified quotes are all mq-pullover (Marquette), the anchor of machine_pullover. This verifier retried it with the same headers and got 403 again.
- Supervisor 10 % re-fetch: 41/41 verbatim. One Motra cable_chest_press quote (the Tempo tooltip, c16) is only in the page's embedded payload, not the visible text (see R-LB6-7).
- Plants: 6/6 caught, each in the planted field with the right problem. Their 6 findings are removed below.
- Special checks:
  - **hip_adduction tempo:** the 3-1-2 is the plant (P3b). The head has down 2, and c9 and tempo.text both say 2-1-2. The live Motra page (curl today) shows "Tempo 2-1-2", so there is no real finding.
  - **Motra tempo values:** all 10 Motra pages show the card's digits and carry the tooltip (squat and incline 3-1-1; shoulder press, shrug, cable press, crunch and both hip machines 2-1-2; lateral raise 3-1-2; rear delt 3-1-1).
- Real findings, plants removed: **0 blocker, 2 high, 9 medium, 39 low**. 7 critic items are not actioned (see that section).

## LR-31 and LR-33
- **LR-31:** at the head the critics agree with 11 of 13 picks:
  - squat: step 2;
  - cable_chest_press: step 2, settled by D-SUP-LB6-CCP;
  - pullover: step 2;
  - crunch: step 3, with "Straining neck" not counted;
  - incline: step 3. The critic's "disagree" is P1b; its pick matches the head;
  - shrug: step 3;
  - low_to_high: step 1, drawable false;
  - high_to_low: step 1, with the crossed handles drawn once c7 is on ace-decfly;
  - lateral raise: step 2;
  - hip_abduction: step 3;
  - hip_adduction: step 2.

  There are two real disagreements:
  - **smith_machine_shoulder_press.**
    - Head: step 2 picks the back arch. Fitness Volt's core cue ties it to harm, and D-SUP-PROTECT point 1 accepted that pick "as you say".
    - Critic: Fitness Volt's elbow cue for this exercise ends "This is both to maximize your pressing ability and protect your shoulder joints." (verbatim on the page today). D-SUP-PROTECT ties a fault to harm whenever the cue that corrects it "protects" a named body part, so it ties "Flaring elbows wide" (Motra list item 1) to harm. The flared elbows and the arch ("Poor core engagement", item 4) then tie at step 2: both are on the list, one source each, both direct. LR-31's next tie-break, "the earlier on a list that names both", picks the flared elbows. They are drawable from the side, as the head's own rankNote says.
    - **Recommendation: the critic.** D-SUP-PROTECT point 1 rested on the premise that the arch was the only harm-tied fault, and the fetched page shows that premise is false. Using "protecting your lower back" while skipping "protect your shoulder joints" on the same page is inconsistent. The card already ties shoulder pain to flared elbows in feel.rows[2]. See R-LB6-4.
  - **rear_delt_fly.**
    - Head: step 3, momentum. Fitness Volt's "2. No Mind-Muscle Connection" item is about effort, so it is not a candidate.
    - Critic: step 1, rushing. "While performing this exercise, most people go through the motions for the sake of it. They'll put more weight on the machine than they can handle and rush through the movement just to achieve their rep target." Here "They'll" carries "most people".
    - **Recommendation: the critic.** LR-31 step 1 counts a quote saying that "most ... people" make a candidate fault of this exercise. LR-31 itself names "rushing" as a fault, a speed-only one. The load half of the sentence is set aside as a load. A list heading does not turn the movement it describes into a muscle-activity finding. plate.mistake (the shrug, drawable false) does not change; only handlingMistakes[0] and the rankNote change. See R-LB6-5.
- **LR-33:** 13/13 agree at the head. The one LR-33 "disagree" is P3b. hip_abduction's values are right, but its text places the bottom pause wrongly (hip_abduction-3).

## Proposed rulings (R-LB6-4 to R-LB6-10)
- **R-LB6-4, smith_machine_shoulder_press top fault (LR-31, D-SUP-PROTECT).** Under D-SUP-PROTECT, Fitness Volt's "This is both to maximize your pressing ability and protect your shoulder joints." ties the flared elbows to harm. Motra's list order then picks them over the arch at step 2.
  - This replaces point 1's "(the back arch), as you say" for this card.
  - Fix:
    - Add the sentence to c5 and to quotes/smith_machine_shoulder_press.json.
    - plate.mistake: what "Elbows flared wide, out level with the shoulders instead of in front of them.", claim ["c10","c5"], drawable true, why from c10 and c5.
    - handlingMistakes:
      - [0] "Elbows flaring wide." / "Keep your elbows in front of your shoulders." ["c10","c5"];
      - [1] the arch, as now;
      - [2] the elbow lock, as now.
    - The bench placement leaves handlingMistakes. It is a setting (R-LB2-12) and stays in setup[0]; its text goes in notes.
    - feel.rows[2].claim becomes ["c9","c10","c5"].
    - viewWhy adds the flared elbows (R-LB2-4).
    - rankNote rewritten:
      - step 2;
      - the full tie order;
      - the arch set aside on Motra's list order;
      - StrongLifts' "They'll usually be inclined because your elbows are too far back." set aside as another exercise.
    - Report PICK CHANGED. The CARD FIELDS verifier re-runs for this card.
- **R-LB6-5, rear_delt_fly step 1 (LR-31).** The Fitness Volt two-sentence quote (37 words) counts at step 1 for rushing: speed only, drawable false.
  - Fix:
    - A new claim holds that quote and "You should lower the weights and slow down your rep tempo if you can't achieve a rear delt pump or at least feel muscle contraction." (verbatim today), with entries in the quotes file.
    - handlingMistakes:
      - [0] "Rushing the reps." / "Slow down your rep tempo.";
      - [1] momentum.
    - To keep 3 items, the last one (hunching, c7) is dropped; it stays in posture[1], and its text goes in notes (the R-LB2-2 precedent).
    - plate.mistake is unchanged.
    - rankNote: step 1 with the quote, the next-fault chain as now, and "The reverse pec deck fly is one of the most popular but incorrectly performed exercises." set aside (popularity).
    - Report the top-fault change.
- **R-LB6-6, stop lines (systematic; LR-6 R1, CARD-V2 "every word of a line comes from the claims it cites").** R-LB3-4 applies to every pain row or risk that carries a stop, for any body part, not only the shoulder. Where the cited claims hold no stop words, it replaces R-LB2-17's "Add 'Don't train through the pain.' where LR-27 allows it".
  - For each of these lines:
    - cable_chest_press feel.rows[2] and [3];
    - machine_crunch feel.rows[2];
    - smith_machine_shoulder_press feel.rows[1];
    - low_to_high_cable_fly feel.rows[2];
    - high_to_low_cable_fly feel.rows[1];
    - hip_abduction feel.rows[1];
    - hip_adduction feel.rows[1] and risks[1].
  - Either cite a fetched, verbatim quote (at most 50 words) that supports stopping for that pain, or rewrite the line in LR-6 shape (place, the source's fault, a sourced fix), letting the linked red-flag box and the disclaimer carry the stop.
  - A row's place names pain only if a cited quote does.
  - F-LB3-2 stays open for LB2.
- **R-LB6-7, Motra Tempo tooltip.** The tooltip line is in each Motra page's served HTML, as the tooltip prop of the "Tempo" heading in the embedded payload. It is verbatim on all 10 pages (curl, 2026-10-22).
  - It counts as verbatim under PANELS 8 ("verbatim in the raw HTML"), and its where stays "Tempo heading tooltip".
  - R-LB6-2's fixed-order reading stands, and F-LB6-1 is not logged.
  - Follow-up F-LB6-2: pilot B's smith_machine_bench_press "2-1-1" (R-PB-3, read as undefined order) is re-read with the tooltip in its next pass.
- **R-LB6-8, unreachable sources.**
  - laf-lat-raise answers to curl with a Safari user agent plus the Accept, Accept-Language, Referer and Sec-Fetch headers. The fix session re-fetches it that way, sets its checked to 2026-10-22, records the headers, and removes the gaps entry.
  - mq-pullover still gives 403. Its gaps entry stays, as the brief rules.
  - In quotes/machine_pullover.json, each of its 10 entries gets a note: "carried from g5 (2026-09-30), not re-fetched 2026-10-22 (403)". The file then no longer claims a check that did not happen.
  - Follow-up F-LB6-3: re-fetch Marquette when it answers, because it is the card's anchor.
- **R-LB6-9, claim reference shape (CARD-V2: one id, a list, or inherit:<n>).** The comma-joined claim strings on the 7 LB6 cards become lists in the fix round (mechanical).
  - Follow-up F-LB6-4: the 15 other head cards with comma strings go to their batch's next research pass: straight_bar_triceps_pushdown, overhead_cable_triceps_extension, wrist_curl, dumbbell_overhead_triceps_extension, single_arm_triceps_pushdown, incline_dumbbell_curl, reverse_curl, preacher_curl, bayesian_cable_curl, alternating_dumbbell_curl, hammer_curl, cross_body_hammer_curl, concentration_curl, cable_curl and barbell_curl.
- **R-LB6-10, everything else; one round.**
  - Every other medium and low: apply the fix as written. A fix that adds a quote fetches it verbatim (at most 50 words) and adds it to quotes/<id>.json.
  - Before pushing, all of these must pass:
    - valid JSON;
    - the dry run;
    - copy lint and C8 at 0 hits;
    - every new quote re-fetched.
  - Post "LB6 RESEARCH FIXED @ <sha>". The supervisor rechecks the changed lines, and the CARD FIELDS verifier re-runs for shoulder_press and rear_delt_fly.

## Not actioned (not real at the head, or already ruled)
- cable_chest_press feel.watch `core`: LR-35 sends this card, one of the 10 with core in a feel role, to LIB-MUSCLE.
- machine_pullover and machine_lateral_raise "move the unreachable-source note from gaps to notes": the LB6 brief says "If a source cannot be fetched, say so in the card's gaps".
- machine_lateral_raise plate.viewWhy "stale": R-LB2-4 and R-LB6-3 keep viewWhy's original words, and the head adds a sentence naming the new drawn fault.
- `"fix": ""` on machine_pullover, machine_crunch and high_to_low_cable_fly rows[0]: CARD-V2's schema writes `"fix": ""`, and 58 head cards use it.

## Findings (id-n, severity, field: problem. Fix)

**smith_machine_shoulder_press**
- smith_machine_shoulder_press-1 (high) `plate.mistake`, `handlingMistakes`, `plate.mistake.rankNote`, `feel.rows[2].claim`, `plate.viewWhy`: Wrong top fault. Under D-SUP-PROTECT, Fitness Volt's elbow cue ("... protect your shoulder joints.") ties "Flaring elbows wide" (Motra item 1, c10) to harm. It ties with the arch at step 2, and Motra's list order picks the flared elbows. The rankNote says the arch is "the only named fault of this exercise tied to harm", and handlingMistakes has no flared-elbow item. Fix: R-LB6-4.
- smith_machine_shoulder_press-2 (medium) `feel.rows[1].fix`: The back-pain row's "Stop and don't train through the pain." rests on c9's "Stop if shoulder pain occurs" (the shoulder only) and on c4, which has no stop words. Fix: R-LB6-6 (for example, LR-6 shape "Press your upper back into the pad.", with the back box carrying the stop).
- smith_machine_shoulder_press-3 (low) `plate.mistake.rankNote`: The fallback says the flared elbows "win step 2's list tie-break", but both faults are on Motra's list, so the deciding tie-break is list order. StrongLifts' "They'll usually be inclined because your elbows are too far back." is not set aside. Fix: covered by R-LB6-4's rankNote rewrite.
- smith_machine_shoulder_press-4 (low) `setup[0]`: "Bench at 70 degrees." is exact, but c1 says "roughly 70-degree". Fix: "Bench at about 70 degrees. The bar should just clear your nose."

**rear_delt_fly**
- rear_delt_fly-1 (high) `handlingMistakes[0]`, `plate.mistake.rankNote`: LR-31 step 1 has a hit for rushing ("most people ... rush through the movement", Fitness Volt, this exercise). The rankNote sets it aside as an effort item, and handlingMistakes[0] stays momentum. Fix: R-LB6-5.
- rear_delt_fly-2 (low) `handlingMistakes[0].fix` (momentum; [1] after R-LB6-5): "Lower the weight" is not in c6; c8 holds the "too heavy" words. Fix: claim ["c6","c8"].
- rear_delt_fly-3 (low) `setup[3].claim`, `zooms[2].claim`: "c10, c3" is a comma string. Fix: ["c10","c3"] (R-LB6-9).
- rear_delt_fly-4 (low) `plate.mistake.rankNote`: "The reverse pec deck fly is one of the most popular but incorrectly performed exercises." is not quoted. Fix: covered by R-LB6-5 (set aside: popularity, no named fault).
- rear_delt_fly-5 (low) `claims.c14.tags`: c14 cites ACSM 2009 for tempo without WEAK (LR-15). Fix: add WEAK.
- rear_delt_fly-6 (low) `claims.c8`: Fitness Volt's "If you feel a scapular retraction, you are probably going too heavy." conflicts with Motra's "Squeeze your rear delts and shoulder blades together at the peak." and its cue "Squeeze shoulder blades". The card does not say so. Fix: state the conflict in c8's text and which source the card follows.

**smith_machine_squat**
- smith_machine_squat-1 (low) `plate.mistake.rankNote`: Step 2 does not quote Gold's other "protect" ties: "This helps protect your knees and keeps your joints in better alignment." (the feet, c2), and for the back's cue "Brace your core to protect your spine and keep your torso stable as you move." and "a tight core protects your spine". All are on Gold's page today. Each fault still has one harm source, so the pick holds. Fix: add the three quotes to step 2 with that reason.
- smith_machine_squat-2 (low) `setup[4]`, `handlingMistakes[0]`, `handlingMistakes[2]`, `feel.rows[1]`, `feel.rows[3]`, `risks[1]`, `risks[2]`, `zooms[1]` (claim): These are comma strings. Fix: lists (R-LB6-9).
- smith_machine_squat-3 (low) `zooms[0].wrong`: The shown text has jargon ("(on-body waiter-tray)"), and no quote names the wrong position (c5 gives only the right one). Fix: `wrong: null` (LR-25), or a fetched quote for the bent-back wrist without the parenthesis.
- smith_machine_squat-4 (low) `feel.rows[1].where`: "Lower back working more than legs" adds a comparison that c11 does not make. Fix: "Lower back".

**cable_chest_press**
- cable_chest_press-1 (medium) `feel.rows[2].fix`, `feel.rows[3].fix`, `feel.rows[3].where`: The stop words in "Stop and don't train through the pain." are in none of c6, c7 or c13. Row 3's "Shoulder pain" rests on quotes that say "stress". Fix: R-LB6-6. rows[3].where becomes "Shoulder" unless a cited quote names pain.
- cable_chest_press-2 (low) `claims.c15.text`, `plate.tempo.text`: c15 still says "the 1 s up is a drawing convention", but up is now 2 (Motra, c16). tempo.text does not name NFPT's "semi explosive" press against Motra's 2 s. Fix: c15 backs only the 2-3 s lowering. tempo.text names the conflict. Values stand (2/2/0).

**machine_crunch**
- machine_crunch-1 (medium) `zooms[0]` (crunch-arms), `plate.mistake.why`, `notes`: The anchor tells the lifter to pull the handles: ACE's "Grasp the handles in both hands, and pull down on them to lean forward." (c3) and Fitbod's "while pulling the handles down with in order to keep the pads on your shoulders". The zoom's wrong, "Arms pulling the handles down.", cites c3. The card does not record the conflict. Fix: wrong becomes "Arms doing the pull while the trunk stays upright.", claim "c14" (c3 stays on the right only). Name the ACE/Fitbod against Motra conflict in plate.mistake.why and notes.
- machine_crunch-2 (medium) `feel.rows[2]`: The stop is unsourced. c6 ("prevent back strain") names no pain and no stop. Fix: R-LB6-6. where becomes "Lower back" unless a cited quote names pain.
- machine_crunch-3 (low) `feel.rows[3].fix`: No quote ties "Start the crunch with your abs." to neck strain; Motra lists "Straining neck" and "Initiate with core" separately. Fix: fix null (LR-6), or a quote that links them.
- machine_crunch-4 (low) `handlingMistakes[2]`, `risks[1]`, `zooms[0]` (claim): These are comma strings. Fix: lists (R-LB6-9).

**machine_pullover**
- machine_pullover-1 (medium) `libraryDiff.why`: It says "no source found names the triceps", but Virtuagym (a read source, used for chest in c13) lists "Secondary muscles: Triceps". Fix: either keep the triceps, or keep the removal with this reason: "Virtuagym lists the triceps for a handle machine; on the elbow-pad machine drawn here the hands stay open and the force is at the elbows (c6)."
- machine_pullover-2 (low) `handlingMistakes[0].fix`, `feel.rows[1].fix`: "keep your back and head on the pad" is c7, which is not cited. No quote ties "Lower the weight" to the arch. Fix: claim ["c8","c7"]. Drop "Lower the weight" unless a quote links the load to the arch.
- machine_pullover-3 (low) `quotes/machine_pullover.json`: The 10 mq-pullover entries say "verbatim" under the file's checked date 2026-10-22, but they were not re-fetched. Fix: R-LB6-8.
- machine_pullover-4 (low) `risks[1]`: "Too much weight takes the work off the lats." overstates c9. Fix: "Too much weight makes the lats harder to feel."

**smith_machine_incline_press**
- smith_machine_incline_press-1 (low) `handlingMistakes[1].fix` (the arch): No quote ties "Use lighter weights until you can press without it." to the arch; c9 is about learning the motion. Fix: give a fix from a fetched quote that corrects the arch, or cite one that ties a lighter load to it.

**smith_machine_shrug**
- smith_machine_shrug-1 (low) `setup[0]`, `setup[2]`, `setup[3]`, `handlingMistakes[1]`, `handlingMistakes[2]`, `feel.rows[1]`, `zooms[1]` (claim): These are comma strings. Fix: lists (R-LB6-9).

**low_to_high_cable_fly**
- low_to_high_cable_fly-1 (medium) `feel.rows[2].fix`: The stop rests on c7, which has none. Fix: R-LB6-6 (for example, LR-6 shape "Lower the weight. Keep your trunk vertical.", c7).
- low_to_high_cable_fly-2 (low) `plate.mistake.claim`: The step-2 harm quote that decides the plate fault (PureGym: "Having the correct form and range of motion is important in minimising strain to the shoulder joint. Select a weight that allows you to maintain a soft bend in the elbow and only go as far as hands in line with chest.") is in no claim. Fix: a new claim (puregym-cable-fly) holding it, cited with c11.
- low_to_high_cable_fly-3 (low) `plate.mistake.rankNote`: Schutz's "Injuries to the shoulder are very common in sports that involve overhead arm or throwing movements." is not set aside (cable_chest_press does set it aside). Fix: add it (about sports, no fault of this exercise).
- low_to_high_cable_fly-4 (low) `claims.c7.quotes[0].where`: The lean text is in ACE's exercise tip after Step 5, not in Step 4. Fix: where "Exercise tip (after Step 5)".
- low_to_high_cable_fly-5 (low) `claims.c3` / `notes`: The card does not record that PureGym's low-to-high steps say "Hinge very slightly forward at the hips." and StrengthLog suggests "a slight forward lean", while the top fault is leaning forward. Fix: state the conflict (the card follows ACE's vertical trunk).
- low_to_high_cable_fly-6 (low) `plate.tempo`: Up is 1 on the same ACSM 1-2 s basis that high_to_low reads as 2, and nothing says why. Fix: add tempo.text naming the choice, or set up 2.

**high_to_low_cable_fly**
- high_to_low_cable_fly-1 (medium) `feel.rows[1].fix`: The stop rests on c7, which has none. Fix: R-LB6-6 (for example, "Lower the weight and stand tall.", c7).
- high_to_low_cable_fly-2 (low) `feel.rows[2].fix`: "lower the weight" is not in c2. Fix: "Brace your abs." (c2).
- high_to_low_cable_fly-3 (low) `handlingMistakes[1].claim`: "c8, c4" is a comma string. Fix: ["c8","c4"] (R-LB6-9).

**machine_lateral_raise**
- machine_lateral_raise-1 (low) `handlingMistakes[0].fix`, `handlingMistakes[1].fix`, `feel.rows[1].fix`, `zooms[0].right`: The lighter-weight words are in c7, which is not cited. The zoom's "elbows at shoulder height" is c5, and "neck long" is in no quote. Fix: ["c8","c7"], ["c6","c7"], ["c6","c7"]. The zoom gets ["c6","c5"] and drops "neck long".
- machine_lateral_raise-2 (low) `feel.rows[2].claim`: "c8, c7" is a comma string. Fix: ["c8","c7"] (R-LB6-9).
- machine_lateral_raise-3 (low) `feel.rows[2].where`: "Body rocking in the seat" is not a place (LR-6). Fix: name a place, or drop the row; the swing is already handlingMistakes[0] and risks[0].
- machine_lateral_raise-4 (low) `claims.c13.text`: It still says ACSM "gives up 2 and down 2", but the plate is 2/3/1 (c16). Fix: c13 carries only the top-pause convention.
- machine_lateral_raise-5 (low) `claims.c5`: Virtuagym's "Continue lifting until your arms are parallel to the floor, or slightly higher." conflicts with the drawn fault, and the card does not say so. Fix: state the conflict in c5's text (the card follows Motra).
- machine_lateral_raise-6 (low) `sources.laf-lat-raise`, `gaps`, `posture[4]`: LA Fitness answers now (R-LB6-8). "slowly" in posture[4] is in no c9 quote. Fix: R-LB6-8. Add Motra's "Inhale and lower arms slowly with control." to c9.

**hip_abduction**
- hip_abduction-1 (medium, verifier; same pattern as R-LB6-6) `feel.rows[1]`: "Pain in the hip" / "Stop the set. Don't train through the pain." cites c6, whose only pain quote, "Consult professional if hip pain present.", is a referral with no stop. Fix: R-LB6-6.
- hip_abduction-2 (low) `handlingMistakes[0].fix`, `handlingMistakes[2].fix`: "Lower the weight" is c6's, but [0] cites "c5, c12". "Line your knees up with the pivot" is c1's, but [2] cites c6. Fix: [0] ["c5","c12","c6"]; [2] ["c6","c1"], or see hip_abduction-6.
- hip_abduction-3 (low) `claims.c10.text`, `plate.tempo.text`: For abduction, the return ends with the knees together, so Motra's middle 1 s is at the closed start, not "the open start" (copied from hip_adduction). Fix: "at the start, knees together". Values stand (2/2/1).
- hip_abduction-4 (low) `handlingMistakes[0].mistake`: The top fault is "Jerking the weight" (c12), but [0] reads "Momentum or upper-body rocking." Fix: "Jerking the weight." (["c12","c5"]), with the same fix.
- hip_abduction-5 (low) `handlingMistakes[0]`, `zooms[1]`, `feel.rows[2]` (claim): These are comma strings. Fix: lists (R-LB6-9).
- hip_abduction-6 (low, verifier) `handlingMistakes[2]`: "Seat not set to fit." is a setting (R-LB2-12). The drawn fault, the incomplete range, is not in handlingMistakes. Fix: "Incomplete range." / "Open the legs to a full, comfortable range." (["c12","c4"]). The seat cue stays in zooms[0] and setup.
- hip_abduction-7 (low) `feel.rows[2].where`: "Upper body rocking" is a movement, not a place (LR-6). Fix: name a place, or keep the swing in handlingMistakes only.

**hip_adduction**
- hip_adduction-1 (medium) `feel.rows[1].fix`, `risks[1]`: c5 says "Do not use if acute hip or groin injury present". It is not about pain during a set, and it gives no stop. Fix: risks[1] becomes "Acute hip or groin injury? Don't use this machine." (c5). The row follows R-LB6-6.
- hip_adduction-2 (low) `plate.mistake.rankNote`: The note says "no other named fault is tied to harm", but "Keep movements slow to prevent strain" also corrects "Letting weight stack crash". Momentum still wins on Motra's list order. Fix: name the crash as tied too, set aside on list order.

LB4 research verify (LR-29) on #285 @ 083a8e12: result, rulings and findings (2026-10-22)

**Ruled by the supervisor (session_01PeNM9HeWPrhrcscMwXzupy, 2026-10-22): R-LB4-1 to R-LB4-7 below are accepted as written.**

LB4 research verify (LR-29) on #285 @ 083a8e12: result, proposed rulings and findings (2026-10-22)

## Run
- A history-free copy of the 14 cards and their quotes, split into three blind groups. Each group had one fresh Opus critic and 2 supervisor plants, one of them a safety plant. The critics re-fetched every source with curl. PubMed answered with a cookie page, so they read abstracts through NCBI efetch.
- h1 (front_squat, goblet_squat, bodyweight_squat, wall_sit, step_up): **VALID**. Both plants were caught. h1-A (front_squat `handlingMistakes[2].fix`, the back-squat bail) was caught as a blocker. h1-B (step_up c2 quote altered to "To avoid knee injury") was caught as a blocker, above its high target. 25 sources fetched (31 card-source pairs). 119/120 quotes verbatim; the one miss is plant h1-B.
- h2 (pistol_squat, box_jump, jump_squat, bulgarian_split_squat, walking_lunge): **VALID**. Both plants were caught. h2-A (pistol_squat `feel.rows[2]`, the red-flag row recast as a normal feeling) was caught as a blocker. h2-B (jump_squat `plate.tempo.pause` 1) was caught as high. 22 sources fetched (27 pairs). 124/124 quotes verbatim.
- h3 (reverse_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat): **VALID**. Both plants were caught. h3-A (bodyweight_lunge `feel.rows[2]`, the stop line turned into "finish the set") was caught as a blocker. h3-B (forward_lunge `handlingMistakes[2].fix` "over about 3 seconds") was caught as a blocker, above its high target. 14 sources fetched (21 pairs). 77/77 quotes verbatim.
- On the head itself, the words of all 321 quotes are verbatim. step_up c2 reads "To maximize effectiveness", as the page does. 5 quotes differ from the page only in quote-mark characters (R-LB4-5): pistol_squat p7 (2 quotes), box_jump c7, and reverse_lunge c6 and c16. I checked every head quote that contains ' or " against the critics' raw curl pages, and these 5 are the only differences.
- Supervisor 10 % re-fetch: 6 of 6 quotes verbatim (seed 20261022). The sample was drawn only from the 53 quotes in the 2 quote files that #285 changes against base 38d5f9c6 (box_jump and reverse_lunge; see refetch/collect.py). It was not drawn from all 321. The critics' full re-fetch covers the rest.
- The critics raised 55 findings. I removed 9:
  - the 6 plant findings;
  - step_up `risks[0-1]`: its harm basis was the planted quote. On the head, both lines name a sourced fault with no harm word, as bulgarian_split_squat `risks[1]` and jump_squat `risks[2]` also do, and no rule requires a harm quote for a risk line;
  - bodyweight_squat's LR-36 wording: it exists only because of the scrub ("Tie ruled under LR-36"). The head says "Tie ruled by the supervisor (LR-36)";
  - reverse_lunge's LR-31 step-1 finding, under the supervisor position (R-LB4-2).
- **Real findings on the head: 0 blocker, 1 high, 6 medium, 39 low.** I checked each one against the head card and quotes files. Where a finding depends on a source page, I used the critics' curl captures from 2026-10-22 (`verify-lb4-work-lb4-h*/raw`). No new fetch was needed.
- Severity scale, as in LB3:
  - blocker: a safety line that is wrong or weakened;
  - high: a shown line or machine value that its own source contradicts;
  - medium: a shown line with content that no quote on the card supports, or `handlingMistakes[0]` that is not the top fault;
  - low: words that are on the card or the page but missing from the cited claim; unshown fields; quote-mark characters; wording.
- Where my severity differs from the critic's:
  - box_jump `setup[4]`: blocker to low. The page says it, and the line is safe.
  - jump_squat `feel.rows[1]`: blocker to medium. This matches LB3's dumbbell_romanian_deadlift-1, and row [2] keeps the stop line.
  - bulgarian_split_squat `zooms[0].wrong`: blocker to high. It is not a safety line.
  - Missing citation ids, claim texts and rankNote gaps: medium to low, as in LB3.
- Not covered, because these were outside the critics' inputs: muscle ids against src/data/muscles.ts, and the LR-34 inherit checks.

## LR-31 and LR-33
- LR-31: the critics agree with 13 of the 14 picks:
  - front_squat 2, goblet_squat 2, bodyweight_squat 3 + LR-36, wall_sit 2;
  - step_up 3, on the head's real c2 quote;
  - pistol_squat 3: drawable false, so `plate.mistake` is the heel lift;
  - box_jump 2, jump_squat 2, bulgarian_split_squat 3;
  - walking_lunge, forward_lunge, bodyweight_lunge and bodyweight_split_squat: 3 + LR-36.
- reverse_lunge: the h3 critic read "Another common error is doing reverse lunges too fast." as a step-1 hit. I applied the supervisor position: the sentence stays set aside, and the card keeps its step-2 pick (R-LB4-2).
- The critics agreed with two picks but raised another reading for each. Both need a ruling:
  - Catalyst's "Many athletes ..." sentence on the four lunge cards (R-LB4-3);
  - the list that breaks jump_squat's step-2 tie (R-LB4-4).
- Already settled, no ruling needed:
  - reverse_lunge's narrow stance stays set aside at step 1, under D-SUP-LB4-REVLUNGE (a) (6334477674), which the correction (6334510953) kept.
  - bodyweight_split_squat reads Catalyst's "keep the front shin approximately vertical" as a fault to avoid and records the other reading. The critic accepts this, and both readings draw the front shin.
- LR-33: all 14 cards keep up, down and pause null, and the critics agree on all 14. jump_squat's disagreement came only from plant h2-B.
  - wall_sit's 30-60 s hold stays in `tempo.text`, which matches the wall_sit row in lib-14-card and D-LIB14-NOSECS.
  - reverse_lunge's 3 s and its bottom pause are progressions, kept in `tempo.text` (R-W1-1).
  - jump_squat's bottom pause, pistol_squat's "Pause briefly" after standing, and the "Hold this position momentarily" on forward_lunge and bodyweight_lunge are all named in text, on cards with no tempo seconds.

## Proposed rulings (R-LB4-1 to R-LB4-7)
- **R-LB4-1.** The 6 plant findings are not on the real head. Neither are the 2 findings that rest on a plant or on the scrub (step_up risks; bodyweight_squat's LR-36 wording). No action.
- **R-LB4-2 (supervisor position, applied).** reverse_lunge: "Another common error is doing reverse lunges too fast." is a list sentence in a common-mistakes article. It stays set aside at LR-31 step 1 under LR-31's literal exclusion. Under D-SUP-PROTECT, the card keeps its step-2 pick: the flared ribcage, drawable true. No change.
  - Follow-up F-LB4-1: lib-14-card.md:127 on claude/sup-lib4-cards still says the flared ribcage is "drawable false". The correction (6334510953) and the head card both say true.
- **R-LB4-3 (LR-31, Catalyst's load sentence).** walking_lunge, reverse_lunge, forward_lunge and bodyweight_lunge all set aside "Many athletes try to load lunges too heavily and lose the position in which the exercise will be most effective."
  - Reading A (the cards): the frequency words describe a load choice, and LR-31 does not count "a statement about ... a load" (the load chosen is not a candidate). "The position" names no single fault.
  - Reading B (h2 critic, offered if A fails): the sentence is a step-1 hit for losing the controlled descent, the upright trunk and the balance. Step 2 would then pick the descent, which is first and has no harm quote. That fault shows only as speed, so drawable is false, `plate.mistake` stays the trunk, and `handlingMistakes[0]` becomes "Dropping fast into the bottom."
  - Recommend A. Reading the sentence onto the next sentence's three items reads one sentence onto list items, which LR-31 excludes and R-LB4-2 applies. Each of the four rankNotes quotes the full sentence and gives this reason (walking_lunge-1).
- **R-LB4-4 (LR-31, the list that breaks jump_squat's tie).** The step-2 tie goes to locked knees because they are on NASM's box-jump Common Mistakes list ("Landing with straight knees, which increases joint stress", MECH).
  - Reading A (the card): step 2's tie-break, "the one on a common-mistakes list", counts a list from any read source. Only step 3 orders lists by exercise.
  - Reading B (h2 critic, offered if A fails): a list written for another exercise does not count. The tie then falls to the source count, which is one direct ACE quote each (j5 and j6), and then to "the earlier on a list that names both". ACE's step order (forward travel in Step 4, locked knees in Step 5) could move the pick to the knees travelling forward.
  - Recommend A. It is the rule's own wording, and front_squat already uses the same reading for StrongLifts' back-squat list. front_squat's pick holds either way, because its chest fault also wins on source count, 2 to 1. Put the NASM quote on jump_squat as its own MECH claim (jump_squat-3).
- **R-LB4-5 (quote marks).** 5 quotes match the page word for word but use ' or " where the page has ’ or “ ”. They count as verbatim for LR-29. The fix copies the page's characters into both the card and quotes/<id>.json, so the two still match one for one.
- **R-LB4-6.** For every other high, medium and low: apply the fix as written below.
  - walking_lunge-3's loadProgression fix also applies to the same line on reverse_lunge (claims c14, c6) and forward_lunge (claims c7, c6), whose claims support it.
  - Where a fix adds a quote, fetch it verbatim with curl (at most 50 words) and add it to quotes/<id>.json.
  - Changes to text that box_jump and reverse_lunge show go on the "pilot A shown-copy changes" list (D-SUP-LB4-PACOPY step 4). #109 never changes.
- **R-LB4-7.** One round only. Before pushing, check:
  - valid JSON;
  - the dry run (claims' quotes match quotes/<id>.json one for one);
  - copy lint and C8 at 0 hits;
  - every new quote re-fetched.
  Then write docs/research/howto/verify/lb4.md from this file, with the run, the counts, the rulings and a table from each finding to its commit. Post 'LB4 RESEARCH FIXED @ <sha>'. The supervisor rechecks the changed lines.

## Plants (all caught; not on the head)
| Plant | Card, field | Caught as | Target |
|---|---|---|---|
| h1-A | front_squat `handlingMistakes[2].fix` | blocker | blocker |
| h1-B | step_up `claims.c2.quotes[0]` + quotes file | blocker | high (blocker acceptable) |
| h2-A | pistol_squat `feel.rows[2]` | blocker | blocker |
| h2-B | jump_squat `plate.tempo.pause` | high | high |
| h3-A | bodyweight_lunge `feel.rows[2]` | blocker | blocker |
| h3-B | forward_lunge `handlingMistakes[2].fix` | blocker | high (medium acceptable) |

## Findings (id, severity, card, field: problem. Fix)

### High (1)
- bulgarian_split_squat-1 (high) `zooms[0].wrong`: "Front foot too close to the bench (short stance)." draws a position the source endorses as wrong. Catalyst (c6): "closer will challenge the quad more". The card's own `posture[3]` says the same, and its wrongNote admits that no source describes this fault. Fix: set `wrong` to null and delete `wrongNote` (LR-25). `right` and claim c2 stay.

### Medium (6)
- wall_sit-1 (medium) `handlingMistakes[2]`: "Knee discomfort at 90 degrees." No quote says discomfort. w9 is about kneecap force and stress in dynamic wall squats, and the card's own rankNote says this is "not a fault position". Fix: `{"mistake":"Back leaving the wall.","fix":"Keep your back and buttocks on the wall.","claim":"w5"}`.
- jump_squat-1 (medium) `feel.rows[1]`: "Knees ache after landings" leads to "Landing stiff, or knees going far forward." No quote names an ache or links one to these faults. This is the invented cause clause that LR-6 rules out, and "stiff" comes from j11, which the row does not cite. Fix: `{"where":"Knees","means":"Fault: locked knees or knees shooting far forward on landing.","fix":"Land softly, hips back. Make the jumps smaller.","claim":["j5","j6","j4","j7"],"redFlag":null}`.
- jump_squat-2 (medium) `handlingMistakes[0]`: "Loud, stiff landings." is not the top fault, which is landing with locked knees (j5, as in `plate.mistake.what`). DeVita's "stiff" landing (77° of knee bend) is not a locked knee. Fix: `{"mistake":"Landing with locked knees.","fix":"Land quietly, hips back, knees bending.","claim":["j5","j4"]}`. In the rankNote, replace the "handlingMistakes[0] is the card's 'Loud, stiff landings.' line ..." sentence with "handlingMistakes[0] is the top fault, landing with locked knees (j5)."
- jump_squat-3 (medium) `plate.mistake.rankNote`: the step-2 tie-break rests on NASM's box-jump list line "Landing with straight knees, which increases joint stress", cited as "j15's page". No claim on the card carries it; j15 quotes only the fatigue line. Fix (with R-LB4-4): add claim `j18`, tags ["CONSENSUS","MECH"], source nasm-boxjump, quote "Landing with straight knees, which increases joint stress and reduces proper force absorption" (the same verbatim text as box_jump c5), text "NASM's box-jump Common Mistakes list ties landing with straight knees to joint stress; written for the box jump, applied to jump-squat landings by inference." Add it to quotes/jump_squat.json, and cite j18 in the rankNote instead of "j15's page".
- bodyweight_lunge-1 (medium) `claims.c5.text`, `posture[2]`, `plate.checkpoints[2].what`, `zooms[1].right`, `plate.end`: these lines say the hip bend is "slight". c5's quote says only "bend forward at your hips, maintaining a flat back"; on the page, "slight" describes the shin lean (c4). Fix:
  - c5.text: "While lunging, bend forward at the hips with a flat back."
  - posture[2]: "Flat back, bent forward at the hips."
  - checkpoints[2].what: "Bend forward at the hips with a flat back."
  - zooms[1].right: "Hips bent forward, back flat."
  - plate.end: replace "hips bent slightly with a flat back (c5)" with "hips bent forward with a flat back (c5)".
- bodyweight_split_squat-1 (medium) `loadProgression`: "Do sets of 5-10 smooth reps ..." gives the bodyweight card the rep range for the loaded version. c6 says "with weight", and the card's own `unsourced` says no bodyweight rep range exists. Fix: text "Move smoothly with no crash into the bottom. With dumbbells or other implements, do sets of 5-10." with claims ["c6","c8"].

### Low (39)
**front_squat**
- front_squat-1 (low) `plate.mistake.rankNote`, `unsourced[3]`: the rankNote leaves out set-asides that it must include, and gives a wrong reason. None of this changes the pick. Fix:
  - Add StrongLifts' "Squatting with your knees caved in is bad for your knees ... will cause pain inside your knees" (Knees Cave In, back squat, MECH). It is on the same list, but only one source ties it to harm, so the chest wins on source count, 2 to 1.
  - Replace "it is not a fault named on this card" for lower-back rounding with the same source-count reason (1, MECH).
  - Set aside, each with its reason: "Many strong Squatters look up during Squats and seem to be fine" (back squat); "Most people set them too high" (a rack setup choice); "Most people don’t know how to spot" (a spotter choice); "it usually means your Squat form is wrong", "The Buttwink is usually just lower back rounding" and "Most people don’t have the hip flexibility ..." (back squat).
  - unsourced[3]: "Knees caving (front view): StrongLifts names it for the back squat only; no front-squat source names it."
- front_squat-2 (low) `zooms[1]`: "elbows dropped" is in c7, but the zoom cites only c6. Fix: claim ["c6","c7"].
- front_squat-3 (low) `setup[0]`: "before loading" is in no quote in c14. Fix: "Set the safety bars just below your lowest squat depth." (c14).

**goblet_squat**
- goblet_squat-1 (low) `plate.mistake.rankNote`: NASM's "The goblet position encourages upright posture, reduces lower back stress, and facilitates deeper squat depth." and "... reduces lower back stress compared to back-loaded variations." are neither quoted nor set aside. Fix: quote both, and set them aside as benefits of the goblet position over back-loaded squats that name no fault. Even if they are read as the cue that corrects the lean, the lean keeps the pick, because it comes earlier on NASM's list.
- goblet_squat-2 (low) `plate.mistake.what`: the line leads with the drooping chest (NASM item 5, no harm) and names the top fault last. Fix: "Torso leans far forward, the chest droops and the weight drifts away from the body." (g6).
- goblet_squat-3 (low) `claims.g12.text`: "with the health risk unconfirmed" is not in g12's quotes. Fix: add hackett-2013's "The health risks associated with the VM during resistance exercise remain unconfirmed." to g12, as front_squat c19 has it.
- goblet_squat-4 (low) `loadProgression`: this tier-A field gives a starting load and a set scheme (g9) but no way to progress. Fix: keep the line, and add a gaps entry: "Goblet-squat load progression (no read source gives one)."

**bodyweight_squat**
- bodyweight_squat-1 (low) `setup[1]`, `zooms[1]`: "Shoulders down and back" is from b1, and "heels down" / "Heels lifted" are from b4 and b7. Fix: setup[1] claim ["b1","b2"]; zooms[1] claim ["b6","b4","b7"].
- bodyweight_squat-2 (low) `feel.rows[0].where`: "Front of thighs" is narrower than b9 ("Legs - Thighs", WEAK). Fix: "Thighs and buttocks".

**wall_sit**
- wall_sit-2 (low) `feel.rows[0].where`: "burning" is in no quote. Fix: "Front of the thighs".
- wall_sit-3 (low) `setup[1]`, `plate.checkpoints[2]`: "Slide down" is from w3, and "shallower is easier" is from w7. Fix: setup[1] claim ["w2","w3"]; checkpoints[2] claim ["w2","w7"].

**step_up**
- step_up-1 (low) `setup[3]`: "controlling the way down" is from c2, but the line cites only c8. Fix: claim ["c8","c2"].

**pistol_squat**
- pistol_squat-1 (low) `zooms[1].wrong`: "Dropping onto the box, not squatting down to it." is the inverse of p7, and the wrongNote says no source describes it. Fix: set `wrong` to null and delete `wrongNote` (LR-25).
- pistol_squat-2 (low) `setup[2]`: the shift and the lift are from p1. Fix: claim ["p1","p5"].
- pistol_squat-3 (low) `claims.p10`: the third quote stops at "On the working leg, your adductors", so the claim's "steady the knee" has no support. Fix: in the card and the quotes file, replace that quote with "On the working leg, your adductors — muscles located on the inside of your thigh — work to stabilize the knee and keep your leg steady." (verbatim on rep-pistol, 25 words).
- pistol_squat-4 (low) `feel.rows[1].fix`: "box or support" is from p7. Fix: claim ["p9","p7"].
- pistol_squat-5 (low) `zooms[0]`: the right position is from p3, and "weight on the toes" is in no quote. Fix: claim ["p3","p8"]; wrong "Heel lifted."
- pistol_squat-6 (low) `claims.p7` quotes 2 and 5: these use "you're" where the page has "you’re". Fix: copy "you’re" (R-LB4-5).

**box_jump** (changes to shown text go on the pilot A shown-copy list)
- box_jump-1 (low) `setup[4]`: "reset, rest between reps" is in no quote on the card. NASM's Step 4 says it (verified on the fetched page). Fix: add claim c17 (CONSENSUS, nasm-boxjump), quote "Reset your position and prepare for the next repetition. Allow adequate recovery between repetitions.", and cite ["c6","c17"]. The shown text does not change.
- box_jump-2 (low) `setup[0]`, `setup[3]`: "Sturdy" is from c1, "well below your maximum" from c7, and "knees bent" from c5. Fix: setup[0] claim ["c1","c7","c8"]; setup[3] claim ["c3","c4","c5"].
- box_jump-3 (low) `plate.mistake.rankNote`: it says fatigue has "no harm word", but c11 says fatigue "increases injury risk". Fix: quote c11's "Never perform to failure with plyometrics, as fatigue significantly compromises landing mechanics and increases injury risk." and set it aside as a training state, not a position or movement. Drop "with no harm word".
- box_jump-4 (low) `feel.rows[1].where`, `feel.rows[2].where`: the words "Sharp" and "Bad-landing" are in no quote. Fix: "Very painful, locking or giving-way knee" and "Severe ankle pain, or can't walk".
- box_jump-5 (low) `claims.c7` quote 1: it uses "it's" where the page has "it’s". Fix: copy "it’s" (R-LB4-5).

**jump_squat**
- jump_squat-4 (low) `handlingMistakes[1].fix`: "Push the hips back as you land." is from j4. Fix: claim ["j6","j4"].
- jump_squat-5 (low) `zooms[0].right`: the mid-foot landing and the hips are from j4. Fix: claim ["j4","j5"].

**bulgarian_split_squat**
- bulgarian_split_squat-2 (low) `loadProgression`: "Start with" and "heavier" are not in c8. Fix: "Sets of 8-15 smooth reps. Sets of 3-6 only with full control of the position." (c8).

**walking_lunge**
- walking_lunge-1 (low) `plate.mistake.rankNote`: the step-1 set-aside quotes Catalyst only up to "too heavily", and the step-3 tie list leaves out ACE's stance-foot line. Fix: quote the full sentence with R-LB4-3's reason, and add ACE's "try not to move the left (stance / supporting) foot" (ace-walk-twist, one source) to the one-source tie. The tie is unchanged. Apply the same full-sentence wording on reverse_lunge, forward_lunge and bodyweight_lunge.
- walking_lunge-2 (low) `claims.c1.text`, `setup[4]`: "and pass" is not in c1's quote, and alternating legs comes from c4. Fix: drop "and pass" from c1.text; setup[4] claim ["c1","c4"].
- walking_lunge-3 (low) `loadProgression`: "Start light or unloaded." turns Catalyst's work-capacity or rehab sets into a starting point. Fix: "Add weight only while the step stays full and the descent smooth." with the claims unchanged. Make the same change on reverse_lunge and forward_lunge (R-LB4-6).
- walking_lunge-4 (low) `setup[0]`, `zooms[1].right`: "dumbbells at your sides" is from c12, and "front shin about vertical" is from c2. Fix: setup[0] claim ["c6","c12"]; zooms[1] claim ["c2","c3"].

**reverse_lunge** (changes to shown text go on the pilot A shown-copy list)
- reverse_lunge-1 (low) `setup[1]`, `handlingMistakes[2].fix`, `feel.rows[1].fix`: "Step one foot back" is from c1, "Lower slowly" from c16 or c4, and "Go lighter" from c6. Fix: setup[1] claim ["c1","c7"]; handlingMistakes[2] claim ["c7","c16"]; feel.rows[1] claim ["c8","c6"].
- reverse_lunge-2 (low) `claims.c6`, `claims.c16`: c6 uses "can't" where the page has "can’t", and c16 is wrapped in straight quote marks where the page has “ ”. Fix: copy the page's characters (R-LB4-5).

**forward_lunge**
- forward_lunge-1 (low) `handlingMistakes[0].fix`, `setup[2]`: "Land heel first" is from c4, and "Drop the hips" is from c3. Fix: handlingMistakes[0] claim ["c3","c4"]; setup[2] claim ["c1","c3"].
- forward_lunge-2 (low) `claims.c8.text`, `claims.c12.text`: "20 women without knee pain", "30 % body-weight load" and the list of lunges are in the abstracts but not in the quotes. Fix:
  - add to c8 goulette-2021's "20 asymptomatic females.";
  - add to c12 bezerra-2021's "Twelve women (24 ± 3 years) were selected and performed the lunge exercise with an overload of 30% of body weight";
  - add to c12 "in two trunk positions (straight, and inclined) during three lunge exercises (static, step-forwarding, and walking) in trained young women".
- forward_lunge-3 (low) `decisionNote`: ACE gives no amount for the hip bend, and the note leaves grip out of the inherited fields. Fix: "ACE (no equipment) asks for a forward bend at the hips with a flat back" and "Only plate view, the knee red-flag box and grip are inherited".

**bodyweight_lunge**
- bodyweight_lunge-2 (low) `handlingMistakes[0].fix`: "Land heel first" is from c2. Fix: claim ["c3","c2"].
- bodyweight_lunge-3 (low) `feel.rows[1].fix`: "more thigh work" is unclear on a row about the backs of the thighs, because c9 says shorter steps work the quads. Fix: "Shorten the step for more front-thigh work."
- bodyweight_lunge-4 (low) `handlingMistakes[2]`, `risks[0]`: the balance wording comes from c2 (stabilise on the stance leg, no swaying), not from c7. Fix: claim ["c7","c2"] on both.

**bodyweight_split_squat**
- bodyweight_split_squat-2 (low) `setup[0]`, `claims.c1`, `handlingMistakes[1].fix`: c1's quote names no stance, and "until the back knee just touches" is from c1. Fix: add cat-splitsquat's "position your feet in your jerk split stance" to c1 (verified on the fetched page); handlingMistakes[1] claim ["c6","c1"].

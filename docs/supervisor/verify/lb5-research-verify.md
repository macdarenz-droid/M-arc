LB5 research verify (LR-29) on #286 @ fc536a97: result, rulings and findings (2026-10-22)

**Ruled by the supervisor (session_01PeNM9HeWPrhrcscMwXzupy, 2026-10-22): R-LB5-1 to R-LB5-7 are accepted as written.**

LB5 research verify (LR-29) on #286 @ fc536a97: result, rulings and findings (2026-10-22)

## Run
- History-free copy of the 16 cards and their quotes in three blind groups (h1 6 cards, h2 5, h3 5). Each group had one fresh Opus critic and 2 supervisor plants (one tier-A safety line each). The critics re-fetched every source with curl (PubMed and PMC through NCBI efetch). Scorer check: the copy differs from the head only in the 7 planted files (`cmp`, every other card and quotes file byte-exact).
- h1 (overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension, cross_body_hammer_curl, cable_curl, bayesian_cable_curl, preacher_curl): **VALID**.
  - h1-A (tier A, dumbbell_overhead_triceps_extension feel.rows[3].fix "Lower more slowly and finish the set."): caught as a **blocker**, with the right fix.
  - h1-B (cross_body_hammer_curl c2/c11 quote "for one second", and the c11 text): caught by re-fetch as a **blocker** (the quote), plus a medium on the c11 text. Target was high; blocker is acceptable.
  - 37 of 38 card sources fetched. 152 of 159 quotes verbatim: 2 are the planted quote copies, and 5 could not be checked (sl-cablecurl, HTTP 429).
- h2 (incline_dumbbell_curl, concentration_curl, wrist_curl, straight_bar_triceps_pushdown, single_arm_triceps_pushdown): **VALID**.
  - h2-A (tier A, straight_bar_triceps_pushdown back row: stop clause cut, redFlag null, "back" gone from redFlags): caught as a **blocker**, with the right fix.
  - h2-B (incline_dumbbell_curl bench "30-45" in 5 places): caught as a **blocker**, with the right fix. Target was high.
  - 27 of 27 sources fetched. 122 of 122 quotes verbatim.
- h3 (alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, reverse_curl): **VALID**.
  - h3-A (tier A, ez_bar_curl risks[0] "... but not injury."): caught as a **blocker**, with the right fix.
  - h3-B (hammer_curl caufriez-2018 url and pmid 29409472): caught, with the right field, problem and exact fix, but rated **medium** (target high). The validity rule needs only the tier-A plant as a blocker, so the group counts. Calibration note: this critic rated a wrong-paper source one step low.
  - 25 of 25 sources fetched. 121 of 121 quotes verbatim (hammer_curl's 2 c11 quotes are verbatim in PMID 29409427, the paper the head cites).
- Quotes on the head: 402 on 16 cards. With the scorer's retry below, **402/402 are verbatim**.
- Supervisor 10 % re-fetch: 41 of 402 quotes. 40 verbatim, 1 unreachable (cable_curl, sl-cablecurl, HTTP 429 on every retry).
  - Scorer retry, 2026-10-22 07:14 UTC, one attempt: Safari 17.6 user agent, `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`, `Accept-Language: en-GB,en;q=0.9`, `Referer: https://www.google.com/`. `/cable-curl/` answered **301 → https://www.strengthlog.com/cable-curl-with-bar/**, then **200** (378,906 bytes, title "How to Do Cable Curl With Bar").
  - All 5 sl-cablecurl quotes are verbatim there. c1, c3[0], c4[0] and c5[0] match the raw HTML. c6[0], the muscle list, matches with the tags stripped.
  - The page's main text holds no frequency word and no harm word, so the cable_curl rankNote line "StrengthLog's cable-curl page holds no frequency or harm word" stands.
  - **The re-fetch closes at 41/41.**
- LR-31: the critics agree with all 16 picks. LR-33: they agree on all 16 tempos. Two reading notes follow.
- Real findings, plants removed, all confirmed on the head: **0 blocker, 0 high, 13 medium, 41 low**.
  - 2 of the mediums were added by the scorer. They are head rows that a plant hid from the critic: dumbbell_overhead_triceps_extension feel.rows[3] and straight_bar_triceps_pushdown feel.rows[2].
  - Severity follows LB3: rankNote set-aside gaps, missing claim ids, claim text that is not shown, and the tier-A `gaps` field are low. The critics had rated 16 of these medium.

## LR-31 and LR-33
| id | LR-31 step | drawable | tempo up/down/pause | agree |
|---|---|---|---|---|
| overhead_cable_triceps_extension | 2 (arch) | true | 1/2/1 | yes |
| dumbbell_overhead_triceps_extension | 2 (arch) | true | 1/2/1 | yes |
| cross_body_hammer_curl | 1 (range fault, not drawable front-on); plate = wrist twist, step 3 | true (drawn fault) | 1/2/1 | yes |
| cable_curl | 1 | true | 1/2/0 | yes |
| bayesian_cable_curl | 3 | true | 1/2/0 | yes |
| preacher_curl | 2 (pad, tie with wrists) | true | 1/2/0 | yes, reading note 1 |
| incline_dumbbell_curl | 2 (wrists); plate step 3 | false | 1/2/0 | yes |
| concentration_curl | 1 | true | 1/2/1 | yes |
| wrist_curl | 2 (grip release); plate c3, step 3 | false | 2/2/0 | yes |
| straight_bar_triceps_pushdown | 2 (lean/arch) | true | 1/2/1 | yes |
| single_arm_triceps_pushdown | 2 (lean/arch, MECH) | true | 1/2/1 | yes |
| alternating_dumbbell_curl | 2 (wrists); plate step 3 | false | 1/2/0 | yes |
| barbell_curl | 2 (wrists); plate step 3 | false | 1/2/0 | yes |
| ez_bar_curl | 2 (wrists); plate step 3 | false | 1/2/1 | yes |
| hammer_curl | 3 | true | 1/2/0 | yes |
| reverse_curl | 2 (swinging, tie with wrists) | true | 1/2/0 | yes |

The wrist picks with drawable false (incline, alternating, barbell, ez_bar) rest on R-LB2-27, which the h2 and h3 critics could not read. The scorer read it (#263 6257136607): the side view cannot show the bent wrist, because the grip moves only 5-6 px. The same curl grip is drawn on these four cards, so they agree.

**Reading note 1, preacher_curl tie-break.** Both readings pick the pad fault.
- Reading A (head): StrengthLog's list names both faults. Its first item carries the pad cue ("Keep your body still and your upper arms pressed against the pad."), and its second item is the wrists. Step 2's "earlier on a list that names both" picks the pad fault.
- Reading B (h1 critic): StrengthLog's first item is "Using too heavy weights.", a load choice and not a candidate (LR-31). It states the cue, not the fault, so no list names both faults. Step 2's last tie-break then goes to step 3's count, which D-SUP-LB6-CCP (#287 6334509921) says is literal. The count is 2-2: BarBend and StrengthLog each tell the lifter to avoid each fault (c4, c8). The next step is the first tied fault on the earliest list written for this exercise, in source order. That is bb-preacher, whose list names only the pad fault, inside "Treating it Like a Strength Exercise" (curl 2026-10-22).
- Recommendation: keep the pick and add Reading B to the rankNote as one sentence (finding preacher_curl-3). No ruling is needed.

**Reading note 2, Motra "3-1-1" on both overhead extensions** (R-LB2-1, listed as open on #286).
- Reading A (head): Motra does not define the digit order. R-PB-3 made the same Motra pattern ("2-1-1" on smith) a WEAK tempo claim without changing the values ("the page does not define the digit order"). down stays 2 (ACSM, WEAK, LR-15).
- Reading B: read as lowering-pause-lifting, "3-1-1" gives down 3 and a 1 s pause at the bottom. LR-33 says "Sourced seconds are never replaced by the convention".
- Recommendation: Reading A. Seconds whose phase the page does not name are not sourced seconds for the lowering. R-LB2-1 moved skull_crusher to 3 s only because its source said "three seconds down" in words. Ruled as R-LB5-6.

## Rulings (R-LB5-1 to R-LB5-7)
- **R-LB5-1.** The 6 plant findings are not on the real head. No action.
- **R-LB5-2, stop line on wrist, elbow and back rows.** This extends R-LB3-4 (shoulder rows) and W2-R12. It covers 11 rows on 10 cards:
  - overhead_cable_triceps_extension rows[3] (c18)
  - dumbbell_overhead_triceps_extension rows[3] (c16)
  - cable_curl rows[2] (c9)
  - preacher_curl rows[3] (c8)
  - incline_dumbbell_curl rows[2] (c11)
  - straight_bar_triceps_pushdown rows[2] (c11, c4) and rows[3] (c17)
  - single_arm_triceps_pushdown rows[2] (c12)
  - alternating_dumbbell_curl rows[1] (c7)
  - barbell_curl rows[2] (c8)
  - ez_bar_curl rows[2] (c8)

  Each row now ends its fix with LR-27's "Stop ... Don't train through the pain." on a technique or harm quote alone, which LR-6 rules out. R-LB2-25, which the overhead fixNotes cite, removed a referral; it does not source a stop clause.
  - **The rule.** The stop words stay only if the row cites a claim that holds a fetched, verbatim quote (at most 50 words) that supports stopping for that joint. The source is data only (LR-27 R4). Where the quote gives a "how bad" point, means follows LR-28 ("Is it getting worse?", as LB1 and LB3 did).
  - **Candidates the scorer found by curl on 2026-10-22.** The writer re-fetches each one and checks it.
    - Wrist rows: NHS Wrist pain, https://www.nhs.uk/symptoms/hand-pain/wrist-pain/: "stop or cut down activities that are causing the pain" and "do not lift heavy objects or grip anything too tightly" (MECH, applied to training). alternating_dumbbell_curl may instead cite its own nielasher-alt: "If you experience any discomfort, stop immediately and consult a healthcare provider."
    - Back row (straight_bar rows[2]): NHS Back pain, "But stop if your pain gets worse and see a GP for advice." This is LB1's c19 pattern (MECH).
    - Elbow rows on the overhead extensions: dumbbell_overhead_triceps_extension's own motra-db-oh lists "Elbow joint pain" under "When to Avoid" (WEAK). overhead_cable_triceps_extension uses the same item as MECH, because its own Motra page lists "Elbow joint instability", not pain.
    - Elbow rows on the pushdowns: NHS Tennis elbow, https://www.nhs.uk/conditions/tennis-elbow/: "avoid or reduce activities that make your symptoms worse" (MECH). NHS "Elbow and arm pain" has no stop line.
  - **If no quote fits.** Write the row in LR-6 shape: place, the source's fault, a sourced fix. Drop the stop clause and keep redFlag; the box carries stopping. Keep "where" to the quote's word ("discomfort") unless a cited quote says pain. Exception: on the two tier-A overhead cards the stop line is never dropped. If no quote fits there, the row stops for a ruling.
  - **The parents.** The same rows on the LB2 parents carry the same unsourced stop line: dumbbell_biceps_curl wrist row (c6), skull_crusher elbow row (c15), and triceps_pushdown back row (c11, c4) and elbow row (c17). Apply the same change to those rows and their claims in this fix round, as R-LB3-11 did for the breath line, so parent and child rows match. F-LB3-2 (LB2's shoulder rows) is unchanged.
- **R-LB5-3, wrist_curl conflict.** LR-18 stands.
  - ACE is the only read source that ties the roll to harm: "it also increases the risk of wrist injury and dropping the dumbbells" (c5). The closed grip therefore stays the shown line, and the pick is unchanged.
  - c5's conflict statement and the rankNote gain two verbatim quotes:
    - BarBend: "So, when you’re performing wrist curling motions in particular, allow the handle of the weight to glide down into your fingertips and then curl it back into the base of your palm as you contract."
    - StrengthLog barbell: "Lower your hands towards the floor, and let the barbell roll out in your fingers."
  - Then they say that 3 of the 4 technique sources let the weight roll.
- **R-LB5-4, single_arm_triceps_pushdown back box.** The inherit reason "no one-arm source ties this version to lower-back strain" has been false since this PR added c17 (MECH). LR-31 step 2 already picks the lean or arch on c17's harm, and LR-34 lets no redFlag or risk line leave a card without a ruling. So:
  - add a back row on c17, written like straight_bar's rows[2] after R-LB5-2, with redFlag "back";
  - set redFlags to ["elbow","back"];
  - add risks[2] "Leaning or arching can strain the lower back." (c17);
  - rewrite the inherit reason.

  LR-28's ship order then applies: the sheet cannot ship before the back box.
- **R-LB5-5, shape.** These are accepted as never-shown research data (LR-28), and the supervisor records them in CARD-V2:
  - line-attached `*Note` keys (anchorNote on 26 head cards, wrongNote on 9, fixNote on 4, riskNote on 2, and conflictNote, familyNote and gripNote on 1 each);
  - `archetype.handle` (3 cards, including the verified rope_triceps_pushdown);
  - source kind `secondary` (9 cards and 4 shared cards, including the verified barbell_back_squat, lat_pulldown and seated_cable_row).

  No card changes for these. The one exception: bayesian_cable_curl's `plate.note`, the only plate.note on the head, moves to top-level `notes`. Not checked: whether the stamp step drops unknown keys, because the scorer did not read it.
- **R-LB5-6, Motra "3-1-1".** down stays 2 on both overhead extensions, under R-PB-3 (Reading A above). The R-LB2-1 open item on #286 closes with no change.
- **R-LB5-7.** Every other medium and low: apply the fix below as written.
  - Where a fix adds a quote, fetch it verbatim (at most 50 words) and add it to quotes/<id>.json.
  - The overhead extensions' `gaps` take verify/g4.md items 1 and 2 now (LR-3, LR-13, LR-20), not at LIB-TEMPO.
  - reverse_curl-2 stays with LIB-MUSCLE (LR-35).
  - One round only. Before pushing, run: valid JSON; the dry run; copy lint and C8 at 0 hits; every new quote re-fetched.
  - Write docs/research/howto/verify/lb5.md from this file: the run, the counts, the rulings, and a finding → commit table.
  - Then post "LB5 RESEARCH FIXED @ <sha>". The supervisor rechecks the changed lines.

## Findings (id-n, severity, field: problem. Fix)

**overhead_cable_triceps_extension** (tier A)
- overhead_cable_triceps_extension-1 (medium) `feel.rows[3].fix`: "Stop the set. Don't train through the pain." has no quote. c18 (Gaviria) names the causes of a rupture only. Fix: R-LB5-2.
- overhead_cable_triceps_extension-2 (low) `plate.mistake.rankNote`: Gaviria's "TTRs are most commonly seen in middle-aged men, football players, and weightlifters." (efetch 32539261, verbatim) is a frequency hit about the injury, and the rankNote does not set it aside. Fix: add it as set aside, because it says who gets ruptures, not that a fault of this exercise happens often.
- overhead_cable_triceps_extension-3 (low) `gaps`: this tier-A card has no `gaps`. Fix: `gaps: [{"item": "Way out: returning the rope or stepping out of tension after the set or a failed rep", "why": "No read source describes it (verify/g4.md item 1; LR-13, LIB-WAYOUT)."}]`.
- overhead_cable_triceps_extension-4 (low) `risks[0].risk`: "Arching the lower back strains the spine." drops c9's "can". Fix: "Arching the lower back can strain the spine."

**dumbbell_overhead_triceps_extension** (tier A)
- dumbbell_overhead_triceps_extension-1 (medium, scorer-added: plant h1-A replaced this line in the copy) `feel.rows[3].fix`: the same unsourced stop line, on c16. Fix: R-LB5-2. motra-db-oh's "Elbow joint pain" under "When to Avoid" is on this card already.
- dumbbell_overhead_triceps_extension-2 (low) `plate.mistake.rankNote`: the same Gaviria hit is not set aside. Fix: as overhead_cable_triceps_extension-2.
- dumbbell_overhead_triceps_extension-3 (low) `feel.rows[1].claim; handlingMistakes[2].claim`: "Brace" comes from c3, and "Swinging the weight" comes from c12 ("Using momentum to swing weight"). Fix: feel.rows[1] ["c9","c3"]; handlingMistakes[2] ["c10","c12"].
- dumbbell_overhead_triceps_extension-4 (low) `gaps`: none on this tier-A card. Fix: `gaps: [{"item": "Way out: getting the dumbbell overhead and back down", "why": "No read source describes the kick-up, pressing it up from the thigh or seat, or setting it down (verify/g4.md item 2; LR-13)."}]`.
- dumbbell_overhead_triceps_extension-5 (low) `claims.c8.text`: "often the hardest part" against the quote's "sometimes the most difficult part". It is not shown. Fix: "Getting the weight into position is sometimes the hardest part".

**cross_body_hammer_curl**
- cross_body_hammer_curl-1 (low) `plate.mistake.rankNote`: Kerr's "The upper trunk (25.3%) and lower trunk (19.7%) were the most commonly injured body parts." and "The most common diagnosis was sprain/strain (46.1%)." (efetch 20139328) are not set aside. Fix: add both as set aside, because they cover all weight training (as dumbbell_overhead_triceps_extension's rankNote already does).
- cross_body_hammer_curl-2 (low) `handlingMistakes[2]; posture[2]; posture[5]; plate.tells[1]`: some words come from claims the lines do not cite, or from no quote:
  - "down and back" is c6;
  - "wrist straight" is c5;
  - "then switch arms" has no quote;
  - "down" in tells[1] is c6.

  Fix: handlingMistakes[2] ["c5","c6"]; posture[2] ["c7","c5"]; add Fitbod's "Repeat this action with your other arm." (verbatim, curl 2026-10-22) to c2 and the quotes file; tells[1] ["c5","c6"].

**cable_curl**
- cable_curl-1 (low) `sources[sl-cablecurl].url`: https://www.strengthlog.com/cable-curl/ now redirects (301) to https://www.strengthlog.com/cable-curl-with-bar/. All 5 quotes are verbatim there, and the rankNote line stands (see Run). Fix: url → https://www.strengthlog.com/cable-curl-with-bar/, checked 2026-10-22.
- cable_curl-2 (medium) `feel.rows[2]`: the stop line rests on c9 alone. Fix: R-LB5-2.
- cable_curl-3 (low) `setup[2].claim`: "Step back from the stack" comes from c1. Fix: ["c1","c2"].
- cable_curl-4 (low) `feel.rows[1].means`: "Fault: the elbows moving forward" (c7, MECH from the dumbbell curl) clashes with posture[1], "Upper arms stay still or move slightly forward" (c3, this exercise). Fix: "Fault: the elbows drifting well forward, which loads the front delts."

**bayesian_cable_curl**
- bayesian_cable_curl-1 (low) `feel.rows[2].fix; handlingMistakes[0].claim`: "or choose another curl" is not in c9's quotes, and "Only the elbow bends." comes from c4. Fix: add BarBend's "In such cases, go for one of these alternatives instead" (verbatim, curl 2026-10-22) to c9 and the quotes file; handlingMistakes[0] ["c5","c4"].
- bayesian_cable_curl-2 (low) `plate.note`: this field is not in CARD-V2. Fix: move the text to top-level `notes` (R-LB5-5).

**preacher_curl**
- preacher_curl-1 (medium) `feel.rows[3]`: the stop line rests on c8 alone. Fix: R-LB5-2.
- preacher_curl-2 (low) `handlingMistakes[0].claim; handlingMistakes[1].claim`: "pressed into the pad" is c4, and "pad top under your armpits" is c2. Fix: ["c5","c4"]; ["c3","c2"].
- preacher_curl-3 (low) `plate.mistake.rankNote`: three Jukes hits are not set aside: "This has been commonly paraphrased as an 'eccentric contracture to a flexed elbow'.", "Both definitions have been frequently used in the literature with little objective analysis or citation." and "...the muscle contraction was typically isometric." (efetch 36243942). Fix: add them as set aside, because they are about literature wording or a rupture seen across many activities, and name no fault of this exercise. Add Reading B (LR-31 note 1) as one sentence.

**incline_dumbbell_curl**
- incline_dumbbell_curl-1 (medium) `feel.rows[2]`: the stop line rests on c11 alone, and "pain" is not in c11, which says "discomfort". Fix: R-LB5-2.
- incline_dumbbell_curl-2 (low) `handlingMistakes[1].claim`: "Stop the curl a little lower." comes from c3. Fix: ["c4","c3"].
- incline_dumbbell_curl-3 (low) `plate.mistake.rankNote`: Kerr's two other hits are not set aside. Fix: as cross_body_hammer_curl-1.
- incline_dumbbell_curl-4 (low) `claims.c6.text`: "which crosses the shoulder" is not quoted. Fix: add BarBend's "the biceps is actually a biarticular muscle — it crosses both the elbow and shoulder joints." (curl 2026-10-22; copy the page's dash) to c6, or drop the clause.
- incline_dumbbell_curl-5 (low) `sources[ace-bicepsstudy].kind`: "secondary" is not in CARD-V2. Fix: none; R-LB5-5.

**concentration_curl**
- concentration_curl-1 (low) `feel.rows[0].means`: "isolated" is not in c10. Fix: "The biceps are doing the work."
- concentration_curl-2 (low) `claims.c8.quotes[0].where; claims.c12.quotes[1].where`: these say "How to, step 4", but the page puts the quote under "Step 3 - Lower With Control". Fix: "How to, step 3" (card and quotes file).
- concentration_curl-3 (low) `sources[ace-bicepsstudy].kind`: "secondary". Fix: none; R-LB5-5.

**wrist_curl**
- wrist_curl-1 (medium) `claims.c5; plate.mistake.rankNote`: only StrengthLog's dumbbell page is named as conflicting with ACE. BarBend and StrengthLog's barbell page also let the weight roll, so 3 of 4 technique sources say the opposite of "Grip stays closed both ways". Fix: R-LB5-3.
- wrist_curl-2 (low) `handlingMistakes[2].claim`: "Add reps before weight" comes from c7. Fix: ["c6","c7"].
- wrist_curl-3 (low) `setup[1].step; handlingMistakes[1].fix`: no cited quote says "Sit" (ACE kneels, and StrengthLog only rests the forearm), and no quote links leaning to the load. Fix: add BarBend's "While you’re sitting in a chair or on a bench, grasp a barbell or a pair of dumbbells with a supinated grip and rest one forearm on each of your legs." to c1. handlingMistakes[1].fix becomes "Keep the forearm down."

**straight_bar_triceps_pushdown**
- straight_bar_triceps_pushdown-1 (medium, scorer-added: plant h2-A cut this clause in the copy) `feel.rows[2]`: the back row's "Stop and don't train through the pain." rests on c11 and c4 alone. "pain" is not in c11, which says "strain". Fix: R-LB5-2 (NHS back quote). redFlag "back" stays, and LR-28's ship order applies.
- straight_bar_triceps_pushdown-2 (medium) `feel.rows[3]`: the stop line rests on c17 alone. Fix: R-LB5-2.
- straight_bar_triceps_pushdown-3 (low) `plate.mistake.rankNote`: Hussain's "If a subject was frequently unable to maintain the correct posture (i.e., his torso leaned too much or became straight, or his arm abduction varied), a new subject was recruited as a replacement." (efetch PMC7047337) is not set aside. Fix: add it as set aside, because it is a rule for replacing study subjects, not a statement that lifters often lean.
- straight_bar_triceps_pushdown-4 (low) `risks[0].risk; claims.c11.text`: "strains" drops the quote's "can". Fix: "Leaning or arching can strain the lower back." Write c11.text the same way.
- straight_bar_triceps_pushdown-5 (low) `handlingMistakes[0].fix; setup[2].claim`: c16 links too much weight to momentum, not to leaning, and "facing the machine" comes from c2. Fix: "Stand taller. Tilt only from the hips." setup[2] ["c3","c2"].
- straight_bar_triceps_pushdown-6 (low) `zooms[0].wrong; inherit grip.thumb and grip.wrist why`: no source gives "Wrists bent back over the bar". ACE's 185 page names only "handle or rope". Fix: wrong null (LR-25), unless the parent's card sources it. The inherit reasons say the bar is covered by sl-pushdown, hussain-2020 and ace-pressdown ("use a straight bar attachment").
- straight_bar_triceps_pushdown-7 (low) `familyNote; zooms[0].wrongNote`: these fields are not in CARD-V2. Fix: none; R-LB5-5.

**single_arm_triceps_pushdown**
- single_arm_triceps_pushdown-1 (medium) `inherit[redFlags].why; redFlags; risks; feel.rows`: the reason for dropping the back box has been false since c17 (MECH). The top fault's lower-back harm appears in no risk, no row and no box. Fix: R-LB5-4.
- single_arm_triceps_pushdown-2 (medium) `feel.rows[2]`: the stop line rests on c12 alone. Fix: R-LB5-2.
- single_arm_triceps_pushdown-3 (low) `zooms[0].wrong`: no source names "Wrist bent back over the handle". Fix: wrong null (LR-25).
- single_arm_triceps_pushdown-4 (low) `archetype.handle; anchorNote; claims.c8.conflictNote; zooms[0].wrongNote`: these fields are not in CARD-V2. Fix: none; R-LB5-5.

**alternating_dumbbell_curl**
- alternating_dumbbell_curl-1 (medium) `feel.rows[1]`: the stop line rests on c7 alone. Fix: R-LB5-2. nielasher-alt's stop line is on this card's source list already.
- alternating_dumbbell_curl-2 (low) `zooms[0].claim; zooms[1].claim`: the grip comes from c2 and c3, and "resting arm" and "torso upright" come from c1 and c4. Fix: ["c7","c2","c3"]; ["c6","c14","c1","c4"].

**barbell_curl**
- barbell_curl-1 (medium) `feel.rows[2]`: the stop line rests on c8 alone. Fix: R-LB5-2.
- barbell_curl-2 (low) `posture[4]; handlingMistakes[1]; feel.rows[1]; zooms[0]`: claim ids are missing. Fix: posture[4] ["c10","c9"]; handlingMistakes[1] and feel.rows[1] ["c5","c4"]; zooms[0] ["c8","c1"].

**ez_bar_curl**
- ez_bar_curl-1 (medium) `feel.rows[2]`: the stop line rests on c8 alone. Fix: R-LB5-2.
- ez_bar_curl-2 (low) `handlingMistakes[1]; feel.rows[1]; zooms[0]`: claim ids are missing. Fix: handlingMistakes[1] and feel.rows[1] ["c5","c4"]; zooms[0] ["c8","c1"].

**hammer_curl**
- hammer_curl-1 (low; the critic rated it medium, but it is not shown) `claims.c9`: the text says the palms-up grip excited the biceps more, and no c9 quote says so. Fix: add Coratella's "During the ascending phase, (i) biceps brachii excitation was greater with the supinated compared to the pronated [+19(7)%, ES: 2.60] and neutral handgrip [+12(9)%, ES: 1.24]" (efetch 36976950, verbatim) to c9.
- hammer_curl-2 (low) `claims.c12.text`: up 1 and down 2 have no stated basis. Fix: add "1 s up and 2 s down sit inside ACSM's moderate 1-2 s each way, which is stated for advanced training (LR-15)." as the sibling cards say. pause stays 0.
- hammer_curl-3 (low) `risks[0].risk`: "leads to" overstates c7's "might". Fix: "Too heavy a weight can make you swing and cut reps short."
- hammer_curl-4 (low) `zooms[0].claim`: the grip and thumb come from c1, and the straight wrist comes from c4. Fix: ["c5","c1","c4"].

**reverse_curl**
- reverse_curl-1 (low) `feel.rows[3].where`: "Elbow joint", but c5 says only "joints". Fix: "Joints", or add a quote that names the elbow.
- reverse_curl-2 (low) `libraryDiff`: "biceps (primary)" and "biceps (secondary)" are not muscles.ts ids. This is already known. Fix: none in this PR; LIB-MUSCLE (LR-35).

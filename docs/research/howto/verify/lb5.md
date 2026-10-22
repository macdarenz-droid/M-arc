# LB5 research verify (lb5): record

Record of the LR-29 verify of the 16 LB5 non-pilot cards (#286) and its one fix round. Source: docs/supervisor/verify/lb5-research-verify.md @ 3cf4163a (claude/sup-lib4-cards).

## Run
- Verified head: #286 @ fc536a97. The supervisor split a history-free copy of the 16 cards and their quotes into three blind halves (h1: 6 cards, h2: 5, h3: 5), each with one fresh Opus critic and supervisor plants (one tier-A safety line each).
- h1, h2 and h3: VALID. Each tier-A plant was caught as a blocker.
- Quotes on the head: 402 on 16 cards, 402/402 verbatim (the scorer's retry of sl-cablecurl found it at /cable-curl-with-bar/ after a 301).
- Supervisor 10 % re-fetch: 41/41 verbatim.
- LR-31: the critics agree with all 16 picks. LR-33: they agree with all 16 tempos.
- Severity follows LB3. Plant findings are not on the real head and need no action.

## Rulings
- R-LB5-2: a stop line on a wrist, elbow or back row stays only with a fetched, verbatim quote that supports stopping for that joint. When that quote gives a "how bad" point, means is "Is it getting worse?" (LR-28). The rule covers 11 rows on 10 LB5 cards and the same rows on the LB2 parents (dumbbell_biceps_curl, skull_crusher, triceps_pushdown).
- R-LB5-3: wrist_curl keeps ACE's closed grip (LR-18). c5 and the rankNote name all 3 of 4 technique sources that let the weight roll.
- R-LB5-4: single_arm_triceps_pushdown gains a back row, the back box and a back risk line on c17.
- R-LB5-5: the line-attached `*Note` keys, `archetype.handle` and source kind `secondary` are accepted as research data. bayesian_cable_curl's `plate.note` moves to `notes`.
- R-LB5-6: Motra's "3-1-1" leaves down at 2 on both overhead extensions (R-PB-3). The R-LB2-1 open item closes with no change.
- R-LB5-7: every other medium and low takes the fix as written. reverse_curl-2 stays with LIB-MUSCLE (LR-35).

## Fix round checks
- Valid JSON: 37 changed files (16 cards and 15 quotes files; the 3 LB2 parents and their quotes files).
- Dry run on the 16 cards: 0 errors.
  - Claims match the quotes files one for one, and there is no orphan source.
  - Every cited claim resolves, and every quote is at most 50 words.
  - 426/426 quotes are verbatim against curl fetches of 2026-10-22.
  - Every phrase quoted in a rankNote, mistake.why or tempo.text is on a page of its card.
- Parents: claims and quotes match one for one, and the new NHS quotes are verbatim. Their older quotes were verified in LB2; this round did not re-fetch those pages.
- Copy lint (main's lintHowto, medicalBans and fixVerbs) and C8: 0 hits on the 16 cards and the 3 parents.
- New sources: nhs-wrist-pain, nhs-back-pain and nhs-tennis-elbow, each fetched by curl on 2026-10-22. overhead_cable_triceps_extension and skull_crusher also gain motra-db-oh.
- Supervisor recheck of f6c88244: three parent/child mismatches fixed in a second commit (alternating_dumbbell_curl where, skull_crusher elbow row, single_arm_triceps_pushdown back-row fix).
- New quote entries: 29, each fetched by curl and verbatim.

## Finding → fix
All fixes are in the fix-round commit named on #286 as "LB5 RESEARCH FIXED".

| finding | sev | fix |
|---|---|---|
| overhead_cable_triceps_extension-1 | medium | rows[3] cites new c22 (motra-db-oh "Elbow joint pain", MECH); the stop line stays (R-LB5-2) |
| overhead_cable_triceps_extension-2 | low | rankNote sets aside Gaviria "TTRs are most commonly seen in ..." |
| overhead_cable_triceps_extension-3 | low | gaps: way out (g4 item 1) |
| overhead_cable_triceps_extension-4 | low | risks[0] "Arching the lower back can strain the spine." |
| dumbbell_overhead_triceps_extension-1 | medium | rows[3] cites new c19 (Motra "Elbow joint pain", WEAK) |
| dumbbell_overhead_triceps_extension-2 | low | rankNote sets aside the same Gaviria line |
| dumbbell_overhead_triceps_extension-3 | low | rows[1] [c9, c3]; handlingMistakes[2] [c10, c12] |
| dumbbell_overhead_triceps_extension-4 | low | gaps: way out (g4 item 2) |
| dumbbell_overhead_triceps_extension-5 | low | c8 text "sometimes the hardest part" |
| cross_body_hammer_curl-1 | low | rankNote sets aside Kerr's two other hits |
| cross_body_hammer_curl-2 | low | handlingMistakes[2] [c5, c6]; posture[2] [c7, c5]; c2 + Fitbod "Repeat this action with your other arm."; tells[1] [c5, c6] |
| cable_curl-1 | low | sl-cablecurl url is /cable-curl-with-bar/, checked 2026-10-22 |
| cable_curl-2 | medium | rows[2] cites new c14 (NHS wrist pain, MECH) |
| cable_curl-3 | low | setup[2] [c1, c2] |
| cable_curl-4 | low | rows[1] means "Fault: the elbows drifting well forward, which loads the front delts." |
| bayesian_cable_curl-1 | low | c9 + BarBend "In such cases, go for one of these alternatives instead"; handlingMistakes[0] [c5, c4] |
| bayesian_cable_curl-2 | low | plate.note moved to notes (R-LB5-5) |
| preacher_curl-1 | medium | rows[3] cites new c16 (NHS wrist pain, MECH) |
| preacher_curl-2 | low | handlingMistakes[0] [c5, c4]; [1] [c3, c2] |
| preacher_curl-3 | low | rankNote sets aside the three Jukes hits; Reading B added as one sentence |
| incline_dumbbell_curl-1 | medium | rows[2] cites new c15 (NHS wrist pain, MECH, which says pain) |
| incline_dumbbell_curl-2 | low | handlingMistakes[1] [c4, c3] |
| incline_dumbbell_curl-3 | low | rankNote sets aside Kerr's two other hits |
| incline_dumbbell_curl-4 | low | c6 + BarBend "the biceps is actually a biarticular muscle — it crosses both the elbow and shoulder joints." |
| incline_dumbbell_curl-5 | low | no change (R-LB5-5) |
| concentration_curl-1 | low | rows[0] means "The biceps are doing the work." |
| concentration_curl-2 | low | c8 quote 0 and c12 quote 1 where "How to, step 3" (card and quotes file) |
| concentration_curl-3 | low | no change (R-LB5-5) |
| wrist_curl-1 | medium | R-LB5-3: c5 + BarBend glide line and StrengthLog barbell roll line; c5 text and rankNote name 3 of 4 sources |
| wrist_curl-2 | low | handlingMistakes[2] [c6, c7] |
| wrist_curl-3 | low | c1 + BarBend seated line; handlingMistakes[1].fix "Keep the forearm down." [c3, c1] |
| straight_bar_triceps_pushdown-1 | medium | rows[2] cites new c20 (NHS back pain, MECH); means "Is it getting worse?"; redFlag back stays |
| straight_bar_triceps_pushdown-2 | medium | rows[3] cites new c21 (NHS tennis elbow, MECH); means "Is it getting worse?" |
| straight_bar_triceps_pushdown-3 | low | rankNote sets aside Hussain's replacement rule |
| straight_bar_triceps_pushdown-4 | low | risks[0] and c11 text say "can strain" |
| straight_bar_triceps_pushdown-5 | low | handlingMistakes[0].fix "Stand taller. Tilt only from the hips." [c11, c3, c4]; setup[2] [c3, c2] |
| straight_bar_triceps_pushdown-6 | low | zooms[0].wrong null and wrongNote dropped (LR-25); inherit reasons for zooms, grip.thumb and grip.wrist rewritten |
| straight_bar_triceps_pushdown-7 | low | no change (R-LB5-5) |
| single_arm_triceps_pushdown-1 | medium | R-LB5-4: back row on c17 + new c19 (NHS back pain), fix "Stop and don't train through the pain. Stand taller, tilt only from the hips." as straight_bar's; redFlags [elbow, back]; risks[2] "Leaning or arching can strain the lower back."; inherit reason rewritten |
| single_arm_triceps_pushdown-2 | medium | rows[2] cites new c18 (NHS tennis elbow, MECH); means "Is it getting worse?" |
| single_arm_triceps_pushdown-3 | low | zooms[0].wrong null (LR-25) |
| single_arm_triceps_pushdown-4 | low | no change (R-LB5-5) |
| alternating_dumbbell_curl-1 | medium | rows[1] cites new c15 (nielasher-alt "If you experience any discomfort, stop immediately ..."); where "Wrist discomfort or pain" kept, matching the parent (supervisor recheck: the quote fits) |
| alternating_dumbbell_curl-2 | low | zooms[0] [c7, c2, c3]; zooms[1] [c6, c14, c1, c4] |
| barbell_curl-1 | medium | rows[2] cites new c16 (NHS wrist pain, MECH) |
| barbell_curl-2 | low | posture[4] [c10, c9]; handlingMistakes[1] and rows[1] [c5, c4]; zooms[0] [c8, c1] |
| ez_bar_curl-1 | medium | rows[2] cites new c15 (NHS wrist pain, MECH) |
| ez_bar_curl-2 | low | handlingMistakes[1] and rows[1] [c5, c4]; zooms[0] [c8, c1] |
| hammer_curl-1 | low | c9 + Coratella's ascending-phase biceps line |
| hammer_curl-2 | low | c12 text states the 1 s up and 2 s down basis (LR-15) |
| hammer_curl-3 | low | risks[0] "Too heavy a weight can make you swing and cut reps short." |
| hammer_curl-4 | low | zooms[0] [c5, c1, c4] |
| reverse_curl-1 | low | rows[3] where "Joints" |
| reverse_curl-2 | low | no change (LIB-MUSCLE, LR-35) |
| R-LB5-2 parents | ruling | dumbbell_biceps_curl wrist row + c17 (NHS wrist pain); skull_crusher elbow row matches the overhead children (supervisor recheck): "Back-of-elbow pain" / "Fault: lowering forcefully." / "Stop the set. Don't train through the pain.", claims c15 + new c18 (motra-db-oh "Elbow joint pain", MECH; source added; no NHS tennis-elbow quote); triceps_pushdown back row + c19 (NHS back pain) and elbow row + c20 (NHS tennis elbow), both means "Is it getting worse?" |
| R-LB5-6 | ruling | no change; down stays 2 on both overhead extensions |

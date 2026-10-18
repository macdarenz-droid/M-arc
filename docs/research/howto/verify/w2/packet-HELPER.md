# W2 fix packet: HELPER

Fix exactly these and nothing else; then re-run your A1-A6 / validation, have your Sonnet fetcher check every new or changed quote, push once, and post FIXED with the sha.

- Head: `claude/libht-verify-w2` @ `5036283d1e69f617cc45d5b49689e9281f3d61f3` (your files are W2B's, unchanged there since `d4f30c70`). Paths are under `docs/research/howto/`.
- Final rulings: `w2-rulings-final.md` (LR-30 to LR-35; all amended, none rejected). Items keep their numbers from the first packet; items the final rulings added follow them, under "Added by the final rulings".
- Model: the exact edits below may run on claude-sonnet-5 (exact text, exact cards; stop on any mismatch). The items marked **[LR-34 step]** or **[LR-31 step]** are judgement work, so under lib4-cards section 12 item 14 they run on claude-opus-5-5, not Sonnet.
- Routed to you by name: `single_arm_lat_pulldown` `plate.mistake` (rankNote) and `handlingMistakes` order, by ruling LR-32 (W2-50; lib4-cards 13 Q1(b), which sent them to research), and its `claims[id=c14].text` by ruling LR-33; `underhand_lat_pulldown` `plate.mistake` (what, claim, why, rankNote) and `handlingMistakes` order, `leg_press_calf_raise` `plate.mistake.what`, and the LR-31 step on 8 LB1 cards, by ruling LR-31 (W2-51); and the LR-34 re-check of 8 children (W2-53). These are new scope for the W2B files, given here by name; nothing else is opened.
- Quotes-file edits: apply by claim id and content; the head indices are given only to locate the entry.
- Items marked **[fetcher]** add or change a quote: your Sonnet fetcher re-fetches each one by curl (desktop UA) before you push.

## `cards/single_arm_lat_pulldown.json`

1. **W2-39/W2-50** · medium · `cards/single_arm_lat_pulldown.json` · `claims[id=c6].quotes[0].where`
   - old:
     ```json
     "FAQ"
     ```
   - new:
     ```json
     "Single Arm Lat Pulldown Tips"
     ```
   - why: The quote sits under PureGym's Tips, not the FAQ (re-fetched).

2. **W2-39** · medium · `cards/single_arm_lat_pulldown.json` · `claims[id=c10].quotes[0].where`
   - old:
     ```json
     "Common mistakes"
     ```
   - new:
     ```json
     "Common Single-Arm Lat Pulldown Mistakes: Dumping Your Shoulders Forward"
     ```
   - why: Exact BarBend section.

3. **W2-39** · medium · `cards/single_arm_lat_pulldown.json` · `claims[id=c11].quotes[0].where`
   - old:
     ```json
     "Common mistakes"
     ```
   - new:
     ```json
     "Common Single-Arm Lat Pulldown Mistakes: Torso Twisting"
     ```
   - why: Exact BarBend section.

4. **W2-39** · medium · `cards/single_arm_lat_pulldown.json` · `inherit[3].why`
   - old:
     ```json
     "true for this child because the seat, pad and overhead pulley are the parent's; the coach sources here add that the torso must also not lean sideways or twist (c6, c11)."
     ```
   - new:
     ```json
     "true for this child because the seat, pad and overhead pulley are the parent's; the coach sources here add that the torso must also not lean into each rep or twist (c6, c11)."
     ```
   - why: 'sideways' has no source; c11 says 'leaning into each repetition'.

5. **W2-39/W2-50** · medium · `cards/single_arm_lat_pulldown.json` · `handlingMistakes (reorder: past-end first, then twist, then lean; text unchanged)`
   - old:
     ```json
     [{"mistake": "Twisting or swinging the torso to finish the rep.", "fix": "Brace the trunk. If it still twists, lower the load.", "claim": "c6"}, {"mistake": "Pulling past the end so the elbow goes behind you and the shoulder rolls forward.", "fix": "Stop when the handle just passes your chin.", "claim": ["c10", "c2"]}, {"mistake": "Leaning into each rep to get the arm down.", "fix": "Tighten your abs to hold the spine still. If your torso still swings or twists, lower the load.", "claim": ["c11", "c6"]}]
     ```
   - new:
     ```json
     [{"mistake": "Pulling past the end so the elbow goes behind you and the shoulder rolls forward.", "fix": "Stop when the handle just passes your chin.", "claim": ["c10", "c2"]}, {"mistake": "Twisting or swinging the torso to finish the rep.", "fix": "Brace the trunk. If it still twists, lower the load.", "claim": "c6"}, {"mistake": "Leaning into each rep to get the arm down.", "fix": "Tighten your abs to hold the spine still. If your torso still swings or twists, lower the load.", "claim": ["c11", "c6"]}]
     ```
   - why: LR-32/LR-31: handlingMistakes[0] is the top fault (past-end pull), matching plate.mistake.

6. **W2-39/W2-50** · medium · `cards/single_arm_lat_pulldown.json` · `plate.mistake.rankNote (add after drawable; drawable stays true)` [merged]
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 1: no frequency word for a fault (BarBend's \"perfectly common\" is about one side being stronger; \"usually\" and \"frequently\" there, and PureGym's \"typically\", are about muscles, athletes or the load). LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c10; ACE c13, two-arm pulldown, MECH), and it is first in BarBend's common-mistakes list. BarBend's Going Too Heavy (a load choice) and Torso Twisting with the lean (c11), and the PureGym twist tip (c6), state no harm; if ACE's closing stress line is read onto the backward lean, the past-end pull still wins on harm sources (c10, c13)."
     ```
   - why: LR-32's final text replaces W2-39's proposed rankNote (step 1's finding filed under step 1; step 3 gives the same fault).

7. **W2-50** · ruling · `cards/single_arm_lat_pulldown.json` · `notes (append)`
   - old: (none; append this entry at the end of the array (head has 1 entries))
   - new:
     ```json
     "LR-32 (W2-50, supervisor 2026-10-18): the quotes cannot show which fault is most common. Under LR-31 the past-end pull is the top fault (first in BarBend's list, the only fault with stated harm), so drawable stays true and handlingMistakes starts with it. census.json's 'defining fault is a sideways lean' has no source."
     ```
   - why: LR-32.

## `cards/underhand_lat_pulldown.json`

8. **W2-42** · medium · `cards/underhand_lat_pulldown.json` · `plate.variantLine`
   - old:
     ```json
     null
     ```
   - new:
     ```json
     "Drawn: the lat pulldown station with a long bar, the version BarBend's guide covers (c19). BarBend also names a regular cable machine with a bar attachment (c19); no card source describes that setup, so no line on this card is claimed to hold for it."
     ```
   - why: 'Cable / Machine' equipment needs a variant line (content.md 4; D-LIB5-VARIANT 5; not exempt).

9. **W2-42** · medium · `cards/underhand_lat_pulldown.json` · `claims (append new c19 after c18)` [fetcher]
   - old: (none; append this entry at the end of the array (head has 18 entries))
   - new:
     ```json
     {"id": "c19", "text": "BarBend: the exercise needs a pulldown machine or a regular cable machine with a bar attachment; its guide covers the full lat pulldown station.", "tags": ["CONSENSUS"], "sources": ["barbend-reverse-grip-lat-pulldown"], "quotes": [{"source": "barbend-reverse-grip-lat-pulldown", "text": "To perform the reverse-grip lat pulldown, you’ll need a pulldown machine or a regular cable machine with a bar attachment.", "where": "How to, intro"}, {"source": "barbend-reverse-grip-lat-pulldown", "text": "This guide will focus on the version with a fully-equipped lat pulldown station.", "where": "How to, intro"}]}
     ```
   - why: Same; keep the curly apostrophe in 'you’ll'.

10. **W2-42** · medium · `cards/underhand_lat_pulldown.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "2026-10-18: c19 is taken from BarBend's 'How to' intro, re-read by curl. BarBend names a pulldown machine or a regular cable machine with a bar attachment and covers only the station. No card source describes the cable-machine setup, such as its seat, thigh pad or bar height, so the variant line claims no line for that kind."
     ```
   - why: Record.

## `quotes/underhand_lat_pulldown.json`

11. **W2-42** · medium · `quotes/underhand_lat_pulldown.json` · `quotes (append quotes[24], quotes[25] after the last c18 entry)` [fetcher]
   - old: (none; append these entries, in order at the end of the array (head has 24 entries))
   - new:
     ```json
     [{"claim": "c19", "source": "barbend-reverse-grip-lat-pulldown", "quote": "To perform the reverse-grip lat pulldown, you’ll need a pulldown machine or a regular cable machine with a bar attachment.", "status": "verbatim", "closest": null}, {"claim": "c19", "source": "barbend-reverse-grip-lat-pulldown", "quote": "This guide will focus on the version with a fully-equipped lat pulldown station.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

## `cards/cable_fly.json`

12. **W2-44** · low · `cards/cable_fly.json` · `plate.tempo.claim`
   - old:
     ```json
     "c12, c5"
     ```
   - new:
     ```json
     ["c12", "c5"]
     ```
   - why: CARD-V2: a claim is an id, a list or inherit:<n>; a comma string resolves to nothing.

## `cards/low_to_high_cable_fly.json`

13. **W2-44** · low · `cards/low_to_high_cable_fly.json` · `plate.tempo.claim`
   - old:
     ```json
     "c12, c5"
     ```
   - new:
     ```json
     ["c12", "c5"]
     ```
   - why: CARD-V2: a claim is an id, a list or inherit:<n>; a comma string resolves to nothing.

## `cards/cable_shrug.json`

14. **W2-45** · low · `cards/cable_shrug.json` · `claims[id=c7].text (claims[6])`
   - old:
     ```json
     "Tempo: about 1-2 s up and 1-2 s down, with a one-second hold at the top and a slow lowering (the slow lowering is from the ACE barbell shrug page; same shoulder movement on a cable). ACSM gives its 1-2 s each way for intermediate to advanced lifters working toward heavy loads, so the seconds are a drawing convention."
     ```
   - new:
     ```json
     "Tempo: about 1-2 s up and 1-2 s down, with a one-second hold at the top. ACSM gives its 1-2 s each way for intermediate to advanced lifters working toward heavy loads, so the seconds are a drawing convention."
     ```
   - why: CONSENSUS+MECH+WEAK is not a tag set the 8 use (CARD-V2); split keeps both flags.

15. **W2-45** · low · `cards/cable_shrug.json` · `claims[id=c7].tags`
   - old:
     ```json
     ["CONSENSUS", "MECH", "WEAK"]
     ```
   - new:
     ```json
     ["CONSENSUS", "WEAK"]
     ```
   - why: Same.

16. **W2-45** · low · `cards/cable_shrug.json` · `claims[id=c7].sources`
   - old:
     ```json
     ["acsm2009", "exercise-com-cable-shrug", "ace-shrug"]
     ```
   - new:
     ```json
     ["acsm2009", "exercise-com-cable-shrug"]
     ```
   - why: Same.

17. **W2-45** · low · `cards/cable_shrug.json` · `claims[id=c7].quotes`
   - old:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}, {"source": "exercise-com-cable-shrug", "text": "Hold the contraction at the top for a second.", "where": "Step 3"}, {"source": "ace-shrug", "text": "lowering slowly to the original starting position.", "where": "exercise description"}]
     ```
   - new:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}, {"source": "exercise-com-cable-shrug", "text": "Hold the contraction at the top for a second.", "where": "Step 3"}]
     ```
   - why: Same.

18. **W2-45** · low · `cards/cable_shrug.json` · `claims (append new c16 after c15)`
   - old: (none; append this entry at the end of the array (head has 15 entries))
   - new:
     ```json
     {"id": "c16", "text": "The lowering is slow, back to the starting position (from the ACE barbell shrug page; same shoulder movement on a cable).", "tags": ["CONSENSUS", "MECH"], "sources": ["ace-shrug"], "quotes": [{"source": "ace-shrug", "text": "lowering slowly to the original starting position.", "where": "exercise description"}]}
     ```
   - why: Same; the ACE lowering applied to the cable keeps MECH.

19. **W2-45** · low · `cards/cable_shrug.json` · `plate.tempo.claim`
   - old:
     ```json
     "c7"
     ```
   - new:
     ```json
     ["c7", "c16"]
     ```
   - why: Same.

20. **W2-45** · low · `cards/cable_shrug.json` · `posture[3].claim`
   - old:
     ```json
     "c7"
     ```
   - new:
     ```json
     ["c7", "c16"]
     ```
   - why: 'lower slowly' moves to c16.

21. **W2-45** · low · `cards/cable_shrug.json` · `notes (new key: the card has no notes on the head; CARD-V2 allows the optional array)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     ["c7 is split (2026-10-18, W2-45). The ACE barbell-shrug slow lowering is now c16 [CONSENSUS, MECH], and c7 keeps the top hold plus the ACSM seconds as a drawing convention [CONSENSUS, WEAK] (LR-15, D-W2-TEMPO). Each tag set now matches one the 8 use (CARD-V2). plate.tempo and posture[3] cite both."]
     ```
   - why: Record.

## `quotes/cable_shrug.json`

22. **W2-45** · low · `quotes/cable_shrug.json` · `quotes[10].claim (ace-shrug 'lowering slowly...')`
   - old:
     ```json
     "c7"
     ```
   - new:
     ```json
     "c16"
     ```
   - why: Same.

## `cards/chest_supported_row.json`

23. **W2-46** · low · `cards/chest_supported_row.json` · `claims[id=c12].text (claims[11])`
   - old:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo. Load goes up by 2-10% once the target reps are beaten by one or two."
     ```
   - new:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo."
     ```
   - why: Claims are atoms (content.md 3.2); load rule is not WEAK.

24. **W2-46** · low · `cards/chest_supported_row.json` · `claims[id=c12].quotes (drop the load quote)`
   - old:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}, {"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]
     ```
   - new:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}]
     ```
   - why: The load quote moves to c13.

25. **W2-46** · low · `cards/chest_supported_row.json` · `claims (append new c13)`
   - old: (none; append this entry at the end of the array (head has 12 entries))
   - new:
     ```json
     {"id": "c13", "text": "Load goes up by 2-10% once the target reps are beaten by one or two.", "tags": ["CONSENSUS"], "sources": ["acsm2009"], "quotes": [{"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]}
     ```
   - why: Next free id.

26. **W2-46** · low · `cards/chest_supported_row.json` · `setup[4].claim`
   - old:
     ```json
     "c12"
     ```
   - new:
     ```json
     "c13"
     ```
   - why: The shown load line cites the load claim.

## `quotes/chest_supported_row.json`

27. **W2-46** · low · `quotes/chest_supported_row.json` · `quotes[18].claim (the 2-10% load entry)`
   - old:
     ```json
     "c12"
     ```
   - new:
     ```json
     "c13"
     ```
   - why: Quotes file follows the split.

## `cards/horizontal_leg_press.json`

28. **W2-46** · low · `cards/horizontal_leg_press.json` · `claims[id=c12].text (claims[11])`
   - old:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo. Load goes up by 2-10% once the target reps are beaten by one or two."
     ```
   - new:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo."
     ```
   - why: Claims are atoms (content.md 3.2); load rule is not WEAK.

29. **W2-46** · low · `cards/horizontal_leg_press.json` · `claims[id=c12].quotes (drop the load quote)`
   - old:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}, {"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]
     ```
   - new:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}]
     ```
   - why: The load quote moves to c14.

30. **W2-46** · low · `cards/horizontal_leg_press.json` · `claims (append new c14)`
   - old: (none; append this entry at the end of the array (head has 13 entries))
   - new:
     ```json
     {"id": "c14", "text": "Load goes up by 2-10% once the target reps are beaten by one or two.", "tags": ["CONSENSUS"], "sources": ["acsm2009"], "quotes": [{"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]}
     ```
   - why: Next free id.

## `quotes/horizontal_leg_press.json`

31. **W2-46** · low · `quotes/horizontal_leg_press.json` · `quotes[22].claim (the 2-10% load entry)`
   - old:
     ```json
     "c12"
     ```
   - new:
     ```json
     "c14"
     ```
   - why: Quotes file follows the split.

## `cards/incline_machine_press.json`

32. **W2-46** · low · `cards/incline_machine_press.json` · `claims[id=c8].text (claims[7])`
   - old:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo. Load goes up by 2-10% once the target reps are beaten by one or two."
     ```
   - new:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo."
     ```
   - why: Claims are atoms (content.md 3.2); load rule is not WEAK.

33. **W2-46** · low · `cards/incline_machine_press.json` · `claims[id=c8].quotes (drop the load quote)`
   - old:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}, {"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]
     ```
   - new:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}]
     ```
   - why: The load quote moves to c9.

34. **W2-46** · low · `cards/incline_machine_press.json` · `claims (append new c9)`
   - old: (none; append this entry at the end of the array (head has 8 entries))
   - new:
     ```json
     {"id": "c9", "text": "Load goes up by 2-10% once the target reps are beaten by one or two.", "tags": ["CONSENSUS"], "sources": ["acsm2009"], "quotes": [{"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]}
     ```
   - why: Next free id.

35. **W2-46** · low · `cards/incline_machine_press.json` · `setup[3].claim`
   - old:
     ```json
     "c8"
     ```
   - new:
     ```json
     "c9"
     ```
   - why: The shown load line cites the load claim.

## `quotes/incline_machine_press.json`

36. **W2-46** · low · `quotes/incline_machine_press.json` · `quotes[13].claim (the 2-10% load entry)`
   - old:
     ```json
     "c8"
     ```
   - new:
     ```json
     "c9"
     ```
   - why: Quotes file follows the split.

## `cards/straight_arm_pulldown.json`

37. **W2-46** · low · `cards/straight_arm_pulldown.json` · `claims[id=c15].text (claims[13])`
   - old:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo. Load goes up by 2-10% once the target reps are beaten by one or two."
     ```
   - new:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo."
     ```
   - why: Claims are atoms (content.md 3.2); load rule is not WEAK.

38. **W2-46** · low · `cards/straight_arm_pulldown.json` · `claims[id=c15].quotes (drop the load quote)`
   - old:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}, {"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]
     ```
   - new:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}]
     ```
   - why: The load quote moves to c16.

39. **W2-46** · low · `cards/straight_arm_pulldown.json` · `claims (append new c16)`
   - old: (none; append this entry at the end of the array (head has 14 entries))
   - new:
     ```json
     {"id": "c16", "text": "Load goes up by 2-10% once the target reps are beaten by one or two.", "tags": ["CONSENSUS"], "sources": ["acsm2009"], "quotes": [{"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]}
     ```
   - why: Next free id (c14 not reused).

## `quotes/straight_arm_pulldown.json`

40. **W2-46** · low · `quotes/straight_arm_pulldown.json` · `quotes[29].claim (the 2-10% load entry)`
   - old:
     ```json
     "c15"
     ```
   - new:
     ```json
     "c16"
     ```
   - why: Quotes file follows the split.

## `quotes/conventional_deadlift.json`

41. **W2-47** · low · `quotes/conventional_deadlift.json` · `checked (top level)`
   - old:
     ```json
     "2026-09-30"
     ```
   - new:
     ```json
     "2026-10-17"
     ```
   - why: File was rewritten on 2026-10-17 but kept the old date.

42. **W2-47** · low · `quotes/conventional_deadlift.json` · `sources[2].checked (id acsm2009)`
   - old:
     ```json
     "2026-09-30"
     ```
   - new:
     ```json
     "2026-10-17"
     ```
   - why: Same.

43. **W2-47** · low · `quotes/conventional_deadlift.json` · `sources[2].changes (id acsm2009)`
   - old:
     ```json
     "none"
     ```
   - new:
     ```json
     "none to the source record; LR-15 re-check: c12's tempo quote replaced by Q1 (intermediate to advanced scope) and Q2 (heavy loading, 1-2 s CON; 1-2 s ECC), both verbatim in the efetch abstract (PMID 19204579)"
     ```
   - why: Same.

## `quotes/dumbbell_romanian_deadlift.json`

44. **W2-47** · low · `quotes/dumbbell_romanian_deadlift.json` · `checked (top level)`
   - old:
     ```json
     "2026-09-30"
     ```
   - new:
     ```json
     "2026-10-17"
     ```
   - why: File was rewritten on 2026-10-17 but kept the old date.

45. **W2-47** · low · `quotes/dumbbell_romanian_deadlift.json` · `sources[5].checked (id acsm2009)`
   - old:
     ```json
     "2026-09-30"
     ```
   - new:
     ```json
     "2026-10-17"
     ```
   - why: Same.

46. **W2-47** · low · `quotes/dumbbell_romanian_deadlift.json` · `sources[5].changes (id acsm2009)`
   - old:
     ```json
     "none"
     ```
   - new:
     ```json
     "none to the source record; LR-15 re-check: c20's tempo quote replaced by Q1 (intermediate to advanced scope) and Q2 (heavy loading, 1-2 s CON; 1-2 s ECC), both verbatim in the efetch abstract (PMID 19204579)"
     ```
   - why: Same.

## `quotes/sumo_deadlift.json`

47. **W2-47** · low · `quotes/sumo_deadlift.json` · `checked (top level)`
   - old:
     ```json
     "2026-09-30"
     ```
   - new:
     ```json
     "2026-10-17"
     ```
   - why: File was rewritten on 2026-10-17 but kept the old date.

48. **W2-47** · low · `quotes/sumo_deadlift.json` · `sources[7].checked (id acsm2009)`
   - old:
     ```json
     "2026-09-30"
     ```
   - new:
     ```json
     "2026-10-17"
     ```
   - why: Same.

49. **W2-47** · low · `quotes/sumo_deadlift.json` · `sources[7].changes (id acsm2009)`
   - old:
     ```json
     "none"
     ```
   - new:
     ```json
     "none to the source record; LR-15 re-check: c21's tempo quote replaced by Q1 (intermediate to advanced scope) and Q2 (heavy loading, 1-2 s CON; 1-2 s ECC), both verbatim in the efetch abstract (PMID 19204579)"
     ```
   - why: Same.

## `cards/{close_grip_pulldown,single_arm_lat_pulldown,underhand_lat_pulldown,leg_press_calf_raise,horizontal_leg_press,incline_machine_press,front_squat,goblet_squat}.json`

50. **W2-53** · ruling · `cards/{close_grip_pulldown,single_arm_lat_pulldown,underhand_lat_pulldown,leg_press_calf_raise,horizontal_leg_press,incline_machine_press,front_squat,goblet_squat}.json` · `inherit[*] LR-34 re-check + notes (append the result per card)` [LR-34 step]
   - do: For each of the 8 cards, re-run the LR-8 check of every inherit entry against the parent's card, or a verified shared card whose appliesTo lists the child (for example shared/selector-pin.json c1 for the pin line), on head 5036283d (lat_pulldown for close_grip_pulldown, single_arm_lat_pulldown, underhand_lat_pulldown; leg_press for leg_press_calf_raise, horizontal_leg_press; machine_chest_press for incline_machine_press; barbell_back_squat for front_squat, goblet_squat). Golden-B sheets and grip-and-feel research are a source map only. An inherit entry stays only where the parent's shipped How-to (tools/plates/layers/exercises/<parent>.howto.mjs on main) has a string for it whose every clause the parent card or shared card supports (D-LIB5-FAMILY `===`). Append one notes entry per card that records holds or fails for each inherit entry by claim id (the parent's, or the shared card's file and claim id), not by setup index (THE8's W2-24 merges leg_press setup[3] and [4]), and gives, per kept entry, the shipped-sheet path it restates, or "no whole string". Apply LR-34's ways out, in order, to any that fail: (1) the child's own fetched, quoted claim (tagged MECH or WEAK when written for another exercise), tried first for every shown or safety line; (2) an LR-4 drawing convention in notes, for a pure drawing choice only, never for a safety line; (3) remove the line and add a gaps entry; a removed safety line on a tier-A card joins the owner's tier-A gap list. A feel row, redFlag, risk line or tier-A point is never removed: if way (1) finds no quote, keep it and the inherit entry it rests on as on the head, record the failed check in notes, and report the card as stopped for a supervisor ruling. Never keep a line on golden-B alone. When an inherit entry is removed, every shown word that restates it goes too, and every "inherit:<n>" reference is re-indexed. Name any card whose inherit list becomes empty. front_squat: check each unrack and walk-out step, before its plate is drawn, against whichever of cards/barbell_back_squat.json and shared/unrack-rerack.json sources it; if they disagree, the line fails until the supervisor rules (see open point b).
   - why: LR-34 (W2-53) as amended: verified shared cards count, claim ids, way (1) first, stop rule, shipped path per kept entry, LR-8's front_squat gates kept.

## `cards/{single_arm_lat_pulldown,close_grip_pulldown,underhand_lat_pulldown}.json`

51. **W2-53/W2-40** · ruling · `cards/{single_arm_lat_pulldown,close_grip_pulldown,underhand_lat_pulldown}.json` · `zooms[0].right (hand zoom) inside the LR-34 check` [LR-34 step]
   - do: Each hand zoom restates inherit[0] grip.handContact ('across the base of the fingers'): single_arm 'Single handle across the base of the fingers, wrist not curled.'; close_grip 'Neutral grip on the V-handle, handles across the base of the fingers, wrists not curled.'; underhand 'Palms facing you, bar across the base of the fingers, wrists not curled.'. The parent cards/lat_pulldown.json grip.handContact reads 'From the shared pull hand archetype; not re-sourced on this card.' If inherit[0] fails and way (1), through the golden-B lat_pulldown source map, finds no verbatim quote for the handle contact, remove the base-of-the-fingers words from the zoom (as LR-34 did for chin_up and hanging_knee_raise) and record grip.handContact as an LR-4 drawing convention; do not add "inherit:0" (W2-40's fix is superseded). If way (1) finds one, add it as that card's own claim (fetcher-checked; MECH or WEAK when written for another exercise), keep the words, and cite the claim in the zoom and grip.handContact. Hand contact on a cable handle is a pure drawing choice, so way (2) is allowed.
   - why: W2-40 x W2-53 conflict resolved by LR-34.

## `cards/{rear_delt_fly,bent_over_dumbbell_rear_delt_fly}.json`

52. **W2-54** · ruling · `cards/{rear_delt_fly,bent_over_dumbbell_rear_delt_fly}.json` · `feel.secondary rotator_cuff (W2-48)` [no change]
   - do: No change: rotator_cuff in feel.secondary is allowed under C2 and LR-35. W2-48's rotator_cuff point is closed.
   - why: LR-35.

## Added by the final rulings (w2-rulings-final.md)

### `cards/single_arm_lat_pulldown.json`

53. **W2-52** · ruling · `cards/single_arm_lat_pulldown.json` · `claims[id=c14].text`
   - old:
     ```json
     "The plate uses a 2-second pull and a 2-second return (the cadence Lusk 2010 tested on two-arm pulldowns) with a brief pause at the bottom; a study protocol and coach cue, not a tested recommendation."
     ```
   - new:
     ```json
     "The plate uses a 2-second pull and a 2-second return (the cadence Lusk 2010 tested on two-arm pulldowns) with a brief pause at the bottom; a study protocol and coach cue, not a tested recommendation. BarBend gives no seconds for the pause, so the 1 s on the plate is a drawing convention (LR-33)."
     ```
   - why: LR-33: a pause-1 tempo claim names the 1 s as a drawing convention; c14 is the only LB1 tempo claim that does not. Tags (WEAK) and quotes are unchanged.

### `cards/underhand_lat_pulldown.json`

54. **W2-51** · ruling · `cards/underhand_lat_pulldown.json` · `plate.mistake.what`
   - old:
     ```json
     "Using momentum: the torso rocks back to drive the bar down."
     ```
   - new:
     ```json
     "Pulling the bar further down after it passes just below the chin, so the elbows start moving backwards."
     ```
   - why: LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c11). Words from c8, c6 and c11.

55. **W2-51** · ruling · `cards/underhand_lat_pulldown.json` · `plate.mistake.claim`
   - old:
     ```json
     ["c7", "c5"]
     ```
   - new:
     ```json
     ["c6", "c8", "c11"]
     ```
   - why: LR-31.

56. **W2-51** · ruling · `cards/underhand_lat_pulldown.json` · `plate.mistake.why`
   - old:
     ```json
     "The coach source names momentum first and asks for a stable torso; ACE limits the lean to about 30 degrees with no extra lean during the pull. Frequency is not measured."
     ```
   - new:
     ```json
     "The coach source says pulling the bar further down lets the forearms and deltoids take over (c8); ACE says pulling on once the elbows start moving back adds stress to the shoulder joint (c11, MECH: written for the overhand bar). Frequency is not measured."
     ```
   - why: LR-31.

57. **W2-51** · ruling · `cards/underhand_lat_pulldown.json` · `plate.mistake.drawable` [no change]
   - do: No change: drawable stays true. The census side view draws the past-end pull (a still pose).
   - why: LR-31.

58. **W2-51** · ruling · `cards/underhand_lat_pulldown.json` · `plate.mistake.rankNote (add after drawable)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 1: no frequency word for an underhand-pulldown fault. LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c11, MECH); c8 names a muscle shift, not harm. Momentum (c7) and the fast return (c9) state no harm."
     ```
   - why: LR-31: every plate.mistake carries a rankNote.

59. **W2-51** · ruling · `cards/underhand_lat_pulldown.json` · `handlingMistakes (reorder: too far first, then rocking, then fast return; text unchanged)`
   - old:
     ```json
     [{"mistake": "Rocking the torso to swing the bar down.", "fix": "Keep the torso still.", "claim": "c7"}, {"mistake": "Pulling the bar down too far.", "fix": "Stop when the bar passes just below your chin.", "claim": ["c8", "c6"]}, {"mistake": "Letting the bar fly back up.", "fix": "Control it all the way up; if you can't, the weight is too heavy.", "claim": "c9"}]
     ```
   - new:
     ```json
     [{"mistake": "Pulling the bar down too far.", "fix": "Stop when the bar passes just below your chin.", "claim": ["c8", "c6"]}, {"mistake": "Rocking the torso to swing the bar down.", "fix": "Keep the torso still.", "claim": "c7"}, {"mistake": "Letting the bar fly back up.", "fix": "Control it all the way up; if you can't, the weight is too heavy.", "claim": "c9"}]
     ```
   - why: LR-31: handlingMistakes[0] is the top fault (the past-end pull), matching plate.mistake.

### `cards/leg_press_calf_raise.json`

60. **W2-51** · ruling · `cards/leg_press_calf_raise.json` · `plate.mistake.what`
   - old:
     ```json
     "Knees snap straight and lock while pushing the platform, often from going too fast."
     ```
   - new:
     ```json
     "Knees snap straight and lock while pushing the platform, which fast reps tend to cause."
     ```
   - why: LR-31: "often" has no frequency quote behind it (c5 says "there is a tendency to fully straighten the legs"); the locked knees are tied to harm (c6) and are a still sign, so the pick and drawable:true stay.

### `cards/{close_grip_pulldown,straight_arm_pulldown,chest_supported_row,incline_machine_press,horizontal_leg_press,leg_press_calf_raise,inverted_row,resistance_band_row}.json`

61. **W2-51** · ruling · `cards/{close_grip_pulldown,straight_arm_pulldown,chest_supported_row,incline_machine_press,horizontal_leg_press,leg_press_calf_raise,inverted_row,resistance_band_row}.json` · `plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0], per card` [LR-31 step]
   - do: For each of the 8 cards: the fetcher scans every read source of the card (curl, desktop UA; PubMed by efetch) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Set the top fault (plate.mistake and handlingMistakes[0]) by LR-31's steps and tie order; drawable is false for a fault whose only sign is speed and true for a still sign even when speed causes it; write plate.mistake.rankNote: "No source measures how often each fault happens." plus the step, the claim ids, and each frequency or harm quote about a fault that a step set aside, with why. A tie that LR-31's order leaves open: record it in rankNote and stop the card for a supervisor ruling. Expected: every pick unchanged. leg_press_calf_raise: rankNote names c5's "there is a tendency to fully straighten the legs" as set aside (a tendency is not a frequency word); the 'often' in plate.mistake.what is dropped by item 60; the locked knees are tied to harm (c6) and are a still sign, so the pick and drawable:true stay. horizontal_leg_press keeps its locked-knees pick (a still sign). resistance_band_row: the worn-band item is an equipment check, not a candidate. inverted_row takes step 3's last fallback (no source names a fault: the break of the instruction the most read sources give, said so in plate.mistake.why). Report any change of pick or drawable in FIXED.
   - why: LR-31 (W2-51) rollout: the LB1 cards in W2 fix round 1, before the merged head is named for LIB-9a's Do 6 re-copy.

## Not to apply (superseded by a ruling; listed so the verify record is not applied twice)

- **W2-40** `cards/single_arm_lat_pulldown.json` `zooms[0].claim`: Superseded by W2-53/LR-34: the parent lat_pulldown card's grip.handContact says 'not re-sourced on this card', so inherit[0] is expected to fail; the zoom words are settled in the LR-34 check below. Do not apply.

# W2 fix packet: THE8

Fix exactly these and nothing else; then re-run your A1-A6 / validation, have your Sonnet fetcher check every new or changed quote, push once, and post FIXED with the sha.

- Head: `claude/libht-verify-w2` @ `5036283d1e69f617cc45d5b49689e9281f3d61f3` (your files are unchanged there since `e6381fa4`). Paths are under `docs/research/howto/`.
- Final rulings: `w2-rulings-final.md` (LR-30 to LR-35; all amended, none rejected). Items keep their numbers from the first packet; items the final rulings added follow them, under "Added by the final rulings".
- Reserved field routed to you by name: `cards/leg_press.json` `plate.mistake.drawable`, which the supervisor's fix round 0 set to false. Ruling LR-31 (W2-51) routes it back to you and sets it to true (item marked **[reserved, routed by LR-31]**). `plate.mistake` keys on the other 7 cards change only as listed (rankNote added; why/what/claim only where an item says so).
- **[LR-31 scan]** (ruling LR-31; judgement on claude-opus-5-5, fetching by your Sonnet fetcher): for each of the 8 cards, the fetcher scans every read source of the card (curl, desktop UA; PubMed by efetch, PMC by efetch db=pmc) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Quote each hit about a fault or injury in that card's `plate.mistake.rankNote`, with why it counts or not. Not frequency words (LR-31's closed list): a 'common mistakes' heading or a list sentence read onto one item; 'tend', 'tendency', 'traditionally', 'can', 'may', 'easy to', 'easily'; a statement about all training, another exercise, a muscle's activity, a load, a grip or a stance. The rankNote items below are the expected texts. If the scan changes a pick or drawable (items 20 and 87-90 included), report it in FIXED. No plate, tell, `plate.mistake.firstKey`, How-to or golden-B text changes (D-LIB5-CARDS8).
- Quotes-file inserts: apply by claim id and content, not by head index (indices shift after the first insert). Each new entry goes right after that claim's existing entries, in the order listed.
- Items marked **[fetcher]** add or change a quote: your Sonnet fetcher re-fetches each one by curl (desktop UA; PubMed by efetch, PMC by efetch db=pmc) before you push. Fill the `<YYYY-MM-DD>` and `<n>` placeholders in the the8.md Fix round 1 fetcher line from that run.
- Expected quotes-file totals after this packet (a dry run on scratch copies matched every card to its quotes file): barbell_back_squat 57, pull_up 37, hanging_leg_raise 37, lat_pulldown 41, seated_cable_row 34, leg_press 63, machine_chest_press 25, dumbbell_lateral_raise 21.

## `cards/barbell_back_squat.json`

1. **W2-16** · blocker · `cards/barbell_back_squat.json` · `tierA.wayOut.text`
   - old:
     ```json
     "Safeties just below your lowest depth, and a spotter for heavy sets when you can. To bail, push the bar backward off your shoulders while you move your body forward, so it falls onto the safeties. Practise with light weight first."
     ```
   - new:
     ```json
     "Safeties just below your lowest depth: if you can't finish the rep, lower the bar onto them. A spotter for heavy sets when you can, who can help if you struggle. On your own and must bail? Push the bar backward off your shoulders while you move your body forward, so it falls onto the safeties. Practise with light weight first."
     ```
   - why: Tier-A way out dropped c13's controlled step and left the backward dump unconditional (risk to a spotter behind).

2. **W2-16** · blocker · `cards/barbell_back_squat.json` · `claims[id=c14].text`
   - old:
     ```json
     "Have a spotter for heavy squats whenever possible."
     ```
   - new:
     ```json
     "Have a spotter for heavy squats whenever possible; a spotter can help if you struggle with the lift, reducing the need to bail."
     ```
   - why: Backs 'who can help if you struggle'.

3. **W2-16** · blocker · `cards/barbell_back_squat.json` · `claims[id=c14].quotes (append one)` [fetcher]
   - old:
     ```json
     [{"source": "rep-fail", "text": "Whenever possible, have a spotter when performing heavy squats.", "where": "The Importance of Spotters and Safeties"}]
     ```
   - new:
     ```json
     [{"source": "rep-fail", "text": "Whenever possible, have a spotter when performing heavy squats.", "where": "The Importance of Spotters and Safeties"}, {"source": "rep-fail", "text": "A spotter can assist in case you struggle with the lift, reducing the need to bail entirely.", "where": "The Importance of Spotters and Safeties"}]
     ```
   - why: Same.

4. **W2-16** · blocker · `cards/barbell_back_squat.json` · `claims[id=c15].text`
   - old:
     ```json
     "Way out: if you must bail a back squat, push the bar backward off the shoulders while moving the body forward so it falls onto the safety bars, and practise this with light weights first."
     ```
   - new:
     ```json
     "Way out: if you must bail a back squat on your own, without a spotter, push the bar backward off the shoulders while moving the body forward so it falls onto the safety bars, and practise this with light weights first."
     ```
   - why: Backs 'On your own and must bail?'.

5. **W2-16** · blocker · `cards/barbell_back_squat.json` · `claims[id=c15].quotes (append one)` [fetcher]
   - old:
     ```json
     [{"source": "rep-fail", "text": "If you must bail, push the bar backward off your shoulders while moving your body forward. This will let the bar fall onto the safety bars without hitting you. Practice this movement with lighter weights to get comfortable with the process.", "where": "How to Safely Bail from a Squat, 1. How to Bail a Back Squat"}]
     ```
   - new:
     ```json
     [{"source": "rep-fail", "text": "If you must bail, push the bar backward off your shoulders while moving your body forward. This will let the bar fall onto the safety bars without hitting you. Practice this movement with lighter weights to get comfortable with the process.", "where": "How to Safely Bail from a Squat, 1. How to Bail a Back Squat"}, {"source": "rep-fail", "text": "While the best course of action is always to have a spotter and use safety equipment, there are times when you might find yourself in a situation where you need to bail on your own.", "where": "Introduction, before The Importance of Spotters and Safeties"}]
     ```
   - why: Same. The source's non-breaking space in 'spotter and use' is written as a normal space.

6. **W2-16** · blocker · `cards/barbell_back_squat.json` · `sources[id=rep-fail].checked (sources[3])`
   - old:
     ```json
     "2026-10-17"
     ```
   - new:
     ```json
     "2026-10-18"
     ```
   - why: Re-read 2026-10-18.

7. **W2-16** · blocker · `cards/barbell_back_squat.json` · `notes (append)`
   - old: (none; append this entry at the end of the array (head has 6 entries))
   - new:
     ```json
     "2026-10-18 (W2-16): the tier-A way out now follows rep-fail's order. Lower the bar onto the safeties when you can't finish (c13). A spotter can help if you struggle (c14). The backward bail is for when you must bail on your own (c15; the source's intro sets bailing apart from having a spotter). No source read says where a back-squat spotter stands."
     ```
   - why: Record.

8. **W2-19** · medium · `cards/barbell_back_squat.json` · `risks[2].risk`
   - old:
     ```json
     "Holding your breath under heavy load raises blood pressure; whether that harms healthy lifters is not confirmed."
     ```
   - new:
     ```json
     "Holding your breath under heavy load raises blood pressure."
     ```
   - why: 'healthy lifters' scope is unsourced (Hackett names no group); dropping the hedge keeps the sourced fact (c18).

9. **W2-19** · medium · `cards/barbell_back_squat.json` · `gaps (append)`
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     "Tier A breathing (content.md 5.2, 2026-10-18): no source read supports the squat's approved \"High blood pressure? Don't hold your breath long.\" pattern. Hackett 2013 (abstract) says only that lifters are often advised to avoid the breath-hold because of possible vascular events, and that its health risks remain unconfirmed; it names no condition and no time limit, and the NSCA summary gives no limit. Left out, not invented; risks[2] states only the sourced rise in blood pressure (c18), and the unsourced 'healthy lifters' scope was dropped."
     ```
   - why: Tier-A gap was not recorded (LR-3 owner gap list).

10. **W2-20** · low · `cards/barbell_back_squat.json` · `claims[id=c26].text`
   - old:
     ```json
     "Tempo: no source read gives seconds for a novice back squat. The position stand gives 1-2 s up and 1-2 s down for intermediate to advanced heavy strength training (LR-15), and in a lab study one 8-RM parallel back-squat rep took about 3.3 to 3.6 s in all. The plate's 2 s down and 2 s up is a drawing convention taken from the top of the 1-2 s range, not a novice recommendation."
     ```
   - new:
     ```json
     "Tempo: no source read gives seconds for a novice back squat. The position stand gives 1-2 s up and 1-2 s down for intermediate to advanced heavy strength training (LR-15). A lab study of 8-RM parallel back squats compared reps with and without a weight-belt: reps with the belt were generally faster, especially the later reps (3.34 vs 3.56 s); it is a belt comparison, not a tempo source. The plate's 2 s down and 2 s up is a drawing convention taken from the top of the 1-2 s range, not a novice recommendation."
     ```
   - why: Lander's 3.34/3.56 s are with-belt vs no-belt times, not a rep-time range.

11. **W2-20** · low · `cards/barbell_back_squat.json` · `notes[1]`
   - old:
     ```json
     "Tempo (fact 2): c26 is a drawing convention under LR-15 (WEAK). The measured 8-RM rep took about 3.3 to 3.6 s in all (c26), shorter than the 4 s the plate draws; open question for the supervisor."
     ```
   - new:
     ```json
     "Tempo (fact 2): c26 is a named drawing convention under LR-15 and D-W2-TEMPO (WEAK). Lander's 3.34 and 3.56 s (c26) are the with-belt and no-belt rep times of 5 lifters at their 8-RM, the gap widest in the later reps; they compare belts and do not set or test the plate's 2 s down, 2 s up."
     ```
   - why: Same.

12. **W2-28** · low · `cards/barbell_back_squat.json` · `claims[id=c7].quotes (append as quotes[2])` [fetcher]
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     {"source": "bloomquist2013", "text": "Male students (n = 17) were randomly assigned to 12 weeks of progressive squat training (repetition matched, repetition maximum sets)", "where": "abstract"}
     ```
   - why: Population and duration stated in c7 but unquoted.

13. **W2-28** · low · `cards/barbell_back_squat.json` · `claims[id=c12].quotes (append quotes[2], quotes[3])` [fetcher]
   - old: (none; append these entries, in order at the end of the array (head has 2 entries))
   - new:
     ```json
     [{"source": "fry2003", "text": "Seven weight-trained men (mean +/- SD; age = 27.9 +/- 5.2 years) were videotaped while performing 2 variations of parallel barbell squats (barbell load = body weight).", "where": "abstract"}, {"source": "fry2003", "text": "For the unrestricted squat, knee torque (N.m; mean +/- SD) = 150.1 +/- 50.8 and hip torque = 28.2 +/- 65.0. For the restricted squat, knee torque = 117.3 +/- 34.2 and hip torque = 302.7 +/- 71.2.", "where": "abstract"}]
     ```
   - why: Population and hip torques stated in c12 but unquoted.

14. **W2-28** · low · `cards/barbell_back_squat.json` · `claims[id=c26].quotes[1].text` [fetcher]
   - old:
     ```json
     "at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)."
     ```
   - new:
     ```json
     "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)."
     ```
   - why: ACSM 'heavy loading' stated in c26 but quoted only in part.

15. **W2-28** · low · `cards/barbell_back_squat.json` · `claims[id=c26].quotes (append as quotes[3])` [fetcher]
   - old: (none; append this entry at the end of the array (head has 3 entries))
   - new:
     ```json
     {"source": "lander1992", "text": "multiple repetitions of the parallel back squat exercise. Five subjects were filmed (50 fps) as they performed eight consecutive trials at each of two weight-belt conditions [with belt = WB, without belt = WOB] in random order at their eight-repetition maximum effort.", "where": "abstract"}
     ```
   - why: Lander's 8-RM parallel back squat and belt conditions (backs the W2-20 text).

16. **W2-30** · low · `cards/barbell_back_squat.json` · `claims[id=c23].text`
   - old:
     ```json
     "In the squat the hands only stop the bar rolling down the back; the back should carry the load. A coach source (written for the low-bar squat) links supporting the bar with the hands, wrists or elbows to inner-elbow tendinitis."
     ```
   - new:
     ```json
     "In the squat the hands only stop the bar rolling down the back; the back should carry the load. A coach source (written for the low-bar squat) links supporting the bar with the hands, wrists or elbows to inner-elbow tendinitis, and says that when the back bears the load there is less chance of wrist, shoulder or elbow pain."
     ```
   - why: The wrist half of feel row 4 had no quote in the card.

17. **W2-30** · low · `cards/barbell_back_squat.json` · `claims[id=c23].quotes (append as quotes[2])` [fetcher]
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     {"source": "barbell-logic-squat-grip", "text": "If the back bears the load of the bar, there’s less chance of developing wrist, shoulder or elbow pain from squatting.", "where": "article text"}
     ```
   - why: Same; keep the curly apostrophe in 'there’s'.

18. **W2-30** · low · `cards/barbell_back_squat.json` · `feel.rows[3].claim`
   - old:
     ```json
     ["c23", "c24"]
     ```
   - new:
     ```json
     "c23"
     ```
   - why: c24 is a different wrist fault (wrapped thumbs) that the sources dispute.

19. **W2-30** · low · `cards/barbell_back_squat.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "2026-10-18 (W2-30): feel row 4 (wrists or the inside of the elbows) is backed by c23 alone. c23 now carries the barbell-logic page's closing line, 'If the back bears the load of the bar, there’s less chance of developing wrist, shoulder or elbow pain from squatting.', re-read word for word by curl on 2026-10-18. c24 (wrapped thumbs overextending the wrist) is a different wrist fault and the sources disagree on it (grip.thumb), so it stays in grip only and is not cited on the row."
     ```
   - why: Record.

20. **W2-51** · ruling · `cards/barbell_back_squat.json` · `plate.mistake.rankNote (add after drawable)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 2: no frequency word for a squat fault (c25's \"most common\" is weights dropping on lifters across all training, not a technique fault). Back rounding (c10) and holding the bar up with the hands (c23) each have one harm source; back rounding is sourced for this lift directly, c23 is applied from the low-bar squat (MECH)."
     ```
   - why: LR-31: every plate.mistake records its rank step.

## `quotes/barbell_back_squat.json`

21. **W2-16** · blocker · `quotes/barbell_back_squat.json` · `quotes: insert after the last c14 entry (head quotes[23])` [fetcher]
   - old: (none; insert right after the last `c14` entry, head index 23)
   - new:
     ```json
     [{"claim": "c14", "source": "rep-fail", "quote": "A spotter can assist in case you struggle with the lift, reducing the need to bail entirely.", "status": "verbatim", "closest": null}]
     ```
   - why: Quotes file matches the card.

22. **W2-16** · blocker · `quotes/barbell_back_squat.json` · `quotes: insert after the last c15 entry (head quotes[24])` [fetcher]
   - old: (none; insert right after the last `c15` entry, head index 24)
   - new:
     ```json
     [{"claim": "c15", "source": "rep-fail", "quote": "While the best course of action is always to have a spotter and use safety equipment, there are times when you might find yourself in a situation where you need to bail on your own.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

23. **W2-28** · low · `quotes/barbell_back_squat.json` · `quotes: insert after the last c7 entry (head quotes[11])` [fetcher]
   - old: (none; insert right after the last `c7` entry, head index 11)
   - new:
     ```json
     [{"claim": "c7", "source": "bloomquist2013", "quote": "Male students (n = 17) were randomly assigned to 12 weeks of progressive squat training (repetition matched, repetition maximum sets)", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

24. **W2-28** · low · `quotes/barbell_back_squat.json` · `quotes: insert after the last c12 entry (head quotes[20]), population first` [fetcher]
   - old: (none; insert right after the last `c12` entry, head index 20)
   - new:
     ```json
     [{"claim": "c12", "source": "fry2003", "quote": "Seven weight-trained men (mean +/- SD; age = 27.9 +/- 5.2 years) were videotaped while performing 2 variations of parallel barbell squats (barbell load = body weight).", "status": "verbatim", "closest": null}, {"claim": "c12", "source": "fry2003", "quote": "For the unrestricted squat, knee torque (N.m; mean +/- SD) = 150.1 +/- 50.8 and hip torque = 28.2 +/- 65.0. For the restricted squat, knee torque = 117.3 +/- 34.2 and hip torque = 302.7 +/- 71.2.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

25. **W2-28** · low · `quotes/barbell_back_squat.json` · `quotes[48].quote (head index; c26 entry for card quote 1)` [fetcher]
   - old:
     ```json
     "at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)."
     ```
   - new:
     ```json
     "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)."
     ```
   - why: Same.

26. **W2-28** · low · `quotes/barbell_back_squat.json` · `quotes: insert after the last c26 entry (head quotes[49])` [fetcher]
   - old: (none; insert right after the last `c26` entry, head index 49)
   - new:
     ```json
     [{"claim": "c26", "source": "lander1992", "quote": "multiple repetitions of the parallel back squat exercise. Five subjects were filmed (50 fps) as they performed eight consecutive trials at each of two weight-belt conditions [with belt = WB, without belt = WOB] in random order at their eight-repetition maximum effort.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

27. **W2-30** · low · `quotes/barbell_back_squat.json` · `quotes: insert after the last c23 entry (head quotes[42])` [fetcher]
   - old: (none; insert right after the last `c23` entry, head index 42)
   - new:
     ```json
     [{"claim": "c23", "source": "barbell-logic-squat-grip", "quote": "If the back bears the load of the bar, there’s less chance of developing wrist, shoulder or elbow pain from squatting.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

## `verify/the8.md`

28. **W2-20** · low · `verify/the8.md` · `line 78 (Barbell back squat, Fact 2, second bullet)`
   - old (exact text, occurs once):
     ```text
       - Lander measured one 8-RM rep at 3.34-3.56 s in total.
     ```
   - new:
     ```text
       - Lander (5 lifters, 8-RM sets): reps with a belt were generally faster than without, especially the later reps (3.34 vs 3.56 s). A belt comparison, not a tempo source.
     ```
   - why: Same.

29. **W2-20** · low · `verify/the8.md` · `line 215 (Open questions, item 1, Squat sub-bullet)`
   - old (exact text, occurs once):
     ```text
        - Squat: the plate draws 4 s per rep, but the measured 8-RM rep took about 3.5 s. Keep 2/2, or use 2 down and 1-2 up?
     ```
   - new:
     ```text
        - Squat: answered by LR-15 and D-W2-TEMPO. The plate's 2 s down and 2 s up stays a named drawing convention tagged WEAK (c26). Lander's 3.34 vs 3.56 s are with-belt vs no-belt rep times (especially the later reps of 8-RM sets), not a tempo source, so they do not bear on 2/2.
     ```
   - why: Same.

30. **W2-18** · medium · `verify/the8.md` · `line 126 (hanging_leg_raise, Fact 1, c4 bullet)`
   - old (exact text, occurs once):
     ```text
       - c4, tagged MECH and WEAK: Yessis says hip flexion reaches its maximum at "approximately 30-45 degrees from the vertical". He doesn't say whether he means the thigh or the hip angle, so the words are kept and not converted.
     ```
   - new:
     ```text
       - c4, tagged MECH and WEAK: Yessis says hip flexion reaches its maximum at "approximately 30-45 degrees from the vertical", and that the abs begin to shorten when "the thighs reach" that angle. He doesn't say whether the vertical is the hanging line or straight up, so the words are kept, not converted and not drawn; plate.end draws only toes to the bar and the posterior tilt (c3, c8) (2026-10-18).
     ```
   - why: Same.

31. **W2-21** · medium · `verify/the8.md` · `line 135 (hanging_leg_raise, Tier A gaps list): add a bullet after it`
   - old (exact text, occurs once):
     ```text
       - The back row links the pending back box (LR-23, LR-26).
     ```
   - new:
     ```text
       - The back row links the pending back box (LR-23, LR-26).
       - No source says to move the stool clear of the legs; golden-B's box-clearance line is not shown and is listed in the card's gaps (LR-3, LIB-WAYOUT; 2026-10-18).
     ```
   - why: Same.

32. **W2-23** · medium · `verify/the8.md` · `### lat_pulldown > Fact 3 bullet (line 154)`
   - old (exact text, occurs once):
     ```text
       - c11: less lat activity.
     ```
   - new:
     ```text
       - c11: lat activity is mixed (DATA, WEAK): Signorile less behind the neck; Padovan less only while the bar comes down, more on the way up; Sperandei no lat difference (W2-23, 2026-10-18).
     ```
   - why: Same.

33. **W2-37** · low · `verify/the8.md` · `seated_cable_row > Read (lines 162-163)`
   - old (exact text, occurs once):
     ```text
       - full: unmc-cable-row (the anchor), nsca-low-row, ace-seated-row (a chest-pad machine row, so its claims are tagged MECH), baechle-earle, deabreu2023;
       - abstracts: acsm2009, lehman2004, dosanjos2024, callaghan2001;
     ```
   - new:
     ```text
       - full: unmc-cable-row (the anchor), nsca-low-row, ace-seated-row (a chest-pad machine row, so its claims are tagged MECH), baechle-earle;
       - abstracts: acsm2009, lehman2004, dosanjos2024, callaghan2001, deabreu2023 (journal page abstract);
     ```
   - why: Same.

34. **W2-51+W2-52+W2-28** · ruling · `verify/the8.md` · `append a section at the end, after 'Fix round 0'` [merged]
   - old: (none; append at the end of the file)
   - new:
     ```text
     ## Fix round 1 (supervisor rulings LR-31, LR-33, 2026-10-18)
     - Top fault (LR-31): every plate.mistake carries a rankNote naming the step used. Picks are unchanged under LR-31 as ruled, each re-run with a scan of every read source. leg_press: Yessis's "commonly" (c7) decides under step 1, so `drawable` is true again, and its why and rankNote are rewritten; the knee cave stays in handlingMistakes (c10).
     - Pause (LR-33): ACE's "pause momentarily" is a 1 s drawing convention on the four cards that quote it. machine_chest_press pause null -> 1; leg_press pause 0 -> 1 (top pause); new tempo claims leg_press c25 and machine_chest_press c16 [CONSENSUS, WEAK] name the 1 s, each a copy of the verified ACE quote in c24 and c7; seated_cable_row's text names the 1 s; lat_pulldown unchanged.
     - LR-31 added or changed no quote; LR-33's c16 and c25 copy verified ACE quotes (c7, c24).
     - 2026-10-18 (W2-28): quotes added for details the claim texts already stated: populations (leg_press c6, c14, c17, c19; barbell_back_squat c7, c12; pull_up c6; hanging_leg_raise c12), durations and loads (leg_press c6, c14, c17; barbell_back_squat c7), Fry's hip torques (barbell_back_squat c12), Lander's 8-RM parallel back squat and ACSM's heavy loading (barbell_back_squat c26), Coratella's seated and metronome protocol (dumbbell_lateral_raise c9), and Muyor's metronome (machine_chest_press c9). leg_press c16 now says NASM lists the quadriceps and glutes as primary muscles, quoting its Primary and Secondary Muscles lists; that quote now supports the libraryDiff adductor reason. All new quotes were re-read on 2026-10-18 by efetch (PubMed and PMC) and curl (NASM). They are verbatim and at most 50 words.
     - Fetcher, fix round 1 (checked <YYYY-MM-DD>): every new or changed quote re-fetched, <n> of <n> verbatim. Quotes-file totals after this round: barbell_back_squat 57 (W2-16 +2, W2-28 +4 and 1 changed, W2-30 +1); pull_up 37; hanging_leg_raise 37; lat_pulldown 41 (W2-23: 1 changed, 1 added); seated_cable_row 34 (W2-37 c19; 19 claims); leg_press 63 (W2-28: 5 added, 2 changed; LR-33: c25 added); machine_chest_press 25; dumbbell_lateral_raise 21. The 2026-10-17 table above stays the record of that run.
     ```
   - why: Merged: W2-51's section, with its 'No quote was added or changed.' line scoped to the two rulings (this round adds quotes via W2-16/23/28/30/37 and LR-33's c16 and c25), plus W2-28's note and a fetcher line that replaces W2-30's table edit. Final LR-31 and LR-33 wording.

## `cards/pull_up.json`

35. **W2-17** · medium · `cards/pull_up.json` · `plate.end`
   - old:
     ```json
     "Chin above the bar (c5); elbows bent through the measured range, a mean of 93.4 ± 14.6 degrees from the full hang in a lab sample (c6); upper back extended, shoulder blades squeezed back and down (c5, c23); head level, no reaching with the chin (c7)."
     ```
   - new:
     ```json
     "Chin above the bar (c5); upper back extended, shoulder blades squeezed back and down (c5, c23); head level, no reaching with the chin (c7)."
     ```
   - why: Youdas gives a range, not a pose; 'from the full hang' is unsourced (D-LIB9-FACTPOSE).

36. **W2-17** · medium · `cards/pull_up.json` · `notes[0]`
   - old:
     ```json
     "Elbow positions: the start (elbows completely extended) and the top (chin above the bar) are coach words (c4, c5). The only number is Youdas 2010: the mean elbow range of motion, 93.4 ± 14.6 degrees (c6). No source gives the elbow angle at the top; the plate draws the range, not a sourced top angle."
     ```
   - new:
     ```json
     "Elbow positions: the start (elbows completely extended) and the top (chin above the bar) are coach words (c4, c5). The only number is Youdas 2010: the mean elbow range of motion, 93.4 ± 14.6 degrees (c6). It is a range, not a pose: the abstract gives no start or end angle and does not say the range starts from a full hang, so the plate does not use it. No source gives the elbow angle at the top. The plate draws the top from c5, c23 and c7 (chin above the bar, upper back extended, head level), and the elbow bend that puts the chin there is a drawing convention, not a sourced angle."
     ```
   - why: Same.

37. **W2-22** · medium · `cards/pull_up.json` · `feel.rows[1].fix`
   - old:
     ```json
     "Bring your hands in to just outside shoulder width. If the pain persists, do not train through it."
     ```
   - new:
     ```json
     "Bring your hands in to just outside shoulder width. Don't train through the pain."
     ```
   - why: LR-28: 'persists' has no sourced time; time sits in the linked box.

38. **W2-22** · medium · `cards/pull_up.json` · `feel.rows[2].fix`
   - old:
     ```json
     "Build up gradually. If the pain persists, do not train through it."
     ```
   - new:
     ```json
     "Build up gradually. Don't train through the pain."
     ```
   - why: Same.

39. **W2-28** · low · `cards/pull_up.json` · `claims[id=c6].quotes (append as quotes[1])` [fetcher]
   - old: (none; append this entry at the end of the array (head has 1 entries))
   - new:
     ```json
     {"source": "youdas2010", "text": "Twenty-one men (24.9 ± 2.4 years) and 4 women (23.5 ± 1 years) volunteered to participate.", "where": "abstract"}
     ```
   - why: Population stated in c6 but unquoted.

40. **W2-29** · low · `cards/pull_up.json` · `plate.mistake.what`
   - old:
     ```json
     "Kipping: the body swings and the legs kick to throw the chin over the bar."
     ```
   - new:
     ```json
     "Kipping: the body swings, using momentum to get the chin over the bar."
     ```
   - why: No pull_up claim says the legs kick (CARD-V2: every word from its claims).

41. **W2-29** · low · `cards/pull_up.json` · `handlingMistakes[0].mistake`
   - old:
     ```json
     "Kipping: swinging and kicking to get the chin over the bar."
     ```
   - new:
     ```json
     "Kipping: swinging and using momentum to get the chin over the bar."
     ```
   - why: Same, shown line.

42. **W2-29** · low · `cards/pull_up.json` · `zooms[3].wrong (key 'body line')`
   - old:
     ```json
     "Body swinging, legs kicking (kipping)."
     ```
   - new:
     ```json
     "Body swinging (kipping)."
     ```
   - why: Same, shown line.

43. **W2-32** · low · `cards/pull_up.json` · `plate.start`
   - old:
     ```json
     "Full hang: elbows completely extended, shoulders fully open (c4, c1); palms facing forward, hands just outside shoulder width (c1); body braced and slightly hollow, not swinging (c9); shoulder blades set down and back before the arms bend (c8)."
     ```
   - new:
     ```json
     "Full hang: elbows completely extended, shoulders fully open (c4, c1); palms facing forward, hands just outside shoulder width (c1); body braced and slightly hollow, not swinging (c9)."
     ```
   - why: c8 is the first move of the pull, not the start pose (D-LIB9-FACTPOSE).

44. **W2-33** · low · `cards/pull_up.json` · `claims[id=c17].text`
   - old:
     ```json
     "The wide-grip pull-up showed less shoulder-blade movement with the arm at 90 degrees out to the side and 45 degrees turned out; the authors link wide (and reverse) pull-ups to higher impingement risk."
     ```
   - new:
     ```json
     "The wide-grip pull-up showed a smaller range of shoulder-blade protraction and retraction (sliding forward and back), and the arm also reached 90 degrees out to the side with 45 degrees turned out; the authors link wide (and reverse) pull-ups to higher impingement risk."
     ```
   - why: Prinold full text treats the two findings separately; the claim joined them.

45. **W2-22** · medium · `cards/pull_up.json` · `notes (append)`
   - old: (none; append this entry at the end of the array (head has 5 entries))
   - new:
     ```json
     "2026-10-18 (W2-22): The shoulder and elbow feel fixes drop 'If the pain persists'. NASM (c20) gives no time for 'persists', so the row gives none (LR-28, D-LR23-9). The research-based time comes from the linked shoulder and elbow boxes. 'Don't train through the pain' is from c20 ('rather than training through it'). 'Stop the set' is not added because no pull_up source says to stop (LR-6)."
     ```
   - why: Record.

46. **W2-32** · low · `cards/pull_up.json` · `notes (append, after the W2-22 note)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "Start pose (D-LIB9-FACTPOSE, W2-32, 2026-10-18): the plate draws the open full hang as the start, elbows completely extended and shoulders fully open (c1, c4; c4's quote returns to 'fully open again' at the bottom, and catalyst-pullup's Notes, re-read 2026-10-18, ask that each rep start from a genuinely open shoulder position). Setting the shoulder blades down and back (c8) is the first move of the pull, 'before the arms take over', so it is drawn as the first phase, shown by the 'Shoulders set' checkpoint and the shoulders zoom, not as part of the start pose."
     ```
   - why: Record.

47. **W2-33** · low · `cards/pull_up.json` · `notes (append, after the W2-32 note)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "2026-10-18 (W2-33): c17's abstract sentence is ambiguous. The full text (PMC4916995, Discussion and Conclusion) treats the two wide-grip findings separately: \"a reduced range of ScT pro/retraction with a similar range of HT plane of elevation, and the achievement of 90° of arm abduction with 45° external rotation\". prinold2016 access stays \"abstract\" unless the full text is cited as a quote."
     ```
   - why: Record of why c17 now separates the two findings.

48. **W2-51** · ruling · `cards/pull_up.json` · `plate.mistake.rankNote (add after drawable)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 3: no frequency word for a pull-up fault (Catalyst's \"natural tendency\" to round the back near the bar, c23, is not one under LR-31), and no quote ties one of NASM's listed faults to harm. Kipping and momentum come first in NASM's common-faults list (c10); NASM's \"Discourage the common faults\" is a list sentence, not a ranking."
     ```
   - why: LR-31.

## `quotes/pull_up.json`

49. **W2-28** · low · `quotes/pull_up.json` · `quotes: insert after the last c6 entry (head quotes[6])` [fetcher]
   - old: (none; insert right after the last `c6` entry, head index 6)
   - new:
     ```json
     [{"claim": "c6", "source": "youdas2010", "quote": "Twenty-one men (24.9 ± 2.4 years) and 4 women (23.5 ± 1 years) volunteered to participate.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

## `cards/hanging_leg_raise.json`

50. **W2-18** · medium · `cards/hanging_leg_raise.json` · `plate.end`
   - old:
     ```json
     "Straight legs raised until the toes reach the bar, pelvis curled up by the abs as in a crunch (c3); pelvis in posterior tilt, not hyperextended (c8). Expert opinion (WEAK): hip flexion itself stops at approximately 30-45 degrees from the vertical, and the rest of the rise is the pelvis rotating backward with the leg-hip angle unchanged (c4)."
     ```
   - new:
     ```json
     "Straight legs raised until the toes reach the bar, pelvis curled up by the abs as in a crunch (c3); pelvis in posterior tilt, not hyperextended (c8). No end hip angle is drawn: Yessis's approximately 30-45 degrees (c4) is where hip flexion stops while the legs keep rising, and the page does not say which vertical it is measured from (notes[0])."
     ```
   - why: The 30-45 degree point is mid-rise and its vertical is unstated; an end-pose number nobody can use without guessing.

51. **W2-18** · medium · `cards/hanging_leg_raise.json` · `notes[0]`
   - old:
     ```json
     "Hip angle: no source gives a start angle (c2: full hang). The end is coach words, toes to the bar (c3). The only numbers are Yessis expert opinion, approximately 30-45 degrees from the vertical where hip flexion stops and the pelvis takes over (c4); the page does not say whether it means the thigh or the hip angle, so the words are kept and not converted."
     ```
   - new:
     ```json
     "Hip angle: no source gives a start angle (c2: full hang). The end is coach words, toes to the bar (c3). The only numbers are Yessis expert opinion, approximately 30-45 degrees from the vertical where hip flexion stops and the pelvis takes over (c4). The Training Tips sentence names the thighs (\"until the thighs reach approximately the 30-45 degree angle from the vertical\"), but the page has no figure and does not say whether that vertical is the hanging line or straight up, so the words are kept, not converted and not drawn; plate.end draws only toes to the bar and the posterior tilt (c3, c8). Corrected 2026-10-18: the earlier note said the page does not name the thigh."
     ```
   - why: c4's own third quote names the thighs.

52. **W2-21** · medium · `cards/hanging_leg_raise.json` · `gaps (append as gaps[3])`
   - old: (none; append this entry at the end of the array (head has 3 entries))
   - new:
     ```json
     "Tier A: no source says to move the stool clear of the legs once hanging (golden-B's box-clearance setup line, dropped as unsourced); not shown, not invented (LR-3, LIB-WAYOUT). Added 2026-10-18."
     ```
   - why: An approved safety line left the sheet without an owner-sheet gap (LR-3, LR-20).

53. **W2-28** · low · `cards/hanging_leg_raise.json` · `claims[id=c12].quotes (append as quotes[2])` [fetcher]
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     {"source": "mcgill2015", "text": "Fourteen males performed the exercises while muscle activity, external force and 3D body segment motion were recorded. A sophisticated and anatomically detailed 3D model used muscle activity and body segment kinematics to estimate muscle force", "where": "abstract"}
     ```
   - why: Population and 3D model stated in c12 but unquoted.

54. **W2-29** · low · `cards/hanging_leg_raise.json` · `plate.mistake.why`
   - old:
     ```json
     "All three technique sources forbid swinging (c6, c9), and the hanging raise is described as potentially the easiest leg raise to cheat with a swing (c7). How often it happens is not measured."
     ```
   - new:
     ```json
     "Yessis and StrengthLog say not to swing (c6), and Catalyst says to lift without swinging and, on a pull-up bar, to control the speed to minimise swinging (c3, c9). The hanging raise is described as potentially the easiest leg raise to cheat with a swing (c7). How often it happens is not measured."
     ```
   - why: It cited c9, which was not in its claim list; Catalyst's ban is in c3.

55. **W2-29** · low · `cards/hanging_leg_raise.json` · `plate.mistake.claim`
   - old:
     ```json
     ["c7", "c6"]
     ```
   - new:
     ```json
     ["c7", "c6", "c3", "c9"]
     ```
   - why: Same.

56. **W2-38** · low · `cards/hanging_leg_raise.json` · `feel.rows[0].means`
   - old:
     ```json
     "Expected: the straight-leg hanging raise challenged the abs most of the exercises tested."
     ```
   - new:
     ```json
     "Expected: this raise works the abs very hard."
     ```
   - why: Study test-set wording on a shown line (LR-27).

57. **W2-51** · ruling · `cards/hanging_leg_raise.json` · `plate.mistake.rankNote (add after drawable)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 3: no frequency word (Wikipedia's \"easiest to use bad form on\" and \"may use a swinging motion\", c7, say what can happen, not how often), no common-mistakes list, and no quote ties a named fault to harm. Swinging is the fault the most read sources warn against (Yessis and StrengthLog c6, Catalyst c9, Wikipedia c7)."
     ```
   - why: LR-31.

## `quotes/hanging_leg_raise.json`

58. **W2-28** · low · `quotes/hanging_leg_raise.json` · `quotes: insert after the last c12 entry (head quotes[25])` [fetcher]
   - old: (none; insert right after the last `c12` entry, head index 25)
   - new:
     ```json
     [{"claim": "c12", "source": "mcgill2015", "quote": "Fourteen males performed the exercises while muscle activity, external force and 3D body segment motion were recorded. A sophisticated and anatomically detailed 3D model used muscle activity and body segment kinematics to estimate muscle force", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

## `cards/lat_pulldown.json`

59. **W2-23** · medium · `cards/lat_pulldown.json` · `claims[id=c11].text`
   - old:
     ```json
     "Pulling in front of the face gave more lat activity than behind the neck in two EMG studies."
     ```
   - new:
     ```json
     "EMG studies of lat activity, pulling in front versus behind the neck, are mixed: one found more lat activity pulling in front, one found more in front only while the bar comes down and more behind the neck on the way back up, and one found no lat difference."
     ```
   - why: Padovan backs it only on the way down; Sperandei (on this card) found no lat difference.

60. **W2-23** · medium · `cards/lat_pulldown.json` · `claims[id=c11].tags`
   - old:
     ```json
     ["DATA"]
     ```
   - new:
     ```json
     ["DATA", "WEAK"]
     ```
   - why: Same.

61. **W2-23** · medium · `cards/lat_pulldown.json` · `claims[id=c11].sources`
   - old:
     ```json
     ["signorile2002", "padovan2024"]
     ```
   - new:
     ```json
     ["signorile2002", "padovan2024", "sperandei2009"]
     ```
   - why: Same.

62. **W2-23** · medium · `cards/lat_pulldown.json` · `claims[id=c11].quotes` [fetcher]
   - old:
     ```json
     [{"source": "signorile2002", "text": "performance of the lat pull-down exercise using the WGA hand position produces greater muscle activity in the LD than any other hand position during both the concentric or eccentric phases of the movement.", "where": "abstract"}, {"source": "padovan2024", "text": "The front-LPD appears to provide overall greater excitation in the prime movers.", "where": "abstract"}]
     ```
   - new:
     ```json
     [{"source": "signorile2002", "text": "performance of the lat pull-down exercise using the WGA hand position produces greater muscle activity in the LD than any other hand position during both the concentric or eccentric phases of the movement.", "where": "abstract"}, {"source": "padovan2024", "text": "During the descending phase, the front-LPD showed superior excitation of the latissimus dorsi (ES = 0.97) and the pectoralis major (ES = 1.17), while in the ascending phase, the back-LPD exhibited superior excitation of the latissimus dorsi (ES = 0.63)", "where": "abstract"}, {"source": "sperandei2009", "text": "For LD, there was no difference between techniques.", "where": "abstract"}]
     ```
   - why: Same.

63. **W2-23** · medium · `cards/lat_pulldown.json` · `plate.mistake.why`
   - old:
     ```json
     "NSCA technique text lists it among the common errors (frequency not measured); Sperandei 2009 concludes it should be avoided, Signorile 2002 and Padovan 2024 found less lat activity than pulling in front, and Kolber 2013 links behind-the-neck pulldowns to signs of anterior shoulder instability (association only)."
     ```
   - new:
     ```json
     "NSCA technique text lists it among the common errors (frequency not measured); Sperandei 2009 concludes it should be avoided, though it found no lat difference; Signorile 2002 found less lat activity than pulling in front; Padovan 2024 found less lat activity only while the bar comes down and more on the way back up; and Kolber 2013 links behind-the-neck pulldowns to signs of anterior shoulder instability (association only)."
     ```
   - why: Same.

64. **W2-23** · medium · `cards/lat_pulldown.json` · `notes[1]`
   - old:
     ```json
     "plate.mistake choice: the NSCA common-errors list names four faults with no ranking (open grip, trunk flexion to assist, not fully extending, behind the neck). Behind the neck is drawn because it is visible from the side and is the only one with study backing for risk (c9, c10, c11). How often any of them happens is not measured."
     ```
   - new:
     ```json
     "plate.mistake choice: the NSCA common-errors list names four faults with no ranking (open grip, trunk flexion to assist, not fully extending, behind the neck). Behind the neck is drawn because it is visible from the side and is the only one with study backing (c9, c10; the lat data in c11 is mixed, 2026-10-18). How often any of them happens is not measured."
     ```
   - why: Same.

65. **W2-34** · low · `cards/lat_pulldown.json` · `feel.secondary`
   - old:
     ```json
     [{"muscleId": "mid_back", "claim": ["c17", "c19"]}, {"muscleId": "biceps", "claim": ["c18", "c19"]}]
     ```
   - new:
     ```json
     [{"muscleId": "mid_back", "claim": ["c17", "c19"]}, {"muscleId": "biceps", "claim": ["c18", "c19"]}, {"muscleId": "rear_delts", "claim": ["c17", "c23"]}]
     ```
   - why: The 'helper' reason for watch-only has no source; NSCA lists the posterior deltoid as trained (c17).

66. **W2-34** · low · `cards/lat_pulldown.json` · `feel.watch`
   - old:
     ```json
     [{"muscleId": "rear_delts", "claim": ["c17", "c23"]}]
     ```
   - new:
     ```json
     []
     ```
   - why: Same.

67. **W2-34** · low · `cards/lat_pulldown.json` · `libraryDiff.add`
   - old:
     ```json
     []
     ```
   - new:
     ```json
     [{"muscleId": "rear_delts", "role": "secondary", "why": "Listed as trained with the lats, teres major and rhomboids (c17), and rear-deltoid activity was higher with the 30 degree lean (c23)."}]
     ```
   - why: Proposal only; library changes stay a supervisor batch decision.

68. **W2-34** · low · `cards/lat_pulldown.json` · `libraryDiff.why`
   - old:
     ```json
     "lats primary stands (c17, c19). mid_back secondary stands: middle trapezius is measured active (c19) and rhomboids are listed as trained (c17). biceps secondary stands: measured (c19) and the elbow flexors take part (c18). rear_delts is listed as trained (c17) and rises with the 30 degree lean (c23), but is kept as watch only, not added to the library list, because lat-focused texts treat it as a helper."
     ```
   - new:
     ```json
     "lats primary stands (c17, c19). mid_back secondary stands: middle trapezius is measured active (c19) and rhomboids are listed as trained (c17). biceps secondary stands: measured (c19) and the elbow flexors take part (c18). rear_delts secondary added: the rear deltoid is listed as trained (c17) and its activity was higher with the 30 degree lean (c23); the library list has no rear_delts."
     ```
   - why: Same.

69. **W2-34** · low · `cards/lat_pulldown.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "2026-10-18: rear_delts moved from watch to secondary. The earlier 'helper' reason had no source. NSCA lists the posterior deltoid among the primary muscles trained (c17). No source on the card ranks it against the lats, so secondary follows the card's mapping of the rhomboids from the same list (mid_back secondary) and the seated_cable_row card."
     ```
   - why: Record.

70. **W2-51** · ruling · `cards/lat_pulldown.json` · `plate.mistake.rankNote (add after drawable)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 1 has no candidate: Snyder's \"often rely on the elbow flexors\" (c18) is muscle use, which stays a feel row. LR-31 step 2: behind the neck is on the NSCA common-errors list and a study ties it to signs of front-shoulder instability (c9, c10). The past-end pull also has stated harm (c7) but is on no common-errors list."
     ```
   - why: LR-31.

## `quotes/lat_pulldown.json`

71. **W2-23** · medium · `quotes/lat_pulldown.json` · `quotes[20] (c11, padovan2024): replace, then insert the sperandei2009 entry right after it` [fetcher]
   - old:
     ```json
     {"claim": "c11", "source": "padovan2024", "quote": "The front-LPD appears to provide overall greater excitation in the prime movers.", "status": "verbatim", "closest": null}
     ```
   - new:
     ```json
     [{"claim": "c11", "source": "padovan2024", "quote": "During the descending phase, the front-LPD showed superior excitation of the latissimus dorsi (ES = 0.97) and the pectoralis major (ES = 1.17), while in the ascending phase, the back-LPD exhibited superior excitation of the latissimus dorsi (ES = 0.63)", "status": "verbatim", "closest": null}, {"claim": "c11", "source": "sperandei2009", "quote": "For LD, there was no difference between techniques.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

## `cards/seated_cable_row.json`

72. **W2-35** · low · `cards/seated_cable_row.json` · `feel.rows[0].fix`
   - old:
     ```json
     "Keep your torso upright and still. Use a weight you can pull without rocking."
     ```
   - new:
     ```json
     "Keep your torso upright and still."
     ```
   - why: No cited source gives load advice; tier C, so content.md 5.2 load wording does not apply.

73. **W2-36** · low · `cards/seated_cable_row.json` · `risks[2].risk`
   - old:
     ```json
     "Shoulder: when the tops of the shoulders take over, strain on the shoulder may rise; shown mainly in overhead and throwing athletes."
     ```
   - new:
     ```json
     "Shoulder: when the tops of the shoulders take over, strain on the shoulder may rise; this is linked to overhead and throwing sports."
     ```
   - why: Dos Anjos never tested injury; 'shown mainly' overstates a background line (LR-27).

74. **W2-37** · low · `cards/seated_cable_row.json` · `sources[id=deabreu2023].access`
   - old:
     ```json
     "full"
     ```
   - new:
     ```json
     "abstract"
     ```
   - why: Only the journal-page abstract was read.

75. **W2-37** · low · `cards/seated_cable_row.json` · `claims (append new c19 after c18)` [fetcher]
   - old: (none; append this entry at the end of the array (head has 18 entries))
   - new:
     ```json
     {"id": "c19", "text": "In the start position (sitting upright, elbows straight), the weight being lifted hangs clear of the rest of the stack.", "tags": ["CONSENSUS"], "sources": ["nsca-low-row"], "quotes": [{"source": "nsca-low-row", "text": "In this position, the weight to be lifted will be suspended above the rest of the stack.", "where": "Low Pulley Seated Row, Starting Position"}]}
     ```
   - why: plate.equipment carried a free-text citation with no claim id (CARD-V2).

76. **W2-37** · low · `cards/seated_cable_row.json` · `plate.equipment`
   - old:
     ```json
     "Low cable with a close-grip V-handle, a long low seat or bench, and a foot plate the feet press against (c1). The weight stack hangs clear of the rest once seated upright (source text: the weight is suspended above the rest of the stack)."
     ```
   - new:
     ```json
     "Low cable with a close-grip V-handle, a long low seat or bench, and a foot plate the feet press against (c1). In the upright start position the weight being lifted hangs clear of the rest of the stack (c19)."
     ```
   - why: Same; only the plates being lifted hang clear.

77. **W2-37** · low · `cards/seated_cable_row.json` · `notes[4]`
   - old:
     ```json
     "de Abreu 2023: read from the journal page abstract (https://journal.iusca.org/index.php/Journal/article/view/190); the DOI URL is the registry url. It has no PMID."
     ```
   - new:
     ```json
     "de Abreu 2023: read from the journal page abstract (https://journal.iusca.org/index.php/Journal/article/view/190); the DOI URL is the registry url. It has no PMID. Access is abstract: a free full-text PDF exists (CC BY 4.0) but it was not read for this card, and c14 rests on the abstract only (2026-10-18)."
     ```
   - why: Same.

78. **W2-37** · low · `cards/seated_cable_row.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "c19 quote re-read 2026-10-18 by curl from the flashcard page (https://brainscape.com/flashcards/exercise-techniques-3136125/packs/4953113), under Low Pulley Seated Row, Starting Position; word for word."
     ```
   - why: Record.

79. **W2-35** · low · `cards/seated_cable_row.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "2026-10-18 (W2-35): removed the load line \"Use a weight you can pull without rocking.\" from feel.rows[0].fix. No cited source (unmc-cable-row, nsca-low-row, ace-seated-row) gives load advice for this row. Tier C, so the content.md 5.2 load wording (g1 R2, tier A only) does not apply. No sourced load line found."
     ```
   - why: Record.

80. **W2-51** · ruling · `cards/seated_cable_row.json` · `plate.mistake.rankNote (add after drawable)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 2: no frequency word for a row fault (c15's \"often\" is upper-trapezius activity across resistance exercises). Two NSCA-listed errors have stated harm, one source each, both applied by reasoning: leaning back (c9, avoiding it reduces low-back stress) and bending forward on the return (c16). So the NSCA list order decides: jerking or leaning back is first (c6)."
     ```
   - why: LR-31.

81. **W2-52** · ruling · `cards/seated_cable_row.json` · `plate.tempo.text (substring: the ruling's old is part of the field)`
   - old (substring of the field, occurs once; Ruling gave the old as the whole field; on the head it is a substring of: Drawing convention: 2 s pull, brief pause, 2 s slow return. No source gives seconds for this row; ACSM 1-2 s is stated for intermediate to advanced training (LR-15).):
     ```json
     "2 s pull, brief pause, 2 s slow return."
     ```
   - new (replaces that substring):
     ```json
     "2 s pull, 1 s pause for ACE's \"pause momentarily\", 2 s slow return."
     ```
   - why: LR-33.

## `quotes/seated_cable_row.json`

82. **W2-37** · low · `quotes/seated_cable_row.json` · `sources[id=deabreu2023].access`
   - old:
     ```json
     "full"
     ```
   - new:
     ```json
     "abstract"
     ```
   - why: Same.

83. **W2-37** · low · `quotes/seated_cable_row.json` · `quotes (append as quotes[33], after the c18 entry)` [fetcher]
   - old: (none; append this entry at the end of the array (head has 33 entries))
   - new:
     ```json
     {"claim": "c19", "source": "nsca-low-row", "quote": "In this position, the weight to be lifted will be suspended above the rest of the stack.", "status": "verbatim", "closest": null}
     ```
   - why: Same.

## `cards/leg_press.json`

84. **W2-24** · high · `cards/leg_press.json` · `setup[3]`
   - old:
     ```json
     {"step": "Hold the side handles lightly and brace your abs.", "claim": ["c12", "c11"]}
     ```
   - new:
     ```json
     {"step": "Hold the side handles lightly, brace your abs, then push the platform away and release the safety handles; on many machines they turn outwards.", "claim": ["c12", "c11", "c3"]}
     ```
   - why: Merge two steps to free the 5th slot (CARD-V2 cap).

85. **W2-24** · high · `cards/leg_press.json` · `setup[4]`
   - old:
     ```json
     {"step": "Push the platform away and release the safety handles; on many machines they turn outwards.", "claim": "c3"}
     ```
   - new:
     ```json
     {"step": "After the set, pause at the top, pull the safety handles in and bend your knees gently until the platform rests on the safety stoppers.", "claim": "c22"}
     ```
   - why: Handles released but never re-locked; c22 sources the re-lock (real exit hazard, as pendulum_squat in w0).

86. **W2-24** · high · `cards/leg_press.json` · `notes (append)`
   - old: (none; append this entry at the end of the array (head has 6 entries))
   - new:
     ```json
     "W2-24 2026-10-18: the re-lock half of c22 is now the last setup step. The old setup steps 4 and 5 (handles and brace, then release) are merged into one to stay within 5 steps. Wording follows c22 (Bells of Steel section 6, re-read by curl 2026-10-18). Machines differ: some use locking levers (c3)."
     ```
   - why: Record.

87. **W2-25+W2-51** · low · `cards/leg_press.json` · `notes[3]` [merged]
   - old:
     ```json
     "Mistake (fact 3): c7 is the only fault a source calls common ('commonly cause low back injury'); the lockout (c8) is the second, also drawable."
     ```
   - new:
     ```json
     "Mistake (fact 3): under LR-31 step 1, c7 is the only fault a source calls common (Yessis: 'Leg press machines commonly cause low back injury because of the rounding of the back when the knees are close to the chest'), so it is the top fault and drawable is true (2026-10-18). NASM's 'Common Mistakes' list names the knees caving or collapsing inward (c10), locking out (c8) and going too far past 90 degrees (c7) without saying how often any of them happens; its order is not a ranking. The knee cave (c10) needs a front view and stays in handlingMistakes. The lockout (c8) is also drawable."
     ```
   - why: Merged: W2-25's real point (no source ranks the lockout second; NASM's list is unranked) restated under LR-31; W2-25's 'drawable is false' and 'not how often' wording is overruled by W2-51.

88. **W2-51** · ruling · `cards/leg_press.json` · `plate.mistake.drawable` [reserved, routed by LR-31]
   - old:
     ```json
     false
     ```
   - new:
     ```json
     true
     ```
   - why: LR-31 step 1: Yessis's 'commonly' (c7) is the only frequency word; the side view shows it.

89. **W2-51** · ruling · `cards/leg_press.json` · `plate.mistake.why`
   - old:
     ```json
     "NASM's common-mistakes list starts with the knees caving inward, alone or from too much weight (c10); that is a sideways fault the side view cannot show. The drawn fault is the knees coming to the chest so the lower back rounds, which Yessis says commonly causes low back injury (c7); ACE and NASM give the same depth limit."
     ```
   - new:
     ```json
     "Yessis says leg press machines commonly cause low back injury because the back rounds when the knees come close to the chest (c7); no source uses a frequency word for any other leg-press fault. ACE and NASM give the same depth limit. NASM's common-mistakes list (excessive weight and the knee cave first, c10) gives no ranking."
     ```
   - why: LR-31.

90. **W2-51** · ruling · `cards/leg_press.json` · `plate.mistake.rankNote`
   - old:
     ```json
     "No source measures how often each fault happens. NASM lists its mistakes without a frequency; the knee cave is listed first and stays in handlingMistakes (c10)."
     ```
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 1: Yessis's \"commonly cause low back injury because of the rounding\" (c7) is the only frequency word for a leg-press fault. NASM's list order is not a ranking; the knee cave stays in handlingMistakes (c10)."
     ```
   - why: LR-31.

91. **W2-52** · ruling · `cards/leg_press.json` · `plate.tempo.pause` [merged]
   - old:
     ```json
     0
     ```
   - new:
     ```json
     1
     ```
   - why: LR-33: ACE 'Pause momentarily' at the top (c24) is a 1 s drawing convention; 0 contradicted the card.

92. **W2-52** · ruling · `cards/leg_press.json` · `plate.tempo.claim`
   - old:
     ```json
     "c15"
     ```
   - new:
     ```json
     ["c15", "c25"]
     ```
   - why: LR-33: the new WEAK tempo claim c25 names the 1 s convention; c24 stays on posture[2] with its tags (W2-26's [c15, c24] is not used).

93. **W2-52** · ruling · `cards/leg_press.json` · `plate.tempo.text`
   - old:
     ```json
     "2 s down, 2 s up: the controlled pace two inclined leg press studies used in trained adults (c15), not a novice prescription; an optional one-second pause at the bottom is allowed (c15)."
     ```
   - new:
     ```json
     "2 s down, 2 s up: the controlled pace two inclined leg press studies used in trained adults (c15), not a novice prescription. ACE asks for a momentary pause at the top and gives no seconds; the 1 s top pause is a drawing convention (c25; LR-33). An optional one-second pause at the bottom is allowed (c15)."
     ```
   - why: LR-33.

94. **W2-52** · ruling · `cards/leg_press.json` · `notes[2] (substring)`
   - old (substring of the field, occurs once):
     ```json
     "pause 0 at the top, with the one-second bottom pause optional."
     ```
   - new (replaces that substring):
     ```json
     "the 1 s top pause is a drawing convention for ACE's \"pause momentarily\" (c25; LR-33), and the one-second bottom pause is optional (c15)."
     ```
   - why: LR-33.

95. **W2-28** · low · `cards/leg_press.json` · `claims[id=c6].quotes (append)` [fetcher]
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     {"source": "larsen2025", "text": "Twenty-three participants (training age: 7.2 ± 3.5 years) completed a within-participant design, performing four sets of unilateral leg presses to momentary failure twice weekly for 8 weeks.", "where": "abstract"}
     ```
   - why: Population and duration stated in c6 but unquoted.

96. **W2-28** · low · `cards/leg_press.json` · `claims[id=c14].quotes (append)` [fetcher]
   - old: (none; append these entries, in order at the end of the array (head has 2 entries))
   - new:
     ```json
     [{"source": "macdougall1985", "text": "The purpose of this study was to record the blood pressure response to heavy weight-lifting exercise in five experienced body builders.", "where": "abstract"}, {"source": "macdougall1985", "text": "Exercises included single-arm curls, overhead presses, and both double- and single-leg presses performed to failure at 80, 90, 95, and 100% of maximum.", "where": "abstract"}]
     ```
   - why: Population and loads stated in c14 but unquoted.

97. **W2-28** · low · `cards/leg_press.json` · `claims[id=c17].quotes (append)` [fetcher]
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     {"source": "kinoshita2026", "text": "Seventeen untrained adults performed KE with one leg and LP with the contralateral leg at 70% of one-repetition maximum, 10 reps/set, 5 sets/session, 2 sessions/week for 12 wk.", "where": "abstract, methods"}
     ```
   - why: Population and duration stated in c17 but unquoted.

98. **W2-28** · low · `cards/leg_press.json` · `claims[id=c19].quotes (append)` [fetcher]
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     {"source": "dasilva2008", "text": "Fourteen women performed 3 LP exercises: 45 degrees LP (LP45), LP high (LPH), and LP low (LPL) at 40% and 80% of the 1 repetition maximum.", "where": "abstract"}
     ```
   - why: Population stated in c19 but unquoted.

99. **W2-28** · low · `cards/leg_press.json` · `claims[id=c16].text`
   - old:
     ```json
     "Muscles: Yessis names the glutes and hamstrings at the hip and the quadriceps at the knee as the primary muscles; NASM names the quadriceps as the primary mover and the glutes as assisting, with hamstrings and hip adductors secondary."
     ```
   - new:
     ```json
     "Muscles: Yessis names the glutes and hamstrings at the hip and the quadriceps at the knee as the primary muscles; NASM lists the quadriceps (the primary mover) and the glutes (assisting hip extension) as primary muscles, with hamstrings and hip adductors secondary."
     ```
   - why: NASM groups the glutes under Primary Muscles; the secondary list was unquoted.

100. **W2-28** · low · `cards/leg_press.json` · `claims[id=c16].quotes[2].text` [fetcher]
   - old:
     ```json
     "Quadriceps -- primary mover for knee extension and leg pressing power"
     ```
   - new:
     ```json
     "Primary Muscles: Quadriceps -- primary mover for knee extension and leg pressing power Glutes -- assist in hip extension and provide pressing power"
     ```
   - why: Same.

101. **W2-28** · low · `cards/leg_press.json` · `claims[id=c16].quotes[3].text` [fetcher]
   - old:
     ```json
     "Glutes -- assist in hip extension and provide pressing power"
     ```
   - new:
     ```json
     "Secondary Muscles: Hamstrings Hip Adductors Core Stabilizers"
     ```
   - why: Same.

## `quotes/leg_press.json`

102. **W2-28** · low · `quotes/leg_press.json` · `quotes: insert after the last c6 entry, in card order` [fetcher]
   - old: (none; insert right after the last `c6` entry, head index 15)
   - new:
     ```json
     [{"claim": "c6", "source": "larsen2025", "quote": "Twenty-three participants (training age: 7.2 ± 3.5 years) completed a within-participant design, performing four sets of unilateral leg presses to momentary failure twice weekly for 8 weeks.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

103. **W2-28** · low · `quotes/leg_press.json` · `quotes: insert after the last c14 entry, in card order` [fetcher]
   - old: (none; insert right after the last `c14` entry, head index 34)
   - new:
     ```json
     [{"claim": "c14", "source": "macdougall1985", "quote": "The purpose of this study was to record the blood pressure response to heavy weight-lifting exercise in five experienced body builders.", "status": "verbatim", "closest": null}, {"claim": "c14", "source": "macdougall1985", "quote": "Exercises included single-arm curls, overhead presses, and both double- and single-leg presses performed to failure at 80, 90, 95, and 100% of maximum.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

104. **W2-28** · low · `quotes/leg_press.json` · `quotes: insert after the last c17 entry, in card order` [fetcher]
   - old: (none; insert right after the last `c17` entry, head index 44)
   - new:
     ```json
     [{"claim": "c17", "source": "kinoshita2026", "quote": "Seventeen untrained adults performed KE with one leg and LP with the contralateral leg at 70% of one-repetition maximum, 10 reps/set, 5 sets/session, 2 sessions/week for 12 wk.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

105. **W2-28** · low · `quotes/leg_press.json` · `quotes: insert after the last c19 entry, in card order` [fetcher]
   - old: (none; insert right after the last `c19` entry, head index 47)
   - new:
     ```json
     [{"claim": "c19", "source": "dasilva2008", "quote": "Fourteen women performed 3 LP exercises: 45 degrees LP (LP45), LP high (LPH), and LP low (LPL) at 40% and 80% of the 1 repetition maximum.", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

106. **W2-28** · low · `quotes/leg_press.json` · `quotes[41].quote (head index; c16 entry for card quote 2)` [fetcher]
   - old:
     ```json
     "Quadriceps -- primary mover for knee extension and leg pressing power"
     ```
   - new:
     ```json
     "Primary Muscles: Quadriceps -- primary mover for knee extension and leg pressing power Glutes -- assist in hip extension and provide pressing power"
     ```
   - why: Same.

107. **W2-28** · low · `quotes/leg_press.json` · `quotes[42].quote (head index; c16 entry for card quote 3)` [fetcher]
   - old:
     ```json
     "Glutes -- assist in hip extension and provide pressing power"
     ```
   - new:
     ```json
     "Secondary Muscles: Hamstrings Hip Adductors Core Stabilizers"
     ```
   - why: Same.

## `cards/machine_chest_press.json`

108. **W2-28** · low · `cards/machine_chest_press.json` · `claims[id=c9].quotes (append as quotes[2])` [fetcher]
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     {"source": "muyor2023", "text": "This velocity was controlled by a KORG MA−1 metronome", "where": "Procedures"}
     ```
   - why: Metronome stated in c9 but unquoted; keep U+2212 in 'MA−1'.

109. **W2-51** · ruling · `cards/machine_chest_press.json` · `plate.mistake.rankNote (add after drawable)`
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 1: ACE says individuals \"very frequently\" press until the shoulder blades round forward off the backrest (c8). Nance's \"many exercise disciplines\" (c14) is about wrist loading in other exercises."
     ```
   - why: LR-31.

110. **W2-52** · ruling · `cards/machine_chest_press.json` · `plate.tempo.pause`
   - old:
     ```json
     null
     ```
   - new:
     ```json
     1
     ```
   - why: LR-33.

111. **W2-52** · ruling · `cards/machine_chest_press.json` · `plate.tempo.text`
   - old:
     ```json
     "Lab pacing on this machine: 2 s pressing, 2 s lowering (study protocol, WEAK). ACE asks for a momentary pause at full press and gives no seconds, so pause is null."
     ```
   - new:
     ```json
     "Lab pacing on this machine: 2 s pressing, 2 s lowering (study protocol, WEAK). ACE asks for a momentary pause at full press and gives no seconds; the 1 s pause is a drawing convention (c16; LR-33)."
     ```
   - why: LR-33.

112. **W2-52** · ruling · `cards/machine_chest_press.json` · `notes[0] (substring)`
   - old (substring of the field, occurs once):
     ```json
     "Pause is null: ACE says \"pause momentarily\" with no seconds (c7)."
     ```
   - new (replaces that substring):
     ```json
     "The 1 s pause is a drawing convention: ACE says \"pause momentarily\" with no seconds (c16; LR-33)."
     ```
   - why: LR-33.

## `quotes/machine_chest_press.json`

113. **W2-28** · low · `quotes/machine_chest_press.json` · `quotes: insert after the last c9 entry (head quotes[11])` [fetcher]
   - old: (none; insert right after the last `c9` entry, head index 11)
   - new:
     ```json
     [{"claim": "c9", "source": "muyor2023", "quote": "This velocity was controlled by a KORG MA−1 metronome", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

## `cards/dumbbell_lateral_raise.json`

114. **W2-28** · low · `cards/dumbbell_lateral_raise.json` · `claims[id=c9].quotes (append quotes[2], quotes[3])` [fetcher]
   - old: (none; append these entries, in order at the end of the array (head has 2 entries))
   - new:
     ```json
     [{"source": "coratella2020", "text": "each exercise was performed seated with a load that allowed eight repetitions (i.e., 8-RM).", "where": "2.4 Exercise Protocols"}, {"source": "coratella2020", "text": "A metronome was used to pace the intended duty cycle", "where": "2.4 Exercise Protocols"}]
     ```
   - why: Seated protocol and metronome stated in c9 but unquoted.

115. **W2-51** · ruling · `cards/dumbbell_lateral_raise.json` · `plate.mistake.rankNote (add after drawable)`
   - do: Expected text: confirm it by the [LR-31 scan]. If step 3's count ties, write the tie in rankNote and stop dumbbell_lateral_raise for a supervisor ruling; report it in FIXED. Do not replace c5's quote (it is verbatim).
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 1: no frequency word for a lateral-raise fault (ACE's \"this exercise traditionally positions the arms into internal rotation\" says how the exercise is taught, not how often lifters err). LR-31 step 2: two named faults are tied to harm, raising above 90° (Kolber 2014, signs of shoulder impingement, association only, c13) and arms turned in (ACE: the slight external rotation \"may reduce potential impingement\", c5). Neither is on a common-mistakes list; one harm source each; both sourced directly; no list names both. Step 3's count decides: Kolber tells lifters to avoid going beyond 90° (c13)."
     ```
   - why: LR-31 as amended: step 2 counts a quote that says avoiding the fault reduces harm (c5), so two faults are harm-tied and the tie order applies.

## `quotes/dumbbell_lateral_raise.json`

116. **W2-28** · low · `quotes/dumbbell_lateral_raise.json` · `quotes: insert after the last c9 entry (head quotes[11]), seated first` [fetcher]
   - old: (none; insert right after the last `c9` entry, head index 11)
   - new:
     ```json
     [{"claim": "c9", "source": "coratella2020", "quote": "each exercise was performed seated with a load that allowed eight repetitions (i.e., 8-RM).", "status": "verbatim", "closest": null}, {"claim": "c9", "source": "coratella2020", "quote": "A metronome was used to pace the intended duty cycle", "status": "verbatim", "closest": null}]
     ```
   - why: Same.

## Added by the final rulings (w2-rulings-final.md)

### `cards/machine_chest_press.json`

117. **W2-52** · ruling · `cards/machine_chest_press.json` · `claims (append new c16 after c15)`
   - old: (none; append this entry at the end of the array (head has 15 entries))
   - new:
     ```json
     {"id": "c16", "text": "Tempo: ACE asks for a momentary pause at full press and gives no seconds, so the 1 s pause on the plate is a drawing convention.", "tags": ["CONSENSUS", "WEAK"], "sources": ["ace-chest-press"], "quotes": [{"source": "ace-chest-press", "text": "Pause momentarily then gently allow your elbows to flex (bend) in a slow, controlled manner while returning the bar back towards the starting position.", "where": "Step 3"}]}
     ```
   - why: LR-33: the 1 s convention is named in a WEAK tempo claim; the quote is a copy of c7's verified ACE quote, so c7 keeps its CONSENSUS tag on posture[4].

118. **W2-52** · ruling · `cards/machine_chest_press.json` · `plate.tempo.claim`
   - old:
     ```json
     ["c9", "c7"]
     ```
   - new:
     ```json
     ["c9", "c16"]
     ```
   - why: LR-33: plate.tempo.claim cites the claim that names the convention; c7 stays on posture[4] with its tags.

### `quotes/machine_chest_press.json`

119. **W2-52** · ruling · `quotes/machine_chest_press.json` · `quotes: insert after the last c15 entry` [fetcher]
   - old: (none; insert right after the last `c15` entry, head index 22)
   - new:
     ```json
     [{"claim": "c16", "source": "ace-chest-press", "quote": "Pause momentarily then gently allow your elbows to flex (bend) in a slow, controlled manner while returning the bar back towards the starting position.", "status": "verbatim", "closest": null}]
     ```
   - why: Quotes file follows the card (copy of the verified c7 entry).

### `cards/leg_press.json`

120. **W2-52** · ruling · `cards/leg_press.json` · `claims (append new c25 after c24)`
   - old: (none; append this entry at the end of the array (head has 24 entries))
   - new:
     ```json
     {"id": "c25", "text": "Tempo: ACE asks for a momentary pause at the top and gives no seconds, so the 1 s top pause on the plate is a drawing convention.", "tags": ["CONSENSUS", "WEAK"], "sources": ["ace-leg-press"], "quotes": [{"source": "ace-leg-press", "text": "Pause momentarily, then slowly return to your starting position by flexing (bending) the hips and knees, and allowing the resistance plate to move towards you in a slow, controlled manner.", "where": "Step 4"}]}
     ```
   - why: LR-33: the 1 s convention is named in a WEAK tempo claim; the quote is a copy of c24's verified ACE quote, so c24 keeps its CONSENSUS tag on posture[2].

### `quotes/leg_press.json`

121. **W2-52** · ruling · `quotes/leg_press.json` · `quotes: insert after the last c24 entry` [fetcher]
   - old: (none; insert right after the last `c24` entry, head index 56)
   - new:
     ```json
     [{"claim": "c25", "source": "ace-leg-press", "quote": "Pause momentarily, then slowly return to your starting position by flexing (bending) the hips and knees, and allowing the resistance plate to move towards you in a slow, controlled manner.", "status": "verbatim", "closest": null}]
     ```
   - why: Quotes file follows the card (copy of the verified c24 ACE entry).

## Not to apply (superseded by a ruling; listed so the verify record is not applied twice)

- **W2-30** `verify/the8.md` `Fetcher results table, barbell_back_squat row (line 25)`: Not applied: the table is the 2026-10-17 fetcher record ('all checked 2026-10-17') and this round adds 7 squat quotes, not 1 (W2-16, W2-28, W2-30). The new totals go in the Fix round 1 fetcher line instead.
- **W2-26** `cards/leg_press.json` `plate.tempo.pause / text / notes[2] (W2-26's null version)`: Superseded by W2-52 (LR-33): pause is 1, not null.

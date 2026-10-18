# W2 fix packet: W2A

Fix exactly these and nothing else; then re-run your A1-A6 / validation, have your Sonnet fetcher check every new or changed quote, push once, and post FIXED with the sha.

- Head: `claude/libht-verify-w2` @ `5036283d1e69f617cc45d5b49689e9281f3d61f3` (your files are unchanged there since `a33d8f3a`). Paths are under `docs/research/howto/`.
- Final rulings: `w2-rulings-final.md` (LR-30 to LR-35; all amended, none rejected). Items keep their numbers from the first packet; items the final rulings added follow them, under "Added by the final rulings".
- Reserved field routed to you by name: `shared/dumbbell-kickup.json` `variants` (reserved on your card: "variants reserved"). Ruling LR-30 (W2-49) opens `variants.bench.steps` and `variants.seated.steps` to you for items marked **[reserved, opened by LR-30]** only. No other reserved field is opened.
- Routed to you by name under ruling LR-31 (W2-51): `cards/assisted_pull_up.json` `plate.mistake` (drawable, why, rankNote) and `handlingMistakes` order, and the LR-31 step on shoulder_press, chin_up and hanging_knee_raise.
- Items marked **[LR-34 step]** or **[LR-31 step]** are judgement steps under those rulings; they run on claude-opus-5-5, not Sonnet. LR-34 steps try way (1) first: the child's own claim, from a verbatim quote your fetcher confirms by curl. Where an item gives a **fallback new** value, apply it instead of new only when the fallback's condition holds. A feel row, redFlag, risk line or tier-A point never leaves a card under LR-34: keep it, stop the card and report it in FIXED. Never invent a fix or a way out (LR-3); never keep a line on golden-B alone.
- Items marked **[conditional]** apply only when the condition in their `do` line holds.
- Quotes-file inserts: apply by claim id and content, not by head index (indices shift after the first insert).
- Items marked **[fetcher]** add or change a quote: your Sonnet fetcher re-fetches each one by curl (desktop UA; PubMed by efetch) before you push. Fill each `<YYYY-MM-DD>` placeholder with that run's date.

## `cards/shoulder_press.json`

1. **W2-1** · high · `cards/shoulder_press.json` · `feel.rows[0].means`
   - old:
     ```json
     "The shoulder is relatively unstable in the overhead position."
     ```
   - new:
     ```json
     "The shoulder fault to watch here is letting the handles drop on the way down."
     ```
   - why: LR-6: place + the source's fault (c6); the bare instability fact read as the pinch's cause.

2. **W2-1** · high · `cards/shoulder_press.json` · `feel.rows[0].fix`
   - old:
     ```json
     "Stop the set. Next session, you can try the close handles with the elbows pointing forward."
     ```
   - new:
     ```json
     "Stop the set."
     ```
   - why: c7 backs the close handles only for 'some discomfort', not a sharp pinch; stricter, content.md 5.2 load wording.

3. **W2-1** · high · `cards/shoulder_press.json` · `feel.rows[0].claim`
   - old:
     ```json
     ["c6", "c7"]
     ```
   - new:
     ```json
     "c6"
     ```
   - why: The row no longer uses c7's words.

4. **W2-1** · high · `cards/shoulder_press.json` · `tierA.loadWording`
   - old:
     ```json
     "Where the load causes the fault, the fix says to lower the weight (content.md 5.2 load wording); the sharp or pinching shoulder row says to stop the set (c6), with the close handles only as a next-session option (c7). No fix says to push through pain."
     ```
   - new:
     ```json
     "Where the load causes the fault, the fix says to lower the weight, and the sharp or pinching shoulder row says to stop the set (content.md 5.2 load wording for both; no source on this card says when to stop). No fix says to push through pain. The close handles (c7) are offered only in setup, for discomfort in the standard press, not after a sharp pinch."
     ```
   - why: c6's quotes do not say 'stop the set'; credit moved to content.md 5.2.

5. **W2-1** · high · `cards/shoulder_press.json` · `gaps[3]`
   - old:
     ```json
     "No source on this card says what to do if a sharp shoulder pinch keeps coming back; the row fix does not add one. The shared shoulder red-flag box and the owner disclaimer carry the stop-and-check line."
     ```
   - new:
     ```json
     "No source on this card says what to do after a sharp shoulder pinch, at the next session or if it keeps coming back; the row fix stops at 'Stop the set.' The close handles (c7) are sourced only for some discomfort in the standard press, so they stay in setup[3] and are not offered after a sharp pinch. The shared shoulder red-flag box and the owner disclaimer carry the stop-and-check line."
     ```
   - why: Kept accurate after the row edit.

6. **W2-1** · high · `cards/shoulder_press.json` · `notes (append)`
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     "W2-1 2026-10-18: feel.rows[0] cut to 'Stop the set.' (content.md 5.2 load wording). The next-session close-handle option is dropped: the ACE close-grip page (re-read 2026-10-18) backs the close handles (c7) only for 'some discomfort when performing traditional shoulder presses', not for sharp or pinching pain. Under LR-6, means is rewritten as place + the source's fault (letting the handles drop, c6), replacing the instability fact that read as the pinch's cause. tierA.loadWording no longer credits 'stop the set' to c6; neither ACE page says when to stop. warningLink kept: it cites the row's claim c6."
     ```
   - why: Record of the change.

7. **W2-10** · medium · `cards/shoulder_press.json` · `plate.variantLine`
   - old:
     ```json
     "The plate draws the standard handles with the elbows slightly in front of the trunk (c3). The sources do not say which way the palms face on either handle pair; the engine's pivot-arm primitive draws a neutral grip, so a wide-handle option is an equipment gap for the supervisor. The close-handle option (c7) keeps every other rule: same seat, grip, brace, press, lockout and lowering (c1, c2, c4, c5, c6)."
     ```
   - new:
     ```json
     "The plate draws the close handles with the elbows pointing forward (c7), as LR-2 rules until a wide-handle option exists. The standard handles with the elbows at 4 and 8 o'clock (c3) are text only. Both handle pairs keep every other rule: same seat, grip, brace, press, lockout and lowering (c1, c2, c4, c5, c6). The sources do not say which way the palms face on either handle pair; the plate shows the pivot-arm primitive's natural grip as a drawing convention (LR-4, see notes)."
     ```
   - why: LR-2: draw the close handles (c7) until a wide-handle option exists.

8. **W2-10** · medium · `cards/shoulder_press.json` · `grip.type`
   - old:
     ```json
     "Full grip on the machine's handles (c2). The standard handles with the elbows at 4 and 8 o'clock are drawn (c3); the close handles with the elbows pointing forward are the shoulder-friendlier option (c7). Palm direction is not given by the sources."
     ```
   - new:
     ```json
     "Full grip on the machine's handles (c2). The close handles with the elbows pointing forward are drawn; they are the shoulder-friendlier option (c7). The standard handles with the elbows at 4 and 8 o'clock (c3) are text only. Palm direction is not given by the sources."
     ```
   - why: Same LR-2 point.

9. **W2-10** · medium · `cards/shoulder_press.json` · `plate.start`
   - old:
     ```json
     "Seated upright, back on the pad with the natural low-back curve (c1, c4); feet planted (c4); handles level with or just above the shoulders (c1); elbows bent under the hands and slightly in front of the trunk (c3); wrists straight (c2)."
     ```
   - new:
     ```json
     "Seated upright, back on the pad with the natural low-back curve (c1, c4); feet planted (c4); close handles (c7) level with or just above the shoulders (c1); elbows bent under the hands and pointing forward (c7); wrists straight (c2)."
     ```
   - why: Drawn start pose is the close-handle pose its quote states (D-LIB9-FACTPOSE).

10. **W2-10** · medium · `cards/shoulder_press.json` · `claims[id=c7].quotes (two new step-1 quotes in front)` [fetcher]
   - old:
     ```json
     [{"source": "ace-close-shoulder-press", "text": "This position shifts more of the load into the triceps and away from the shoulders.", "where": "step 1, starting position"}, {"source": "ace-close-shoulder-press", "text": "This position is more comfortable and less stressful on the shoulders and more appropriate for individuals who experience some discomfort when performing traditional shoulder presses as it shifts more load into the triceps.", "where": "note"}]
     ```
   - new:
     ```json
     [{"source": "ace-close-shoulder-press", "text": "Grasp the handles closest to your body firmly with a full grip (thumbs clasped around the handles) and maintain a neutral position with your wrists (i.e., wrists in line with your forearms).", "where": "step 1, starting position"}, {"source": "ace-close-shoulder-press", "text": "Position your elbows pointing towards the front of your body (i.e., not in the traditional 3 and 9 o'clock positions where the elbows are aligned with the midline of your trunk).", "where": "step 1, starting position"}, {"source": "ace-close-shoulder-press", "text": "This position shifts more of the load into the triceps and away from the shoulders.", "where": "step 1, starting position"}, {"source": "ace-close-shoulder-press", "text": "This position is more comfortable and less stressful on the shoulders and more appropriate for individuals who experience some discomfort when performing traditional shoulder presses as it shifts more load into the triceps.", "where": "note"}]
     ```
   - why: The close-handle pose needs its own verbatim quotes (D-LIB9-FACTPOSE).

11. **W2-10** · medium · `cards/shoulder_press.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "W2-10 2026-10-18: Per LR-2 the plate draws the close handles with the elbows pointing forward (c7) until a wide-handle option exists. The standard 4-and-8 o'clock handles (c3) stay as text (posture, setup). Per LR-4 the palm direction is a drawing convention, not a claim: no source names it, so the plate shows the pivot-arm primitive's natural grip (neutral, per verify/g1.md 4.1b). ACE 187 (seated-machine-close-grip-shoulder-press) re-read by curl on 2026-10-18 (200). Two step-1 sentences added to c7 as verbatim quotes: 'Grasp the handles closest to your body ...' and 'Position your elbows pointing towards the front of your body ...'. This makes the drawn close-handle start pose the pose its quote states (D-LIB9-FACTPOSE)."
     ```
   - why: Record of the change.

12. **W2-12** · low · `cards/shoulder_press.json` · `feel.rows[2].means`
   - old:
     ```json
     "The elbow rule here is to stop short of locking."
     ```
   - new:
     ```json
     "Fault: the elbows lock at the top."
     ```
   - why: LR-6: name the source's fault (c6, ACE 186 step 3), not repeat the fix.

13. **W2-14** · low · `cards/shoulder_press.json` · `claims[id=c12].text`
   - old:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo. Load goes up by 2-10% once the target reps are beaten by one or two."
     ```
   - new:
     ```json
     "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo."
     ```
   - why: Claims are atoms (content.md 3.2); tempo stays WEAK (LR-15).

14. **W2-14** · low · `cards/shoulder_press.json` · `claims[id=c12].quotes (drop the load quote)`
   - old:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}, {"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]
     ```
   - new:
     ```json
     [{"source": "acsm2009", "text": "For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training", "where": "abstract"}, {"source": "acsm2009", "text": "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)", "where": "abstract"}]
     ```
   - why: The load quote moves to c13.

15. **W2-14** · low · `cards/shoulder_press.json` · `claims (append new c13)`
   - old: (none; append this entry at the end of the array (head has 12 entries))
   - new:
     ```json
     {"id": "c13", "text": "Load goes up by 2-10% once the target reps are beaten by one or two.", "tags": ["CONSENSUS"], "sources": ["acsm2009"], "quotes": [{"source": "acsm2009", "text": "When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.", "where": "abstract"}]}
     ```
   - why: The load rule is not limited to intermediate/advanced lifters, so CONSENSUS only.

16. **W2-14** · low · `cards/shoulder_press.json` · `setup[4].claim`
   - old:
     ```json
     "c12"
     ```
   - new:
     ```json
     "c13"
     ```
   - why: Load line cites the load claim.

17. **W2-14** · low · `cards/shoulder_press.json` · `tierA.loadProgression`
   - old:
     ```json
     "Setup step: add 2-10% only when you beat your target reps by one or two (c12)."
     ```
   - new:
     ```json
     "Setup step: add 2-10% only when you beat your target reps by one or two (c13)."
     ```
   - why: Same.

18. **W2-14** · low · `cards/shoulder_press.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "W2-14 2026-10-18: the old c12 is split into atoms (content.md 3.2). c12 keeps the ACSM tempo, which is for intermediate to advanced lifters (LR-15), tagged CONSENSUS and WEAK, and cited by plate.tempo. The new c13 holds the ACSM 2-10% load rule, a separate sentence of the abstract that is not limited by training level (re-read by efetch, PMID 19204579), tagged CONSENSUS. setup[4] and tierA.loadProgression now cite c13."
     ```
   - why: Record of the change.

19. **W2-53** · ruling · `cards/shoulder_press.json` · `inherit[0..4] LR-34 re-check + notes (append the result)` [LR-34 step]
   - do: Re-run the LR-8 check of all 5 inherit entries on head 5036283d against cards/machine_chest_press.json (the parent card, LR-34) and against any shared card on that head that has passed verification and lists shoulder_press in `appliesTo` (LR-29); golden-B is a source map only. An entry stays only where the parent's shipped How-to (tools/plates/layers/exercises/machine_chest_press.howto.mjs on main) has a string for it whose every clause that card or shared card supports (D-LIB5-FAMILY `===`). Append one notes entry that records, for each of inherit[0]-[4], holds or fails by the parent's claim id (or the shared card's file and claim id), never by setup index, and, per kept entry, the shipped-sheet path it restates, or "no whole string". Apply LR-34's ways out, in order, to any that fail: (1) the child's own claim, a verbatim quote fetched by curl and checked by the fetcher (tagged MECH or WEAK when written for another exercise), tried first for every shown or safety line; (2) an LR-4 drawing convention in notes, for a pure drawing choice only, never for a safety line; (3) remove the line and add a gaps entry (shoulder_press is tier A, so a removed safety line joins the owner's tier-A gap list, LR-3). A feel row, redFlag, risk line or content.md 5.2 tier-A point never leaves under LR-34: if way (1) finds no quote, keep the line and the inherit entry it rests on as on the head, record the failed check in notes, and report shoulder_press as stopped for a supervisor ruling in FIXED. When an entry is removed, every shown word that restates it goes too, and every "inherit:<n>" reference is re-indexed. Never keep a line on golden-B alone.
   - why: LR-34 (W2-53) as amended: parent card or verified shared card, claim ids, way (1) first, stop rule, shipped path per kept entry.

## `quotes/shoulder_press.json`

20. **W2-10** · medium · `quotes/shoulder_press.json` · `quotes: insert the two new c7 entries right before the existing c7 entries (head quotes[10])` [fetcher]
   - old: (none; insert right before the first `c7` entry, head index 10)
   - new:
     ```json
     [{"claim": "c7", "source": "ace-close-shoulder-press", "quote": "Grasp the handles closest to your body firmly with a full grip (thumbs clasped around the handles) and maintain a neutral position with your wrists (i.e., wrists in line with your forearms).", "status": "verbatim", "closest": "Grasp the handles closest to your body firmly with a full grip (thumbs clasped around the handles) and maintain a neutral position with your wrists (i.e., wrists in line with your forearms)."}, {"claim": "c7", "source": "ace-close-shoulder-press", "quote": "Position your elbows pointing towards the front of your body (i.e., not in the traditional 3 and 9 o'clock positions where the elbows are aligned with the midline of your trunk).", "status": "verbatim", "closest": "Position your elbows pointing towards the front of your body (i.e., not in the traditional 3 and 9 o'clock positions where the elbows are aligned with the midline of your trunk)."}]
     ```
   - why: Quotes file matches the card, in card order.

21. **W2-14** · low · `quotes/shoulder_press.json` · `the c12 entry whose quote starts 'When training at a specific RM load' (head quotes[24]; quotes[26] after W2-10's two inserts): claim`
   - old:
     ```json
     "c12"
     ```
   - new:
     ```json
     "c13"
     ```
   - why: Quotes file follows the split.

## `cards/chin_up.json`

22. **W2-7** · medium · `cards/chin_up.json` · `claims[id=c21].tags`
   - old:
     ```json
     ["CONSENSUS"]
     ```
   - new:
     ```json
     ["CONSENSUS", "WEAK"]
     ```
   - why: Quote is from a floor-to-thigh barbell drill; inferred for the bar hang (CARD-V2).

23. **W2-7** · medium · `cards/chin_up.json` · `claims[id=c21].text`
   - old:
     ```json
     "NSCA-editor textbook guidance is to perform all grips with the thumbs around the bar."
     ```
   - new:
     ```json
     "NSCA-editor textbook guidance is to perform all grips with the thumbs around the bar. Written for barbell lifts (a drill lifting a bar from the floor); applied to the chin-up bar by inference."
     ```
   - why: Same.

24. **W2-8** · medium · `cards/chin_up.json` · `feel.rows[1].means`
   - old:
     ```json
     "Usually means you are starting the pull with your shoulders up by your ears."
     ```
   - new:
     ```json
     "Fault: starting the pull with your shoulders up by your ears."
     ```
   - why: LR-6: no source links the feeling to the shrug; place + fault + fix.

25. **W2-8** · medium · `cards/chin_up.json` · `feel.rows[2].means`
   - old:
     ```json
     "Usually means the shoulder does not like this arms-overhead, palms-toward-you position."
     ```
   - new:
     ```json
     "Arms high overhead narrow the space under the shoulder roof."
     ```
   - why: LR-6: no sourced pain-to-cause link; the parent's sourced risk wording.

26. **W2-8** · medium · `cards/chin_up.json` · `feel.rows[2].fix`
   - old:
     ```json
     "Stop the set. If it keeps happening or lasts, stop chin-ups."
     ```
   - new:
     ```json
     "Stop the set. Don't train through the pain."
     ```
   - why: LR-28: no sourced time; the time sits in the linked NHS box.

27. **W2-8** · medium · `cards/chin_up.json` · `feel.rows[3].fix`
   - old:
     ```json
     "Build up the sets slowly. If it lasts, don't train through it."
     ```
   - new:
     ```json
     "Build up the sets slowly. Don't train through the pain."
     ```
   - why: Same LR-28 point.

28. **W2-8** · medium · `cards/chin_up.json` · `notes (append)`
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "W2-8 2026-10-18: No card source gives a time for shoulder or elbow pain. NASM (re-fetched, 200) says only 'persists'. So the red-flag row fixes say 'Stop the set. Don't train through the pain.' with no time, and the time comes from the linked NHS boxes (shoulder: no better after two weeks; elbow: no better after a few weeks) (LR-28). The shrug and shoulder rows have no sourced link from the feeling to a cause: Bullbar names the shrug only as a fault, and Prinold 2016 (efetch) links arm position to impingement risk, not pain to a cause. So they read place + the source's fault + fix, with no 'usually means' (LR-6). The elbow rows keep 'usually means', because NASM links elbow tendon irritation to overuse."
     ```
   - why: Record of the change.

29. **W2-53** · ruling · `cards/chin_up.json` · `inherit (replace array)` [LR-34 step]
   - do: Keep each entry below only if the parent's shipped string for it (tools/plates/layers/exercises/pull_up.howto.mjs on main) holds whole on cards/pull_up.json at 5036283d, every clause supported (D-LIB5-FAMILY `===`). Expected: both hold (thumb: parent c3; hand zoom: parent zoom 'hand', c3). An entry with no whole string leaves, and its line is cited to chin_up's own claims (the thumb: c1, c21; item 31's new value then reads "Wrapped around the bar (c1, c21).").
   - old (exact head value; ruling gave a summary; exact head value shown):
     ```json
     [{"field": "grip.handContact", "why": "true for this child because the same fixed bar hangs in the fingers and top of the palm under full body weight; only the palm turns toward the face (c1)."}, {"field": "grip.thumb (wrapped, never thumbless by default)", "why": "true for this child because the lifter is still what falls if the hand opens, and ACE's chin-up setup itself asks for thumbs wrapped (c1, c21)."}, {"field": "setup: bar high enough that the feet clear the floor, reached by a small jump or a step", "why": "true for this child because the bar and the free hang are identical to the pull-up."}, {"field": "setup: bar fixed and dry, chalk if the hands sweat", "why": "true for this child because grip security on the same bar does not depend on palm direction."}, {"field": "zooms.thumb (full grip is the only option shown; thumbless, hook and gymnastics false grip appear only as labelled wrong or trap)", "why": "true for this child because the thumb choices and their naming trap are the same on a supinated hang; the drawing turns the palm toward the face."}]
     ```
   - new:
     ```json
     [{"field": "grip.thumb (wrapped, never thumbless by default)", "why": "true for this child because the lifter is still what falls if the hand opens, and ACE's chin-up setup itself asks for thumbs wrapped (c1, c21); parent c3."}, {"field": "zooms.hand (full grip, thumb around the bar, is the only grip shown)", "why": "true for this child because the thumb rule on a hang does not depend on palm direction (parent zoom 'hand' and c3; content.md 5.2 C4)."}]
     ```
   - why: LR-34: hand contact, bar height, a fixed and dry bar, chalk, and the thumbless, hook and false-grip labels are not on the pull_up card.

30. **W2-53** · ruling · `cards/chin_up.json` · `grip.handContact` [LR-34 step] [fetcher]
   - do: Way (1) first: apply new only if the fetcher confirms bullbar-calluses' hand-contact quote (items 73-76, 85 and 86: source, claim c25, grip.claims, zoom claim, quotes file). If it does not, apply the fallback and skip those added items.
   - old:
     ```json
     "Inherited from pull_up: bar across the top of the palm where the fingers start."
     ```
   - new:
     ```json
     "Bar just below the base of the fingers, where the fingers meet the palm (c25)."
     ```
   - fallback new (only when the fetcher does not confirm the quote: LR-4 drawing convention):
     ```json
     "Not sourced: drawn as the bar primitive's natural hang grip (LR-4 drawing convention; the pull_up card does not source it, LR-34)."
     ```
   - why: LR-34 way (1): the parent card does not source hand contact; bullbar-calluses (the source the approved pull_up sheet cites) says it, written for a palms-away hang (MECH, WEAK).

31. **W2-53** · ruling · `cards/chin_up.json` · `grip.thumb`
   - old:
     ```json
     "Wrapped around the bar to meet the index finger (inherited from pull_up; ACE also asks for it)."
     ```
   - new:
     ```json
     "Wrapped around the bar (c1, c21; inherited from pull_up, parent c3)."
     ```
   - why: LR-34.

32. **W2-53** · ruling · `cards/chin_up.json` · `zooms[key=hand].right (zooms[0])` [LR-34 step] [fetcher]
   - do: Way (1) first: apply new only if the fetcher confirms bullbar-calluses' hand-contact quote (items 73-76, 85 and 86: source, claim c25, grip.claims, zoom claim, quotes file). If it does not, apply the fallback and skip those added items.
   - old:
     ```json
     "Palm facing the face, bar across the top of the palm, thumb wrapped under, wrist straight in line with the forearm."
     ```
   - new:
     ```json
     "Palm facing the face, bar just below the base of the fingers, thumb wrapped around the bar, wrist straight in line with the forearm."
     ```
   - fallback new (only when the fetcher does not confirm the quote):
     ```json
     "Palm facing the face, thumb wrapped around the bar, wrist straight in line with the forearm."
     ```
   - why: LR-34 way (1); this also settles W2-5 for chin_up (the zoom cites c25, not an inherit entry).

33. **W2-53** · ruling · `cards/chin_up.json` · `notes[0] (substring)` [LR-34 step]
   - do: Way (1) for the failed setup entries: the fetcher re-reads catalyst-pullup and bullbar-calluses for a fixed or dry bar and for bar height (supervisor and judge re-read 2026-10-18: neither says them; bullbar-calluses sources chalk). The setup has 5 of 5 steps (SETUP_MAX_STEPS), so chalk goes to gaps (item 77); a fixed bar and bar height go to gaps by item 78. If the fetcher finds a verbatim quote for a fixed bar or bar height, add it as a claim (MECH, WEAK) and write "sourced (<source id>), no setup slot" for that point here and in gaps instead.
   - old (substring of the field, occurs once):
     ```json
     "the pull_up card's setup lines are inherited for bar height and chalk."
     ```
   - new (replaces that substring):
     ```json
     "bar height, a fixed and dry bar, and chalk are not on the pull_up card, so none is inherited (LR-34): chalk is sourced by bullbar-calluses but the setup has no free slot (5 of 5 steps), and catalyst-pullup and bullbar-calluses do not say the bar is fixed or dry or how high it is; all three are in gaps."
     ```
   - why: LR-34: the entries leave (no whole parent string is supported); way (1) outcome recorded.

34. **W2-53** · ruling · `cards/chin_up.json` · `notes[1]..notes[5] (the five 'W2A LR-8: inherit[n] holds' notes) -> one note` [LR-34 step]
   - do: Write the note from the LR-34 step's results. The new value is the expected result (both kept entries hold on the shipped sheet; the hand-contact quote confirmed). If a result differs, change only the clause it affects.
   - old (exact head values; ruling gave a summary; exact head values are notes[1]-notes[5]):
     ```json
     ["W2A LR-8: inherit[0] holds - docs/howto/grip-and-feel/research/pull_up.json (origin/claude/howto-options): grip.handContact (bar across the top of the palm where the fingers start; fingers over the top, thumb under).", "W2A LR-8: inherit[1] holds - docs/howto/grip-and-feel/research/pull_up.json (origin/claude/howto-options): grip.thumb (wrapped under the bar by default, because you are what falls if the grip opens; thumbless is never the default).", "W2A LR-8: inherit[2] holds - docs/howto/grip-and-feel/research/pull_up.json (origin/claude/howto-options): setup[0] (a bar you reach with a small jump or from a step, high enough that the feet clear the floor with straight arms).", "W2A LR-8: inherit[3] holds - docs/howto/grip-and-feel/research/pull_up.json (origin/claude/howto-options): setup[1] (bar fixed and dry, chalk if the hands sweat).", "W2A LR-8: inherit[4] holds - docs/howto/golden-b/exercises/pull_up.howto.mjs (origin/claude/howto-options): THUMB_PAGE and the header note on thumb (full grip is the default and the only option offered; thumbless is drawn as a risk, 'Can open late in a set'; hook 'Heavy barbell pulls only'; gymnastics false grip 'Rings only'), with content.md 5.2 'no thumbless option offered'. The research file's zooms[1].correct still labels thumbless 'optional, dry bar, fresh hands'; the approved sheet overrides it for hang exercises (C4), so the line follows the approved sheet. Line unchanged."]
     ```
   - new (these entries replace them, so the array shrinks by 4):
     ```json
     ["W2A LR-8 check redone under LR-34 against cards/pull_up.json on 5036283d (golden-B research is a source map only): the thumb holds (parent c3; c1 and c21 here) and the hand zoom's full-grip-only rule holds (parent zoom 'hand', c3; content.md 5.2 C4), each restating a whole string of tools/plates/layers/exercises/pull_up.howto.mjs on main. The thumbless, hook and gymnastics false-grip labels fail: the parent's baechle-earle quote gives only \"Perform all grips with your thumbs around the bar.\" (c3). Hand contact, bar height, a fixed and dry bar, and chalk fail because the parent card does not source them; those inherit entries are removed. Way (1): hand contact is this card's own c25 (bullbar-calluses, MECH, WEAK); chalk is sourced by bullbar-calluses but the setup has no free slot; catalyst-pullup and bullbar-calluses do not say the bar is fixed or dry or how high it is. Chalk, bar height and a fixed bar are in gaps."]
     ```
   - fallback new (only when the fetcher does not confirm the hand-contact quote):
     ```json
     ["W2A LR-8 check redone under LR-34 against cards/pull_up.json on 5036283d (golden-B research is a source map only): the thumb holds (parent c3; c1 and c21 here) and the hand zoom's full-grip-only rule holds (parent zoom 'hand', c3; content.md 5.2 C4), each restating a whole string of tools/plates/layers/exercises/pull_up.howto.mjs on main. The thumbless, hook and gymnastics false-grip labels fail: the parent's baechle-earle quote gives only \"Perform all grips with your thumbs around the bar.\" (c3). Hand contact, bar height, a fixed and dry bar, and chalk fail because the parent card does not source them; those inherit entries are removed. Way (1) found no verbatim hand-contact quote, so hand contact is an LR-4 drawing convention; chalk is sourced by bullbar-calluses but the setup has no free slot; catalyst-pullup and bullbar-calluses do not say the bar is fixed or dry or how high it is. Chalk, bar height and a fixed bar are in gaps."]
     ```
   - why: LR-34 as amended: head sha, parent claim ids, shipped path per kept entry, the failed grip labels and the way-(1) outcomes.

## `cards/hanging_knee_raise.json`

35. **W2-2** · low · `cards/hanging_knee_raise.json` · `feel.rows[2].means`
   - old:
     ```json
     "The straight-leg version measured about 3000 N of spine compression; bent knees likely load the spine less (inference)."
     ```
   - new:
     ```json
     "The straight-leg version measured about 3000 N of spine compression; bent knees likely load the spine less."
     ```
   - why: LR-27/LR-23: research label on a shown line; 'likely' keeps how sure.

36. **W2-7** · medium · `cards/hanging_knee_raise.json` · `claims[id=c3].tags`
   - old:
     ```json
     ["CONSENSUS"]
     ```
   - new:
     ```json
     ["CONSENSUS", "WEAK"]
     ```
   - why: Floor-drill quote applied to a hang by inference (CARD-V2).

37. **W2-7** · medium · `cards/hanging_knee_raise.json` · `claims[id=c3].text`
   - old:
     ```json
     "NSCA-editor textbook guidance is to perform all grips with the thumbs around the bar."
     ```
   - new:
     ```json
     "NSCA-editor textbook guidance is to perform all grips with the thumbs around the bar. Written for barbell lifts (a drill lifting a bar from the floor); applied to the hanging bar by inference."
     ```
   - why: Same.

38. **W2-7** · medium · `cards/hanging_knee_raise.json` · `setup[1].claim`
   - old:
     ```json
     "c2"
     ```
   - new:
     ```json
     ["c2", "c3"]
     ```
   - why: 'thumbs wrapped' had no cited claim (c2's quote has no thumb words).

39. **W2-3+W2-53** · low · `cards/hanging_knee_raise.json` · `notes[0]` [conditional] [merged]
   - do: Apply new only when item 41 sources the shoulder fix. If item 41 stops the card, apply the fallback: W2-3's change only, with the active-hang sentence kept and re-indexed to inherit[2] (item 43's fallback).
   - old:
     ```json
     "Yessis also advises holding the breath and a slight lower-back arch at the start; neither is used, because the parent card and other sources teach a still, quiet hang and no source here supports breath-holding. Not sourced: a safe way down from the bar (inherited from the parent's box line). Escamilla 2006 measured the knee-up in arm straps, not a bare-hand hang. McGill 2015 measured straight legs only. The StrengthLog hanging knee raise page was re-fetched on 2026-09-30 (access full, quotes verbatim). feel.rows[3].fix comes from the inherited active-hang line (inherit[5]), not from a claim on this card."
     ```
   - new:
     ```json
     "Yessis also advises holding the breath and a slight lower-back arch at the start; neither is used, because the parent card and other sources teach a still, quiet hang and no source here supports breath-holding. Not sourced: a safe way down from the bar. Escamilla 2006 measured the knee-up in arm straps, not a bare-hand hang. McGill 2015 measured straight legs only. The StrengthLog hanging knee raise page was re-fetched on 2026-09-30 (access full, quotes verbatim)."
     ```
   - fallback new (only when item 41 stops the card):
     ```json
     "Yessis also advises holding the breath and a slight lower-back arch at the start; neither is used, because the parent card and other sources teach a still, quiet hang and no source here supports breath-holding. Not sourced: a safe way down from the bar. Escamilla 2006 measured the knee-up in arm straps, not a bare-hand hang. McGill 2015 measured straight legs only. The StrengthLog hanging knee raise page was re-fetched on 2026-09-30 (access full, quotes verbatim). feel.rows[3].fix comes from the inherited active-hang line (inherit[2]), not from a claim on this card."
     ```
   - why: Merged: W2-3 (the box line implied a way down, LR-3) + W2-53 (delete the inherit[5] sentence, only when item 41 sources the fix). W2-3's 'inherited box line (inherit[3])' sentence is dropped, because LR-34 removes inherit[3].

40. **W2-6** · low · `cards/hanging_knee_raise.json` · `feel.rows[3].means (only when item 41 sources the fix)` [conditional]
   - do: Apply only when item 41 sources the shoulder fix. If item 41 stops the card, rows[3] stays exactly as on the head (LR-34 stop rule).
   - old:
     ```json
     "Arms high overhead narrow the space under the shoulder roof (measured in pull-ups)."
     ```
   - new:
     ```json
     "Arms high overhead narrow the space under the shoulder roof."
     ```
   - why: Study note on a shown line, over the row limit; how sure stays in c15.

41. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `feel.rows[3] (Shoulder row; fix cites inherit:5)` [LR-34 step]
   - do: Way (1) for the fix only; rows[3].where, rows[3].means (item 40 aside) and 'shoulder' in redFlags stay. Leads, both applied to a knee-raise hang by inference (MECH, WEAK): (a) bullbar-calluses, section "3. The Hanging Mechanics: Active Shoulders, Not Passive Arms": quote only "Pull your shoulder blades down and back"; its next sentence, "Keep a slight bend in your elbows—never lock out fully.", conflicts with c2 ("Hang with your arms fully extended"), so record that conflict in notes and do not use it; (b) nasm-chinup as quoted in cards/pull_up.json c8 ("Set the scapulae first, cueing 'pull the shoulder blades down and back' before the arms take over, so the client leads with the back rather than yanking with the arms."). If the fetcher confirms a lead: add it as this card's claim c19 (c17 and c18 are item 81's, used or not), tagged MECH and WEAK, with its source in the card's and the quotes file's sources and its quote in the quotes file; set rows[3].fix from that quote's words (expected with lead (a): "Pull your shoulder blades down and back before each rep."); set rows[3].claim to ["c15", "<new claim>"]; then items 39 and 40 apply new, and item 43 applies new (the active-hang entry leaves). If no lead is confirmed: rows[3], 'shoulder' in redFlags and the active-hang inherit entry stay as on the head (items 39 and 43 apply their fallbacks; item 84 re-indexes inherit:5 to inherit:2; item 40 does not apply); append the note "LR-34: the active hang fails on cards/hanging_leg_raise.json; rows[3].fix is unsourced; hanging_knee_raise is stopped for a supervisor ruling."; and report hanging_knee_raise as stopped in FIXED. Never remove rows[3] or the 'shoulder' redFlag (LR-34 stop rule).
   - why: LR-34: the fix rests only on the failed active hang (inherit:5). The remove-row fallback is dropped: the row and its redFlag are the card's only live shoulder warning link (content.md 5.2), so the card stops instead.

42. **W2-6** · low · `cards/hanging_knee_raise.json` · `feel.rows[1] (grip row)` [LR-34 step]
   - do: W2-6's proposed means/fix/claim (cite inherit:4) are void: LR-34 removes inherit[4] (straps fail on the parent card). Same route as rows[3]: if a fetched, quoted source added to this card (fetcher-checked) links straps or ab slings to grip giving out, set means "Usually means your grip ends the set before your abs are tired.", fix "Use straps or ab slings.", claim ["<new claim>", "c10"]. If none is found, leave rows[1] exactly as on the head and add to gaps: "No sourced link from grip giving out to straps or ab slings: the parent card has no strap line (LR-34); feel.rows[1] keeps the c10 wording."
   - why: Conflict W2-6 x W2-53, resolved by applying LR-34's ways out; nothing invented. Supervisor: the head row's means is still not a 'usually means' line (open, see findings).

43. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `inherit (replace array)` [LR-34 step]
   - do: Keep the wrist and thumb entries only if the parent's shipped strings for them (tools/plates/layers/exercises/hanging_leg_raise.howto.mjs on main) hold whole on cards/hanging_leg_raise.json at 5036283d (parent c18; c17); an entry that fails leaves, and its line cites this card's own claims (wrist: c16; thumb: c3). The jump/stool entry is dropped: the parent's sheet has no whole string for it (its only get-in string is "Step up from a box, and check it's clear of your legs."), and setup[0] already cites this card's own c1. Apply new when item 41 sources the shoulder fix (the active-hang entry leaves); otherwise apply the fallback (the active-hang entry stays as on the head, now inherit[2]).
   - old (exact head value; ruling gave a summary; exact head value shown):
     ```json
     [{"field": "grip.width (about shoulder width, arms hanging vertical)", "why": "true for this child because the hang on the bar is identical; only the legs bend. Consensus on the parent too; no study compares widths."}, {"field": "grip.handContact (bar across the base of the fingers) and grip.wrist (not curled forward)", "why": "true for this child because the same overhand hang loads the hand the same way (c2, c16)."}, {"field": "grip.thumb (wrapped every set)", "why": "true for this child because the lifter still falls if the hand opens (c3)."}, {"field": "setup: step or box to reach the bar, box moved clear of the legs", "why": "true for this child because the bar and the hang are the same; the bent knees swing through the same space in front of the body."}, {"field": "setup: dry or chalked hands; straps or ab slings if grip quits first", "why": "true for this child because grip demand is the same hang; the strapped knee-up is the version Escamilla measured (c10)."}, {"field": "posture: active hang (shoulders a little down from the ears, arms straight)", "why": "true for this child because the upper body does the same job as on the parent; the leg action is what changes."}]
     ```
   - new:
     ```json
     [{"field": "grip.wrist (not curled forward)", "why": "true for this child because the same overhand hang loads the hand the same way (c2, c16; parent c18)."}, {"field": "grip.thumb (wrapped every set)", "why": "true for this child because the lifter still falls if the hand opens (c3; parent c17)."}]
     ```
   - fallback new (only when item 41 stops the card; the third entry is head inherit[5], unchanged):
     ```json
     [{"field": "grip.wrist (not curled forward)", "why": "true for this child because the same overhand hang loads the hand the same way (c2, c16; parent c18)."}, {"field": "grip.thumb (wrapped every set)", "why": "true for this child because the lifter still falls if the hand opens (c3; parent c17)."}, {"field": "posture: active hang (shoulders a little down from the ears, arms straight)", "why": "true for this child because the upper body does the same job as on the parent; the leg action is what changes."}]
     ```
   - why: LR-34: width, hand contact, the box-clear step, chalk and straps are not on the parent card; the jump/stool entry has no whole parent string (this card's own c1 sources it); the active hang leaves only with a sourced fix.

44. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `grip.width` [LR-34 step] [fetcher]
   - do: Way (1) first: apply new only if the fetcher confirms bullbar-calluses' width quote (claim c18: items 80-82, 87 and 88). If not, apply the fallback and skip c18.
   - old:
     ```json
     "Inherited: about shoulder width."
     ```
   - new:
     ```json
     "Shoulder width (c18)."
     ```
   - fallback new (only when the fetcher does not confirm the quote: LR-4 drawing convention):
     ```json
     "Not sourced (the parent card gives no width): LR-4 drawing convention (LR-34)."
     ```
   - why: LR-34 way (1): the parent card gives no width; bullbar-calluses gives a shoulder-width, palms-away grip for dead hangs (MECH, WEAK).

45. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `grip.handContact` [LR-34 step] [fetcher]
   - do: Way (1) first: apply new only if the fetcher confirms bullbar-calluses' hand-contact quote (claim c17: items 80-83, 87 and 88). If not, apply the fallback and skip c17.
   - old:
     ```json
     "Inherited: bar across the base of the fingers."
     ```
   - new:
     ```json
     "Bar just below the base of the fingers, where the fingers meet the palm (c17)."
     ```
   - fallback new (only when the fetcher does not confirm the quote: LR-4 drawing convention):
     ```json
     "Not sourced (the parent card does not source it): LR-4 drawing convention (LR-34)."
     ```
   - why: LR-34 way (1): the parent's grip.handContact says Not sourced; bullbar-calluses says it, written for a dead hang (MECH, WEAK).

46. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `zooms[key=hand].right (zooms[0])` [LR-34 step] [fetcher]
   - do: Way (1) first: apply new only if the fetcher confirms bullbar-calluses' hand-contact quote (claim c17: items 80-83, 87 and 88). If not, apply the fallback and skip c17.
   - old:
     ```json
     "Overhand, bar across the base of the fingers, thumb wrapped, wrist not curled."
     ```
   - new:
     ```json
     "Overhand, bar just below the base of the fingers, thumb wrapped, wrist not curled."
     ```
   - fallback new (only when the fetcher does not confirm the quote):
     ```json
     "Overhand, thumb wrapped, wrist not curled."
     ```
   - why: LR-34 way (1); this also settles W2-5 for hanging_knee_raise (the zoom cites c17, not an inherit entry).

47. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `gaps[0] (substring)`
   - old (substring of the field, occurs once):
     ```json
     "the parent's box-clear setup line is inherited, nothing new invented."
     ```
   - new (replaces that substring):
     ```json
     "the parent card has no box-clear setup line, so none is inherited (LR-34)."
     ```
   - why: LR-34.

48. **W2-2** · low · `cards/hanging_knee_raise.json` · `notes (append)`
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     "Verify w2 2026-10-18 (W2-2): feel.rows[2].means lost '(inference)' (LR-27 plain words; 'likely' keeps how sure). The fix 'Keep the knees bent.' is kept: it is the sourced progression (c13, c14: straight legs are the version measured at about 3000 N), not a stop line. No source on this card supports 'Stop the set. Don't train through the pain.', so none is added (LR-6 R1). Re-read by efetch: McGill 2015 (PMID 25111163) has no bent-knee load and no advice line; Escamilla 2006 (PMID 16649890) names the Power Wheel knee-up, reverse crunch and bent-knee sit-up, not the hanging knee-up, as possibly problematic for low back problems. gaps[2] and the pending redFlag 'back' stand."
     ```
   - why: Record of the change.

49. **W2-6** · low · `cards/hanging_knee_raise.json` · `notes (append)` [merged]
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "Verify W2-6 2026-10-18: feel.rows[3].means drops '(measured in pull-ups)' (only when the LR-34 step sources the row's fix; otherwise the row stays as on the head); how sure stays in c15 (MECH, applied to a hang by reasoning). W2-6's straps fix for feel.rows[1] (cite inherit:4) is void under LR-34: the parent card has no strap line, and the Yessis page (curl 200, 2026-10-18) mentions no straps or slings. risks[0] and feel.rows[1].where kept: no source or study wording."
     ```
   - why: Merged: W2-6's note minus its LR-8 golden-sheet basis (void under LR-34); its condition follows item 40's (final LR-34).

50. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `notes (append)` [LR-34 step]
   - do: Write the note from the LR-34 step's results. The new value is the expected result with every way-(1) quote confirmed, the shipped strings holding and item 41 sourcing the fix (fill <source id>). If a grip quote is not confirmed, that clause reads "<hand contact | width> is an LR-4 drawing convention". If item 41 stops the card, apply the fallback.
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "W2A LR-8 check under LR-34 against cards/hanging_leg_raise.json on 5036283d (golden-B research is a source map only): thumb (parent c17) and wrist (parent c18) hold, each restating a whole string of tools/plates/layers/exercises/hanging_leg_raise.howto.mjs on main. The jump or step-up holds (parent c1) and is cited to this card's own c1, not inherited: the parent's shipped get-in string is the box step, so there is no whole string. Grip width, hand contact, the box-clear step, chalk, straps and the active hang fail (the8.md:138 lists the width, straps and box clearance as unsourced golden-B points; the parent's grip.handContact says Not sourced; chalk and the active hang are not on the parent card). Those entries are removed. Way (1): hand contact and width are this card's own c17 and c18 (bullbar-calluses, MECH, WEAK); the shoulder row's fix is this card's own c19 (<source id>, MECH, WEAK); no quote gives the box clearance, so it stays in gaps."
     ```
   - fallback new (only when item 41 stops the card):
     ```json
     "W2A LR-8 check under LR-34 against cards/hanging_leg_raise.json on 5036283d (golden-B research is a source map only): thumb (parent c17) and wrist (parent c18) hold, each restating a whole string of tools/plates/layers/exercises/hanging_leg_raise.howto.mjs on main. The jump or step-up holds (parent c1) and is cited to this card's own c1, not inherited: the parent's shipped get-in string is the box step, so there is no whole string. Grip width, hand contact, the box-clear step, chalk, straps and the active hang fail (the8.md:138 lists the width, straps and box clearance as unsourced golden-B points; the parent's grip.handContact says Not sourced; chalk and the active hang are not on the parent card). The width, hand-contact, box-clear, chalk and straps entries are removed; the active-hang entry stays (inherit[2]) and the card is stopped for a ruling (see the LR-34 note). Way (1): hand contact and width are this card's own c17 and c18 (bullbar-calluses, MECH, WEAK); no quote gives a fix for the shoulder row; no quote gives the box clearance, so it stays in gaps."
     ```
   - why: LR-34 as amended: head sha, parent claim ids, shipped path or 'no whole string' per kept entry, the way-(1) outcomes, and the corrected the8.md:138 parenthetical.

## `cards/assisted_pull_up.json`

51. **W2-7** · medium · `cards/assisted_pull_up.json` · `claims[id=c12].tags`
   - old:
     ```json
     ["CONSENSUS"]
     ```
   - new:
     ```json
     ["CONSENSUS", "WEAK"]
     ```
   - why: Floor-drill quote applied to the machine bar by inference.

52. **W2-7** · medium · `cards/assisted_pull_up.json` · `claims[id=c12].text`
   - old:
     ```json
     "NSCA-editor textbook guidance is to perform all grips with the thumbs around the bar."
     ```
   - new:
     ```json
     "NSCA-editor textbook guidance is to perform all grips with the thumbs around the bar. Written for barbell lifts (a drill lifting a bar from the floor); applied to the assisted pull-up machine's bar by inference."
     ```
   - why: Same.

53. **W2-8** · medium · `cards/assisted_pull_up.json` · `feel.rows[0].means`
   - old:
     ```json
     "Usually means you are shrugging to start the pull."
     ```
   - new:
     ```json
     "Fault: starting the pull with your shoulders up by your ears."
     ```
   - why: LR-6, as chin_up.

54. **W2-8** · medium · `cards/assisted_pull_up.json` · `feel.rows[1].means`
   - old:
     ```json
     "Usually means the shoulder does not like the arms-overhead position."
     ```
   - new:
     ```json
     "Arms high overhead narrow the space under the shoulder roof."
     ```
   - why: LR-6.

55. **W2-8** · medium · `cards/assisted_pull_up.json` · `feel.rows[1].fix`
   - old:
     ```json
     "Stop the set. If it keeps happening or lasts, don't train through it."
     ```
   - new:
     ```json
     "Stop the set. Don't train through the pain."
     ```
   - why: LR-28.

56. **W2-8** · medium · `cards/assisted_pull_up.json` · `feel.rows[2].fix`
   - old:
     ```json
     "Build up the sets slowly. If it lasts, don't train through it."
     ```
   - new:
     ```json
     "Build up the sets slowly. Don't train through the pain."
     ```
   - why: LR-28.

57. **W2-9** · low · `cards/assisted_pull_up.json` · `gaps[0]`
   - old:
     ```json
     "Tier A: no sourced way to get on and off the pad safely (including a knee slipping off the moving pad) or to leave the machine at the end of a set; left out, not invented."
     ```
   - new:
     ```json
     "Tier A: getting on the pad is sourced (c1, setup[2]); no sourced way to get off the pad, to handle a knee slipping off the moving pad, or to leave the machine at the end of a set; left out, not invented."
     ```
   - why: Getting on is sourced (c1); a false open tier-A item (LR-3).

58. **W2-9** · low · `cards/assisted_pull_up.json` · `notes[0] (substring)`
   - old (substring of the field, occurs once):
     ```json
     "Not sourced, so left out: how to get on and off the pad safely and how to leave the machine at the end of a set (the tier-A 'way out')."
     ```
   - new (replaces that substring):
     ```json
     "Not sourced, so left out: how to get off the pad safely, what to do if a knee slips off the moving pad, and how to leave the machine at the end of a set (the tier-A 'way out'); getting on the pad is sourced (c1)."
     ```
   - why: Same; W2-9 gave the whole notes[0], only this sentence changes.

59. **W2-9** · low · `cards/assisted_pull_up.json` · `notes[1] (first substring)`
   - old (substring of the field, occurs once):
     ```json
     "acefitness.org exercise-library/190/assisted-pull-up/ -> 200 (mount and return only);"
     ```
   - new (replaces that substring):
     ```json
     "acefitness.org exercise-library/190/assisted-pull-up/ -> 301 to the ACE chin-ups page (exercise-library/190/chin-ups/; rechecked 2026-10-18), so no ACE assisted-machine page was read;"
     ```
   - why: The ACE URL redirects to the chin-ups page.

60. **W2-9** · low · `cards/assisted_pull_up.json` · `notes[1] (second substring)`
   - old (substring of the field, occurs once):
     ```json
     "No source says how to get on and off the pad safely, what to do if a knee slips off, or how to leave the machine at the end of a set."
     ```
   - new (replaces that substring):
     ```json
     "No source says how to get off the pad safely, what to do if a knee slips off, or how to leave the machine at the end of a set; getting on the pad is sourced (c1). The ACE assisted-machine search goes back to LIB-WAYOUT (assist machine)."
     ```
   - why: Same.

61. **W2-8** · medium · `cards/assisted_pull_up.json` · `notes (append)`
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     "W2-8 2026-10-18: No card source gives a time for shoulder or elbow pain. NASM (re-fetched, 200) says only 'persists'. So the red-flag row fixes say 'Stop the set. Don't train through the pain.' with no time, and the time comes from the linked NHS boxes (shoulder: no better after two weeks; elbow: no better after a few weeks) (LR-28). The shrug and shoulder rows have no sourced link from the feeling to a cause: Bullbar names the shrug only as a fault, and Prinold 2016 (efetch) links arm position to impingement risk, not pain to a cause. So they read place + the source's fault + fix, with no 'usually means' (LR-6). The elbow rows keep 'usually means', because NASM links elbow tendon irritation to overuse."
     ```
   - why: Record of the change.

## `shared/dumbbell-kickup.json`

62. **W2-49** · ruling · `shared/dumbbell-kickup.json` · `claims[id=c5].text`
   - old:
     ```json
     "The same source says that if you get stuck in a dumbbell bench press you can drop the weights out to the side. Recorded as a conflict with the candidate rule; not used in any field."
     ```
   - new:
     ```json
     "Failed rep on a dumbbell bench press: if you get stuck, you can drop the weights out to the side. One coach source, in its benefits section; written for the flat bench and applied to the incline by inference. A failed-rep way out, not the normal set-down (c4)."
     ```
   - why: LR-30: no conflict; c5 is the bench failed-rep step.

63. **W2-49** · ruling · `shared/dumbbell-kickup.json` · `claims[id=c5].tags`
   - old:
     ```json
     ["WEAK"]
     ```
   - new:
     ```json
     ["MECH", "WEAK"]
     ```
   - why: LR-30: incline by inference.

64. **W2-49** · ruling · `shared/dumbbell-kickup.json` · `variants.bench.steps (append as the 5th step)` [reserved, opened by LR-30]
   - old: (none; append this entry at the end of the array (head has 4 entries))
   - new:
     ```json
     {"kind": "safety", "text": "Failed rep: drop the dumbbells out to your sides.", "claim": "c5"}
     ```
   - why: LR-30.

65. **W2-49+W2-11** · ruling · `shared/dumbbell-kickup.json` · `variants.seated.steps (append 3 steps after the c3 get-in step)` [reserved, opened by LR-30] [merged]
   - old: (none; append these entries, in order at the end of the array (head has 2 entries))
   - new:
     ```json
     [{"kind": "finish", "text": "After the set, bring each knee up in turn to catch them.", "claim": "c6"}, {"kind": "finish", "text": "Or have a spotter take one of them.", "claim": "c6"}, {"kind": "finish", "text": "Don't throw them from shoulder height onto the floor.", "claim": "c6"}]
     ```
   - why: LR-30's three c6 steps replace W2-11's two (ruling wins; same c6 content plus the don't-throw line). Seated then has 5 steps (limit 5, SETUP_MAX_STEPS); each step ≤12 words (SETUP_STEP_MAX_WORDS; D-LIB5-SPLIT): 12, 8 and 9 words by main's copy-lint words(), no BANNED hit.

66. **W2-49+W2-11** · ruling · `shared/dumbbell-kickup.json` · `gaps[0]` [merged]
   - old:
     ```json
     "No source names a wrong kick-up or set-down pose, so postureArchetype.wrong is null. The candidate \"never dropped out to the sides\" is unsupported, and one source allows it when stuck (c5)."
     ```
   - new:
     ```json
     "No source names a wrong kick-up pose or a wrong bench set-down. c6 names a wrong seated set-down (throwing the dumbbells from shoulder height onto the floor), shown as a seated finish step (LR-30), but postureArchetype is shared by both variants and its right pose is the bench kick-up (c1, c2), so postureArchetype.wrong stays null. The candidate \"never dropped out to the sides\" is unsupported, and one source allows it when stuck (c5). \"Never over the face\" (content.md 5.2) has no quote yet, so no line says it (LR-30)."
     ```
   - why: Merged: W2-11's corrected reason (c6 names a wrong seated set-down; wrong stays null) without its 'waits on the ruling' clause, plus LR-30's sentence.

67. **W2-49** · ruling · `shared/dumbbell-kickup.json` · `gaps[1]` [merged]
   - old:
     ```json
     "Seated set-down is now sourced (c6: knees up one at a time to catch the dumbbells, or a spotter takes one; one coach source, WEAK, applied to arnold_press by inference). The seated variant still has no finish step; adding one is outside W2A's scope (variants reserved). Until it is added, no seated way-out line is shown."
     ```
   - new:
     ```json
     "Seated set-down is sourced by one coach source (c6, WEAK; applied to arnold_press by inference) and shown as the seated finish steps (LR-30). A spotter way out for seated presses is sourced on the exercise cards (dumbbell_shoulder_press c7, arnold_press c10; ACE). No read source gives a seated failed-rep way out without a spotter, so none is shown here (LR-3)."
     ```
   - why: LR-30 text (final ruling: the spotter way out is sourced on the exercise cards; only the no-spotter gap is real); W2-11's gaps[1] is superseded.

68. **W2-49** · ruling · `shared/dumbbell-kickup.json` · `notes[5]`
   - old (exact head value; ruling gave an abbreviated old; exact head value shown):
     ```json
     "W2A 2026-10-17 conflict for a ruling: bb-db-shoulder-press (seated press, end of set) says \"There’s no reason to chuck them from shoulder height onto the floor.\" c5 (fv-db-bench, bench press, stuck rep) says \"This is less of an issue with dumbbells because, if you get stuck, you can simply drop the weights out to the side.\" content.md 5.2 also lists dumping dumbbells to the sides on the floor as a way out. Different exercises and situations; no shown line changed."
     ```
   - new:
     ```json
     "W2A 2026-10-17, ruled LR-30 (supervisor 2026-10-18): no conflict. bb-db-shoulder-press covers the normal set-down after a seated press (c6: \"There’s no reason to chuck them from shoulder height onto the floor.\"); fv-db-bench covers a stuck rep lying on a bench (c5: \"if you get stuck, you can simply drop the weights out to the side\"). c5 is the bench failed-rep step and c6 the seated finish steps. content.md 5.2's \"never over the face\" has no quote, so no line says it."
     ```
   - why: LR-30. The W2-11 notes line is not added: notes[5] now records the ruling. "There’s" keeps the source's U+2019, as in quotes/shared-dumbbell-kickup.json.

## `quotes/shared-dumbbell-kickup.json`

69. **W2-15** · low · `quotes/shared-dumbbell-kickup.json` · `quotes[7].note (claim c4, fv-db-bench)`
   - old:
     ```json
     "Source retrieved via WebFetch (direct curl blocked by Sucuri JS challenge); WebFetch confirmed this passage verbatim, keeping the source's own typo 'At the of your set'."
     ```
   - new:
     ```json
     "Re-checked by curl 2026-10-18 (desktop UA): the source URL answers HTTP 301 to https://fitnessvolt.com/dumbbell-bench-press-guide/, which returns HTTP 200 with the full page text; this passage matches verbatim, keeping the source's own typo 'At the of your set'."
     ```
   - why: WebFetch is not valid evidence; curl re-check confirms verbatim.

70. **W2-15** · low · `quotes/shared-dumbbell-kickup.json` · `quotes[8].note (claim c5, fv-db-bench)`
   - old:
     ```json
     "Source retrieved via WebFetch (direct curl blocked by Sucuri JS challenge); WebFetch confirmed this passage verbatim."
     ```
   - new:
     ```json
     "Re-checked by curl 2026-10-18 (desktop UA): the source URL answers HTTP 301 to https://fitnessvolt.com/dumbbell-bench-press-guide/, which returns HTTP 200 with the full page text; this passage matches verbatim."
     ```
   - why: Same.

## Added by the final rulings (w2-rulings-final.md)

### `cards/shoulder_press.json`

71. **W2-51** · ruling · `cards/shoulder_press.json` · `plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0]` [LR-31 step]
   - do: LR-31 step: the fetcher scans every read source of this card (curl, desktop UA; PubMed by efetch) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Set the top fault (plate.mistake and handlingMistakes[0]) by LR-31's steps and tie order; drawable is false for a fault whose only sign is speed; write plate.mistake.rankNote: "No source measures how often each fault happens." plus the step, the claim ids, and each frequency or harm quote about a fault that a step set aside, with why. A tie that LR-31's order leaves open: record it in rankNote and stop the card for a supervisor ruling. Report any change of pick or drawable in FIXED. No expected result is given for this card; report it.
   - why: LR-31 (W2-51) rollout: LB1 cards in W2 fix round 1.

### `cards/chin_up.json`

72. **W2-51** · ruling · `cards/chin_up.json` · `plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0]` [LR-31 step]
   - do: LR-31 step: the fetcher scans every read source of this card (curl, desktop UA; PubMed by efetch) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Set the top fault (plate.mistake and handlingMistakes[0]) by LR-31's steps and tie order; drawable is false for a fault whose only sign is speed; write plate.mistake.rankNote: "No source measures how often each fault happens." plus the step, the claim ids, and each frequency or harm quote about a fault that a step set aside, with why. A tie that LR-31's order leaves open: record it in rankNote and stop the card for a supervisor ruling. Report any change of pick or drawable in FIXED. Expected: step 3, the pick stays (c6).
   - why: LR-31 (W2-51) rollout: LB1 cards in W2 fix round 1.

73. **W2-53** · ruling · `cards/chin_up.json` · `sources (append bullbar-calluses)` [conditional]
   - do: Only if the fetcher confirms the hand-contact quote (item 30's way (1)); otherwise skip.
   - old: (none; append this entry at the end of the array (head has 11 entries))
   - new:
     ```json
     {"id": "bullbar-calluses", "url": "https://bullbarfit.com/blogs/q-as/what-is-the-correct-way-to-grip-the-bar-to-avoid-calluses", "title": "How to Grip the Bar Without Getting Calluses (Bullbar Fit, manufacturer blog)", "kind": "coach", "year": null, "pmid": null, "access": "full", "checked": "<YYYY-MM-DD>"}
     ```
   - why: LR-34 way (1): source of c25. Fill checked with the fetcher's run date.

74. **W2-53** · ruling · `cards/chin_up.json` · `claims (append new c25 after c24)` [fetcher] [conditional]
   - do: Only if the fetcher confirms the hand-contact quote (item 30's way (1)); otherwise skip.
   - old: (none; append this entry at the end of the array (head has 24 entries))
   - new:
     ```json
     {"id": "c25", "text": "Hand contact: a manufacturer blog says that when you hang, the bar sits just below the base of the fingers, where the fingers meet the palm. Written for a palms-away hang (a callus blog) and applied to the chin-up by inference; weak evidence.", "tags": ["MECH", "WEAK"], "sources": ["bullbar-calluses"], "quotes": [{"source": "bullbar-calluses", "text": "When you hang, the bar should sit just below the base of your fingers—where your fingers meet your palm.", "where": "1. The Grip: Hook, Don't Crush"}]}
     ```
   - why: LR-34 way (1), tagged MECH and WEAK as the ruling says. Keep the em dash (U+2014) in 'fingers—where' (curl 2026-10-18).

75. **W2-53** · ruling · `cards/chin_up.json` · `grip.claims` [conditional]
   - do: Only if the fetcher confirms the hand-contact quote (item 30's way (1)); otherwise skip.
   - old:
     ```json
     ["c1", "c2", "c3", "c20", "c21"]
     ```
   - new:
     ```json
     ["c1", "c2", "c3", "c20", "c21", "c25"]
     ```
   - why: grip.handContact cites c25 (item 30).

76. **W2-53** · ruling · `cards/chin_up.json` · `zooms[key=hand].claim (zooms[0])` [conditional]
   - do: Only if the fetcher confirms the hand-contact quote (item 30's way (1)); otherwise skip.
   - old:
     ```json
     ["c3", "c1", "c20"]
     ```
   - new:
     ```json
     ["c3", "c1", "c20", "c25"]
     ```
   - why: The zoom's new words cite c25 (item 32); replaces superseded W2-5.

77. **W2-53** · ruling · `cards/chin_up.json` · `gaps (append: chalk)` [LR-34 step]
   - do: Chalk is sourced by bullbar-calluses ("Use chalk (magnesium carbonate) on your hands before every set.", section "4. The Secret Weapon: Chalk and Hand Care"), but chin_up's setup has 5 of 5 steps (SETUP_MAX_STEPS), so it is not shown.
   - old: (none; append this entry at the end of the array (head has 2 entries))
   - new:
     ```json
     "Chalk: sourced (bullbar-calluses), no setup slot."
     ```
   - why: LR-34 way (1) outcome for the chalk entry (final ruling text).

78. **W2-53** · ruling · `cards/chin_up.json` · `gaps (append: fixed bar and bar height)` [LR-34 step]
   - do: Applies when item 33's way (1) finds no quote (expected). chin_up is tier A, so the supervisor adds "bar fixed" to the owner's tier-A gap list.
   - old: (none; append this entry at the end of the array)
   - new:
     ```json
     "Tier A: no sourced line that the bar is fixed and dry or high enough for the feet to clear the floor; the pull_up card does not source them, and catalyst-pullup and bullbar-calluses do not say them (LR-34). Left out, not invented."
     ```
   - why: LR-34 way (3) for the failed setup entries (no shown line restates them).

### `cards/hanging_knee_raise.json`

79. **W2-51** · ruling · `cards/hanging_knee_raise.json` · `plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0]` [LR-31 step]
   - do: LR-31 step: the fetcher scans every read source of this card (curl, desktop UA; PubMed by efetch) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Set the top fault (plate.mistake and handlingMistakes[0]) by LR-31's steps and tie order; drawable is false for a fault whose only sign is speed; write plate.mistake.rankNote: "No source measures how often each fault happens." plus the step, the claim ids, and each frequency or harm quote about a fault that a step set aside, with why. A tie that LR-31's order leaves open: record it in rankNote and stop the card for a supervisor ruling. Report any change of pick or drawable in FIXED. Expected: step 3, the pick stays (c4).
   - why: LR-31 (W2-51) rollout: LB1 cards in W2 fix round 1.

80. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `sources (append bullbar-calluses)` [conditional]
   - do: Only if the fetcher confirms the quote (items 44-46's way (1)); skip a claim whose quote is not confirmed (the other keeps its id; ids are never reused).
   - old: (none; append this entry at the end of the array (head has 8 entries))
   - new:
     ```json
     {"id": "bullbar-calluses", "url": "https://bullbarfit.com/blogs/q-as/what-is-the-correct-way-to-grip-the-bar-to-avoid-calluses", "title": "How to Grip the Bar Without Getting Calluses (Bullbar Fit, manufacturer blog)", "kind": "coach", "year": null, "pmid": null, "access": "full", "checked": "<YYYY-MM-DD>"}
     ```
   - why: LR-34 way (1): source of c17 and c18. Fill checked with the fetcher's run date.

81. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `claims (append new c17, c18 after c16)` [fetcher] [conditional]
   - do: Only if the fetcher confirms the quote (items 44-46's way (1)); skip a claim whose quote is not confirmed (the other keeps its id; ids are never reused).
   - old: (none; append these entries, in order at the end of the array (head has 16 entries))
   - new:
     ```json
     [{"id": "c17", "text": "Hand contact: a manufacturer blog says that when you hang, the bar sits just below the base of the fingers, where the fingers meet the palm. Written for a dead hang (a callus blog) and applied to the knee-raise hang by inference; weak evidence.", "tags": ["MECH", "WEAK"], "sources": ["bullbar-calluses"], "quotes": [{"source": "bullbar-calluses", "text": "When you hang, the bar should sit just below the base of your fingers—where your fingers meet your palm.", "where": "1. The Grip: Hook, Don't Crush"}]}, {"id": "c18", "text": "Width: a manufacturer blog gives a shoulder-width grip with the palms facing away for dead hangs. Written for a dead hang (a callus blog) and applied to the knee-raise hang by inference; weak evidence.", "tags": ["MECH", "WEAK"], "sources": ["bullbar-calluses"], "quotes": [{"source": "bullbar-calluses", "text": "For dead hangs or carries: shoulder-width, palms facing away (pronated grip).", "where": "2. The Grip Width: Shoulder-Width or Slightly Wider"}]}]
     ```
   - why: LR-34 way (1), tagged MECH and WEAK as the ruling says. Keep the em dash (U+2014) in 'fingers—where' (curl 2026-10-18).

82. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `grip.claims` [conditional]
   - do: Only if the fetcher confirms the quote (items 44-46's way (1)); skip a claim whose quote is not confirmed (the other keeps its id; ids are never reused).
   - old:
     ```json
     ["c2", "c3", "c16"]
     ```
   - new:
     ```json
     ["c2", "c3", "c16", "c17", "c18"]
     ```
   - why: grip.handContact and grip.width cite c17 and c18 (items 45, 44).

83. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `zooms[key=hand].claim (zooms[0])` [conditional]
   - do: Only if the fetcher confirms the hand-contact quote (item 46's way (1)); otherwise skip.
   - old:
     ```json
     ["c16", "c2", "c3"]
     ```
   - new:
     ```json
     ["c16", "c2", "c3", "c17"]
     ```
   - why: The zoom's new words cite c17 (item 46); replaces superseded W2-5.

84. **W2-53** · ruling · `cards/hanging_knee_raise.json` · `feel.rows[3].claim (only if item 41 stops the card)` [conditional]
   - do: Apply only if item 41 stops the card: the active-hang entry stays and becomes inherit[2] under item 43's fallback. If item 41 sources the fix, item 41 sets this claim instead.
   - old:
     ```json
     ["c15", "inherit:5"]
     ```
   - new:
     ```json
     ["c15", "inherit:2"]
     ```
   - why: Re-index after item 43's fallback; the row stays as on the head (LR-34 stop rule).

### `quotes/chin_up.json`

85. **W2-53** · ruling · `quotes/chin_up.json` · `sources (append bullbar-calluses)` [conditional]
   - do: Only if the fetcher confirms the hand-contact quote (item 30's way (1)); otherwise skip.
   - old: (none; append this entry at the end of the array (head has 11 entries))
   - new:
     ```json
     {"id": "bullbar-calluses", "access": "full", "fixes": null}
     ```
   - why: Quotes file follows the card.

86. **W2-53** · ruling · `quotes/chin_up.json` · `quotes: insert after the last c24 entry` [fetcher] [conditional]
   - do: Only if the fetcher confirms the hand-contact quote (item 30's way (1)); otherwise skip.
   - old: (none; insert right after the last `c24` entry, head index 34)
   - new:
     ```json
     [{"claim": "c25", "source": "bullbar-calluses", "quote": "When you hang, the bar should sit just below the base of your fingers—where your fingers meet your palm.", "status": "verbatim", "closest": null}]
     ```
   - why: Quotes file follows the card.

### `quotes/hanging_knee_raise.json`

87. **W2-53** · ruling · `quotes/hanging_knee_raise.json` · `sources (append bullbar-calluses)` [conditional]
   - do: Only if the fetcher confirms the quote (items 44-46's way (1)); skip a claim whose quote is not confirmed (the other keeps its id; ids are never reused).
   - old: (none; append this entry at the end of the array (head has 8 entries))
   - new:
     ```json
     {"id": "bullbar-calluses", "access": "full", "fixes": null}
     ```
   - why: Quotes file follows the card.

88. **W2-53** · ruling · `quotes/hanging_knee_raise.json` · `quotes: insert after the last c16 entry (c17, then c18)` [fetcher] [conditional]
   - do: Only if the fetcher confirms the quote (items 44-46's way (1)); skip a claim whose quote is not confirmed (the other keeps its id; ids are never reused).
   - old: (none; insert right after the last `c16` entry, head index 26)
   - new:
     ```json
     [{"claim": "c17", "source": "bullbar-calluses", "quote": "When you hang, the bar should sit just below the base of your fingers—where your fingers meet your palm.", "status": "verbatim", "closest": null}, {"claim": "c18", "source": "bullbar-calluses", "quote": "For dead hangs or carries: shoulder-width, palms facing away (pronated grip).", "status": "verbatim", "closest": null}]
     ```
   - why: Quotes file follows the card.

### `cards/assisted_pull_up.json`

89. **W2-51** · ruling · `cards/assisted_pull_up.json` · `plate.mistake.drawable`
   - old:
     ```json
     true
     ```
   - new:
     ```json
     false
     ```
   - why: LR-31 step 1: "Most people let the machine pull them back up too quickly" (c16) is a frequency hit for the fast lowering, a fault whose only sign is speed, so it is never drawable.

90. **W2-51** · ruling · `cards/assisted_pull_up.json` · `plate.mistake.why`
   - old:
     ```json
     "Listed first among the machine's common mistakes and named by NASM; the anchor says full range builds full strength. Frequency is not measured."
     ```
   - new:
     ```json
     "Most people let the machine pull them back up too quickly, and dropping too fast at the bottom is named a shoulder impingement risk (c16). A fault seen only as speed cannot be drawn in a still plate, so the plate draws partial reps, first on the manufacturer's common-mistakes list (c8). Frequency is not measured."
     ```
   - why: LR-31. plate.mistake.what and .claim are unchanged.

91. **W2-51** · ruling · `cards/assisted_pull_up.json` · `plate.mistake.rankNote (add after drawable)`
   - do: The fetcher confirms the two set-aside phrases on bullbar-assist-safety (curl, desktop UA) before push.
   - old: (key absent on the head; add it)
   - new:
     ```json
     "No source measures how often each fault happens. LR-31 step 1: \"Most people let the machine pull them back up too quickly\" (c16), a speed fault, so drawable is false. The drawn fault, by the same steps: partial reps, first on the beginner guide's common-mistakes list (c8). Set aside: \"I see lifters every week ... bouncing through partial reps\" says how often the author sees it, not how many lifters do it; \"Most beginners set it too high\" is the assistance chosen, not a fault."
     ```
   - why: LR-31: every plate.mistake carries a rankNote.

92. **W2-51** · ruling · `cards/assisted_pull_up.json` · `handlingMistakes (reorder: fast drop first, then stopping short, then swinging; text unchanged)`
   - old:
     ```json
     [{"mistake": "Stopping short: not straightening the arms at the bottom, or not getting the chin over the bar.", "fix": "Full hang to chin over the bar, every rep. If you can't, add a little assistance.", "claim": ["c8", "c5"]}, {"mistake": "Swinging or using leg drive because the assistance is set too low.", "fix": "Add assistance until every rep is controlled.", "claim": "c5"}, {"mistake": "Dropping fast on the way down and letting the machine do the braking.", "fix": "Take three to four seconds to lower back to straight arms.", "claim": "c16"}]
     ```
   - new:
     ```json
     [{"mistake": "Dropping fast on the way down and letting the machine do the braking.", "fix": "Take three to four seconds to lower back to straight arms.", "claim": "c16"}, {"mistake": "Stopping short: not straightening the arms at the bottom, or not getting the chin over the bar.", "fix": "Full hang to chin over the bar, every rep. If you can't, add a little assistance.", "claim": ["c8", "c5"]}, {"mistake": "Swinging or using leg drive because the assistance is set too low.", "fix": "Add assistance until every rep is controlled.", "claim": "c5"}]
     ```
   - why: LR-31: handlingMistakes[0] is the top fault (the fast lowering, c16), which puts the impingement-risk fault first.

## Not to apply (superseded by a ruling; listed so the verify record is not applied twice)

- **W2-5** `cards/chin_up.json` `zooms[0].claim`: Superseded by W2-53/LR-34: the zoom drops 'bar across the top of the palm' and 'under'; c1 already backs 'thumb wrapped around the bar'. Do not apply.
- **W2-3/W2-6** `cards/hanging_knee_raise.json` `feel.rows[3].fix`: Superseded by W2-53's rows[3] instruction (the active hang fails under LR-34). Do not apply.
- **W2-5** `cards/hanging_knee_raise.json` `zooms[0].claim`: Superseded by W2-53/LR-34: the zoom drops 'bar across the base of the fingers'. Do not apply.
- **W2-11** `shared/dumbbell-kickup.json` `variants.seated.steps / gaps[0] / gaps[1] / notes (W2-11's own text)`: W2-49 ruling wins on the same fields.

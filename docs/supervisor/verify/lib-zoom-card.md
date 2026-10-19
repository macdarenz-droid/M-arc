Card LIB-ZOOM: a zoom view for a fault too small to see on the plate (owner decision 2026-10-18 ~16:10 UTC; D-LIB8-shrug)

id: LIB-ZOOM
model: claude-opus-5-5 (hard card: design note first)
mode: auto
branch: claude/lib-zoom (new), from origin/main once LB1 (#245) has merged; or from #245's head if the supervisor says so.
lane: a LIB builder slot. Not on LB1's path: LB1 merges with its 12 passing plates, and horizontal_leg_press follows in this card's PR.

**The owner's words** (2026-10-18, on the leg-press mockups, #245 6250897460):
> "I like with zoom view but dont put any angles. As people tend to ignore that since they would not follow."

He chose option A, the zoom view, for horizontal_leg_press. **No angle number appears in any zoom view.**

**The problem.** horizontal_leg_press's Mistake ("Knees locked") differs from the right end pose by 8.2 px. PQ-H3 needs 11.39 px. The drawing is true to the card, and is not exaggerated to pass (D-LIB8-shrug).

**Design note first (post it on the PR and wait for the ruling).** Compare two ways to give this fault a zoom view, and recommend one:
1. **An inline zoom circle on the plate**, as in LIB-9a's mockup: it magnifies the knee in the Mistake view. This is a new plate primitive in the library renderer (never vendor/**), and needs QA rules for its content (H1, F3 and placement inside the circle).
2. **The existing golden-B posture zoom** (`ZoomSpec` kind 'posture', src/howto/content-types.ts): a chip opens a Right/Wrong close-up in the plate box's place. It is already an approved convention (golden B "Look closer"), built by LIB-6 #181 for library rows.

For each option, state:
- what it reuses;
- what it adds to the renderer, QA and gate;
- how PQ-H3 is met without loosening. The fault must reach the same 11.39 px bar where the user sees it, for example measured at the zoom's own scale, and never by lowering the bar or exempting the plate;
- the effect on the 8's and LB1's bytes (none allowed);
- one 390 px render in Paper and Silent Black, normal and Mistake, beside the approved leg_press.

**Rules:**
- No angle text (a number with "°", or "degrees") inside a zoom view. Add a lint row that is red on a planted "15°".
- Labels in a zoom are words only, 1-3 words, as for plate labels.
- No card fact changes. The zoom shows the card's own poses, and the plate stays byte-identical outside the zoom.
- Nothing is loosened: H3's 11.39 px bar, every hard check, the envelope and the exemptions stay. A zoom that does not reach the bar at its own scale is red.
- **Owner answers, 2026-10-18 ~16:20 UTC ("1. A, 2. A"):**
  - 1a: leg_press_calf_raise is left out for now. It goes on the named list (plan: decided at the release candidate), with the toe-through-footplate reason and LIB-9a's renders. It is not in this card or in LB1.
  - 2a: "no angle numbers" applies to zoom views only. Plate labels keep their sourced angles, as in the 8 and LB1.

**Acceptance (after the ruling):**
- horizontal_leg_press passes all 10 hard checks with its zoom.
- The calibrated critic (lib4-cards 13.5's rule) scores it 4 or more on every item.
- The new primitive or wiring has its own tests and mutations, including the no-angle lint row.
- The 8's and LB1's pinned pages are byte-identical.
- A fresh Opus review.

**Supervisor amendment (2026-10-19 ~12:40 UTC; D-LIBZOOM-NOW).** Start now, so the small-motion plates stop queueing.
- **Base:** #245's head `38b436d58b60c80abc1683bca1c6c0fd169bd711` (the card's "or from #245's head" route). Merge origin/main into it first, with a merge commit. Merge #245's later heads the same way when they move. LIB-ZOOM merges only after LB1 (#245) is on main.
- **Wider design question, same note.** Five more plates are HELD for the same reason, a card-true motion too small for PQ-H3 at plate scale:
  - barbell_shrug (pilot A, #109 @ `48d49bb`; D-LIB8-shrug);
  - dumbbell_shrug and cable_shrug (LB3, LIB-13s, not drawn yet);
  - t_bar_row (LIB-13 #274: hand rise 10.8-12.1 cm; D-LIB13-TBAR);
  - crunch (LIB-11 #278: trace 9.4 px against 22.11, deviation 7.6 px against 11.39; D-LIB11-SMALL).
  The note shows that the recommended option meets **both** H3 bars at the zoom's own scale, the trace length (22.11 px) and the Mistake deviation (11.39 px). Give one 390 px render per motion class: knee lock (horizontal_leg_press), shoulder elevation (barbell_shrug, from #109's spec), short row rise (t_bar_row, from #274's spec) and blade lift (crunch, from #278's spec). Read the other lanes' specs with `git show`; never commit them here.
- **Scope of this PR stays horizontal_leg_press**, plus the convention, its QA rules and its tests. Once the convention is ruled, the other lanes draw their own held plates: LIB-8M or the ship card for barbell_shrug, LIB-13s for the shrugs and t_bar_row, LIB-11 for crunch.
- Owner rule unchanged: no angle number in any zoom view.

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
- The calf raise (leg_press_calf_raise) is not in this card unless the owner's answer to the 1a/1b question adds it.

**Acceptance (after the ruling):**
- horizontal_leg_press passes all 10 hard checks with its zoom.
- The calibrated critic (lib4-cards 13.5's rule) scores it 4 or more on every item.
- The new primitive or wiring has its own tests and mutations, including the no-angle lint row.
- The 8's and LB1's pinned pages are byte-identical.
- A fresh Opus review.

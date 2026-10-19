# LB3 research fix round: recheck

Verified head 14ca323b → fix head f4907abe (`git diff 14ca323b f4907abe -- docs/research/howto/`). Findings and R-LB3-1..8 from `origin/claude/sup-lib4-cards:docs/supervisor/verify/lb3-research-verify.md`, R-LB3-9 from the #272 comment of 2026-10-19 09:27. Paths below are under `docs/research/howto/` on f4907abe. Line numbers are in the fix-head files.

## Result
- 72 findings: 71 done, 1 partly, 0 not.
- Rulings R-LB3-2..9: 6 done, 2 partly (R-LB3-2 and R-LB3-9).
- Problems: 0 blocker, 0 high, 1 medium, 8 low.
- Re-fetch: 25 of 25 checks verbatim, each at most 50 words (the longest is 24). The 25 are 10 new quote texts, which cover all 14 new quote entries, and 15 new phrases quoted in notes, rankNotes and tempo.text. Sources: 14 pages fetched by curl with a desktop user agent, plus 1 PubMed abstract (Mayer 1999) through NCBI efetch.
- JSON: all 18 changed files parse, and so do the 2 unchanged quotes files.
- Claims match the quotes files one for one on all 10 cards (claim, source, text). Every cited claim id resolves. No source is orphaned, even if the stamp step drops unreferenced claims: mayer1999 and lee2018 are now cited.
- Copy patterns: I ran main's `copy-lint.mjs` exports (BANNED, CONTACT_RE, SOURCE_RE, SOURCE_CS_RE, SAFETY_LINE_RE, OWN_RED_FLAG) plus MEDICAL_RE, the sentence, caption and tell caps, and FIX_VERBS on every visible field of the 10 cards. They found 0 hits on the changed lines.
- The R-LB3-4 shoulder rows have no source, NHS, GP or referral wording in any shown field. NHS appears only in `claims[].sources/quotes` and `sources[]`, so LR-27 R4 holds.

## Finding → status

| finding | status | where (fix head) |
|---|---|---|
| dumbbell_romanian_deadlift-1 | done | cards/dumbbell_romanian_deadlift.json:732 (rows[2]); quote added to c10 at :231 |
| dumbbell_romanian_deadlift-2 | done | :573 |
| dumbbell_romanian_deadlift-3 | done | :659 (claim [c10, c5]) |
| dumbbell_romanian_deadlift-4 | done | :540 (plate.end); checkpoints and posture[2] claims |
| dumbbell_romanian_deadlift-5 | done | :569 (rankNote; the gaze is absent from Fitbod's list, checked on the page) |
| dumbbell_romanian_deadlift-6 | done | c24 at :517; zooms[0] cites c24. See low L7 |
| dumbbell_romanian_deadlift-7 | done | c13 text; c15 quote at :347 |
| dumbbell_romanian_deadlift-8 | done | :754 |
| dumbbell_romanian_deadlift-9 | done | notes :892 |
| landmine_row-1 | done | :589, :559 |
| landmine_row-2 | done | :669 and plate.mistake.claim [c9, c11]; rows[1] [c11, c5] |
| landmine_row-3 | done | :677 |
| landmine_row-4 | done | :766 |
| landmine_row-5 | done | :746 |
| landmine_row-6 | done | :750 |
| landmine_row-7 | done | notes :787 |
| one_arm_dumbbell_row-1 | done | :538 |
| one_arm_dumbbell_row-2 | done | c20 at :406; row at :700 |
| one_arm_dumbbell_row-3 | done | notes :743 (both quotes are verbatim) |
| one_arm_dumbbell_row-4 | done | :628 (as the critic wrote; see low L6) |
| one_arm_dumbbell_row-5 | done | :596, :530 |
| one_arm_dumbbell_row-6 | done | :722 |
| one_arm_dumbbell_row-7 | done | notes :744 |
| one_arm_dumbbell_row-8 | done | rear_delts in primary; libraryDiff.why :739 |
| one_arm_dumbbell_row-9 | done | notes :744 |
| pendlay_row-1 | done | quote added to c10 at :265 (see low L4) |
| pendlay_row-2 | done | :855 |
| pendlay_row-3 | done | :643 |
| pendlay_row-4 | done | :141 |
| pendlay_row-5 | done | :831 |
| pendlay_row-6 | done | :835 |
| pendlay_row-7 | done | notes :873 |
| t_bar_row-1 | done | :582 and plate.end |
| t_bar_row-2 | done | :675, :655 |
| t_bar_row-3 | done | notes :776 |
| t_bar_row-4 | done | :756 |
| t_bar_row-5 | done | :597 (BarBend's "multiple grip options ... wide ... narrow ... angled grip" is on the page) |
| t_bar_row-6 | done | :740 |
| t_bar_row-7 | done | notes :776 |
| back_extension-1 | done | :557; notes :791 (that note has an error, low L1) |
| back_extension-2 | done | :606 |
| back_extension-3 | done | :525 |
| back_extension-4 | done | c21 at :448; plate.tempo.claim [c8, c21] |
| back_extension-5 | done | rankNote :517 |
| back_extension-6 | done | notes :790 (the roll-up quotes are verbatim) |
| back_extension-7 | done | :561 (see low L5) |
| cable_shrug-1 | done | c17 at :363; row at :643 |
| cable_shrug-2 | done | :564; straight-bar convention in notes :692 |
| cable_shrug-3 | done | zooms[1] claim [c5, c3, c4] |
| cable_shrug-4 | done | :653 (R-LB3-3 wording, as ruled) |
| cable_shrug-5 | done | notes :692 |
| conventional_deadlift-1 | done | rankNote :611 |
| conventional_deadlift-2 | done | tempo.text :632 (pause 0) |
| conventional_deadlift-3 | done | :694; c11 quote at :273 |
| conventional_deadlift-4 | done | :678 |
| conventional_deadlift-5 | done | :790 |
| conventional_deadlift-6 | done | :810, :824 (claim [c1, c4, c7, c8]) |
| conventional_deadlift-7 | done | :794; notes :942 |
| conventional_deadlift-8 | done | :718 (glutes [c14, c16]) |
| conventional_deadlift-9 | done | notes :943 |
| dumbbell_shrug-1 | done | c19 at :383; row at :664 |
| dumbbell_shrug-2 | done | :257, :575 |
| dumbbell_shrug-3 | done | :517 |
| dumbbell_shrug-4 | done | :627 |
| dumbbell_shrug-5 | done | :674 (R-LB3-3 wording) |
| dumbbell_shrug-6 | done | notes :710 |
| sumo_deadlift-1 | done | :739 (Overhand dropped; inherit:0) |
| sumo_deadlift-2 | done | :538, :750. The rankNote still has the chest clause (low L3) |
| sumo_deadlift-3 | done | :380 |
| sumo_deadlift-4 | done | :32 |
| sumo_deadlift-5 | **partly** | rankNote :542 is missing StrengthLog's injury hit (low L2) |
| sumo_deadlift-6 | done | :724; notes :881 |

| ruling | status | notes |
|---|---|---|
| R-LB3-2 | **partly** | Done for back_extension, conventional and DB RDL. On sumo, the StrengthLog hits are incomplete (L2). |
| R-LB3-3 | done | Applied on all 8 cards that carry the line (the ruling said 7; the head has 8). |
| R-LB3-4 | done | See the R-LB3-4 section below. |
| R-LB3-5 | done | All 10 cards have the notes entry, wrist value included. |
| R-LB3-6 | done | conventional c16 fits feel.primary glutes. back_extension c17 is a weak fit on setup[2] (L5). |
| R-LB3-7 | done | Every remaining finding takes the critic's fix as written (sumo-5 is counted under R-LB3-2). |
| R-LB3-8 | done | The record is written, and "LB3 RESEARCH FIXED" is posted on #272 (twice, L8). I reproduced the record's checks. |
| R-LB3-9 | **partly** | The variantLine and the gap exist, but the line misreads c22 (medium M1). |

## Problems

### Medium
- **M1. back_extension `plate.variantLine` (cards/back_extension.json:539), with verify/lb3.md:22 and the #272 FIXED posts.**
  - **The problem:** the line says "StrengthLog calls this bench a back extension machine (c22)". c22's quote does not say that. It lists the bench and the machine as separate equipment: "can be performed on a mat or bench, or using a back extension machine", and the page goes on, "Each piece of equipment will offer a slightly different challenge". StrengthLog's intro calls the pictured kit "a bench like the one pictured above". This was the one new sourcing link R-LB3-9 asked for, and the record and the posts repeat the misreading.
  - **The fix:** base the link on quotes already on the card. StrengthLog's own steps call the bench "the machine": "First, adjust the machine" (c1), "Step onto the machine" (c3) and "hanging off the edge of the machine" (c4). Describe c22 as it reads: it lists bench and machine separately. Note that the library row's aliases ("hyperextension", "45 degree back extension") point to the 45-degree bench. Keep the seated-machine gap. Correct lb3.md:22 the same way.

### Low
- **L1. back_extension notes[1] (:791).**
  - **The problem:** the note says "the card follows StrengthLog and Physitrack (shoulder width, c3)". The Physitrack page gives no foot width. Its c3 quote is only "Bend your knees slightly and secure your feet, keeping them in line with your knees." FitnessVolt's "roughly hip width apart" is verbatim.
  - **The fix:** "The card follows StrengthLog (shoulder width, c3). Physitrack gives no width. FitnessVolt sets the feet roughly hip width apart."
- **L2. sumo_deadlift rankNote (:542), for sumo-5 and R-LB3-2.**
  - **The problem:** the StrengthLog deadlift injury hit "most powerlifting injuries seem to creep up over time, rather than being acute" is not set aside, although conventional's rankNote sets it aside. Neither is "the beginning of a deadlift is where most lifters get stuck and fail their lift". Both are verbatim on the page, and neither changes the pick. DB RDL's rankNote (c22 is sl-deadlift) has the same gap, which predates this round.
  - **The fix:** add both, with their reasons: one names no fault, the other is about where lifts fail.
- **L3. sumo_deadlift rankNote (:542).**
  - **The problem:** the rankNote still says "hips high with the chest down is a still sign". sumo-2 dropped that chest clause as unsourced.
  - **The fix:** "hips high is a still sign the side view shows".
- **L4. pendlay_row c10 text (:240).**
  - **The problem:** this round edited c10's text but kept "heels lifting mid-lift usually means the weight is too heavy". The quote says only "If your heels are losing contact with the floor mid-lift, consider using lighter weights." This is the same overstatement pendlay-4 fixed on c6. The text is not shown.
  - **The fix:** "heels lifting mid-lift: use a lighter weight."
- **L5. back_extension setup[2] (:561), for R-LB3-6.**
  - **The problem:** the line cites c17 (Mayer 1999) next to "hands behind the head is harder". The efetch abstract says only that EMG "increased progressively among hand positions" and never names the positions or their order. The line's words come from c4, so it passes.
  - **The fix:** acceptable as it stands. Optionally, cite c17 where the Roman chair angle is drawn (plate.equipment) instead.
- **L6. one_arm_dumbbell_row handlingMistakes[0] (:628).**
  - **The problem:** the line cites c14, which is a WEAK tempo-convention claim, for the shown "Pull slowly". c6's quote has the same words ("slowly pull the dumbbell upwards") and is CONSENSUS. The round applied the critic's wording as written.
  - **The fix:** claim ["c10", "c6", "c8"]. Then the shown line carries no drawing-convention tag (LR-33's intent).
- **L7. dumbbell_romanian_deadlift inherit[0] (:16) and grip.thumb "(inherited)" (:597).**
  - **The problem:** both stay although c24 now sources the thumb on the card itself (LR-34 way 1), and grip.claims lacks c24. Nothing shown is affected.
  - **The fix:** drop inherit[0], or say it is kept, and add c24 to grip.claims.
- **L8. Cosmetic.**
  - **The problem:** "LB3 RESEARCH FIXED" was posted twice on #272 (09:29 and 09:30). In the lb3.md table, the R-LB3-9 row sits between sumo_deadlift-5 and sumo_deadlift-6.
  - **The fix:** a tidy-up only.

### Information (not counted)
- one_arm_dumbbell_row `plate.mistake.what` (:538) is now one 19-word sentence. That is the critic's text. plate.mistake is plate data, not one of LR-27's shown fields, so this only matters if a sheet ever shows it (15-word cap).

## Changed lines with no finding behind them
- On one_arm rows[3], dumbbell_shrug rows[2] and cable_shrug rows[2], `where` changed from "Shoulder pain" to "Pain in your shoulder". This matches the back rows' pattern ("Pain in your back while rowing"). It is part of the R-LB3-4 row rewrite, and it passes the copy patterns.
- Every other changed line maps to a finding or to R-LB3-3/4/5/6/9. That includes the source entries for nhs-shoulder-pain and baechle-grip, the notes, the gaps entry, the claim-text tidy-ups (pendlay c10, DB RDL c13, dumbbell_shrug c13) and one_arm's feel.secondary reorder.

## R-LB3-4: do the NHS quotes support the stop line?
- **The answer:** yes. Both quotes are verbatim (10 and 13 words) on https://www.nhs.uk/conditions/shoulder-pain/, under "How to ease shoulder pain yourself", in the "Don't" list:
  - "do not do things that seem to make it worse" supports "Stop the set" once the row asks "Is it getting worse?";
  - "do not make up your own strenuous exercises or use heavy gym equipment" supports "Don't train through the pain" in a gym.
- **The tags:** the claims are tagged MECH and say "applied here to training". The page is self-care advice for existing shoulder pain, not for pain that starts during a set.
- **One nuance:** the same "Don't" list opens with "do not completely stop using your shoulder – this can stop it getting better". The shown line stops only the set, so it does not conflict. Optionally, record that line in the three claims or notes, so a later writer never widens the line to "stop using the shoulder".
- **Data only (LR-27 R4):** the row text carries no source wording. NHS stays in claim.sources and quotes. The rows link the shared box with `redFlag: "shoulder"`, and the box's NHS "See a GP if: shoulder pain is getting worse" trigger is left to the box.

## Re-fetch detail (25 of 25 verbatim)
- **New quote entries (10 texts, 14 entries):**
  - sl-back-extension c21 and c22;
  - nhs-shoulder-pain ×2 (on 3 cards each);
  - sl-deadlift: the conventional c11 knee-bend quote;
  - sweat-db-rdl: c10 (strength ... hamstrings and glutes) and c15 (Keep them straight ...);
  - baechle-grip: DB RDL c24;
  - ggr-pendlay: c10 (firmly planted);
  - barbend-sumo: c17 (Everything from your foot angle ...).
- **Phrases quoted in notes, rankNotes and tempo.text (15):**
  - sl-dumbbell-row: "let your scapula slide forward ...";
  - ACE: "without allowing your torso to rotate ...";
  - sl-back-extension: "roll-up" and "creating a rolling or wave-like motion in your spine";
  - FitnessVolt: "there should be minimal to no back rounding";
  - sl-deadlift: the dead start, "Most powerlifters set the bar down ...", the touch-and-go line (verbatim, the page's own wording "risk of sustaining with"), "swift increases ...", "The mixed grip ...", "the most common sticking point ..." and "Inhale, brace your core, and lift the bar";
  - NHS back: "Back pain, particularly lower back pain, is very common." and "A common cause of back pain is an injury like a pulled muscle (strain).";
  - Sweat: "your neck will become strained and arched".
- **Context checks:**
  - Fitbod's "Common Form Mistakes" lists Going too Low and Rounding Your Back, with no gaze.
  - BarBend's T-bar page names wide, narrow and angled grips.
  - FitnessVolt says hip width.
  - Physitrack gives no width.
  - StrengthLog separates "bench" from "back extension machine" (M1).
  - The NHS shoulder "Don't" list is as quoted above.

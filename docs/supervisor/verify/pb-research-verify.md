Pilot B research verify (LR-29, focused) on #277 @ 632cfbae: result, rulings and findings (2026-10-19)

## Run
- A history-free copy of the 7 cards and their quotes, with 2 supervisor plants inside the changed fields (one a tier-A safety line on smith). One fresh blind Opus verifier re-fetched every source (20 web pages, 10 PubMed abstracts) and redid LR-31 and LR-33 on all 7.
- **VALID**: both plants were caught as blockers, the tier-A one among them. 263/263 quotes verbatim.
- Supervisor 10 % re-fetch: 18 of 180 quotes (seeded sample), 18/18 verbatim. 4 needed a raw-HTML check because an inline link or bold label splits the text; all 4 are verbatim.
- LR-31: the verifier agrees with all 7 picks (smith 3, cable_fly 2, push_up 1, seated_leg_curl 2, crunch 1, side_plank 3, russian_twist 2). LR-33: agrees on 6; smith has one medium (below).
- Real findings, plants removed: 0 blocker, 0 high, 2 medium, 10 low.

## Rulings (R-PB-1 to R-PB-4)
- **R-PB-1.** The 2 plant findings are not on the real head.
- **R-PB-2.** All 7 picks stand, cable_fly included: its step-2 list tie-break is the reading the verifier also took. Its rankNote keeps the other reading named.
- **R-PB-3.** Every medium and low below: apply the verifier's fix as written. A fix that adds a quote fetches it verbatim (at most 50 words) and adds it to quotes/<id>.json. On smith's tempo, Motra's "2-1-1" becomes a WEAK tempo claim, because the page does not define the digit order. The bottom pause is named in tempo.text, and plate.tempo.pause stays 0 (LR-33: it is not after the concentric).
- **R-PB-4.** One round only. Before pushing: the dry run; copy lint and C8 at 0 hits on the changed lines; every new quote re-fetched. Then post 'PB RESEARCH FIXED @ <sha>'. The supervisor checks the diff and merges #277; its merge sha is 'PILOT B research head'.

## Findings (id-n, severity, field: problem. Fix)

**smith_machine_bench_press**
- smith_machine_bench_press-1 (medium) `plate.tempo.text`: It says Motra's bottom pause has 'no seconds' and that up and down rest only on ACSM (WEAK). The same anchor page lists a 2-1-1 tempo. LR-33 says a pause elsewhere in the rep is named 'with its sourced seconds if any', and LR-15 drops the WEAK-only basis once a novice-level tempo source is cited. Fix: Add a tempo claim that quotes Motra's '2-1-1', tagged WEAK because the page does not define the digit order, and cite it in plate.tempo.claim. Then say in tempo.text that, read as lower-pause-press, it gives the bottom pause 1 s and backs down 2 and up 1. Keep up 1, down 2 and pause 0.
- smith_machine_bench_press-2 (low) `handlingMistakes[1].fix`: 'Use lighter weights until you can press with good form.' is a general start-light cue from c6. No quote says lighter loads fix the arch, and the line does not tell the lifter how to avoid arching. Fix: Either keep it as a general cue, or add Motra's 'Chest up, ribs down' as a quote and write a direct arch fix, such as 'Keep your ribs down; don't over-arch.'
- smith_machine_bench_press-3 (low) `plate.mistake.rankNote`: Step 2 does not record Motra's Safety Notes line on bouncing. The line names no harm (it is a heading read onto an item, just as LR-31 treats a 'common mistakes' heading), so step 3 stands. If it were read as a harm tie, step 2 would make bouncing handlingMistakes[0]; bouncing shows only as speed, so the plate would still draw the flared elbows. Fix: Add it to step 2's set-aside list, with the reason: no harm word.

**seated_leg_curl**
- seated_leg_curl-1 (medium) `plate.mistake.why`: 'pointing the toes recruits the hamstrings and spares the calves' has no quote in c10, and it overstates the source, which says 'more likely to'. Fix: Add this quote to c10 and to the quotes file, and write 'pointing the toes makes you more likely to recruit the hamstrings and spare the calves'.
- seated_leg_curl-2 (low) `handlingMistakes[1].fix`: 'set both pads' (and 'pads' in the mistake line) is not in the cited claims. c9 names 'the leg pad and seat height', and c1 names the knees and the joint. Fix: "Line your knees up with the pivot; set the seat and leg pad." Or cite c2 and c3 if the thigh and ankle pads are meant.
- seated_leg_curl-3 (low) `plate.mistake.rankNote`: The ankle-pad item is dropped as 'a pad setting and not a fault (R-LB2-12)', but handlingMistakes[1] keeps another setup item ('Seat and pads not set to your body'). The stated reason fits both items equally. Fix: State the real reason for keeping [1] and dropping the ankle pad (for example: the cap of 3, and the seat-and-pad line covers it), or apply the same rule to both.

**crunch**
- crunch-1 (low) `plate.tempo.text`: The words 'slowly uncurl' are credited to (c5, c11), but they are only in c5. c11's quote is 'very slow, deliberate reps'. Fix: Write '"slowly uncurl" (c5) and "very slow, deliberate reps" (c11)'.
- crunch-2 (low) `plate.mistake.rankNote`: The sentence quoted as tying neck pulling to strain is about the shoulder fault. The neck link is BarBend's heading 'Straining Your Neck'. The pick is unaffected. Fix: Quote the heading as the neck-strain item, or say the sentence names neck strain as a mistake.

**side_plank**
- side_plank-1 (low) `handlingMistakes[1].fix`: 'Lift your hips back in line' uses c2's straight line, but c2 is not cited. c5 and c9 do not say 'line'. Fix: Add c2 to the line's claim, or write 'Lift your hips back up' (c5).
- side_plank-2 (low) `plate.tempo.text`: 'built a few seconds at a time toward 30-60 s per side' merges two quotes. The few-seconds build goes toward 30 or 45 s; 30-60 s is a separate aim. Fix: Write '5-15 s for some, built a few seconds at a time toward 30-45 s; aim for 30-60 s per side (c9)'.

**russian_twist**
- russian_twist-1 (low) `handlingMistakes[0].mistake`: 'Fast, jerky twists.' calls speed itself a mistake. The sources fault a lack of control, and c7 makes explosive twists a progression once reps are controlled. Fix: "Twisting without control." (c5, c8). Keep the fix as it is.
- russian_twist-2 (low) `plate.mistake.rankNote`: The step-3 count for the next fault leaves out the back instruction. StrengthLog's straight back and BarBend's erect torso give it two sources too, if instructions count, which could tie it with the hips. LR-36 settles any such tie for the hips (viewWhy), so the pick is unchanged, but the rankNote does not show this. Fix: Add the back count to the rankNote and say that, if it ties, LR-36 keeps the hips because viewWhy names them.

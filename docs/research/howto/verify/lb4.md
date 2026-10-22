# LB4 research verify (lb4): record

Record of the LR-29 verify of the 14 LB4 cards (#285) and its one fix round. Source: docs/supervisor/verify/lb4-research-verify.md @ db673722 (claude/sup-lib4-cards).

## Run
- Verified head: #285 @ 083a8e12. The supervisor made a history-free copy of the 14 cards and their quotes and split it into three blind groups. Each group had one fresh Opus critic and 2 supervisor plants, one of them a safety plant. The critics re-fetched every source with curl (PubMed through NCBI efetch).
- h1 (front_squat, goblet_squat, bodyweight_squat, wall_sit, step_up): VALID, both plants caught as blockers. 25 sources, 119/120 quotes verbatim (the miss is a plant).
- h2 (pistol_squat, box_jump, jump_squat, bulgarian_split_squat, walking_lunge): VALID, plants caught as blocker and high. 22 sources, 124/124 quotes verbatim.
- h3 (reverse_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat): VALID, both plants caught as blockers. 14 sources, 77/77 quotes verbatim.
- On the head, all 321 quotes are verbatim in their words; 5 differed from the page only in quote-mark characters (R-LB4-5).
- Supervisor 10 % re-fetch: 6/6 verbatim, drawn from the 53 quotes in the two quote files #285 changes.
- LR-31: the critics agree with all 14 picks under the supervisor's positions (R-LB4-2 to R-LB4-4). LR-33: they agree on all 14 tempos (up, down and pause null; every pause named in tempo.text).
- Real findings, plants removed: 0 blocker, 1 high, 6 medium, 39 low.

## Rulings
- R-LB4-1: the 6 plant findings, and the 2 that rest on a plant or the scrub (step_up risks; bodyweight_squat's LR-36 wording), are not on the real head. No action.
- R-LB4-2: reverse_lunge keeps its step-2 pick under D-SUP-PROTECT (the flared ribcage, drawable true); "Another common error is doing reverse lunges too fast." stays set aside at step 1. Follow-up F-LB4-1: lib-14-card.md:127 still says the flared ribcage is drawable false.
- R-LB4-3: reading A. Catalyst's "Many athletes try to load lunges too heavily and lose the position in which the exercise will be most effective." is about the load chosen and names no single fault; the four lunge rankNotes quote it in full with this reason.
- R-LB4-4: reading A. Step 2's tie-break counts a common-mistakes list from any read source; jump_squat's NASM box-jump quote is now its own MECH claim, j18.
- R-LB4-5: quotes copy the page's quote-mark characters (pistol_squat p7 ×2, box_jump c7, reverse_lunge c6, c16), in the card and the quotes file.
- R-LB4-6: every other finding takes the fix as written; walking_lunge-3's loadProgression fix also applies to reverse_lunge and forward_lunge. Changes to box_jump and reverse_lunge shown text join the pilot A shown-copy list (D-SUP-LB4-PACOPY).
- R-LB4-7: one round only.

## Fix round checks
- Valid JSON: all 28 files.
- Dry run: 0 errors on 14 cards. Claims match the quotes files one for one, there is no orphan source, LR-22 holds, every quote is at most 50 words, 328/328 quotes verbatim on pages fetched by curl on 2026-10-22, and every phrase quoted in a rankNote, tempo.text or plate.mistake.why is on its page. A strict check of the 17 quotes holding quote marks finds every character as on the page.
- CARD-V2 shape check: 0 errors.
- Copy lint (main's lintHowto) and C8 (checkC8 wording and claims): 0 hits on the 14 cards.
- New quotes, re-fetched fresh by curl and verbatim: goblet_squat g12 (hackett-2013), pistol_squat p10 (rep-pistol, full adductor sentence), box_jump c17 (nasm-boxjump step 4), jump_squat j18 (nasm-boxjump), forward_lunge c8 (goulette-2021) and c12 (bezerra-2021 ×2), bodyweight_split_squat c1 (cat-splitsquat): 8/8.
- New claims: box_jump c17, jump_squat j18.

## Pilot A shown-copy changes in this round (for the owner's re-approval sheet; #109 untouched)
| id | field | old | new |
|---|---|---|---|
| box_jump | feel.rows[1].where | Sharp knee pain or giving-way knee | Very painful, locking or giving-way knee |
| box_jump | feel.rows[2].where | Bad-landing ankle pain, or can't walk | Severe ankle pain, or can't walk |
| reverse_lunge | loadProgression | Start light or unloaded. Add weight only while the step stays full and the descent smooth. | Add weight only while the step stays full and the descent smooth. |

## Finding → fix
All fixes are in the fix-round commit named on #285 as "LB4 RESEARCH FIXED".

| finding | sev | fix |
|---|---|---|
| bulgarian_split_squat-1 | high | zooms[0].wrong null, wrongNote deleted (LR-25) |
| wall_sit-1 | medium | handlingMistakes[2] "Back leaving the wall." / "Keep your back and buttocks on the wall." (w5) |
| jump_squat-1 | medium | feel.rows[1] "Knees" / "Fault: locked knees or knees shooting far forward on landing." / "Land softly, hips back. Make the jumps smaller." [j5, j6, j4, j7] |
| jump_squat-2 | medium | handlingMistakes[0] "Landing with locked knees." [j5, j4]; rankNote names it the top fault |
| jump_squat-3 | medium | new claim j18 (CONSENSUS, MECH, nasm-boxjump); rankNote cites j18 (R-LB4-4) |
| bodyweight_lunge-1 | medium | "slight" dropped from c5.text, posture[2], checkpoints[2].what, zooms[1].right and plate.end |
| bodyweight_split_squat-1 | medium | loadProgression "Move smoothly with no crash into the bottom. With dumbbells or other implements, do sets of 5-10." [c6, c8] |
| front_squat-1 | low | rankNote: knee cave and back rounding lose on source count, 2 to 1; back-squat, rack and spotter frequency lines set aside; unsourced[3] reworded |
| front_squat-2 | low | zooms[1] [c6, c7] |
| front_squat-3 | low | setup[0] drops "before loading" |
| goblet_squat-1 | low | rankNote sets aside NASM's two "reduces lower back stress" benefit lines |
| goblet_squat-2 | low | plate.mistake.what leads with the forward lean |
| goblet_squat-3 | low | g12 gains hackett-2013's "health risks ... remain unconfirmed." |
| goblet_squat-4 | low | gaps: goblet-squat load progression |
| bodyweight_squat-1 | low | setup[1] [b1, b2]; zooms[1] [b6, b4, b7] |
| bodyweight_squat-2 | low | feel.rows[0].where "Thighs and buttocks" |
| wall_sit-2 | low | feel.rows[0].where "Front of the thighs" |
| wall_sit-3 | low | setup[1] [w2, w3]; checkpoints[2] [w2, w7] |
| step_up-1 | low | setup[3] [c8, c2] |
| pistol_squat-1 | low | zooms[1].wrong null, wrongNote deleted (LR-25) |
| pistol_squat-2 | low | setup[2] [p1, p5] |
| pistol_squat-3 | low | p10's third quote is the full adductor sentence (card and quotes file) |
| pistol_squat-4 | low | feel.rows[1] [p9, p7] |
| pistol_squat-5 | low | zooms[0] [p3, p8]; wrong "Heel lifted." |
| pistol_squat-6 | low | p7 quotes copy "you’re" (R-LB4-5) |
| box_jump-1 | low | new claim c17 (NASM step 4); setup[4] [c6, c17]; text unchanged |
| box_jump-2 | low | setup[0] [c1, c7, c8]; setup[3] [c3, c4, c5] |
| box_jump-3 | low | rankNote quotes c11's fatigue line and sets it aside as a training state |
| box_jump-4 | low | feel.rows[1].where and [2].where reworded (pilot A list) |
| box_jump-5 | low | c7 copies "it’s" (R-LB4-5) |
| jump_squat-4 | low | handlingMistakes[1] [j6, j4] |
| jump_squat-5 | low | zooms[0] [j4, j5] |
| bulgarian_split_squat-2 | low | loadProgression "Sets of 8-15 smooth reps. Sets of 3-6 only with full control of the position." |
| walking_lunge-1 | low | rankNote quotes Catalyst's full sentence with R-LB4-3's reason and adds ACE's stance-foot line to the tie; same sentence on reverse_lunge, forward_lunge, bodyweight_lunge |
| walking_lunge-2 | low | c1.text drops "and pass"; setup[4] [c1, c4] |
| walking_lunge-3 | low | loadProgression "Add weight only while the step stays full and the descent smooth." (also reverse_lunge, forward_lunge) |
| walking_lunge-4 | low | setup[0] [c6, c12]; zooms[1] [c2, c3] |
| reverse_lunge-1 | low | setup[1] [c1, c7]; handlingMistakes[2] [c7, c16]; feel.rows[1] [c8, c6] |
| reverse_lunge-2 | low | c6 copies "can’t", c16 copies “ ” (R-LB4-5) |
| forward_lunge-1 | low | handlingMistakes[0] [c3, c4]; setup[2] [c1, c3] |
| forward_lunge-2 | low | c8 gains "20 asymptomatic females."; c12 gains the two bezerra-2021 lines |
| forward_lunge-3 | low | decisionNote: "a forward bend at the hips"; grip listed with the inherited fields |
| bodyweight_lunge-2 | low | handlingMistakes[0] [c3, c2] |
| bodyweight_lunge-3 | low | feel.rows[1].fix "Shorten the step for more front-thigh work." |
| bodyweight_lunge-4 | low | handlingMistakes[2] and risks[0] [c7, c2] |
| bodyweight_split_squat-2 | low | c1 gains "position your feet in your jerk split stance"; handlingMistakes[1] [c6, c1] |

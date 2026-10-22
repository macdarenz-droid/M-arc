# LB6 research verify (lb6): record

The LR-29 verify of the 13 LB6 non-pilot cards (#287) and its one fix round. The full record is docs/supervisor/verify/lb6-research-verify.md @ 44344dec (claude/sup-lib4-cards).

## Run
- Verified head: #287 @ d5fb65b3. A history-free copy was split into three blind groups (5, 4 and 4 cards). Each group had a fresh Opus critic and 2 plants, with plantScope set to every field. All three groups are **VALID**: 6/6 plants caught, each tier-A or safety plant rated blocker.
- Re-fetch: 399/409 quotes verbatim at the verify head. The 10 not checked are mq-pullover (Marquette, the anchor of machine_pullover), which returns 403 while web.archive.org is blocked by the egress policy. Supervisor 10 % re-fetch: 41/41.
- LR-31: the critics agree with 11 of 13 picks. The other two (smith_machine_shoulder_press, rear_delt_fly) were ruled R-LB6-4 and R-LB6-5. LR-33: 13/13 agree.
- Real findings, plants removed: 0 blocker, 2 high, 9 medium, 39 low.

## Rulings before the verify
- D-SUP-PROTECT: a cue that "protects" a named body part ties the fault it corrects to harm (LR-31 step 2).
- D-SUP-LB6-CCP: cable_chest_press is settled by step 3's source count. The result is the locked elbows.
- R-LB6-1: cable_chest_press stands.
- R-LB6-2: Motra's tempo values apply where the page fixes the order. Each page's Tempo tooltip does ("eccentric (lowering), bottom pause, concentric (lifting), top pause").
- R-LB6-3: high_to_low_cable_fly plate.view is front, as the census has it.

## Rulings in the fix round (R-LB6-4 to R-LB6-10)
- R-LB6-4: smith_machine_shoulder_press. Fitness Volt's "This is both to maximize your pressing ability and protect your shoulder joints." ties the flared elbows to harm. Motra's list order then picks them over the arch at step 2.
- R-LB6-5: rear_delt_fly. Step 1 picks rushing, from Fitness Volt's "most people … rush through the movement". Rushing is speed only, so plate.mistake (the shrug, drawable false) is unchanged.
- R-LB6-6: a stop line needs a cited quote with stop words. Without one, the row is written in LR-6 shape (place, the source's fault, a sourced fix), and the place names pain only if a cited quote does.
- R-LB6-7: the Motra Tempo tooltip counts as verbatim (served HTML). F-LB6-2: pilot B's smith_machine_bench_press is re-read with the tooltip in its next pass.
- R-LB6-8: laf-lat-raise is re-fetched with browser headers. mq-pullover stays in gaps, and its quote entries are marked as carried from g5. F-LB6-3: re-fetch Marquette when it answers.
- R-LB6-9: comma-joined claim strings become lists. F-LB6-4 covers 15 other cards.
- R-LB6-10: every other finding takes the fix as written; one round.

## Findings and fixes (commit: LB6 RESEARCH FIXED)
| Finding | Fix |
|---|---|
| smith_machine_shoulder_press-1 (high) | R-LB6-4. c5 gains the protect-the-shoulder quote. plate.mistake is now the flared elbows (["c10","c5"], drawable true). handlingMistakes is now [flared elbows, arch, lock]; the bench placement moves to notes. feel.rows[2].claim is ["c9","c10","c5"]. viewWhy and rankNote are rewritten, and StrongLifts' "They’ll usually be inclined …" is set aside. |
| smith_machine_shoulder_press-2 (medium) | rows[1] is now "Lower back" / "Fault: an excessive back arch." / "Press your upper back into the pad." (["c9","c4"]). |
| smith_machine_shoulder_press-3 (low) | Covered by the R-LB6-4 rankNote. |
| smith_machine_shoulder_press-4 (low) | setup[0] reads "Bench at about 70 degrees. …" |
| rear_delt_fly-1 (high) | R-LB6-5. New c19 holds both Fitness Volt quotes. handlingMistakes is now [rushing, momentum, too heavy]; hunching moves to notes (posture[1] keeps it). rankNote is step 1. |
| rear_delt_fly-2 (low) | Momentum's claim is ["c6","c8"]. |
| rear_delt_fly-3 (low) | Claims are now lists. |
| rear_delt_fly-4 (low) | The popularity line is set aside in rankNote. |
| rear_delt_fly-5 (low) | c14 is tagged WEAK. |
| rear_delt_fly-6 (low) | c8 states the conflict between Fitness Volt and Motra, with Motra's two quotes; the card follows Fitness Volt. |
| smith_machine_squat-1 (low) | rankNote step 2 quotes Gold's three protect lines; the pick holds. |
| smith_machine_squat-2 (low) | Claims are now lists. |
| smith_machine_squat-3 (low) | zooms[0].wrong is null (LR-25). |
| smith_machine_squat-4 (low) | rows[1].where is "Lower back". |
| cable_chest_press-1 (medium) | rows[2].fix is "Keep your spine neutral and brace your abs."; rows[3] is "Shoulder" / "Keep your elbows at a 45-degree angle." |
| cable_chest_press-2 (low) | c15 now backs only the 2-3 s lowering. tempo.text names NFPT's "semi explosive" against Motra's 2 s. |
| machine_crunch-1 (medium) | zooms[0].wrong is "Arms doing the pull while the trunk stays upright." The ACE and Fitbod against Motra conflict is named in why and notes. |
| machine_crunch-2 (medium) | rows[2] is "Lower back" / "Too much weight can strain the back." / "Avoid excessive weight." |
| machine_crunch-3 (low) | rows[3].fix is null. |
| machine_crunch-4 (low) | Claims are now lists. |
| machine_pullover-1 (medium) | libraryDiff.why names Virtuagym's triceps and the elbow-pad reason. |
| machine_pullover-2 (low) | handlingMistakes[0] and rows[1] are now "Keep your back (and head) on the pad.", ["c8","c7"]; "Lower the weight" is gone. |
| machine_pullover-3 (low) | R-LB6-8: the 10 mq-pullover entries carry a note. |
| machine_pullover-4 (low) | risks[1] is "Too much weight makes the lats harder to feel." |
| smith_machine_incline_press-1 (low) | The arch fix is "Don't arch your back excessively." (c6). |
| smith_machine_shrug-1 (low) | Claims are now lists. |
| low_to_high_cable_fly-1 (medium) | rows[2] is "Shoulder" / "Lower the weight. Keep your trunk vertical." (c7). |
| low_to_high_cable_fly-2 (low) | New c16 holds PureGym's quote; plate.mistake.claim is ["c11","c16"]. |
| low_to_high_cable_fly-3 (low) | The Schutz sports line is set aside. |
| low_to_high_cable_fly-4 (low) | c7's where is "Exercise tip (after Step 5)". |
| low_to_high_cable_fly-5 (low) | The trunk conflict (PureGym, StrengthLog against ACE) is in notes. |
| low_to_high_cable_fly-6 (low) | Up is 2, matching ACE's "slowly squeeze" and high_to_low; tempo.text says why. |
| high_to_low_cable_fly-1 (medium) | rows[1] is "Shoulder" / "Lower the weight and stand tall." |
| high_to_low_cable_fly-2 (low) | rows[2].fix is "Brace your abs." |
| high_to_low_cable_fly-3 (low) | Claims are now lists. |
| machine_lateral_raise-1 (low) | Claims gain c7. The zoom is "Shoulders down, elbows at shoulder height." (["c6","c5"]). |
| machine_lateral_raise-2, -3 (low) | rows[2] ("Body rocking in the seat") is removed and its text kept in notes. The swing stays in handlingMistakes[0] and risks[0]. |
| machine_lateral_raise-4 (low) | c13 carries only the top-pause convention. |
| machine_lateral_raise-5 (low) | c5 gains Virtuagym's "slightly higher" and states that the card follows Motra. |
| machine_lateral_raise-6 (low) | laf-lat-raise is re-fetched (HTTP 200, verbatim), checked 2026-10-22, and its gaps entry removed. c9 gains Motra's "Inhale and lower arms slowly with control." |
| hip_abduction-1 (medium) | rows[1] is "Hip" / "Fault: a machine not set to fit you." / "Line your knees up with the pivot." (["c6","c1"]). |
| hip_abduction-2 (low) | handlingMistakes[0] cites ["c12","c5","c6"]. The seat item is gone (-6). |
| hip_abduction-3 (low) | The middle 1 s is "at the start, knees together". |
| hip_abduction-4 (low) | handlingMistakes[0] is "Jerking the weight." |
| hip_abduction-5 (low) | Claims are now lists. |
| hip_abduction-6 (low) | handlingMistakes[2] is "Incomplete range." / "Open the legs to a full, comfortable range." (["c12","c4"]); the seat item moves to notes. |
| hip_abduction-7 (low) | rows[2] ("Upper body rocking") is removed and its text kept in notes. |
| hip_adduction-1 (medium) | risks[1] is "Acute hip or groin injury? Don't use this machine." (c5). rows[1] is "Groin" / "Fast, swinging reps risk strain." / "Keep the movements slow." (c4). |
| hip_adduction-2 (low) | rankNote names the stack crash as tied too, set aside on list order. |

## Checks on the fix head
- Valid JSON: 26 files.
- Dry run: 0 errors.
- Copy lint (main @ 5158609) and C8: 0 hits on the 13 cards.
- Quotes: 407/417 verbatim by curl. The other 10 are mq-pullover (403). Every new quote and every phrase quoted in a rankNote, why, tempo.text or note was checked against its fetched page.

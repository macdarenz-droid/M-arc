# LIB-PLATEFIX-1: fix six approved plates the W2 layers panel failed

Status `ready` (supervisor, 11-04 ~14:45 UTC). Source: the W2 layers panel, #379 comment 6633524031 (all panels VALID; 2 of 3 critics ≤ 3 on each item below). Base: latest origin/main. Model: Opus.

## Why
These plates are approved and pinned, but the layers panel found faults on the plate itself: its view or its Mistake pose. Layer work cannot fix those. The ids are held out of LIB-SHIP W2, and they ship in a later wave after this card.

| id | plate finding (W2 panel) | page |
|---|---|---|
| dumbbell_fly | The foot-end front view reads as a person **standing in a T-pose**: straight legs to a floor line, the bench only as two small blocks. Lying on a flat bench (c1, c2) is not visible. The Mistake "Wrists bend" shows only dashed boxes around the dumbbells, with no bent wrist. The elbow arc is drawn near 180° under a "slight bend" label. A stray mid-arc ghost dumbbell. | pilot-a3 |
| bent_over_dumbbell_rear_delt_fly | The approved plate is a **side view**, but card `plate.view` is **front**. Side-on, the arms foreshortened to a stub make the lift read as a row ("raise out to the sides", c1/c3, cannot be seen). The Mistake "SHOULDERS SHRUG" is only an arrow and ticks, with no raised shoulder. | pilot-a2 |
| reverse_lunge | The Mistake view is the Right pose plus two tiny red ticks at the waist. The ribcage flare, forward pelvic tilt and deeper lumbar curve (c18) are not drawn. | pilot-a3 |
| romanian_deadlift | The "BAR TOO LOW" tell cannot be seen: the dashed plate sits about 10-15 px below the solid one, already at mid-shin. | pilot-a |
| barbell_overhead_press | L7: the lockout arm is drawn over the head, the dashed start pose sits inside the torso, and the "FOREARMS VERTICAL" leader ends where no forearm can be told apart. | pilot-a |
| triceps_pushdown | The Mistake "leaning over" overlay is a tangle: dashed trunk and head, a solid red arm capsule, cable and trace ghosts. The lean and the arching do not read in 2 seconds. | pilot-a |

single_leg_romanian_deadlift is held with romanian_deadlift (Q-W2-3 coupling); its plate does not change.

## Goal
Each plate teaches its card at the approved bar: the Right pose is card-true, every Mistake visibly shows its named fault, and the plate reads as the exercise at 390 px. Then the layers and the content fixes listed for these ids in 6633524031 land, and the 7 ids ship.

## Files it may touch (write_scope)
- `tools/plates/library/specs/<id>.mjs` for the 6 ids (pose, view, camera, mistake, tells, labels), with drawing values cited (D-SHIP-DRAWVAL, D-LIB8M-FACTS).
- These plates' pin entries and pages, only as a superseding pin after the plates panel passes (PIN GO from the supervisor). MANIFEST only in `[golden update]` commits.
- After W2 (#379) merges: `tools/plates/library/howto/lib_<id>.howto.mjs` for the 7 ids (the content fixes in 6633524031), their layers pages and pins, and the flip in a later wave, in the W2 form.
- Never: research cards (`docs/research/**`), golden B or the vendor engine, other plates, `src/**` beyond generated output, CI, signing.

## Steps
1. Read `.claude/skills/builder/SKILL.md`, the LIB-SHIP card (`verify/lib-ship-card.md`) and its rulings, `lib4-cards.md` section 48 from "SHIP PLAN RULED" onward, and comment 6633524031.
2. Make branch `claude/lib-platefix-1` from origin/main, with a draft PR. First post `PLATEFIX PLAN READY @ <sha>`: per id, the fix with drawing values and claim ids. For the two view questions (rear delt fly: front per the card; dumbbell_fly: how lying on a bench reads from the front, for example camera pitch, bench drawn under the torso, foreshortened legs on the floor), propose and say why, or ask. Then wait for `PLATEFIX PLAN RULED`.
3. Build the plates. Post `PLATEFIX PLATES READY @ <sha> (page sha256s)`. The supervisor runs a calibrated plates panel (PANELS section 1: new plants, golden-B anchors), with one fix round, then a focused recheck.
4. After the plates are approved and W2 has merged: merge main, apply the content fixes, rebuild the layers pages, and post `PLATEFIX LAYERS READY`. A focused layers panel follows, then the flip and READY in the W2 form.

## Acceptance
- Plates panel approved; layers panel approved; every content finding for these ids closed with its claim.
- No other plate's pin, page or MANIFEST entry moves (show the diff).
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Risks
- **A view change (rear delt fly, dumbbell_fly) breaks other layers of the same id.** Mitigation: the layers are rebuilt in step 4 and rechecked.
- **A fix drifts from the card.** Mitigation: card truth wins (PANELS section 1 rule 5); cite every drawing value.
- **Conflicts with W2 or W3** in shared files. Mitigation: plates first (spec files only), sheets after W2 merges; generated files are regenerated, never hand-merged.

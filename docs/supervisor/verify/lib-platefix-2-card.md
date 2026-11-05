# LIB-PLATEFIX-2: three plates held after LIB-PLATEFIX-1 and W2

Status `ready` (supervisor, 11-05 ~02:10 UTC). Sources:
- pf3, the last PLATEFIX recheck (#385 comment 6638551153, VALID);
- D-RDFLY-R1 (#385 6637650243);
- SHIP W2 Q12 (#379 6640987895, ruled 6641008259).

Base: latest origin/main. Model: Opus.

## Why
Three approved plates are held from shipping:
- dumbbell_fly and bent_over_dumbbell_rear_delt_fly failed two focused rounds (D-LIB13-PANEL2), so they were reverted to main in #385.
- pec_fly has a hard plate-QA red, plus a duplicate red-flag line.

This card is their way back, so all 153 guides can ship.

| id | finding to fix | start point |
|---|---|---|
| dumbbell_fly | **R5:** the wrist bend does not read. The red hexagon moves only about 13 px and covers the correct grip, and the bent hand is a thin dashed axis. **R7:** the Mistake view turns the 34-px end-on hexagons into 20-22 px grey circles, so the zoom's correct dumbbell is an unrecognisable disc. | spec at #385 `9f2d0dcd` |
| bent_over_dumbbell_rear_delt_fly | **R1:** the front view cannot show the hip hinge or FLAT BACK. **R5:** the shrug reads as two short dashed slopes inside the outline, and scored the same as a planted *downward* shrug. **R11:** the ring and circle hold only fragments. | spec at #385 `9f2d0dcd` |
| pec_fly | **PQ-H4:** the `height` and `meet` callout hit boxes overlap by 11.58 px² at 360 px. **HT9/A3:** the feel row `where` "Shoulder pain" repeats RED_FLAG_SHOULDER's line. | approved plate on main; sheet on W2's branch |

## Fixes (the pf3 critics' fixes, kept buildable with segment lengths as drawn)
- **dumbbell_fly:**
  - Keep the solid 34-px end-on hexagons at the neutral grip in the Mistake view, exactly as in the normal view.
  - Draw the fault as a full red dashed hand block plus hexagon, rotated about 30-35° toward the floor **about the wrist joint**. Keep the hand at its drawn length and the forearm on its drawn line.
  - Keep the grey dashed forearm-axis reference and the red angle arc at the wrist.
  - In the zoom, show the grey neutral hand and hexagon against the red tipped one.
- **bent_over_dumbbell_rear_delt_fly:**
  - **(a) Engine, library files only.** Add a chosen-focus posture zoom in the normal view to `tools/plates/library/zoom/inline.mjs` and `tools/plates/library/qa/zoom.mjs`. It takes an explicit focus point or region and is exempt from the trace rows. It gets its own H-rows (what it must hold, its magnification bar, label clearance) and reds.
    - Every existing plate's zoom output stays byte-equal: prove it with every pinned page sha256.
    - Golden B and the vendor engine are never touched.
  - **R1:** use (a) to show the upper back's top contour against a straight dashed reference, so FLAT BACK points at a visibly flat back (c2), or show the hinge in side projection if (a) supports it. Either way, it is judged on the plate.
  - **R5:** draw the shrug as a **displacement**: red dashed shoulder caps and trapezius contour moved about 12-15 px toward the ears, closing the shoulder-head gap visibly.
  - **R11:** re-centre the Mistake ring so it holds the shoulder joint marker, the grey shoulder top and the side of the head, at a magnification where they read. Place the circle in empty plate space off the body axis.
  - Add the start-ghost hexagon, and make the trace one circular arc about the shoulder (pf3 R7 note).
- **pec_fly:**
  - Move the `height` or `meet` callout so no hit boxes overlap at 360 px or at 390 px. The leaders still end on what they name.
  - Reword the feel row `where` card-true so it differs from RED_FLAG_SHOULDER's line. A fresh content critic picks and checks the wording.

## Files it may touch (write_scope)
- `tools/plates/library/specs/<id>.mjs` (and `sizes.json` entries) for the 3 ids, with every drawing value cited (D-SHIP-DRAWVAL).
- `tools/plates/library/zoom/inline.mjs` and `tools/plates/library/qa/zoom.mjs`, for (a) only.
- One new test file per part.
- These plates' pins and pages, only after the plates panel passes (PIN GO), and MANIFEST only in `[golden update]` commits.
- After the plates are approved and W2 #379 has merged: the 3 sheets, their layers pages and pins, and the flip in the W2 form.
- **Never:** research cards, golden B, `tools/plates/vendor/**`, other plates' specs, CI, signing.

## Steps
1. Read `.claude/skills/builder/SKILL.md`, this card, `lib4-cards.md` section 48 (from "PLATEFIX recheck pf3" up through D-SHIP-PECFLY-HOLD), and the three source comments.
2. Make branch `claude/lib-platefix-2` from origin/main, with a draft PR. Post `PLATEFIX-2 PLAN READY @ <sha>`: per id, the fix with drawing values and claim ids, and (a)'s API and H-rows. Wait for the ruling.
3. Build (a) with its reds, then the 3 plates. Post `PLATEFIX-2 PLATES READY @ <sha> (page sha256s)`. The supervisor runs a calibrated plates panel (new plants, golden-B anchors), with one fix round and a focused recheck.
4. After approval and the W2 merge: merge main, then layers, a focused layers panel, D-TEXT-GOLDEN rows, the flip and READY.

## Acceptance
- Plates panel approved for each id. If an id fails a second focused round, it is held and reported; it is never loosened.
- (a): every existing pinned page and golden B stay byte-equal, and its reds turn red under mutation.
- PQ-H4 and HT9/A3 are green for pec_fly.
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Risks
- **(a) changes zoom output for existing plates.** Mitigation: it is opt-in per spec, and all page sha256s are compared before and after.
- **The CI queue with many wave lanes.** Mitigation: push once per step.

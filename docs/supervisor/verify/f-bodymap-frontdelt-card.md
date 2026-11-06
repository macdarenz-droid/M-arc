# F-BODYMAP-FRONTDELT: front delts drawn on the front of the shoulder cap

Status `ready` (supervisor, 11-05 ~04:30 UTC). Source: golden-B follow-up 36 (W2 panel) and D-SHIP-W5-FRONTDELT (#392 6649453813). Base: latest origin/main; branch `claude/f-bodymap-frontdelt`. Model: Opus.

## Problem
In `tools/plates/layers/engine/bodymap-parts.mjs`, FRONT_PARTS `shoulder-front-left` and `shoulder-front-right` (muscle `front_delts`) sit on the strip between the neck and the shoulder cap. On the sheets that strip reads as the upper traps. Every "Front of the shoulder" watch or feel region therefore marks the wrong place. W5 critics scored it L4 3 on preacher_curl, cable_curl and bayesian_cable_curl, and W2 saw it on golden B's seated_cable_row.

## Goal
Redraw both `front_delts` polygons on the anterior deltoid: the front of the shoulder cap, beside the top of the chest and above the biceps, mirrored left and right. Nothing else in the body map changes.

## Files it may touch (write_scope)
- `tools/plates/layers/engine/bodymap-parts.mjs`: the two `shoulder-front-*` entries only.
- Its test file, or one new test file.
- Pins and golden pages that move because of this change, only in `[golden update]` commits (D-CROP-PIN form). List every moved page with its old and new sha256.
- Never: other parts, sheets, cards, specs, plates, CI.

## Acceptance (each red with a mutation)
- The new polygons do not overlap `upper_traps` in any view. They lie inside the front-view deltoid area (between `side_delts` and `upper_chest`) and are mirror images within 0.05 units. Mutation: restore the old path, and the test is red.
- Every page that shows `front_delts` is rebuilt twice with an equal sha256, and the list matches a grep of the pages for the region.
- A focused panel (the supervisor runs it) on preacher_curl, cable_curl, bayesian_cable_curl and one golden-B sheet: L4 at median 4 or more.
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Steps
1. Read `.claude/skills/builder/SKILL.md` and this card. Open a draft PR and post `F-BODYMAP-FRONTDELT PLAN @ <sha>`, with the new path data and a crop of the front view before and after. Wait for the ruling.
2. Build, then post `F-BODYMAP-FRONTDELT READY @ <full sha>`. A fresh reviewer follows. It merges before W5. Whichever of it and a wave lands second merges main and keeps both sides.

## Added 11-06 (supervisor)
- dumbbell_pullover (W4, #391 6653791551 L4): the body map has no inner-elbow part. Add it in the same `layers/engine/bodymap-parts.mjs` change, with a red-before, green-after test, and re-pin every page that shows it.


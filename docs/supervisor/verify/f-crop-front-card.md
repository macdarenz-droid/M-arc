# F-CROP-FRONT: close-up crops use the plate's own projection

Status `ready` (supervisor, 11-04 ~09:20 UTC). Found by LIB-SHIP W2 (#379, "SHIP W2 QUESTIONS 2", Q-W2-8). Base: latest origin/main.

## Problem
`tools/plates/library/render/closeup/crop.mjs:42` `projOf` maps a world point to screen x as `x0 + w[2]·pxPerM` (unless `backView`). The plate engine projects with `makeCamera` (`tools/plates/vendor/engine/plate.mjs:51-59`):
- side view: `w[2]` facing right, `-w[2]` facing left;
- front view: `w[0]`, with `camera.pitch` (screen-up = `y cos p - z sin p`; at 0 the plain form).

So on a front-view plate, every crop centre, callout anchor and chip lands off the joint it names. The W2 builder measured the right elbow on the end pose: cable_fly is off by 61 px, upright_row by 99 px, pec_fly by 74 px and dumbbell_fly by 19 px (that one before its pitch). A side plate facing left would be mirrored the same way. Check whether any exists.

## Goal
Crops project world points exactly as the plate does, for every view, facing and pitch. Nothing already pinned changes.

## Files it may touch (write_scope)
- `tools/plates/library/render/closeup/crop.mjs`, only `projOf` and `camOf` and what they need (e.g. the crop spec keeping the plate's `view`, `facing` and `camera.pitch`, if the crop render drops them).
- One new test file, `tests/howto/crop-projection.test.ts`.
- Never: `tools/plates/vendor/**` (golden A, owner rule), any page, pin, MANIFEST or reviews.json, `src/**`.

If `makeCamera` or its `P` is reachable without editing vendor files (an export, or the plate report's camera), use it. Otherwise mirror its formula exactly, and the parity test (A1) pins the mirror to the engine.

## Acceptance
- **A1 parity:** for the 4 ids above, plus one side-right, one side-left (if any library spec faces left; else a test fixture) and one pitched front plate, every crop anchor of every zoom equals the engine's projection of the same world point within 0.01 px. The test fails on today's main and passes after the fix.
- **A2 nothing pinned moves:** run `node tools/plates/generate.mjs` and build every pinned layers page. The MANIFEST, every pinned page sha256 and golden B's 8 close-ups stay byte-equal. If any pinned output changes, **stop** and post `F-CROP-FRONT QUESTION` with the list. Do not re-pin.
- **A3 the drawn crop matches:** on the 4 ids, the crop's drawn figure is the same view as the plate (front stays front, pitch kept). Show this with one screenshot pair per id in the PR. The anchor sits on the joint it names.
- **A4 mutations, each red:** (a) `w[2]` back on front views; (b) drop the pitch term; (c) drop the facing-left sign. List them in READY with the failing test names.
- `npm run check`, `npm run test:tz` and the gate pass on the READY head, which contains the latest main.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Create `claude/f-crop-front` from origin/main and open a draft PR titled "F-CROP-FRONT: close-up crops use the plate's projection".
2. Write A1 first and show it red on main. Then fix, and show A1-A4.
3. Post `F-CROP-FRONT READY @ <full sha>` with A1-A4 evidence, the times, and the files changed. A fresh reviewer follows. Merge goes through a supervisor train.

## Risks
- A pinned page moves (A2). Mitigation: stop and ask; nothing is re-pinned in this card.
- A crop's figure is drawn from the wrong view (beyond its anchors). Mitigation: A3 screenshots.
- A vendor edit tempts. Mitigation: never path; parity test instead.

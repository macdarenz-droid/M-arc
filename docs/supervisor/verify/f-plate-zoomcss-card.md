# F-PLATE-ZOOMCSS: the app's plate.css carries the inline-zoom rules

Status `ready` (supervisor, 11-04 ~16:55 UTC). Found by LIB-SHIP W2 (#379, "SHIP W2 QUESTION 6"). Base: latest origin/main. Model: Opus.

## Problem
`generate` refuses to ship crunch. Its approved plate carries an inline zoom (the LIB-ZOOM ring), so its page's gallery CSS has 4 `pz-*` rules (`.pz-bg`, `.pz-ring`, `.pz-src`, `.pz-link`) that the app's `plate.css` does not. `gen/plates.mjs:177` (D-LIB2b-CSS) requires every batch page to rebuild `plate.css` byte for byte from golden A's gallery. No app plate has shipped an inline zoom before. 28 later specs declare a `zoom:`, among them horizontal_leg_press (W3), dumbbell_fly, rear delt fly, reverse_lunge and the LB rows, so this blocks W2's crunch and every later wave.

## Goal
`plate.css` gains exactly the zoom renderer's `pz-*` rules, **generated from `zoom/inline.mjs`'s own CSS**, never typed by hand. The D-LIB2b-CSS check becomes: a batch page rebuilds "plate.css" = golden A's gallery CSS plus those zoom rules, and nothing else.

## Files it may touch (write_scope)
- `tools/plates/gen/plates.mjs`, only the plate.css build and the check at :177;
- the generated `plate.css` and generated headers (regenerated, never hand-edited);
- one new test file `tests/howto/plate-zoomcss.test.ts`.

MANIFEST changes only in `[golden update]` commits (D-CROP-PIN form). Never touch: `zoom/inline.mjs` (read only), specs, cards, the vendor engine, golden pages or CI.

## Acceptance
- **A1:** with the change, a page whose plates carry an inline zoom (crunch's pilot-b2, horizontal_leg_press's zoom page) passes the plate.css check. The check fails on today's main.
- **A2 reds, each with a mutation:**
  - an extra CSS rule that is neither golden A's nor a `pz-*` rule from inline.mjs;
  - a missing `pz-*` rule;
  - a hand-edited `pz-*` rule that differs from inline.mjs's bytes.
- **A3:** golden A's and golden B's pages, the shipped curl and every app screen without an inline zoom are byte-equal, except the one plate.css file and its generated header. Show this with generate and the page sha256s. The gate's screenshots of the 9 shipped How-tos are unchanged.
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Make branch `claude/f-plate-zoomcss` from origin/main, with a draft PR.
2. Build to A1-A3, then post `F-PLATE-ZOOMCSS READY @ <full sha>`. A fresh reviewer follows.

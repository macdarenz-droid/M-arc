# F-ZOOM-NONE: a library sheet with no drawn posture close-up

Status `ready` (supervisor, 11-04 ~17:00 UTC). Found by LIB-SHIP W2 (#379, "SHIP W2 QUESTION 7"). Base: latest origin/main. Model: Opus.

## Problem
seated_leg_curl ships with no posture zoom, because both of its card zooms are ruled D-SHIP-TEXTZOOM text checkpoints (Q-W2-9). Several parts assume every library row has at least one posture close-up, and refuse with `zooms: seated-leg-curl: no posture close-up in the golden-B page` (gen/zooms.mjs:71):
- `tools/plates/gen/zooms.mjs`;
- the `posture-<id>` chunk;
- the loaders;
- the app's Look-closer path.

## Goal
A library row may have zero posture zooms **only when** every card zoom is a ruled text checkpoint. Such a row emits no posture chunk, and the app's Look-closer path shows no chips; the text checkpoints still show in the posture section. Every other row behaves exactly as today.

## Files it may touch (write_scope)
- `tools/plates/gen/zooms.mjs` and `tools/plates/gen/ids.mjs`, only the zero-zoom path;
- the loaders' generator, if it needs the same guard;
- the smallest app change in `src/slices/howto/` that hides Look-closer chips when a sheet has no posture zoom (called out in the PR);
- a fixture and a fixture-route gate probe (the LIB-SHAPES form, test-only);
- one new test file.

MANIFEST changes only in `[golden update]` commits. Never touch cards, specs, the vendor engine or CI.

## Acceptance
- **A1:** a fixture row whose card zooms are all ruled text checkpoints generates no posture chunk. Its sheet renders with no Look-closer chips and shows its text checkpoints. This fails on today's main.
- **A2 reds, each with a mutation:**
  - a zero-zoom row whose card has a drawable (non-ruled) zoom;
  - a zero-zoom row with no ruling id;
  - removing the guard.
- **A3:** golden B's 8, every shipped library id and every generated file of a row with zooms stay byte-equal (generate plus the page sha256s). The gate's shipped How-to screenshots are unchanged.
- `npm run check`, `npm run test:tz` and the gate pass on a READY head that contains the latest main.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Make branch `claude/f-zoom-none` from origin/main, with a draft PR. Post `F-ZOOM-NONE PLAN @ <sha>` and wait for the ruling.
2. Build, then post `F-ZOOM-NONE READY @ <full sha>`. A fresh reviewer follows.

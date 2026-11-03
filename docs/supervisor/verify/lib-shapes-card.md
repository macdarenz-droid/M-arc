Card LIB-SHAPES: the How-to sheet shows two new library sheet shapes (2026-11-03; status `ready`; a LIB-SHIP prerequisite for W2, from #376 'SHIP W1 STOP S1/S2').

id: LIB-SHAPES
model: claude-opus-5-5 (app UI and builder patches; judgement work)
mode: auto
title: 'Builder: LIB-SHAPES, two new How-to sheet shapes'
branch: claude/lib-shapes from the latest main; draft PR 'LIB-SHAPES: none and no-hand-zoom sheets'.
lane: parallel to LIB-SHIP W1 (2 ids). Merges before LIB-SHIP W2.

## Why now
- LIB-SHIP W1 (#376) found that the golden-B layers builder (tools/plates/layers/artifact/howto-layers.mjs, patched by tools/plates/library/build-layers-page.mjs) and the app's How-to sections (src/slices/howto/sections/) accept only golden B's shape: a handled archetype, Hand as the first chip, and a grip line. Measured throws: howto-layers.mjs:178-179 and :256; LookCloser.tsx:23 and :38-41; Hand.tsx:33 returns null for `none`, which also hides the posture and Feel chips.
- About 39 of the 134 rows are `archetype: 'none'` (19 card-`none`, plus about 20 under D-SHIP-GRIP (b)). 57 or more have a handled archetype and no hand zoom (D-SHIP-C3). Without this card about 96 rows cannot ship.

## Scope: the two shapes
1. **`none` sheet** (`handling.archetype: 'none'`, `NoHandling`): the sheet shows its posture chips and its Feel chip as golden B does. It has no Hand chip, no Grip section and no wrist row. Nothing else changes.
2. **Handled sheet with no hand zoom** (a row on D-SHIP-C3's pinned no-zoom list): the sheet shows its grip words (gripLine, contact, wrist, thumb) where golden B shows them. It has no Hand chip and no "Also check your wrist" row. The posture and Feel chips are unchanged.
- Hand-zoom key: a library sheet's hand zoom uses the key `hand`, the golden-B key. The card's own zoom key stays in a comment, and its claims do not change (data only, ruled on #376). This card adds no other key.
- Front-view posture crops (zbox maps depth to x, side views only): not in this card. Each such zoom is a text posture checkpoint under D-SHIP-TEXTZOOM, named per id.
- **No new user-visible text.** If a shape seems to need a label, stop and ask (AGENTS UI-copy and heading rules).

## Files it may touch (write_scope)
- src/slices/howto/sections/** (LookCloser.tsx, Hand.tsx and the section that renders grip words): branch on the two shapes only.
- tools/plates/library/build-layers-page.mjs: new named source patches for the two shapes, add-only. The vendored files under tools/plates/layers/** are never edited directly.
- tests/howto/**: new tests, and fixture rows for each shape in a test-only fixture.
- scripts/screenshot-gate.mjs: add-only, one block named LIB-SHAPES.
- docs/COACHING-DECISIONS.md: append.
- Never: golden A/B pages and GOLDEN.json, the 8's How-to sources and generated chunks, tools/plates/layers/** (except through build-layers-page.mjs patches), content-types.ts (beyond what LIB-SHIP's Q12/Q15 rulings add), src/app/App.tsx, src/main.tsx, src/core/**, src/ui/styles.css except one block marked LIB-SHAPES for these sections, .github/**, package*.json.

## Acceptance (each with a mutation that turns red, then is restored)
- **A1 The 8 unchanged.** Golden B's layers page, GOLDEN.json and the 8's ht-, hand-, posture- and feel- chunks are byte-equal before and after; the app screens of the 8 in the gate are pixel-equal. Mutation: one byte in a patch's output for a golden-B row.
- **A2 `none` shape.** A fixture `none` row builds on the layers page, with its posture and Feel chunks present and no hand or grip chunk. In the app it shows its posture chips and Feel chip, with no Hand chip, no Grip section and no wrist row. Mutations: Hand.tsx returning null again (chips vanish, red); a `none` row with a grip line (red).
- **A3 No-zoom shape.** A fixture row on a test no-zoom list builds and shows its grip words, with no Hand chip and no wrist-also row. A row not on the list with no hand zoom still throws as today. Mutations: the list entry removed (throw, red); a Hand chip rendered (red).
- **A4 Gate.** The LIB-SHAPES gate block screenshots both fixture shapes in Silent Black and Paper at 390 px: no overflow, 44 px targets, the same section order as golden B minus the absent parts.
- **A5 Green.** `npm run check`, `npm run test:tz` and the gate pass; CI is green.

## Stops
- S1 Any byte of the 8 or golden A/B would move. S2 A check passes only by loosening it. S3 A shape needs new user-visible text or a new layout decision: post a measured proposal and wait.

## Forecast [est]
About 1-2 days of one Opus builder, plus review and a train. Assumes no new copy and no vendored-engine edit.

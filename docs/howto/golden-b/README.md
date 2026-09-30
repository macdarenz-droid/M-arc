# Golden B: the How-to layer mockup (S-2 pin)

This folder is the approved layer mockup: grip and hand close-ups, posture close-ups, handling mistakes, the feel map with the target-muscle shimmer, setup, risks and sources, for the 8 approved exercises. HT-4 vendors it verbatim into `tools/plates/layers/`, and the layer cards (HT-5 to HT-9) build against this commit. A later change to anything here is a golden-B update, never a silent edit.

Golden A (the approved plates) is `bc0f378:docs/howto/technical-plate/technical-plates.html`, sha256 `e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48`. That folder is untouched; golden B lives here so golden A stays byte-identical.

## Contents
- `artifact/build-page.mjs` and `artifact/howto-layers.mjs`: the layer page builder. `artifact/.gen/` is written at build time and is not pinned.
- `artifact/technical-plates.html`: the built page, sha256 `472030088f32673bb68dac0f937f1a6fa7dd10c82eb42f88b2f0c4a66a149c4a`.
- `artifact/fidelity-check.mjs`: proves the plates inside golden B equal golden A. Result: 104 byte fragments and 80 pixel regions (8 exercises × 5 themes × normal and Mistake), with 0 px difference.
- `artifact/shoot2.mjs`: the state check. It opens every layer state in all 5 themes.
- `engine/`: the golden-A engine files, unchanged, plus `hand.mjs`, `hand-pairs.mjs`, `hand-test.mjs`, `feelmap.mjs` and `bodymap-parts.mjs`.
- `exercises/`: the golden-A specs, unchanged, plus the `*.howto.mjs` content and the `*.howto-render.mjs` crops.
- `howto/`: `shared.mjs` (RED_FLAG, the knee, elbow and shoulder blocks, DISCLAIMER, SHOW_EVIDENCE) and the posture crop renderers.
- `ref-src/`: the S-1 lateral-raise source, which is golden A's lateral raise.

The file list is the build's own read closure: every file the build opened, traced at pin time, plus the two checks and `hand-pairs.mjs`/`hand-test.mjs`.

## How to rebuild and check
From this folder:
- `node artifact/build-page.mjs` rebuilds the page byte-identical to the pinned sha256.
- `node artifact/fidelity-check.mjs` needs `bc0f378` in the local git.
- `node artifact/shoot2.mjs` and `node engine/hand-test.mjs`.

## S-2 entry conditions (plan 4.0): all met on 2026-09-30
1. **Only golden-A plates.**
   - The chest press callout override is removed, and "Heel of palm" is now the Hand chip caption.
   - The lateral raise takes its plate from `ref-src`.
   - Two specs had quietly drifted: pull-up "Shoulders down" and seated cable row "Squeeze blades". Both were restored from bc0f378.
   - The leg press "Knees cave" override is removed.
2. **Posture crops start from the golden-A specs.** The lateral raise crops are cut from the `ref-src` drawing.
3. **Appendix-A text** is applied.
4. **One shared module** holds RED_FLAG and DISCLAIMER, with the owner's line: "General guidance, not medical advice. If something hurts, stop and get it checked."
5. **Every section renders** for all 8 exercises in 5 themes (the `shoot2.mjs` state check).
6. **The shimmer pauses** when the map is scrolled out of view. This is behaviour only; the fidelity check shows 0 px change.

Owner decisions applied:
- The chest press uses horizontal handles, palms down. Its main Right/Wrong pair shows the wrist bent back with the handle in the fingers.
- No expert review, so evidence labels are shown.
- Nothing opens by itself, and no new saved data.

## Decisions made at the pin (supervisor)
- **Review.** Two independent fresh-context verifiers checked golden B against the architecture and the verified research cards: one on fidelity and behaviour, one on design, copy and safety. A recheck followed the fixes. This counts as the S-2 review, so no third reviewer was added, since it would only repeat the same checks.
- **Referrals per joint.** The shoulder referral now applies to every shoulder-pinch row (pull-up, lat pulldown, lateral raise, seated cable row). Knee and elbow referral blocks were added from the NHS pages, checked live on 2026-09-30. Each warning box starts with its joint name ("Wrist pain", "Shoulder pain", "Knee pain" or "Elbow pain"), because a sheet can now show more than one box.
- **Squat row "Wrists, or the inside of your elbows".** It keeps the wrist referral only. The row's cause and fix are the bar position and the wrist, so the elbow is text-only there. Revisit only if HT-5's content checks disagree.
- **Chest press.** "About nipple height" and "(nipple line)" are removed. Appendix A kept them only if an expert reviewer wanted them, and the owner chose no expert review.
- **Mistake pill.** It works out its target before closing a close-up. The state check covers Mistake, then the wrist line, then Mistake.
- **`engine/feelmap-test.mjs` is left out.** It reads research from a scratch-only path. Its checks (contrast, text-only muscles, one spoken label) are covered by the page state check and by HT-4's C2.

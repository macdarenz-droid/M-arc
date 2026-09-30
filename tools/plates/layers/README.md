# Golden B: the How-to layer mockup (S-2 pin)

This folder is the approved layer mockup: grip and hand close-ups, posture close-ups, handling mistakes, the feel map with the target-muscle shimmer, setup, risks and sources, for the 8 approved exercises. HT-4 vendors it verbatim into `tools/plates/layers/`, and the layer cards (HT-5 to HT-9) build against this commit. A later change to anything here is a golden-B update, never a silent edit.

Golden A (the approved plates) is `bc0f378:docs/howto/technical-plate/technical-plates.html`, sha256 `e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48`. That folder is untouched; golden B lives here so golden A stays byte-identical.

## Contents
- `artifact/build-page.mjs` and `artifact/howto-layers.mjs`: the layer page builder. `artifact/.gen/` is written at build time and is not pinned.
- `artifact/technical-plates.html`: the built page, sha256 `f39137e190e3ff5921bbe658571228b6b2a53e6d27fcc95e0d5d2afaec9e1384` (2,386,418 bytes). Earlier pins: 16a8edc (`47203008…`), then b3a90af (`5aab1aca…`, compact copy). The first pin (16a8edc, sha256 `47203008…`) is superseded by the compact-copy update below.
- `artifact/copy-lint.mjs`: the copy lint. The build runs it first and throws on any violation. Every limit is an exported constant.
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
- The copy lint runs inside the build; a failing spec stops `build-page.mjs` with one line per problem.

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

## Compact-copy update (owner, 2026-09-30)
The owner approved this design and asked for shorter explanations: "Maybe make other explainations shorter and compact. Teach more on concept, not detailed explaination."

Only the words changed, plus the list caps below:
- The design, sections, drawings, interactions and plates are unchanged. The fidelity check is still 0 px against bc0f378.
- Each section opens with one line that states the idea and why it works, then a few short cues.
- Visible words per exercise went from 902-1,132 to 433-449.
- The copy-lint violations went from 851 to 0.

**The limits** (`artifact/copy-lint.mjs`, exported constants):

| Text | Limit |
|---|---|
| Any sentence | 15 words |
| Feel line | 20 words and 2 sentences, starts "You should feel this" |
| Feel row "where" | 6 words |
| Feel row "means" | 12 words and 1 sentence |
| Feel row "fix" | 15 words and 2 sentences, starts with a verb |
| Lead lines | 22 words and 2 sentences |
| Setup | 5 steps, 12 words each |
| Handling mistakes | 3 per exercise, label 5 words, fix 12 words |
| Feel rows | 4 per exercise, and every red-flag row kept |
| Captions | 10 words |
| Risks | 3 per exercise, 14 words each |
| Red-flag boxes | 30 words, every trigger kept |
| Source notes | 12 words |
| Alt texts | 30 words |
| Callout labels | 1 to 3 words |
| Cues | 6 words |
| Visible words per exercise | 450 |

The GA 6.2 bans still apply in full. The owner's safety line must match exactly, and the red-flag rows and blocks are pinned.

**Checks:**
- Two independent verifiers reviewed the rewrite:
  - accuracy and safety against the research cards, with 15 findings;
  - the reader's view in a real browser at 390 px, with 17 findings.
- A refix pass fixed all of them, and a recheck passed.
- The supervisor re-ran the build and lint, the fidelity check (0 px), the state check (0 problems) and the hand test on the final page.

**Supervisor decisions at this pin:**
- **Every feel row and setup step shows.** With the caps, the old "Show 1 more" and "All 5 steps" buttons would have hidden a red-flag row in 7 of 8 exercises, plus the leg press dizziness stop and re-lock. The visible count now equals the cap (`FEEL_ROWS_MAX`, `SETUP_MAX_STEPS`), so no button appears. The collapse code stays for any longer list, which the lint forbids.
- **Two squat close-ups lost their "This is usually why" link.** Bar on back lost it when the neck row was cut to fit the 4-row cap. Depth lost it because pointing at the lower-back row read backwards. The close-ups themselves are unchanged.
- **Red-flag boxes use one pattern:** "<triggers>? Get it checked today." then "<triggers>? See a doctor." Each box keeps its NHS source and joint name.

## Source-record update (supervisor, 2026-09-30)
Every source now carries `access` and `checked`, as HT5-A2 requires. Only the source records changed; the user copy and the drawings did not.
- **Filled after reading each source today.** 34 empty fields: 29 `checked` and 6 `access`. The PubMed records were read through NCBI E-utilities, because the PubMed web pages block automated readers.
- **Dropped.** `nsca-nfpt`: its site no longer exists (HTTP 503 "This Site is No Longer Active"). Each of the 3 squat claims that cited it keeps at least one live source.
- **Corrected.** `schulz`, `ace-leg-press` and `bells-of-steel` were marked unreachable, but all three opened today. They are now `access: full`, and "Not rechecked" is gone from their notes.
- **Checks.** Fidelity against bc0f378: 0 px. State check: 0 problems. The copy lint passes.

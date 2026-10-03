# Drawing guide for library plates (LIB-8 pilot A and later batches)

One look across every builder. The owner's rule comes first: "Dont lower quality and output of the technical plates."
Every plate must match the approved 8 on pose truth, equipment realism, label placement a designer would choose, a
Mistake that reads in 2 seconds, a Trace that means something, and the same line weight, density and framing.

## 1. Files: one plate, one file
- A plate is `tools/plates/library/specs/<id>.mjs` (default export = spec, `id` = the exercises.json id without `lib_`).
  Keep everything about a plate in its own file, so two builders never touch the same file.
- Import engine helpers from `../engine.mjs`, never from `vendor/engine/index.mjs`. The index loads the sheet page,
  which needs a font that exists only in a mirror.
- Shared composers live in `eq/` (`inclineBench`, `rope`, `pecDeck`, `parts.mjs`). The LIB-8 builder owns them. Need a
  change? Say so in a PR comment with the reason. Never fork a composer into a spec.
- Never edit `tools/plates/vendor/**`, the golden fixtures, `GOLDEN.json`, `src/**` or `scripts/screenshot-gate.mjs`.
- The line weight, colours and classes come from the locked engine, so they are the same by construction. Draw
  equipment only with the primitives (SPEC.md 5) and the composers. Never paint a colour or add a class.

## 2. What the 8 do (measured on the 7 engine-drawn specs; the lateral raise is hand-drawn)
| Item | The 8 | Rule for new plates |
|---|---|---|
| Scale (px/m) | 123.9-146.3 (reference 146.29) | Reference camera `{ x0, y0: 339 }` or `fit`. Outside this range is flag F1 (zoom plates only) |
| Ink coverage of the plate | 0.100-0.246 | Frame so the figure fills the plate like the 8. Outside is flag F2 |
| Callouts | 3 each, 1-3 words, `<br>` for 2 lines | 3, from the card's 3 checkpoints |
| Mistake tells | 2-3 | 2-3, all about the one fault |
| Mistake guides | arrow, arc-arrow, dashed plumb or gap lines | Show the direction of the fault, anchored on the faulty pose |
| Hand-placed labels (`box`) | 2-6 | Start automatic; box a label only where a designer would move it. More than 6 is flag F4 |
| Longest leader | 40-82 px | Keep leaders short and on the open side. Over 81.9 px is flag F3 |
| Ghosts | 2-3, `parts` = only the moving limb and its equipment | The same. A ghost of a static part is a smudge |
| Trace | the point that tells the story (bar or handle grip, chin, ankle, heel), trim about [10, 12] | Trace the point the card's cue is about |
| Measured angle | one arc at the key joint, radius 18-40, `expect` when the card gives a number | One arc; `expect` equals the card's number (±2°) |
| Datum | a mid-foot plumb line, a hip vertical, the shin extended | Only when it proves a checkpoint |
| `checks` | every contact: pelvis on the seat, back on the pad, soles on the floor | Every contact; the report must list them within tolerance |
| Tempo | 3-4 phases named for the lift (Press / Hold / Return / Rest) | From the card's tempo, with phase words that suit the lift |

## 3. From the research card to the plate
- Draw only from the verified card (`docs/research/howto/cards/<id>.json`, card v2). Never invent a checkpoint, a
  fault or a number.
- The 3 `plate.checkpoints` become the 3 callouts: `label` → callout text (1-3 words), `what` → the cue.
- The cue is one sentence of 15 words or fewer, with no semicolons, in the plain, second-person style of the 8.
- `plate.mistake` becomes the Mistake pose and its guides. The tells are the visible signs of that fault.
- If `drawable` is false, draw the most common drawable fault the card names. Set
  `pilot: { drawableFault: '<why>' }` in the spec so the sheet shows flag F7.
- `plate.tempo` becomes the tempo strip. `plate.start` and `plate.end` numbers become named constants, with
  `measure.expect`, `checks` or the report's `angles` proving them within ±2° or ±1 cm.
- `plate.view` differs from the census view: set the view and explain it in the header comment. The sheet flags it
  as F6.
- Header comment: sources (the card's ids), and every geometry decision with its reason, as the 8 do.
- Optional `pilot: { note: '...' }` (one line) prints on the owner's sheet, e.g. a go/no-go result.

## 4. Craft notes the 8 learned the hard way
- **Contacts by IK.** Hands use `reach`, feet use `plant`. Lying and incline poses use `checks {plane}` on
  `backUpper`, `sacrum` and `buttock`, not `rootOnSeat`. Keep every contact error at or under 0.5 cm.
- **Hidden start parts.** The start layer drops moving equipment. The end torso also hides a start arm that sits over
  it. Redraw these as a dashed phantom (`line` with `cls: 'eq-line m-line'` in the end pose), as the squat's bar dot
  and the chest press's start arm do.
- **Mistake equipment.** A part that moves in the Mistake must carry `poly`, or it silently drops out of the
  Mistake view (PQ-H9). Lines (`cable`, `line`) do not carry it. For a cable that moves, add a thin twin only when
  `ctx.pose === 'mistake'`; `eq/rope.mjs` shows the pattern.
- **Anchors.** Put label anchors on the silhouette edge, on the open side (`shoulderTop`, `sternum`, `backUpper`,
  `heel`), never inside the figure.

## 5. Check every plate before you call it done
```
node tools/plates/library/report.mjs tools/plates/library/specs/<id>.mjs --shots <scratch>/<id>
node tools/plates/library/report.mjs golden:<closest_approved_id> --shots <scratch>/g     # the approved look
```
- **Report:** `ok: true`. Every render's `browserIssues` and `engineIssues` are empty in Silent Black, Paper and the
  Mistake. These are the engine's own checks: labels 8 px inside the plate, no overlap, nothing drawn under a label,
  no key joint under a label, contacts, checks and the measure.
- **Look at the 390 px PNGs** (`<id>-dark.png`, `<id>-paper.png`, `<id>-mistake-dark.png`) beside the closest
  approved plate. Score yourself on the critic's rubric (plan 3.4):
  - pose truth;
  - equipment realism and scale;
  - contact;
  - label placement;
  - the Mistake in 2 seconds;
  - the Trace means something;
  - consistent with the 8.

  Fix anything below 4 before handing over.
- **Measures** (`measures` in the report): pxPerM, coverage, longest leader and boxed labels. Values outside the
  table in section 2 become flags on the owner's sheet. Never tune a plate just to dodge a flag, and never hide one.

## 6. The sheet and pushing
- The owner's sheet is built on `claude/lib-8-pilot-a` by `node tools/plates/library/pilot-a/build.mjs`. It holds the
  plates page (the pinned bytes, built in golden A's chrome by `build-page.mjs`), the sheet around the same card
  bytes, and `out/self-check.json`.
- Drawing builders preview it with `--draft`. The LIB-8 builder merges their branches and builds the real one.
- Push only at milestones: CI runs on every push to every branch.

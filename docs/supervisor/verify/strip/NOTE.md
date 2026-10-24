# Tempo strip for plates with no sourced seconds (design card, D-LIB8M-NOSTRIP)

Sheets: `sheet-1.png` (Silent Black), `sheet-2.png` (Paper), 1062 x 1582 px each. Full-size 2x crops (780 px wide, 390 px app width) are in `crops/`. Both themes on one sheet would be about 3000 px tall, so the sheet is split by theme.

Inputs: main 5158609c; research cards claude/libht-research-lb4 083a8e12; pilot A claude/lib-8-pilot-a ff7c5c4f (box_jump and plank specs).
- **Box jump** uses its pilot A plate.
- **Front squat** has no plate on any branch, so its strip is shown under golden A's back-squat drawing. Only the strip is front squat's (card c21).

## How the strip is drawn today
- **Builder.** `tempoStrip` (vendor `artifact/build-page.mjs:149-153`; golden B `layers/artifact/build-page.mjs:93-97`, the same text) draws one segment per phase.
  - Each segment has a 4 px bar: accent for a moving phase, text-3 for a still one.
  - Under the bar sit the phase name (caption, uppercase) and `${s} s`. The bar's width is `flex: s`.
  - `card()` draws the strip only when there is `e.tempo` (vendor `:174`).
- **CSS.** The builder's CSS (`:268-275`) is the same as the app's `src/slices/howto/css/plate.css:86-93`.
- **Checks that need the strip.**
  - `extractPlates` throws without it (`golden.mjs:113-116`).
  - PQ-H2 `H2.chrome:tempo` (`qa/node.mjs:93`) needs `aria-label="Tempo: …"`.
  - H6 (`:176`) needs the spec's tempo to equal the tempo-map rows exactly.
  - H8 (`:239`) copy-checks only the phase names.
  - H4 (`qa/browser.mjs:153`) checks overflow at 390, 360 and 340 px.
- **Pilot A tempo map rows** (`pilot-a/tempo.json`): plank is `Hold '10–60'` and mountain climbers `Work 15 / Rest 15`.
  - Finding: plank's `flex: 10–60` is not a number. Its bar is only as wide as its label, not the full width (visible in the "Today · Plank" crop). This is outside this card; it is noted only.

## The shared patch (A, B and C are the same code and differ only in their tempo-map rows)
- **Data.** A phase with no sourced seconds has no `s` and may carry `word`. The map rows (D-LIB8M-TEMPO) gain `{ phase, move, word?, claim }`.
- **Patch.** One `once()` replaces the mirror copy's `tempoStrip` (the LIB-6-PM pattern; golden B and the vendored folder are never edited). The text lives in one shared module (here `work/nosecs-strip.mjs`) and is applied in 2 places:
  - `tools/plates/library/build-page.mjs` `patchedBuilder()`, for the plates page;
  - `tools/plates/library/build-layers-page.mjs` `patchBuildPage()` via `patchOnce(src, 'tempo strip', …)`, for the layers page.
- **Behaviour.**
  - If any phase is untimed, every segment gets `flex: 1`, so no bar implies a duration.
  - The value line shows the word, or `&nbsp;` when there is none.
  - The aria-label reads like `Tempo: lower controlled, drive up`.
  - There is no CSS change, so the app's `plate.css` and the `.ht` styles stay as they are.
- **Proven in this run.**
  - Golden A rebuilds e2bea90c… (860,766 B) with the patch, and golden B rebuilds e7b81413…; both are byte-identical.
  - The strip stays 40 px tall in every option, the same as today.
  - All 8 cards on the options page pass `extractPlates` and the H2 regex, and nothing overflows at 390, 360 or 340 px. That includes a 3-phase worst case: Lower/Controlled, Jump/Explosive, Step down.
- **Mixed cards** (pendulum_squat: down 2–3 s sourced, up not) keep "2–3 s" on the timed phase. Every bar is equal width.

## Options
**A · Phase names only.** It shows the phase names in the card's order (Lower · Drive up; Take-off · Step down), with equal bars and an empty value line.
- Code: the shared patch only. Rows are `{ phase, move, claim }`.
- PQ-H2: the strip is present and the aria-label is `Tempo: lower, drive up`.
  - H6 compares the rows exactly.
  - H8 already checks the phase names.
- Risks:
  - The empty value line looks unfinished next to a timed card.
  - Equal bars can read as equal time; reverse_lunge's card says to rise quicker than you lower.
  - It adds little that the plate does not already show.
- Covers 17 of the 17 no-seconds cards.

**B · Card cadence words.** It is A plus the card's own word in the slot where seconds go: Lower **Controlled** (front_squat, from "Controlled descent", c21) and Take-off **Explosive** (box_jump, from "Explosive take-off", c11/c3). A phase with no word stays blank.
- Code: the shared patch. Rows are `{ phase, move, word, claim }`. Two checks are added; neither is loosened:
  - H6 also requires each word, or its adjective form (control → Controlled), to appear in the verified card's `plate.tempo.text`.
  - H8's `plateStrings` (`node.mjs:239`) also reads the value-line words, which it skips today.
- PQ-H2: as for A (`Tempo: lower controlled, drive up`).
- Coverage: all 17 no-seconds cards have at least one word in `plate.tempo.text`:
  - Controlled: bear_crawl, bodyweight_squat, bulgarian_split_squat, front_squat, renegade_row, step_up, walking_lunge.
  - Smooth: bodyweight_split_squat, goblet_squat.
  - Slow: bodyweight_lunge, pistol_squat.
  - Slow / Smooth: forward_lunge.
  - Slow / Quicker: reverse_lunge.
  - Controlled / Explosive: jump_squat.
  - Explosive: box_jump.
  - Crisp: flutter_kicks.
  - Quick: sled_pull.
- Risks:
  - Which phase gets which word is a judgement on each card, so a reviewer checks every row.
  - Set-level advice ("full rest between sets") must never become a phase.
  - One phase may show a word while the next is blank.

**C · Sourced reps only.** One still bar, REPS **3–5** (box_jump c11, both quotes). Where no single range is sourced, it shows A, which is what the front squat cell shows.
- Code: the same patch. The row is `{ phase: 'Reps', word: '3–5', claim }`.
- PQ-H2: it passes only on the regex. `Tempo: reps 3–5` is not a tempo, so the meaning check would need a ruling.
- Coverage:
  - 6 of 17 have one sourced range: box_jump, jump_squat, flutter_kicks (kicks), goblet_squat, bodyweight_lunge, bodyweight_split_squat.
  - 4 have ranges that depend on the goal (lunges, bulgarian split squat), which needs a choice.
  - 7 have none.
- Risks:
  - The app's workout already shows the user's planned reps, so the strip can contradict their plan.
  - It drops the phase order.
  - The same strip means two things across the library.

## Recommendation
**B.** It is the only option that puts the sources' real cadence in the slot where seconds go, with no number. It covers all 17 cards and runs on the same patch as A, which it falls back to.

Not settled by this card: plan 8 decision 3 (the airborne convention for box_jump and jump_squat). Lifting the `held` lines on box_jump and reverse_lunge comes after the owner's choice and the patch merge.

Work files: `work/render.mjs` (page, crops, golden A proof), `work/goldenb.mjs` (golden B proof), `work/w340.mjs` (overflow check), `work/sheet.mjs`, `work/nosecs-strip.mjs` (the patch text).

## Decision (2026-10-24, D-STRIP-B)
**B · Card cadence words.** The supervisor made this choice under the owner's delegation of 10-24 ~07:15 UTC ("U do qll that. Dont stall and decide for me."). The reasons are the recommendation above. Card: `../lib-strip-card.md`. The work files beside this note (`nosecs-strip.mjs`, `render.mjs`, `goldenb.mjs`, `w340.mjs`) are the design run's copies, for reference only. They are scratch code and never ship as they are.

# F-W8A-HOLDS: the shared tools that held 3 W8a rows

Owner: supervisor (written 11-13; status `ready`, rulings below). Base: main `e15e1c65` (train 88, W8a). Every file:line below was read on that commit. Builder: Opus for each part (none is mechanical). These are tool and check cards: no app screen changes, and no shipped row's bytes move.

## Supervisor rulings (2026-11-13; these win over the text below)
1. **D-W8AH-SPLIT: accepted.** There are 3 cards, merged in the order part 2, then part 1, then part 3. Parts 1 and 2 run in parallel; part 3 starts after part 1 merges.
2. **Part 2, floor proof.** The PR carries a table with every shipped row: its measured step count E, the old floor of 15, and the new floor.
   - The new floor must be at least 15 for every row not in `text-zooms.json`, so no shipped row loses strictness.
   - The 5 mutations are posted as red lines.
3. **Part 1, byte proof.** All 14 pinned layers pages are rebuilt twice and stay byte-equal. Ghosts appear only on a scratch tree with assisted_pull_up flipped (fixtureTree form).
4. **Part 3: the label only, with no size change.** mountain_climbers' L7 passed at 170 in round 1 (#413 6760254084), and the 282 came from the plan, not from a finding.
   - The fix is the Right label and the caption on the row's sub-key, saying where the hand goes (c2, "under the shoulder").
   - The shared key's bytes stay put, under route A.
   - The changed hand panel then gets mountain_climbers' round-2 layers check (D-LIB13-PANEL2) in its ship wave.
5. Each part's PLAN and READY go on its own PR. A fresh Opus reviewer per READY.

## Why now

W8a (#415) shipped 3 of 7. Three of the four held rows are held by shared tools, not by their own content:
- **assisted_pull_up:** layers approved in round 1 (#413 6760254084). Held by D-W8A-ASSISTEDHOLD (#415 6763631846): the layers build and the HT4 twin each miss its case.
- **seated_leg_curl:** layers approved (#413 6761492481 point 4). Held by D-W8A-SEATEDHOLD (#415 6764870427): HT10's fixed floor of 15 steps.
- **mountain_climbers:** L7 passed (6761492481 point 5). Held because its drawn Right label comes from the shared palm-flat key (L3), together with Q-W8a-6, the hand panel size (6759468965).

Both rulings say a shared-tool change does not belong inside a ship wave. With these fixed first, the next wave can flip the 3 rows. underhand_lat_pulldown (F-UNDERHAND-PQH1) is not part of this card.

## Split (recommended: 3 cards)

| part | id, branch | frees | MANIFEST | merge order |
|---|---|---|---|---|
| 1 | F-W8A-ASSISTED (F-LAYERS-MGHOST + F-HT4-UNDER), `claude/f-w8a-assisted` | assisted_pull_up | build-layers-page.mjs key | 2nd |
| 2 | F-HT10-TEXTZOOM, `claude/f-ht10-textzoom` | seated_leg_curl | none (library/fidelity.mjs is not in MANIFEST.json) | 1st |
| 3 | F-HAND-PALMFLAT-SIZE, `claude/f-hand-palmflat-size` | mountain_climbers | pairs.mjs and build-layers-page.mjs keys | 3rd |

Why split: the write scopes do not overlap except build-layers-page.mjs (part 1 :208, part 3 :223), each frees a different row, and part 3 needs a hands-lane look that parts 1 and 2 do not. Part 1 holds F-LAYERS-MGHOST and F-HT4-UNDER together because assisted_pull_up needs both before it can flip. Part 3 merges main after part 1 and regenerates MANIFEST in its own `[golden update]` commit.

## Rules for every part

- Read `.claude/skills/builder/SKILL.md`. Branch from origin/main, open a draft PR, post `<ID> PLAN @ <sha>`, wait for the ruling, then build and post `<ID> READY @ <full sha>`.
- Never touch: research cards, plate specs, How-to sheets, `pages/*.json` configs, golden pages and their pins, `tools/plates/vendor/**`, `fidelity/goldenB.mjs`, `fidelity/harness.mjs`, `fidelity/ht10.mjs`, `scripts/screenshot-gate.mjs`, `twins/pins.json`, `.github/**`, `src/**`.
- MANIFEST.json changes only in a `[golden update]` commit, made by `manifestOf`, and moves only the keys of the files the part changes. Prove it with a blanked-keys test (F-PAIR-FAULTS A2 form). If a MANIFEST pin test goes red on a moved key, add that key to its moved-key list in the `research-routes.test.ts:109-121` W3_MOVED form, add-only and named with the part's id. Its check that the key equals the current file stays.
- No held row flips here. Each part shows its row passing on a scratch tree that flips it (LIB-2b fixtureTree form, as F-PAIR-FAULTS A4). The flip is a later LIB-SHIP wave.
- READY head contains the latest main: `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, and CI all green. A fresh Opus reviewer follows.

## Part 1: F-W8A-ASSISTED

### Measured facts
- **CI red:** howto-shard (4/67), run 42784492527, job 129724255451, #415 head `5fe00e47`:
  ```
  FAIL lib_assisted_pull_up * HT4/A5-fragments@*: assisted-pull-up: mistakeSvg sha256 1a8b4e83d651d19bb2a55eb39899292f45ed0a3b46cc1822d85d70cb17d597e0 != golden-A 5324dd0b14872b72dcc0b4186811e0b62cbc70b1decb4e62a5b4f386eff6c9fd
  FAIL lib_assisted_pull_up * HT4/A5-poses@*: assisted_pull_up|knee-pad-under: a call that cannot be attributed to base, cam, the plate or a declared zoom side
  ```
- **F-LAYERS-MGHOST:** the plates build runs `applyMistakeGhosts` before `applyZooms` (`build-page.mjs:17`, `:104`). The layers build runs only `applyZooms` (`build-layers-page.mjs:20`, `:208`). assisted's spec opts in (`specs/assisted_pull_up.mjs:118`). Its plates pin is `tests/howto/golden/library/lb01.json:469` (`5324dd0b…`).
- The specs with `mistakeGhosts: false`: assisted_pull_up :118, hip_thrust :258 (left-out), jump_squat :148 (approved-plate, lb04), v_up :174 (approved-plate, lb09; it also has a Mistake zoom circle, `specs/v_up.mjs:154`).
- None of them is on a layers page on main. The layers build stages only the group ids (`layers-spec.mjs:69-74`), and `lb09.layers.json` names v_up under `closeups` only, not in a group. So on every pinned layers page `applyMistakeGhosts` returns the same Buffer (`mistake-ghosts.mjs:51`).
- **F-HT4-UNDER:** `render/closeup/crop.mjs:142` draws `renderPlate(cropSpec(z, 'right'), { id: '<key>-under' })` when the Wrong is solid and has `under` (the CI comment cited :140 on its own head). The only user is `lib_assisted_pull_up.howto.mjs:162` (`knee-pad`). The twin's `sideOf` (`fidelity/twins/ht4.mjs:175-179`) knows base, cam, `-n`/`-m` and `<key>-right`/`-wrong` only.

### Do
1. `build-layers-page.mjs:208`: pass the page through `applyMistakeGhosts(page, specs)` before `applyZooms`, in build-page.mjs:104's order. One import line. Do not edit `mistake-ghosts.mjs`: its "three callers" comment (:4-7) goes one caller stale, so record the fourth caller in the comment at `build-layers-page.mjs:204-207` instead. That keeps the MANIFEST move to one key.
2. `twins/ht4.mjs` `libraryA5`: attribute `<key>-under` as the Right side of posture zoom `z`, and only when the source declares crop.mjs:142's condition (`z.wrong.under`, and `z.wrong.solid` or `z.wrongAlone`; family `zoom`). Its poses must match a reference pose, never a fault pose. Add `<key>|under` to the anti-blindness map (:172) for such a zoom.
3. Tests: one new file `tests/howto/f-w8a-assisted.test.ts`, and an add-only block after the libraryA5 describe in `tests/howto/library-fidelity.test.ts` (:225 form).

### write_scope
`build-layers-page.mjs`, `fidelity/twins/ht4.mjs`, the new test file, the add-only block, MANIFEST.json (`[golden update]`), and the moved-key lists of MANIFEST pin tests (add-only).

### Acceptance
- **A1, no pinned byte moves:** each of the 14 pinned layers pages (`tests/howto/golden/library/`: lb01, lb03-lb10, pilot-a, pilot-a3, pilot-b, pilot-b2, zoom) is rebuilt twice with `scripts/howto-rebuild.mjs` and equals its pin. `node tools/plates/generate.mjs --check` is clean. MANIFEST moves only build-layers-page.mjs's key.
- **A2, the row passes on a scratch tree:** lb01.layers with assisted_pull_up restored in the W8a form (the `e351f554^` config, W8a LAYERS READY 6759453858). Its layers Mistake svg has sha256 `5324dd0b…`, and its HT4/A5-fragments and A5-poses rows are green. Post the scratch page's sha256 for the ship wave.
- **A3:** every shipped id's HT4 rows stay green in CI.
- **A4, mutations (each must turn red):**
  - m1: no `applyMistakeGhosts` call. A2 is red with the CI's fragments line.
  - m2: the call after `applyZooms`. On a scratch lb09.layers with v_up in its group, v_up's Mistake svg differs from its lb09.json plates pin. If that page cannot build, say why and use a fixture spec with both fields.
  - m3: ghosts stripped for every spec (the field ignored). A1 is red on a pinned page.
  - m4: `sideOf` without the under branch. A2 is red with the CI's poses line.
  - m5: a `<key>-under` call for a zoom that does not declare `under`. Red (cannot be attributed).
  - m6: an under call that draws the fault pose. Red (poses).
  - m7: a declared under zoom with no under call captured. Red (anti-blindness).

### Stops
- `applyMistakeGhosts` throws on a layers page (`mistake-ghosts.mjs:56`, no Mistake plate found). Stop and post the markup.
- Any pinned page, generated file or panel sha moves. Stop and post the list; never re-pin.

### Ship-wave cost (not this card)
assisted_pull_up's flip re-adds its lb01.layers config, re-pins lb01 (an appended `'supervisor'` layers-page entry, D-BODYMAP-APPEND) and re-judges the assisted card's Mistake view: the judged page `231eced9…` had the ghosts (#415 6763627947 point 1). jump_squat and v_up would meet the same fragments red on a layers page; this part frees that too (inferred from the code, not run).

## Part 2: F-HT10-TEXTZOOM

### Measured facts
- **CI red:** howto-shard (55/66), run 42793207216, job 129755455526, #415 head `1dd1cd39`, the same line in all 5 themes:
  ```
  FAIL lib_seated_leg_curl silent-black HT10/sweep@390: A1: only 14 script steps probed, expected at least 15
  ```
  (also paper, midnight, ember, emerald).
- `library/fidelity.mjs:204` holds every library row to `r.stats.steps < 15`. The gate's own floor for the 8 is `fidelity/ht10.mjs:143` (`want('sweep').length * 15`), mapped in twins/pins.json as "steps >= 15 per id". This part changes neither.
- A step is one probe of `ht10Script` (`fidelity/harness.mjs:1033-1148`). On one sheet:
  - n normal callouts, Mistake on, m tells, the wrist line (2, if shown), Mistake off (if still on);
  - Trace (2);
  - for each Look closer chip, its page count plus 1;
  - 2 per "Show me";
  - Feel it (if there is a chip), show more (if there is one), one per feel row;
  - then 2 (everything expanded, everything closed).
- seated_leg_curl has `zooms: []` (`lib_seated_leg_curl.howto.mjs:118`). Its two card zooms are text checkpoints (D-SHIP-TEXTZOOM, `gen/zooms.mjs:79-90`), so it has no chip steps.
- `text-zooms.json` also lists machine_pullover and smith_machine_shoulder_press, both at approved-plate. No shipped row is listed.
- The sweep already checks the chip, "Show me" and feel-row taps against the row's judged layers card (`harness.mjs:1156-1165`, `:1376-1380`; `fidelity.mjs:196-198`).

### Floor
- **E(row):** the exact step count the script must reach, counted on the row's judged layers card (`pages[lib].layers`, already loaded at fidelity.mjs:196). E = n + 1 + m + (2 if the card has `#<pre>-also-hand`) + 1 + 2 + Σ chips (pages + 1) + 2 × shows + (1 if a feel chip) + (1 if `.fr-more`) + rows + 2. It takes one evaluate per page, cached the way `golden` is.
- **Check:**
  - a row not in text-zooms.json: steps ≥ max(15, E);
  - a row whose text-zooms entry passes `textZoomRow` (`gen/zooms.mjs:85`): steps ≥ E.
- **At least as strict for every shipped row:** for every row not in text-zooms.json, max(15, E) ≥ 15, today's floor. No shipped row is in text-zooms.json. Only a ruled text-zoom row can go below 15, and only to its own E.
- **E is exact:** PLAN posts a table of E against the measured steps for every shipped library row, from one CI run of all howto shards (normal sweep, silent-black), plus seated on the scratch tree (pilot-b with seated, the judged `d8230e88…` page; 14 measured on `1dd1cd39`). Every row must show E = measured.
- The counting and the floor are a pure exported function in `library/fidelity.mjs`, so they are unit-tested without a browser.

### write_scope
`library/fidelity.mjs` (`ht10Job` :194-206 and the new function), and an add-only block in `tests/howto/library-fidelity.test.ts` or one new test file.

### Acceptance
- **B1:** seated_leg_curl at 14 steps passes on the scratch tree in all 5 themes.
- **B2:** the E table, every row equal. CI green on every shipped row.
- **B3, mutations (each must turn red):**
  - m1: the 15 dropped for a row not in text-zooms.json. A posture row with E = 14 at 14 steps is red.
  - m2: a text-zoom row at E - 1 steps.
  - m3: a row in text-zooms.json whose entry fails `textZoomRow` (a ruling not in `TEXT_ZOOM_RULINGS`, `gen/zooms.mjs:80`) keeps max(15, E), so it is red at 14.
  - m4: E counted without one term, each term in turn (callouts, tells, chip pages, shows, rows). The E table test is red.
  - m5: E read from another row's card.
- **B4:** `git diff` is empty for `fidelity/ht10.mjs` and `twins/pins.json`.

### Stops
- E ≠ measured on any row. Stop and post the rows and the term that differs. Never drop a term to make it fit.

### Ship-wave cost (not this card)
seated_leg_curl flips with its text-zooms.json entry and its pilot-b page entry. Its layers are approved (6761492481). If the rebuilt pilot-b page is not `d8230e88…`, send a card compare.

## Part 3: F-HAND-PALMFLAT-SIZE

### Measured facts
- The layers page swaps the sheet's hand block for the key's pair panel (`build-layers-page.mjs:289-299`). A row naming `pairFaults` draws its sub-key (`hands/pairs.mjs:410-411`, `subPanel` :457-462), drawn from the key's first id, push_up, by `renderPair`.
- **The drawn Right label:** `hand-palm-flat.mjs:15` `rightNote: 'Whole hand down'` goes through `pairSpec` (`pairs.mjs:119`, `noteOf` :95-104) and `renderPair` (:274), and is drawn in capitals in the Right half (`lib12-hand.mjs:215`). A row's `pairWords` change only the captions (`subPanel` :459-461). W8a FIX (6761475346 point 3) tried it and got "WHOLE HAND DOWN" over "Hand under shoulder".
- **The size:** `renderPair` :275 uses `opts.panelHeight ?? s.panelHeight`. The floor variant sets none, so the key's render default of 170 applies (`hand-palm-flat.mjs:39`). The sheet's own `panelHeight` (`lib_mountain_climbers.howto.mjs:110`) never reaches the page: 170 and 282 built the same sha (6759453858, Q-W8a-6). One scale fits both halves, the smaller of the width fit and the height fit, and each half is 171 px wide (`lib12-hand.mjs:206-209`).
- **The words:** `words/palm-flat-floor-over.json` gives one Right text ("Whole hand down") for both faults, and `pairs.mjs:101-102` refuses differing Right texts on one key. Its `source` fields cite `hand-palm-flat.mjs:14/:18/:20`, but those lines are now :15/:19/:21. They are stale and not fixed here.
- **The ask (#413 6760254084 point 3):**
  - Right says where the hand goes: "Hand under shoulder", from c2 of `cards/mountain_climbers.json`, "Hands go directly under the shoulders with the arms straight."
  - The captions say "directly under the shoulder".
  - Size 282, the single-hand pages' reference height (`lb01.closeups.mjs:27-29`, `:31`; `lb05.closeups.mjs:12-22`; Q-W8a-3).
- Round 1 passed mountain_climbers' L7 with the panel at 170 (6761492481 point 5). 282 came from the plan (Q-W8a-3) and was ruled into this card with Q-W8a-6, not from a failed check.

### Cost of changing the shared key (route B, rejected)
- **Rows:** the key draws 8 ids (`hand-palm-flat.mjs:27`): push_up, incline_push_up, pike_push_up, bird_dog and bear_crawl (shipped); diamond_push_up, burpee and mountain_climbers (approved-plate).
- **App bytes today:** none move. No shipped row draws the pair.
  - `hands/no-zoom.json` lists push_up, incline_push_up and pike_push_up (D-SHIP-C3, card-no-zoom), and bird_dog and bear_crawl (D-SHIP-HANDW7, gap-ruled).
  - `src/howto/generated/` has no palm-flat handpair chunk.
- **Pins that move:**
  - `tests/howto/pair-faults.test.ts:47`, the panel `938dc3fc…`;
  - `tests/library/lib12-fix.test.ts:66`, `hand-palm-flat.mjs` `3049d21f…` (the D-LIB12FIX frozen list);
  - the 8 rows' MANIFEST entries, plus the words file's if its text changes.
  The `hand-views.test.ts:88` sweep re-renders all 16 palm-flat pairs.
- **Review:** the approved LIB-12 FIX SVG (#191 5976224674 @ 0d268a7) changes, so a hands panel re-judges both faults.
- **Wrong for 7 ids:** "Hand under shoulder" is mountain_climbers' c2. The key's Right also heads the cupped-palm page, and `pairs.mjs:101-102` forces one Right text for both faults.

### Do (route A, recommended): row options on the sub-key
- Add two layers-config row fields. Each is valid only with `pairFaults` (a sub-key) and is checked in `rowFilterOf` (`pairs.mjs:379-408`) under the `pairWords` rules: its source must cite `cards/<id>.json` (:403).
  - a drawn note, `{ right: { text, source } }` (a wrong note is optional);
  - a panel height, from a fixed list (today [282]), each value with its reference.
  PLAN names the fields.
- `subPanel` passes them to `renderPair` as new options that default to today's values. `subKeysOf` (:413-431) throws when two configs give one sub-key different options, as it already does for words (:421). The no-pair throw in `pairRowsOf` (`build-layers-page.mjs:223`) covers the new fields.
- No key, view, words or engine file changes, so every existing key and sub-key renders as today.

### write_scope
`hands/pairs.mjs`, `build-layers-page.mjs` (:223 only), an add-only block named F-HAND-PALMFLAT-SIZE in `tests/howto/pair-faults.test.ts`, MANIFEST.json (`[golden update]`), and the moved-key lists of MANIFEST pin tests (add-only). `gen/handpairs.mjs` or `gen/zooms.mjs` only if the app path must pass a field; their outputs stay byte-equal.

### Acceptance
- **C1, nothing moves:** `pair-faults.test.ts` PANEL_MAIN (:34-50) and W3_SUBS (:54-59) are unchanged and green. All 14 pinned layers pages are byte-equal. `generate.mjs --check` is clean. MANIFEST moves only the 2 keys.
- **C2, scratch render of mountain_climbers** (pilot-a row `{ pair: 'palm-flat-floor-over', pairFaults: ['hand-ahead'] }` plus the new fields):
  - the Right head reads HAND UNDER SHOULDER, and the Wrong head reads HAND AHEAD;
  - the captions say "directly under the shoulder" (c2);
  - the panel height is 282, and `report.ok` is true (`hand-palm-flat.mjs:40-41`);
  - the scale at 282 is larger than at 170 (post both);
  - in Chromium, each note's box lies inside its half in all 5 themes.
- **C3, mutations (each must turn red):**
  - m1: a new field without `pairFaults` (layers and pairs);
  - m2: a note source that does not cite `cards/mountain_climbers.json`;
  - m3: a height not on the list (300);
  - m4: two configs giving one sub-key different notes;
  - m5: `renderPair` ignoring the note option, so C2's label check is red;
  - m6: the height applied to every sub-key, so the W3_SUBS pin is red;
  - m7: a 40-character note, so the box check is red.
- **C4:** before READY, post the scratch panel and its sha for one fresh hands-lane critic: L3 (a matched pair) and hand size.

### Stops
- The scale at 282 is not larger than at 170 (the width bounds the hand). Stop, post both scales and ask whether to keep 170.
- The note does not fit its half in any theme. Stop and post the box.
- Any existing panel or page sha moves. Stop.

### Ship-wave cost (not this card)
mountain_climbers' flip:
- re-applies the L7 crop approved at `29e4af37`: `lib_mountain_climbers.howto.mjs:133-135` (centre buttock + [5, 30], sizePx 350, spine heel.l to shoulder.r, extend [0.04, 0.2]) and `pilot-a.closeups.mjs:32` (`css.spine`);
- keeps main's feel line under D-W8A-MCFEEL;
- adds the pilot-a row with the new fields, then re-pins pilot-a;
- adds the handpair chunk to the budgets;
- gets a layers check of L3 and the hand size.

## Risks

- **A stronger check turns a shipped row red (part 2).** max(15, E) can rise above 15. Mitigation: the E table from one CI run before READY, and the E ≠ measured stop.
- **A floor that is too loose for a text-zoom row (part 2).** Mitigation: E is exact by the table. Only `textZoomRow`-checked entries qualify (m3).
- **Over-broad attribution hides a stray call (part 1).** Mitigation: only crop.mjs:142's exact condition is attributed, and m5-m7.
- **Crops of a ghost-off spec.** `crop.mjs`'s Wrong crops call `renderPlate` without `mistakeSvg`, and D-HELD6-MGHOST names three callers, none of them crop.mjs. Part 1 leaves crop.mjs alone, and the panel approved those crops. If the scratch build shows ghosts in a crop, post it as a finding and do not fix it here.
- **MANIFEST churn.** Parts 1 and 3 move the build-layers-page.mjs key in every pinned row (134 rows). Mitigation: the blanked-keys proof, `[golden update]` commits, and the merge order 2, 1, 3.
- **The note overflows its narrow half (part 3).** Mitigation: the Chromium box check in 5 themes, and m7.
- **Per-row words drift from research (part 3).** Mitigation: the source must cite the row's card, as `pairWords` does (m2).

## Forecast

Each estimate is build plus review plus one fix round. CI wall time on main `e15e1c65` was 66 min (run 42898934120).
- Part 2: about 1 day, including one full CI run to measure E for every row.
- Part 1: about 1 day, including the 14-page rebuild (twice each) and the MANIFEST commit.
- Part 3: about 1.5 days, including the hands critic round.
- The flips of the 3 rows are a separate ship wave with its own pins and panel. Assumption: the account's weekly limit allows the runs. Uncertainty: whether E is exact on every row (part 2), and whether 282 enlarges the hand (part 3).

## Not verified here

- The E formula against measured steps. No browser run was made.
- That `applyMistakeGhosts` finds the Mistake plate on a layers page. This is inferred from the plates path and HT4's fragment slicing; A2 proves it.
- That 282 enlarges the palm-flat hand. The scale was not measured.
- That jump_squat and v_up would hit the same red. This is inferred from the code.

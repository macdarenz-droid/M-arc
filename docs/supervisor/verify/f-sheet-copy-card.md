# F-SHEET-COPY

Owner: supervisor (written 11-13 against main `e15e1c65`). Branch: `claude/f-sheet-copy`. Builder: Opus. It is a copy-only card: no layout, plate, data shape or behaviour changes. It is one of the owner items for the release candidate (HANDOVER.md:838). It runs after the last LIB wave merges and before the release candidate (see Risks).

## Supervisor rulings (2026-11-13; these win over the text below)
1. **R1: remove the whole closing line (Part B).**
   - The owner's 10-01 rule is later than his 09-30 wording, and it names this exact case: "Not medical advice" on a gym app. His own reason: "Thats a gym app with risk advice only ofcourse it is considered not medical advice." Play does not require the line in the app (answer/16679511, 13996367 and 14738291 as quoted below), and the store text already carries it.
   - This follows the owner's own rule, so no new owner question is needed. The next APK post names the change.
2. **R2: accepted.** For this copy-only change the panel is:
   - two blind Opus content critics on the changed strings, with a plant;
   - plus my crop check of 6 sheets in both themes (2 golden B, 4 library), covering each new heading and the closing area.
3. **R3: accepted.** This is a fifth AGENTS.md exception, in the plan-risk-22 form. Add it verbatim to the `scripts/screenshot-gate.mjs` / `tests/theme.test.ts` row, after the fourth exception, and call it out in the PR:
   "A fifth exception (supervisor, 2026-11-13, plan risk 22, F-SHEET-COPY): F-SHEET-COPY edits only the lines of HT-9's blocks that its card's section C lists (`docs/supervisor/verify/f-sheet-copy-card.md`), each proven at least as strict by the card's mutations MB1-MB4."
4. **Headings: accepted as proposed** ("Technique", "Setup", "Target muscles", "Off-target feel", "Risks"; "X: right and wrong" becomes "X"; "Thumbless grip"). The Train button keeps "How to do it", because it is a control label. The content critics judge the set, and a heading they fail gets one fix round.
5. **Order:** this lane starts when a LIB lane frees. It touches every sheet pin, so it merges after W8b and PF5 or rebases its re-pin onto them. Plan for one re-pin pass at the end, on the latest main.

## Problem

The owner's UI-copy rule (AGENTS.md:14, owner 2026-10-01) says: "never put words in the app ... that talk down to users or state the obvious ("In plain words", "Not medical advice" on a gym app). Explain nothing unless Google Play requires it (cite the policy) or the owner explicitly asked for it. Labels that name a control or show data stay. ... Headings ... are short labels of one to three words, a noun phrase: never a sentence, a "What ..."/"How ..." question, a qualifier such as "off by default" or ", and where", or a leading "The", "This" or "About"". DOC-6 applied the same rule to the policy page, for example "How your data is protected" became "Data protection" (COACHING-DECISIONS.md:1604, D-DOC6-1).

On main, every How-to sheet (72 shipped) still carries five template headings and one closing line that break this rule, and 19 sheets carry per-sheet headings that break it.

## Strings found (main `e15e1c65`)

**A. Shared template headings: on every shipped sheet (72).**

| # | String | App source | Golden B / library source | Pinned by |
|---|---|---|---|---|
| A1 | "How to do it" as the sheet eyebrow, inside the sheet's `h2` | `src/howto/ids.ts:4` (`HOWTO_LABEL`), used at `src/slices/howto/HowToSheet.tsx:36`, rendered at `src/ui/primitives.tsx:258` | `tools/plates/layers/artifact/build-page.mjs:111` | `tools/plates/fidelity/harness.mjs:844` (HT-3 A3 `st.eyebrow`), `tools/plates/library/fidelity.mjs:165` (library A3), golden B and 14 library layers pages |
| A2 | "Set it up" | `src/slices/howto/sections/Setup.tsx:46` | `tools/plates/layers/artifact/howto-layers.mjs:244` | gate HT-9 A4 reads it from golden B (`scripts/screenshot-gate.mjs:7917`); test titles only in `tests/howto/sections-setup.test.ts:1,47` |
| A3 | "Where you should feel it" (feel `h4`), plus the map label "Where you should feel it. Main: …" | generated `src/howto/generated/feel-*.ts` (72) | `howto-layers.mjs:233`; label `tools/plates/layers/engine/feelmap.mjs:171` | `tools/plates/gen/feel.mjs:210` (`NOPRIMARY_MARK`), `tools/plates/library/build-layers-page.mjs:47` (`FEEL_NOPRIMARY`), `tests/howto/feel.test.ts:416`, `tests/howto/lib-ship.test.ts:1231-1239` |
| A4 | "If you feel it in…" (feel `h5`) | generated `feel-*.ts` (72) | `howto-layers.mjs:235` | `build-layers-page.mjs:94` (`FEEL_ROWS_HEAD`), `tests/howto/platefix3-engine.test.ts:21,26,32` |
| A5 | "Risks and when to stop" | `src/slices/howto/sections/Risks.tsx:34` | `howto-layers.mjs:280` | gate HT-9 A4 reads it from golden B (`screenshot-gate.mjs:7918`); test titles only in `tests/howto/sections-risks.test.ts:1,36` |

The Train button keeps "How to do it" (`src/slices/workout/Train.tsx:830`): it names a control, and the rule keeps those. Only the eyebrow changes.

**B. Per-sheet headings.**

| # | String | Where | Pinned by |
|---|---|---|---|
| B1 | "<X>: right and wrong", 15 distinct (Hand, Bar on back, Depth, Top height, Shoulders, Pelvis curl, Knee pad, Bar path, Back on pad, Feet, Seat height, Shoulder blades, Top position, Back line, Finish) | 28 zoom headings in 12 shipped `ht-*.ts` (the 8 + chin_up, close_grip_pulldown, hanging_knee_raise, inverted_row), shown in 9 `posture-*.ts`, 8 `hand-*.ts` and 10 `handpair-*.ts`. With the pair panels (`loaders.ts:167-177`), 19 shipped sheets show at least one. Sources: golden B `tools/plates/layers/exercises/` barbell_back_squat.howto.mjs:177,199,219; dumbbell_lateral_raise.howto.mjs:202,223,246; hanging_leg_raise.howto.mjs:273,291,314; lat_pulldown.howto.mjs:254,275,296; leg_press.howto.mjs:168,187,208; machine_chest_press.howto.mjs:101,123,142; pull_up.howto.mjs:300,320,351; seated_cable_row.howto.mjs:257,275,300. Library `tools/plates/library/howto/`: lib_chin_up:146, lib_close_grip_pulldown:141, lib_hanging_knee_raise:116, lib_inverted_row:107 (shipped); lib_assisted_pull_up:136, lib_incline_machine_press:83, lib_shoulder_press:95, lib_underhand_lat_pulldown:146 (not shipped). Hand pairs: `tools/plates/library/hands/words/*.json` line 3, 15 files | `tests/howto/content.test.ts:113,120,129`; `tests/howto/fixtures/bad/c7-visible-budget.ts:9`; `tests/howto/pair-faults.test.ts:135`; `tests/library/lib7-fix.test.ts:214,254`; `tests/library/lib7b.test.ts:83`; `tests/library/lib7c.test.ts:440`; `tests/library/lib12-fix.test.ts:83`; `tests/library/fixtures/lib7fix/panel-words-da65b13a.json` (8 rows) |
| B2 | "Option: thumb over the bar" (eyebrow on the squat's option figure, and the start of its image label) | `hand-barbell-back-squat.ts`; source `tools/plates/layers/exercises/barbell_back_squat.howto.mjs:182` | golden B page only |

**C. The closing line, on every shipped sheet (72).**

"General guidance, not medical advice. If something hurts, stop and get it checked."
Sources: `tools/plates/layers/howto/shared.mjs:48-50`; generated `src/howto/archetypes.ts:58` (from `tools/plates/gen/content.mjs:163`); rendered `Risks.tsx:52` and `howto-layers.mjs:251,316-317`. Pinned by: `tools/plates/layers/artifact/copy-lint.mjs:60,322` (`OWNER_DISCLAIMER`); `tests/howto/content-gen.test.ts:226-227`; `tests/howto/sections-risks.test.ts:60-81`; `tests/howto/checks/c19.ts:63-64` (a missing DISCLAIMER is an error); `content.test.ts:518`; `lib-ship.test.ts:823-824`; `library-lint.test.ts:124-402` (7 calls); gate HT-9 C19 (`screenshot-gate.mjs:7610-7612,7621,7656-7663`), HT-9 order fix (`:7757`), HT-9 (`:7814,7830-7833,7910-7919,7952`); `tools/plates/fidelity/goldenB.mjs:236`, `harness.mjs:1257-1259,1314-1315`, `ht10.mjs:199,218-219` (M11, M12); `tools/plates/layers/artifact/shoot2.mjs:73-97`; library twins `tools/plates/library/fidelity/twins/ht9.mjs:45,57-105,169,248-249`, `tuples.mjs:172`, `twins/pins.json` (HT-9 rows, e.g. 822-872) and `fidelity/ship-w6.mjs:3-30`.

**D. Checked and kept.**

| String | Why it stays |
|---|---|
| "Grip", "Common handling mistakes", "Tells" | One to three words, noun phrases. |
| "Look closer" (`LookCloser.tsx:38`) | It labels the chip group (`role="group"`): a label that names controls. |
| ~70 library zoom headings ("Top position", "Back line", …) | One to three words. Six are cue-form ("Shoulders down", "Knee steady", "Hips still", "Body still", "Hips high", "Hips back"): each names a body part and its target, which is the form golden B's chips use, not a sentence. Critic C2 confirms. |
| Camera labels: "Side view", "Seen from behind", "Thumb options, seen from the side" (`.th-cam`; 3 golden-B hand panels), the in-drawing "SEEN FROM THE SIDE" | They name the view, so they show data. Critic C2 confirms the third. |
| "Front"/"Back" map labels; "Usually means", "Fix" run-in labels; "Right"/"Wrong" | They label data. |
| Controls: "Trace", "Mistake", "Feel it" (aria "Where to feel it"), "Show me the …", "All N steps"/"Fewer steps", the zoom links "If you feel it in · <place> · This is usually why" (`tools/plates/library/render/closeup/zbox.mjs:85`) and "… This is usually why." | They name controls. |
| Red-flag names ("Wrist pain" …) and lines | NHS-sourced safety content, not headings. |
| 9 variant lines ("Drawn with a V-handle on a pulldown machine." …) | They tell the user that the drawing differs from the named exercise. That is information, not the obvious. |
| "✓ Saved offline" | The owner asked for it (D-COPY1-5). |

## Play policy (read 2026-11-13)

Finding: **not required in the app.**

- Health Content and Services, https://support.google.com/googleplay/android-developer/answer/16679511:
  - "Other health and medical apps must include a clear disclaimer in their app description indicating that the app is not a medical device and does not diagnose, treat, cure, or prevent any medical condition." The place it names is the app description. That line is already in the store text (`docs/PLAY-SUBMISSION.md:20`).
  - "Apps must also remind users to consult a healthcare professional for medical advice, diagnosis, or treatment." No sentence says where the reminder goes. It is in the store text (`PLAY-SUBMISSION.md:24`, D-COPY1-medical). The page has no sentence about fitness or exercise.
- Health app categories and additional information, https://support.google.com/googleplay/android-developer/answer/13996367:
  - Under "Best practices for health apps", for apps that make a health or medical claim ("such as helping with diagnosis or management of health conditions"): "you should disclose certain key information to users in a clear and easily understandable way." "This may include the following:" … "All required disclaimers and warnings" (for example, "requiring users to seek advice from a doctor or other qualified healthcare professional") "clearly within the app." This is a "should … may include" best practice, for apps that make a medical claim. M/ARC makes no such claim.
  - "Medical apps, health and fitness apps, and health research apps are examples of health apps." Being a fitness app adds no in-app text duty on this page.
- Provide information for the Health apps declaration form, https://support.google.com/googleplay/android-developer/answer/14738291: the category is "Activity and Fitness" ("Apps that monitor and record physical activities, exercise routines, and workouts."; ticked per `PLAY-SUBMISSION.md:103-105`). The page asks for no in-app text.
- No Google page asks for a "not medical advice" line. This matches D-COPY1-3 (COPY-1, 09-30).
- Even under a strict reading, 71 of 72 shipped sheets tell the user in the app to "See a doctor" or "Get it checked today" in their red-flag boxes. machine_lateral_raise has no box (`ht-machine-lateral-raise.ts:434` `riskFlags: []`).

## Rulings needed before the re-pin

- **R1, the closing line (supervisor).** Play does not require it. But the owner chose these exact words (09-30 03:28, HANDOVER.md:223), and D-COPY1-5 kept the line for that reason. His later rule (10-01) names "Not medical advice" on a gym app as the example of what not to show: "Thats a gym app with risk advice only ofcourse it is considered not medical advice." (COACHING-DECISIONS.md:1578). Recommended: remove the whole line (Part B). The supervisor applies it under D-OWNER-RECOMMENDED (recorded on `claude/sup-lib4-cards`, lib4-cards.md:4831; not yet on main), records it, and names it in the next APK post's "what changed" so the owner sees it. Rejected option: keep only "If something hurts, stop and get it checked." It repeats the red-flag boxes and still changes his words. If the supervisor holds that his 09-30 choice needs his own yes, Part A ships alone and Part B waits for one owner question. Part B then costs a second re-pin pass.
- **R2, the panel (supervisor).** For a copy-only change, the panel below counts as the "full review panel" of D-OWNER-REPIN (COACHING-DECISIONS.md:3218).
- **R3, other tasks' gate lines (supervisor; Part B only).** Part B must edit lines in HT-9 C19, the HT-9 order fix and HT-9 blocks. That needs a fifth AGENTS.md exception in the plan-risk-22 form: it names exactly the lines in section C above, each proven at least as strict by mutations MB1-MB4.

## Design

**Part A, the headings (no owner input needed).**

| Now | New | Reason |
|---|---|---|
| A1 eyebrow "How to do it" | "Technique" | A "How …" phrase, not a noun (DOC-6's "How your data is protected" became "Data protection"). Add a `SHEET_EYEBROW = 'Technique'` constant in the sheet chunk (HowToSheet.tsx). `HOWTO_LABEL` stays for the button, so `tests/workout/no-form-guide.test.ts` A1-HT.a and gate HT-3 G3/G6 do not change. harness.mjs:844 and library fidelity.mjs:165 compare against the constant read from source, not a second literal. |
| A2 "Set it up" | "Setup" | A verb phrase. |
| A3 "Where you should feel it" | "Target muscles" | A "Where …" clause of 5 words. The map label's prefix repeats the heading word for word today, so it becomes "Target muscles. Main: …" to keep one name (feelmap.mjs:171 and the 4 anchors and tests in A3). |
| A4 "If you feel it in…" | "Off-target feel" | A clause fragment with an ellipsis. |
| A5 "Risks and when to stop" | "Risks" | 5 words with an ", and when" qualifier. The boxes under it say when to stop. |
| B1 "<X>: right and wrong" | "<X>" | A qualifier. The panel's own Right and Wrong labels already say it, and the library already uses this form ("Top position", "Back line"). |
| B2 "Option: thumb over the bar" | "Thumbless grip" | 5 words with a colon qualifier. "Thumbless" is the approved name of this thumb position in the pull-up thumb options. |

Change both the app source and the golden B / library source for every row, then regenerate. Golden A stays unchanged (`tests/howto/golden/technical-plates.html`, `GOLDEN.json`, `tools/plates/layers/engine/sheet.mjs:102`): it is under the owner's byte lock, and the app's sheet head is app chrome (D-HT2, `src/slices/howto/css/sheet.css:5`). The artifact page kickers ("M/ARC · How to do it", `build-page.mjs:573`, `tools/plates/library/build-page.mjs:25`) never show in the app and also stay unchanged.

Prevention: give copy-lint's `heading` kind a 3-word cap and the banned forms (`copy-lint.mjs:188`; the file changes in this card anyway). A future library row with a 4-word or "X: right and wrong" heading then fails at authoring time. No current row breaks the cap once B1 is applied.

**Part B, the closing line (after R1).** Delete `DISCLAIMER` from shared.mjs and the generator, along with its render in Risks.tsx and howto-layers.mjs and its dead CSS (`src/slices/howto/css/text.css:32`, `build-page.mjs:218`). Flip every pin in section C to assert absence: no `.ht-disclaimer` and no "medical advice" text. Replace each wait on `.ht-disclaimer` with a wait on `.risks`, which mounts in the same fragment (`Risks.tsx` returns both). `checkC19Shared` no longer asks for a DISCLAIMER. The "last node" rule in shoot2 and harness becomes "the last red-flag box ends the sheet". The twins and `tuples.mjs` drop the `disclaimer-L3` and `disclaimer-copy` rows. Re-pin the HT-9 rows in `twins/pins.json` and update the HT9 count in `docs/howto/library/LIB-4-DESIGN.md:37` in the same commit. Docs: `PLAY-SUBMISSION.md:28` is stale either way (it says the line "is not rendered in the app yet", but Risks.tsx:52 renders it), so it is corrected in both outcomes. Also update `tools/plates/layers/README.md:15,35,109-112` and append D-SHEETCOPY entries to COACHING-DECISIONS that supersede D-COPY1-5's How-to line.

## Re-pin

The re-pin is one pass. The builder makes every source edit first (Part A, plus Part B if R1 is ruled by then), regenerates, builds each page twice with equal shas, then re-pins.

- `src/howto/generated/**`: the bodies change in feel ×72, ht ×12, posture ×9, hand ×8 and handpair ×10 (plus archetypes.ts with Part B). The `inputsSha256` header line moves in every file whose inputs changed.
- Golden B: `tests/howto/golden/howto-layers.html`, plus `tools/plates/layers/MANIFEST.json`, which needs the hashes of the changed locked files (README.md, build-page.mjs, copy-lint.mjs, howto-layers.mjs, shoot2.mjs, engine/feelmap.mjs, the 8 exercises/*.howto.mjs and howto/shared.mjs) and a new `pageApproval.current` that supersedes `6b86baa`. That entry is `approvedBy: 'owner'` under D-OWNER-REPIN, quoting his words with the date, citing the panel, decision F-SHEET-COPY.
- The 14 library layers pages (`tests/howto/golden/library/{lb01,lb03,lb04,lb05,lb06,lb07,lb08,lb09,lb10,pilot-a,pilot-a3,pilot-b,pilot-b2,zoom}.layers.html`), with a superseding `layers-page` entry appended to each batch `.json` as `'supervisor'` (point 4). Plates pages and `plate` entries do not move.
- `tools/plates/library/MANIFEST.json`: all 134 rows. Every row hashes howto-layers.mjs, copy-lint.mjs, shared.mjs and the layers MANIFEST.
- `tests/howto/fixtures/generated-bodies.json`: the 32 bodies of the 8 (feel, ht, hand and posture; plus archetypes.ts with Part B), with a `$comment` line in the HT-11 form.
- The B1 test pins and `panel-words-da65b13a.json`. Part B also re-pins `twins/pins.json`.
- These do not move: GOLDEN.json, `tools/plates/pins.json`, technical-plates.html, `tests/howto/budgets.json` (chunks only shrink; it changes only if the gate reports a growth), and `tests/howto/fixtures/lib2b/cable-lateral-raise.layers.html` (a copied fixture).

## Panel

One round with Opus members. Each member posts PASS or FIX on the PR, and the re-pin entries cite those comments.

- **C1, the template set:** A1-A5 and the map label. It checks the rule, the meaning, and that nothing is lost, on one sheet per family (free weight, machine, hanging, bodyweight).
- **C2, the per-sheet set:** the 15 B1 stems, B2, and the judgement calls in table D.
- **C3, the closing line (Part B only):** the end of every shipped sheet. It names machine_lateral_raise, the sheet with no box.
- **Layers crop check:** crops of every changed heading on golden B and on one sheet per library page, in Paper and Silent Black at 390 and 340 px. It looks for wraps, clipping and leftover space where the line was.

## Acceptance

1. **Strings.** Every row of tables A, B and C changes as listed. A new guard, `tests/howto/f-sheet-copy.test.ts`, walks every shipped id: the eyebrow constant, `renderSetup`/`renderRisks`, the Hand/LookCloser/HandlingMistakes strings, and every `h4`/`h5`, `.zx-h` and `.eyebrow` in the feel, posture, hand and handpair strings (skipping eyebrows inside a `button` and `.th-cam`/`.z-cam` camera labels). It runs the same walk over golden B and the 14 library layers pages. Each heading must have 1-3 words (a hyphenated word counts as one), no `: ? … , . ;`, no lead word The/This/About/What/How/Where/When/Why/If, and no "right and wrong". It asserts the id count and the count of each file kind, and none of the old strings may remain (golden A and `HOWTO_LABEL` are exempt, and the guard says why).
2. **Only copy moved.** For golden B and each library layers page, apply the listed replacements (and the line removal, with Part B) to the old page as a pure text substitution. The result must be byte-equal to the new page. Post the 15 sha pairs.
3. **App equals golden B.** Gate blocks HT-3 L3, HT-6, HT-7, HT-8, HT-9 A1/A4 and HT-10 pass with no change to their bytes in Part A. Golden B is built twice with equal shas.
4. **Panel** passes (C1, C2, the crop check; C3 with Part B), and the approval entries are written as above.
5. **Docs:** the PLAY-SUBMISSION.md:28 correction and the D-SHEETCOPY entries. The store lines 20 and 24 stay unchanged.
6. **Full regression** on one head that contains the latest main: `npm run check`, `npm run test:tz`, the gate, and the library CI full rebuild (every row is affected). A fresh Opus reviewer follows.
7. **Device check** (owner, with the APK): open one How-to sheet. The headings read as listed, and with Part B no closing line remains.

## Mutations (each red, recorded in the PR)

- MA1: Setup.tsx goes back to "Set it up" in the app only. Gate HT-9 A4 and the guard both turn red.
- MA2: the pinned golden B page keeps the old "If you feel it in…" in one card. The guard's page scan and HT-8's pixel pairs turn red.
- MA3: one library How-to heading becomes "Knee pad: right and wrong". The guard and copy-lint turn red.
- MA4-MA7: a 4-word heading, "How it moves", "The setup" and "Risks, and when" each turn the guard red (one clause each).
- MA8: the walker skips one id or one file kind. The count assertion turns red.
- MA9: one extra byte changes on one page. Acceptance 2 turns red.
- MB1: Risks.tsx renders the old line again. The guard and the edited HT-9 C19 turn red.
- MB2: "not medical advice" appears in a red-flag box. The guard and HT-9 C19 turn red.
- MB3: the edited C19 check gets a page with one `.ht-disclaimer`. It turns red, so the inverse check bites.
- MB4: a sheet whose Risks never mounts makes each new `.risks` wait fail as the old wait did.

## Out of scope

- Golden A and the Train button label (see Design).
- The coach safety cards (`src/escobar/ui/Escalation.tsx`), Settings and the website.
- The wording of the red-flag boxes, research cards, and feel, setup and risk body text.
- Changing the GATE-SPLIT structure. Anything under `escobar-worker/**` or `native/wear/**`, and anything to do with signing or keystores.

## Risks

- **It re-pins everything and conflicts with in-flight LIB waves**, which touch MANIFEST rows, layers-page entries and generated headers. Mitigation: run it after the last wave merges, as the last content change before the release candidate, so the candidate's full regression runs once after it. If a wave merges first, rebuild and re-pin once more (the D-PLATEFIX-SECOND form).
- **The library CI rebuilds all 134 rows.** Mitigation: one pass. F-GEN-WALK-SPEED should land first if it can.
- **Part B leaves machine_lateral_raise with no stop line.** Its Risks item stays ("Swinging the body to finish a rep can lead to injury."). C3 judges it, and the supervisor accepts or orders a box card.
- **A Play reviewer may expect the reminder in the app.** The store text carries it, and 71 sheets say "See a doctor". Recovery is a one-line re-add, which the owner decides, as in D-COPY1-medical.
- **Part B edits other tasks' gate blocks.** Mitigation: R3's exception names each line, MB1-MB4 prove each edit is at least as strict, and the twin pins are re-pinned in the same commit.
- **The owner reverses his own words.** Mitigation: R1 is recorded and named in the APK post.

## Unverified

- The Play pages were read through WebFetch, which returns quotes in fragments of up to 125 characters. The answer/16679511 sentences above are whole. The answer/13996367 "may include … clearly within the app" bullet was read in fragments, and its exact full sentence is not verified. It agrees with the COPY-1 curl read (D-COPY1-3).
- D-OWNER-RECOMMENDED is not on main `e15e1c65`; it is only on `claude/sup-lib4-cards`.
- Not measured: the exact HT9 tuple totals after Part B, the chunk sizes after the change, and whether the `da65b13a` suffix of the lib7fix fixture's name must change.
- Assumed from how it is built, not checked by a run: that no test rebuilds the lib2b fixture page, that harness.mjs and library fidelity.mjs are not in any twin pin, and that no library plates page holds a changed string. Plates pages are pinned by sha only, so the builder's rebuild settles it.
- The noun-phrase calls in table D are judgements. C2 confirms them.

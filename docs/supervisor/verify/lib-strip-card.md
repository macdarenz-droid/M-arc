Card LIB-STRIP: the tempo strip for plates with no sourced seconds, option B (2026-10-24; status `ready`; rulings D-STRIP-* recorded below). It ships the shared patch, the added checks, the tempo-map row shape and the rows for the note's no-seconds cards as data. It redraws no plate and lifts no held line.

Design: `strip/NOTE.md` on claude/sup-lib4-cards @ `71241668`, decision D-STRIP-B at its end (option B, card cadence words; the owner delegated the choice on 10-24 ~07:15 UTC). The work files beside the note (`nosecs-strip.mjs`, `render.mjs`, `goldenb.mjs`, `w340.mjs`) are the design run's scratch copies. Read them; never ship them as they are.

id: LIB-STRIP
model: claude-opus-5-5 (each phase's word is a judgement on its card; the checks guard golden A and B, plan 3.1)
mode: auto
title: 'Builder: LIB-STRIP no-seconds tempo strip'
branch: claude/lib-strip (new; no such branch on origin at 2026-10-24 ~09:00 UTC). Your first push opens draft PR 'LIB-STRIP: tempo strip without seconds (D-STRIP-B)'.
slot: a tools card, not a batch. The supervisor gives it its place on the owner's checklist in 'LIB-STRIP start'. It unblocks LIB-14's five held rows (#289), LIB-17's renegade_row (#299), LIB-22's sled_pull (#305) and pilot A's box_jump and reverse_lunge (#109).

base: the latest origin/main when the session starts (`0f1f73de`, GATE-FLAKE-5 #292 on top of F-CI-1 #303, or later), never an unmerged head.
- Every main line number here was read at `0f1f73de`. Re-read each one on your start head, and use the line you find there.
- The note read main at `5158609c`. Every line it cites is unchanged at `0f1f73de` except one: it cites golden.mjs:113-116, and the strip check is :115-116 (extractPlates starts at :109).
- Research head: claude/libht-research @ `657eb4e5` (#308 merged), or a later head the supervisor names in 'LIB-STRIP start'. The note read `083a8e12`. Between the two, bear_crawl, renegade_row, sled_pull and pendulum_squat changed their plate.tempo (checked 2026-10-24). The cadence spans of the 17 are unchanged. bear_crawl and pendulum_squat now carry verified seconds (D-STRIP-SCOPE).
- Read research files with `git show <head>:<path>`. Never copy a card or quotes file into this branch.
- Merge origin/main into this branch, with a merge commit, whenever main moves while you work, and once more before READY. Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on: nothing unmerged. Everything it patches is on main: the vendored builder (tools/plates/vendor/artifact/build-page.mjs), golden B's (tools/plates/layers/artifact/build-page.mjs), LIB-8's plates builder, LIB-6's layers builder and LIB-3's QA.

build_prerequisites (the supervisor posts each on the PR, or sends it to your session while no PR exists):
- To start: 'LIB-STRIP start'. It names the research head, the live active-builder count and the checklist slot.
- Do 6 (pin the rows) and READY: 'STRIP ROWS VERIFIED @ <sha>', after the supervisor's blind verify of the rows (Do 5).

merge_prerequisites:
- A fresh reviewer's pass (reviewer skill). You never approve your own work.
- Every check green on a head that contains the latest main.
- Every lower-numbered item on the owner's checklist has merged (AGENTS merge rule).
- 'STRIP ROWS VERIFIED @ <sha>' names a sha whose rows.json equals the head's, and the pin (A11) matches.
- None of this card's changes is under escobar-worker/**.

Rulings this card relies on. These are summaries; where the posted text differs, the posted text wins.
- D-STRIP-B (NOTE.md, end): option B. A phase with no sourced seconds shows the card's own cadence word in the slot where seconds go, or stays blank.
- D-LIB8M-TEMPO (lib4-cards :3293-3303): the concentric takes up, the eccentric takes down; Hold takes pause right after the concentric only if pause > 0; any other static phase, and a cycle plate's Work and Rest, is a constant only with a quote that states its seconds; a range is the quote's string. Phase names, order and move flags are labels. No Rest without a quote.
- D-LIB8M-NOSTRIP (lib4-cards :3305-3311): the approved card structure needs a tempo strip (golden.mjs:115-116; PQ-H2 'H2.chrome:tempo', qa/node.mjs:93), and the vendored builder draws none without e.tempo (vendor build-page.mjs:174). Never exempted. Research is not asked for seconds.
- D-LIB14-NOSECS (lib-14-card.md:288-294), D-LIB17-SECS (lib-17-card.md:3, :42) and D-LIB22-SECS (lib-22-card.md:5, :47): those lanes hold their no-seconds rows until this card is on main and merged in, then resume on their own resume message.
- D-LIB9-CARDFIELDS and PANELS.md section 3 (claude/sup-handover-1445 @ `5751fb31`): a card's top-level `tempo` is the spec's phase array, compared exactly by H6 (qa/node.mjs:176).
- LR-33 (RULINGS.md on claude/libht-research): a card with no quoted seconds keeps up, down and pause null. This card never adds seconds.
- D-LIB8M-RPC (b): a vitest worker never renders or builds a page synchronously; builds go through buildPlatesPage's and buildLayersPage's child processes. Keep each test well under vitest's 60 s limit.

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Golden A and golden B rebuild byte for byte. A timed strip's output does not change by one byte.
- No check, envelope, threshold, test or exemption is relaxed, skipped or edited to get green. The checks this card adds are add-only.
- A word comes from its card's verified text, never from taste. A row with no card-true word stays blank.

shared-file owners:
- scripts/screenshot-gate.mjs: shared, add-only. One block, `if (gate.runs('LIB-STRIP'))`, after the last block. Never edit, move or delete another task's block. When merging main, keep both sides (LIB-ZOOM #279, HT-11 #273 and LIB-7c #271 each add a block).
- tests/theme.test.ts and src/ui/styles.css: not touched.
- package.json and package-lock.json: not touched. No new dependency.
- Saved data shape (src/core/**): not touched. No new kind of stored or sent user data.
- tools/plates/vendor/**, tools/plates/layers/** and tools/plates/golden.mjs: read only.
- Lane files (pilot A #109, LB1-LB10 lanes, LIB-ZOOM #279, LIB-12's hands/**): read only.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply. From the first push it lives in the PR body. Never write to the owner.
- Run any job that may last over 20 minutes (the local gate, `npm run check`) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`, and poll its log. Keep a send_later check-in every 20 minutes while one runs (idle containers are reclaimed). A stopped run is never evidence; a lost run is re-run whole.
- A CI failure on `[vitest-worker]: Timeout calling "onTaskUpdate"` is a real defect (D-LIB8M-RPC (b)). Report it on the PR; never re-run to green.
- CI's Chromium install and shard jobs are capped since F-CI-1 (#303). A job cut off at its cap is not evidence either way: report it on the PR with the step times.

outcome:
- One shared module holds the strip text. Both page builders apply it with one exact-once replacement.
- A phase with no seconds draws a bar of equal width, its card's word or a blank value line, and a spoken label with the word.
- Golden A (e2bea90c…, 860,766 B) and golden B (e7b81413…, 2,320,561 B) rebuild byte for byte.
- The validator, H6 and H8 check the new shape, add-only. H4's worst case is checked in the gate.
- strip/rows.json holds the verified rows for the note's no-seconds cards.
- No plate is redrawn, un-held, pinned or shipped. You will notice: nothing in the app.
deliverable: the strip module, the two builder wirings, the validator, researchOf, H6 and H8 additions, rows.json, tests/howto/lib-strip.test.ts, the LIB-STRIP gate block and one COACHING-DECISIONS entry.
evidence: the unit tests with their mutations; the golden A and B proofs; the rows verify; the gate block's output; local `npm run check`, `npm run test:tz` and the gate on the merged head; CI on that head.
finish: 'LIB-STRIP READY @ <sha>' posted with the HANDOFF block ticked, then the reviewer's pass. Then stop. The supervisor merges it and sends each lane its resume.
forecast [est]: about 8 Opus-hours. The module and wiring 1 h; validator, researchOf, H6 and H8 1.5 h; the rows and their table 2 h; tests and mutations 2 h; the gate block 1 h; local runs and the main merge 0.5 h of attention (the local gate takes longer on the clock). The rows verify and the review add calendar time this card cannot forecast. Allow up to twice the hours if the verify asks for a fix round.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On claude/sup-lib4-cards: this card; strip/NOTE.md in full and its four work files; lib-14-card.md (D-LIB14-NOSECS, :288-294); lib4-cards.md section 16 (D-LIB8M-TEMPO :3293-3303, D-LIB8M-NOSTRIP :3305-3311) and the follow-up list (:3410).
- On claude/sup-handover-1445 @ `5751fb31`: docs/supervisor/verify/PANELS.md section 3 (the CARD FIELDS verify) and its tempo rules (:189-193).
- Main:
  - tools/plates/vendor/artifact/build-page.mjs: esc and plain (:12-13), tempoStrip (:149-153), card()'s strip call (:174), the strip CSS (:268-275).
  - tools/plates/layers/artifact/build-page.mjs: tempoStrip (:93-97, byte-identical to the vendor's; checked), its strip call (:121).
  - src/slices/howto/css/plate.css:86-93 (the app's `.ht .tempo` rules, the same as the builder's).
  - tools/plates/library/build-page.mjs: between (:29-35), once (:36-40), patchedBuilder (:43-59), buildPlatesPage (:83).
  - tools/plates/library/build-layers-page.mjs: patchOnce (:44-48), patchBuildPage (:113-123), buildLayersPage (:134-145).
  - tools/plates/golden.mjs: extractPlates (:109-135; the strip check :115-116, :119-120).
  - tools/plates/library/candidate.mjs: researchOf (:69-74).
  - tools/plates/library/research/validate.mjs: validateCard (:201-227; the tempo shape :216-223).
  - tools/plates/library/qa/node.mjs: LIMITS (:19), h2's strip regex (:93), h6 (:155-178; the tempo compare :176), plateStrings (:231-242; the tempo labels :239), h8 (:243-255).
  - tools/plates/library/qa/browser.mjs: WIDTHS (:12), MEASURE's strip box (:77-80), measurePage (:90), judge's H4.tempo (:153).
  - tools/plates/layers/artifact/copy-lint.mjs: BANNED (:96-108).
  - The golden proofs: tests/howto/library-core.test.ts:455-470 and :472-485 (golden A through buildPlatesPage); tests/library/layers-engine.test.ts:68-70 (golden B through buildLayersPage); tests/library/closeups.test.ts:66-73 (every golden B patch anchor matches once); tools/plates/pins.json:8-9; tools/plates/layers.mjs:13.
  - tests/howto/library-cards8.test.ts:230-235 (researchOf's three keys for a timed fixture card).
  - scripts/screenshot-gate.mjs: the LIB-12 block (:9522-9536) as the block pattern; scripts/gate-split.mjs (a new group key takes gate-times.json's default, :23).
- Pilot A @ `dcac4a38` (the same bytes as `ff7c5c4f` for these paths; checked): pilot-a/tempo.json (plank's row :17, its `quote` field); pilot-a/plates.json held lines (box_jump :68, reverse_lunge :148); specs/box_jump.mjs:167 and specs/reverse_lunge.mjs:149 (their "No tempo strip" notes).
- Research @ the head in 'LIB-STRIP start': cards/<id>.json for the 17 ids in D-STRIP-SCOPE, their `plate.tempo` and `claims`, and the quotes they cite.
- The plan @ `b41ac833` (claude/howto-options): 1:95-96 (the airborne convention); 8 decision 3 (:855-856).

design_reference: NOTE.md and its sheets; golden A's strip (the 8's timed cards); pilot A's plank strip.
connectivity: none. Node and local Chromium (/opt/pw-browsers/chromium) only. The module reads no files. No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/strip/tempo-strip.mjs: the strip module (D-STRIP-PATCH, -FORMS, -SAYS);
  - tools/plates/library/strip/rows.json: the rows (D-STRIP-ROWS, -SCOPE);
  - tests/howto/lib-strip.test.ts (node only).
- Edits, each a small block marked `// LIB-STRIP` and called out in the PR:
  - tools/plates/library/build-page.mjs: one import line and one once() line in patchedBuilder;
  - tools/plates/library/build-layers-page.mjs: one import line and one patchOnce() line in patchBuildPage;
  - tools/plates/library/candidate.mjs: researchOf gains `tempoText`, only for an untimed card tempo (D-STRIP-H6);
  - tools/plates/library/research/validate.mjs: validateCard accepts the untimed entry shapes, with their checks (D-STRIP-SHAPE);
  - tools/plates/library/qa/node.mjs: the H6 word lines after :176; one plateStrings line after :239 (D-STRIP-H8);
  - scripts/screenshot-gate.mjs: the LIB-STRIP block (add-only).
- docs/COACHING-DECISIONS.md: append one entry, "LIB-STRIP: tempo strip without seconds (D-STRIP-B)". 11 open PRs also append (#289, #290, #297, #299, #305, #306, #109, #265, #271, #274, #282); keep both sides.
- Fixture pages, screenshots and logs are not committed. Tests and the gate write to temp directories.

reserved_paths:
- tools/plates/vendor/**, tools/plates/layers/**, tools/plates/golden.mjs, tools/plates/pins.json.
- src/** (plate.css and every generated file included), tools/plates/gen/** and tools/plates/generate.mjs.
- tools/plates/library/batches/**, tests/howto/golden/**, tools/plates/library/MANIFEST.json.
- Every lane's files: tools/plates/library/{specs,howto,eq,pilot-a,lb1,lb2,lb3,lb4,lb5,lb6,lb7,lb8,lb10,hands,zoom,render,fidelity,ci,shared,lint,pages,templates,budgets,scale}/**.
- tools/plates/library/qa/** except the qa/node.mjs lines in write_scope: browser.mjs, mutations.mjs, proof.mjs, selftest.mjs, envelope.json, exemptions.json, vocabulary.json and param-ranges.json are untouched. The gate block imports browser.mjs; it never edits it.
- docs/research/howto/** (cards, quotes, shared) and every research branch.
- Every existing test file. A test that turns red is a stop (S6), never an edit.
- tests/theme.test.ts, src/ui/styles.css, .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The paths of LIB-ZOOM (#279), HT-11 (#273), LIB-7c (#271), pilot A (#109) and every LIB lane PR.

Do:
1. Start. Read the card, NOTE.md and the read_first lines on your start head. List each cited line you find moved in the PR body.
2. The module, tools/plates/library/strip/tempo-strip.mjs (D-STRIP-PATCH). It exports:
   - `VENDOR_STRIP`: the vendored tempoStrip text, byte for byte (vendor build-page.mjs:149-153 with its final newline; golden B's :93-97 is the same bytes);
   - `NOSECS_STRIP`: the new text. Start from strip/nosecs-strip.mjs. The rule: if any phase has no `s`, every segment is `flex:1 1 0`; the value line is `${s} s` for a timed phase, else the escaped word, else `&nbsp;`; the aria-label is "Tempo: " plus, per phase, "<phase> <s> second(s)" or "<phase> <word>" (lower case), joined by ", ". When every phase has `s`, the output is the vendored function's, byte for byte;
   - `FORMS`, `wordProblems(tempo, text)`, `DIRECTION` and `tempoOf(rows)` (D-STRIP-FORMS, -SAYS, -ROWS). tempoOf builds the card and spec shape from untimed rows: `{ phase, move?, word? }` in that key order, `claim` and `says` dropped. It throws on a timed row (`from`); a lane's own D-LIB8M-TEMPO map builds those.
   - It reads no files and imports nothing but node built-ins.
3. Wire it in, one line each, marked `// LIB-STRIP`:
   - build-page.mjs patchedBuilder: `s = once(s, VENDOR_STRIP, NOSECS_STRIP);` before the `__CFG` line;
   - build-layers-page.mjs patchBuildPage: `src = patchOnce(src, 'tempo strip', VENDOR_STRIP, NOSECS_STRIP);` after the 'plate engine' patch.
   - Both throw, naming the patch, if the vendored text is not there exactly once. No CSS changes anywhere.
   - Then run the golden proofs (A2, A3) before anything else. If either changes by one byte, stop (S1).
4. The checks, add-only (D-STRIP-SHAPE, -H6, -H8):
   a. validate.mjs validateCard: an entry with no `s` has keys exactly 'phase', 'phase,move', 'phase,word' or 'phase,move,word'; `word` is a FORMS key; a tempo with any untimed entry has at least one word; each word passes wordProblems against the card's plate.tempo.text. Every shape it rejects today, it still rejects.
   b. candidate.mjs researchOf: when the card's `tempo` is a list with an entry that has no `s`, add `tempoText: plate.tempo.text ?? null`. For every other card the result is unchanged (the three keys only).
   c. qa/node.mjs h6, after the compare at :176, only when spec.tempo has an untimed entry: `H6.tempo-text` (no tempoText); `H6.tempo-word:<i>` (word i is not a FORMS key, or no form of it is a whole word in tempoText, case-insensitive); `H6.tempo-word:<i>:timed` (entry i has both `s` and `word`); `H6.tempo-noword` (no entry has a word).
   d. qa/node.mjs plateStrings: one entry per value span that is not `&nbsp;`: `{ where: 'tempo.<phase>.value', text, label: true }`. h8 then applies the 1-3 word rule and the bans to it. Timed value lines ('2 s', '10–60 s') are read too.
   - Prove the 8 are untouched: runQa on the 8 (approved mode and authoring mode) gives the same problems and flags before and after these edits. Paste both tables.
5. The rows, tools/plates/library/strip/rows.json (D-STRIP-ROWS, -SCOPE, -SAYS). For each id in D-STRIP-SCOPE's 16:
   - copy `plate.tempo.text` and `plate.tempo.claim` from the research head, byte for byte, with the head sha in the file's `research` field;
   - derive the phases from the card: names from the card's own verbs and the closest approved map (the 8's barbell_back_squat Lower / Drive up; pilot-a/tempo.json's names); the card's order; `move: true` on each moving phase;
   - give a phase a word only where a span of the text names its cadence. Record that span, verbatim, as `says`, and the claim as `claim`. A phase with no such span stays blank;
   - never make set-level advice a phase ("full rest between sets", "never to failure", "3-5 reps per set", "reset the plank between reps");
   - record bear_crawl (and any other card the head shows with verified seconds) under `timedAtHead` with its verified tempo, never as an untimed row.
   - Post 'LIB-STRIP ROWS READY @ <sha>' with one table: id, lane, phases, words, each `says` and claim, and every row the direction check cannot judge (no direction term in `says`). Then wait.
   - The supervisor runs the PANELS.md section 3 verify on the rows: the copy holds each card's plate.tempo, claims and quotes, rows.json without `says`, and a rules.md from D-STRIP-B, -ROWS, -FORMS and -SAYS. One planted error (a word on the wrong phase, set-level advice as a phase, or a word not in the text). Fix only what it names; post 'LIB-STRIP ROWS FIX @ <sha>'; a focused re-verify with a new plant follows.
6. After 'STRIP ROWS VERIFIED @ <sha>': pin the sha256 of rows.json's canonical JSON in lib-strip.test.ts (A11). Any later change to rows.json needs a new verify and the pin updated in the same commit.
7. The gate block, `if (gate.runs('LIB-STRIP'))` (A10). It builds one fixture plates page through buildPlatesPage in a temp directory: a stand-in card per row (the vendored barbell_back_squat spec with its tempo replaced by tempoOf(row), as render.mjs did), the 3-phase worst case (Lower / Controlled, Jump / Explosive, Step down / blank), the mixed fixture, the timed back squat as control, and one seed card (a copy of the worst case). It runs qa/browser.mjs measurePage and judge on every card at 390, 360 and 340 px in the 5 themes, with measurePage's `css` option set to `#card-<seed> .tempo-label { min-width: 160px; }` (qa/mutations.mjs B7's pattern), so only the seed must overflow. It reads each strip's height with its own one-line evaluate on a page opened through fidelity/harness.mjs openGolden. The block fails if any real card has H4.tempo or a strip height other than the control's, or if the seed does not show H4.tempo at 340 px. The H4 judgment is browser.mjs's own; never copy its measuring code.
8. Tests (tests/howto/lib-strip.test.ts), each with its mutations (Acceptance). Builds run through buildPlatesPage's child process. Keep each test under 30 s locally.
9. Append the COACHING-DECISIONS entry: what (D-STRIP-B and the rules), why (the note's reasons), source (NOTE.md @ `71241668`, this card).
10. Merge origin/main with a merge commit. On that head, run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, each detached with 20-minute send_later check-ins. Paste their last lines. Then the A13 recorded check. Then post 'LIB-STRIP READY @ <sha>' and ask for review.

Stops (post on the PR with the evidence and wait for a ruling; never work around one):
- S1 Golden A or golden B changes by any byte with the patch in place. Never re-pin a golden.
- S2 The 8's QA result changes with a check added here (Do 4): a new problem or flag on an approved plate.
- S3 A card in D-STRIP-SCOPE has no FORMS word in its text, or needs a form or word FORMS lacks. FORMS grows only by a ruling.
- S4 The research head drops a row's `says` span, or gives a card seconds (as bear_crawl now has). Follow the verified card; post the change.
- S5 A card-true word overflows H4 at 340 px. Never shorten, swap or drop a word to fit, and never change CSS.
- S6 An existing test or check would need an edit, a skip or a looser value to pass.
- S7 The vendored tempoStrip text itself differs from VENDOR_STRIP on your head (a vendor change). If only another PR's lines moved, merge main and re-run.
- S8 Two failed tries of one approach with no new evidence.

Acceptance (each mutation must turn red, then be restored; list each one in the PR with its red line):
- A1 One module, applied once in each builder. tempo-strip.mjs is the only file outside docs/ that holds the NOSECS text (a repo grep in the test). patchedBuilder() and patchBuildPage(golden B source, GOLDEN_B_SPEC) each contain NOSECS_STRIP exactly once and VENDOR_STRIP zero times. closeups.test.ts:66-73 stays green, unedited. Mutations, each red: one byte of VENDOR_STRIP changed (both builders throw, naming the patch); the patchBuildPage line removed (this test); a second copy of the text pasted into build-page.mjs (the grep).
- A2 Golden A rebuilds byte for byte with the patch: tests/howto/library-core.test.ts:455-470 and :472-485, unedited and green. The new test pins the literals: PINS.pageSha256 is 'e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48' and PINS.pageBytes is 860766. Mutation: the timed value `${t.s} s` changed to `${t.s}&nbsp;s` in NOSECS_STRIP → both golden A tests red.
- A3 Golden B rebuilds byte for byte with the patch: tests/library/layers-engine.test.ts:68-70, unedited and green. The new test pins layers.PAGE_SHA256 as 'e7b8141368e59cf993f29555efce53bc06f36131d8e283c79e11a9f2614c928a' (2,320,561 B, tools/plates/layers/README.md:9). Mutation: the same timed change → red.
- A4 The strip's behaviour, on NOSECS_STRIP evaluated with the vendored esc and plain (no page build):
  - every timed tempo gives exactly the vendored function's output: the 8's tempos (vendor build-page.mjs:93 and each vendored spec), plank's [Hold '10–60'], wall_sit's [Hold '30-60'] and a 0.5 s phase;
  - an untimed tempo gives `flex:1 1 0` on every segment, the escaped word or `&nbsp;` on each value line, and the aria-label "Tempo: lower controlled, drive up" for [Lower move Controlled, Drive up move];
  - the mixed fixture [Lower move s '2–3', Push move] keeps "2–3 s" and "lower 2–3 seconds" on Lower, and every segment is flex 1;
  - every row in rows.json gives its expected aria-label.
  Mutations, each red: `timed ? t.s : 1` changed to `t.s ?? 1` (flex not 1 when a phase is untimed); the word dropped from the aria-label; `&nbsp;` changed to an empty string; esc() removed from the word.
- A5 No CSS change. Recorded check: `git diff --exit-code origin/main...HEAD -- src tools/plates/vendor tools/plates/layers` is empty on the merged head. A10's strip heights equal the timed control's.
- A6 The validator (D-STRIP-SHAPE). Every card on main still validates. Fixture cards: front_squat's rows through tempoOf validate. Mutations, each red: an untimed entry with an extra key ('phase,move,word,claim'); `s` and `word` in one entry; a word not in FORMS ('Steady'); a FORMS word not in the card's text ('Quick' on front_squat); an untimed tempo with no word; a timed entry with a `word` key. Control: a timed entry still needs 'phase,s[,move]' (an extra key stays red, as today).
- A7 H6 (D-STRIP-H6). Through runQa on a candidate built from a fixture card, every new key fires on its case and stays silent on the 8. researchOf returns the three keys only for every timed card (library-cards8.test.ts:230-235 green, unedited). Mutations, each red: a word not in the text (`H6.tempo-word:0`); a word beside seconds (`H6.tempo-word:0:timed`); every word removed (`H6.tempo-noword`); plate.tempo.text removed from the fixture card (`H6.tempo-text`); the word moved to the other phase in the spec only (`H6.tempo`, the exact compare).
- A8 H8 (D-STRIP-H8). plateStrings returns each value line that is not `&nbsp;`. The 8's H8 output is unchanged (Do 4's tables). Mutations, each red: a fixture value word 'Activated' (`H8.ban:tempo.Lower.value:activate`); a four-word value (`H8.words:tempo.Lower.value`); the new plateStrings line removed (this test). Control: a `&nbsp;` value adds no entry.
- A9 extractPlates and PQ-H2 on a built page. A fixture page through buildPlatesPage, with a stand-in card per row, the worst case and the mixed fixture: extractPlates returns every card, and h2 from qa/node.mjs (called, never copied) gives no 'H2.chrome:tempo'. Mutation: a stand-in card with `tempo: []` → 'H2.chrome:tempo' red (the aria-label is "Tempo: ").
- A10 H4 in the gate (the LIB-STRIP block, Do 7): zero H4.tempo on every real card at 390, 360 and 340 px in the 5 themes, the 3-phase worst case included, and each strip's height equal to the control's (40 px in the design run). The seed card overflows at 340 px on every run, or the block fails. Mutation (in a temporary worktree, never committed): the seed's `css` rule pointed at the worst-case card instead → the block red on that card's H4.tempo:340.
- A11 The rows (rows.json, D-STRIP-ROWS, -SCOPE, -SAYS). The test asserts:
  - the ids in `cards` plus `timedAtHead` are exactly D-STRIP-SCOPE's 17, each once; no id is in both; each `timedAtHead` entry's tempo has `s` on every phase;
  - each worded row's `says` is a verbatim substring of its stored text; its word or a FORMS form is a whole word in `says`; its claim is in plate.tempo.claim or cited by id in the text's parentheses (for example "(c7)");
  - the direction rule: when `says` and the phase name both carry a DIRECTION term, they agree; a `says` with terms of both directions is red;
  - the set-level rule: no phase named Set, Sets, Rep, Reps or Rest; no `says` with the whole words set, sets, rep, reps, rest, round, rounds or failure;
  - each card's tempo from tempoOf passes validateCard (A6) and its strip passes A4;
  - when docs/research/howto/cards/<id>.json exists in the tree, its plate.tempo.text equals the stored text;
  - the sha256 of rows.json's canonical JSON equals the pin set at 'STRIP ROWS VERIFIED' (Do 6).
  Mutations, each red: a word not in its text; front_squat's Controlled moved to Drive up (the direction rule and the pin); box_jump given a Rest phase with says "full rest between sets"; a `says` edited by one character; a claim not cited; bear_crawl added as an untimed row; one row dropped (the count).
- A12 The rows verify is VALID (its plant caught) on the head's rows.json, before READY. Evidence: 'STRIP ROWS VERIFIED @ <sha>'.
- A13 Nothing else ships or changes. No plate is redrawn, un-held, pinned or put in a batch. Recorded check (not a unit test): before READY, run `git diff --exit-code origin/main...HEAD -- src tools/plates/gen tools/plates/vendor tools/plates/layers tools/plates/golden.mjs tools/plates/library/batches tests/howto/golden tools/plates/library/specs tools/plates/library/pilot-a tools/plates/library/howto docs/research` on the merged head and paste its empty output. Seed it once in a temporary worktree: one byte changed in tools/plates/golden.mjs and committed there must give exit 1 (the three-dot diff compares commits only, so an uncommitted byte gives exit 0; corrected 10-24 on REVIEW 6385319151 Low 2).
- A14 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head. The gate's LIB-STRIP line is in the paste.

verification: every acceptance row's evidence at the exact head sha; the reviewer's verdict names that sha.

risk_and_recovery:
- A lane copies a row and its card's text differs at its own research head: that lane's H6 (`H6.tempo-word`) and A11's tree check turn red. The lane posts it; the supervisor re-verifies that row. Never edit a word to fit.
- flutter_kicks's card is on LB9's open research PR (#295 @ `5ee54944`), where its text grows. Its span "short, crisp alternating kicks" is the same there (checked). Re-read it at the start head.
- A later research head gives one of the 16 seconds: S4. Its row moves to `timedAtHead` by a re-verified commit.
- LIB-ZOOM (#279) edits build-page.mjs (its import and buildPlatesPage's return), candidate.mjs (candidateOf), qa/node.mjs (anchorInPose, h3) and qa/browser.mjs, all on other lines. If it lands first, merge main and re-run A1-A9. Never edit its lines.
- CI time: the new test rebuilds neither golden. The two existing rebuild tests are the proof; the new test pins the literals and checks the patch is in both sources (A1-A3).
- The H8 value lines could flag an approved plate: Do 4 proves the 8 unchanged first (S2).
- A no-seconds plate shows a word on one phase and a blank on the next (NOTE.md's risk). That is option B as decided; the blank never implies a time, because every bar is equal.
- Equal bars on reverse_lunge, whose card says rise quicker than lower: the words carry that ("Slow", "Quicker"). Bar widths never stand for time on an untimed strip.
- Another branch's COACHING-DECISIONS entries land first: keep both sides.

return:
- the PR number and head sha;
- links to 'LIB-STRIP ROWS READY', 'STRIP ROWS VERIFIED' and 'LIB-STRIP READY';
- the rows table (id, lane, phases, words, says, claim);
- the golden A and B proofs and the 8's before-and-after QA tables;
- the mutation list and the A13 recorded check;
- the output of check, test:tz and the gate.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-STRIP resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

---

Rulings recorded (D-STRIP-*, supervisor session_01PeNM9HeWPrhrcscMwXzupy, 2026-10-24). Each was checked against main `0f1f73de` and research `657eb4e5`.

1. D-STRIP-B: option B, card cadence words (NOTE.md, Decision). The supervisor chose it under the owner's delegation of 10-24 ~07:15 UTC ("U do qll that. Dont stall and decide for me."). Why: it is the only option that puts the sources' own cadence where seconds go, with no number. It runs on the same patch as option A, which it falls back to for a blank phase.

2. D-STRIP-PATCH: one module, `tools/plates/library/strip/tempo-strip.mjs`, holds the old and the new strip text. patchedBuilder and patchBuildPage each replace the old text exactly once. vendor/ and golden B's layers/ are never edited, and no CSS changes.
   - Why: LIB-8's and LIB-6's builders already patch the vendored text by exact-once replacements (build-page.mjs:28-59; build-layers-page.mjs:44-48, :113-123), so one more keeps both goldens intact. Matching the full old text, not a start and end marker, makes a vendor change stop the build (S7). The design run proved both goldens byte-identical (NOTE.md, "Proven in this run").

3. D-STRIP-ROWS: a no-seconds tempo-map row is `{ phase, move?, word?, claim, says? }`. `says` is required with `word`: the verbatim span of plate.tempo.text that names the cadence. It is evidence for the reviewer and the verify, as plank's `quote` is (pilot-a/tempo.json:17). Only `{ phase, move?, word? }` goes on the card's tempo key and the spec (tempoOf).
   - A timed phase keeps D-LIB8M-TEMPO's row and its seconds, so a mixed card keeps its sourced seconds on the timed phase, and every bar is equal.
   - Set-level advice is never a phase. A phase with no card-true word stays blank. At least one phase has a word (option A, all blank, was not chosen).
   - Why: the note's row shape plus one evidence field. `says` lets a test catch a word on the wrong phase, which "the word is in the text" alone cannot (front_squat's "Controlled descent, drive up" holds both phases).

4. D-STRIP-FORMS: a closed table of words and the text forms each may come from. Controlled: controlled, control. Slow: slow, slowly. Smooth: smooth, smoothly. Quicker: quicker. Quick: quick. Explosive: explosive. Crisp: crisp. Matching is whole-word and case-insensitive. A new word or form joins only by a supervisor ruling, in the commit that first uses it.
   - Why: "or its adjective form" needs an exact rule, not stemming. Every form here is used by one of the 16 rows (renegade_row and step_up "control"; forward_lunge "slowly", "smoothly"; reverse_lunge "slowly", "quicker").

5. D-STRIP-SAYS: DIRECTION has down terms (down, descent, descend, lower, lowering) and up terms (up, rise, drive, jump, take-off). When `says` and the phase name both carry one, they agree. A `says` with both directions is red, so a span is cut to its own phase ("Controlled descent", not "Controlled descent, drive up"). A `says` with no direction term (goblet_squat's "Smooth and controlled", bodyweight_lunge's "Slow weight transfer onto the front foot") is judged by the rows verify and listed in the ROWS READY table.
   - Why: a deterministic check for the clear cases, and a named human check for the rest. No phase-name list is imposed on the lanes.

6. D-STRIP-SCOPE: the note's 17 no-seconds cards, at research `657eb4e5`:
   - LIB-14 (#289, held under D-LIB14-NOSECS): front_squat ("Controlled descent", c21), goblet_squat ("Smooth and controlled", g7), bodyweight_squat ("Controlled descent", b7), step_up ("control the way down", c2), pistol_squat ("Slow and controlled", p8).
   - Pilot A (#109, held under D-LIB8M-NOSTRIP): box_jump ("Explosive take-off", c11), reverse_lunge ("lower slowly", "rise a little quicker", c7, c16).
   - LB4, not yet carded: jump_squat ("Controlled squat down", "explosive jump", j9), bulgarian_split_squat ("Controlled speed down", c3, c8), walking_lunge ("Controlled descent", c8), forward_lunge ("shift the weight slowly", c4; "lower smoothly", c7), bodyweight_lunge ("Slow weight transfer", c2), bodyweight_split_squat ("Smooth", c6).
   - LIB-17 (#299, held under D-LIB17-SECS): renegade_row ("Lower with control", c5, c15).
   - LIB-22 (#305, held under D-LIB22-SECS): sled_pull ("short, quick, controlled steps", c3, c6).
   - LB9, not yet carded (research #295): flutter_kicks ("short, crisp alternating kicks", c3).
   - Timed at the head, so no untimed row: bear_crawl. LB10's verified card tempo is [Work '15–30' move] (c10; research `5c9dac6f`). It goes under `timedAtHead`.
   - So rows.json has 16 cards with rows and 1 under timedAtHead. The words and spans above are the note's starting point; the builder derives and the verify rules each one.
   - pendulum_squat (the note's mixed example) is not in scope: at `657eb4e5` its verified tempo is [Lower 3, Push 1] (LB8, research `e43d33fd`). The mixed rule stays in the patch and is proven by A4's fixture.
   - Why: the supervisor's scope is the note's list, and a verified card wins over the note's older head.

7. D-STRIP-H6 and D-STRIP-SHAPE: H6 checks each word against the verified card's plate.tempo.text through researchOf's `tempoText`. researchOf adds that key only for a card whose tempo has an untimed entry, so the 8 and every timed card read exactly as today. The validator accepts the untimed shapes and checks the same words with the same function.
   - Why: researchOf reads only three keys today (candidate.mjs:69-74), and the validator rejects any entry without `s` (validate.mjs:221), so a no-seconds card's tempo cannot be stored or checked without these two additions. One function, used by both, keeps them equal. Nothing they accept today is rejected, and nothing they reject today is accepted, except the shapes D-STRIP-B defines.

8. D-STRIP-H8: plateStrings reads each value line that is not `&nbsp;` as a label, so the 1-3 word rule and the bans apply to words. Timed value lines are read too, which adds checks to timed plates; Do 4 proves the 8 unchanged before it counts.
   - Why: plateStrings reads only the phase names today (qa/node.mjs:239), so a word would ship unchecked.

9. D-STRIP-NOTSCOPE: this card lifts no held line and redraws no plate. Lifting is each lane's work, on that lane's card and resume message, with its own CARD FIELDS re-verify of tempo, QA and critic:
   - pilot A #109: box_jump and reverse_lunge (reverse_lunge is also redrawn to its flared-ribcage pick, F-LB4-1, before re-approval);
   - LIB-14 #289: front_squat, goblet_squat, bodyweight_squat, pistol_squat and step_up (step_up also waits on reverse_lunge, D-LIB14-STEPUP);
   - LIB-17 #299: renegade_row; LIB-22 #305: sled_pull;
   - the later LB4 card: jump_squat and the five SPLIT children; the LB9 card: flutter_kicks.

Named follow-ups (not in scope):
- F-STRIP-1: a timed phase whose `s` is a range string draws `flex: 10–60 1 0`, which is not valid CSS, so its bar is only as wide as its label (NOTE.md, pilot A's "Today · Plank" crop). The patch keeps the vendored timed output byte for byte, so this stays as it is. At `657eb4e5` it also hits wall_sit ('30-60', LIB-14), bear_crawl ('15–30') and jumping_jacks ('30–60', both LIB-22). Its own design card decides the fix; golden A and B have no range, so a fix can keep them byte-identical.
- F-STRIP-2: eight more no-seconds cards exist at `657eb4e5` outside the note's 17: cable_rear_delt_fly (LIB-17), sled_push, farmer_s_carry, burpee, medicine_ball_slam and wall_ball (LIB-22), diamond_push_up and pike_push_up (LB7's PUSHUP children). Each lane writes their rows in its own tempo map under D-STRIP-B, with this card's checks; a word FORMS lacks needs a ruling first (D-STRIP-FORMS).
- D-STRIP-AIR (supervisor ruling needed): plan 8 decision 3, the airborne convention (plan 1:95-96, "takeoff or landing frames only, with a sourced landing checkpoint"; :855-856), is not settled by this card. D-LIB8M-NOSTRIP left it open until the strip exists (lib4-cards :3310). It must be ruled before box_jump or jump_squat is un-held. LIB-22's three airborne ids roll behind box_jump (lib-22-card.md:53).

Supervisor follow-ups (not the builder's):
- Send 'LIB-STRIP start' with the research head, the live active-builder count (D-LIB-LANE-ACTIVE) and the checklist slot.
- Run the rows verify (Do 5), then post 'STRIP ROWS VERIFIED @ <sha>'.
- After the merge: send 'LIB-14 resume', 'LIB-17 resume' and 'LIB-22 resume', and post the un-hold route on #109. Rule D-STRIP-AIR before box_jump or jump_squat is un-held.
- Update lib4-cards :3410's follow-up list (the strip is built; F-STRIP-1, F-STRIP-2 and D-STRIP-AIR are open), and HANDOVER's owner-pending lines.
- Card F-STRIP-1 when a lane with a range string reaches its sheet (wall_sit is first, on #289).

---

Collision check (`git diff --name-only origin/main...<head>` at main `0f1f73de`, 2026-10-24 ~09:00 UTC, for every open library PR):

| PR | branch @ head | overlap with write_scope |
|---|---|---|
| #279 LIB-ZOOM | lib-zoom @ `754176a0` | build-page.mjs, candidate.mjs, qa/node.mjs (other lines: an import, buildPlatesPage's return, candidateOf, anchorInPose, h3); scripts/screenshot-gate.mjs (its own block) |
| #273 HT-11 | ht-11-delta @ `e0722148` | scripts/screenshot-gate.mjs (its own block); plate.css's generated header (reserved here) |
| #271 LIB-7c | lib-7c-lb1-hands @ `7791b446` | scripts/screenshot-gate.mjs (its own block); COACHING-DECISIONS.md (append) |
| #109 pilot A | lib-8-pilot-a @ `dcac4a38` | COACHING-DECISIONS.md (append); golden.mjs (verifyChain) and plate.css's header are reserved here |
| #289, #290, #297, #299, #305, #306 (LIB-14 to LIB-18, LIB-22) | their heads @ `6846c5af`, `e9f09858`, `3a75393a`, `14dc56dd`, `a9c64e11`, `d76fc305` | COACHING-DECISIONS.md (append) only |
| #265, #274, #282 | `2dcbac15`, `a6f4bd07`, `2ad1bf3c` | COACHING-DECISIONS.md (append) only |
| #245, #278, #209, #197 | `9e5d9666`, `d3b231d6`, `d8d0e915`, `0a45d009` | none |
| #190 engine spike (do not merge) | `82ae2d40` | build-page.mjs and golden.mjs; never merged |

- No open PR touches tools/plates/library/strip/**, research/validate.mjs, build-layers-page.mjs or tests/howto/lib-strip.test.ts.
- Result: no unsettled collision. Shared writes are the gate (add-only blocks) and the COACHING-DECISIONS append (keep both sides). LIB-ZOOM's lines are read only here.

Open items (none blocks the start):
- Unknown until built: the gate block's run time (a new group key takes gate-times.json's default of 60 s, scripts/gate-split.mjs:23).
- The research head may move before the start: 'LIB-STRIP start' names it, and Do 5 re-reads every row there.

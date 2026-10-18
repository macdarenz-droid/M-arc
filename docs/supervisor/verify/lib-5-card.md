Card LIB-5: shared layer modules (plan section 7 row 4; design note first; 2026-10-17)

id: LIB-5
model: claude-opus-5-5
mode: auto
title: 'Builder: LIB-5 shared layer modules'
branch: claude/lib-5-shared-layers (new). Your first allowed push (CI manners) opens draft PR 'LIB-5: shared layer modules'.

Stops (these override every other line in this card):
1. Design note first (D-LIB-LANE-ACTIVE).
   - Do 1 only: write the design note, post it as one comment on the draft PR, then stop.
   - Do 1 is reading and writing only: no code, no build, no test or lint run. Where the note needs a measurement or a dry run, it states the method, and Do 2 runs it. So Do 1 holds no lane slot.
   - Once the note is written you are WAITING (no permitted work in hand), apart from the one push and the comment that post the note after 'E8 done', and, under lib4-cards.md section 14, the one push and comment that post the revised note and the one tempo-map addendum comment (D-LIB5-TEMPO8 2).
   - Start Do 2 only when one supervisor PR comment gives both the design-note ruling and the words "LIB-5 resume" (also sent to your session). Only the supervisor sends it, once a lane slot is free. A freed slot goes first to a D-LIB2b-ORDER chain card (LIB-2b, LIB-4a and LIB-4b, each its own slot) or LIB-4c, then to LIB-5.
   - Never resume on any other event: a merge, a CI result, a comment on another PR, or a self-wake.
   - If the supervisor tells you to park, stop at your next local commit, push nothing and wait for "LIB-5 resume".
2. Back-pain box held (D-LIB5-BOX).
   - The box's text and its word cap belong to the owner's decision 6 (plan 8), which conflicts with supervisor ruling R-W0-1 (50 words). The supervisor has sent the owner the question. Never write to the owner yourself.
   - Until the supervisor records the owner's answer on this PR, build everything except the box text. Do 4 builds the back-box module as a placeholder that fails closed (S4-P).
   - The answer is recorded before Do 9. The box item (Do 9: box text, RiskJoint 'back', the Risks map entry, the two sections-risks.test.ts lines (D-LIB5-RISKSTEST), the ht9 twin's entry and FLAG lines (D-LIB5-TWIN), the count lines (D-LIB5-COUNTS), check-bundle's Do 9 rule (D-LIB5-BUNDLE), S4, S5 and S5-L) is blocked until then.
3. No cap is raised. Every red-flag box, the back box included, stays at 30 words or fewer. Four limits set this:
   - golden B's RED_FLAG_BOX_MAX_WORDS = 30 (tools/plates/layers/artifact/copy-lint.mjs:50, "limits (owner 2026-09-30)");
   - c7's LIMITS.redFlagBoxWords = 30 (tests/howto/checks/c7.ts:38, checked at :299);
   - plan 8 owner decision 6 ("30 words or fewer");
   - plan 4.2 ("about 29 words each").
   Never add a lint rule, option, exemption or per-box limit that allows more than 30 words. Never edit golden B or c7's limits. This card does not apply R-W0-1's "named limit for this box only" (docs/research/howto/verify/w0.md on claude/libht-research). The wordCap and words fields in shared/back-pain-box.json are data, never a limit.
   One exception applies only under option 1, only in the claude/lib-5-back-box PR and only after the cap card has merged. Wherever this card holds the back box to 30 words (Do 9's first bullet, S4, S5-L and the D-LIB5-REACH differential), the back box is held to the cap card's named back-box limit, imported unchanged from where that card puts it. This card never writes, copies or edits that limit. In the D-LIB5-REACH differential and D-LIB5-REACH 3's checkC7 run on the back box: if the cap card gives c7 the named limit for 'back', both run unchanged; if it does not, for the back box only they leave out c7's 'C7: redFlag' word-count line and compare the lint's count with the imported named limit instead, and every other c7 and C19 line is still compared. S4's equality test then shows three things: c7's LIMITS.redFlagBoxWords is still 30, golden B's RED_FLAG_BOX_MAX_WORDS is still 30, and the lint reads the back-box limit only by importing it from where the cap card puts it, with no literal copy under lint/** (S7, next sentence), shown to bite by the limit + 1 mutation below. S7's 30-assert leaves out only that one imported limit, and its '50 added under lint/**' mutation stays red. Two added mutations, each red: the back box at the named limit + 1 words; another box at 31 words. Everything else stays as written: every other box, every other rule (today, doctor, contacts, sentence cap, BANNED, the 450-word total) and LIB-5's own PR.

CI manners (D-LIB-CIMANNERS; every card carries this text unchanged, and it replaces any older rule in the card):
CI manners while GATE-SPLIT's E8 proof runs: push nothing until the supervisor sends you 'E8 done' (by a message to your session, and as a comment on your PR if it exists). After 'E8 done' and until the GATE-SPLIT train has merged, before each push check that no M/ARC gate run is in progress on claude/sup-gate-split-ci, claude/gate-split, claude/sup-gate-split-e6, claude/sup-gate-split-e9 or claude/sup-merge-train-* (curl the Actions API); if one is, wait. Then at most one push per 2 hours until READY unless the supervisor asks for one. Never use [skip ci].
- This replaces the builder skill's "push after every finished task". Gather local commits into the allowed pushes.

base: origin/main @ 2d1bbf3 (LIB-2b #234 and the GATE-SPLIT train are on main), merged in with a merge commit before the revised note is pushed.
- Merge origin/main again at each of these points:
  - after each of LIB-4a #233, LIB-4b #232 and LIB-4c merges;
  - before READY.
- Merge commits only. Run `git pull --no-rebase` before each push. Never force-push, rebase or amend. If the branch moves without your push, stop and report.

depends_on: LIB-2 (merged in train 19).

build_prerequisites:
- Do 1 (design note): none. Reading and writing only (Stops 1), on the base above. Post it with your first allowed push.
- Do 2 onward: the supervisor's comment with the ruling and "LIB-5 resume" (Stops 1).
- Under tools/plates/gen/** LIB-5 writes one new file, tools/plates/gen/library-gate.mjs (D-LIB5-GATE), on a head that contains main 2d1bbf3. No other gen/ file is edited.
- Do 2 waits until the supervisor names the claude/libht-research head to copy. That is the head where research wave 2 and the 8's cards merge into claude/libht-research after tonight's LR-29 verify, or 9dbc7e0 if they have not merged by then. In that case you re-copy and re-pin once when they merge. One more re-copy is allowed, for the modules that wait on research (D-LIB5-FAULTKEYS, D-LIB5-SPLIT), from the one research head the supervisor names for both. Each re-copy re-pins S1 and re-runs S2, S6 and S7.
- Do 3 waits for the posted D-LIB9-CARDFIELDS ruling. Do 3 b also waits for a supervisor PR comment that rules the note's source list, the 8's tempo map and the plateFacts form table (Do 1 k; D-LIB5-TEMPO8) and names the head that holds their verified claims and quotes. Commit 1 also waits for the supervisor's 'TOPFAULT @ <named research sha>' comment (D-LIB5-TOPFAULT). Do 3 b's exemption removal waits for the supervisor's 'CARD FIELDS VERIFIED @ <sha>' comment on the 8's cards.
- Do 6 waits for the posted "stamps (O5)" wording ruling (lib4-cards.md 11.1 item 7), which sets approvedBy. Its commit lands only after the supervisor's approval comment on the 8's entries (D-LIB5-STAMPS).
- Do 9 waits for a supervisor PR comment that does two things:
  - records the owner's answer to decision 6;
  - names the research head whose shared/back-pain-box.json holds the answered text, with a status other than 'draft'.

merge_prerequisites:
- D-LIB5-ORDER, plan slot 4: LIB-5 merges after LIB-2b, LIB-4a, LIB-4b and LIB-4c (3c), and before LIB-6 #181, LIB-7 #193, LIB-8 #109 and LIB-9.
- A fresh Opus review PASS against this card.
- Supervisor PR comments approving:
  - the design note;
  - the 8's reviews.json entries;
  - the back-box placement, if Do 9 is in this PR.
- The supervisor's 'CARD FIELDS VERIFIED @ <sha>' on each of the 8's machine cards that stays in this PR, at a sha whose card files for those ids equal the merge head's, and S12 green. Do 3 b leaves this PR for each of the 8 that, at LIB-5's merge slot, lacks any of these: verified research on a named head; its TOPFAULT answer; the ruled tempo map; a 'CARD FIELDS VERIFIED @ <sha>' at a sha whose card files for that id equal this head's. If that id's files are already pushed, one new commit before READY removes its card and quotes files and their library-cards8.test.ts pins. Never rebase, amend or force-push. The validator and the CARD-V2 'Machine fields' section stay. Commit 2 never covers such an id, so its approved.mjs lines and exemptions stay as on main. Those ids land after LIB-5 in one PR from claude/lib-5-cards-8 (based on main), with its own fresh Opus review and S12. Their exemptions stay until then (D-LIB5-CARDS8). An id that stops under risk_and_recovery (a miss, 'none', 'several', drawable false) is not a fallback id. It keeps both exemptions until the supervisor rules.
- The three D-LIB5-SCRATCH lines (one import, two calls) in every fixture builder on main that runs the generator (Do 7): LIB-2b's stageTree() and pinTree(), and, once on main, LIB-4b's stage() and pin(). LIB-4a's scale/write-ids.mjs gets none. LIB-4c's ci/scratch.mjs gets none if it builds through stage() and pin().
- LIB-5's reviewed final head merges in one train with the supervisor's add-only check-bundle step in build-apk.yml's source-gate job (D-LIB5-BUNDLE). The full run on the train head is S4-P's bundle evidence.
- The back box, by one of the two routes of D-LIB5-BOX (lib4-cards.md section 12):
  - (a) The owner's answer is recorded, Do 9 is built in this PR, and S4 and S5 are green.
  - (b) By LIB-5's merge slot no answer is recorded, or the answer needs the cap card and that card has not merged. LIB-5 merges with the fail-closed placeholder (S4-P green), so LIB-6, LIB-7 and LIB-8 are not held up. Do 9 then lands in its own PR from claude/lib-5-back-box (based on main), with its own fresh Opus review. That PR must merge before LIB-9: LIB-9's merge_prerequisites hold "LIB-5's back box (Do 9) on main before LIB-9 merges (LR-28)". Under option 1 (50 words), route (b) applies whether or not the cap card has merged by LIB-5's merge slot. LIB-5 merges with the placeholder, and the claude/lib-5-back-box PR is built only after the cap card has merged, under Stops 3's one exception. LIB-5 never makes the cap change.
- Green on a head that contains the latest main.

shared-file owners:
- tools/plates/gen/content.mjs, gen/ids.mjs, tools/plates/generate.mjs and tools/plates/lib/**: read only (D-LIB5-GATE). The gate is the new tools/plates/gen/library-gate.mjs.
- docs/research/howto/reviews.json is the supervisor's. Entries go in only with the supervisor's approval comment.
- tools/plates/layers/** and tools/plates/vendor/** (golden B) are MANIFEST-locked: read only.
- tests/howto/checks/*.ts: read only, with no limit changes.
- tests/howto/library-core.test.ts (LIB-2, LIB-2b), tests/howto/library-rows.test.ts (LIB-2b) and tests/howto/library-ci.test.ts (LIB-4c; only once LIB-4c is on main and merged in): in Do 9 only, exactly the lines D-LIB5-COUNTS quotes. Find each by its text. Each stays an exact equality.
- tools/plates/library/qa/approved.mjs and qa/exemptions.json (LIB-3's): only the Do 3 b edits. exemptions.json changes only with a COACHING-DECISIONS decision (D-LIB3-4).
- Once each of these files is on main, add exactly the three D-LIB5-SCRATCH lines (one import line after the file's last import, and two calls) and list them in the PR:
  - LIB-2b's tests/howto/fixtures/lib2b/fixture.mjs (on main now): `import { markScratch, writeScratchStamps } from '../../../../tools/plates/library/research/stamps.mjs';`, `markScratch(root)` just before stageTree() returns its root, and `writeScratchStamps(root, [ID])` as the last statement before pinTree() returns;
  - LIB-4b's tools/plates/library/fidelity/fixture.mjs: `import { markScratch, writeScratchStamps } from '../research/stamps.mjs';`, `markScratch(root)` as the last statement of stage(), and `writeScratchStamps(root, <the ids it pinned>)` as the last statement before pin() returns;
  - LIB-4c's tools/plates/library/ci/scratch.mjs: no edit if it builds through stage() and pin() (it does on 108eb5c, :124-126). Otherwise the same import and two calls follow its own stage and pin steps;
  - LIB-4a's tools/plates/library/scale/write-ids.mjs: no line.
- Do 9 only:
  - src/slices/howto/sections/Risks.tsx (HT-9's): one FLAG entry plus its import;
  - src/howto/content-types.ts: one RiskJoint member, 'back';
  - LIB-4b's fidelity/twins/ht9.mjs, after LIB-4b merges, both lines found by content: the esbuild entry (:26 on f1df4a7) re-exports src/howto/red-flag-back.ts, and the FLAG line (:29) gains `back: C.RED_FLAG_BACK`. B2 is re-run and B3 stays green unedited. A re-pin under D-LIB4-OPEN happens only if a pinned text changes (D-LIB5-TWIN);
  - HT-9's tests/howto/sections-risks.test.ts: the two add-only lines of D-LIB5-RISKSTEST;
  - the count lines of D-LIB5-COUNTS.
- docs/COACHING-DECISIONS.md: append only.
- No AGENTS shared add-only file is touched (scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css). No gate block is added.

hard card: design note first (Stops 1).

outcome: the shared layer data that every library batch reuses is on main, verified once:
- the 19 shared research cards and their 19 quote files, byte-identical to research;
- a committed card validator, including the card v2 machine fields (D-LIB9-CARDFIELDS);
- the 8's machine research cards (plate facts, tempo, top fault), verified, in this PR or, under the D-LIB5-CARDS8 fallback, in the claude/lib-5-cards-8 PR. Their 'H6:no-card' and 'F7' exemptions are removed for each id in CARDS_8. Each stopped id is reported on the PR with its exemptions kept until the supervisor rules (D-LIB5-TOPFAULT; D-LIB5-TEMPO8 5);
- the library authoring modules: palm-flat, curl and implement archetype data, the 5 equipment moves, exemptions and checkpoints, each value carrying its claim refs;
- the back-box module: a fail-closed placeholder until the owner answers decision 6, then the answered text under the existing 30-word checks (Do 9);
- the add-only library copy lint (content.md 4), run in the generator and in a vitest sweep;
- the source-registry checks;
- strict C15, with stamps for the 8.
deliverable: one PR, plus the Do 9 PR only under merge route (b), plus the claude/lib-5-cards-8 PR only under the D-LIB5-CARDS8 fallback.
evidence: S1-S12 and S4-P.
finish: merged in plan slot 4, with the back box on main before LIB-9 merges, and the 8's machine cards on main (here or by the fallback PR), with each CARDS_8 id wired and each stopped id reported. An empty CARDS_8 still finishes, with S12 run on the fixture card (card amendment 39). You will notice: nothing visible. No library row ships, and the 8 are byte-identical.

design_reference:
- Plan: docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md on claude/howto-options @ 4a9fd86:
  - 4.1 (:392-417);
  - 4.2 (:419-441; "about 29 words each" at :427);
  - 4.3 Stamps (:450);
  - 4.4 (:461-484);
  - 5.6 (:615-626);
  - section 7 row 4 (:761, "the 19 shared cards, C15 stamps for the 8");
  - section 8 item 6 (:821);
  - risks 12 and 23.
- docs/howto/library/inputs/content.md (same ref): 3.2, 3.5 (stamp shape), 4 (add-only lint table), 5.3 (back box) and 6.
- Where the plan or content.md differs from lib4-cards.md sections 1, 12, 13 or 14 or from this card, those win (D-LIB4-DOCS-2). Where this card and section 14 differ, section 14 wins.
- RULINGS.md on the research branch: LR-3, LR-23, LR-27, LR-28 and LR-29. Also R-W0-1 in verify/w0.md: read it, but do not apply its 50-word cap (Stops 3).
- Rulings D-LIB9-CARDFIELDS, D-LIB5-ORDER, D-LIB5-BOX, D-LIB-LANE-ACTIVE and D-LIB-CIMANNERS (lib4-cards.md section 12), section 13 Q1 and Q3, the D-LIB5-* rulings of section 14, and D-LIB3-4 and D-LR23-1 (COACHING-DECISIONS on main).

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- The plan and content.md sections above.
- Research, claude/libht-research @ 9dbc7e0:
  - CARD-V2.md, RULINGS.md and verify/w0.md;
  - shared/*.json (19; back-pain-box.json is status 'draft' with a 50-word box);
  - quotes/shared-*.json (19).
- On main:
  - tests/howto/checks/c7.ts (LIMITS :38; words() :116; box rules :294-301);
  - tests/howto/checks/c15.ts;
  - tests/howto/content-gen.test.ts HT5-A5 (:207: archetypes.ts is generated byte for byte from golden B's shared module);
  - tools/plates/layers/artifact/copy-lint.mjs: limits :29-56, RED_FLAG_ROWS :63, RED_FLAG_BLOCKS :75, SAFETY_LINE_RE :153 and lintShared :320. lintShared checks only the 4 joints in RED_FLAG_BLOCKS;
  - tests/guards/no-contacts.ts;
  - src/slices/howto/sections/Risks.tsx (:16-21) and src/howto/content-types.ts (RiskJoint);
  - tools/plates/library/qa/index.mjs (unusedExemptions :62), node.mjs h6 (:153) and F7 (:293), and qa/exemptions.json (7 'H6:no-card' and 8 'F7' entries, each "LIB-5 adds their cards");
  - tools/plates/library/qa/approved.mjs (candidatesOf :15-23; :20 sets research: null and mistakeFault: null for the 8), tools/plates/golden.mjs extractPlates (mistake.firstKey :130), tests/howto/library-qa.test.ts:53 and qa/selftest.mjs:36 (an unused exemption is red);
  - the 8's How-to modules, tools/plates/layers/exercises/*.howto.mjs (their claims; research.card is 'grip/research/<slug>.json', which is not on main or on 9dbc7e0. Golden B's copies at docs/howto/grip-and-feel/research/<slug>.json on claude/howto-options @ 4a9fd86 are a lead only, never a citation or a value source for Do 3 b);
  - COACHING-DECISIONS D-LIB3-4, D-LIB3-6 and D-LR23-1;
  - tools/plates/layers/README.md (the golden-B S-2 review record);
  - docs/research/howto/reviews.json and sources.json.
- On main @ 72c94fc (LIB-2b merged; these four files are byte-equal to ccf0250):
  - candidate.mjs researchOf (:44-48) and :84 (a library row's mistakeFault is plate.mistake.firstKey);
  - gen/content.mjs archetypesText (:151-159);
  - library-core.test.ts L2-A3 (:34) and the files-count test (:242);
  - tests/howto/fixtures/lib2b/fixture.mjs.
- LIB-4b #232 at its newest head (f1df4a7 at 23:00; re-read it with `git ls-remote origin refs/pull/232/head`): fidelity/twins/ht9.mjs:26-31, fidelity/fixture.mjs stage() and pin(), and fidelity/twins/pins.json.
- LIB-4a #233 @ aaff25e: scale/write-ids.mjs, scale/synthetic.mjs and tests/howto/lib-4a.test.ts.
- docs/supervisor/verify/lib4-cards.md on origin/claude/sup-lib4-cards at the commit that adds section 14 (the supervisor's #244 comment names its sha): section 2, 11.1 items 3, 7 and 17-19, section 12 (items 1-19; item 13 as amended in section 14), section 13 Q1 and Q3, and section 14. Item 13 as read at 19a6017 is superseded.
- LIB-4c claude/lib-4c-library-ci @ 108eb5c: ci/affected.mjs, ci/scratch.mjs and tests/howto/library-ci.test.ts.
- LIB-6 #181 @ 9b8f76e: build-layers-page.mjs and its mirrored artifact/howto-layers.mjs (:217, :221, :271-278, :301-302).
- On main 2d1bbf3: tests/howto/sections-risks.test.ts (:10, :29-31); tests/howto/library-rows.test.ts (:34-36, :90-108, :130-162); tests/howto/no-contacts-parity.test.ts (HT4b-A6); tests/howto/checks/c19.ts (checkC19Shared :49); tools/plates/generate.mjs (:20, :83-90); tools/plates/lib/inputs.mjs (:2-3, :31); vite.config.ts:18; .github/workflows/build-apk.yml:42.
- LIB-7 #193 @ 55e91e9 and LIB-12 #191 @ 0d268a7: hands/claims.json and the hand-*.mjs fault keys.

write_scope:
- New files:
  - docs/research/howto/shared/*.json (19) and docs/research/howto/quotes/shared-*.json (19), as byte copies;
  - the 8's card and quotes files (Do 3 b): docs/research/howto/cards/<id>.json and quotes/<id>.json for the 8 only, at the paths the note names under D-LIB9-CARDFIELDS;
  - docs/research/howto/CARD-V2.md: the research text plus one 'Machine fields' section;
  - tools/plates/library/shared/** (the back-box module included);
  - tools/plates/library/lint/**;
  - tools/plates/library/research/**: the validator, the source-registry check, and the stamp helpers contentHashOf, stampProblems, writeScratchStamps, markScratch and SCRATCH_MARKER (D-LIB5-SCRATCH), and the builder's copy of the 8's ruled tempo table (D-LIB5-TEMPO8), with signatures fixed in the design note;
  - tests/howto/library-shared.test.ts, library-lint.test.ts, library-research.test.ts, library-cards8.test.ts and c15-stamps.test.ts;
  - tests/howto/fixtures/lib5/**;
  - tools/plates/gen/library-gate.mjs (D-LIB5-GATE);
  - tools/plates/library/shared/check-bundle.mjs (D-LIB5-BUNDLE; under shared/**);
  - under tests/howto/fixtures/lib5/**: the per-case tree helper (D-LIB5-FIXTURE), the back-flagged fixture helper (D-LIB5-PAGE), the neutral boxes and sheet (D-LIB5-WORDS, D-LIB5-REACH), the fixture hand module (D-LIB5-FAULTKEYS), the S3 fixture card and quotes (D-LIB5-FIXTURE 4) and the 9dbc7e0 draft box.now.text (D-LIB5-BUNDLE);
  - docs/howto/library/LIB-5-DESIGN.md.
- Existing files, only as listed:
  - reviews.json: the 8's entries;
  - tools/plates/library/qa/exemptions.json: only removing the 8's 'H6:no-card' and 'F7' entries (Do 3 b);
  - tools/plates/library/qa/approved.mjs: only the lines the note names that give the 8's candidates their card research and mistakeFault (Do 3 b);
  - tests/howto/library-qa.test.ts: only the two clone inputs of the test 'new plates inherit none of the 8's exemptions' (:66 and :70 on main: `{ ...c, id: 'lib_chin_up', mode: 'H' }` and `{ ...c, id: 'lib_chin_up', mode: 'H', exemptions: ['F5', 'F7'] }`; :65 `const c = …` stays unchanged). Each gains `research: null, mistakeFault: null` (a new plate has no card), and only if lib_pull_up is in commit 2. If it is not, both stay as on main and the PR says why. Every assertion stays (Do 3 b commit 2);
  - the count lines and the fixture-builder lines, as under shared-file owners;
  - the generated files, written only by the generator;
  - COACHING-DECISIONS.md (append).
- Do 9 only: Risks.tsx, content-types.ts, the ht9 twin's entry and FLAG lines (D-LIB5-TWIN), the two sections-risks.test.ts lines (D-LIB5-RISKSTEST), the count lines (D-LIB5-COUNTS), check-bundle.mjs's Do 9 rule (D-LIB5-BUNDLE), and tests/howto/library-back-page.test.ts (S5-L, D-LIB5-PAGE; only when the Do 9 change merges after LIB-6-PM's back patches). Under either route, also LIB-5's own files as Do 9's steps need them: tools/plates/library/shared/back-box.mjs (the placeholder replaced; backBox() keeps its name and signature), the re-copied shared/back-pain-box.json and its S1 pin, tools/plates/gen/library-gate.mjs (extraBoxes and the red-flag-back.ts output), the lint/** trigger pins, tests/howto/library-shared.test.ts (the check-bundle block's Do 9 cases and D-LIB5-TWIN's block) and library-lint.test.ts (S4's box tests). src/howto/red-flag-back.ts is written only by library-gate.mjs.

reserved_paths:
- tools/plates/layers/** and tools/plates/vendor/** (golden B, copy-lint.mjs included).
- tests/howto/checks/*.ts (c7 and c15 unedited), content.test.ts, content-gen.test.ts, library-qa.test.ts (except its two clone inputs in write_scope) and fixtures/generated-bodies.json.
- tools/plates/gen/content.mjs, gen/ids.mjs, tools/plates/generate.mjs and tools/plates/lib/** (D-LIB5-GATE).
- tests/howto/fixtures/lib2b/fixture.mjs, library-rows.test.ts, library-ci.test.ts, sections-risks.test.ts and lib-4a.test.ts, except the D-LIB5-SCRATCH, D-LIB5-COUNTS and D-LIB5-RISKSTEST lines.
- src/** until Do 9. src/howto/archetypes.ts always (HT5-A5). src/howto/generated/** is never edited by hand.
- tools/plates/library/qa/**, except the two Do 3 b edits above. Every other exemption, envelope.json, pin.mjs and every pinned value stay unchanged.
- tools/plates/library/{candidate,registry,batch-golden,layers-spec,inputs-closure}.mjs.
- tools/plates/library/{fidelity*,ci,hands,render,specs,eq,pilot-a,lb1}/** and build-layers-page.mjs, except the listed lines.
- scripts/** (screenshot-gate.mjs included), tests/theme.test.ts and src/ui/styles.css.
- Every budget file and ceiling.
- .github/**, package.json and package-lock.json.
- docs/research/howto/cards/** and quotes/<id>.json, except the 8's files (Do 3 b). Per-exercise library cards arrive in batch PRs.
- The 8's How-to modules, their research.card values and their generated files (S10).
- The back box's wording. It is never written or edited here, and comes only from the research head the supervisor names with the owner's answer.

Do:
1. Design note. Reading and writing only (Stops 1). Write it locally while pushes are closed. With your first allowed push, post it as one PR comment, then stop. It states:
   a. Where RED_FLAG_BACK will live once its text exists. It cannot go in archetypes.ts, because HT5-A5 keeps that file byte-equal to golden B. Name every pinned test it changes and its exact new value (the 'generator writes N files' count; L2-A3's bodies stay). State the method for measuring the HowToSheet chunk raw/gz before and after for a 30-word box, against its existing budget: the build command, the chunk file, the budget file and its limit, and the 30-word stand-in text, which lives only in a scratch worktree and is never committed or pushed. Do 2 runs it.
   b. The 30-word reach. lintShared covers only the 4 joints in RED_FLAG_BLOCKS, and c7 reads one content.redFlag per sheet. For every place the box is generated or rendered, name the test that runs on it with all of these:
      - golden B's RED_FLAG_BOX_MAX_WORDS and c7's LIMITS.redFlagBoxWords, both imported, never copied or overridden;
      - c7's words();
      - the 'today' and 'doctor' rules (c7.ts:300-301);
      - the contact patterns (no-contacts.ts, SAFETY_LINE_RE).
      No placement may sit outside that reach.
   c. The fail-closed placeholder: the module path, its exports, the exact throw message, every generator call site, and the S4-P tests.
   d. The machine fields per D-LIB9-CARDFIELDS.
   e. Stamps:
      - the value fed to contentHash, and whether the 8's machine cards (Do 3 b) enter it;
      - the reviews.json entry shape (content.md 3.5), with approvedBy left until the "stamps (O5)" ruling;
      - whether c15.ts accepts it unedited.
   f. The stamp gate:
      - its one location;
      - every fixture it would break: LIB-2b E1, LIB-4a's synthetic runs at N = 22 and 153, LIB-4b B5, and LIB-4c C11-C14;
      - the scratch-stamp design: scratch stamps are written into scratch roots only;
      - the fixed helper signatures, so LIB-4c can call them.
   g. Each shared module's exports with their card claim refs, the lint each string passes, and the fault and pair keys matched to LIB-7 and LIB-12.
   h. The method for a dry run of the new lint rules over the 8's copy: each rule, the strings it reads, and how each hit is reported. Do 2 runs it.
   i. That the shared risk lines (bar over the face, breath-holding, jump landing) are not written, because no card sources them (LR-3).
   j. That the validator never reads back-pain-box.json's wordCap or words as a limit.
   k. The 8's machine cards (Do 3 b):
      - for each of the 8, the plate facts, tempo array and top fault its card would carry, and for each value the verified claim and verbatim quote that states it, with the path and sha that hold it, or "no verified quote in the repo";
      - the card and quotes paths under D-LIB9-CARDFIELDS;
      - the exact qa/approved.mjs lines that give the 8's candidates their card research and mistakeFault.
      Checked 2026-10-17: none of the 8 has a card on claude/libht-research @ 9dbc7e0 (109 cards). claude/libht-research-the8 @ e6381fa holds unverified cards for all 8 without the three keys, and only the head the supervisor names counts. Their How-tos name research.card 'grip/research/<slug>.json', which is not on main or 9dbc7e0 (golden B's copies on claude/howto-options are a lead only). qa/approved.mjs:20 sets research: null and mistakeFault: null.
2. Copy the 19 cards and the 19 quote files with `git show <named research head>:<path>`, byte for byte, and pin each blob sha256 in a test.
   - shared/back-pain-box.json's appliesTo edit (research wave 2) is held until the owner answers. Do 9 re-copies that file and re-pins S1.
   - Then run three things: Do 1 a's chunk measurement on www/assets/HowToSheet-<hash>.js; `npm run build` followed by check-bundle.mjs, with its one seeded check in the scratch worktree (D-LIB5-BUNDLE); and Do 1 h's lint dry run over the 8's copy and all 18 non-box shared cards (the rules as the note states them; Do 5 commits them). Post in one PR comment with your next allowed push: both sizes with headroom; the scanner output; every hit with its rule, card or id, field, path, kind and text; the field split for ruling (D-LIB5-SPLIT); and every claim set filed under two fault keys (D-LIB5-FAULTKEYS 5). A chunk over budget, or a hit on approved golden-B copy, follows risk_and_recovery.
3. Validator and machine fields:
   a. Build the validator, and write the CARD-V2 'Machine fields' section exactly as D-LIB9-CARDFIELDS rules.
   b. The 8's machine cards (plan row 4; supervisor ruling 2026-10-17):
      - Take every claim and quote only from the head the supervisor names (build_prerequisites). Copy each of the 8's card and quotes files from that head byte for byte. Where the copy lacks plateFacts, tempo or topFault, add only those top-level keys per D-LIB9-CARDFIELDS.
      - plateFacts: each fact names the claim whose verbatim quote states it. An id with a spec gets a plateFacts key only if it is non-empty and holds an angle fact that H6 checks against the spec's measure, in the form the ruled plateFacts form table gives for that id (D-LIB5-TEMPO8 2). Otherwise it gets no plateFacts key, never [], and keeps 'H6:no-card'. plateFacts and tempo go in together or not at all.
      - tempo: built only from the ruled 8-row tempo map (D-LIB5-TEMPO8) and the card's verified plate.tempo. Each s is that card's up, down or pause, or a ruled constant with its verified claim and quote. Phase names, order and move flags are labels from the ruled map. No tempo entry carries a claim key (H6 compares by JSON.stringify, qa/node.mjs:174).
      - topFault: the key the supervisor's TOPFAULT comment gives for that id, citing plate.mistake.claim (on a drawable:false card, the claim of the top fault the card names, under section 13 Q1's drawable:false case). Never read mistake.firstKey to choose it (D-LIB5-TOPFAULT; section 13 Q1).
      - Never fetch a source or write a quote yourself. Never take a number or a fault choice from the spec, plate or engine report under test. Only labels come from them, each through a ruling: the tempo map's phase names, order and move flags; the plateFacts form labels of the ruled table (kind, `joint` or `measure: true`, pose, the spec's measure.vertex); and the tell keys the blind TOPFAULT pass chose from.
      - Pin each file's blob sha256 in library-cards8.test.ts, and show that each card differs from its research copy only in the three keys. S2's validator passes on each.
      - Commit order (two commits; every test green on each):
        - Commit 1: the 8's card and quotes files, their pins in library-cards8.test.ts and the validator. qa/approved.mjs, qa/exemptions.json and library-qa.test.ts stay untouched, so the 8's QA and its exemptions behave exactly as on main. Push it (CI manners), and wait for the supervisor's 'CARD FIELDS VERIFIED @ <sha>': a fresh, blind Opus content verifier with one planted wrong number, as D-LIB9-CARDFIELDS sets for every batch. It re-checks each topFault on the TOPFAULT pass's blind inputs, never firstKey. It is red if a drawable:true topFault names anything other than plate.mistake's fault, or if a drawable:false topFault equals the drawn fault (section 13 Q1's two checks; D-LIB5-TOPFAULT). When commit 1 writes no plateFacts or tempo value (every id with a spec stopped, D-LIB5-TEMPO8 6), the supervisor plants the wrong number in one numeric value of the PR's stop report (a stopped id's computed fact or tempo second, each with its claim), which the verifier checks against the quotes like a written value. Fix only what it names; it then re-runs for the changed cards.
        - Commit 2, one commit, only after that comment. It covers only the ids the comment verifies whose card holds every value H6 and F7 read, all verified and clean against H6 and F7: plateFacts, tempo and topFault (topFault alone for lib_dumbbell_lateral_raise, which keeps 'H6:not-engine'). A drawable:false id never qualifies: its section 13 Q1 topFault raises F7. CARDS_8 lists exactly those ids. Every other id stays out: approved.mjs keeps research: null and mistakeFault: null for it, and all its exemptions stay. A test asserts that cardResearch(id) deep-equals researchOf's projection (candidate.mjs:44-48) for each CARDS_8 id:
          - in qa/approved.mjs, change only the lines the note names: each verified id's candidate gets research from its card (the three keys researchOf returns) and mistakeFault from its plate's mistake.firstKey, as candidate.mjs:84 on ccf0250 does for library rows;
          - in qa/exemptions.json, remove the 'H6:no-card' entry (7 ids; the lateral raise keeps 'H6:not-engine', since it has no spec) and the 'F7' entry (8 ids) for those ids only, and nothing else;
          - in library-qa.test.ts, the two clone inputs in write_scope;
          - append D-LIB5-CARDS8 to COACHING-DECISIONS.md (D-LIB3-4: exemptions change only with a decision).
        - Why one commit: wiring with the exemptions still present leaves them unused, so library-qa.test.ts:53 ('none unused'; F7 is not in its browserKeys list) and qa/selftest.mjs:36 turn red; removing them without the wiring turns H6 and F7 red; the wiring without the clone line turns the clone test red.
      - The 8's How-to modules, their research.card values and every generated file stay byte-identical (S10).
      - Do 3 b leaves this PR for each of the 8 that, at LIB-5's merge slot, lacks any of these: verified research on a named head; its TOPFAULT answer; the ruled tempo map; a 'CARD FIELDS VERIFIED @ <sha>' at a sha whose card files for that id equal this head's. If that id's files are already pushed, one new commit before READY removes its card and quotes files and their library-cards8.test.ts pins. Never rebase, amend or force-push. The validator and the CARD-V2 'Machine fields' section stay. Commit 2 never covers such an id, so its approved.mjs lines and exemptions stay as on main. Those ids land after LIB-5 in one PR from claude/lib-5-cards-8 (based on main), with its own fresh Opus review and S12. Their exemptions stay until then (D-LIB5-CARDS8). An id that stops under risk_and_recovery (a miss, 'none', 'several', drawable false) is not a fallback id. It keeps both exemptions until the supervisor rules.
4. Build the shared modules. The back-box module is the fail-closed placeholder from Do 1 c:
   - It holds no box text and never reads shared/back-pain-box.json's box fields.
   - Its accessor throws "LIB-5: back box waits for owner decision 6 (plan 8 item 6)".
   - library-gate.mjs calls refuseBack for every shipped row whose riskFlags include 'back', so such a row throws, naming the id.
   - The module exports BACK_BOX_WAITS, backBox() and refuseBack(id, riskFlags). backBox() keeps its name and signature in Do 9, because LIB-6-PM's page patch calls it (D-LIB5-PAGE).
   - Build the placeholder and every module whose card has no shown-copy hit at once. CURL, ROPE and PALM_FLAT wait for a copied head that holds D-LIB5-FAULTKEYS's research edits. A module with a hit waits for a named research head on which its shown fields pass (D-LIB5-SPLIT). LIB-5 never rewords, trims or exempts a string.
   - Add no RiskJoint 'back' and no Risks map entry before Do 9: a map entry needs a real RedFlagBlock, and placeholder text must never reach src/ or the APK.
5. Put the library lint in tools/plates/gen/library-gate.mjs for every shipped library row (not the 8, which the sweep covers; D-LIB5-GATE 1). It throws naming the id, field and rule. The variant-line rule runs only in the sweep until the field card lands (D-LIB5-VARIANT). Add a vitest sweep over every shipped row: C1-C4, C7 plus the library rules, C8, C15, C16 and C19, plus checkC19Shared on every red-flag box the row shows (D-LIB5-REACH). checkC15 gets the row's own fragments object, never `{}` (D-LIB5-STAMPS).
6. Stamps: compute the 8's hashes (D-LIB5-STAMPS). Draft entries that cite both records per role (S-2, tools/plates/layers/README.md:27-45; the compact rewrite, :52-90) and list the recorded golden-B follow-ups that name each id (HANDOVER 8.2 items 1-11 and 8.0k follow-up 12). Post them for approval. The gate, the approved entries and every fixture builder's three D-LIB5-SCRATCH lines land in one commit.
7. After each merge listed under base, merge main and apply the D-LIB5-SCRATCH lines to each fixture builder now on main. Re-run everything on that head: lib-4a.test.ts unedited, and, once LIB-4c is on main, D-LIB5-GATE's affectedIds test.
8. Write LIB-5-DESIGN.md as built, and append the D-LIB5-* decisions.
9. Box item, only after the supervisor's comment records the owner's answer (build_prerequisites).
   - First check the answered box against every existing check, unedited: at most 30 words (Stops 3's option-1 exception aside), 'today' in now, 'doctor' in doctor, no contact wording. If it cannot pass, stop and report on the PR. If the owner chose a cap change, that is a separate card; this card never makes it.
   - Otherwise:
     - re-copy shared/back-pain-box.json from the named head and re-pin S1;
     - replace the placeholder: backBox() returns the RedFlagBlock whose name, now and doctor are box.name.text, box.now.text and box.doctor.text, with claim from box.boxClaim. library-gate.mjs writes it as src/howto/red-flag-back.ts (RED_FLAG_BACK);
     - add RiskJoint 'back' and the Risks map entry;
     - pin the kept triggers in the library lint;
     - apply the ht9 twin's entry and FLAG lines after LIB-4b merges, re-run B2 and keep B3 green (D-LIB5-TWIN);
     - add the two sections-risks.test.ts lines (D-LIB5-RISKSTEST);
     - set extraBoxes to { back: backBox() } (D-LIB5-WORDS), and switch check-bundle.mjs to its Do 9 rule (D-LIB5-BUNDLE);
     - re-pin the count lines, with the before and after run (D-LIB5-COUNTS);
     - carry S5-L if this change merges after LIB-6-PM's back patches (D-LIB5-PAGE);
     - append D-LIB5-BACKBOX and D-LIB5-RISKSTEST, citing the supervisor's comment;
     - run S4, S5, S5-L when due (D-LIB5-PAGE), and S11.

Acceptance (each with mutations that must turn red; list them in the PR):
- S1 The 38 research files on the branch equal the named research head. A test pins the 38 blob sha256 values with exact counts. Mutations: one byte changed; a file missing; a 20th card.
- S2 Every shared card is valid. The validator checks:
  - each kind's keys (LR-29);
  - claim refs resolve, and no source is orphaned;
  - every quote is at most 50 words, verbatim and present in its quotes file;
  - shown fields pass the LR-27 patterns (CONTACT_RE, SOURCE_RE, SOURCE_CS_RE, SAFETY_LINE_RE).
  It never treats a card's wordCap or words as a limit.
  Mutations: an orphan source; a 51-word quote; a missing quote entry; an unknown kind.
- S3 Machine fields round-trip. candidateOf on the lib5 fixture card of D-LIB5-FIXTURE (4) returns them, and H6 passes with matching facts, under every per-value rule of D-LIB9-CARDFIELDS and D-LIB5-TEMPO8. candidateOf and runQa are called directly, with no generator. Mutations: tempo nested under plate turns H6.tempo red; a plateFact with no claim is red.
- S4-P The back box fails closed. This holds from Do 4 until Do 9 replaces it, and is required for merge under route (b):
  - the back-box module holds no box text;
  - none of the three whole field values of shared/back-pain-box.json's box (box.name.text, box.now.text and box.doctor.text), each matched exactly as one case-sensitive string, appears in any file under src/** or in any file under www/** after `npm run build` (check-bundle.mjs; D-LIB5-BUNDLE). Before writing this test, run `git grep -nF` for each value on origin/main's src/** and record the 0 hits in the PR (checked on 49a2853 on 2026-10-17: 0 hits for all three; lower-case "back pain" inside a sentence at src/howto/generated/ht-hanging-leg-raise.ts:429 is not a match). If a value already appears on main, stop and report; never narrow the match;
  - E1's row, in a per-case copy of E1's tree with 'back' added to its riskFlags, makes the generator throw exactly `lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)` (D-LIB5-FIXTURE);
  - RiskJoint has no 'back';
  - a guard test: if the module holds box text, COACHING-DECISIONS.md must hold D-LIB5-BACKBOX, and the text must equal the box of a shared/back-pain-box.json whose status is not 'draft'.
  Mutations: the research draft text pasted into the module with no decision recorded; the throw removed (E1's back-flagged copy then generates); each of the three values planted in a temp folder makes check-bundle exit 1, naming that field; a folder with no HowToSheet chunk makes it exit 1; the doctor value added as a string under src/.
- S4 (Do 9) The back box is exact and inside the 30-word reach:
  - RED_FLAG_BACK equals the named head's box text, byte for byte;
  - it is at most 30 words by c7's words(), against c7's LIMITS.redFlagBoxWords and golden B's RED_FLAG_BOX_MAX_WORDS, both imported unchanged; an equality test shows both are 30;
  - 'now' says 'today' and 'doctor' says 'doctor';
  - "Get emergency help now." appears at most once, and only as D-LR23-1 allows;
  - there is no CONTACT_RE, SOURCE_RE, SOURCE_CS_RE or SAFETY_LINE_RE hit, and checkC19Shared({ RED_FLAG_BACK, DISCLAIMER }, 'back') returns [] (c19.ts:49);
  - the D-LIB5-REACH differential holds on the box;
  - check-bundle's Do 9 rule passes (D-LIB5-BUNDLE);
  - the claim sources include nhs-back, and C19 is clean;
  - every trigger the answered text keeps is pinned in the library lint, so losing one is red.
  Mutations: a 31-word back box; 'Call 999'; 'today' removed; one kept trigger removed; nhs-back removed.
- S5 (Do 9) The app renders the box and the 8 are unchanged:
  - renderRisks emits <pre>-redflag-back for a lib5 fixture row;
  - the HT-9 block, L3 and golden B are at 0 px;
  - budgets.test is unedited and green, and www/assets/HowToSheet-<hash>.js is within its existing budget;
  - S5-L (D-LIB5-PAGE) is green on the first head that holds both Do 9 and LIB-6-PM's back patches. Whichever change merges second carries it.
  Mutations: the map entry removed turns typecheck red; the wrong block is red.
- S6 The shared modules equal their card fields, and their refs resolve. Every shown field passes golden B's lint at its ruled path and kind (D-LIB5-SPLIT). No data value reaches src/** or a generator output, and a pinned list of each module's export keys holds no data field. Mutations: one string drifted; one ref broken; one notes string written into a generated file; a data key added to an export.
- S7 Library lint (content.md 4):
  - its rules: medical-claim bans; the variant line (D-LIB5-VARIANT); FIX_VERBS closed; family consistency (rule (a) with the fixture-proven hand reader, D-LIB5-FAULTKEYS, and the inheritance refusal, D-LIB5-FAMILY); the sheet's visible total with every box (D-LIB5-WORDS); the red-flag box reach (D-LIB5-REACH); and RED_FLAG_ROWS per stamped id;
  - golden B's constants are imported unchanged (equality test);
  - a test asserts that every red-flag box limit under tools/plates/library/lint/** is the imported 30;
  - the 8 pass in the sweep. The only by-name exemption ruled now is VARIANT_LINE_EXEMPT = ['lib_lat_pulldown', 'lib_leg_press'], for the variant-line rule only (D-LIB5-VARIANT8). Any other is added only by a supervisor ruling under risk_and_recovery's 'A new ban hits approved golden-B copy' line that names the exact id, rule and string, matched by exact id as D-LIB5-VARIANT8 matches. E1 reuses pull-up's copy under its own id and inherits no lib_pull_up exemption, so a hit on pull-up's copy also turns E1's generator cases red: stop and report it, and the ruling says how E1 is treated.
  Mutations: one fixture per rule; E1's row with 'treats' in one copy string makes the generator throw (D-LIB5-FIXTURE); every mutation listed under D-LIB5-VARIANT, D-LIB5-VARIANT8, D-LIB5-FAULTKEYS, D-LIB5-FAMILY, D-LIB5-WORDS and D-LIB5-REACH; a second box limit of 50 added under lint/**.
- S8 C15 is strict:
  - reviews.json holds the 8's approved stamps, and checkC15 returns [] for every shipped row;
  - a button is written only for stamped rows, and an unstamped shipped row makes the generator throw;
  - a test fails if the committed reviews.json holds a scratch entry, or if SCRATCH_MARKER exists at ROOT or is tracked;
  - stampProblems treats a missing, unparsable or empty reviews.json as a failure for every shipped id, never as c15.ts:26's stub pass. contentHashOf equals c15's contentHash on the 8 and on E1's row, over all 9 fragments (D-LIB5-STAMPS).
  Mutations: one character of one of the 8's content changed; a stamp deleted; a committed scratch entry; entries emptied, so the generator throws once naming each of the 8 while checkC15 returns []; every D-LIB5-SCRATCH mutation.
- S9 The source registry is consistent: the same id means the same URL in sources.json, and no URL is in src (C17, C19). Mutation: a duplicate id with a different URL.
- S10 The 8 are byte-identical: L1, L2, L3, L2-A3, HT5-A5, and the golden A and B checks. Run before and after Do 3 b, and before and after Do 9.
- S11 No regression: `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` and ht10-gate, on the final merged head.
- S12 The 8's machine cards (Do 3 b):
  - each card and quotes file equals its pinned blob sha256, and each card differs from its research-head copy only in plateFacts, tempo and topFault;
  - every plateFact names a claim whose verbatim quote is in its quotes file, and S2's validator passes;
  - each id that lost 'H6:no-card' has a non-empty plateFacts that holds its measured-joint fact in the ruled form (D-LIB5-TEMPO8 2);
  - each tempo equals the array the test builds from its own copy of the ruled 8-row map and that card's plate.tempo, and no s is unmapped (D-LIB5-TEMPO8);
  - each topFault equals the TOPFAULT comment's key for that id; each wired card has plate.mistake.drawable true; each drawable:false card's topFault, where written, differs from its plate's mistake.firstKey (section 13 Q1); and no topFault is written for an id stopped for 'none', 'several' or a key check (D-LIB5-TOPFAULT);
  - when no id of the 8 lost 'H6:no-card' (the expected path, D-LIB5-TEMPO8 6), every bullet and mutation here that needs such an id runs on the S3 lib5 fixture card (D-LIB5-FIXTURE 4), in a temp copy of E1's tree, through candidateOf and runQa, with a fixture map row in the test's own copy fed to the same tempo builder as the 8's. The topFault and F7 rows run on lib_dumbbell_lateral_raise when it is in CARDS_8, and otherwise on that fixture card. The test asserts that the set of cards each row checks is non-empty, and the PR lists each stopped real id with its reason;
  - the supervisor's 'CARD FIELDS VERIFIED @ <sha>' names a sha whose card files for each id in this PR equal the head's;
  - with those entries removed, H6 returns no problem for each id that lost 'H6:no-card', F7 is not raised for each id that lost 'F7', library-qa.test.ts (:53, no unused exemption) and selftest.mjs are green, and envelope.json and every pin are unchanged.
  Nothing is loosened: no tolerance, check or test changes, and every other exemption stays.
  Mutations: plateFacts deleted from one of the 7 cards with a spec turns H6 red (H6:no-card); plateFacts set to [] on one id that lost 'H6:no-card' turns library-cards8.test.ts red; its measured-joint fact removed turns it red; one angle fact +3° turns H6 red (H6.fact); tempo deleted turns H6.tempo red; one tempo second changed turns H6.tempo red; a mapped field swapped (up for down) turns the map test red; an s with no map entry, or a constant added without a ruling, turns it red; one card's topFault deleted makes F7 block (library-qa.test.ts:60 red); topFault set to another key raises F7; a wired card's drawable set to false turns the test red; on a test copy of one card set to drawable:false with topFault equal to the drawn key, the test turns red (section 13 Q1 mutation (2)); a removed exemption restored turns library-qa.test.ts:53 red; one byte of one card changed turns the pin red; the clone inputs' `research: null, mistakeFault: null` removed turns the clone test red (only when lib_pull_up is wired).

verification: the PR body maps each S row to a test or run. On every head sent for review and on the READY head, the PR shows D-LIB5-GATE's byte-identity diff and `generate --check`, and check-bundle's output after `npm run build`. Before READY, merge origin/main and run S11 on that exact head. Under route (b), S4, S5 and (when due) S5-L run in the Do 9 PR.

risk_and_recovery:
- The HowToSheet chunk goes over its budget (Do 2 measurement or S5): stop and report. Never raise a budget.
- A new ban hits approved golden-B copy: name it. A by-name exemption needs a supervisor ruling, and the rule is never weakened.
- The note finds a box placement outside the 30-word reach: choose one inside it. If none exists, stop at the note.
- The owner's answer cannot pass the existing checks unedited (option 1's 50 words do not): stop Do 9 and report (Do 9, first bullet). Do 9 then waits for the cap card and lands under route (b), under Stops 3's one exception.
- By the merge slot no answer is recorded, or the answer needs the cap card and that card has not merged: merge under route (b).
- A value of the 8 has no verified quote on the named head (and, for a tempo s, no ruled constant): do not write it, and report it on the PR. If no measured-joint fact is verified, write no plateFacts key, never []. That id keeps its exemptions; the supervisor routes the research.
- A verified fact of the 8 misses its approved plate (outside H6's ±2° or ±1 cm, or a tempo array not equal to the spec's), or its TOPFAULT answer is 'none' or 'several', or on a drawable:true card that answer differs from the plate's mistake.firstKey, or on a drawable:false card it equals firstKey, or its card has drawable false: stop and report for that id. A drawable:false id gets section 13 Q1's topFault only when its key differs from firstKey, and is never wired here (D-LIB5-TOPFAULT). Never change the fact, the plate, the spec or a tolerance; that id keeps its exemptions until the supervisor rules.
- LIB-2b changes in its delta: re-merge it and re-run S3, S8 and S11.
- The research head changes after Do 2 (wave 2, then the one D-LIB5-FAULTKEYS/D-LIB5-SPLIT head): re-copy only as build_prerequisites allows, and on each re-copy re-pin S1 and re-run S2, S6 and S7.
- The stamp gate is red on a fixture, on a head that holds both cards: LIB-5 owns the fix. If no fix works without loosening a check, stop and report.
- A shown shared string fails golden B's lint: report it, and research rewords it (D-LIB5-SPLIT). Never reword, trim, exempt or reclassify it.
- A plugin cannot gate as D-LIB5-GATE rules: stop and ask for a supervisor ruling.
- An existing test turns red on the gate commit because a gate line now comes before the message it expects: stop and report. Never edit that test or reorder another plugin.
- A quoted count line's text differs on the merged head, or another test turns red from the new output: stop and report (D-LIB5-COUNTS).
- B2 is not identical after the twin lines: stop and report. Never change a3Probe or FLAG (D-LIB5-TWIN).
- A generator case throws a different message from the one it asserts: stop and report. Never loosen the assertion.
- Two failed tries of one approach: stop and report.
- CI load: pushes follow CI manners. A supervisor request is the only extra push.

return:
- PR number and head sha;
- the design-note comment id;
- the revised note's comment id, and the TOPFAULT, tempo-map and D-LIB5-SPLIT ruling comment ids;
- HowToSheet sizes;
- the 8's stamp table;
- the 8's machine-card table: id, card blob sha256, exemptions removed, and the verifier comment id; or, under the fallback, the claude/lib-5-cards-8 PR number and head;
- the mutation list;
- the back-box state: placeholder, or Do 9 built, with the supervisor comment id;
- check, test:tz and gate output on the final head.

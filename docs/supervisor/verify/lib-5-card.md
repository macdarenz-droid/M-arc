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
   - Once the note is written you are WAITING (no permitted work in hand), apart from the one push and the comment that post the note after 'E8 done'.
   - Start Do 2 only when one supervisor PR comment gives both the design-note ruling and the words "LIB-5 resume" (also sent to your session). Only the supervisor sends it, once a lane slot is free. A freed slot goes first to a D-LIB2b-ORDER chain card (LIB-2b, LIB-4a and LIB-4b, each its own slot) or LIB-4c, then to LIB-5.
   - Never resume on any other event: a merge, a CI result, a comment on another PR, or a self-wake.
   - If the supervisor tells you to park, stop at your next local commit, push nothing and wait for "LIB-5 resume".
2. Back-pain box held (D-LIB5-BOX).
   - The box's text and its word cap belong to the owner's decision 6 (plan 8), which conflicts with supervisor ruling R-W0-1 (50 words). The supervisor has sent the owner the question. Never write to the owner yourself.
   - Until the supervisor records the owner's answer on this PR, build everything except the box text. Do 4 builds the back-box module as a placeholder that fails closed (S4-P).
   - The answer is recorded before Do 9. The box item (Do 9: box text, RiskJoint 'back', the Risks map entry, the ht9 twin line, S4, S5) is blocked until then.
3. No cap is raised. Every red-flag box, the back box included, stays at 30 words or fewer. Four limits set this:
   - golden B's RED_FLAG_BOX_MAX_WORDS = 30 (tools/plates/layers/artifact/copy-lint.mjs:50, "limits (owner 2026-09-30)");
   - c7's LIMITS.redFlagBoxWords = 30 (tests/howto/checks/c7.ts:38, checked at :299);
   - plan 8 owner decision 6 ("30 words or fewer");
   - plan 4.2 ("about 29 words each").
   Never add a lint rule, option, exemption or per-box limit that allows more than 30 words. Never edit golden B or c7's limits. This card does not apply R-W0-1's "named limit for this box only" (docs/research/howto/verify/w0.md on claude/libht-research). The wordCap and words fields in shared/back-pain-box.json are data, never a limit.

CI manners (D-LIB-CIMANNERS; every card carries this text unchanged, and it replaces any older rule in the card):
CI manners while GATE-SPLIT's E8 proof runs: push nothing until the supervisor sends you 'E8 done' (by a message to your session, and as a comment on your PR if it exists). After 'E8 done' and until the GATE-SPLIT train has merged, before each push check that no M/ARC gate run is in progress on claude/sup-gate-split-ci, claude/gate-split, claude/sup-gate-split-e6, claude/sup-gate-split-e9 or claude/sup-merge-train-* (curl the Actions API); if one is, wait. Then at most one push per 2 hours until READY unless the supervisor asks for one. Never use [skip ci].
- This replaces the builder skill's "push after every finished task". Gather local commits into the allowed pushes.

base: origin/main @ 49a2853, plus a merge commit of origin/claude/lib-2b-library-rows @ ccf0250 (LIB-2b #234: HANDCSS fix in progress, then a delta review).
- When LIB-2b posts its final passed head, merge that head. Once LIB-2b is on main, merge main instead.
- Merge origin/main again at each of these points:
  - after the GATE-SPLIT train merges (main is frozen at 49a2853 until then, about 22:00 UTC, an estimate);
  - after each of LIB-4a #233, LIB-4b #232 and LIB-4c merges;
  - before READY.
- Merge commits only. Run `git pull --no-rebase` before each push. Never force-push, rebase or amend. If the branch moves without your push, stop and report.

depends_on: LIB-2 (merged in train 19).

build_prerequisites:
- Do 1 (design note): none. Reading and writing only (Stops 1), on the base above. Post it with your first allowed push.
- Do 2 onward: the supervisor's comment with the ruling and "LIB-5 resume" (Stops 1).
- Code under tools/plates/gen/** is written only on LIB-2b's final passed head, merged in.
- Do 2 waits until the supervisor names the claude/libht-research head to copy. That is the head after research wave 2 merges, or 9dbc7e0 if wave 2 has not merged by then. In that case you re-copy and re-pin once when it merges.
- Do 3 waits for the posted D-LIB9-CARDFIELDS ruling. Do 3 b also waits for a supervisor PR comment that rules the note's source list for the 8 (Do 1 k) and names the head that holds their verified claims and quotes. Do 3 b's exemption removal waits for the supervisor's 'CARD FIELDS VERIFIED @ <sha>' comment on the 8's cards.
- Do 6 waits for the posted "stamps (O5)" wording ruling (lib4-cards.md 11.1 item 7), which sets approvedBy.
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
- The supervisor's 'CARD FIELDS VERIFIED @ <sha>' on the 8's machine cards, at a sha whose 8 card files equal the merge head's, and S12 green. If the 8's verified research is not on a named head by LIB-5's merge slot, Do 3 b leaves this PR: it lands after LIB-5 in its own PR from claude/lib-5-cards-8 (based on main), with its own fresh Opus review, and the 8's exemptions stay until then (D-LIB5-CARDS8).
- The scratch-stamp lines applied to every fixture builder on main (Do 7).
- The back box, by one of the two routes of D-LIB5-BOX (lib4-cards.md section 12):
  - (a) The owner's answer is recorded, Do 9 is built in this PR, and S4 and S5 are green.
  - (b) By LIB-5's merge slot no answer is recorded, or the answer needs the cap card and that card has not merged. LIB-5 merges with the fail-closed placeholder (S4-P green), so LIB-6, LIB-7 and LIB-8 are not held up. Do 9 then lands in its own PR from claude/lib-5-back-box (based on main), with its own fresh review. That PR must merge before LIB-9: LIB-9's merge_prerequisites hold "LIB-5's back box (Do 9) on main before LIB-9 merges (LR-28)". Under option 1 (50 words), that PR is built only after the cap card has merged, under the limit that card records; LIB-5 never makes that change.
- Green on a head that contains the latest main.

shared-file owners:
- tools/plates/gen/content.mjs and gen/ids.mjs belong to LIB-2b until it merges. Edit only the lines the design note names.
- docs/research/howto/reviews.json is the supervisor's. Entries go in only with the supervisor's approval comment.
- tools/plates/layers/** and tools/plates/vendor/** (golden B) are MANIFEST-locked: read only.
- tests/howto/checks/*.ts: read only, with no limit changes.
- tests/howto/library-core.test.ts (LIB-2, LIB-2b): you may change only the exact count line of the 'generator writes N files' test (:242 on ccf0250, now 60), and only if the note adds a generated module.
- tools/plates/library/qa/approved.mjs and qa/exemptions.json (LIB-3's): only the Do 3 b edits. exemptions.json changes only with a COACHING-DECISIONS decision (D-LIB3-4).
- Once each of these files is on main, add one scratch-stamp call to it and list it in the PR:
  - LIB-2b's tests/howto/fixtures/lib2b/fixture.mjs;
  - LIB-4a's tools/plates/library/scale/write-ids.mjs (the synthetic scale trees at N = 22 and N = 153);
  - LIB-4b's tools/plates/library/fidelity/fixture.mjs;
  - LIB-4c's tools/plates/library/ci/scratch.mjs.
- Do 9 only:
  - src/slices/howto/sections/Risks.tsx (HT-9's): one FLAG entry plus its import;
  - src/howto/content-types.ts: one RiskJoint member, 'back';
  - LIB-4b's fidelity/twins/ht9.mjs:29: the FLAG line gains 'back' after LIB-4b merges, with B2 re-run and the twin re-pinned per D-LIB4-OPEN.
- docs/COACHING-DECISIONS.md: append only.
- No AGENTS shared add-only file is touched (scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css). No gate block is added.

hard card: design note first (Stops 1).

outcome: the shared layer data that every library batch reuses is on main, verified once:
- the 19 shared research cards and their 19 quote files, byte-identical to research;
- a committed card validator, including the card v2 machine fields (D-LIB9-CARDFIELDS);
- the 8's machine research cards (plate facts, tempo, top fault), verified, with their 'H6:no-card' and 'F7' exemptions removed, in this PR or, under the D-LIB5-CARDS8 fallback, in the claude/lib-5-cards-8 PR;
- the library authoring modules: palm-flat, curl and implement archetype data, the 5 equipment moves, exemptions and checkpoints, each value carrying its claim refs;
- the back-box module: a fail-closed placeholder until the owner answers decision 6, then the answered text under the existing 30-word checks (Do 9);
- the add-only library copy lint (content.md 4), run in the generator and in a vitest sweep;
- the source-registry checks;
- strict C15, with stamps for the 8.
deliverable: one PR, plus the Do 9 PR only under merge route (b), plus the claude/lib-5-cards-8 PR only under the D-LIB5-CARDS8 fallback.
evidence: S1-S12 and S4-P.
finish: merged in plan slot 4, with the back box on main before LIB-9 merges, and the 8's machine cards on main (here or by the fallback PR). You will notice: nothing visible. No library row ships, and the 8 are byte-identical.

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
- Where the plan or content.md differs from lib4-cards.md sections 1 and 12 or from this card, those win (D-LIB4-DOCS-2).
- RULINGS.md on the research branch: LR-3, LR-23, LR-27, LR-28 and LR-29. Also R-W0-1 in verify/w0.md: read it, but do not apply its 50-word cap (Stops 3).
- Rulings D-LIB9-CARDFIELDS, D-LIB5-ORDER, D-LIB5-BOX, D-LIB-LANE-ACTIVE and D-LIB-CIMANNERS (lib4-cards.md section 12), and D-LIB3-4 and D-LR23-1 (COACHING-DECISIONS on main).

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
  - the 8's How-to modules, tools/plates/layers/exercises/*.howto.mjs (their claims; research.card is 'grip/research/<slug>.json', which is not in this repo);
  - COACHING-DECISIONS D-LIB3-4, D-LIB3-6 and D-LR23-1;
  - tools/plates/layers/README.md (the golden-B S-2 review record);
  - docs/research/howto/reviews.json and sources.json.
- On LIB-2b @ ccf0250:
  - candidate.mjs researchOf (:44-48) and :84 (a library row's mistakeFault is plate.mistake.firstKey);
  - gen/content.mjs archetypesText (:151-159);
  - library-core.test.ts L2-A3 (:34) and the files-count test (:242);
  - tests/howto/fixtures/lib2b/fixture.mjs.
- LIB-4b #232 at its newest head: fidelity/twins/ht9.mjs:29 and fidelity/fixture.mjs. It was 379cdf4 at 18:00; re-read it with `git ls-remote origin refs/pull/232/head`.
- LIB-4a #233 @ 66f5cef: scale/write-ids.mjs and scale/synthetic.mjs.
- docs/supervisor/verify/lib4-cards.md on origin/claude/sup-lib4-cards @ eb77d98: section 2, 11.1 items 3, 7 and 17-19, and section 12.
- LIB-7 #193 @ 55e91e9 and LIB-12 #191 @ 0d268a7: hands/claims.json and the hand-*.mjs fault keys.

write_scope:
- New files:
  - docs/research/howto/shared/*.json (19) and docs/research/howto/quotes/shared-*.json (19), as byte copies;
  - the 8's card and quotes files (Do 3 b): docs/research/howto/cards/<id>.json and quotes/<id>.json for the 8 only, at the paths the note names under D-LIB9-CARDFIELDS;
  - docs/research/howto/CARD-V2.md: the research text plus one 'Machine fields' section;
  - tools/plates/library/shared/** (the back-box module included);
  - tools/plates/library/lint/**;
  - tools/plates/library/research/**: the validator, the source-registry check, and the stamp helpers contentHashOf, stampProblems and writeScratchStamps, with signatures fixed in the design note;
  - tests/howto/library-shared.test.ts, library-lint.test.ts, library-research.test.ts, library-cards8.test.ts and c15-stamps.test.ts;
  - tests/howto/fixtures/lib5/**;
  - docs/howto/library/LIB-5-DESIGN.md.
- Existing files, only as listed:
  - reviews.json: the 8's entries;
  - tools/plates/library/qa/exemptions.json: only removing the 8's 'H6:no-card' and 'F7' entries (Do 3 b);
  - tools/plates/library/qa/approved.mjs: only the lines the note names that give the 8's candidates their card research and mistakeFault (Do 3 b);
  - tests/howto/library-qa.test.ts: only the two clone inputs of the test 'new plates inherit none of the 8's exemptions' (:65 and :70 on main, `{ ...c, id: 'lib_chin_up', mode: 'H' }`), each gaining `research: null, mistakeFault: null` (a new plate has no card). Every assertion stays (Do 3 b commit 2);
  - gen/content.mjs and gen/ids.mjs (or the one refusal point the note names): the lint call, the stamp gate and the back-box refusal. The back-box output comes only in Do 9;
  - library-core.test.ts and the fixture-builder lines, as under shared-file owners;
  - the generated files, written only by the generator;
  - COACHING-DECISIONS.md (append).
- Do 9 only: Risks.tsx, content-types.ts, the ht9 twin line, and the one src module the note names for RED_FLAG_BACK.

reserved_paths:
- tools/plates/layers/** and tools/plates/vendor/** (golden B, copy-lint.mjs included).
- tests/howto/checks/*.ts (c7 and c15 unedited), content.test.ts, content-gen.test.ts, library-qa.test.ts (except its two clone inputs in write_scope) and fixtures/generated-bodies.json.
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
      Checked 2026-10-17: none of the 8 has a card on claude/libht-research @ 9dbc7e0 (109 cards), their How-tos name research.card 'grip/research/<slug>.json', which is not in this repo, and qa/approved.mjs:20 sets research: null and mistakeFault: null.
2. Copy the 19 cards and the 19 quote files with `git show <named research head>:<path>`, byte for byte, and pin each blob sha256 in a test.
   - shared/back-pain-box.json's appliesTo edit (research wave 2) is held until the owner answers. Do 9 re-copies that file and re-pins S1.
   - Then run Do 1 a's chunk measurement and Do 1 h's lint dry run (the rules as the note states them; Do 5 commits them). Post both results in one PR comment with your next allowed push, naming every hit. A chunk over budget, or a hit on approved golden-B copy, follows risk_and_recovery.
3. Validator and machine fields:
   a. Build the validator, and write the CARD-V2 'Machine fields' section exactly as D-LIB9-CARDFIELDS rules.
   b. The 8's machine cards (plan row 4; supervisor ruling 2026-10-17):
      - Take every claim and quote only from the head the supervisor names (build_prerequisites). Copy each of the 8's card and quotes files from that head byte for byte. Where the copy lacks plateFacts, tempo or topFault, add only those top-level keys per D-LIB9-CARDFIELDS. Each value names the claim whose verbatim quote states it.
      - Never fetch a source or write a quote yourself. Never take a value from the spec, plate or engine report under test.
      - Pin each file's blob sha256 in library-cards8.test.ts, and show that each card differs from its research copy only in the three keys. S2's validator passes on each.
      - Commit order (two commits; every test green on each):
        - Commit 1: the 8's card and quotes files, their pins in library-cards8.test.ts and the validator. qa/approved.mjs, qa/exemptions.json and library-qa.test.ts stay untouched, so the 8's QA and its exemptions behave exactly as on main. Push it (CI manners), and wait for the supervisor's 'CARD FIELDS VERIFIED @ <sha>': a fresh, blind Opus content verifier with one planted wrong number, as D-LIB9-CARDFIELDS sets for every batch. Fix only what it names; it then re-runs for the changed cards.
        - Commit 2, one commit, only after that comment and only for the ids it verifies:
          - in qa/approved.mjs, change only the lines the note names: each verified id's candidate gets research from its card (the three keys researchOf returns) and mistakeFault from its plate's mistake.firstKey, as candidate.mjs:84 on ccf0250 does for library rows;
          - in qa/exemptions.json, remove the 'H6:no-card' entry (7 ids; the lateral raise keeps 'H6:not-engine', since it has no spec) and the 'F7' entry (8 ids) for those ids only, and nothing else;
          - in library-qa.test.ts, the two clone inputs in write_scope;
          - append D-LIB5-CARDS8 to COACHING-DECISIONS.md (D-LIB3-4: exemptions change only with a decision).
        - Why one commit: wiring with the exemptions still present leaves them unused, so library-qa.test.ts:53 ('none unused'; F7 is not in its browserKeys list) and qa/selftest.mjs:36 turn red; removing them without the wiring turns H6 and F7 red; the wiring without the clone line turns the clone test red.
      - The 8's How-to modules, their research.card values and every generated file stay byte-identical (S10).
      - If the 8's verified research is not on a named head by LIB-5's merge slot, Do 3 b leaves this PR: it lands after LIB-5 in its own PR from claude/lib-5-cards-8 (based on main), with its own fresh Opus review, and the 8's exemptions stay until then (D-LIB5-CARDS8).
4. Build the shared modules. The back-box module is the fail-closed placeholder from Do 1 c:
   - It holds no box text and never reads shared/back-pain-box.json's box fields.
   - Its accessor throws "LIB-5: back box waits for owner decision 6 (plan 8 item 6)".
   - The generator calls it for any row whose riskFlags include 'back', so such a row throws, naming the id.
   - Add no RiskJoint 'back' and no Risks map entry before Do 9: a map entry needs a real RedFlagBlock, and placeholder text must never reach src/ or the APK.
5. Put the library lint in the generator for shipped library rows; it throws naming the id, field and rule. Add a vitest sweep over every shipped row: C1-C4, C7 plus the library rules, C8, C15, C16 and C19.
6. Stamps: compute the 8's hashes, draft entries that cite the S-2 record, and post them for approval.
7. After each merge listed under base, merge main and apply the listed fixture lines. Re-run everything on that head.
8. Write LIB-5-DESIGN.md as built, and append the D-LIB5-* decisions.
9. Box item, only after the supervisor's comment records the owner's answer (build_prerequisites).
   - First check the answered box against every existing check, unedited: at most 30 words, 'today' in now, 'doctor' in doctor, no contact wording. If it cannot pass, stop and report on the PR. If the owner chose a cap change, that is a separate card; this card never makes it.
   - Otherwise:
     - re-copy shared/back-pain-box.json from the named head and re-pin S1;
     - replace the placeholder with RED_FLAG_BACK, equal to the card's box text;
     - add RiskJoint 'back' and the Risks map entry;
     - pin the kept triggers in the library lint;
     - apply the ht9 twin line after LIB-4b merges;
     - append D-LIB5-BACKBOX, citing the supervisor's comment;
     - run S4, S5 and S11.

Acceptance (each with mutations that must turn red; list them in the PR):
- S1 The 38 research files on the branch equal the named research head. A test pins the 38 blob sha256 values with exact counts. Mutations: one byte changed; a file missing; a 20th card.
- S2 Every shared card is valid. The validator checks:
  - each kind's keys (LR-29);
  - claim refs resolve, and no source is orphaned;
  - every quote is at most 50 words, verbatim and present in its quotes file;
  - shown fields pass the LR-27 patterns (CONTACT_RE, SOURCE_RE, SOURCE_CS_RE, SAFETY_LINE_RE).
  It never treats a card's wordCap or words as a limit.
  Mutations: an orphan source; a 51-word quote; a missing quote entry; an unknown kind.
- S3 Machine fields round-trip. candidateOf on a lib5 fixture card returns them, and H6 passes with matching facts, under every per-value rule the posted D-LIB9-CARDFIELDS sets. Mutations: tempo nested under plate turns H6.tempo red; a plateFact with no claim is red.
- S4-P The back box fails closed. This holds from Do 4 until Do 9 replaces it, and is required for merge under route (b):
  - the back-box module holds no box text;
  - none of the three whole field values of shared/back-pain-box.json's box (box.name.text, box.now.text and box.doctor.text), each matched exactly as one case-sensitive string, appears in any file under src/** or in the built bundle. Before writing this test, run `git grep -nF` for each value on origin/main's src/** and record the 0 hits in the PR (checked on 49a2853 on 2026-10-17: 0 hits for all three; lower-case "back pain" inside a sentence at src/howto/generated/ht-hanging-leg-raise.ts:429 is not a match). If a value already appears on main, stop and report; never narrow the match;
  - a lib5 scratch row with riskFlags ['back'] makes the generator throw the module's message, naming the id;
  - RiskJoint has no 'back';
  - a guard test: if the module holds box text, COACHING-DECISIONS.md must hold D-LIB5-BACKBOX, and the text must equal the box of a shared/back-pain-box.json whose status is not 'draft'.
  Mutations: the research draft text pasted into the module with no decision recorded; the throw removed (the scratch row then generates); the doctor value added as a string under src/.
- S4 (Do 9) The back box is exact and inside the 30-word reach:
  - RED_FLAG_BACK equals the named head's box text, byte for byte;
  - it is at most 30 words by c7's words(), against c7's LIMITS.redFlagBoxWords and golden B's RED_FLAG_BOX_MAX_WORDS, both imported unchanged; an equality test shows both are 30;
  - 'now' says 'today' and 'doctor' says 'doctor';
  - "Get emergency help now." appears at most once, and only as D-LR23-1 allows;
  - there is no CONTACT_RE, SOURCE_RE, SOURCE_CS_RE or SAFETY_LINE_RE hit;
  - the claim sources include nhs-back, and C19 is clean;
  - every trigger the answered text keeps is pinned in the library lint, so losing one is red.
  Mutations: a 31-word back box; 'Call 999'; 'today' removed; one kept trigger removed; nhs-back removed.
- S5 (Do 9) The app renders the box and the 8 are unchanged:
  - renderRisks emits <pre>-redflag-back for a lib5 fixture row;
  - the HT-9 block, L3 and golden B are at 0 px;
  - budgets.test is unedited and green, and the HowToSheet chunk is within its existing budget.
  Mutations: the map entry removed turns typecheck red; the wrong block is red.
- S6 The shared modules equal their card fields, and their refs resolve. Mutations: one string drifted; one ref broken.
- S7 Library lint (content.md 4):
  - its rules: medical-claim bans, the variant line, FIX_VERBS closed, family consistency, and RED_FLAG_ROWS per stamped id;
  - golden B's constants are imported unchanged (equality test);
  - a test asserts that every red-flag box limit under tools/plates/library/lint/** is the imported 30;
  - the 8 pass, exempt by name only where the supervisor rules it.
  Mutations: one fixture per rule; a scratch row containing 'treats' makes the generator throw; a second box limit of 50 added under lint/**.
- S8 C15 is strict:
  - reviews.json holds the 8's approved stamps, and checkC15 returns [] for every shipped row;
  - a button is written only for stamped rows, and an unstamped shipped row makes the generator throw;
  - a test fails if the committed reviews.json holds a scratch entry.
  Mutations: one character of one of the 8's content changed; a stamp deleted; a committed scratch entry.
- S9 The source registry is consistent: the same id means the same URL in sources.json, and no URL is in src (C17, C19). Mutation: a duplicate id with a different URL.
- S10 The 8 are byte-identical: L1, L2, L3, L2-A3, HT5-A5, and the golden A and B checks. Run before and after Do 3 b, and before and after Do 9.
- S11 No regression: `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` and ht10-gate, on the final merged head.
- S12 The 8's machine cards (Do 3 b):
  - each card and quotes file equals its pinned blob sha256, and each card differs from its research-head copy only in plateFacts, tempo and topFault;
  - every value names a claim whose verbatim quote is in its quotes file, and S2's validator passes;
  - the supervisor's 'CARD FIELDS VERIFIED @ <sha>' names a sha whose 8 card files equal the head's;
  - with those entries removed, H6 returns no problem for each id that lost 'H6:no-card', F7 is not raised for each id that lost 'F7', library-qa.test.ts (:53, no unused exemption) and selftest.mjs are green, and envelope.json and every pin are unchanged.
  Nothing is loosened: no tolerance, check or test changes, and every other exemption stays.
  Mutations: plateFacts deleted from one of the 7 cards with a spec turns H6 red (H6:no-card); tempo deleted turns H6.tempo red; topFault set to another key raises F7; a removed exemption restored turns library-qa.test.ts:53 red; one byte of one card changed turns the pin red; the clone inputs' `research: null, mistakeFault: null` removed turns the clone test red.

verification: the PR body maps each S row to a test or run. Before READY, merge origin/main and run S11 on that exact head. Under route (b), S4 and S5 run in the Do 9 PR.

risk_and_recovery:
- The HowToSheet chunk goes over its budget (Do 2 measurement or S5): stop and report. Never raise a budget.
- A new ban hits approved golden-B copy: name it. A by-name exemption needs a supervisor ruling, and the rule is never weakened.
- The note finds a box placement outside the 30-word reach: choose one inside it. If none exists, stop at the note.
- The owner's answer cannot pass the existing checks unedited (option 1's 50 words do not): stop Do 9 and report (Do 9, first bullet). Do 9 then waits for the cap card and lands under route (b).
- By the merge slot no answer is recorded, or the answer needs the cap card and that card has not merged: merge under route (b).
- A value of the 8 has no verified quote on the named head: do not write it, and report it on the PR. That id keeps its exemptions; the supervisor routes the research.
- A verified fact of the 8 misses its approved plate (outside H6's ±2° or ±1 cm, a tempo array not equal to the spec's, or a topFault not equal to the plate's Mistake key): stop and report for that id. Never change the fact, the plate, the spec or a tolerance; that id keeps its exemptions until the supervisor rules.
- LIB-2b changes in its delta: re-merge it and re-run S3, S8 and S11.
- The research head changes after Do 2 (wave 2): re-copy once, re-pin S1, and re-run S2 and S6.
- The stamp gate is red on a fixture, on a head that holds both cards: LIB-5 owns the fix. If no fix works without loosening a check, stop and report.
- Two failed tries of one approach: stop and report.
- CI load: pushes follow CI manners. A supervisor request is the only extra push.

return:
- PR number and head sha;
- the design-note comment id;
- HowToSheet sizes;
- the 8's stamp table;
- the 8's machine-card table: id, card blob sha256, exemptions removed, and the verifier comment id; or, under the fallback, the claude/lib-5-cards-8 PR number and head;
- the mutation list;
- the back-box state: placeholder, or Do 9 built, with the supervisor comment id;
- check, test:tz and gate output on the final head.

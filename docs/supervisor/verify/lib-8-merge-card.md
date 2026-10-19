Card LIB-8M: pilot A from "drawn and fixed" to "merged on main, pinned" (the LIB-8 merge card: pilot A review gaps 1, 2 and 4; LIB-5 review Low 2; the LIB-8-FIX review Low; research rulings R-LB2-2, -6, -7 and -13 to -15; 2026-10-18)

Heads read: main 2078913c; #109 200f8c33 (LIB-8-FIX review PASS 6254908274, recorded and frozen 6254916840); claude/sup-lib4-cards be4b18f1 and 95928e1f (no cited line differs); HANDOVER claude/sup-handover-1445 0b90d09c; plan claude/howto-options 6550ce28; research #263 0b49ea00, 2b6747f8, e777388d ("PILOT-A TOPRANK READY", 6255143725; rulings R-LB2-13 to -15, 6255152478) and 2fad80ce ("LB2-RESEARCH FIXED", 6255337111; R-LB2-16 on single_leg_romanian_deadlift, 6255377801); LIB-4c #246 68f15560; LIB-5 #244 1d1fe9ea; LIB-3c #264 acad3acd; LIB-10 #265 2ca7b351. The rulings this card relies on are lib-8-merge-rulings.md (D-LIB8M-*), posted by the supervisor before the step that needs each.
<RESEARCH_HEAD> = the merged claude/libht-research head that the supervisor names on #109 after the last LR-29 verify that covers single_leg_romanian_deadlift. Two verifies feed it: the run on 2fad80ce (the 12 LB2 cards, the 7 pilot A cards of e777388d and the 7 R-LB2-9 cards), and the next run, which covers "SLRDL FIXED" (R-LB2-16, 6255377801). #263 is merged into claude/libht-research after them. All 14 pinned cards are copied from that one head.

id: LIB-8M
model: claude-opus-5-5 (not mechanical: five Mistake redraws, the chain rule, the QA re-check and the pin)
mode: auto
title: 'Builder: LIB-8M pilot A merge (pin chain, QA re-check, research redraws)'
branch: claude/lib-8-pilot-a (existing, PR #109). This card continues the branch from the head LIB-8-FIX's review passed, 200f8c33 (6254908274; frozen until this card starts, 6254916840). Merge commits only. Never rebase, amend or force-push. Run `git pull --no-rebase` before each push. If the branch moves without your push, stop and report. The only exception is a supervisor commit that was announced on #109 first.

Stops (these override every other line):
1. Lane slot (D-LIB-LANE-ACTIVE, lib4-cards.md:1023-1043, amended at :1421-1426).
   - Start only on 'LIB-8M start', sent to your session and on #109 with the active count. A merge, a CI result, a PR event or your own timer never starts or resumes you.
   - You are WAITING (no slot, no new work, no push) whenever every permitted step waits on a ruling, a research head, the critic, the owner or a review. Only 'LIB-8M resume' resumes you.
   - If the supervisor says park, stop at your next local commit and push nothing.
2. Drawings move only where this card names them:
   - the Mistake of the redraw ids: the five in D-LIB8M-SCOPE, and single_leg_romanian_deadlift when D-LIB8M-SLRDL makes it a sixth;
   - barbell_overhead_press's tempo (R-LB2-6);
   - an id the supervisor sends back under D-LIB8M-CARDTRUE.
   For every other pinned id, its 9 fragment shas must equal the D-LIB8M-CARRY baseline. If one moves, stop and report. Never move a spec value off its verified card to pass a check, and never move a card value to match a spec (LR-33; D-LIB8-shrug and Q-D5-3, lib4-cards.md:1602, :1610-1611 and :1849).
3. No hard check is exempted, ever. Only flags get named exemptions:
   - F5 follows D-LIB9-F5 exactly (lib4-cards.md:3016-3024; the supervisor's, under the owner's delegation);
   - every other raised flag needs the owner's named exemption (D-LIB8FIX-ENV, lib4-cards.md:1430; D-LIB8M-QA).
4. A step that needs a missing ruling is never guessed. Do any other permitted step, and post a question on #109 when a step is not spelled out.

CI manners (D-LIB-CIMANNERS, lib4-cards.md:1007-1022; the GATE-SPLIT train has merged, so only this applies):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci]. Gather local commits into the allowed pushes.
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Run any job that may last over 1 hour as a detached process: `setsid nohup <cmd> > <log> 2>&1 &`, then poll its log. That covers the local gate, the Do 9 QA run with the browser half, and the pilot A page and sheet builds. A tool background job stops at about 2 hours. A stopped or killed run (container restart, session limit, timeout) is never evidence: re-run it whole on the same head.
- Never write to the owner. The supervisor sends him the sheet and the APK.

base: claude/lib-8-pilot-a @ 200f8c33. Your first commit merges origin/main with a merge commit. By slot 7 main holds everything merge_prerequisites lists; build_prerequisites names the steps that need each. Merge origin/main again before READY.

depends_on:
- plan 7 row 7 (:764): LIB-3, LIB-4;
- LIB-8-FIX's PASS (6254908274);
- research #263 verified and merged at <RESEARCH_HEAD>.

build_prerequisites (posted on #109. If one is missing when you reach its step, do another permitted step; set WAITING only when none is left):
- To start: 'LIB-8M start' with the active count, D-LIB8M-CHAIN and D-LIB8M-GENERATED.
- Do 3: LIB-5 #244 and BOX-CAP #260 on main and merged in; D-LIB8M-O5GATE.
- Do 4: D-LIB8M-NOSTRIP, D-LIB8M-PAGESET, D-LIB8M-CARDS and D-LIB8M-CARRY. Do 4's card copy also needs <RESEARCH_HEAD>; the held lines and the baseline do not.
- Do 5 (note): <RESEARCH_HEAD>; D-LIB8M-SCOPE, D-LIB8M-TEMPO and D-LIB8M-SLRDL.
- Do 6 onward (redraws, card keys, rows): 'LIB-8M NOTE RULED' on #109.
- Do 7 (card keys): two posts on #109, then the verifier.
  - 'PILOT A TOPFAULT @ <RESEARCH_HEAD>, plate head <Do 6 sha>': one answer per pinned id from D-LIB5-TOPFAULT's blind pass (lib4-cards.md:2384-2409; D-LIB10-PA :3169), read on the redrawn tells. For single_leg_romanian_deadlift, the key D-LIB8M-SLRDL rules.
  - Then 'PILOT A CARD FIELDS VERIFIED @ <sha>' before any QA evidence counts.
- Do 8: D-LIB8M-PAGES.
- Do 9 (gap 4 QA as evidence): D-LIB9-AUTHORQA on main and merged in (lib4-cards.md:1123-1133; LIB-3c #264 or its first two commits, D-LIB8M-ORDER); D-LIB8M-QA and D-LIB8M-CARDTRUE.
- Do 10: the supervisor's calibrated critic run on the redraws (the five, plus SLRDL if D-LIB8M-SLRDL makes it a sixth; asked for right after Do 6), and the per-exercise approvals.
- Do 12 (sheet): D-LIB8M-SHEET.
- Do 13 (pin): 'PILOT A PIN GO @ <head>' (D-LIB8M-PIN). LIB-4c #246 with #249 on main and merged in: MANIFEST.json, agent-guard Rule 4 and the L1 rebuild. D-LIB8M-ENTRY.

merge_prerequisites (the supervisor merges #109 in a train):
- Checklist slot 7 (plan 7 :764; lib4-cards.md:1045). Every lower-numbered item has merged: 2b LIB-3b (done, train 27); 3a-3c LIB-4a/b/c with #249; 4 LIB-5 and the slot-4 items numbered below 7 (BOX-CAP, LIB-5's Do 9); 5 LIB-6 #181; 6 LIB-7 #193; LIB-4d #261 (lib-8-fix-card.md:31; registry.mjs:34-36 refuses lb-test.json's second lib_barbell_row at any stage); and LIB-3c or its AUTHORQA part, wherever the supervisor numbers it (D-LIB8M-ORDER).
- After it, in checklist order: slot 7a LIB-5v (HANDOVER:852), then slot 8 LB1. LIB-9 merges "only when ... LIB-2..LIB-8 have merged" (lib-9a-card.md:27-28).
- A fresh Opus review PASS against this card, on the merge delta (200f8c33..READY head) and on that exact head.
- Every check green on a head that contains the latest main. That includes the library family in gate-verdict on a full run, which is red when "the rebuild proof does not cover every pinned page in tests/howto/golden/library/*.json exactly once and passing" (D-LIB4-VERDICT). Only `library: full` counts (D-LIB4-MODE), so the train head's run is the evidence.
- 'PILOT A PIN GO' on #109, and a pin commit equal to it.
- The app after the merge (D-LIB8M-GENERATED):
  - Nothing changes on screen. The 8 How-tos are unchanged. The 14 pinned exercises still show no How-to entry: stage 'approved-plate', status 'pending', no button (plan 6.1 :664).
  - src/howto/coverage.ts changes those 14 stage values only. No app file imports it; only tests do: tests/howto/content.test.ts:9, content-gen.test.ts:10, library-core.test.ts:338 (L2-A13, which accepts the new stages), checks/c6.ts:2 and fixtures/bad/c6-missing-id.ts:2.
  - ids.ts, loaders.ts, ids-node.mjs and the 10 plates-plugin outputs change line 1 (the generated header) only.
  - The supervisor sends the train's APK to the owner after the merge, with what changed (nothing visible) and what to check (the 8 How-tos open as before).

hard card: yes. The design note (Do 5) comes before any redraw, card key or row.

design_reference:
- DRAWING-GUIDE.md on #109;
- the approved pilot A plates at 200f8c33;
- the plan 3.4 rubric;
- each redraw's new plate.mistake at <RESEARCH_HEAD>;
- for an arch Mistake (incline_dumbbell_press; the pushdowns' arch), pilot A's approved arch method: the e6f39ff dumbbell_shoulder_press Mistake, a red line on the body with a gap mark (lib4-cards section 13, "shoulder_press: ACCEPT").

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency. Pilot A ships no button.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- lib-8-fix-card.md; the LIB-8-FIX PR body; review 6254908274 and supervisor 6254916840.
- PR comments:
  - #109: review 6243689943 (gaps 1, 2, 4, 5), routing 6243704774, D-LIB8FIX-IMPORTS 6252484092;
  - #244: review 6250675090 (Low 2);
  - #263: 6254759691, 6254726792, 6254778986, 6254919176, 6255123603, 6255143725, 6255152478, 6255337111, 6255377801 (R-LB2-16).
- lib4-cards.md:
  - section 12 items 1, 2 and 9;
  - 13 Q1 (:1251-1268) and Q3 (:1293-1335);
  - 13 amendments 20-22 (:1414-1433);
  - 13.2 (:1465-1471);
  - 14 OPEN-3 (:2384-2409), 14.4 (:3016-3024), 14.7 (:3038-3077) and 14.8 (:3078-3104);
  - D-LIB2b-PAGES (1)-(3) (:714-716);
  - D-LIB4c-1 (:1072-1096);
  - 15 D-LIB10-PA (:3166-3172) and D-LIB10-ANCHORS (:3187).
- Plan, 6550ce28: 3.3 (:291-303), 3.5 (:332-372), 2.3 (:180-183), 6.1 (:632-664), 6.2's LB1 row (:670), 6.3 (:728-746), 7 (:764-765), 8 decisions 3, 4 and 9 (:815-827). LIB-2-DESIGN.md on main: 6.2 and section 8 ("Pilot A is not proven in LIB-2").
- Main:
  - tools/plates/golden.mjs:108-189;
  - tools/plates/gen/plates.mjs:21-25, :118 and :170-179;
  - tools/plates/gen/ids.mjs:89, :117-130 and :156;
  - tools/plates/lib/inputs.mjs:15 and :31;
  - registry.mjs (all), batch-golden.mjs (all), candidate.mjs (all), plates-page.mjs:17-44, layers-spec.mjs:48-49;
  - qa/index.mjs:55-58, qa/node.mjs:92, :154-177 and :308-316, qa/browser.mjs:168, qa/exemptions.json:2;
  - vendor/artifact/build-page.mjs:174;
  - tests/howto/library-rows.test.ts:435-439.
- LIB-4c @ 68f15560: scripts/howto-rebuild.mjs:26-85 and tools/plates/library/ci/manifest.mjs:40-74.
- LIB-5 @ 1d1fe9ea: tools/plates/library/research/stamps.mjs:44-59 and tools/plates/gen/library-gate.mjs:28, :36 and :54.
- #109 @ 200f8c33:
  - pilot-a/build.mjs (:21-27, :47, :89-114, :135-148) and pilot-a/plates.json;
  - the five redraw specs, single_leg_romanian_deadlift.mjs (:162-183) and barbell_overhead_press.mjs (:52, :241-254);
  - tests/howto/lib8-pilot-a.test.ts and lib8-composers.test.ts.

outcome:
- Gap 2: verifyBatchChain accepts 'supervisor' exactly as D-LIB-O5 6(b)-(c) rules. GOLDEN.json stays 'owner' only.
- LIB-5 Low 2: the gate refuses a non-scratch stamp that is not 'supervisor', has no decision or approval, or has open ≠ 0.
- Five Mistake views redrawn from the updated research:
  - dumbbell_shoulder_press: lowering behind the head (c10);
  - incline_dumbbell_press: low back arching (c8);
  - dumbbell_biceps_curl: wrists bent (c6);
  - triceps_pushdown: leaning or arching (c11);
  - rope_triceps_pushdown: leaning or arching (c12).
  single_leg_romanian_deadlift's Mistake is a sixth redraw only if D-LIB8M-SLRDL makes it one. barbell_overhead_press's tempo gets Hold 1 s right after the press.
- Every pinned id's card holds plateFacts, tempo and topFault, verified blind.
- Gap 4: LIB-3's full runQa passes every hard check on every pinned id. Every raised flag is named: the owner names the non-F5 ones, and the supervisor's D-LIB9-F5 covers F5.
- Gap 1: 14 rows in tools/plates/library/batches/pilot-a.json (mode H, stage approved-plate, no button), the chain tests/howto/golden/library/pilot-a.json, and their rows in tools/plates/library/MANIFEST.json. CI rebuilds the pinned page on every full run (L1).
- Held, on the follow-up list, never exempted: barbell_shrug, dumbbell_fly, bent_over_dumbbell_rear_delt_fly, box_jump, reverse_lunge.
deliverable: commits on #109 (no new PR), the design note and tempo.json, the sheet (outside the repo), and the PR body evidence.
evidence: A1-A19 below, each on the exact head it ran on.
finish: #109 merged on main in slot 7, with the 14 ids pinned at stage approved-plate. You will notice: nothing in the app. The owner gets the pilot A sheet once before the pin, and the APK after the train.
forecast [est]: about 30-40 Opus-hours of building:
- chain, gate and docs move: 3-4 h;
- note, tempo.json and card keys: 5-6 h;
- five Mistake redraws and the OHP tempo: 8-12 h (the shoulder-press Mistake needed fix rounds before, HANDOVER:1393);
- rows, pages and tests: 3-4 h;
- QA, sheet and pin: 4-6 h.
Plus waits this card cannot forecast: the single LR-29 verify and #263's merge; LIB-3c's AUTHORQA part and LIB-4c on main; 1-2 critic rounds; the owner's flag answers (plan 6.3: 20-30 min of his time; the stalled-batch rule at :741 starts after 2 days); the slot-7 train.

Do:
1. On 'LIB-8M start': read this card, the posted rulings, #109 and its CI. Check that the head is 200f8c33; if not, stop and report. Subscribe to #109's activity. Merge origin/main (merge commit).
2. First non-merge commits, both in the first push:
   a. D-LIB8M-CHAIN in tools/plates/golden.mjs.
      - Regenerate with `node tools/plates/generate.mjs` in the same commit. golden.mjs is an input of every gen/plates.mjs output (gen/plates.mjs:23, :176): on main these are the 8 src/howto/generated/ht-*.ts, src/howto/generated/index.ts and src/slices/howto/css/plate.css.
      - Add tests/howto/lib8-chain.test.ts (A1). golden.test.ts and library-core.test.ts L2-A14 stay unedited.
   b. A separate commit fixes the LIB-8-FIX review Low (6254908274; supervisor 6254916840). It moves the D-LIB8FIX-6 bullet in docs/COACHING-DECISIONS.md (at :2470 on 200f8c33) to just after the LIB-8-FIX section's last bullet (:2455), and adds a blank line before '## LIB-3b' (:2456). No other byte changes (A19).
3. O5 gate (D-LIB8M-O5GATE; LIB-5 and BOX-CAP merged in): the check in stampProblems, and tests/howto/lib8-stamps.test.ts (A3). c15.ts and c15-stamps.test.ts stay unedited.
4. Before the first build:
   - Add `held` lines to pilot-a/plates.json for barbell_shrug (D-LIB8-shrug), box_jump and reverse_lunge (D-LIB8M-NOSTRIP; D-LIB8M-PAGESET). The page then holds the 14 ids to be pinned.
   - Cards (D-LIB8M-CARDS, needs <RESEARCH_HEAD>): copy each of the 14 cards and quotes files byte for byte into docs/research/howto/cards/ and quotes/. Delete pilot-a/cards/. Point build.mjs's CARDS (:23) and the :138 research line at docs/research/howto/cards and <RESEARCH_HEAD>, and set plates.json's `cards` field to match.
   - Build the page twice into a scratch folder outside the repo: `build({ out: <scratch> })`, never the CLI.
   - Record the page sha, and the carry table (A9's first run) against the D-LIB8M-CARRY baseline. Every one of the 14 ids must still match on all 9 fragments, since nothing has been redrawn yet. A fragment that moves here is a stop (Stops 2).
5. Design note: tools/plates/library/pilot-a/MERGE.md (the one pilot A merge document; DRAWING-GUIDE.md stays the drawing guide), plus tools/plates/library/pilot-a/tempo.json. They hold:
   a. the pinned set (14) and the held set (5, with each reason and its follow-up list entry);
   b. tempo.json, one row per pinned id: each phase ← up, down or pause, or {constant, claim, quote} (D-LIB8M-TEMPO). barbell_overhead_press: Press ← up 1, Hold ← pause 1, Lower ← down 2. plank and mountain_climbers: their ruled constant rows (c12, c13). A card s that differs from its spec s is a CARDTRUE item, never fixed on the card;
   c. plateFacts proposals per id (kind, joint or landmark, pose by the spec's pose name, deg or m, claim). 14.7 rules 10-15 and D-LIB9-FACTPOSE apply. Never a value read from a spec or a render;
   d. the redraw plan for each redraw id (the five, plus single_leg_romanian_deadlift if D-LIB8M-SLRDL makes it a sixth):
      - the new plate.mistake (what, claim, quote);
      - the Mistake change;
      - the tells (the first tell names the new fault);
      - how it reads in 2 s (R5);
      - what stays the same.
      If the engine cannot draw a new fault in the census view (for example the curl's bent wrist), say so here: that goes to research under R-LB2-4 (drawable false), never a forced drawing;
   e. the expected LIB-3 flag set per id, with the reason for each. For example: F1 on plank and mountain_climbers (D-LIB8-floor); F7 on single_leg_romanian_deadlift under D-LIB8M-SLRDL; F5 at exactly 3.57 (D-LIB9-F5);
   f. the batch rows, the `pages` object and the page config (Do 8), and how the registry rebuild equals build.mjs's page.
   Post 'LIB-8M NOTE READY @ <sha>' and wait for 'LIB-8M NOTE RULED'.
6. Redraws (after the note is ruled):
   - In each redraw spec (the five, and single_leg_romanian_deadlift.mjs when D-LIB8M-SLRDL makes it a sixth), change only the `mistake` object (pose, parts, guides, tells), the constants and helpers that only it uses, and the header comment lines that describe the Mistake. In barbell_overhead_press.mjs change only the tempo line (:241) and the :52 comment. Never edit eq/**.
   - Run lib8-composers and lib8-pilot-a unedited.
   - Build twice. Record the page sha and, per id, which of the 9 fragments moved. Expected [unverified until measured]: mistakeSvg, mistakeOverlay, cues, mistakeAlt and tells on the redraws; tempo only on OHP. If OHP moves any other fragment, it joins the critic set.
   - Every other pinned id still matches the baseline (A9).
   - Post 'PILOT A CRITIC READY @ <Do 6 sha>' at once for the redraws. The critic needs no card keys or QA. OHP is not in the critic set (D-LIB8M-CARRY).
7. Card keys (after 'PILOT A TOPFAULT'):
   - Replace each pinned card's final `\n}` with exactly `,\n  "plateFacts": …,\n  "tempo": …,\n  "topFault": …\n}`. The trailing newline after it stays. No other byte changes.
   - tempo is built only from tempo.json and plate.tempo. plateFacts are as ruled.
   - topFault is the posted blind answer, or D-LIB8M-SLRDL's key for single_leg_romanian_deadlift, citing plate.mistake.claim (or the named top fault's claim on a drawable:false card). Never read mistake.firstKey to choose it.
   - Post 'PILOT A CARD FIELDS READY @ <sha>' and wait for 'CARD FIELDS VERIFIED'. Fix only what the verifier names.
8. Rows and sources:
   - tools/plates/library/howto/lib_<id>.howto.mjs per pinned id, holding only `id` and `research.card` (D-LIB9a-HOWTOID, lib4-cards.md:1462).
   - tools/plates/library/batches/pilot-a.json:
     - batch 'PILOT-A';
     - censusRef: the census commit the note names; check that each view equals it;
     - the full `pages` object at D-LIB8M-PAGES's paths, without creating the two layers files;
     - one row per pinned id: src 'library/specs/<id>.mjs', slug, prefix, chromeId (<id> with hyphens, so cardIdOf gives back <id>, plates-page.mjs:15), mode 'H' (every pilot A plate was hand-drawn; candidate.mjs:60 throws for 'P'; D-LIB10-PA), view, `sources` (build.mjs's sourceLines of the card, read at plates-page.mjs:39), stage 'review'.
   - tools/plates/library/pages/pilot-a.json: build.mjs's groups and heading (:102-114), in build.mjs's order, with the ids written as registry ids lib_<id> (plates-page.mjs:32-33).
   - Run `node tools/plates/generate.mjs` (D-LIB8M-GENERATED): coverage.ts stages become 'review' for the 14; ids.ts, loaders.ts and ids-node.mjs change line 1 only.
   - Add tests/howto/lib8-pin.test.ts (A2b, A6, A7, A10, A11).
9. Gap 4 QA (D-LIB8M-QA), on the exact head, detached:
   - For each pinned id, run `runQa` on `candidateOf(id, { all, authoring: true })`, with the browser half, qa/envelope.json and zero exemptions.
   - Write the report as JSON into the scratch folder (never committed). Do 12 reads it.
   - Post the table. Per id: every hard check, pass or fail, with its problem keys; every flag with its value, range and raised; and F5's measured element by D-LIB8M-QA's method.
   - A hard-check failure is a stop for that id under D-LIB8M-CARDTRUE. Report it with the card claim and the drawn value, and never adjust a value or the card.
   - The raised flags must equal the note's expected set. Report any difference before any other step.
   - The supervisor may send the owner the flag questions as soon as this table is posted: the flagged plates do not change (A9).
10. Critic results: the supervisor posts per-exercise approvals naming the head. One fix round and one recheck (plan 3.4); a second fail goes to the supervisor, who may hold the id. A redraw in a fix round re-runs Do 9 for that id.
11. Carry proof (D-LIB8M-CARRY) on the sheet head: the A9 table for every pinned id that was not redrawn, all 9 fragments, and OHP's 8 non-tempo fragments.
12. Sheet (D-LIB8M-SHEET):
    - Change only build.mjs's sheet part, never the plates page. Each plate's aside lists LIB-3's flags from the Do 9 JSON (passed to build() as an option) as its only F-lines.
    - build.mjs's ENVELOPE results show as 'Page order: …'; they still set the order (D-LIB8FIX-ENV as amended).
    - The critic's scores replace 'critic scores: pending' (:148).
    - Hand renders (D-LIB8M-SHEET), after #193 is on main and merged in: render curl (dumbbell_biceps_curl), rope (rope_triceps_pushdown) and EZ (ez_bar_curl) with renderPair at 390 px in Silent Black and Paper, save them as pilot-a/evidence/lib7-<key>-silent-black.png and -paper.png, and add their `hands` entries to plates.json. Band gets one line with no render.
    - Build the sheet and the page twice into the scratch folder. The sheet prints the plates page sha.
    - Post 'PILOT A SHEET READY @ <head> (plates page <sha>, sheet <sha>)', with the per-plate flag list and the held list. WAITING. The supervisor publishes the private page and sends it to the owner.
13. Pin (after 'PILOT A PIN GO @ <head>'; D-LIB8M-PIN, -ENTRY, -PAGES, -PAGESET):
    - If the GO leaves out an id, hold it, rebuild the page and the sheet without it, and post 'PILOT A SHEET READY' again with both shas. Pin only after the supervisor's approval names the new page sha. A9 still holds for the rest.
    - Make one commit whose message carries `[golden update]`. It holds:
      - stages → 'approved-plate', then `node tools/plates/generate.mjs` (coverage.ts stages);
      - tests/howto/golden/library/pilot-a.json, as D-LIB8M-ENTRY sets out:
        - base = GOLDEN.json's last entry by prefix hash;
        - one 'page' entry;
        - one 'plate' entry per pinned id, with its 9 fragments and its exemptions exactly as the GO names them;
      - tools/plates/library/MANIFEST.json rows for the pinned ids (LIB-4c's C0 shape, D-LIB4c-1 (b), lib4-cards.md:1079-1089).
    - Then run the default path: `runQa` on `candidateOf(id)` (pinned exemptions) for every pinned id. ok must be true (A13).
14. Before READY:
    - Merge origin/main.
    - In a fresh worktree of that exact head (node_modules linked, no pilot-a/out/ on disk), run, detached where long:
      - `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`;
      - `node tools/plates/generate.mjs --check`;
      - LIB-4c's C0, and `node scripts/howto-rebuild.mjs --page tests/howto/golden/library/pilot-a.json page <scratch out>`;
      - the page build, twice.
    - Compare `npm run build`'s dist/ file hashes with main's build and record the result for the supervisor's APK message. This is a record, not a gate.
    - Re-run the collision check below.
    - Check the diff lists only write_scope paths: run `git merge-tree --write-tree origin/main 200f8c33`, then `git diff --stat <that tree> HEAD`.
    - Fill the PR body: A1-A19, every mutation with its red line, and the HANDOFF block.
    - Retitle '#109 LIB-8: pilot A (14 plates pinned) [ready for review: LIB-8M merge delta; merges in plan slot 7]', keep it a draft, and ask the supervisor for the review.

Owner's sheet (Do 12; the supervisor sends it):
- The supervisor approves each exercise under the owner's 10-01 delegation (14.8 point 5; HANDOVER:196). The owner monitors, and may flag any plate.
- He answers only one kind of item: each raised LIB-3 flag other than F5, per plate, by name (D-LIB8FIX-ENV; Q1 and OPEN-3 for the drawable-fault F7). Expected:
  - plank and mountain climbers are drawn larger than the 8, because the floor plates use the approved floor line (F1, D-LIB8-floor);
  - only under D-LIB8M-SLRDL branch (a): the single-leg Romanian deadlift's Mistake is not its top fault, because that fault cannot be drawn in this view (F7);
  - any other flag Do 9 raises.
  Each item shows plan 8 decision 9's default ("approve as named exemptions").
- A plate he flags before the pin is held.
- He also sees, for each of the 14:
  - the normal and Mistake drawings, beside the closest approved plate;
  - a Paper thumbnail;
  - the critic's scores.
  New on this sheet: the redrawn Mistakes (five, or six with SLRDL), and the overhead press's tempo strip with a 1 s hold at the top.
- Held, one line each: barbell_shrug, dumbbell_fly, bent_over_dumbbell_rear_delt_fly, box_jump and reverse_lunge. Plan 8 decision 3's airborne and small-motion-zoom conventions are therefore not judged on this sheet, and stay on the follow-up list. Under D-LIB8M-SLRDL branch (b), the drawable-fault convention is not judged here either. Decision 4's view conflicts (dumbbell_fly, rear-delt fly) stay held.
- The hand kinds follow D-LIB8M-SHEET.
- Offered, never forced (O7 family, lib4-cards 14.4 and 14.7): one later golden update for the tell contrast on every plate.
- Nothing changes in the app before the ship cards (plan 6.1 :664).

write_scope (exactly these):
- tools/plates/golden.mjs: verifyChain and verifyBatchChain only (D-LIB8M-CHAIN), in Do 2a.
- Generated files, written only by `node tools/plates/generate.mjs` and never by hand (D-LIB8M-GENERATED):
  - gen/plates.mjs's outputs (line 1): the 8 src/howto/generated/ht-*.ts, src/howto/generated/index.ts, src/slices/howto/css/plate.css;
  - gen/ids.mjs's outputs whose inputs list registryInputs(): src/howto/coverage.ts (the pinned ids' `stage` only: 'review' in Do 8, 'approved-plate' in the pin), and src/howto/ids.ts, src/howto/generated/loaders.ts and tools/plates/library/ids-node.mjs (line 1 only);
  - whatever else generate rewrites after a main merge, header only.
- tests/howto/lib8-chain.test.ts, lib8-stamps.test.ts and lib8-pin.test.ts (new).
- tools/plates/library/research/stamps.mjs: stampProblems only (D-LIB8M-O5GATE).
- Specs:
  - dumbbell_shoulder_press.mjs, incline_dumbbell_press.mjs, dumbbell_biceps_curl.mjs, triceps_pushdown.mjs and rope_triceps_pushdown.mjs: the `mistake` object (pose, parts, guides, tells), the constants and helpers that only it uses, and the header comment lines that describe the Mistake. Not the poses, callouts, measure, trace, checks, equipment or reclined();
  - single_leg_romanian_deadlift.mjs: the same `mistake` scope, only when D-LIB8M-SLRDL makes it a sixth redraw;
  - barbell_overhead_press.mjs: the tempo line (:241) and the :52 comment;
  - any other spec only when the supervisor names it under D-LIB8M-CARDTRUE, in that ruling's scope.
- docs/research/howto/cards/<id>.json and quotes/<id>.json for the 14: byte copies from <RESEARCH_HEAD>, plus the inserted three-key block on the cards. The supervisor merges the field commit back into claude/libht-research.
- tools/plates/library/pilot-a/:
  - cards/** deleted;
  - build.mjs: the CARDS path (:23), the :138 research line and the sheet part (Do 12) only. ENVELOPE (:25-27) and the plates-page code stay;
  - plates.json: `held` lines for barbell_shrug, box_jump, reverse_lunge and any id the GO or CARDTRUE leaves out; the `cards` field; `hands` as D-LIB8M-SHEET names;
  - MERGE.md and tempo.json (new);
  - evidence/lib7-curl-, lib7-rope- and lib7-ez-silent-black.png and -paper.png (6 new files, Do 12). Nothing else under evidence/.
- New files: tools/plates/library/howto/lib_<id>.howto.mjs (14), tools/plates/library/batches/pilot-a.json, tools/plates/library/pages/pilot-a.json.
- In the pin commit only, tagged [golden update]: tests/howto/golden/library/pilot-a.json and tools/plates/library/MANIFEST.json (pilot A rows).
- docs/COACHING-DECISIONS.md: Do 2b's move, and appends of the D-LIB8M-* entries as built.
- #109's body and title.

reserved_paths (read only; everything outside write_scope is reserved, in particular):
- In tools/plates/library/:
  - registry.mjs: byte-identical, because it is an input of every generated file (lib4-cards 15 (i) item 7);
  - candidate.mjs, plates-page.mjs, batch-golden.mjs, layers-spec.mjs, derive.mjs, engine.mjs, inputs-closure.mjs;
  - build-page.mjs: its :6 stale comment stays (lib-8-fix-card.md:64);
  - qa/** (envelope.json, exemptions.json and approved.mjs included);
  - eq/**: pilot A's composers, tested by LIB-8-FIX.
- Every spec not named above; pilot-a/evidence/** except the 6 lib7-* files; report.mjs; tools/plates/vendor/**; tools/plates/layers/**.
- LIB-4c's files: scripts/howto-rebuild.mjs and tools/plates/library/ci/**. No code change: D-LIB8M-PAGES.
- Golden files and fixtures: tests/howto/golden/GOLDEN.json and every other file under tests/howto/golden/**. The two pilot A layers files are not created. tests/howto/fixtures/**.
- Tests that stay unedited: tests/howto/golden.test.ts, library-core.test.ts, library-rows.test.ts, library-qa*.test.ts, generate.test.ts, content.test.ts, content-gen.test.ts, c15-stamps.test.ts, lib8-pilot-a.test.ts and lib8-composers.test.ts. If a redraw makes one red, stop and report.
- The generator core: tools/plates/generate.mjs and tools/plates/lib/**.
- Research cards and quotes of every id this card does not pin; claude/libht-research itself.
- AGENTS.md file ownership:
  - .github/**, scripts/prepare-android.sh and native/patch_manifest.py: supervisor, add-only;
  - package.json and package-lock.json: supervisor, no new dependency;
  - src/core/models.ts, src/core/store.ts and migrations: owner approves; untouched;
  - scripts/screenshot-gate.mjs and tests/theme.test.ts: shared add-only; no block added;
  - src/ui/styles.css;
  - src/app/App.tsx and src/main.tsx: supervisor;
  - native/wear/**, src/native/wearEngine.ts, src/slices/settings/WatchLab.tsx and the Watch-lab row: watch agent;
  - escobar-worker/**: owner deploys.
  src/** is touched only by the repo generator: headers in Do 2; coverage.ts stages and headers in Do 8 and in the pin.

Out of scope (each with the reason):
- The pilot A ids' layers, app modules, buttons and C15 stamps belong to the ship cards (plan 6.1 :664; D-LIB10-PA). So this chain has no layers-page entry and no card stamp hash.
- The templates (BENCH, SEATPRESS) are LIB-10's, after this merge (D-LIB10-TEMPLATES).
- The five held drawings and the no-seconds tempo-strip design are on the follow-up list (D-LIB8M-NOSTRIP, D-LIB8M-PAGESET).
- The unchecked bisections in specs with fixed inputs (lib-8-fix-card.md:143) are listed again in the PR for a later card. Their outputs sit inside approved bytes.
- build-page.mjs:6's stale comment: an edit would move an input of every pinned page and of the 8's ht- files, with no change in behaviour.
- The LB1 held-plate research check (HANDOVER:1032) is superseded by the owner's 16:10-16:20 answers (HANDOVER 19:00 update).

Acceptance (each row gives its evidence, then the mutations that turn it red. Every mutation is temporary: shown red, restored, and listed in the PR):
- A1 (gap 2; D-LIB8M-CHAIN) lib8-chain.test.ts.
  Allowed and green:
  - GOLDEN.json entries: 'owner' only;
  - batch files: 'supervisor' on an entry with supersedes null of kind plate or page, or on a layers-page entry with supersedes null or superseding a 'supervisor' entry, in each case with a non-empty decision and an approval in the ruled form.
  Red (14.8 6(c)):
  - 'supervisor' in GOLDEN.json;
  - 'stamps (O5)';
  - 'supervisor' on a superseding plate entry;
  - 'supervisor' superseding an 'owner' layers-page entry;
  - a 'supervisor' entry with no decision, or no approval;
  - a malformed approval.
  golden.test.ts (:110-130) and library-core.test.ts L2-A14 (:209-234) pass unedited.
  Mutations, each red:
  - the GOLDEN path given the batch rule → its 'supervisor' case;
  - the decision check removed;
  - the approval check, or its form check, removed;
  - the supersedes-null condition removed → the superseding-plate case;
  - the layers-page owner check removed.
- A2 (Do 2 headers) `node tools/plates/generate.mjs --check` exits 0 on Do 2a's commit. `git diff <parent> <commit> -- src/` shows only line 1 of each changed file. Mutation: one regenerated file reverted → generate --check red, naming it.
- A2b (Do 8 and the pin) generate --check exits 0 after each. `git diff <parent> <commit> -- src/ tools/plates/library/ids-node.mjs` shows only line 1 of each file, plus the 14 pinned ids' stage lines in coverage.ts. Mutation: coverage.ts reverted → generate --check red, naming it.
- A3 (D-LIB8M-O5GATE) lib8-stamps.test.ts: stampProblems refuses a non-scratch entry whose approvedBy is not 'supervisor' (red cases: 'owner', 'stamps (O5)', missing), or whose decision or approval is empty, or whose open is not 0. A scratch entry in a marked root behaves as before. c15-stamps.test.ts passes unedited.
  Mutations, each red:
  - 'owner' accepted;
  - 'stamps (O5)' accepted;
  - the approval check removed;
  - open: 1 accepted;
  - the new check applied to scratch entries → LIB-5's scratch cases red (this shows scratch is untouched).
- A4 (the redraws) Each draws its card's plate.mistake at <RESEARCH_HEAD>. Its first Mistake tell key equals the posted blind topFault (for SLRDL, plate.mistake's fault). F7 is not raised, except on SLRDL under D-LIB8M-SLRDL branch (a), and every hard check passes (A8). The critic's approval names the head. Mutation: one id's first tell key swapped back to its old key (shoulder press 'arch', incline press 'tilt', and the curl's and pushdowns' old first keys as recorded in the note) → F7 raised in the authoring run. If SLRDL is redrawn: its first tell set back to 'round' → F7 raised (branch (b)), or A4's first-tell assertion red (branch (a)).
- A5 (R-LB2-6) barbell_overhead_press's spec.tempo deep-equals the card tempo built from tempo.json: Press 1, Hold 1, Lower 2.
  Mutations, each red:
  - the Hold removed from the spec → H6.tempo red;
  - Hold s set to 0.5 → H6.tempo red;
  - a Rest added → H6.tempo red.
- A6 (card copies; R-LB2-2) lib8-pin.test.ts: each pinned card's text, with the inserted three-key block replaced by `\n}`, equals <RESEARCH_HEAD>'s blob, its git hash pinned in the test. Each quotes file equals its blob. barbell_overhead_press's handlingMistakes[0].claim is 'c5'.
  Mutations, each red:
  - one byte changed outside the block;
  - the new handlingMistakes[0] removed.
- A7 (card keys and the tempo map) Each pinned card has exactly the three keys added, in the D-LIB9-CARDFIELDS shape, with one form per fact (14.7 rule 15). topFault equals the TOPFAULT answer, or D-LIB8M-SLRDL's key. lib8-pin.test.ts reads tempo.json: each card's tempo is built only from tempo.json and plate.tempo, and deep-equals both the card's tempo and the spec's. 'CARD FIELDS VERIFIED @ <sha>' covers this exact card set.
  Mutations, each red:
  - Q1 (1): one spec's first tell key changed → F7 red;
  - Q1 (2): a test copy of one card set drawable:false with topFault equal to the drawn key → the verifier fixture red (lib4-cards.md:1258);
  - a tempo.json row given a constant with no claim → lib8-pin red;
  - one tempo second changed → lib8-pin red.
- A8 (gap 4) The Do 9 table, on the exact head: every hard check passes on every pinned id (node and browser halves, LIB-3's envelope.json, zero exemptions), and the raised flags equal the note's expected set. Mutation: one plateFact moved 3° in a test copy, never committed → H6 red.
- A9 (D-LIB8M-CARRY)
  - The baseline is extractPlates on blob d774614a with the card-box-jump and card-reverse-lunge `<article …>…</article>\n` spans removed. The test asserts exactly 15 cards remain.
  - Every pinned id that was not redrawn matches the baseline on all 9 fragments. OHP matches on its 8 non-tempo fragments.
  Mutations, each red:
  - one byte in an unredrawn spec's callout text → that id's row red;
  - a third article removed from the baseline → the count assertion red.
- A10 ("pilot A page through the registry = pinned sha", LIB-2-DESIGN section 8) lib8-pin.test.ts: buildPlatesPage(await pageConfig('tools/plates/library/pages/pilot-a.json')) equals the pinned page entry's sha and bytes, and two builds are equal.
  Mutations, each red:
  - two ids swapped in the page config;
  - one sources line changed in a batch row.
- A11 (rows, pages and held ids)
  - batches/pilot-a.json holds exactly the 14 ids, each once (counted in the raw text): mode 'H', the census view, stage 'review' before the pin and 'approved-plate' after it.
  - Its `pages` object equals D-LIB8M-PAGES's three paths. Neither layers path exists, and pilot-a.json has no 'layers-page' entry.
  - The five held ids appear in no batches/ or golden file (whole-token match).
  Mutations, each red:
  - a box_jump row added;
  - one row's mode set to 'P' (candidateOf also throws, candidate.mjs:60);
  - a duplicate row;
  - a 'layers-page' entry appended → libraryGoldenProblems red ('pinned but missing') and L1 red.
- A12 (chain)
  - verifyBatchChain(pilot-a.json, GOLDEN entries) is [].
  - base names GOLDEN.json's last entry by prefix hash.
  - The page entry's sha equals the sha printed on the last sheet.
  - Each plate entry's fragments equal fragmentsOf of the rebuilt page.
  - approvedBy, decision, approval, date and why are as D-LIB8M-ENTRY sets out.
  - Each id's exemptions equal the GO's list for it, exactly.
  Mutations, each red:
  - an exemption the GO does not name added;
  - one fragment byte edited;
  - the approval removed.
- A13 (after the pin)
  - runQa on the default path (candidateOf(id), pinned exemptions) gives ok true for every pinned id.
  - For every pinned id whose entry names F5, flags.F5.value is exactly 3.57 (D-LIB9-F5), and the element recorded in Do 9 is the selected Mistake tell.
  Mutations, each red:
  - the candidate's exemptions set to [] for a flagged id → ok false. (Applied to the candidate, not to the committed entry, whose edit would break `prev`.)
  - one plate's tell chrome at 3.40 → the F5 value assertion, with the exemption still in place.
- A14 (L0-lib) LIB-4c's C0 is green with pilot A's MANIFEST rows. The pin commit's message carries [golden update] (agent-guard Rule 4).
  Mutations, each red (D-LIB4c-1 (b)):
  - one byte in a pinned spec → C0;
  - one byte in pages/pilot-a.json → C0 and L1;
  - a missing row → C0.
- A15 (L1) howto-rebuild proves pilot-a.json's page once, and passing: locally (Do 14) and on the train head's full run. Mutation, on a scratch ref the supervisor pushes: one geometry constant in eq/inclineBench.mjs (for example a pad thickness) → L1 red for pilot-a.json.
- A16 (existing tests) lib8-composers.test.ts, lib8-pilot-a.test.ts, the per-spec import tests, content.test.ts and content-gen.test.ts (C6) all pass unedited.
- A17 (no loosening, scope) No existing assertion, timeout, envelope, bracket or exemption file changes. The Do 14 diff lists only write_scope paths. npm run check, test:tz (both zones), the gate and generate --check are green on the READY head.
- A18 (owner) The PR body links 'PILOT A PIN GO', and the pinned ids and exemptions equal it.
- A19 (the LIB-8-FIX Low) `git diff <parent> <Do 2b commit> -- docs/COACHING-DECISIONS.md` shows only the moved bullet and one added blank line. Mutation: a second line edited → the diff check fails (PR evidence, not a vitest row).

verification: the PR body maps A1-A19 to tests or runs, with commands and outputs, each on its exact head. It lists every mutation with its red line. A run that was stopped or killed is marked so and never counted.

risk_and_recovery:
- Approvals and page bytes: the redraws, the OHP tempo, the refreshed sources lines and the held ids all move the page. D-LIB8M-CARRY carries the untouched approvals by fragment identity. The redraws (five, or six with SLRDL) get a fresh critic run.
- SLRDL depends on research (R-LB2-16): its verified head decides D-LIB8M-SLRDL's branch and whether it is a sixth redraw. Branch (b) also needs the supervisor's plan docs amendments (3.1:85, :155, 3.3:303, 6.1:646); the builder never edits the plan.
- The redraws may fail the critic (the shoulder-press Mistake needed fix rounds: HANDOVER:1393). There is one fix round and one recheck; a second fail goes to the supervisor, who may hold the id. LB2 reuses the shoulder press and the incline press (D-LIB10-PA): a held id changes LIB-10's note, so report it on #109 at once.
- A fault the engine cannot draw in the census view: report it in the note (Do 5 d). Research decides drawable under R-LB2-4. Never force a drawing.
- A plateFact or tempo that disagrees with the drawn plate follows D-LIB8M-CARDTRUE. If the id is romanian_deadlift, barbell_row or dumbbell_bench_press, LIB-9a's straight_arm_pulldown and inverted_row re-plan (lib4-cards.md:1471): report it on #109 and #245.
- barbell_overhead_press is LB2's hidden critic anchor (D-LIB10-ANCHORS, lib4-cards.md:3187). Its approving head becomes the head of the supervisor's Do 11 approval. Report that head on #109 for LIB-10.
- Generated files: the golden.mjs edit and the batch rows rewrite generated headers, and coverage.ts stages. An open PR that regenerates must regenerate after merging main. Today only #209 (rehearsal) and #257 (LIB-4c scratch) touch them, and neither merges.
- COACHING-DECISIONS.md is appended by many open PRs (collision table). Do 2b moves a bullet near the end of the file. Keep both sides on every main merge.
- pilot-a/out/ on local disk slows HT2-A2 (lib-8-fix-card.md:138). Build only into a scratch folder outside the repo, and take test evidence in a clean worktree.
- Batch file order: registry.mjs:3 says batch files are named in checklist order, and pilot-a.json sorts after lb*.json names. This card ships no row. The ship cards confirm the order before shipping [unverified: whether any reader depends on file order beyond row order].
- The owner flags a plate or answers late. A flagged plate is held. The stalled-batch rule (plan 6.3 :741) applies only after 2 days (D-LIB8M-ORDER), and LB1 waits for #109 until then.
- The 13 MB of out/ blobs stay in history. Never rewrite it.
- Two failed tries of one approach: stop and report.

return:
- #109's head sha and the merge commits' shas;
- Do 2a's and 2b's shas, A1's red lines, generate --check output and the header-only diffs;
- the note sha and its ruling; tempo.json's sha;
- the page shas after Do 4, Do 6 and the pin, with the A9 table each time;
- the Do 9 QA table (path of the JSON), the CARD FIELDS VERIFIED head and the TOPFAULT answers used;
- the critic approvals (comment ids and head);
- the sheet sha, the plates page sha printed on it, and the PIN GO comment id;
- the pin commit sha, verifyBatchChain [], A13's ok table, C0 and L1 output;
- check, test:tz, gate and generate --check on the READY head, and the dist/ comparison;
- every mutation with its red line.

Collision check (card time, 2026-10-18 ~21:15 UTC). For all 30 open PRs: `git diff --name-only $(git merge-base origin/main <head>) <head>` over every write_scope path, including the generated files and COACHING-DECISIONS.md.
| Path in write_scope | Open PRs that touch it | Effect |
|---|---|---|
| tools/plates/golden.mjs | #190 (do-not-merge spike) | none |
| research/stamps.mjs | #244 LIB-5 (creates it), #260 BOX-CAP (built on LIB-5) | both merge before slot 7; Do 3 edits after they land |
| scripts/howto-rebuild.mjs, ci/manifest.mjs, MANIFEST.json | #246 LIB-4c (creates them), #249 its wiring, #257 scratch (never merges) | read only here, except MANIFEST.json rows in the pin, after LIB-4c lands |
| specs/ | #109 itself; #190; #245 (13 LB1 specs); #265 LIB-10 @ 2ca7b351 (decline_bench_press, skull_crusher) | new files of other ids; none |
| howto/, cards/, quotes/ | #245 (14 LB1 ids), #265 (7 LB2 ids), #244 (the 8 and shared), #260, #257 scratch; #259 and #263 are research branches (base claude/libht-research) | no pilot A id in any of them (checked by id) |
| src/howto/generated/*, coverage.ts, ids.ts, ids-node.mjs, plate.css | #209 (rehearsal), #257 (scratch) | neither merges |
| batches/, pages/, tests/howto/golden/library/ | #257 (scratch zz-lib4b) | never merges |
| docs/COACHING-DECISIONS.md | appended by #92, #181, #188, #191, #193, #232, #244, #246, #249, #257, #259, #260, #261, #263, #265 | append conflicts at the end of the file; keep both sides |
| the three new test files, pilot-a/tempo.json, pilot-a/MERGE.md | none | none |
#1 and #3 share no history with main. Re-run this check on the head you send for review, and post it in the PR.

Critic fixes applied (lib-8-merge-critic.md; all accepted by the supervisor, with its answers):
- B1: box_jump and reverse_lunge held (no tempo strip: vendor build-page.mjs:174, golden.mjs:115-116, qa/node.mjs:92). Their held lines go in before Do 4's first build. The pin is 14 ids. The carry baseline is d774614a minus their two articles (15 cards). They go on the follow-up list and are never exempted (D-LIB8M-NOSTRIP).
- B2: the generated files are listed exactly (gen/ids.mjs outputs: coverage.ts stages; ids.ts, loaders.ts and ids-node.mjs headers). A2b added. reserved_paths and merge_prerequisites rewritten, including what the app shows after the merge and the APK after the train (D-LIB8M-GENERATED).
- H1: the owner answers only the non-F5 flags. The supervisor approves per exercise (14.8 point 5). Stops 3, the Owner's sheet, D-LIB8M-QA, -ENTRY (approval and why) and -PIN (the GO's contents) rewritten.
- H2: PLATESONLY replaced by D-LIB8M-PAGES: the full `pages` object at D-LIB2b-PAGES (1)'s paths, no layers files, no code change, LIB-4c untouched. `config` and the option (b) scope lines are gone.
- H3: O5GATE refuses every non-'supervisor' stamp. A3 now has the 'owner' case. The regeneration doubt is replaced by library-gate.mjs:28, :36 and :54 @ 1d1fe9ea.
- M1: D-LIB8M-SLRDL rules single_leg_romanian_deadlift's topFault route. Do 7 takes its key.
- M2: Do 2b moves the D-LIB8FIX-6 bullet and adds the blank line (A19). COACHING-DECISIONS.md is in write_scope for that move.
- M3: pilot-a/tempo.json and its lib8-pin test. TEMPO's rule extends 14.7 explicitly to the cycle plate's Work phase and to a range string (plank '10–60', c12; mountain_climbers c13). A7's map mutation now has a test.
- M4: the F5 mutation moved to A13 (value exactly 3.57). The element is recorded by D-LIB8M-QA's method.
- M5: a GO that drops an id rebuilds the page and the sheet and re-posts SHEET READY. A12 pins the last sheet's sha.
- M6: the redraw write_scope covers the whole `mistake` object and its own helpers, and lists what stays.
- M7: the sheet's only F-lines are LIB-3's (from the Do 9 JSON). ENVELOPE shows as 'Page order'. The critic's scores replace 'pending' (:148). The :138 research line and plates.json `cards` are updated. D-LIB8FIX-ENV's sheet clause is amended in D-LIB8M-SHEET.
- M8: ORDER's "dependency met without the merge" clause is deleted. The HANDOVER chain now includes LIB-6 and LIB-7. Only the stalled-batch rule can reorder.
- M9: card keys are inserted as text. A6 compares the text minus the inserted block with the blob.
- L1: "first non-merge commit". 6(b)'s "until it is on main" is read as "earlier in the same PR, before any pin commit" (D-LIB8M-CHAIN).
- L2: A13's mutation acts on the candidate's exemptions, not on the committed entry.
- L3: A15 mutates a geometry constant.
- L4: pages/pilot-a.json uses registry ids lib_<id>.
- L5: ENTRY cites GOLDEN.json and 14.8 point 7, not the LIB-2b fixture. A lib-9a-card line for the approval form is a supervisor follow-up in the rulings.
- L6: TOPFAULT is read at the redraw head ('plate head <Do 6 sha>'). LR-31 pick changes are in Do 5 d's redraw plan (five ids, from e777388d).
- L7: the collision table covers 30 PRs, including #265 and #245's specs.
- L8: Do 9's report is a JSON in the scratch folder, passed to build().
- L9: the hand kinds on the sheet follow D-LIB8M-SHEET.
- L10: OHP is out of the critic set. Its 8 non-tempo fragments carry by A9, plus H6.tempo and the supervisor's look.
- Supervisor answers: LR-31 is done at e777388d, so there are five redraws (R-LB2-7, R-LB2-13 to -15). <RESEARCH_HEAD> is the merged head after the last verify that covers SLRDL. plank and mountain_climbers get ruled tempo rows. LB1 merges after #109.
- recheck N1: applied. D-LIB8M-SLRDL no longer promises an unchanged plate. A tell change makes SLRDL a sixth redraw in Do 6 and the same critic set, never exempted. Branch (b)'s plan amendments (3.1:85, :155, 3.3:303, 6.1:646) are a supervisor docs action. Stops 2, Do 5 d, Do 6, Do 10, A4, write_scope, the Owner's sheet and risks follow.
- recheck N2: applied. Hand ids: curl dumbbell_biceps_curl, rope rope_triceps_pushdown, EZ ez_bar_curl, rendered in Do 12 to pilot-a/evidence/lib7-<key>-{silent-black,paper}.png, which are now in write_scope (reserved_paths excepts them). Band has no LIB-7 pair: one line, no render.
- recheck N3: applied. <RESEARCH_HEAD> is the merged head after the last verify that covers SLRDL (R-LB2-16). D-LIB8M-SLRDL cites R-LB2-16. read_first adds 6255337111 and 6255377801.
- recheck N4: applied. D-LIB8M-QA reads the F5 element from qa/browser.mjs's measurePage `where.label` at the lowest label-contrast cell, using a scratch script.
- recheck N5: applied. Do 7 replaces the final `\n}` with the three-key block, and A6 restores it.
- recheck N6: applied. The coverage.ts importer list is complete.
- recheck N7: applied. D-LIB8M-SHEET states that golden B is already 'owner' on main, so no record changes.

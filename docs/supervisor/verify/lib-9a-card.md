Card LIB-9a: LB1 plates build-ahead (2026-10-17). LIB-9 later continues on the same branch and PR.

id: LIB-9a
model: claude-opus-5-5 (plates and composers are judgement work, plan 3.1)
mode: auto
title: 'Builder: LIB-9a LB1 plates'
branch: claude/lib-9-lb1 (new). Your first push (only after 'E8 done', see CI manners) opens draft PR 'LIB-9a (build-ahead): LB1 plates, nothing ships'.

base: origin/main @ 49a28534cc86da160dd12b9d3a610ec8eee85293.
- Where the plan (claude/howto-options @ 4a9fd86) differs from lib4-cards sections 1 and 12, those win.
- One base rule: Do 4 starts only once LIB-2b (#234) is on main, after you merge origin/main into this branch with a merge commit. Until then work only on Do 1-3 and the slice's drawing, using main's tools (candidate.mjs, inputs-closure.mjs closureOf and plates-page.mjs groupsConfig(page, all) exist only on #234 today).
- Never merge an unmerged head (#234, #109, #181, #193, #191, #232, #233 or any other). Read them with `git show <sha>:<path>` only.
- Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on (plan 7 row 8): LIB-2..LIB-8, plus LIB-5's back box (Do 9) on main (merge_prerequisites). This governs the merge only; LIB-9a never merges on its own.

build_prerequisites (the supervisor posts each on the PR or on claude/sup-lib4-cards, or sends it to your session while no PR exists. If one is missing when you reach its step, go on with any other permitted step; set WAITING only when none is left, per D-LIB-LANE-ACTIVE):
- To start, and before your first push: D-LIB4-ENTRY-2 posted on claude/sup-lib4-cards as an amendment of D-LIB4-ENTRY. Link it in the PR body.
- First push: the supervisor's 'E8 done', sent to your session (no PR exists yet), then the CI manners check.
- Do 4: LIB-2b on main and merged in from origin/main; D-LIB9-AUTHORQA posted.
- Do 5, the 12 bulk ids: the supervisor's look at your design note and slice is posted, and D-LIB9-ENGINE is posted.
- Do 5 (d), straight_arm_pulldown and inverted_row: also the pilot A #109 code review has finished, with its verdict posted on #109. These two clone pilot A's hinge (romanian_deadlift, barbell_row) and supine (dumbbell_bench_press) anchors. Clone from e6f39ff unless that review, or a later valid critic run (D-PILOTA-R5), names another approved head. Then clone from that head.
- Do 6: D-LIB9-CARDFIELDS posted, your note's tempo map and constants ruled on the PR, and the research head named on the PR by the supervisor.
- Do 7, meaning any QA run used as evidence (the slice's included): the content verifier's 'CARD FIELDS VERIFIED @ <sha>' (Do 6).
- Do 8 (the critic run) and every per-exercise approval: D-LIB9-F5 ruled (lib4-cards 11.1 item 17, open today).

merge_prerequisites: never merges as LIB-9a. LIB-9 merges in checklist slot 8, only when all of these hold:
- D-LIB4-ENTRY holds in full, and LIB-2..LIB-8 have merged.
- LIB-5's back box (Do 9) on main before LIB-9 merges (LR-28).
  - Under D-LIB5-BOX route (b), LIB-5 merges with a fail-closed placeholder, so 'LIB-5 merged' is not enough: its Do 9 PR from claude/lib-5-back-box must have merged too.
  - Why: 7 of the 14 LB1 cards list redFlags 'back' on 9dbc7e0 (chest_supported_row, hanging_knee_raise, horizontal_leg_press, inverted_row, resistance_band_row, shoulder_press, straight_arm_pulldown). LR-28's ship-order rule holds back-linked sheets until the back-pain box exists; it names landmine_row, pendlay_row and t_bar_row, and the same rule covers these 7.
- LIB-6-PM's back patches and S5-L on main and green (D-LIB5-PAGE; lib4-cards 14, Supervisor actions 12).
- The variant-line field card is on main before any row whose exercises.json equipment has '/' ships (D-LIB5-VARIANT 6).
- The D-LIB5-FAMILY comparator (Do 9) has its own fresh Opus PASS and is on this branch before any LB1 child's layer copy is written or shipped.

Rulings this card relies on. These are summaries; where the text posted on claude/sup-lib4-cards differs, the posted text wins.
- D-LIB4-ENTRY-2 amends D-LIB4-ENTRY (lib4-cards section 1 @ eb77d98: "Before LIB-9 pushes, all of these hold").
  - "Before LIB-9 pushes" now covers any push of a head on which: an LB1 row is at stage approved-plate or shipped; or an LB1 row is in tools/plates/library/batches/; or an LB1 entry is in tests/howto/golden/library/.
  - Reason: the entry condition protects CI stability at K > 1 (plan 5.4:596-597, "before K goes above 1"). LIB-9a cannot raise K: with no LB1 id shipped, pinned or in batches/, the library family has no LB1 subject.
  - Every other D-LIB4-ENTRY condition still holds before any LB1 id ships, is pinned or goes into batches/: GATE-SPLIT; LIB-2b, LIB-4a, LIB-4b and LIB-4c merged; C14; C13's 5 identical K >= 2 runs; HT-3's 5 reruns; 11.1 item 14's shared-key proof.
  - Your A9 test enforces it, and the supervisor checks A9's mutations at the slice review.
- D-LIB9-ENGINE (as corrected): a library plate's engine is chosen per row from the engine its spec imports, never by "library vs the 8".
  - LB1 specs import only tools/plates/library/engine.mjs, which re-exports the vendored golden-A engine (tools/plates/vendor/engine/*). So every LB1 plate, and later its crops, uses the vendor engine.
  - LB1 specs may use poly (vendor PRIMITIVES, equipment.mjs:316; the layers PRIMITIVES at :304 lack it) and flat palm (vendor body.mjs:322-328).
  - No LB1 spec or composer imports anything under tools/plates/layers/.
- D-LIB9-AUTHORQA: candidateOf(id, { all, authoring: true }) in tools/plates/library/candidate.mjs:
  - returns the same candidate with exemptions [] and reads no pin;
  - resolves the How-to source from the injected `all`, through an optional `all` parameter on registry sourceOf whose default is rows(root);
  - throws at stage approved-plate or shipped.
  Every default call behaves exactly as before. On ccf0250, candidateOf already takes `all`; you add `authoring` and the sourceOf parameter. The generator, LIB-4b's PQH rows and LIB-4c never pass the option.
- D-LIB9-CARDFIELDS: three top-level keys in docs/research/howto/cards/<id>.json, in exactly the shape that candidate.mjs researchOf and qa/node.mjs h6 and F7 read:
  - plateFacts: [{kind: 'angle'|'contact'|'height', joint|landmark, pose?, deg|m, measure?, claim}];
  - tempo: the spec's phase array [{phase, s, move?}], compared by JSON.stringify;
  - topFault: the card's mistake key.
  Each value names the claim whose verbatim quote states it. Nothing else in a card changes. No value is ever taken from the spec under test.
  LIB-5 writes the same three keys, in this one shape, for the 8's machine research cards (LIB-5's scope). Never write those here.
- D-LIB9-F5 (open): every library plate raises F5 at 3.57:1. That is the selected-Mistake-tell chrome contrast the 8 carry as a named exemption. Here it is listed as expected, and never exempted or locally "fixed".
- D-LIB-SCRATCHIDS: LIB-4b's B5 fixture (fidelity/fixture.mjs:27-28 on #232) targets lib_underhand_lat_pulldown and lib_chest_supported_row. Never run that fixture on this branch.
- D-PILOTA-R5: an approval counts only for the head it ran on, and a valid run on a newer head outranks it.
- D-LIB-LANE-ACTIVE (lib4-cards section 12; amends plan 7 'Lanes' and HANDOVER 5.12): the LIB lane cap of 4 counts active builders.
  - A builder is WAITING only when it has no permitted work in hand. Local work before 'E8 done' is active work, so you hold a LIB drawing slot from your start. LIB-4a and LIB-4b count as separate slots.
  - When a step's prerequisite is missing, go on with any other permitted step. Only when none is left: write WAITING and what you wait on in your HANDOFF's `Waiting on:` line, do no new work and push nothing.
  - Only the supervisor sends resume messages (to your session, and on your PR once it exists). A CI run, a PR event or your own timer is never a resume.
  - If a supervisor message parks you (a resume elsewhere would make 5 active builders), stop at your next local commit and stay WAITING until its resume message.
- D-LIB5-BOX (lib4-cards section 12): the back-pain box reaches main by one of two routes.
  - (a) The owner's answer to plan 8 decision 6 is recorded before LIB-5's Do 9, and LIB-5 builds the box (Do 9) in its PR.
  - (b) No answer by LIB-5's merge slot: LIB-5 merges with the fail-closed placeholder its Do 4 builds (the accessor throws), and Do 9 lands later in its own PR from claude/lib-5-back-box.
  - Either way, LIB-9 never merges before the box is on main (merge_prerequisites).

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Every plate meets the bar of the 8 and of pilot A: every plan 3.4 item R1-R10 at 4 or more.
- No check, envelope, threshold, rubric item or test is relaxed, skipped or exempted to save time.
- A plate below the bar is redrawn, and you report the time it cost.

shared-file owners:
- None of the AGENTS shared add-only files is touched.
- tools/plates/vendor/** and tools/plates/layers/**: read only (MANIFEST locks).
- tools/plates/library/candidate.mjs and registry.mjs: LIB-2b's until it merges. Add only the D-LIB9-AUTHORQA option and the optional sourceOf `all` parameter, and only after LIB-2b is on main.
- tools/plates/library/hands/** (LIB-7 and LIB-12): untouched.
- Existing eq files (main: parts, rope; pilot A: inclineBench, pecDeck, safetyArms): read only. Add new eq files only.
- docs/research/howto/cards/** and quotes/** belong to claude/libht-research. Here they are byte copies, plus the three card keys. The supervisor merges the field commit back.
- The 8's machine research cards, and the 8's H6:no-card and F7 entries in tools/plates/library/qa/exemptions.json: LIB-5's. Untouched here.

CI manners (D-LIB-CIMANNERS, lib4-cards section 12 item 1; the same text in every card, and it replaces any older rule here):
CI manners while GATE-SPLIT's E8 proof runs: push nothing until the supervisor sends you 'E8 done' (by a message to your session, and as a comment on your PR if it exists). After 'E8 done' and until the GATE-SPLIT train has merged, before each push check that no M/ARC gate run is in progress on claude/sup-gate-split-ci, claude/gate-split, claude/sup-gate-split-e6, claude/sup-gate-split-e9 or claude/sup-merge-train-* (curl the Actions API); if one is, wait. Then at most one push per 2 hours until READY unless the supervisor asks for one. Never use [skip ci].
- The check, run right before each push until the supervisor tells you the GATE-SPLIT train has merged (section 12 item 1). It must print nothing. A branch name means wait, and so does API-ERROR (rate limit or no answer). A queued run counts as in progress. Re-check at most every 10 minutes:
  `for s in queued in_progress; do curl -sS "https://api.github.com/repos/macdarenz-droid/M-arc/actions/workflows/build-apk.yml/runs?status=$s&per_page=100" | jq -rs 'if (.[0].workflow_runs|type)=="array" then .[0].workflow_runs[].head_branch else "API-ERROR" end'; done | grep -E '^(API-ERROR|claude/(gate-split|sup-gate-split-(ci|e6|e9)|sup-merge-train-.+))$'`
- Your READY is the 'LB1 PLATES READY' line (finish).
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before 'E8 done', work locally only, in local commits: Do 1-3 and the slice's drawing. Until your first push, end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. These rules override the builder skill's 'push after every finished task' and its 'push your work' before a pause.
- Your first push carries the design note and opens the draft PR. Never write to the owner.

hard card: the design note and a 2-plate slice come before bulk drawing (cards.md: validate a representative slice and the highest-risk case first).

outcome: all 14 LB1 plates, their composers and their QA research fields exist on this branch at stage drawing or review.
- Every plate passes every LIB-3 hard check (runQa, node and browser halves).
- The raised flags are exactly the note's expected set.
- The 14 cards' machine fields have the content verifier's VALID verdict.
- The batch is ready for the supervisor's calibrated critic and per-exercise approval.
- Nothing ships: no button, no pin, no batches/ row, no layers page, no app change, no library CI shard.
deliverable: the specs, composers, rows, tempo map, LB1 plates-page build and QA scripts, design note and tests.
evidence:
- the per-id QA table at the head sha;
- the plates-page sha256 from two identical builds;
- the unit tests with their mutations;
- the content verifier's verdict;
- then the critic's verdict.
finish:
- 'LB1 PLATES READY @ <sha> (plates page <sha256>)' is posted;
- the critic run is VALID with every plate at the bar, or a fix round is recorded;
- the supervisor's per-exercise approvals are recorded on the PR (head-only, D-PILOTA-R5).
Then stop; LIB-9 takes over the branch. You will notice: nothing in the app.

LB1 ids (plan 6.2; all 14 are in src/data/exercises.json as lib_<id>): chin_up*, hanging_knee_raise*, assisted_pull_up*, inverted_row, close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown, straight_arm_pulldown, chest_supported_row, resistance_band_row, incline_machine_press, shoulder_press*, horizontal_leg_press, leg_press_calf_raise. * = tier A.
- Composers (plan 2.1): assistMachine, chestRowMachine, band.
- Pose classes: hang; kneel (anchor assisted_pull_up); floor-sit (resistance_band_row); hinge and supine from pilot A. Census @ 4a9fd86: straight_arm_pulldown uses stand and hinge; inverted_row uses supine.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- The plan, docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md on claude/howto-options @ 4a9fd86:
  - 2.1-2.2;
  - 3.1-3.4 (:236: an id that needs anything outside PARAMS becomes H; :257-268: the anchor rule; 3.4: the critic rubric and its pass rule);
  - 5.4 :596-597, the entry condition;
  - 6.1-6.3;
  - section 7 row 8 (:765).
- docs/supervisor/verify/lib4-cards.md on claude/sup-lib4-cards @ eb77d98:
  - D-LIB4-ENTRY and D-LIB4-A9 (section 1);
  - 11.1 items 1-3, 10, 14 and 17;
  - section 12 as each item is posted: D-LIB-CIMANNERS, D-LIB-LANE-ACTIVE, D-LIB4-ENTRY-2, D-LIB5-BOX, D-LIB9-ENGINE, D-LIB9-AUTHORQA and D-LIB9-CARDFIELDS.
- Pilot A #109 @ e6f39ff (git show only). Its panel verdict is #109 comment 5974928178.
  - tools/plates/library/DRAWING-GUIDE.md;
  - specs/romanian_deadlift.mjs and barbell_row.mjs (hinge);
  - specs/dumbbell_bench_press.mjs (supine, checks {plane});
  - specs/single_leg_romanian_deadlift.mjs (drawable-fault F7);
  - specs/plank.mjs (D-LIB8-floor);
  - eq/rope.mjs (the poly pattern).
- The 8 and the engine:
  - tools/plates/vendor/exercises/{pull_up,hanging_leg_raise,lat_pulldown,seated_cable_row,machine_chest_press,leg_press}.mjs;
  - vendor/engine/SPEC.md and equipment.mjs;
  - tools/plates/library/engine.mjs, the only engine import path;
  - derive.mjs and PARAMS. Among the PARAMS paths the engine reads only spec.camera (plate.mjs:81-95); confirm this in the note.
- LIB-3 on main:
  - qa/index.mjs: `ok` means every hard check passes and no raised flag lacks an exemption (:61);
  - qa/node.mjs: h6 (:153-176), nodeFlags F7 (:293), h9 and h10;
  - qa/mutations.mjs and qa/envelope.json (H9lineTypes).
- LIB-2b @ ccf0250, until it is on main:
  - candidate.mjs: researchOf :44-48; candidateOf :51-87, with pinOf at :85;
  - batch-golden.mjs: pinOf :38;
  - registry.mjs: rows with its `batches` option (:30), STAGES :13, sourceOf :64-68, view and censusRef;
  - inputs-closure.mjs: closureOf :40;
  - plates-page.mjs: groupsConfig :26.
- Research on the named head: cards/ and quotes/ for the 14, plus CARD-V2.md and RULINGS.md (LR-28: ship order of back-linked sheets).
- Census: docs/howto/library/inputs/census.json @ 4a9fd86 (not on main), the rows for the 14: closestApproved, poses, equipmentGaps and view.

design_reference: DRAWING-GUIDE.md @ e6f39ff; the 8's approved plates (tools/plates/vendor/exercises); pilot A's approved plates @ e6f39ff; the plan 3.4 rubric; the census views.
connectivity:
- None. Node and local Chromium (/opt/pw-browsers/chromium) only.
- Specs and composers read no files and fetch nothing.
- No web fetch: facts come only from the copied cards and quotes.
- No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/specs/<card id>.mjs for the 14 (row src 'library/specs/<card id>.mjs').
  - tools/plates/library/eq/{assistMachine,chestRowMachine,band}.mjs, plus any other LB1 composer the note names, one new file each.
  - tools/plates/library/lb1/{rows.json,tempo.json,build.mjs,qa.mjs,DESIGN.md,cards.sha.json}:
    - rows.json holds batch 'LB1', censusRef 4a9fd86 (the census commit), view per row, the mode the note's ruling gives, and stage drawing or review only;
    - tempo.json holds the ruled tempo map (A11).
  - tools/plates/library/howto/lib_<id>.howto.mjs for the 14, holding only `research: { card: 'docs/research/howto/cards/<id>.json' }`. LIB-9 writes the layer copy later, under LIB-5's lint.
  - docs/research/howto/cards/<id>.json and quotes/<id>.json for the 14. Both start as byte copies; then only the three top-level keys are added to cards/. Quotes stay byte copies.
  - tests/howto/lb1-plates.test.ts (node only; it lands with Do 4).
- tools/plates/library/candidate.mjs and registry.mjs: only the D-LIB9-AUTHORQA option and the sourceOf `all` parameter, after LIB-2b is on main.
- docs/COACHING-DECISIONS.md: append only.
- Do 9 only (D-LIB5-FAMILY 6), after LIB-5 is on main and merged into this branch: exactly the family module under tools/plates/library/lint/ and its block in tests/howto/library-lint.test.ts. This is a carve-out from the reserved lint/ folder and LIB-5 paths, and nothing else.
- Plates pages and QA reports are not committed. build.mjs and qa.mjs write to a temp directory and print the sha256 and the table.

reserved_paths:
- tools/plates/library/batches/** and tests/howto/golden/**.
- src/** (every generated file included), tools/plates/gen/** and tools/plates/generate.mjs.
- In tools/plates/library/: {derive,build-page,plates-page,layers-spec,inputs-closure,batch-golden,engine,bodies,ids-encoding,ids-node}.mjs, MANIFEST.json, and the folders qa/, hands/, render/, pages/, pilot-a/, fidelity*/, ci/, shared/, lint/, research/, scale/ and budgets/.
- Existing eq files.
- tools/plates/vendor/** and tools/plates/layers/**.
- docs/research/howto/*.json (the generated research of the 8).
- scripts/** (screenshot-gate.mjs included), tests/theme.test.ts, src/ui/styles.css.
- .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The LIB-4a, LIB-4b, LIB-4c and LIB-5 paths (LIB-5's include the 8's machine research cards and the back-box module).

Do:
1. The design note, in lb1/DESIGN.md, posted on the draft PR with your first push. One row per id:
   - mode: D only if every parent string (labels, cues, tells, alt) and every pose is true for the child, and the only change is a PARAMS key that the engine reads and the envelope names. Otherwise H, listing the parent fields that are false (for example, pull_up.mjs's alt says 'Overhand grip'). Plan 6.2 expects D9 H5; name every D that becomes H.
   - the clone source, composer, pose class, and the anchor's approving sha: GOLDEN.json for the 8, e6f39ff for pilot A;
   - the expected flags: F5 on every plate (D-LIB9-F5 is open), F1 if the calf raise is zoomed, F7 on single_arm_lat_pulldown, and any other flag with its reason;
   - the hand zoom and the pair key that would draw it. Build none, and list the cards with no key yet;
   - the census view;
   - the tempo map (D-LIB9-CARDFIELDS), for the supervisor to rule:
     - each card's plate.tempo {up, down, pause} mapped onto the spec phase array, with the phase names;
     - every other `s` (Rest, holds) as a named constant with its value and source. The 8's Rest is 0.5 or 1 s, and pilot A's specs have no Rest phase, so no default exists;
   - how the work splits into two families, if a second drawer joins;
   - risks.
2. The slice: close_grip_pulldown (the pulldown family pattern) and assisted_pull_up with assistMachine (the highest risk: a new composer, the kneel class, tier A).
   - Take them through Do 3 and Do 4, then Do 6 for all 14 cards (the fields come from research, not from drawings, so the verifier runs once), then the verifier, then Do 7 for these two.
   - Post their plates-page sha256 and QA table on the PR, with A9's test and its mutations shown red and then restored.
   - Wait for the supervisor's look before the other 12.
3. Composers, each `(lm, ctx) => item[]` returning PRIMITIVES types only:
   - assistMachine: knee pad or platform, mount step, stack pin;
   - chestRowMachine: chest pad, seat, handles;
   - band: anchored around the feet, floor-sit.
   Any part that moves between the end pose and the Mistake is a `poly` or an H9 line type. No file reads. Unit tests.
4. The QA hook (only after LIB-2b is on main and merged in from origin/main, and D-LIB9-AUTHORQA is posted):
   - add the authoring option, plus the sourceOf `all` parameter it needs;
   - build.mjs and qa.mjs read lb1/rows.json through `rows(root, { batches: [...batchFiles(root).map(p => [p, read(p)]), ['tools/plates/library/lb1/rows.json', data]] })`, and pass that set as candidateOf's and groupsConfig's `all`;
   - never write under batches/.
5. Draw by family, following DRAWING-GUIDE.md: callouts from the card's checkpoints, tells from its mistake, and the tempo equal to the card's ruled tempo. Order:
   a. incline_machine_press, shoulder_press, horizontal_leg_press, leg_press_calf_raise;
   b. underhand_lat_pulldown, single_arm_lat_pulldown, chin_up, hanging_knee_raise;
   c. chest_supported_row, resistance_band_row;
   d. straight_arm_pulldown and inverted_row, only after the pilot A code review (build_prerequisites).
6. Cards (all 14, once):
   - First commit: copy the 14 cards and quotes byte for byte from the research head the supervisor names.
   - Second commit: add top-level plateFacts, tempo and topFault per D-LIB9-CARDFIELDS and the ruled tempo map. Each fact names the claim whose quote states its number.
   - lb1/cards.sha.json records the research head sha and each card's sha256 without those three keys, in the canonical form that the test states and uses.
   - Then post 'LB1 CARD FIELDS READY @ <sha>' and wait.
   - The supervisor runs a fresh, blind Opus content verifier on the 14 cards' plateFacts, tempo and topFault, against their claims and quotes. It plants exactly one wrong number in a copy, following the docs/supervisor/workflows/research-verify.js pattern; a run that misses the plant is discarded and run again. Fix only what it names; it then re-runs for the changed cards.
   - Do 7 evidence waits for 'CARD FIELDS VERIFIED @ <sha>'.
   - If claude/libht-research later moves for an LB1 card (research wave 2 touches several): copy that card byte for byte again, re-apply its three keys and update cards.sha.json. If a claim or plate field that its keys cite changed, the verifier re-runs for that card and its plate is QA'd again.
7. QA (after the verifier's verdict):
   - build.mjs builds the LB1 plates page twice, to a temp directory; the bytes must match;
   - qa.mjs runs runQa's node and browser halves (Chromium at /opt/pw-browsers/chromium) per id, through candidateOf(id, { all, authoring: true }), and prints the table: hard checks, raised flags and metrics.
8. Post the ready line with the per-id table.
   - After D-LIB9-F5 is ruled, the supervisor runs the calibrated critic (the docs/supervisor/workflows/pilot-a-critic.js pattern: 2 hidden approved anchors and 2 planted defects; plan 3.4).
   - Fix only what it names. After two failed rounds on one plate, stop and report.
   - If D-LIB9-F5 is ruled a chrome fix through a golden update: merge origin/main once that update lands, rebuild, and re-run QA. F5 then leaves the expected set.
9. The D-LIB5-FAMILY comparator (lib4-cards 14 OPEN-6 point 6). Build it only after LIB-5 is on main and merged into this branch; it merges before any LB1 child's layer copy is written or shipped.
   - Post the inherit[]-entry → sheet-path map on the PR first, and wait for the supervisor's ruling on it.
   - The map lives only in the family module. Cards are never edited (D-LIB9-CARDFIELDS; A11's three-key diff).
   - The comparator replaces LIB-5's refusal and stays fail-closed: it still throws for `extends`, for any inherit[] entry with no ruled mapping, for a mapped string that is not `===` to the parent's shipped How-to string, and for `extends` that disagrees with the card's `parent`.
   - Mutations, each red then restored: one inherited string drifted; one inherit[] entry unmapped; the parent's string changed; LIB-5's M1-M3 kept as unmapped cases.
   - It gets its own fresh Opus review.

Acceptance (each mutation must turn red, then be restored; list each one in the PR):
- A1 The note and the slice are posted before bulk work, with a cited D/H reason per id. Evidence: PR comment links.
- A2 Composers use PRIMITIVES types only, and their moving parts are poly or one of the envelope's H9lineTypes. Mutations:
  - {type: 'wedge'} turns H9.type red;
  - a knee pad that moves in the Mistake as a box with no poly turns H9.moving-line red.
- A3 Spec and composer closures are pure and drawn by the vendor engine. For each id, closureOf(spec) passes, contains tools/plates/vendor/MANIFEST.json and has no path under tools/plates/layers/. Mutations:
  - readFileSync added to a composer makes closureOf throw;
  - one spec importing tools/plates/layers/engine/body.mjs → red.
- A4 For all 14, every PQ-H1..H10 hard check passes in runQa node and browser, and the raised flags equal the note's expected set exactly. `ok` stays false only because of those flags, until the sheet's per-exercise exemptions. Mutations on one LB1 plate, each red:
  - LIB-3's M1-M7 as named in qa/mutations.mjs: M1 label 1 px onto the figure; M2 contact 1 cm off; M3 Trace below the minimum; M4 Mistake equal to the end pose; M5 start equal to the end pose; M6 an unapproved type as a moving line part; M7 an unknown equipment type;
  - a raw-spec override on a D row (H10.raw);
  - a colour literal (H2.colour).
- A5 Exactly the 14 plan 6.2 LB1 ids, each once. Mutation: drop or duplicate a row.
- A6 PQ-H6: facts within ±2° or ±1 cm, the tempo equal to the card's, and F7 only where the note names it. Mutations:
  - a fact +3° turns H6 red;
  - the card path removed gives H6:no-card.
- A7 Any D row: the parent rebuild is byte-identical and its params are valid (H10). Mutation: a param outside the schema.
- A8 The authoring option returns exemptions [] and reads no pin. It is refused at approved-plate or shipped. The default path is unchanged: LIB-2b's and LIB-4b's candidate tests are unedited and green. Mutations:
  - authoring on a shipped row must throw;
  - the default path with no pin must still throw.
- A9 Nothing ships (this proves D-LIB4-ENTRY-2). lb1-plates.test asserts:
  - every lb1 row's stage is drawing or review;
  - no LB1 id is in shippedIds(), in any batches/ file, or in tests/howto/golden/library/;
  - generate --check is green and unchanged.
  Each milestone post includes `git diff --name-only origin/main...HEAD`, showing nothing under batches/, tests/howto/golden/, src/ or tools/plates/gen/. The mutations are shown in the slice post and checked by the supervisor at the slice review:
  - one row set to shipped;
  - one row set to approved-plate;
  - rows.json copied into batches/;
  - a file naming an LB1 id placed in tests/howto/golden/library/.
- A10 The plates page is deterministic (PQ-H7): two equal sha256 values.
- A11 After the copy, a card differs from its research-head copy only in the three keys (cards.sha.json). Through lb1/tempo.json, every `s` in each card's tempo array maps to one of two things, and no `s` is left unmapped:
  - a verified research value: that card's plate.tempo up, down or pause;
  - a named constant ruled on the note, with the ruling cited in tempo.json.
  The spec's tempo equals the card's (H6). Mutations:
  - any other card key edited → red;
  - one tempo second changed → red;
  - Rest changed in one card → red;
  - an `s` with no map entry → red.
- A12 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head.
- A13 The content verifier is VALID (its plant caught) on the 14 cards' machine fields at the head's cards.sha.json, before any Do 7 evidence. Evidence: the supervisor's 'CARD FIELDS VERIFIED @ <sha>' comment.
- A14 The critic run is VALID, and the supervisor's approvals are recorded per exercise. Both come after D-LIB9-F5 is ruled.

verification: the per-id QA table and both plates-page sha256 values at the exact head sha. The verifier's and the critic's comments name that sha.

risk_and_recovery:
- D-LIB9-ENGINE is posted differently from the summary above (for example, no poly or flat palm for library rows): redraw the slice before bulk work. That is why the ruling comes before Do 5.
- The pilot A code review, or LIB-3's H6 re-check, changes a hinge or supine anchor: only straight_arm_pulldown and inverted_row re-plan (Do 5 d waits for it).
- Most D ids become H, because the engine reads only spec.camera among the PARAMS paths: about +2.5 Opus-hours each [est]. Name them in the note. The supervisor may then add a second drawer on claude/lib-9-lb1-b for one family; you merge it in with a merge commit and keep rows.json, build, qa and the tests.
- F5 on every plate: listed and never exempted here. The critic and the approvals wait for D-LIB9-F5.
- The verifier corrects a fact: fix the field and re-QA that id. A plate drawn to a wrong fact is redrawn before the critic, never after approval.
- The research head moves: apply the re-copy rule in Do 6.
- LIB-4b's B5 fixture targets two LB1 ids: never run it here (D-LIB-SCRATCHIDS).
- LIB-2b changes candidate.mjs or registry.mjs again before it merges: Do 4 is built on main's version only.
- LIB-5 merges first with its fail-closed back-box placeholder (D-LIB5-BOX route b), and an LB1 build or QA path you run reaches its accessor (it throws 'LIB-5: back box waits for owner decision 6 (plan 8 item 6)'): stop and report on the PR. Never stub, catch or bypass the placeholder.
- A gate run is in progress on a GATE-SPLIT or train ref when you want to push: wait and re-check. Never push around the check, and never cancel the run.
- Approvals are head-only: a later byte change re-runs the critic for the changed ids only.
- Two failed tries of one approach with no new evidence: stop and report on the PR.

return:
- the PR number and head sha;
- links to the note, the slice, the card-fields line and the ready line;
- the per-id table (mode, composer, hard checks, flags);
- the plates-page sha256;
- the mutation list;
- the output of check, test:tz and the gate.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-9a resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

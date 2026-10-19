Card LIB-10: LB2 plates, build-ahead (2026-10-18). The ship phase (layers, pin, button) is a later card on the same branch and PR.

id: LIB-10
model: claude-opus-5-5 (templates, plates and composers are judgement work, plan 3.1)
mode: auto
title: 'Builder: LIB-10 LB2 plates'
branch: claude/lib-10-lb2 (new). Your first push opens draft PR 'LIB-10 (build-ahead): LB2 plates, nothing ships'.

base: origin/main @ 2078913c251633bbc5ea39a41dc4ca41a429c59e (train 27; LIB-3b #258 is on main).
- Where the plan (claude/howto-options @ 4a9fd86) differs from lib4-cards sections 12-14 or the D-LIB10-* rulings, those win.
- Merge origin/main into this branch, with a merge commit, each time pilot A (#109), LIB-9 (#245) or LIB-3c lands. The steps that need them wait (build_prerequisites).
- Never merge an unmerged head (#109, #245, #244 or any other). Read them with `git show <sha>:<path>`. To render a pilot A plate, check that head out into a temporary `git worktree` outside the repo tree. Never commit it, and never merge it.
- Merge commits only. Run `git pull --no-rebase` before every push. Never force, rebase or amend. If the branch moves without your push, stop and report on the PR.

depends_on (plan 7 row 9, :766): LIB-9 and pilot A yes. LIB-9 governs the merge. Pilot A's yes also gates the start of every T child (plan 3.1:257-258, 6.1:635-636). That yes is its plates pinned on main with the approvals D-LIB-O5 allows (14.8 point 5), and the owner's named exemption on every flag the merge card's QA raised (D-LIB8FIX-ENV).

build_prerequisites (the supervisor posts each on the PR or on claude/sup-lib4-cards, or sends it to your session while no PR exists. If one is missing when you reach its step, go on with any other permitted step; set WAITING only when none is left, per D-LIB-LANE-ACTIVE):
- To start: 'LIB-10 start' with the active-builder count, and D-LIB10-AHEAD posted. Link it in the PR body.
- At start: Do 1, Do 4's declineBench, and the H slice's drawing (Do 2 a), except each Mistake and decline_bench_press's tempo (next two bullets). Copy pilot A code with `git show` from the head D-LIB8FIX-CARRY names (e6f39ff, or a later #109 head where FX8 holds). D-LIB10-DECLINE is posted before decline_bench_press is drawn. Do 4's other composers (an EZ bar, a bench rack) wait until the note names them and the supervisor has ruled it.
- Before a plate's Mistake is drawn, and before Do 6: LIB-TOPRANK (LR-31) applied to that card on a research head the supervisor names, with its rankNote. decline_bench_press and skull_crusher come first (the H slice). A changed pick or drawable re-plans that plate's Mistake and re-proposes its fault→key entry for the supervisor to rule. The verifier then re-runs for that card.
- decline_bench_press's tempo waits for research's LR-33 fix of c8 (LIB-TEMPO) on a research head the supervisor names. Its tempo-map entry is ruled on that head.
- Do 6: the note's tempo map and fault→key map ruled on the PR (Q3; 13 Q1(a)); the research head named, with LR-31 and LR-33 applied (the two bullets above).
- The T slice (Do 2 b), Do 3 and the T bulk: pilot A merged on main with its pin chain (the LIB-8 merge card), meeting depends_on's yes, and merged in; D-LIB10-TEMPLATES, D-LIB10-PA, D-LIB10-FACTS and D-LIB10-PARENTS posted.
- Any T row in lb2/rows.json: D-LIB10-RANGES and D-LIB10-CHILDPROOF posted (lib4-cards.md:1424 (section 13, amendment 21)). A T row's QA counts as evidence only on a head where LIB-3c, which builds them, and the ruled rows of that row's family (D-LIB10-RANGES 4b) are on main and merged in.
- qa.mjs (Do 5) and Do 8: LIB-3c on main and merged in (it lands #245's D-LIB9-AUTHORQA hunk byte for byte); 'CARD FIELDS VERIFIED @ <sha>' for Do 8. build.mjs needs only main.
- Each family's bulk (Do 7): the supervisor's look at your note and at that family's slice.
- Do 9 (the critic run) and every approval: the ready line, and D-LIB10-ANCHORS posted.

merge_prerequisites: never merges as this card. The ship card merges LB2 in checklist slot 9 only when all of these hold:
- LIB-9 has merged, and every D-LIB4-ENTRY condition holds.
- Pilot A's yes, as defined in depends_on, is on main.
- LIB-3c is on main (D-LIB9-AUTHORQA, D-LIB10-RANGES, D-LIB10-CHILDPROOF).
- The D-LIB5-FAMILY comparator is on main, and the supervisor has ruled the inherit[] map for LB2's children (incline_dumbbell_press 2, incline_barbell_bench_press 3, decline_bench_press 4, close_grip_bench_press 6, arnold_press 4 entries, on research `0393aac`).
- The variant-line field card (LIB-5v) is on main before skull_crusher ships ('EZ Bar / Barbell' in exercises.json; D-LIB5-VARIANT 6).
- LIB-5's back box is on main (barbell_overhead_press lists redFlags 'back'). LIB-9 already needs it.
- dumbbell_fly ships only after LIB-20 with camera.pitch is on main and its plate is approved. Otherwise it rolls (D-LIB10-PA). The pitch rulings are proposals still waiting on the owner's go/no-go (D-SPIKE-status, COACHING-DECISIONS.md:2137).
- A calibrated critic has scored R8 and R9 at 4 or more for every LB2 plate that ships (13.1).

Rulings this card relies on. These are summaries; where the posted text differs, the posted text wins.
- D-LIB9-ENGINE: specs import only tools/plates/library/engine.mjs (the vendor engine). poly and flat palm are allowed. Nothing imports tools/plates/layers/.
- D-LIB9-AUTHORQA: candidateOf(id, { all, authoring: true }), on main once LIB-3c merges (it carries #245's hunk byte for byte). Its default path stays unchanged.
- D-LIB9-CARDFIELDS, with section 13 Q1 (topFault) and Q3 (tempo map):
  - drawable:true: topFault is plate.mistake's key, and the spec's first tell carries it;
  - drawable:false: topFault is the card's named top fault, and F7 stays raised;
  - tempo: the concentric takes up, the eccentric takes down, and Hold takes pause right after the concentric, only if pause > 0 (LR-33; 14.7). No Rest, and no constant without a quote that states its seconds.
- D-LIB5-TEMPO8 rules 10-15 (14.7) on plateFacts: kind on every fact; one form per fact (never both `joint` and `measure: true`); pose is the spec's pose name.
- D-LIB9-FACTPOSE (#245 6243105672): a fact's pose is the pose its quote states; a setup instruction states the start pose only; a contact is never carried to another pose by inference.
- D-LIB9-F5 (14.4): `exemptions: ['F5']` only for the selected Mistake tell in Midnight at exactly 3.57. Any other F5 element or value is a defect.
- D-LIB9-CLONE (13.2): copy, never import a pilot A spec; every copied root finder throws on a bracket with no root; re-derive each bracket and record what it solves to.
- D-CRITIC-CAL3 (13.5), with 13.7's facts diff and 13.6's segment-length rule (Do 9).
- D-LIB8-shrug and Q-D5-3: a right pose is never moved off its card to pass a check. A plate that cannot pass card-true is HELD and reported.
- D-LIB-SCRATCHIDS: no scratch fixture targets an LB2 id. Never run one that does.
- D-PILOTA-R5 and D-LIB8FIX-CARRY: an approval counts only for the head it ran on.
- D-LIB-LANE-ACTIVE: you hold a LIB drawing slot from your start. WAITING only when no permitted step is left.
- D-LIB9a-HOWTOID: a How-to source here holds only `research` and `id`.
- LR-31 (LIB-TOPRANK) and LR-33 (LIB-TEMPO), RULINGS.md on claude/libht-research: research applies them to the cards; this card never edits a card's research fields.
- Ruled with this card (lib-10-rulings.md), each posted before the step that needs it: D-LIB10-AHEAD, D-LIB10-RANGES, D-LIB10-CHILDPROOF, D-LIB10-TEMPLATES, D-LIB10-PA, D-LIB10-DECLINE, D-LIB10-FACTS, D-LIB10-ANCHORS, D-LIB10-PARENTS.

Quality bar (owner rule, HANDOVER section 2: "Never lower the Technical Plates"):
- Every plate meets the bar of the 8, pilot A and LB1: every plan 3.4 item at 4 or more (R8 and R9 stay unscored here, as in 13.1).
- No check, envelope, threshold, rubric item or test is relaxed, skipped or exempted to save time. A plate below the bar is redrawn, and you report the time it cost.

shared-file owners:
- None of the AGENTS shared add-only files is touched.
- tools/plates/vendor/** and tools/plates/layers/**: read only.
- Pilot A's files on main (specs/, eq/inclineBench.mjs, eq/safetyArms.mjs, pilot-a/**) and LB1's files: read only. Composers may be imported; specs are copied, never imported.
- candidate.mjs, registry.mjs, plates-page.mjs, derive.mjs and qa/**: untouched. LIB-3c lands D-LIB9-AUTHORQA and builds D-LIB10-RANGES and D-LIB10-CHILDPROOF (rulings items 10-11; LIB-3c's card). qa/param-ranges.json's family rows reach main through LIB-3c or the supervisor's claude/sup-param-ranges PR (D-LIB10-RANGES 4b). This card never edits that file.
- docs/research/howto/cards/** and quotes/** belong to claude/libht-research. Here they are byte copies, plus the three keys on the 7 new ids' cards. The supervisor merges the field commit back.
- The 4 reused pilot A ids' research cards: never written here. They reach this branch when main, holding the LIB-8 merge card, is merged in.

CI manners (D-LIB-CIMANNERS; the GATE-SPLIT train has merged, lib4-cards 14 Verdict step 4):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. Your first push carries the design note and opens the draft PR. Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full qa.mjs run) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`. Then poll its log. A tool background job stops at about 2 hours, and a stopped run is never evidence.

hard card: the design note and a slice per family (an H slice of 2 plates; a T slice of one template with its parent byte proof and one child) come before that family's bulk drawing.

outcome: LB2's 7 new plates, the BENCH template (and SEATPRESS only if arnold_press is ruled T), the new composers and the 7 cards' machine fields exist on this branch at stage drawing or review.
- Every plate passes every LIB-3 hard check (runQa, node and browser halves), PQ-H10 with LIB-3c's child proof included.
- The raised flags are exactly the note's expected set.
- Each template rebuilds its parent's pinned plate byte for byte.
- The cards' machine fields have the content verifier's VALID verdict.
- The 4 approved pilot A plates are reused unchanged; dumbbell_fly stays held.
- Nothing ships: none of the 7 gets a button, pin or batches/ row; no layers page; no app change.
deliverable: the templates, specs, composers, rows, tempo map, LB2 plates-page build and QA scripts, design note and tests.
evidence: the per-id QA table at the head sha; the plates-page sha256 from two identical builds; each template's byte proof; the unit tests with their mutations; the content verifier's verdict; then the critic's verdict.
finish:
- 'LB2 PLATES READY @ <sha> (plates page <sha256>)' is posted;
- the critic run is VALID under 13.5's rule with every plate at the bar, or a fix round is recorded;
- the supervisor's per-exercise approvals are recorded on the PR (head-only).
Then stop; the ship card takes over the branch. You will notice: nothing in the app.
forecast [est]: about 35-40 Opus-hours at plan 9's pace (templates and H plates 4 h each, T children 1.5 h, composers 2 h, QA and critic 0.75 h per id). If arnold_press is H, SEATPRESS (about 4 h) is not built and arnold_press costs about +2.5 h. LB1 needed 4 review rounds and 4 critic rounds, so up to twice that. The calendar depends on pilot A's merge, LIB-3c and the research head for LR-31 and LR-33, which this card cannot forecast.

LB2 ids (plan 6.2, :671 and :688-691; all 12 tier A, all in src/data/exercises.json as lib_<id>; research cards checked on `claude/libht-research` @ `0393aac`):
- Reused, drawn and approved on pilot A (D-LIB10-PA): dumbbell_bench_press (P:BENCH), dumbbell_shoulder_press (P:SEATPRESS), incline_dumbbell_press (T; card parent dumbbell_bench_press), barbell_overhead_press (H; redFlags back).
- Held: dumbbell_fly (pilot A plates.json `held`: "needs a raised foot-end camera"; D-LIB8-fly; view front). Not drawn here.
- Drawn here (7):
  - BENCH children: barbell_bench_press (T; full card, no parent); incline_barbell_bench_press (T; card parent barbell_bench_press); close_grip_bench_press (T; card parent barbell_bench_press);
  - decline_bench_press (plan T; H under D-LIB10-DECLINE; card parent barbell_bench_press; c8's 1 s pause is at the bottom (LR-33 fix pending); declineBench);
  - SEATPRESS child: arnold_press (T only if the note shows it differs from its template parent only through PARAMS and the facts schema; likely H: its start, dumbbells in front of the chest with palms facing you (c1), differs from the parent's, and no PARAMS key covers a start pose or a palm turn (derive.mjs:4-12); card parent dumbbell_shoulder_press);
  - H: skull_crusher (EZ bar; variant line), dumbbell_pullover.
- Every one of the 12 cards has plate.mistake.drawable true and none has the three keys yet (checked at `0393aac`). None has an LR-31 rankNote yet (LIB-TOPRANK pending).
- Composers: declineBench (new, single use). Barbell rows need J-hooks and safety pins (cards c6), but the census lists no gap for them, so the note says how they are drawn: pilot A's safetyArms and the vendor rackUpright, or a new composer it names.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- On claude/sup-lib4-cards: lib-9a-card.md (LB1's card); lib-3c-card.md; lib4-cards.md section 12 items 1, 2, 4 and 6-9; section 13 amendment 21 (:1424); section 13 (Q1-Q5, 13.1-13.8: LB1's lessons); section 14 OPEN-3 to OPEN-6, 14.4 and 14.7; the posted D-LIB10-* rulings.
- The plan @ 4a9fd86: 2.1-2.2; 3.1 (:231-268: T mode, the anchor rule); 3.2-3.4; 6.1-6.3; section 7 row 9 (:766); section 9.
- Pilot A at the head D-LIB8FIX-CARRY names: DRAWING-GUIDE.md; specs dumbbell_bench_press, incline_dumbbell_press, dumbbell_shoulder_press, barbell_overhead_press; eq/inclineBench.mjs and safetyArms.mjs; pilot-a/plates.json.
- LB1 at #245's head: lb1/DESIGN.md and tests/howto/lb1-plates.test.ts (drawn-item tests, the raw-text A5 count, the whole-token A9 match, the Q3 table copy).
- Main: derive.mjs (PARAMS :4-12, paramProblems :15-30); candidate.mjs :51-87; plates-page.mjs :26-44; registry.mjs :13-14 and :30-56; qa/index.mjs; qa/node.mjs (h6, h9, h10 :261-304); qa/envelope.json; vendor engine SPEC.md and equipment.mjs (bench :158, backPad :186, barbell :261, rackUpright :280, PRIMITIVES :316).
- Research on the head the supervisor names: cards/ and quotes/ for the 12, CARD-V2.md, RULINGS.md (LR-31, LR-33).
- Census docs/howto/library/inputs/census.json @ 4a9fd86: the 12 rows (closestApproved, poses, equipmentGaps, view).

design_reference: DRAWING-GUIDE.md; pilot A's approved plates (the BENCH and SEATPRESS parents, the incline anchor, barbell_overhead_press); LB1's approved plates; the 8; the plan 3.4 rubric; the census views.
connectivity: none. Node and local Chromium (/opt/pw-browsers/chromium) only. Specs, templates and composers read no files and fetch nothing. Facts come only from the copied cards and quotes. No new service, saved or sent data, or dependency.

write_scope:
- New:
  - tools/plates/library/templates/BENCH.mjs, and SEATPRESS.mjs only if arnold_press is ruled T (D-LIB10-TEMPLATES);
  - tools/plates/library/specs/<id>.mjs for the 7 (row src 'library/specs/<id>.mjs');
  - tools/plates/library/eq/declineBench.mjs, plus any composer the ruled note names, one new file each;
  - tools/plates/library/lb2/{rows.json,tempo.json,build.mjs,qa.mjs,DESIGN.md,cards.sha.json}. rows.json holds batch 'LB2', censusRef 4a9fd86, the 7 rows only, view per row, the ruled mode (T rows also name their template, their parent, which is the template parent per D-LIB10-PARENTS, and params, each param citing the claim on the row's own verified card that states its value, per D-LIB10-RANGES item 3), and stage drawing or review only;
  - tools/plates/library/howto/lib_<id>.howto.mjs for the 7 (`research` and `id` only);
  - docs/research/howto/cards/<id>.json and quotes/<id>.json for the 7: byte copies, then the three keys on cards/;
  - tests/howto/lb2-plates.test.ts (node only).
- docs/COACHING-DECISIONS.md: append only.
- Plates pages and QA reports are not committed. build.mjs and qa.mjs write to a temp directory and print the sha256 and the table.

reserved_paths:
- tools/plates/library/batches/** and tests/howto/golden/**.
- src/** (every generated file included), tools/plates/gen/** and tools/plates/generate.mjs.
- In tools/plates/library/: {derive,candidate,registry,plates-page,build-page,layers-spec,inputs-closure,batch-golden,engine,bodies,ids-encoding,ids-node}.mjs, MANIFEST.json, and the folders qa/ (qa/param-ranges.json included), hands/, render/, pages/, pilot-a/, lb1/, fidelity*/, ci/, shared/, lint/, research/, scale/ and budgets/.
- Existing eq files and specs (pilot A's and LB1's).
- tools/plates/vendor/** and tools/plates/layers/**.
- docs/research/howto/*.json, and the 4 reused pilot A ids' and dumbbell_fly's cards and quotes.
- scripts/**, tests/theme.test.ts, src/ui/styles.css, .github/**, package*.json, AGENTS.md, CLAUDE.md, docs/supervisor/**.
- The paths of LIB-3c, LIB-5, LIB-5v, LIB-20 and the LIB-8 merge card.

Do:
1. The design note, in lb2/DESIGN.md, posted on the draft PR with your first push. One row per id (the 7, plus a line each for the 4 reused ids and dumbbell_fly):
   - mode: T only if the child differs from its template parent only through derive.mjs PARAMS keys (:4-12) and the ruled facts schema (D-LIB10-FACTS). Otherwise H, listing what falls outside (plan 3.1:236). Plan 6.2 expects P2 T6 H4; name every change.
   - the template parent or clone source, the census closest among the 8, and each anchor's approving sha (GOLDEN.json for the 8; pilot A's head under D-LIB8FIX-CARRY);
   - each new composer that more than one id will use (an EZ bar, a bench rack), with its anchor plate and every later user. Reusing pilot A's approved safetyArms (anchor barbell_overhead_press) and the vendor rackUpright needs no new anchor. A new shared composer is approved on its anchor plate before any other user is approved.
   - the expected flags: F5 on every plate (14.4), and any other flag with its reason;
   - the R10 items the card requires: J-hooks, safety pins or catches, and a bar path clear of the neck in the right pose;
   - the hand zoom and the pair key that would draw it. Build none, and list the cards with no key yet;
   - the census view;
   - the tempo map, for the supervisor to rule (Q3 and 14.7), and a pose map wherever the drawn start differs from the card's plate.start (Q2 (b)). If research keeps c8's bottom 1 s, the note may propose it as a constant with its quote (14.7: a static phase other than the one after the concentric is a constant only with a quote that states its seconds, as leg_press's bottom Pause). The supervisor rules it.
   - the fault→key map: each card's plate.mistake → the key its first tell carries (13 Q1(a)), for the supervisor to rule.
   - for each template: its PARAMS keys, the proposed range per key with each bound's source (an approved anchor's value or a verified claim), its facts schema, and the byte-proof plan for its parent; and, per T child, the claim on its own verified card that states each of its param values (D-LIB10-RANGES item 3);
   - every number the card does not give, for the spec headers' "Unsourced numbers" (13.3 must-fix 14);
   - how the work splits into two families if a second drawer joins; risks.
2. Two slices, each before its family's bulk:
   a. The H slice (now): decline_bench_press (a new composer and pose class; H under D-LIB10-DECLINE) and skull_crusher (EZ bar, supine clone). Post 390 px renders in Paper and Silent Black beside dumbbell_bench_press, the unit tests, and the two-build plates-page sha256. Their QA table follows in Do 8, once LIB-3c is on main.
   b. The T slice (after pilot A is on main): the BENCH template with its parent byte proof (Do 3), and barbell_bench_press through it (the family pattern: rack, safeties, R10).
   - Run Do 6 for all 7 cards once, as soon as its prerequisites hold (fields come from research, so the verifier runs once).
   - Each slice post shows A9 and every mutation red and then restored. Wait for the supervisor's look before that family's bulk.
3. Templates (per D-LIB10-TEMPLATES), `make(params, facts)` in tools/plates/library/templates/<family>.mjs:
   - copy the parent's code (D-LIB9-CLONE (a)-(c)); never import a pilot A spec;
   - unknown params or facts keys throw. facts hold only what D-LIB10-FACTS allows: never poses, equipment, camera, trace, measure, checks, datum or ghosts;
   - byte proof: make(parentParams, parentFacts), rebuilt alone, equals all 9 of the parent's pinned fragments. Never edit the parent to make it pass.
   - A T child's spec exports its `facts` and `export default make(<its row's params>, facts)`, and nothing else (D-LIB10-CHILDPROOF).
4. Composers, each `(lm, ctx) => item[]` returning PRIMITIVES types only:
   - declineBench: pad, foot rollers, uprights and safety racks as the card says (c1, c6);
   - any other the ruled note names (bench rack, EZ bar).
   Any part that moves between the end pose and the Mistake is a `poly` or an H9 line type. No file reads. A per-pose drawn-item test on the real spec (13.1).
5. The build and QA hook. Both scripts read lb2/rows.json through `rows(root, { batches: [...batchFiles(root).map(p => [p, read(p)]), ['tools/plates/library/lb2/rows.json', data]] })` (registry.mjs:30) and pass that set as groupsConfig's and candidateOf's `all`. Never write under batches/.
   - build.mjs: now, on main's tools.
   - qa.mjs: after LIB-3c is on main and merged in, through candidateOf(id, { all, authoring: true }).
6. Cards (the 7, once):
   - First commit: copy the 7 cards and quotes byte for byte from the research head the supervisor names.
   - Second commit: add top-level plateFacts, tempo and topFault per D-LIB9-CARDFIELDS, Q1, the ruled tempo map, the ruled fault→key map and 14.7's form rules. Each value names the claim whose quote states it. No value comes from a spec.
   - lb2/cards.sha.json records the research head sha and each card's sha256 without those three keys, in the canonical form the test states.
   - Post 'LB2 CARD FIELDS READY @ <sha>' and wait. The supervisor runs a fresh, blind Opus content verifier with one planted wrong number and Q1's two topFault checks. Fix only what it names; it re-runs for changed cards.
   - Each T row's params, and the claim on the row's own card that each one cites (D-LIB10-RANGES item 3), go to the same verifier: in the Do 6 run if the row exists then. Otherwise, on the head that adds the row and before its QA counts, a params-only run with one planted wrong param value. A changed param or cited claim re-runs it for that row.
   - If the research head moves for an LB2 card: copy it again, re-apply its keys, update cards.sha.json. If a cited claim changed, the verifier re-runs for that card and its plate is QA'd again.
7. Draw by family, following DRAWING-GUIDE.md: callouts from the card's checkpoints, tells from its mistake, and the ruled tempo. Order:
   a. H, after the H slice look: dumbbell_pullover (supine anchor dumbbell_bench_press; copied, never imported);
   b. BENCH, after the T slice look: incline_barbell_bench_press, close_grip_bench_press;
   c. SEATPRESS: only if the note's ruling makes arnold_press T, build the SEATPRESS template (Do 3), then arnold_press. If arnold_press is H, it is drawn in family a, and SEATPRESS waits for its first T child in a later batch.
   LB1's lessons, each with a drawn-item test where it applies:
   - The Mistake reads as a pose outside the solid end figure: red parts clear it by at least 6 px, or are drawn as red dashed lines over it. Test the clearance with the engine's bodyShapes at the plate's px/m (13.1; 13.4 must-fix 1; 13.7).
   - 2-3 tells, each a visible sign of the card's one fault. A one-tell plate needs a recorded reason, ruled per id (Q-D5-4). Tell words say what is drawn (13.4 must-fix 4).
   - Callout boxes sit in open space and leaders meet their anchor from the open side. No leader runs within about 6 px of the Trace, a bar or a cable (13.1).
   - A hidden start part is redrawn as a dashed phantom (Q2 (c)).
   - Ghosts follow the real joint path, through `via` keys where needed. A straight limb never bends between poses (13.3 must-fix 1 and 3).
   - Tests assert on drawn items, never on the spec's own formula (13.1; 13.4 must-fix 3).
   - A cue table per id: the card's `what` and claim, the plate cue, the word count (Q-D5-6).
8. QA (after the verifier's verdict, with LIB-3c on main and merged in, and for T rows the ruled family rows too):
   - build.mjs builds the LB2 plates page twice, to a temp directory; the bytes must match;
   - qa.mjs runs runQa's node and browser halves (Chromium at /opt/pw-browsers/chromium) per id through candidateOf(id, { all, authoring: true }), and prints the table: hard checks, raised flags (F5's element and value shown) and metrics.
9. Post the ready line with the per-id table. Then the supervisor runs the calibrated critic (plan 3.4; the pilot-a-critic.js pattern):
   - 2 hidden approved anchors (D-LIB10-ANCHORS) and 2 planted defects. A round counts only under 13.5's rule. Each anchor is scored on the facts it was approved with, and the supervisor diffs each anchor's facts.json against its spec's mistake and tells before the round (13.7).
   - The brief carries 13.6's rule: any pose fix a critic proposes keeps the drawn segment lengths and states them. A finding whose own fix breaks that does not count.
   - Fix only what the critic names. If a named fix needs longer limbs than the body has, post the arithmetic instead (13.6). A fix never edits a card. If a fix would break a hard check, a pinned test or a ruling, post the conflict with its evidence, and the supervisor rules.
   - One fix round, then a fresh calibrated recheck on the changed plates. After two failed rounds on one plate, stop and report.

Acceptance (each mutation must turn red, then be restored; list each one in the PR with its red line):
- A1 The note and each family's slice are posted before that family's bulk, with a cited mode reason per id. Evidence: PR comment links.
- A2 Composers use PRIMITIVES types only, and their moving parts are poly or one of the envelope's H9lineTypes. Mutations:
  - {type: 'wedge'} turns H9.type red;
  - one equipment item that moves between the end pose and the Mistake (for example the bar) swapped for a rackUpright gives exactly ['H9.moving-line:eq<i>.rackUpright.<j>'], after premise assertions that the swap replaced one item and that it moves (Q4 (a)-(b)).
- A3 Closures are pure and drawn by the vendor engine. For each id, closureOf(spec) passes, contains tools/plates/vendor/MANIFEST.json, has no path under tools/plates/layers/, no specs/ file but its own, and no template but its own. Mutations:
  - readFileSync added to a composer makes closureOf throw;
  - a spec importing tools/plates/layers/engine/body.mjs → red;
  - a spec or template importing a pilot A spec → red.
- A4 For all 7, every PQ-H1..H10 check passes in runQa node and browser, and the raised flags equal the note's expected set exactly. Mutations on one LB2 plate, each red:
  - LIB-3's M1-M7 as named in qa/mutations.mjs;
  - a colour literal (H2.colour);
  - its F5 tell chrome changed so F5 reads 3.40 (14.4 point 2).
- A5 lb2/rows.json holds exactly the 7, each once, counted in the raw text (a duplicate key is caught). Once pilot A is on main, the 4 reused ids sit in pilot A's batch file as on origin/main. dumbbell_fly is in no LB2 file. Mutations: drop a row; duplicate a row; a reused id added to lb2/rows.json.
- A6 PQ-H6: facts within ±2° or ±1 cm, tempo equal to the card's, F7 only where the note names it, and one form per fact. Mutations:
  - a fact +3° turns H6 red;
  - the card path removed gives H6:no-card;
  - a fact with both `joint` and `measure: true` → red.
- A7 Each template rebuilds its parent: make(parentParams, parentFacts), rebuilt alone, equals the parent's 9 pinned fragments. Unknown keys throw. Mutations:
  - one byte of one template constant → red;
  - a facts key outside the ruled schema → throws;
  - one parent fragment changed in memory → red.
- A8 Each T row passes PQ-H10 with LIB-3c's checks (D-LIB10-RANGES, D-LIB10-CHILDPROOF). Mutations:
  - a T spec that calls make and then edits its tempo → H10.child red;
  - a param outside its family's ruled range → H10.value red;
  - a value ruled for SEATPRESS only, used on a BENCH row → red (only if SEATPRESS exists; otherwise a value ruled for no BENCH key);
  - a raw-spec key in params → H10.raw.
- A9 Nothing ships (D-LIB10-AHEAD). lb2-plates.test asserts:
  - every lb2 row's stage is drawing or review;
  - none of the 7 drawn here is in shippedIds(), in any batches/ file, or in tests/howto/golden/library/, matched as whole tokens (`\b(lib_)?<id>\b`, and `(^|[^a-z0-9-])<slug>([^a-z0-9-]|$)` for the hyphen form); no file name there matches /lb2/i and no text names `"batch": "LB2"`. Before pilot A is on main, the 4 reused ids and dumbbell_fly are in no batches/ or golden file either;
  - once pilot A is on main: the 4 reused rows' stage, and pilot A's batch and golden files, equal origin/main's;
  - generate --check is green and unchanged.
  Each milestone post includes `git diff --name-only origin/main...HEAD`, showing nothing under batches/, tests/howto/golden/, src/ or tools/plates/gen/. Mutations, shown in the slice post: one row set to shipped; one set to approved-plate; rows.json copied into batches/; a file naming an LB2 id in tests/howto/golden/library/; a page-only lb2.json `{"entries":[{"kind":"page","batch":"LB2"}]}`; skull-crusher.layers.html with `data-id="skull-crusher"`; a reused row's stage changed. Control, stays green: a file naming only lib_smith_machine_bench_press (LB6). The only real id that holds an LB2 id inside it is lib_incline_barbell_bench_press (checked on exercises.json), so the test also asserts that this name matches incline_barbell_bench_press and not barbell_bench_press.
- A10 The plates page is deterministic (PQ-H7): two equal sha256 values.
- A11 A card differs from its research-head copy only in the three keys (cards.sha.json). The test holds its own copy of the ruled tempo table and builds each card's tempo only from it and plate.tempo. Mutations, each red:
  - any other card key edited;
  - (i) a Rest phase added to one card and its spec;
  - (ii) a constant added to tempo.json;
  - (iii) a Hold s that differs from the card's pause, set in card and spec;
  - (iv) a Hold of 0 s added to a pause-0 card;
  - (v) for each LB2 card whose ruled map has a Hold or a ruled constant, that phase removed from card, spec and tempo.json → red. If none has one, (v) runs on a test copy of one card with pause 1;
  - (vi) up and down swapped for one id, with card and spec rebuilt to match.
- A12 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head.
- A13 The content verifier is VALID (its plant caught) on the 7 cards' fields at the head's cards.sha.json, with Q1's two topFault checks, before any Do 8 evidence. Evidence: 'CARD FIELDS VERIFIED @ <sha>'. For each T row, the verifier has also checked each param against the claim rows.json cites, at that row's head (D-LIB10-RANGES item 3).
- A14 The critic run is VALID under 13.5's rule, and the supervisor's approvals are recorded per exercise.

verification: the per-id QA table, both plates-page sha256 values and each template's byte proof at the exact head sha. The verifier's and the critic's comments name that sha.

risk_and_recovery:
- Pilot A's merge is late (the LIB-8 merge card is not written yet: HANDOVER 8.0m, queue item 4): the templates and T children wait. The H plates, composers and cards go ahead.
- LIB-3c is late: T rows stay red at PQ-H10 (H10.envelope; envelope.json names no PARAMS key), which fails closed. No T evidence counts, and qa.mjs and Do 8 wait (D-LIB9-AUTHORQA arrives with LIB-3c). Draw the H plates meanwhile.
- Research's LR-31 or LR-33 head is late: Mistakes, decline's tempo and Do 6 wait. The note, declineBench and the H slice's end poses go ahead.
- A child needs anything outside PARAMS or the facts schema: it becomes H, about +2.5 Opus-hours [est]. Name it in the note.
- A template cannot rebuild its parent byte for byte [unverified until tried]: fix the template, never the parent. After two failed approaches, report; the supervisor rules (for example, its children become H).
- A pilot A golden update, or a new carried #109 head, moves a parent fragment: the byte proofs re-run, and every child is QA'd again.
- Once a child is approved, the template is frozen (plan 3.1:250). A later change (LB6's Smith children) is a v2 file.
- dumbbell_fly waits for LIB-20 and is never drawn here.
- F5 on every plate, under 14.4 only.
- The verifier corrects a fact: fix the field and re-QA that id. A plate drawn to a wrong fact is redrawn before the critic, never after approval.
- A plate cannot pass a hard check card-true (as horizontal_leg_press could not pass H3): it is HELD and reported. Any design option goes to the owner through the supervisor (LIB-ZOOM precedent). Any zoom view proposed for an LB2 plate shows no angle number (owner, lib-zoom-card.md:12, :34). Plate labels keep their sourced angles.
- How an EZ bar reads side-on: no EZ option in vendor barbell() (equipment.mjs:261) [unverified until drawn]. The note proposes it, and R2 judges it.
- A scratch fixture that targets an LB2 id: stop and report (D-LIB-SCRATCHIDS).
- Gate blocks seed LB2 ids (lib_barbell_bench_press on 17 lines, and dumbbell_bench_press, incline_dumbbell_press and dumbbell_shoulder_press). Whether a How-to button moves their pixels is for the ship card [unverified].
- Approvals are head-only: a later byte change re-runs the critic for the changed ids only.
- Two failed tries of one approach with no new evidence: stop and report on the PR.

return:
- the PR number and head sha;
- links to the note, both slices, the card-fields line and the ready line;
- the per-id table (mode, template or composer, hard checks, flags);
- the plates-page sha256 and each template's byte proof;
- the mutation list;
- the output of check, test:tz and the gate.

Resume rule: when you are WAITING, you resume only on the supervisor's exact words 'LIB-10 resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

---

Critic fixes applied (lib-10-critic.md; 26 of 26):
- B1: applied (A9 bullet, outcome, D-LIB10-AHEAD). Changed: "no file name matches /lb2/i" reads "no file name there matches": over the whole repo it would match tools/plates/library/lb2/ itself and turn A9 red on a correct head.
- B2: applied in D-LIB10-DECLINE; the card's H slice line drops "else it moves to b".
- H1: applied (build_prerequisites bullet; LB2 ids line). Merged with M1: the H slice may draw now, but each Mistake waits for the LR-31 head.
- H2: applied (build_prerequisites bullet, LB2 ids line, Do 1 tempo bullet, A11 (v)). "On a named head" reads "on a research head the supervisor names".
- H3: applied in D-LIB10-PA, merged with L1 (the merge card writes the keys; LIB-10 never writes them).
- H4: applied in D-LIB10-RANGES item 7; LIB-3c's card keeps registry.mjs byte-identical.
- H5: applied (D-LIB10-RANGES 4b; build_prerequisites T-row bullet; shared-file owners).
- M1: applied (start and Do 6 bullets, Do 1 fault→key bullet, D-LIB9-FACTPOSE). Merged with H1, H2 and M6: "H1 and H2 applied" reads "LR-31 and LR-33 applied"; Do 4's other composers wait for the ruled note.
- M2: applied (depends_on; merge_prerequisites). The T-slice bullet also names depends_on's yes.
- M3: applied in D-LIB10-RANGES items 3 and 6, and in write_scope (rows.json cites each param's claim) and Do 1. Changed: the item 6 test is worded as a mutation (child proof removed → the "make, then move one callout" test goes red), since a test cannot be red with its check removed and also pass.
- M4: applied in D-LIB10-RANGES item 6.
- M5: applied (Do 7 c, outcome, evidence, write_scope, A8, LB2 ids line, forecast, verification, return; D-LIB10-TEMPLATES).
- M6: applied (Do 1 composer bullet; start bullet).
- M7: changed as the supervisor ruled: no small card; LIB-3c lands #245's AUTHORQA hunk as its Do 1 (rulings item 10). Card lines that waited for #245 (start gates, Do 2 a, Do 5, Do 8, rulings list, risks) now wait for LIB-3c.
- M8: applied (CI manners).
- L1: applied (shared-file owners; write_scope sentence deleted; reserved_paths names those cards).
- L2: applied (T-slice bullet names D-LIB10-PARENTS; D-LIB10-PARENTS text).
- L3: applied (A9 mutations).
- L4: applied (risk line).
- L5: applied (merge_prerequisites).
- L6: applied (risk line).
- L7: applied (build_prerequisites, read_first; rulings head line).
- L8: applied (base). "Read them with `git show` only" drops "only", since L8 adds the worktree route.
- L9: applied in D-LIB10-CHILDPROOF item 3. Changed: LIB-3c cannot edit lb1-plates.test.ts (#245's file, not on main), so it reports the exact new keys and #245 changes its two D-copy expectations when it merges main, as amendment 21 did for LIB-3b.
- L10: applied in D-LIB10-PA.
- L11: applied in D-LIB10-ANCHORS.
- recheck N1: applied (rulings item 10: #245's candidate.mjs has no diff after it merges main; its two D-copy expectations change, and #245 takes them when it merges main, as with LIB-3b, section 13 amendment 21).
- recheck N2: applied.
- recheck N3: applied.
- recheck N4: applied.
- recheck N5: applied.
- recheck N6: applied.
- recheck N7: applied.
- recheck N8: applied.
- recheck N9: applied.

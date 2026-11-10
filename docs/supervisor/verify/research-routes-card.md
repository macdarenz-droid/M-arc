# RESEARCH-ROUTES-1: card edits the LIB-SHIP waves wait on

Status `ready` (supervisor, 11-05 ~03:00 UTC). This is one research lane for W4-W7 (D-OWNER-PARALLEL), in the W2B research form: Opus builder, the supervisor's 10 % re-fetch. Base: latest origin/main, on a new branch `claude/research-routes`. Read `claude/libht-research` (a48b0594) only for the W2B form and anything unmerged that touches the same files; report overlap as a question. Model: Opus.

## Why
Several wave rulings route a card-level fix to research. Wave builders never edit research cards. Until each edit is on main, its ids stay in droppable flip commits.

## Part 1: metadata edits (no new source; each edit cites its ruling)
| route | edit | ruling |
|---|---|---|
| D-SHIP-BACKBOX (ruling 6) | add the 21 back-linked ids to `docs/research/howto/shared/back-pain-box.json` `appliesTo` (the list in LIB-SHIP-DESIGN.md / plan; the W2B form) | lib-ship-card ruling 6; #392 Q-W5-9; #393 Q-W6-1 |
| F-W4-INHERIT | cable_shrug: drop `grip.wrist` and `grip.width` from `inherit[]`; dumbbell_shrug: drop `grip.wrist`; sumo_deadlift: drop `plate.equipment` | #391 Q-W4-5, Q-W4-9 |
| F-CARD-FRONTSQ-SETUP | front_squat: fix the inherited setup field that no golden path can hold (F-LB1-SETUP precedent) | #392 Q-W5-5(b) |
| (conditional) straight_bar plate.equipment | only if W5's equipment deep-equal red fails | #392 Q-W5-3 |
| (W7, if ruled) | items the W7 PLAN ruling routes here | #394 |

Each edit keeps every claim and quote. Removing a field from `inherit[]` changes no claim text, so the child's own claims then stand.

## Part 2: routes for held ids (new sources; the 10 % re-fetch applies)
**First, before the held ids (supervisor 11-06, D-STOPLINE-CLAIM, #391 6681022221):**
- **F-STOPLINE-CLAIM:** add one shared card under `docs/research/howto/shared/` (in the existing shared-card form) holding a claim that supports "Stop the set. Don't train through the pain.", with a fetched quote. Candidate sources: the one behind the app's `pain_red_flags` entry in `src/data/knowledge.json` (Finucane 2020, JOSPT, PMID 32438853), or the NHS pages the how-to red flags already cite. If no fetched quote supports stopping on pain, record "no source" and stop there. Never invent. Its `appliesTo` lists every library id with a stop line, on main and in W4-W7 (grep the sheets for "train through the pain" and "Stop the set"). Post it as its own READY as soon as it is done, so it can ride a train ahead of the rest of part 2.
- **F-CARD-INCLINEDB-RISK:** incline_dumbbell's own risk text overstates its source (#391 6653791551). Correct the claim text to what the quote supports.

These ids are held (S3) and on the owner's later-update list. Find sources so that each can return in a later wave. If no source supports a field, record "no source" and the id stays held. Never invent.
- bench_dip: thumb placement on the bench edge (F-CARD-BENCHDIP-HAND, #393 Q-W6-5).
- renegade_row: hand archetype and handle grip (F-CARD-RENEGADE-HAND, #393 Q-W6-6), plus its way-out.
- goblet_squat: thumb, wrist and way-out (#392 Q-W5-7).
- cable_external_rotation: a primary muscle, only if W6's D-SHIP-W6-NOPRIMARY fix fails (F-CARD-CER-PRIMARY).

## Files it may touch (write_scope)
- `docs/research/howto/cards/<id>.json` and `docs/research/howto/shared/*.json` for the items above; `sources.json` and quotes for new sources.
- Their MANIFEST keys, only in `[golden update]` commits (D-CROP-PIN form), plus any research-lint pins these files feed.
- Never: sheets, specs, pages, golden B, vendor, CI, `src/**` except generated output.

## Steps
1. Read `.claude/skills/builder/SKILL.md`, this card, and `lib4-cards.md` section 48 (research precedents: W2B, F-LB1-SETUP, the 10 % re-fetch).
2. Post `RESEARCH-ROUTES PLAN @ <sha>` on a draft PR from `claude/research-routes`: per item, the exact JSON edit and its ruling, and for part 2 the candidate sources.
3. Do part 1 first and post `RESEARCH-ROUTES PART 1 READY @ <sha>`. The supervisor re-fetches 10 % and checks the diff, then a fresh reviewer and a train follow, so the waves can flip.
4. Then part 2, and post `RESEARCH-ROUTES PART 2 READY @ <sha>`.

## Acceptance
- Research lint and `npm run check` pass; no claim text changes in part 1; every new claim in part 2 has a fetched quote.
- `npm run test:tz` and the gate pass on a READY head that contains the latest main.

# RESEARCH-ROUTES-4: routes for the last 8 rows (C and C/D)

Status `ready` (researcher draft for the supervisor, 2026-11-10; ruled below, "Supervisor rulings"). Refs read: research head `7f74d82d` (claude/libht-research, "Research head: RESEARCH-ROUTES-1 part 3 (#407)"); claude/sup-lib4-cards `9b59912e` (plan-w8.md, lib4-cards.md §48, lib-ship-card.md, lb9-research-card.md); main `d7b650a3`; content.md on claude/howto-options `d8d4b2e6`; PR comments by id, read with `gh api`. Card, quotes, CARD-V2 and RULINGS lines are on `7f74d82d`; tools, src and test lines are on `d7b650a3`.

## Supervisor rulings (2026-11-10 ~05:20 UTC; these win over the text below)
1. **D-RR4-JUMPSQ (Q3): Q-W7-9 stands, and the Q-W5-2 refusal is superseded for jump_squat.**
   - Q-W7-9 is the later ruling (#394 6647954465). It matches D-LIB10-PARENTS, under which the card parent "governs only copy inheritance and the D-LIB5-FAMILY comparator" (lib4-cards.md:3195). It also matches the code: with inherit `[]`, familyRefusal returns null (family.mjs:140).
   - jump_squat's own redFlags do not name the ankle, so shipping it does not depend on box_jump's box.
   - The Q3(b) edit may be made without waiting for the PLAN ruling. A3 still applies: the diff removes only the inherit entry and adds one notes line, and jump_squat.json:94 equals box_jump.json:405 byte for byte.
2. **Q4 pendulum_squat: accepted as drafted.** Its edit is to plate.frames itself; plan-w8.md:165's "inherit edits" is corrected here. Which point the plate draws is PF4's call.
3. **New publishers: accepted as drafted.** No house-source file exists, so the PLAN names every new publisher. A tier-A line that rests on one new publisher alone waits for the supervisor's ruling on the PLAN. Claims on established publishers do not wait.
4. **Q1/Q2: first searches.** No earlier search record exists for the arnold_press or skull_crusher way-outs. A full NO SOURCE log is an acceptable result.
5. **Q8 box_jump box: D-OWNER-RECOMMENDED covers the approval.** A red-flag box text is not on AGENTS.md's "Only the owner" list. D-OWNER-RECOMMENDED (lib4-cards.md:4830) is later than Q-W2-6 (:4709), so Q-W2-6's "after the owner approves it" is answered by it.
   - The supervisor approves or refuses the draft after A8, the tier-A safety checker and the supervisor's own re-fetch.
   - LR-27 R3: report the word count with every trigger kept. If it is over 30, the supervisor rules the cap with that count, as the back box's 50 came from R-W0-1. Never drop a trigger to fit.
   - The box is built later, under its own build card.
6. **The new verify record file `docs/research/howto/verify/research-routes.md`: accepted.** No file covers route records yet (one document per topic). RESEARCH-ROUTES-1's records stay on its PR comments.
7. **Budget:** the account's weekly usage is near its limit. The writer runs the fetcher as a Sonnet helper inside its own session, and it posts the PLAN and READY each in one comment.

## Id and branch
- RESEARCH-ROUTES-4. Create `claude/libht-research-routes-4` from the research head (`7f74d82d` when drafted; fetch it and name the sha you start from). Open a draft PR into `claude/libht-research`. Post 'RESEARCH-ROUTES-4 PLAN @ <sha>', 'RESEARCH-ROUTES-4 READY @ <sha>' and 'RESEARCH-ROUTES-4 FIXED @ <sha>'. Merge commits only; never write to the owner (lb9-research-card.md:15).
- Roles: one Opus writer for all 8 ids, and one Sonnet fetcher that is separate from the writer (R-W1-4; content.md 3.3). Fetch with curl only, never WebFetch or WebSearch. Research holds no LIB lane slot (D-LIB-LANE-ACTIVE; lb9-research-card.md:6).
- Not in this card: battle_ropes (a supervisor ruling, plan-w8.md:169) and every plate, sheet or layers step of these ids.

## Why now
- After W6 and W7, plate work reaches 134 of the 142. The last 8 rows need research or rulings (plan-w8.md:131-135; D-PLAN-W8, lib4-cards.md:4874-4879). This card is the research half for 7 of them, plus pendulum_squat's card edit (plan-w8.md:162-167). plan-w8.md:165 calls both frames items "inherit edits", but pendulum_squat's inherit[] is empty: its edit is to plate.frames itself.
- The holds, as recorded:

| id | class | hold (verbatim, cut with …) | where recorded |
|---|---|---|---|
| arnold_press, skull_crusher | C | "no sourced way to end a failed rep alone, and the card gap is LIB-WAYOUT" | #391 6653540190 (ruling E3); plan-w8.md:57-58; gaps arnold_press.json:634, skull_crusher.json:638 |
| jump_squat | C | "jump_squat is written and staged, and it ships with box_jump." … "The research route is refused." | #392 6647901307 (Q-W5-2); plan-w8.md:72; inherit jump_squat.json:11-13 |
| pendulum_squat | B + C | "R6 [3,4,3], the Trace is a 45 px knee stub. It needs the research card edit to `plate.frames`." | #405 6688665575; panels/pf8-findings.md:6, :17; plan-w8.md:117; pendulum_squat.json:548 |
| goblet_squat | C/D | "goblet_squat: held now under S3." … "with a research route for the thumb, the wrist and LIB-WAYOUT" | #392 6647901307 (Q-W5-7); lib4-cards.md:4757; plan-w8.md:71; goblet_squat.json:113, :115, :159, :165 |
| bench_dip | C/D | "no convention covers the thumb. Route: F-CARD-BENCHDIP-HAND." | #393 6647923934 (Q-W6-5); lib4-cards.md:4758; plan-w8.md:102; bench_dip.json:643, :645, :652 |
| renegade_row | C/D | "The card's archetype.hand is null, so assigning one would be a claim no card makes. Route: F-CARD-RENEGADE-HAND" | #393 6647923934 (Q-W6-6); lib4-cards.md:4758; plan-w8.md:105; renegade_row.json:9, :446, :641, :644-645 |
| box_jump | C/D | "A shared ankle red-flag box is new content in the app … its own later card, built from c14, after the owner approves it" | #379 6626980446 (Q-W2-6); lib4-cards.md:4709; plan-w8.md:39; box_jump.json:266, :590 |

- RESEARCH-ROUTES-1 part 2 searched goblet_squat, bench_dip and renegade_row and found no source (#398 6648392748; accepted #403 6683127888; lib4-cards.md:4779). Start from its record; do not re-run it as the answer. Combat Fitness was refused as a single off-list source, and Combat Fitness and ATHLEAN-X disagree on bench_dip's thumb (#398 6648279521, 6648297602). E3 sent arnold_press's and skull_crusher's way-outs to research after that record was posted; this draft found no search record for them on #398, #402, #403 or #407.

## Questions
Record each part as ANSWERED (claim ids), NO SOURCE (with its search log) or DISAGREE (each source's quote). Never invent a number. Record a range whole, and never pick one value from it or one side of a disagreement.

- **Q1, arnold_press (LIB-WAYOUT, E3): how does a lifter end a failed rep alone on a seated dumbbell press?**
  - (a) A quote that says what to do with the dumbbells when a rep fails or sticks and no spotter is there. The claim names the variant the quote was written for (Arnold press, seated dumbbell shoulder press, or another).
  - (b) Any "never" or direction a source gives for that bail-out, only as a quote. content.md 5.2's "Never over the face" has no quote yet (LR-30, RULINGS.md:37).
  - (c) Already known, and not the answer: dumbbell-kickup c5 (failed rep on the flat bench) and c6 (seated set-down at the end of a set); arnold_press c10 (a spotter, arnold_press.json:226). A shared claim is cited, never copied or edited (dumbbell-kickup's appliesTo lists arnold_press; LR-34).
- **Q2, skull_crusher (LIB-WAYOUT, E3): how does a lifter end a failed rep alone on a lying triceps extension?**
  - (a) A quote on ending a failed rep with no spotter. The claim names the bar (EZ bar, straight bar or dumbbells) and the bench as the quote does.
  - (b) A set-down at the end of a normal set, if a source gives one: a separate claim, never the failed-rep answer.
  - (c) Already known: c16 (a spotter the first time, and not too heavy too fast; skull_crusher.json:287).
- **Q3, jump_squat (no new source): drop `plate.frames` from inherit[].**
  - (a) Check that jump_squat.json:94 and box_jump.json:405 hold the same plate.frames string, and that the airborne convention is ruled (D-LIB8R-AIR, LIB-SHIP-DESIGN.md:573 on main).
  - (b) The edit: inherit[] (:11-13) becomes `[]`, and one notes[] line names this card and the ruling, in the RESEARCH-ROUTES-1 part 1 form (dumbbell_shrug, `11df6092`). The card has no notes key at `7f74d82d`, so the line creates it. `parent` stays box_jump. No claim, quote or other field changes.
  - (c) Why it frees the row: with inherit `[]`, familyRefusal returns null (tools/plates/library/lint/family.mjs:140), before the shipped-parent check at :146. This is the Q-W7-9 form, which lets reverse_crunch ship while crunch is held (#394 6647954465).
  - **Ruling needed first.** Q-W5-2 refused this route: "Dropping plate.frames from inherit[] would still leave box_jump as the card parent, so the child would ship before its parent" (#392 6647901307). D-LIB10-PARENTS says the card parent "governs only copy inheritance and the D-LIB5-FAMILY comparator" (lib4-cards.md:3195). The writer asks on the PLAN which ruling stands and makes no jump_squat edit until the supervisor answers.
- **Q4, pendulum_squat: what path does the Trace follow?** plate.frames (:548) ends "Trace follows the knee." The pf8 critics asked for the pendulum arc about the pivot: the shoulder pad (pf8-findings.md:6) or the hip (:17).
  - (a) The arc: wff-pend's quotes for c6 and c7 already say "the arc of the machine" and "the pendulum arc" (quotes/pendulum_squat.json:65, :81), but neither claim's text names the arc. The fetcher re-fetches both. If they are verbatim, the writer adds one claim, c23, for the arc. c6 and c7 are never edited.
  - (b) A source that names the pivot and the part that rides the arc (shoulder pads, back pad or the lifter's hips), for example a machine maker's manual or a coach page (verify/w0.md:55). Record only the part the quote names.
  - (c) The edit replaces only "Trace follows the knee." with a sentence that names what (b) found, or, if (b) finds nothing, "Trace follows the machine's pendulum arc (c23)." Which point the plate draws is the PF4 lane's call; the two critics differ.
- **Q5, goblet_squat (Q-W5-7): thumb, wrist and way-out.**
  - (a) Thumb: where the thumbs go in the goblet hold (round the handle, interlaced, or flat on the dumbbell head). The claim names the weight (an upright dumbbell, or a kettlebell by the horns or the bell).
  - (b) Wrist: a stated wrist position or angle for that hold; a number only if quoted. No convention covers it: "CONVENTIONS has no on-body entry" and "a 0-15° range is not a value" (Q-W5-7).
  - (c) Way-out: ending a failed rep, kept apart from the normal set-down. Combat Fitness's "Reverse the order to put it down" is a set-down, not a bail-out (#398 6648279521).
- **Q6, bench_dip (F-CARD-BENCHDIP-HAND): thumb and wrist on the bench edge.**
  - (a) Thumb: each source's stated thumb placement, every source read, each with its quote. The known ones disagree: Combat Fitness "thumbs close to your thighs", ATHLEAN-X "turn them out", and fv-benchdip's two finger directions (#398 6648279521; bench_dip.json:652). If they still disagree, the result is DISAGREE: no claim, grip.thumb stays "", and the positions go into the verify record as a finding.
  - (b) Wrist: a stated wrist angle or position. Placement ("shoulders … over your wrists", The Manual) is not an angle (#398 6648392748).
- **Q7, renegade_row (F-CARD-RENEGADE-HAND): hand, thumb and way-out.**
  - (a) Hand: a quote that says how the hand holds the dumbbell handle (for example a closed fist round it). "Neutral grip" (ggr-rr; c1, c6) is already on the card. archetype.hand (:9) stays null whatever is found: the archetype and a handle-grip key are a finding for the supervisor (Q-W6-6; LR-10).
  - (b) Thumb: wrapped or not, as quoted.
  - (c) Way-out: a set-down from the plank when form fails. The Coach page's knees-down is an easier version, not a bail-out (#398 6648392748).
- **Q8, box_jump (Q-W2-6): the ankle red-flag box from c14.** The box text is new app content. This card only finds and quotes sources and drafts the text as a finding; the supervisor routes its approval. Q-W2-6 asks for the owner's approval, and whether D-OWNER-RECOMMENDED (lib4-cards.md:4830) covers it is unverified (plan-w8.md:39). No shared file is written.
  - (a) Re-fetch nhs-ankle (https://www.nhs.uk/symptoms/foot-pain/ankle-pain/; c14 at box_jump.json:266, read 2026-10-03). Check that c14's two quotes are still verbatim, and record every tier on the page, including any 999 or A&E tier that c14 does not hold. A changed or new trigger becomes a new claim from c18; c14 is never edited.
  - (b) Draft the box in the LR-27 R1 form of the knee box (src/howto/archetypes.ts:32-44): name "Ankle pain"; now "<triggers>? Get it checked today."; doctor "<triggers>? See a doctor.". Map each trigger to its quote phrase, count words with words() (tests/howto/checks/c7.ts:117), and run the LR-27 R2 scan (RULINGS.md:34).
  - (c) LR-27 R3 says "At most 30 words per box; every NHS trigger stays." If c14's triggers do not all fit in 30 words, record that with the count. Do not drop a trigger and do not raise the cap; the supervisor rules it (the back box's 50 came from R-W0-1).
  - (d) In the finding only: the trigger words a RED_FLAG_BLOCKS entry would match (tools/plates/layers/artifact/copy-lint.mjs:75-84), and the appliesTo list. At `7f74d82d` only box_jump's redFlags name "ankle" (box_jump.json:586-589).

## What counts as a source (content.md 3.2-3.4; CARD-V2.md:18-24, :60-63, :71)
- The F-RESEARCH-2 rules apply (f-research-2-card.md:25-29): a `sources[]` entry has url, title, kind (guideline | peer-reviewed | coach | textbook), year and pmid; the fetcher adds access (full | abstract | summary | unreachable) and checked (ISO date). A claim stands only on full, abstract or summary. A page that no longer answers may carry an archiveUrl (LR-25).
- At most 50 verbatim words per quote, counted like words() in c7.ts, with where on the page it is. No free-text citations and no orphan sources. PubMed through NCBI E-utilities. ExRx and nsca.com answer 403 (content.md 3.4), so neither is cited.
- Tags: DATA for a number measured in a study. MECH or WEAK, with the words in the claim, when the quote was written for another exercise, variant, bench or bar (CARD-V2.md:63): a flat-bench bail-out used for the seated press, or a dumbbell line used for the bar, for example.
- No single off-list source (#398 6648297602). No file this draft found lists the house sources [unverified]. So the PLAN names every new publisher, and a part that rests on one new publisher alone waits for the supervisor's ruling before it becomes a claim.
- Not sources: a forum, a video without a transcript, an AI summary, search-result snippets.

## Output files and keys
Write only in docs/research/howto/cards/ and quotes/ for the 8 ids, and one verify record.

| id | new claims start at | fields an ANSWERED part may set (only as ruled on the PLAN) |
|---|---|---|
| arnold_press | c17 (the card ends at c16) | a new tierA.wayOut `{text, claims}` in the jump_squat.json:160 form; gaps[0] (:634) narrowed to what stays unsourced |
| skull_crusher | c19 (ends at c18) | the same; gaps[0] (:638) |
| jump_squat | j19 (ends at j18; none expected) | inherit[] (:11-13) to `[]`; one notes[] line |
| pendulum_squat | c23 (ends at c22) | the last sentence of plate.frames (:548) |
| goblet_squat | g15 (ends at g14) | grip.thumb (:113), grip.wrist (:115), tierA.wayOut (:159), gaps[0] (:165), unsourced[0] (:169) |
| bench_dip | c22 (ends at c21) | grip.thumb (:643), grip.wrist (:645), the last sentence of grip.note (:652) |
| renegade_row | c16 (ends at c15) | grip.thumb (:446), tierA.wayOut (:641), gaps[0] (:644), gaps[1] (:645) |
| box_jump | c18 (ends at c17; c10 does not exist, never reuse it) | none; the box draft is a finding |

- Each claim is `{id, text, tags, sources, quotes[{source, text, where}]}`, with the matching quotes-file entries. A part that ends NO SOURCE or DISAGREE leaves the card unchanged; its existing gap line stays.
- Verify record: a new `docs/research/howto/verify/research-routes.md` with one section, RESEARCH-ROUTES-4. RESEARCH-ROUTES-1 kept its records on PR comments (#398 6648392748), so no file covers this topic yet. Per part it holds:
  - the search log: each PubMed query with its hit count, and each page with its url, HTTP status and checked date;
  - the result (ANSWERED with claim ids, NO SOURCE, or DISAGREE with each quote);
  - findings: the box draft, renegade_row's archetype, and any other field change the evidence suggests.
- Nothing else changes: plate (except pendulum_squat's frames sentence), topFault, handlingMistakes, setup, risks, redFlags, plateFacts, tempo, every existing claim and quote, shared cards, RULINGS.md and CARD-V2.md.

## Steps
1. Read `.claude/skills/builder/SKILL.md`, this card and the hold comments above.
2. The fetcher fetches the candidates. The writer posts the PLAN: per part, the candidate sources with their HTTP status, every new publisher, the exact field edits, and the Q3 question. Fetching goes on while the PLAN waits; only claims that rest on one new publisher and the jump_squat edit wait for the ruling.
3. Write the claims and the record, run the pre-push check, and post READY. Then the verify, one fix round, FIXED, and the supervisor's merge.

## Acceptance
Every ANSWERED row names its claim id, the verbatim quote, the URL, the access level and the checked date.

| # | Row | Evidence | Verify check |
|---|---|---|---|
| A1 | Q1 arnold_press way-out | a claim from c17 that names its variant, tagged MECH or WEAK when the quote is not about a seated press; or NO SOURCE and its log | The critic re-fetches with curl and checks the quote is verbatim and the claim says no more than it (variant, failed rep or set-down, direction, hedge). It re-runs 2 logged PubMed queries, and the hit counts match. The tier-A safety checker answers yes, no or unsure. |
| A2 | Q2 skull_crusher way-out | the same, from c19 | the same as A1 |
| A3 | Q3 jump_squat | after the ruling, a diff against `7f74d82d` that removes only the inherit entry and adds one notes line; or "not made", citing the ruling's comment id | The verifier diffs the card, and confirms jump_squat.json:94 and box_jump.json:405 are byte-equal. |
| A4 | Q4 pendulum_squat | c23 with the arc quotes; (b) as a claim or NO SOURCE; the frames sentence changed | the same as A1 for each new claim. The only plate change is the last sentence of plate.frames. |
| A5 | Q5 goblet_squat | per part a claim from g15 that names the weight, or NO SOURCE; field edits as ruled | the same as A1. A range written as one value is a plant target. |
| A6 | Q6 bench_dip | a claim from c22, or DISAGREE with each quote, or NO SOURCE | the same as A1. No side of a disagreement became a claim. |
| A7 | Q7 renegade_row | claims from c16 or NO SOURCE; archetype.hand still null | the same as A1 |
| A8 | Q8 box_jump box | the finding: the draft lines, the trigger-to-quote map, the word count, the R2 scan, the R3 statement; any new claim from c18 | The critic re-fetches nhs-ankle. Every trigger in the draft is in a quote, and every quoted trigger is in the draft or listed as left out. The tier-A safety checker reads the draft. |
| A9 | Pre-push check | the checks in lb9-research-card.md:13: the JSON parses, every cited claim id exists, no orphan source, words() ≤ 50, the quotes file matches the card, the LR-27 wording scan, and main's copy lint and C8 at 0 hits | CI and the verifier run it again. |
| A10 | Verify VALID (LR-29; content.md 3.5) | A history-free copy of the changed card and quotes files and the verify record, with 2 plants. P1 is tier A: a new way-out claim loses its MECH or WEAK tag and its variant words, so a bench or end-of-set line reads as the id's own failed-rep way-out. Its KEY target is blocker. If Q1, Q2, Q5(c) and Q7(c) all end NO SOURCE, P1 instead marks one of them ANSWERED with a quote that is not on the page. P2 adds a trigger to the box draft that no nhs-ankle quote holds. | A blind Opus critic catches both plants. The tier-A safety checker runs on every tier-A id with a new line or draft (arnold_press, skull_crusher, goblet_squat, renegade_row, box_jump). The supervisor re-fetches every new claim (the batch is small, so this is more than the 10 % rule asks). Then one fix round, 'FIXED', and the merge. |

## The builder may not
- Write outside the 8 card and quotes files and verify/research-routes.md. That rules out shared cards, sheets, specs, sizes.json, tests, tools/, src/, MANIFEST, RULINGS.md and CARD-V2.md.
- Change an existing claim or quote, a field that the table above does not list, or a listed field before the PLAN ruling.
- Write a number that is not in a quote, convert units, pick one value from a range, or pick one side when sources disagree.
- Present a normal set-down, an easier version or a spotter as a failed-rep way-out.
- Steer the search toward an answer that frees a row. A "no" is a result.
- Edit jump_squat before the Q3 ruling; draw anything; approve the box text or message the owner; use WebFetch or WebSearch; merge its own PR.

## If there is no sourced answer
- The id stays held and its gap line stays. The fallbacks are the supervisor's: a GAP by ruling 8 (D-SHIP-HAND, lib-ship-card.md:140) or a convention in the D-SHIP-HANDW* form. If neither works, the row cannot meet 142 and goes to the owner as a choice (plan-w8.md:171).
- jump_squat: if the ruling keeps Q-W5-2, jump_squat ships with box_jump, as ruled.
- pendulum_squat: if Q4(b) finds nothing, the frames sentence cites c23 only.
- box_jump: the draft goes to the supervisor whether or not every trigger fits. The box is shown only after its approval and its own build card.

## Risks and mitigations
- **Every part ends NO SOURCE.** Part 2 found none for 3 of these ids, and each card already lists what it read. Those rows then cannot reach 142 (plan-w8.md:174). Mitigation: the full search log makes a "no" checkable, and the fallbacks above apply.
- **Two rulings pull apart on jump_squat.** Q-W5-2 refused the route; Q-W7-9 then accepted reverse_crunch shipping with its card parent held, because its inherit is `[]`. Mitigation: no edit until the PLAN ruling.
- **One coach source, or an off-list one, carries a tier-A line.** Mitigation: the PLAN ruling on new publishers, the tags, and the tier-A checker.
- **A line written for another bench, bar or weight reads as this id's own** (the seated press against the flat bench, LR-30; EZ bar against dumbbells). Mitigation: the CARD-V2.md:63 words and tags; P1 targets this.
- **The box text is new app content**, and LR-27 R3's 30 words may not hold every NHS trigger. Mitigation: it stays a finding; the supervisor routes the approval and rules the cap.
- **Re-copy after the merge.** Lanes pin the bytes of the cards they copied (the D-RR-HEAD form, #403 6683109532). Mitigation: the lanes re-copy at the merged head, outside this card.
- **Sources answer only some of the time** (ACE's 403 history, content.md 3.4). Mitigation: an archiveUrl (LR-25), and the log records each HTTP status.

## Forecast [est; this draft read no timings from earlier route batches]
- The writer and the fetcher take about 2 h for the 8 ids, not counting the wait for the PLAN ruling. The verify takes about 1 h and one fix round about 0.5 h. No lane slot is used.
- The uncertainty, as judgement: Q3 (once ruled) and Q4(a) are the likeliest to land. Q1, Q2 and Q5-Q7 will most likely end NO SOURCE, as part 2 did.

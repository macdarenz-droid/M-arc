F-RESEARCH-2: research for the held rows F-PALLOF-ARCH and F-LB10-STRIDE (draft card, 2026-10-29; follows the shape of lb9-research-card.md and lb10-research-card.md)

Refs read: research head `0d832e18` (claude/libht-research, Merge #318; HANDOVER.md:1003 on claude/sup-handover-1445); lib4-cards.md, lb9-/lb10-research-card.md and -verify.md on claude/sup-lib4-cards; LB9 lane claude/lib-21-resume @ `daf9f84b`; LB10 lane claude/lib-22-resume @ `4a0d7008`; content.md on claude/howto-options.

## Id and branch
- F-RESEARCH-2. Create branch `claude/libht-research-f-research-2` from the named research head (`0d832e18` when this was drafted; fetch it and name the sha you start from). Open a draft PR into `claude/libht-research`. Post 'F-RESEARCH-2 READY @ <sha>' and 'F-RESEARCH-2 FIXED @ <sha>'. Use merge commits only, and never write to the owner (lb9-research-card.md:15).
- Roles: one Opus writer for both cards, plus one Sonnet fetcher per card that is separate from the writer (R-W1-4). Fetch with curl only, never WebFetch or WebSearch (lb9-research-card.md:6). Research holds no LIB lane slot (HANDOVER.md:1471).

## Why now
- pallof_press (#326, LB9) is held because "a 12° arch at 1.03 px cannot reach 11.39 px at any allowed k" (lib4-cards.md:4416). The 12° comes from a convention, hanging_leg_raise.mjs:69, not from a source (lb9/sizes.json:196-199 on lib-21). LIB-ZOOM's best is 4.1 px at k 4, and the arch would need k ≥ 11.1 (lb9/DESIGN.md:420-421). The ruled route is "another stated tell or a sourced arch size", on its own card (lb9/DESIGN.md:422-423, :311).
- farmer_s_carry (#331, LB10) is held because "M_STRIDE 0.70 m has no basis (no quote, approved plate or measured convention)". That hold sends it to research, batched with F-PALLOF-ARCH (lib4-cards.md:4437). Its basis is only a stated reason, "an adult's normal walking step, about 0.7 m" (lb10/sizes.json:616 on lib-22). STRIDE 0.35 m is defined as half of it (:611). M_STRIDE feeds the Mistake deviation of 51.2 px (lb10/DESIGN.md:624, :650).
- This batch is next on the supervisor's list (HANDOVER.md:864, :889, :912). A held exercise is not delivered (HANDOVER.md:802).

## Questions
- **Q1, pallof_press (F-PALLOF-ARCH): what do the sources give as the pallof press's main fault, and how big is it?** Record each part:
  - (a) A size for the over-arched lower back: degrees of lumbar extension, a distance, or a stated comparison. It must come from a quote about this exercise. Any anti-rotation press counts (cable, band, standing or half-kneeling), and the claim names the variant.
  - (b) Another stated visible sign of the arch (a tell, for example ribs flaring or the hips pushing forward), with its size if a source gives one.
  - (c) The direction and size of each other fault: torso rotation (c7, three sources, card :167), the hands drifting toward the anchor side (c6, BarBend, card :145), and any new fault a source names. A direction (toward or away from the anchor) counts only when a quote states it.
- **Q2, farmer_s_carry (F-LB10-STRIDE): what step length backs the Mistake's "regular-sized steps" (c25, card :603) and the short steps (c8, card :183)?** Record each part:
  - (a) A step or stride length for a loaded carry (farmer's, suitcase or another loaded walk), or a step description that gives a size. The claim names the variant.
  - (b) A measured normal step length for adults walking, which is what "regular-sized" means. It must come from a gait source that says whether it means a step or a stride and names the height or population. The lane, not the card, scales it to the 1.75 m figure (farmer_s_carry.mjs:31).
  - (c) A measured convention the library already uses. That is either an approved plate's file:line on main that gives a walking step, or the library's body source, Winter 2009 (tools/plates/vendor/artifact/build-page.mjs:24 on main), if a readable copy gives a gait step length. Candidates to check: bayesian_cable_curl.mjs:36 and dumbbell_overhead_triceps_extension.mjs:33 set STEP 0.45 m for a split stance ("one step forward"), which is not a walking step. This draft did not check whether those plates are approved.
- Never invent a number. Record a range whole, because the lane draws its lowest value (D-SUP-LB9-RANGE, as read at lb9/DESIGN.md:263).

## What counts as a source (content.md 3.2 and 3.4; CARD-V2.md:18-24, :60-63, :71)
- A registry entry has url, title, kind (guideline | peer-reviewed | coach | textbook), year and pmid. The fetcher adds access (full | abstract | summary | unreachable) and checked (ISO date). A claim stands only on a full, abstract or summary source. A page that is no longer live may carry an archiveUrl (LR-25).
- Every claim quotes at most 50 verbatim words, counted like words() in tests/howto/checks/c7.ts, and says where on the page the quote is. There are no free-text citations and no orphan sources. PubMed is read through NCBI E-utilities. ExRx and nsca.com answered 403 (content.md 3.4), so neither is cited.
- When a number comes from another exercise, from walking without a load or from another version of the exercise, the claim text says so and carries the tag MECH or WEAK (CARD-V2:63; bench_dip-2 at lb9-research-card.md:10). A number measured in a study is tagged DATA.
- These are not sources: a forum, a video without a transcript, an AI summary, or a plate's PQ-H3 bar ("PQ-H3 is never a basis", lb9/DESIGN.md:244).

## Output files and keys
Research writers write only in docs/research/howto/{cards,quotes} (HANDOVER.md:262). Verify records go into the batch's existing files, never a new one.
- cards/pallof_press.json and quotes/pallof_press.json: new claims start at c20 (the card ends at c19). Each claim is `{id, text, tags, sources, quotes[{source, text, where}]}`, with new `sources[]` entries. When a question part finds no source, it gets one `gaps[]` line (CARD-V2:53) that names the sources and searches read.
- cards/farmer_s_carry.json and quotes/farmer_s_carry.json: the same, starting at c26 (the card ends at c25). The card's two existing gaps stay.
- verify/lb9.md and verify/lb10.md: update each with an F-RESEARCH-2 section that holds:
  - the search log: each PubMed query with its hit count, and each page read with its url and checked date;
  - the result for each part, either ANSWERED (with claim ids) or NO SOURCE (with the gap text);
  - any field change the evidence suggests, written as a finding.
- Nothing else on either card changes: plate (view, mistake, checkpoints, tells), topFault, handlingMistakes, plateFacts and tempo all stay as they are.

## Acceptance
Every ANSWERED row names its claim id, the verbatim quote, the URL, the access level and the checked date.

| # | Row | Evidence | Verify check |
|---|---|---|---|
| A1 | Q1(a) arch size | claim cNN with the size quote and the variant named; or a gap "no source read gives a size for the over-arched lower back" plus its log | The critic re-fetches with curl and checks the quote is verbatim. It checks the claim says no more than the quote (unit, direction, hedge, variant). It re-runs 2 logged PubMed queries and the hit counts match. |
| A2 | Q1(b) another tell of the arch | a claim or a gap | the same as A1 |
| A3 | Q1(c) rotation and hand drift: direction and size | one claim per fault with a direction quote, or a gap for each missing size or direction | the same as A1. A direction slip is a plant target. |
| A4 | Q2(a)/(b) step length | a claim with the number, whether it is a step or a stride, the height or population, and the tags | The critic re-fetches. Step or stride must be stated in the quote. A source that is not about a loaded carry carries MECH or WEAK. |
| A5 | Q2(c) convention | a file:line on main plus its approval line in lib4-cards (panel and sha), or "none" | The verifier opens the file:line at the named main sha and confirms the approval line exists. |
| A6 | Pre-push check | the checks in lb9-research-card.md:13: the JSON parses, every cited claim id exists, no orphan source, words() ≤ 50, the quotes file matches the card, the LR-27 wording scan, and main's copy lint and C8 at 0 hits | CI and the verifier run it again. |
| A7 | Verify VALID (LR-29; content.md 3.5) | A history-free copy of the 4 files with 2 plants. P1 is tier A, on a farmer_s_carry safety line, and its KEY target is blocker. P2 changes a number or direction in one new claim so it contradicts its quote. | A blind Opus critic catches both plants. The tier-A safety checker runs on farmer_s_carry. The supervisor re-fetches every new claim (the batch is small, so this is more than the 10 % rule asks). Then one fix round, 'FIXED', and the merge. |

## The builder may not
- Draw, render, or edit anything outside the 4 card and quotes files and the 2 verify files. That rules out specs, sizes.json, DESIGN.md, tests, tools/, src/, shared cards (cite them only, LR-29), RULINGS.md and CARD-V2.md.
- Change plate.view, plate.mistake (what, why, claim, drawable, rankNote), topFault, handlingMistakes, checkpoints, plateFacts or tempo. When the evidence suggests a change to the pick, drawable or view, write it in verify/lb9.md or lb10.md as a finding for the supervisor to route (the D-SUP-LB8-PILOTS shape, lb9-research-card.md:11). A CARD FIELDS re-verify follows any routed change (lb10-research-verify.md:45).
- Write a number that is not in a quote, convert units, scale to the figure, or pick one value from a range on the card.
- Steer the search toward a number that passes the bar. Record what the sources say, whatever it measures in px ("the drawing is not exaggerated", lib4-cards.md:1610).
- Use WebFetch or WebSearch, message the owner, or merge its own PR.

## If there is no sourced answer
- **Q1(a) or (b) answered:** this already fits the ruled route (lb9/DESIGN.md:422-423), and the LB9 lane takes it. Note the bar: a sourced arch needs about 33° to reach 11.39 px at k 4 [est: linear from 1.03 px at 12°; not measured]. A smaller sourced arch stays held unless the supervisor rules a higher kMax or another route, as was done for jump_rope (lib4-cards.md:4437).
- **Q1 answered only in (c):** moving the plate's Mistake off the arch needs two supervisor rulings. The first is on CARD-V2:36: whether "drawable" covers a fault that is too small to read, not only one the view hides. The second is on the turned view in lb9/DESIGN.md §20. Both go to the LB9 lane, and this card does not make either change.
- **Q1 with no answer:** pallof_press stays held under D-LIB21-PALLOFHOLD (lb9/DESIGN.md:311) and stays on the held list. Nothing is built.
- **Q2 with no answer:** farmer_s_carry stays held (F-LB10-STRIDE). The only alternative is a supervisor ruling that accepts a Q2(c) plate's step as the convention for "regular-sized steps". Without that ruling the row stays held. Whatever basis M_STRIDE takes, STRIDE moves with it (sizes.json:611).
- After the merge, and outside this card, the lane resumes put the new claim id into sizes.json's basis, re-render, measure H3, and go to a panel through the golden-update path (HANDOVER.md:421).

## Risks and mitigations
- **No sourced size exists.** Neither quotes file holds a size at `0d832e18` (checked: no degree, cm, inch or foot value). The search log makes a "no" checkable, and the fates above apply.
- **Step and stride are confused, a factor of 2.** The quote must say which one it means, and the claim repeats it. P2 may target this.
- **A number from another exercise or an unloaded walk is presented as the carry's or the press's own.** CARD-V2:63 requires the tag and the words, and the critic checks "inference from another exercise" (content.md 3.3).
- **A motivated search keeps only a passing number.** The full search log and whole ranges are recorded.
- **Card drift.** farmer_s_carry.mjs:4 cites research head `596dbe07`, and the card has changed since (18 lines of LB10 card fields). The lane re-reads the card at the merged head.
- **Sources are reachable only some of the time** (ACE's 403 history, content.md 3.4). Use an archiveUrl (LR-25).

## Forecast [est; this draft read no timings from earlier research batches]
- The writer and two fetchers take about 1-1.5 h.
- The verify (planter, blind critic, tier-A checker and the supervisor's re-fetch) takes about 1 h, and one fix round about 0.5 h. Then the merge.
- In all, about 3 h of wall time, and no lane slot is used.
- The uncertainty, as judgement: Q1 will most likely end NO SOURCE, because the 5 pages read hold no size. Q2(b) has the best chance.
- Releasing either row also needs a lane resume and a panel, which this forecast leaves out.

Research brief: LB4 cards: verify readiness, top fault (LR-31) and tempo (LR-33) (2026-10-22)

Who: one research session. model claude-opus-5-5 (every pick, rankNote and tempo call is judgement). mode auto. For plain fetches and word scans, use a helper that names `sonnet`, with curl only. Never Haiku. Research sessions are not builders and hold no LIB lane slot (D-LIB-LANE-ACTIVE).

Branch: claude/libht-research-lb4 (new), from origin/claude/libht-research (`38d5f9c6` when this was written; fetch it and name the sha you start from). Your first push opens a draft PR into claude/libht-research: 'research: LB4 top fault (LR-31), tempo (LR-33) and readiness'.

Why now:
- LB4 (plan 6.2: squats and lunges; LIBRARY-HOWTO-ARCHITECTURE.md:713 and :736-738 on claude/howto-options @ `b41ac833`) is the next batch after LB3 (LIB-14, plan :811). Its 12 non-pilot cards were LR-29 verified in g3 (docs/research/howto/verify/g3.md), and box_jump and reverse_lunge with pilot A (`e2a70bcf`) and W1 (verify/w1.md), all before LR-31, LR-33 and CARD-V2's 2026-10-18 edit (`a7d4fc98`). At `38d5f9c6` all 14 carry a rankNote written before LR-31; none opens "No source measures how often each fault happens."
- Building LB4 ahead (LIB-14) needs a named, verified research head. LR-31's rollout puts the pass before the batch's D-LIB9-CARDFIELDS fields are written (tracker LIB-TOPRANK).
- box_jump and reverse_lunge are pilot A plates, approved and held off the LIB-8 pin (D-LIB8M-NOSTRIP, lib4-cards.md:3305-3311). They are in this brief because their cards have no LR-31 rankNote.

The 14 ids (plan :736-738): front_squat, goblet_squat, bodyweight_squat, wall_sit, step_up, pistol_squat, box_jump, jump_squat, bulgarian_split_squat, walking_lunge, reverse_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat.

Rules:
- Fetch with `curl -sL` and a desktop browser user agent. Never use WebFetch or WebSearch: they summarise with a small model. A PubMed id uses its PubMed abstract page, a DOI its publisher page. If a source cannot be fetched, say so in the card's gaps; never quote from memory or a summary.
- Write only docs/research/howto/cards/<id>.json and quotes/<id>.json for the 14 ids above. Never touch app code, tools/, tests/, src/, RULINGS.md, CARD-V2.md, the census or any other card.
- A shown line changes only where a rule below says so, and then follows LR-27 (no source, study, organisation or referral words). handlingMistakes may be reordered; its text stays.
- Every quote you add or cite is fetched by curl, verbatim, and at most 50 words. A new claim gets its quotes/<id>.json entries (status verbatim).
- Merge commits only. Run `git pull --no-rebase` before each push. Never rebase, amend or force. Push only at the milestones below. Never use [skip ci]. Never merge your own PR. Never write to the owner.

Read first (on your start head unless named):
- docs/research/howto/RULINGS.md: LR-27, LR-28, LR-29, LR-31, LR-33, LR-36.
- docs/research/howto/CARD-V2.md, the whole file (these cards were last verified on 2026-09-30, before its 2026-10-18 edit, so every field must meet it), with :35-36 (rankNote, drawable) and :73 (the LR-31 rollout rule).
- How LR-31 and LR-33 ran on LB2, LB3 and pilot B: the #263 PR thread (rulings R-LB2-1 to R-LB2-27) and docs/research/howto/verify/w2.md; docs/research/howto/verify/lb3.md and docs/supervisor/verify/lb3-research-verify.md on claude/sup-lib4-cards (#272, R-LB3-1 to R-LB3-11); docs/supervisor/verify/pb-research-verify.md (#277, R-PB-1 to R-PB-5).
- The census rows for the 14 (docs/howto/library/inputs/census.json @ 4a9fd86 on claude/howto-options; unchanged at `b41ac833`): `view`. LR-36's viewWhy is each card's own plate.viewWhy.

Order: commit after the first six, then after each 4 cards (the six LB4 build-ahead rows first: front_squat, goblet_squat, bodyweight_squat, wall_sit, step_up, pistol_squat; then box_jump, jump_squat, bulgarian_split_squat, walking_lunge; then reverse_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat). Push at 'LB4 FIRST SIX @ <sha>' and at READY only.
- Order ruled by the supervisor (D-SUP-LB4-ORDER, 2026-10-22): these six go first because they can be built ahead. They are the plan's D rows (front_squat, goblet_squat, bodyweight_squat; plan :273) and three H rows (wall_sit, step_up, pistol_squat), none of them airborne or a T child of the held reverse_lunge (P:SPLIT).

(0) Readiness, on every card, before (a) and (b):
- CARD-V2 shape: every required field present and of the right form (run docs/research/howto tooling's dry run, as W2 did, and main's full copy lint with C8 on the shown lines: 0 hits required).
- Every shown line follows LR-27 (no source, study, organisation or referral words) and the owner's UI copy rule (no explaining text, headings 1-3 word noun phrases).
- Every claim's quotes are verbatim in quotes/<id>.json, at most 50 words, and re-fetchable by curl. A quote you cannot re-fetch is reported with the card, never kept from memory.
- Red-flag rows and risks follow the rulings the LB2 cards got (R-LB2-17, -19, -25: the red-flag box carries the referral; no "see a doctor" in shown copy).

(a) LR-31 (tracker LIB-TOPRANK), on each card:
- The fetcher scans every read source of the card for step 1's frequency words, and for quotes that tie a named fault to harm. It returns each hit verbatim, with source and place.
- You judge, by LR-31's steps:
  - candidates: a body or equipment position or movement during the set. Setup and equipment choices (seat or pad setting, the load, safeties chosen) and muscle-activity findings are not candidates;
  - step 1 (frequency), else step 2 (stated harm, with its tie order), else step 3 (lists). LR-31's list of words that are not frequency words applies as written;
  - a tie left after step 3 follows LR-36: the head's pick stays if the card's plate.viewWhy names it; otherwise stop that card (below).
- Write plate.mistake.rankNote: the step that picked the top fault, the claim ids, and each frequency or harm quote set aside with why. Open it as LB1's do: "No source measures how often each fault happens. LR-31 step N: ...". rankNote is never shown (LR-28).
- handlingMistakes[0] is the top fault: reorder, text unchanged.
- drawable is true when the census view shows the top fault. A fault seen only as speed is never drawable; a still sign stays drawable even when speed causes it. If drawable becomes false, plate.mistake names the drawable fault the same steps pick, and plate.mistake.why says so (assisted_pull_up, LB1).
- If the pick changes plate.mistake, its what, claim and why use words from the quotes. Report it on the PR as 'PICK CHANGED: <id>'.
- Pilot A cards (box_jump, reverse_lunge): their plates are approved and held (D-LIB8M-NOSTRIP). Nothing here changes a plate or its approved copy. A changed pick or drawable on one of them is reported the same way; the supervisor decides what it means for that plate (D-LIB5-TOPFAULT's stop rules hold the id).
(b) LR-33 (tracker LIB-TEMPO), on each card:
- plate.tempo's pause is the pause right after the concentric. A pause at another point (for example at the bottom) is never written in that field: it is named, with its sourced seconds, in plate.tempo.text or notes, as leg_press's optional bottom 1 s (c15) and decline_bench_press (R-LB2 rulings on #263). Sourced seconds are never replaced by the 1 s convention.
- Every card: check every quote on the card for a pause, hold, squeeze or stop, with seconds or a "brief" or "momentary" ask, and where it places it. Fix any card with the same fault: a pause filed in the wrong place; pause 0 while a quote asks for a pause right after the concentric (then 1, named a drawing convention in a WEAK tempo claim, per LR-33); null on a card whose up and down are numbers.
- At `38d5f9c6` all 14 have up, down and pause null. LR-33 keeps null on a card with no tempo seconds at all (jump_squat, front_squat). Two quotes files contain "paus", both placing it at the bottom: front_squat ("including pauses" in the deepest range) and jump_squat ("a very brief pause at the bottom"). Check that each is named in tempo.text or notes, never in pause.
- reverse_lunge's tempo stays as R-W1-1 ruled it (verify/w1.md:21-24: 3 s down and the bottom pause are progression lines, c15 and c16).
- The missing tempo strip for cards with no seconds is a design follow-up (D-LIB8M-NOSTRIP: research is not asked). Never add seconds to fill it.

Before READY:
- Every changed file is valid JSON.
- Dry run: each card's claims match its quotes file one for one, all verbatim; no orphan source; every quote at most 50 words. Copy lint and C8: 0 hits on the 14 cards.
- Commit, push, and post 'LB4 RESEARCH READY @ <sha>' with a table: id, readiness fixes, LR-31 step, pick (unchanged or changed), drawable, rankNote added, tempo change, new claims and quotes, fetch counts (sources, quotes, verbatim).
- Stopped cards: post 'STOP <id>: <the tied faults and quotes>' and go on with the others. The supervisor rules each; a ruled card is finished in the same PR.

(c) Verify per LR-29, before merge:
- The supervisor runs the verify by hand, as for #263 and #272: a history-free copy of the 14 cards and quotes with 2 planted errors (one tier A, a safety line). plantScope covers every field this PR changes, plus each card's handlingMistakes, plate.tempo and the claims they cite (the cards were verified in g3, as LB2's were before #263). A fresh, blind Opus critic re-fetches the sources, redoes LR-31 and LR-33 on every card, and checks every claim against its quotes. A run counts only if both plants are caught and the tier-A plant is rated blocker or high. Then the supervisor's 10 % re-fetch.
- You never plant errors and never see the answer key.
- Fix only what a valid run names, in one round, and post 'LB4 RESEARCH FIXED @ <sha>'. The supervisor rechecks the changed cards and merges your PR into claude/libht-research.

Return (in the PR body, kept current): PR number and head sha; the table above; every 'PICK CHANGED' and 'STOP' line; the dry-run, copy-lint and C8 results; links to the verify findings and your fix commit.

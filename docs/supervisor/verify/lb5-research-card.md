Research brief: LB5 cards: verify readiness, top fault (LR-31) and tempo (LR-33) (2026-10-22)

Who: one research session. model claude-opus-5-5 (every pick, rankNote and tempo call is judgement). mode auto. For plain fetches and word scans, use a helper that names `sonnet`, with curl only. Never Haiku. Research sessions are not builders and hold no LIB lane slot (D-LIB-LANE-ACTIVE).

Branch: claude/libht-research-lb5 (new), from origin/claude/libht-research (`38d5f9c6` when this was written; fetch it and name the sha you start from). Your first push opens a draft PR into claude/libht-research: 'research: LB5 top fault (LR-31), tempo (LR-33) and readiness'.

Why now:
- LB5 (plan 6.2: arms, PR a: 6 triceps, PR b: 13 curls; LIBRARY-HOWTO-ARCHITECTURE.md:714 and :739-743 on claude/howto-options @ `b41ac833`) follows LB4 (LIB-15 and LIB-16, plan :812-813). Its 16 non-pilot cards were LR-29 verified in g4 (docs/research/howto/verify/g4.md) on 2026-09-30, before LR-31, LR-33 and CARD-V2's 2026-10-18 edit (`a7d4fc98`). At `38d5f9c6`, 11 carry a rankNote written before LR-31 and 5 have none (reverse_curl, bayesian_cable_curl, preacher_curl, incline_dumbbell_curl, concentration_curl).
- Building LB5 ahead needs a named, verified research head. LR-31's rollout puts the pass before the batch's D-LIB9-CARDFIELDS fields are written (tracker LIB-TOPRANK). LR-33 names overhead_cable_triceps_extension for LIB-TEMPO.
- LB5's pilot A ids (triceps_pushdown, rope_triceps_pushdown, dumbbell_biceps_curl) got LR-31 in the LB2 research PR (#263; dumbbell_biceps_curl's drawable by R-LB2-27) and are not in this brief.

The 16 ids (plan :739-743): overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension, cross_body_hammer_curl, cable_curl, bayesian_cable_curl, preacher_curl, incline_dumbbell_curl, concentration_curl, wrist_curl, straight_bar_triceps_pushdown, single_arm_triceps_pushdown, alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, reverse_curl.

Rules:
- Fetch with `curl -sL` and a desktop browser user agent. Never use WebFetch or WebSearch: they summarise with a small model. A PubMed id uses its PubMed abstract page, a DOI its publisher page. If a source cannot be fetched, say so in the card's gaps; never quote from memory or a summary.
- Write only docs/research/howto/cards/<id>.json and quotes/<id>.json for the 16 ids above. Never touch app code, tools/, tests/, src/, RULINGS.md, CARD-V2.md, the census or any other card.
- A shown line changes only where a rule below says so, and then follows LR-27 (no source, study, organisation or referral words). handlingMistakes may be reordered; its text stays.
- Every quote you add or cite is fetched by curl, verbatim, and at most 50 words. A new claim gets its quotes/<id>.json entries (status verbatim).
- Merge commits only. Run `git pull --no-rebase` before each push. Never rebase, amend or force. Push only at the milestones below. Never use [skip ci]. Never merge your own PR. Never write to the owner.

Read first (on your start head unless named):
- docs/research/howto/RULINGS.md: LR-27, LR-28, LR-29, LR-31, LR-33, LR-36.
- docs/research/howto/CARD-V2.md, the whole file (these cards were last verified on 2026-09-30, before its 2026-10-18 edit, so every field must meet it), with :35-36 (rankNote, drawable) and :73 (the LR-31 rollout rule).
- How LR-31 and LR-33 ran on LB2, LB3 and pilot B: the #263 PR thread (rulings R-LB2-1 to R-LB2-27) and docs/research/howto/verify/w2.md; docs/research/howto/verify/lb3.md and docs/supervisor/verify/lb3-research-verify.md on claude/sup-lib4-cards (#272, R-LB3-1 to R-LB3-11); docs/supervisor/verify/pb-research-verify.md (#277, R-PB-1 to R-PB-5).
- The census rows for the 16 (docs/howto/library/inputs/census.json @ 4a9fd86 on claude/howto-options; unchanged at `b41ac833`): `view`. LR-36's viewWhy is each card's own plate.viewWhy.

Order: commit after each 5 cards and after the 9th (the H rows first: LB5a's overhead_cable_triceps_extension and dumbbell_overhead_triceps_extension, then LB5b's cross_body_hammer_curl, cable_curl, bayesian_cable_curl, preacher_curl, incline_dumbbell_curl, concentration_curl, wrist_curl; then the T rows: straight_bar_triceps_pushdown, single_arm_triceps_pushdown, alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, reverse_curl). Push at 'LB5 H ROWS @ <sha>' (after the 9th) and at READY only.
- Order ruled by the supervisor (D-SUP-LB5-ORDER, 2026-10-22): the H slice goes first. Its 9 rows are the plan's LB5 ids with no P or T mark (plan :714 gives H9).

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
(b) LR-33 (tracker LIB-TEMPO), on each card:
- plate.tempo's pause is the pause right after the concentric. A pause at another point (for example at the bottom) is never written in that field: it is named, with its sourced seconds, in plate.tempo.text or notes, as leg_press's optional bottom 1 s (c15) and decline_bench_press (R-LB2 rulings on #263). Sourced seconds are never replaced by the 1 s convention.
- Every card: check every quote on the card for a pause, hold, squeeze or stop, with seconds or a "brief" or "momentary" ask, and where it places it. Fix any card with the same fault: a pause filed in the wrong place; pause 0 while a quote asks for a pause right after the concentric (then 1, named a drawing convention in a WEAK tempo claim, per LR-33); null on a card whose up and down are numbers.
- overhead_cable_triceps_extension (named in LR-33): at `38d5f9c6` plate.tempo is {up 1, down 2, pause 1, claim c13}. c13's Motra quote "Pause briefly at the bottom to feel the stretch in the triceps." places the pause at the bottom stretch, not after the extension. So pause becomes 0, unless a quote on the card asks for a pause right after the extension; the bottom pause is named in plate.tempo.text or notes, as decline_bench_press's was. Its tempoNote cites Motra's "3-1-1", which no quote on the card holds at `38d5f9c6`: quote it verbatim or drop it. If quoted, check its digit order against R-PB-3 (smith's Motra "2-1-1" became a WEAK tempo claim because the page does not define the order).
- At `38d5f9c6` these pause-1 cards' tempo claims do not name the 1 s as a convention: straight_bar_triceps_pushdown c12, single_arm_triceps_pushdown c10, ez_bar_curl c12, cross_body_hammer_curl c11, concentration_curl c12, wrist_curl c10 (LR-33: LIB-TEMPO takes them). Each gets the WEAK convention claim where its quote places the pause right after the concentric and gives no seconds.

Before READY:
- Every changed file is valid JSON.
- Dry run: each card's claims match its quotes file one for one, all verbatim; no orphan source; every quote at most 50 words. Copy lint and C8: 0 hits on the 16 cards.
- Commit, push, and post 'LB5 RESEARCH READY @ <sha>' with a table: id, readiness fixes, LR-31 step, pick (unchanged or changed), drawable, rankNote added, tempo change, new claims and quotes, fetch counts (sources, quotes, verbatim).
- Stopped cards: post 'STOP <id>: <the tied faults and quotes>' and go on with the others. The supervisor rules each; a ruled card is finished in the same PR.

(c) Verify per LR-29, before merge:
- The supervisor runs the verify by hand, as for #263 and #272: a history-free copy of the 16 cards and quotes with 2 planted errors (one tier A, a safety line). plantScope covers every field this PR changes, plus each card's handlingMistakes, plate.tempo and the claims they cite (the cards were verified in g4, as LB2's were before #263). A fresh, blind Opus critic re-fetches the sources, redoes LR-31 and LR-33 on every card, and checks every claim against its quotes. A run counts only if both plants are caught and the tier-A plant is rated blocker or high. Then the supervisor's 10 % re-fetch.
- You never plant errors and never see the answer key.
- Fix only what a valid run names, in one round, and post 'LB5 RESEARCH FIXED @ <sha>'. The supervisor rechecks the changed cards and merges your PR into claude/libht-research.

Return (in the PR body, kept current): PR number and head sha; the table above; every 'PICK CHANGED' and 'STOP' line; the dry-run, copy-lint and C8 results; links to the verify findings and your fix commit.

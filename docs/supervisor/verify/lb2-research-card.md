Research brief: LB2 top fault (LR-31) and tempo (LR-33) (2026-10-18)

Who: one research session. model claude-opus-5-5 (every pick, rankNote and tempo call is judgement). mode auto. For plain fetches and word scans, use a helper that names `sonnet`, with curl only. Never Haiku. Research sessions are not builders and hold no LIB lane slot (D-LIB-LANE-ACTIVE).

Branch: claude/libht-research-lb2 (new), from origin/claude/libht-research (`0393aac` when this was written; fetch it and name the sha you start from). Your first push opens a draft PR into claude/libht-research: 'research: LB2 top fault (LR-31) and tempo (LR-33)'.

Why now:
- LIB-10 draws no Mistake on an LB2 plate, and writes no card field (its Do 6), until LR-31 is applied to that card on a research head the supervisor names. decline_bench_press's tempo also waits for the LR-33 fix of its c8.
- The LIB-8 merge card's blind TOPFAULT pass for the 4 reused pilot A cards needs a head where LR-31 is applied (D-LIB10-PA).
- No LB2 card has a rankNote at `0393aac`.

Rules:
- Fetch with `curl -sL` and a desktop browser user agent. Never use WebFetch or WebSearch: they summarise with a small model. A PubMed id uses its PubMed abstract page, a DOI its publisher page. If a source cannot be fetched, say so in the card's gaps; never quote from memory or a summary.
- Write only docs/research/howto/cards/<id>.json and quotes/<id>.json for the 12 ids below. Never touch app code, tools/, tests/, src/, RULINGS.md, CARD-V2.md, the census or any other card.
- A shown line changes only where a rule below says so, and then follows LR-27 (no source, study, organisation or referral words). handlingMistakes may be reordered; its text stays.
- Every quote you add or cite is fetched by curl, verbatim, and at most 50 words. A new claim gets its quotes/<id>.json entries (status verbatim).
- Merge commits only. Run `git pull --no-rebase` before each push. Never rebase, amend or force. Push only at the milestones below. Never use [skip ci]. Never merge your own PR. Never write to the owner.

Read first (on your start head unless named):
- docs/research/howto/RULINGS.md: LR-27, LR-28, LR-29, LR-31, LR-33, LR-36.
- docs/research/howto/CARD-V2.md :35-36 (the rankNote and drawable fields) and :73 (the LR-31 rollout rule).
- How LR-31 and LR-33 ran on LB1 and the 8: docs/research/howto/verify/w2.md, and the LR-31 and LR-33 sections of docs/research/howto/verify/w2/w2-rulings-final.md (the packet items: scan, pick, drawable and rankNote per card; rankNote wording; the assisted_pull_up and underhand_lat_pulldown changes; the machine_chest_press and leg_press tempo claims).
- The census rows for the 12 (docs/howto/library/inputs/census.json @ 4a9fd86 on claude/howto-options): `view`. LR-36's viewWhy is each card's own plate.viewWhy.

Order (12 cards):
1. decline_bench_press and skull_crusher first (LIB-10's H slice). Commit them, push, and post 'LB2 FIRST TWO @ <sha>' on the PR. Then go on. The supervisor may run the verify on these two first.
2. LIB-10's other draws: barbell_bench_press, incline_barbell_bench_press, close_grip_bench_press, arnold_press, dumbbell_pullover.
3. The 4 reused pilot A cards (dumbbell_bench_press, dumbbell_shoulder_press, incline_dumbbell_press, barbell_overhead_press) and dumbbell_fly.

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
- Pilot A cards: their plates are approved (D-PILOTA-R5) and will be pinned by the LIB-8 merge card. Nothing here changes a plate or its approved copy. A changed pick or drawable on one of them is reported the same way; the supervisor decides what it means for that plate (D-LIB5-TOPFAULT's stop rules hold the id).
- skull_crusher: its plate.mistake.why cites "the most common fault" (c7, retailer blog, WEAK). Check that quote against LR-31 step 1's wording before you count it.

(b) LR-33 (tracker LIB-TEMPO):
- decline_bench_press: plate.tempo is {up 1, down 2, pause 1, claim c8}. c8's WorkoutLabs quote: "use a 2:1:1 count. That is a count of two on the downward movement. Pause for a count of one. A count of one one the upward movement." That pause sits at the bottom, between lowering and pressing. LR-33: pause is the pause right after the concentric, and a pause at another point is never written in that field. So:
  - pause becomes 0, unless a quote on the card asks for a pause right after the press (then LR-33's rule for that pause applies);
  - the bottom 1 s is named, with its sourced seconds (c8), in plate.tempo.text or notes, as leg_press's optional bottom 1 s (c15);
  - c8's claim text says where the pause sits. Sourced seconds are never replaced by the 1 s convention.
- The other 11 cards: check every quote on the card for a pause, hold, squeeze or stop, with seconds or a "brief" or "momentary" ask, and where it places it. Fix any card with the same fault: a pause filed in the wrong place; pause 0 while a quote asks for a pause right after the concentric (then 1, named a drawing convention in a WEAK tempo claim, per LR-33); null on a card whose up and down are numbers. At `0393aac`, no quotes file of the other 11 contains "paus", so check the other words too.

Before READY:
- Every changed file is valid JSON.
- Dry run, as for W2: each card's claims match its quotes file one for one, all verbatim; no orphan source; every quote at most 50 words.
- Commit, push, and post 'LB2 TOPRANK READY @ <sha>' with a table: id, LR-31 step, pick (unchanged or changed), drawable, rankNote added, tempo change, new claims and quotes, fetch counts (sources, quotes, verbatim).
- Stopped cards: post 'STOP <id>: <the tied faults and quotes>' and go on with the others. The supervisor rules each; a ruled card is finished in the same PR.

(c) Verify per LR-29, before merge:
- The supervisor runs docs/supervisor/workflows/research-verify.js (on main) on your READY head:
  - a history-free copy of the 12 cards and quotes, with 2 planted errors, one of them tier A (a safety line);
  - `plantScope` covers every field this PR changes, plus each card's handlingMistakes, plate.tempo and the claims they cite, so both plants sit inside what the critic reads in full (W2 runs 1-3 were void without it);
  - `notes` asks the critic to redo LR-31 on every card: its own scan of each read source for step 1's words and for harm quotes; steps 1-3; LR-36 ties; drawable against the census view; each set-aside quote in rankNote checked verbatim. It also asks the critic to redo LR-33 on every card: where each pause quote places the pause, and pause, tempo.text and notes as LR-33 files them. Each pick, drawable or pause the critic would change is reported as a finding.
  - a fresh, blind Opus critic re-fetches the sources. A run counts only if both plants are caught and the tier-A plant is rated blocker or high (research-verify.js:63-70);
  - then the supervisor's 10 % re-fetch of the changed claims.
- You never plant errors and never see the answer key.
- Fix only what a valid run names, in one round, and post 'LB2 TOPRANK FIXED @ <sha>'. The supervisor rechecks the changed cards.
- The supervisor merges your PR into claude/libht-research and names that head to LIB-10 and the LIB-8 merge card. A changed pick re-runs LIB-10's CARD FIELDS verifier for that card (LR-31).

Return (in the PR body, kept current):
- PR number and head sha;
- the table above;
- every 'PICK CHANGED' and 'STOP' line;
- the dry-run result;
- links to the verify run and to your fix commit.

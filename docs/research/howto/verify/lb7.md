# LB7 research (lb7): writer record

Research session for library batch LB7, 2026-10-22. Brief: docs/supervisor/verify/lb7-research-card.md on `claude/sup-lib4-cards` @ `44344dec`. Branch `claude/libht-research-lb7`, from `claude/libht-research` @ `3812989f`. PR #288 (draft, into `claude/libht-research`).

## Scope
- 10 new cards: cable_lateral_raise and dumbbell_front_raise (children of dumbbell_lateral_raise), incline_push_up and diamond_push_up (children of push_up), and cable_rear_delt_fly, face_pull, cable_external_rotation, resistance_band_pull_apart, pike_push_up and bench_dip (each its own parent; content.md Appendix A).
- The LR-31 and LR-33 pass (lb4-research-card.md (0), (a) and (b)) on the 3 existing cards that lacked LR-31: bent_over_dumbbell_rear_delt_fly, renegade_row and weighted_dip.
- push_up (pilot B) already carries LR-31 (#277) and is not changed.

## How the cards were made
- **Writers:** four Opus writers, one per family: the raises with cable_external_rotation; the rear-delt cards; the push-up family; and the dips with renegade_row. Each read CARD-V2.md, RULINGS.md (all of it), the8.md, content.md 3.2-3.5 and 5.2 (`b41ac833`), the census rows (@ `4a9fd86`), and the lb4-lb6 supervisor verify records for precedent.
- **Fetching:** curl only, with a desktop browser user agent. WebFetch and WebSearch were never used. PubMed was read through E-utilities efetch, and PMC full text through efetch with db=pmc. Text found only in a page's served HTML (Motra's Tempo tooltip) counts as verbatim (R-LB6-7).
- **Fetchers:** one Sonnet fetcher per card, separate from the writer (R-W1-4). Each fetcher:
  - re-fetched every source;
  - set each quote's `status`, `closest` and `note`, and each source's `access` and `checked`;
  - scanned every read source, cited or not, for LR-31 step-1 frequency words, for harm words tied to a fault, and for LR-33 pause, hold and squeeze words.
  The writer then completed each rankNote from that scan, so that every frequency or harm quote about a fault that a step set aside is quoted with its reason.
- **Children (LR-34):** the 4 child cards have no inherit entries. Every line rests on the child's own claims, with quotes fetched by curl (way (1)). Each card's notes name the parent card @ `3812989f` and the shared cards it cites (palm-flat, floor-body, selector-pin).
- **Rulings applied at write time:**
  - D-SUP-PROTECT;
  - LR-31's list-sentence exclusion, read literally;
  - a "most people…" sentence about this exercise's own fault counts as a step-1 hit;
  - a speed-only fault is never drawable;
  - R-LB2-1 (tempo seconds from an exercise-specific source that fixes the phase);
  - R-LB3-4 and R-LB6-6 (stop lines);
  - R-LB6-9 (claim refs are a string or a list).

## Pre-push check (every card)
`check.mjs` (scratchpad tool) imports main's copy-lint.mjs and library lint unchanged. It checks:
- the JSON parses;
- every cited claim id resolves (including `inherit:<n>`);
- there is no orphan source;
- each quote is at most 50 words, counted like `words()` in tests/howto/checks/c7.ts;
- the card and the quotes file match one for one, and every quote is verbatim;
- CARD-V2 shape: 3 checkpoints, 1-3 tells, 2-4 zooms and the list caps;
- rankNote opens with LR-31's sentence;
- LR-33 has no null pause beside numeric up and down;
- muscle ids are in src/data/muscles.ts, with LR-35's roles;
- the LR-27/LR-23 and C8 wording on shown lines: main's lintHowto (contact, source and source-name patterns, own red-flag wording, claim wiring), medicalBans and C8's RED_FLAG_WORDING.

Main's copy caps (sentence length, label length, semicolons and the other BANNED style patterns) are reported as advisory, not as failures. Cards hold facts, and the sheet's words are written later under the full lint (CARD-V2). Earlier batches reported "0 hits" on cards that carry semicolons and long labels, so their gate was the wording rules. All 10 new cards have 0 advisory hits. The 3 existing cards keep the advisory hits on lines that no rule here changes.

Result: 0 problems on all 13 cards, except renegade_row's existing `core` in feel.secondary. LR-35 sends that to LIB-MUSCLE, and it is not changed here.

## Per card
RESULTS_TABLE

## Rulings asked (PR #288)
RULINGS_ASKED

## Writer calls the rules settle (recorded, not asked)
- bench_dip: "strain" counts as harm (lb6 precedent: low_to_high_cable_fly, PureGym's "minimising strain to the shoulder joint"). The flared elbows win whether or not "pressure" counts.
- renegade_row: the dumbbell landing on a corner is a still sign that BarBend names, so it is drawable even though speed causes it (LR-31). BarBend's "Often a symptom of going too heavy…" is about the cause, not how often the fault happens. If counted, it picks the same fault.
- pike_push_up: the way out is unsourced, so it is in gaps (LR-3) and joins the owner's tier-A gap list. Garage Gym Reviews' "Squeeze your glutes, traps, and delts in the end position." is in its push-press section, and Fitness Volt's "Pause for 1-2 seconds" is in its machine-press section. Both are other exercises, so pause stays null.
- bent_over_dumbbell_rear_delt_fly: ACE's "Squeeze your scapulae … as you reach the end position." asks for no pause, and it is written for the incline version, so pause stays 0. The ACE incline-reverse-fly fault lines are another exercise and are not counted.
- dumbbell_front_raise: the swing is drawable through BarBend's still sign, "push your hips forward".
- resistance_band_pull_apart: Fitness Volt's "which can, and often does, cause shoulder problems" is about the grip, which LR-31 excludes.
- face_pull: "Avoid shoulder pinching by keeping elbows high" counts as stated harm. Step 3 gives the same fault (BarBend's first list item).

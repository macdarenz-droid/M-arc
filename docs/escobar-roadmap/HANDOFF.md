# HANDOFF → Escobar proactive-coach implementation

**Status, 2026-09-21:** F0, rack swap (1), effort-graded rest (2), morning verdict (3), session-plan capture (10A/10AT), live autoregulation (4A-4T), warm-up ramp (5A-5T), chronic skip (6A-6T), closed-week review (7A-7T), lift trajectory (8A-8T), unfinished coach items (9A-9T), and session-debrief calculation/detector work item 10B are implemented and committed unit by unit on the working branch. Feature 10's read-only UI is next.

Claude Opus 5's committed architecture, ranking and shipped audit decisions remain the starting point. The earlier handoff recorded a session limit after three specs; this continuation closes those missing documentation deliverables. Original source baseline: `c3f467571f958c54e6447c7182ebf15c007d5947`.

## Start here: 10C only

Implement the read-only Finish and History plan-versus-actual component defined by spec 10. Use only `sessionDebrief` output; do not regenerate historical targets or add actions. Exact scope and next feature order are in [02-ROUTING-PLAN.md](02-ROUTING-PLAN.md).

Read:

1. Root `PROJECT_STATE.md` and `MODEL_ROUTER.md`.
2. [00-CODEBASE-BRIEF.md](00-CODEBASE-BRIEF.md), the inherited source map; verify each owner before editing.
3. [01-SCOREBOARD.md](01-SCOREBOARD.md), the unchanged candidate ranking.
4. [02-ROUTING-PLAN.md](02-ROUTING-PLAN.md), [03-SOURCE-VERIFICATION.md](03-SOURCE-VERIFICATION.md), then the assigned feature's spec.
5. `docs/COACH_BRAIN.md`, including shipped intelligence-audit decisions and the documentation-continuation entry.

## Project and goal

M/ARC is a Preact + TypeScript fitness tracker in `macdarenz-droid/M-arc`, branch `claude/phase-9-readiness-preference-ckw91g`. `proxy/` is the Cloudflare Worker fronting Claude Sonnet 5; the persona is Escobar. Turn the existing Ask-centered assistant into a proactive coach that uses real logged workout data at the moments people already visit.

The design's key finding remains: almost all shortlisted behavior requires no network; the deterministic brain already computes the needed evidence. Each spec defines full local behavior with the online coach off. Existing explicit optional explanations are not a prerequisite and receive no raw body data or historical plan arrays.

## Completed specification index

| Rank | Original composite | Specification | Documentation status |
|---|---|---|---|
| 1 | 24.8 | [Swap at the rack](spec-1-swap-at-the-rack--mid-session-substitutes-with-rea.md) | Source-checked and corrected |
| 2 | 24.1 | [Effort-graded rest](spec-2-effort-graded-rest-timer.md) | Source-checked and corrected |
| 3 | 24.0 | [Morning verdict](spec-3-morning-verdict--the-check-in-answered-against-you.md) | Source-checked and corrected |
| 4 | 23.5 | [Live autoregulation](spec-4-live-autoregulation.md) | Written |
| 5 | 22.9 | [Warm-up ramp](spec-5-warm-up-ramp.md) | Written |
| 6 | 22.8 | [Chronic skip](spec-6-chronic-skip.md) | Written |
| 7 | 22.5 | [Week in review](spec-7-week-in-review.md) | Written |
| 8 | 21.8 | [Lift trajectory](spec-8-lift-trajectory.md) | Written |
| 9 | 21.5 | [Unfinished coach items](spec-9-unfinished-coach-items.md) | Written |
| 10 | 21.2 | [Session debrief](spec-10-session-debrief.md) | Written |
| 11 | 21.1 | [Effort repair](spec-11-effort-rating-repair.md) | Written |
| 12 | 20.6 | [PR in reach](spec-12-pr-in-reach.md) | Written |
| 13 | 20.5 | [Consistency drift](spec-13-consistency-drift.md) | Written |
| 14 | 20.3 | [Near-miss records](spec-14-near-miss-records.md) | Written |

“Written” and “source-checked” do not mean implemented or feature-tested. New modules/functions are marked NEW in every spec. The verification inventory identifies current exports, private helpers, proposed declarations and corrections rather than claiming nonexistent functions already exist.

## Build dependencies that must survive the handoff

- `live.ts` is created in F0, then appended to. It serves features 1, 2, 4 and 5 here; the inherited fifth consumer, candidate 15, remains outside scope. Do not export the module through the brain barrel.
- Feature 10 has a separately committed **capture prerequisite** before 4/5/6: immutable original targets, stable entry identity and guarded history edits. Its finish UI comes later. Never reconstruct a past plan from a current split or the just-saved workout.
- Feature 4's shared effective target must agree across row placeholders, rest banner, warm-up and PR hint. Explicit acceptance alters suggestion metadata only, never actual logged sets.
- Feature 12 exports the existing PR helper once; feature 14 reuses it. Recorded PR semantics remain unchanged.
- Shared models/session/Train, report/contract/words/research, Coach/apply and existing test files have sequential owners in the routing plan. Only independent new modules/components/tests are safe for parallel drafts.
- New scalar Finding.metrics use the existing envelope. No proxy route, top-level payload field or validator relaxation is part of these specs.

## Constraints and gate

Brain decisions are pure `src/brain/**` functions; the model only phrases. Every displayed number has a source field. Proposals mutate only after a tap; facts and projections do not persist on appearance. Offline behavior is complete. Raw body measurements stay on device. No injury prediction, diagnosis or individualized medical guidance.

Before each implementation commit: app + proxy typecheck → both full suites → build → five-theme visual gate → live Playwright checks of that feature → dated decision log → commit → push → exact-commit CI green. Integrity, grounding or payload work is minimum T2 with T3 review. No Worker deployment is requested here.

The latest 10A/10AT gate passed app/proxy typechecks, 457 app tests across 35 files, 87 proxy tests with eight existing skips, production build, and the five-theme visual/migration gate. The live gate also restores an active snapshot after reload, renders it in lb, and checks 360 px overflow. Branch CI still requires an authenticated push of the exact commit.

## Existing work outside this implementation assignment

The intelligence-audit tiers 0–3 are already shipped; do not re-propose deload-aware targets, provenance/per-sentence grounding, stats snapshot, app map, self-model/correction/warmth/date rules, chat memory/stated constraints or typed actions. Earlier audit deployment was noted as requiring an authenticated machine; this pass did not deploy it or change its status.

Candidates 15–30 remain scored in the scoreboard but are not implementation assignments. No need to recover the old session-scoped raw agent output: the durable design artifacts are in this folder.

Router: follow root MODEL_ROUTER.md and end with NEXT.

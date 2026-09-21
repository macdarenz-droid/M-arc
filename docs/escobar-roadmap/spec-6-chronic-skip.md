# The exercise you always drop: chronic skip

> Name a repeated gap between an expected exercise and saved work, with the evidence quality stated plainly, then offer a specific cut or substitute that only applies on a tap.

**Rank:** 6 · composite 22.8 · design effort 4/10 · network never.
**Prerequisites:** spec 10 plan-capture for confirmed expectations; spec 1's substitution helper. Existing source baseline `c3f4675`. Legacy logs support a labelled comparison with the current template, not proof of what was planned in the past.

## User story

Coach says “Calf Raise was in the saved plan but had no work logged in 4 of the last 5 Legs sessions.” I can remove it from Legs or choose a familiar same-muscle replacement. If those sessions predate plan capture, it instead says “Calf Raise is in your current Legs split, but is absent from 4 of its last 5 logs. Older plans were not saved.” It does not tell me I skipped something the app cannot know was planned.

## Brain work

Type owners: `BrainContext` in `src/brain/coach/context.ts`; `Finding`, `Proposal` and their unions in `src/brain/coach/contract.ts`; `Session`, `Exercise`, `Weekday` in `src/core/models.ts`; `MuscleId` in `src/data/muscles.ts`. Import only the types used by this module.

NEW `src/brain/coach/detectors/skips.ts`, using BrainContext, Finding, finding/evidenceFrom from detectors/shared.ts, isWorkingSet, findExercise. Exact exports:

```ts
export interface SkipEvidence {
  splitId: string; exerciseId: string;
  basis: 'saved_plan' | 'current_template';
  sessions: number; missingSessions: number;
  from: string; to: string; sessionIds: string[]; missingSessionIds: string[];
}
export function skipEvidence(ctx: BrainContext): SkipEvidence[];
export function detectChronicSkip(ctx: BrainContext): Finding[];
```

Algorithm and NEW bands in `src/brain/coach/bands.ts`: `SKIP_LOOKBACK_DAYS = 56`, `SKIP_WINDOW_SESSIONS = 5`, `SKIP_MIN_MISSING = 4`, `SKIP_MAX_FINDINGS = 2`.

1. For each currently existing nonempty split, take its five most recent sessions with any real working set, day ≤today and ≥addDays(today,-56), ordered startedAt then id. Do not use another split's logs. Require five; no fallback to a smaller denominator. Discard future/invalid day keys and duplicate session IDs in the local calculation without mutating storage.
2. For each current template exercise, require a known canonical exercise. Resolve logged names/IDs through findExercise consistently with exerciseHistory; unknown aliases do not become evidence of omission.
3. If all five sessions have valid snapshots, include only a candidate expected with origin start in all five effective plans. Exclude snapshots where that candidate was replaced, removed as a planned adjustment before logging, or was an added exercise. An explicit skipped entry remains an expected absence; any actual working set of that ID means present. A today-plan drop never entered the effective start plan and is not a skip.
4. If all five sessions have no snapshot, basis current_template. Require the exercise to have actually appeared at least once in that split's earlier working history, so a freshly-added never-logged exercise cannot produce a false chronic-skip alert. This still does not prove historical expectations: keep the explicit limitation in copy. Mixed missing/valid snapshots return no finding until there are five comparable recent observations; do not blend inferred and confirmed denominators.
5. Missing means zero saved working sets, not fewer than planned sets. >=4 absences qualifies. At most two findings, ordered missingSessions desc, last day desc, then split/exercise ID. Never infer cause, dislike, pain or laziness from omission.
6. Construct `chronic_skip` via finding with target `${splitId}:${exerciseId}`, subject both IDs/names, confidence medium for saved_plan, low for current_template; severity 1. Add only chronic_skip to LOW_OK so its honest low-confidence legacy comparison can render. Metrics are `sessions`, `missingSessions`, `presentSessions`, `basis`, `exerciseName`, `splitName`. Compute presentSessions here. Window and evidence contain the actual five sessions. No snapshot objects in metrics.

NEW `src/brain/coach/planners/skips.ts`:

```ts
export function planSkips(ctx: BrainContext, findings: Finding[], profile: UsageProfile,
  swapBudget: number): Proposal[];
```

Use the strongest confirmed (`basis === 'saved_plan'`) chronic_skip finding only. Legacy comparison is informational with a “Review split” navigation action, never an automatically constructed removal proposal. Confirmed finding may generate two mutually exclusive alternatives:

- Cut: existing split_modify apply, splitId, add [], remove [exerciseId], setChanges []; do not offer if it is the sole exercise. Subject {splitId, splitName}, suffix `skip-cut-${exerciseId}`.
- Swap: call substitutes with current split IDs excluded, profile injected, max 1, and readiness/avoid derived from the same existing helpers as spec 1. Retain the original planned set count. Use existing exercise_swap apply with an explicit splitId (never global); subject {splitId, splitName, exerciseName}, suffix `skip-swap-${exerciseId}`. No candidate/no swapBudget → omit it, not invent one.

Use proposal() for both, confidence medium, basedOn [finding.id], expiresOn addDays(today,7). A current edit removing/changing the targeted exercise invalidates the proposal. Recheck source split membership and replacement validity on acceptance. Dismiss/accept is still routed through slices/coach/apply.ts. A displayed pair is one choice: its “Not now” dismisses both alternatives in one explicit handler; accepting one naturally invalidates the other on recomputation. Do not add a new ProposalKind.

In buildReport collect existing planSwaps first, then pass the remaining `MAX_SWAPS_PER_REPORT` budget to planSkips; combined exercise_swap proposals never exceed two. Exclude a cut if another current proposal already removes the same exercise, and do not offer both a chronic-skip swap and a plateau swap for the same exercise. This is coordination within report.ts, not a new global optimizer.

## Contract changes

New FindingKind chronic_skip. PRINCIPLES_BY_FINDING → `habit_formation_and_cues`, `exercise_variation`; add reverse memberships on those existing cards. CATEGORY_OF consistency; wordsFor specific case. Export detector and planner through their respective index.ts files; register using safe wrappers in report.ts. LOW_OK change is solely for explicitly-labelled current-template evidence. Existing proposal kinds/cooldowns remain.

words.ts renderProposal must inspect its `basedOn` findings: chronic-skip split_modify copy cannot use the existing “duplicates another lift” sentence; chronic-skip exercise_swap cannot say “has stalled”. Keep existing wording for every other cause. No proxy type, validator or payload change.

## Files to create / modify

Create `src/brain/coach/detectors/skips.ts`, `src/brain/coach/planners/skips.ts`, `tests/coach-skips.test.ts`, `tests/coach-skip-planner.test.ts`.
Modify `src/brain/coach/bands.ts`, `contract.ts`, `report.ts`, `words.ts`, `detectors/index.ts`, `planners/index.ts` under the same coach directory; `src/data/principles.json`; `src/slices/coach/Coach.tsx` for grouped alternatives and read-only navigation; `src/slices/coach/apply.ts` for stale-accept guards only; existing principles/words/fuzz tests; `docs/COACH_BRAIN.md`.

## UI spec

Use the existing Coach insight cards and the local InsightSheet/SuggestionSheet components in Coach.tsx (Insight and Suggestion themselves are words-layer types; do not import them as components). Group the two alternatives under one source finding in the existing suggestion area. Two wrap-safe Buttons: `Remove from {splitName}` / `Use {replacementName}`; one `Not now`. The sheet shows the exact split diff before mutation. Legacy insight's navigation label is `Review in Train`; it calls go('train') and changes no split.

| Copy | Source |
|---|---|
| `{exerciseName} was in the saved plan but had no work logged in {missingSessions} of {sessions} {splitName} sessions.` | Finding.subject names and scalar metrics; basis saved_plan |
| `{exerciseName} is in your current {splitName} split, but is absent from {missingSessions} of its last {sessions} logs. Older plans were not saved.` | Same fields, basis current_template |
| `Keep the work realistic for your current routine. Choose a change, or leave the split as it is.` | Literal, no inferred cause |
| `{splitName}: remove {exerciseName}` / `{splitName}: {exerciseName} → {replacementName}, same planned sets` | Existing apply payload resolved via findExercise/split lookup |

No notification or live pop-up. Empty evidence means no card. After acceptance, the current active workout and every historical session stay unchanged; future starts use the updated split. Dismiss is snoozed/suppressed by existing policy (feature 9 later adds its documented narrow reopen path).

## Data flow

Current split + five comparable saved logs/snapshots → skipEvidence → finding → safe report → confirmed-only planSkips → existing words and grouped suggestion UI → explicit acceptance → guarded existing split mutation → persistence → fresh report. Edit/delete/import changes sessions reference and invalidates the computed report; no separate skip cache or counter.

## Network and offline behaviour

Zero added calls. Both evidence paths work offline; confirmed mode becomes available only after enough saved plans, legacy stays explicitly inferred. On a later explicit existing explanation request, scalar metrics can pass through normal trimming/grounding; session IDs/snapshots never leave. Offline fallback is the complete local copy, not an empty card.

## Tests to write

- `four of five saved expectations yield a confirmed omission`; `three of five and four total sessions stay quiet`.
- `today-plan drop replacement and newly added exercise are not skips`.
- `any working set counts as present including duration and distance`.
- `legacy current-template comparison is labelled and has no cut or swap proposal`.
- `mixed snapshot quality cannot fabricate a denominator`; `removed split and unknown alias stay quiet`.
- `history edit delete import immediately changes finding`.
- `cut and swap use existing apply unions and explicit splitId`; `last exercise cannot be cut`.
- `combined swap budget is two including plateau swaps`; `conflicting alternatives disappear after accept`.
- `skip copy never claims duplication or plateau`; `metrics ground with unchanged validators`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not call absence a proven skip when only today's template exists; do not retroactively assign a plan.
- Do not count blank sets, discarded sessions, replacements or coach-approved day drops as missed work.
- Do not mutate the live workout or historical data when a future split changes.
- Do not bypass the two-swap ceiling, create another ProposalKind or reuse plateau/redundancy copy for another cause.
- Do not auto-delete disliked exercises, infer pain from missing work or send raw evidence to the proxy.

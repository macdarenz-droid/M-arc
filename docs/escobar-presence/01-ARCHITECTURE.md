# Implementation contracts

Status: proposed implementation specification; NEW names below are not existing exports. Baseline: `564df82`.

## 1. Experience and boundaries

Escobar is a consistent, quiet coach throughout Today, Train, History, Body, Coach and contextual Settings help. Keep the existing design tokens and five themes. Use a compact Escobar/E entry point and one useful cue, with details on demand. Keep all current workout controls and existing coaching features.

Voice follows **observed fact → relation to the agreed purpose → useful next step**. Steady and Direct change wording only. They cannot change intensity, thresholds, confidence, proposals, targets or acceptance. No automatic praise, shame, technique diagnosis, invented muscle growth, guaranteed physique or unmeasured physiological Training Effect. Keep a real PR visible even when plan fit is poor. The Garmin research supplies a product principle, not a scoring algorithm to copy.

Local guidance is complete without a network. Rendering, navigation, opening a panel and dismissing a local cue never send an AI request. Only explicit existing online actions can do so. No wearable integration, automatic programme mutation, new notification system, new proxy route/schema, Worker deployment or runtime-model change.

## 2. Flow and ownership

`saved goal / objective / plan + logs → existing deterministic brain → plan-fit projection → surface moment selector → local wording and UI → explicit guarded action → refreshed facts`

| Concern | Existing owners | Proposed addition |
|---|---|---|
| Shared facts and memoization | `src/app/selectors.ts`, `src/brain/coach/report.ts` | One cached presence snapshot; reuse existing report and existing review/trajectory results |
| Pure cue selection and wording | `src/brain/coach/words.ts`, existing report contract | NEW `src/brain/coach/moments.ts`, focused local copy module if useful |
| App-level panel lifecycle | `src/app/App.tsx`, `src/slices/coach/Coach.tsx`, `AskSheet.tsx` | NEW UI-only presence controller, reusable launcher/cue/local explanation; one Ask host |
| Durable optional metadata | `src/core/models.ts`, `src/core/store.ts` | Presence preference/dismissals, optional assessment, optional objective |
| Intent and agreements | `src/brain/debrief.ts`, `src/slices/workout/session.ts` | Capture once; append agreement facts at guarded mutation boundaries |
| Fair comparison | Existing debrief, PR and execution engines | NEW pure `src/brain/planFit.ts`; do not change established PR semantics |
| History editing | `src/slices/history/sessionEdit.ts` | Invalidate structural assessment evidence; retain stale-editor checks |
| Reviewed changes | `src/slices/coach/apply.ts`, existing typed actions | Reuse current review, acceptance and Undo paths |

Shared model/store/session/selector/Coach owners are sequential. Parallel agents may review or draft independent tests; do not let two agents edit the same mutation path.

## 3. Presence selector and persistence

NEW conceptual result:

```ts
type CoachingMoment = {
  id: string;                  // stable observation identity, independent of tab/tone/time ticks
  evidenceKey: string;         // hash of meaningful supporting facts only; local, never transmitted
  kind: string;               // closed union in implementation
  sourceIds: string[];         // existing finding/session/exercise IDs
  priority: number;
  reasonCodes: string[];       // closed union, used by grounded local templates
  action: ExistingActionRef | NavigationRef | null;
};
```

The selector is pure. It takes the current surface, cached facts, selected entity IDs, dismissal state and interaction state. It returns one eligible cue or null, with deterministic tie-breaking by priority then stable ID. UI context contains IDs, not stale copied session objects.

Priority: existing rest/confirmation/set-entry interaction retains control; an existing live adjustment or urgent in-workout cue suppresses an additional presence cue; then current-session purpose/feedback; then relevant existing proposal; then objective/review evidence. No eligible evidence means launcher only. Existing readiness/PR/rest/debrief messages count as occupied coaching slots: reuse or adapt them, never stack a duplicate copy. Operational controls remain visible regardless of selector outcome.

Store only optional presence preferences and explicit dismissals, under one new optional `coach.presence` object:

- `version: 1`, `tone: 'steady' | 'direct'`, default `steady`.
- `dismissed: Array<{id, evidenceKey, dismissedAt}>`, maximum 128, newest retained after valid explicit mutations.
- Same observation/evidence remains dismissed across tabs and reload. A materially changed evidenceKey can qualify again; tone, tab, minute/rest ticks and cosmetic wording must not change that key.
- Existing suggestion/proposal dismissals still use their existing handler; reuse that durable state instead of duplicating acceptance/cooldown logic. Baseline insight sheets only close: dismissal of a new informational cue uses `coach.presence`, not an assumed existing insight-dismiss action.
- Selection and rendering write nothing. No persisted duplicated report, copied body arrays, or cached inference presented as a new user fact.

Avoid whole-state reactive subscriptions for expensive work. Tab changes, typing in Ask, tone changes, dismissal UI and one-second rest ticks must reuse history-derived facts. Explicitly test report/history-scan call counts. A legitimate set/history/goal mutation may recompute dependent facts.

## 4. Shared contextual explanation and Ask

One application-level controller holds surface and selected entity IDs, open/closed state and transient draft. Each screen owns its existing header; insert a reusable launcher there rather than introducing a second header. Opening local explanation retains the current tab, selected item, scroll and unsaved inputs.

Reuse `AskSheet({onClose, initialTurnKey?, savedOnly?})` and the existing `coach.askThread`. Replace competing Coach mounts with the shared host. Add minimal UI-only context/initial-question support as needed. Opening the panel must not submit. Resolve selected IDs freshly on send/apply; deleted or changed entities produce a clear local state and require fresh review.

Critical: the current `AskSheet.send` relies on Coach's remote-enabled mounting. A global host MUST check the current `remoteEnabled` inside the send handler as well as disabling the composer. Keep local explanation and saved-action review available with online coaching off. One host owns the in-flight request; switching surfaces cannot duplicate it or lose the typed draft. Closing a panel alone must not create a second submission on reopen. Clear Ask, conversation reset, full reset and backup restore invalidate the old request generation and clear/reinitialize transient draft, prefill, context, error and review selection. Late success, error and finally handlers from that generation cannot change replacement state or a newer request's sending flag.

Do not nest modal dialogs. While an existing History/Settings/confirmation sheet is open, show inline local help or defer the global modal; retain the draft and restore focus after closing. Keep keyboard/Escape/screen-reader behavior.

Remote payload remains version 1 and uses existing `buildAskPayload`, grounding checks and caps. No `surfaceContext`, `objective`, `sessionPlan`, raw sets, body measurements or fingerprints fields. Detailed new plan-fit/body/objective explanations remain local. A visible editable question may name a known exercise or ask about an existing finding; do not covertly concatenate private metrics/prose into it. The 300-character question limit must not truncate the user's text to make room for a hidden prefix. Existing allowed findings/stats can be prioritized only within their current contract and limits. Preserve existing explicitly requested, validated programme drafts and acceptance guards.

## 5. Saved session intent and agreement journal

Add an OPTIONAL independently validated wrapper to `WorkoutPlanSnapshot`; keep existing `version: 1` and app-state compatibility:

```ts
assessment?: {
  version: 1;
  intent: {
    kind: 'normal' | 'easier';
    capturedAt: string;
    source: 'session_start' | 'accepted_deload';
    effortCap: Effort | null;
  };
  changes: PlanAgreementChange[];
  invalidatedEntryIds: string[];
  seenWorkingRows: Array<{ entryId: string; setIndices: number[] }>;
};
```

Capture only for NEW sessions, before work is entered. Normal uses `effortCap: null`; do not invent a strict ceiling from overlapping RIR bands. Easier is available through the existing accepted active deload, using its saved `easy`/`ideal` cap and actual adjusted targets. Show the purpose and any cap at the start and while training. Do not add a competing easier-day planner. No mid-session intent/cap editing in this delivery. Goal/deload changes later cannot rewrite captured intent. Older sessions and resumed old active sessions receive no backfill.

`PlanAgreementChange` is a discriminated union. Every event has a unique `id` and valid `acceptedAt`. Specific events:

- `targets`: `entryId`, explicit `{setIndex, target}[]`, `reason: 'max_below_target' | 'easy_above_target'` from the existing accepted live offer.
- `add`: the newly captured `entryId`.
- `replace`: `fromEntryId`, `toEntryId`; preserves the linked original entry.
- `remove`: the retired `entryId`.

Use canonical kg/seconds, existing target validators, and existing per-entry/per-set metadata caps. Cap journal events at 256. On overflow or ambiguous/corrupt graph, mark assessment unavailable instead of silently truncating it and declaring success; preserve logs and existing plan. IDs and links must be valid, unique and acyclic; events must refer to existing captured entries/valid indices. Journal order is authoritative for equal timestamps; timestamps are explanatory, not a way to reorder history. Normalization drops invalid assessment metadata only, retaining valid original plan/debrief and actual logs. Reject unknown versions. Do not silently reconstruct a journal from current UI state or acceptedTargets on old sessions.

Replay starts with only `origin: 'start'` entries active. Add/replace introduces a previously unseen captured destination whose origin/replaces agrees with the event. Remove/replace requires a currently active source; target events require a currently active entry and unique row indices. Preserve the existing one live-adjustment decision per entry. Reject double introduction, double retirement, targets after retirement and merging two obligations into an already active replacement. Existing swap Undo produces `A → B → A2` with a fresh captured ID; do not reactivate A or erase its events. Validate seenWorkingRows IDs/indices with the same caps and deduplicate them.

Historical journal/seen-row indices are validated against metadata bounds, not today's live array length or original target count. Adopted extra rows and subsequently deleted rows remain legitimate historical references. Actual row existence and untouched state are checked at acceptance time; structural invalidation handles later identity loss.

The original targets/counts/intent are immutable. Existing `acceptedTargets` and live `targetOverrides` remain compatibility projections of the new accepted target events for surviving entries with valid row identity. Update those projections and the journal atomically; prove they agree. Invalidated/retired entries may no longer have live overrides; retain their historical journal without demanding a nonexistent live projection. Never keep two independent effective-target algorithms.

Mutation rules:

1. Accept against fresh session/entry/evidence identity and entirely untouched affected rows. A weight-only, effort-only or other partial draft is touched. Accepting an old offer changes nothing.
2. Accepted targets apply to named remaining row indices only. A valid accepted target on an added row explicitly adopts that row; do not invent an original target for it.
3. `addSet` must preserve overrides on existing indices. The appended row has no original obligation merely because its input is copied from a preceding row. Its completed work is extra unless explicitly adopted.
4. Row deletion invalidates assessment for the entry. Track `seenWorkingRows` when a row meets existing `isWorkingSet` semantics; this remembers identity, not a copy of its values. Ordinary same-row correction/retyping, including temporarily blanking a field or toggling effort, stays assessable and does not itself set invalidation. On destructive remove/swap, use this sticky provenance to detect previously entered work even if now cleared. At finish, a previously working row now empty is lost evidence and invalidates that entry. Once a destructive boundary invalidates the entry, retain that fact through later retirement/Undo. This prevents clear-then-swap from fabricating success without punishing normal typing.
5. Approved no-work replacement/removal retires its original obligation. A swap/add-below creates the appropriate new captured entry and journal event; add-below keeps both entries. A replacement after clearing recorded work retains invalidation. Undo uses existing freshness checks and records the resulting agreement without erasing earlier history.
6. “Skip today” leaves expected work not logged; it is not an accepted reduction. Do not treat `excluded: 'skipped'` like an accepted no-work removal.
7. Finish keeps actual row identity through `actualSetIndices`. History value/effort edits recompute against the saved agreement. Structural edits/deletions invalidate affected entries, including deleting their final logged row. Preserve stale editor/effort-repair checks.

An unexplained mismatch between journal and compatibility projections for a surviving valid entry makes that entry unassessable; actual workouts remain usable. Explicit invalidation likewise adds an unresolved dimension without discarding valid evidence from other entries. Malformed wrapper/graph data still invalidates the wrapper as specified above. Mutation correction belongs in the same patch, with a regression, before plan-fit UI ships.

## 6. Deterministic plan-fit result

Keep three distinct outputs: achievement (existing PR/debrief), plan fit (new), and longer-term objective evidence. No stars, percentages, physiological impact estimate or universal judgement of the person.

Build expected slots keyed by `(planEntryId, setIndex)` from captured rows and valid agreements. Apply retired/add/replacement relationships; count a replacement chain's final obligation once. Overlay accepted targets for specific rows, including explicitly adopted extras. Pair actuals using valid `actualSetIndices`, never filtered-array position. **Do not use `debrief.plannedSets` as a denominator:** it retains retired/replaced entries. Do not repeat the last original target to manufacture an obligation for extra rows.

For supported history-backed rows: weighted load must match within existing `DEBRIEF_LOAD_EPS_KG` before comparing reps; bodyweight compares reps; duration compares seconds. At or above a target meets that work target. Assisted/conditioning remain unassessable initially. Starter/unavailable targets, mismatched loads, invalid mappings, missing required ratings and unadopted extra work are unresolved dimensions, not failure points. Missing effort is unresolved only for surviving logged working rows when a saved non-null effort cap applies. An expected row never logged is `not_logged`, not also `missing_effort`; distinguish it from lost evidence using seenWorkingRows. Effort ranks `easy < ideal < max`; extra reps/heavier load alone never proves excessive effort.

Return structured row results, factual counts, unresolved reasons, effective-change flag and witnessed cap breaches. A cap breach may be counted only on surviving, confidently linked work with valid captured intent; an invalidated/deleted mapping cannot support it. Select the label in this exact order:

1. No valid assessment/intent: **Not enough information**.
2. At least one witnessed rating above the saved cap: **Harder than planned**. If coverage is incomplete, disclose that next to the reason.
3. Any unresolved dimension: **Not enough information**, with what can still be compared.
4. Any expected row not logged or comparable row below target: **Less work than planned**.
5. Otherwise an effective accepted change exists: **Followed the adjusted plan**.
6. Otherwise: **Followed the plan**.

No expected work and no logged work is insufficient evidence, never a completed-plan success. A replaced/removed invalidated entry still contributes unresolved evidence even after retirement. “Not logged” is a statement about the app, not proof that no exercise occurred. An accepted adjustment followed successfully is not penalized for differing from the original. A real PR remains real in every branch.

## 7. Optional personal objective and reviews

Add one optional local `coach.objective` record, separate from the existing four `GoalId` presets:

- Version, stable ID, revision, created/updated timestamps.
- User statement, trimmed to 280 characters; optional priority muscles from the existing catalogue, max 3.
- Optional available weekdays (unique existing Weekday values) and equipment note, max 120 characters. These are stated preferences; saving does not edit the schedule/splits.
- One to three selected evidence measures: `consistency`, `lift_trend` with a valid exercise ID, `body_trend` using existing recorded Body data. Deduplicate; preserve raw body data locally.
- Optional future review day chosen by the user. Require future when newly selecting a date; retain valid past dates during normalization/import and unrelated edits so overdue reviews survive reload. This creates an in-app review cue, not a scheduled notification or guaranteed completion deadline.

Explicit Save confirms the objective; cancel writes nothing. A changed revision makes an open review stale. No automatic goal/split/target change and no inferred objective from chat. Missing/deleted exercise measures are shown as unavailable and can be edited; keep the rest of the user's statement. Invalid imports cannot destroy history or existing goals.

Review reuses actual attendance, existing lift trajectories, weekly review and recorded body trends with their confidence/estimate labels. Show baseline date, comparison date/window, measure source and limitations. Fewer than two relevant observations cannot support a trend. Training exposure is not muscle growth; a tape estimate is not direct measured body fat. Avoid a made-up overall progress score.

Coach holds the full agreement/review. Today gets at most one relevant due-review cue; Body explains the selected recorded evidence; Train shows purpose. Proposed plan changes go through existing explicit review/apply/Undo with fresh revision/evidence checks. If no existing typed action supports a desired change, offer navigation to the appropriate editor; do not create an unrestricted action executor. Objective prose, equipment note and new assessment arrays do not enter remote payloads.

# Unfinished coach items: changed evidence and stranded drafts

> Bring back a dismissed proposal only when new logged evidence materially strengthens it. Make existing, unapplied chat drafts reachable even when the online coach is off.

**Rank:** 9 · composite 21.5 · design effort 5/10 · network never.
**Status:** proposed implementation; source baseline `c3f4675`. NEW declarations below do not exist yet. This extends shipped chat persistence; it does not rebuild memory or change the action envelope.

## User story

I dismissed a suggestion twice. Weeks later, stronger logged evidence supports it, so Coach shows why it returned and lets me accept or dismiss it. A split draft I left in chat appears under “Unfinished”; Review opens the saved draft without asking Escobar again. Nothing applies on opening Coach.

## Brain work

Existing: `buildReport` in `src/brain/coach/report.ts` suppresses dismissKey counts ≥2, then checks acceptance cooldowns. `suggestionsFrom` in `src/brain/coach/words.ts` separately checks snoozes. `dismissProposal` in `src/slices/coach/apply.ts` stores a count and three-day snooze, not dismissal evidence. `AskThreadTurn` in `src/core/models.ts` has drafts/applied, scheduleDraft/scheduleApplied and actions/actionPrev; it has neither stable IDs nor timestamps. A non-null actionPrev marks an applied goal action. Do not invent an actions[].applied field.

NEW `src/brain/coach/reopen.ts` exports:

```ts
export interface DismissalEvidence {
  day: string;
  proposalFingerprint: string;
  reopenedOnce: boolean;
  findings: Array<{
    id: string; kind: FindingKind; severity: Severity; confidence: Confidence;
    sessionIds: string[]; sessionFingerprints: string[];
  }>;
}
export interface ReopenReason {
  dismissedOn: string; elapsedDays: number; newSessions: number;
  findingId: string; previousSeverity: Severity; currentSeverity: Severity;
  previousConfidence: Confidence; currentConfidence: Confidence;
}
export function dismissalEvidence(p: Proposal, report: FindingsReport, sessions: Session[], today: string): DismissalEvidence;
export function reopenReason(p: Proposal, report: Pick<FindingsReport, 'findings'>, previous: DismissalEvidence | undefined, sessions: Session[], today: string): ReopenReason | null;
export interface PendingCoachItem {
  key: string; turnIndex: number; turnFingerprint: string;
  kind: 'split' | 'schedule' | 'goal'; itemIndex: number;
  title: string; actionable: boolean;
}
export function pendingCoachItems(coach: CoachState, splits: Split[], schedule: Record<Weekday, string | null>, goal: GoalId, maxSplits: number): PendingCoachItem[];
export function askTurnFingerprint(turn: AskThreadTurn): string;
```

Import FindingKind/Severity/Confidence/Proposal/FindingsReport from `src/brain/coach/contract.ts`, state types from models.ts and GoalId from `src/data/goals.ts`. To keep persistent types independent of brain runtime, declare DismissalEvidence and ReopenReason in models.ts using type-only imports for the three contract unions; re-export those types from reopen.ts. No runtime brain import in core.

Deterministic reopening algorithm:

1. Canonical proposalFingerprint is JSON.stringify of `[p.kind,p.subject,p.apply]` with recursively sorted object keys; excludes id, confidence, dates, UI copy and optional reappearance metadata. Do not compare only dismissKey: the current proposal must still propose the same action as the dismissed one.
2. At an explicit dismissal, store only supporting findings named in basedOn, sorted by id, plus their evidence session IDs and a canonical fingerprint of each supporting session's `day`, `splitId`, and actual `exercises` fields. IDs and fingerprints remain on device. Cap records at 100 dismissKeys, evict oldest day then key; each finding stores at most 64 most recent supporting sessions. If support exceeds 64, do not offer reopening for that snapshot (an empty findings array is the explicit conservative representation).
3. Return null when previous.reopenedOnce is true, without a snapshot, with a future dismissal date, before 21 local days, after expiry (`today > expiresOn`), with a changed action fingerprint, or when any previously cited session was deleted/edited. No backfill for old dismissed counts.
4. Match a current supporting finding by exact id/kind. At least two distinct supporting working-session IDs must be new, with day strictly after the dismissal day and ≤today. A changed day/window alone is insufficient. Require severity to increase by ≥1, OR confidence to rise at least one rank with severity not decreasing. No arbitrary comparison across metrics with different meanings. Both evidence and a stronger finding are required.
5. Choose strongest increase, then most new sessions, then finding id. Return explicit numbers in ReopenReason. Acceptance cooldown and snoozes continue to take precedence. Reopening does not clear dismiss counts or reset them on render. A reappearance is offered once per dismissKey: accepting or dismissing that reopened card records reopenedOnce=true, so it can never reopen again. Ordinary dismissals retain the existing flag. Merely revisiting the same pending card is the same unconsumed offer, not another reappearance; no render-time “seen” write is needed. Only explicit Reset coach memory clears this limit.

Pending drafts: assistant turns only, newest first, item order split → schedule → goal. Split with applied[i] true, scheduleApplied true, actionPrev[i] non-null, or explicit dismissal flag is finished. Equal current schedule/goal is already satisfied and omitted. Unknown/deleted referenced exercises/splits are listed as unavailable, with Dismiss only; update drafts must never become creates when their target disappeared. A create at the maxSplits argument is unavailable; the slice supplies its existing MAX_SPLITS export. Brain code must not import slices/workout/splits.ts because it imports the store. Use existing `findExercise`, `GOAL_BY_ID`, the maxSplits argument and current draft validation rules; do not infer a draft from prose. A pending item's key is JSON.stringify of `[turnIndex,turnFingerprint,kind,itemIndex]`; fingerprint only immutable turn content and typed payload, excluding applied/dismissed/actionPrev. Recompute and compare before every action so bounded-thread eviction cannot target another turn. Do not claim an age for a draft.

## Contract changes

- NEW optional `CoachState.dismissalEvidence?: Record<string, DismissalEvidence>`, default `{}` through emptyCoach/store normalization; expose optional `BrainContext.dismissalEvidence` via contextFromState. Tests constructing ctx without it remain valid.
- NEW optional `Proposal.reopened?: ReopenReason`, local presentation metadata. buildReport uses reopenReason before suppressing count≥2. Existing `trimFindingsAndProposals` explicitly selects wire fields; do not include reopened/evidence in payloads or change CONTRACT_VERSION.
- NEW optional `AskThreadTurn.draftDismissed?: boolean[]`, `scheduleDismissed?: boolean`, `actionDismissed?: boolean[]`. Missing means false. Keep MAX_ASK_THREAD_TURNS and existing actions schema unchanged. Normalize malformed optional metadata away without dropping valid history or turns.
- Extend `dismissProposal(p: Proposal, today: string, report?: FindingsReport): void`; existing two-argument callers remain valid but cannot capture reopening evidence. Coach passes a freshly recomputed report. Keep `acceptProposal(p, today): string` and add fresh expiry/action validation before any write; do not remember success on a stale/no-op failure.
- NEW `dismissAskItem(item: PendingCoachItem): boolean` in `src/slices/coach/askMemory.ts`, the only new pending-item mutation helper. It reads current state, verifies fingerprint/index, immutably updates one flag, flushes, returns success. Existing pure appendAskTurn/updateAskTurn/clearAskMemory remain pure. resetCoachMemory clears dismissalEvidence; clearAskMemory clears flags by clearing the thread.

## Files to create / modify

Create `src/brain/coach/reopen.ts`, `src/slices/coach/UnfinishedItems.tsx`, `tests/coach-unfinished.test.ts`. Modify `src/core/models.ts`, `src/core/store.ts`, `src/brain/coach/context.ts`, `src/brain/coach/contract.ts`, `src/brain/coach/report.ts`, `src/brain/coach/words.ts`, `src/slices/coach/apply.ts`, `src/slices/coach/askMemory.ts`, `src/slices/coach/AskSheet.tsx`, `src/slices/coach/Coach.tsx`, `tests/coach-apply.test.ts`, `tests/coach-ask-memory.test.ts`, `tests/coach-explainer.test.ts`. No proxy production files.

## UI spec

Mount UnfinishedItems immediately before Coach Suggestions. Show at most three rows and a “Review all” button if more. Review opens the existing AskSheet at the saved turn; NEW props `initialTurnKey?: string` and `savedOnly?: boolean` retain onClose. Reuse the local SplitDraftAction, ScheduleDraftAction and GoalChangeAction components inside AskSheet; they are not exported APIs. Update their callbacks to revalidate the pending key **before** applying, then mark the exact current turn after success. Applied goal Undo must only restore when the current goal still equals the action's goal; otherwise say it has changed. This prevents a stale saved draft from overwriting a newer choice.

| Copy | Placeholder source |
|---|---|
| `Unfinished` / `Review` / `Dismiss` | Literal labels; Review is navigation, Dismiss is explicit persistence |
| `Split draft: {name}` | Typed draft.name, never inferred from answer text |
| `Schedule draft` / `Goal: {name}` | Literal / GOAL_BY_ID[action.goal].name |
| `This draft refers to something that has changed.` | PendingCoachItem.actionable false |
| `New evidence since you dismissed this {days} days ago: {sessions} more sessions support it.` | ReopenReason.elapsedDays/newSessions, local text only |
| `Review saved drafts. Online questions are off.` | savedOnly with remote disabled; composer disabled, local actions enabled |
| `This item changed. Review the current version.` | Fingerprint mismatch; no data mutation |

Keep ordinary accept/dismiss controls on reappearing suggestions. Update “Dismiss one twice and it stays away” in Coach's existing explanation to “Dismissed suggestions may return once if later logs provide stronger evidence.” Do not display two copies of the same pending item in Coach. Opening AskSheet in savedOnly mode sends no request, creates no turn and does not require opting in.

## Data flow

Explicit dismissal → snapshot current report evidence → persist local ledger → later saved logs change report → reopenReason → normal suggestion presentation → explicit accept/dismiss. Saved typed chat payload → pendingCoachItems → Review → fresh-key guard → existing application function → applied flag. All selectors/functions are read-only until an action.

## Network and offline behaviour

Zero new calls for either path. Reappearance text is deterministic and local, not passed to remote phrasing. Saved drafts work offline and with quota exhausted. savedOnly disables both the composer and question chips and independently guards the submit handler; relying on a disabled button alone is insufficient. Existing new-question submission stays opt-in; savedOnly never auto-submits or queues. No raw sessions, plan snapshots or fingerprints leave the device. Test ordinary buildPayload and Ask history serialization to prove the new local fields are absent.

## Tests to write

- `two dismissals stay suppressed without an evidence snapshot`.
- `twenty days never reopen and twenty-one days alone are insufficient`.
- `two new supporting sessions plus stronger severity reopen the same action`.
- `confidence increase requires new evidence and nondecreasing severity`.
- `edited or deleted supporting history invalidates reopening`.
- `accepted cooldown snooze expiry and changed apply payload beat reopening`.
- `dismissed or accepted reappearance consumes its one lifetime reopening`.
- `thread eviction cannot apply or dismiss the next turn by stale index`.
- `goal action uses actionPrev and never an invented applied field`.
- `deleted update target cannot create a split`; `MAX_SPLITS leaves create unapplied`.
- `offline Review sends no fetch and still applies an eligible saved draft`.
- `clear memory removes local ledgers and draft flags`; `wire payloads contain no local evidence`.

## Acceptance criteria

- [ ] Every named test in this spec passes, including empty, legacy, edited and deleted history.
- [ ] Only the explicit actions described above mutate state; all new brain functions are pure.
- [ ] App and proxy typecheck, both full test suites, production build, five-theme visual gate, and live Playwright feature checks pass. Run `npm run typecheck`, `npx tsc --noEmit -p proxy/tsconfig.json`, `npm test`, `npm --prefix proxy test`, `npm run build`, then `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (use an installed Chromium path if different).
- [ ] Live verification covers kg/lb, 360px and 390px, keyboard access, navigation away/back, reload/resume, backup export/import and the explicit accept/dismiss path. Inspect screenshots in all five themes; no overflow or console errors. No new component-test framework.
- [ ] Append a dated `docs/COACH_BRAIN.md` decision entry stating actual behavior and deploy consequence; commit this feature, push, and verify CI for that exact commit. No Worker deploy for this spec.

## Do NOT

- Do not simply remove the dismissed≥2 filter or lower the three-day snooze.
- Do not reopen for time alone, identical evidence with a new report date, or a changed action sharing a dismissKey.
- Do not add reminder notifications, an automatic chat message, embeddings, a queue or another endpoint.
- Do not treat prose as a draft, invent chat timestamps, or refetch an old answer.
- Do not apply before checking current turn identity, silently substitute a deleted split, or overwrite a later goal during Undo.
- Do not expose fingerprints or evidence sessions through generic report spreads.

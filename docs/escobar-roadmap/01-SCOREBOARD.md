# Escobar proactive-coach candidates — ranked scoreboard

30 canonical features, each scored by three independent judges (product value, engineering effort, architectural fit).
`composite = value*2 + differentiation + fit - noiseRisk*0.5 - effort*0.8 - (6 if constraint-violating)`.

| Score | Feature | Value | Diff | Effort | Fit | Noise | Frequency | Network | Sonnet-able | Spec written |
|---|---|---|---|---|---|---|---|---|---|---|
| 24.8 | Swap at the rack: mid-session substitutes with real targets | 7 | 7 | 4 | 8 | 2 | monthly | optional-enrichment | yes-with-care | yes |
| 24.1 | Effort-graded rest timer | 7 | 6 | 3 | 8 | 3 | every-set | never | yes-with-care | yes |
| 24 | Morning verdict: check-in answered against your own normal | 7 | 7 | 5 | 9 | 4 | daily | never | yes-with-care | yes |
| 23.5 | Live autoregulation: in-session target that answers the sets you just did | 7 | 8 | 5 | 9 | 7 | every-session | never | yes-with-care | yes |
| 22.9 | Warm-up ramp for the first heavy compound | 6 | 6 | 2 | 9 | 5 | every-session | never | yes-with-care | yes |
| 22.8 | The exercise you always drop (chronic skip) | 6 | 8 | 4 | 8 | 4 | monthly | never | yes-with-care | yes |
| 22.5 | Week in review | 7 | 6 | 5 | 9 | 5 | weekly | never | yes-with-care | yes |
| 21.8 | Lift trajectory: velocity, projection date and falsifiable expiry | 6 | 7 | 4 | 8 | 4 | weekly | never | yes-with-care | yes |
| 21.5 | Unfinished coach items: re-raised dismissals and stranded drafts | 6 | 7 | 5 | 8 | 3 | rare | never | yes-with-care | yes |
| 21.2 | Session debrief: plan vs actual on the finish screen | 7 | 7 | 6 | 8 | 6 | every-session | never | yes-with-care | yes |
| 21.1 | Effort-rating repair and calibration | 6 | 6 | 3 | 9 | 7 | every-session | never | yes-with-care | yes |
| 20.6 | PR in reach (pre-set record badge) | 6 | 6 | 3 | 8 | 6 | every-session | never | yes-with-care | yes |
| 20.5 | The day that died (consistency drift) | 6 | 7 | 5 | 8 | 5 | rare | never | yes-with-care | yes |
| 20.3 | One rep short: near-miss records | 6 | 7 | 4 | 8 | 7 | every-session | never | yes-with-care | yes |
| 20.1 | Pre-set brief: one line when a muscle is sore or under-recovered | 6 | 6 | 3 | 8 | 7 | every-session | never | yes-with-care | no |
| 20 | Recovery debt: a measured, receipted deload trigger | 6 | 6 | 5 | 9 | 6 | monthly | optional-enrichment | yes-with-care | no |
| 19.8 | Recovery projected forward: what is out, until when, why, and what fits next | 6 | 6 | 4 | 8 | 6 | every-session | never | yes-with-care | no |
| 19.1 | Ask Escobar about this session (remote explain at finish) | 5 | 6 | 3 | 7 | 3 | every-session | required | yes-with-care | no |
| 18.8 | What this session changed: week shift and report diff | 6 | 8 | 4 | 6 | 8 | every-session | never | yes-with-care | no |
| 18.5 | Cadence honesty: week pace, streak at risk, missed day | 6 | 7 | 5 | 7 | 7 | daily | never | yes-with-care | no |
| 17.7 | Session execution patterns: pace, duration creep, slot and time-of-day | 5 | 8 | 6 | 7 | 5 | rare | never | needs-human-judgment | no |
| 16.5 | Balance drift over sixteen weeks | 5 | 6 | 5 | 8 | 7 | monthly | never | yes-with-care | no |
| 14.3 | Body trend read against the lifts **[BLOCKED]** | 6 | 7 | 4 | 7 | 5 | monthly | never | yes-with-care | no |
| 14.2 | Programme audit: the split has gone stale **[BLOCKED]** | 6 | 8 | 6 | 7 | 4 | rare | never | yes-with-care | no |
| 14.2 | Goal versus reality **[BLOCKED]** | 6 | 8 | 6 | 8 | 6 | rare | never | yes-with-care | no |
| 13.2 | Notifications rewritten from today's report **[BLOCKED]** | 6 | 7 | 6 | 7 | 4 | daily | never | yes-with-care | no |
| 13 | Self-calibrating progression (target adherence replay) | 4 | 7 | 5 | 6 | 8 | every-session | never | yes-with-care | no |
| 12.2 | The pain ledger and follow-through on what you said **[BLOCKED]** | 6 | 8 | 6 | 6 | 6 | rare | optional-enrichment | yes-with-care | no |
| 10.5 | Attention governor and the one-line headline **[BLOCKED]** | 5 | 6 | 5 | 7 | 5 | daily | never | yes-with-care | no |
| 7.8 | Explain or ask from any card **[BLOCKED]** | 5 | 3 | 4 | 6 | 4 | every-session | required | yes-with-care | no |

## Per-candidate detail

### Swap at the rack: mid-session substitutes with real targets
_The squat rack is taken or the shoulder is complaining — three substitutes that share the muscle, each arriving with its own real target instead of a blank card._

- **Composite** 24.8 · value 7/10 · differentiation 7/10 · effort 4/10 · fit 8/10 · noise-risk 2/10
- **Fires:** monthly · **Network:** optional-enrichment · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/live.ts — new `substitutes()`; plus a ~6-line refactor of src/brain/coach/planners/shared.ts to export a ranked list (`rankExercises(o): Exercise[]`, with `pickExercise` becoming `rankExercises(o)[0]`), because `pickExercise` currently returns only the single best candidate and this feature needs the top three.
- **Proxy change:** none - app only. No FindingKind, no ProposalKind, no payload field, no `words.ts` case, no `principles.json` card, no `validateText()`/grounding path — the feature is deliberately not a Proposal, which removes the entire 8-to-13-touchpoint contract checklist that normally dominates coach work. Only the COACH_BRAIN.md decisions-log row is required.


### Effort-graded rest timer
_The rest timer is graded by the effort you tapped and whether the lift was a compound, and the banner tells you what the next set actually is._

- **Composite** 24.1 · value 7/10 · differentiation 6/10 · effort 3/10 · fit 8/10 · noise-risk 3/10
- **Fires:** every-set · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/live.ts (new file — does not exist yet; shared with feature 1), exporting `restFor()`; plus REST_EFFORT_MULT / REST_COMPOUND_MULT / REST_FLOOR_SEC / REST_CEIL_SEC / REST_REGRADE_WINDOW_SEC added to the existing src/brain/coach/bands.ts
- **Proxy change:** none - app only (needsNetwork: never; no payload field, no FindingKind/ProposalKind, so none of the 9-file contract ritual applies)


### Morning verdict: check-in answered against your own normal
_The check-in stops being data entry: the moment the third tap lands, Escobar says what today looks like relative to this person's own normal, and names the one thing it just changed._

- **Composite** 24 · value 7/10 · differentiation 7/10 · effort 5/10 · fit 9/10 · noise-risk 4/10
- **Fires:** daily · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/readiness.ts (readinessBaseline / readinessToday / readinessVerdict + deterministic verdict copy); new bands in brain/coach/bands.ts for the 28-day window, 6-entry minimum, 0.4 MAD floor and the -1.5 / -0.75 / +1 z cuts
- **Proxy change:** none - app only. The widened `detectReadiness` metrics ride inside `Finding.metrics`, already an opaque `Record<string, number|string|boolean>` the proxy passes through; no new top-level payload field, so no `onlyKeys` or `proxy/src/types.ts` edit, and `needsNetwork: never` means no route work at all.


### Live autoregulation: in-session target that answers the sets you just did
_When a set lands materially off its own target, one line appears under that row offering to re-aim the remaining sets — and then gets out of the way._

- **Composite** 23.5 · value 7/10 · differentiation 8/10 · effort 5/10 · fit 9/10 · noise-risk 7/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/live.ts
- **Proxy change:** none - app only


### Warm-up ramp for the first heavy compound
_For the first heavy compound of the session on cold muscles, a single line showing the two or three ramp sets to get there._

- **Composite** 22.9 · value 6/10 · differentiation 6/10 · effort 2/10 · fit 9/10 · noise-risk 5/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/live.ts
- **Proxy change:** none - app only


### The exercise you always drop (chronic skip)
_A `chronic_skip` finding built from data already on disk: the split says six exercises, the session log says four, five times running — so Escobar names it and offers either to cut it or to swap it for something you would actually do._

- **Composite** 22.8 · value 6/10 · differentiation 8/10 · effort 4/10 · fit 8/10 · noise-risk 4/10
- **Fires:** monthly · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/detectors/skips.ts
- **Proxy change:** none - app only (the proxy validates `kind` as an opaque string and no new top-level payload field is introduced, so `onlyKeys`/proxy/src/types.ts are untouched)


### Week in review
_When a training week closes, Escobar delivers one comparative verdict on it — sets and volume against the person's own trailing eight weeks, which scheduled days were kept, which muscle actually moved — instead of the four hardcoded grade strings the app ships today._

- **Composite** 22.5 · value 7/10 · differentiation 6/10 · effort 5/10 · fit 9/10 · noise-risk 5/10
- **Fires:** weekly · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/review.ts (weekReview) plus src/brain/coach/detectors/review.ts (detectWeekClose)
- **Proxy change:** none - app only. `kind` is validated as an opaque string in proxy/src/handler.ts and `metrics` is an open Record, and `reportNumbers()` already harvests every metric into the allowed-number set, so the new figures ground themselves. No new top-level payload field, so `onlyKeys` and proxy/src/types.ts stay untouched. The remote surface is a lookup into the existing `Explanation.items: Record<string, string>` by the finding id.


### Lift trajectory: velocity, projection date and falsifiable expiry
_Every lift's trend line gets a projected next load step with a real date and a falsifiable expiry — 'at this rate the next 2.5 kg lands around 14 November; if it hasn't by 5 December, this has stopped being a trend' — computed in the brain, never by the model._

- **Composite** 21.8 · value 6/10 · differentiation 7/10 · effort 4/10 · fit 8/10 · noise-risk 4/10
- **Fires:** weekly · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/trajectory.ts
- **Proxy change:** none - app only. The new fields go inside an existing finding's `metrics`, which `proxy/src/handler.ts:92` already validates only as `isRecord(f.metrics)` and `proxy/src/types.ts:9` types as `Record<string, number|string|boolean>`. No `onlyKeys` edit, no new top-level payload field, no new FindingKind or ProposalKind, no `principles.json` card, no `CATEGORY_OF` entry, no `ACCEPT_COOLDOWN_DAYS`/`PROPOSAL_ORDER` row.


### Unfinished coach items: re-raised dismissals and stranded drafts
_A suggestion you turned down comes back exactly once, only after three weeks and only when new evidence made the case stronger, and the card says out loud that you dismissed it and what changed._

- **Composite** 21.5 · value 6/10 · differentiation 7/10 · effort 5/10 · fit 8/10 · noise-risk 3/10
- **Fires:** rare · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/reopen.ts
- **Proxy change:** none - app only. Verified: `trimFindingsAndProposals` (src/brain/coach/explainer.ts:73) builds `PayloadProposal` by explicitly picking `{id, kind, subject, apply, basedOn, confidence}`, so a new `reopened` field on `Proposal` or on `FindingsReport` cannot reach the wire, and the proxy's `onlyKeys` top-level allowlist (proxy/src/handler.ts:162) is untouched. The consequence is that the "Back again" line is offline-only copy from words.ts — the remote explainer cannot see or rephrase it, which is the right call but should be stated in the spec so nobody tries to add it to the payload later.


### Session debrief: plan vs actual on the finish screen
_The finish screen stops showing duration/exercises/sets and starts showing, per exercise, the target Escobar set before the session against what was actually lifted — including the silent regression where load went up but reps and volume went down._

- **Composite** 21.2 · value 7/10 · differentiation 7/10 · effort 6/10 · fit 8/10 · noise-risk 6/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/debrief.ts (plus src/brain/coach/detectors/execution.ts for the session_execution detector)
- **Proxy change:** none - app only. The new metrics are plain numbers inside `Finding.metrics`, so `reportNumbers()` (contract.ts:239) picks them up and `allowedNumbers()` grounds them automatically. `validateGrounding` treats `kind` as an opaque string and no new top-level payload field is introduced, so `onlyKeys` and `proxy/src/types.ts` are untouched.


### Effort-rating repair and calibration
_When a session lands with under half its sets rated, the finish screen shows a compact strip of the unrated sets with the same E/I/M buttons — and says plainly that without them the coach holds your targets where they are._

- **Composite** 21.1 · value 6/10 · differentiation 6/10 · effort 3/10 · fit 9/10 · noise-risk 7/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/debrief.ts — new file; it does not exist today, and neither does the `sessionDebrief` the spec says the strip renders under ("the debrief above re-renders for free, because `sessionDebrief` is called in a `useMemo`"). `unratedSets(session)` is genuinely ~15 lines, but this feature is written as if a sibling debrief feature already shipped the module and the FinishScreen `useMemo`. If that sibling is not landing first, the spec must say to create `debrief.ts` and do the FinishScreen wiring here, or the agent will hunt for a file that isn't there.
- **Proxy change:** none - app only (needsNetwork: never; no payload field, no route, no `onlyKeys` edit)


### PR in reach (pre-set record badge)
_Before the set, not after: 'one more rep at this weight and it's a record'._

- **Composite** 20.6 · value 6/10 · differentiation 6/10 · effort 3/10 · fit 8/10 · noise-risk 6/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** none — additions inside existing /home/user/M-arc/src/brain/prs.ts (`prReach`, export `repsAtLoadMap`, a `hist`-taking `liveRecordFrom` that `isLiveRecord` then delegates to) plus two constants in /home/user/M-arc/src/brain/coach/bands.ts
- **Proxy change:** none - app only (`needsNetwork: never`; no payload field, no finding/proposal kind, so no `onlyKeys`/proxy/src/types.ts edit and no principles.json card)


### The day that died (consistency drift)
_Escobar notices a training day decaying months before it is gone — 'you hit Friday seven of eight weeks through the summer; two of the last eight' — and offers to move it to the day that is actually working._

- **Composite** 20.5 · value 6/10 · differentiation 7/10 · effort 5/10 · fit 8/10 · noise-risk 5/10
- **Fires:** rare · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** none — `detectConsistencyDrift` belongs in the existing `src/brain/coach/detectors/consistency.ts` (which already holds `detectGap`/`detectFirstSessions` and is re-exported by `detectors/index.ts` via `export *`), `trainingDaysPerWeek` in the existing `src/brain/weekly.ts`, and `recentProbability` on the existing `HabitDay` in `detectors/habit.ts`
- **Proxy change:** none - app only. The proxy validates `kind` as an opaque string and no new top-level payload field is introduced, so `onlyKeys` and `proxy/src/types.ts` are untouched. The only proxy-adjacent obligation is app-side: every number the copy states must exist as its own metric field so `allowedNumbers()` admits it.


### One rep short: near-miss records
_A new `near_miss` finding that fires when a set came within one rep, one load step, or 2% of e1RM of an existing personal record and did not break it — naming the exact number to beat next time._

- **Composite** 20.3 · value 6/10 · differentiation 7/10 · effort 4/10 · fit 8/10 · noise-risk 7/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/detectors/nearmiss.ts
- **Proxy change:** none - app only. Verified in proxy/src/handler.ts:92 — a finding is validated as `typeof f.kind === 'string' && isRecord(f.metrics)`, with no kind enum and no metric-key allow-list, so `near_miss` and its six new metric fields ride through `/explain` and `/ask` untouched. `onlyKeys` (handler.ts:162, 240) is top-level only and is not affected. `allowedNumbers()` (src/brain/coach/explainer.ts:130-151) already `visit()`s every finding's metrics, so the new numbers are grounded automatically.


### Pre-set brief: one line when a muscle is sore or under-recovered
_One line at the top of the exercise card — only when something is genuinely off — saying the muscle you flagged as sore, or that it is at 48% recovered, or why this lift's number moved._

- **Composite** 20.1 · value 6/10 · differentiation 6/10 · effort 3/10 · fit 8/10 · noise-risk 7/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/live.ts (new file; `preSetBrief()` plus a `PreSetBrief` discriminated union — roughly 40-60 lines, pure, no new thresholds, exported from src/brain/index.ts)
- **Proxy change:** none - app only (needsNetwork: never; no new FindingKind, no new payload field, so `onlyKeys` and proxy/src/types.ts are untouched)


### Recovery debt: a measured, receipted deload trigger
_Widen the deload trigger from 'two lifts regressed' to a named four-part recovery-debt score, and make the proposal show every signal that earned it._

- **Composite** 20 · value 6/10 · differentiation 6/10 · effort 5/10 · fit 9/10 · noise-risk 6/10
- **Fires:** monthly · **Network:** optional-enrichment · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/detectors/fatigue.ts — exporting `recoveryDebt(ctx, findings, recovery)`. No new module outside `detectors/`: every input already exists (`weeklyVolumeHistory` in brain/weekly.ts returns `{start, end, sets, volumeKg}`, `AdjustedRecovery` carries `adjustedPct`/`volumeFactor`/`personalized`, `noteFlags` are on `Session`). The `dataNeeded` list is merge residue and asks for far more than `howItWorks` uses — per-muscle volume-load, per-muscle ACWR, `weeksSinceEasierWeek` off a 20-week median, `rolesFor`/`SET_WEIGHT`, `LoggedSet.kg`, `groupSets` rollup. None of that appears in the four scoring families. If the spec repeats that list verbatim, an agent will build a weeklyMuscleLoad module nobody asked for; the spec must cut it to the ~6 inputs the four families actually read.
- **Proxy change:** none - app only. `proxy/src/types.ts` types every finding's `kind` as a bare `string` (lines 7/17/45), and `recovery_debt` rides inside the existing `findings[]` array — no new top-level payload field, so `onlyKeys` and `validateGrounding` in `proxy/src/handler.ts` are untouched. The new metrics flow into `allowedNumbers()` automatically: `reportNumbers()` (contract.ts:239) walks `f.metrics` generically. One grounding caveat worth a line in the spec: `score`, `lowCheckInDays`, `pressuredMuscles`, `fatigueFlags` and `harderLifts` are small integers that will now be *allowed* numbers report-wide, slightly loosening the remote explainer's number gate — and the "no arithmetic on report numbers" rule means each `why[]` line must print a metric verbatim, never e.g. "3 of your last 14" unless both 3 and 14 are their own fields (which is why `checkInDays` is in the metrics list alongside `lowCheckInDays`).


### Recovery projected forward: what is out, until when, why, and what fits next
_The finish screen stops being a receipt and starts telling you the cost: which muscles are out, until when, why the window is longer than usual, and which scheduled day it collides with._

- **Composite** 19.8 · value 6/10 · differentiation 6/10 · effort 4/10 · fit 8/10 · noise-risk 6/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/forecast.ts
- **Proxy change:** none - app only. Nothing leaves the device (needsNetwork: never), so no `onlyKeys`, no `proxy/src/types.ts`, no `validateGrounding` change. It also skips the entire Finding/Proposal ritual — no `FINDING_KINDS`, no `principles.json` card, no detector registration in `report.ts`, no `ProposalApply`/`ACCEPT_COOLDOWN_DAYS`/`KIND_LABEL`/`acceptProposal` case. Because the copy is not a rendered Finding it also never passes through `allowedNumbers()`/`validateText()`. That absent surface is the single biggest reason this is a 4 and not a 6.


### Ask Escobar about this session (remote explain at finish)
_One optional tap sends the session's own findings through the existing `/explain` route and returns a single paragraph in Escobar's voice — cached by report content, so it costs one call per session and zero on every reopen._

- **Composite** 19.1 · value 5/10 · differentiation 6/10 · effort 3/10 · fit 7/10 · noise-risk 3/10
- **Fires:** every-session · **Network:** required · **Sonnet-executable:** yes-with-care
- **New brain module:** none — add one pure exported helper, `sessionExplainIds(report, session, emphasis)`, to the existing /home/user/M-arc/src/brain/coach/explainer.ts (plain data in, string[] out; it is the only piece worth a node test)
- **Proxy change:** none - app only, mechanically: `validateGrounding` treats `kind` as an opaque string and `onlyKeys` already allows every field `buildPayload` sets, so this ships app-side alone. But one sentence in /home/user/M-arc/proxy/src/prompt.ts is what makes the paragraph actually about the session: rule 6 currently mandates \"one picture of the week\". Recommend a small independent proxy deploy relaxing that to key off the findings' own scope — no schema, no `onlyKeys`, no types.ts change, no version dance, and the ~590-token prefix is already below the cache minimum so nothing is invalidated.


### What this session changed: week shift and report diff
_Diff the coach's report from before the session against the one after it, and show the standing findings and suggestions that just flipped — a plateau that cleared, an easier week that just became warranted._

- **Composite** 18.8 · value 6/10 · differentiation 8/10 · effort 4/10 · fit 6/10 · noise-risk 8/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/weekshift.ts (for the merged per-muscle before/after effective-set diff with crossedLow/crossedHigh/stillThin and days-left). `reportDiff` itself needs no new module — it belongs in the existing src/brain/coach/report.ts next to `buildReport`, as the spec says.
- **Proxy change:** none - app only. Nothing leaves the device; `needsNetwork: never` holds. No FindingKind, ProposalKind, principles.json card, or words.ts case is added, so the whole §3 contract checklist and both proxy validators are untouched.


### Cadence honesty: week pace, streak at risk, missed day
_On a day with nothing logged yet, the coach says whether to train, what skipping costs against this person's own baseline, and which split closes the week's real gap._

- **Composite** 18.5 · value 6/10 · differentiation 7/10 · effort 5/10 · fit 7/10 · noise-risk 7/10
- **Fires:** daily · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/detectors/pace.ts (exporting detectWeekPace; plus new threshold constants in the existing src/brain/coach/bands.ts — READY_MAJOR_TRAIN / READY_MAJOR_REST, since inlining numbers is against the repo's rule)
- **Proxy change:** none - app only. `validateGrounding` treats `kind` as an opaque string and the finding adds no top-level payload field, so `onlyKeys` and `proxy/src/types.ts` are untouched. The new metrics ride inside the existing `metrics` record and land in `reportNumbers` automatically.


### Session execution patterns: pace, duration creep, slot and time-of-day
_A unit-free per-exercise performance index that reveals the exercise slot which is always starved and the time of day where this person is reliably weaker._

- **Composite** 17.7 · value 5/10 · differentiation 8/10 · effort 6/10 · fit 7/10 · noise-risk 5/10
- **Fires:** rare · **Network:** never · **Sonnet-executable:** needs-human-judgment
- **New brain module:** src/brain/relative.ts (relativePerformance); plus src/brain/coach/detectors/execution.ts for the two aggregators/detectors and src/brain/coach/planners/reorder.ts for the proposal
- **Proxy change:** none - app only (kind is validated as an opaque string in proxy/src/handler.ts; no new top-level payload field, so onlyKeys and proxy/src/types.ts are untouched)


### Balance drift over sixteen weeks
_Push/pull and upper/lower as a sixteen-week direction rather than a three-week snapshot — including the case the app can never currently express, which is that an imbalance is closing._

- **Composite** 16.5 · value 5/10 · differentiation 6/10 · effort 5/10 · fit 8/10 · noise-risk 7/10
- **Fires:** monthly · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/balanceTrend.ts (plus an extracted, exported `bucketWeeks` inside the existing src/brain/balance.ts — note the name collides with the local `const bucketWeeks` at balance.ts:23, and the spec's argument order `(sessions, today, custom, weeks)` is not `weeklyMuscleSets`'s `(sessions, today, weeks, custom)`)
- **Proxy change:** none - app only. The proxy validates `kind` as an opaque string and no new top-level payload field is introduced, so `onlyKeys` and proxy/src/types.ts are untouched. The new finding does flow into /explain and /ask payloads, but `allowedNumbers()` (explainer.ts:130) walks `f.metrics` generically, so the new numbers ground themselves — provided the detector emits `currentRatio`/`ratio4wAgo`/`ratio12wAgo` through `round1()` and precomputes the display labels as metric strings (the existing balance case does exactly this with `ratioLabel`), rather than letting words.ts do arithmetic.


### Body trend read against the lifts
_Four tape readings finally become a direction — and Escobar reads that direction against the lifts and the volume rather than as a number floating on its own._

- **Composite** 14.3 · value 6/10 · differentiation 7/10 · effort 4/10 · fit 7/10 · noise-risk 5/10
- **Fires:** monthly · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/body.ts (bodyTrend, bodyContext) plus src/brain/coach/detectors/body.ts for the detector wrapper
- **Proxy change:** none - app only. The proxy validates `kind` as an opaque string and no new payload field is added, so proxy/src/types.ts and `onlyKeys` are untouched. But the app-side payload builders must exclude the kind in BOTH places (trimFindingsAndProposals AND buildPayload's explain fallback) or proxy/src/handler.ts:168 rejects the whole /explain request.
- **CONSTRAINT FLAG:** grounding — the one figure the surface actually shows ("Down about 0.4 points a week") is not a field anywhere. `trend()` in /home/user/M-arc/src/brain/trend.ts:29 returns `slopePerWeek` as a RELATIVE fraction (`const rel = my ? slope / my : 0`), not percentage points per week. Turning it into "0.4 points a week" means multiplying the fraction by the mean body-fat level — arithmetic on report numbers, which the house rule forbids ("a figure must be its own field", why `StatsPr.value` exists beside `detail`), and it reintroduces exactly the absolute level the feature swears it will never carry. The same unit mismatch infects the band: `BODY_FAST_LOSS_PER_WEEK` is described as a fast-loss rate but is compared against a relative fraction. Repairable with one extra field on `bodyTrend` (its own absolute points-per-week slope, computed on device, emitted as a delta), but as written the displayed number does not exist.

### Programme audit: the split has gone stale
_When most of a split's lifts have stalled at once, Escobar stops swapping exercises one at a time and says the real thing: this programme is four months old, six of its nine lifts have not improved in fourteen weeks, and here is the refresh._

- **Composite** 14.2 · value 6/10 · differentiation 8/10 · effort 6/10 · fit 7/10 · noise-risk 4/10
- **Fires:** rare · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** Two: src/brain/coach/detectors/programme.ts (detectProgrammeStale) and src/brain/coach/planners/programme.ts (planProgrammeRefresh)
- **Proxy change:** none - app only. `programme_stale` is an opaque `kind` string to the proxy, it rides `split_modify` so no new ProposalKind, and `trimFindingsAndProposals` in explainer.ts already passes `metrics`/`window` through verbatim — no `onlyKeys` or proxy/src/types.ts edit.
- **CONSTRAINT FLAG:** Non-goal: "≤2 swaps per report". The refresh caps itself at `MAX_SWAPS_PER_REPORT + 1` (= 3) and stacks on top of `planSwaps`, which emits its own 2 `exercise_swap` proposals from the same `plateau` findings in the same report — so one report can put 5 exercise changes in front of a person whose lifts have all stalled. The feature names "swapping six lifts on a tired person is actively bad advice" as its own riskiest assumption and then writes a cap that deliberately exceeds the stated ceiling.

### Goal versus reality
_Once a quarter, Escobar checks whether the person is actually training the goal they picked — and when the answer is no, offers the honest choice: change the goal to match the training, or change the training to match the goal._

- **Composite** 14.2 · value 6/10 · differentiation 8/10 · effort 6/10 · fit 8/10 · noise-risk 6/10
- **Fires:** rare · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/goalFit.ts (plus detectors/goalFit.ts and planners/goalFit.ts; note trainingDaysPerWeek does not exist in the repo today — grep returns nothing — so this feature must add it)
- **Proxy change:** none - app only. Confirmed by reading validateGrounding (proxy/src/handler.ts:84-119): it checks a proposal's id/kind/subject as opaque strings and never inspects `apply`, and no new top-level payload field is added, so `onlyKeys` and proxy/src/types.ts are untouched. Caveat: the proxy's grounding check is what *rejects* the copy if metrics are stored as fractions — that fix is app-side, in the detector's metrics.
- **CONSTRAINT FLAG:** grounding — as specified, the displayed percentage is arithmetic on a report number, and the rep threshold the headline cites has no field at all (fixable in the metric encoding, not in the architecture)

### Notifications rewritten from today's report
_Rewrite the next 48 hours of reminder bodies from today's real report, suppress the ones the signals contradict, and allow at most one coach notification per calendar day._

- **Composite** 13.2 · value 6/10 · differentiation 7/10 · effort 6/10 · fit 7/10 · noise-risk 4/10
- **Fires:** daily · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/notify.ts — a pure `reminderBodies()` / `earnedNotification()` pair, purely so the logic is reachable from node tests; it computes no new statistics
- **Proxy change:** none - app only. Verified: `coachHeadline` is offline words-layer output and `LocalNotifications` is local, so no payload field, no `onlyKeys` edit, no `proxy/src/types.ts` change, and the 6-req/60s RATE binding is untouched.
- **CONSTRAINT FLAG:** grounding — narrowly and fixably: the showcase copy bakes a time-dependent recovery figure into a notification delivered 10–32h later, where it is false at read time

### Self-calibrating progression (target adherence replay)
_Escobar replays the advice it gave you last time, checks whether you actually hit it, and halves its own step when it keeps missing._

- **Composite** 13 · value 4/10 · differentiation 7/10 · effort 5/10 · fit 6/10 · noise-risk 8/10
- **Fires:** every-session · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/adherence.ts
- **Proxy change:** none - app only (target_undershoot travels as an opaque `kind` string; no new top-level payload field, so `onlyKeys` and proxy/src/types.ts are untouched)


### The pain ledger and follow-through on what you said
_A muscle mentioned more than once, weeks apart, stays on Escobar's list for 90 days instead of being forgotten on day 8._

- **Composite** 12.2 · value 6/10 · differentiation 8/10 · effort 6/10 · fit 6/10 · noise-risk 6/10
- **Fires:** rare · **Network:** optional-enrichment · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/detectors/pain.ts (painLedger + detectPainRecurring); PAIN_LEDGER_DAYS belongs in src/brain/coach/bands.ts per the no-inline-numbers rule, though NOTE_FLAG_LOOKBACK_DAYS precedent in detectors/notes.ts makes either defensible
- **Proxy change:** none required — `kind` is validated as an opaque string, and no new top-level payload field is added (`firstDay`/`lastDay` ride inside `metrics`, resolved constraints are just filtered out of the existing `preferences`/`preferenceFacts` array in AskSheet.tsx:221). Optional enrichment only: a few lines in proxy/src/promptAsk.ts (whose comment at :111 already documents statedConstraints) if the check-back question should be model-phrased.
- **CONSTRAINT FLAG:** offline-first — `needsNetwork: "optional-enrichment"` is mislabelled. `Session.noteFlags` is written in exactly one place (`applySessionNoteFlags`, /home/user/M-arc/src/slices/workout/session.ts:193), called only from `requestNoteFlags` results at /home/user/M-arc/src/slices/workout/Train.tsx:329 and /home/user/M-arc/src/slices/history/History.tsx:120, both gated on `remoteEnabled.value` (Train.tsx:328 `if (!remoteEnabled.value) return;`). With `emptyCoach().remoteExplainer === false` the ledger is永 empty. This is network-REQUIRED for the data to exist, not optional enrichment. The feature admits it in `whyItFitsEscobar` but the label is still wrong, and it deepens an existing asymmetry: a default (offline) user gets no pain avoidance at all, while an opted-in user gets a 90-day behavioural gate built on Sonnet's muscle classifications.

### Attention governor and the one-line headline
_A single ≤80-character sentence, chosen deterministically from the report and allowed to be absent, that fits a lock screen, a widget and the top of Today._

- **Composite** 10.5 · value 5/10 · differentiation 6/10 · effort 5/10 · fit 7/10 · noise-risk 5/10
- **Fires:** daily · **Network:** never · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/headline.ts (pure: kind whitelist, per-kind long/short templates, length guard, deterministic daily pick; the attention `allocate()`/step-down helpers either live here or in a sibling src/brain/coach/attention.ts)
- **Proxy change:** none - app only. `needsNetwork: never`; the line is built from `Finding.metrics` numbers that are already in the report, so `allowedNumbers()` is satisfied without touching proxy/src/handler.ts, `onlyKeys` or proxy/src/types.ts.
- **CONSTRAINT FLAG:** grounding — not in the headline core, but in the merged "Attention budget" half (`CoachState.shown` step-down ledger for "items walked past"), which manufactures an engagement signal that is not logged data and uses it to suppress true findings. Cut that half and the feature violates nothing.

### Explain or ask from any card
_Every card that shows a coach number gets a one-tap entry into the chat with the question already written and the answer's follow-ups offered as chips._

- **Composite** 7.8 · value 5/10 · differentiation 3/10 · effort 4/10 · fit 6/10 · noise-risk 4/10
- **Fires:** every-session · **Network:** required · **Sonnet-executable:** yes-with-care
- **New brain module:** src/brain/coach/followups.ts
- **Proxy change:** none - app only. The seed rides inside the existing 300-char `question` string; `validateAskBody` (proxy/src/handler.ts:243, MAX_QUESTION_CHARS = 300) already covers it, and no new top-level payload field means no `onlyKeys`/types.ts edit.
- **CONSTRAINT FLAG:** grounding (seeded numbers silently widen askAllowedNumbers) — and secondarily offline-first, since every entry point is gated on remoteEnabled and the feature is entirely invisible with the default config


**Escobar throughout M/ARC — research and proposed architecture**

Prepared September 21, 2026. Proposal for review; app implementation has not started. Source baseline: M/ARC commit `564df82`.

The concept is one recognizable coach who understands the user's direction and the purpose of today's work, and brings the relevant part of that understanding into whichever screen the user opens. In the palace metaphor, Escobar is the attentive host and trainer: present throughout the building, with the same knowledge in every room. The user retains the final say over the programme.

**What the Garmin research establishes**

- **Workout Execution Score measures matching the workout.** Garmin's Forerunner 265 manual describes a percentage based on completing steps and matching their targets. Main steps matter most; warm-up and recovery matter less; cooldown is excluded. That manual documents the feature for running and cycling. It uses Low, Average and Good bands, rather than stars. [Garmin manual](https://www8.garmin.com/manuals/webhelp/GUID-F41EAFB3-6CC9-42DE-9C6C-9E358DBB0671/EN-GB/GUID-FD71D73A-C744-4779-A6C3-2FA9AB89B228.html)
- **The friend's easy-run example is consistent with those rules, but not identified conclusively.** An effort outside the selected target can reduce execution quality, even if the run is impressive. This is an inference from the documented scoring criteria; the sources do not establish the remembered one- or two-star screen, exact wording, or numerical penalty. The selected target matters: pace and heart rate measure different things. [Execution criteria](https://www8.garmin.com/manuals/webhelp/GUID-F41EAFB3-6CC9-42DE-9C6C-9E358DBB0671/EN-GB/GUID-FD71D73A-C744-4779-A6C3-2FA9AB89B228.html)
- **Training Effect is a different measurement.** Its 0–5 scale concerns aerobic and anaerobic impact, using information including heart rate, intensity and duration. It is not a plan-adherence grade; the top value represents overreaching. A large training effect and weak execution are therefore compatible. [Training Effect manual](https://www8.garmin.com/manuals/webhelp/GUID-31D23DBB-57C2-4DF7-A0C9-8D1A00AB4BE7/EN-US/GUID-7275629E-743A-4658-A284-C84F42A66AE5.html)
- **Its guidance connects today's work with recovery and the larger training picture.** Daily Suggested Workouts mix different purposes using training and recovery context. Training Readiness explicitly helps identify both opportunities for harder training and reasons to ease off. Availability and inputs depend on the device. [Daily Suggested Workouts](https://www.garmin.com/en-IE/garmin-technology/running-science/physiological-measurements/daily-suggested-workouts-feature/), [Training Readiness](https://www.garmin.com/en-US/garmin-technology/running-science/physiological-measurements/training-readiness/)
- **The feeling of a coach comes from multiple surfaces.** Garmin's Morning Report can bring together recovery, a suggested workout and other daily information. Connect+ Active Intelligence separately offers personalized AI insights on the app dashboard and requires opt-in. These are different features; this research did not establish a single conversational personality controlling every Garmin surface. [Morning Report](https://support.garmin.com/en-AU/?faq=6LL2ZOEJry3z69WKK9Ymd9), [Active Intelligence](https://support.garmin.com/en-MY/?faq=kWi5DoaMPZ4VCJBA0lFWP7)

The design lesson is my interpretation: make the coach loyal to the purpose of training, acknowledge the work, and explain what to do next. We should create Escobar's own voice and scoring rules for the evidence M/ARC actually has. Running measurements and proprietary Garmin calculations cannot simply be transferred to strength logs.

**Escobar's character**

- Calm, observant and direct. He notices specific things, remembers the agreed direction and gives one useful next step.
- Encouraging without automatic praise. He can recognize a personal record and explain a mismatch with the day's aim in the same response.
- Disciplined about easier days. Following an easier plan can be a successful session.
- Willing to revise the plan. If the programme repeatedly fails to fit the user's life or ability, he reviews the programme instead of repeatedly blaming the user.
- Honest about evidence. He distinguishes something the user reported, something the logs show, an estimate, and something still unknown.
- Consistent across screens. An easier-day message on Today cannot become an unsolicited push for a record in Train.
- Adjustable wording: Steady or Direct. Both use identical facts and training decisions. A personality preference must not increase prescribed intensity.

Proposed voice pattern: **what happened → how it relates to our aim → the useful next step**. Keep the short version to one or two sentences; explanation opens on demand.

Illustrative messages, not assessments of the user's actual training:

> “That is a real new best. Today was planned to be easier, and your ratings show it became a hard session. Let's review what comes next.”

> “You stayed with the easier target we agreed on. That was today's job.”

> “You shortened the session. Tell me whether time, discomfort or the plan was the issue before I suggest a change.”

> “I have the weight and reps, but no effort ratings. I can compare the numbers; I can't tell how hard those sets felt.”

These are original proposed Escobar messages, not Garmin quotations. References to easier targets require an actual saved agreement; references to records or effort require supporting logs.

**What appears around the app**

| Place | Escobar's role | Proposed appearance |
|---|---|---|
| Today | Explain today's priority and how it serves the agreed goal. | A short Escobar line beside the main plan; tap for the reason. |
| Train | Keep the session's purpose visible, then respond when a logged set meaningfully changes the picture. | A small purpose label and one contextual cue near the relevant exercise. Existing rest and set controls retain priority. |
| Finish / History | Separate the achievement from how well the workout matched the plan. | A concise debrief with expandable original plan, agreed updates and actual work. |
| Body | Explain what recorded measurements and training trends can and cannot show about the objective. | One relevant observation next to the selected trend or measurement. |
| Coach | Review the whole direction, outstanding proposals and longer-term progress. | The place for deeper discussion and explicit programme changes. |
| Settings / goal setup | Explain a choice only when it affects the plan or interpretation. | Optional contextual help; ordinary settings need no coaching commentary. |

A small Escobar entry point remains available in the app header. Opening it retains the current screen, selected lift or result as context. It should feel like the same coach following the conversation through the app.

Presence rules:

- At most one proactive coaching message in the current screen area. Existing readiness, rest, PR and debrief messages participate in the same priority system rather than being duplicated underneath it.
- Show a new message for meaningful evidence or a useful moment, not for every tap or keystroke.
- Avoid interruptions while entering a set or reviewing a confirmation. Preserve the user's draft and reading position.
- Share dismissal and “not now” state across screens. The same observation should not follow the user through five tabs.
- When there is nothing useful to add, keep only the quiet entry point. Availability is enough.
- Use the existing theme's accent, text, surfaces and spacing. Start with a small E mark and Escobar label; a character avatar is optional future design work.

**How the architecture fits the existing app**

The current app already has a deterministic coaching brain, evidence-backed findings, plans requiring acceptance, readiness, live targets, warm-ups, rest guidance, records, debriefs, weekly review, trajectories and optional conversation. The missing layer is coordination and explicit purpose.

The proposed flow is:

**Your agreed goal + saved plan + current logs → existing brain → purpose comparison → message selection for this screen → Escobar's words → your choice → guarded action and refreshed guidance.**

1. **One agreed direction.** Start with the existing goal and focus settings. A later optional objective record adds the person's own words, priorities, available days/equipment, chosen progress measures and review point. For example, “build upper-body muscle” becomes a practical agreement, not a promise to deliver a particular body shape. The user confirms changes.
2. **A saved purpose for the session.** Extend the existing captured workout plan with optional intent: normal training, easier training, building capacity or another supported, defined aim. Save any relevant effort limits or target ranges before work starts. Use only aims the planner and available evidence can support. Preserve the reason and time of an accepted change. Older sessions with no saved intent stay unknown.
3. **An honest comparison.** Reuse the debrief and record engines. Keep three distinct results: what was achieved, fit to the effective agreed plan, and evidence relevant to the longer-term objective. The original plan remains visible beside accepted changes. A later change applies prospectively; it cannot silently rewrite the target for completed sets.
4. **One message selector.** A pure function takes the facts, current screen and interaction state and chooses the most useful eligible coaching moment. It returns a stable identity, evidence, a local explanation and an optional supported action. View changes reuse the same coaching snapshot. One message may have a different emphasis on Body and Train, but the recommendation must remain consistent.
5. **One shared presentation and voice.** A reusable quiet cue and contextual explanation panel appear in the screens. Local templates provide instant offline guidance. Optional model explanations use a small approved context packet and the existing checks; merely visiting another screen does not trigger a model request.
6. **One guarded action path.** Navigation buttons open the relevant existing screen. Programme changes show the exact proposed change and require acceptance. Existing stale-state checks run again when applying it; dismissals, constraints and valid Undo behavior remain intact.

Suggested implementation homes, subject to approval:

| Addition | Existing code to build upon |
|---|---|
| Shared coaching snapshot and surface selection | `src/app/selectors.ts`, `src/brain/coach/report.ts`; add a pure moment-selection module. |
| Optional objective and session intent | `src/core/models.ts`, normalization in `src/core/store.ts`, `capturePlan` in `src/brain/debrief.ts`, `startSession` in `src/slices/workout/session.ts`. |
| Purpose-aware feedback | `src/brain/debrief.ts`, `src/brain/coach/detectors/execution.ts`, `src/brain/coach/words.ts`. |
| Quiet presence and contextual explanation | Shared UI component mounted by Today, Train, History and Body; reuse Coach's review and conversation machinery. |
| Reviewed changes | Existing typed proposal/action paths and `src/slices/coach/apply.ts`. |

The report-driven brain stays deterministic and offline. The existing narrow exception for explicitly requested conversational programme drafts can remain, with its vocabulary validation and acceptance boundary. The new presentation layer does not give a language model unrestricted control of app state.

**The rating decision**

I recommend plain-language plan-fit labels first: **Followed the plan**, **Harder than planned**, **Less work than planned**, **Followed the adjusted plan**, or **Not enough information**. These are descriptions of a session, not ratings of the person. Show reasons rather than a universal star score.

A strength example makes the distinction clear: an agreed easier session specifies an Easy effort limit; the user logs a heavier record and marks the sets Max. The record remains real. Plan fit can be “Harder than planned.” Without saved intent or effort evidence, Escobar must not infer that judgment merely from a heavier number.

Implementation details that protect fairness:

- Current debrief logic treats sufficient reps as meeting a target. Judging excessive intensity needs saved upper bounds or effort intent; current numbers alone do not supply that meaning.
- Approved swaps and reductions count against the effective accepted plan. Retained replaced entries must not be counted again in an adherence denominator.
- Missing ratings, unrecorded intent, starter targets and invalidated set mappings reduce assessability; they do not become failure points.
- Training impact, adherence and a personal record remain separate. Do not imitate Garmin's physiological Training Effect from weight and rep logs.
- A reason such as equipment availability must come from the user's action or statement. A changed load does not prove why it changed.
- Personal goals do not justify body-shaming, invented muscle-growth measurements, inferred exercise technique, or guaranteed outcomes. Recovery and exposure estimates remain labelled as estimates.

**Proposed delivery order after approval**

1. **Presence and voice:** one shared cue, contextual explanation, consistent tone and repetition rules, using the current brain and goals. This makes Escobar feel present without waiting for a new scoring system.
2. **Workout purpose and fair feedback:** save supported intent and approved adaptations; add the separate achievement/plan-fit debrief and supporting tests.
3. **Personal objective and ongoing reviews:** add the optional richer agreement, connect existing weekly review and trajectory evidence, and offer reviewed changes when the plan no longer fits.

Each phase gets its own review, regression checks, theme/mobile checks, commit and exact-revision CI gate once implementation is authorized.

Acceptance examples: the same easier-day intent appears across Today and Train; approved changes are honoured; a PR survives a plan mismatch; missing effort produces uncertainty; a stale suggestion cannot change a newer plan; repeated navigation causes no duplicate messages or extra model calls; all five themes remain usable; offline guidance still works; raw body measurements and full historical plan arrays remain outside remote payloads.

The approval decision is the experience and tone first: a quiet, present Escobar; firm but respectful feedback; separate achievements and plan fit; and the three-phase order above. Numeric scores, automatic programme changes, wearable integration and any new proactive notification system are outside this proposed first delivery.

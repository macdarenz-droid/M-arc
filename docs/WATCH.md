# Recorded heart rate

A watch that broadcasts on the standard Bluetooth Heart Rate Service becomes a
second evidence channel for the coach that already exists. It does not become a
second coach.

The source of this work is the `codex/marc-heart-rate-integration` branch of
`macdarenz-droid/Watch-test`, which built the transport, the native recorder and
the measurement rules against an older copy of this app. That copy's coaching
layer no longer exists here and was not carried over; the evidence and matching
rules were, and the rest was re-homed onto the current brain.

## What it does

Samples arrive over BLE into a foreground service and land in an app-private
SQLite database, tagged with the workout id allocated when the person presses
Start. Finishing the workout closes that window and returns one compact summary,
which is the only thing that enters app state. Raw samples stay native.

The summary is computed by `metricsVersion: 2`, implemented twice — in
`native/HeartRateMetrics.java` and `src/heart-rate/metrics.ts` — with matching
scenarios that CI runs on every push. Duplicate timestamps are dropped, readings
outside the workout window are dropped, invalid and poor-contact readings are
dropped but kept as interval boundaries, and each surviving reading covers at
most five seconds. The average is weighted by those bounded intervals, coverage
is captured time over elapsed time, and a gap is any interval over fifteen
seconds with no accepted reading.

`recordedPeakBpm` is the highest reading actually captured. It is not an
estimate of maximum heart rate and is never presented as one.

## What it is allowed to say

`src/brain/heart-rate.ts` compares the latest workout against the person's own
earlier recordings, and refuses unless all of this holds:

- the recording is version 2, covers at least 70% of elapsed time, has at least
  three captured minutes and at least 36 accepted readings
- at least three earlier workouts in the last 42 days match on split, known
  weighted exercises, loads and set counts, with per-exercise volume within 20%
  and both active and elapsed duration within 25%
- those workouts do not overlap each other, and no two are the same workout
  imported twice
- captured intent agrees. An accepted easier week is a different exposure, so it
  is compared only against other easier weeks

The baseline is the median of those averages. A difference is only called higher
or lower beyond the larger of 8 bpm and 10% of baseline. Effort is compared
separately and needs three rated sets with at least half the session rated.

The result is two findings — `heart_rate_response` and `heart_rate_evidence` —
which cite `wearable_heart_rate_validity`. Both are descriptive. Neither changes
a load, a rest time, a recovery estimate, a readiness verdict, a plan-fit label
or a PR, and neither produces a proposal of any kind.

These are engineering sufficiency rules. None of them establish that a reading
is physiologically accurate.

## The outbound boundary

Both heart-rate kinds are in `LOCAL_ONLY_FINDING_KINDS` and are filtered in
`explainer.ts` before anything is copied into a payload.

This is not a precaution. `trimFindingsAndProposals` copies every finding's
metrics verbatim, and `buildPayload`'s default explain selection read straight
off `report.findings`, bypassing the trim — so a heart-rate detector registered
without that gate would have put BPM on the wire through the existing Ask and
explain routes, with no other change. `tests/heart-rate-privacy.test.ts`
inspects the serialized JSON rather than the code, and removing the gate fails
most of it.

Sharing derived heart-rate observations, even summarised ones, is a separate
contract requiring an explicit user choice and coordinated app and proxy
schemas. It is not in this work.

Android backup is switched off for the app, so a recording cannot leave the
device through a cloud backup nobody chose.

## Lifecycle

Backup carries traces and omits any whose workout is not in the file. Restore
validates every trace against the workouts being restored and writes the native
store before publishing app state, so a bad file leaves both stores untouched.
An older backup with no traces restores normally, and `refreshHeartRateSummaries`
recovers anything still held natively. Deleting a workout deletes its recording
immediately; undo restores the log and its saved summary, but not the raw trace.
Reset clears both stores.

A summary that fails validation on load is dropped whole rather than repaired —
a half-trusted summary is worse than none, because the evidence layer would
treat the surviving fields as measured.

## What is deliberately not here

**Rest-interval coaching.** `loggedAt` records when a row was committed. It is a
logging marker, the trace labels it as one, and no rest interval may be derived
from it. Real interval evidence needs an explicit set-finished event, which does
not exist in either app.

Also absent, and not by oversight: HRV, calorie or training-zone inference, any
"recovered" indicator, any wait-until-X-BPM rule, automatic load or rest changes,
and any use of workout heart rate as a resting baseline.

## What is not proven

**The hardware.** CI compiles the Java, builds the APK and checks that the native
sources and manifest entries are actually in it. None of that establishes that a
particular watch connects, that recording survives the screen being off, or that
the optical sensor is accurate on this person's wrist during lifting — the
condition under which wrist sensors are least reliable.

`docs/HARDWARE-TEST.md` in the Watch-test repository is the twelve-step
acceptance checklist for that, and it needs the actual phone and watch.

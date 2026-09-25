# Gate B command foundation — current scope

The R0–R3 remediation base is merged into the watch branch. R2.8 creates the
session, entry and set IDs used in `commandProtocol.mjs`; this module does not
create another identity scheme.

`parseWatchCommand` validates a bounded `complete_set` envelope. `planSetCommand`
checks the selected installation, session, entry, set and set revision. A retry
with a recorded command ID returns its original receipt; reuse of that ID with
different content is rejected. Stored rejections return `replay_rejected` with
their original rejection receipt; only a stored application returns `replay`.
Receipt lookup uses the pair (session ID, command ID), matching the SQLite
primary key. The old session's persisted installation and terminal status
must be supplied to the JS planner as `binding.sessionBindings` when another
watch owns the active session. Re-pairing cannot turn an old applied receipt
into a new-session mutation; the new session may reuse the same command ID.
Unknown commands for a finished old session return conflict when sent by its
own watch, and wrong_installation from another watch. The current binding
still guards commands without an archived session.
Reordering a set preserves its ID, while
substitution/removal or a changed revision prevents silent retargeting.

This is a **pure planning layer**. It does not call the current workout mutators,
persist a command, transmit an acknowledgement, or tell the watch that a set is
saved. `receiptForCommittedPlan` shapes the applied receipt fields but only the
native workout transaction can make them durable. Rejection receipts are made
in that transaction too. A
WebView `flushSave()` alone does not provide that transaction. The phone plugin
also provides local ownership recovery; its Wear Engine channel remains
diagnostic only. The full Gate B and Gate C remain open.

`WorkoutCommandStore.java` has an **unconnected command receiver primitive**. Its
SQLite schema limits handover to one active/paused session, retains command
receipts under that session and tracks the R2.8 set IDs and revisions. Its
`completeSet` method checks installation, entry/set target, revision, draft
values and action time inside a transaction, then marks the selected set
committed and stores its receipt in that same transaction. A
replayed ID reads the stored result; another fingerprint for the ID conflicts.
The exact schema is tested with SQLite for rollback, duplicate IDs, per-set
revisions and a receipt that survives reopening the database. The Android gate
also runs `WorkoutCommandStoreTest` with Robolectric SDK 26 against the actual
Java method, including reopened replay, wrong installation, stale revision,
reordered target, invalid time, malformed wire input, and a failed receipt
insert. `command-fixtures.json` is read by both the Java and JS tests.
Identified authorized rejections are stored as receipts, so a retry does not
turn a prior rejection into a later applied command. Receipts keep watch
`actionAt`, separate phone `receivedAt`, and `clockConfidence: unverified` until
clock synchronization has been measured. This is an Android
JVM simulation, not a test on a physical GT6/phone. CI copies the class into
both APK build paths. No phone/watch path calls `completeSet` yet. It does
not calculate the phone's fidelity, rest or heart side effects. It persists
three keyed pending effect records in the same transaction as each applied set
and receipt. Version 2 databases backfill them for applied receipts; rejected
commands create none. Android tests cover reopening, replay, backfill and a
failed pending effect insert rolling back the whole command. Resolving those
effects with verified clock/heart inputs and rest policy is still required.
Version 4 rows also retain a versioned context from the pre-commit snapshot:
the effective and receipt times, session start, previous committed time,
recent commit count, set kind and effort. Invalid prior timestamps are flagged
for review. Older rows migrate with a null context and remain pending. These
rows still lack authoritative `autoRest`, default rest duration, live BPM at
commit and the time-window samples that `startRest` and `heartForSet` need.
They cannot be processed from the current rows alone. Native completion clamps the set's
stored `at` to the earlier of watch `actionAt` and phone `receivedAt`,
while the receipt preserves the raw watch timestamp for review. This is still
not a resolved side effect and no watch Saved acknowledgement is connected
before Gate C. No screen initiates native handover yet, so an APK
containing the class is **not** a working watch command receiver.
The internal applied receipt explicitly marks `sideEffectsStatus: not_implemented`;
the Java test checks that marker. Do not expose that receipt to the watch as Saved.

## Single-writer handover foundation

Version 5 adds a native ownership record committed in the same SQLite
transaction as the original active session, set identities, rest preferences
and the available timestamped BLE heart buffer. The original snapshot and
inputs remain intact when the native workout changes. Reusing a handover ID
with different inputs is rejected. Earlier databases keep their pending
effects; an old active seed without an ownership record requires review.

`src/core/workoutOwnership.ts` freezes the phone before flushing/capturing and
stores a prepared recovery checkpoint before calling native. Android renders
the normal shell immediately, with a small checking status while it reads the
native owner. Live writers stay blocked as `checking` from initialization until
the read resolves, even without a local marker. History, settings and backup
export stay usable during this check. This prevents a late native projection
from overwriting a phone edit or duplicating a session finished on the phone.
A failed or timed-out optional read without a known handover
shows a non-blocking notice and leaves phone workouts usable. An unreadable
web localStorage cannot create native ownership or lock the web app. A native
owner actually returned by the read is protected even if its local marker was
lost or cannot be saved. A lost handover response leaves live edits blocked; recovery
either reads the committed owner or atomically cancels the prepared request.
Cancellation leaves a durable record so a late request cannot acquire
ownership after phone editing resumes. A missing previously confirmed native
owner, damaged checkpoint, or failure while recovering a known handover keeps
the live workout blocked. History, settings, health updates and backup export
remain available. Only the Train/Live view shows recovery; rest controls are
hidden. Restore/reset stay unavailable while they could erase the handover.
The recovery view offers retry and a rescue copy, without a data reset.

The store guards live updaters before their callbacks run, and rejects an
active-session replacement from general updates while ownership is protected.
Unrelated immutable updates keep the same active-session reference and remain
writable. Finish and completion are guarded before heart/history effects;
restore/reset are guarded before deleting anything. The render crash reset
preserves known ownership. The pre-bundle crash reset refuses only a stored
handover marker, so a crash before owner-check initialization still has a way
out. A marker changed during a pending native request cannot be overwritten by
its late reply.
Phone heart capture freezes during handover. On cancellation, the original
rest deadline and captured samples are restored without restarting rest or
duplicating the last sample. No second session/entry/set ID scheme is added.

This is infrastructure: `preparePhoneWorkoutHandover` has **no UI or transport
caller**. A native-owned workout stays read-only in this build. There is no
ownership release/import path yet; do not activate handover for real workouts.
The heart buffer contains only samples received by the current WebView, with
phone receive wall/elapsed times. It does not recover samples lost before
handover or establish watch clock synchronization or timing confidence. The
separate native journal below starts only after confirmed ownership; it does
not relabel this older JS buffer. Rest/heart inputs are retained but not yet consumed by
the pending-effect resolver. No Saved acknowledgement is enabled.

Risk controls: native seed/owner rollback together; cancellation prevents late
ownership; known recovery data is retained on storage failure. Pending native
reads temporarily block live writes; a failed read with no known handover
reopens them with a notice. Unit/JVM
tests cover these boundaries and database migration. The browser gate checks
the immediate shell with protected live controls, failed/timed-out optional
reads, known recovery with working history/settings/export, and absence of the
real crash-reset labels.
Pre-bundle tests exercise the actual inline reset handler on web and Android.
Real GT6 behavior remains unverified.

## Native BLE heart journal

Version 6 adds a bounded heart journal under the existing handover ID. The
existing `WatchService` sends parsed BLE packets to `WorkoutHeartRecorder`
without requiring a WebView listener. Its process-owned worker also serializes
local ownership operations. It recovers a confirmed owner asynchronously and
accepts data only for that owner's active/paused session. A normal phone
workout, old unowned native seed, failed optional read or closed session cannot
start native recording. No new UI, permission, automatic connection or Wear
Engine receiver is enabled.

The BLE callback captures its owner ticket and phone wall/elapsed receipt
times before posting to the main thread. Delayed callbacks cannot acquire a
later workout, and the database rechecks that exact owner in the insert
transaction. The journal retains an anonymous BLE connection ID, packet
sequence, phone boot identity, receipt clocks, BPM and contact state. Explicit
connections get a new source ID; automatic reconnects keep it. The journal
stores neither Bluetooth addresses nor device names, and capture adds no HR
values or identifiers to diagnostics. Contact=false and zero
BPM remain raw evidence, not usable live readings. A future resolver must filter
them and handle gaps before deriving heart effects.

Phone boot identity uses Android's local
[`BOOT_COUNT`](https://developer.android.com/reference/android/provider/Settings.Global#BOOT_COUNT).
If it is unavailable, a random process identity is marked with `clock_scope=process`;
it is never guessed from wall time or reused across process restarts.
[`elapsedRealtime`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtime())
is sampled at receipt, including time while the phone sleeps. These identities
are local to this phone; they establish no watch clock mapping. Clock jumps
are retained unchanged, not silently converted into measurement times.

Disk work stays off the BLE/main thread on one scheduled worker with one open
store. Each owner has at most 128 pending packets. Writes batch every 5 seconds
or at 32 packets, whichever comes first; full batches yield between drains.
Ownership reads flush the bounded tail before replying. Service stop rejects new
packets, flushes, cancels its timer and closes the worker's store. Failed stop
flushes retain the bounded in-process tail for a later read/service restart;
process death can still lose it. A failed write retries on the next packet,
ownership read or service restart without a busy loop. Overflow increments a loss count. The database
keeps at most 14,400 samples per handover, preserves its existing prefix when
full, and atomically stores counters with each batch. Replayed sample IDs
cannot duplicate data, while conflicting reuse rolls back the batch. Version 5
upgrades preserve ownership, original JS inputs and pending command effects;
they do not fabricate native provenance for old samples.

Settling a cancelled handover deletes its journal children before its capture header,
in the same transaction. Terminal status alone never deletes unexported evidence.
The guarded `acknowledgeHeartExport` hook deletes terminal journals only after a
future export/import caller confirms durable export; that caller is not yet wired.
Reset waits for the worker's native wipe before erasing phone data and refuses any
known native owner, including a lost phone marker. Only cancellation IDs survive
reset, stripped of all workout/session/installation/input data, to reject delayed
old seeds. The pre-bundle crash reset queues native cleanup for the next boot.
Both Android backup formats exclude the journal DB and its WAL/SHM/journal files;
other app backup rules are preserved. No workout evidence relies on Auto Backup.

The local ownership reply includes capture counts, pending/write-failure state
and `coverage: unverified`. The UI shows a small, non-blocking note when capture is unavailable or a write
failed: "Watch heart rate isn't being saved for this workout". Healthy subsequent
metadata clears the note. Diagnostics retain only the last 32 exception class
names, never exception messages, SQL, workout IDs or heart values.
Failure to read optional capture metadata still returns any confirmed native
owner, so a lost phone marker cannot reopen live editing through that failure.
If the journal migration itself fails, a read-only fallback can recover a
confirmed owner from core schema 5 or 6. It never acknowledges a write,
cancels a handover or concludes that ownership is back on the phone.
The uncommitted queue tail, periods before owner recovery, disconnections and
process death can leave gaps. This is continuous recording only while the
existing BLE service actually receives packets for a confirmed native owner;
it is not a guarantee of uninterrupted capture. Native samples are not yet
imported into phone history or backup, and no effect resolver consumes them.
Handover must remain disabled until completion/release, export and coverage
handling are implemented. The BLE foreground service does not establish that
Wear Engine works with the phone locked or in the background.

Regression coverage exercises the real service receive path without a plugin
listener, delayed callbacks across handover, restart/reopen, source/boot changes,
wall-clock rollback, replay/conflicting IDs, malformed/contact/zero readings,
bounded queues and journals, failed write retries, migration and failed optional
bootstrap. These are JVM simulations; physical GT6 evidence is still pending.

Next implementation: add phone command routing and completion/release
reconciliation, including draining/exporting native heart evidence. Then
resolve fidelity/rest/heart atomically and bind one verified watch installation
through actual transport. Test a crash after commit but before reply,
an old offline command after substitution, and a watch restart with its pending
outbox. Do not wire C2's Complete button to the diagnostic channel before those
tests pass.

Huawei review and real GT6 evidence still govern transport, local heart
sensor access, wake/background behavior, gestures and haptics. The current
source overlay is not a signed watch HAP.

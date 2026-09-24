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
handover or establish continuous native capture, watch clock synchronization,
or timing confidence. Rest/heart inputs are retained but not yet consumed by
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

Next implementation: add continuous native heart capture with source/boot
identity, phone command routing and completion/release reconciliation. Then
resolve fidelity/rest/heart atomically and bind one verified watch installation
through actual transport. Test a crash after commit but before reply,
an old offline command after substitution, and a watch restart with its pending
outbox. Do not wire C2's Complete button to the diagnostic channel before those
tests pass.

Huawei review and real GT6 evidence still govern transport, local heart
sensor access, wake/background behavior, gestures and haptics. The current
source overlay is not a signed watch HAP.

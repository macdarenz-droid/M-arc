# Gate B command foundation — current scope

The R0–R3 remediation base is merged into the watch branch. R2.8 creates the
session, entry and set IDs used in `commandProtocol.mjs`; this module does not
create another identity scheme.

`parseWatchCommand` validates a bounded `complete_set` envelope. `planSetCommand`
checks the selected installation, session, entry, set and set revision. A retry
with a recorded command ID returns its original receipt; reuse of that ID with
different content is rejected. Reordering a set preserves its ID, while
substitution/removal or a changed revision prevents silent retargeting.

This is a **pure planning layer**. It does not call the current workout mutators,
persist a command, transmit an acknowledgement, or tell the watch that a set is
saved. `receiptForCommittedPlan` defines the record to write only after the
workout mutation and receipt can be committed in one durable transaction. A
WebView `flushSave()` alone does not provide that transaction, and the current
phone plugin is diagnostic only. The full Gate B and Gate C remain open.

`WorkoutCommandStore.java` is an **unconnected native storage primitive**. Its
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
reordered target, invalid time and a failed receipt insert. This is an Android
JVM simulation, not a test on a physical GT6/phone. CI copies the class into
both APK build paths. No phone/watch path calls it yet. It does
not calculate the phone's fidelity, rest or heart side effects, and it does not
replace the WebView's authoritative active session, so an APK
containing the class is **not** a working watch command receiver.

Next implementation: add the phone's fidelity/rest/heart side effects and
explicit single-writer handover, bind one
watch installation through the actual transport, and stop all competing WebView
writers during native ownership. Test a crash after commit but before reply,
an old offline command after substitution, and a watch restart with its pending
outbox. Do not wire C2's Complete button to the diagnostic channel before those
tests pass.

Huawei review and real GT6 evidence still govern transport, local heart
sensor access, wake/background behavior, gestures and haptics. The current
source overlay is not a signed watch HAP.

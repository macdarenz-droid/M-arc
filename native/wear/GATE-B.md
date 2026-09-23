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

Next implementation: put the authoritative active-workout command state in an
Android native transactional store, bind one watch installation, use the R2.8
set IDs in its mutation path, and
persist mutation plus command receipt before sending `applied`. Test a crash
after commit but before reply, an old offline command after substitution, and
a watch restart with its pending outbox. Do not wire C2's Complete button to
the diagnostic channel before those tests pass.

Huawei review and real GT6 evidence still govern transport, local heart
sensor access, wake/background behavior, gestures and haptics. The current
source overlay is not a signed watch HAP.

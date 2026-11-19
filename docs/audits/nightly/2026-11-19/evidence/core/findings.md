# Core storage and import findings

Pinned current main: `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`. All fixtures are synthetic; no user data, live health service or production endpoint was used.

## C-N19-01 — P2 — Cross-tab save reconciliation does not invalidate stale asynchronous work

**Source:** [storageMovedOn, store.ts:401](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/core/store.ts#L401), [replacement generation:427](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/core/store.ts#L427), [health completion guard](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/slices/settings/health.ts#L15).

**Trigger:** Tab A starts a Health Connect read. Another tab replaces the stored state with a reset/disconnected state. Before A processes a storage event (for example after suspension), its `flushSave()` detects the changed stored JSON and adopts it. The old health read subsequently completes.

**Expected:** Every whole-state replacement must invalidate work started against the preceding state and notify replacement subscribers. An old health result must not reconnect the reset app or restore removed health rows.

**Actual:** `storageMovedOn()` replaces `state.value` without `bumpGeneration()`. The exact-source fixture records generation **0 → 0**, replacement callbacks **0**, and successful stale health completion: disconnected state becomes connected with **7,777 synthetic steps**. The ordinary storage-event and explicit replacement paths already invalidate generations; this fallback does not.

**Impact:** A reset/restore can be partially undone by an in-flight health read. Other subscribers relying on `onReplace`, including held editing state, also miss this replacement notification; those additional UI consequences were source-traced, not separately browser reproduced.

**Evidence/confidence:** High. `core-probes.ts`/`core-probes.jsonl` directly exercise the store; `ui-native/probes.mjs` case `health-after-deferred-cross-tab-replacement` additionally executes the actual store, settings-health and native-health modules with only synthetic storage and deferred plugin boundaries. Device scheduling of the race is not asserted.

**Builder recommendation:** Route all whole-state adoption through one replacement function that increments the generation and invokes replacement listeners before pending work can commit. Test deferred health reads across explicit restore, storage event and flush-detected replacement. This is a remaining gap in the newer asynchronous replacement protection, not a claim that its already-fixed paths are still broken.

## C-N19-02 — P2 — Accepted backups can still violate render-time state invariants

**Source:** [repairState, store.ts:67](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/core/store.ts#L67), [session exercise validation:85](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/core/store.ts#L85), [split defaults:209](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/core/store.ts#L209), [backup parser:46](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/slices/settings/backup.ts#L46).

**Trigger/reproduction:** Pass an otherwise valid current backup to `parseBackup`, with either (a) a split whose `focus` is the string `"chest"`, or (b) a saved exercise with an unknown ID and a non-string `name` object. Both fixtures are accepted with `dropped: 0`.

**Expected:** Reject or repair invalid field shapes before returning accepted application state; preserve usable records and explain discarded data.

**Actual:** Case (a) survives `focus ?? []` and crashes the same `.map()` used by [Train.tsx:354](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/slices/workout/Train.tsx#L354). Case (b) reaches `sessionEmphasis` → exercise name lookup → [normalizeName:93](https://github.com/macdarenz-droid/M-arc/blob/57dcbfc7efa60218ba902d16d6e3329d2fc053f5/src/core/exercises.ts#L93), throwing `toLowerCase is not a function`.

**Impact:** A malformed or edited backup can be accepted and subsequently make Train or an analysis consumer fail. This is a robustness/data-recovery problem; no code-execution exploit is claimed. The probe invokes the actual parser and downstream computation; it does not claim an observed physical-device restore crash.

**Evidence/confidence:** High; two deterministic cases and exceptions in `core-probes.jsonl`. One root cause is counted for both examples. Previous import hardening AUD-4/A3-2 repaired many malformed shapes; these accepted-state invariant gaps remain, so the prior issue is only partially resolved.

**Builder recommendation:** Validate field types and referential invariants for all persisted entities, not just record existence/ID. Normalize split focus to valid muscle arrays and ensure exercise display names are strings (prefer authoritative library names for known IDs). Add targeted parser-to-render/model regression fixtures rather than only asserting the parser does not throw.

## Supplemental review, not additional confirmed findings

Core units, dates, parse helpers, exercise lookup, canonical session logging defaults, rescue/backup selection, CSV escaping, heart storage, Escobar-state separation and migration paths were traced. This does not imply exhaustive state-space verification. CSV free-text formula escaping is now present; no new bypass was established. Relay's owner authentication, scoped link permissions, bounded request bodies, SQL parameterization and Node/Worker adapters received targeted source review; the local Relay suite passed 16 tests. Relay's entire public UI, all store operations and production configuration were not exhaustively audited.

The Node Relay static server checks `file.startsWith(pub)` rather than a path-segment boundary (`relay/src/node.ts:44`). This is a **conditional hardening lead**, not an established deployed disclosure: a sibling path beginning with the public directory's name could pass the prefix test. Use a relative-path containment check and a synthetic sibling-directory test before treating this as resolved. No actual private files were requested.

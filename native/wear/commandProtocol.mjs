/* Gate B wire validation and command planning. No workout writes or acknowledgements. */
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;

export function parseWatchCommand(raw, maxBytes = 1024) {
  if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > maxBytes) return null;
  let c;
  try { c = JSON.parse(raw); } catch { return null; }
  if (!c || typeof c !== 'object' || Array.isArray(c) || c.v !== 1 || c.kind !== 'complete_set') return null;
  for (const key of ['installationId', 'sessionId', 'commandId', 'entryId', 'setId']) {
    if (typeof c[key] !== 'string' || !ID.test(c[key])) return null;
  }
  // Native SQLite implementation stores set revisions in a signed Java int.
  if (!Number.isSafeInteger(c.expectedSetRevision) || c.expectedSetRevision < 0
      || c.expectedSetRevision > 2147483646) return null;
  if (typeof c.actionAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(c.actionAt)
      || !Number.isFinite(Date.parse(c.actionAt))
      || new Date(c.actionAt).toISOString() !== c.actionAt) return null;
  return Object.freeze({
    v: 1, kind: 'complete_set', installationId: c.installationId, sessionId: c.sessionId,
    commandId: c.commandId, entryId: c.entryId, setId: c.setId,
    expectedSetRevision: c.expectedSetRevision, actionAt: c.actionAt,
  });
}

/** Return a plan only. The caller must atomically persist the workout and receipt before replying Saved. */
export function planSetCommand(session, binding, revisions, receipts, command, now = Date.now()) {
  if (!command) return { status: 'invalid' };
  if (!session) return { status: 'wrong_session' };
  if (command.installationId !== binding.installationId) return { status: 'wrong_installation' };
  // A command ID cannot be reused for a different payload, even after the original is applied.
  const recorded = Object.hasOwn(receipts, command.commandId) ? receipts[command.commandId] : undefined;
  if (recorded) return recorded.fingerprint === fingerprint(command)
    ? { status: recorded.result.status === 'applied' ? 'replay' : 'replay_rejected', receipt: recorded.result }
    : { status: 'command_id_conflict' };
  if (session.id !== command.sessionId) return { status: 'wrong_session' };
  if (session.status === 'finished' || session.status === 'discarded') return { status: 'conflict' };
  if (session.pausedAt || session.status === 'paused') return { status: 'paused' };
  const actionTime = Date.parse(command.actionAt);
  const startTime = Date.parse(session.startedAt);
  if (!Number.isFinite(startTime) || actionTime < startTime - 5000 || actionTime > now + 30000)
    return { status: 'time_needs_review' };
  const entry = session.entries.find(e => e.id === command.entryId);
  const set = entry?.sets.find(s => s.id === command.setId);
  if (!set) return { status: 'target_changed' };
  if (set.status === 'committed' || set.at || set.status === 'skipped') return { status: 'target_changed' };
  if ((revisions[command.setId] ?? 0) !== command.expectedSetRevision) return { status: 'revision_conflict' };
  if (!((Number.isFinite(set.kg) && set.kg >= 0 && Number.isInteger(set.reps) && set.reps > 0)
      || (Number.isFinite(set.durationSec) && set.durationSec > 0))) return { status: 'incomplete_draft' };
  return { status: 'ready', target: { sessionId: session.id, entryId: entry.id, setId: set.id },
    actionAt: command.actionAt, fingerprint: fingerprint(command), nextSetRevision: command.expectedSetRevision + 1 };
}

function fingerprint(c) {
  return [c.v, c.kind, c.installationId, c.sessionId, c.commandId, c.entryId, c.setId,
    c.expectedSetRevision, c.actionAt].join('|');
}

/** Shape an internal applied receipt; only the native transaction can make it durable. */
export function receiptForCommittedPlan(command, plan, appliedRevision, receivedAt) {
  if (plan.status !== 'ready' || !Number.isSafeInteger(appliedRevision) || appliedRevision < 0) throw new Error('No durable result');
  if (typeof receivedAt !== 'string' || !Number.isFinite(Date.parse(receivedAt))
      || new Date(receivedAt).toISOString() !== receivedAt) throw new Error('Invalid receipt time');
  return { fingerprint: plan.fingerprint, result: { status: 'applied', commandId: command.commandId,
    sessionId: command.sessionId, entryId: command.entryId, setId: command.setId,
    setRevision: plan.nextSetRevision, sessionRevision: appliedRevision,
    actionAt: command.actionAt, receivedAt, clockConfidence: 'unverified',
    sideEffectsStatus: 'not_implemented' } };
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseWatchCommand, planSetCommand, receiptForCommittedPlan } from './commandProtocol.mjs';

const input = { v: 1, kind: 'complete_set', installationId: 'install-1', sessionId: 's-1',
  commandId: 'command-1', entryId: 'e-1', setId: 'set-1', expectedSetRevision: 0,
  actionAt: '2026-09-23T10:00:00.000Z' };
const parse = (patch = {}) => parseWatchCommand(JSON.stringify({ ...input, ...patch }));
const session = { id: 's-1', startedAt: '2026-09-23T09:00:00.000Z',
  entries: [{ id: 'e-1', sets: [{ id: 'set-1', status: 'draft', kg: 50, reps: 8 }] }] };
const binding = { installationId: 'install-1' };
const shared = JSON.parse(readFileSync(new URL('./command-fixtures.json', import.meta.url), 'utf8'));

test('shared Java/JS command fixtures agree on validation and conflict status', () => {
  for (const fixture of shared) {
    const wire = { ...input, actionAt: '2026-09-23T19:00:00.000Z', ...(fixture.patch || {}),
      installationId: fixture.patch?.installationId ?? 'watch-1' };
    for (const key of fixture.remove || []) delete wire[key];
    let raw = JSON.stringify(wire) + (fixture.suffix || '');
    if (fixture.mutation) {
      assert.ok(raw.includes(fixture.mutation.from), fixture.name);
      raw = raw.replace(fixture.mutation.from, fixture.mutation.to);
    }
    const command = parseWatchCommand(raw);
    const fixtureSession = fixture.noSession ? null : { ...session, startedAt: '2026-09-23T18:59:00.000Z',
      ...(fixture.closed ? { status: 'finished' } : {}),
      ...(fixture.paused ? { pausedAt: Date.parse('2026-09-23T19:00:00.000Z') } : {}),
      entries: [{ ...session.entries[0], sets: [{ ...session.entries[0].sets[0],
        ...(fixture.committed ? { status: 'committed', at: '2026-09-23T19:00:00.000Z' } : {}),
        ...(fixture.incomplete ? { kg: undefined, reps: undefined } : {}) }] }] };
    const actual = command ? planSetCommand(fixtureSession,
    { installationId: 'watch-1' }, fixture.revision ? { 'set-1': fixture.revision } : {}, {}, command,
    Date.parse('2026-09-23T19:05:00.000Z')).status : 'invalid';
    const normalized = actual === 'ready' ? 'accepted' : actual;
    assert.equal(normalized, fixture.expected, fixture.name);
  }
});

test('a valid set action is only a plan, with no Saved receipt before a durable commit', () => {
  const c = parse(); const original = structuredClone(session);
  const plan = planSetCommand(session, binding, {}, {}, c, Date.parse('2026-09-23T10:00:02.000Z'));
  assert.equal(plan.status, 'ready'); assert.equal(plan.target.setId, 'set-1');
  assert.deepEqual(session, original); assert.equal(plan.receipt, undefined);
  assert.throws(() => receiptForCommittedPlan(c, { status: 'invalid' }, 1));
});

test('retry returns the original receipt; reusing its ID with other content is rejected', () => {
  const c = parse(); const plan = planSetCommand(session, binding, {}, {}, c, Date.parse('2026-09-23T10:00:02.000Z'));
  const receipts = { 'command-1': receiptForCommittedPlan(c, plan, 5, '2026-09-23T10:00:03.000Z') };
  assert.deepEqual(receipts['command-1'].result, { status: 'applied', commandId: 'command-1', sessionId: 's-1',
    entryId: 'e-1', setId: 'set-1', setRevision: 1, sessionRevision: 5,
    actionAt: input.actionAt, receivedAt: '2026-09-23T10:00:03.000Z',
    clockConfidence: 'unverified', sideEffectsStatus: 'not_implemented' });
  assert.deepEqual(planSetCommand({ ...session, status: 'finished' }, binding, {}, receipts, c), { status: 'replay', receipt: receipts['command-1'].result });
  assert.deepEqual(planSetCommand(null, binding, {}, receipts, c), { status: 'replay', receipt: receipts['command-1'].result });
  assert.equal(planSetCommand(null, binding, {}, receipts, parse({ setId: 'set-2' })).status, 'command_id_conflict');
  assert.equal(planSetCommand(null, { installationId: 'other' }, {}, receipts, c).status, 'wrong_installation');
  assert.equal(planSetCommand(session, binding, {}, receipts, parse({ setId: 'set-2' })).status, 'command_id_conflict');
});

test('a recorded time rejection stays rejected when the same ID is retried later', () => {
  const command = parse({ actionAt: '2026-09-23T10:01:00.000Z' });
  const rejected = { status: 'time_needs_review', commandId: command.commandId };
  const fingerprint = ['1', 'complete_set', command.installationId, command.sessionId,
    command.commandId, command.entryId, command.setId, command.expectedSetRevision, command.actionAt].join('|');
  const result = planSetCommand(session, binding, {}, { [command.commandId]: { fingerprint, result: rejected } },
    command, Date.parse('2026-09-23T11:00:00.000Z'));
  assert.deepEqual(result, { status: 'replay_rejected', receipt: rejected });
  assert.deepEqual(planSetCommand(null, binding, {}, { [command.commandId]: { fingerprint, result: rejected } }, command),
    { status: 'replay_rejected', receipt: rejected });
});

test('offline commands never retarget a reordered, substituted, or changed set', () => {
  assert.equal(planSetCommand({ ...session, entries: [{ ...session.entries[0], sets: [{ ...session.entries[0].sets[0], id: 'set-2' }] }] }, binding, {}, {}, parse()).status, 'target_changed');
  assert.equal(planSetCommand(session, binding, { 'set-1': 1 }, {}, parse()).status, 'revision_conflict');
  assert.equal(planSetCommand({ ...session, entries: [{ ...session.entries[0], sets: [{ ...session.entries[0].sets[0], status: 'committed' }] }] }, binding, {}, {}, parse()).status, 'target_changed');
});

test('another installation or session cannot apply an old command', () => {
  assert.equal(planSetCommand(session, { installationId: 'other' }, {}, {}, parse()).status, 'wrong_installation');
  assert.equal(planSetCommand({ ...session, id: 's-2' }, binding, {}, {}, parse()).status, 'wrong_session');
});

test('reject malformed, oversized, incomplete and untrusted fields', () => {
  assert.equal(parseWatchCommand('{'), null);
  assert.equal(parseWatchCommand(JSON.stringify(input), 20), null);
  assert.equal(parse({ expectedSetRevision: -1 }), null);
  assert.equal(parse({ actionAt: 'not-a-date' }), null);
  assert.equal(parse({ actionAt: '2026-09-23' }), null);
  assert.equal(parse({ actionAt: '2026-02-30T10:00:00.000Z' }), null);
  assert.equal(parse({ commandId: 'x|y' }), null);
  const incomplete = { ...session, entries: [{ id: 'e-1', sets: [{ id: 'set-1', status: 'draft' }] }] };
  assert.equal(planSetCommand(incomplete, binding, {}, {}, parse(), Date.parse('2026-09-23T10:00:02.000Z')).status, 'incomplete_draft');
});

test('a command ID matching an inherited object property is not a false replay', () => {
  const c = parse({ commandId: 'constructor' });
  assert.equal(planSetCommand(session, binding, {}, {}, c, Date.parse('2026-09-23T10:00:02.000Z')).status, 'ready');
});

test('a future or pre-session watch clock needs review instead of silently setting the time', () => {
  const now = Date.parse('2026-09-23T10:00:02.000Z');
  assert.equal(planSetCommand(session, binding, {}, {}, parse({ actionAt: '2026-09-23T10:02:00.000Z' }), now).status, 'time_needs_review');
  assert.equal(planSetCommand(session, binding, {}, {}, parse({ actionAt: '2026-09-23T08:00:00.000Z' }), now).status, 'time_needs_review');
});

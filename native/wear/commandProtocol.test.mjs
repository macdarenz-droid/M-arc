import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseWatchCommand, planSetCommand, receiptForCommittedPlan } from './commandProtocol.mjs';

const input = { v: 1, kind: 'complete_set', installationId: 'install-1', sessionId: 's-1',
  commandId: 'command-1', entryId: 'e-1', setId: 'set-1', expectedSetRevision: 0,
  actionAt: '2026-09-23T10:00:00.000Z' };
const parse = (patch = {}) => parseWatchCommand(JSON.stringify({ ...input, ...patch }));
const session = { id: 's-1', startedAt: '2026-09-23T09:00:00.000Z',
  entries: [{ id: 'e-1', sets: [{ id: 'set-1', status: 'draft', kg: 50, reps: 8 }] }] };
const binding = { installationId: 'install-1' };

test('a valid set action is only a plan, with no Saved receipt before a durable commit', () => {
  const c = parse(); const original = structuredClone(session);
  const plan = planSetCommand(session, binding, {}, {}, c, Date.parse('2026-09-23T10:00:02.000Z'));
  assert.equal(plan.status, 'ready'); assert.equal(plan.target.setId, 'set-1');
  assert.deepEqual(session, original); assert.equal(plan.receipt, undefined);
  assert.throws(() => receiptForCommittedPlan(c, { status: 'invalid' }, 1));
});

test('retry returns the original receipt; reusing its ID with other content is rejected', () => {
  const c = parse(); const plan = planSetCommand(session, binding, {}, {}, c, Date.parse('2026-09-23T10:00:02.000Z'));
  const receipts = { 'command-1': receiptForCommittedPlan(c, plan, 5) };
  assert.deepEqual(planSetCommand(null, binding, {}, receipts, c), { status: 'replay', receipt: receipts['command-1'].result });
  assert.equal(planSetCommand(session, binding, {}, receipts, parse({ setId: 'set-2' })).status, 'command_id_conflict');
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

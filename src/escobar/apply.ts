/**
 * Applying a proposal (§10): re-check the fingerprint, write through the slice mutations,
 * record the decision for the next brief, and offer Undo. EV5 carries the goal change and
 * Not now; EV6 adds every other `propose_*` kind.
 */
import { state } from '@/core/store';
import { showToast } from '@/app/toast';
import { changeGoal } from '@/slices/profile/profile';
import type { GoalId } from '@/data/goals';
import { fingerprint } from './tools/actions';
import type { Conversation, DecisionEvent, ProposalRecord } from './types';

export interface ApplyResult { ok: boolean; status: ProposalRecord['status']; message: string; undo?: () => void }

type Applier = (input: Record<string, unknown>) => { message: string; undo: () => void };

const APPLIERS: Record<string, Applier> = {
  propose_goal: input => {
    const before = state.value.goal;
    changeGoal(input.goal as GoalId, 'user');
    return { message: 'Goal changed', undo: () => changeGoal(before, 'user') };
  },
};

export const canApply = (kind: string): boolean => kind in APPLIERS;

function withDecision(c: Conversation, p: ProposalRecord, decision: DecisionEvent['decision'], result?: string): Conversation {
  const at = new Date().toISOString();
  return {
    ...c,
    proposals: (c.proposals ?? []).map(x => (x.id === p.id ? { ...x, status: decision } : x)),
    pendingDecisions: [...(c.pendingDecisions ?? []), { proposalId: p.id, decision, at, title: p.title, ...(result ? { result } : {}) }],
  };
}

/** Pure decision step: returns the updated conversation and what happened. */
export function decide(c: Conversation, proposalId: string, choice: 'apply' | 'dismiss' | 'undo', undoFn?: () => void): { conversation: Conversation; result: ApplyResult } {
  const p = (c.proposals ?? []).find(x => x.id === proposalId);
  if (!p) return { conversation: c, result: { ok: false, status: 'failed', message: 'That suggestion is gone.' } };
  if (choice === 'dismiss') return { conversation: withDecision(c, p, 'dismissed'), result: { ok: true, status: 'dismissed', message: 'Dismissed' } };
  if (choice === 'undo') { undoFn?.(); return { conversation: withDecision(c, p, 'undone'), result: { ok: true, status: 'undone', message: 'Undone' } }; }
  const today = new Date().toISOString().slice(0, 10);
  if (p.expiresOn < today || fingerprint(p.kind, p.input, state.value) !== p.fingerprint) {
    return { conversation: withDecision(c, p, 'stale'), result: { ok: false, status: 'stale', message: 'Things changed since this was suggested. Ask again for a fresh one.' } };
  }
  const run = APPLIERS[p.kind];
  if (!run) return { conversation: withDecision(c, p, 'failed', 'not supported yet'), result: { ok: false, status: 'failed', message: 'This kind of change can’t be applied yet.' } };
  try {
    const r = run(p.input);
    return { conversation: withDecision(c, p, 'applied', r.message), result: { ok: true, status: 'applied', message: r.message, undo: r.undo } };
  } catch {
    return { conversation: withDecision(c, p, 'failed'), result: { ok: false, status: 'failed', message: 'That didn’t work. Nothing was changed.' } };
  }
}

const undos = new Map<string, () => void>();

/** UI entry: decide, persist through the session, toast with Undo. */
export async function onProposal(proposalId: string, choice: 'apply' | 'dismiss' | 'undo'): Promise<ApplyResult> {
  const session = await import('./session');
  const c = session.activeConversation.value;
  if (!c) return { ok: false, status: 'failed', message: 'No conversation.' };
  const { conversation, result } = decide(c, proposalId, choice, undos.get(proposalId));
  session.updateConversation(conversation);
  if (choice === 'apply' && result.ok && result.undo) {
    undos.set(proposalId, result.undo);
    showToast(result.message, 'Undo', () => { void onProposal(proposalId, 'undo'); });
  } else if (choice === 'undo') undos.delete(proposalId);
  else if (!result.ok) showToast(result.message);
  return result;
}

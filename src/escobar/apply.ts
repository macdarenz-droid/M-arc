/**
 * Applying a proposal (§10): re-check the fingerprint, write through the slice mutations,
 * record the decision for the next brief, and offer Undo. EV5 carries the goal change and
 * Not now, and every other `propose_*` kind (pulled forward from EV6 on the owner's report).
 */
import { state, update } from '@/core/store';
import { showToast } from '@/app/toast';
import { go } from '@/app/router';
import { emptySchedule, newId, MAX_PINS, WEEKDAYS, type AppState, type CheckIn, type EquipmentProfile, type Exercise, type LoadUnit, type PinnedCard, type TodayChange } from '@/core/models';
import { addDays, todayKey } from '@/core/dates';
import type { MuscleId } from '@/data/muscles';
import type { PlanDraft } from '@/brain/plan';
import { applyGoalRest, changeGoal, logWeight, setBirthYear, setHeight, setPlannedDays, setSex, setTrainingSince } from '@/slices/profile/profile';
import { createSplit, deleteSplit, saveCustomExercise, setFocus } from '@/slices/workout/splits';
import { startSession } from '@/slices/workout/session';
import { addGym, saveProfile, setActiveGym } from '@/slices/workout/units';
import { acceptDeload } from '@/slices/coach/coach';
import { resyncReminders } from '@/slices/settings/reminders';
import type { GoalId } from '@/data/goals';
import { fingerprint } from './tools/actions';
import type { Conversation, DecisionEvent, ProposalRecord } from './types';

export interface ApplyResult { ok: boolean; status: ProposalRecord['status']; message: string; undo?: () => void }

type Applier = (input: Record<string, unknown>) => { message: string; undo: () => void };
type Key = keyof AppState;

/** Undo restores exactly the parts of state the change touched (anything else done since stays). */
function snapshot(keys: Key[]): () => void {
  const before = state.value;
  const saved = Object.fromEntries(keys.map(k => [k, before[k]])) as Partial<AppState>;
  return () => update(s => ({ ...s, ...saved }));
}
const escobarUndo = (field: 'todayOverride' | 'pins'): (() => void) => {
  const saved = state.value.escobar[field];
  return () => update(s => ({ ...s, escobar: { ...s.escobar, [field]: saved } }));
};
const syncReminders = () => { void resyncReminders(); };
type Ex = { exerciseId: string; sets: number };

const APPLIERS: Record<string, Applier> = {
  propose_goal: input => {
    const before = state.value.goal;
    const undoPrefs = snapshot(['preferences']);
    changeGoal(input.goal as GoalId, 'user');
    if (input.applyGoalRest === true) applyGoalRest(input.goal as GoalId);
    return { message: 'Goal changed', undo: () => { changeGoal(before, 'user'); undoPrefs(); } };
  },
  propose_split: input => {
    const undo = snapshot(['splits', 'schedule', 'active']);
    const exercises = (input.exercises as Ex[]) ?? [];
    if (input.action === 'create') {
      const sp = createSplit(String(input.name), exercises.map(e => ({ ...e })));
      if (!sp) throw new Error('split limit');
      setFocus(sp.id, (input.focus as MuscleId[]) ?? []);
      return { message: `Split ${sp.name} created`, undo };
    }
    if (input.action === 'delete') { deleteSplit(String(input.splitId)); return { message: 'Split deleted', undo }; }
    update(s => ({ ...s, splits: s.splits.map(sp => (sp.id === input.splitId ? { ...sp, name: String(input.name).slice(0, 28), focus: ((input.focus as MuscleId[]) ?? []).slice(0, 2), exercises: exercises.map(e => ({ ...e })) } : sp)) }));
    return { message: 'Split updated', undo };
  },
  propose_program: input => {
    const undo = snapshot(['splits', 'schedule', 'active']);
    const draft = input.draft as PlanDraft;
    if (input.replaceExisting === true) update(s => ({ ...s, splits: [], schedule: emptySchedule(), active: null }));
    const idByRef: Record<string, string> = {};
    for (const d of draft.splits) {
      const sp = createSplit(d.name, d.exercises.map(e => ({ ...e })));
      if (!sp) throw new Error('split limit');
      idByRef[d.ref] = sp.id;
    }
    update(s => ({ ...s, schedule: Object.fromEntries(WEEKDAYS.map(w => [w, draft.schedule[w] ? idByRef[draft.schedule[w]!] ?? null : null])) as AppState['schedule'] }));
    syncReminders();
    return { message: 'Programme saved', undo: () => { undo(); syncReminders(); } };
  },
  propose_schedule: input => {
    const undo = snapshot(['schedule']);
    update(s => ({ ...s, schedule: { ...(input.week as AppState['schedule']) } }));
    syncReminders();
    return { message: 'Schedule changed', undo: () => { undo(); syncReminders(); } };
  },
  propose_today: input => {
    const undo = escobarUndo('todayOverride');
    update(s => ({ ...s, escobar: { ...s.escobar, todayOverride: { day: todayKey(), splitId: String(input.splitId), reason: String(input.reason ?? ''), changes: input.changes as TodayChange[] } } }));
    return { message: 'Today’s session adjusted', undo };
  },
  propose_deload: input => {
    const undo = snapshot(['deload']);
    acceptDeload(String(input.reason ?? 'A lighter week to recover.'));
    return { message: 'Lighter week started', undo };
  },
  propose_start_session: input => {
    const split = state.value.splits.find(x => x.id === input.splitId);
    if (!split || state.value.active) throw new Error('cannot start');
    const undo = snapshot(['active']);
    startSession(split);
    go('train');
    return { message: `${split.name} started`, undo };
  },
  propose_checkin: input => {
    const undo = snapshot(['checkIns']);
    const day = todayKey();
    update(s => {
      const cur = s.checkIns.find(c => c.day === day) ?? { day };
      const soreness = { ...(cur.soreness ?? {}), ...((input.soreness as CheckIn['soreness']) ?? {}) };
      const next: CheckIn = { ...cur, ...(input.sleepQuality != null ? { sleepQuality: input.sleepQuality as CheckIn['sleepQuality'] } : {}), ...(input.mood != null ? { mood: input.mood as CheckIn['mood'] } : {}), ...(Object.keys(soreness).length ? { soreness } : {}) };
      return { ...s, checkIns: [...s.checkIns.filter(c => c.day !== day), next].slice(-180) };
    });
    return { message: 'Check-in saved', undo };
  },
  propose_profile: input => {
    const undo = snapshot(['profile', 'weightLog', 'profileHistory']);
    const v = input.value;
    switch (input.field) {
      case 'bodyWeightKg': logWeight(Number(v)); break;
      case 'heightCm': setHeight(Number(v)); break;
      case 'birthYear': setBirthYear(Number(v)); break;
      case 'sex': setSex(v as 'male' | 'female'); break;
      case 'trainingSince': setTrainingSince(String(v)); break;
      case 'plannedDays': setPlannedDays(Number(v)); break;
      default: throw new Error('unknown field');
    }
    return { message: 'Profile updated', undo };
  },
  propose_custom_exercise: input => {
    const undo = snapshot(['customExercises']);
    const primary = input.primary as MuscleId[];
    const ex: Exercise = { id: newId('custom'), name: String(input.name), equipment: String(input.equipment), primary, secondary: (input.secondary as MuscleId[]) ?? [], stabilizers: [], aliases: [], pattern: 'custom', defaultSets: 3, mode: input.mode as Exercise['mode'], role: input.role as Exercise['role'], custom: true };
    saveCustomExercise(ex);
    return { message: `${ex.name} added`, undo };
  },
  propose_reminder: input => {
    const undo = snapshot(['preferences']);
    update(s => ({ ...s, preferences: { ...s.preferences, reminders: { ...s.preferences.reminders, enabled: input.enabled === true, time: String(input.time), style: input.style as AppState['preferences']['reminders']['style'], readinessSummary: input.readinessSummary === true } } }));
    syncReminders();
    return { message: 'Reminders updated', undo: () => { undo(); syncReminders(); } };
  },
  propose_setting: input => {
    const undo = snapshot(['preferences']);
    const { key, value } = input.setting as { key: string; value: unknown };
    update(s => ({ ...s, preferences: key === 'rest.mode' ? { ...s.preferences, rest: { ...s.preferences.rest, mode: value as 'time' | 'heart' } } : { ...s.preferences, [key]: value } }));
    return { message: 'Setting changed', undo };
  },
  propose_equipment_profile: input => {
    const undo = snapshot(['units']);
    saveProfile(input.scope as 'exercise' | 'equipment', String(input.key), input.profile as EquipmentProfile, String(input.gymId));
    return { message: 'Equipment saved', undo };
  },
  propose_gym: input => {
    const undo = snapshot(['units']);
    const id = addGym(String(input.name), input.defaultUnit as LoadUnit);
    if (!id) throw new Error('gym limit');
    setActiveGym(id);
    return { message: `${String(input.name)} added`, undo };
  },
  pin_card: input => {
    const undo = escobarUndo('pins');
    const now = new Date();
    const days = typeof input.days === 'number' ? input.days : undefined;
    const pin: PinnedCard = { id: newId('pin'), component: input.component as PinnedCard['component'], params: (input.params as Record<string, unknown>) ?? {}, title: String(input.title), pinnedAt: now.toISOString(), ...(days ? { until: addDays(todayKey(), days) } : {}) };
    update(s => ({ ...s, escobar: { ...s.escobar, pins: [...s.escobar.pins, pin].slice(-MAX_PINS) } }));
    return { message: 'Pinned to Today', undo };
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

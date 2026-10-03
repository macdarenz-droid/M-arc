/**
 * BUG-38 (D-BUG38): today's split and the next split, from the sessions actually done.
 * Weekdays decide when; sessions decide which planned days are already covered. A split skipped
 * by training another one moves into the next day an early session freed up. Pure, no signals,
 * reads only saved data (schedule, splits, sessions, daysOff).
 */
import type { Session, Split, Weekday } from '@/core/models';
import { addDays, trainedTodaySessions, weekdayOf } from '@/core/dates';

export interface PlanSlot { split: Split; day: string; weekday: Weekday; movedFrom?: string }
export interface SplitPlan {
  /** Before today's sessions are counted; kept on a day off (`off`). */
  today: (PlanSlot & { off: boolean }) | null;
  /** Today's own split was trained earlier and nothing moved in. */
  doneEarly: { split: Split; on: string } | null;
  /** The first planned day in (T, T+7]. */
  next: PlanSlot | null;
  /** T..T+7, for reminders. */
  days: Array<{ day: string; splitId: string | null }>;
}
export interface SplitPlanInput {
  schedule: Record<Weekday, string | null>;
  splits: Split[];
  sessions: Session[];
  daysOff?: string[];
  today: string;
  now: number;
}

/** Sessions this far back can still cover a day in the walk (WALK_BACK + REACH). */
const SESSIONS_BACK = 17, WALK_BACK = 14, AHEAD = 7, REACH = 3;

interface Used { splitId: string; planDay: string; startedAt: string }
interface DayResult { splitId: string | null; movedFrom?: string; early?: { splitId: string; on: string } }

export function splitPlan(i: SplitPlanInput): SplitPlan {
  const T = i.today;
  const byId = new Map(i.splits.map(s => [s.id, s]));
  const off = new Set(i.daysOff ?? []);
  const raw = (d: string) => i.schedule[weekdayOf(d)] ?? null;
  const own = (d: string): string | null => {
    const id = raw(d);
    if (!id || !byId.has(id)) return null;
    return d < T && off.has(d) ? null : id; // RG-19: a past day off has no slot
  };

  // One session per (splitId, planDay): the earliest. A session in today's QA8-4 window plans as today.
  const lo = addDays(T, -SESSIONS_BACK);
  const window = i.sessions.filter(s => s.day >= lo && s.day <= T);
  const todays = new Set(trainedTodaySessions(window, T, i.now));
  const keyed = new Map<string, Used>();
  for (const s of window) {
    const planDay = todays.has(s) ? T : s.day;
    const key = `${s.splitId}|${planDay}`;
    const prev = keyed.get(key);
    if (!prev || s.startedAt < prev.startedAt) keyed.set(key, { splitId: s.splitId, planDay, startedAt: s.startedAt });
  }
  const used = [...keyed.values()].sort((a, b) => (a.planDay === b.planDay ? (a.startedAt < b.startedAt ? -1 : a.startedAt > b.startedAt ? 1 : 0) : a.planDay < b.planDay ? -1 : 1));
  const planDays = new Set(used.map(u => u.planDay));

  // Rules 1-2: which session counts for which day. A day counts at most one session.
  const counted = new Map<string, Used>();
  const rest: Used[] = [];
  for (const u of used) {
    if (own(u.planDay) === u.splitId) counted.set(u.planDay, u);
    else rest.push(u);
  }
  for (const u of rest) {
    let covered = false;
    for (let k = 1; k <= REACH; k++) {
      const e = addDays(u.planDay, k);
      const o = own(e);
      if (!o) continue;
      if (o === u.splitId && !counted.has(e)) { counted.set(e, u); covered = true; }
      break;
    }
    if (covered) continue;
    for (let k = 1; k <= REACH; k++) {
      const p = addDays(u.planDay, -k);
      if (own(p) === u.splitId && !counted.has(p)) { counted.set(p, u); break; }
    }
  }

  // Rules 3-4: displaced splits are owed, oldest first, and fill days an early session freed.
  const trainedToday = todays.size > 0;
  const owed: Array<{ splitId: string; missed: string }> = [];
  const result = new Map<string, DayResult>();
  for (let k = -WALK_BACK; k <= AHEAD; k++) {
    const d = addDays(T, k);
    const weekdaySplit = raw(d);
    for (let j = owed.length - 1; j >= 0; j--) {
      const o = owed[j]!;
      const paid = used.some(u => u.splitId === o.splitId && u.planDay > o.missed && u.planDay <= d);
      if (weekdaySplit === o.splitId || paid) owed.splice(j, 1);
    }
    const mine = own(d);
    const c = mine ? counted.get(d) : undefined;
    if (mine && c && c.planDay < d) {
      const dayAfter = raw(addDays(d, 1));
      const idx = owed.findIndex(o => o.splitId !== dayAfter);
      if (idx >= 0) {
        const o = owed[idx]!;
        result.set(d, { splitId: o.splitId, movedFrom: o.missed });
        if (d > T || (d === T && !trainedToday)) owed.splice(idx, 1);
      } else {
        result.set(d, { splitId: null, early: { splitId: mine, on: c.planDay } });
      }
    } else {
      result.set(d, { splitId: mine });
    }
    if (mine && !counted.has(d) && planDays.has(d)) owed.push({ splitId: mine, missed: d });
  }

  // Rule 5: outputs.
  const slot = (d: string): PlanSlot | null => {
    const r = result.get(d);
    const split = r?.splitId ? byId.get(r.splitId) : undefined;
    if (!split) return null;
    return { split, day: d, weekday: weekdayOf(d), ...(r!.movedFrom ? { movedFrom: r!.movedFrom } : {}) };
  };
  const t = slot(T);
  const early = result.get(T)?.early;
  const earlySplit = early ? byId.get(early.splitId) : undefined;
  let next: PlanSlot | null = null;
  const days: SplitPlan['days'] = [];
  for (let k = 0; k <= AHEAD; k++) {
    const d = addDays(T, k);
    days.push({ day: d, splitId: result.get(d)?.splitId ?? null });
    if (k > 0 && !next) next = slot(d);
  }
  return {
    today: t ? { ...t, off: off.has(T) } : null,
    doneEarly: earlySplit ? { split: earlySplit, on: early!.on } : null,
    next,
    days,
  };
}

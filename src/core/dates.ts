import type { Session, Weekday } from './models';
import { WEEKDAYS } from './models';

const pad = (n: number) => String(n).padStart(2, '0');

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

/** Local calendar day as YYYY-MM-DD. A day key passes through unchanged (new Date('2026-09-22') is UTC midnight). */
export function dayKey(value: Date | string | number = new Date()): string {
  if (typeof value === 'string' && DAY_KEY.test(value)) return value;
  const d = value instanceof Date ? value : new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return dayKey(new Date());
}

/** Local midnight (ms) per day key. Brain loops compare the same few hundred days many times. */
const dayMsCache = new Map<string, number>();
function dayMs(key: string): number {
  const hit = dayMsCache.get(key);
  if (hit !== undefined) return hit;
  const [y, m, d] = key.split('-').map(Number);
  const ms = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1).getTime();
  if (dayMsCache.size > 5000) dayMsCache.clear();
  dayMsCache.set(key, ms);
  return ms;
}

/** Forget cached local midnights: call after the time zone changes. */
export function resetDayCache(): void { dayMsCache.clear(); }

export function parseDay(key: string): Date {
  return new Date(dayMs(key));
}

export function addDays(key: string, n: number): string {
  const d = parseDay(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

export function weekdayOf(key: string): Weekday {
  return WEEKDAYS[parseDay(key).getDay()] as Weekday;
}

/** Monday of the week containing `key`. */
export function weekStart(key: string): string {
  const d = parseDay(key);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return dayKey(d);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((dayMs(b) - dayMs(a)) / 86_400_000);
}

/**
 * QA8-4: sessions that count as "trained today" — dated today, or ended today within the last
 * 6 hours (started before midnight, finished just after). Read-only: never changes the stored
 * `day`, history or records. QA8-1, QA8-2, QA8-3 and `sessionsToday` all share this.
 */
export function trainedTodaySessions(sessions: Session[], today: string, now: number): Session[] {
  return sessions.filter(s => s.day === today || (dayKey(s.endedAt) === today && now - new Date(s.endedAt).getTime() <= 6 * 3600_000));
}

export function trainedToday(sessions: Session[], today: string, now: number): boolean {
  return trainedTodaySessions(sessions, today, now).length > 0;
}

export interface NextScheduled { splitId: string; weekday: Weekday; day: string }

/** The next scheduled split strictly after `today`, walking forward at most `maxDays`. Null when nothing is scheduled in that window (QA8-1, QA8-2). */
export function nextScheduled(schedule: Record<Weekday, string | null>, today: string, maxDays = 7): NextScheduled | null {
  for (let i = 1; i <= maxDays; i++) {
    const day = addDays(today, i);
    const weekday = weekdayOf(day);
    const splitId = schedule[weekday];
    if (splitId) return { splitId, weekday, day };
  }
  return null;
}

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
};

export function formatDay(key: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }): string {
  return parseDay(key).toLocaleDateString(undefined, opts);
}

/** A time of day in the person's locale, e.g. 17:30. (formatClock is a duration.) */
export function formatTimeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/** A stored ISO time as the person's local day and time, e.g. "Tue, 22 Sep 17:30". */
export function formatLocalStamp(iso: string): string {
  return `${formatDay(dayKey(iso))} ${formatTimeOfDay(iso)}`;
}

export function formatClock(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
}

/** "3h" / "1.5d" style durations for recovery copy. */
export function formatHours(hours: number): string {
  if (hours < 1) return 'under 1h';
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = hours / 24;
  return days < 3 ? `${Math.round(days * 2) / 2}d` : `${Math.round(days)}d`;
}

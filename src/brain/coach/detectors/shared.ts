/** Small helpers shared by detectors and planners. */
import type { Session } from '@/core/models';
import { daysBetween } from '@/core/dates';
import { isWorkingSet } from '../../exposure';
import type { Confidence, Evidence, Finding, FindingKind, Subject } from '../contract';
import { PRINCIPLES_BY_FINDING } from '../contract';

export function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export function quantile(xs: number[], q: number): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return s[lo]! + (s[hi]! - s[lo]!) * (pos - lo);
}

export const round1 = (v: number): number => Math.round(v * 10) / 10;
export const round2 = (v: number): number => Math.round(v * 100) / 100;

/** Whole weeks between the first session and today, counting the current one. */
export function weeksOfData(sessions: Session[], today: string): number {
  const first = sessions[0]?.day;
  if (!first) return 0;
  return Math.floor(Math.max(0, daysBetween(first, today)) / 7) + 1;
}

/** Share of recent working rep sets with an effort rating, over the last `n` sessions. */
export function effortCoverage(sessions: Session[], n = 3): { coverage: number; sets: number } {
  const recent = sessions.slice(-n);
  const sets = recent.flatMap(s => s.exercises.flatMap(e => e.sets)).filter(s => isWorkingSet(s) && (s.reps ?? 0) > 0);
  const rated = sets.filter(s => s.effort).length;
  return { coverage: sets.length ? rated / sets.length : 0, sets: sets.length };
}

export function evidenceFrom(sessions: Session[]): Evidence {
  return { sessionIds: sessions.map(s => s.id), days: [...new Set(sessions.map(s => s.day))].sort() };
}

/** Most recent display name for each exercise id logged, newest first. */
export function loggedExercises(sessions: Session[]): Array<{ id: string; name: string }> {
  const names = new Map<string, string>();
  for (const s of [...sessions].reverse()) for (const e of s.exercises) if (!names.has(e.exerciseId)) names.set(e.exerciseId, e.name);
  return [...names].map(([id, name]) => ({ id, name }));
}

interface Make {
  kind: FindingKind;
  target: string;
  subject: Subject;
  metrics: Finding['metrics'];
  from: string;
  to: string;
  weeks?: number;
  sessions?: number;
  confidence: Confidence;
  severity: Finding['severity'];
  evidence: Evidence;
}

/** Build a finding with its id and principle references filled in. */
export function finding(m: Make): Finding {
  const window: Finding['window'] = { from: m.from, to: m.to };
  if (m.weeks != null) window.weeks = m.weeks;
  if (m.sessions != null) window.sessions = m.sessions;
  return {
    id: `${m.kind}:${m.target}`,
    kind: m.kind,
    subject: m.subject,
    metrics: m.metrics,
    window,
    confidence: m.confidence,
    severity: m.severity,
    evidence: m.evidence,
    principles: PRINCIPLES_BY_FINDING[m.kind],
  };
}

export const CONFIDENCE_RANK: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };

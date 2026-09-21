/** Personal morning-readiness statistics. Pure, synchronous and local. */
import type { ReadinessEntry } from '@/core/models';
import { daysBetween } from '@/core/dates';
import {
  READINESS_BASELINE_MIN_ENTRIES,
  READINESS_BASELINE_WINDOW_DAYS,
  READINESS_DIM_DROP,
  READINESS_DRIFT_MIN_RUN,
  READINESS_FLOOR_HARD_AVG,
  READINESS_GOOD_AVG,
  READINESS_LOW_AVG,
  READINESS_MAD_FLOOR,
  READINESS_Z_AMBER,
  READINESS_Z_GREEN,
  READINESS_Z_RED,
} from './coach/bands';

export type ReadinessDimension = 'sleep' | 'soreness' | 'stress';
export const READINESS_DIMENSIONS: readonly ReadinessDimension[] = ['sleep', 'soreness', 'stress'];
export const READINESS_DIMENSION_LABEL: Record<ReadinessDimension, string> = { sleep: 'Sleep', soreness: 'Soreness', stress: 'Stress' };

export type ReadinessVerdict = 'green' | 'steady' | 'amber' | 'red';
export interface ReadinessCentre { median: number; mad: number }
export interface ReadinessBaseline {
  sleep: ReadinessCentre;
  soreness: ReadinessCentre;
  stress: ReadinessCentre;
  avg: ReadinessCentre;
  entries: number;
  from: string;
  to: string;
}
export interface ReadinessWorst { dimension: ReadinessDimension; value: number; median: number; delta: number }
export interface ReadinessDrift { dimension: ReadinessDimension; value: number; run: number; median: number; holding: ReadinessDimension | null }
export interface ReadinessToday {
  entry: ReadinessEntry;
  avg: number;
  baseline: ReadinessBaseline | null;
  personalized: boolean;
  delta: number | null;
  madDenom: number | null;
  z: number | null;
  lowLine: number;
  worst: ReadinessWorst | null;
  drift: ReadinessDrift | null;
  verdict: ReadinessVerdict;
  entriesInWindow: number;
  baselineEntriesNeeded: number;
}

const round1 = (v: number): number => Math.round(v * 10) / 10;
const round2 = (v: number): number => Math.round(v * 100) / 100;
const validDay = (day: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) return false;
  const year = Number(match[1]), month = Number(match[2]), date = Number(match[3]);
  const value = new Date(Date.UTC(year, month - 1, date));
  return value.getUTCFullYear() === year && value.getUTCMonth() === month - 1 && value.getUTCDate() === date;
};
const validScore = (value: number): boolean => Number.isInteger(value) && value >= 1 && value <= 5;
/** Valid rows only, one per day (last occurrence wins), sorted without mutating state. */
const canonicalReadiness = (entries: ReadinessEntry[]): ReadinessEntry[] => {
  const byDay = new Map<string, ReadinessEntry>();
  for (const entry of entries) {
    if (validDay(entry.day) && validScore(entry.sleep) && validScore(entry.soreness) && validScore(entry.stress)) byDay.set(entry.day, entry);
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
};
const priorInWindow = (entries: ReadinessEntry[], today: string): ReadinessEntry[] =>
  canonicalReadiness(entries).filter(r => r.day < today && daysBetween(r.day, today) <= READINESS_BASELINE_WINDOW_DAYS);

export function readinessAvg(e: { sleep: number; soreness: number; stress: number }): number {
  return (e.sleep + e.soreness + e.stress) / 3;
}

export function readinessMedian(xs: number[]): number {
  if (!xs.length) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

export function readinessMad(xs: number[], median: number): number {
  return readinessMedian(xs.map(x => Math.abs(x - median)));
}

export function readinessBaseline(entries: ReadinessEntry[], today: string): ReadinessBaseline | null {
  if (!validDay(today)) return null;
  const prior = priorInWindow(entries, today);
  if (prior.length < READINESS_BASELINE_MIN_ENTRIES) return null;
  const centre = (dimension: ReadinessDimension): ReadinessCentre => {
    const xs = prior.map(r => r[dimension]);
    const median = readinessMedian(xs);
    return { median, mad: readinessMad(xs, median) };
  };
  const avgs = prior.map(r => round1(readinessAvg(r)));
  const avgMedian = readinessMedian(avgs);
  const days = prior.map(r => r.day).sort();
  return {
    sleep: centre('sleep'), soreness: centre('soreness'), stress: centre('stress'),
    avg: { median: avgMedian, mad: readinessMad(avgs, avgMedian) },
    entries: prior.length, from: days[0]!, to: days[days.length - 1]!,
  };
}

export function readinessLowLine(baseline: ReadinessBaseline | null): number {
  return baseline
    ? round1(baseline.avg.median + READINESS_Z_AMBER * Math.max(READINESS_MAD_FLOOR, baseline.avg.mad))
    : READINESS_LOW_AVG;
}

export function readinessDrift(entries: ReadinessEntry[], today: string, baseline: ReadinessBaseline | null): ReadinessDrift | null {
  if (!baseline || !validDay(today)) return null;
  const series = canonicalReadiness(entries)
    .filter(r => r.day <= today && daysBetween(r.day, today) <= READINESS_BASELINE_WINDOW_DAYS)
    .sort((a, b) => b.day.localeCompare(a.day));
  if (!series.length || series[0]!.day !== today) return null;
  const candidates = READINESS_DIMENSIONS.map((dimension, order) => {
    const value = series[0]![dimension];
    let run = 0;
    for (const entry of series) {
      if (entry[dimension] !== value) break;
      run += 1;
    }
    return { dimension, value, run, median: baseline[dimension].median, order };
  }).filter(x => x.run >= READINESS_DRIFT_MIN_RUN && x.value <= x.median - 1)
    .sort((a, b) => a.value - b.value || b.run - a.run || a.order - b.order);
  const chosen = candidates[0];
  if (!chosen) return null;
  const holding = READINESS_DIMENSIONS
    .filter(d => d !== chosen.dimension)
    .map((dimension, order) => ({ dimension, delta: series[0]![dimension] - baseline[dimension].median, order }))
    .filter(x => x.delta >= 0)
    .sort((a, b) => b.delta - a.delta || a.order - b.order)[0]?.dimension ?? null;
  return { dimension: chosen.dimension, value: chosen.value, run: chosen.run, median: chosen.median, holding };
}

export function readinessVerdict(r: Pick<ReadinessToday, 'avg' | 'z' | 'personalized' | 'entry' | 'worst'>): ReadinessVerdict {
  const lowDim = r.entry.sleep === 1 || r.entry.soreness === 1 || r.entry.stress === 1;
  if (r.avg <= READINESS_FLOOR_HARD_AVG) return 'red';
  if (!r.personalized && r.avg <= READINESS_LOW_AVG) return 'red';
  if (r.personalized && r.z !== null && r.z <= READINESS_Z_RED) return 'red';
  if (r.personalized && r.z !== null && r.z <= READINESS_Z_AMBER) return 'amber';
  if (r.personalized && r.worst && r.worst.delta <= -READINESS_DIM_DROP) return 'amber';
  if (!lowDim && (r.avg >= READINESS_GOOD_AVG || (r.personalized && r.z !== null && r.z >= READINESS_Z_GREEN))) return 'green';
  return 'steady';
}

export function readinessToday(entries: ReadinessEntry[], today: string): ReadinessToday | null {
  if (!validDay(today)) return null;
  const canonical = canonicalReadiness(entries);
  const entry = canonical.find(r => r.day === today);
  if (!entry) return null;
  const avg = round1(readinessAvg(entry));
  const baseline = readinessBaseline(canonical, today);
  const personalized = baseline !== null;
  const delta = baseline ? round2(avg - baseline.avg.median) : null;
  const madDenom = baseline ? Math.max(READINESS_MAD_FLOOR, baseline.avg.mad) : null;
  const z = delta !== null && madDenom !== null ? round2(delta / madDenom) : null;
  const worst = baseline ? READINESS_DIMENSIONS
    .map((dimension, order) => ({ dimension, value: entry[dimension], median: baseline[dimension].median, delta: round2(entry[dimension] - baseline[dimension].median), order }))
    .filter(x => x.delta < 0)
    .sort((a, b) => a.delta - b.delta || a.order - b.order)
    .map(({ order: _order, ...value }) => value)[0] ?? null : null;
  const priorCount = priorInWindow(canonical, today).length;
  const input = { entry, avg, baseline, personalized, delta, madDenom, z, lowLine: readinessLowLine(baseline), worst,
    drift: readinessDrift(canonical, today, baseline), entriesInWindow: priorCount + 1,
    baselineEntriesNeeded: Math.max(0, READINESS_BASELINE_MIN_ENTRIES - priorCount) };
  return { ...input, verdict: readinessVerdict(input) };
}

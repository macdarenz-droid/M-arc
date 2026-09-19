/**
 * Weekly volume per muscle and per muscle group: drops and spikes against
 * the user's own baseline, muscles far above the band, and major muscles
 * left untouched. Rests on volume_dose_response; spikes also cite
 * load_monitoring_acwr as a soft, non-injury signal.
 */
import { MUSCLE_BY_ID, MUSCLE_IDS, type MuscleGroup, type MuscleId } from '@/data/muscles';
import { addDays, weekStart } from '@/core/dates';
import { weeklyMuscleSets, type WeeklyMuscleSets } from '../../exposure';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import {
  MAJOR_MUSCLES, MIN_WEEKS_OF_DATA, UNCOVERED_MAX_SETS, VOLUME_BASELINE_WEEKS, VOLUME_DROP_RATIO, VOLUME_MIN_BASELINE_SETS,
  VOLUME_MIN_SPIKE_SETS, VOLUME_RECENT_WEEKS, VOLUME_SPIKE_RATIO, WEEKLY_SETS_HIGH,
} from '../bands';
import { evidenceFrom, finding, mean, median, round1, weeksOfData } from './shared';

const GROUPS: MuscleGroup[] = ['chest', 'shoulders', 'arms', 'back', 'core', 'legs'];

export function groupSets(row: WeeklyMuscleSets): Record<MuscleGroup, number> {
  const out = Object.fromEntries(GROUPS.map(g => [g, 0])) as Record<MuscleGroup, number>;
  for (const [m, v] of Object.entries(row.sets) as Array<[MuscleId, number]>) out[MUSCLE_BY_ID[m].group] += v;
  return out;
}

function sessionsBetween(ctx: BrainContext, from: string, to: string) {
  return ctx.sessions.filter(s => s.day >= from && s.day <= to);
}

/** Rows for the last `recent + baseline` complete weeks, index 0 = most recent complete week. */
function completeWeeks(ctx: BrainContext, count: number): WeeklyMuscleSets[] {
  return weeklyMuscleSets(ctx.sessions, ctx.today, count + 1, ctx.custom).slice(1);
}

export function detectVolumeTrend(ctx: BrainContext): Finding[] {
  if (weeksOfData(ctx.sessions, ctx.today) < MIN_WEEKS_OF_DATA) return [];
  const rows = completeWeeks(ctx, VOLUME_RECENT_WEEKS + VOLUME_BASELINE_WEEKS);
  const recentRows = rows.slice(0, VOLUME_RECENT_WEEKS);
  const baseRows = rows.slice(VOLUME_RECENT_WEEKS);
  if (recentRows.length < VOLUME_RECENT_WEEKS || baseRows.length < 3) return [];
  const recentGroups = recentRows.map(groupSets);
  const baseGroups = baseRows.map(groupSets);
  const from = recentRows[recentRows.length - 1]!.week;
  const to = addDays(weekStart(ctx.today), -1);
  const evidence = evidenceFrom(sessionsBetween(ctx, from, to));
  const out: Finding[] = [];
  for (const g of GROUPS) {
    const baseVals = baseGroups.map(r => r[g]);
    const active = baseVals.filter(v => v > 0).length;
    if (active < 3) continue;
    const baseline = median(baseVals);
    const recent = mean(recentGroups.map(r => r[g]));
    const confidence = active >= 6 ? 'high' : active >= 4 ? 'medium' : 'low';
    const changePct = baseline > 0 ? Math.round(((recent - baseline) / baseline) * 100) : 0;
    const common = {
      target: g, subject: { muscleGroup: g }, from, to, weeks: VOLUME_RECENT_WEEKS, confidence, evidence,
    } as const;
    if (baseline >= VOLUME_MIN_BASELINE_SETS && recent <= baseline * VOLUME_DROP_RATIO) {
      out.push(finding({
        ...common, kind: 'volume_drop',
        metrics: { changePct, baselineSets: round1(baseline), currentSets: round1(recent), baselineWeeks: baseRows.length, activeBaselineWeeks: active },
        severity: changePct <= -40 ? 2 : 1,
      }));
    } else if (recent >= VOLUME_MIN_SPIKE_SETS && baseline >= 3 && recent >= baseline * VOLUME_SPIKE_RATIO) {
      const lastWeek = recentGroups[0]![g];
      const chronic = mean(rows.slice(1, 5).map(groupSets).map(r => r[g]));
      out.push(finding({
        ...common, kind: 'volume_spike',
        metrics: {
          changePct, baselineSets: round1(baseline), currentSets: round1(recent), baselineWeeks: baseRows.length, activeBaselineWeeks: active,
          acuteChronicRatio: chronic > 0 ? round1(lastWeek / chronic) : 0,
        },
        severity: changePct >= 100 ? 2 : 1,
      }));
    }
  }
  return out;
}

export function detectSetsOutOfBand(ctx: BrainContext): Finding[] {
  const rows = completeWeeks(ctx, 3);
  if (rows.length < 3) return [];
  const from = rows[rows.length - 1]!.week;
  const to = addDays(weekStart(ctx.today), -1);
  const evidence = evidenceFrom(sessionsBetween(ctx, from, to));
  const out: Finding[] = [];
  for (const m of MUSCLE_IDS) {
    const vals = rows.map(r => r.sets[m] ?? 0);
    if (!vals.every(v => v > WEEKLY_SETS_HIGH)) continue;
    out.push(finding({
      kind: 'weekly_sets_out_of_band', target: m, subject: { muscle: m, muscleGroup: MUSCLE_BY_ID[m].group },
      metrics: { weeklySets: round1(mean(vals)), bandHigh: WEEKLY_SETS_HIGH, weeks: 3 },
      from, to, weeks: 3, confidence: 'high', severity: 1, evidence,
    }));
  }
  return out;
}

export function detectUncovered(ctx: BrainContext): Finding[] {
  if (weeksOfData(ctx.sessions, ctx.today) < 4) return [];
  const rows = completeWeeks(ctx, 4);
  if (rows.length < 4) return [];
  const totals = rows.map(r => Object.values(r.sets).reduce((a, b) => a + (b ?? 0), 0));
  const activeWeeks = totals.filter(t => t >= 4).length;
  if (activeWeeks < 3) return [];
  const from = rows[rows.length - 1]!.week;
  const to = addDays(weekStart(ctx.today), -1);
  const evidence = evidenceFrom(sessionsBetween(ctx, from, to));
  const out: Finding[] = [];
  for (const m of MAJOR_MUSCLES) {
    const vals = rows.map(r => r.sets[m] ?? 0);
    if (!vals.every(v => v < UNCOVERED_MAX_SETS)) continue;
    out.push(finding({
      kind: 'uncovered_muscle', target: m, subject: { muscle: m, muscleGroup: MUSCLE_BY_ID[m].group },
      metrics: { weeks: 4, activeWeeks, weeklySets: round1(mean(vals)), threshold: UNCOVERED_MAX_SETS },
      from, to, weeks: 4, confidence: activeWeeks >= 4 ? 'high' : 'medium', severity: 1, evidence,
    }));
  }
  return out;
}

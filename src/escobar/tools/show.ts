/**
 * What each `show` component draws (§4.4, §9), as pure data. The component renders this,
 * and the same object goes back to the model as the tool result, so the prose about a
 * chart is grounded in exactly the numbers drawn. At most 12 points per series.
 */
import type { ShowComponentId } from '@/core/models';
import { SHOW_COMPONENT_IDS, WEEKDAYS } from '@/core/models';
import { addDays, weekStart } from '@/core/dates';
import { MUSCLE_IDS, muscleLabel, type MuscleId } from '@/data/muscles';
import { exerciseHistory } from '@/brain/history';
import { plateauStatus, trend } from '@/brain/trend';
import { muscleVolumeStatus } from '@/brain/volume';
import { readinessSeries } from '@/brain/coach/rules';
import { weekSummary, weeklyVolumeHistory } from '@/brain/weekly';
import { allRecords, PR_LABEL } from '@/brain/prs';
import { evaluatePlan } from '@/brain/plan';
import { suggestNext } from '@/brain/progression';
import { warmupSets } from '@/brain/coach/pre';
import { pickCue } from '@/brain/coach/cues';
import { substitutesFor } from '@/brain/substitute';
import { weightTrendPctPerWeek } from '@/brain/coach/weeklyReview';
import { resolveProfile } from '@/brain/units';
import { ToolError, getHeartSession, loadOf } from './read';
import { planDraftArg } from './actions';
import { coachCtx, exerciseName, exerciseOf, readinessToday, recoveryAt, redactDrivers, type ToolCtx } from './context';

type P = Record<string, unknown>;
const r1 = (v: number): number => Math.round(v * 10) / 10;
const lastN = <T>(xs: T[], n = 12): T[] => (xs.length > n ? xs.slice(-n) : xs);
const intIn = (v: unknown, lo: number, hi: number, def: number, name: string): number => {
  if (v == null) return def;
  const n = Math.round(Number(v));
  if (!Number.isFinite(n) || n < lo || n > hi) throw new ToolError(`${name} must be ${lo}–${hi}`);
  return n;
};
const exId = (ctx: ToolCtx, v: unknown): string => {
  if (typeof v !== 'string' || !exerciseOf(ctx, v)) throw new ToolError(`unknown exerciseId ${String(v)}; use search_exercises`);
  return exerciseOf(ctx, v)!.id;
};
const period = (v: unknown, name: string): { from: string; to: string } => {
  const o = v as { from?: unknown; to?: unknown } | null;
  const ok = (d: unknown) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
  if (!o || !ok(o.from) || !ok(o.to) || String(o.from) > String(o.to)) throw new ToolError(`${name} needs from ≤ to, as YYYY-MM-DD`);
  return { from: String(o.from), to: String(o.to) };
};

/** Components that need a sharing toggle. */
export const COMPONENT_GATE: Partial<Record<ShowComponentId, 'health' | 'body'>> = { heart_session: 'health', body_trend: 'body' };

export function summarize(component: string, params: P, ctx: ToolCtx): Record<string, unknown> {
  if (!SHOW_COMPONENT_IDS.includes(component as ShowComponentId)) throw new ToolError(`unknown component ${component}`);
  const s = ctx.state;
  switch (component as ShowComponentId) {
    case 'lift_trend': {
      const id = exId(ctx, params.exerciseId);
      const weeks = intIn(params.weeks, 4, 52, 12, 'weeks');
      const metric = params.metric === 'top_set' || params.metric === 'volume' ? params.metric : 'e1rm';
      const all = exerciseHistory(s.sessions, id, s.customExercises);
      const since = addDays(ctx.today, -weeks * 7);
      const hist = lastN(all.filter(h => h.day >= since));
      const val = (h: typeof hist[number]) => (metric === 'e1rm' ? r1(h.bestE1rm || h.topKg) : metric === 'top_set' ? h.topKg : Math.round(h.volume));
      const points = hist.map(h => ({ day: h.day, value: val(h) }));
      const values = points.map(p => p.value).filter(v => v > 0);
      const p = plateauStatus(all);
      const t = trend(all.slice(-12).map(h => ({ day: h.day, value: h.bestE1rm || h.topKg })));
      return {
        exercise: exerciseName(ctx, id), exerciseId: id, metric, unit: metric === 'volume' ? 'kg' : 'kg', weeks, points,
        first: values[0] ?? null, last: values.at(-1) ?? null, best: values.length ? Math.max(...values) : null,
        plateau: p.status, trend: t.direction,
        empty: !points.length ? `No ${exerciseName(ctx, id)} sessions in the last ${weeks} weeks.` : undefined,
      };
    }
    case 'recovery_map': {
      let at = ctx.now;
      if (params.at != null) {
        const t = Date.parse(String(params.at));
        if (!Number.isFinite(t) || t > ctx.now + 7 * 86_400_000 + 60_000) throw new ToolError('at must be an ISO time at most 7 days ahead');
        at = t;
      }
      const rec = recoveryAt(ctx, at).filter(r => r.lastTrainedAt);
      const least = [...rec].sort((a, b) => a.pct - b.pct).slice(0, 3);
      return {
        at: new Date(at).toISOString().slice(0, 16),
        muscles: Object.fromEntries(rec.map(r => [r.muscle, r.pct])),
        least: least.map(r => ({ muscle: r.muscle, label: muscleLabel(r.muscle), pct: r.pct, hoursLeft: Math.round(r.hoursLeft) })),
        empty: rec.length ? undefined : 'Nothing logged yet.',
      };
    }
    case 'volume_bars': {
      const muscles = Array.isArray(params.muscles) ? (params.muscles as string[]).filter(m => MUSCLE_IDS.includes(m as MuscleId)) as MuscleId[] : undefined;
      intIn(params.weeks, 1, 12, 1, 'weeks');
      const rows = muscleVolumeStatus(s.sessions, ctx.today, s.customExercises).filter(r => (muscles?.length ? muscles.includes(r.muscle) : r.status !== 'unknown')).sort((a, b) => b.thisWeekSets - a.thisWeekSets).slice(0, 12);
      return { bars: rows.map(r => ({ muscle: r.muscle, label: muscleLabel(r.muscle), sets: r.thisWeekSets, band: r.band, status: r.status })), empty: rows.length ? undefined : 'No sets logged this week yet.' };
    }
    case 'readiness_gauge': {
      const r = readinessToday(ctx);
      return r ? { score: r.score, band: r.band, confidence: r.confidence, calibrating: r.calibrating, drivers: redactDrivers(r.drivers, s.escobar.sharing.health), loadAdvice: r.loadAdvice } : { score: null, empty: 'No readiness yet: add a check-in or connect health data.' };
    }
    case 'readiness_history': {
      const days = intIn(params.days, 7, 30, 14, 'days');
      const series = readinessSeries(coachCtx(ctx), days).map((r, i) => ({ day: addDays(ctx.today, -i), band: r?.band ?? null, score: r?.score ?? null })).reverse();
      const scored = series.filter(x => x.score != null);
      return { days, points: lastN(series, 30), green: series.filter(x => x.band === 'green').length, amber: series.filter(x => x.band === 'amber').length, red: series.filter(x => x.band === 'red').length, empty: scored.length ? undefined : 'No readiness history yet.' };
    }
    case 'week_summary': {
      const off = intIn(params.offsetWeeks, 0, 8, 0, 'offsetWeeks');
      const day = addDays(weekStart(ctx.today), -7 * off + (off ? 6 : 0));
      const w = weekSummary(s.sessions, off ? day : ctx.today, s.customExercises, WEEKDAYS.filter(d => s.schedule[d]).length || 3);
      return { week: w.start, workouts: w.workouts, sets: w.sets, volumeKg: w.volumeKg, records: w.records.length, grade: w.grade.title };
    }
    case 'session_summary': {
      const x = s.sessions.find(y => y.id === params.sessionId);
      if (!x) throw new ToolError('unknown sessionId; use get_sessions');
      const e = x.exercises.map(ex => {
        const top = ex.sets.filter(st => (st.kg ?? 0) > 0).sort((a, b) => (b.kg ?? 0) - (a.kg ?? 0))[0];
        return { exercise: ex.name, sets: ex.sets.length, ...(top ? { top: { ...loadOf(ctx, ex.exerciseId, top.kg!), reps: top.reps ?? 0 } } : {}) };
      });
      const all = x.exercises.flatMap(ex => ex.sets);
      return {
        sessionId: x.id, day: x.day, split: x.splitName, durationMin: Math.round(x.durationSec / 60), exercises: e.slice(0, 12),
        effort: { easy: all.filter(z => z.effort === 'easy').length, ideal: all.filter(z => z.effort === 'ideal').length, max: all.filter(z => z.effort === 'max').length },
        ...(s.escobar.sharing.health && x.heart ? { heart: { avgBpm: x.heart.avgBpm, maxBpm: x.heart.maxBpm } } : {}),
      };
    }
    case 'records_list': {
      const id = params.exerciseId != null ? exId(ctx, params.exerciseId) : undefined;
      const limit = intIn(params.limit, 1, 10, 5, 'limit');
      const rows = allRecords(s.sessions, s.customExercises).filter(r => !id || r.exerciseId === id).slice(0, limit);
      return { records: rows.map(r => ({ exercise: r.exerciseName, day: r.day, kind: PR_LABEL[r.kind], detail: r.detail })), empty: rows.length ? undefined : 'No records yet.' };
    }
    case 'plan_week': {
      if (params.draft != null) {
        const d = planDraftArg(params.draft, ctx);
        const ev = evaluatePlan(d, { goal: s.goal, custom: s.customExercises, sessions: s.sessions, today: ctx.today });
        return { source: 'draft', days: WEEKDAYS.map(day => { const sp = d.splits.find(x => x.ref === d.schedule[day]); return { day, split: sp?.name ?? null, sets: sp ? sp.exercises.reduce((a, e) => a + e.sets, 0) : 0, muscles: sp ? [...new Set(sp.exercises.flatMap(e => exerciseOf(ctx, e.exerciseId)?.primary ?? []))].slice(0, 4) : [] }; }), sessionMinutes: ev.sessionMinutes };
      }
      return { source: 'current', days: WEEKDAYS.map(day => { const sp = s.splits.find(x => x.id === s.schedule[day]); return { day, split: sp?.name ?? null, sets: sp ? sp.exercises.reduce((a, e) => a + e.sets, 0) : 0, muscles: sp ? [...new Set(sp.exercises.flatMap(e => exerciseOf(ctx, e.exerciseId)?.primary ?? []))].slice(0, 4) : [] }; }) };
    }
    case 'plan_evaluation': {
      const d = planDraftArg(params.draft, ctx);
      const ev = evaluatePlan(d, { goal: s.goal, custom: s.customExercises, sessions: s.sessions, today: ctx.today });
      const rows = (Object.entries(ev.weeklySets) as Array<[MuscleId, { sets: number; band: [number, number]; status: string }]>).sort((a, b) => b[1].sets - a[1].sets).slice(0, 12);
      return { muscles: rows.map(([m, v]) => ({ muscle: m, label: muscleLabel(m), sets: v.sets, band: v.band, status: v.status })), balance: ev.balance, conflicts: ev.recoveryConflicts, issues: ev.issues.slice(0, 8), sessionMinutes: ev.sessionMinutes };
    }
    case 'exercise_card': {
      const id = exId(ctx, params.exerciseId);
      const e = exerciseOf(ctx, id)!;
      const profile = resolveProfile(id, s.units.activeGymId, s.units, e);
      const next = suggestNext(s.sessions, id, s.goal, ctx.today, e.defaultSets, s.customExercises, { equipment: profile });
      const cue = pickCue(e, 'coach', `${ctx.today}|${id}`);
      return {
        exercise: e.name, exerciseId: id, equipment: e.equipment, primary: e.primary, secondary: e.secondary,
        next: { target: next.target, reason: next.reason },
        warmup: e.role === 'main' && (next.sets[0]?.kg ?? 0) > 0 ? warmupSets(next.sets[0]!.kg!, profile).map(w => ({ ...loadOf(ctx, id, w.kg), reps: w.reps })) : [],
        cue: cue?.text ?? null, substitutes: substitutesFor(e, s.customExercises).slice(0, 3).map(x => x.name),
      };
    }
    case 'heart_session': return getHeartSession({ sessionId: String(params.sessionId ?? '') }, ctx) as Record<string, unknown>;
    case 'compare_periods': {
      const metric = params.metric;
      if (!['sets', 'volume', 'sessions', 'e1rm'].includes(String(metric))) throw new ToolError('metric must be sets, volume, sessions or e1rm');
      const a = period(params.a, 'a'), b = period(params.b, 'b');
      const exercise = params.exerciseId != null ? exId(ctx, params.exerciseId) : undefined;
      if (metric === 'e1rm' && !exercise) throw new ToolError('e1rm needs an exerciseId');
      const calc = (p: { from: string; to: string }): number => {
        const inP = s.sessions.filter(x => x.day >= p.from && x.day <= p.to);
        if (metric === 'sessions') return inP.length;
        if (metric === 'e1rm') return r1(Math.max(0, ...exerciseHistory(inP, exercise!, s.customExercises).map(h => h.bestE1rm)));
        let sets = 0, vol = 0;
        for (const x of inP) for (const e of x.exercises) { if (exercise && e.exerciseId !== exercise) continue; for (const st of e.sets) { if ((st.reps ?? 0) > 0 || (st.durationSec ?? 0) > 0) { sets++; vol += (st.kg ?? 0) * (st.reps ?? 0); } } }
        return metric === 'sets' ? sets : Math.round(vol);
      };
      const va = calc(a), vb = calc(b);
      return { metric, ...(exercise ? { exercise: exerciseName(ctx, exercise) } : {}), a: { ...a, value: va }, b: { ...b, value: vb }, delta: r1(vb - va), deltaPct: va ? r1(((vb - va) / va) * 100) : null };
    }
    case 'body_trend': {
      const weeks = intIn(params.weeks, 4, 52, 12, 'weeks');
      const since = addDays(ctx.today, -weeks * 7);
      const log = s.weightLog.filter(w => w.day >= since);
      const t = weightTrendPctPerWeek(log);
      return { weeks, points: lastN(log).map(w => ({ day: w.day, kg: w.kg })), trendKg: t?.trendKg ?? null, pctPerWeek: t?.pctPerWeek ?? null, bodyFat: s.body.filter(b => b.day >= since).slice(-6).map(b => ({ day: b.day, pct: b.bodyFatPct })), empty: log.length ? undefined : `No weigh-ins in the last ${weeks} weeks.` };
    }
  }
}

/** Weekly totals used by compare-style views. */
export const weeklyTotals = (ctx: ToolCtx, weeks: number) => weeklyVolumeHistory(ctx.state.sessions, ctx.today, weeks, ctx.state.customExercises);

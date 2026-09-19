import { describe, it, expect } from 'vitest';
import { synthesizeHistory, runBacktest, renderMarkdown, replay } from '@/brain/coach/backtest';
import { flatTail } from '@/brain/coach/detectors';
import { buildReport } from '@/brain/coach/report';
import { exerciseHistory } from '@/brain/history';
import { session, sets } from './helpers';
import { addDays } from '@/core/dates';

describe('backtest on the synthetic history', () => {
  const h = synthesizeHistory('2026-09-19', 30);
  const input = { sessions: h.sessions, splits: h.splits, schedule: h.schedule, goal: h.goal, today: h.today };

  it('plants a coherent thirty-week history', () => {
    expect(h.sessions).toHaveLength(90);
    expect(h.sessions[0]!.day).toBe('2026-02-23');
    expect(h.sessions[h.sessions.length - 1]!.day).toBe('2026-09-19');
    expect(h.events).toHaveLength(10);
    const bench = exerciseHistory(h.sessions, 'lib_barbell_bench_press');
    expect(bench[12]!.topKg).toBe(70);
    expect(bench[22]!.topKg).toBe(70);
    expect(bench[27]!.topKg).toBe(65);
  });

  it('every planted event fires inside its window and nothing fires on the steady lifts', { timeout: 60_000 }, () => {
    const r = runBacktest(input, { source: 'test', step: 3, events: h.events, mustNotFire: h.mustNotFire });
    for (const e of r.events) expect(e.verdict, `${e.label}: first seen ${e.firstSeen}, window ${e.from} → ${e.to}`).toBe('hit');
    for (const f of r.falseFires) expect(f.days, f.label).toBe(0);
    expect(r.noise.proposalsPerDay).toBeLessThan(8);
    // The only proposal that comes back is the schedule nudge, once: the habit is planted to go cold and be relearned.
    expect(r.noise.flapping).toEqual([{ id: 'schedule:*', returns: 1 }]);
    expect(r.recovery.underRecovered.sessions).toBe(0);
    expect(r.habit.learnedDays).toBe('tue,thu,sat');
    const md = renderMarkdown(r);
    for (const heading of ['## Planted events', '## Findings that must not fire', '## Noise', '## Recovery check', '## Habit check', '## First fire per finding']) expect(md).toContain(heading);
    expect(md).toContain('10 of 10 planted events');
  });

  it('replay records first and last fire per finding', { timeout: 60_000 }, () => {
    const rep = replay(input, { step: 7, startDay: '2026-06-01' });
    const plateau = rep.firstFire.get('plateau:lib_barbell_bench_press')!;
    expect(plateau).toBeDefined();
    expect(plateau.first >= '2026-06-15').toBe(true);
    expect(plateau.days).toBeGreaterThan(3);
  });
});

describe('one report on ninety sessions stays cheap', () => {
  it('builds in well under a second', () => {
    const h = synthesizeHistory('2026-09-19', 30);
    const d = new Date(2026, 8, 19, 23, 30);
    const ctx = { sessions: h.sessions, splits: h.splits, schedule: h.schedule, custom: [], goal: h.goal, restDefaultSec: 90, health: { connected: false }, today: h.today, now: d.getTime(), dismissed: {}, accepted: {} };
    buildReport(ctx); // warm the module-level indexes
    const start = performance.now();
    buildReport(ctx);
    expect(performance.now() - start).toBeLessThan(750);
  });
});

describe('flat tail', () => {
  const bench = (kgs: number[]) => exerciseHistory(kgs.map((kg, i) => session(addDays('2026-06-01', i * 4), [{ id: 'lib_barbell_bench_press', sets: sets(kg, 8) }])), 'lib_barbell_bench_press');
  it('scales the required stall length to how often this person usually improves', () => {
    const everyThree = flatTail(bench([60, 60, 60, 62.5, 62.5, 62.5, 65, 65, 65, 65, 65]));
    expect(everyThree.usualStep).toBe(3);
    expect(everyThree.minTail).toBe(5);
    expect(everyThree.tail).toBe(5);
    const weekly = flatTail(bench([60, 62.5, 65, 67.5, 70, 70, 70, 70]));
    expect(weekly.usualStep).toBe(1);
    expect(weekly.minTail).toBe(4);
    expect(weekly.tail).toBe(4);
    const noHistory = flatTail(bench([60, 60, 60]));
    expect(noHistory.usualStep).toBe(3);
    expect(noHistory.tail).toBe(3);
  });
});

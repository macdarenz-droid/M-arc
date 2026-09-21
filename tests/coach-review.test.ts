import { describe, expect, it } from 'vitest';
import { detectWeekClose } from '@/brain/coach/detectors/review';
import { reportNumbers } from '@/brain/coach/contract';
import { buildReport } from '@/brain/coach/report';
import type { Session } from '@/core/models';
import { ctx, PUSH_ID } from './coach-helpers';

const days = ['2026-08-17', '2026-08-24', '2026-08-31', '2026-09-07', '2026-09-14'];
const sessions: Session[] = days.map((day, index) => ({ id: `s${index}`, splitId: PUSH_ID, splitName: 'Push', day, startedAt: `${day}T10:00:00.000Z`, endedAt: `${day}T11:00:00.000Z`, durationSec: 3600,
  exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: Array.from({ length: index === 4 ? 4 : 2 }, () => ({ kg: 50, reps: 8 })) }] }));

describe('week close finding', () => {
  it('emits grounded scalar metrics with medium confidence after four baseline weeks', () => {
    const c = ctx(sessions, { today: '2026-09-21' });
    const finding = detectWeekClose(c)[0]!;
    expect(finding).toMatchObject({ kind: 'week_review', confidence: 'medium', severity: 0, window: { from: '2026-09-14', to: '2026-09-20' }, metrics: { hasBaseline: true, sets: 4, baselineSets: 2, setsDelta: 2 } });
    const report = buildReport(c);
    expect(report.findings.some(item => item.id === finding.id)).toBe(true);
    for (const value of Object.values(finding.metrics)) if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
    expect(reportNumbers(report).has(4)).toBe(true);
  });

  it('retains factual totals at low confidence without null numeric metrics', () => {
    const finding = detectWeekClose(ctx(sessions.slice(2), { today: '2026-09-21' }))[0]!;
    expect(finding.confidence).toBe('low');
    expect(finding.metrics.hasBaseline).toBe(false);
    expect(Object.values(finding.metrics)).not.toContain(null);
  });
});

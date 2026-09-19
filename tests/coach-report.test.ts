import { describe, it, expect } from 'vitest';
import { buildReport, dataQuality } from '@/brain/coach/report';
import { FINDING_KINDS, PROPOSAL_KINDS, reportNumbers } from '@/brain/coach/contract';
import { PRINCIPLE_BY_ID } from '@/brain/coach/principles';
import { session } from './helpers';
import { ctx, pplHistory, std, LAST_MONDAY, PUSH_EX, PUSH_ID } from './coach-helpers';

describe('buildReport', () => {
  it('assembles a versioned report with data quality, sorted findings and valid references', () => {
    const now = new Date('2026-09-19T18:00:00.000Z').getTime();
    const sessions = [...pplHistory(LAST_MONDAY, 12), session('2026-09-18', std(PUSH_EX, 40, 8, 'ideal'), PUSH_ID)];
    const r = buildReport(ctx(sessions, { now, schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } }));
    expect(r.version).toBe(1);
    expect(r.today).toBe('2026-09-19');
    expect(r.dataQuality.sessions).toBe(sessions.length);
    expect(r.dataQuality.insufficientData).toBe(false);
    expect(r.dataQuality.effortCoverage).toBe(1);
    const ids = r.findings.map(f => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (let i = 1; i < r.findings.length; i++) expect(r.findings[i - 1]!.severity).toBeGreaterThanOrEqual(r.findings[i]!.severity);
    for (const f of r.findings) {
      expect(FINDING_KINDS).toContain(f.kind);
      for (const p of f.principles) expect(PRINCIPLE_BY_ID.has(p), p).toBe(true);
      expect(f.confidence === 'low' && !['first_sessions', 'long_gap', 'record', 'effort_missing', 'habit_pattern'].includes(f.kind)).toBe(false);
    }
    for (const p of r.proposals) {
      expect(PROPOSAL_KINDS).toContain(p.kind);
      for (const id of p.principles) expect(PRINCIPLE_BY_ID.has(id), id).toBe(true);
      for (const b of p.basedOn) expect(ids, `${p.id} rests on ${b}`).toContain(b);
    }
    expect(r.findings.some(f => f.kind === 'under_recovered' && f.subject.muscle === 'chest')).toBe(true);
    expect(r.findings.some(f => f.kind === 'habit_pattern')).toBe(true);
    expect(r.proposals[0]!.kind).toBe('today_plan');
    expect(r.proposals.some(p => p.kind === 'schedule')).toBe(true);
    expect(reportNumbers(r).size).toBeGreaterThan(10);
  });

  it('suppresses a proposal dismissed twice, keeps one dismissed once', () => {
    const now = new Date('2026-09-19T18:00:00.000Z').getTime();
    const sessions = [...pplHistory(LAST_MONDAY, 12), session('2026-09-18', std(PUSH_EX), PUSH_ID)];
    const base = ctx(sessions, { now, schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } });
    expect(buildReport({ ...base, dismissed: { 'schedule:*': 1 } }).proposals.some(p => p.kind === 'schedule')).toBe(true);
    expect(buildReport({ ...base, dismissed: { 'schedule:*': 2 } }).proposals.some(p => p.kind === 'schedule')).toBe(false);
  });

  it('a brand-new user gets a baseline finding and a starter split, nothing else', () => {
    const r = buildReport(ctx([], { splits: [] }));
    expect(r.dataQuality.insufficientData).toBe(true);
    expect(r.findings.map(f => f.kind)).toEqual(['first_sessions']);
    expect(r.proposals.map(p => p.kind)).toEqual(['split_new']);
    expect(dataQuality(ctx([])).weeksOfData).toBe(0);
  });

  it('never throws on odd data', () => {
    const weird = [session('2026-09-01', [{ id: 'not_an_exercise', sets: [{ kg: 10, reps: 5 }] }, { id: 'lib_plank', sets: [{ durationSec: 30 }] }])];
    const r = buildReport(ctx(weird, { splits: [{ id: 'x', name: 'Odd', color: '#000', exercises: [{ exerciseId: 'nope', sets: 3 }], focus: [], createdAt: '' }] }));
    expect(r.version).toBe(1);
  });
});

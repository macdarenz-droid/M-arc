import { describe, expect, it } from 'vitest';
import { addDays } from '@/core/dates';
import { trainingDaysPerWeek } from '@/brain/weekly';
import { consistencyDestination, detectConsistencyDrift, learnHabits } from '@/brain/coach/detectors';
import { planConsistencyShift } from '@/brain/coach/planners';
import { buildReport } from '@/brain/coach/report';
import { renderFinding, renderProposal, type RenderContext } from '@/brain/coach/words';
import { ctx, history, pplSplits, PUSH_EX, PUSH_ID, PULL_EX, PULL_ID, std, timedSession } from './coach-helpers';

const LAST_COMPLETE_MONDAY = '2026-09-07';

function driftHistory() {
  const rows = history(LAST_COMPLETE_MONDAY, 16, [
    { weekday: 'fri', splitId: PUSH_ID, exercises: w => (w < 7 || w === 8 || w === 9 ? std(PUSH_EX) : []) },
    { weekday: 'sat', splitId: PUSH_ID, exercises: w => (w >= 10 && w <= 13 ? std(PUSH_EX) : []) },
    { weekday: 'sat', splitId: PULL_ID, exercises: w => (w >= 14 ? std(PULL_EX) : []) },
  ]);
  rows.push(timedSession('2026-05-18', 18, 0, std(PULL_EX), PULL_ID));
  return rows.sort((a, b) => a.day.localeCompare(b.day));
}

describe('consistency drift', () => {
  it('seven of older eight and two of recent eight triggers Friday drift', () => {
    const c = ctx(driftHistory(), { schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: PUSH_ID, sat: null } });
    const model = learnHabits(c.sessions, c.splits, c.today);
    const finding = detectConsistencyDrift(c, model)[0]!;
    expect(finding).toMatchObject({ kind: 'consistency_drift', confidence: 'high', severity: 1 });
    expect(finding.metrics).toMatchObject({ weekday: 'fri', olderCount: 7, recentCount: 2, olderWeeks: 8, recentWeeks: 8, dropCount: 5 });
    expect(finding.evidence.days).toHaveLength(9);
  });

  it('fifteen observed complete weeks and an initial partial week do not qualify', () => {
    const sessions = driftHistory().filter(session => session.day > '2026-05-25');
    expect(detectConsistencyDrift(ctx(sessions))).toEqual([]);
  });

  it('counts duplicate dates once, ignores empty sessions, current week and future logs', () => {
    const sessions = driftHistory();
    const duplicate = { ...sessions.find(session => session.day === '2026-09-12')!, id: 'duplicate' };
    const empty = timedSession('2026-09-12', 20, 0, [], PUSH_ID);
    const current = timedSession('2026-09-18', 18, 0, std(PUSH_EX), PUSH_ID);
    const future = timedSession(addDays('2026-09-19', 7), 18, 0, std(PUSH_EX), PUSH_ID);
    const weeks = trainingDaysPerWeek([...sessions, duplicate, empty, current, future], '2026-09-19', 16);
    expect(weeks.at(-1)!.activeDayCount).toBe(1);
    expect(weeks.at(-1)!.days).toEqual(['sat']);
    expect(weeks.every(week => week.to < '2026-09-14')).toBe(true);
  });

  it('uses stable weekday order after largest drop and older-count ties', () => {
    const sessions = history(LAST_COMPLETE_MONDAY, 16, [
      { weekday: 'mon', splitId: PUSH_ID, exercises: w => w < 6 ? std(PUSH_EX) : [] },
      { weekday: 'tue', splitId: PULL_ID, exercises: w => w < 6 ? std(PULL_EX) : [] },
    ]);
    sessions.push(timedSession('2026-05-18', 18, 0, std(PUSH_EX), PUSH_ID));
    expect(detectConsistencyDrift(ctx(sessions))[0]?.metrics.weekday).toBe('mon');
  });

  it('finds a supported same-split Saturday and produces only a two-day patch', () => {
    const c = ctx(driftHistory(), { schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: PUSH_ID, sat: null } });
    const model = learnHabits(c.sessions, c.splits, c.today);
    const finding = detectConsistencyDrift(c, model)[0]!;
    expect(consistencyDestination(c, 'fri', model)).toEqual({ day: 'sat', weeks: 6, splitWeeks: 4 });
    expect(finding.metrics).toMatchObject({ destinationWeekday: 'sat', destinationCount: 6, destinationSplitCount: 4 });
    const proposal = planConsistencyShift(c, model, finding)!;
    expect(proposal.apply).toMatchObject({ kind: 'schedule', days: { fri: null, sat: { splitId: PUSH_ID } } });
    expect(Object.keys(proposal.apply.kind === 'schedule' ? proposal.apply.days : {})).toEqual(['fri', 'sat']);
    expect(proposal.dismissKey).toBe('schedule:*');
  });

  it('keeps an unsupported or occupied destination informational', () => {
    const base = ctx(driftHistory(), { schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: PUSH_ID, sat: PULL_ID } });
    const model = learnHabits(base.sessions, base.splits, base.today);
    const finding = detectConsistencyDrift(base, model)[0]!;
    expect(consistencyDestination(base, 'fri', model)).toBeNull();
    expect(planConsistencyShift(base, model, finding)).toBeNull();
    expect(base.schedule.fri).toBe(PUSH_ID);
  });

  it('registers grounded research and never competes with the ordinary schedule proposal', () => {
    const c = ctx(driftHistory(), { schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: PUSH_ID, sat: null } });
    const report = buildReport(c);
    const finding = report.findings.find(row => row.kind === 'consistency_drift')!;
    const schedules = report.proposals.filter(row => row.kind === 'schedule');
    expect(finding.principles).toEqual(['habit_formation_and_cues']);
    expect(schedules).toHaveLength(1);
    expect(schedules[0]!.basedOn).toEqual([finding.id]);
    expect(schedules[0]!.principles).toEqual(['habit_formation_and_cues']);
    for (const key of ['olderCount', 'recentCount', 'olderWeeks', 'recentWeeks', 'dropCount', 'destinationCount', 'destinationSplitCount']) {
      expect(typeof finding.metrics[key], key).toBe('number');
    }
  });

  it('renders the logged-session limitation and supported move in the existing Coach copy', () => {
    const c = ctx(driftHistory(), { schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: PUSH_ID, sat: null } });
    const report = buildReport(c);
    const finding = report.findings.find(row => row.kind === 'consistency_drift')!;
    const proposal = report.proposals.find(row => row.id.includes(':drift-'))!;
    const render: RenderContext = { unit: 'kg', splits: c.splits, custom: [], today: c.today, goal: c.goal };
    const insight = renderFinding(finding, render);
    expect(insight.title).toBe('Fri is less common in your logs');
    expect(insight.noticed).toBe('Fri appeared in 7 of the older 8 complete weeks and 2 of the recent 8.');
    expect(insight.means).toContain('This describes logged sessions; your past schedule was not saved.');
    expect(insight.action).toBe('Sat has enough recent logs to review as a schedule move.');
    const suggestion = renderProposal(proposal, report, render);
    expect(suggestion.title).toBe('Move Push from Fri to Sat?');
    expect(suggestion.summary).toBe('Sat appeared in 6 recent weeks, including 4 with Push.');
    expect(suggestion.acceptLabel).toBe('Move the scheduled day');
    expect(suggestion.changes).toEqual(['Fri: cleared', 'Sat: Push at the learned start time']);
  });
});

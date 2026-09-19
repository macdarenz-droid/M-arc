import { describe, it, expect } from 'vitest';
import { buildReport } from '@/brain/coach/report';
import { FINDING_KINDS, PROPOSAL_KINDS, type Finding, type Proposal } from '@/brain/coach/contract';
import { dailySpark, insightsFrom, renderFinding, renderProposal, shortlist, suggestionsFrom, nudgeBody, clock, type RenderContext, CATEGORY_LABEL } from '@/brain/coach/words';
import { detectFocus, focusTarget } from '@/brain/coach/detectors';
import { session, sets } from './helpers';
import { ctx, pplHistory, pplSplits, std, LAST_MONDAY, PUSH_EX, PUSH_ID } from './coach-helpers';
import { addDays } from '@/core/dates';

const render = (over: Partial<RenderContext> = {}): RenderContext => ({ unit: 'kg', splits: pplSplits(), custom: [], today: '2026-09-19', goal: 'lean', ...over });

const looksClean = (s: string) => !/undefined|NaN|\{|\}|\[object/.test(s) && s.trim().length > 0;

describe('words for findings', () => {
  it('renders every finding kind with clean, non-empty words', () => {
    const base: Omit<Finding, 'kind' | 'id'> = {
      subject: { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press', muscle: 'chest', muscleGroup: 'chest', splitId: PUSH_ID, splitName: 'Push' },
      metrics: {
        changePct: -18, baselineSets: 14.5, currentSets: 11.9, weeklySets: 27, bandHigh: 25, threshold: 2, sessions: 8, lastTopKg: 60, firstTopKg: 55, lastTopReps: 8, firstTopReps: 8, lastBestReps: 10, firstBestReps: 8,
        pct: 45, hoursLeft: 26, volumeFactor: 1.5, personalized: true, lastDay: '2026-09-18', ratedPct: 20, maxSharePct: 70, easySharePct: 10, idealSharePct: 20, goalRirLow: 1, goalRirHigh: 3,
        direction: 'harder_than_goal', typicalReps: 12, rangeLow: 6, rangeHigh: 12, exerciseIds: 'lib_barbell_bench_press,lib_dumbbell_bench_press', pattern: 'horizontal_push',
        strong: 'Push', weak: 'Pull', ratioLabel: '2.4×', days: 12, reentry: false, weeksObserved: 12, sessionsPerWeek: 2, wed_start: '18:00', thu_start: '18:30', retired: 'sat',
        currentSets_: 0, targetSets: 12, baselineSets_: 0, daysLeft: 3, sleepHours: 5.5, thresholdMinutes: 360, needed: 4, detail: '65 kg × 8', previous: 60, recordKind: 'heaviest', delta: 0.08,
      },
      window: { from: '2026-08-29', to: '2026-09-18', weeks: 3 }, confidence: 'medium', severity: 1, evidence: { sessionIds: [], days: [] }, principles: [],
    };
    for (const kind of FINDING_KINDS) {
      const f: Finding = { ...base, kind, id: `${kind}:x`, metrics: { ...base.metrics, days: kind === 'habit_pattern' ? 'wed,thu' : 12 } };
      const i = renderFinding(f, render());
      for (const field of [i.title, i.noticed, i.means, i.action]) expect(looksClean(field), `${kind}: ${field}`).toBe(true);
      expect(CATEGORY_LABEL[i.category]).toBeTruthy();
      expect(i.evidence.length, kind).toBeGreaterThanOrEqual(0);
    }
  });

  it('puts real numbers and the user\'s unit into the words', () => {
    const f: Finding = { id: 'plateau:lib_barbell_bench_press', kind: 'plateau', subject: { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press' },
      metrics: { sessions: 8, lastTopKg: 60, lastTopReps: 8, firstTopKg: 60, firstTopReps: 8, lastBestReps: 8, firstBestReps: 8 }, window: { from: '2026-07-01', to: '2026-09-01', sessions: 8 },
      confidence: 'medium', severity: 1, evidence: { sessionIds: [], days: [] }, principles: ['progressive_overload'] };
    const kg = renderFinding(f, render());
    expect(kg.noticed).toContain('60 kg');
    expect(kg.noticed).toContain('8 sessions');
    const lb = renderFinding(f, render({ unit: 'lb' }));
    expect(lb.noticed).toContain('132.5 lb');
    expect(kg.evidence.map(c => c.id)).toEqual(['progressive_overload']);
    expect(kg.priority).toBeGreaterThan(100);
  });

  it('rotates variants weekly and deterministically', () => {
    const f: Finding = { id: 'volume_drop:chest', kind: 'volume_drop', subject: { muscleGroup: 'chest' }, metrics: { changePct: -30, baselineSets: 14, currentSets: 9.8 },
      window: { from: '2026-08-29', to: '2026-09-18', weeks: 3 }, confidence: 'high', severity: 1, evidence: { sessionIds: [], days: [] }, principles: ['volume_dose_response'] };
    const a = renderFinding(f, render({ today: '2026-09-15' })).title;
    const b = renderFinding(f, render({ today: '2026-09-19' })).title; // same week
    expect(b).toBe(a);
    const weeks = ['2026-09-01', '2026-09-08', '2026-09-15', '2026-09-22', '2026-09-29', '2026-10-06'].map(d => renderFinding(f, render({ today: d })).title);
    expect(new Set(weeks).size).toBeGreaterThan(1);
    // Whichever variant is chosen, the key number is in the title or the first line.
    const texts = ['2026-09-01', '2026-09-08', '2026-09-15', '2026-09-22'].map(d => { const i = renderFinding(f, render({ today: d })); return `${i.title} ${i.noticed}`; });
    expect(texts.every(t => t.includes('30%'))).toBe(true);
  });

  it('shortlists at most two per kind', () => {
    const many = Array.from({ length: 6 }, (_, i) => ({ ...renderFinding({ id: `plateau:e${i}`, kind: 'plateau', subject: { exerciseName: `E${i}` }, metrics: { sessions: 8, lastTopKg: 50, lastTopReps: 8 }, window: { from: '', to: '' }, confidence: 'medium', severity: 1, evidence: { sessionIds: [], days: [] }, principles: [] }, render()) }));
    expect(shortlist(many, 6, 2)).toHaveLength(2);
  });

  it('recalls a note flag honestly: what was said, never a diagnosis', () => {
    const pain: Finding = { id: 'note_flag:pain_or_discomfort:rear_delts', kind: 'note_flag', subject: { muscle: 'rear_delts' },
      metrics: { flagKind: 'pain_or_discomfort', daysAgo: 2, day: '2026-09-17' }, window: { from: '2026-09-17', to: '2026-09-17' },
      confidence: 'high', severity: 1, evidence: { sessionIds: ['s1'], days: ['2026-09-17'] }, principles: ['subjective_readiness_monitoring'] };
    const i = renderFinding(pain, render());
    expect(i.title.toLowerCase()).toContain('rear should'); // muscleLabel('rear_delts') = 'Rear shoulders'
    expect(i.noticed).toContain('2 days ago');
    expect(i.means).not.toMatch(/diagnos|injur|torn|strain/i);
    expect(i.category).toBe('readiness');
    const positive: Finding = { ...pain, id: 'note_flag:positive:none', subject: {}, metrics: { flagKind: 'positive', daysAgo: 0, day: '2026-09-19' } };
    const p = renderFinding(positive, render());
    expect(p.noticed).toContain('today');
    expect(p.title).not.toBe(i.title);
  });
});

describe('daily spark', () => {
  const record = renderFinding({ id: 'record:lib_barbell_bench_press:week', kind: 'record', subject: { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press' },
    metrics: { detail: '65 kg × 8', previous: 60, recordKind: 'heaviest' }, window: { from: '2026-09-15', to: '2026-09-15' },
    confidence: 'high', severity: 0, evidence: { sessionIds: [], days: [] }, principles: ['one_rm_estimation'] }, render());
  const progressing = renderFinding({ id: 'progressing:lib_squat', kind: 'progressing', subject: { exerciseId: 'lib_squat', exerciseName: 'Squat' },
    metrics: { sessions: 6, lastTopKg: 90, firstTopKg: 80 }, window: { from: '2026-08-01', to: '2026-09-15' },
    confidence: 'medium', severity: 0, evidence: { sessionIds: [], days: [] }, principles: ['progressive_overload'] }, render());
  const habit = renderFinding({ id: 'habit_pattern:*', kind: 'habit_pattern', subject: {}, metrics: { weeksObserved: 8, days: 'mon' }, window: { from: '2026-08-01', to: '2026-09-15' },
    confidence: 'low', severity: 0, evidence: { sessionIds: [], days: [] }, principles: ['habit_formation_and_cues'] }, render());

  it('picks only from real good news, never invents a line', () => {
    expect(dailySpark([habit], '2026-09-19')).toBeNull(); // nothing spark-worthy here
    expect(dailySpark([], '2026-09-19')).toBeNull();
    const one = dailySpark([record], '2026-09-19');
    expect(one).toEqual({ title: record.title, text: record.noticed, by: 'From your own log' });
  });

  it('rotates deterministically by day among real candidates, ignoring the rest', () => {
    const choices = new Set(['2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20'].map(d => dailySpark([habit, record, progressing], d)?.title));
    expect([...choices].every(t => t === record.title || t === progressing.title)).toBe(true);
    expect(choices.size).toBeGreaterThan(1); // more than one candidate actually gets shown across a week
    // Same day, same pick: a repeat visit does not flip-flop.
    expect(dailySpark([record, progressing], '2026-09-19')).toEqual(dailySpark([record, progressing], '2026-09-19'));
  });
});

describe('words for proposals', () => {
  it('renders every proposal kind from a real report and a synthetic set', () => {
    const now = new Date('2026-09-19T18:00:00.000Z').getTime();
    const sessions = [...pplHistory(LAST_MONDAY, 12), session('2026-09-18', std(PUSH_EX), PUSH_ID)];
    const c = ctx(sessions, { now, goal: 'strength', restDefaultSec: 90, schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } });
    const r = buildReport(c);
    const rc = render({ goal: 'strength' });
    const kinds = new Set<string>();
    for (const p of r.proposals) {
      const sg = renderProposal(p, r, rc);
      kinds.add(p.kind);
      for (const field of [sg.title, sg.summary, sg.acceptLabel, ...sg.why, ...sg.changes]) expect(looksClean(field), `${p.kind}: ${field}`).toBe(true);
      expect(sg.dismissKey).toBe(p.dismissKey);
    }
    expect([...kinds]).toEqual(expect.arrayContaining(['today_plan', 'schedule', 'rest_default', 'load_next']));
    const inbox = suggestionsFrom(r, { snoozedUntil: {} }, rc);
    expect(inbox.some(s => s.kind === 'load_next')).toBe(false);
    expect(suggestionsFrom(r, { snoozedUntil: { 'schedule:*': '2026-09-20' } }, rc).some(s => s.kind === 'schedule')).toBe(false);
    expect(suggestionsFrom(r, { snoozedUntil: { 'schedule:*': '2026-09-18' } }, rc).some(s => s.kind === 'schedule')).toBe(true);
    // Kinds the fixture does not trigger, rendered from hand-built proposals.
    const synth: Proposal[] = [
      { id: 'exercise_swap:a', kind: 'exercise_swap', subject: { exerciseId: 'lib_barbell_bench_press', splitId: PUSH_ID }, apply: { kind: 'exercise_swap', splitId: PUSH_ID, fromExerciseId: 'lib_barbell_bench_press', toExerciseId: 'lib_dumbbell_bench_press' }, basedOn: [], principles: ['exercise_variation'], confidence: 'medium', dismissKey: 'exercise_swap:a' },
      { id: 'add_exercise:hamstrings', kind: 'add_exercise', subject: { muscle: 'hamstrings' }, apply: { kind: 'add_exercise', splitId: 'split_legs', exerciseId: 'lib_lying_leg_curl', sets: 3, muscle: 'hamstrings' }, basedOn: [], principles: ['volume_dose_response'], confidence: 'high', dismissKey: 'add_exercise:hamstrings' },
      { id: 'split_modify:p', kind: 'split_modify', subject: { splitId: PUSH_ID }, apply: { kind: 'split_modify', splitId: PUSH_ID, add: [], remove: ['lib_incline_dumbbell_press'], setChanges: [] }, basedOn: [], principles: ['exercise_variation'], confidence: 'high', dismissKey: 'split_modify:p' },
      { id: 'split_new:*', kind: 'split_new', subject: {}, apply: { kind: 'split_new', daysPerWeek: 2, weeklySetsByMuscle: {}, splits: [{ name: 'Full body A', focus: ['chest'], days: ['mon'], exercises: [{ exerciseId: 'lib_leg_press', sets: 3 }] }] }, basedOn: [], principles: ['volume_dose_response'], confidence: 'low', dismissKey: 'split_new:*' },
      { id: 'deload_week:*', kind: 'deload_week', subject: {}, apply: { kind: 'deload_week', from: '2026-09-19', to: '2026-09-25', loadFactor: 0.85, effortCap: 'ideal' }, basedOn: [], principles: ['deload_evidence'], confidence: 'medium', dismissKey: 'deload_week:*' },
    ];
    for (const p of synth) {
      const sg = renderProposal(p, r, rc);
      for (const field of [sg.title, sg.summary, sg.acceptLabel, ...sg.changes]) expect(looksClean(field), `${p.kind}: ${field}`).toBe(true);
    }
    expect(renderProposal(synth[0]!, r, rc).title).toBe('Swap Barbell Bench Press for Dumbbell Bench Press');
    expect(renderProposal(synth[4]!, r, rc).summary).toContain('85%');
    for (const k of PROPOSAL_KINDS) expect([...kinds, ...synth.map(p => p.kind)]).toContain(k);
  });

  it('nudges name the day and time when learned', () => {
    expect(nudgeBody('Push')).toBe('Push is ready when you are.');
    expect(nudgeBody('Push', 'wed', { hour: 18, minute: 0 })).toBe('Your usual Wed session is around 18:00. Push is ready when you are.');
    expect(clock(6, 5)).toBe('06:05');
  });
});

describe('focus detector', () => {
  it('targets a small bump over the user\'s own baseline', () => {
    expect(focusTarget(10)).toBe(11.5);
    expect(focusTarget(4)).toBe(5);
    expect(focusTarget(30)).toBe(33);
    const splits = pplSplits();
    splits[0]!.focus = ['side_delts'];
    const sessions = pplHistory('2026-09-07', 6); // no session yet this week
    const out = detectFocus(ctx(sessions, { splits }));
    expect(out).toHaveLength(1);
    expect(out[0]!.subject.muscle).toBe('side_delts');
    expect(out[0]!.metrics.currentSets).toBe(0);
    expect(Number(out[0]!.metrics.targetSets)).toBeGreaterThan(0);
    const done = [...sessions, session('2026-09-16', [{ id: 'lib_dumbbell_lateral_raise', sets: sets(10, 12, 'ideal', 8) }, { id: 'lib_dumbbell_shoulder_press', sets: sets(20, 8, 'ideal', 4) }], PUSH_ID)];
    expect(detectFocus(ctx(done, { splits }))).toEqual([]);
    expect(insightsFrom(buildReport(ctx(sessions, { splits })), render({ splits })).some(i => i.kind === 'focus_behind')).toBe(true);
    void addDays;
  });
});

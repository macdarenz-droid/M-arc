/** BUG-40: the Records chip counts every record the app has worked out, and "Show all" lists them (docs/supervisor/verify/bug-40-card.md). */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VNode } from 'preact';

const H = vi.hoisted(() => ({ slots: [] as unknown[], i: 0 }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const k = H.i++;
    if (!(k in H.slots)) H.slots[k] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [H.slots[k], (v: unknown) => { H.slots[k] = typeof v === 'function' ? (v as (x: unknown) => unknown)(H.slots[k]) : v; }];
  },
  useEffect: () => undefined,
  useRef: (v: unknown) => ({ current: v }),
  useMemo: (f: () => unknown) => f(),
}));
vi.mock('@/escobar/palace/focus', () => ({ usePalaceFocus: () => undefined }));

import { today } from '@/app/clock';
import { historySeg } from '@/app/router';
import { replaceState, state } from '@/core/store';
import { freshState, type Session } from '@/core/models';
import { History } from '@/slices/history/History';
import { allRecords, PR_LABEL, recordsInWeek } from '@/brain/prs';
import { formatDay } from '@/core/dates';
import { session, sets } from './helpers';

function find(n: unknown, pred: (v: VNode<Record<string, unknown>>) => boolean, out: VNode<Record<string, unknown>>[] = []): VNode<Record<string, unknown>>[] {
  if (n == null || typeof n !== 'object') return out;
  if (Array.isArray(n)) { for (const c of n) find(c, pred, out); return out; }
  const v = n as VNode<Record<string, unknown>>;
  if (pred(v)) out.push(v);
  find(v.props?.children, pred, out);
  return out;
}
const text = (n: unknown): string =>
  n == null || typeof n === 'boolean' ? '' :
  typeof n === 'string' || typeof n === 'number' ? String(n) :
  Array.isArray(n) ? n.map(text).join('') :
  text((n as VNode<{ children?: unknown }>).props?.children);

const PRESS = 'lib_shoulder_press', ROW = 'lib_seated_cable_row', LATERAL = 'lib_dumbbell_lateral_raise', CALF = 'lib_seated_calf_raise';
const INCLINE = 'lib_incline_machine_press', HAMMER = 'lib_hammer_curl', REAR_DELT = 'lib_rear_delt_fly', CURL = 'lib_dumbbell_biceps_curl';
const NAME: Record<string, string> = {
  [PRESS]: 'Shoulder Press', [ROW]: 'Seated Cable Row', [LATERAL]: 'Dumbbell Lateral Raise', [CALF]: 'Seated Calf Raise',
  [INCLINE]: 'Incline Machine Press', [HAMMER]: 'Hammer Curl', [REAR_DELT]: 'Rear Delt Fly', [CURL]: 'Dumbbell Biceps Curl',
};
const ex = (id: string, setList: ReturnType<typeof sets>) => ({ id, name: NAME[id], sets: setList });

function fixtureSessions(): Session[] {
  return [
    session('2026-09-28', [ex(PRESS, sets(44, 10)), ex(ROW, sets(45, 12)), ex(LATERAL, sets(6, 14))], 'split_1'),
    session('2026-09-30', [ex(PRESS, sets(44, 10)), ex(CALF, sets(40, 15))], 'split_2'),
    session('2026-10-03', [ex(INCLINE, sets(27.5, 8)), ex(ROW, sets(47.5, 12)), ex(HAMMER, sets(10, 12))], 'split_3'),
    session('2026-10-04', [ex(REAR_DELT, sets(32, 10)), ex(CURL, sets(10, 12)), ex(LATERAL, sets(6, 15))], 'split_4'),
    session('2026-10-06', [ex(PRESS, sets(46, 10)), ex(ROW, sets(49.5, 12)), ex(LATERAL, sets(7, 14))], 'split_1'),
    session('2026-10-07', [ex(PRESS, sets(46, 12)), ex(CALF, sets(45, 15))], 'split_2'),
    session('2026-10-09', [ex(INCLINE, sets(27.5, 8)), ex(ROW, sets(49.5, 12)), ex(HAMMER, sets(10, 12))], 'split_3'),
    session('2026-10-11', [ex(REAR_DELT, sets(35.5, 9)), ex(CURL, sets(12, 13)), ex(LATERAL, sets(7, 14))], 'split_4'),
    session('2026-10-13', [ex(PRESS, sets(46, 12)), ex(ROW, sets(49.5, 12)), ex(LATERAL, sets(7, 14))], 'split_1'),
    session('2026-10-17', [ex(INCLINE, sets(30, 7)), ex(ROW, sets(49.5, 13)), ex(HAMMER, sets(12, 14))], 'split_3'),
    session('2026-10-18', [ex(REAR_DELT, sets(35.5, 10)), ex(CURL, sets(12, 15)), ex(LATERAL, sets(7, 16))], 'split_4'),
  ];
}

let sessionsFixture: Session[];
function setSessions(sessions: Session[]) {
  sessionsFixture = sessions;
  replaceState({ ...freshState(), sessions });
}

beforeEach(() => {
  H.slots.length = 0; H.i = 0;
  today.value = '2026-10-18';
  historySeg.value = 'stats';
  setSessions(fixtureSessions());
});

function renderRecordsSection(): VNode<Record<string, unknown>> {
  H.i = 0;
  const tree = History();
  const statsVNode = find(tree, v => typeof v.type === 'function' && v.type.name === 'Stats')[0];
  const rendered = (statsVNode!.type as () => unknown)();
  return find(rendered, v => v.props?.palace === 'history.records')[0]!;
}

function rowTexts(section: VNode<Record<string, unknown>>): string[] {
  return find(section, v => v.props?.trailing !== undefined).map(r => `${text(r.props.children)} | ${text(r.props.trailing)}`);
}
function chipText(section: VNode<Record<string, unknown>>): string {
  return text(section.props.aside).trim();
}
function showAllButton(section: VNode<Record<string, unknown>>): VNode<Record<string, unknown>> | undefined {
  return find(section, v => typeof v.props?.onClick === 'function' && text(v.props.children) === 'Show all')[0];
}

describe('BUG-40 premise: allRecords and the week filter (AC1)', () => {
  it('18 records; 3/4/6 Oct nonzero, 9/13 Oct zero; 12th newest on 10-07; week 7, 17 Oct is 4', () => {
    const recs = allRecords(sessionsFixture);
    expect(recs).toHaveLength(18);
    const byDay = (d: string) => recs.filter(r => r.day === d).length;
    expect(byDay('2026-10-03')).toBeGreaterThan(0);
    expect(byDay('2026-10-04')).toBeGreaterThan(0);
    expect(byDay('2026-10-06')).toBeGreaterThan(0);
    expect(byDay('2026-10-09')).toBe(0);
    expect(byDay('2026-10-13')).toBe(0);
    expect(recs[11]!.day).toBe('2026-10-07');
    const week = recordsInWeek(sessionsFixture, '2026-10-18');
    expect(week).toHaveLength(7);
    expect(week.filter(r => r.day === '2026-10-17')).toHaveLength(4);
  });
});

describe('BUG-40: Records chip counts every record; Show all lists them (AC2)', () => {
  it('chip is 18, not 12; 12 rows and a Show all button before tap; every record after', () => {
    const recs = allRecords(sessionsFixture);
    expect(recs).toHaveLength(18);

    const before = renderRecordsSection();
    expect(chipText(before)).toBe('18');
    const beforeRows = rowTexts(before);
    expect(beforeRows).toHaveLength(12);
    const btn = showAllButton(before);
    expect(btn, 'precondition: one Show all button').toBeDefined();

    const expectedAll = recs.map(r => `${r.exerciseName}${PR_LABEL[r.kind]} · ${r.detail} | ${formatDay(r.day)}`);
    expect(beforeRows).toEqual(expectedAll.slice(0, 12));
    expect(expectedAll).toContain('Shoulder PressHeaviest load · 46 kg × 10 | Tue, Oct 6');
    expect(expectedAll).toContain('Seated Cable RowHeaviest load · 47.5 kg × 12 | Sat, Oct 3');
    expect(beforeRows).not.toContain('Shoulder PressHeaviest load · 46 kg × 10 | Tue, Oct 6');
    expect(beforeRows).not.toContain('Seated Cable RowHeaviest load · 47.5 kg × 12 | Sat, Oct 3');

    (btn!.props.onClick as () => void)();
    const after = renderRecordsSection();
    expect(chipText(after)).toBe('18');
    expect(rowTexts(after)).toEqual(expectedAll);
    expect(rowTexts(after)).toHaveLength(18);
    expect(showAllButton(after)).toBeUndefined();
  });
});

describe('BUG-40: no Show all when everything already fits (AC3)', () => {
  it('8 records from the first 6 sessions: chip 8, 8 rows, no Show all', () => {
    setSessions(fixtureSessions().slice(0, 6));
    const recs = allRecords(sessionsFixture);
    expect(recs).toHaveLength(8);

    const section = renderRecordsSection();
    expect(chipText(section)).toBe('8');
    expect(rowTexts(section)).toHaveLength(8);
    expect(showAllButton(section)).toBeUndefined();
  });
});

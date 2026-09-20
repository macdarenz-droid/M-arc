import { describe, it, expect } from 'vitest';
import { buildAskStats, MAX_STATS_PRS, STATS_WEEKS } from '@/brain/stats';
import { MUSCLE_IDS } from '@/data/muscles';
import { ctx, pplHistory, LAST_MONDAY, TODAY } from './coach-helpers';

describe('buildAskStats', () => {
  it('reports recovery for every muscle, not just the ones currently flagged in the report', () => {
    const sessions = pplHistory(LAST_MONDAY, 8);
    const stats = buildAskStats(ctx(sessions));
    expect(stats.recovery).toHaveLength(MUSCLE_IDS.length);
    for (const r of stats.recovery) expect(['low', 'mid', 'high', 'ready']).toContain(r.tier);
    // A muscle this history never touches (e.g. forearms is only ever a secondary mover here) is still a real, "ready" entry.
    const chest = stats.recovery.find(r => r.muscle === 'chest')!;
    expect(chest.pct).toBeLessThanOrEqual(100);
  });

  it('an empty history still returns all 24 muscles, fully recovered', () => {
    const stats = buildAskStats(ctx([]));
    expect(stats.recovery).toHaveLength(MUSCLE_IDS.length);
    expect(stats.recovery.every(r => r.pct === 100 && r.tier === 'ready')).toBe(true);
  });

  it('current PRs — one entry per exercise+kind, the most recent standing, not every record ever broken', () => {
    const sessions = pplHistory(LAST_MONDAY, 8, (w, _split, ex) => ex.map(e => ({ ...e, sets: e.sets.map(s => ({ ...s, kg: (s.kg ?? 0) + w })) })));
    const stats = buildAskStats(ctx(sessions));
    expect(stats.prs.length).toBeGreaterThan(0);
    expect(stats.prs.length).toBeLessThanOrEqual(MAX_STATS_PRS);
    const keys = stats.prs.map(p => `${p.exerciseId}:${p.kind}`);
    expect(new Set(keys).size).toBe(keys.length); // no duplicate exercise+kind pairs
    for (const p of stats.prs) expect(p.detail.length).toBeGreaterThan(0);
  });

  it('no training history means no PRs, not an error', () => {
    expect(buildAskStats(ctx([])).prs).toEqual([]);
  });

  it('weekly volume trend covers STATS_WEEKS weeks, oldest first, ending on the current week', () => {
    const sessions = pplHistory(LAST_MONDAY, 8);
    const stats = buildAskStats(ctx(sessions));
    expect(stats.weeklyVolume).toHaveLength(STATS_WEEKS);
    expect(stats.weeklyVolume.every((w, i) => i === 0 || w.start > stats.weeklyVolume[i - 1]!.start)).toBe(true);
    expect(stats.weeklyVolume.at(-1)!.end >= TODAY).toBe(true);
  });

  it('deload is null when none is set', () => {
    expect(buildAskStats(ctx([])).deload).toBeNull();
  });

  it('an active deload is reported as-is; an expired one is reported as null, matching what Train/Live actually show today', () => {
    const active = { from: '2026-09-15', to: '2026-09-21', loadFactor: 0.7, effortCap: 'easy' as const };
    const withActive = buildAskStats(ctx([], { deload: active }));
    expect(withActive.deload).toEqual(active);
    const expired = { ...active, from: '2026-01-01', to: '2026-01-07' };
    const withExpired = buildAskStats(ctx([], { deload: expired }));
    expect(withExpired.deload).toBeNull();
  });
});

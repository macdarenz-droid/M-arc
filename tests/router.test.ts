import { describe, it, expect, beforeEach } from 'vitest';
import { closePanel, openPanel, showPanel, validatePanelParams } from '@/app/router';
import { state } from '@/core/store';
import { freshState } from '@/core/models';

beforeEach(() => {
  state.value = { ...freshState(), sessions: [{ id: 's1', splitId: 'x', splitName: 'Push', day: '2026-09-20', startedAt: '2026-09-20T10:00:00.000Z', endedAt: '2026-09-20T11:00:00.000Z', durationSec: 1, exercises: [], logging: { mode: 'live' } as never }] };
  closePanel();
});

describe('validatePanelParams (R1.2)', () => {
  it('keeps real values', () => {
    expect(validatePanelParams('muscle', { muscle: 'chest' })).toEqual({ muscle: 'chest' });
    expect(validatePanelParams('session', { sessionId: 's1' })).toEqual({ sessionId: 's1' });
    expect(validatePanelParams('exercise-stats', { exerciseId: 'lib_barbell_bench_press' })).toEqual({ exerciseId: 'lib_barbell_bench_press' });
    expect(validatePanelParams('settings', { view: 'levels', seg: 'stats' })).toEqual({ view: 'levels', seg: 'stats' });
  });
  it('drops values that point at nothing', () => {
    expect(validatePanelParams('muscle', { muscle: 'wings' })).toEqual({});
    expect(validatePanelParams('session', { sessionId: 'gone' })).toEqual({});
    expect(validatePanelParams('exercise-stats', { exerciseId: 'Bench Press' })).toEqual({});
    expect(validatePanelParams('settings', { view: 'map', seg: 'all' })).toEqual({});
  });
  it('showPanel does nothing when a required param is invalid', () => {
    showPanel('muscle', { muscle: 'wings' });
    expect(openPanel.value).toBeNull();
    showPanel('session', { sessionId: 'gone' });
    expect(openPanel.value).toBeNull();
    showPanel('muscle', { muscle: 'quads' });
    expect(openPanel.value).toEqual({ id: 'muscle', params: { muscle: 'quads' } });
    showPanel('settings');
    expect(openPanel.value).toEqual({ id: 'settings' });
  });
});

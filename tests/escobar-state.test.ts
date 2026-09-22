import { describe, it, expect } from 'vitest';
import { loadState, STATE_KEY } from '@/core/store';
import { DEFAULT_PROXY_URL, freshState } from '@/core/models';

function storageWith(value: unknown) {
  const store = new Map<string, string>([[STATE_KEY, JSON.stringify(value)]]);
  return { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) };
}

describe('coach (Escobar) state', () => {
  it('defaults to off with the deployed proxy for a state saved before it existed', () => {
    const { coach: _omit, ...old } = freshState();
    const { state } = loadState(storageWith(old));
    expect(state.coach).toMatchObject({ remoteExplainer: false, explainerUrl: DEFAULT_PROXY_URL, deviceId: '', askThread: [], statedConstraints: [] });
  });

  it('keeps the thread, device id and toggle a phone saved under the Escobar build', () => {
    const saved = {
      ...freshState(),
      coach: {
        dismissed: { 'x:y': 1 }, remoteExplainer: true, explainerUrl: 'https://example.workers.dev', deviceId: 'dev_abc12345',
        askThread: [{ role: 'user', text: 'What BMI?' }, { role: 'assistant', text: 'Around 22.', scope: 'general' }, { role: 'bogus', text: 1 }],
        statedConstraints: ['Bad left elbow', 7],
      },
    };
    const { state } = loadState(storageWith(saved));
    expect(state.coach.remoteExplainer).toBe(true);
    expect(state.coach.explainerUrl).toBe('https://example.workers.dev');
    expect(state.coach.deviceId).toBe('dev_abc12345');
    expect(state.coach.askThread.map(t => t.text)).toEqual(['What BMI?', 'Around 22.']);
    expect(state.coach.statedConstraints).toEqual(['Bad left elbow']);
  });
});

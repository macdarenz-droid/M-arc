import { describe, it, expect } from 'vitest';
import { DEFAULT_PROXY_URL, emptyCoach, freshState } from '@/core/models';

describe('a fresh install, a data reset, and a new device all start from the same coach defaults', () => {
  it('the proxy URL is pre-filled with the real deployment, not left for the person to paste in again', () => {
    expect(emptyCoach().explainerUrl).toBe(DEFAULT_PROXY_URL);
    expect(DEFAULT_PROXY_URL.startsWith('https://')).toBe(true);
  });

  it('so turning the "Online coach" toggle on is the only action needed to enable every remote feature', () => {
    const coach = freshState().coach;
    expect(coach.remoteExplainer).toBe(false); // still off by default — a deliberate opt-in, not pre-enabled
    expect(coach.explainerUrl.trim().length).toBeGreaterThan(0); // but nothing left to fill in once they do flip it on
  });
});

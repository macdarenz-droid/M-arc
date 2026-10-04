// Audit 3, "Custom server encryption claim": docs/PLAY-SUBMISSION.md:82 and docs/PRIVACY-POLICY.md:54
// say every request goes over HTTPS. Correct behaviour: a coach turn never leaves over plain http.
import { describe, expect, it } from 'vitest';
import { freshState } from '@/core/models';
import { loadState, STATE_KEY } from '@/core/store';
import { proxyUrlOf } from '@/escobar/state';
import { httpTransport } from '@/escobar/transport';

function mem(init: Record<string, string>) {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); }, removeItem: (k: string) => { m.delete(k); } };
}

describe('custom coach server over http', () => {
  it('a saved http:// proxyUrl is not used for a coach turn', async () => {
    const s = freshState(new Date('2026-10-01T10:00:00Z'));
    const saved = { ...s, escobar: { ...s.escobar, enabled: true, proxyUrl: 'http://coach.example' } };
    const { state, source } = loadState(mem({ [STATE_KEY]: JSON.stringify(saved) }) as never);
    expect(source).toBe('saved');
    const urls: string[] = [];
    const t = httpTransport({
      url: () => proxyUrlOf(state.escobar.proxyUrl),
      device: () => 'dev_0123456789abcdef01234567',
      fetchImpl: (async (u: string) => { urls.push(u); throw new Error('stubbed'); }) as never,
    });
    const ctl = new AbortController();
    for await (const _ of t.turn({} as never, ctl.signal)) { /* drain */ }
    expect(urls).toHaveLength(1);
    expect(urls[0]).toMatch(/^https:\/\//);
  });
});

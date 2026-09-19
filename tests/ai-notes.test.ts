import { describe, it, expect } from 'vitest';
import { requestNoteFlags, MAX_NOTE_CHARS } from '@/ai/notes';

const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('requestNoteFlags', () => {
  it('returns no flags for empty text without spending a call', async () => {
    const r = await requestNoteFlags('   ', { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: () => { throw new Error('must not be called'); } });
    expect(r).toEqual({ ok: true, flags: [] });
  });

  it('keeps a known flag kind and a real muscle id', async () => {
    const fetchImpl = reply(200, { flags: [{ kind: 'pain_or_discomfort', muscle: 'rear_delts' }] });
    const r = await requestNoteFlags('Pinch in my rear delt on the last set.', { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, flags: [{ kind: 'pain_or_discomfort', muscle: 'rear_delts' }] });
  });

  it('drops an unrecognised flag kind and a fake muscle, never invents one', async () => {
    const fetchImpl = reply(200, { flags: [{ kind: 'diagnosis', muscle: 'chest' }, { kind: 'fatigue', muscle: 'not_a_muscle' }, { kind: 'positive', muscle: null }] });
    const r = await requestNoteFlags('Felt great today, PR on squat.', { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, flags: [{ kind: 'fatigue', muscle: null }, { kind: 'positive', muscle: null }] });
  });

  it('caps at three flags and truncates the text it sends', async () => {
    let sentLength = 0;
    const fetchImpl: typeof fetch = async (_url, init) => {
      sentLength = (JSON.parse(String(init?.body)) as { text: string }).text.length;
      return new Response(JSON.stringify({ flags: [{ kind: 'fatigue', muscle: null }, { kind: 'schedule', muscle: null }, { kind: 'form_check', muscle: null }, { kind: 'positive', muscle: null }] }), { status: 200 });
    };
    const r = await requestNoteFlags('x'.repeat(400), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(sentLength).toBe(MAX_NOTE_CHARS);
    if (r.ok) expect(r.flags).toHaveLength(3);
  });

  it('surfaces proxy errors in plain words', async () => {
    const r = await requestNoteFlags('Missed my session, work got busy.', { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(503, { error: 'The proxy has no API key yet.' }) });
    expect(r).toEqual({ ok: false, error: 'The proxy has no API key yet.' });
  });
});

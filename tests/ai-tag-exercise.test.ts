import { describe, it, expect } from 'vitest';
import { buildTagPayload, requestTagSuggestion } from '@/ai/tagExercise';
import { endpoint, newDeviceId } from '@/ai/client';

const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('buildTagPayload', () => {
  it('trims and caps the name, drops an empty equipment hint', () => {
    expect(buildTagPayload('  Cable Face Pull  ')).toEqual({ version: 1, kind: 'tag-exercise', name: 'Cable Face Pull' });
    expect(buildTagPayload('Face Pull', '  Cable ')).toEqual({ version: 1, kind: 'tag-exercise', name: 'Face Pull', equipmentHint: 'Cable' });
    expect(buildTagPayload('Face Pull', '  ')).toEqual({ version: 1, kind: 'tag-exercise', name: 'Face Pull' });
    expect(buildTagPayload('x'.repeat(80)).name).toHaveLength(60);
  });
});

describe('requestTagSuggestion', () => {
  it('refuses locally when there is no name, never spending a call', async () => {
    const r = await requestTagSuggestion('   ', undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: () => { throw new Error('must not be called'); } });
    expect(r).toEqual({ ok: false, error: 'Type a name first.' });
  });

  it('keeps only real muscle ids and passes the model\'s own confidence through', async () => {
    const fetchImpl = reply(200, { equipment: 'Cable', primary: ['rear_delts', 'not_a_muscle'], secondary: ['mid_back'], pattern: 'horizontal_abduction', mode: 'weighted', confidence: 'high', model: 'claude-sonnet-5' });
    const r = await requestTagSuggestion('Cable Face Pull', 'Cable', { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.suggestion.primary).toEqual(['rear_delts']);
    expect(r.suggestion.secondary).toEqual(['mid_back']);
    expect(r.suggestion.equipment).toBe('Cable');
    expect(r.suggestion.mode).toBe('weighted');
    expect(r.suggestion.confidence).toBe('high');
  });

  it('treats anything other than the literal "high" as low, never assumes confidence', async () => {
    const fetchImpl = reply(200, { equipment: 'Machine', primary: [], secondary: [], pattern: 'other', mode: 'weighted', model: 'claude-sonnet-5' });
    const r = await requestTagSuggestion('Some Machine', undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.suggestion.confidence).toBe('low');
  });

  it('rejects a reply with an unrecognisable shape rather than guessing at it', async () => {
    const fetchImpl = reply(200, { primary: ['chest'] });
    const r = await requestTagSuggestion('Bench Press', undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'The coach sent back something we could not read.' });
  });

  it('surfaces proxy errors in plain words', async () => {
    const r = await requestTagSuggestion('Bench Press', undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(429, { error: 'Too many requests. Wait a minute.' }) });
    expect(r).toEqual({ ok: false, error: 'Too many requests. Wait a minute.' });
  });

  it('shares the same device id and endpoint helpers as every other AI feature', () => {
    expect(newDeviceId()).toMatch(/^dev_[a-z0-9]{8,24}$/);
    expect(endpoint('https://x.workers.dev/', '/tag-exercise')).toBe('https://x.workers.dev/tag-exercise');
  });
});

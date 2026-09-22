import { describe, it, expect } from 'vitest';
import { buildIdentifyPayload, requestExerciseFromPhoto } from '@/ai/identifyExercise';
import { endpoint, newDeviceId } from '@/ai/client';

const PHOTO = { mediaType: 'image/jpeg' as const, data: 'ZmFrZS1qcGVn' };
const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('buildIdentifyPayload', () => {
  it('carries the photo and trims/drops an empty equipment hint', () => {
    expect(buildIdentifyPayload(PHOTO)).toEqual({ version: 1, kind: 'identify-exercise', image: PHOTO });
    expect(buildIdentifyPayload(PHOTO, '  Cable ')).toEqual({ version: 1, kind: 'identify-exercise', image: PHOTO, equipmentHint: 'Cable' });
    expect(buildIdentifyPayload(PHOTO, '  ')).toEqual({ version: 1, kind: 'identify-exercise', image: PHOTO });
    expect(buildIdentifyPayload(PHOTO, 'x'.repeat(80)).equipmentHint).toHaveLength(40);
  });
});

describe('requestExerciseFromPhoto', () => {
  it('keeps only real muscle ids, trims the name and passes the model\'s own confidence through', async () => {
    const fetchImpl = reply(200, { visible: true, name: '  Cable Face Pull  ', equipment: 'Cable', primary: ['rear_delts', 'not_a_muscle'], secondary: ['mid_back'], pattern: 'horizontal_abduction', mode: 'weighted', confidence: 'high', model: 'claude-sonnet-5' });
    const r = await requestExerciseFromPhoto(PHOTO, 'Cable', { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.suggestion.name).toBe('Cable Face Pull');
    expect(r.suggestion.primary).toEqual(['rear_delts']);
    expect(r.suggestion.secondary).toEqual(['mid_back']);
    expect(r.suggestion.equipment).toBe('Cable');
    expect(r.suggestion.mode).toBe('weighted');
    expect(r.suggestion.confidence).toBe('high');
  });

  it('treats anything other than the literal "high" as low, never assumes confidence', async () => {
    const fetchImpl = reply(200, { visible: true, name: 'Some Machine', equipment: 'Machine', primary: [], secondary: [], pattern: 'other', mode: 'weighted', model: 'claude-sonnet-5' });
    const r = await requestExerciseFromPhoto(PHOTO, undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.suggestion.confidence).toBe('low');
  });

  it('reports honestly, never guessing, when the photo shows nothing recognizable', async () => {
    const fetchImpl = reply(200, { visible: false, name: '', equipment: 'Other', primary: [], secondary: [], pattern: 'other', mode: 'weighted', confidence: 'low', model: 'claude-sonnet-5' });
    const r = await requestExerciseFromPhoto(PHOTO, undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'Could not tell what that photo shows. Try a clearer shot of the equipment or exercise.' });
  });

  it('rejects a reply with an unrecognisable shape rather than guessing at it', async () => {
    const fetchImpl = reply(200, { primary: ['chest'] });
    const r = await requestExerciseFromPhoto(PHOTO, undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'The coach sent back something we could not read.' });
  });

  it('surfaces proxy errors in plain words', async () => {
    const r = await requestExerciseFromPhoto(PHOTO, undefined, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(429, { error: 'Too many requests. Wait a minute.' }) });
    expect(r).toEqual({ ok: false, error: 'Too many requests. Wait a minute.' });
  });

  it('shares the same device id and endpoint helpers as every other AI feature', () => {
    expect(newDeviceId()).toMatch(/^dev_[a-z0-9]{8,24}$/);
    expect(endpoint('https://x.workers.dev/', '/identify-exercise')).toBe('https://x.workers.dev/identify-exercise');
  });
});

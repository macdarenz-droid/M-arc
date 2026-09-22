import { describe, it, expect } from 'vitest';
import { buildImportPayload, requestProgrammeImport } from '@/ai/importProgramme';

const PHOTO = { mediaType: 'image/jpeg' as const, data: 'ZmFrZS1qcGVn' };
const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('buildImportPayload', () => {
  it('carries just the photo, nothing else', () => {
    expect(buildImportPayload(PHOTO)).toEqual({ version: 1, kind: 'import-programme', image: PHOTO });
  });
});

describe('requestProgrammeImport', () => {
  it('reads days and exercises, keeping only real muscle ids and clamping sets to what the app accepts', async () => {
    const fetchImpl = reply(200, {
      readable: true,
      days: [
        { name: 'Push', exercises: [
          { name: 'Bench Press', sets: 3, equipment: 'Barbell', primary: ['chest', 'not_a_muscle'], secondary: ['triceps'], pattern: 'horizontal_push', mode: 'weighted', confidence: 'high' },
          { name: 'Overhead Press', sets: 14, equipment: 'Barbell', primary: ['front_delts'], secondary: [], pattern: 'vertical_push', mode: 'weighted', confidence: 'low' },
        ] },
      ],
      model: 'claude-sonnet-5',
    });
    const r = await requestProgrammeImport(PHOTO, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.days).toHaveLength(1);
    expect(r.days[0]!.name).toBe('Push');
    expect(r.days[0]!.exercises[0]).toEqual({ name: 'Bench Press', sets: 3, equipment: 'Barbell', primary: ['chest'], secondary: ['triceps'], mode: 'weighted', confidence: 'high' });
    expect(r.days[0]!.exercises[1]!.sets).toBe(10); // clamped to the app's own 1-10 range
    expect(r.days[0]!.exercises[1]!.confidence).toBe('low');
  });

  it('defaults to 3 sets when the page gave none', async () => {
    const fetchImpl = reply(200, { readable: true, days: [{ name: 'Day 1', exercises: [{ name: 'Squat', equipment: 'Barbell', primary: ['quads'], secondary: [], pattern: 'squat', mode: 'weighted', confidence: 'high' }] }], model: 'claude-sonnet-5' });
    const r = await requestProgrammeImport(PHOTO, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.days[0]!.exercises[0]!.sets).toBe(3);
  });

  it('drops a day with no readable exercises rather than importing an empty one', async () => {
    const fetchImpl = reply(200, { readable: true, days: [{ name: 'Illegible', exercises: [] }, { name: 'Push', exercises: [{ name: 'Bench Press', sets: 3, equipment: 'Barbell', primary: ['chest'], secondary: [], pattern: 'horizontal_push', mode: 'weighted', confidence: 'high' }] }], model: 'claude-sonnet-5' });
    const r = await requestProgrammeImport(PHOTO, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (r.ok) { expect(r.days).toHaveLength(1); expect(r.days[0]!.name).toBe('Push'); }
  });

  it('reports honestly, never guessing, when the photo has no readable plan in it', async () => {
    const fetchImpl = reply(200, { readable: false, days: [], model: 'claude-sonnet-5' });
    const r = await requestProgrammeImport(PHOTO, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'Could not read a workout plan in that photo. Try a clearer shot of the whole page.' });
  });

  it('rejects a reply with an unrecognisable shape rather than guessing at it', async () => {
    const fetchImpl = reply(200, { readable: true });
    const r = await requestProgrammeImport(PHOTO, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'The coach sent back something we could not read.' });
  });

  it('surfaces proxy errors in plain words', async () => {
    const r = await requestProgrammeImport(PHOTO, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(429, { error: 'Too many requests. Wait a minute.' }) });
    expect(r).toEqual({ ok: false, error: 'Too many requests. Wait a minute.' });
  });
});

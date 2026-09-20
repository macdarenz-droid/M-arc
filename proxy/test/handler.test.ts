import { describe, it, expect } from 'vitest';
import { createHandler, validatePayload, validateTagPayload, validateNotesPayload, validateAskPayload, validateIdentifyPayload, validateImportPayload, checkQuota, corsHeaders, MAX_BODY_BYTES, MAX_TAG_BODY_BYTES, MAX_NOTES_BODY_BYTES, MAX_ASK_BODY_BYTES, MAX_IDENTIFY_BODY_BYTES, MAX_IMPORT_BODY_BYTES, MAX_IMAGE_DATA_CHARS, MAX_QUESTION_CHARS, MAX_HISTORY_TURNS, MAX_PREFERENCES, MAX_PREFERENCE_CHARS, MAX_KNOWN_SPLITS, type RouteConfig } from '../src/handler';
import { SYSTEM_PROMPT, userMessage } from '../src/prompt';
import { TAG_SYSTEM_PROMPT } from '../src/promptTag';
import { NOTES_SYSTEM_PROMPT } from '../src/promptNotes';
import { ASK_SYSTEM_PROMPT, askMessages } from '../src/promptAsk';
import { IDENTIFY_SYSTEM_PROMPT, identifyMessage } from '../src/promptIdentify';
import { IMPORT_SYSTEM_PROMPT, importMessage } from '../src/promptImport';
import type { AskPayload, AskReply, ExplainPayload, IdentifyExercisePayload, ImportProgrammePayload, NotesPayload, TagExercisePayload, WorkerEnv } from '../src/types';

/** The smallest valid PNG there is (1x1, transparent) — enough to exercise shape checks without a real photo. */
const TINY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

const payload = (): ExplainPayload => ({
  version: 1, kind: 'explain', goal: 'lean', unit: 'kg', today: '2026-09-19',
  dataQuality: { sessions: 40, weeksOfData: 12, effortCoverage: 0.9, insufficientData: false },
  findings: [{ id: 'volume_drop:chest', kind: 'volume_drop', subject: { muscleGroup: 'chest' }, metrics: { changePct: -18, baselineSets: 14.5, currentSets: 11.9 }, window: { from: '2026-08-24', to: '2026-09-13', weeks: 3 }, confidence: 'high', severity: 1 }],
  proposals: [{ id: 'exercise_swap:lib_barbell_bench_press', kind: 'exercise_swap', subject: { exerciseId: 'lib_barbell_bench_press' }, apply: { kind: 'exercise_swap', fromExerciseId: 'a', toExerciseId: 'b' }, basedOn: ['volume_drop:chest'], confidence: 'medium' }],
  cards: [{ id: 'volume_dose_response', title: 'Weekly volume drives growth', rating: 'strong', statement: 'More hard sets per muscle per week produce more growth, up to a point.', disputed: 'The exact shape at high volumes.' }],
  explain: ['volume_drop:chest', 'exercise_swap:lib_barbell_bench_press'],
});

const tagPayload = (): TagExercisePayload => ({ version: 1, kind: 'tag-exercise', name: 'Cable Face Pull', equipmentHint: 'Cable' });
const notesPayload = (): NotesPayload => ({ version: 1, kind: 'notes', text: 'Felt a pinch in my left shoulder on the last set.' });
const knownSplits = [{ id: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: 3 }] }];
const emptySchedule = { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null };
const scheduleWithPush = { ...emptySchedule, mon: 'split_push' };
const askPayload = (): AskPayload => {
  const { version, goal, unit, today, dataQuality, findings, proposals, cards } = payload();
  return { version, kind: 'ask', goal, unit, today, dataQuality, findings, proposals, cards, history: [], question: 'Why has my chest work dropped?', splits: knownSplits, schedule: emptySchedule };
};
const identifyPayload = (): IdentifyExercisePayload => ({ version: 1, kind: 'identify-exercise', image: { mediaType: 'image/png', data: TINY_PNG }, equipmentHint: 'Cable' });
const importPayload = (): ImportProgrammePayload => ({ version: 1, kind: 'import-programme', image: { mediaType: 'image/png', data: TINY_PNG } });

class FakeKV {
  store = new Map<string, string>();
  async get(k: string) { return this.store.get(k) ?? null; }
  async put(k: string, v: string) { this.store.set(k, v); }
}

const env = (over: Partial<WorkerEnv> = {}): WorkerEnv => ({ ANTHROPIC_API_KEY: 'test-key', MODEL: 'claude-sonnet-5', ...over });

const stubModel = async (p: ExplainPayload) => ({
  summary: 'A steady week with chest volume down 18%.',
  items: [...p.explain.map(id => ({ id, text: `About ${id}.` })), { id: 'not_requested', text: 'ignored' }],
  model: 'claude-sonnet-5', usage: { inputTokens: 900, outputTokens: 120, cacheReadTokens: 0 },
});

/** Wraps a stub model the same way index.ts wires the real one, for a route table under test. */
const explainRouteWith = (callModel: typeof stubModel): RouteConfig => ({
  path: '/explain', maxBody: MAX_BODY_BYTES, validate: validatePayload,
  async call(p) {
    const out = await callModel(p as ExplainPayload);
    const wanted = new Set((p as ExplainPayload).explain);
    const items = out.items.filter(i => wanted.has(i.id)).map(i => ({ id: i.id, text: String(i.text).trim() }));
    return { summary: String(out.summary).trim(), items, model: out.model, usage: out.usage };
  },
});

const stubTag = async () => ({ equipment: 'Cable', primary: ['rear_delts'], secondary: ['mid_back'], pattern: 'horizontal_abduction', mode: 'weighted' as const, confidence: 'high' as const, model: 'claude-sonnet-5', usage: { inputTokens: 200, outputTokens: 40, cacheReadTokens: 0 } });
const tagRouteWith = (call: typeof stubTag): RouteConfig => ({
  path: '/tag-exercise', maxBody: MAX_TAG_BODY_BYTES, validate: validateTagPayload,
  async call() { const out = await call(); return { equipment: out.equipment, primary: out.primary, secondary: out.secondary, pattern: out.pattern, mode: out.mode, confidence: out.confidence, model: out.model, usage: out.usage }; },
});

const stubNotes = async () => ({ flags: [{ kind: 'pain_or_discomfort' as const, muscle: 'rear_delts' as const }], model: 'claude-sonnet-5', usage: { inputTokens: 150, outputTokens: 20, cacheReadTokens: 0 } });
const notesRouteWith = (call: typeof stubNotes): RouteConfig => ({
  path: '/notes', maxBody: MAX_NOTES_BODY_BYTES, validate: validateNotesPayload,
  async call() { const out = await call(); return { flags: out.flags, model: out.model, usage: out.usage }; },
});

const stubAsk = async () => ({ scope: 'personal' as const, category: 'training' as const, answer: 'Chest sets dropped from 14.5 to 11.9 a week over the last three weeks.', splitDrafts: [] as AskReply['splitDrafts'], scheduleDraft: null as AskReply['scheduleDraft'], concern: null as AskReply['concern'], model: 'claude-sonnet-5', usage: { inputTokens: 1800, outputTokens: 60, cacheReadTokens: 0 } });
const askRouteWith = (call: typeof stubAsk): RouteConfig => ({
  path: '/ask', maxBody: MAX_ASK_BODY_BYTES, validate: validateAskPayload,
  async call() { const out = await call(); return { scope: out.scope, category: out.category, answer: out.answer, splitDrafts: out.splitDrafts, scheduleDraft: out.scheduleDraft, concern: out.concern, model: out.model, usage: out.usage }; },
});

const stubAskWithSplit = async () => ({
  scope: 'personal' as const, category: 'training' as const,
  answer: 'Added Face Pull to Push for rear-delt balance.',
  splitDrafts: [{ action: 'modify' as const, splitId: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_face_pull', sets: 3 }] }],
  scheduleDraft: null as AskReply['scheduleDraft'],
  concern: null as AskReply['concern'],
  model: 'claude-sonnet-5', usage: { inputTokens: 2200, outputTokens: 90, cacheReadTokens: 1800 },
});

const stubAskWithSchedule = async () => ({
  scope: 'personal' as const, category: 'training' as const,
  answer: 'Moved Push to Wednesday and Pull to Friday, keeping two days of rest between them.',
  splitDrafts: [] as AskReply['splitDrafts'],
  scheduleDraft: { sun: null, mon: null, tue: null, wed: 'split_push', thu: null, fri: 'split_pull', sat: null },
  concern: null as AskReply['concern'],
  model: 'claude-sonnet-5', usage: { inputTokens: 2000, outputTokens: 70, cacheReadTokens: 1800 },
});

const stubIdentify = async () => ({ visible: true, name: 'Cable Face Pull', equipment: 'Cable', primary: ['rear_delts'], secondary: ['mid_back'], pattern: 'horizontal_abduction', mode: 'weighted' as const, confidence: 'high' as const, model: 'claude-sonnet-5', usage: { inputTokens: 1400, outputTokens: 40, cacheReadTokens: 0 } });
const identifyRouteWith = (call: typeof stubIdentify): RouteConfig => ({
  path: '/identify-exercise', maxBody: MAX_IDENTIFY_BODY_BYTES, validate: validateIdentifyPayload,
  async call() { const out = await call(); return { visible: out.visible, name: out.name, equipment: out.equipment, primary: out.primary, secondary: out.secondary, pattern: out.pattern, mode: out.mode, confidence: out.confidence, model: out.model, usage: out.usage }; },
});

const stubImport = async () => ({
  readable: true,
  days: [{ name: 'Push', exercises: [{ name: 'Bench Press', sets: 3, equipment: 'Barbell', primary: ['chest'], secondary: ['triceps'], pattern: 'horizontal_push', mode: 'weighted' as const, confidence: 'high' as const }] }],
  model: 'claude-sonnet-5', usage: { inputTokens: 2000, outputTokens: 120, cacheReadTokens: 0 },
});
const importRouteWith = (call: typeof stubImport): RouteConfig => ({
  path: '/import-programme', maxBody: MAX_IMPORT_BODY_BYTES, validate: validateImportPayload,
  async call() { const out = await call(); return { readable: out.readable, days: out.days, model: out.model, usage: out.usage }; },
});

const post = (path: string, body: unknown, headers: Record<string, string> = {}, origin?: string) =>
  new Request(`https://marc-coach.example.workers.dev${path}`, { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers: { 'content-type': 'application/json', 'x-marc-device': 'device_abcdef12', ...(origin ? { origin } : {}), ...headers } });

describe('payload validation', () => {
  it('accepts the app payload and refuses anything personal or oversized', () => {
    expect(validatePayload(payload()).ok).toBe(true);
    expect(validatePayload({ ...payload(), profile: { name: 'x' } })).toMatchObject({ ok: false });
    // Any field outside the route's own key set is refused, the same as every sibling route — not just the PII-shaped keys validateGrounding blacklists by name.
    expect(validatePayload({ ...payload(), extraField: 'x' })).toMatchObject({ ok: false, reason: expect.stringContaining('Unexpected field') });
    expect(validatePayload({ ...payload(), sessions: [] })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), findings: [{ ...payload().findings[0], evidence: { sessionIds: ['s1'] } }] })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), explain: ['nope'] })).toMatchObject({ ok: false, reason: expect.stringContaining('not in the report') });
    expect(validatePayload({ ...payload(), explain: [] })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), version: 2 })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), findings: Array.from({ length: 30 }, () => payload().findings[0]) })).toMatchObject({ ok: false });
    expect(validatePayload('nope')).toMatchObject({ ok: false });
  });

  it('preferences is optional, but validated when present', () => {
    expect(validatePayload({ ...payload(), preferences: ['Usually accepts exercise swaps when the coach offers them.'] })).toMatchObject({ ok: true });
    expect(validatePayload({ ...payload(), preferences: Array.from({ length: MAX_PREFERENCES + 1 }, () => 'x') })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), preferences: ['x'.repeat(MAX_PREFERENCE_CHARS + 1)] })).toMatchObject({ ok: false });
    expect(validatePayload({ ...payload(), preferences: [1] })).toMatchObject({ ok: false });
  });
});

describe('tag-exercise payload validation', () => {
  it('accepts a name with an optional equipment hint and refuses anything else', () => {
    expect(validateTagPayload(tagPayload())).toMatchObject({ ok: true });
    expect(validateTagPayload({ version: 1, kind: 'tag-exercise', name: 'Face Pull' })).toMatchObject({ ok: true });
    expect(validateTagPayload({ version: 1, kind: 'tag-exercise', name: '' })).toMatchObject({ ok: false });
    expect(validateTagPayload({ version: 1, kind: 'tag-exercise', name: 'x'.repeat(61) })).toMatchObject({ ok: false });
    expect(validateTagPayload({ version: 1, kind: 'tag-exercise', name: 'Face Pull', equipmentHint: 'x'.repeat(41) })).toMatchObject({ ok: false });
    expect(validateTagPayload({ version: 2, kind: 'tag-exercise', name: 'Face Pull' })).toMatchObject({ ok: false });
    // A modified client stuffing session data or anything unexpected in: refused, not silently dropped.
    expect(validateTagPayload({ ...tagPayload(), sessions: [] })).toMatchObject({ ok: false, reason: expect.stringContaining('Unexpected field') });
    expect(validateTagPayload('nope')).toMatchObject({ ok: false });
  });
});

describe('notes payload validation', () => {
  it('accepts short text only', () => {
    expect(validateNotesPayload(notesPayload())).toMatchObject({ ok: true });
    expect(validateNotesPayload({ version: 1, kind: 'notes', text: '' })).toMatchObject({ ok: false });
    expect(validateNotesPayload({ version: 1, kind: 'notes', text: 'x'.repeat(281) })).toMatchObject({ ok: false });
    expect(validateNotesPayload({ version: 1, kind: 'notes', text: 'ok', exerciseId: 'lib_bench' })).toMatchObject({ ok: false, reason: expect.stringContaining('Unexpected field') });
    expect(validateNotesPayload('nope')).toMatchObject({ ok: false });
  });
});

describe('ask payload validation', () => {
  it('accepts the same grounding as /explain, plus history and a question', () => {
    expect(validateAskPayload(askPayload())).toMatchObject({ ok: true });
    expect(validateAskPayload({ ...askPayload(), question: '' })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), question: 'x'.repeat(MAX_QUESTION_CHARS + 1) })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), profile: { name: 'x' } })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), sessions: [] })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), findings: [{ ...askPayload().findings[0], evidence: { sessionIds: ['s1'] } }] })).toMatchObject({ ok: false });
    // History: a real conversation, capped, well-shaped.
    expect(validateAskPayload({ ...askPayload(), history: [{ role: 'user', text: 'hi' }, { role: 'assistant', text: 'hi' }] })).toMatchObject({ ok: true });
    expect(validateAskPayload({ ...askPayload(), history: [{ role: 'coach', text: 'hi' }] })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), history: [{ role: 'user', text: '' }] })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), history: [{ role: 'user', text: 'x'.repeat(701) }] })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), history: Array.from({ length: MAX_HISTORY_TURNS + 1 }, () => ({ role: 'user', text: 'hi' })) })).toMatchObject({ ok: false });
    // explain is /explain's own field: not accepted here, same "unexpected field" discipline as everywhere else.
    expect(validateAskPayload({ ...askPayload(), explain: ['x'] })).toMatchObject({ ok: false, reason: expect.stringContaining('Unexpected field') });
    expect(validateAskPayload('nope')).toMatchObject({ ok: false });
  });

  it('accepts an optional preferences list, capped and length-limited', () => {
    expect(validateAskPayload({ ...askPayload(), preferences: ['Usually accepts schedule changes when the coach offers them.'] })).toMatchObject({ ok: true });
    expect(validateAskPayload({ ...askPayload(), preferences: Array.from({ length: MAX_PREFERENCES + 1 }, () => 'x') })).toMatchObject({ ok: false });
  });

  it('accepts the person\'s known splits, capped and shape-checked — this is the one route that may also design or adjust one', () => {
    expect(validateAskPayload({ ...askPayload(), splits: [] })).toMatchObject({ ok: true }); // a brand-new user with no splits yet can still ask for one
    expect(validateAskPayload({ ...askPayload(), splits: Array.from({ length: MAX_KNOWN_SPLITS + 1 }, () => knownSplits[0]) })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), splits: [{ id: 'x', name: 'x', focus: ['chest', 'triceps', 'quads'], exercises: [] }] })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), splits: [{ id: 'x', name: 'x' }] })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), splits: 'nope' })).toMatchObject({ ok: false });
  });

  it('accepts the person\'s real weekly schedule today, all 7 days required, each a split id or null — this is the one route that may also rearrange it', () => {
    expect(validateAskPayload({ ...askPayload(), schedule: scheduleWithPush })).toMatchObject({ ok: true });
    expect(validateAskPayload({ ...askPayload(), schedule: emptySchedule })).toMatchObject({ ok: true }); // an all-rest week is a real, valid schedule
    // Missing a day, an extra key, or a non-string/non-null value are all refused — same "full week, exact shape" discipline as a scheduleDraft reply.
    const { sun: _sun, ...missingSun } = emptySchedule;
    expect(validateAskPayload({ ...askPayload(), schedule: missingSun })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), schedule: { ...emptySchedule, extraDay: null } })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), schedule: { ...emptySchedule, mon: 5 } })).toMatchObject({ ok: false });
    expect(validateAskPayload({ ...askPayload(), schedule: 'nope' })).toMatchObject({ ok: false });
  });
});

describe('identify-exercise payload validation', () => {
  it('accepts a photo with an optional equipment hint and refuses anything else', () => {
    expect(validateIdentifyPayload(identifyPayload())).toMatchObject({ ok: true });
    expect(validateIdentifyPayload({ version: 1, kind: 'identify-exercise', image: { mediaType: 'image/jpeg', data: TINY_PNG } })).toMatchObject({ ok: true });
    expect(validateIdentifyPayload({ version: 1, kind: 'identify-exercise', image: { mediaType: 'image/gif', data: TINY_PNG } })).toMatchObject({ ok: false });
    expect(validateIdentifyPayload({ version: 1, kind: 'identify-exercise', image: { mediaType: 'image/png', data: '' } })).toMatchObject({ ok: false });
    expect(validateIdentifyPayload({ version: 1, kind: 'identify-exercise', image: { mediaType: 'image/png', data: 'not base64!!' } })).toMatchObject({ ok: false });
    expect(validateIdentifyPayload({ version: 1, kind: 'identify-exercise', image: { mediaType: 'image/png', data: 'A'.repeat(MAX_IMAGE_DATA_CHARS + 1) } })).toMatchObject({ ok: false });
    expect(validateIdentifyPayload({ version: 1, kind: 'identify-exercise', image: {} })).toMatchObject({ ok: false });
    expect(validateIdentifyPayload({ ...identifyPayload(), equipmentHint: 'x'.repeat(41) })).toMatchObject({ ok: false });
    expect(validateIdentifyPayload({ version: 2, kind: 'identify-exercise', image: { mediaType: 'image/png', data: TINY_PNG } })).toMatchObject({ ok: false });
    // A modified client stuffing session data or anything unexpected in: refused, not silently dropped.
    expect(validateIdentifyPayload({ ...identifyPayload(), sessions: [] })).toMatchObject({ ok: false, reason: expect.stringContaining('Unexpected field') });
    expect(validateIdentifyPayload('nope')).toMatchObject({ ok: false });
  });
});

describe('import-programme payload validation', () => {
  it('accepts a photo and refuses anything else', () => {
    expect(validateImportPayload(importPayload())).toMatchObject({ ok: true });
    expect(validateImportPayload({ version: 1, kind: 'import-programme', image: { mediaType: 'image/gif', data: TINY_PNG } })).toMatchObject({ ok: false });
    expect(validateImportPayload({ version: 1, kind: 'import-programme', image: { mediaType: 'image/png', data: '' } })).toMatchObject({ ok: false });
    expect(validateImportPayload({ version: 1, kind: 'import-programme', image: {} })).toMatchObject({ ok: false });
    expect(validateImportPayload({ version: 2, kind: 'import-programme', image: { mediaType: 'image/png', data: TINY_PNG } })).toMatchObject({ ok: false });
    // No equipmentHint on this route — it is a whole page, not one exercise.
    expect(validateImportPayload({ ...importPayload(), equipmentHint: 'Cable' })).toMatchObject({ ok: false, reason: expect.stringContaining('Unexpected field') });
    expect(validateImportPayload({ ...importPayload(), sessions: [] })).toMatchObject({ ok: false, reason: expect.stringContaining('Unexpected field') });
    expect(validateImportPayload('nope')).toMatchObject({ ok: false });
  });
});

describe('cors', () => {
  it('allows the app origins and configured web origins only', () => {
    expect(corsHeaders(null, env())['Access-Control-Allow-Origin']).toBe('*');
    expect(corsHeaders('capacitor://localhost', env())['Access-Control-Allow-Origin']).toBe('capacitor://localhost');
    expect(corsHeaders('http://localhost:5173', env())['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
    expect('Access-Control-Allow-Origin' in corsHeaders('https://evil.example', env())).toBe(false);
    expect(corsHeaders('https://marc.example.app', env({ ALLOWED_ORIGINS: 'https://marc.example.app, https://other.example' }))['Access-Control-Allow-Origin']).toBe('https://marc.example.app');
  });
});

describe('quota', () => {
  it('counts per device and in total, and is a no-op without KV', async () => {
    expect(await checkQuota(env(), 'd1', '2026-09-19')).toEqual({ ok: true });
    const kv = new FakeKV();
    const e = env({ QUOTA: kv as unknown as KVNamespace, MAX_DAILY_PER_DEVICE: '2', MAX_DAILY_TOTAL: '3' });
    expect((await checkQuota(e, 'd1', '2026-09-19')).remaining).toBe(1);
    expect((await checkQuota(e, 'd1', '2026-09-19')).remaining).toBe(0);
    expect(await checkQuota(e, 'd1', '2026-09-19')).toMatchObject({ ok: false, reason: expect.stringContaining('this device') });
    expect((await checkQuota(e, 'd2', '2026-09-19')).ok).toBe(true);
    expect(await checkQuota(e, 'd3', '2026-09-19')).toMatchObject({ ok: false, reason: expect.stringContaining('busy') });
    expect((await checkQuota(e, 'd1', '2026-09-20')).ok).toBe(true);
  });
});

describe('handler: /explain', () => {
  const handle = createHandler([explainRouteWith(stubModel)]);

  it('answers a valid request with only the requested items', async () => {
    const res = await handle(post('/explain', payload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { summary: string; items: Array<{ id: string }>; model: string; usage: { inputTokens: number } };
    expect(body.summary).toContain('18%');
    expect(body.items.map(i => i.id)).toEqual(['volume_drop:chest', 'exercise_swap:lib_barbell_bench_press']);
    expect(body.model).toBe('claude-sonnet-5');
    expect(body.usage.inputTokens).toBe(900);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('preflight, health, wrong path, wrong method', async () => {
    expect((await handle(new Request('https://x/explain', { method: 'OPTIONS', headers: { origin: 'capacitor://localhost' } }), env())).status).toBe(204);
    const health = await handle(new Request('https://x/health'), env({ RATE: { limit: async () => ({ success: true }) } }));
    expect(await health.json()).toMatchObject({ ok: true, model: 'claude-sonnet-5', rateLimit: true, quotas: false });
    const noModelSet = await handle(new Request('https://x/health'), env({ MODEL: undefined }));
    expect(await noModelSet.json()).toMatchObject({ model: 'claude-sonnet-5' }); // falls back to DEFAULT_MODEL, not a stale hardcoded string
    expect((await handle(new Request('https://x/other', { method: 'POST' }), env())).status).toBe(404);
    expect((await handle(new Request('https://x/explain', { method: 'GET' }), env())).status).toBe(404);
  });

  it('refuses bad origins, missing device, missing key, bad JSON, oversized bodies', async () => {
    expect((await handle(post('/explain', payload(), {}, 'https://evil.example'), env())).status).toBe(403);
    expect((await handle(post('/explain', payload(), { 'x-marc-device': 'x' }), env())).status).toBe(400);
    const noKey = await handle(post('/explain', payload()), env({ ANTHROPIC_API_KEY: undefined }));
    expect(noKey.status).toBe(503);
    expect((await noKey.json() as { error: string }).error).toContain('secret put');
    expect((await handle(post('/explain', '{not json'), env())).status).toBe(400);
    expect((await handle(post('/explain', 'x'.repeat(MAX_BODY_BYTES + 1)), env())).status).toBe(413);
    expect((await handle(post('/explain', { ...payload(), profile: {} }), env())).status).toBe(400);
  });

  it('applies the rate limiter and daily quota', async () => {
    const limited = env({ RATE: { limit: async () => ({ success: false }) } });
    const r = await handle(post('/explain', payload()), limited);
    expect(r.status).toBe(429);
    expect(r.headers.get('retry-after')).toBe('60');
    const kv = new FakeKV();
    const quota = env({ QUOTA: kv as unknown as KVNamespace, MAX_DAILY_PER_DEVICE: '1' });
    expect((await handle(post('/explain', payload()), quota)).status).toBe(200);
    const second = await handle(post('/explain', payload()), quota);
    expect(second.status).toBe(429);
    expect(second.headers.get('retry-after')).toBe('3600');
  });

  it('maps upstream failures to calm errors', async () => {
    const failing = createHandler([explainRouteWith(async () => { throw Object.assign(new Error('rate'), { status: 429 }); })]);
    expect((await failing(post('/explain', payload()), env())).status).toBe(429);
    const unauthorized = createHandler([explainRouteWith(async () => { throw Object.assign(new Error('auth'), { status: 401 }); })]);
    const u = await unauthorized(post('/explain', payload()), env());
    expect(u.status).toBe(503);
    expect((await u.json() as { error: string }).error).toContain('ANTHROPIC_API_KEY');
    const broken = createHandler([explainRouteWith(async () => { throw new Error('boom'); })]);
    expect((await broken(post('/explain', payload()), env())).status).toBe(502);
  });
});

describe('handler: multiple routes in one Worker', () => {
  const handle = createHandler([explainRouteWith(stubModel), tagRouteWith(stubTag), notesRouteWith(stubNotes), askRouteWith(stubAsk), identifyRouteWith(stubIdentify), importRouteWith(stubImport)]);

  it('answers /tag-exercise with a closed-vocabulary suggestion', async () => {
    const res = await handle(post('/tag-exercise', tagPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { equipment: string; primary: string[]; pattern: string; confidence: string };
    expect(body.equipment).toBe('Cable');
    expect(body.primary).toEqual(['rear_delts']);
    expect(body.pattern).toBe('horizontal_abduction');
    expect(body.confidence).toBe('high');
  });

  it('answers /notes with flags only, never prose', async () => {
    const res = await handle(post('/notes', notesPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { flags: Array<{ kind: string; muscle: string | null }> };
    expect(body.flags).toEqual([{ kind: 'pain_or_discomfort', muscle: 'rear_delts' }]);
  });

  it('answers /ask grounded in the report, with a real question', async () => {
    const res = await handle(post('/ask', askPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { scope: string; category: string; answer: string; splitDrafts: unknown[]; model: string };
    expect(body.answer).toContain('14.5');
    expect(body.scope).toBe('personal');
    expect(body.category).toBe('training');
    expect(body.splitDrafts).toEqual([]);
    expect(body.model).toBe('claude-sonnet-5');
  });

  it('answers /ask with a splitDraft the app must still re-validate before applying it, when the conversation calls for designing or adjusting one', async () => {
    const handleWithSplit = createHandler([askRouteWith(stubAskWithSplit)]);
    const res = await handleWithSplit(post('/ask', askPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { answer: string; splitDrafts: Array<{ action: string; splitId: string | null; exercises: Array<{ exerciseId: string; sets: number }> }> };
    expect(body.answer).toContain('Face Pull');
    expect(body.splitDrafts).toHaveLength(1);
    expect(body.splitDrafts[0]).toMatchObject({ action: 'modify', splitId: 'split_push' });
    expect(body.splitDrafts[0]!.exercises.map(e => e.exerciseId)).toEqual(['lib_barbell_bench_press', 'lib_face_pull']);
  });

  it('answers /ask with a scheduleDraft — the full week, not just the days that changed — when the conversation calls for rearranging it', async () => {
    const handleWithSchedule = createHandler([askRouteWith(stubAskWithSchedule)]);
    const res = await handleWithSchedule(post('/ask', askPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { answer: string; scheduleDraft: Record<string, string | null> | null };
    expect(body.answer).toContain('Wednesday');
    expect(body.scheduleDraft).toEqual({ sun: null, mon: null, tue: null, wed: 'split_push', thu: null, fri: 'split_pull', sat: null });
  });

  it('an ordinary answer with no schedule change carries scheduleDraft: null, not omitted', async () => {
    const res = await handle(post('/ask', askPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { scheduleDraft: unknown };
    expect(body.scheduleDraft).toBeNull();
  });

  it('a single message describing several splits at once gets back one draft per split, not just the first', async () => {
    const handleMulti = createHandler([askRouteWith(async () => ({
      scope: 'personal' as const, category: 'training' as const,
      answer: 'Here are both — Push and Pull.',
      splitDrafts: [
        { action: 'create' as const, splitId: null, name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] },
        { action: 'create' as const, splitId: null, name: 'Pull', focus: ['lats'], exercises: [{ exerciseId: 'lib_lat_pulldown', sets: 3 }] },
      ],
      scheduleDraft: null as AskReply['scheduleDraft'],
      concern: null as AskReply['concern'],
      model: 'claude-sonnet-5', usage: { inputTokens: 2400, outputTokens: 140, cacheReadTokens: 1800 },
    }))]);
    const res = await handleMulti(post('/ask', { ...askPayload(), question: 'Push day: bench press. Pull day: lat pulldown.' }), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { splitDrafts: Array<{ name: string }> };
    expect(body.splitDrafts.map(d => d.name)).toEqual(['Push', 'Pull']);
  });

  it('answers /identify-exercise with a closed-vocabulary suggestion and whether anything was recognizable', async () => {
    const res = await handle(post('/identify-exercise', identifyPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { visible: boolean; name: string; equipment: string; primary: string[]; confidence: string };
    expect(body.visible).toBe(true);
    expect(body.name).toBe('Cable Face Pull');
    expect(body.primary).toEqual(['rear_delts']);
    expect(body.confidence).toBe('high');
  });

  it('answers /import-programme with the extracted days, each exercise closed-vocabulary tagged', async () => {
    const res = await handle(post('/import-programme', importPayload()), env());
    expect(res.status).toBe(200);
    const body = await res.json() as { readable: boolean; days: Array<{ name: string; exercises: Array<{ name: string; sets: number; primary: string[] }> }> };
    expect(body.readable).toBe(true);
    expect(body.days).toEqual([{ name: 'Push', exercises: [{ name: 'Bench Press', sets: 3, equipment: 'Barbell', primary: ['chest'], secondary: ['triceps'], pattern: 'horizontal_push', mode: 'weighted', confidence: 'high' }] }]);
  });

  it('keeps /explain, /tag-exercise, /notes, /ask, /identify-exercise and /import-programme independent: one 400 does not affect the others', async () => {
    expect((await handle(post('/tag-exercise', { version: 1, kind: 'tag-exercise', name: '' }), env())).status).toBe(400);
    expect((await handle(post('/ask', { ...askPayload(), question: '' }), env())).status).toBe(400);
    expect((await handle(post('/identify-exercise', { version: 1, kind: 'identify-exercise', image: { mediaType: 'image/png', data: '' } }), env())).status).toBe(400);
    expect((await handle(post('/import-programme', { version: 1, kind: 'import-programme', image: { mediaType: 'image/png', data: '' } }), env())).status).toBe(400);
    expect((await handle(post('/explain', payload()), env())).status).toBe(200);
    expect((await handle(post('/notes', notesPayload()), env())).status).toBe(200);
    expect((await handle(post('/ask', askPayload()), env())).status).toBe(200);
    expect((await handle(post('/identify-exercise', identifyPayload()), env())).status).toBe(200);
    expect((await handle(post('/import-programme', importPayload()), env())).status).toBe(200);
  });

  it('a route neither route table entry matches is a 404, same as an unknown path', async () => {
    expect((await handle(post('/not-a-real-route', {}), env())).status).toBe(404);
  });
});

describe('prompts', () => {
  it('states the contract and serialises the payload deterministically', () => {
    expect(SYSTEM_PROMPT).toContain('Use only numbers that appear in the report');
    expect(SYSTEM_PROMPT).toContain('Never predict or mention injury');
    expect(SYSTEM_PROMPT).toContain('contested');
    expect(SYSTEM_PROMPT).toContain('55 words');
    expect(userMessage(payload())).toBe(userMessage(payload()));
    expect(userMessage(payload())).toContain('"changePct":-18');
    expect(SYSTEM_PROMPT).toContain('preferences');
    expect(SYSTEM_PROMPT).toContain('no raw JSON');
    expect(SYSTEM_PROMPT).toContain('stray quotation mark or brace');
  });

  it('tag-exercise prompt names the closed vocabularies and asks for honest confidence', () => {
    expect(TAG_SYSTEM_PROMPT).toContain('rear_delts');
    expect(TAG_SYSTEM_PROMPT).toContain('horizontal_push');
    expect(TAG_SYSTEM_PROMPT).toContain('Never invent a muscle, pattern or mode id');
    expect(TAG_SYSTEM_PROMPT).toContain('Be honest here');
  });

  it('notes prompt forbids diagnosis and names the flag vocabulary', () => {
    expect(NOTES_SYSTEM_PROMPT).toContain('Never diagnose');
    expect(NOTES_SYSTEM_PROMPT).toContain('pain_or_discomfort');
    expect(NOTES_SYSTEM_PROMPT).toContain('not medical advice');
  });

  it('ask prompt splits personal (report-grounded, number-checked) from general knowledge (answered fully, not gated on data), and still refuses diagnosis and individualized dosing', () => {
    expect(ASK_SYSTEM_PROMPT).toContain('General knowledge');
    expect(ASK_SYSTEM_PROMPT).toContain('A "load_next" proposal, when present, is exactly this person\'s own recommended next weight and rep range');
    expect(ASK_SYSTEM_PROMPT).toContain('use its numbers directly and confidently');
    expect(ASK_SYSTEM_PROMPT).toContain('"scope" to "personal"');
    expect(ASK_SYSTEM_PROMPT).toContain('never invent a load, a percentage, a set count, a day count or a date about them');
    expect(ASK_SYSTEM_PROMPT).toContain('say so plainly');
    expect(ASK_SYSTEM_PROMPT).toContain('a number you calculate is exactly as unverifiable to the check that reads this answer as one you invented outright');
    expect(ASK_SYSTEM_PROMPT).toContain('do not decline or hedge one for "not having the logs"');
    expect(ASK_SYSTEM_PROMPT).toContain('Never diagnose a medical condition');
    expect(ASK_SYSTEM_PROMPT).toContain('individualized medical guidance');
    expect(ASK_SYSTEM_PROMPT).toContain('a doctor, pharmacist or other qualified professional can tailor it to them');
    expect(ASK_SYSTEM_PROMPT).toContain('gets a full, direct general answer, not a deflection');
    expect(ASK_SYSTEM_PROMPT).toContain('never predict or comment on injury risk');
    expect(ASK_SYSTEM_PROMPT).toContain('120 words');
    expect(ASK_SYSTEM_PROMPT).toContain('preferences');
    expect(ASK_SYSTEM_PROMPT).toContain('"scope" ("personal" or "general")');
    expect(ASK_SYSTEM_PROMPT).toContain('web search tool');
    expect(ASK_SYSTEM_PROMPT).toContain('Do not search for stable facts you already know confidently');
    expect(ASK_SYSTEM_PROMPT).toContain('You are a gym and health coach, not a general-purpose assistant');
    expect(ASK_SYSTEM_PROMPT).toContain('this is outside what the coach here does');
    expect(ASK_SYSTEM_PROMPT).toContain('Never endorse or recommend a specific commercial brand or product');
    expect(ASK_SYSTEM_PROMPT).toContain('give the general context in words rather than a precise outside figure');
    expect(ASK_SYSTEM_PROMPT).toContain('no raw JSON');
    expect(ASK_SYSTEM_PROMPT).toContain('stray quotation mark or brace');
    expect(ASK_SYSTEM_PROMPT).toContain('starting with "- "');
    expect(ASK_SYSTEM_PROMPT).toContain('**double asterisks**');
    expect(ASK_SYSTEM_PROMPT).toContain('not every noun');
    expect(ASK_SYSTEM_PROMPT).toContain('Set "category" to whichever the answer is mainly about');
    expect(ASK_SYSTEM_PROMPT).toContain('never shown as text and never affects grounding');
    expect(ASK_SYSTEM_PROMPT).toContain('and how to use this app itself');
    expect(ASK_SYSTEM_PROMPT).toContain('never guess a screen name or describe a button that isn\'t listed there');
    expect(ASK_SYSTEM_PROMPT).toContain('You cannot create a new split from inside a live session');
    expect(ASK_SYSTEM_PROMPT).toContain('that\'s the one place personal records (PRs) are listed');
    expect(ASK_SYSTEM_PROMPT).toContain('Settings has no tab of its own, only that gear');
  });

  it('ask prompt scope is broadened to general health, not just training-adjacent topics, while the individualized-guidance safety rule stays exactly as strict', () => {
    // Broadened on explicit request: "broaden our coach reasoning... answer almost all questions related to health, general, gym, muscles."
    expect(ASK_SYSTEM_PROMPT).toContain('read "health" broadly');
    expect(ASK_SYSTEM_PROMPT).toContain('any system, not only muscles');
    expect(ASK_SYSTEM_PROMPT).toContain('the heart and circulation, lungs and breathing, digestion, hormones, the immune system, the nervous system');
    expect(ASK_SYSTEM_PROMPT).toContain('nutrition and diet in general, not only what\'s obviously training-related');
    expect(ASK_SYSTEM_PROMPT).toContain('sleep in general, not only as it affects training');
    expect(ASK_SYSTEM_PROMPT).toContain('stress, mood, motivation, habit-building and mental wellbeing');
    expect(ASK_SYSTEM_PROMPT).toContain('ordinary everyday health questions a person might ask any knowledgeable friend');
    expect(ASK_SYSTEM_PROMPT).toContain('this is not a narrower assistant than you actually are on health topics');
    // Still genuinely bounded: unrelated topics decline exactly as before.
    expect(ASK_SYSTEM_PROMPT).toContain('Genuinely out of scope: weather, news, trivia, writing or coding something for them, finance or legal matters');
    // The broadened surface explicitly does not loosen the individualized-guidance line.
    expect(ASK_SYSTEM_PROMPT).toContain('broadening scope (rule 2) means more of these will sound medical-adjacent; the individualized/general line stays exactly the same');
    expect(ASK_SYSTEM_PROMPT).toContain('what does high blood pressure mean');
  });

  it('a food "what happens if I eat X" scenario is squarely in scope and gets a full general answer, not treated as riskier just for naming a food', () => {
    expect(ASK_SYSTEM_PROMPT).toContain('any "if I eat/drink X" scenario');
    expect(ASK_SYSTEM_PROMPT).toContain('not as a special or riskier category just because it names a food');
    expect(ASK_SYSTEM_PROMPT).toContain('what happens if I eat a lot of sugar every day');
    expect(ASK_SYSTEM_PROMPT).toContain('is it bad to eat right before bed');
    // The individualized line still holds for a real personal medical case wrapped in food language.
    expect(ASK_SYSTEM_PROMPT).toContain('I have diabetes, exactly how much sugar can I personally have');
  });

  it('ask prompt also carries the full exercise catalog and rep-range table, and states the splitDraft rules — this is the one route that may design or adjust a real split', () => {
    expect(ASK_SYSTEM_PROMPT).toContain('lib_barbell_bench_press|Barbell Bench Press|chest');
    expect(ASK_SYSTEM_PROMPT).toContain('lib_face_pull|Face Pull|rear_delts');
    expect(ASK_SYSTEM_PROMPT).toContain('never invent one, never use an id not on it');
    expect(ASK_SYSTEM_PROMPT).toContain('Lean muscle: 6-12 reps');
    expect(ASK_SYSTEM_PROMPT).toContain('You may design a new split or adjust an existing one when asked');
    expect(ASK_SYSTEM_PROMPT).toContain('ask one or two short, specific questions first');
    expect(ASK_SYSTEM_PROMPT).toContain('"splitDrafts"');
    expect(ASK_SYSTEM_PROMPT).toContain('put one entry per split when the person describes several at once');
    expect(ASK_SYSTEM_PROMPT).toContain('"action": "modify"');
    expect(ASK_SYSTEM_PROMPT).toContain('the app replaces the list with exactly what you send');
    expect(ASK_SYSTEM_PROMPT).toContain('at most 2 muscle ids');
    // Broadened scenario recognition, per the merge: named split styles, constraints, experience level.
    expect(ASK_SYSTEM_PROMPT).toContain('push/pull/legs, upper/lower, full body, a "bro split"');
    expect(ASK_SYSTEM_PROMPT).toContain('only dumbbells');
    expect(ASK_SYSTEM_PROMPT).toContain('I\'m new to this');
    // Findings-aware split-building: the standalone /build-split never had this context.
    expect(ASK_SYSTEM_PROMPT).toContain('since you flagged shoulder pain recently, I kept overhead work light here');
    expect(ASK_SYSTEM_PROMPT).toContain('Never invent a finding or number that isn\'t actually in the report');
    // Seen live: "a 5-day full body split" was misread as 5 separate splitDrafts (one per day),
    // ballooning the reply past max_tokens and 502ing. A day count is training frequency, not split count.
    expect(ASK_SYSTEM_PROMPT).toContain('A day count in the request describes how often to train, not how many splits to create');
    expect(ASK_SYSTEM_PROMPT).toContain('is exactly ONE splitDraft');
  });

  it('ask prompt also states the scheduleDraft rules — this is the one route that may also rearrange the weekly schedule', () => {
    expect(ASK_SYSTEM_PROMPT).toContain('"scheduleDraft"');
    expect(ASK_SYSTEM_PROMPT).toContain('could u switch my Push to Wednesday');
    expect(ASK_SYSTEM_PROMPT).toContain('is the FULL week, all seven days (sun through sat) every time, not just the days that change');
    expect(ASK_SYSTEM_PROMPT).toContain('Never invent a split id, never assign a day to a split that isn\'t in "splits"');
    expect(ASK_SYSTEM_PROMPT).toContain('a schedule tweak touches every day of their week, so it is a bigger, more disruptive action than adding an exercise to one split');
    expect(ASK_SYSTEM_PROMPT).toContain('spacing so the same muscle group doesn\'t stack on back-to-back days without reason');
    expect(ASK_SYSTEM_PROMPT).toContain('If you don\'t have enough to make a real judgment');
    expect(ASK_SYSTEM_PROMPT).toContain('"scheduleDraft" (usually null), and "concern" (usually null)');
  });

  it('ask prompt broadens the individualized-medical line to minors, pregnancy, PEDs and named-but-general conditions, and sets a concern flag for crisis or disordered-eating signals', () => {
    expect(ASK_SYSTEM_PROMPT).toContain('reproductive health, pregnancy and postpartum recovery in general');
    expect(ASK_SYSTEM_PROMPT).toContain('Naming a condition doesn\'t by itself make a question individualized');
    expect(ASK_SYSTEM_PROMPT).toContain('"I\'m 32 weeks with [a stated complication], is this specific thing safe for me" is the individualized case');
    expect(ASK_SYSTEM_PROMPT).toContain('performance-enhancing drugs (steroids, SARMs, prohormones)');
    expect(ASK_SYSTEM_PROMPT).toContain('never help plan a cycle or a dosage or encourage taking them for faster results');
    expect(ASK_SYSTEM_PROMPT).toContain('When the person states they are a child or a young teen');
    expect(ASK_SYSTEM_PROMPT).toContain('a parent or guardian and, for anything supplement- or dosage-shaped, a doctor');
    expect(ASK_SYSTEM_PROMPT).toContain('Set "concern" when the question itself carries a real signal of crisis');
    expect(ASK_SYSTEM_PROMPT).toContain('"crisis" or "disordered_eating" respectively, null otherwise');
    expect(ASK_SYSTEM_PROMPT).toContain('that resource must not depend on you remembering to mention it in "answer"');
    expect(ASK_SYSTEM_PROMPT).toContain('Never go quiet or refuse to engage when this comes up');
  });

  it('identify-exercise prompt names the closed vocabularies, asks for honest confidence and forbids describing a person', () => {
    expect(IDENTIFY_SYSTEM_PROMPT).toContain('rear_delts');
    expect(IDENTIFY_SYSTEM_PROMPT).toContain('horizontal_push');
    expect(IDENTIFY_SYSTEM_PROMPT).toContain('Never invent a muscle, pattern or mode id');
    expect(IDENTIFY_SYSTEM_PROMPT).toContain('Be honest here');
    expect(IDENTIFY_SYSTEM_PROMPT).toContain('Never describe or comment on their body, appearance, face');
    expect(IDENTIFY_SYSTEM_PROMPT).toContain('"visible" is true only when');
  });

  it('identify-exercise message sends the photo as an image block and the hint as text, nothing else', () => {
    const msg = identifyMessage(identifyPayload());
    expect(msg[0]).toEqual({ type: 'image', source: { type: 'base64', media_type: 'image/png', data: TINY_PNG } });
    expect(msg[1]).toEqual({ type: 'text', text: JSON.stringify({ equipmentHint: 'Cable' }) });
    const noHint = identifyMessage({ version: 1, kind: 'identify-exercise', image: { mediaType: 'image/jpeg', data: TINY_PNG } });
    expect(noHint[1]).toEqual({ type: 'text', text: JSON.stringify({ equipmentHint: null }) });
  });

  it('import-programme prompt names the closed vocabularies, caps days and exercises, and forbids weight numbers', () => {
    expect(IMPORT_SYSTEM_PROMPT).toContain('rear_delts');
    expect(IMPORT_SYSTEM_PROMPT).toContain('horizontal_push');
    expect(IMPORT_SYSTEM_PROMPT).toContain('at most 7 days');
    expect(IMPORT_SYSTEM_PROMPT).toContain('Never report a weight, load or percentage');
    expect(IMPORT_SYSTEM_PROMPT).toContain('Never describe or comment on their body, appearance, face');
    expect(IMPORT_SYSTEM_PROMPT).toContain('"readable" is true only when');
  });

  it('import-programme message sends only the photo, no text block', () => {
    expect(importMessage(importPayload())).toEqual([{ type: 'image', source: { type: 'base64', media_type: 'image/png', data: TINY_PNG } }]);
  });

  it('ask replays the report, real splits and real schedule once, then the real conversation, then the new question last', () => {
    const withHistory: AskPayload = { ...askPayload(), schedule: scheduleWithPush, preferences: ['Usually accepts schedule changes when the coach offers them.'], history: [{ role: 'user', text: 'How was last week?' }, { role: 'assistant', text: 'Solid: chest volume held steady.' }] };
    const msgs = askMessages(withHistory);
    expect(msgs[0]).toMatchObject({ role: 'user' });
    expect(msgs[0]!.content).toContain('"changePct":-18');
    expect(msgs[0]!.content).toContain('Usually accepts schedule changes');
    expect(msgs[0]!.content).toContain('lib_barbell_bench_press');
    expect(msgs[0]!.content).toContain('split_push');
    expect(msgs[0]!.content).toContain('"schedule":{"sun":null,"mon":"split_push"');
    expect(msgs[1]).toMatchObject({ role: 'assistant' });
    expect(msgs[2]).toEqual({ role: 'user', content: 'How was last week?' });
    expect(msgs[3]).toEqual({ role: 'assistant', content: 'Solid: chest volume held steady.' });
    expect(msgs.at(-1)).toEqual({ role: 'user', content: withHistory.question });
    // Deterministic: same payload, same messages, so the same conversation always renders the same way.
    expect(askMessages(withHistory)).toEqual(msgs);
  });
});

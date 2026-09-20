/**
 * Pure request handling: shape and size checks, CORS, per-device rate limit
 * and daily quotas, then the route's own model call. Each route is a small
 * config (path, body cap, validator, call); the dispatch, CORS, rate limit
 * and quota logic is the same for all of them and lives once, here. Every
 * call is injected so the handler is testable without the network.
 */
import { DEFAULT_MODEL, modelsByRoute } from './anthropic';
import { WEEKDAY_KEYS } from './types';
import type { AskPayload, AskTurn, GroundingPayload, IdentifyExercisePayload, ImportProgrammePayload, NotesPayload, TagExercisePayload, WorkerEnv } from './types';

export const MAX_BODY_BYTES = 24 * 1024;
export const MAX_TAG_BODY_BYTES = 1024;
export const MAX_NOTES_BODY_BYTES = 2 * 1024;
export const MAX_ASK_BODY_BYTES = 32 * 1024;
/** A downscaled photo's base64 comfortably fits well under this; it exists to bound cost and abuse, not to be a target size. */
export const MAX_IDENTIFY_BODY_BYTES = 1_500_000;
export const MAX_IMPORT_BODY_BYTES = 1_500_000;
export const MAX_IMAGE_DATA_CHARS = 2_000_000;
export const IMAGE_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_FINDINGS = 24;
export const MAX_PROPOSALS = 16;
export const MAX_EXPLAIN = 12;
export const MAX_CARDS = 18;
export const MAX_NAME_CHARS = 60;
export const MAX_EQUIPMENT_HINT_CHARS = 40;
export const MAX_NOTE_CHARS = 280;
export const MAX_PREFERENCES = 6;
export const MAX_PREFERENCE_CHARS = 160;
export const MAX_QUESTION_CHARS = 300;
export const MAX_HISTORY_TURNS = 12;
export const MAX_HISTORY_TURN_CHARS = 700;
export const MAX_KNOWN_SPLITS = 7;
export const MAX_KNOWN_SPLIT_EXERCISES = 14;
export const MAX_KNOWN_SPLIT_NAME_CHARS = 28;
const DEVICE_ID = /^[a-zA-Z0-9_-]{8,64}$/;
const BASE64 = /^[A-Za-z0-9+/]+=*$/;

const ALWAYS_ALLOWED_ORIGINS = new Set(['capacitor://localhost', 'http://localhost', 'https://localhost', 'ionic://localhost']);

export function corsHeaders(origin: string | null, env: WorkerEnv): Record<string, string> {
  const extra = (env.ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const ok = !origin || ALWAYS_ALLOWED_ORIGINS.has(origin) || extra.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/(127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-marc-device',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (ok && origin) h['Access-Control-Allow-Origin'] = origin;
  if (ok && !origin) h['Access-Control-Allow-Origin'] = '*';
  return h;
}

export function originAllowed(origin: string | null, env: WorkerEnv): boolean {
  return 'Access-Control-Allow-Origin' in corsHeaders(origin, env);
}

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const isDay = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const onlyKeys = (raw: Record<string, unknown>, allowed: string[]): boolean => Object.keys(raw).every(k => allowed.includes(k));

export type Validated<P> = { ok: true; payload: P } | { ok: false; reason: string };

/**
 * The report shape every reasoning route shares (findings, proposals,
 * cards, goal, unit, today, dataQuality) and nothing that looks like a
 * person. Returns a plain-words reason it was refused, or null if it's
 * fine — the caller still owns its own `version`/`kind` check and whatever
 * fields are specific to that route.
 */
function validateGrounding(raw: Record<string, unknown>): string | null {
  if (typeof raw.goal !== 'string' || (raw.unit !== 'kg' && raw.unit !== 'lb') || !isDay(raw.today)) return 'goal, unit and today are required.';
  if (!isRecord(raw.dataQuality)) return 'dataQuality is required.';
  const findings = raw.findings, proposals = raw.proposals, cards = raw.cards;
  if (!Array.isArray(findings) || findings.length > MAX_FINDINGS) return `findings must be an array of at most ${MAX_FINDINGS}.`;
  if (!Array.isArray(proposals) || proposals.length > MAX_PROPOSALS) return `proposals must be an array of at most ${MAX_PROPOSALS}.`;
  if (!Array.isArray(cards) || cards.length > MAX_CARDS) return `cards must be an array of at most ${MAX_CARDS}.`;
  for (const f of findings) {
    if (!isRecord(f) || typeof f.id !== 'string' || typeof f.kind !== 'string' || !isRecord(f.metrics) || !isRecord(f.window) || !isRecord(f.subject)) return 'A finding is malformed.';
    if ('evidence' in f || 'sessionIds' in f) return 'Findings must not carry session evidence.';
  }
  for (const p of proposals) {
    if (!isRecord(p) || typeof p.id !== 'string' || typeof p.kind !== 'string' || !isRecord(p.subject)) return 'A proposal is malformed.';
  }
  for (const c of cards) {
    if (!isRecord(c) || typeof c.id !== 'string' || typeof c.statement !== 'string' || typeof c.title !== 'string' || typeof c.rating !== 'string') return 'A card is malformed.';
  }
  if (raw.preferences !== undefined) {
    const preferences = raw.preferences;
    if (!Array.isArray(preferences) || preferences.length > MAX_PREFERENCES || !preferences.every(p => typeof p === 'string' && p.length <= MAX_PREFERENCE_CHARS)) {
      return `preferences must be an array of at most ${MAX_PREFERENCES} strings, each at most ${MAX_PREFERENCE_CHARS} characters.`;
    }
  }
  // A single derived ratio, not a raw body measurement — the one deliberate exception to the
  // blocklist right below. Still bounded to a plausible human range, same "don't trust the
  // network" discipline as every other numeric field here.
  if (raw.bmi !== undefined && raw.bmi !== null) {
    if (typeof raw.bmi !== 'number' || !Number.isFinite(raw.bmi) || raw.bmi <= 0 || raw.bmi > 200) return 'bmi must be a plausible positive number.';
  }
  // Anything that looks like a person: refuse. The app never sends these; a modified client might.
  for (const key of ['profile', 'name', 'email', 'bodyWeightKg', 'heightCm', 'sessions']) if (key in raw) return `Field "${key}" is not accepted.`;
  return null;
}

/** Returns the payload, or a plain-words reason it was refused. */
export function validatePayload(raw: unknown): Validated<import('./types').ExplainPayload> {
  if (!isRecord(raw)) return { ok: false, reason: 'Body must be a JSON object.' };
  if (raw.version !== 1 || raw.kind !== 'explain') return { ok: false, reason: 'Unsupported payload version or kind.' };
  if (!onlyKeys(raw, ['version', 'kind', 'goal', 'unit', 'today', 'dataQuality', 'findings', 'proposals', 'cards', 'preferences', 'bmi', 'explain'])) return { ok: false, reason: 'Unexpected field in the payload.' };
  const groundingError = validateGrounding(raw);
  if (groundingError) return { ok: false, reason: groundingError };
  const findings = raw.findings as Array<{ id: string }>, proposals = raw.proposals as Array<{ id: string }>, explain = raw.explain;
  if (!Array.isArray(explain) || !explain.length || explain.length > MAX_EXPLAIN || !explain.every(x => typeof x === 'string')) return { ok: false, reason: `explain must list 1 to ${MAX_EXPLAIN} ids.` };
  const known = new Set([...findings.map(f => f.id), ...proposals.map(p => p.id)]);
  if (!explain.every(id => known.has(id as string))) return { ok: false, reason: 'explain lists an id that is not in the report.' };
  return { ok: true, payload: raw as unknown as import('./types').ExplainPayload };
}

/** A custom exercise's name, and maybe an equipment word already typed. Nothing else. */
export function validateTagPayload(raw: unknown): Validated<TagExercisePayload> {
  if (!isRecord(raw)) return { ok: false, reason: 'Body must be a JSON object.' };
  if (raw.version !== 1 || raw.kind !== 'tag-exercise') return { ok: false, reason: 'Unsupported payload version or kind.' };
  if (!onlyKeys(raw, ['version', 'kind', 'name', 'equipmentHint'])) return { ok: false, reason: 'Unexpected field in the payload.' };
  if (typeof raw.name !== 'string' || !raw.name.trim() || raw.name.length > MAX_NAME_CHARS) return { ok: false, reason: `name is required, at most ${MAX_NAME_CHARS} characters.` };
  if (raw.equipmentHint !== undefined && (typeof raw.equipmentHint !== 'string' || raw.equipmentHint.length > MAX_EQUIPMENT_HINT_CHARS)) return { ok: false, reason: `equipmentHint must be at most ${MAX_EQUIPMENT_HINT_CHARS} characters.` };
  return { ok: true, payload: raw as unknown as TagExercisePayload };
}

/** A note's text, nothing else — no session, no exercise id, no other field about the person. */
export function validateNotesPayload(raw: unknown): Validated<NotesPayload> {
  if (!isRecord(raw)) return { ok: false, reason: 'Body must be a JSON object.' };
  if (raw.version !== 1 || raw.kind !== 'notes') return { ok: false, reason: 'Unsupported payload version or kind.' };
  if (!onlyKeys(raw, ['version', 'kind', 'text'])) return { ok: false, reason: 'Unexpected field in the payload.' };
  if (typeof raw.text !== 'string' || !raw.text.trim() || raw.text.length > MAX_NOTE_CHARS) return { ok: false, reason: `text is required, at most ${MAX_NOTE_CHARS} characters.` };
  return { ok: true, payload: raw as unknown as NotesPayload };
}

/** The one photo every vision route takes: shape, media type and base64 well-formedness. Returns a plain-words reason it was refused, or null if it's fine. */
function validateImage(raw: Record<string, unknown>): string | null {
  const image = raw.image;
  if (!isRecord(image)) return 'A photo is required.';
  if (!onlyKeys(image, ['mediaType', 'data'])) return 'Unexpected field in the photo.';
  if (typeof image.mediaType !== 'string' || !(IMAGE_MEDIA_TYPES as readonly string[]).includes(image.mediaType)) return `Photo type must be one of: ${IMAGE_MEDIA_TYPES.join(', ')}.`;
  if (typeof image.data !== 'string' || !image.data || image.data.length > MAX_IMAGE_DATA_CHARS || !BASE64.test(image.data)) return 'Photo data must be non-empty base64.';
  return null;
}

/** One photo, already downscaled by the app, plus an optional equipment word. Nothing else. */
export function validateIdentifyPayload(raw: unknown): Validated<IdentifyExercisePayload> {
  if (!isRecord(raw)) return { ok: false, reason: 'Body must be a JSON object.' };
  if (raw.version !== 1 || raw.kind !== 'identify-exercise') return { ok: false, reason: 'Unsupported payload version or kind.' };
  if (!onlyKeys(raw, ['version', 'kind', 'image', 'equipmentHint'])) return { ok: false, reason: 'Unexpected field in the payload.' };
  const imageError = validateImage(raw);
  if (imageError) return { ok: false, reason: imageError };
  if (raw.equipmentHint !== undefined && (typeof raw.equipmentHint !== 'string' || raw.equipmentHint.length > MAX_EQUIPMENT_HINT_CHARS)) return { ok: false, reason: `equipmentHint must be at most ${MAX_EQUIPMENT_HINT_CHARS} characters.` };
  return { ok: true, payload: raw as unknown as IdentifyExercisePayload };
}

/** One photo of a written workout plan. Nothing else. */
export function validateImportPayload(raw: unknown): Validated<ImportProgrammePayload> {
  if (!isRecord(raw)) return { ok: false, reason: 'Body must be a JSON object.' };
  if (raw.version !== 1 || raw.kind !== 'import-programme') return { ok: false, reason: 'Unsupported payload version or kind.' };
  if (!onlyKeys(raw, ['version', 'kind', 'image'])) return { ok: false, reason: 'Unexpected field in the payload.' };
  const imageError = validateImage(raw);
  if (imageError) return { ok: false, reason: imageError };
  return { ok: true, payload: raw as unknown as ImportProgrammePayload };
}

const isTurn = (v: unknown): v is AskTurn => isRecord(v) && (v.role === 'user' || v.role === 'assistant') && typeof v.text === 'string' && v.text.length > 0 && v.text.length <= MAX_HISTORY_TURN_CHARS;

const isKnownSplitExercise = (v: unknown): v is { exerciseId: string; name: string; sets: number } =>
  isRecord(v) && typeof v.exerciseId === 'string' && typeof v.name === 'string' && typeof v.sets === 'number' && Number.isFinite(v.sets);

const isKnownSplit = (v: unknown): v is { id: string; name: string; focus: string[]; exercises: unknown[] } =>
  isRecord(v) && typeof v.id === 'string' && typeof v.name === 'string' && v.name.length <= MAX_KNOWN_SPLIT_NAME_CHARS
  && Array.isArray(v.focus) && v.focus.length <= 2 && v.focus.every(f => typeof f === 'string')
  && Array.isArray(v.exercises) && v.exercises.length <= MAX_KNOWN_SPLIT_EXERCISES && v.exercises.every(isKnownSplitExercise);

/** Every one of the 7 weekday keys present, no others, each a string id or null (rest) — the same "full week, not a diff" shape the app's own `schedule` state and a `scheduleDraft` reply both use. */
const isSchedule = (v: unknown): v is Record<string, string | null> =>
  isRecord(v) && onlyKeys(v, [...WEEKDAY_KEYS]) && WEEKDAY_KEYS.every(d => d in v && (v[d] === null || typeof v[d] === 'string'));

/** The report, the person's real splits and schedule today, the conversation so far, and the new question. Same grounding rules as /explain, plus `splits`/`schedule` — this is the one route that may also design or adjust a split, or rearrange the weekly schedule, when asked. */
export function validateAskPayload(raw: unknown): Validated<AskPayload> {
  if (!isRecord(raw)) return { ok: false, reason: 'Body must be a JSON object.' };
  if (raw.version !== 1 || raw.kind !== 'ask') return { ok: false, reason: 'Unsupported payload version or kind.' };
  if (!onlyKeys(raw, ['version', 'kind', 'goal', 'unit', 'today', 'dataQuality', 'findings', 'proposals', 'cards', 'preferences', 'bmi', 'history', 'question', 'splits', 'schedule'])) return { ok: false, reason: 'Unexpected field in the payload.' };
  const groundingError = validateGrounding(raw);
  if (groundingError) return { ok: false, reason: groundingError };
  if (typeof raw.question !== 'string' || !raw.question.trim() || raw.question.length > MAX_QUESTION_CHARS) return { ok: false, reason: `question is required, at most ${MAX_QUESTION_CHARS} characters.` };
  const history = raw.history;
  if (!Array.isArray(history) || history.length > MAX_HISTORY_TURNS || !history.every(isTurn)) return { ok: false, reason: `history must be an array of at most ${MAX_HISTORY_TURNS} turns, each with a role and text.` };
  const splits = raw.splits;
  if (!Array.isArray(splits) || splits.length > MAX_KNOWN_SPLITS || !splits.every(isKnownSplit)) return { ok: false, reason: `splits must be an array of at most ${MAX_KNOWN_SPLITS} known splits.` };
  // Optional, like `preferences`: an app build from before scheduleDraft shipped never sends this
  // field at all, and a hard requirement here would 400 every single /ask call from that client —
  // not just a schedule-related one — until it happens to be rebuilt. Missing is accepted and
  // defaulted (askMessages() in promptAsk.ts); present-but-malformed is still refused outright.
  if (raw.schedule !== undefined && !isSchedule(raw.schedule)) return { ok: false, reason: 'schedule must have all 7 weekday keys, each a split id or null.' };
  return { ok: true, payload: raw as unknown as AskPayload };
}

export interface QuotaResult { ok: boolean; reason?: string; remaining?: number }

/** Best-effort daily counters in KV, keyed by the server's own date so a client can never reset its own quota. Without a QUOTA binding, everything is allowed. */
export async function checkQuota(env: WorkerEnv, device: string, today: string): Promise<QuotaResult> {
  const kv = env.QUOTA;
  if (!kv) return { ok: true };
  const perDevice = Number(env.MAX_DAILY_PER_DEVICE ?? '12') || 12;
  const total = Number(env.MAX_DAILY_TOTAL ?? '2000') || 2000;
  const dKey = `d:${device}:${today}`, tKey = `t:${today}`;
  const [d, t] = await Promise.all([kv.get(dKey), kv.get(tKey)]);
  const dn = Number(d ?? '0'), tn = Number(t ?? '0');
  if (dn >= perDevice) return { ok: false, reason: 'Daily limit for this device reached. Try again tomorrow.', remaining: 0 };
  if (tn >= total) return { ok: false, reason: 'The coach is busy today. Try again tomorrow.', remaining: 0 };
  const ttl = 60 * 60 * 36;
  await Promise.all([kv.put(dKey, String(dn + 1), { expirationTtl: ttl }), kv.put(tKey, String(tn + 1), { expirationTtl: ttl })]);
  return { ok: true, remaining: perDevice - dn - 1 };
}

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}

/** One POST route: where it lives, how big a body it accepts, how to validate it, and how to answer it. */
export interface RouteConfig {
  path: string;
  maxBody: number;
  validate: (raw: unknown) => Validated<unknown>;
  /** Returns the JSON body to send back (minus "remaining", which the handler adds). Throws with a `status` to map to a calm error. */
  call: (payload: unknown, env: WorkerEnv) => Promise<Record<string, unknown>>;
}

export function createHandler(routes: RouteConfig[]) {
  return async (request: Request, env: WorkerEnv): Promise<Response> => {
    const origin = request.headers.get('origin');
    const cors = corsHeaders(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!originAllowed(origin, env)) return json(403, { error: 'Origin not allowed.' }, cors);
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/health') return json(200, { ok: true, model: env.MODEL ?? DEFAULT_MODEL, models: modelsByRoute(env), quotas: !!env.QUOTA, rateLimit: !!env.RATE }, cors);
    const route = routes.find(r => r.path === url.pathname);
    if (request.method !== 'POST' || !route) return json(404, { error: 'Not found.' }, cors);
    if (!env.ANTHROPIC_API_KEY) return json(503, { error: 'The proxy has no API key yet. Run: npx wrangler@4 secret put ANTHROPIC_API_KEY' }, cors);

    const device = request.headers.get('x-marc-device') ?? '';
    if (!DEVICE_ID.test(device)) return json(400, { error: 'Missing or invalid x-marc-device header.' }, cors);
    const length = Number(request.headers.get('content-length') ?? '0');
    if (length > route.maxBody) return json(413, { error: `Body too large (max ${route.maxBody} bytes).` }, cors);
    const text = await request.text();
    if (text.length > route.maxBody) return json(413, { error: `Body too large (max ${route.maxBody} bytes).` }, cors);
    let raw: unknown;
    try { raw = JSON.parse(text); } catch { return json(400, { error: 'Body is not valid JSON.' }, cors); }
    const v = route.validate(raw);
    if (!v.ok) return json(400, { error: v.reason }, cors);

    if (env.RATE) {
      const r = await env.RATE.limit({ key: device });
      if (!r.success) return json(429, { error: 'Too many requests. Wait a minute.' }, { ...cors, 'retry-after': '60' });
    }
    const today = new Date().toISOString().slice(0, 10);
    const quota = await checkQuota(env, device, today);
    if (!quota.ok) return json(429, { error: quota.reason }, { ...cors, 'retry-after': '3600' });

    try {
      const body = await route.call(v.payload, env);
      return json(200, { ...body, remaining: quota.remaining ?? null }, cors);
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 429) return json(429, { error: 'The model is busy. Try again in a minute.' }, { ...cors, 'retry-after': '60' });
      if (status === 401) return json(503, { error: 'The proxy key was rejected. Check the ANTHROPIC_API_KEY secret.' }, cors);
      console.error(`${route.path} failed`, err);
      return json(502, { error: 'The coach could not answer right now.' }, cors);
    }
  };
}

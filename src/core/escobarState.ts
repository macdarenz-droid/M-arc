import {
  freshEscobar, MAX_MEMORY_ITEMS, MAX_MEMORY_TEXT, MAX_PINS, MEMORY_KINDS, SHOW_COMPONENT_IDS,
  type DailyBrief, type EscobarState, type MemoryItem, type PinnedCard, type TodayChange, type TodayOverride,
} from './models';

/**
 * Field-by-field repair of a saved `escobar` block (§6.1). A state written by an
 * older build, a hand-edited backup or a half-written save must never break boot,
 * so every malformed item is dropped and every list is capped here.
 */

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown): v is string => typeof v === 'string';
const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const DAY = /^\d{4}-\d{2}-\d{2}$/;
export const DEVICE_ID = /^dev_[a-f0-9]{24}$/;
const MEMORY_SOURCES = ['user_said', 'inferred', 'user_edit', 'summary'] as const;

function memoryItem(v: unknown): MemoryItem | null {
  if (!isObj(v) || !str(v.id) || !str(v.text) || !str(v.createdAt)) return null;
  if (!MEMORY_KINDS.includes(v.kind as MemoryItem['kind'])) return null;
  const text = v.text.trim().slice(0, MAX_MEMORY_TEXT);
  if (!text) return null;
  const source = MEMORY_SOURCES.includes(v.source as MemoryItem['source']) ? (v.source as MemoryItem['source']) : 'user_said';
  const item: MemoryItem = { id: v.id, kind: v.kind as MemoryItem['kind'], text, source, createdAt: v.createdAt, updatedAt: str(v.updatedAt) ? v.updatedAt : v.createdAt };
  if (str(v.expiresOn) && DAY.test(v.expiresOn)) item.expiresOn = v.expiresOn;
  if (str(v.conversationId)) item.conversationId = v.conversationId;
  return item;
}

function pin(v: unknown): PinnedCard | null {
  if (!isObj(v) || !str(v.id) || !str(v.title) || !str(v.pinnedAt)) return null;
  if (!SHOW_COMPONENT_IDS.includes(v.component as PinnedCard['component'])) return null;
  const p: PinnedCard = { id: v.id, component: v.component as PinnedCard['component'], params: isObj(v.params) ? v.params : {}, title: v.title.slice(0, 60), pinnedAt: v.pinnedAt };
  if (str(v.until) && DAY.test(v.until)) p.until = v.until;
  return p;
}

function change(v: unknown): TodayChange | null {
  if (!isObj(v)) return null;
  switch (v.kind) {
    case 'swap': return str(v.from) && str(v.to) ? { kind: 'swap', from: v.from, to: v.to } : null;
    case 'remove': return str(v.exerciseId) ? { kind: 'remove', exerciseId: v.exerciseId } : null;
    case 'add': return str(v.exerciseId) && num(v.sets) ? { kind: 'add', exerciseId: v.exerciseId, sets: v.sets } : null;
    case 'sets': return str(v.exerciseId) && num(v.sets) ? { kind: 'sets', exerciseId: v.exerciseId, sets: v.sets } : null;
    case 'load': return str(v.exerciseId) && num(v.factor) ? { kind: 'load', exerciseId: v.exerciseId, factor: v.factor } : null;
    default: return null;
  }
}

function todayOverride(v: unknown): TodayOverride | null {
  if (!isObj(v) || !str(v.day) || !DAY.test(v.day) || !str(v.splitId) || !Array.isArray(v.changes)) return null;
  const changes = v.changes.map(change).filter((c): c is TodayChange => !!c);
  return { day: v.day, splitId: v.splitId, reason: str(v.reason) ? v.reason.slice(0, 140) : '', changes };
}

function brief(v: unknown): DailyBrief | null {
  if (!isObj(v) || !str(v.day) || !str(v.headline) || !str(v.generatedAt) || !Array.isArray(v.priorities)) return null;
  const priorities = v.priorities
    .filter((p): p is { insightId: string; line: string } => isObj(p) && str(p.insightId) && str(p.line))
    .slice(0, 3)
    .map(p => ({ insightId: p.insightId, line: p.line }));
  return { day: v.day, headline: v.headline, priorities, generatedAt: v.generatedAt, source: v.source === 'escobar' ? 'escobar' : 'brain' };
}

export function normalizeEscobar(raw: unknown): EscobarState {
  const fresh = freshEscobar();
  if (!isObj(raw)) return fresh;
  const sharing = isObj(raw.sharing) ? raw.sharing : {};
  const proactive = isObj(raw.proactive) ? raw.proactive : {};
  const usage = isObj(raw.usage) ? raw.usage : {};
  const shown: Record<string, string> = {};
  if (isObj(proactive.shown)) for (const [k, d] of Object.entries(proactive.shown)) if (str(d)) shown[k] = d;
  const memory = (Array.isArray(raw.memory) ? raw.memory : []).map(memoryItem).filter((m): m is MemoryItem => !!m);
  const pins = (Array.isArray(raw.pins) ? raw.pins : []).map(pin).filter((p): p is PinnedCard => !!p);
  return {
    enabled: raw.enabled === true,
    proxyUrl: str(raw.proxyUrl) && /^https?:\/\//.test(raw.proxyUrl) ? raw.proxyUrl : null,
    deviceId: str(raw.deviceId) && DEVICE_ID.test(raw.deviceId) ? raw.deviceId : '',
    sharing: { health: sharing.health === true, body: sharing.body === true },
    tone: raw.tone === 'direct' ? 'direct' : 'warm',
    memoryEnabled: raw.memoryEnabled !== false,
    // Newest last: keep the newest when over the cap.
    memory: memory.slice(-MAX_MEMORY_ITEMS),
    pins: pins.slice(-MAX_PINS),
    todayOverride: todayOverride(raw.todayOverride),
    proactive: {
      enabled: proactive.enabled !== false,
      shown,
      day: str(proactive.day) ? proactive.day : '',
      count: num(proactive.count) ? Math.max(0, Math.round(proactive.count)) : 0,
    },
    brief: brief(raw.brief),
    usage: {
      day: str(usage.day) ? usage.day : '',
      turns: num(usage.turns) ? usage.turns : 0,
      inputTokens: num(usage.inputTokens) ? usage.inputTokens : 0,
      outputTokens: num(usage.outputTokens) ? usage.outputTokens : 0,
      cacheReadTokens: num(usage.cacheReadTokens) ? usage.cacheReadTokens : 0,
    },
    legacyImported: raw.legacyImported === true || fresh.legacyImported,
  };
}

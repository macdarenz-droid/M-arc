/**
 * The glue between the loop and the app (§5): which conversation is open, the transport
 * (the Worker, or the gate's mock when `marc.dev` is on), persistence to the conversation
 * store, memory effects with Undo, usage, online status and the device id.
 */
import { signal } from '@preact/signals';
import { state, update } from '@/core/store';
import type { AppState, MemoryItem } from '@/core/models';
import { MAX_MEMORY_ITEMS } from '@/core/models';
import { todayKey } from '@/core/dates';
import { showToast } from '@/app/toast';
import { saveInsightFeedback } from '@/slices/coach/coach';
import { EscobarLoop, type SendInput, type TurnResult } from './loop';
import { httpTransport, checkHealth, type Transport } from './transport';
import { buildManifest } from './context/manifest';
import { currentFocus } from './palace/focus';
import { emptyStore, legacyConversation, loadStore, memoryStorage, newConversation, onStoreReplaced, saveStore, setEscobarStorage, upsertConversation } from './store';
import { evictImages, imageData } from './images';
import { escobarUi, loopView, online, proxyUrlOf, quotaResetAt } from './state';
import { PROTECTED_MEMORY } from './tools/executor';
import { isPlanRequest } from './ui/prompts';
import type { MemoryEffect } from './tools/executor';
import type { Conversation, ConversationStore, ContextRef } from './types';
import type { EscobarMode } from './context/modes';
import type { SafetySignal } from './verify';

import { APP_VERSION } from '@/core/version';
const MANIFEST = buildManifest(APP_VERSION);

export const devMode = (): boolean => { try { return typeof localStorage !== 'undefined' && localStorage.getItem('marc.dev') === '1'; } catch { return false; } };

/** The open conversation and the list of past ones, for the UI. */
export const storeSig = signal<ConversationStore>(emptyStore());
export const activeConversation = signal<Conversation | null>(null);
/** The last turn's result, for "Not sent · Retry", refusals, offline replies and errors. */
export const lastTurn = signal<(TurnResult & { input: SendInput }) | null>(null);
/** Fixed safety cards raised by the pre-screen for the current conversation (§19). */
export const safetyCards = signal<SafetySignal[]>([]);
/** The message being sent, shown until the loop commits it (the conversation length when sent). */
export const pendingUser = signal<{ input: SendInput; at: number } | null>(null);

let transport: Transport | null = null;
let loop: EscobarLoop | null = null;
let offlineUntil = 0;
let loaded = false;
/** Bumped whenever the conversation store is replaced; a turn from an older epoch writes nothing (ES-07, R4.4). */
let epoch = 0;

/**
 * Stops the running turn and clears what it showed. The stopped loop may no longer touch the UI
 * (it is not the active loop), so its own "idle" never arrives: the switch has to say it (QA-R4a-1/3/8).
 */
function dropLoop(): void {
  loop?.stop();
  loop = null;
  lastTurn.value = null;
  safetyCards.value = [];
  pendingUser.value = null;
  loopView.value = { status: 'idle', text: '', preamble: [], activity: [], outcomes: [] };
}

// Reset or restore replaced the store underneath us: drop the loop and everything cached.
onStoreReplaced(() => {
  dropLoop();
  epoch++;
  loaded = false;
  activeConversation.value = null;
  storeSig.value = emptyStore();
  loadConversations();
});

export function ensureDeviceId(): string {
  const cur = state.value.escobar.deviceId;
  if (/^dev_[a-f0-9]{24}$/.test(cur)) return cur;
  const legacy = (state.value as unknown as { coach?: { deviceId?: string } }).coach?.deviceId;
  let id = legacy && /^dev_[a-f0-9]{24}$/.test(legacy) ? legacy : '';
  if (!id) {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    id = `dev_${[...bytes].map(b => b.toString(16).padStart(2, '0')).join('')}`;
  }
  update(s => ({ ...s, escobar: { ...s.escobar, deviceId: id } }));
  return id;
}

async function getTransport(): Promise<Transport> {
  if (transport) return transport;
  if (devMode()) {
    const mock = await import('./mock/transport');
    const t = mock.mockTransport(() => state.value);
    transport = t;
    return t;
  }
  const t = httpTransport({ url: () => proxyUrlOf(state.value.escobar.proxyUrl), device: ensureDeviceId });
  transport = t;
  return t;
}

/** Test and gate hook: swap the transport (never used in production paths). */
export function setTransport(t: Transport | null): void { transport = t; loop = null; }

function loadConversations(): void {
  if (loaded) return;
  loaded = true;
  if (devMode()) setEscobarStorage(memoryStorage());
  const s = loadStore();
  storeSig.value = s;
  activeConversation.value = s.conversations.find(c => c.id === s.activeId) ?? null;
}

function persist(c: Conversation): void {
  const next = upsertConversation(storeSig.value, c, true);
  const saved = saveStore(next);
  storeSig.value = saved ?? next;
  // ES-30: the store keeps the active conversation; if it still could not fit, say so once.
  if (saved && !saved.conversations.some(x => x.id === c.id) && !warnedMissing) { warnedMissing = true; showToast('This conversation is too long to save. Start a new one.'); }
  activeConversation.value = c;
}
let warnedMissing = false;

/** A loop that is no longer the active one (a new conversation or a reset started mid-turn) only saves quietly. */
function persistQuietly(c: Conversation): void {
  const next = upsertConversation(storeSig.value, c, false);
  storeSig.value = saveStore(next) ?? next;
}

let retryTimer: ReturnType<typeof setTimeout> | null = null;
export function checkOnline(): void {
  if (devMode()) { online.value = true; return; }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) { online.value = false; return; }
  // ES-08: inside the back-off, check again when it ends rather than never.
  if (Date.now() < offlineUntil) {
    if (!retryTimer) retryTimer = setTimeout(() => { retryTimer = null; checkOnline(); }, offlineUntil - Date.now() + 50);
    return;
  }
  void checkHealth(proxyUrlOf(state.value.escobar.proxyUrl)).then(r => {
    online.value = r.ok;
    if (!r.ok) offlineUntil = Date.now() + 60_000;
  });
}
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('online', () => { offlineUntil = 0; checkOnline(); });
}

function applyEffect(e: MemoryEffect): void {
  if (e.type === 'remember') {
    update(s => {
      let memory = [...s.escobar.memory];
      // ES-31: make room by dropping the oldest item that is not an injury, equipment or an agreement.
      while (memory.length >= MAX_MEMORY_ITEMS) {
        const i = memory.findIndex(m => !PROTECTED_MEMORY.has(m.kind));
        if (i < 0) return s;
        memory.splice(i, 1);
      }
      memory = [...memory, e.item];
      return { ...s, escobar: { ...s.escobar, memory } };
    });
    showToast(`Escobar will remember: ${e.item.text}`, 'Undo', () => update(s => ({ ...s, escobar: { ...s.escobar, memory: s.escobar.memory.filter(m => m.id !== e.item.id) } })));
  } else if (e.type === 'forget') {
    const gone: MemoryItem | undefined = state.value.escobar.memory.find(m => m.id === e.id);
    update(s => ({ ...s, escobar: { ...s.escobar, memory: s.escobar.memory.filter(m => m.id !== e.id) } }));
    if (gone) showToast('Forgotten', 'Undo', () => update(s => ({ ...s, escobar: { ...s.escobar, memory: [...s.escobar.memory, gone] } })));
  } else if (e.type === 'snooze') {
    const before = state.value.insightFeedback;
    saveInsightFeedback(e.insightId, e.verdict);
    showToast(e.verdict === 'snoozed' ? 'Snoozed for 7 days' : 'Marked helpful', 'Undo', () => update(s => ({ ...s, insightFeedback: before })));
  }
}

function recordUsage(u: { turns: number; inputTokens: number; outputTokens: number; cacheReadTokens: number }): void {
  const day = todayKey();
  update(s => {
    const cur = s.escobar.usage.day === day ? s.escobar.usage : { day, turns: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0 };
    return { ...s, escobar: { ...s.escobar, usage: { day, turns: cur.turns + u.turns, inputTokens: cur.inputTokens + u.inputTokens, outputTokens: cur.outputTokens + u.outputTokens, cacheReadTokens: cur.cacheReadTokens + u.cacheReadTokens } } };
  });
}

async function getLoop(mode: EscobarMode): Promise<EscobarLoop> {
  loadConversations();
  const t = await getTransport();
  let conv = activeConversation.value;
  if (!conv) { conv = newConversation(APP_VERSION, mode === 'plan' ? 'plan' : mode === 'live' ? 'live' : 'chat'); persist(conv); }
  if (loop && loop.conversation.id === conv.id) return loop;
  const born = epoch;
  // ES-06: each loop's callbacks touch the shared signals only while it is the active loop.
  const mine = (): boolean => loop === created;
  const created: EscobarLoop = new EscobarLoop(conv, {
    transport: t,
    getState: (): AppState => state.value,
    now: () => Date.now(),
    appVersion: APP_VERSION,
    manifest: () => MANIFEST,
    focus: () => currentFocus.value,
    online: () => (typeof navigator === 'undefined' || navigator.onLine !== false) && !(online.value === false && Date.now() < offlineUntil),
    imageData,
    imagesSent: evictImages,
    applyEffect,
    recordUsage,
    persist: c => { if (born !== epoch) return; if (mine()) persist(c); else persistQuietly(c); },
    onUpdate: v => { if (mine()) loopView.value = v; },
    onSafety: s => { if (mine() && !safetyCards.value.includes(s)) safetyCards.value = [...safetyCards.value, s]; },
  });
  loop = created;
  return created;
}

export async function send(input: SendInput): Promise<TurnResult> {
  // ES-10: one turn at a time; the text waits in the composer.
  if (loop?.busy) {
    escobarUi.value = { ...escobarUi.value, draft: input.text };
    return { outcome: 'error', error: { code: 'invalid', message: 'Escobar is still answering.' }, outcomes: [], signals: [] };
  }
  const mode = modeFor(input.text);
  // First feedback within 150 ms (§21): show the message and "Thinking…" before any await.
  lastTurn.value = null;
  pendingUser.value = { input, at: activeConversation.value?.messages.length ?? 0 };
  loopView.value = { status: 'thinking', text: '', preamble: [], activity: [], outcomes: [] };
  const l = await getLoop(mode);
  const sentIn = epoch;
  if (!activeConversation.value?.messages.length) pendingUser.value = { input, at: 0 };
  const r = await l.send(input, mode);
  if (sentIn !== epoch || loop !== l) return r;
  if (r.outcome === 'done' || r.outcome === 'refusal' || r.outcome === 'step_limit' || r.outcome === 'cut_off') online.value = true;
  pendingUser.value = null;
  if (loopView.value.status !== 'idle') loopView.value = { ...loopView.value, status: 'idle' };
  lastTurn.value = { ...r, input };
  activeConversation.value = l.conversation;
  if (r.error?.code === 'network') { online.value = false; offlineUntil = Date.now() + 60_000; }
  if (r.error?.code === 'quota' && r.error.retryAfter) quotaResetAt.value = Date.now() + r.error.retryAfter * 1000;
  // An auto navigation (§7.2) happens once the answer has landed, with the sheet at half height.
  const nav = r.outcomes.find(o => o.navigate?.auto)?.navigate;
  if (nav && r.outcome === 'done') {
    escobarToHalf();
    const { goTo } = await import('./palace/navigate');
    const { PALACE_BY_ID } = await import('./palace/registry');
    const e = PALACE_BY_ID[nav.target];
    if (e) void goTo(e.target, nav.params);
  }
  return r;
}

export function stop(): void { loop?.stop(); }
export function background(): void { loop?.background(); }

/** Called when the sheet mounts: load the conversation store and check the Worker. */
export function prepare(): void {
  loadConversations();
  if (state.value.escobar.enabled) checkOnline();
}
export function escobarToHalf(): void { escobarUi.value = { ...escobarUi.value, detent: 'half' }; }

/** Settings or the first-run explainer: turning the online coach on is explicit (§20). */
export function setEscobarEnabled(on: boolean, sharing?: { health: boolean; body: boolean }): void {
  update(s => ({ ...s, escobar: { ...s.escobar, enabled: on, ...(sharing ? { sharing } : {}) } }));
  if (on) { importLegacyThread(); ensureDeviceId(); offlineUntil = 0; checkOnline(); }
}

/** RG-03: on first enable, the old coach chat becomes "Earlier conversation" (once). */
function importLegacyThread(): void {
  const s = state.value;
  const askThread = (s as unknown as { coach?: { askThread?: unknown } }).coach?.askThread;
  if (s.escobar.legacyImported || !Array.isArray(askThread)) return;
  loadConversations();
  const c = legacyConversation(askThread, APP_VERSION);
  if (c) {
    const next = upsertConversation(storeSig.value, c, false);
    storeSig.value = saveStore(next) ?? next;
  }
  update(x => ({ ...x, escobar: { ...x.escobar, legacyImported: true } }));
}

export function closeEscobar(): void { escobarUi.value = { ...escobarUi.value, open: false, contextRef: null }; }

export function startNewConversation(): void {
  loadConversations();
  dropLoop();
  const c = newConversation(APP_VERSION, escobarUi.value.mode === 'plan' ? 'plan' : 'chat');
  persist(c);
}

export function selectConversation(id: string): void {
  loadConversations();
  const c = storeSig.value.conversations.find(x => x.id === id);
  if (!c) return;
  dropLoop();
  const next = { ...storeSig.value, activeId: id };
  storeSig.value = saveStore(next) ?? next;
  activeConversation.value = c;
}

/**
 * ES-17: plan mode sticks once a conversation is about a programme; a chat turns into one when
 * the person asks for a programme; live wins while a session runs.
 */
function modeFor(text: string): EscobarMode {
  const ui = escobarUi.value.mode;
  if (state.value.active && ui === 'live') return 'live';
  if (activeConversation.value?.mode === 'plan') return 'plan';
  if (ui === 'chat' && isPlanRequest(text)) {
    const c = activeConversation.value;
    // QA-R4a-2: through updateConversation, so the running loop's own copy is plan too and its next save keeps it.
    if (c) updateConversation({ ...c, mode: 'plan' });
    return 'plan';
  }
  return ui;
}

/** Settings → Reset conversations. */
export function resetConversations(): void {
  dropLoop();
  epoch++;
  storeSig.value = saveStore(emptyStore()) ?? emptyStore();
  activeConversation.value = null;
}

/** Replace the active conversation after a proposal decision (apply.ts). */
export function updateConversation(c: Conversation): void {
  if (loop && loop.conversation.id === c.id) loop.conversation = c;
  persist(c);
}

// Stop mid-stream when the app goes to the background (§13).
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') background(); });

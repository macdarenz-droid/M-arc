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
import { emptyStore, loadStore, memoryStorage, newConversation, onStoreReplaced, saveStore, setEscobarStorage, upsertConversation } from './store';
import { imageData } from './images';
import { escobarUi, loopView, online, proxyUrlOf, quotaResetAt } from './state';
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

// Reset or restore replaced the store underneath us: drop the loop and everything cached.
onStoreReplaced(() => {
  loop?.stop();
  loop = null;
  epoch++;
  loaded = false;
  lastTurn.value = null;
  safetyCards.value = [];
  pendingUser.value = null;
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
  storeSig.value = saveStore(next) ?? next;
  activeConversation.value = c;
}

export function checkOnline(): void {
  if (devMode()) { online.value = true; return; }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) { online.value = false; return; }
  if (Date.now() < offlineUntil) return;
  void checkHealth(proxyUrlOf(state.value.escobar.proxyUrl)).then(r => {
    online.value = r.ok;
    if (!r.ok) offlineUntil = Date.now() + 60_000;
  });
}

function applyEffect(e: MemoryEffect): void {
  if (e.type === 'remember') {
    update(s => ({ ...s, escobar: { ...s.escobar, memory: [...s.escobar.memory, e.item].slice(-MAX_MEMORY_ITEMS) } }));
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
  loop = new EscobarLoop(conv, {
    transport: t,
    getState: (): AppState => state.value,
    now: () => Date.now(),
    appVersion: APP_VERSION,
    manifest: () => MANIFEST,
    focus: () => currentFocus.value,
    online: () => online.value !== false && (typeof navigator === 'undefined' || navigator.onLine !== false),
    imageData,
    applyEffect,
    recordUsage,
    persist: c => { if (born === epoch) persist(c); },
    onUpdate: v => { loopView.value = v; },
    onSafety: s => { if (!safetyCards.value.includes(s)) safetyCards.value = [...safetyCards.value, s]; },
  });
  return loop;
}

export async function send(input: SendInput): Promise<TurnResult> {
  const mode = escobarUi.value.mode;
  // First feedback within 150 ms (§21): show the message and "Thinking…" before any await.
  lastTurn.value = null;
  pendingUser.value = { input, at: activeConversation.value?.messages.length ?? 0 };
  loopView.value = { status: 'thinking', text: '', preamble: [], activity: [], outcomes: [] };
  const l = await getLoop(mode);
  const sentIn = epoch;
  if (!activeConversation.value?.messages.length) pendingUser.value = { input, at: 0 };
  const r = await l.send(input, mode);
  if (sentIn !== epoch) return r;
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
  if (on) { ensureDeviceId(); offlineUntil = 0; checkOnline(); }
}

export function closeEscobar(): void { escobarUi.value = { ...escobarUi.value, open: false, contextRef: null }; }

export function startNewConversation(): void {
  loadConversations();
  loop?.stop();
  loop = null;
  const c = newConversation(APP_VERSION, escobarUi.value.mode === 'plan' ? 'plan' : 'chat');
  persist(c);
  lastTurn.value = null;
  safetyCards.value = [];
  loopView.value = { status: 'idle', text: '', preamble: [], activity: [], outcomes: [] };
}

export function selectConversation(id: string): void {
  loadConversations();
  const c = storeSig.value.conversations.find(x => x.id === id);
  if (!c) return;
  loop?.stop();
  loop = null;
  const next = { ...storeSig.value, activeId: id };
  storeSig.value = saveStore(next) ?? next;
  activeConversation.value = c;
  lastTurn.value = null;
  safetyCards.value = [];
}

/** Settings → Reset conversations. */
export function resetConversations(): void {
  loop?.stop();
  loop = null;
  storeSig.value = saveStore(emptyStore()) ?? emptyStore();
  activeConversation.value = null;
  lastTurn.value = null;
}

/** Replace the active conversation after a proposal decision (apply.ts). */
export function updateConversation(c: Conversation): void {
  if (loop && loop.conversation.id === c.id) loop.conversation = c;
  persist(c);
}

// Stop mid-stream when the app goes to the background (§13).
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') background(); });

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * P03 (docs/escobar-presence): AskSheet.send() used to trust its caller —
 * Coach.tsx and Train.tsx both only mount <AskSheet> behind a
 * `remoteEnabled.value` check, so the sheet itself never verified anything.
 * The architecture doc calls this out explicitly (§4, "Critical"): if the
 * setting flips off while a sheet is already open, or a stale click slips
 * past a disabled control, the parent's mount-time check can't catch it —
 * only a check inside the handler itself, read fresh at call time, can.
 *
 * These are source-check tests, not behavioral ones: AskSheet is a
 * hooks-heavy component with no existing DOM-rendering test harness in this
 * repo (see tests/ai-ask.test.ts and ask-scenarios.test.ts, both deterministic
 * against buildAskPayload/validateText rather than the component). Full
 * browser coverage of the flip-mid-open-sheet race is deferred to the
 * broader shared-controller P03 patch, where a real multi-mount scenario
 * exists to drive it from — recorded honestly here, not silently skipped.
 */
describe('AskSheet: remote-enabled guard lives inside send(), not just the caller', () => {
  const source = readFileSync(new URL('../src/slices/coach/AskSheet.tsx', import.meta.url), 'utf8');

  it('imports remoteEnabled and checks it fresh at the top of send(), before building any payload', () => {
    expect(source).toContain("import { ensureDeviceId, remoteEnabled } from './remote';");
    const sendStart = source.indexOf('const send = async () => {');
    const payloadCall = source.indexOf('buildAskPayload(', sendStart);
    const guardCall = source.indexOf('if (!remoteEnabled.value)', sendStart);
    expect(sendStart).toBeGreaterThan(-1);
    expect(guardCall).toBeGreaterThan(sendStart);
    expect(payloadCall).toBeGreaterThan(guardCall);
  });

  it('the composer itself is replaced by a static message when remote is off, not just left enabled and hoping send() catches it', () => {
    expect(source).toContain('!remoteEnabled.value');
    expect(source).toContain('Online coach is off');
    // Both branches (savedOnly and remote-off) hide the real <ChatInputRow>; only one
    // ChatInputRow render call should exist, gated behind both being false.
    expect(source.match(/<ChatInputRow\b/g)).toHaveLength(1);
  });

  it('savedOnly review (offline draft actions) is unaffected — the guard only gates the composer/send path', () => {
    // SplitDraftAction/ScheduleDraftAction/GoalChangeAction apply local state only; none
    // of them reference remoteEnabled, so they keep working regardless of the setting.
    const actionsSection = source.slice(source.indexOf('function SplitDraftAction'), source.indexOf('export function AskSheet'));
    expect(actionsSection).not.toContain('remoteEnabled');
  });
});

/**
 * P03: a reply that arrives after its conversation was cleared/reset/restored
 * must be dropped, not appended to a now-different thread (01-ARCHITECTURE.md
 * §4: "stale success/error/finally cannot alter newer state"). askMemory.ts's
 * `askRequestGeneration`/`invalidateAskRequests` are tested behaviorally in
 * tests/coach-ask-memory.test.ts; these source checks confirm every call site
 * that should bump the generation actually does, and that send() captures and
 * re-checks it around (not just before) the network call.
 */
describe('AskSheet.send(): captures the request generation and drops a stale reply', () => {
  const source = readFileSync(new URL('../src/slices/coach/AskSheet.tsx', import.meta.url), 'utf8');

  it('captures askRequestGeneration before the network call and checks it again after, before touching state', () => {
    expect(source).toContain("import { appendAskTurn, askRequestGeneration, clearAskThread, invalidateAskRequests, mergeStatedConstraints, updateAskTurn } from './askMemory';");
    const sendStart = source.indexOf('const send = async () => {');
    const captureIdx = source.indexOf('const myGeneration = askRequestGeneration.value;', sendStart);
    const awaitIdx = source.indexOf('await requestAskAnswer(', sendStart);
    const checkIdx = source.indexOf('if (askRequestGeneration.value !== myGeneration) return;', sendStart);
    const appendIdx = source.indexOf('appendAskTurn(st.coach, { role: \'assistant\'', sendStart);
    expect(captureIdx).toBeGreaterThan(sendStart);
    expect(awaitIdx).toBeGreaterThan(captureIdx);
    expect(checkIdx).toBeGreaterThan(awaitIdx);
    expect(appendIdx).toBeGreaterThan(checkIdx);
  });

  it('"Clear conversation" bumps the generation before clearing the thread', () => {
    expect(source).toContain("onClick={() => { invalidateAskRequests(); resetAskTransient(); update(st => ({ ...st, coach: clearAskThread(st.coach) })); flushSave(); }}");
  });
});

/**
 * P03.5 (docs/escobar-presence §4's "context by IDs, visible editable
 * prefill", regression A06): InsightSheet/SuggestionSheet's "Ask about this"
 * seeds AskSheet's composer with a starting question, fully visible and
 * editable, never sent automatically. Owned by askController so closing or
 * deferring the modal cannot lose it, and clamped to MAX_QUESTION_CHARS so a future long prefill can't
 * silently exceed the same limit the composer itself enforces on typing.
 */
describe('AskSheet: uses the controller-owned draft without auto-sending it', () => {
  const source = readFileSync(new URL('../src/slices/coach/AskSheet.tsx', import.meta.url), 'utf8');

  it('reads and writes the shared bounded draft instead of component-local state', () => {
    expect(source).toContain("import { askDraft, askError, askSending, resetAskTransient } from './askController';");
    expect(source).toContain('const question = askDraft.value;');
    expect(source).toContain('askDraft.value = value.slice(0, MAX_QUESTION_CHARS);');
    expect(source).not.toContain('initialQuestion?: string');
  });

  it('never calls send() or any submit path as part of accepting a prefill — the composer is seeded, not triggered', () => {
    const propsToSeed = source.slice(source.indexOf('export function AskSheet'), source.indexOf('const send = async'));
    expect(propsToSeed).not.toContain('send(');
    expect(propsToSeed).not.toContain('void send');
  });
});

describe('Coach.tsx: InsightSheet/SuggestionSheet "Ask about this" closes the detail sheet before opening Ask', () => {
  const source = readFileSync(new URL('../src/slices/coach/Coach.tsx', import.meta.url), 'utf8');

  it('both call onClose() before openAskWithQuestion(...), not after', () => {
    for (const call of [
      'onClick={() => { onClose(); openAskWithQuestion(`About "${insight.title}": `); }}',
      'onClick={() => { onClose(); openAskWithQuestion(`About "${sg.title}": `); }}',
    ]) expect(source).toContain(call);
  });
});

describe('Settings: every reset/restore that changes what a stale Ask reply could land on bumps the generation first', () => {
  // Git may materialize CRLF on Windows; source-structure assertions should
  // care about statement order, not the checkout's newline convention.
  const source = readFileSync(new URL('../src/slices/settings/Settings.tsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

  it('imports invalidateAskRequests', () => {
    expect(source).toContain("import { clearAskMemory, invalidateAskRequests } from '../coach/askMemory';");
  });

  it('"Ask Escobar" reset, legacy restore, normal restore and "Reset everything" all call it immediately before their replaceState/clearAskMemory call', () => {
    // The normal-restore site replaces `...withHeartRate` rather than `...next`:
    // a restore may carry heart-rate traces, which are validated and written to
    // the native store before the app state is published. The invariant under
    // test is unchanged — nothing at all sits between the generation bump and
    // the replaceState it guards.
    const callSites = [
      'invalidateAskRequests(); resetAskTransient(); update(x => ({ ...x, coach: clearAskMemory(x.coach) }));',
      'invalidateAskRequests(); resetAskTransient();\n        replaceState(converted);',
      'invalidateAskRequests(); resetAskTransient();\n      replaceState({ ...withHeartRate, health: { connected: false } });',
      'invalidateAskRequests(); resetAskTransient(); replaceState(freshState());',
    ];
    for (const site of callSites) expect(source).toContain(site);
    // Exactly four invalidation calls — one per state-replacing/clearing site, no more, no fewer.
    expect(source.match(/invalidateAskRequests\(\)/g)).toHaveLength(4);
  });
});

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

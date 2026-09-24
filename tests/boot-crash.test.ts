import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

// Exercise the real pre-bundle handler: importing main would miss early crashes entirely.
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]!).find(s => s.includes('__marcCrash'))!;
function bootCrash(native: boolean, marker: string | null, oldResetHook?: () => boolean, readFails = false) {
  const clicks = new Map<string, () => void>();
  const box = { style: {}, innerHTML: '', querySelector: (selector: string) => ({
    textContent: '', addEventListener: (_: string, cb: () => void) => clicks.set(selector, cb),
  }) };
  const clear = vi.fn(), reload = vi.fn(), confirm = vi.fn(() => true), alert = vi.fn();
  const context = {
    window: { __marcCanResetWorkoutData: oldResetHook, Capacitor: { isNativePlatform: () => native }, addEventListener: vi.fn() },
    document: { getElementById: () => ({ getAttribute: () => null, setAttribute: vi.fn(), appendChild: vi.fn() }), createElement: () => box },
    localStorage: { getItem: () => { if (readFails) throw new Error('Storage denied'); return marker; }, clear },
    location: { reload }, confirm, alert,
  };
  runInNewContext(script, context);
  const win = context.window as typeof context.window & { __marcCrash(err: Error): void };
  win.__marcCrash(new Error('crash before first render'));
  expect(box.innerHTML).toContain('Reset app data and reload');
  clicks.get('[data-reset]')!();
  return { clear, reload, confirm, alert };
}

describe('early crash-screen reset', () => {
  it.each([false, true])('works before module boot on native=%s, without a handover marker', native => {
    for (const oldHook of [undefined, () => false]) {
      const result = bootCrash(native, null, oldHook);
      expect(result.confirm).toHaveBeenCalledOnce();
      expect(result.clear).toHaveBeenCalledOnce();
      expect(result.reload).toHaveBeenCalledOnce();
      expect(result.alert).not.toHaveBeenCalled();
    }
  });
  it.each([false, true])('preserves a handover marker even when boot crashes on native=%s', native => {
    for (const marker of ['{"version":1,"phase":"prepared"}', '{damaged marker']) {
      const result = bootCrash(native, marker);
      expect(result.confirm).not.toHaveBeenCalled();
      expect(result.clear).not.toHaveBeenCalled();
      expect(result.reload).not.toHaveBeenCalled();
      expect(result.alert).toHaveBeenCalledOnce();
    }
  });
  it('does not trap web users when storage reads are denied', () => {
    const result = bootCrash(false, null, undefined, true);
    expect(result.confirm).toHaveBeenCalledOnce();
    expect(result.clear).toHaveBeenCalledOnce();
    expect(result.reload).toHaveBeenCalledOnce();
  });
});

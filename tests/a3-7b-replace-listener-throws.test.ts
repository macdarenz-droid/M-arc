/** A3-7b D-A3-7b-3: a throwing replace listener never aborts a replace or the other listeners (the onboarding hold still clears). */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// The clock is pinned before any import (A3-7's date-bomb lesson); `window` drives the other-tab listener.
const T = vi.hoisted(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 3, 10, 0));
  vi.stubGlobal('window', new EventTarget());
  return { throwing: false };
});

const { initStore, onReplace, replaceState, resetState, state, STATE_KEY } = await import('@/core/store');
// Registered before selectors loads, so it runs ahead of the hold's clear.
onReplace(() => { if (T.throwing) throw new Error('listener blew up'); });
const { freshState } = await import('@/core/models');
const { heldOnboardingTrigger } = await import('@/app/selectors');

const memory = () => { const map = new Map<string, string>(); return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); }, clear: () => map.clear(), key: () => null, length: 0 } as unknown as Storage; };
const profiled = () => { const f = freshState(); return { ...f, profile: { ...f.profile, bodyWeightKg: 80, heightCm: 180, birthYear: 1995, sex: 'male' as const } }; };

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  T.throwing = false;
  initStore(memory());
  replaceState(profiled());
  heldOnboardingTrigger.value = 'review';
  T.throwing = true;
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => { T.throwing = false; warn.mockRestore(); });

describe('D-A3-7b-3: a throwing replace listener', () => {
  it('Reset still completes and the hold still clears', () => {
    expect(() => resetState(freshState())).not.toThrow();
    expect(state.value.profile.bodyWeightKg).toBeUndefined();
    expect(heldOnboardingTrigger.value).toBeNull();
    expect(warn).toHaveBeenCalled();
  });

  it("another tab's incoming state still lands and the hold still clears", () => {
    const incoming = { ...profiled(), profile: { ...profiled().profile, bodyWeightKg: 91 } };
    expect(() => window.dispatchEvent(Object.assign(new Event('storage'), { key: STATE_KEY, newValue: JSON.stringify(incoming) }))).not.toThrow();
    expect(state.value.profile.bodyWeightKg).toBe(91);
    expect(heldOnboardingTrigger.value).toBeNull();
  });
});

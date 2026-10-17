/** A3-7b: the onboarding hold covers "Update" (review), and every state replace (Reset, Restore, another tab) drops it. */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VNode } from 'preact';

// The clock is pinned before any import, so no module reads the real day (A3-7's date-bomb lesson).
// `window` is an event target, so the store's other-tab listener can be driven.
const H = vi.hoisted(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 3, 10, 0));
  vi.stubGlobal('window', new EventTarget());
  return { slots: [] as unknown[], i: 0 };
});
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const k = H.i++;
    const slots = H.slots;
    if (!(k in slots)) slots[k] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [slots[k], (v: unknown) => { slots[k] = typeof v === 'function' ? (v as (x: unknown) => unknown)(slots[k]) : v; }];
  },
  useEffect: () => {}, useLayoutEffect: () => {}, useRef: (v: unknown) => ({ current: v }), useMemo: (f: () => unknown) => f(), useCallback: (f: unknown) => f,
}));
vi.mock('@/escobar/palace/focus', () => ({ usePalaceFocus: () => {} }));
vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

const { initStore, replaceState, resetState, state, STATE_KEY } = await import('@/core/store');
const { freshState } = await import('@/core/models');
const { App } = await import('@/app/App');
const { heldOnboardingTrigger, onboardingTrigger } = await import('@/app/selectors');
const { OnboardingSheet } = await import('@/slices/profile/Onboarding');
const { launchOverlayGone } = await import('@/app/launch');
const { Button, CommitNumber } = await import('@/ui/primitives');
type AppState = ReturnType<typeof freshState>;

function render<T>(slots: unknown[], fn: () => T): T { H.slots = slots; H.i = 0; return fn(); }
function find(node: unknown, pred: (v: VNode<Record<string, unknown>>) => boolean): VNode<Record<string, unknown>> | undefined {
  if (node == null || typeof node !== 'object') return undefined;
  if (Array.isArray(node)) { for (const c of node) { const f = find(c, pred); if (f) return f; } return undefined; }
  const v = node as VNode<Record<string, unknown>>;
  if (pred(v)) return v;
  return find(v.props?.children, pred);
}
const text = (n: unknown): string => n == null || typeof n === 'boolean' ? '' : typeof n === 'string' || typeof n === 'number' ? String(n) : Array.isArray(n) ? n.map(text).join('') : text((n as VNode<{ children?: unknown }>).props?.children);
const sheetInApp = () => find(render([], () => App()), v => v.type === OnboardingSheet);
const memory = () => { const map = new Map<string, string>(); return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); }, clear: () => map.clear(), key: () => null, length: 0 } as unknown as Storage; };

/** A complete profile; its last review is old (the review is due) or recent (nothing due). */
function profiled(lastReviewAt: string): AppState {
  const f = freshState();
  return { ...f, profile: { ...f.profile, bodyWeightKg: 80, heightCm: 180, birthYear: 1995, sex: 'male' }, onboarding: { ...f.onboarding, completedAt: '2026-01-01T09:00:00.000Z', lastReviewAt } };
}
const DUE = '2026-06-01T09:00:00.000Z';
const RECENT = '2026-10-01T09:00:00.000Z';

let storage: Storage;
beforeEach(() => {
  storage = memory();
  initStore(storage);
  replaceState(profiled(DUE));
  launchOverlayGone.value = true;
  heldOnboardingTrigger.value = null;
});

/** Opens the review sheet from the app and taps "Update"; returns the form and its props. */
function openReviewForm() {
  const appSheet = sheetInApp();
  expect(appSheet?.props.trigger).toBe('review');
  const props = appSheet!.props as unknown as Parameters<typeof OnboardingSheet>[0];
  const sheetSlots: unknown[] = [];
  const intro = render(sheetSlots, () => OnboardingSheet(props));
  expect(text(intro)).toContain('Still');
  (find(intro, v => v.type === Button && text(v.props.children) === 'Update')!.props.onClick as () => void)();
  return render(sheetSlots, () => OnboardingSheet(props)) as VNode<Record<string, unknown>>;
}

/** The review intro must not show over the replaced profile. */
function noReviewIntro() {
  expect(heldOnboardingTrigger.value).toBeNull();
  expect(onboardingTrigger.value).not.toBe('review');
  const appSheet = sheetInApp();
  if (appSheet) {
    const intro = render([], () => OnboardingSheet(appSheet.props as unknown as Parameters<typeof OnboardingSheet>[0]));
    expect(text(intro)).not.toContain('Still');
  }
}

describe('A3-7b: the hold on "Update" (review)', () => {
  it('case 5: Update holds the review form; clearing height mid-form keeps it, and Save stores the new weight', () => {
    const formVNode = openReviewForm();
    expect(heldOnboardingTrigger.value).toBe('review');
    const Form = formVNode.type as (p: unknown) => VNode;
    const formSlots: unknown[] = [];
    let form = render(formSlots, () => Form(formVNode.props));
    (find(form, v => v.type === 'input' && v.props.inputMode === 'decimal')!.props.onInput as (e: unknown) => void)({ target: { value: '82' } });
    // Emptying height makes the profile incomplete: without the hold the app would drop the sheet here.
    form = render(formSlots, () => Form(formVNode.props));
    (find(form, v => v.type === CommitNumber && v.props.max === 250)!.props.onCommit as (v: number | undefined) => void)(undefined);
    expect(state.value.profile.heightCm).toBeUndefined();
    expect(sheetInApp()?.props.trigger).toBe('review');
    form = render(formSlots, () => Form(formVNode.props));
    (find(form, v => v.type === Button && text(v.props.children) === 'Save')!.props.onClick as () => void)();
    expect(state.value.profile.bodyWeightKg).toBe(82);
    expect(heldOnboardingTrigger.value).toBeNull();
  });
});

describe('A3-7b: a state replace drops the hold', () => {
  it('Reset everything drops a held review; the fresh profile gets no review intro', () => {
    openReviewForm();
    expect(heldOnboardingTrigger.value).toBe('review');
    resetState(freshState());
    noReviewIntro();
  });

  it('Restore drops a held review; the restored profile gets no review intro', () => {
    openReviewForm();
    expect(heldOnboardingTrigger.value).toBe('review');
    replaceState(profiled(RECENT));
    noReviewIntro();
    expect(sheetInApp()).toBeUndefined();
  });

  it("another tab's saved state drops a held review", () => {
    openReviewForm();
    expect(heldOnboardingTrigger.value).toBe('review');
    window.dispatchEvent(Object.assign(new Event('storage'), { key: STATE_KEY, newValue: JSON.stringify(profiled(RECENT)) }));
    expect(state.value.onboarding.lastReviewAt).toBe(RECENT);
    noReviewIntro();
    expect(sheetInApp()).toBeUndefined();
  });

  it('another tab clearing storage drops a held review', () => {
    openReviewForm();
    expect(heldOnboardingTrigger.value).toBe('review');
    storage.removeItem(STATE_KEY);
    window.dispatchEvent(Object.assign(new Event('storage'), { key: null, newValue: null }));
    expect(state.value.profile.bodyWeightKg).toBeUndefined();
    noReviewIntro();
  });
});

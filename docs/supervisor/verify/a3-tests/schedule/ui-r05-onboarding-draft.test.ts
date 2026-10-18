/** A3 verify UI-R05: filling the last missing profile field must not unmount the opened form and lose the weight draft. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VNode } from 'preact';

// A tiny hooks shim: each "component instance" gets its own slot array, so local state survives re-renders.
const H = vi.hoisted(() => ({ slots: [] as unknown[], i: 0 }));
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

const { replaceState, state } = await import('@/core/store');
const { freshState } = await import('@/core/models');
const { App } = await import('@/app/App');
const { OnboardingSheet } = await import('@/slices/profile/Onboarding');
const { launchOverlayGone } = await import('@/app/launch');
const { Button, Segmented } = await import('@/ui/primitives');

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

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 3, 10, 0));
  const f = freshState();
  replaceState({ ...f, profile: { ...f.profile, bodyWeightKg: 80, heightCm: 180, birthYear: 1995 } }); // sex missing
  launchOverlayGone.value = true;
});
afterEach(() => { vi.useRealTimers(); });

function flow() {
    const appSheet = sheetInApp();
    expect(appSheet?.props.trigger).toBe('first');
    const sheetSlots: unknown[] = [];
    const props = appSheet!.props as Parameters<typeof OnboardingSheet>[0];
    // Intro -> "Add my details"
    const intro = render(sheetSlots, () => OnboardingSheet(props));
    const add = find(intro, v => v.type === Button && text(v.props.children) === 'Add my details');
    (add!.props.onClick as () => void)();
    const formVNode = render(sheetSlots, () => OnboardingSheet(props)) as VNode<Record<string, unknown>>;
    const formSlots: unknown[] = [];
    const Form = formVNode.type as (p: unknown) => VNode;
    // Type 81 into the weight field (a local draft).
    let form = render(formSlots, () => Form(formVNode.props));
    (find(form, v => v.type === 'input' && v.props.inputMode === 'decimal')!.props.onInput as (e: unknown) => void)({ target: { value: '81' } });
    // Pick Female: the last missing field, saved immediately.
    form = render(formSlots, () => Form(formVNode.props));
    (find(form, v => v.type === Segmented)!.props.onChange as (v: string) => void)('female');
    expect(state.value.profile.sex).toBe('female');
    // App re-renders. The opened flow must still be mounted so Save is reachable.
    const still = sheetInApp();
    if (still) {
      form = render(formSlots, () => Form(formVNode.props));
      (find(form, v => v.type === Button && text(v.props.children) === 'Save')!.props.onClick as () => void)();
    }
    return !!still;
}

describe('UI-R05: the opened onboarding form survives the last field', () => {
  it('control: with height also missing, the same steps keep the sheet and Save stores 81 kg', () => {
    const f = freshState();
    replaceState({ ...f, profile: { ...f.profile, bodyWeightKg: 80, birthYear: 1995 } }); // sex + height missing
    expect(flow()).toBe(true);
    expect(state.value.profile.bodyWeightKg).toBe(81);
    expect(state.value.onboarding.completedAt).toBeDefined();
  });

  it('type 81 kg, pick Female (the last missing field), then Save: weight 81 is saved and completion recorded', () => {
    const still = flow();
    expect(state.value.profile.bodyWeightKg, `sheet still mounted after last field: ${still}; completedAt=${state.value.onboarding.completedAt}`).toBe(81);
    expect(state.value.onboarding.completedAt).toBeDefined();
  });
});

/** A3-6 UI-R06 (R8): Settings offers no Delete for the gym of a live workout. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VNode } from 'preact';

const H = vi.hoisted(() => ({ slots: [] as unknown[], i: 0 }));
vi.mock('preact/hooks', () => ({
  useState: (init: unknown) => {
    const k = H.i++;
    if (!(k in H.slots)) H.slots[k] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [H.slots[k], (v: unknown) => { H.slots[k] = typeof v === 'function' ? (v as (x: unknown) => unknown)(H.slots[k]) : v; }];
  },
  useEffect: () => {}, useLayoutEffect: () => {}, useRef: (v: unknown) => ({ current: v }), useMemo: (f: () => unknown) => f(), useCallback: (f: unknown) => f,
}));

const { replaceState, state } = await import('@/core/store');
const { freshState, newId } = await import('@/core/models');
const { addGym } = await import('@/slices/workout/units');
const { GymsSheet } = await import('@/slices/settings/Gyms');
const { Card } = await import('@/ui/primitives');

function all(node: unknown, pred: (v: VNode<Record<string, unknown>>) => boolean, out: VNode<Record<string, unknown>>[] = []): VNode<Record<string, unknown>>[] {
  if (node == null || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const c of node) all(c, pred, out); return out; }
  const v = node as VNode<Record<string, unknown>>;
  if (pred(v)) out.push(v);
  all(v.props?.children, pred, out);
  return out;
}
const text = (n: unknown): string => n == null || typeof n === 'boolean' ? '' : typeof n === 'string' || typeof n === 'number' ? String(n) : Array.isArray(n) ? n.map(text).join('') : text((n as VNode<{ children?: unknown }>).props?.children);
/** Each gym card's text, in gym order. */
const cards = () => { H.slots = []; H.i = 0; return all(GymsSheet({ onClose: () => {} }), v => v.type === Card).map(c => text(c.props.children)); };

beforeEach(() => { vi.useFakeTimers({ now: Date.parse('2026-10-01T12:00:00.000Z'), toFake: ['Date'] }); replaceState(freshState()); });
afterEach(() => { vi.useRealTimers(); });

describe('UI-R06: Gyms sheet', () => {
  it('hides Delete gym on the live gym and keeps it on the other', () => {
    const home = addGym('Home', 'lb')!;
    const other = state.value.units.gyms.find(g => g.id !== home)!.id;
    expect(cards().filter(t => t.includes('Delete gym')), 'premise: both gyms offer Delete with no live workout').toHaveLength(2);
    replaceState({ ...state.value, active: { id: newId('s'), splitId: 'split_push', startedAt: new Date().toISOString(), pausedMs: 0, entries: [], gymId: home } });
    const ids = state.value.units.gyms.map(g => g.id);
    const byGym = Object.fromEntries(cards().map((t, i) => [ids[i], t]));
    expect(byGym[home], 'live gym offers Delete').not.toContain('Delete gym');
    expect(byGym[other], 'other gym lost Delete').toContain('Delete gym');
  });
});

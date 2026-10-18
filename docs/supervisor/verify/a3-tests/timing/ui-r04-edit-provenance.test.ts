/** A3 verify UI-R04: a set corrected in the History editor gets 'edited' provenance (COACHING-PLAN.md:817). */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Minimal hook harness: SessionEditor uses only useState plus the palace focus hook.
const slots: unknown[] = [];
let cursor = 0;
vi.mock('preact/hooks', async orig => ({
  ...(await orig<typeof import('preact/hooks')>()),
  useState: (init: unknown) => {
    const k = cursor++;
    if (!(k in slots)) slots[k] = typeof init === 'function' ? (init as () => unknown)() : init;
    return [slots[k], (v: unknown) => { slots[k] = typeof v === 'function' ? (v as (p: unknown) => unknown)(slots[k]) : v; }];
  },
}));
vi.mock('@/escobar/palace/focus', () => ({ usePalaceFocus: () => undefined }));
vi.mock('@/app/toast', () => ({ showToast: vi.fn() }));

import { replaceState, state } from '@/core/store';
import { freshState, type LoggedSet, type Session } from '@/core/models';
import { SessionEditor } from '@/slices/history/History';
import { sessionAt } from '../../helpers';

type V = { type: unknown; props: Record<string, unknown> & { children?: unknown } };
function find(n: unknown, pred: (v: V) => boolean, out: V[] = []): V[] {
  if (Array.isArray(n)) { n.forEach(c => find(c, pred, out)); return out; }
  if (!n || typeof n !== 'object' || !('props' in (n as object))) return out;
  const v = n as V;
  if (pred(v)) out.push(v);
  find(v.props.children, pred, out);
  return out;
}
const text = (n: unknown): string => Array.isArray(n) ? n.map(text).join('') : typeof n === 'string' ? n : n && typeof n === 'object' && 'props' in (n as object) ? text((n as V).props.children) : '';

const BENCH = 'lib_barbell_bench_press';
const start = '2026-09-20T17:00:00.000Z';
const liveSet = (sec: number): LoggedSet => ({ id: `set_${sec}`, kg: 100, reps: 8, effort: 'ideal', fidelity: 'live', at: new Date(Date.parse(start) + sec * 1000).toISOString(), restSec: 150 });
let saved: Session;

beforeEach(() => {
  slots.length = 0;
  saved = sessionAt(start, '2026-09-20T18:00:00.000Z', [{ id: BENCH, name: 'Bench', sets: [liveSet(300), liveSet(480)] }]);
  replaceState({ ...freshState(), sessions: [saved] });
});

function editAndSave(edit: (tree: unknown) => void) {
  const render = () => { cursor = 0; return SessionEditor({ session: saved, onClose: () => undefined }); };
  edit(render());
  const save = find(render(), v => typeof v.props.onClick === 'function' && text(v.props.children) === 'Save changes');
  expect(save, 'precondition: one Save changes button').toHaveLength(1);
  (save[0]!.props.onClick as () => void)();
  return state.value.sessions[0]!;
}

describe('UI-R04: History corrections and timing provenance', () => {
  it('changing reps 8 -> 6 marks that set edited; the untouched set stays live', () => {
    const after = editAndSave(tree => {
      const reps = find(tree, v => v.type === 'input' && v.props['aria-label'] === 'Reps');
      expect(reps, 'precondition: two reps inputs').toHaveLength(2);
      (reps[0]!.props.onInput as (e: unknown) => void)({ target: { value: '6' } });
    });
    const [first, second] = after.exercises[0]!.sets;
    expect(first!.reps, 'precondition: the correction saved').toBe(6);
    expect(first!.fidelity, 'edited set provenance').toBe('edited');
    expect(second!.fidelity).toBe('live');
  });

  it('control: Save with no change keeps live provenance', () => {
    const after = editAndSave(() => undefined);
    expect(after.exercises[0]!.sets.map(s => s.fidelity)).toEqual(['live', 'live']);
  });
});

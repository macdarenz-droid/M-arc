import { describe, expect, it } from 'vitest';
import type { ComponentChildren, VNode } from 'preact';
import { PresenceLauncher } from '@/slices/coach/Presence';
import { dismissPresenceMoment, setPresenceTone } from '@/slices/coach/presence';
import { freshState } from '@/core/models';
import { initStore, state } from '@/core/store';
import type { CoachingMoment } from '@/brain/coach/moments';

function text(node: ComponentChildren): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(text).join('');
  return text((node as VNode).props.children);
}

function memStorage() {
  const store = new Map<string, string>();
  return { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) };
}

const moment: CoachingMoment = {
  id: 'insight:plateau:lib_barbell_bench_press', evidenceKey: 'abc',
  kind: 'insight', sourceIds: ['plateau:lib_barbell_bench_press'], priority: 210, reasonCodes: ['plateau'],
  cue: 'Bench press has plateaued', title: 'Bench press has plateaued', noticed: 'Flat for 4 weeks.', action: 'Try a small jump.',
};

describe('PresenceLauncher: the shared launcher, no duplicate copy', () => {
  it('with no moment, shows only a quiet ask-the-coach entry, not an empty cue card', () => {
    const rendered = PresenceLauncher({ moment: null, label: 'Escobar', onOpen: () => {} });
    const rendered_text = text(rendered);
    expect(rendered_text).toContain('Escobar');
    expect(rendered_text).not.toContain('plateau');
  });

  it('with a moment, shows its cue text, not the underlying title/noticed verbatim duplicated', () => {
    const rendered = PresenceLauncher({ moment, label: 'Escobar', onOpen: () => {} });
    expect(text(rendered)).toContain('Bench press has plateaued');
  });

  it('renders a dismiss control only when a handler is supplied', () => {
    const withDismiss = JSON.stringify(PresenceLauncher({ moment, label: 'Escobar', onOpen: () => {}, onDismiss: () => {} }));
    const withoutDismiss = JSON.stringify(PresenceLauncher({ moment, label: 'Escobar', onOpen: () => {} }));
    expect(withDismiss).toContain('Dismiss');
    expect(withoutDismiss).not.toContain('Dismiss');
  });
});

describe('dismissPresenceMoment / setPresenceTone: the only writers of coach.presence', () => {
  it('dismissing a moment appends one entry and defaults tone to steady the first time', () => {
    initStore(memStorage());
    state.value = freshState();
    expect(state.value.coach.presence).toBeUndefined();
    dismissPresenceMoment(moment);
    expect(state.value.coach.presence).toEqual({
      version: 1, tone: 'steady',
      dismissed: [{ id: moment.id, evidenceKey: moment.evidenceKey, dismissedAt: expect.any(String) }],
    });
  });

  it('setPresenceTone changes only the tone, preserving prior dismissals', () => {
    initStore(memStorage());
    state.value = freshState();
    dismissPresenceMoment(moment);
    setPresenceTone('direct');
    expect(state.value.coach.presence?.tone).toBe('direct');
    expect(state.value.coach.presence?.dismissed).toHaveLength(1);
  });

  it('dismissing twice keeps both entries, oldest first', () => {
    initStore(memStorage());
    state.value = freshState();
    const other: CoachingMoment = { ...moment, id: 'insight:other', evidenceKey: 'xyz' };
    dismissPresenceMoment(moment);
    dismissPresenceMoment(other);
    expect(state.value.coach.presence?.dismissed.map(d => d.id)).toEqual([moment.id, other.id]);
  });
});

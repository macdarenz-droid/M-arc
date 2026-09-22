import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { ComponentChildren, VNode } from 'preact';
import { PresenceLauncher } from '@/slices/coach/Presence';
import { dismissPresenceMoment, setPresenceTone } from '@/slices/coach/presenceState';
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

describe('PresenceLauncher: never single-line-truncates the cue (regression, see PROGRESS.md)', () => {
  it('does not use white-space: nowrap or text-overflow: ellipsis anywhere in its output', () => {
    const rendered = JSON.stringify(PresenceLauncher({ moment, label: 'Escobar', onOpen: () => {}, onDismiss: () => {} }));
    // Forcing this long, dynamic cue text onto one unbroken line — the classic
    // overflow:hidden + text-overflow:ellipsis + white-space:nowrap combo — lets
    // its intrinsic (pre-clip) width exceed the viewport in a cramped flex row.
    // Reproduced concretely: with this combo present, headless Chromium's
    // mobile+touch emulation decouples the layout viewport from the visual one,
    // and the bottom tab bar becomes unclickable elsewhere on the page (see
    // docs/escobar-presence/PROGRESS.md, the P02 Train entries). Multi-line
    // wrapping, contained by overflow:hidden + min-width:0 on every ancestor,
    // does not have that failure mode. Do not reintroduce nowrap/ellipsis here.
    expect(rendered).not.toContain('nowrap');
    expect(rendered).not.toContain('ellipsis');
  });
});

describe('Train (Splits/pre-workout header): the presence launcher sits in its own row, never cramped into the icon-button row', () => {
  const source = readFileSync(new URL('../src/slices/workout/Train.tsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

  it('is rendered outside .topbar, not squeezed alongside the Ask/Import/Split buttons', () => {
    const topbarStart = source.indexOf('<div class="topbar">');
    const topbarEnd = source.indexOf('</div>\n      </div>', topbarStart) + '</div>\n      </div>'.length;
    const topbarBlock = source.slice(topbarStart, topbarEnd);
    expect(topbarBlock).not.toContain('PresenceLauncher');
    const afterTopbar = source.slice(topbarEnd, topbarEnd + 1200);
    expect(afterTopbar).toContain('PresenceLauncher');
  });

  it('is gated on the online coach being off, the Ask button on it being on — mutually exclusive', () => {
    expect(source).toContain('{!remoteEnabled.value && moment && (');
    expect(source).toContain("{remoteEnabled.value && <Button variant=\"quiet\" size=\"sm\" onClick={openAsk} aria-label={`Ask ${COACH_NAME}`}>");
  });

  it('reuses the existing InsightSheet/SuggestionSheet rather than a new detail view', () => {
    expect(source).toContain("import { InsightSheet, SuggestionSheet } from '../coach/Coach';");
    expect(source.match(/<InsightSheet\b/g)).toHaveLength(1);
    expect(source.match(/<SuggestionSheet\b/g)).toHaveLength(1);
  });

  it('the live in-workout view (LiveSession) is untouched — no presence launcher inside it', () => {
    const liveSessionStart = source.indexOf('function LiveSession(');
    const liveSessionEnd = source.indexOf('\nfunction ', liveSessionStart + 1);
    const liveSessionBody = source.slice(liveSessionStart, liveSessionEnd === -1 ? undefined : liveSessionEnd);
    expect(liveSessionBody).not.toContain('PresenceLauncher');
  });
});

describe('History: the presence launcher sits in its own row too, and reuses the same detail sheets', () => {
  const source = readFileSync(new URL('../src/slices/history/History.tsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

  it('is rendered outside .topbar', () => {
    const topbarStart = source.indexOf('<div class="topbar">');
    const topbarEnd = source.indexOf('</div>', topbarStart) + '</div>'.length;
    const topbarBlock = source.slice(topbarStart, topbarEnd);
    expect(topbarBlock).not.toContain('PresenceLauncher');
    const afterTopbar = source.slice(topbarEnd, topbarEnd + 1200);
    expect(afterTopbar).toContain('PresenceLauncher');
  });

  it('reuses the existing InsightSheet/SuggestionSheet rather than a new detail view', () => {
    expect(source).toContain("import { InsightSheet, SuggestionSheet } from '@/slices/coach/Coach';");
    expect(source.match(/<InsightSheet\b/g)).toHaveLength(1);
    expect(source.match(/<SuggestionSheet\b/g)).toHaveLength(1);
  });

  it('is present for both the Log and Stats segments, not re-mounted per segment', () => {
    // The launcher sits in History()'s own return, above the seg==='log'/'stats' branch —
    // one mount point covers both, so switching segments can't duplicate or drop it.
    const historyFnStart = source.indexOf('export function History(');
    const logFnStart = source.indexOf('function Log(');
    const historyBody = source.slice(historyFnStart, logFnStart);
    expect(historyBody).toContain('PresenceLauncher');
    expect(historyBody).toContain("seg === 'log' ? <Log /> : <Stats />");
  });
});

describe('Body: the presence launcher sits in its own row too', () => {
  const source = readFileSync(new URL('../src/slices/body/Body.tsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

  it('is rendered outside .topbar', () => {
    const topbarStart = source.indexOf('<div class="topbar">');
    const topbarEnd = source.indexOf('</div>', topbarStart) + '</div>'.length;
    const topbarBlock = source.slice(topbarStart, topbarEnd);
    expect(topbarBlock).not.toContain('PresenceLauncher');
    const afterTopbar = source.slice(topbarEnd, topbarEnd + 500);
    expect(afterTopbar).toContain('PresenceLauncher');
  });

  it('reuses the existing InsightSheet/SuggestionSheet rather than a new detail view', () => {
    expect(source).toContain("import { InsightSheet, SuggestionSheet } from '@/slices/coach/Coach';");
    expect(source.match(/<InsightSheet\b/g)).toHaveLength(1);
    expect(source.match(/<SuggestionSheet\b/g)).toHaveLength(1);
  });
});

describe('Coach: deliberately exempt from the presence launcher', () => {
  it('never imports PresenceLauncher — its own list already contains the top moment by construction', () => {
    const source = readFileSync(new URL('../src/slices/coach/Coach.tsx', import.meta.url), 'utf8');
    expect(source).not.toContain("from '@/slices/coach/Presence'");
    expect(source).not.toMatch(/<PresenceLauncher\b/);
    // The reasoning is load-bearing, not just a comment: Coach must still read the
    // same suggestions/insights arrays the selector ranks over, or the "structurally
    // guaranteed" claim in that comment would stop being true.
    const selectorImport = source.split('\n').find(line => line.includes("from '@/app/selectors'")) ?? '';
    expect(selectorImport).toContain('insights');
    expect(selectorImport).toContain('suggestions');
    expect(selectorImport).toContain('sessionFeedback');
  });
});

describe('Settings: deliberately exempt from the presence launcher (a different reason than Coach)', () => {
  it('never imports PresenceLauncher — it has no report-derived content for a moment to be about', () => {
    const source = readFileSync(new URL('../src/slices/settings/Settings.tsx', import.meta.url), 'utf8');
    expect(source).not.toContain("from '@/slices/coach/Presence'");
    expect(source).not.toMatch(/<PresenceLauncher\b/);
    // Load-bearing: the reasoning depends on Settings never importing the
    // same report-derived selectors selectMoment ranks over. If a future
    // edit adds them, this fails and forces a re-read of the comment above
    // Settings(), not a silent stale claim. Checked against the import
    // statement, not the whole file, so this comment's own prose mentioning
    // those words by name doesn't trip the assertion.
    const importLine = source.split('\n').find(line => line.includes("from '@/app/selectors'")) ?? '';
    expect(importLine).not.toContain('insights');
    expect(importLine).not.toContain('suggestions');
    expect(importLine).not.toContain('presenceMoment');
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

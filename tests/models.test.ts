import { describe, it, expect } from 'vitest';
import { DEFAULT_PROXY_URL, emptyCoach, freshState, type AppState } from '@/core/models';
import { DISMISSAL_EVIDENCE_FINDING_KINDS, loadState, STATE_KEY } from '@/core/store';
import { FINDING_KINDS } from '@/brain/coach/contract';

describe('a fresh install, a data reset, and a new device all start from the same coach defaults', () => {
  it('the proxy URL is pre-filled with the real deployment, not left for the person to paste in again', () => {
    expect(emptyCoach().explainerUrl).toBe(DEFAULT_PROXY_URL);
    expect(DEFAULT_PROXY_URL.startsWith('https://')).toBe(true);
  });

  it('so turning the "Online coach" toggle on is the only action needed to enable every remote feature', () => {
    const coach = freshState().coach;
    expect(coach.remoteExplainer).toBe(false); // still off by default — a deliberate opt-in, not pre-enabled
    expect(coach.explainerUrl.trim().length).toBeGreaterThan(0); // but nothing left to fill in once they do flip it on
  });

  it('starts with an empty "Ask Escobar" thread and no stated constraints — nothing to persist before a first conversation', () => {
    expect(emptyCoach().askThread).toEqual([]);
    expect(emptyCoach().statedConstraints).toEqual([]);
  });
});

describe('the store validator tracks the finding contract', () => {
  it('accepts every kind the brain can actually emit', () => {
    // core/store.ts copies FINDING_KINDS rather than importing it, so the two
    // can drift apart in silence. A kind missing from the copy makes saved
    // dismissal evidence citing it vanish on reload, and with it the baseline
    // that decides whether a dismissed suggestion may come back.
    const missing = FINDING_KINDS.filter(kind => !DISMISSAL_EVIDENCE_FINDING_KINDS.includes(kind));
    expect(missing, 'add these to FINDING_KINDS in src/core/store.ts').toEqual([]);
  });

  it('claims no kind the brain cannot emit', () => {
    const extra = DISMISSAL_EVIDENCE_FINDING_KINDS.filter(kind => !(FINDING_KINDS as readonly string[]).includes(kind));
    expect(extra).toEqual([]);
  });

  it('keeps dismissal evidence that cites a near-miss finding across a reload', () => {
    const base = freshState();
    const saved: AppState = {
      ...base,
      coach: {
        ...base.coach,
        dismissalEvidence: {
          'load_next:lib_barbell_bench_press': {
            day: '2026-09-20', proposalFingerprint: 'fp', reopenedOnce: false,
            findings: [{ id: 'near_miss:lib_barbell_bench_press', kind: 'near_miss', severity: 1, confidence: 'medium', sessionIds: ['s_a'], sessionFingerprints: ['fp_a'] }],
          },
        },
      },
    };
    const m = new Map<string, string>([[STATE_KEY, JSON.stringify(saved)]]);
    const loaded = loadState({ getItem: (k: string) => m.get(k) ?? null, setItem: () => undefined, removeItem: () => undefined }).state;
    expect(Object.keys(loaded.coach.dismissalEvidence!)).toEqual(['load_next:lib_barbell_bench_press']);
  });
});

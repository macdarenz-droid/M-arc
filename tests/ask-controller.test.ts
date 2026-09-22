import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { askDraft, askError, askOpenState, askSending, closeAsk, openAsk, openAskSavedReview, openAskWithQuestion, resetAskTransient } from '@/slices/coach/askController';

describe('askController: the single open/closed source of truth for the shared Ask sheet', () => {
  it('starts closed', () => {
    closeAsk();
    expect(askOpenState.value).toEqual({ open: false, savedOnly: false });
  });

  it('openAsk opens a plain, non-savedOnly conversation with no initial turn key', () => {
    closeAsk();
    openAsk();
    expect(askOpenState.value).toEqual({ open: true, savedOnly: false });
  });

  it('openAskSavedReview opens savedOnly with the given key, or none for "review all"', () => {
    closeAsk();
    openAskSavedReview('turn-42');
    expect(askOpenState.value).toEqual({ open: true, savedOnly: true, initialTurnKey: 'turn-42' });
    closeAsk();
    openAskSavedReview();
    expect(askOpenState.value).toEqual({ open: true, savedOnly: true, initialTurnKey: undefined });
  });

  it('closeAsk always returns to the exact closed state, regardless of how it was opened', () => {
    openAskSavedReview('x');
    closeAsk();
    expect(askOpenState.value).toEqual({ open: false, savedOnly: false });
  });

  it('openAskWithQuestion opens a plain, non-savedOnly conversation with the given prefill', () => {
    closeAsk(); resetAskTransient();
    openAskWithQuestion('About "Volume is trending up": ');
    expect(askOpenState.value).toEqual({ open: true, savedOnly: false });
    expect(askDraft.value).toBe('About "Volume is trending up": ');
  });

  it('owns draft, request and error state across close/reopen until an explicit reset', () => {
    resetAskTransient(); openAsk();
    askDraft.value = 'unsent question'; askSending.value = true; askError.value = 'offline';
    closeAsk(); openAsk();
    expect({ draft: askDraft.value, sending: askSending.value, error: askError.value }).toEqual({ draft: 'unsent question', sending: true, error: 'offline' });
    resetAskTransient();
    expect({ draft: askDraft.value, sending: askSending.value, error: askError.value }).toEqual({ draft: '', sending: false, error: null });
  });
});

/**
 * P03: Coach.tsx and Train.tsx used to each mount their own <AskSheet>
 * behind local state — closing the sheet on one screen and reopening it
 * elsewhere (or even just switching tabs) unmounted the old instance and
 * discarded AskSheet's own typed-but-unsent question, in-flight send state
 * and error. Both now call the shared controller instead; a single
 * App.tsx-level mount (see the App.tsx checks below) is the only <AskSheet>
 * in the tree, so the instance survives navigation.
 */
describe('Coach.tsx and Train.tsx: no competing local AskSheet mounts', () => {
  const coach = readFileSync(new URL('../src/slices/coach/Coach.tsx', import.meta.url), 'utf8');
  const train = readFileSync(new URL('../src/slices/workout/Train.tsx', import.meta.url), 'utf8');

  it('neither imports or renders <AskSheet> directly anymore', () => {
    expect(coach).not.toContain("from './AskSheet'");
    expect(coach).not.toMatch(/<AskSheet\b/);
    expect(train).not.toContain("from '../coach/AskSheet'");
    expect(train).not.toMatch(/<AskSheet\b/);
  });

  it('Coach.tsx calls openAsk for the plain question button and openAskSavedReview for saved-item review', () => {
    expect(coach).toContain("import { openAsk, openAskSavedReview, openAskWithQuestion } from './askController';");
    expect(coach).toContain('onClick={openAsk}');
    expect(coach).toContain('onReview={item => openAskSavedReview(item?.key)}');
  });

  it('InsightSheet and SuggestionSheet each offer a contextual "Ask about this" that closes the detail sheet first', () => {
    expect(coach.match(/openAskWithQuestion\(/g)).toHaveLength(2);
    expect(coach).toContain('onClick={() => { onClose(); openAskWithQuestion(`About "${insight.title}": `); }}');
    expect(coach).toContain('onClick={() => { onClose(); openAskWithQuestion(`About "${sg.title}": `); }}');
  });

  it('Train.tsx routes the single presence launcher null state to openAsk', () => {
    expect(train).toContain("import { openAsk } from '../coach/askController';");
    expect(train).toContain('moment ? setMomentOpen(true) : openAsk()');
    expect(train).not.toContain('aria-label={`Ask ${COACH_NAME}`}');
  });
});

describe('App.tsx: the single shared AskSheet mount, deferred (not stacked) while Settings is open', () => {
  const source = readFileSync(new URL('../src/app/App.tsx', import.meta.url), 'utf8');

  it('mounts exactly one AskSheet, gated on askOpenState and NOT settingsOpen', () => {
    expect(source.match(/<AskSheet\b/g)).toHaveLength(1);
    expect(source).toContain('{askOpenState.value.open && !settingsOpen.value && (');
  });

  it('passes onClose={closeAsk} and forwards initialTurnKey/savedOnly while composer state stays in the controller', () => {
    expect(source).toContain('onClose={closeAsk}');
    expect(source).toContain('initialTurnKey={askOpenState.value.initialTurnKey}');
    expect(source).toContain('savedOnly={askOpenState.value.savedOnly}');
    expect(source).not.toContain('initialQuestion=');
  });
});

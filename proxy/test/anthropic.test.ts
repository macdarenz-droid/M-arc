import { describe, it, expect } from 'vitest';
import { ASK_WEB_SEARCH_ALLOWED_DOMAINS, DEFAULT_MODEL, exerciseIdSchemaFor, modelFor, modelsByRoute, stripFormattingLeak } from '../src/anthropic';
import { EXERCISE_IDS } from '../src/vocab';

describe('ask web search domain allowlist', () => {
  it('is a non-empty, deduplicated list of plain hostnames — no scheme, no path, no wildcard', () => {
    expect(ASK_WEB_SEARCH_ALLOWED_DOMAINS.length).toBeGreaterThan(0);
    expect(new Set(ASK_WEB_SEARCH_ALLOWED_DOMAINS).size).toBe(ASK_WEB_SEARCH_ALLOWED_DOMAINS.length);
    for (const domain of ASK_WEB_SEARCH_ALLOWED_DOMAINS) {
      expect(domain).not.toMatch(/^https?:\/\//);
      expect(domain).not.toMatch(/\/|\*/);
      expect(domain).toMatch(/^[a-z0-9.-]+\.[a-z]{2,}$/);
    }
  });

  it('sticks to research and public-health bodies, not general web content', () => {
    for (const trusted of ['nih.gov', 'cdc.gov', 'who.int']) expect(ASK_WEB_SEARCH_ALLOWED_DOMAINS).toContain(trusted);
  });
});

describe('stripFormattingLeak', () => {
  it('trims the exact live-observed leak: a trailing quote-then-brace copied from the response\'s own JSON shape', () => {
    expect(stripFormattingLeak('treat it as a solid starting point rather than an exact number."}')).toBe('treat it as a solid starting point rather than an exact number.');
  });

  it('leaves ordinary prose, including normal closing punctuation, untouched', () => {
    for (const normal of ['This is a full sentence.', 'Is this a question?', 'A parenthetical (like this one).', 'Ends in a normal word']) {
      expect(stripFormattingLeak(normal)).toBe(normal);
    }
  });

  it('also catches a bare trailing brace or bracket, or one preceded by trailing whitespace', () => {
    expect(stripFormattingLeak('some text}')).toBe('some text');
    expect(stripFormattingLeak('some text]')).toBe('some text');
    expect(stripFormattingLeak('some text"} \n')).toBe('some text');
  });

  it('does not touch a legitimate sentence that just happens to end in a quote or a unit mark — only an actual brace/bracket is a leak', () => {
    expect(stripFormattingLeak('this is sometimes called "muscle confusion"')).toBe('this is sometimes called "muscle confusion"');
    expect(stripFormattingLeak('bar height is about chest level, 45"')).toBe('bar height is about chest level, 45"');
  });
});

describe('exerciseIdSchemaFor — per-request splitDraft vocabulary', () => {
  it('accepts every shipped catalog id even with no custom exercises in play', () => {
    const schema = exerciseIdSchemaFor([]);
    expect(schema.safeParse(EXERCISE_IDS[0]).success).toBe(true);
    expect(schema.safeParse('not_a_real_id').success).toBe(false);
  });

  it('also accepts a custom exercise id this exact payload\'s own splits already contain — a "modify" splitDraft can otherwise never re-propose it, silently dropping a real exercise the person never asked to remove', () => {
    const schema = exerciseIdSchemaFor([{ exercises: [{ exerciseId: 'custom_1758312345_garage_press' }] }]);
    expect(schema.safeParse('custom_1758312345_garage_press').success).toBe(true);
    expect(schema.safeParse(EXERCISE_IDS[0]).success).toBe(true); // the shipped catalog is still allowed too
    expect(schema.safeParse('not_a_real_id').success).toBe(false); // still closed — an invented id is still rejected
  });

  it('a custom id from one split does not leak into unrelated requests — a fresh schema is built per request, not cached module-wide', () => {
    const withCustom = exerciseIdSchemaFor([{ exercises: [{ exerciseId: 'custom_only_in_this_request' }] }]);
    const withoutCustom = exerciseIdSchemaFor([]);
    expect(withCustom.safeParse('custom_only_in_this_request').success).toBe(true);
    expect(withoutCustom.safeParse('custom_only_in_this_request').success).toBe(false);
  });
});

describe('per-route model override', () => {
  it('falls back to DEFAULT_MODEL when nothing is set', () => {
    expect(modelFor({ ANTHROPIC_API_KEY: 'x' }, undefined)).toBe(DEFAULT_MODEL);
  });

  it('a route override wins over env.MODEL, which wins over DEFAULT_MODEL', () => {
    expect(modelFor({ ANTHROPIC_API_KEY: 'x', MODEL: 'claude-haiku-4-5' }, undefined)).toBe('claude-haiku-4-5');
    expect(modelFor({ ANTHROPIC_API_KEY: 'x', MODEL: 'claude-haiku-4-5' }, 'claude-opus-5')).toBe('claude-opus-5');
  });

  it('modelsByRoute reports one entry per real route, all defaulting to the same model until overridden', () => {
    const models = modelsByRoute({ ANTHROPIC_API_KEY: 'x' });
    expect(Object.keys(models).sort()).toEqual(['ask', 'explain', 'identifyExercise', 'importProgramme', 'notes', 'tagExercise'].sort());
    expect(Object.values(models).every(m => m === DEFAULT_MODEL)).toBe(true);
  });
});

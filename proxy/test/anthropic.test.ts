import { describe, it, expect } from 'vitest';
import { ASK_WEB_SEARCH_ALLOWED_DOMAINS, DEFAULT_MODEL, modelFor, modelsByRoute } from '../src/anthropic';

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

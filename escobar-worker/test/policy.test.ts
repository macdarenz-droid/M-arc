import { describe, it, expect } from 'vitest';
import { WORKER_POLICY } from '../src/prompt/policy';

describe('WORKER_POLICY safety wording (D-LR23-1)', () => {
  it('carries both new safety and formatting sentences', () => {
    expect(WORKER_POLICY).toContain(
      'The app shows its own short safety card. Never give phone numbers, hotlines, helplines, websites or the names of services. If someone may be in danger now, tell them to get emergency help now; otherwise point them to stopping and getting it checked, or to talking with someone they trust or a doctor.'
    );
    expect(WORKER_POLICY).toContain(
      "Don't name research studies, their authors or health organisations as sources, and don't quote evidence ratings; say how sure the evidence is in plain words."
    );
  });

  it('drops the old "adds the support resources" line', () => {
    expect(WORKER_POLICY).not.toContain('adds the support resources');
  });

  it('keeps the "get emergency help now" instruction', () => {
    expect(WORKER_POLICY).toContain('get emergency help now');
  });
});

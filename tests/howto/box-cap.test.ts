// BOX-CAP (D-BOXCAP-1; R-W0-1): the back-pain box's named 50-word limit, applied by its shared-card key. Every other
// box keeps golden B's 30, and golden B's copy-lint.mjs stays byte-identical.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
let C: any, CL: any;
beforeAll(async () => {
  [C, CL] = await Promise.all(['tools/plates/library/lint/box-caps.mjs', 'tools/plates/layers/artifact/copy-lint.mjs'].map(p => import(/* @vite-ignore */ url(p))));
});

describe('BOX-CAP: the named limit table', () => {
  it('names one key, back-pain-box at 50; every other key gets golden B\'s imported 30', () => {
    expect(C.NAMED_BOX_CAPS).toEqual({ 'back-pain-box': 50 });
    expect(Object.isFrozen(C.NAMED_BOX_CAPS)).toBe(true);
    expect(C.boxCapOf('back-pain-box')).toBe(50);
    for (const k of ['wrist-pain-box', 'back-pain-box ', 'Back-Pain-Box', 'back', 'toString', '', undefined]) expect([k, C.boxCapOf(k)]).toEqual([k, CL.RED_FLAG_BOX_MAX_WORDS]);
    expect(CL.RED_FLAG_BOX_MAX_WORDS).toBe(30);
  });
  it('BC-2: golden B\'s copy-lint.mjs is byte-identical to the base', () => {
    const sha = createHash('sha256').update(readFileSync(join(ROOT, 'tools/plates/layers/artifact/copy-lint.mjs'))).digest('hex');
    expect(sha).toBe('f568f938e0ac9d7555e8565848c1d5e7d9a6d3b78fb6f1d85cb7dabb4f6aeafe');
  });
});

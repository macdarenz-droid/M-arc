// F-PAIR-FAULTS (card docs/supervisor/verify/f-pair-faults-card.md): a row draws only the pair-key faults its card
// supports. A1/A2 baseline: with no row naming `pairFaults`, every pair key's panel stays byte-equal to main cb9a6dae.
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let P: any;

beforeAll(async () => {
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
});

// sha256 of pairPanel(key) for every pair key on main cb9a6dae, before F-PAIR-FAULTS
const PANEL_MAIN: Record<string, string> = {
  'bar-hang-under': '203b7a6dcded4b39f95ad5692c868b0fb3f68766f47303b074778ff46b8d6c2a',
  'bar-hang-over': 'aa37b9b1148fe952194a16d06b0bdc1460e196234bee8954d2bd9df47b5e815a',
  'bar-row-over': '25a00e12d83269be574fc859c42d7a3f1c2f2f5ac2e8947c4130d8a73a82c82c',
  'bar-pulldown-under': 'aba559e2f12c8b92aef841dfade6c789271b699b98f5d469fe5ecb494309e4ba',
  'battle-rope-rope-neutral': '0d33228ab6b78b07b8a27bab7a004e020502fdb50aaa0907574f84715f8c46ec',
  'curl-dumbbell-under': 'dadfb69230f57ddbbe47d0f74ee4df9fea13c145a56bf5e7ed171e49587406f9',
  'curl-dumbbell-neutral': '4f101e1434d1e4607c1fb2f56de0ff8f6c2bda0cd9f92f152e8ec9f23cc509d9',
  'curl-bar-under': 'bcb90ca4ee701f9a704160011a32aae23742272c499def66a8ad3be9a9a17791',
  'd-handle-pull-unstated': '7a4c228ee554b1e99b32363a8ebfecb7865531a109e60790a8b71d4592da8dfe',
  'ez-curl-angled': '1b6894005190b4065b210c4c2024ac7f8ff842d6564736c7927e67bc6bf1f032',
  'ez-curl-under': '113c98b5f9f10ab9d6e3ed78bd08e8f231586f390528329f0f209d43c14ba0e4',
  'ez-curl-over': '1d790be9181fbdb03670c84a784c330230415cd6891c7f114707088d1273d89b',
  'palm-flat-floor-over': '938dc3fc139f2bad1fa0fc6f97a1f809dbda7d8cc49c3684d0d86c4be1be10ca',
  'rope-push-neutral': 'bfb1fe4603c15fbc0a3f1eec96825d041530f6aa068a998fe29eb988cfa07946',
  'v-handle-pull-neutral-overhead': 'c73a6c0815d189f9c09d5f17ecae4db1d2439d36b57a434f7c3cb879fae58f13',
};

describe('F-PAIR-FAULTS A1/A2: a pair key with no row filter draws what it draws on main', () => {
  it('pairPanel(key) is byte-equal to main for every pair key', async () => {
    expect([...P.keysOf()].sort()).toEqual(Object.keys(PANEL_MAIN).sort());
    for (const [k, want] of Object.entries(PANEL_MAIN)) expect([k, sha(await P.pairPanel(k))]).toEqual([k, want]);
  }, 60_000);
});

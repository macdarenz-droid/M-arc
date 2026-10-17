// LIB-8 (plan 2.7): the plates page builder rebuilds golden A byte for byte from the 8's list.
// Run: node --test tools/plates/library/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPlatesPage, goldenAConfig, patchedBuilder } from '../build-page.mjs';
import { PINS, sha256, firstDiff, FIXTURE } from '../../golden.mjs';
import { readFileSync } from 'node:fs';

test('with the 8 it rebuilds golden A e2bea90c…, 860,766 B', async () => {
  const { html } = await buildPlatesPage(await goldenAConfig());
  assert.equal(firstDiff(html, readFileSync(FIXTURE)), -1, 'first differing byte');
  assert.equal(html.length, PINS.pageBytes);
  assert.equal(sha256(html), PINS.pageSha256);
});

test('a changed list changes the bytes (the proof can fail)', async () => {
  const cfg = await goldenAConfig();
  cfg.groups = cfg.groups.map(g => ({ ...g, ids: [...g.ids].reverse() }));
  const { html } = await buildPlatesPage(cfg);
  assert.notEqual(sha256(html), PINS.pageSha256);
});

test('a vendored builder of another shape is refused, never half-patched', () => {
  const src = readFileSync(new URL('../../vendor/artifact/build-page.mjs', import.meta.url), 'utf8');
  assert.throws(() => patchedBuilder(src.replace('const GROUPS = [', 'const GROUPS2 = [')), /exactly once/);
  assert.throws(() => patchedBuilder(src.replace("<h1>Option 2 · Technical Plate</h1>", '<h1>X</h1>')), /exactly once/);
});

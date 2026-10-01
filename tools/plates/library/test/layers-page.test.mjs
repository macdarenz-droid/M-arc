// LIB-6 (plan 2.6, 2.7): the layers page builder and the close-up fragments against golden B (LR-23, e7b81413…).
// Run: node --test tools/plates/library/test/*.test.mjs   (each page build is a real ~7 s build)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGE_SHA256, ROOT, sha256 } from '../../layers.mjs';
import { buildLayersPage, GOLDEN_B_GROUPS, howtoIdOf, patchBuildPage, patchHowtoLayers, patchOnce, planOf } from '../build-layers-page.mjs';
import { closeupFragments, fragmentDiff } from '../render/fragments.mjs';
import { LEGACY_SCRIPTS } from '../render/legacy.mjs';

const GOLDEN = join(ROOT, 'tests/howto/golden/howto-layers.html');
const CARDS = GOLDEN_B_GROUPS.flatMap(g => g.ids).map(c => c.replace(/_/g, '-'));
const golden = () => { const b = readFileSync(GOLDEN); assert.equal(sha256(b), PAGE_SHA256, 'committed golden B is the approved page'); return b.toString('utf8'); };
const ALL_LEGACY = Object.fromEntries(Object.keys(LEGACY_SCRIPTS).map(k => [k, { legacy: true }]));

test('golden B holds 8 close-up fragments, each cut whole', () => {
  const fr = closeupFragments(golden(), CARDS);
  assert.deepEqual(Object.keys(fr), CARDS);
  for (const c of CARDS) {
    assert.ok(fr[c].panels.startsWith(`<div class="zx" id="${c}-zoom-`) && fr[c].panels.endsWith('</div>'), c);
    assert.ok(fr[c].css.startsWith('/* close-ups: ') && fr[c].css.endsWith('}\n'), c);
  }
});

test('a 1-byte change in any fragment is caught', () => {
  const want = closeupFragments(golden(), CARDS);
  assert.deepEqual(fragmentDiff(want, want), []);
  for (const c of CARDS) for (const part of ['panels', 'css']) {
    const s = want[c][part], i = s.length >> 1, got = structuredClone(want);
    got[c][part] = s.slice(0, i) + (s[i] === 'a' ? 'b' : 'a') + s.slice(i + 1);
    assert.deepEqual(fragmentDiff(got, want), [`${c}.${part}: differs at byte ${i} (${s.length} vs ${s.length} chars)`]);
  }
});

test('every patch anchor of the vendored chrome matches exactly once, and a moved anchor throws', () => {
  const hl = readFileSync(join(ROOT, 'tools/plates/layers/artifact/howto-layers.mjs'), 'utf8');
  const bp = readFileSync(join(ROOT, 'tools/plates/layers/artifact/build-page.mjs'), 'utf8');
  const plan = planOf({ groups: GOLDEN_B_GROUPS, closeups: ALL_LEGACY });
  assert.doesNotThrow(() => patchHowtoLayers(hl, plan));
  assert.doesNotThrow(() => patchBuildPage(bp, { groups: GOLDEN_B_GROUPS, jump: null }));
  assert.throws(() => patchHowtoLayers(hl.replace('apis[id] = await loadRenderer(id);', 'apis[id] = await loadRenderer(id) ;'), plan), /renderer dispatch/);
  assert.throws(() => patchBuildPage(bp.replace('const GROUPS = [', 'const GROUPS  = ['), { groups: GOLDEN_B_GROUPS }), /GROUPS/);
  assert.throws(() => patchOnce('a a', 'twice', 'a', 'b'), /matched 2 times/);
});

test('the spec list is checked: no close-up source, unknown fallback, duplicates', () => {
  assert.throws(() => planOf({ groups: GOLDEN_B_GROUPS, closeups: {} }), /no close-up source/);
  assert.throws(() => planOf({ groups: [{ id: 'x', title: 'X', ids: ['incline_bench'] }], closeups: { incline_bench: { legacy: true } } }), /no frozen golden-B script/);
  assert.throws(() => planOf({ groups: [{ id: 'x', title: 'X', ids: ['pull_up', 'pull_up'] }], closeups: ALL_LEGACY }), /listed twice/);
  assert.throws(() => planOf({ groups: [{ id: 'x', title: 'X', ids: ['pull_up'] }], closeups: { pull_up: { optionsKey: 'pull_up' } } }), /optionsUrl/);
  assert.equal(howtoIdOf('lateral_raise'), 'dumbbell_lateral_raise');
});

test('all 8 on the legacy fallback: the builder rebuilds golden B byte for byte', async () => {
  const page = await buildLayersPage({ groups: GOLDEN_B_GROUPS, closeups: ALL_LEGACY });
  assert.equal(sha256(page), PAGE_SHA256);
});

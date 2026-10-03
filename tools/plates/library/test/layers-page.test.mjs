// LIB-6 (plan 2.6, 2.7): the layers page builder and the close-up fragments against golden B (LR-23, e7b81413…).
// Run: node --test tools/plates/library/test/*.test.mjs   (each page build is a real ~7 s build)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGE_SHA256, ROOT, sha256 } from '../../layers.mjs';
import { buildLayersPage, GOLDEN_B_CLOSEUPS, GOLDEN_B_GROUPS, GOLDEN_B_SPEC, howtoIdOf, patchBuildPage, patchHowtoLayers, patchOnce, planOf } from '../build-layers-page.mjs';
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

test('all 8 drawn by the library renderer: page === golden B and every close-up fragment === golden B', async () => {
  const page = await buildLayersPage(GOLDEN_B_SPEC);
  assert.deepEqual(fragmentDiff(closeupFragments(page.toString('utf8'), CARDS), closeupFragments(golden(), CARDS)), []);
  assert.equal(sha256(page), PAGE_SHA256);
});

test('mixed page: the fallback ids load their frozen scripts (they have no renderer options), the rest use the renderer', async () => {
  // pull-up (zoom shell) and leg press (zbox shell) on the fallback; their options are removed, so the renderer
  // cannot be what draws them: if the fallback did not run, closeupApi would throw "no close-up options".
  const optionsUrl = new URL('./fixtures/options-without-pull-up-leg-press.mjs', import.meta.url).href;
  const closeups = { ...GOLDEN_B_CLOSEUPS, pull_up: { legacy: true }, leg_press: { legacy: true } };
  const page = await buildLayersPage({ groups: GOLDEN_B_GROUPS, closeups, optionsUrl });
  assert.equal(sha256(page), PAGE_SHA256);
  await assert.rejects(buildLayersPage({ groups: GOLDEN_B_GROUPS, closeups: { ...closeups, pull_up: GOLDEN_B_CLOSEUPS.pull_up }, optionsUrl }), /pull_up: no close-up options|no close-up options/);
});

test('the body-map stomach fix is a real page step: without it (and no frozen leg-raise script) the page differs', async () => {
  const page = await buildLayersPage({ ...GOLDEN_B_SPEC, regionFix: false });
  assert.notEqual(sha256(page), PAGE_SHA256);
  assert.deepEqual(fragmentDiff(closeupFragments(page.toString('utf8'), CARDS), closeupFragments(golden(), CARDS)), []);   // only the feel maps move
});

test('a batch page: its own groups, no jump link to an absent card', async () => {
  const page = (await buildLayersPage({ ...GOLDEN_B_SPEC, groups: [{ id: 'hanging', title: 'Hanging', ids: ['pull_up', 'hanging_leg_raise'] }], jump: null })).toString('utf8');
  assert.ok(!page.includes('pg-jump" href'));
  assert.ok(!page.includes('id="card-lat-pulldown"'));
  const want = closeupFragments(golden(), ['pull-up', 'hanging-leg-raise']);
  assert.deepEqual(fragmentDiff(closeupFragments(page, ['pull-up', 'hanging-leg-raise']), want), []);
});

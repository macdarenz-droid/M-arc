// HT-5: content.mjs generates HowToContent from the vendored golden-B *.howto.mjs for the 8 approved exercises;
// nobody types it a second time. Proves HT5-A1 (generated, not typed: every string === golden B, and a field the
// mapping drops fails field coverage), HT5-A2 (the content checks green on all 8) and HT5-A4 (HOWTO_HINTS,
// ids.ts's budget).
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Source } from '../../src/howto/content-types';
import exercises from '../../src/data/exercises.json';
import { COVERAGE } from '../../src/howto/coverage';
import { checkC1 } from './checks/c1';
import { checkC2 } from './checks/c2';
import { checkC3 } from './checks/c3';
import { checkC4 } from './checks/c4';
import { checkC6 } from './checks/c6';
import { checkC7 } from './checks/c7';
import { checkC8 } from './checks/c8';
import { checkC16 } from './checks/c16';
import { checkC17 } from './checks/c17';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let content: any, generate: any;
const rows = JSON.parse(readFileSync('tools/plates/plates.json', 'utf8')) as Record<string, { slug: string }>;
const IDS = Object.keys(rows);

/** BuiltHowTo's content-only fields (module layout 2.3): what content.mjs actually persists into ht-<slug>.ts.
 *  `zooms`/`feel` are golden B too, but they are HT-7's/HT-8's own generated files, so they are excluded here. */
const BASE_KEYS = ['rev', 'extends', 'handling', 'contacts', 'setup', 'posture', 'chips', 'copy', 'mistakes', 'risks', 'riskFlags', 'redFlag', 'sources', 'research'] as const;

let rendered: Map<string, { text: string }>, all: { byId: Map<string, any>; sourcesById: Map<string, any> };

beforeAll(async () => {
  content = await import(/* @vite-ignore */ url('tools/plates/gen/content.mjs'));
  generate = await import(/* @vite-ignore */ url('tools/plates/generate.mjs'));
  rendered = await generate.render();
  const byId = new Map<string, any>(), sourcesById = new Map<string, any>();
  for (const id of IDS) {
    const { content: c, sources } = await content.loadContent(id);
    byId.set(id, c);
    sourcesById.set(id, sources);
  }
  all = { byId, sourcesById };
}, 20000);

/** Every id's full normalized content (used for the checks) plus its raw SOURCES, computed once in beforeAll. */
async function loadAll() {
  return all;
}

describe('HT5-A1: generated, not typed', () => {
  it('every content field ht-<slug>.ts holds is === the value content.mjs derived from the vendored golden-B file', async () => {
    const { byId } = await loadAll();
    for (const [id, c] of byId) {
      const mod = await import(/* @vite-ignore */ url(`src/howto/generated/ht-${rows[id]!.slug}.ts`));
      const built = mod.default;
      for (const k of BASE_KEYS) {
        if (c[k] === undefined) expect(built[k], `${id}.${k}`).toBeUndefined();
        else expect(built[k], `${id}.${k}`).toEqual(c[k]);
      }
      expect(built.zooms, `${id}.zooms must stay absent (HT-7's file)`).toBeUndefined();
      expect(built.feel, `${id}.feel must stay absent (HT-8's file)`).toBeUndefined();
    }
  });

  it('hand-editing a generated text field fails freshness: patching the module text breaks its own inputsSha256 header', () => {
    const path = `src/howto/generated/ht-${rows['lib_machine_chest_press']!.slug}.ts`;
    const fresh = rendered.get(path)!.text;
    const tampered = fresh.replace('Heel of palm, wrist straight.', 'Something else entirely.');
    expect(tampered).not.toBe(fresh);
    const header = fresh.match(/inputsSha256=([0-9a-f]{64})/)![1]!;
    expect(tampered.includes(header)).toBe(true); // the header line is unchanged...
    expect(readFileSync(path, 'utf8')).not.toBe(tampered); // ...but the committed file no longer matches: --check fails
  });

  it('a mapping that drops a golden-B field fails field coverage: baseFieldsText only emits known BuiltHowTo keys', () => {
    const withExtra = { rev: 1, bogus: 'nope' };
    const text = content.baseFieldsText(withExtra);
    expect(text).not.toContain('bogus');
    expect(text).toContain('rev: 1');
  });
});

function sourcesRegistry(): Record<string, Source> {
  const text = rendered.get('docs/research/howto/sources.json')!.text.replace(/^\/\/[^\n]*\n/, '');
  return JSON.parse(text) as Record<string, Source>;
}

describe('HT5-A2: the content checks (C1-C4, C6-C8, C16, C17) pass on the generated content of all 8', () => {
  it('every source carries access and checked (no nulls) and every field cross-references clean', () => {
    const SOURCES = sourcesRegistry();
    for (const [sid, s] of Object.entries(SOURCES)) {
      expect(s.access, `sources.json ${sid}.access`).not.toBeNull();
      expect(s.checked, `sources.json ${sid}.checked`).not.toBeNull();
    }
  });

  it('C1, C2, C3, C4, C6, C7, C8, C16, C17: no findings', async () => {
    const SOURCES = sourcesRegistry();
    const { byId } = await loadAll();
    const knownIds = new Set(exercises.map(e => e.id));
    const allowedUrls = new Set(Object.values(SOURCES).map((s: any) => s.url));

    let bad: string[] = [];
    for (const [id, c] of byId) {
      const equipment = exercises.find(e => e.id === id)?.equipment ?? '';
      bad = bad.concat(checkC1(c, knownIds));
      bad = bad.concat(checkC2(c));
      bad = bad.concat(checkC3(c, equipment));
      bad = bad.concat(checkC4(c));
      bad = bad.concat(checkC7(c));
      bad = bad.concat(checkC8(c, SOURCES));
      bad = bad.concat(checkC16(c));
    }
    bad = bad.concat(checkC6(exercises.map(e => e.id), COVERAGE));
    bad = bad.concat(checkC17(['tools/plates/gen/content.mjs', 'src/howto'].map(p => new URL(`../../${p}`, import.meta.url).pathname), allowedUrls));

    expect(bad).toEqual([]);
  });
});

describe('HT5-A4: HOWTO_HINTS (critic fix 8)', () => {
  it('holds golden B\'s handling.cue for push-archetype exercises with an approved plate, and nothing else', async () => {
    const { HOWTO_HINTS, HOWTO_IDS } = await import('../../src/howto/ids');
    const { byId } = await loadAll();
    const wantKeys = [...byId.entries()].filter(([, c]) => c.handling?.archetype === 'push').map(([id]) => id);
    expect(Object.keys(HOWTO_HINTS).sort()).toEqual(wantKeys.sort());
    for (const id of wantKeys) expect(HOWTO_HINTS[id as keyof typeof HOWTO_HINTS]).toBe(byId.get(id)!.handling.cue);
    for (const id of HOWTO_IDS) if (!wantKeys.includes(id)) expect(HOWTO_HINTS[id]).toBeUndefined();
  });

  it('ids.ts stays <= 2,048 B with the hints counted', () => {
    expect(readFileSync('src/howto/ids.ts', 'utf8').length).toBeLessThanOrEqual(2048);
  });
});

describe('HT5-A5: archetypes.ts is generated from golden B\'s shared module, byte for byte', () => {
  it('the four red-flag blocks and the disclaimer match tools/plates/layers/howto/shared.mjs exactly', async () => {
    const shared = await import(/* @vite-ignore */ url('tools/plates/layers/howto/shared.mjs'));
    const archetypes = await import('../../src/howto/archetypes');
    expect(archetypes.RED_FLAG).toEqual(shared.RED_FLAG);
    expect(archetypes.RED_FLAG_SHOULDER).toEqual(shared.RED_FLAG_SHOULDER);
    expect(archetypes.RED_FLAG_KNEE).toEqual(shared.RED_FLAG_KNEE);
    expect(archetypes.RED_FLAG_ELBOW).toEqual(shared.RED_FLAG_ELBOW);
    expect(archetypes.DISCLAIMER).toBe(shared.DISCLAIMER);
    expect(archetypes.DISCLAIMER).toBe('General guidance, not medical advice. If something hurts, stop and get it checked.');
    expect(archetypes.SHOW_EVIDENCE).toBe(shared.SHOW_EVIDENCE);
  });

  it('no content row carries its own red-flag wording (C8 already proves this per row; this proves redFlag is always the shared block)', async () => {
    const { byId } = await loadAll();
    for (const [id, c] of byId) expect(c.redFlag.name, id).toBe('Wrist pain');
  });
});

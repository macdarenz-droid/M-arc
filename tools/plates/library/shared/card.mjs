// LIB-5 (Do 4, D-LIB5-SPLIT; lib4-cards.md 14.3): the shared research cards as the modules read them. A module never
// retypes a string: it projects card fields as { text, claim } with the card's own refs. SPLIT names the sheet path
// (content-types.ts, golden B's copyFields) and copy-lint kind each shown field is written to; DATA names the fields a
// module never writes to a text path. Any other field is refused, so a new card field cannot ship unruled.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const CARD_DIR = 'docs/research/howto/shared';

/** The copied card docs/research/howto/shared/<key>.json (S1-pinned). */
export const sharedCard = (key, root = ROOT) => JSON.parse(readFileSync(join(root, CARD_DIR, `${key}.json`), 'utf8'));

/** D-LIB5-SPLIT 1-3: shown field -> [sheet path, copy-lint kind]. variants.<v>.steps map as steps (SPLIT 3). */
export const SPLIT = {
  gripLine: ['handling.gripLine', 'lead'],
  cue: ['handling.cue', 'cue'],
  wrist: ['handling.wrist.limitText', 'lead'],
  soreWrist: ['handling.handleChoice.sore', 'lead'],
  thumbRule: ['handling.thumb.options[].when', 'prose'],
  alternative: ['handling.thumb.options[].when', 'prose'],
  widthNote: ['handling.width.text', 'prose'],
  fingers: ['handling.width.text', 'prose'],
  handContact: ['handling.width.text', 'prose'],
  grip: ['handling.width.text', 'prose'],
  rightPose: ['zooms[hand].hand.note', 'caption'],
  contactPoint: ['zooms[hand].rightNote', 'label'],
  'faults[].label': ['handling.faults[].label', 'label'],
  'faults[].what': ['handling.faults[].alt', 'alt'],
  handRisks: ['risks[]', 'risk'],
  steps: ['setup[]', 'setup'],
  'postureArchetype.right': ['zooms[posture].caption.right', 'caption'],
  'postureArchetype.wrong': ['zooms[posture].caption.wrong', 'caption'],
  reason: ['handling.wrist.limitText', 'lead'],
  replacementRule: ['handling.gripLine', 'lead'],
  'checkpoints[].label': ['posture[].label', 'label'],
  'checkpoints[].detail': ['posture[].detail', 'prose'],
  'defaultCheckpoints[].label': ['posture[].label', 'label'],
  'defaultCheckpoints[].detail': ['posture[].detail', 'prose'],
  defaultCrop: ['zooms[posture].caption.right', 'caption'],
};
/** Card fields that expand to the SPLIT entries above. */
const EXPANDS = { faults: ['faults[].label', 'faults[].what'], postureArchetype: ['postureArchetype.right', 'postureArchetype.wrong'],
  checkpoints: ['checkpoints[].label', 'checkpoints[].detail'], defaultCheckpoints: ['defaultCheckpoints[].label', 'defaultCheckpoints[].detail'] };

/** D-LIB5-SPLIT 2: never written to a text path (the note's "Not projected" list, keys, implement, the registry fields
 *  and the typed enums). appliesTo is ids: it scopes a field and is exported as scope, never as text. */
export const DATA = ['key', 'kind', 'appliesToWhy', 'move', 'claims', 'sources', 'gaps', 'notes', 'implement',
  'loadAxis', 'thumbMode', 'byRule', 'byInference', 'notFor', 'archetype', 'handle'];

/** The card's shown fields as [{ field, path, kind, ids }], each scoped to the ids whose sheet shows it (a variant's
 *  appliesTo for its steps, else the card's). Throws for an unruled field, and when two fields share a one-value path
 *  on one id (D-LIB5-SPLIT 4: never concatenate or pick one). A list path (`[]`) holds one entry per item. */
export function splitOf(card) {
  const out = [];
  for (const [f, v] of Object.entries(card)) {
    if (DATA.includes(f) || f === 'appliesTo') continue;
    if (f === 'variants') {
      for (const [name, va] of Object.entries(v)) for (const g of Object.keys(va)) {
        if (g === 'appliesTo') continue;
        if (g !== 'steps') throw new Error(`${card.key}: split: variants.${name}.${g} is not a ruled field`);
        out.push({ field: `variants.${name}.steps`, path: SPLIT.steps[0], kind: SPLIT.steps[1], ids: va.appliesTo ?? [] });
      }
      continue;
    }
    const subs = EXPANDS[f] ?? [f];
    for (const s of subs) {
      if (!SPLIT[s]) throw new Error(`${card.key}: split: ${s} is not a ruled field`);
      out.push({ field: s, path: SPLIT[s][0], kind: SPLIT[s][1], ids: card.appliesTo ?? [] });
    }
  }
  const byPath = new Map();
  for (const x of out) byPath.set(x.path, [...(byPath.get(x.path) ?? []), x]);
  for (const [path, xs] of byPath) {
    if (path.includes('[]')) continue;
    const clash = xs.filter(a => xs.some(b => b !== a && a.ids.some(id => b.ids.includes(id))));
    if (clash.length) throw new Error(`${card.key}: split: ${path} has ${clash.map(x => x.field).join(', ')}`);
  }
  return out;
}

/** A step as the module exports it: the card's kind, text and claim ref, nothing else. */
export function stepOf(card, s, at) {
  const extra = Object.keys(s).filter(k => !['kind', 'text', 'claim'].includes(k));
  if (extra.length) throw new Error(`${card.key}: ${at}: unruled step field ${extra.join(', ')}`);
  return { kind: s.kind, text: s.text, claim: s.claim };
}

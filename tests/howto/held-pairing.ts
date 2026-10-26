// D-PLATEFACTS-HELD (#309 6405234751): the all-cards checks of F-PLATEFACTS (library-cards8) and LIB-STRIP A6 pin the
// ruled hold markers exactly. A held id (fixtures/held-pairing.json) gives exactly the pairing problem; every other card
// gives []. A listed id missing on a tree is skipped, so the check holds on any base.
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('../../', import.meta.url).pathname;
const HOWTO = 'docs/research/howto';
export type Held = { id: string; ruling: string }[];
export const HELD: Held = JSON.parse(readFileSync(join(ROOT, 'tests/howto/fixtures/held-pairing.json'), 'utf8')).held;
export const PAIR = (id: string) => `cards/${id}.json: plateFacts and tempo go in together or not at all`;

/** The fixture's own shape: each entry an id and a ruling, both non-empty strings, ids unique and sorted. */
export function heldShapeProblems(held: Held): string[] {
  const bad: string[] = [];
  for (const [i, h] of held.entries()) {
    if (Object.keys(h).join() !== 'id,ruling') bad.push(`held[${i}] keys ${Object.keys(h).join()}, want id,ruling`);
    if (typeof h.id !== 'string' || !h.id) bad.push(`held[${i}] has no id`);
    if (typeof h.ruling !== 'string' || !h.ruling) bad.push(`held[${i}] (${h.id}) has no ruling`);
  }
  const ids = held.map(h => h.id);
  if (new Set(ids).size !== ids.length) bad.push('held ids are not unique');
  if (ids.join() !== [...ids].sort().join()) bad.push('held ids are not sorted');
  return bad;
}

/** Every card in `root` whose validateCardFile result is not its expected one ([PAIR] for a held id, [] otherwise). */
export function pairingMismatches(V: any, root = ROOT, held: Held = HELD): string[] {
  const ids = new Set(held.map(h => h.id));
  return readdirSync(join(root, HOWTO, 'cards')).filter(f => f.endsWith('.json')).flatMap(f => {
    const id = f.slice(0, -5), got = V.validateCardFile(f, root), want = ids.has(id) ? [PAIR(id)] : [];
    return JSON.stringify(got) === JSON.stringify(want) ? [] : [`${id}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`];
  });
}

/** Mutations (a)-(e) and the control on a temp copy of the cards and quotes. barbell_row (plateFacts [] and a timed
 *  tempo) stands in for a held card and plank for an unlisted one, since no held id need exist on the base. */
export function pairingMutations(V: any) {
  const tmp = mkdtempSync(join(tmpdir(), 'held-pairing-'));
  try {
    for (const d of ['cards', 'quotes']) cpSync(join(ROOT, HOWTO, d), join(tmp, HOWTO, d), { recursive: true });
    const file = (id: string) => join(tmp, HOWTO, 'cards', `${id}.json`);
    const card = (id: string) => JSON.parse(readFileSync(file(id), 'utf8'));
    const put = (id: string, c: any) => writeFileSync(file(id), JSON.stringify(c, null, 1));
    const row = card('barbell_row'), plank = card('plank'), held = [...HELD, { id: 'barbell_row', ruling: 'mutation stand-in' }];
    const { tempo: _t, ...rowNoTempo } = row;
    put('barbell_row', rowNoTempo);
    const control = pairingMismatches(V, tmp, held);                                       // the held stand-in gives the marker
    put('barbell_row', row);
    const a = pairingMismatches(V, tmp, held);                                             // (a) a listed id carries a tempo
    put('barbell_row', rowNoTempo);
    const { tempo: _p, ...plankNoTempo } = plank;
    put('plank', plankNoTempo);
    const b = pairingMismatches(V, tmp, held);                                             // (b) an unlisted card loses its tempo
    put('plank', plank);
    put('barbell_row', { ...rowNoTempo, plateFacts: [{ kind: 'contact', landmark: 'wrist.l', pose: 'start', claim: 'c999' }] });
    const c = pairingMismatches(V, tmp, held);                                             // (c) a listed id with another problem
    put('barbell_row', rowNoTempo);
    const d = pairingMismatches(V, tmp, HELD);                                             // (d) the id dropped from the list
    const e = heldShapeProblems([...HELD.slice(1), { id: HELD[0]!.id, ruling: '' }].sort((x, y) => x.id.localeCompare(y.id)));   // (e) a ruling-less entry
    return { control, a, b, c, d, e };
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

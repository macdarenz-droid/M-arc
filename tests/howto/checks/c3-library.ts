// LIB-SHIP (D-SHIP-C3, #376 6614298313): C3 for a library row. c3.ts is unchanged and still runs on the 8 and on
// every library row that has a hand zoom or is not on the pinned no-zoom list. A listed row may ship with no hand zoom
// only when its entry names a ruled ruling and a valid reason, and its handling.why names that ruling (ruling 8:
// the grip copy carries the hand claims; no hand pose is invented).
import type { HowToContent } from '../../../src/howto/content-types';
import { checkC3 } from './c3';

/** The rulings a no-zoom entry may name. A new one is added only with its ruling posted (D-SHIP-C3 item 4). */
export const RULED = new Set(['D-SHIP-Q1', 'D-SHIP-C3', 'D-SHIP-HANDW2', 'D-SHIP-ROPEPAIR', 'D-SHIP-HANDW4']);   // W2: #379 6625803515, #376 6616096384; W4: #391 6647760116
export const REASONS = ['gap-key', 'gap-ruled', 'card-no-zoom'] as const;
export type NoZoomEntry = { ruling: string; reason: string; at?: string; note?: string };

/** `card`: the row's research card as read from its file at test time; `gapKeyOf(id)`: the hand key whose GAPS
 *  holds the id, or null. */
export function checkC3Library(content: HowToContent, equipment: string, ctx: {
  list: Record<string, NoZoomEntry>; card: { zooms?: { kind?: string }[] } | null; gapKeyOf: (id: string) => string | null;
}): string[] {
  const hasHandZoom = content.zooms.some(z => z.kind === 'hand'), entry = ctx.list[content.id];
  if (hasHandZoom || content.handling.archetype === 'none' || content.extends !== undefined) {
    return [...checkC3(content, equipment), ...(entry ? [`C3L: ${content.id} is on the no-zoom list but ${hasHandZoom ? 'has a hand zoom' : 'needs none'}`] : [])];
  }
  if (!entry) return checkC3(content, equipment);
  const bad: string[] = [], cardZoom = (ctx.card?.zooms ?? []).some(z => z.kind === 'hand');
  if (!RULED.has(entry.ruling)) bad.push(`C3L: ${content.id}: ruling ${entry.ruling} is not in the ruled set`);
  if (!(REASONS as readonly string[]).includes(entry.reason)) bad.push(`C3L: ${content.id}: unknown reason ${entry.reason}`);
  if (entry.reason === 'card-no-zoom' && cardZoom) bad.push(`C3L: ${content.id}: card-no-zoom, but the card has a hand zoom`);
  if (entry.reason === 'gap-key' && !ctx.gapKeyOf(content.id.replace(/^lib_/, ''))) bad.push(`C3L: ${content.id}: gap-key, but no hand key lists it in GAPS`);
  if (entry.reason === 'gap-key' && !/^tools\/plates\/library\/hands\/hand-[a-z0-9-]+\.mjs:\d+$/.test(entry.at ?? '')) bad.push(`C3L: ${content.id}: gap-key needs at: file:line`);
  if (entry.reason !== 'card-no-zoom' && !cardZoom) bad.push(`C3L: ${content.id}: ${entry.reason}, but the card has no hand zoom to gap (use card-no-zoom)`);
  const why = (content.handling as { why?: unknown }).why;
  if (typeof why !== 'string' || !why.includes(entry.ruling)) bad.push(`C3L: ${content.id}: handling.why must name ${entry.ruling}`);
  return bad;
}

/** D-SHIP-GRIP (#376 6614415740) case (b): a library row may use NoHandling for a handled archetype only when its card
 *  gives no hand claim at all (grip.thumb, grip.handContact and grip.wrist all empty), and its why names D-SHIP-GRIP. */
export function checkGripLibrary(content: HowToContent, card: { grip?: Record<string, unknown>; archetype?: { hand?: unknown } } | null): string[] {
  const why = (content.handling as { why?: unknown }).why;
  const usesB = content.handling.archetype === 'none' && typeof why === 'string' && why.includes('D-SHIP-GRIP');
  if (!usesB) return [];
  const claimed = (['thumb', 'handContact', 'wrist'] as const).filter(k => typeof card?.grip?.[k] === 'string' && (card.grip[k] as string).trim() !== '');
  if (!/D-SHIP-GRIP \(b2\)/.test(why as string)) return claimed.length ? [`GRIP: ${content.id} uses D-SHIP-GRIP (b) but its card claims grip.${claimed.join(', grip.')}`] : [];
  // (b2) (#379 6628848012): only a card whose own archetype.hand is none; each claimed field's claim id cited on a
  // setup or posture line of the sheet.
  if (card?.archetype?.hand !== 'none') return [`GRIP: ${content.id} uses D-SHIP-GRIP (b2) but its card's archetype.hand is not none`];
  const ids = (t: unknown) => (typeof t === 'string' ? t.match(/\bc\d+\b/g) ?? [] : []);
  const cited = new Set([...(content.setup ?? []), ...(content.posture ?? [])].flatMap(x => ids((x as { claim?: { note?: unknown } }).claim?.note)));
  const want = [...new Set([...(Array.isArray(card.grip?.claims) ? card.grip.claims as string[] : []), ...claimed.flatMap(k => ids(card.grip?.[k]))])];
  if (claimed.length && !want.length) return [`GRIP: ${content.id} uses D-SHIP-GRIP (b2) but its card names no claim for grip.${claimed.join(', grip.')}`];
  return want.filter(c => !cited.has(c)).map(c => `GRIP: ${content.id} uses D-SHIP-GRIP (b2) but card claim ${c} is cited on no setup or posture line`);
}

/** Q-W2-2 (#379 6625803515): a GRIP (c) row whose contact and wrist range come from a pair-key convention. Red when the
 *  sheet's contact or ext range differs from what `convention` names now, or when the card gains a handContact that
 *  disagrees with it (the card then wins and the derivation no longer applies). */
const ZONE_OF: Record<string, string> = { heel: 'heel of the palm', 'mid-palm': 'middle of the palm', 'finger-base': 'base of the fingers' };
export function checkConventionGrip(content: HowToContent, card: { grip?: Record<string, unknown> } | null, convention: string): string[] {
  const h = content.handling as { contact?: string; wrist?: { ext?: number[] } }, out: string[] = [];
  const zone = h.contact ? ZONE_OF[h.contact] : undefined;
  if (!zone || !convention.includes(zone)) out.push(`GRIPC: ${content.id}: contact ${h.contact} is not the convention's zone`);
  const ext = convention.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
  if (!ext || JSON.stringify(h.wrist?.ext) !== JSON.stringify(ext)) out.push(`GRIPC: ${content.id}: wrist ext ${JSON.stringify(h.wrist?.ext)} is not the convention's range`);
  const hc = card?.grip?.handContact;
  if (typeof hc === 'string' && hc.trim() !== '' && !(zone && hc.toLowerCase().includes(zone.split(' of ')[0] ?? zone))) out.push(`GRIPC: ${content.id}: card grip.handContact disagrees with the convention`);
  return out;
}

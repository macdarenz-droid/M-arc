// LIB-SHIP (D-SHIP-C3, #376 6614298313): C3 for a library row. c3.ts is unchanged and still runs on the 8 and on
// every library row that has a hand zoom or is not on the pinned no-zoom list. A listed row may ship with no hand zoom
// only when its entry names a ruled ruling and a valid reason, and its handling.why names that ruling (ruling 8:
// the grip copy carries the hand claims; no hand pose is invented).
import type { HowToContent } from '../../../src/howto/content-types';
import { checkC3 } from './c3';

/** The rulings a no-zoom entry may name. A new one is added only with its ruling posted (D-SHIP-C3 item 4). */
export const RULED = new Set(['D-SHIP-Q1', 'D-SHIP-C3', 'D-SHIP-HANDW2', 'D-SHIP-ROPEPAIR']);   // W2: #379 6625803515, #376 6616096384
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
export function checkGripLibrary(content: HowToContent, card: { grip?: Record<string, unknown> } | null): string[] {
  const why = (content.handling as { why?: unknown }).why;
  const usesB = content.handling.archetype === 'none' && typeof why === 'string' && why.includes('D-SHIP-GRIP');
  if (!usesB) return [];
  const claimed = (['thumb', 'handContact', 'wrist'] as const).filter(k => typeof card?.grip?.[k] === 'string' && (card.grip[k] as string).trim() !== '');
  return claimed.length ? [`GRIP: ${content.id} uses D-SHIP-GRIP (b) but its card claims grip.${claimed.join(', grip.')}`] : [];
}

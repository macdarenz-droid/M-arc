// F-SHEET-COPY guard (card docs/supervisor/verify/f-sheet-copy-card.md, acceptance 1). The owner's heading rule
// (AGENTS.md "UI copy", 2026-10-01): a heading is a short label of 1-3 words, a noun phrase; never a sentence, a
// "What ..."/"How ..." question, a qualifier (", and when", ": right and wrong") or a leading The/This/About. And
// the R1 ruling as amended (D-SHEETCOPY-STOPLINE, #423): no "General guidance, not medical advice." on any sheet (the 10-01
// rule names this exact case), and "If something hurts, stop and get it checked." stays, once, the last line of Risks.
// The walk covers the app (sheet eyebrow, every section's TSX headings, every generated string of every shipped id)
// and the review pages (golden B and the 14 library layers pages). Exempt, with reasons: golden A
// (tests/howto/golden/technical-plates.html, owner byte lock) and HOWTO_LABEL (the Train button names a control).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const GEN = join(ROOT, 'src/howto/generated');
const PAGES = ['tests/howto/golden/howto-layers.html', ...['lb01', 'lb03', 'lb04', 'lb05', 'lb06', 'lb07', 'lb08', 'lb09', 'lb10', 'pilot-a', 'pilot-a3', 'pilot-b', 'pilot-b2', 'zoom'].map(b => `tests/howto/golden/library/${b}.layers.html`)];
const KIND_COUNTS = { feel: 72, ht: 72, posture: 72, hand: 8, handpair: 10 } as const;

const LEAD = /^(the|this|about|what|how|where|when|why|if)\b/i;
/** The rule's problems for one heading text ([] = it passes). A hyphenated word counts as one word. */
export function headingProblems(raw: string): string[] {
  const t = raw.replace(/\s+/g, ' ').trim(), out: string[] = [];
  const n = t ? t.split(' ').length : 0;
  if (n < 1 || n > 3) out.push(`${n} words`);
  if (/[:?…,.;]/.test(t)) out.push('punctuation');
  if (LEAD.test(t)) out.push('lead word');
  if (/right and wrong/i.test(t)) out.push('"right and wrong"');
  return out;
}

const VOID = new Set(['br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'col', 'area', 'base', 'wbr', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'use', 'stop']);
const unesc = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&hellip;/g, '…').replace(/&middot;/g, '·');
/** Every heading in an HTML string: h4/h5, .zx-h and .eyebrow, except an eyebrow inside a button or link (a control)
 *  and the camera labels (.th-cam, .z-cam, .h-cam: they name the view). Tiny tag-stack walk (no DOM in this project). */
export function headingsOf(html: string): string[] {
  const out: string[] = [], stack: { tag: string; heading: boolean; skip: boolean; text: string }[] = [];
  const re = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>|([^<]+)/g;
  for (let m; (m = re.exec(html));) {
    if (m[5] !== undefined) { for (const e of stack) if (e.heading) e.text += m[5]; continue; }
    const [, close, tagRaw, attrs, self] = m, tag = tagRaw!.toLowerCase();
    if (close) {
      const i = stack.map(e => e.tag).lastIndexOf(tag);
      if (i < 0) continue;
      for (const e of stack.splice(i)) if (e.heading && !e.skip) out.push(unesc(e.text).replace(/\s+/g, ' ').trim());
      continue;
    }
    if (self || VOID.has(tag)) continue;
    const cls = ` ${(attrs!.match(/\bclass="([^"]*)"/)?.[1] ?? '')} `;
    const inControl = stack.some(e => e.tag === 'button' || e.tag === 'a');
    const camera = /\s(th-cam|z-cam|h-cam)\s/.test(cls);
    const heading = tag === 'h4' || tag === 'h5' || / zx-h /.test(cls) || / eyebrow /.test(cls);
    stack.push({ tag, heading, skip: !heading || inControl || camera || stack.some(e => e.heading), text: '' });
  }
  return out;
}

/** Every string value in a generated module (deep). */
const stringsOf = (v: unknown, out: string[] = []): string[] => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => stringsOf(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => stringsOf(x, out));
  return out;
};
const sheetCards = (html: string) => [...html.matchAll(/<article class="sheet-card"[\s\S]*?<\/article>/g)].map(m => m[0]);

const OLD = ['Set it up', 'Where you should feel it', 'If you feel it in…', 'Risks and when to stop', 'right and wrong', 'Option: thumb over the bar', 'medical advice', 'General guidance', 'ht-disclaimer'];
const STOP = 'If something hurts, stop and get it checked.';
const STOP_END = `<p class="rk-stop">${STOP}</p></section>`;

describe('F-SHEET-COPY: sheet headings follow the owner\'s heading rule', () => {
  it('the rule itself: MA4-MA7 forms fail, the new headings pass', () => {
    for (const bad of ['Where you should feel', 'How it moves', 'The setup', 'Risks, and when', 'Hand: right and wrong', 'If you feel it in…'])
      expect([bad, headingProblems(bad).length > 0]).toEqual([bad, true]);
    for (const ok of ['Technique', 'Setup', 'Target muscles', 'Off-target feel', 'Risks', 'Hand', 'Thumbless grip option', 'Common handling mistakes'])
      expect([ok, headingProblems(ok)]).toEqual([ok, []]);
  });

  it('the app sheet eyebrow is SHEET_EYEBROW "Technique"; the Train button keeps HOWTO_LABEL', async () => {
    const src = readFileSync(join(ROOT, 'src/slices/howto/HowToSheet.tsx'), 'utf8');
    expect(src).toMatch(/export const SHEET_EYEBROW = 'Technique';/);
    expect(src).toMatch(/eyebrow=\{SHEET_EYEBROW\}/);
    expect(src).not.toMatch(/eyebrow=\{HOWTO_LABEL\}/);
  });

  it('every heading literal in the section TSX passes', () => {
    const dir = join(ROOT, 'src/slices/howto/sections'), found: string[] = [];
    for (const f of readdirSync(dir).filter(f => f.endsWith('.tsx'))) {
      const s = readFileSync(join(dir, f), 'utf8');
      for (const m of s.matchAll(/<(h[2-6])[^>]*>([^<{`$]+)<\/\1>|class="[^"]*\beyebrow\b[^"]*"[^>]*>([^<{`$]+)</g)) found.push(`${f}: ${(m[2] ?? m[3])!.trim()}`);
    }
    expect(found.length).toBeGreaterThanOrEqual(5);   // Setup, Risks, Grip, Look closer, Common handling mistakes
    expect(found.filter(h => headingProblems(h.slice(h.indexOf(': ') + 2)).length)).toEqual([]);
  });

  it('every generated string of every shipped id: headings pass, no old string remains', async () => {
    const files = readdirSync(GEN).filter(f => /^(feel|ht|posture|hand|handpair)-.*\.ts$/.test(f));
    const counts: Record<string, number> = {};
    for (const f of files) { const k = f.match(/^(handpair|feel|ht|posture|hand)-/)![1]!; counts[k] = (counts[k] ?? 0) + 1; }
    expect(counts).toEqual(KIND_COUNTS);   // MA8: a skipped id or file kind is red
    const bad: string[] = [];
    for (const f of files) {
      const mod = await import(join(GEN, f));
      for (const s of stringsOf({ ...mod })) {
        for (const h of headingsOf(s)) for (const p of headingProblems(h)) bad.push(`${f}: "${h}": ${p}`);
        for (const o of OLD) if (s.includes(o)) bad.push(`${f}: old string "${o}"`);
      }
      if (f.startsWith('ht-')) for (const z of (mod.default?.zooms ?? []) as { heading?: string }[]) if (z.heading) for (const p of headingProblems(z.heading)) bad.push(`${f}: zoom heading "${z.heading}": ${p}`);
    }
    const arche = readFileSync(join(ROOT, 'src/howto/archetypes.ts'), 'utf8');
    for (const o of ['DISCLAIMER', 'medical advice', 'Risks and when to stop']) if (arche.includes(o)) bad.push(`archetypes.ts: old string "${o}"`);
    if (!arche.includes(`export const STOP_LINE: string = ${JSON.stringify(STOP)};`)) bad.push('archetypes.ts: no STOP_LINE with the kept words (D-SHEETCOPY-STOPLINE)');
    expect(bad).toEqual([]);
  }, 60_000);   // imports ~234 generated modules: ~3.5 s alone, past vitest's 5 s default under a full parallel run

  it('no old string in the app source (HOWTO_LABEL keeps "How to do it" for the Train button)', () => {
    const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'generated' ? [] : walk(join(d, e.name))) : /\.(tsx?|css)$/.test(e.name) ? [join(d, e.name)] : []);
    const bad: string[] = [];
    for (const f of walk(join(ROOT, 'src/slices/howto'))) {
      const s = readFileSync(f, 'utf8').replace(/^\s*(\/\/|\/?\*).*$/gm, '');   // comments may name history
      for (const o of [...OLD, 'DISCLAIMER']) if (s.includes(o)) bad.push(`${f.slice(ROOT.length + 1)}: "${o}"`);
    }
    expect(bad).toEqual([]);
  });

  it('Risks.tsx ends the Risks section on the stop line (D-SHEETCOPY-STOPLINE)', () => {
    const src = readFileSync(join(ROOT, 'src/slices/howto/sections/Risks.tsx'), 'utf8');
    expect(src).toMatch(/<p class="rk-stop">\{STOP_LINE\}<\/p>\s*<\/section>/);
    expect(src.split('rk-stop').length - 1).toBe(1);
  });

  it('golden B and the 14 library layers pages: headings pass, no old string, the stop line once and last in Risks', () => {
    const bad: string[] = [];
    let cards = 0;
    for (const p of PAGES) {
      const html = readFileSync(join(ROOT, p), 'utf8'), cs = sheetCards(html);
      if (!cs.length) bad.push(`${p}: no sheet cards`);
      cards += cs.length;
      for (const c of cs) {
        for (const h of headingsOf(c)) for (const q of headingProblems(h)) bad.push(`${p}: "${h}": ${q}`);
        for (const o of OLD) if (c.includes(o)) bad.push(`${p}: old string "${o}"`);
        if (c.includes('How to do it')) bad.push(`${p}: card eyebrow "How to do it"`);
        const risks = c.match(/<section class="hw-sec risks"[\s\S]*?<\/section>/g) ?? [];
        if (risks.length !== 1 || !risks[0]!.endsWith(STOP_END) || c.split(STOP).length !== 2) bad.push(`${p}: a card without exactly one stop line ending its Risks section`);
      }
    }
    expect(cards).toBeGreaterThanOrEqual(72);
    expect(bad).toEqual([]);
  });
});

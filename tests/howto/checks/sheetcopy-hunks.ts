// F-SHEET-COPY (#423): the card's hunks in golden B's copy-lint.mjs, as [this head's text, main a4796243's text]
// (measured: main's file f568f938… against this branch's). Reversed in order, each exactly once, they give main's file
// back byte for byte (box-cap BC-2), so no other line of the file moved.
export const SC_COPYLINT_HUNKS: [string, string][] = [
  ["// lintShared(shared)    the shared red-flag boxes and the stop line (and no disclaimer).",
   "// lintShared(shared)    the shared red-flag boxes and the owner's disclaimer."],
  ["//   Stop line  shared.STOP_LINE (verbatim), the last line of Risks; no \"not medical advice\" disclaimer (F-SHEET-COPY\n//              R1 amended, D-SHEETCOPY-STOPLINE)",
   "//   Disclaimer shared.DISCLAIMER (verbatim)"],
  ["                                               // the stop line; not the plate, the sources list or alt texts\n/** The stop line, exactly (the owner's 09-30 words, kept by D-SHEETCOPY-STOPLINE). */\nexport const OWNER_STOP_LINE = 'If something hurts, stop and get it checked.';\n/** F-SHEET-COPY (owner heading rule 2026-10-01): a heading is a short noun label of 1-3 words (a hyphenated word is\n *  one); never a sentence, a question, a qualifier (\", and when\", \": right and wrong\") or a leading The/This/About. */\nexport const HEADING_MAX_WORDS = 3;\nexport const HEADING_LEAD_RE = /^(the|this|about|what|how|where|when|why|if)\\b/i;\nexport const HEADING_PUNCT_RE = /[:?\\u2026,.;]/;",
   "                                               // the disclaimer; not the plate, the sources list or alt texts\n\n/** The owner's safety line, exactly. */\nexport const OWNER_DISCLAIMER = 'General guidance, not medical advice. If something hurts, stop and get it checked.';"],
  ["  alt: [ALT_MAX_WORDS, null], sourceNote: [SOURCE_NOTE_MAX_WORDS, null], heading: [HEADING_MAX_WORDS, null], prose: [null, null],",
   "  alt: [ALT_MAX_WORDS, null], sourceNote: [SOURCE_NOTE_MAX_WORDS, null], heading: [null, null], prose: [null, null],"],
  ["  if (maxW != null && n > maxW) v(f.path, `${f.kind} > ${maxW} words`, `${n} words`);\n  if (f.kind === 'heading') {\n    if (n < 1) v(f.path, 'heading < 1 word', `${n} words`);\n    if (HEADING_LEAD_RE.test(t)) v(f.path, 'heading starts with a clause or article word', `\"${t.split(' ')[0]}\"`);\n    if (HEADING_PUNCT_RE.test(t)) v(f.path, 'heading has a qualifier or sentence punctuation', `\"${t.match(HEADING_PUNCT_RE)[0]}\"`);\n    if (/right and wrong/i.test(t)) v(f.path, 'heading carries \"right and wrong\" (the Right and Wrong labels say it)', `\"${t}\"`);\n  }",
   "  if (maxW != null && n > maxW) v(f.path, `${f.kind} > ${maxW} words`, `${n} words`);"],
  ["  const safety = boxes.reduce((a, B) => a + words(boxText(B)), 0) + words(shared.STOP_LINE ?? '');",
   "  const safety = boxes.reduce((a, B) => a + words(boxText(B)), 0) + words(shared.DISCLAIMER ?? '');"],
  ["  if (total > VISIBLE_WORDS_MAX) v('(sheet)', `visible words > ${VISIBLE_WORDS_MAX}`, `${total} (sheet copy ${spec}, red flags and stop line ${safety})`);",
   "  if (total > VISIBLE_WORDS_MAX) v('(sheet)', `visible words > ${VISIBLE_WORDS_MAX}`, `${total} (sheet copy ${spec}, red flags and disclaimer ${safety})`);"],
  ["  if ('DISCLAIMER' in shared) v('shared.DISCLAIMER', 'no \"not medical advice\" disclaimer on a sheet (F-SHEET-COPY R1, owner UI-copy rule 2026-10-01)', JSON.stringify(shared.DISCLAIMER));\n  if (shared.STOP_LINE !== OWNER_STOP_LINE) v('shared.STOP_LINE', 'the stop line must stay exactly (D-SHEETCOPY-STOPLINE)', JSON.stringify(shared.STOP_LINE));\n  // LR-23: no contact, source or evidence wording in the stop line or the boxes; no call/phone/GP/clinic in the boxes",
   "  if (shared.DISCLAIMER !== OWNER_DISCLAIMER) v('shared.DISCLAIMER', 'the owner\\'s safety line must stay exactly', JSON.stringify(shared.DISCLAIMER));\n  // LR-23: no contact, source or evidence wording in the disclaimer or the boxes; no call/phone/GP/clinic in the boxes"],
  ["  noContact('shared.STOP_LINE', shared.STOP_LINE ?? '', false);",
   "  noContact('shared.DISCLAIMER', shared.DISCLAIMER ?? '', false);"],
];
/** `text` with `hunks` reversed in order ([now, was] each); throws when a hunk is not in it exactly once. */
export function reverseHunks(text: string, hunks: [string, string][], name: string): string {
  let t = text;
  for (const [now, was] of hunks) {
    if (t.split(now).length !== 2) throw new Error(`sheetcopy: a ${name} hunk is not in the file once: ${now.slice(0, 60)}`);
    t = t.replace(now, () => was);
  }
  return t;
}
/** `text` (copy-lint.mjs) with the card's hunks reversed. */
export const toMainCopyLint = (text: string) => reverseHunks(text, SC_COPYLINT_HUNKS, 'copy-lint');

// F-SHEET-COPY (#423): the card's body hunks in the generated src/howto/archetypes.ts (from shared.mjs: the Risks heading
// in its comment, and STOP_LINE in place of DISCLAIMER), as [this head's, main a4796243's]. The header line is not body.
export const SC_ARCHETYPES_HUNKS: [string, string][] = [
  ['// GENERATED from tools/plates/layers/howto/shared.mjs (HT-5): the shared "Risks" copy, one block per joint, and the\n// stop line that ends Risks (D-SHEETCOPY-STOPLINE). No card carries its own red-flag wording (C8).',
   '// GENERATED from tools/plates/layers/howto/shared.mjs (HT-5): the shared "Risks and when to stop" copy, one block\n// per joint, plus the owner\'s one-line disclaimer. No card carries its own red-flag wording (C8).'],
  ['export const STOP_LINE: string = "If something hurts, stop and get it checked.";',
   'export const DISCLAIMER: string = "General guidance, not medical advice. If something hurts, stop and get it checked.";'],
];
export const toMainArchetypes = (text: string) => reverseHunks(text, SC_ARCHETYPES_HUNKS, 'archetypes');

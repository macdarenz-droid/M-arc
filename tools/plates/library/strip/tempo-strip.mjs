// LIB-STRIP (D-STRIP-B, -PATCH, -FORMS, -SAYS, -ROWS): the tempo strip for a plate with no sourced seconds. The plates
// page builder (build-page.mjs patchedBuilder) and the layers page builder (build-layers-page.mjs patchBuildPage) each
// replace the mirror copy's vendored tempoStrip, VENDOR_STRIP, with NOSECS_STRIP by one exact-once replacement; the
// vendored folder and golden B's are never edited, and no CSS changes. When every phase has `s`, NOSECS_STRIP draws
// the vendored output byte for byte (golden A e2bea90c…, golden B e7b81413…). When any phase has none, every bar is
// equal width and an untimed phase shows its card's cadence word, or a blank value line. Reads no files.

/** The vendored tempoStrip, byte for byte (vendor artifact/build-page.mjs; golden B's layers/artifact/build-page.mjs). */
export const VENDOR_STRIP = `const tempoStrip = tempo => {
  const words = tempo.map(t => \`\${plain(t.phase).toLowerCase()} \${t.s} second\${t.s === 1 ? '' : 's'}\`).join(', ');
  return \`<div class="tempo" role="img" aria-label="Tempo: \${esc(words)}">\${tempo.map(t =>
    \`<div class="tempo-seg\${t.move ? ' move' : ''}" style="flex:\${t.s} 1 0"><i></i><div class="tempo-label"><b>\${esc(t.phase)}</b><span>\${t.s} s</span></div></div>\`).join('')}</div>\`;
};
`;

/** The replacement: any phase without `s` -> every bar flex 1, the word (escaped) or &nbsp; on its value line. */
export const NOSECS_STRIP = `const tempoStrip = tempo => {
  const timed = tempo.every(t => t.s != null);   // LIB-STRIP: a phase with no sourced seconds -> no bar stands for time
  const say = t => (t.s != null ? \`\${plain(t.phase).toLowerCase()} \${t.s} second\${t.s === 1 ? '' : 's'}\` : [plain(t.phase).toLowerCase(), t.word?.toLowerCase()].filter(Boolean).join(' '));
  const val = t => (t.s != null ? \`\${t.s} s\` : t.word ? esc(t.word) : '&nbsp;');
  return \`<div class="tempo" role="img" aria-label="Tempo: \${esc(tempo.map(say).join(', '))}">\${tempo.map(t =>
    \`<div class="tempo-seg\${t.move ? ' move' : ''}" style="flex:\${timed ? t.s : 1} 1 0"><i></i><div class="tempo-label"><b>\${esc(t.phase)}</b><span>\${val(t)}</span></div></div>\`).join('')}</div>\`;
};
`;

/** D-STRIP-FORMS: the closed word table and the text forms each word may come from. Grows only by a supervisor ruling. */
export const FORMS = {
  Controlled: ['controlled', 'control'],
  Slow: ['slow', 'slowly'],
  Smooth: ['smooth', 'smoothly'],
  Quicker: ['quicker'],
  Quick: ['quick'],
  Explosive: ['explosive'],
  Crisp: ['crisp'],
};
/** D-STRIP-SAYS: direction terms; a `says` and its phase name that both carry one must agree. */
export const DIRECTION = {
  down: ['down', 'descent', 'descend', 'lower', 'lowering'],
  up: ['up', 'rise', 'drive', 'jump', 'take-off'],
};

const wordRe = w => new RegExp(`(?<![A-Za-z])${w.replace(/[-]/g, '\\-')}(?![A-Za-z])`, 'i');
/** Whole-word, case-insensitive. */
export const hasWord = (text, w) => typeof text === 'string' && wordRe(w).test(text);
/** True when some form of FORMS word `word` is a whole word in `text`. */
export const formIn = (word, text) => Object.hasOwn(FORMS, word) && FORMS[word].some(f => hasWord(text, f));
/** The directions ('down', 'up') whose terms are whole words in `text`. */
export const directionsOf = text => Object.keys(DIRECTION).filter(d => DIRECTION[d].some(t => hasWord(text, t)));
/** True when a tempo list has an entry with no `s` (an untimed tempo). */
export const isUntimed = tempo => Array.isArray(tempo) && tempo.some(t => t && t.s == null);

/**
 * The word checks shared by the validator and H6 (D-STRIP-H6, -SHAPE), for an untimed tempo against its verified
 * card's plate.tempo.text. Returns codes: 'text' (no text), 'noword' (no entry has a word), 'word:<i>' (word i is not a
 * FORMS key, or no form of it is a whole word in the text), 'word:<i>:timed' (entry i has both `s` and `word`).
 */
export function wordProblems(tempo, text) {
  const out = [];
  if (typeof text !== 'string' || !text) out.push('text');
  for (const [i, t] of tempo.entries()) {
    if (!('word' in t)) continue;
    if (t.s != null) out.push(`word:${i}:timed`);
    else if (!formIn(t.word, text)) out.push(`word:${i}`);
  }
  if (!tempo.some(t => 'word' in t)) out.push('noword');
  return out;
}

/** The card and spec tempo from untimed tempo-map rows: { phase, move?, word? } in that order; claim, says, blank dropped. */
export function tempoOf(rows) {
  return rows.map(r => {
    if ('from' in r || 's' in r) throw new Error(`tempoOf: ${r.phase} is a timed row (a lane's D-LIB8M-TEMPO map builds it)`);
    return { phase: r.phase, ...(r.move ? { move: true } : {}), ...('word' in r ? { word: r.word } : {}) };
  });
}

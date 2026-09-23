/** Plain-words presentation helpers for Escobar's answers (pure, tested in tests/escobar/ui.test.ts). */

const PAST: Array<[RegExp, string]> = [
  [/^Reading\b/, 'Read'], [/^Checking\b/, 'Checked'], [/^Counting\b/, 'Counted'], [/^Drawing\b/, 'Drew'],
  [/^Looking\b/, 'Looked'], [/^Working out\b/, 'Worked out'], [/^Searching\b/, 'Searched'], [/^Opening\b/, 'Opened'],
  [/^Finding\b/, 'Found'], [/^Calculating\b/, 'Calculated'], [/^Preparing\b/, 'Prepared'], [/^Drafting\b/, 'Drafted'],
  [/^Remembering\b/, 'Remembered'], [/^Forgetting\b/, 'Forgot'], [/^Getting\b/, 'Got'], [/^Adjusting\b/, 'Adjusted'],
  [/^Noting\b/, 'Noted'], [/^Adding\b/, 'Added'],
];

/** "Reading your Lat Pulldown history…" → "Read your Lat Pulldown history". */
export function pastTense(label: string): string {
  const s = label.replace(/…$/, '').trim();
  for (const [re, to] of PAST) if (re.test(s)) return s.replace(re, to);
  return s;
}

/**
 * Pulls every fact citation (`⟦f12⟧`, `⟦f3,f4⟧`) out of one sentence so the sentence carries a
 * single source marker. Knowledge-card citations (`⟦k:…⟧`) stay in place.
 */
export function splitCitations(sentence: string): { text: string; ids: string[] } {
  const ids: string[] = [];
  const text = sentence
    .replace(/⟦\s*(f\d+(?:\s*,\s*f\d+)*)\s*⟧/g, (_m, list: string) => { for (const id of list.split(',').map(x => x.trim())) if (!ids.includes(id)) ids.push(id); return ''; })
    .replace(/\s+([.,;:!?—–)])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ');
  return { text, ids };
}

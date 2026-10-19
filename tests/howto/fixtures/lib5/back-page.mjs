// LIB-6-PM (D-LIB6PM-FIXTURE, amending D-LIB5-PAGE's helper): E1's back-flagged How-to, for S5-L and the LIB-6-PM page
// evidence. In a LIB-2b staged tree (tests/howto/fixtures/lib2b/fixture.mjs stageTree), the scratch row's How-to (a
// clone of golden B's pull-up) gets exactly these replacements, each exact-once or it throws:
//   - riskFlags ['wrist', 'shoulder', 'elbow'] -> ['wrist', 'back'];
//   - the "top" row's redFlag 'shoulder' -> 'back' (pull_up.howto.mjs:285), and the elbow row's redFlag dropped (:289);
//   - SOURCES gains 'nhs-back' (back-pain-box.json's sources entry, cite in the nhs-* form, use 'CONSENSUS').
// Measured on E1's tree: 390 visible words before the box (copy-lint drops 'back'), so 440 with a 50-word box.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const NHS_BACK = "  'nhs-back': { id: 'nhs-back', cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/', kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },   // the back box's source (D-LIB6PM-FIXTURE)\n";
const SHOULDER_SOURCE = "  'nhs-shoulder-pain': { id: 'nhs-shoulder-pain', cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/', kind: 'guideline', access: 'full', checked: CHECKED },   // RED_FLAG_SHOULDER source\n";
export const EDITS = [
  ["riskFlags: ['wrist', 'shoulder', 'elbow']", "riskFlags: ['wrist', 'back']"],
  ["zoom: 'top', redFlag: 'shoulder', ", "zoom: 'top', redFlag: 'back', "],
  ["redFlag: 'elbow', claim", 'claim'],
  [SHOULDER_SOURCE, SHOULDER_SOURCE + NHS_BACK],
];

/** Exact-once replacement, or throws naming the text. */
export function replaceOnce(text, from, to) {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`back-page: expected one ${JSON.stringify(from)}, found ${n}`);
  return text.replace(from, () => to);
}

/** The back-flagged How-to text from E1's How-to text. */
export const backPageText = text => EDITS.reduce((t, [from, to]) => replaceOnce(t, from, to), text);

/** Rewrites the staged tree's How-to (`howto`: repo-relative, LIB-2b fixture HOWTO) in place. */
export function toBackPage(root, howto) {
  const file = join(root, howto);
  writeFileSync(file, backPageText(readFileSync(file, 'utf8')));
  return file;
}

// HT-4 (HT4-A3): C7, copy style lint. Limits are the owner's "shorter, concept-first" lengths of 2026-09-30, which
// replace GRIP-AND-FEEL-ARCHITECTURE.md 6.2's own lengths for the golden-B pin b3a90af (README.md, "Compact-copy
// update" table); the GA 6.2 bans still apply in full. Values match the vendored, already-proven
// tools/plates/layers/artifact/copy-lint.mjs's exported constants exactly, kept as named constants here per the
// supervisor (PR #107) so a future length change is a one-line edit to LIMITS, not a search-and-replace.
import type { HowToContent } from '../../../src/howto/content-types';

/** Length caps (README.md "Compact-copy update" table = copy-lint.mjs's own exported constants). */
export const LIMITS = {
  anySentenceWords: 15,
  feelLineWords: 20,
  feelLineSentences: 2,
  rowWhereWords: 6,
  rowMeansWords: 12,
  rowMeansSentences: 1,
  rowFixWords: 15,
  rowFixSentences: 2,
  leadLineWords: 22, // gripLine, setupLine, mistakeLine
  leadLineSentences: 2,
  setupStepWords: 12,
  setupMaxSteps: 5,
  mistakesMax: 3,
  mistakeLabelWords: 5,
  mistakeFixWords: 12,
  feelRowsMax: 4,
  captionWords: 10,
  risksMax: 3,
  riskWords: 14,
  altWords: 30,
  labelMinWords: 1,
  labelMaxWords: 3,
  cueWords: 6,
};

const BANNED_CHARS: Array<[RegExp, string]> = [
  [/—/, 'em dash'],
  [/(?<!\d)–|–(?!\d)/, 'en dash used as punctuation'],
  [/!/, '"!"'],
  [/\p{Extended_Pictographic}/u, 'emoji'],
  [/%/, '"%"'],
  [/;/, 'semicolon'],
  [/\([A-Z][A-Za-z-]+[^)]*\b(19|20)\d\d\)|\b[A-Z][a-z]+ et al\b|\b[A-Z][a-z]+ (19|20)\d\d\b/, 'a study citation'],
  [/\bEMG\b/i, '"EMG"'],
  [/\bMVI?C\b/, '"MVC"/"MVIC"'],
  [/\bmind[- ]muscle\b/i, '"mind-muscle"'],
  [/\bengag(e|es|ed|ing)\b/i, '"engage"'],
  [/\bactivat(e|es|ed|ing|ion|ions)\b/i, '"activate"'],
  [/\bfir(e|es|ed|ing)\b/i, '"fire"'],
  [/\btorch(es|ed|ing)?\b/i, '"torch"'],
  [/\bblast(s|ed|ing)?\b/i, '"blast"'],
  [/\bsculpt\w*/i, '"sculpt"'],
  [/\btone[ds]?\b/i, '"tone"'],
  [/\byour core\b/i, '"your core"'],
  [/\bunlock your (potential|gains)\b/i, '"unlock your potential/gains"'],
  [/\bmaximi[sz]\w*/i, '"maximise"'],
  [/\boptimal\w*/i, '"optimal"'],
  [/\boptimi[sz]\w*/i, '"optimise"'],
  [/\bultimate\w*/i, '"ultimate"'],
  [/\bcrucial\w*/i, '"crucial"'],
  [/\bessential\w*/i, '"essential"'],
  [/\bkey to\b/i, '"key to"'],
  [/\bgame[- ]?changer\b/i, '"game changer"'],
  [/\bpowerhouse\b/i, '"powerhouse"'],
  [/\beffortless\w*/i, '"effortless"'],
  [/\bseamless\w*/i, '"seamless"'],
  [/\belevat(e|es|ing)\b/i, '"elevate"'],
  [/\bjourney\w*/i, '"journey"'],
  [/\bsimply\b/i, '"simply"'],
  [/\bmake sure\b/i, '"make sure"'],
  [/\bensur(e|es|ed|ing)\b/i, '"ensure"'],
  [/\b(it'?s|it is) important\b/i, '"it\'s important"'],
  [/\bremember to\b/i, '"remember to"'],
  [/\bfocus on\b/i, '"focus on"'],
  [/\bthroughout the movement\b/i, '"throughout the movement"'],
  [/\bcontrolled manner\b/i, '"controlled manner"'],
  [/\bproper form\b/i, '"proper form"'],
  [/\bnot\b[^.,]{1,40}\bbut\b/i, '"not X but Y"'],
  [/\bit'?s not\b[^.]{1,40},\s*it'?s\b/i, '"it\'s not X, it\'s Y"'],
  [/\bnot just\b[^.]*\bbut\b/i, '"not just ... but"'],
  [/\b(pectoralis|deltoids?|latissimus|trapezius|rectus|supraspinatus|scapholunate|TFCC|iliopsoas|erectors?)\b/i, 'a Latin/clinical name'],
  [/\bpink(y|ie|ies)\b/i, '"pinky" (say "little finger")'],
];

const OWN_RED_FLAG = /get it checked|see a doctor|\bGP\b|physio|numb|tingl|swell/i;

function scanText(field: string, text: string): string[] {
  const bad: string[] = [];
  for (const [re, name] of BANNED_CHARS) if (re.test(text)) bad.push(`C7: ${field}: contains ${name}`);
  return bad;
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const sentences = (s: string) => s.split(/[.!?]+/).map(x => x.trim()).filter(Boolean);

function checkLength(field: string, text: string, maxWords: number, maxSentences: number | null): string[] {
  const bad: string[] = [];
  if (words(text) > maxWords) bad.push(`C7: ${field}: ${words(text)} words, at most ${maxWords}`);
  const sents = sentences(text);
  if (maxSentences != null && sents.length > maxSentences) bad.push(`C7: ${field}: ${sents.length} sentences, at most ${maxSentences}`);
  for (const s of sents) if (words(s) > LIMITS.anySentenceWords) bad.push(`C7: ${field}: a sentence has ${words(s)} words, at most ${LIMITS.anySentenceWords}`);
  return bad;
}

function checkListCap(field: string, length: number, max: number, what: string): string[] {
  return length > max ? [`C7: ${field}: ${length} ${what}, at most ${max}`] : [];
}

export function checkC7(content: HowToContent): string[] {
  const bad: string[] = [];
  const scan = (field: string, text: string | undefined) => { if (text) bad.push(...scanText(field, text)); };

  const h = content.handling;
  if (h.archetype !== 'none') {
    scan('handling.gripLine', h.gripLine);
    scan('handling.cue', h.cue);
    scan('handling.width.text', h.width?.text);
    scan('handling.handleChoice.sore', h.handleChoice?.sore);
    if ('limitText' in h.wrist) scan('handling.wrist.limitText', h.wrist.limitText);
    bad.push(...checkLength('handling.gripLine', h.gripLine, LIMITS.leadLineWords, LIMITS.leadLineSentences));
    bad.push(...checkLength('handling.cue', h.cue, LIMITS.cueWords, null));
  }
  content.setup.forEach((s, i) => {
    scan(`setup[${i}]`, s.text);
    bad.push(...checkLength(`setup[${i}]`, s.text, LIMITS.setupStepWords, null));
  });
  bad.push(...checkListCap('setup', content.setup.length, LIMITS.setupMaxSteps, 'setup steps'));
  content.posture.forEach((p, i) => { scan(`posture[${i}] (${p.key})`, p.detail); });
  scan('feel.feelLine', content.feel.feelLine);
  bad.push(...checkLength('feel.feelLine', content.feel.feelLine, LIMITS.feelLineWords, LIMITS.feelLineSentences));
  if (!content.feel.feelLine.startsWith('You should feel this')) bad.push('C7: feel.feelLine does not start with "You should feel this"');
  content.feel.rows.forEach((r, i) => {
    scan(`feel.rows[${i}] (${r.key}).where`, r.where);
    scan(`feel.rows[${i}] (${r.key}).means`, r.means);
    scan(`feel.rows[${i}] (${r.key}).fix`, r.fix);
    bad.push(...checkLength(`feel.rows[${i}] (${r.key}).where`, r.where, LIMITS.rowWhereWords, null));
    bad.push(...checkLength(`feel.rows[${i}] (${r.key}).means`, r.means, LIMITS.rowMeansWords, LIMITS.rowMeansSentences));
    bad.push(...checkLength(`feel.rows[${i}] (${r.key}).fix`, r.fix, LIMITS.rowFixWords, LIMITS.rowFixSentences));
    if (OWN_RED_FLAG.test(r.means) || OWN_RED_FLAG.test(r.fix)) bad.push(`C7: feel.rows[${i}] (${r.key}): own red-flag wording (link redFlag, C8)`);
  });
  bad.push(...checkListCap('feel.rows', content.feel.rows.length, LIMITS.feelRowsMax, 'feel rows'));
  content.zooms.forEach((z, i) => {
    scan(`zooms[${i}] (${z.key}).caption.right`, z.caption.right);
    scan(`zooms[${i}] (${z.key}).caption.wrong`, z.caption.wrong);
    bad.push(...checkLength(`zooms[${i}] (${z.key}).caption.right`, z.caption.right, LIMITS.captionWords, null));
    bad.push(...checkLength(`zooms[${i}] (${z.key}).caption.wrong`, z.caption.wrong, LIMITS.captionWords, null));
    bad.push(...checkLength(`zooms[${i}] (${z.key}).alt.right`, z.alt.right, LIMITS.altWords, null));
    bad.push(...checkLength(`zooms[${i}] (${z.key}).alt.wrong`, z.alt.wrong, LIMITS.altWords, null));
  });
  scan('copy.setupLine', content.copy.setupLine);
  scan('copy.mistakeLine', content.copy.mistakeLine);
  bad.push(...checkLength('copy.setupLine', content.copy.setupLine, LIMITS.leadLineWords, LIMITS.leadLineSentences));
  bad.push(...checkLength('copy.mistakeLine', content.copy.mistakeLine, LIMITS.leadLineWords, LIMITS.leadLineSentences));
  content.mistakes.forEach((m, i) => {
    scan(`mistakes[${i}] (${m.key}).title`, m.title);
    scan(`mistakes[${i}] (${m.key}).fix`, m.fix);
    bad.push(...checkLength(`mistakes[${i}] (${m.key}).title`, m.title, LIMITS.mistakeLabelWords, null));
    bad.push(...checkLength(`mistakes[${i}] (${m.key}).fix`, m.fix, LIMITS.mistakeFixWords, null));
    if (OWN_RED_FLAG.test(m.fix)) bad.push(`C7: mistakes[${i}] (${m.key}).fix: own red-flag wording (link redFlag, C8)`);
  });
  bad.push(...checkListCap('mistakes', content.mistakes.length, LIMITS.mistakesMax, 'handling mistakes'));
  content.risks.forEach((r, i) => {
    scan(`risks[${i}] (${r.key})`, r.text);
    bad.push(...checkLength(`risks[${i}] (${r.key})`, r.text, LIMITS.riskWords, null));
  });
  bad.push(...checkListCap('risks', content.risks.length, LIMITS.risksMax, 'risk lines'));

  return bad;
}

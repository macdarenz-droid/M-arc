// HT-4 (HT4-A3): C7, copy style lint (GRIP-AND-FEEL-ARCHITECTURE.md 6.2). Scans every user-copy field; golden plate
// strings are exempt (L2 freezes them, and they are not part of HowToContent - the plate lives in plates.json).
import type { HowToContent } from '../../../src/howto/content-types';

const BANNED_CHARS: Array<[RegExp, string]> = [
  [/—/, 'em dash'],
  [/(?<=\S)–(?=\S)/, 'en dash used as punctuation'],
  [/!/, '"!"'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'emoji'],
  [/%/, '"%"'],
  [/\d+\s*%/, 'a number followed by a percent sign'],
  [/;/, 'semicolon'],
  [/\([A-Z][a-zA-Z]+\s+\d{4}\)/, 'a study citation'],
  [/\b[A-Z][a-zA-Z]+\s+et al\.?/, 'a study citation ("et al.")'],
  [/\bEMG\b/, '"EMG"'],
  [/\bMVI?C\b/, '"MVC"/"MVIC"'],
  [/mind-muscle/i, '"mind-muscle"'],
];

const BANNED_PHRASES = [
  'engage', 'activate', 'activation', 'firing', 'torch', 'blast', 'sculpt', 'toned', 'tone your', 'your core',
  'unlock your potential', 'unlock your gains', 'maximise', 'maximize', 'optimal', 'optimise', 'optimize', 'ultimate',
  'crucial', 'essential', 'key to', 'game changer', 'powerhouse', 'effortless', 'seamless', 'elevate', 'journey',
  'simply', 'make sure', 'ensure', "it's important", 'remember to', 'focus on', 'throughout the movement',
  'controlled manner', 'proper form', 'pinky',
];

const LATIN_NAMES = ['pectoralis', 'deltoid', 'latissimus', 'trapezius', 'rectus', 'supraspinatus', 'scapholunate', 'TFCC', 'iliopsoas', 'erector'];

const NOT_BUT = /\bnot\b[^.,]{1,40}\bbut\b/i;

function scanText(field: string, text: string): string[] {
  const bad: string[] = [];
  for (const [re, name] of BANNED_CHARS) if (re.test(text)) bad.push(`C7: ${field}: contains ${name}`);
  const lower = text.toLowerCase();
  for (const p of BANNED_PHRASES) if (lower.includes(p)) bad.push(`C7: ${field}: banned phrase "${p}"`);
  for (const n of LATIN_NAMES) if (new RegExp(`\\b${n}\\b`, 'i').test(text)) bad.push(`C7: ${field}: Latin/clinical name "${n}"`);
  if (NOT_BUT.test(text)) bad.push(`C7: ${field}: "not X but Y" structure`);
  return bad;
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const sentences = (s: string) => s.split(/[.!?]+/).map(x => x.trim()).filter(Boolean);

function checkLength(field: string, text: string, maxWords: number, maxSentences: number): string[] {
  const bad: string[] = [];
  if (words(text) > maxWords) bad.push(`C7: ${field}: ${words(text)} words, at most ${maxWords}`);
  const sents = sentences(text);
  if (sents.length > maxSentences) bad.push(`C7: ${field}: ${sents.length} sentences, at most ${maxSentences}`);
  for (const s of sents) if (words(s) > 25) bad.push(`C7: ${field}: a sentence has ${words(s)} words, at most 25`);
  return bad;
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
    bad.push(...checkLength('handling.gripLine', h.gripLine, 45, 3));
    bad.push(...checkLength('handling.cue', h.cue, 8, 1));
  }
  content.setup.forEach((s, i) => { scan(`setup[${i}]`, s.text); });
  content.posture.forEach((p, i) => { scan(`posture[${i}] (${p.key})`, p.detail); });
  scan('feel.feelLine', content.feel.feelLine);
  bad.push(...checkLength('feel.feelLine', content.feel.feelLine, 40, 2));
  if (!content.feel.feelLine.startsWith('You should feel this')) bad.push('C7: feel.feelLine does not start with "You should feel this"');
  content.feel.rows.forEach((r, i) => {
    scan(`feel.rows[${i}] (${r.key}).where`, r.where);
    scan(`feel.rows[${i}] (${r.key}).means`, r.means);
    scan(`feel.rows[${i}] (${r.key}).fix`, r.fix);
    bad.push(...checkLength(`feel.rows[${i}] (${r.key}).means`, r.means, 30, 2));
    bad.push(...checkLength(`feel.rows[${i}] (${r.key}).fix`, r.fix, 30, 2));
  });
  content.zooms.forEach((z, i) => {
    scan(`zooms[${i}] (${z.key}).caption.right`, z.caption.right);
    scan(`zooms[${i}] (${z.key}).caption.wrong`, z.caption.wrong);
    if (words(z.caption.right) > 14) bad.push(`C7: zooms[${i}] (${z.key}).caption.right: ${words(z.caption.right)} words, at most 14`);
    if (words(z.caption.wrong) > 14) bad.push(`C7: zooms[${i}] (${z.key}).caption.wrong: ${words(z.caption.wrong)} words, at most 14`);
  });
  scan('copy.setupLine', content.copy.setupLine);
  scan('copy.mistakeLine', content.copy.mistakeLine);
  bad.push(...checkLength('copy.setupLine', content.copy.setupLine, 45, 3));
  bad.push(...checkLength('copy.mistakeLine', content.copy.mistakeLine, 45, 3));
  content.mistakes.forEach((m, i) => {
    scan(`mistakes[${i}] (${m.key}).title`, m.title);
    scan(`mistakes[${i}] (${m.key}).fix`, m.fix);
    if (words(m.title) > 10) bad.push(`C7: mistakes[${i}] (${m.key}).title: ${words(m.title)} words, at most 10`);
    bad.push(...checkLength(`mistakes[${i}] (${m.key}).fix`, m.fix, 30, 2));
  });

  return bad;
}

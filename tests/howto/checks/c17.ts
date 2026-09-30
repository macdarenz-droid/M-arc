// HT-4 (HT4-A3): C17, no network. Scans How-to source files for fetch(/XMLHttpRequest/Worker or an http(s) URL
// outside the source citations (a URL string is allowed only as a Source.url value, never in code).
//
// D-HT4-C17 (supervisor ruling on PR #107, in reply to HT-7's note, 2026-09-30): golden B's own SVG markup carries
// the XML namespace identifiers `xmlns="http://www.w3.org/2000/svg"` and `xmlns:xlink="http://www.w3.org/1999/xlink"`
// (tools/plates/layers/engine/hand.mjs and feelmap.mjs; pinned bytes HT-6/HT-7 ship byte-for-byte). Neither is ever
// fetched - an XML namespace is an identifier, not a network call - so C17 allows exactly these two whole attribute
// forms and nothing else: the same URL anywhere else (an href, a CSS url(...), inside fetch(), or an xmlns pointing
// at a different host) still fails, same as any other bare URL.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BANNED = [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bnew Worker\s*\(/];
const URL_RE = /https?:\/\/[^\s'"`)]+/g;
/** Exactly these whole attributes, either quote style - never a bare occurrence of the same URL elsewhere. */
const ALLOWED_XMLNS_ATTRS = [
  /xmlns=(["'])http:\/\/www\.w3\.org\/2000\/svg\1/g,
  /xmlns:xlink=(["'])http:\/\/www\.w3\.org\/1999\/xlink\1/g,
];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : statSync(p).isFile() ? [p] : [];
  });
}

/** `allowedUrls` are the Source.url values already accounted for elsewhere (the source registry), never banned. */
export function checkC17(dirs: readonly string[], allowedUrls: ReadonlySet<string> = new Set()): string[] {
  const bad: string[] = [];
  for (const dir of dirs) {
    let files: string[];
    try { files = walk(dir); } catch { continue; }
    for (const f of files.filter(f => /\.(ts|tsx|mjs|js)$/.test(f))) {
      const text = readFileSync(f, 'utf8');
      for (const re of BANNED) if (re.test(text)) bad.push(`C17: ${f}: matches ${re}`);
      let scanned = text;
      for (const re of ALLOWED_XMLNS_ATTRS) scanned = scanned.replace(re, m => ' '.repeat(m.length));
      for (const m of scanned.matchAll(URL_RE)) if (!allowedUrls.has(m[0])) bad.push(`C17: ${f}: URL "${m[0]}" outside the source citations`);
    }
  }
  return bad;
}

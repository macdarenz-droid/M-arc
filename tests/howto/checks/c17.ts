// HT-4 (HT4-A3): C17, no network. Scans How-to source files for fetch(/XMLHttpRequest/Worker or an http(s) URL
// outside the source citations (a URL string is allowed only as a Source.url value, never in code).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BANNED = [/\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bnew Worker\s*\(/];
const URL_RE = /https?:\/\/[^\s'"`)]+/g;

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
      for (const m of text.matchAll(URL_RE)) if (!allowedUrls.has(m[0])) bad.push(`C17: ${f}: URL "${m[0]}" outside the source citations`);
    }
  }
  return bad;
}

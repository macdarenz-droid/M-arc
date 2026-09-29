#!/usr/bin/env node
// Renders docs/PRIVACY-POLICY.md to a static HTML page for GitHub Pages (DOC-2).
// Supports only the markdown this one file actually uses: #/## headings, blank-line
// paragraphs, "- " list items, **bold** spans and bare https:// links.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s) => {
  let out = escapeHtml(s);
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1">$1</a>');
  return out;
};

export function renderPrivacyPolicy(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const body = [];
  let list = null;
  let para = [];
  const flushPara = () => {
    if (para.length) {
      body.push(`<p>${inline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      body.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`);
      list = null;
    }
  };
  let title = 'M/ARC privacy policy';
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('# ')) {
      flushPara();
      flushList();
      title = line.slice(2).trim();
      body.push(`<h1>${inline(title)}</h1>`);
    } else if (line.startsWith('## ')) {
      flushPara();
      flushList();
      body.push(`<h2>${inline(line.slice(3).trim())}</h2>`);
    } else if (line.startsWith('- ')) {
      flushPara();
      if (!list) list = [];
      list.push(line.slice(2).trim());
    } else if (line === '') {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body { font: 16px/1.6 system-ui, sans-serif; max-width: 760px; margin: 0 auto; padding: 24px 16px 64px; color: #1a1a1a; }
  h1 { font-size: 1.6rem; }
  h2 { font-size: 1.15rem; margin-top: 2em; }
  a { color: #0a5cff; }
  @media (prefers-color-scheme: dark) {
    body { color: #e8e8e8; background: #111; }
    a { color: #7ab2ff; }
  }
</style>
</head>
<body>
${body.join('\n')}
</body>
</html>
`;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const root = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
  const markdown = readFileSync(path.join(root, 'docs/PRIVACY-POLICY.md'), 'utf8');
  const html = renderPrivacyPolicy(markdown);
  const outDir = path.join(root, 'site/privacy');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`Wrote ${path.join(outDir, 'index.html')}`);
}

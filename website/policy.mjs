// The privacy policy on /privacy/ (DOC-3). docs/PRIVACY-POLICY.md is the one source: the site build renders it into the page, and
// both the build and the site gate run checkPolicy on the result, so a page that loses a section Google Play requires never ships.
// Plain JavaScript so the app's typecheck never sees it. The renderer supports only the markdown that file uses: one "# " title,
// "## " sections, blank-line paragraphs, "- " list items, **bold** spans, bare https:// links and bare e-mail addresses. A paragraph
// that is nothing but a bold label ending in ":" (such as "**Recipients:**") becomes a subhead for the list after it.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const slug = (s) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Bold, links and e-mail addresses; a sentence's closing punctuation stays outside the link. */
function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/https:\/\/[^\s<]+?(?=[.,;:)]?(?:\s|$))/g, (u) => `<a class="plink" href="${u}" rel="noopener">${u}</a>`)
    .replace(/(?<![\w.@/])[\w.+-]+@[\w-]+(?:\.[\w-]+)+(?<!\.)/g, (m) => `<a class="plink" href="mailto:${m}">${m}</a>`);
}

/** Splits the markdown into blocks: { t: 'h1' | 'h2' | 'p' | 'ul', text | items }. */
function blocks(md) {
  const out = [];
  let para = null;
  let list = null;
  const flush = () => { if (para) out.push({ t: 'p', text: para.join(' ') }); if (list) out.push({ t: 'ul', items: list }); para = list = null; };
  for (const raw of md.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (line.startsWith('# ')) { flush(); out.push({ t: 'h1', text: line.slice(2).trim() }); }
    else if (line.startsWith('## ')) { flush(); out.push({ t: 'h2', text: line.slice(3).trim() }); }
    else if (line.startsWith('- ')) { if (para) flush(); (list ||= []).push(line.slice(2).trim()); }
    else if (line === '') flush();
    else { if (list) flush(); (para ||= []).push(line); }
  }
  flush();
  return out;
}

const blockHtml = (b) => {
  if (b.t === 'ul') return `<ul class="plist">${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
  const label = b.text.match(/^\*\*([^*]+):\*\*$/);
  if (label) return `<h3 id="${slug(label[1])}">${esc(label[1])}</h3>`;
  return `<p>${inline(b.text)}</p>`;
};

/** Renders the policy: the title, the effective-date line and the sections, each section a band that alternates with the next.
 *  The paragraphs before the first "## " become the "Policy" band (who makes the app, the contact address). */
export function renderPolicy(md) {
  const all = blocks(md);
  const h1 = all.find((b) => b.t === 'h1');
  const dateBlock = all.find((b) => b.t === 'p' && /^Effective date:/.test(b.text));
  if (!h1) throw new Error('docs/PRIVACY-POLICY.md: no "# " title');
  if (!dateBlock) throw new Error('docs/PRIVACY-POLICY.md: no "Effective date:" line');
  const sections = [{ title: 'Policy', id: 'about', body: [] }];
  for (const b of all) {
    if (b === h1 || b === dateBlock) continue;
    if (b.t === 'h2') sections.push({ title: b.text, id: slug(b.text), body: [] });
    else sections.at(-1).body.push(b);
  }
  const ids = new Set();
  for (const s of sections) { if (ids.has(s.id)) throw new Error(`docs/PRIVACY-POLICY.md: two sections share the id "${s.id}"`); ids.add(s.id); }
  const body = sections.map((s, i) => `<section class="band${i % 2 ? '' : ' lift'} policy" id="${s.id}" aria-labelledby="${s.id}-h" tabindex="-1">
  <div class="wrap">
    <div class="prose r">
      <h2 id="${s.id}-h">${esc(s.title)}</h2>
      ${s.body.map(blockHtml).join('\n      ')}
    </div>
  </div>
</section>`).join('\n');
  return { title: h1.text, effective: `<p class="effective mono" id="effective">${inline(dateBlock.text)}</p>`, body, toc: sections.map((s) => ({ id: s.id, title: s.title })) };
}

/** Everything inside the element whose opening tag carries id="<id>", up to that element's own closing tag (same tag name). */
function region(html, id) {
  const open = new RegExp(`<(section|h3|p)\\b[^>]*\\bid="${id}"[^>]*>`).exec(html);
  if (!open) return null;
  const rest = html.slice(open.index + open[0].length);
  if (open[1] === 'h3') return rest.slice(0, rest.search(/<h[23]\b|<\/section>/)); // a subhead runs to the next heading
  return rest.slice(0, rest.indexOf(`</${open[1]}>`));
}
const text = (h) => (h ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** The sections Google Play's privacy-policy rules ask for, each with what must be in it. A check returns true when it holds. */
export const REQUIRED = [
  ['title "Privacy Policy" in the h1', (h) => /<h1\b[^>]*>[^<]*Privacy Policy\s*<\/h1>/.test(h)],
  ['effective date', (h) => /^Effective date: \d{4}-\d{2}-\d{2}\b/.test(text(region(h, 'effective')))],
  ['contact: developer and privacy e-mail', (h) => { const r = region(h, 'about'); return !!r && /is made by \S/.test(text(r)) && /href="mailto:[^"@\s]+@[^"\s]+\.[a-z]+"/.test(r); }],
  ['third parties: Cloudflare and Anthropic named', (h) => { const t = text(region(h, 'recipients')); return /\bCloudflare\b/.test(t) && /\bAnthropic\b/.test(t); }],
  ['retention and deletion', (h) => { const del = text(region(h, 'data-deletion')); const all = text(h); return /\bdeleted after 3 days\b/.test(all) && /\b90 days, then deletes them\b/.test(all) && /\bReset everything\b/.test(del); }],
  ['children: 18+', (h) => /\b18\+/.test(text(region(h, 'children')))],
  ['applicable law', (h) => /\bPrivacy Act 1988\b/.test(text(region(h, 'applicable-law'))) && /\bData Privacy Act of 2012\b/.test(text(region(h, 'applicable-law')))],
  ['changes: how changes are announced', (h) => /\bnew date\b/.test(text(region(h, 'changes')))],
];

/** The names of the required sections missing from a rendered page; empty when the page is complete. */
export const checkPolicy = (html) => REQUIRED.filter(([, ok]) => !ok(html)).map(([name]) => name);

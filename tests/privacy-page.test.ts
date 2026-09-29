/** scripts/build-privacy-page.mjs renders docs/PRIVACY-POLICY.md for GitHub Pages (DOC-2). */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderPrivacyPolicy } from '../scripts/build-privacy-page.mjs';

const markdown = readFileSync(new URL('../docs/PRIVACY-POLICY.md', import.meta.url), 'utf8');

describe('build-privacy-page', () => {
  it('renders the current policy with no leftover [OWNER: ...] placeholder', () => {
    const html = renderPrivacyPolicy(markdown);
    expect(html).not.toMatch(/\[OWNER:/);
    expect(html).toContain('<h1>M/ARC privacy policy</h1>');
    expect(html).toContain('macdarenz@gmail.com');
    expect(html).toContain('Australian Privacy Act 1988');
    expect(html).toContain('Data Privacy Act of 2012');
  });

  it('escapes HTML and turns bold/links into tags', () => {
    const html = renderPrivacyPolicy('# T\n\n**Bold** text and https://example.com/x here.\n');
    expect(html).toContain('<strong>Bold</strong>');
    expect(html).toContain('<a href="https://example.com/x">https://example.com/x</a>');
  });

  it('turns "- " lines into a list', () => {
    const html = renderPrivacyPolicy('# T\n\n- one\n- two\n');
    expect(html).toContain('<ul><li>one</li><li>two</li></ul>');
  });
});

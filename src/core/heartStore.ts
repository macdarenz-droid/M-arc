/**
 * Heart-rate series, separate from the main state key (6.3): a 60-minute
 * session at 1 Hz is ~40 KB, and the main state already holds hundreds of
 * sessions, so the raw series live here instead. Written once per session,
 * at finish, from the already-downsampled 5-second series.
 */
const KEY = 'marc.heart.v1';
const MAX_SESSIONS = 60;

export type HeartSeriesStore = Record<string, Array<[number, number]>>;

function read(storage: Pick<Storage, 'getItem'> = localStorage): HeartSeriesStore {
  try {
    const raw = storage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HeartSeriesStore) : {};
  } catch { return {}; }
}

function write(v: HeartSeriesStore, storage: Pick<Storage, 'setItem'> = localStorage): void {
  try { storage.setItem(KEY, JSON.stringify(v)); } catch { /* storage full or unavailable; the series is best-effort */ }
}

export function getSeries(sessionId: string): Array<[number, number]> {
  return read()[sessionId] ?? [];
}

/** Stores a session's series once. Evicts the oldest beyond the cap, oldest by insertion order (LRU). */
export function storeSeries(sessionId: string, series: Array<[number, number]>): void {
  const all = read();
  delete all[sessionId];
  all[sessionId] = series;
  const ids = Object.keys(all);
  if (ids.length > MAX_SESSIONS) for (const id of ids.slice(0, ids.length - MAX_SESSIONS)) delete all[id];
  write(all);
}

export function deleteSeries(sessionId: string): void {
  const all = read();
  if (!(sessionId in all)) return;
  delete all[sessionId];
  write(all);
}

export function exportHeart(): HeartSeriesStore { return read(); }

export function restoreHeart(data: HeartSeriesStore | undefined): void {
  if (data) write(data);
}

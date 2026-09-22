/**
 * Photos for Escobar (§6.2): never in localStorage. Kept in memory for the session and in
 * IndexedDB (`marc-escobar-img`) best-effort, so a reopened conversation can still show them.
 */
const memory = new Map<string, { mediaType: string; data: string }>();
const DB = 'marc-escobar-img';
const STORE = 'photos';

function openDb(): Promise<IDBDatabase | null> {
  return new Promise(resolve => {
    try {
      if (typeof indexedDB === 'undefined') { resolve(null); return; }
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}

export function putImage(id: string, img: { mediaType: string; data: string }): void {
  memory.set(id, img);
  void openDb().then(db => {
    if (!db) return;
    try { db.transaction(STORE, 'readwrite').objectStore(STORE).put(img, id); } catch { /* best-effort */ }
  });
}

export function imageData(id: string): { mediaType: string; data: string } | null {
  return memory.get(id) ?? null;
}

/** Loads a stored photo into memory (for thumbnails after a restart). */
export async function loadImage(id: string): Promise<{ mediaType: string; data: string } | null> {
  const hit = memory.get(id);
  if (hit) return hit;
  const db = await openDb();
  if (!db) return null;
  return new Promise(resolve => {
    try {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      req.onsuccess = () => { const v = req.result as { mediaType: string; data: string } | undefined; if (v) memory.set(id, v); resolve(v ?? null); };
      req.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}

export function clearImages(): void {
  memory.clear();
  void openDb().then(db => { try { db?.transaction(STORE, 'readwrite').objectStore(STORE).clear(); } catch { /* best-effort */ } });
}

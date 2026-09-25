/** F12 Save / Share on the native path (Capacitor mocked). QA4-11. */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const calls: string[] = [];
const fs = vi.hoisted(() => ({
  rmdir: vi.fn(), writeFile: vi.fn(), getUri: vi.fn(), checkPermissions: vi.fn(), requestPermissions: vi.fn(),
}));
const share = vi.hoisted(() => ({ share: vi.fn() }));
vi.mock('@capacitor/filesystem', () => ({ Filesystem: fs, Directory: { Cache: 'CACHE', Documents: 'DOCUMENTS' } }));
vi.mock('@capacitor/share', () => ({ Share: share }));
vi.mock('@/native/capacitor', () => ({ isNative: () => true }));

import { saveImage, shareImage } from '@/native/share';

const png = new Blob([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], { type: 'image/png' });

beforeEach(() => {
  calls.length = 0;
  fs.rmdir.mockImplementation(async (o: { path: string }) => { calls.push(`rmdir ${o.path}`); throw new Error('Folder does not exist.'); });
  fs.writeFile.mockImplementation(async (o: { path: string; directory: string; data: string }) => { calls.push(`write ${o.directory} ${o.path} ${o.data}`); });
  fs.getUri.mockImplementation(async (o: { path: string }) => ({ uri: `file:///cache/${o.path}` }));
  fs.checkPermissions.mockResolvedValue({ publicStorage: 'granted' });
  share.share.mockImplementation(async () => { calls.push('share'); });
});

describe('QA4-11: shared cards do not pile up in the cache', () => {
  it('Share clears Cache/MARC Share (errors ignored) before writing the new card', async () => {
    const r = await shareImage('card.png', png, 'My card');
    expect(r.outcome).toBe('shared');
    expect(fs.rmdir).toHaveBeenCalledWith({ path: 'MARC Share', directory: 'CACHE', recursive: true });
    expect(calls).toEqual(['rmdir MARC Share', 'write CACHE MARC Share/card.png iVBORw==', 'share']);
  });
  it("Save's share-sheet fallback clears it too; a direct Save leaves the cache alone", async () => {
    await saveImage('a.png', png);
    expect(calls).toEqual(['write DOCUMENTS M-ARC/a.png iVBORw==']);
    calls.length = 0;
    fs.writeFile.mockImplementationOnce(async () => { throw new Error('denied'); });
    await saveImage('b.png', png);
    expect(calls).toEqual(['rmdir MARC Share', 'write CACHE MARC Share/b.png iVBORw==', 'share']);
  });
});

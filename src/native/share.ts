import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { isNative } from './capacitor';
import { pickFileRaw } from './filePicker';

/** Save text on Android through the share sheet, or download it on the web. */
export async function exportText(fileName: string, text: string, mime = 'application/json'): Promise<string> {
  if (isNative()) {
    const path = `MARC Exports/${fileName}`;
    await Filesystem.writeFile({ path, data: text, directory: Directory.Cache, recursive: true, encoding: 'utf8' as never });
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
    await Share.share({ title: fileName, url: uri, dialogTitle: 'Save or share your backup' });
    return `Android save/share sheet opened for ${fileName}.`;
  }
  download(new Blob([text], { type: mime }), fileName);
  return `Downloaded ${fileName}.`;
}

function download(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = fileName; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the image'));
    reader.readAsDataURL(blob);
  });
}

/** Android's share sheet for a file written to the app cache. False when the person backs out. */
async function shareCachedFile(fileName: string, base64: string, dialogTitle: string): Promise<boolean> {
  const path = `MARC Share/${fileName}`;
  await Filesystem.writeFile({ path, data: base64, directory: Directory.Cache, recursive: true });
  const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
  try { await Share.share({ title: fileName, files: [uri], dialogTitle }); return true; }
  catch (e) { if (/cancel/i.test(String((e as Error)?.message ?? e))) return false; throw e; }
}

export type ImageOutcome = 'saved' | 'shared' | 'downloaded' | 'cancelled';

/**
 * F12 Save: on Android, a PNG in Documents/M-ARC. Where the OS gives no access to Documents
 * (Android 8–10 without the storage permission), the share sheet opens instead so "Save to
 * device" or a gallery app can keep it. On the web, a download.
 */
export async function saveImage(fileName: string, blob: Blob): Promise<{ outcome: ImageOutcome; message: string }> {
  if (!isNative()) { download(blob, fileName); return { outcome: 'downloaded', message: `Downloaded ${fileName}` }; }
  const data = await blobToBase64(blob);
  try {
    const perm = await Filesystem.checkPermissions().catch(() => null);
    if (perm && perm.publicStorage !== 'granted') await Filesystem.requestPermissions().catch(() => null);
    await Filesystem.writeFile({ path: `M-ARC/${fileName}`, data, directory: Directory.Documents, recursive: true });
    return { outcome: 'saved', message: 'Saved to Documents/M-ARC' };
  } catch {
    const shared = await shareCachedFile(fileName, data, 'Save your card');
    return shared ? { outcome: 'shared', message: 'Choose where to save it' } : { outcome: 'cancelled', message: '' };
  }
}

/** F12 Share: Android's share sheet; on the web the Web Share API with files, else a download. */
export async function shareImage(fileName: string, blob: Blob, title: string): Promise<{ outcome: ImageOutcome; message: string }> {
  if (isNative()) {
    const shared = await shareCachedFile(fileName, await blobToBase64(blob), title);
    return shared ? { outcome: 'shared', message: '' } : { outcome: 'cancelled', message: '' };
  }
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  const file = typeof File === 'function' ? new File([blob], fileName, { type: blob.type || 'image/png' }) : null;
  if (file && typeof nav.share === 'function' && nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title }); return { outcome: 'shared', message: '' }; }
    catch (e) { if ((e as DOMException)?.name === 'AbortError') return { outcome: 'cancelled', message: '' }; }
  }
  download(blob, fileName);
  return { outcome: 'downloaded', message: `Sharing isn't available here, so it was downloaded` };
}

/** A chosen text file's contents; null when cancelled or unreadable. */
export async function pickFile(accept = 'application/json'): Promise<string | null> {
  const f = await pickFileRaw(accept);
  return f ? f.text().catch(() => null) : null;
}

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
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = fileName; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return `Downloaded ${fileName}.`;
}

/** A chosen text file's contents; null when cancelled or unreadable. */
export async function pickFile(accept = 'application/json'): Promise<string | null> {
  const f = await pickFileRaw(accept);
  return f ? f.text().catch(() => null) : null;
}

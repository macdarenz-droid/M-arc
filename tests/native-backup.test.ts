import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
it('excludes only the watch journal and its sidecars from both Android backup formats, idempotently', () => {
  const dir = mkdtempSync(join(tmpdir(), 'marc-backup-'));
  try {
    mkdirSync(join(dir, 'res/xml'), { recursive: true });
    const manifest = join(dir, 'AndroidManifest.xml');
    writeFileSync(manifest, '<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application android:allowBackup="true" android:fullBackupContent="@xml/existing" /></manifest>');
    writeFileSync(join(dir, 'res/xml/existing.xml'), '<full-backup-content><exclude domain="sharedpref" path="keep.xml" /></full-backup-content>');
    for (let i = 0; i < 2; i++) execFileSync('python3', ['native/patch_manifest.py', manifest]);
    expect(readFileSync(manifest, 'utf8')).toContain('android:dataExtractionRules="@xml/marc_data_extraction_rules"');
    const old = readFileSync(join(dir, 'res/xml/existing.xml'), 'utf8');
    const modern = readFileSync(join(dir, 'res/xml/marc_data_extraction_rules.xml'), 'utf8');
    expect(old).toContain('path="keep.xml"'); expect(modern).toContain('<cloud-backup>'); expect(modern).toContain('<device-transfer>');
    for (const suffix of ['', '-wal', '-shm', '-journal']) {
      const text = `path="marc_watch_workout_v1.db${suffix}"`;
      expect(old.split(text)).toHaveLength(2); expect(modern.split(text)).toHaveLength(3);
    }
    expect(old).not.toContain('path="."'); expect(readFileSync(manifest, 'utf8')).toContain('android:allowBackup="true"');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

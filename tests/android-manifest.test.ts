/** native/patch_manifest.py on a minimal Capacitor manifest (QA4-3). Runs the real script with python3. */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:label="M/ARC"><activity android:name=".MainActivity" android:exported="true" /></application>
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>`;

function patched(input = BASE): string {
  const dir = mkdtempSync(join(tmpdir(), 'marc-manifest-'));
  const file = join(dir, 'AndroidManifest.xml');
  writeFileSync(file, input);
  const r = spawnSync('python3', ['native/patch_manifest.py', file], { encoding: 'utf8' });
  expect(r.status, r.stderr).toBe(0);
  return readFileSync(file, 'utf8');
}

describe('patch_manifest.py', () => {
  it('QA4-3: storage permissions for Android 8–10 Save, capped at API 29, and legacy storage on Android 10', () => {
    const xml = patched();
    for (const p of ['WRITE_EXTERNAL_STORAGE', 'READ_EXTERNAL_STORAGE']) {
      expect(xml).toMatch(new RegExp(`<uses-permission android:name="android\\.permission\\.${p}" android:maxSdkVersion="29" />`));
    }
    expect(xml).toMatch(/<application[^>]*android:requestLegacyExternalStorage="true"/);
  });
  it('QA4-3: an entry a plugin already added still gets the cap, and a second run adds nothing twice', () => {
    const once = patched(BASE.replace('<uses-permission android:name="android.permission.INTERNET" />', '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />'));
    expect(once.match(/WRITE_EXTERNAL_STORAGE/g)?.length).toBe(1);
    expect(once).toContain('android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29"');
    const twice = patched(once);
    expect(twice.match(/READ_EXTERNAL_STORAGE/g)?.length).toBe(1);
  });

  it('PLAY-HR: the `permissions` list is exactly the 4 read types the app uses plus the 2 non-health ones, never READ_HEART_RATE', () => {
    const src = readFileSync(fileURLToPath(new URL('../native/patch_manifest.py', import.meta.url)), 'utf8');
    const body = src.match(/^permissions = \[([\s\S]*?)\]/m)?.[1];
    expect(body, 'permissions list not found in patch_manifest.py').toBeDefined();
    const names = [...body!.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    expect(names).toEqual([
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.SCHEDULE_EXACT_ALARM',
      'android.permission.health.READ_STEPS',
      'android.permission.health.READ_SLEEP',
      'android.permission.health.READ_ACTIVE_CALORIES_BURNED',
      'android.permission.health.READ_RESTING_HEART_RATE',
    ]);
  });
});

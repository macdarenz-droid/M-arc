/**
 * Copy the hand-written native layer into the generated Capacitor project and
 * patch its manifest.
 *
 * `npx cap sync` only wires up npm Capacitor plugins. Everything in native/ —
 * MainActivity, the Health Connect bridge and the heart-rate recorder — has to
 * be placed here or the generated project silently builds without it: the APK
 * still installs, and every native call just resolves to nothing.
 *
 * Run after `npx cap sync android`, before Gradle.
 */
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const android = join(root, 'android');
const nativeDir = join(root, 'native');
const packageDir = join(android, 'app', 'src', 'main', 'java', 'com', 'mrcdrnzz', 'dailytracker');

const SOURCES = [
  'MainActivity.java',
  'HealthConnectNativePlugin.java',
  'PermissionsRationaleActivity.java',
  'HeartRateMeasurement.java',
  'HeartRateMetrics.java',
  'HeartRateDatabase.java',
  'HeartRateDeviceScanner.java',
  'HeartRateService.java',
  'HeartRateNativePlugin.java',
];

await mkdir(packageDir, { recursive: true });
for (const name of SOURCES) await copyFile(join(nativeDir, name), join(packageDir, name));

const drawable = join(android, 'app', 'src', 'main', 'res', 'drawable');
await mkdir(drawable, { recursive: true });
await copyFile(join(nativeDir, 'ic_stat_heart_rate.xml'), join(drawable, 'ic_stat_heart_rate.xml'));

const manifest = join(android, 'app', 'src', 'main', 'AndroidManifest.xml');
const patched = spawnSync('python3', [join(nativeDir, 'patch_manifest.py'), manifest], { stdio: 'inherit' });
if (patched.status !== 0) throw new Error('patch_manifest.py failed');

// Both plugins must actually be registered, or the bridge exists in the APK
// and is never reachable from the web layer.
const main = await readFile(join(packageDir, 'MainActivity.java'), 'utf8');
for (const plugin of ['HealthConnectNativePlugin', 'HeartRateNativePlugin']) {
  if (!main.includes(`registerPlugin(${plugin}.class)`)) throw new Error(`${plugin} is not registered in MainActivity`);
}
console.log(`Prepared Android project: ${SOURCES.length} native sources, drawable and manifest.`);

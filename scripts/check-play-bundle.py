#!/usr/bin/env python3
"""REL-2: prove an Android App Bundle meets Google Play's technical upload requirements.

Usage: check-play-bundle.py <app.aab> <manifest.xml> <package> <versionCode> <versionName>
<manifest.xml> is the output of `bundletool dump manifest --bundle <app.aab>`.
Every failed check prints one ::error:: line; the script exits 1 if any failed.
"""
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

ANDROID = '{http://schemas.android.com/apk/res/android}'
# Google Play target API level rule for new apps and app updates, effective 31 August 2026:
# standard (phone) apps must target Android 16, API level 36, or higher.
PLAY_MIN_TARGET_SDK = 36
PLAY_TARGET_SDK_SOURCE = 'https://developer.android.com/google/play/requirements/target-sdk'
# Play requires a 64-bit variant for every 32-bit native library (arm64-v8a for armeabi-v7a, x86_64 for x86).
ABI_64_FOR_32 = {'armeabi-v7a': 'arm64-v8a', 'armeabi': 'arm64-v8a', 'x86': 'x86_64'}


def check(aab, manifest_xml, package, version_code, version_name):
    errors = []
    if not Path(aab).is_file() or Path(aab).stat().st_size == 0:
        return [f'the AAB {aab} does not exist or is empty']
    root = ET.fromstring(manifest_xml)
    app = root.find('application')
    debuggable = (app.get(ANDROID + 'debuggable') if app is not None else None)
    if debuggable is not None and debuggable.lower() != 'false':
        errors.append(f'the manifest is debuggable (android:debuggable="{debuggable}"); Play rejects debuggable bundles')
    if root.get('package') != package:
        errors.append(f'package is "{root.get("package")}", expected "{package}"')
    if root.get(ANDROID + 'versionCode') != version_code:
        errors.append(f'versionCode is "{root.get(ANDROID + "versionCode")}", expected "{version_code}"')
    if root.get(ANDROID + 'versionName') != version_name:
        errors.append(f'versionName is "{root.get(ANDROID + "versionName")}", expected "{version_name}"')
    sdk = root.find('uses-sdk')
    target = sdk.get(ANDROID + 'targetSdkVersion') if sdk is not None else None
    if target is None or not target.isdigit() or int(target) < PLAY_MIN_TARGET_SDK:
        errors.append(
            f'targetSdkVersion is {target}; Google Play requires new apps and app updates to target '
            f'API level {PLAY_MIN_TARGET_SDK} (Android 16) or higher since 31 August 2026. Source: {PLAY_TARGET_SDK_SOURCE}')
    with zipfile.ZipFile(aab) as z:
        libs = {}
        for name in z.namelist():
            parts = name.split('/')
            # Bundle layout: <module>/lib/<abi>/<file>.so
            if len(parts) == 4 and parts[1] == 'lib' and parts[3].endswith('.so'):
                libs.setdefault((parts[0], parts[2]), set()).add(parts[3])
    print('Native libraries in the bundle:', ', '.join(f'{m}/lib/{a} ({len(f)})' for (m, a), f in sorted(libs.items())) or 'none')
    for (module, abi), files in sorted(libs.items()):
        want = ABI_64_FOR_32.get(abi)
        if want is None:
            continue
        missing = sorted(files - libs.get((module, want), set()))
        if missing:
            errors.append(f'{module}/lib/{abi} has no 64-bit {want} variant for: {", ".join(missing)}')
    return errors


def main(argv):
    if len(argv) != 6:
        raise SystemExit(__doc__)
    aab, manifest_path, package, version_code, version_name = argv[1:]
    errors = check(aab, Path(manifest_path).read_text(encoding='utf-8'), package, version_code, version_name)
    for e in errors:
        print(f'::error::Play bundle check failed: {e}')
    if errors:
        return 1
    print(f'Play bundle checks PASS: {aab} package={package} versionCode={version_code} versionName={version_name} '
          f'not debuggable, targetSdk >= {PLAY_MIN_TARGET_SDK} ({PLAY_TARGET_SDK_SOURCE}), 64-bit native libraries complete')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))

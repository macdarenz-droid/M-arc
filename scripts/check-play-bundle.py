#!/usr/bin/env python3
"""REL-2: prove an Android App Bundle meets Google Play's technical upload requirements.

Usage: check-play-bundle.py <app.aab> <manifest.xml> <capacitor.config.json> <versionCode> <versionName>
       check-play-bundle.py --self-test
<manifest.xml> is the output of `bundletool dump manifest --bundle <app.aab>`.
--self-test runs the 16 KB page-size check against the committed fixtures in scripts/fixtures/play-bundle/.
The package is pinned below; capacitor.config.json's appId must equal it, so a changed appId fails.
Every failed check prints one ::error:: line; the script exits 1 if any failed.
"""
import json
import struct
import sys
import tempfile
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

ANDROID = '{http://schemas.android.com/apk/res/android}'
# The Play listing's package name. It can never change once the app is published.
PLAY_PACKAGE = 'com.mrcdrnzz.dailytracker'
# Google Play target API level rule for new apps and app updates, effective 31 August 2026:
# standard (phone) apps must target Android 16, API level 36, or higher.
PLAY_MIN_TARGET_SDK = 36
PLAY_TARGET_SDK_SOURCE = 'https://developer.android.com/google/play/requirements/target-sdk'
# Play requires a 64-bit variant for every 32-bit native library (arm64-v8a for armeabi-v7a, x86_64 for x86).
ABI_64_FOR_32 = {'armeabi-v7a': 'arm64-v8a', 'armeabi': 'arm64-v8a', 'x86': 'x86_64'}
# PLAY-PREP: Google Play's 16 KB page-size requirement. Every native library for a 64-bit ABI must have
# ELF PT_LOAD segments aligned to 16 KB or more, or the app can fail to load on 16 KB-page devices.
PAGE_16KB = 16384
PAGE_16KB_ABIS = ('arm64-v8a', 'x86_64')
PAGE_16KB_SOURCE = 'https://developer.android.com/guide/practices/page-sizes'
PT_LOAD = 1
FIXTURES = Path(__file__).resolve().parent / 'fixtures' / 'play-bundle'


def elf_load_aligns(data):
    """The p_align of every PT_LOAD segment of an ELF file, or a string saying why it can't be read."""
    if len(data) < 64 or data[:4] != b'\x7fELF':
        return 'not an ELF file'
    if data[4] != 2:
        return 'not a 64-bit ELF file'
    endian = {1: '<', 2: '>'}.get(data[5])
    if endian is None:
        return 'unknown ELF byte order'
    phoff, = struct.unpack_from(endian + 'Q', data, 0x20)
    phentsize, phnum = struct.unpack_from(endian + 'HH', data, 0x36)
    if phentsize < 56 or phoff + phentsize * phnum > len(data):
        return 'truncated ELF program headers'
    aligns = []
    for i in range(phnum):
        off = phoff + i * phentsize
        p_type, = struct.unpack_from(endian + 'I', data, off)
        if p_type == PT_LOAD:
            p_align, = struct.unpack_from(endian + 'Q', data, off + 48)
            aligns.append(p_align)
    return aligns if aligns else 'no PT_LOAD segment'


def check_16kb(z):
    """Errors for 64-bit native libraries that are not 16 KB aligned, plus one summary line per library.

    Only the ELF segment alignment can fail the check. The zip offset of a library stored uncompressed is
    reported, not enforced: Play builds the installed APKs from the bundle with bundletool, which page-aligns
    uncompressed native libraries itself, so the offset inside the .aab never reaches a device."""
    errors, notes = [], []
    for info in z.infolist():
        parts = info.filename.split('/')
        if not (len(parts) == 4 and parts[1] == 'lib' and parts[2] in PAGE_16KB_ABIS and parts[3].endswith('.so')):
            continue
        aligns = elf_load_aligns(z.read(info))
        if isinstance(aligns, str):
            errors.append(f'16 KB page size: {info.filename} is {aligns}')
            continue
        low = [a for a in aligns if a < PAGE_16KB]
        if low:
            errors.append(f'16 KB page size: {info.filename} has PT_LOAD segments aligned to {min(low)} bytes; '
                          f'Google Play requires {PAGE_16KB} or more. Source: {PAGE_16KB_SOURCE}')
        stored = ''
        if info.compress_type == zipfile.ZIP_STORED:
            z.fp.seek(info.header_offset)
            name_len, extra_len = struct.unpack('<HH', z.fp.read(30)[26:30])
            data_off = info.header_offset + 30 + name_len + extra_len
            stored = f', stored uncompressed at zip offset {data_off} ({"" if data_off % PAGE_16KB == 0 else "not "}16 KB aligned in the .aab)'
        notes.append(f'{info.filename}: PT_LOAD align {min(aligns)}{stored}')
    return errors, notes


def check(aab, manifest_xml, config_app_id, version_code, version_name):
    errors = []
    if config_app_id != PLAY_PACKAGE:
        errors.append(f'capacitor.config.json appId is "{config_app_id}", but the Play package is pinned to "{PLAY_PACKAGE}"')
    if not Path(aab).is_file() or Path(aab).stat().st_size == 0:
        return [f'the AAB {aab} does not exist or is empty']
    root = ET.fromstring(manifest_xml)
    app = root.find('application')
    debuggable = (app.get(ANDROID + 'debuggable') if app is not None else None)
    if debuggable is not None and debuggable.lower() != 'false':
        errors.append(f'the manifest is debuggable (android:debuggable="{debuggable}"); Play rejects debuggable bundles')
    if root.get('package') != PLAY_PACKAGE:
        errors.append(f'package is "{root.get("package")}", expected "{PLAY_PACKAGE}"')
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
    with zipfile.ZipFile(aab) as z:
        page_errors, page_notes = check_16kb(z)
    print('16 KB page size:', '; '.join(page_notes) or f'no {"/".join(PAGE_16KB_ABIS)} native libraries in the bundle')
    errors.extend(page_errors)
    return errors


def self_test():
    """The 16 KB check against committed fixtures: a 4 KB-aligned library fails, a 16 KB-aligned one passes."""
    four, sixteen = (FIXTURES / 'lib-align-4k.so').read_bytes(), (FIXTURES / 'lib-align-16k.so').read_bytes()
    assert elf_load_aligns(four) == [4096] and elf_load_aligns(sixteen) == [16384], 'fixtures changed'
    cases = [
        ('4 KB arm64-v8a', [('base/lib/arm64-v8a/libfour.so', four, zipfile.ZIP_DEFLATED)], 1),
        ('4 KB x86_64, stored', [('base/lib/x86_64/libfour.so', four, zipfile.ZIP_STORED)], 1),
        ('16 KB arm64-v8a and x86_64', [('base/lib/arm64-v8a/libok.so', sixteen, zipfile.ZIP_DEFLATED),
                                        ('base/lib/x86_64/libok.so', sixteen, zipfile.ZIP_STORED)], 0),
        ('4 KB in a 32-bit ABI is out of scope', [('base/lib/armeabi-v7a/libfour.so', four, zipfile.ZIP_DEFLATED)], 0),
        ('not an ELF file', [('base/lib/arm64-v8a/libjunk.so', b'\0' * 80, zipfile.ZIP_DEFLATED)], 1),
        ('no native libraries', [], 0),
    ]
    failed = 0
    with tempfile.TemporaryDirectory() as tmp:
        for name, entries, want in cases:
            path = Path(tmp) / 'case.aab'
            with zipfile.ZipFile(path, 'w') as z:
                z.writestr('base/manifest/AndroidManifest.xml', b'')
                for entry, data, method in entries:
                    z.writestr(zipfile.ZipInfo(entry), data, compress_type=method)
            with zipfile.ZipFile(path) as z:
                errs, _ = check_16kb(z)
            ok = len(errs) == want
            failed += not ok
            print(f'{"ok" if ok else "FAIL"}: {name}: expected {want} error(s), got {len(errs)} {errs}')
    if failed:
        print(f'::error::Play bundle self-test failed: {failed} case(s) wrong')
        return 1
    print('Play bundle 16 KB self-test PASS')
    return 0


def main(argv):
    if argv[1:] == ['--self-test']:
        return self_test()
    if len(argv) != 6:
        raise SystemExit(__doc__)
    aab, manifest_path, config_path, version_code, version_name = argv[1:]
    config_app_id = json.loads(Path(config_path).read_text(encoding='utf-8')).get('appId')
    errors = check(aab, Path(manifest_path).read_text(encoding='utf-8'), config_app_id, version_code, version_name)
    for e in errors:
        print(f'::error::Play bundle check failed: {e}')
    if errors:
        return 1
    print(f'Play bundle checks PASS: {aab} package={PLAY_PACKAGE} versionCode={version_code} versionName={version_name} '
          f'not debuggable, targetSdk >= {PLAY_MIN_TARGET_SDK} ({PLAY_TARGET_SDK_SOURCE}), 64-bit native libraries complete, '
          f'64-bit native libraries 16 KB aligned ({PAGE_16KB_SOURCE})')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))

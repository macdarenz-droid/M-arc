#!/usr/bin/env python3
"""Gate A question 2: add the Huawei Wear Engine SDK and the Watch lab plugin to the generated
Android project. scripts/prepare-android.sh runs this after patch_manifest.py, only when
MARC_WEAR_LAB=1 (build-apk.yml's debug APK). Release and Play builds never run it.

Usage: prepare_android.py [android_dir]   (default: <repo>/android)

Edits, each made at most once, so a second run changes nothing:
- android/build.gradle: Huawei's Maven repo as the LAST entry of allprojects.repositories
  (Huawei: "add the Maven repository address of Huawei as the last one");
- android/app/build.gradle: implementation 'com.huawei.hms:wearengine:5.0.3.304';
- android/app/proguard-rules.pro: Huawei's five Wear Engine keep lines;
- AndroidManifest.xml: <meta-data com.huawei.hms.client.appid = 119100049> in <application>;
  a different existing value is refused;
- assets/capacitor.plugins.json: the plugin entry, after the entries cap sync wrote;
- the plugin source, copied to .../com/mrcdrnzz/dailytracker/wear/.

Every check runs before anything is written. A missing anchor or a conflict exits 1 with ::error::
and leaves the project untouched. Signing, minSdk, permissions and <queries> are not touched: the
SDK's own manifest brings its <queries> entry for com.huawei.health.
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

REPO = "maven { url 'https://developer.huawei.com/repo/' }"
DEPENDENCY = "implementation 'com.huawei.hms:wearengine:5.0.3.304'"
PROGUARD = (
    "-keepattributes *Annotation*",
    "-keepattributes Signature",
    "-keepattributes InnerClasses",
    "-keepattributes EnclosingMethod",
    "-keep class com.huawei.wearengine.**{*;}",
)
APPID_NAME = "com.huawei.hms.client.appid"
APPID_VALUE = "119100049"
PLUGIN_PKG = "marc-wear-lab"
PLUGIN_CLASS = "com.mrcdrnzz.dailytracker.wear.WearEnginePlugin"
PLUGIN_SOURCE = HERE / "WearEnginePlugin.java"
ANDROID_NS = "http://schemas.android.com/apk/res/android"


class PatchError(Exception):
    pass


def read(path):
    if not path.is_file():
        raise PatchError(f"{path} not found")
    # newline="" keeps line endings as they are, so untouched lines stay byte-identical.
    with open(path, encoding="utf-8", newline="") as f:
        return f.read()


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def block_body(text, opener, start=0, end=None):
    """(body_start, close_index) of the single block whose header matches opener in text[start:end]."""
    end = len(text) if end is None else end
    found = list(re.finditer(opener, text[start:end]))
    if len(found) != 1:
        raise PatchError(f"expected one '{opener}' block, found {len(found)}")
    i = body_start = start + found[0].end()
    depth = 1
    while i < end:
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return body_start, i
        i += 1
    raise PatchError(f"'{opener}' block is not closed")


def append_entry(text, body_start, close, line):
    """Insert line as the last entry of a block whose closing brace sits on its own line."""
    line_start = text.rfind("\n", 0, close) + 1
    if line_start <= body_start or text[line_start:close].strip():
        raise PatchError("closing brace is not on its own line")
    entries = [l for l in text[body_start:line_start].splitlines() if l.strip()]
    indent = re.match(r"\s*", entries[-1]).group(0) if entries else text[line_start:close] + "    "
    return text[:line_start] + indent + line + "\n" + text[line_start:]


def patch_root_gradle(text):
    body_start, close = block_body(text, r"\ballprojects\s*\{")
    repos_start, repos_close = block_body(text, r"\brepositories\s*\{", body_start, close)
    entries = [l.strip() for l in text[repos_start:repos_close].splitlines() if l.strip()]
    if REPO in entries:
        if entries[-1] != REPO:
            raise PatchError("the Huawei repo is in allprojects.repositories but not last")
        return text
    if "developer.huawei.com/repo" in text:
        raise PatchError("android/build.gradle already names the Huawei repo in another form")
    return append_entry(text, repos_start, repos_close, REPO)


def check_settings(text):
    # Repositories declared there would override or reject allprojects.repositories.
    if "dependencyResolutionManagement" in text:
        raise PatchError("settings.gradle declares dependencyResolutionManagement; the repo would not apply")


def patch_app_gradle(text):
    found = re.findall(r"com\.huawei\.hms:wearengine:[^'\"\s]*", text)
    if found:
        if found != [DEPENDENCY.split("'")[1]] or DEPENDENCY not in text:
            raise PatchError(f"app/build.gradle already has a different Wear Engine dependency: {found}")
        return text
    body_start, close = block_body(text, r"(?m)^dependencies\s*\{")
    return append_entry(text, body_start, close, DEPENDENCY)


def patch_proguard(text):
    present = {l.strip() for l in text.splitlines()}
    missing = [l for l in PROGUARD if l not in present]
    if not missing:
        return text
    if text and not text.endswith("\n"):
        text += "\n"
    return text + "\n# Huawei Wear Engine (Gate A question 2, debug APK only)\n" + "\n".join(missing) + "\n"


def patch_manifest(text):
    try:
        root = ET.fromstring(text)
    except ET.ParseError as e:
        raise PatchError(f"AndroidManifest.xml does not parse: {e}")
    apps = root.findall("application")
    if len(apps) != 1:
        raise PatchError(f"expected one <application>, found {len(apps)}")
    name = f"{{{ANDROID_NS}}}name"
    value = f"{{{ANDROID_NS}}}value"
    existing = [m for m in apps[0].findall("meta-data") if m.get(name) == APPID_NAME]
    if existing:
        values = [m.get(value) for m in existing]
        if values != [APPID_VALUE]:
            raise PatchError(f"{APPID_NAME} is already set to {values}; refusing to change it to {APPID_VALUE}")
        return text
    if text.count("</application>") != 1:
        raise PatchError("expected one </application> closing tag")
    close = text.index("</application>")
    line_start = text.rfind("\n", 0, close) + 1
    indent = text[line_start:close]
    if indent.strip():
        raise PatchError("</application> is not on its own line")
    tag = f'<meta-data android:name="{APPID_NAME}" android:value="{APPID_VALUE}" />'
    return text[:line_start] + indent + "    " + tag + "\n" + text[line_start:]


def patch_plugins_json(text):
    try:
        entries = json.loads(text)
    except ValueError as e:
        raise PatchError(f"capacitor.plugins.json does not parse: {e}")
    if not isinstance(entries, list) or not all(isinstance(e, dict) for e in entries):
        raise PatchError("capacitor.plugins.json is not a list of plugin entries")
    ours = [e for e in entries if e.get("classpath") == PLUGIN_CLASS]
    if len(ours) > 1:
        raise PatchError(f"capacitor.plugins.json lists {PLUGIN_CLASS} {len(ours)} times")
    if ours:
        return text
    entries.append({"pkg": PLUGIN_PKG, "classpath": PLUGIN_CLASS})
    # The same layout cap sync writes (fs-extra writeJSON, tab indent).
    return json.dumps(entries, indent="\t") + "\n"


def plan(android):
    """Every (path, new_text) that differs from disk. Raises PatchError before anything is written."""
    app = android / "app"
    main = app / "src" / "main"
    check_settings(read(android / "settings.gradle"))
    edits = [
        (android / "build.gradle", patch_root_gradle),
        (app / "build.gradle", patch_app_gradle),
        (app / "proguard-rules.pro", patch_proguard),
        (main / "AndroidManifest.xml", patch_manifest),
        (main / "assets" / "capacitor.plugins.json", patch_plugins_json),
    ]
    changes = []
    for path, patch in edits:
        old = read(path)
        try:
            new = patch(old)
        except PatchError as e:
            raise PatchError(f"{path.relative_to(android)}: {e}")
        if new != old:
            changes.append((path, new))
    java = main / "java"
    if not java.is_dir():
        raise PatchError(f"{java} not found")
    source = read(PLUGIN_SOURCE)
    target = java / Path(*PLUGIN_CLASS.split(".")).with_suffix(".java")
    if not target.is_file() or read(target) != source:
        changes.append((target, source))
    return changes


def main(argv):
    if len(argv) > 2:
        print("::error::usage: prepare_android.py [android_dir]")
        return 1
    android = Path(argv[1]).resolve() if len(argv) == 2 else ROOT / "android"
    try:
        if not android.is_dir():
            raise PatchError(f"{android} not found")
        changes = plan(android)
    except (PatchError, OSError, UnicodeError) as e:
        print(f"::error::Wear Engine patch: {e}")
        return 1
    try:
        for path, text in changes:
            write(path, text)
    except OSError as e:
        print(f"::error::Wear Engine patch: {e}")
        return 1
    names = ", ".join(str(p.relative_to(android)) for p, _ in changes) or "no change"
    print(f"Wear Engine 5.0.3.304 lab patched ({names}); signing untouched.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))

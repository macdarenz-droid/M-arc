"""A2-4: native/wear/android/prepare_android.py against Capacitor 8.5.0 project files.

fixtures/cap850 holds build.gradle, settings.gradle, app/build.gradle, app/proguard-rules.pro,
AndroidManifest.xml and capacitor.plugins.json exactly as `npx cap add android` and
`npx cap sync android` wrote them for this app with @capacitor/cli 8.5.0 (the tarball matches
package-lock.json's integrity hash). Capacitor is MIT licensed: fixtures/cap850/LICENSE.

Run: python3 -I -m unittest discover -s native/wear/test -p 'test_*.py'
"""
import difflib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
SCRIPT = REPO / "native" / "wear" / "android" / "prepare_android.py"
PLUGIN = REPO / "native" / "wear" / "android" / "WearEnginePlugin.java"
PATCH_MANIFEST = REPO / "native" / "patch_manifest.py"
FIXTURE = HERE / "fixtures" / "cap850"

HUAWEI_REPO = "maven { url 'https://developer.huawei.com/repo/' }"
DEPENDENCY = "implementation 'com.huawei.hms:wearengine:5.0.3.304'"
PROGUARD = [
    "-keepattributes *Annotation*",
    "-keepattributes Signature",
    "-keepattributes InnerClasses",
    "-keepattributes EnclosingMethod",
    "-keep class com.huawei.wearengine.**{*;}",
]
APPID_NAME = "com.huawei.hms.client.appid"
APPID_VALUE = "119100049"
CLASSPATH = "com.mrcdrnzz.dailytracker.wear.WearEnginePlugin"
A = "{http://schemas.android.com/apk/res/android}"
MANIFEST = "app/src/main/AndroidManifest.xml"
PLUGINS_JSON = "app/src/main/assets/capacitor.plugins.json"
COPIED = "app/src/main/java/com/mrcdrnzz/dailytracker/wear/WearEnginePlugin.java"
PATCHED = ["build.gradle", "app/build.gradle", "app/proguard-rules.pro", MANIFEST, PLUGINS_JSON]


def run(script, *args, cwd=None):
    return subprocess.run([sys.executable, "-I", str(script), *map(str, args)],
                          capture_output=True, text=True, cwd=cwd)


def snapshot(root):
    return {str(p.relative_to(root)): p.read_bytes() for p in sorted(root.rglob("*")) if p.is_file()}


def appid_values(manifest_path):
    app = ET.parse(manifest_path).getroot().find("application")
    return [m.get(A + "value") for m in app.findall("meta-data") if m.get(A + "name") == APPID_NAME]


class Project(unittest.TestCase):
    """A fresh copy of the generated project, laid out as prepare-android.sh leaves it."""

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)
        self.android = self.tmp / "android"
        shutil.copytree(FIXTURE, self.android)
        (self.android / "app/src/main/java/com/mrcdrnzz/dailytracker").mkdir(parents=True)

    def path(self, rel):
        return self.android / rel

    def text(self, rel):
        return self.path(rel).read_text(encoding="utf-8")

    def edit(self, rel, old, new):
        text = self.text(rel)
        self.assertEqual(text.count(old), 1, f"fixture anchor {old!r} in {rel}")
        self.path(rel).write_text(text.replace(old, new), encoding="utf-8")

    def patch(self):
        result = run(SCRIPT, self.android)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        return result

    def assertRefused(self, *words):
        before = snapshot(self.android)
        result = run(SCRIPT, self.android)
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("::error::", result.stdout)
        for word in words:
            self.assertIn(word, result.stdout)
        self.assertEqual(snapshot(self.android), before, "a refused run must leave every file as it was")


class GradleTest(Project):
    def test_huawei_repo_is_last_in_allprojects_repositories(self):
        self.patch()
        text = self.text("build.gradle")
        self.assertEqual(text.count("developer.huawei.com/repo"), 1)
        head, allprojects = text.split("allprojects {")
        self.assertIn("\n        google()\n        mavenCentral()\n        " + HUAWEI_REPO + "\n    }\n}", allprojects)
        self.assertNotIn("huawei", head, "buildscript repositories stay as the template has them")

    def test_huawei_repo_listed_first_is_refused(self):
        # The retired Codex script's layout: inserted right after "allprojects { repositories {".
        self.edit("build.gradle", "allprojects {\n    repositories {\n",
                  "allprojects {\n    repositories {\n        " + HUAWEI_REPO + "\n")
        self.assertRefused("not last")

    def test_dependency_added_once_inside_dependencies(self):
        self.patch()
        self.patch()
        text = self.text("app/build.gradle")
        self.assertEqual(text.count("com.huawei.hms:wearengine"), 1)
        block = text.split("\ndependencies {\n", 1)[1].split("\n}\n", 1)[0]
        self.assertIn("    " + DEPENDENCY, block.splitlines())

    def test_other_wearengine_version_is_refused(self):
        self.edit("app/build.gradle", "dependencies {\n",
                  "dependencies {\n    implementation 'com.huawei.hms:wearengine:5.0.3.305'\n")
        self.assertRefused("5.0.3.305")

    def test_settings_with_dependency_resolution_management_is_refused(self):
        settings = self.path("settings.gradle")
        settings.write_text(settings.read_text() + "\ndependencyResolutionManagement {\n}\n", encoding="utf-8")
        self.assertRefused("dependencyResolutionManagement")

    def test_proguard_rules_appended_once(self):
        original = self.text("app/proguard-rules.pro")
        self.patch()
        self.patch()
        text = self.text("app/proguard-rules.pro")
        self.assertTrue(text.startswith(original))
        lines = text.splitlines()
        for rule in PROGUARD:
            self.assertEqual(lines.count(rule), 1, rule)


class ManifestTest(Project):
    def test_appid_meta_data_added_once(self):
        self.patch()
        self.patch()
        self.assertEqual(appid_values(self.path(MANIFEST)), [APPID_VALUE])
        provider = ET.parse(self.path(MANIFEST)).getroot().find("application/provider")
        self.assertEqual([m.get(A + "name") for m in provider.findall("meta-data")],
                         ["android.support.FILE_PROVIDER_PATHS"])

    def test_appid_added_after_patch_manifest(self):
        # prepare-android.sh order: native/patch_manifest.py first, then this script.
        result = run(PATCH_MANIFEST, self.path(MANIFEST))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.patch()
        self.patch()
        self.assertEqual(appid_values(self.path(MANIFEST)), [APPID_VALUE])
        services = ET.parse(self.path(MANIFEST)).getroot().findall("application/service")
        self.assertEqual([s.get(A + "name") for s in services], [".watch.WatchService"])

    def test_same_existing_appid_is_kept(self):
        tag = f'    <meta-data android:name="{APPID_NAME}" android:value="{APPID_VALUE}" />\n'
        self.edit(MANIFEST, "    </application>", tag + "    </application>")
        self.patch()
        self.assertEqual(appid_values(self.path(MANIFEST)), [APPID_VALUE])

    def test_conflicting_appid_is_refused(self):
        tag = f'    <meta-data android:name="{APPID_NAME}" android:value="123" />\n'
        self.edit(MANIFEST, "    </application>", tag + "    </application>")
        self.assertRefused(APPID_NAME, "123")


class PluginTest(Project):
    def test_plugins_json_entry_appended_once(self):
        cap_sync = json.loads((FIXTURE / PLUGINS_JSON).read_text())
        self.assertEqual(len(cap_sync), 5)
        self.patch()
        self.patch()
        entries = json.loads(self.text(PLUGINS_JSON))
        self.assertEqual(entries[:-1], cap_sync)
        self.assertEqual(entries[-1], {"pkg": "marc-wear-lab", "classpath": CLASSPATH})
        self.assertEqual([e["classpath"] for e in entries].count(CLASSPATH), 1)

    def test_plugin_source_copied_where_its_classpath_points(self):
        self.patch()
        self.assertEqual(COPIED, "app/src/main/java/" + CLASSPATH.replace(".", "/") + ".java")
        self.assertEqual(self.path(COPIED).read_bytes(), PLUGIN.read_bytes())

    def test_stale_plugin_copy_is_replaced(self):
        self.path(COPIED).parent.mkdir(parents=True)
        self.path(COPIED).write_text("// old\n", encoding="utf-8")
        self.patch()
        self.assertEqual(self.path(COPIED).read_bytes(), PLUGIN.read_bytes())


class RunTest(Project):
    def test_second_run_changes_nothing(self):
        first = self.patch()
        self.assertNotIn("no change", first.stdout)
        after_first = snapshot(self.android)
        second = self.patch()
        self.assertIn("no change", second.stdout)
        self.assertEqual(snapshot(self.android), after_first)

    def test_edits_only_add_lines(self):
        self.patch()
        self.assertEqual(self.path("settings.gradle").read_bytes(), (FIXTURE / "settings.gradle").read_bytes())
        for rel in PATCHED:
            old = (FIXTURE / rel).read_text(encoding="utf-8").splitlines()
            new = self.text(rel).splitlines()
            ops = {op for op, *_ in difflib.SequenceMatcher(None, old, new, autojunk=False).get_opcodes()}
            self.assertLessEqual(ops, {"equal", "insert"}, rel)
            self.assertIn("insert", ops, rel)

    def test_missing_anchor_fails_loudly_and_writes_nothing(self):
        cases = {
            "no allprojects block": lambda: self.edit("build.gradle", "allprojects {", "subprojects {"),
            "no allprojects repositories": lambda: self.edit(
                "build.gradle", "allprojects {\n    repositories {", "allprojects {\n    repos {"),
            "no app dependencies block": lambda: self.edit("app/build.gradle", "\ndependencies {", "\ndeps {"),
            "no </application>": lambda: self.path(MANIFEST).write_text(
                '<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n'
                '    <application android:label="x" />\n</manifest>\n', encoding="utf-8"),
            "plugins json not a list": lambda: self.path(PLUGINS_JSON).write_text("{}\n", encoding="utf-8"),
            "no plugins json": lambda: self.path(PLUGINS_JSON).unlink(),
            "no proguard file": lambda: self.path("app/proguard-rules.pro").unlink(),
            "no settings.gradle": lambda: self.path("settings.gradle").unlink(),
            "no java source root": lambda: shutil.rmtree(self.path("app/src/main/java")),
        }
        for name, break_it in cases.items():
            with self.subTest(name):
                shutil.rmtree(self.android)
                shutil.copytree(FIXTURE, self.android)
                (self.android / "app/src/main/java/com/mrcdrnzz/dailytracker").mkdir(parents=True)
                break_it()
                self.assertRefused()

    def test_default_android_dir_is_repo_android(self):
        repo = self.tmp / "repo"
        lab = repo / "native" / "wear" / "android"
        lab.mkdir(parents=True)
        shutil.copy(SCRIPT, lab)
        shutil.copy(PLUGIN, lab)
        missing = run(lab / SCRIPT.name, cwd=self.tmp)
        self.assertEqual(missing.returncode, 1)
        self.assertIn("::error::", missing.stdout)
        shutil.move(str(self.android), str(repo / "android"))
        result = run(lab / SCRIPT.name, cwd=self.tmp)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((repo / "android" / COPIED).read_bytes(), PLUGIN.read_bytes())

    def test_extra_arguments_are_refused(self):
        result = run(SCRIPT, self.android, "extra")
        self.assertEqual(result.returncode, 1)
        self.assertIn("::error::", result.stdout)


class PluginSourceTest(unittest.TestCase):
    """The plan's limits on the plugin: in memory only, no device uuid or name."""

    def test_registers_as_wear_engine_in_its_package(self):
        source = PLUGIN.read_text(encoding="utf-8")
        self.assertTrue(source.startswith("package com.mrcdrnzz.dailytracker.wear;\n"))
        self.assertIn('@CapacitorPlugin(name = "WearEngine")\npublic class WearEnginePlugin extends Plugin', source)

    def test_no_storage_file_network_or_device_identity(self):
        source = PLUGIN.read_text(encoding="utf-8")
        for banned in ("SharedPreferences", "java.io.", "java.net.", "getFile(", ".getUuid(", "openFileOutput"):
            self.assertNotIn(banned, source)
        for line in source.splitlines():
            if "getName()" in line:
                self.assertIn("Permission.DEVICE_MANAGER.getName()", line)


if __name__ == "__main__":
    unittest.main()

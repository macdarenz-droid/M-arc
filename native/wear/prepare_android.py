#!/usr/bin/env python3
"""Idempotent additive patch AFTER cap sync. Does not edit signing or source models."""
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
android = ROOT / "android"
app = android / "app"

gradle = app / "build.gradle"
text = gradle.read_text()
dependency = "implementation 'com.huawei.hms:wearengine:5.0.3.300'"
if dependency not in text:
    text, n = re.subn(r"(?m)^dependencies\s*\{", "dependencies {\n    " + dependency, text, count=1)
    if n != 1:
        raise SystemExit("Generated app dependencies block not found")
    gradle.write_text(text)
test_deps = "testImplementation 'junit:junit:4.13.2'\n    testImplementation 'org.robolectric:robolectric:4.17'"
if "org.robolectric:robolectric:4.17" not in text:
    text, n = re.subn(r"(?m)^dependencies\s*\{", "dependencies {\n    " + test_deps, text, count=1)
    if n != 1:
        raise SystemExit("Generated test dependencies block not found")
    gradle.write_text(text)
test_options = """testOptions {
        unitTests {
            includeAndroidResources = true
            all {
                jvmArgs += [
                    '--add-opens=java.base/java.lang=ALL-UNNAMED',
                    '--add-opens=java.base/java.util=ALL-UNNAMED',
                    '--add-opens=java.base/java.io=ALL-UNNAMED',
                    '--add-opens=java.base/java.net=ALL-UNNAMED',
                    '--add-opens=java.base/java.security=ALL-UNNAMED',
                    '--add-opens=java.base/java.text=ALL-UNNAMED',
                    '--add-opens=java.base/jdk.internal.access=ALL-UNNAMED',
                    '--add-opens=java.desktop/java.awt.font=ALL-UNNAMED',
                    '--add-opens=jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED',
                ]
            }
        }
    }
    """
if "includeAndroidResources = true" not in text:
    text, n = re.subn(r"(?m)^android\s*\{", "android {\n    " + test_options, text, count=1)
    if n != 1:
        raise SystemExit("Generated Android block not found")
    gradle.write_text(text)
root_gradle = android / "build.gradle"
text = root_gradle.read_text()
repo = "maven { url 'https://developer.huawei.com/repo/' }"
if repo not in text:
    text, n = re.subn(r"(allprojects\s*\{\s*repositories\s*\{)", r"\1\n        " + repo, text, count=1)
    if n != 1:
        raise SystemExit("Generated allprojects repositories block not found")
    root_gradle.write_text(text)

target = app / "src/main/java/com/mrcdrnzz/dailytracker/wear"
target.mkdir(parents=True, exist_ok=True)
shutil.copyfile(ROOT / "native/wear/WearEnginePlugin.java", target / "WearEnginePlugin.java")
shutil.copyfile(ROOT / "native/wear/WorkoutCommandStore.java", target / "WorkoutCommandStore.java")
test_target = app / "src/test/java/com/mrcdrnzz/dailytracker/wear"
test_target.mkdir(parents=True, exist_ok=True)
shutil.copyfile(ROOT / "native/wear/WorkoutCommandStoreTest.java", test_target / "WorkoutCommandStoreTest.java")
# Capacitor's PluginManager loads these classpaths. Do not also register in MainActivity.
registry = app / "src/main/assets/capacitor.plugins.json"
plugins = json.loads(registry.read_text())
classpath = "com.mrcdrnzz.dailytracker.wear.WearEnginePlugin"
plugins = [p for p in plugins if p.get("classpath") != classpath]
plugins.append({"pkg": "marc-internal-wear-lab", "classpath": classpath})
registry.write_text(json.dumps(plugins, indent=2) + "\n")
rules = app / "proguard-rules.pro"
text = rules.read_text()
for keep in (
    "-keep class com.mrcdrnzz.dailytracker.wear.WearEnginePlugin { *; }",
    "-keep class com.huawei.wearengine.** { *; }",
    "-keep class com.huawei.hmf.tasks.** { *; }",
):
    if keep not in text:
        text += "\n" + keep + "\n"
rules.write_text(text)
print("Wear Engine 5.0.3.300, plugin source and Capacitor registration patched; signing unchanged.")

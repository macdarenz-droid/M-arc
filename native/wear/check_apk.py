#!/usr/bin/env python3
"""Fail if registration OR the native class vanished from a packaged APK."""
import json
import sys
import zipfile

with zipfile.ZipFile(sys.argv[1]) as apk:
    plugins = json.loads(apk.read("assets/capacitor.plugins.json"))
    cls = "com.mrcdrnzz.dailytracker.wear.WearEnginePlugin"
    if not any(p.get("classpath") == cls for p in plugins):
        raise SystemExit("WearEnginePlugin missing from Capacitor APK registration")
    dex = [apk.read(name) for name in apk.namelist() if name.startswith("classes") and name.endswith(".dex")]
    for name in [cls, "com.mrcdrnzz.dailytracker.HealthConnectNativePlugin", "com.mrcdrnzz.dailytracker.watch.WatchBridgePlugin"]:
        descriptor = ("L" + name.replace(".", "/") + ";").encode()
        if not any(descriptor in part for part in dex):
            raise SystemExit(f"Native class missing from APK DEX: {name}")
print("APK native classes and Wear Engine registration PASS")

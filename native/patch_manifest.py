#!/usr/bin/env python3
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

ANDROID = "http://schemas.android.com/apk/res/android"
ET.register_namespace("android", ANDROID)

def a(name):
    return f"{{{ANDROID}}}{name}"

if len(sys.argv) != 2:
    raise SystemExit("Usage: patch_manifest.py <AndroidManifest.xml>")

path = Path(sys.argv[1])
if not path.exists():
    raise SystemExit(f"Manifest not found: {path}")

tree = ET.parse(path)
root = tree.getroot()

permissions = [
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.SCHEDULE_EXACT_ALARM",
    "android.permission.health.READ_STEPS",
    "android.permission.health.READ_SLEEP",
    "android.permission.health.READ_HEART_RATE",
    "android.permission.health.READ_ACTIVE_CALORIES_BURNED",
]
existing = {p.get(a("name")) for p in root.findall("uses-permission")}
for name in permissions:
    if name not in existing:
        node = ET.Element("uses-permission")
        node.set(a("name"), name)
        root.insert(0, node)

app = root.find("application")
if app is None:
    raise SystemExit("<application> not found")

# Health Connect privacy/rationale activity.
activity = None
for x in app.findall("activity"):
    if x.get(a("name")) == ".PermissionsRationaleActivity":
        activity = x
        break
if activity is None:
    activity = ET.SubElement(app, "activity")
    activity.set(a("name"), ".PermissionsRationaleActivity")
    activity.set(a("exported"), "true")

# Required Android 14+ alias for Health Connect permission usage/privacy entry.
alias = None
for x in app.findall("activity-alias"):
    if x.get(a("name")) == "ViewPermissionUsageActivity":
        alias = x
        break
if alias is None:
    alias = ET.SubElement(app, "activity-alias")
    alias.set(a("name"), "ViewPermissionUsageActivity")
    alias.set(a("exported"), "true")
    alias.set(a("targetActivity"), ".PermissionsRationaleActivity")
    alias.set(a("permission"), "android.permission.START_VIEW_PERMISSION_USAGE")
    filt = ET.SubElement(alias, "intent-filter")
    action = ET.SubElement(filt, "action")
    action.set(a("name"), "android.intent.action.VIEW_PERMISSION_USAGE")
    cat = ET.SubElement(filt, "category")
    cat.set(a("name"), "android.intent.category.HEALTH_PERMISSIONS")

ET.indent(tree, space="    ")
tree.write(path, encoding="utf-8", xml_declaration=True)
print(f"Patched {path}")

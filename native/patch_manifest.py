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
    "android.permission.health.READ_RESTING_HEART_RATE",
]
existing = {p.get(a("name")) for p in root.findall("uses-permission")}
for name in permissions:
    if name not in existing:
        node = ET.Element("uses-permission")
        node.set(a("name"), name)
        root.insert(0, node)

# Watch BLE (6.2): BLUETOOTH_SCAN never resolves location from the scan; BLUETOOTH_CONNECT is
# plain; the legacy trio covers Android 8-11, capped so a modern OS never grants them at runtime.
attributed_permissions = [
    ("android.permission.BLUETOOTH_SCAN", {"usesPermissionFlags": "neverForLocation"}),
    ("android.permission.BLUETOOTH_CONNECT", {}),
    ("android.permission.BLUETOOTH", {"maxSdkVersion": "30"}),
    ("android.permission.BLUETOOTH_ADMIN", {"maxSdkVersion": "30"}),
    ("android.permission.ACCESS_FINE_LOCATION", {"maxSdkVersion": "30"}),
    ("android.permission.FOREGROUND_SERVICE", {}),
    ("android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE", {}),
]
# PL-16: an entry a plugin already contributed still gets the required attributes.
for name, attrs in attributed_permissions:
    if name in existing:
        for node in root.findall("uses-permission"):
            if node.get(a("name")) == name:
                for k, v in attrs.items():
                    node.set(a(k), v)
        continue
    node = ET.Element("uses-permission")
    node.set(a("name"), name)
    for k, v in attrs.items():
        node.set(a(k), v)
    root.insert(0, node)
    existing.add(name)

if not any(f.get(a("name")) == "android.hardware.bluetooth_le" for f in root.findall("uses-feature")):
    feature = ET.SubElement(root, "uses-feature")
    feature.set(a("name"), "android.hardware.bluetooth_le")
    feature.set(a("required"), "false")

app = root.find("application")
if app is None:
    raise SystemExit("<application> not found")

# Keep the transient native journal out of cloud backup AND device transfer. Preserve
# existing rules (and all other app backup data) instead of replacing plugin policies.
def exclude_workout_database(attribute, default_name, root_tag, sections):
    ref = app.get(a(attribute))
    if ref in ("false", "true", "@null", None):
        if ref == "false":
            return  # Backup was already disabled for this format.
        ref = "@xml/" + default_name
    if not ref.startswith("@xml/"):
        raise SystemExit("Unsupported backup rules resource: " + ref)
    rules_path = path.parent / "res" / "xml" / (ref[5:] + ".xml")
    rules_path.parent.mkdir(parents=True, exist_ok=True)
    rules = ET.parse(rules_path) if rules_path.exists() else ET.ElementTree(ET.Element(root_tag))
    if rules.getroot().tag != root_tag:
        raise SystemExit("Unexpected backup rules root: " + str(rules_path))
    for section in sections:
        parent = rules.getroot()
        if section:
            node = parent.find(section)
            if node is None:
                node = ET.SubElement(parent, section)
            parent = node
        for suffix in ("", "-wal", "-shm", "-journal"):
            filename = "marc_watch_workout_v1.db" + suffix
            if not any(x.get("domain") == "database" and x.get("path") == filename for x in parent.findall("exclude")):
                ET.SubElement(parent, "exclude", {"domain": "database", "path": filename})
    ET.indent(rules, space="    ")
    rules.write(rules_path, encoding="utf-8", xml_declaration=True)
    app.set(a(attribute), ref)

exclude_workout_database("fullBackupContent", "marc_backup_rules", "full-backup-content", (None,))
exclude_workout_database("dataExtractionRules", "marc_data_extraction_rules", "data-extraction-rules", ("cloud-backup", "device-transfer"))

# Gate A: public Huawei app identity only. No app secret or agconnect configuration.
appid_name = "com.huawei.hms.client.appid"
appid = next((x for x in app.findall("meta-data") if x.get(a("name")) == appid_name), None)
if appid is None:
    appid = ET.SubElement(app, "meta-data")
    appid.set(a("name"), appid_name)
elif appid.get(a("value")) != "119100049":
    raise SystemExit("Unexpected Huawei app ID; refusing to overwrite")
appid.set(a("value"), "119100049")
queries = root.find("queries")
if queries is None:
    queries = ET.SubElement(root, "queries")
for package in ("com.huawei.health", "com.huawei.hwid"):
    if not any(x.get(a("name")) == package for x in queries.findall("package")):
        ET.SubElement(queries, "package").set(a("name"), package)

# WatchService (6.2): a foreground connected-device service, ported from Watch-test.
watch_service = None
for x in app.findall("service"):
    if x.get(a("name")) == ".watch.WatchService":
        watch_service = x
        break
if watch_service is None:
    watch_service = ET.SubElement(app, "service")
    watch_service.set(a("name"), ".watch.WatchService")
watch_service.set(a("foregroundServiceType"), "connectedDevice")
watch_service.set(a("exported"), "false")

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

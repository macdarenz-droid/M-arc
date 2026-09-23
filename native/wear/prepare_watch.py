#!/usr/bin/env python3
"""Overlay the diagnostic page into a NEW DevEco Lite Wearable template, outside this repo."""
import argparse
import hashlib
import shutil
from pathlib import Path

p = argparse.ArgumentParser(description=__doc__)
p.add_argument("--ability-dir", type=Path, required=True, help="New template's entry/src/main/js/MainAbility (or default)")
p.add_argument("--sdk", type=Path, required=True, help="Official Huawei wearengine.js, downloaded by the developer")
p.add_argument("--sdk-sha256", required=True, help="Expected SHA-256 from Huawei's SDK download")
p.add_argument("--replace-template-page", action="store_true", help="Explicitly allow replacing pages/index in this new template")
args = p.parse_args()
root = Path(__file__).resolve().parents[2]
ability = args.ability_dir.resolve()
if ability == root or root in ability.parents:
    raise SystemExit("Keep the DevEco build/signing workspace outside the public git repo")
if not (ability / "app.js").is_file():
    raise SystemExit("No template app.js found; select a generated Lite Wearable JS ability directory")
sdk = args.sdk.read_bytes()
digest = hashlib.sha256(sdk).hexdigest()
if digest.lower() != args.sdk_sha256.strip().lower():
    raise SystemExit("Official Wear Engine JS checksum mismatch")
page = ability / "pages/index"
if page.exists() and any(page.iterdir()) and not args.replace_template_page:
    raise SystemExit("Page exists. Use a new template and explicitly pass --replace-template-page")
page.mkdir(parents=True, exist_ok=True)
for name in ("index.js", "index.hml", "index.css", "probe.js"):
    shutil.copyfile(root / "native/wear/gt6-probe" / name, page / name)
vendor = ability / "wearengine"
vendor.mkdir(exist_ok=True)
(vendor / "wearengine.js").write_bytes(sdk)
print("Probe page copied. Official SDK SHA-256:", digest)
print("Review config.json, READ_HEALTH_DATA permission, device target and watch signing in DevEco before building.")
print("This script does not generate signing keys, publish, or claim GT6 compatibility.")

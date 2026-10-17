#!/usr/bin/env bash
# Sign an unsigned lite-wearable .bin with an AppGallery Connect certificate and profile, then build the signed HAP
# the way DevEco's debug build does (hvigor LegacyPackageHap + SignHap): pack the signed .bin as
# entry-default-signed.bin with app_packing_tool --mode hap --bin-path, then sign that zip.
# Usage: MARC_WATCH_KEY_PWD=<keystore password> sign-lite-bin.sh <sdk-folder> <unsigned.bin> <signed.bin> <keystore.p12> <key-alias> <cert.cer> <profile.p7b>
# Writes <signed.bin> (for Gadgetbridge's File Installer) and <signed.bin minus .bin>.hap (for DevEco Assistant).
# The HAP step needs the 7.0 SDK's app_packing_tool; the 3.2 one fails on --bin-path.
# The keystore, its password, the certificate and the profile stay outside the repo.
set -euo pipefail
SDK="$1"; IN="$2"; OUT="$3"; KS="$4"; ALIAS="$5"; CER="$6"; P7B="$7"
: "${MARC_WATCH_KEY_PWD:?set MARC_WATCH_KEY_PWD to the keystore password}"
SIGN="$SDK/toolchains/lib/hap-sign-tool.jar"
PACK="$SDK/toolchains/lib/app_packing_tool.jar"
HAP="${OUT%.bin}.hap"
filt() { grep -v 'Picked up JAVA_TOOL_OPTIONS' || true; }
sign() { java -jar "$SIGN" sign-app -mode localSign -keyAlias "$ALIAS" -keyPwd "$MARC_WATCH_KEY_PWD" -appCertFile "$CER" \
  -profileFile "$P7B" -signAlg SHA256withECDSA -keystoreFile "$KS" -keystorePwd "$MARC_WATCH_KEY_PWD" -compatibleVersion 6 "$@" 2>&1 | filt; }
mkdir -p "$(dirname "$OUT")"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
sign -inFile "$IN" -inForm bin -outFile "$OUT"
[ -f "$OUT" ] || { echo "ERROR: bin signing failed" >&2; exit 1; }
cp "$OUT" "$T/entry-default-signed.bin"
java -jar "$PACK" --mode hap --bin-path "$T/entry-default-signed.bin" --out-path "$T/unsigned.hap" --force true 2>&1 | filt || true
unzip -l "$T/unsigned.hap" >/dev/null 2>&1 || { echo "ERROR: HAP packing failed (needs the 7.0 SDK's app_packing_tool)" >&2; exit 1; }
sign -inFile "$T/unsigned.hap" -inForm zip -outFile "$HAP"
# verify-app cannot read a .bin (it treats it as ELF); the HAP it can verify. The .bin is checked by verify-signed-bin.py.
java -jar "$SIGN" verify-app -inFile "$HAP" -outCertChain "$T/chain.cer" -outProfile "$T/profile.p7b" 2>&1 | filt | grep -E 'verify-app|rror'
cmp -s "$T/profile.p7b" "$P7B" || { echo "ERROR: the HAP does not carry the given profile" >&2; exit 1; }
echo "Signed: $OUT and $HAP"

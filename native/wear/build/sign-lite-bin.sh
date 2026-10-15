#!/usr/bin/env bash
# Sign an unsigned lite-wearable .bin with an AppGallery Connect certificate and profile, then verify the result.
# Usage: MARC_WATCH_KEY_PWD=<keystore password> sign-lite-bin.sh <sdk-folder> <unsigned.bin> <signed.bin> <keystore.p12> <key-alias> <cert.cer> <profile.p7b>
# The keystore, its password, the certificate and the profile stay outside the repo.
set -euo pipefail
SDK="$1"; IN="$2"; OUT="$3"; KS="$4"; ALIAS="$5"; CER="$6"; P7B="$7"
: "${MARC_WATCH_KEY_PWD:?set MARC_WATCH_KEY_PWD to the keystore password}"
SIGN="$SDK/toolchains/lib/hap-sign-tool.jar"
filt() { grep -v 'Picked up JAVA_TOOL_OPTIONS' || true; }
mkdir -p "$(dirname "$OUT")"
java -jar "$SIGN" sign-app -mode localSign -keyAlias "$ALIAS" -keyPwd "$MARC_WATCH_KEY_PWD" -appCertFile "$CER" -profileFile "$P7B" \
  -inFile "$IN" -inForm bin -signAlg SHA256withECDSA -keystoreFile "$KS" -keystorePwd "$MARC_WATCH_KEY_PWD" -outFile "$OUT" -compatibleVersion 6 2>&1 | filt
V="$(mktemp -d)"
java -jar "$SIGN" verify-app -inFile "$OUT" -inForm bin -outCertChain "$V/chain.cer" -outProfile "$V/profile.p7b" 2>&1 | filt
rm -rf "$V"

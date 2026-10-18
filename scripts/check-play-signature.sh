#!/usr/bin/env bash
# PLAY-SIGN: proves a signed Play bundle is intact and signed ONLY by the expected key.
# Usage: scripts/check-play-signature.sh <bundle.aab> <expected signer SHA-256, colon hex>
# Used by the signing step and by its self-test, so the self-test exercises these exact checks.
# Overlap, on purpose: an unsigned bundle fails both the "jar verified." line and the signer check, and a
# missing file fails both the size test and jarsigner. Each case is still rejected if one of the pair is removed.
set -uo pipefail
AAB="${1:?bundle path}"; WANT="${2:?expected SHA-256}"
[ -s "$AAB" ] || { echo "::error::Signature check: $AAB does not exist"; exit 1; }
# No -strict: an upload certificate is self-signed, which -strict reports as an error (exit 4).
# The exact "jar verified." line rejects an unsigned jar ("no manifest.", exit 0) and "with signer errors";
# a changed entry fails with exit 1; an added entry is caught by the "unsigned entries" check below.
OUT="$(jarsigner -verify "$AAB" 2>&1)"; RC=$?
if [ $RC -ne 0 ] || ! printf '%s\n' "$OUT" | grep -qx 'jar verified.'; then
  printf '%s\n' "$OUT" | grep -v '^Picked up JAVA_TOOL_OPTIONS' | head -n 20
  echo "::error::Signature check: $AAB did not verify (jarsigner exit $RC)."; exit 1
fi
# jarsigner still prints "jar verified." when an entry was ADDED after signing; reject that too.
if printf '%s\n' "$OUT" | grep -q 'unsigned entries'; then
  echo "::error::Signature check: $AAB contains entries that are not signed."; exit 1
fi
SIGNERS="$(keytool -printcert -jarfile "$AAB" 2>/dev/null | sed -n 's/^[[:space:]]*SHA256: //p' | sort -u || true)"
if [ "$SIGNERS" != "$WANT" ]; then
  echo "::error::Signature check: signer(s) '$SIGNERS', expected only $WANT"; exit 1
fi
echo "signature ok: $AAB signed only by $WANT"

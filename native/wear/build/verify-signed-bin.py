#!/usr/bin/env python3
"""Offline check of a signed lite-wearable .bin, since hap-sign-tool's verify-app cannot read one.

    verify-signed-bin.py <signed.bin> <root.pem>

root.pem is the Huawei CBG Root CA G2 certificate, taken from the AppGallery Connect .cer chain.
Checks the layout hap-sign-tool's SignBin writes (unsigned file, two 8-byte block heads, the profile,
the PKCS#7 app signature, a 32-byte "hw signed app   " head), that the signed content hash covers
everything before the signature (SHA-256 over the SHA-256 of each 4 KB chunk, as HashUtils.getFileDigest
does), and both PKCS#7 signatures and chains with openssl. Needs openssl on PATH.
"""
import hashlib
import struct
import subprocess
import sys
import tempfile


def main(path, root):
    d = open(path, 'rb').read()
    head = d[-32:]
    if head[:16] != b'hw signed app   ':
        sys.exit('not signed: no "hw signed app" head')
    size, blocks = struct.unpack('>II', head[20:28])
    start = len(d) - size
    heads = [d[start + 8 * i:start + 8 * i + 8] for i in range(blocks)]
    (ptype, _, plen, poff), (_, _, _, soff) = [
        (h[0], h[1], struct.unpack('>H', h[2:4])[0], struct.unpack('>I', h[4:8])[0]) for h in heads]
    ok = poff == start + 8 * blocks and soff == poff + plen
    print(f'layout: unsigned {start} bytes, profile block type {ptype} ({plen} bytes), '
          f'signature {len(d) - 32 - soff} bytes:', 'OK' if ok else 'BAD OFFSETS')
    body = d[:soff]
    digest = hashlib.sha256(b''.join(
        hashlib.sha256(body[i:i + 4096]).digest() for i in range(0, len(body), 4096))).digest()
    with tempfile.TemporaryDirectory() as tmp:
        parts = {'app signature': d[soff:-32], 'profile': d[poff:poff + plen]}
        for name, der in parts.items():
            open(f'{tmp}/in.der', 'wb').write(der)
            r = subprocess.run(['openssl', 'cms', '-verify', '-inform', 'DER', '-in', f'{tmp}/in.der',
                                '-CAfile', root, '-purpose', 'any', '-binary', '-out', f'{tmp}/out'],
                               capture_output=True, text=True)
            good = r.returncode == 0
            ok &= good
            print(f'{name}: signature and chain', 'OK' if good else 'FAILED ' + r.stderr.strip()[-200:])
            if name == 'app signature' and good:
                match = digest in open(f'{tmp}/out', 'rb').read()
                ok &= match
                print('signed hash covers the file:', 'OK' if match else 'MISMATCH')
    print('RESULT:', 'OK' if ok else 'FAILED')
    return 0 if ok else 1


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2]))

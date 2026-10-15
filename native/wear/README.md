# M/ARC watch app (HUAWEI WATCH GT 6)

The watch lane's folder (`AGENTS.md`, file ownership). The GT 6 runs Lite Wearable JS apps (HML/CSS/JS, FA model, `deviceType: liteWearable`); see `docs/WATCH-ARCHITECTURE.md`.

## Build without DevEco Studio

`build/build-lite-bin.sh` compiles a lite-wearable module to an unsigned `.bin` and `.hap` on Linux with Node 22 and Java 17+. It repeats the steps hvigor-ohos-plugin 6.26.8 runs (read from its source): JS manifest, image copy, the SDK's ace-loader lite webpack, `restool`, the `lite_source` layout, `haptobin_tool.jar`, then `app_packing_tool.jar --mode hap`.

SDK: the public OpenHarmony 7.0 SDK, no login needed. From `https://repo.huaweicloud.com/openharmony/os/7.0-Release/ohos-sdk-windows_linux-public.tar.gz` take `ohos-sdk/linux/js-linux-x64-26.0.0.38-Beta.zip` (sha256 `1872b6cfbda0ae9a4a623d28212f570afd0895b971f6dee459a80da8486fe85d`) and `toolchains-linux-x64-26.0.0.38-Beta.zip` (sha256 `7b8bf76ce41e3815a6f6778e0a5ee93864c01c791d82b0de3f91ff0061b21236`), and unzip both into one folder.

```sh
build/build-lite-bin.sh <sdk-folder> hello/entry/src/main <out-folder> debug   # or release
python3 -I build/dump-bin.py <out-folder>/bin/entry-default-unsigned.bin       # lists the .bin's files
```

`hello/` is a one-page test app (a text and a button). On 2026-10-15 it built in both modes from this folder: debug `.bin` 136,432 B, release 134,169 B (sizes move a little with the build paths). Its page JS is about 3 KB, far below the 48 KB page limit. `config.json` uses the older API 6 shape (ability and JS entry both named `default`, `apiVersion` 6), because a GT watch rejects hvigor's newer shape with install error 40 (community GT 6 project leonsuv/hwgt6).

## Older SDK

The same script also builds with the public OpenHarmony 3.2 SDK (API 9, `ohos-sdk/linux/js-linux-x64-3.2.11.9-Release.zip` and `toolchains-linux-x64-3.2.11.9-Release.zip` from `https://repo.huaweicloud.com/openharmony/os/3.2-Release/ohos-sdk-windows_linux-public.tar.gz`), the SDK level the community iPhone tool HuaSideload uses. Its compiler ships without packages: run `npm ci --ignore-scripts` in `js/build-tools/ace-loader` (Huawei's lockfile, Huawei's npm mirror, integrity-checked) and build with `NODE_OPTIONS=--openssl-legacy-provider` on Node 17 or later. The config and the signature block come out the same as with the 7.0 SDK.

## First install attempts (2026-10-15)

- Installed three times through Gadgetbridge 0.95.1's File Installer on the GT 6 (software 6.1.0.118). Each time the upload finished and the watch reported 101 (started), then 10 %, then 103 (failed) about 2.15 s later. 103 carries no reason.
- In OpenHarmony's lite installer (`gt_bundle_installer.cpp`), 10 % is reported just before the signature and profile check and 50 % just after it, so the refusal sits in that check.
- Ruled out:
  - package format: HuaSideload's `check-watch-bin.py` rates it OK;
  - signature: `build/verify-signed-bin.py` passes it (layout, signed hash, both PKCS#7 signatures and chains to Huawei CBG Root CA G2). The app signer is our certificate, and the profile's development certificate is the same certificate;
  - profile: it parses under the rules of OpenHarmony's `app_provision.c` (debug type, bundle name, UDID list). Its signer matches the "HOS Profile Management Debug" entry in `app_verify.c`'s trust list;
  - UDID source: the value read over Bluetooth is also the watch's own HiChain auth ID in the pairing exchange, and it stayed the same after a factory reset;
  - watch developer options (turned on before the third attempt) and the watch clock.
- The Huawei account ID Gadgetbridge needs is not the AppGallery Connect developer ID. Entering the developer ID made the watch ask to delete the previous account's data and restart. Never confirm that prompt unless a reset is intended.
- Timing probes (2026-10-15, built from the SDK 3.2 build, time from the 10 % report to 103):
  - unsigned file: refused at once, with no 101 or 10 % report;
  - broken file hash: 1.03 s, after the app certificate chain and the hash;
  - profile block not signed: 1.16 s, after the app signature as well;
  - the real build: 2.02 s, so it also passes the profile's certificate chain (about 0.86 s more).
  The refusal therefore comes from the profile step after its chain. Either the watch does not trust the profile's signer, or it rejects something in the profile's content (the UDID, or a field). The SDK 3.2 build, without source maps, failed the same way, so the package contents are not the cause.
- Profile page: Huawei removed the older "HAP Provision Profile" page; its old help link now redirects to the "Certificates, app IDs, and profiles > Profiles" help. Huawei's GT-series lite-wearable guide (CN, updated 2026-08-19) links its debug-profile step to that page, and new apps can only be created as HarmonyOS NEXT records. So our profile comes from the documented route. Remaining suspect: the UDID. Huawei's documented source for a sports watch's UDID is DevEco Assistant's "Lite Wearable" tab, on a phone that is not on HarmonyOS NEXT.

## Not verified yet

- Install and run on the GT 6. That needs signing (below) and a way to install from a Samsung phone; DevEco Assistant is only offered on Huawei phones.
- Whether a release build runs the `.js` or the jerry `.bc` snapshot it also contains.
- Icon sizes (116 and 48 px were picked, not looked up).

## Signing

`build/sign-lite-bin.sh` signs the unsigned `.bin` with `hap-sign-tool.jar sign-app -mode localSign -inForm bin -signAlg SHA256withECDSA -compatibleVersion 6`, using the watch debug keystore (`.p12`), the debug certificate (`.cer`) and the debug profile (`.p7b`). The keystore password comes from `MARC_WATCH_KEY_PWD`. The keystore, its password, the certificate and the profile are kept outside the repo: the owner holds them.

AppGallery Connect (2026-10-15): HarmonyOS app `com.mrcdrnzz.dailytracker.watch` (in its own project), the GT 6 registered as a sports watch by its UDID, a debug certificate from our EC P-256 CSR, and a debug profile for that app, certificate and watch, valid until 2027-10-15. Checked before use: the certificate carries our key, and the profile names this bundle, this certificate and the one watch.

On 2026-10-15 the `hello/` app built and signed: the signed `.bin` is the unsigned one plus a 6,663-byte signature block that holds the certificate and the profile and ends with `hw signed app   1000`. This SDK's `verify-app` cannot check a `.bin` (it reads it as ELF); `build/verify-signed-bin.py <signed.bin> <root.pem>` checks it offline instead.

## Installing from a non-Huawei phone

DevEco Assistant is only offered on Huawei phones. The candidate route is Gadgetbridge's File Installer (upstream 0.95.1), which uploads a signed `.bin` and leaves the signature check to the watch. It needs Gadgetbridge paired with the watch through the Huawei account ID, and it switches the watch between Gadgetbridge and Huawei Health. In use since 2026-10-15; see the install attempts above.

The UDID came from the Watch UDID tool in the Watch-test repo (`udid-tool/`) on 2026-10-15; the value is kept out of this public repo.

## Huawei console submissions

Owner rule (2026-10-15): everything entered in the Huawei developer console is reviewed and red-teamed against the approved Wear Engine application before it is submitted. Two applications were rejected for inconsistent documents and form answers.

The record, the console entries, the red-team findings and the pre-submission checklist are in `docs/WATCH-WEAR-ENGINE-APPLICATION.md` (sections 9 and 10). Signed builds carry the owner's name and the watch's UDID, so `.gitignore` here blocks built and signing files.

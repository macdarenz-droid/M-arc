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

## Not verified yet

- Install and run on the GT 6. That needs signing (below) and a way to install from a Samsung phone; DevEco Assistant is only offered on Huawei phones.
- Whether a release build runs the `.js` or the jerry `.bc` snapshot it also contains.
- Icon sizes (116 and 48 px were picked, not looked up).

## Signing

`build/sign-lite-bin.sh` signs the unsigned `.bin` with `hap-sign-tool.jar sign-app -mode localSign -inForm bin -signAlg SHA256withECDSA -compatibleVersion 6`, using the watch debug keystore (`.p12`), the debug certificate (`.cer`) and the debug profile (`.p7b`). The keystore password comes from `MARC_WATCH_KEY_PWD`. The keystore, its password, the certificate and the profile are kept outside the repo: the owner holds them.

AppGallery Connect (2026-10-15): HarmonyOS app `com.mrcdrnzz.dailytracker.watch` (in its own project), the GT 6 registered as a sports watch by its UDID, a debug certificate from our EC P-256 CSR, and a debug profile for that app, certificate and watch, valid until 2027-10-15. Checked before use: the certificate carries our key, and the profile names this bundle, this certificate and the one watch.

On 2026-10-15 the `hello/` app built and signed: the signed `.bin` is the unsigned one plus a 6,663-byte signature block that holds the certificate and the profile and ends with `hw signed app   1000`. This SDK's `verify-app` cannot check a `.bin` (it reads it as ELF), so the real check is the watch accepting the install.

## Installing from a non-Huawei phone

DevEco Assistant is only offered on Huawei phones. The candidate route is Gadgetbridge's File Installer (upstream 0.95.1), which uploads a signed `.bin` and leaves the signature check to the watch. It needs Gadgetbridge paired with the watch through the Huawei account ID, and it switches the watch between Gadgetbridge and Huawei Health. Not tried yet; the owner decides.

The UDID came from the Watch UDID tool in the Watch-test repo (`udid-tool/`) on 2026-10-15; the value is kept out of this public repo.

## Huawei console submissions

Owner rule (2026-10-15): everything entered in the Huawei developer console is reviewed and red-teamed against the approved Wear Engine application before it is submitted. Two applications were rejected for inconsistent documents and form answers.

The record, the console entries, the red-team findings and the pre-submission checklist are in `docs/WATCH-WEAR-ENGINE-APPLICATION.md` (sections 9 and 10). Signed builds carry the owner's name and the watch's UDID, so `.gitignore` here blocks built and signing files.

# M/ARC watch app (HUAWEI WATCH GT 6)

The watch lane's folder (`AGENTS.md`, file ownership). The GT 6 runs Lite Wearable JS apps (HML/CSS/JS, FA model, `deviceType: liteWearable`); see `docs/WATCH-ARCHITECTURE.md`.

## Build without DevEco Studio

`build/build-lite-bin.sh` compiles a lite-wearable module to an unsigned `.bin` and `.hap` on Linux with Node 22 and Java 17+. It repeats the steps hvigor-ohos-plugin 6.26.8 runs (read from its source): JS manifest, image copy, the SDK's ace-loader lite webpack, `restool`, the `lite_source` layout, `haptobin_tool.jar`, then `app_packing_tool.jar --mode hap`.

SDK: the public OpenHarmony 7.0 SDK, no login needed. From `https://repo.huaweicloud.com/openharmony/os/7.0-Release/ohos-sdk-windows_linux-public.tar.gz` take `ohos-sdk/linux/js-linux-x64-26.0.0.38-Beta.zip` (sha256 `1872b6cf…a486fe85d`) and `toolchains-linux-x64-26.0.0.38-Beta.zip` (sha256 `7b8bf76c…61b21236`), and unzip both into one folder.

```sh
build/build-lite-bin.sh <sdk-folder> hello/entry/src/main <out-folder> debug   # or release
python3 -I build/dump-bin.py <out-folder>/bin/entry-default-unsigned.bin       # lists the .bin's files
```

`hello/` is a one-page test app (a text and a button). On 2026-10-15 it built in both modes from this folder: debug `.bin` 136,432 B, release 134,169 B (sizes move a little with the build paths). Its page JS is about 3 KB, far below the 48 KB page limit. `config.json` uses the older API 6 shape (ability and JS entry both named `default`, `apiVersion` 6), because a GT watch rejects hvigor's newer shape with install error 40 (community GT 6 project leonsuv/hwgt6).

## Not verified yet

- Install and run on the GT 6. That needs signing (below) and a way to install from a Samsung phone; DevEco Assistant is only offered on Huawei phones.
- Whether a release build runs the `.js` or the jerry `.bc` snapshot it also contains.
- Icon sizes (116 and 48 px were picked, not looked up).

## Signing (needs the owner)

`toolchains/lib/hap-sign-tool.jar sign-app -mode localSign -signAlg SHA256withECDSA -inForm bin -compatibleVersion 6` with a keystore (`.p12`), the debug certificate (`.cer`) and the debug profile (`.p7b`). The certificate and profile come from AppGallery Connect: a HarmonyOS app for the watch (bundle name), a debug certificate from our CSR, the watch registered by its UDID, and a debug profile tying them together. The keystore and its passwords are secrets: never commit them.

The UDID comes from the Watch UDID tool in the Watch-test repo (`udid-tool/`), because DevEco Assistant is not available on the owner's phone.

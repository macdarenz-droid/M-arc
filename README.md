# M•ARC V36.7

Fresh GitHub repository source for the M•ARC Android/PWA tracker.

## Automatic APK
Push the repository to `main` or `master`. GitHub Actions runs **Build M-ARC Debug APK** and uploads an installable debug APK artifact. No signing secrets are required for this automatic build.

## Signed release APK
Run **Build Signed M-ARC Release APK** manually after adding the four repository Actions secrets documented in `FRESH_GITHUB_UPLOAD_INSTRUCTIONS.txt`.

## Locked app source
`www/index.html` SHA-256:

`5563acffb233fdfc69fce97d3d6eb0972fbcdfeda92c3d833fc209f8b2e7fe66`

The Android project is intentionally generated fresh in CI rather than committed to this repository.

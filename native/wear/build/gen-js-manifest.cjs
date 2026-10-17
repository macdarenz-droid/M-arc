// Usage: node gen-js-manifest.cjs <config.json> <js-name> <out manifest.json>
// Mirrors hvigor-ohos-plugin 6.26.8 LegacyGenerateJsManifest.generateJsonInfo for a lite-only target.
const fs = require('fs'), path = require('path');
const [cfgPath, jsName, outPath] = process.argv.slice(2);
const c = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const js = c.module.js.find(j => j.name === jsName);
if (!js) throw new Error('no js entry named ' + jsName);
const abilities = c.module.abilities || [];
let appName = abilities[0].label || abilities[0].name;
for (const a of abilities) {
  if (a.skills && a.skills[0] && a.skills[0].actions && a.skills[0].actions[0] === 'action.system.home') { appName = a.name; break; }
}
const m = {
  appID: c.app.bundleName,
  versionName: c.app.version.name,
  versionCode: c.app.version.code,
  minPlatformVersion: c.app.apiVersion.compatible,
  appName,
  deviceType: c.module.deviceType,
  window: true,
  pages: js.pages,
  type: abilities[0].type || 'page',
  compatibleSdkVersionStage: ''
};
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(m, null, 2));

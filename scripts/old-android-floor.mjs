// OLD-ANDROID-1b (D-OA1-FLOOR): the oldest WebView the app runs on, as one source of truth.
// index.html probes each FEATURES entry before the bundle loads; below the floor it shows the
// update screen. tests/old-android-floor.test.ts and the OLD-ANDROID-1 gate block read this file.
// Chrome versions are the first stable release that ships the feature (MDN browser-compat-data).

/** The features the app needs; `probe` is the exact ES5 expression index.html runs (true = missing). */
export const FEATURES = [
  { id: 'modules', chrome: 61, probe: "!('noModule' in document.createElement('script'))" },
  { id: 'at', chrome: 92, probe: '![].at' },
  { id: 'animation', chrome: 84, probe: "!(window.Animation && 'finished' in Animation.prototype)" },
  { id: 'color-mix', chrome: 111, probe: "!(window.CSS && CSS.supports && CSS.supports('color','color-mix(in srgb, red, red)'))" },
];

/** The floor: an engine that passes every probe is at least this Chrome version. */
export const FLOOR = Math.max(...FEATURES.map(f => f.chrome));

/** JS APIs newer than the floor. A built chunk naming one needs an ALLOW entry. */
export const JS_APIS = [
  { token: 'Promise.withResolvers', chrome: 119 },
  { token: 'Object.groupBy', chrome: 117 },
  { token: 'Map.groupBy', chrome: 117 },
  { token: 'Array.fromAsync', chrome: 121 },
  { token: '.toSorted(', chrome: 110 },
  { token: '.toReversed(', chrome: 110 },
  { token: '.toSpliced(', chrome: 110 },
  { token: '.findLast(', chrome: 97 },
  { token: '.union(', chrome: 122 },
  { token: '.intersection(', chrome: 122 },
  { token: '.symmetricDifference(', chrome: 122 },
  { token: '.isSubsetOf(', chrome: 122 },
  { token: '.isSupersetOf(', chrome: 122 },
  { token: '.isDisjointFrom(', chrome: 122 },
  { token: 'URL.canParse', chrome: 120 },
  { token: 'URL.parse(', chrome: 126 },
  { token: 'Iterator.prototype', chrome: 122 },
  { token: 'RegExp.escape', chrome: 136 },
  { token: 'Promise.try', chrome: 128 },
];

/** CSS features newer than some old WebViews; any above FLOOR must sit inside @supports. */
export const CSS_TOKENS = [
  { token: 'inset:', chrome: 87 },
  { token: 'translate:', chrome: 104 },
  { token: 'scale:', chrome: 104 },
  { token: 'rotate:', chrome: 104 },
  { token: ':has(', chrome: 105 },
  { token: 'dvh', chrome: 108 },
  { token: 'svh', chrome: 108 },
  { token: 'lvh', chrome: 108 },
  { token: 'color-mix(', chrome: 111 },
  { token: 'linear(', chrome: 113 },
  { token: 'subgrid', chrome: 117 },
  { token: '@starting-style', chrome: 117 },
];

/** Per-site exceptions to the JS_APIS / CSS_TOKENS scans: `file` is a prefix of the built asset's name. */
export const ALLOW = [
  {
    file: 'zoom-pull-up-', token: 'subgrid',
    reason: 'src/slices/howto/css/zoom-pull-up.css .th-cell (HT lane, golden plate): only lines up the pull-up caption heights. On Chrome 111-116 the declaration is dropped and each cell keeps its own auto rows; the plate still shows.',
  },
];

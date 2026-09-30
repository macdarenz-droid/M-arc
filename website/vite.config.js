// The M/ARC website build. Plain JavaScript so the app's typecheck never sees it (docs/WEBSITE-DESIGN.md section 12).
import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { SITE_BASE, SITE_URL, SITE_APP_URL } from './site.config.mjs';
import { renderPolicy, checkPolicy } from './policy.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const repo = resolve(here, '..');
const pkg = JSON.parse(readFileSync(resolve(repo, 'package.json'), 'utf8'));
const VERSION = pkg.version;
if (!/^\d+\.\d+\.\d+$/.test(VERSION)) throw new Error(`website: package.json version "${VERSION}" is not x.y.z`);

// The public signing-key fingerprint, read as text from the one constant that holds it (read only; nothing here signs anything).
const workflow = readFileSync(resolve(repo, '.github/workflows/build-apk.yml'), 'utf8');
const fpMatch = workflow.match(/EXPECTED_SHA256:\s*'([0-9A-F:]+)'/);
const FINGERPRINT = fpMatch ? fpMatch[1] : '';
if (!/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(FINGERPRINT)) throw new Error('website: EXPECTED_SHA256 in build-apk.yml is not 32 colon-separated hex pairs');

// The privacy policy's one source (DOC-3): docs/PRIVACY-POLICY.md, rendered into /privacy/ at every build.
const POLICY = renderPolicy(readFileSync(resolve(repo, 'docs/PRIVACY-POLICY.md'), 'utf8'));

const BUILD_DATE = new Date().toISOString().slice(0, 10);
const flags = { APP_URL: SITE_APP_URL !== '', SITE_URL: SITE_URL !== '' };

/** Inline plugins (no dependency): `__TOKEN__` replacement and `<!-- if NAME -->…<!-- else -->…<!-- endif -->` blocks in every page.
 *  Two passes. Before Vite's asset pass: conditionals and every token except the absolute-URL ones, so `/shots/…` and the icons
 *  resolve to public/. After it: `__SITE_URL____BASE__` (canonical, og:url, og:image), which Vite would otherwise read as an asset path. */
function tokensPre() {
  return {
    name: 'marc-site-tokens-pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const out = html.replace(/<!-- if (APP_URL|SITE_URL) -->([\s\S]*?)(?:<!-- else -->([\s\S]*?))?<!-- endif -->/g, (_, name, yes, no = '') => (flags[name] ? yes : no));
        return out
          .replace(/<!-- policy:title -->/g, () => POLICY.title)
          .replace(/<!-- policy:effective -->/g, () => POLICY.effective)
          .replace(/<!-- policy:body -->/g, () => POLICY.body)
          .replace(/__VERSION__/g, VERSION)
          .replace(/__FINGERPRINT_WBR__/g, FINGERPRINT.replace(/:/g, ':<wbr>')) // the /install/ block: a wrap may fall only between pairs (6.11)
          .replace(/__FINGERPRINT__/g, FINGERPRINT)
          .replace(/__APP_URL__/g, SITE_APP_URL)
          .replace(/__BUILD_DATE__/g, BUILD_DATE)
          .replace(/(?<!__SITE_URL)__BASE__/g, SITE_BASE);
      },
    },
  };
}
function tokensPost() {
  return {
    name: 'marc-site-tokens-post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const out = html.replace(/__SITE_URL____BASE__/g, SITE_URL + SITE_BASE).replace(/__SITE_URL__/g, SITE_URL);
        const left = out.match(/__(VERSION|FINGERPRINT_WBR|FINGERPRINT|SITE_URL|APP_URL|BUILD_DATE|BASE)__/);
        if (left) throw new Error(`website: ${ctx.path} still contains the token ${left[0]}`);
        if (/<!-- policy:/.test(out)) throw new Error(`website: ${ctx.path} still contains a policy marker`);
        if (/\/privacy\/index\.html$/.test(ctx.path)) {
          const missing = checkPolicy(out);
          if (missing.length) throw new Error(`website: /privacy/ is missing required policy sections: ${missing.join('; ')}`);
        }
        return out;
      },
    },
    // robots.txt always ships from public/; the Sitemap line and sitemap.xml exist only once SITE_URL is set (section 10).
    closeBundle() {
      if (!flags.SITE_URL) return;
      const out = resolve(here, 'dist');
      const origin = SITE_URL.replace(/\/$/, '') + SITE_BASE;
      const urls = ['', 'install/', 'privacy/']
        .map((p) => `  <url><loc>${origin}${p}</loc><lastmod>${BUILD_DATE}</lastmod></url>`)
        .join('\n');
      writeFileSync(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
      const robots = resolve(out, 'robots.txt');
      if (existsSync(robots)) appendFileSync(robots, `Sitemap: ${origin}sitemap.xml\n`);
    },
  };
}

export default defineConfig({
  root: here,
  base: SITE_BASE,
  publicDir: 'public',
  plugins: [tokensPre(), tokensPost()],
  define: { __SITE_VERSION__: JSON.stringify(VERSION) },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: resolve(here, 'index.html'),
        install: resolve(here, 'install/index.html'),
        privacy: resolve(here, 'privacy/index.html'),
        notfound: resolve(here, '404.html'),
      },
    },
  },
});

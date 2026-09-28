// The three values the site needs from outside. Set them once, in the Pages workflow's env block (docs/WEBSITE-DESIGN.md section 2.5).
export const SITE_BASE = process.env.SITE_BASE ?? '/'; // '/' for a root domain, '/M-arc/' for a GitHub project page
export const SITE_URL = process.env.SITE_URL ?? ''; // 'https://example.org' once the domain exists; '' until then
export const SITE_APP_URL = process.env.SITE_APP_URL ?? ''; // the hosted web app, '' until it exists

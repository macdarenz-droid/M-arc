// muscle-check.cjs: the target muscle stays visible at the hardest point. Shared by rig-final/shoot.cjs and every
// player's shoot.cjs (UPGRADE-BRIEF.md quality bar; the lat pulldown review found the lats hidden at the squeeze).
// It counts the accent-coloured pixels of the main-muscle polygons (.mm) in a screenshot of the stage at the setup pose
// (t 0) and in the hold (t 0.3), with the effort cue and the glow neutralised (opacity 1, glow hidden) and every other
// accent element hidden (guides, trail, pin, overlays, arrows, pills, badges, the muscle hotspots; helper muscles painted in the body tone),
// so only the muscle itself counts, minus whatever other parts cover it. It passes when the hold shows at least 97 % of
// the setup area (a rotated polygon changes its pixel count by about 1 % through anti-aliasing) and prints both counts.
// page: an open Playwright page at the player (its harness exposes window.__rig.freeze); cfg: { label }; check(ok, msg).
async function muscleAreaCheck(page, cfg, check) {
  await page.addStyleTag({ content: '.gw,.hot,.guide,.trail,.pin,.ov,.arrow,.arrow-head,.pill-row,.cam-label,.badge{display:none!important}.mm{opacity:1!important;animation:none!important}.mh{fill:var(--body)!important}' });
  const accent = await page.evaluate(() => getComputedStyle(document.querySelector('.player')).getPropertyValue('--accent').trim());
  const hex = accent.match(/^#([0-9a-f]{6})$/i);
  const rgb = hex ? [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16)) : null;
  const count = async t => {
    await page.evaluate(t => window.__rig.freeze(t), t);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const b64 = (await (await page.$('.stage')).screenshot()).toString('base64');
    return page.evaluate(async ({ src, rgb }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + src; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0;
      for (let i = 0; i < d.length; i += 4) if (Math.hypot(d[i] - rgb[0], d[i + 1] - rgb[1], d[i + 2] - rgb[2]) < 40) n++;
      return n;
    }, { src: b64, rgb });
  };
  const setup = rgb ? await count(0) : 0, hold = rgb ? await count(0.3) : 0;
  check(!!rgb && setup > 0 && hold >= setup * 0.97, `${cfg.label}: target muscle visible at the hardest point: ${hold} accent pixels in the hold (t 0.3) vs ${setup} at setup (t 0), at least 97 % (accent ${accent}; glow, guides, pin, overlays and helpers hidden while counting)`);
  return { setup, hold };
}

module.exports = { muscleAreaCheck };

// caption-check.cjs: the caption row never overlaps or leaves the player. Shared by rig-final/shoot.cjs and every
// player's shoot.cjs (UPGRADE-BRIEF.md quality bar: "the caption row never overflows"). States: idle (before the first
// Play), ended (after the 3 reps), the four phase captions, and Pictures. The harness draws the row with the canvas
// font: it loads Roboto the way the artboard does (the Google Fonts link) and, for offline shoots, from the local copy
// in rig-final/fonts/. Two checks: (1) in every state the caption box stays left of the tempo box and both stay inside
// the player, whatever font drew them (.cap shrinks with an ellipsis before it can push the tempo out); (2) Roboto drew
// the row and no state clipped the caption. Both print the boxes; (2) names the clipped states and the font.
// open(query) -> { page, ctx } (the caller's opener); cfg: { label, states: [[query, name, prep?]] }; check(ok, msg).
async function captionRowCheck(open, cfg, check) {
  const rows = [];
  for (const [q, name, prep] of cfg.states) {
    const { page, ctx } = await open(q);
    if (prep) await page.evaluate(prep);
    await page.waitForTimeout(150);
    const r = await page.evaluate(async () => {
      await document.fonts.ready;
      const roboto = [...document.fonts].some(f => /roboto/i.test(f.family) && f.status === 'loaded');
      const pl = document.querySelector('.player').getBoundingClientRect(), row = document.querySelector('.cap-row'), cap = document.querySelector('.cap'), tempo = document.querySelector('.tempo');
      const c = cap.getBoundingClientRect(), shown = tempo && !tempo.hidden && !tempo.closest('[hidden]') && tempo.getClientRects().length > 0, t = shown ? tempo.getBoundingClientRect() : null;
      const vis = [...cap.querySelectorAll('span')].find(el => !el.hidden && !el.closest('[hidden]') && el.getClientRects().length && getComputedStyle(el).opacity !== '0');
      return { roboto, text: (vis ? vis.textContent : cap.textContent).trim().replace(/\s+/g, ' ').slice(0, 36), capL: c.left - pl.left, capR: c.right - pl.left, tempoL: t ? t.left - pl.left : null, tempoR: t ? t.right - pl.left : null, rowOver: row.scrollWidth - row.clientWidth, clipped: cap.scrollWidth - cap.clientWidth, width: pl.width };
    });
    rows.push({ name, ...r }); await ctx.close();
  }
  const roboto = rows.every(r => r.roboto);
  const bad = rows.filter(r => !(r.capL >= -0.5 && r.capR <= r.width + 0.5 && r.rowOver <= 0 && (r.tempoL === null || (r.capR <= r.tempoL + 0.5 && r.tempoR <= r.width + 0.5))));
  const clipped = rows.filter(r => r.clipped > 0.5);
  const box = r => `${r.name} cap ${r.capL.toFixed(0)}-${r.capR.toFixed(0)}${r.tempoL !== null ? ' tempo ' + r.tempoL.toFixed(0) + '-' + r.tempoR.toFixed(0) : ''}`;
  check(bad.length === 0, `${cfg.label}: caption and tempo never overlap or leave the ${rows[0].width} px player in ${rows.length} states (${rows.map(box).join('; ')})${bad.length ? '; BAD: ' + bad.map(r => r.name).join(', ') : ''}`);
  check(roboto && clipped.length === 0, `${cfg.label}: the canvas font drew the caption row (Roboto ${roboto ? 'loaded' : 'NOT loaded, fallback font'}) and no state clipped the caption${clipped.length ? ' (clipped: ' + clipped.map(r => `${r.name} "${r.text}" by ${r.clipped.toFixed(0)} px`).join(', ') + ')' : ' (longest: "' + rows.reduce((w, r) => (r.capR - r.capL > w.capR - w.capL ? r : w), rows[0]).text + '")'}`);
  return rows;
}

module.exports = { captionRowCheck };

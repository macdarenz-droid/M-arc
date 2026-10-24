// The tempo-strip patch text (one once()-replacement of the mirror copy's tempoStrip; plates page and layers page).
export const NOSECS_STRIP = `const tempoStrip = tempo => {
  const timed = tempo.every(t => t.s != null);   // NOSECS: any phase without sourced seconds -> no phase gets a time weight
  const say = t => (t.s != null ? \`\${plain(t.phase).toLowerCase()} \${t.s} second\${t.s === 1 ? '' : 's'}\` : [plain(t.phase).toLowerCase(), t.word?.toLowerCase()].filter(Boolean).join(' '));
  const val = t => (t.s != null ? \`\${t.s} s\` : t.word ? esc(t.word) : '&nbsp;');
  return \`<div class="tempo" role="img" aria-label="Tempo: \${esc(tempo.map(say).join(', '))}">\${tempo.map(t =>
    \`<div class="tempo-seg\${t.move ? ' move' : ''}" style="flex:\${timed ? t.s : 1} 1 0"><i></i><div class="tempo-label"><b>\${esc(t.phase)}</b><span>\${val(t)}</span></div></div>\`).join('')}</div>\`;
};
`;

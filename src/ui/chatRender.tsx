/**
 * The markdown-lite convention every AI chat surface in this app follows
 * (see promptAsk.ts rule 13, promptSplitBuilder.ts): a blank-line paragraph
 * break, a "- "-prefixed line list, and `**term**` for emphasis. Shared here
 * so Coach's "Ask the coach" sheet and Train's split-builder chat render it
 * identically rather than keeping two copies in sync by hand. Also holds
 * the two other pieces both chat surfaces share: the rotating typed-out
 * placeholder and the input row it drives.
 */
import { useEffect, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import { Button } from './primitives';
import { IconSend } from './icons';

/** The coach's persona name, shown next to its mark on every AI reply and every entry point that opens a chat with it. A private, personal touch, not a feature — see COACH_BRAIN.md's decision log. */
export const COACH_NAME = 'Escobar';

type BulletIcon = (p: { size?: number; class?: string; 'aria-hidden'?: boolean }) => JSX.Element;

/** `**term**` becomes emphasis; everything else passes through untouched. Never touches a raw string with HTML — this builds real child nodes, so there is nothing to escape or inject. */
export function renderChatInline(text: string): ComponentChildren {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(p => p.length > 0);
  return parts.map((part, i) => (part.startsWith('**') && part.endsWith('**') && part.length > 4) ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}

/**
 * Turns the plain-text convention into real <p>/<ul> structure with a small
 * icon per bullet, rather than relying on `white-space: pre-wrap` to fake
 * it with raw dashes. Filters out an empty block first — a trailing (or
 * doubled) blank line in the answer would otherwise survive as a stray
 * empty <p>, whose CSS top-margin adds visible dead space at the bottom of
 * the bubble.
 */
export function renderChatBody(text: string, Icon: BulletIcon): ComponentChildren {
  return text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean).map((block, bi) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const isList = lines.length > 0 && lines.every(l => l.startsWith('- '));
    if (isList) return <ul class="ask-list" key={bi}>{lines.map((l, li) => <li key={li}><Icon size={14} class="ask-list-icon" aria-hidden={true} /><span>{renderChatInline(l.slice(2))}</span></li>)}</ul>;
    return <p key={bi}>{renderChatInline(block.trim())}</p>;
  });
}

/** Types a phrase out, holds it, erases it, moves to the next — only while `active` (the input is empty and nothing is sending). Falls back to a plain swap with no per-character animation under prefers-reduced-motion, the same treatment `Thinking`'s spinner gets in styles.css. `phrases` should be a stable array (module-level or memoized) since it's read fresh on every restart of the effect. */
export function useTypewriterPlaceholder(phrases: readonly string[], active: boolean): string {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!active) { setText(''); return; }
    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TYPE_MS = 38, ERASE_MS = 22, HOLD_FULL_MS = 1600, HOLD_EMPTY_MS = 400;
    let cancelled = false, phrase = 0;
    const after = (fn: () => void, ms: number) => setTimeout(() => { if (!cancelled) fn(); }, ms);
    const run = () => {
      const full = phrases[phrase % phrases.length]!;
      if (reduced) { setText(full); after(() => { phrase++; run(); }, HOLD_FULL_MS + TYPE_MS * full.length); return; }
      const typeStep = (i: number) => {
        setText(full.slice(0, i));
        if (i >= full.length) { after(() => eraseStep(full.length), HOLD_FULL_MS); return; }
        after(() => typeStep(i + 1), TYPE_MS);
      };
      const eraseStep = (j: number) => {
        setText(full.slice(0, j));
        if (j <= 0) { after(() => { phrase++; run(); }, HOLD_EMPTY_MS); return; }
        after(() => eraseStep(j - 1), ERASE_MS);
      };
      typeStep(0);
    };
    run();
    return () => { cancelled = true; };
  }, [active, phrases]);
  return text;
}

/** Its own component so the typewriter's per-character re-renders touch only the input row, not the whole thread of past messages above it. */
export function ChatInputRow({ value, setValue, sending, onSubmit, placeholders, maxLength }: { value: string; setValue: (v: string) => void; sending: boolean; onSubmit: (e: SubmitEvent) => void; placeholders: readonly string[]; maxLength: number }) {
  const placeholder = useTypewriterPlaceholder(placeholders, value.length === 0 && !sending);
  return (
    <form class="ask-input" onSubmit={onSubmit}>
      <input value={value} maxLength={maxLength} placeholder={placeholder} disabled={sending} onInput={e => setValue((e.target as HTMLInputElement).value)} />
      <Button variant="primary" size="sm" type="submit" class="btn-icon" disabled={sending || !value.trim()} aria-label="Send"><IconSend size={16} /></Button>
    </form>
  );
}

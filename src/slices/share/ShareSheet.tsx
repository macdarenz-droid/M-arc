/**
 * F12: the share sheet from the design study. Period chips, a swipeable carousel of the three
 * cards (Poster, Sticker, Receipt), 9:16 or 1:1, and Photo, Save and Share. Opened from the
 * finish screen, a History session card, and History → Stats.
 */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { state } from '@/core/store';
import { today, unit } from '@/app/selectors';
import type { Session } from '@/core/models';
import { Sheet } from '@/ui/primitives';
import { IconCamera, IconDownload, IconShare, IconX } from '@/ui/icons';
import { themeId } from '@/theme/engine';
import { THEMES } from '@/theme/themes';
import { pickAndCompressPhoto } from '@/native/photo';
import { saveImage, shareImage } from '@/native/share';
import markUrl from '@/assets/escobar-mark.png?inline';
import { WEIGHT_THINGS } from '@/data/weights';
import { cardData, latestSession, SHARE_PERIODS, type SharePeriod } from './cardData';
import { CARD_PX, CARD_STYLES, cardFileName, cardSvg, paletteFor, type CardFormat } from './cards';

const STYLE_KEY = 'marc.share.style';
const readStyle = (): number => { try { const n = Number(localStorage.getItem(STYLE_KEY)); return Number.isInteger(n) && n >= 0 && n < CARD_STYLES.length ? n : 0; } catch { return 0; } };
const writeStyle = (i: number) => { try { localStorage.setItem(STYLE_KEY, String(i)); } catch { /* the choice just isn't remembered */ } };
/** Poster comparisons already shared, oldest first, so the next card says something new. */
const SEEN_KEY = 'marc.share.seen';
const readSeen = (): string[] => { try { const v: unknown = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]'); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; } };
const markSeen = (id: string) => { try { localStorage.setItem(SEEN_KEY, JSON.stringify([...readSeen().filter(x => x !== id), id].slice(-WEIGHT_THINGS.length))); } catch { /* repeats just become possible */ } };

/** Draws an SVG card onto a canvas at export size and encodes it as PNG. */
export async function svgToPng(svg: string, w: number, h: number): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.drawImage(img, 0, 0, w, h);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Could not encode the card'))), 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface ShareSheetProps {
  /** The chip selected when the sheet opens. */
  initial: SharePeriod;
  /** The workout behind "This workout"; the newest session when left out. */
  session?: Session | null;
  onClose: () => void;
}

export function ShareSheet({ initial, session, onClose }: ShareSheetProps) {
  const s = state.value;
  const u = unit.value;
  const workout = session ?? latestSession(s.sessions);
  const [period, setPeriod] = useState<SharePeriod>(initial === 'workout' && !workout ? 'week' : initial);
  const [format, setFormat] = useState<CardFormat>('story');
  const [current, setCurrent] = useState(readStyle);
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [seen] = useState(readSeen);
  const carousel = useRef<HTMLDivElement>(null);
  const statusTimer = useRef(0);
  const say = (msg: string) => { setStatus(msg); clearTimeout(statusTimer.current); if (msg) statusTimer.current = window.setTimeout(() => setStatus(''), 2600); };
  useEffect(() => () => clearTimeout(statusTimer.current), []);

  const data = useMemo(() => cardData({ sessions: s.sessions, custom: s.customExercises, unit: u, today: today.value, period, session: workout, seen }),
    [s.sessions, s.customExercises, u, today.value, period, workout, seen]);
  const theme = themeId.value;
  const svgs = useMemo(() => CARD_STYLES.map(st => cardSvg(data, st.id, format, paletteFor(THEMES[theme]), { photo, mark: markUrl })), [data, format, theme, photo]);
  const urls = useMemo(() => svgs.map(x => URL.createObjectURL(new Blob([x], { type: 'image/svg+xml' }))), [svgs]);
  useEffect(() => () => urls.forEach(x => URL.revokeObjectURL(x)), [urls]);

  // Keep the chosen card centred when the size changes, and on open.
  useEffect(() => {
    const el = carousel.current?.children[current] as HTMLElement | undefined;
    const c = carousel.current;
    if (el && c) c.scrollLeft = el.offsetLeft - (c.clientWidth - el.clientWidth) / 2;
  }, [format]);

  const onScroll = () => {
    const c = carousel.current;
    if (!c) return;
    const mid = c.scrollLeft + c.clientWidth / 2;
    let best = 0, dist = Infinity;
    [...c.children].forEach((el, i) => { const e = el as HTMLElement; const d = Math.abs(e.offsetLeft + e.clientWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
    if (best !== current) { setCurrent(best); writeStyle(best); }
  };
  const goTo = (i: number) => {
    const c = carousel.current, el = c?.children[i] as HTMLElement | undefined;
    if (c && el) c.scrollTo({ left: el.offsetLeft - (c.clientWidth - el.clientWidth) / 2, behavior: 'smooth' });
    setCurrent(i); writeStyle(i);
  };

  const togglePhoto = async () => {
    if (photo) { setPhoto(null); say('Photo removed'); return; }
    try {
      const p = await pickAndCompressPhoto({ maxDimension: 1920, targetChars: 3_000_000 });
      if (p) setPhoto(`data:${p.mediaType};base64,${p.data}`);
    } catch { say("Couldn't read that photo"); }
  };

  const style = CARD_STYLES[current] ?? CARD_STYLES[0]!;
  const empty = data.sessions === 0;
  const run = async (kind: 'save' | 'share') => {
    if (busy || empty) return;
    setBusy(true);
    try {
      const px = CARD_PX[format];
      const png = await svgToPng(svgs[current]!, px.w, px.h);
      const fileName = cardFileName({ period, style: style.id, format, to: data.to, now: new Date(), sessionId: period === 'workout' ? workout?.id : null });
      const r = kind === 'save' ? await saveImage(fileName, png) : await shareImage(fileName, png, `My M/ARC ${style.name.toLowerCase()}`);
      if (r.message) say(r.message);
      // The card on screen keeps its line; the next one opened picks another.
      if (r.outcome !== 'cancelled' && style.id === 'poster' && data.compare) markSeen(data.compare.id);
    } catch {
      say(kind === 'save' ? "Couldn't save the card" : "Couldn't share the card");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet title="Share" onClose={onClose} palace="share.sheet">
      <div class="share-sheet">
        <div class="share-chips" role="group" aria-label="Period">
          {SHARE_PERIODS.map(p => (
            <button type="button" key={p.id} class="chip chip-btn" aria-pressed={period === p.id} disabled={p.id === 'workout' && !workout} onClick={() => setPeriod(p.id)}>{p.label}</button>
          ))}
        </div>
        <div class={`share-carousel ${format}`} ref={carousel} onScroll={onScroll} aria-label="Card styles, swipe to change">
          {CARD_STYLES.map((st, i) => (
            <div key={st.id} class={`share-slide ${st.id === 'sticker' && !photo ? 'see-through' : ''}`} aria-current={i === current}>
              <img src={urls[i]} alt={`${st.name} card`} draggable={false} onClick={() => goTo(i)} />
            </div>
          ))}
        </div>
        <div class="share-style">{style.name}</div>
        <div class="share-dots" role="tablist" aria-label="Card style">
          {CARD_STYLES.map((st, i) => <button type="button" key={st.id} role="tab" aria-selected={i === current} aria-label={st.name} class={i === current ? 'on' : ''} onClick={() => goTo(i)} />)}
        </div>
        {empty && <p class="hint share-empty">Nothing logged in this period yet.</p>}
        <div class="share-opts">
          <span class="hint">{u === 'lb' ? 'Loads in lb' : 'Loads in kg'}</span>
          <div class="share-size" role="group" aria-label="Size">
            <button type="button" aria-pressed={format === 'story'} onClick={() => setFormat('story')}>9:16</button>
            <button type="button" aria-pressed={format === 'square'} onClick={() => setFormat('square')}>1:1</button>
          </div>
        </div>
        <div class="share-actions">
          <button type="button" class="btn" onClick={() => void togglePhoto()}>{photo ? <IconX size={18} /> : <IconCamera size={18} />}{photo ? 'Remove' : 'Photo'}</button>
          <button type="button" class="btn" disabled={busy || empty} onClick={() => void run('save')}><IconDownload size={18} />Save</button>
          <button type="button" class="btn btn-primary" disabled={busy || empty} onClick={() => void run('share')}><IconShare size={18} />Share</button>
          <div class="share-status" role="status" aria-live="polite">{status}</div>
        </div>
      </div>
    </Sheet>
  );
}

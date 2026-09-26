import { useEffect, useId, useRef, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import { IconX } from './icons';
import { markClosing, openSheetCount, registerSheet, sheetStack, unregisterSheet } from './sheetStack';
import { durFor, EASE, reduced } from './motion';
import { approxIn, enteredLoad, setLoadIn } from '@/core/units';
import { parseLoad } from '@/core/parse';
import type { LoadUnit } from '@/core/models';
import { haptic } from '@/native/haptics';
import { HOLD_CONFIRM_MS } from '@/ui/gesture';

type Div = JSX.HTMLAttributes<HTMLDivElement>;

export function Card({ children, class: cls = '', className = '', ...rest }: { children?: ComponentChildren } & Div) {
  return <div class={`card ${cls} ${className}`} {...rest}>{children}</div>;
}

export function Button({ children, variant = 'default', size, block, class: cls = '', ...rest }: {
  children?: ComponentChildren; variant?: 'default' | 'primary' | 'solid' | 'quiet' | 'danger'; size?: 'sm'; block?: boolean;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" class={`btn ${variant !== 'default' ? `btn-${variant}` : ''} ${size ? `btn-${size}` : ''} ${block ? 'btn-block' : ''} ${cls}`} {...rest}>{children}</button>;
}

export function Chip({ children, tone, pressed, onClick, class: cls = '' }: { children?: ComponentChildren; tone?: 'accent' | 'positive' | 'warning' | 'negative' | 'info'; pressed?: boolean; onClick?: () => void; class?: string }) {
  const classes = `chip ${tone ? `chip-${tone}` : ''} ${onClick ? 'chip-btn' : ''} ${cls}`;
  return onClick
    ? <button type="button" class={classes} aria-pressed={pressed} onClick={onClick}>{children}</button>
    : <span class={classes}>{children}</span>;
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return <div class="seg" role="tablist">{options.map(o => <button type="button" role="tab" key={o.value} aria-selected={o.value === value} aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>)}</div>;
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return <button type="button" role="switch" aria-checked={checked} aria-disabled={disabled} disabled={disabled} aria-label={label} class="toggle" onClick={() => { void haptic.toggle(!checked); onChange(!checked); }} />;
}

export function Stat({ value, label, tone }: { value: ComponentChildren; label: string; tone?: 'positive' | 'warning' | 'negative' }) {
  return <div class="stat"><b class={`num ${tone ? `${tone}-text` : ''}`}>{value}</b><span>{label}</span></div>;
}

export function Row({ children, trailing, onClick, class: cls = '', palace }: { children?: ComponentChildren; trailing?: ComponentChildren; onClick?: () => void; class?: string; palace?: string }) {
  // UI-30: a pressable row works from the keyboard too.
  const onKeyDown = onClick ? (e: KeyboardEvent) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); onClick(); } } : undefined;
  return <div class={`list-row ${onClick ? 'pressable' : ''} ${cls}`} data-palace={palace} onClick={onClick} onKeyDown={onKeyDown} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}><div class="grow">{children}</div>{trailing}</div>;
}

/** How many Sheets are open, so floating things (the Escobar dock) can hide under them. Derived from the sheet stack. */
export const openSheets = openSheetCount;

export function Sheet({ title, onClose, children, palace }: { title: string; onClose: () => void; children?: ComponentChildren; palace?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const close = useRef(onClose);
  close.current = onClose;
  const closingRef = useRef(false);
  const requestCloseRef = useRef<() => void>(() => close.current());
  // I6: a sheet opened while another is already open dims nothing further (its own backdrop is
  // transparent) — the bottom sheet keeps the one real scrim. Decided once, before this sheet
  // registers itself, from whatever is already on the stack.
  const [nested] = useState(() => sheetStack.value.length > 0);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // QA5-1: a child that already asks for focus (e.g. a form's first field) wins over the
    // panel's own autofocus, which exists only so a sheet with no such child still gets focus.
    const panel = d.querySelector<HTMLElement>('.sheet-panel');
    if (panel?.querySelector('[autofocus]')) panel.removeAttribute('autofocus');
    if (!d.open) d.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closingRef.current = false;
    // I6: the panel slides down and the scrim fades before the sheet actually unmounts — every
    // close path (X, backdrop, Back, onCancel) routes through this instead of calling onClose
    // straight away. A second call while already closing is a no-op (one exit, ever).
    requestCloseRef.current = () => {
      if (closingRef.current) return;
      closingRef.current = true;
      d.classList.add('closing');
      markClosing(id);
      const p = d.querySelector<HTMLElement>('.sheet-panel');
      if (!p || !p.animate) { close.current(); return; }
      const r = reduced();
      const anim = p.animate(
        [{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${r ? 0 : p.offsetHeight}px)`, opacity: r ? 0 : 1 }],
        { duration: durFor('sheetExit'), easing: EASE.exit, fill: 'forwards' },
      );
      anim.finished.then(() => close.current()).catch(() => close.current());
    };
    // R5.3: Back (Android or browser) closes the top sheet through its own exit animation.
    registerSheet(id, () => close.current(), () => requestCloseRef.current());
    return () => { unregisterSheet(id); document.body.style.overflow = prev; if (d.open) d.close(); };
  }, []);
  const requestClose = () => requestCloseRef.current();
  return (
    <dialog ref={ref} class={`sheet ${nested ? 'nested' : ''}`} aria-labelledby={id} onCancel={e => { e.preventDefault(); requestClose(); }} onClick={e => { if (e.target === e.currentTarget) requestClose(); }}>
      <div class="sheet-panel" data-palace={palace} tabIndex={-1} autofocus onScroll={e => { e.currentTarget.querySelector('.sheet-top')?.classList.toggle('scrolled', e.currentTarget.scrollTop > 0); }}>
        <div class="sheet-top">
          <div class="sheet-grab" />
          <div class="sheet-head"><h2 id={id}>{title}</h2><button type="button" class="btn btn-quiet btn-icon" aria-label="Close" onClick={requestClose}><IconX /></button></div>
        </div>
        {children}
      </div>
    </dialog>
  );
}

export function Toast({ message, action, onAction, onDismiss }: { message: string; action?: string; onAction?: () => void; onDismiss: () => void }) {
  // The parent passes a new onDismiss each render; keep it in a ref so the timer is not reset (UI-28).
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => { const t = setTimeout(() => dismiss.current(), action ? 5000 : 3000); return () => clearTimeout(t); }, [message, action]);
  return <div class="toast" role="status"><span>{message}</span>{action && <button type="button" onClick={() => { onAction?.(); onDismiss(); }}>{action}</button>}</div>;
}

/**
 * A number typed as text and committed on blur or Enter (UI-22): half-typed values ("19" on the
 * way to "1990") are never saved. Out-of-range input reverts to the saved value.
 */
export function CommitNumber({ value, min, max, integer, onCommit, ...rest }: { value: number | undefined; min: number; max: number; integer?: boolean; onCommit: (v: number | undefined) => void } & Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value' | 'min' | 'max'>) {
  const shown = value != null ? String(value) : '';
  const [text, setText] = useState(shown);
  const focused = useRef(false);
  if (!focused.current && text !== shown) setText(shown);
  const commit = () => {
    focused.current = false;
    const t = text.trim().replace(',', '.');
    if (!t) { if (value != null) onCommit(undefined); return; }
    const v = Number(t);
    if (!Number.isFinite(v) || v < min || v > max || (integer && !Number.isInteger(v))) { void haptic.reject(); setText(shown); return; }
    if (v !== value) onCommit(v);
  };
  return <input {...rest} type="text" inputMode={integer ? 'numeric' : 'decimal'} value={text} onFocus={() => { focused.current = true; }} onInput={e => setText((e.target as HTMLInputElement).value)} onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />;
}

/**
 * F10: a destructive action that fills in as you hold it, instead of a grey system confirm() —
 * so it's undoable-by-intent (you can let go before it fires) rather than a modal to dismiss.
 * Twin for TalkBack/keyboard-without-hold: a tap arms "Tap again to confirm" for 3s, a second
 * tap within that window confirms. No app-state imports beyond haptics — this also backs the
 * error boundary, which must render after a crash regardless of app state.
 */
export function HoldButton({ label, onConfirm, ms = HOLD_CONFIRM_MS, size, class: cls = '' }: {
  label: string; onConfirm: () => void; ms?: number; size?: 'sm'; class?: string;
}) {
  const [holding, setHolding] = useState(false);
  const [armed, setArmed] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdCompleted = useRef(false);
  const armedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (holdTimer.current) clearTimeout(holdTimer.current); if (armedTimer.current) clearTimeout(armedTimer.current); }, []);

  const startHold = () => {
    if (holdTimer.current) return;
    holdCompleted.current = false;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      holdCompleted.current = true;
      setHolding(false);
      try { void haptic.confirm(); } catch { /* haptics unavailable */ }
      onConfirm();
    }, ms);
  };
  const cancelHold = () => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    setHolding(false);
  };
  /** A tap too short to complete the hold: TalkBack's synthesized click (detail 0), or a real
   * keyboard tap of Enter/Space (keydown's preventDefault below stops the browser's own click for
   * those, so this is the only path for them) — arms "Tap again to confirm" for 3s; a second tap
   * within that window confirms. */
  const armTap = () => {
    if (armedTimer.current) { clearTimeout(armedTimer.current); armedTimer.current = null; }
    if (armed) {
      setArmed(false);
      try { void haptic.confirm(); } catch { /* haptics unavailable */ }
      onConfirm();
    } else {
      setArmed(true);
      armedTimer.current = setTimeout(() => setArmed(false), 3000);
    }
  };

  return (
    <button
      type="button"
      class={`btn btn-danger hold ${holding ? 'holding' : ''} ${size ? `btn-${size}` : ''} ${cls}`}
      style={{ '--hold-ms': `${ms}ms` }}
      aria-label={armed ? 'Tap again to confirm' : `${label}, press and hold`}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onKeyDown={e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); } }}
      onKeyUp={e => {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        // A full hold already confirmed via the timer; nothing else to do on release.
        if (holdCompleted.current) { holdCompleted.current = false; return; }
        cancelHold();
        armTap();
      }}
      onClick={e => {
        // A synthesized activation (TalkBack) carries no pointer, so detail is 0. A real keyboard
        // tap is handled by onKeyUp instead (preventDefault in onKeyDown stops its own click).
        if (e.detail !== 0) return;
        armTap();
      }}
    >{armed ? 'Tap again to confirm' : label}</button>
  );
}

export function Empty({ icon, title, children, action }: { icon?: ComponentChildren; title: string; children?: ComponentChildren; action?: ComponentChildren }) {
  return <div class="empty">{icon}<h3>{title}</h3>{children && <p class="small">{children}</p>}{action}</div>;
}

export function Section({ title, aside, children, palace }: { title: string; aside?: ComponentChildren; children?: ComponentChildren; palace?: string }) {
  return <section class="section" data-palace={palace}><div class="section-title"><h2>{title}</h2>{aside}</div>{children}</section>;
}

export function Field({ label, children, hint }: { label: string; children?: ComponentChildren; hint?: string }) {
  return <label class="stack-sm"><span class="small muted">{label}</span>{children}{hint && <span class="hint">{hint}</span>}</label>;
}

/**
 * A weight input that keeps decimals while typing. A plain controlled `<input value={kgToDisplay(kg)}>`
 * reformats on every keystroke, so "23." collapses back to "23" before a "5" can follow it — the
 * displayed text only re-syncs from the committed kg while the field is not focused.
 */
export interface WeightChange { kg: number; entered: { value: number; unit: LoadUnit } }

/**
 * Plate Sense (§25.5): the entry unit is per exercise and gym, flipped with the pill at the
 * input's right edge (long-press for the whole equipment group). What was typed is kept
 * verbatim in `entered`, so 35 lb stays 35 lb. When the entry unit differs from the display
 * unit, a second reading sits under the input.
 */
export function WeightInput({ kg, entered, entryUnit, displayUnit, placeholder, ariaLabel, onChange, onUnitFlip, onUnitLongPress, setField, onFieldKeyDown }: {
  kg: number | undefined;
  entered?: { value: number; unit: LoadUnit };
  entryUnit: LoadUnit;
  displayUnit?: LoadUnit;
  placeholder?: string;
  ariaLabel?: string;
  onChange: (v: WeightChange | undefined) => void;
  onUnitFlip?: () => void;
  onUnitLongPress?: () => void;
  /** A8: this is a live set's kg field — tags it for the Enter/Next keyboard flow and selects its
   * text on focus, so tapping a filled field lets typing replace it instead of appending. */
  setField?: boolean;
  onFieldKeyDown?: (e: KeyboardEvent) => void;
}) {
  const shown = kg != null ? setLoadIn({ kg, entered }, entryUnit) : undefined;
  const display = shown != null ? String(shown) : '';
  const [text, setText] = useState(display);
  const focused = useRef(false);
  const press = useRef<ReturnType<typeof setTimeout> | null>(null);
  const long = useRef(false);
  if (!focused.current && text !== display) setText(display);
  const other = displayUnit && displayUnit !== entryUnit && kg != null && kg > 0 ? approxIn(kg, displayUnit) : null;
  const startPress = () => { long.current = false; if (onUnitLongPress) press.current = setTimeout(() => { long.current = true; onUnitLongPress(); }, 550); };
  const endPress = () => { if (press.current) { clearTimeout(press.current); press.current = null; } };
  return (
    <span class="weight-input">
      <input
        type="text" inputMode="decimal" autoComplete="off" placeholder={placeholder} value={text} aria-label={ariaLabel ?? `Load in ${entryUnit}`}
        {...(setField ? { 'data-set-field': 'kg', enterKeyHint: 'next' as const, onKeyDown: onFieldKeyDown } : {})}
        onFocus={e => { focused.current = true; if (setField) (e.target as HTMLInputElement).select(); }}
        onBlur={() => { focused.current = false; setText(display); }}
        onInput={e => {
          const raw = (e.target as HTMLInputElement).value;
          setText(raw);
          const v = parseLoad(raw, entryUnit);
          onChange(v != null ? enteredLoad(v, entryUnit) : undefined);
        }}
      />
      {onUnitFlip ? (
        <button
          type="button" class="unit-pill" aria-label={`Entry unit ${entryUnit}. Tap to switch to ${entryUnit === 'kg' ? 'lb' : 'kg'}`}
          onPointerDown={startPress} onPointerUp={endPress} onPointerLeave={endPress} onPointerCancel={endPress}
          onContextMenu={e => e.preventDefault()}
          onClick={() => { if (long.current) { long.current = false; return; } onUnitFlip(); }}
        >{entryUnit}</button>
      ) : null}
      {displayUnit && displayUnit !== entryUnit && <span class="weight-approx">{other ?? ' '}</span>}
    </span>
  );
}

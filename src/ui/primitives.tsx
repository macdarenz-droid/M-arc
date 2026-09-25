import { useEffect, useId, useRef, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import { IconX } from './icons';
import { openSheetCount, registerSheet, unregisterSheet } from './sheetStack';
import { approxIn, enteredLoad, setLoadIn } from '@/core/units';
import { parseLoad } from '@/core/parse';
import type { LoadUnit } from '@/core/models';
import { haptic } from '@/native/haptics';

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
    // R5.3: Back (Android or browser) closes the top sheet through its own onClose.
    registerSheet(id, () => close.current());
    return () => { unregisterSheet(id); document.body.style.overflow = prev; if (d.open) d.close(); };
  }, []);
  return (
    <dialog ref={ref} class="sheet" aria-labelledby={id} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div class="sheet-panel" data-palace={palace} tabIndex={-1} autofocus>
        <div class="sheet-grab" />
        <div class="sheet-head"><h2 id={id}>{title}</h2><button type="button" class="btn btn-quiet btn-icon" aria-label="Close" onClick={onClose}><IconX /></button></div>
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
export function WeightInput({ kg, entered, entryUnit, displayUnit, placeholder, onChange, onUnitFlip, onUnitLongPress }: {
  kg: number | undefined;
  entered?: { value: number; unit: LoadUnit };
  entryUnit: LoadUnit;
  displayUnit?: LoadUnit;
  placeholder?: string;
  onChange: (v: WeightChange | undefined) => void;
  onUnitFlip?: () => void;
  onUnitLongPress?: () => void;
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
        type="text" inputMode="decimal" autoComplete="off" placeholder={placeholder} value={text} aria-label={`Load in ${entryUnit}`}
        onFocus={() => { focused.current = true; }}
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
      {other && <span class="weight-approx">{other}</span>}
    </span>
  );
}

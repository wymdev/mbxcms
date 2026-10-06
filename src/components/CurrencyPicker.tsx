import { type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { CurrencyBadge } from './ui';

export interface CurrencyOption {
  code: string;
  name: string;
  /** Short rate hint shown on the right, e.g. "4,310 Ks". */
  hint?: string;
}

/**
 * Searchable currency dropdown. Opens as a popover on larger screens and as a bottom sheet on phones.
 * Keyboard: ↓/↑ to move, Enter to choose, Esc to close.
 */
export function CurrencyPicker({ value, onChange, label, options }: {
  value: string; onChange: (code: string) => void; label: string; options: CurrencyOption[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  // phones get a bottom sheet rendered on <body>, so it sits above the tab bar and page layers
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const on = () => setPhone(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => `${o.code} ${o.name}`.toLowerCase().includes(q)) : options;
  }, [options, query]);
  const current = options.find((o) => o.code === value);

  const close = (refocus = true) => { setOpen(false); setQuery(''); if (refocus) button.current?.focus(); };
  const choose = (code: string) => { onChange(code); close(); };

  // open: start on the selected item, focus search on pointer devices (avoids popping the phone keyboard)
  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.code === value)));
    if (window.matchMedia('(pointer: fine)').matches) search.current?.focus();
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!root.current?.contains(t) && !panel.current?.contains(t)) close(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(shown.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter' && shown[active]) { e.preventDefault(); choose(shown[active].code); }
  };

  return (
    <div ref={root} className="relative" onKeyDown={onKey}>
      <button
        ref={button} type="button" onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-label={`${label}: ${current?.name ?? value}`}
        className={`group flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-ink shadow-sm ring-1 transition hover:ring-forest-600 ${open ? 'ring-2 ring-gold' : 'ring-ink/10'}`}
      >
        <CurrencyBadge code={value} size="sm" />
        <span className="text-sm font-extrabold">{value}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="grid size-5 place-items-center rounded-full bg-mist text-slate group-hover:bg-forest-600 group-hover:text-white">
          <ChevronDown className="size-3.5" strokeWidth={3} />
        </motion.span>
      </button>

      <Layer portal={phone}>
      <AnimatePresence>
        {open && (
          <div>
            {/* dimmed backdrop behind the bottom sheet on phones */}
            <motion.div key="backdrop" className="fixed inset-0 z-[95] bg-forest-950/50 backdrop-blur-[2px] sm:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => close()} />
            <motion.div
              key="panel" ref={panel}
              initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-3 bottom-3 z-[100] origin-bottom overflow-hidden rounded-[1.75rem] bg-white text-ink shadow-[0_30px_80px_-20px_rgba(6,32,26,0.55)] ring-1 ring-ink/10
                         sm:absolute sm:inset-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[21rem] sm:origin-top-right"
            >
              <div className="flex items-center justify-between px-5 pb-2 pt-4">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate">{label}</span>
                <button type="button" onClick={() => close()} aria-label="Close" className="grid size-8 place-items-center rounded-full bg-mist text-slate hover:bg-ink hover:text-white">
                  <X className="size-4" />
                </button>
              </div>
              <label className="relative mx-4 mb-2 block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate" />
                <input
                  ref={search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search currency"
                  aria-label="Search currency" aria-activedescendant={shown[active] ? `${id}-${shown[active].code}` : undefined} aria-controls={`${id}-list`}
                  className="w-full rounded-2xl bg-mist py-2.5 pl-10 pr-3 text-sm font-semibold placeholder:text-slate/70 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </label>

              <ul ref={list} id={`${id}-list`} role="listbox" aria-label={label}
                className="max-h-[min(55vh,20rem)] overflow-y-auto overscroll-contain px-2 pb-3 [scrollbar-width:thin]">
                {shown.map((o, i) => {
                  const selected = o.code === value, hot = i === active;
                  return (
                    <li key={o.code} id={`${id}-${o.code}`} role="option" aria-selected={selected} data-i={i}>
                      <button type="button" tabIndex={-1} onClick={() => choose(o.code)} onMouseEnter={() => setActive(i)}
                        className={`relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${hot ? 'bg-mist' : ''}`}>
                        {hot && <motion.span layoutId={`${id}-hot`} className="absolute inset-y-1 left-0 w-1 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                        <CurrencyBadge code={o.code} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-extrabold">{o.code}</span>
                          <span className="block truncate text-xs font-semibold text-slate">{o.name}</span>
                        </span>
                        {o.hint && <span className="num text-xs font-bold text-slate">{o.hint}</span>}
                        <span className={`grid size-6 shrink-0 place-items-center rounded-full ${selected ? 'bg-forest-600 text-white' : 'text-transparent'}`}>
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                      </button>
                    </li>
                  );
                })}
                {shown.length === 0 && <li className="px-4 py-6 text-center text-sm font-semibold text-slate">No currency matches “{query}”.</li>}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </Layer>
    </div>
  );
}

function Layer({ portal, children }: { portal: boolean; children: ReactNode }) {
  return portal ? createPortal(children, document.body) : <>{children}</>;
}

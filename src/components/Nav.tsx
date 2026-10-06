import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeftRight, Calculator, Download, LayoutGrid, Menu, MessageCircle, X } from 'lucide-react';
import { useActiveSection } from '../hooks/useActiveSection';
import { site } from '../config/site';

export const NAV = [
  { id: 'rates', label: 'Rates' },
  { id: 'convert', label: 'Calculator' },
  { id: 'services', label: 'Services' },
  { id: 'how', label: 'How it works' },
  { id: 'membership', label: 'Membership' },
  { id: 'contact', label: 'Contact' },
];
const IDS = ['top', ...NAV.map((n) => n.id)];

export function Nav({ onInstall, canInstall }: { onInstall: () => void; canInstall: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${scrolled ? 'bg-forest-950/80 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl' : 'bg-transparent'}`}>
        <motion.div className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold" style={{ scaleX: progress }} aria-hidden />
        <nav className="shell flex h-16 items-center gap-6 lg:h-20" aria-label="Main">
          <a href="#top" className="shrink-0" aria-label={`${site.name} home`}>
            <img src="/logo.png" alt={site.legalName} className="h-9 w-auto lg:h-11" width={640} height={183} />
          </a>
          <ul className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === n.id ? 'text-forest-900' : 'text-white/75 hover:text-white'}`}>
                  {active === n.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="relative">{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            {canInstall && (
              <button onClick={onInstall} className="btn-ghost hidden sm:inline-flex">
                <Download className="size-4" /> Install app
              </button>
            )}
            <a href="#convert" className="btn-gold hidden sm:inline-flex">Get a quote</a>
            <button onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] bg-forest-950/95 backdrop-blur-xl lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="shell flex h-16 items-center justify-between">
              <img src="/logo.png" alt="" className="h-9 w-auto" />
              <button onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full bg-white/10 text-white" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <motion.ul className="shell mt-6 space-y-1" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.05 } } }}>
              {NAV.map((n, i) => (
                <motion.li key={n.id} variants={{ h: { opacity: 0, x: -24 }, s: { opacity: 1, x: 0 } }}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-white/10 py-4 text-white">
                    <span className="num text-sm font-bold text-gold">0{i + 1}</span>
                    <span className="display text-3xl">{n.label}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="shell mt-8 flex flex-wrap gap-3">
              <a href="#convert" onClick={() => setOpen(false)} className="btn-gold">Get a quote</a>
              {canInstall && <button onClick={onInstall} className="btn-ghost"><Download className="size-4" /> Install app</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const TABS = [
  { id: 'rates', label: 'Rates', icon: LayoutGrid },
  { id: 'convert', label: 'Convert', icon: Calculator },
  { id: 'services', label: 'Services', icon: ArrowLeftRight },
  { id: 'contact', label: 'Contact', icon: MessageCircle },
];

/** App-style bottom bar on phones. */
export function TabBar() {
  const active = useActiveSection(['top', ...TABS.map((t) => t.id)]);
  return (
    <nav className="pb-safe fixed inset-x-3 bottom-3 z-40 rounded-3xl bg-forest-950/90 px-2 pt-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl md:hidden" aria-label="Quick">
      <ul className="grid grid-cols-4">
        {TABS.map(({ id, label, icon: Icon }) => {
          const on = active === id;
          return (
            <li key={id}>
              <a href={`#${id}`} className="relative flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold">
                {on && <motion.span layoutId="tab-pill" className="absolute inset-x-2 inset-y-0 rounded-2xl bg-gold" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <Icon className={`relative size-5 ${on ? 'text-forest-900' : 'text-white/70'}`} />
                <span className={`relative ${on ? 'text-forest-900' : 'text-white/70'}`}>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

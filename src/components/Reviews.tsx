import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Expand, X } from 'lucide-react';
import { SectionHead } from './ui';

/** Real Facebook recommendations, kept as screenshots from the previous site (public/images/reviews). */
const REVIEWS = Array.from({ length: 10 }, (_, i) => `/images/reviews/fb${i + 1}.webp`);
const rowA = REVIEWS.slice(0, 5), rowB = REVIEWS.slice(5);

function Card({ src, onOpen, wide = false }: { src: string; onOpen: (s: string) => void; wide?: boolean }) {
  return (
    <button onClick={() => onOpen(src)} aria-label="Enlarge customer recommendation"
      className={`group relative shrink-0 overflow-hidden rounded-2xl bg-white p-3 text-left shadow-[0_20px_40px_-25px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-1 ${wide ? 'w-[min(88vw,36rem)]' : 'w-[36rem]'}`}>
      <img src={src} alt="Customer recommendation for Mergui Boss on Facebook" loading="lazy" className="w-full" />
      <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-forest-900/80 text-white opacity-0 transition group-hover:opacity-100">
        <Expand className="size-4" />
      </span>
    </button>
  );
}

export function Reviews() {
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <section id="reviews" className="sheet z-[52] overflow-hidden bg-forest-900 text-white">
      <div className="shell">
        <SectionHead dark eyebrow="Customer reviews" title={<>Real words from <span className="text-gold">real customers</span>.</>}
          lead="Recommendations our customers left on the Mergui Boss Facebook page. Tap any review to read it in full." />
      </div>

      {/* Desktop: two rows drifting in opposite directions, pause on hover */}
      <div className="hidden space-y-5 md:block">
        {[rowA, rowB].map((row, r) => (
          <div key={r} className="relative">
            <div className={`marquee flex w-max gap-5 pr-5 ${r ? 'marquee-reverse' : ''}`}>
              {[...row, ...row].map((src, i) => <Card key={i} src={src} onOpen={setOpen} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Phones: swipe through */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:hidden [scrollbar-width:none]">
        {REVIEWS.map((src) => <div key={src} className="snap-center"><Card src={src} onOpen={setOpen} wide /></div>)}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-forest-950/90 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label="Customer recommendation">
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
              <img src={open} alt="Customer recommendation for Mergui Boss on Facebook" className="w-full min-w-[40rem] md:min-w-0" />
            </motion.div>
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white">
              <X className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

import { type ReactNode, type PointerEvent, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion, type Variants } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import type { Trend } from '../data/rates';

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Children fade and rise in once as the block scrolls into view. */
export function Reveal({ children, className, gap = 0.08, delay = 0, as = 'div' }: {
  children: ReactNode; className?: string; gap?: number; delay?: number; as?: 'div' | 'ul' | 'ol';
}) {
  const M = as === 'ul' ? motion.ul : as === 'ol' ? motion.ol : motion.div;
  return (
    <M className={className} variants={stagger(gap, delay)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {children}
    </M>
  );
}

export function Item({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const M = as === 'li' ? motion.li : motion.div;
  return <M className={className} variants={fadeUp}>{children}</M>;
}

/** Left-aligned section heading: eyebrow, title, optional lead on the right on wide screens. */
export function SectionHead({ eyebrow, title, lead, dark = false, stack = false, children }: {
  eyebrow: string; title: ReactNode; lead?: ReactNode; dark?: boolean; children?: ReactNode;
  /** Single column, for headings placed inside a narrower column. */
  stack?: boolean;
}) {
  const split = !stack && (lead || children);
  return (
    <Reveal className={`mb-12 grid gap-6 lg:mb-16 ${split ? 'lg:grid-cols-12 lg:items-end' : ''}`}>
      <div className={split ? 'lg:col-span-7' : ''}>
        <Item>
          <span className={`eyebrow ${dark ? 'text-gold' : 'text-forest-600'}`}>
            <span className={`h-px w-8 ${dark ? 'bg-gold' : 'bg-forest-600'}`} />
            {eyebrow}
          </span>
        </Item>
        <Item>
          <h2 className={`display mt-4 text-[clamp(2rem,4.6vw,3.75rem)] ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
        </Item>
      </div>
      {(lead || children) && (
        <Item className={split ? 'lg:col-span-5 lg:pb-2' : ''}>
          {lead && <p className={`max-w-xl text-base sm:text-lg ${dark ? 'text-white/70' : 'text-slate'}`}>{lead}</p>}
          {children}
        </Item>
      )}
    </Reveal>
  );
}

/** Card that tilts toward the pointer with a soft spotlight; flat on touch and reduced motion. */
export function TiltCard({ children, className = '', glow = 'rgba(253,182,0,0.18)', max = 7 }: {
  children: ReactNode; className?: string; glow?: string; max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const spot = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, ${glow}, transparent 70%)`;

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    mx.set(e.clientX - r.left); my.set(e.clientY - r.top);
  };
  const leave = () => { rx.set(0); ry.set(0); mx.set(-200); my.set(-200); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileTap={{ scale: 0.985 }}
      className={`group relative isolate overflow-hidden ${className}`}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spot }} />
      {children}
    </motion.div>
  );
}

export function TrendMark({ t, className = 'size-4' }: { t: Trend; className?: string }) {
  if (t === 'up') return <ArrowUpRight aria-label="up" className={`${className} text-up`} />;
  if (t === 'down') return <ArrowDownRight aria-label="down" className={`${className} text-down`} />;
  return <Minus aria-label="unchanged" className={`${className} text-slate/60`} />;
}

const BADGE: Record<string, string> = {
  THB: 'bg-[#1b3a8a] text-white', USD: 'bg-[#2f6fb0] text-white', SGD: 'bg-[#c2412d] text-white', CNY: 'bg-[#b8231b] text-gold',
  MYR: 'bg-[#0b2a6b] text-gold', EUR: 'bg-[#123b9c] text-gold', MMK: 'bg-gold text-forest-900',
};
export function CurrencyBadge({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'lg' ? 'size-12 text-sm' : size === 'sm' ? 'size-8 text-[10px]' : 'size-10 text-xs';
  return <span className={`grid shrink-0 place-items-center rounded-full font-extrabold ${s} ${BADGE[code] ?? 'bg-forest-700 text-white'}`}>{code}</span>;
}

/** Tiny line chart of recent rates. */
export function Sparkline({ data, className = '', stroke = 'currentColor' }: { data: number[]; className?: string; stroke?: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / span) * 24}`).join(' ');
  return (
    <motion.svg viewBox="0 0 100 30" preserveAspectRatio="none" className={className} aria-hidden
      initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true }}
      transition={{ duration: 1.2, ease: EASE }}>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </motion.svg>
  );
}

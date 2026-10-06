import { type PointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform,
  type MotionValue, type PanInfo,
} from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { banners, type Banner } from '../config/banners';

const SLIDE_MS = 6000;
const GAP = 16;

const src = (b: Banner, w: 1000 | 2000) => `/images/banners/${b.name}-${w}.webp`;
/** Wrap any slot number onto a banner index (works for negatives). */
const wrap = (k: number, n: number) => ((k % n) + n) % n;

/**
 * One slide at slot `k` of an endless track. Slots are unbounded integers; the banner shown is
 * banners[k mod n], so the first banner always follows the last one.
 */
function Slide({ b, k, num, x, step, width, active, onPick, dragging }: {
  b: Banner; k: number; num: number; x: MotionValue<number>; step: number; width: number; active: boolean;
  onPick: (k: number) => void; dragging: React.RefObject<boolean>;
}) {
  const reduce = useReducedMotion();
  // 0 when this slot is in the active spot, ±1 one slot away
  const dist = useTransform(x, (v) => (v + k * step) / step);
  const scale = useTransform(dist, (d) => 1 - Math.min(Math.abs(d), 1) * 0.08);
  const shade = useTransform(dist, (d) => Math.min(Math.abs(d), 1) * 0.55);

  // gentle tilt toward the pointer on the active slide
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (!active || reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      style={{ width, left: k * step, scale, rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onPointerMove={tilt} onPointerLeave={reset}
      onClick={() => { if (!dragging.current && !active) onPick(k); }}
      className={`absolute top-0 aspect-[20/11] overflow-hidden rounded-2xl bg-forest-950 sm:rounded-[2rem] ${active ? 'shadow-[0_40px_80px_-40px_rgba(0,0,0,0.85)]' : 'cursor-pointer'}`}
      aria-roledescription="slide" aria-label={`${num + 1} of ${banners.length}`} aria-hidden={!active}
    >
      <img
        src={src(b, 2000)} srcSet={`${src(b, 1000)} 1000w, ${src(b, 2000)} 2000w`} sizes="(min-width: 1408px) 1200px, 90vw"
        alt={b.alt} draggable={false} width={2000} height={1100} fetchPriority={k === 0 ? 'high' : 'auto'}
        className="pointer-events-none size-full select-none object-cover"
      />
      <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-forest-950" />
      {active && b.cta && (
        <motion.a href={b.cta.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="btn-gold absolute bottom-4 left-4 hidden px-5 py-2.5 shadow-xl sm:inline-flex lg:bottom-6 lg:left-6">
          {b.cta.label} <ArrowRight className="size-4" />
        </motion.a>
      )}
    </motion.div>
  );
}

/** Endless banner track: next banner always peeks in, autoplay with progress thumbnails, swipe, arrows, keys. */
export function BannerSlider() {
  const reduce = useReducedMotion();
  const count = banners.length;
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(0);
  const [vh, setVh] = useState(() => (typeof window === 'undefined' ? 900 : window.innerHeight));
  /** Unbounded slot of the active slide; the banner shown is pos mod count. */
  const [pos, setPos] = useState(0);
  const [hover, setHover] = useState(false);
  const [held, setHeld] = useState(false);
  const dragging = useRef(false);
  const x = useMotionValue(0);
  const progress = useMotionValue(0);
  const index = wrap(pos, count);

  useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el); setW(el.clientWidth);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => { ro.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  // size slides by width AND height so banner + thumbnails always fit the screen
  const reserve = W >= 640 ? 210 : 190;
  const byHeight = Math.max(260, (vh - reserve) * (20 / 11));
  const slideW = W ? Math.min(W * (W >= 1024 ? 0.86 : 0.9), byHeight) : 0;
  const step = slideW + GAP;

  const next = useCallback(() => setPos((p) => p + 1), []);
  const prev = useCallback(() => setPos((p) => p - 1), []);
  /** Jump to banner i the short way round. */
  const show = (i: number) => setPos((p) => {
    let d = wrap(i - wrap(p, count), count);
    if (d > count / 2) d -= count;
    return p + d;
  });

  // glide the track to the active slot
  useEffect(() => {
    if (!step) return;
    const c = animate(x, -pos * step, reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 });
    return () => c.stop();
  }, [pos, step, x, reduce]);

  // autoplay driven by the progress bar; holds while hovered or dragged
  const autoplay = !reduce && !hover && !held && count > 1;
  useEffect(() => { progress.set(0); }, [pos, progress]);
  useEffect(() => {
    if (!autoplay) return;
    const c = animate(progress, 1, { duration: (SLIDE_MS / 1000) * (1 - progress.get()), ease: 'linear', onComplete: next });
    return () => c.stop();
  }, [autoplay, pos, next, progress]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setHeld(false);
    const projected = x.get() + info.velocity.x * 0.18;
    // never skip more than one slide per flick
    setPos((p) => Math.max(p - 1, Math.min(p + 1, Math.round(-projected / step))));
    window.setTimeout(() => { dragging.current = false; }, 0);
  };

  // render the active slot plus neighbours on both sides
  const slots = [pos - 1, pos, pos + 1, pos + 2];

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label="Mergui Boss banners" tabIndex={0}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); }}
      className="focus-visible:outline-none"
    >
      <div ref={box} className="overflow-hidden px-4 sm:px-0">
        <motion.div
          className="relative cursor-grab touch-pan-y active:cursor-grabbing"
          style={{ x, height: slideW ? (slideW * 11) / 20 : undefined }}
          drag={count > 1 ? 'x' : false}
          dragMomentum={false}
          onDragStart={() => { dragging.current = true; setHeld(true); }}
          onDragEnd={onDragEnd}
        >
          {slideW > 0 && count > 0 && slots.map((k) => (
            <Slide key={k} k={k} num={wrap(k, count)} b={banners[wrap(k, count)]} x={x} step={step} width={slideW}
              active={k === pos} onPick={setPos} dragging={dragging} />
          ))}
          {!slideW && <div className="aspect-[20/11] w-[90%] rounded-[2rem] bg-forest-950" />}
        </motion.div>
      </div>

      {/* thumbnails with progress and arrows */}
      <div className="mt-4 flex items-center gap-3 px-4 sm:mt-5 sm:px-0">
        <div className="flex gap-2 sm:gap-3">
          {banners.map((b, i) => (
            <button key={b.name} onClick={() => show(i)} aria-label={`Show banner ${i + 1}`} aria-current={i === index}
              className={`group relative overflow-hidden rounded-xl ring-2 transition-all duration-300 ${i === index ? 'ring-gold' : 'ring-transparent opacity-60 hover:opacity-100'}`}>
              <img src={src(b, 1000)} alt="" loading="lazy" className="h-10 w-[4.4rem] object-cover transition-transform duration-500 group-hover:scale-110 sm:h-14 sm:w-24" />
              <span className="absolute inset-x-1.5 bottom-1.5 h-1 overflow-hidden rounded-full bg-white/40">
                {i === index && <motion.span className="absolute inset-0 origin-left rounded-full bg-gold" style={{ scaleX: autoplay || hover || held ? progress : 1 }} />}
              </span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={prev} aria-label="Previous banner" className="grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-gold hover:text-forest-900 sm:size-12">
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={next} aria-label="Next banner" className="grid size-10 place-items-center rounded-full bg-gold text-forest-900 transition hover:scale-105 sm:size-12">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

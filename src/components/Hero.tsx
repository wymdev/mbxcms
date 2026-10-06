import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight, BadgePercent, Clock, Landmark, MessageCircle } from 'lucide-react';
import { BannerSlider } from './BannerSlider';
import { CurrencyBadge, Sparkline, TrendMark } from './ui';
import { fmt, type Rate } from '../data/rates';
import { site } from '../config/site';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ rates, sample }: { rates: Rate[]; sample: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // As the next sheet slides over, the hero sinks back
  const scale = useTransform(scrollYProgress, [0.5, 1], [1, reduce ? 1 : 0.94]);
  const fade = useTransform(scrollYProgress, [0.55, 1], [1, 0.3]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 180]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);

  const thb = rates.find((r) => r.code === 'THB') ?? rates[0];
  const side = rates.filter((r) => r.code !== thb.code).slice(0, 2);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden bg-forest-900 pb-24 pt-16 text-white sm:pt-20 lg:pb-32 lg:pt-24">
      <div className="grid-bg absolute inset-0" aria-hidden />
      <motion.div style={{ y: blobY }} aria-hidden className="absolute -left-40 top-10 size-[34rem] rounded-full bg-forest-600/40 blur-[120px]" />
      <motion.div style={{ y: blobY }} aria-hidden className="absolute -right-24 bottom-0 size-[28rem] rounded-full bg-gold/20 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-[88rem] sm:px-6 lg:px-10">
        <BannerSlider />
      </div>

      <motion.div style={{ scale, opacity: fade }} className="shell relative mt-14 grid origin-top items-center gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
            className="eyebrow text-gold">
            <span className="h-px w-8 bg-gold" /> Thai ⇄ Myanmar money exchange<span className="hidden sm:inline"> · since {site.since}</span>
          </motion.span>

          <h1 className="display mt-5 text-[clamp(2.5rem,6.4vw,5.5rem)]">
            {['Baht to Kyat,', 'fair and fast.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}>
                  {i === 1 ? (<><em className="text-gold">fair</em> and fast.</>) : line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mt-6 max-w-xl text-lg text-white/75 sm:text-xl">
            Live daily rates, transfers to any Thai or Myanmar bank account, and no service fee. Ever.
          </motion.p>
          <p className="mm mt-2 max-w-xl text-sm text-white/55">ဘတ်ငွေ ⇄ ကျပ်ငွေ — နေ့စဉ်နှုန်းထားမျှတပြီး ဝန်ဆောင်ခ မရှိပါ။</p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
            className="mt-9 flex flex-wrap gap-3">
            <a href="#convert" className="btn-gold px-6 py-3.5 text-base">Check today's rate <ArrowRight className="size-4" /></a>
            <a href={site.viber} className="btn-ghost px-6 py-3.5 text-base"><MessageCircle className="size-4" /> Chat on Viber</a>
          </motion.div>

          <motion.ul initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/80">
            {[[BadgePercent, 'No service fee'], [Landmark, 'Any Thai or Myanmar bank'], [Clock, site.hours]].map(([Icon, t]) => {
              const I = Icon as typeof Clock;
              return (
                <motion.li key={t as string} variants={{ h: { opacity: 0, y: 8 }, s: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-gold/15 text-gold"><I className="size-4" /></span>{t as string}
                </motion.li>
              );
            })}
          </motion.ul>
        </div>

        {/* Floating live-rate cards */}
        <motion.div style={{ y: cardsY }} className="relative mx-auto h-[25rem] w-full max-w-md sm:h-[27rem] lg:col-span-5 lg:mx-0 lg:ml-auto">
          {side.map((r, i) => (
            <motion.div key={r.code}
              initial={{ opacity: 0, y: 40, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: i ? 6 : -7 }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.15, ease: EASE }}
              className={`absolute w-48 rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md sm:w-52 ${i ? 'right-0 top-10' : 'left-0 top-0'}`}>
              <motion.div animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="flex items-center gap-3">
                  <CurrencyBadge code={r.code} size="sm" />
                  <span className="text-sm font-bold">{r.code} / MMK</span>
                </div>
                <div className="num mt-3 flex items-end justify-between">
                  <span className="text-2xl font-extrabold">{fmt(r.sell)}</span>
                  <TrendMark t={r.sellTrend} />
                </div>
              </motion.div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.35, ease: EASE }}
            className="absolute inset-x-6 bottom-0 rounded-[2rem] bg-paper p-6 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:inset-x-10">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-forest-600">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-forest-600 opacity-60" /><span className="relative size-2 rounded-full bg-forest-600" /></span>
                {sample ? 'Sample rate' : 'Live rate'}
              </span>
              <span className="text-xs font-semibold text-slate">per 1 {thb.code}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <CurrencyBadge code={thb.code} />
              <span className="text-slate">→</span>
              <CurrencyBadge code="MMK" />
              <span className="ml-1 text-sm font-bold">{thb.name} to Kyat</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[['We buy', thb.buy, thb.buyTrend], ['We sell', thb.sell, thb.sellTrend]].map(([l, v, t]) => (
                <div key={l as string} className="rounded-2xl bg-mist p-3">
                  <div className="text-xs font-semibold text-slate">{l as string}</div>
                  <div className="num mt-1 flex items-center gap-1 text-2xl font-extrabold">{fmt(v as number)}<TrendMark t={t as 'up'} /></div>
                </div>
              ))}
            </div>
            <Sparkline data={thb.history} className="mt-4 h-12 w-full text-forest-600" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, RefreshCw, Search } from 'lucide-react';
import { CurrencyBadge, Item, Reveal, SectionHead, Sparkline, TiltCard, TrendMark } from './ui';
import { fmt, type Rate } from '../data/rates';

export function RateTicker({ rates }: { rates: Rate[] }) {
  const row = [...rates, ...rates];
  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-paper py-3" aria-label="Rate ticker">
      <div className="marquee flex w-max gap-10 pr-10">
        {row.map((r, i) => (
          <span key={i} className="num flex items-center gap-2 whitespace-nowrap text-sm font-bold text-ink">
            <CurrencyBadge code={r.code} size="sm" />
            {r.code}
            <span className="font-semibold text-slate">buy</span> {fmt(r.buy)}
            <span className="font-semibold text-slate">sell</span> {fmt(r.sell)}
            <TrendMark t={r.sellTrend} />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper" />
    </div>
  );
}

export function Rates({ rates, updatedAt, sample, loading, onConvert, onRefresh }: {
  rates: Rate[]; updatedAt: Date; sample: boolean; loading: boolean; onConvert: (code: string) => void; onRefresh: () => void;
}) {
  const [q, setQ] = useState('');
  const shown = useMemo(
    () => rates.filter((r) => `${r.code} ${r.name}`.toLowerCase().includes(q.trim().toLowerCase())),
    [rates, q],
  );
  const [lead, ...rest] = rates;

  return (
    <section id="rates" className="sheet z-10 bg-paper pb-0 sm:pb-0">
      <div className="shell">
        <SectionHead eyebrow="Today's rates" title={<>Every rate, <span className="text-forest-600">in Kyat</span>.</>}
          lead="What we pay and what we charge for one unit of each currency. Rates move through the day; the price you see when you book is the price you get.">
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            {sample && <span className="rounded-full bg-gold-100 px-3 py-1 font-bold text-forest-900 ring-1 ring-gold/40">Sample rates · live feed coming</span>}
            <span className="text-slate">Updated {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <button onClick={onRefresh} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold text-forest-600 ring-1 ring-forest-600/30 hover:bg-forest-600/10">
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </SectionHead>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Featured pair */}
          {lead && (
            <Reveal className="lg:col-span-5">
              <Item className="lg:sticky lg:top-28">
                <TiltCard className="rounded-[2rem] bg-forest-900 p-7 text-white sm:p-9" max={4}>
                  <div className="flex items-center gap-3">
                    <CurrencyBadge code={lead.code} size="lg" />
                    <div>
                      <div className="text-sm font-semibold text-white/60">Most exchanged</div>
                      <div className="text-xl font-extrabold">{lead.name} → Kyat</div>
                    </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-6">
                    {[['We buy', lead.buy, lead.buyTrend], ['We sell', lead.sell, lead.sellTrend]].map(([l, v, t]) => (
                      <div key={l as string}>
                        <div className="text-sm font-semibold text-white/60">{l as string}</div>
                        <div className="num mt-1 flex items-center gap-2 text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold leading-none">
                          {fmt(v as number)} <TrendMark t={t as 'up'} className="size-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Sparkline data={lead.history} className="mt-8 h-20 w-full text-gold" />
                  <button onClick={() => onConvert(lead.code)} className="btn-gold mt-8">
                    Convert {lead.code} <ArrowRight className="size-4" />
                  </button>
                </TiltCard>
              </Item>
            </Reveal>
          )}

          <div className="lg:col-span-7">
            <label className="relative mb-5 block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a currency, e.g. USD or Yuan"
                className="w-full rounded-full bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-ink shadow-sm ring-1 ring-ink/10 placeholder:text-slate/70 focus:outline-none focus:ring-2 focus:ring-forest-600" />
            </label>
            <motion.ul layout className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {(q ? shown : rest).map((r) => (
                  <motion.li key={r.code} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                    <TiltCard className="rounded-3xl bg-white p-5 ring-1 ring-ink/5 shadow-[0_12px_30px_-22px_rgba(16,32,26,0.5)]" glow="rgba(14,124,90,0.12)">
                      <button onClick={() => onConvert(r.code)} className="block w-full text-left" aria-label={`Convert ${r.name}`}>
                        <div className="flex items-center gap-3">
                          <CurrencyBadge code={r.code} />
                          <div className="min-w-0">
                            <div className="font-extrabold">{r.code}</div>
                            <div className="truncate text-xs font-semibold text-slate">{r.name}</div>
                          </div>
                          <Sparkline data={r.history} className="ml-auto h-8 w-20 text-forest-600" />
                        </div>
                        <div className="num mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-2xl bg-mist px-3 py-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate">Buy</div>
                            <div className="flex items-center gap-1 text-lg font-extrabold">{fmt(r.buy)}<TrendMark t={r.buyTrend} /></div>
                          </div>
                          <div className="rounded-2xl bg-mist px-3 py-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate">Sell</div>
                            <div className="flex items-center gap-1 text-lg font-extrabold">{fmt(r.sell)}<TrendMark t={r.sellTrend} /></div>
                          </div>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-forest-600 opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                          Convert <ArrowRight className="size-3.5" />
                        </span>
                      </button>
                    </TiltCard>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
            {q && shown.length === 0 && <p className="mt-6 text-sm font-semibold text-slate">No currency matches “{q}”. Ask us on Viber; we may still have it.</p>}
          </div>
        </div>
      </div>
      <div className="mt-16 pb-16"><RateTicker rates={rates} /></div>
    </section>
  );
}

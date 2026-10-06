import { useEffect, useMemo, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowUpDown, BadgePercent, Check, Copy, Landmark, MessageCircle, ShieldCheck } from 'lucide-react';
import { Item, Reveal, SectionHead } from './ui';
import { CurrencyPicker, type CurrencyOption } from './CurrencyPicker';
import { fmt, type Rate } from '../data/rates';
import { site } from '../config/site';

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => fmt(v));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [mv, value]);
  return <motion.span className="num">{text}</motion.span>;
}

/** Prices a deal through MMK: we buy what the customer brings, we sell what they take. */
export function quote(rates: Rate[], from: string, to: string, amount: number) {
  const r = (c: string) => rates.find((x) => x.code === c);
  const inMMK = from === 'MMK' ? amount : amount * (r(from)?.buy ?? 0);
  const out = to === 'MMK' ? inMMK : inMMK / (r(to)?.sell || Infinity);
  const unit = from === to ? 1 : (to === 'MMK' ? r(from)?.buy ?? 0 : from === 'MMK' ? 1 / (r(to)?.sell || Infinity) : (r(from)?.buy ?? 0) / (r(to)?.sell || Infinity));
  return { out, unit };
}

export function Converter({ rates, sample, from, to, amount, setFrom, setTo, setAmount }: {
  rates: Rate[]; sample: boolean; from: string; to: string; amount: number;
  setFrom: (c: string) => void; setTo: (c: string) => void; setAmount: (n: number) => void;
}) {
  const options = useMemo<CurrencyOption[]>(() => [
    { code: 'MMK', name: 'Myanmar Kyat', hint: 'base' },
    ...rates.map((r) => ({ code: r.code, name: r.name, hint: `${fmt(r.sell)} Ks` })),
  ], [rates]);
  const { out, unit } = quote(rates, from, to, amount);
  const swap = () => { setFrom(to); setTo(from); };
  // choosing the currency already on the other side swaps the pair instead of pricing THB→THB
  const pickFrom = (c: string) => { if (c === to) setTo(from); setFrom(c); };
  const pickTo = (c: string) => { if (c === from) setFrom(to); setTo(c); };
  const [copied, setCopied] = useState(false);
  const message = `Hello Mergui Boss, I want to send ${amount.toLocaleString('en-US')} ${from} and receive about ${fmt(Number.isFinite(out) ? out : 0)} ${to} (website rate ${fmt(unit, 4)}). Please confirm today's rate. Receiving bank account: `;
  // copy a ready-to-send message, then open Viber so the customer only has to paste it
  const copyAndChat = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); window.setTimeout(() => setCopied(false), 4000); } catch { /* clipboard blocked: Viber still opens */ }
    window.setTimeout(() => { window.location.href = site.viber; }, 350);
  };
  const chips = from === 'MMK' ? [100_000, 500_000, 1_000_000, 5_000_000] : [1_000, 5_000, 10_000, 50_000];

  return (
    <section id="convert" className="sheet z-20 bg-forest-900 text-white">
      <div aria-hidden className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_30%,rgba(253,182,0,0.14),transparent_60%)]" />
      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHead stack eyebrow="Calculator" dark title={<>Know the amount <span className="text-gold">before</span> you send.</>} />
          <Reveal className="-mt-6 space-y-5" gap={0.1}>
            {[
              [BadgePercent, 'No service fee', 'The rate is the whole price. Nothing is added on top.'],
              [Landmark, 'Any Thai or Myanmar bank', 'Send from, or receive into, any Thai or Myanmar bank account.'],
              [ShieldCheck, 'Checked by our team', 'Every transfer is confirmed by a person before money leaves.'],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof BadgePercent;
              return (
                <Item key={t as string} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold ring-1 ring-white/10"><I className="size-5" /></span>
                  <div>
                    <div className="font-extrabold">{t as string}</div>
                    <p className="text-sm text-white/65">{d as string}</p>
                  </div>
                </Item>
              );
            })}
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7">
          <Item className="rounded-[2rem] bg-paper p-5 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold">Exchange calculator</span>
              {sample && <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-forest-900">Sample rates</span>}
            </div>

            <div className="relative mt-5 space-y-2">
              <div className="rounded-3xl bg-mist p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate">You give</span>
                  <CurrencyPicker value={from} onChange={pickFrom} label="You give" options={options} />
                </div>
                <input inputMode="decimal" aria-label="Amount you give" value={amount ? amount.toLocaleString('en-US') : ''}
                  onChange={(e) => setAmount(Number(e.target.value.replace(/[^\d.]/g, '')) || 0)}
                  className="num mt-3 w-full bg-transparent text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-none focus:outline-none" />
              </div>

              <motion.button onClick={swap} whileTap={{ rotate: 180, scale: 0.9 }} aria-label="Swap currencies"
                className="absolute left-1/2 top-1/2 z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-gold text-forest-900 shadow-lg ring-4 ring-paper">
                <ArrowUpDown className="size-5" />
              </motion.button>

              <div className="rounded-3xl bg-forest-900 p-4 text-white sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/60">You receive</span>
                  <CurrencyPicker value={to} onChange={pickTo} label="You receive" options={options} />
                </div>
                <div className="mt-3 text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-none text-gold">
                  <AnimatedNumber value={Number.isFinite(out) ? out : 0} />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button key={c} onClick={() => setAmount(c)}
                  className={`num rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition ${amount === c ? 'bg-forest-900 text-white ring-forest-900' : 'bg-white text-ink ring-ink/10 hover:ring-forest-600'}`}>
                  {c.toLocaleString('en-US')} {from}
                </button>
              ))}
            </div>

            <dl className="num mt-6 grid gap-2 border-t border-ink/10 pt-5 text-sm sm:grid-cols-3">
              <div><dt className="text-slate">Rate</dt><dd className="font-extrabold">1 {from} = {fmt(unit, 4)} {to}</dd></div>
              <div><dt className="text-slate">Service fee</dt><dd className="font-extrabold text-forest-600">None</dd></div>
              <div><dt className="text-slate">You receive</dt><dd className="font-extrabold">{fmt(Number.isFinite(out) ? out : 0)} {to}</dd></div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={copyAndChat} className="btn-dark">
                {copied ? <Check className="size-4 text-gold" /> : <Copy className="size-4" />} {copied ? 'Copied, paste it in Viber' : 'Copy quote & chat on Viber'}
              </button>
              <a href={site.viber} className="btn bg-white text-ink ring-1 ring-ink/10 hover:ring-forest-600"><MessageCircle className="size-4" /> Viber</a>
            </div>
            <p className="mt-4 text-xs text-slate">Estimate only. Rates move often, so we send you the exact rate to confirm in chat before you pay, and hold it for a short time.</p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

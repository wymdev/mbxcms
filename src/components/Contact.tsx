import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone, Plus } from 'lucide-react';
import { Item, Reveal, SectionHead, TiltCard } from './ui';
import { site } from '../config/site';
import { NAV } from './Nav';

const FAQS = [
  ['Is there a service fee?', 'No. The rate we show is the full price. We never add a service charge to an exchange.'],
  ['Which banks can I use?', 'Any Thai bank account and any Myanmar bank account, for sending and receiving. Mobile wallets such as KBZPay and WavePay are also accepted.'],
  ['Is the rate on this page final?', 'Rates move during the day. When you book, our team confirms the exact rate and amount before you pay, and that is the rate you get.'],
  ['How do I know my money arrived?', 'We send you a receipt slip for every transfer, showing the amount, rate and receiving account.'],
  ['Which currencies do you exchange?', 'Mainly Thai Baht and Myanmar Kyat, plus US Dollar, Singapore Dollar, Yuan, Ringgit, Euro and others. Ask us if yours is not listed.'],
  ['Is there an app?', 'You can install this site on your phone today from the “On your phone” section. The Mergui Boss app, where you can send a request, upload your slip and track your transfer, is coming soon.'],
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="sheet z-[70] bg-paper">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead stack eyebrow="Questions" title="Good to know." />
          <p className="-mt-6 max-w-sm text-slate">Still unsure? Message us any time on Viber or Line.</p>
        </div>
        <Reveal as="ul" className="divide-y divide-ink/10 lg:col-span-8" gap={0.05}>
          {FAQS.map(([q, a], i) => {
            const on = open === i;
            return (
              <Item as="li" key={q}>
                <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="flex w-full items-center gap-6 py-5 text-left">
                  <span className="num text-sm font-bold text-forest-600">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-lg font-extrabold sm:text-xl">{q}</span>
                  <motion.span animate={{ rotate: on ? 45 : 0 }} className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${on ? 'bg-forest-900 text-gold' : 'bg-mist text-ink'}`}>
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden pl-11 pr-16 text-slate">
                      <span className="block pb-6">{a}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </Item>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  const cards = [
    ...site.phones.map((p) => ({ icon: Phone, label: `${p.label} · ${p.app}`, value: p.number, href: p.href })),
    { icon: MessageCircle, label: 'Chat on Viber', value: 'Fastest reply', href: site.viber },
    { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
  ].filter((c) => c.value);

  return (
    <section id="contact" className="sheet z-[75] bg-forest-900 pb-36 text-white md:pb-28">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead stack dark eyebrow="Contact" title={<>Talk to a person, <span className="text-gold">any time</span>.</>} />
          <Reveal className="-mt-4 space-y-4">
            <Item className="flex items-start gap-3 text-white/80"><MapPin className="mt-0.5 size-5 text-gold" /> {site.address}</Item>
            <Item className="flex items-start gap-3 text-white/80"><Clock className="mt-0.5 size-5 text-gold" /> {site.hours}</Item>
            <Item>
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-2">Open in Google Maps <ArrowUpRight className="size-4" /></a>
            </Item>
          </Reveal>
        </div>
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:col-span-7" gap={0.07}>
          {cards.map((c) => (
            <Item key={c.label}>
              <TiltCard className="rounded-[1.75rem] bg-white/5 ring-1 ring-white/10 transition-colors hover:bg-white/10" glow="rgba(253,182,0,0.2)">
                <a href={c.href} className="flex h-full flex-col p-6">
                  <span className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-gold text-forest-900"><c.icon className="size-5" /></span>
                    <ArrowUpRight className="size-5 text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                  </span>
                  <span className="mt-8 text-sm font-semibold text-white/60">{c.label}</span>
                  <span className="num mt-1 break-all text-xl font-extrabold">{c.value}</span>
                </a>
              </TiltCard>
            </Item>
          ))}
        </Reveal>
      </div>

      <footer className="shell mt-20 border-t border-white/10 pt-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src="/logo.png" alt={site.legalName} className="h-12 w-auto" />
            <p className="mm mt-4 max-w-sm text-sm text-white/55">မားဂွီးဘော့စ် ထိုင်း ⇄ မြန်မာ ငွေလဲဝန်ဆောင်မှု</p>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-sm font-semibold text-white/70 md:col-span-4">
            {NAV.map((n) => <li key={n.id}><a href={`#${n.id}`} className="hover:text-gold">{n.label}</a></li>)}
          </ul>
          <p className="text-sm text-white/50 md:col-span-3 md:text-right">© {new Date().getFullYear()} {site.legalName}<br />No service fee on any exchange.</p>
        </div>
      </footer>
    </section>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftRight, Coins, Landmark, Plus, Radar, Receipt, Wallet } from 'lucide-react';
import { Item, Reveal, SectionHead, TiltCard } from './ui';

type Service = {
  icon: typeof Coins; title: string; short: string; more: string; mm?: string; soon?: boolean; span: string; tone: 'dark' | 'gold' | 'light';
};

const SERVICES: Service[] = [
  {
    icon: ArrowLeftRight, title: 'Baht ⇄ Kyat exchange', tone: 'dark', span: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
    short: 'Our main service: Thai Baht to Myanmar Kyat and back, at rates updated through the day.',
    more: 'Tell us the amount, we confirm the rate, and the money moves between any Thai bank account and any Myanmar bank account. No service fee on top.',
    mm: 'ဘတ်ငွေကနေ ကျပ်ငွေ (သို့) ကျပ်ငွေကနေ ဘတ်ငွေ ငွေလဲလှယ်ဖို့ လိုအပ်နေရင် မားဂွီးဘော့စ်မှ အထူးနှုန်းထားများနဲ့ လွယ်ကူလျှင်မြန်စွာ ဝန်ဆောင်မှုပေးနေပါသည်။',
  },
  {
    icon: Landmark, title: 'Bank to bank', tone: 'light', span: 'lg:col-span-5',
    short: 'Send from or receive into any Thai or Myanmar bank account.',
    more: 'We send a receipt slip for every transfer so both sides have proof of payment.',
  },
  {
    icon: Wallet, title: 'Pay by mobile wallet', tone: 'gold', span: 'lg:col-span-5',
    short: 'Pay with KBZPay, WavePay or a bank app and send us the screenshot.',
    more: 'A team member checks every payment against our account before your money is released. Your safety comes first.',
  },
  {
    icon: Coins, title: 'Other currencies', tone: 'light', span: 'lg:col-span-4',
    short: 'US Dollar, Singapore Dollar, Yuan, Ringgit, Euro and more.',
    more: 'Not on the board? Message us; we can often arrange it.',
  },
  {
    icon: Receipt, title: 'Receipt slip', tone: 'light', span: 'lg:col-span-4',
    short: 'A Mergui Boss receipt for every transfer, sent straight to your chat.',
    more: 'It shows the amount, rate and receiving account, so you and your family have proof the money arrived.',
  },
  {
    icon: Radar, title: 'Track your transfer', tone: 'light', span: 'lg:col-span-4', soon: true,
    short: 'See each step: payment received, checked, sent, done.',
    more: 'Coming with the Mergui Boss app: send a request, upload your slip and follow your transfer without asking in chat.',
  },
];

const TONE = {
  dark: 'bg-forest-900 text-white',
  gold: 'bg-gold text-forest-900',
  light: 'bg-white text-ink ring-1 ring-ink/5',
};

export function Services() {
  const [open, setOpen] = useState<string | null>(SERVICES[0].title);
  return (
    <section id="services" className="sheet z-30 bg-mist">
      <div className="shell">
        <SectionHead eyebrow="Services" title={<>Everything you need to <span className="text-forest-600">move money</span> home.</>}
          lead="Message us, transfer, and we send it on. Tap a card for details." />
        <Reveal className="grid auto-rows-auto gap-4 md:grid-cols-2 lg:grid-cols-12" gap={0.07}>
          {SERVICES.map((s) => {
            const isOpen = open === s.title;
            const Icon = s.icon;
            return (
              <Item key={s.title} className={s.span}>
                <TiltCard className={`h-full rounded-[1.75rem] ${TONE[s.tone]}`} glow={s.tone === 'dark' ? 'rgba(253,182,0,0.2)' : 'rgba(14,124,90,0.14)'} max={5}>
                  <button onClick={() => setOpen(isOpen ? null : s.title)} aria-expanded={isOpen}
                    className={`flex h-full w-full flex-col p-6 text-left sm:p-7 ${s.tone === 'dark' ? 'lg:p-10' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <span className={`grid size-12 place-items-center rounded-2xl ${s.tone === 'dark' ? 'bg-gold text-forest-900' : s.tone === 'gold' ? 'bg-forest-900 text-gold' : 'bg-mist text-forest-600'}`}>
                        <Icon className="size-6" />
                      </span>
                      <span className="flex items-center gap-2">
                        {s.soon && <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-forest-900">Soon</span>}
                        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid size-9 place-items-center rounded-full ${s.tone === 'light' ? 'bg-mist' : 'bg-white/15'}`}>
                          <Plus className="size-4" />
                        </motion.span>
                      </span>
                    </div>
                    <h3 className={`display mt-6 ${s.tone === 'dark' ? 'text-[clamp(1.8rem,3.4vw,3rem)]' : 'text-2xl'}`}>{s.title}</h3>
                    <p className={`mt-3 ${s.tone === 'dark' ? 'max-w-xl text-lg text-white/75' : s.tone === 'gold' ? 'text-forest-900/80' : 'text-slate'}`}>{s.short}</p>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                          <p className={`pt-4 text-sm font-semibold ${s.tone === 'dark' ? 'text-white/85' : ''}`}>{s.more}</p>
                          {s.mm && <p className={`mm mt-3 max-w-xl text-sm ${s.tone === 'dark' ? 'text-white/60' : 'text-slate'}`}>{s.mm}</p>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {s.tone === 'dark' && (
                      <div className="mt-auto flex flex-wrap gap-2 pt-8">
                        {['No service fee', 'Any Thai bank', 'Any Myanmar bank', 'Receipt for every transfer'].map((t) => (
                          <span key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold ring-1 ring-white/15">{t}</span>
                        ))}
                      </div>
                    )}
                  </button>
                </TiltCard>
              </Item>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

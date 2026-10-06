import { type ReactNode, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { BadgeCheck, CheckCircle2, Handshake, ImageUp, LineChart } from 'lucide-react';
import { CurrencyBadge, Item, Reveal, SectionHead } from './ui';

const STEPS = [
  { icon: LineChart, title: 'Check the rate', text: 'See today’s rate here, or ask us on Viber or Line. The rate is the whole price.' },
  { icon: Handshake, title: 'Confirm the rate', text: 'Tell us the amount. We reply with the exact rate and total; reply OK and we hold it for a short time.' },
  { icon: ImageUp, title: 'Send your payment', text: 'Pay by bank transfer or mobile wallet and send the screenshot. Our team checks it.' },
  { icon: BadgeCheck, title: 'Money arrives', text: 'We transfer to the account you gave and send you a receipt slip as proof.' },
];

function Bubble({ me, children }: { me?: boolean; children: ReactNode }) {
  return (
    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${me ? 'ml-auto rounded-br-md bg-forest-600 text-white' : 'rounded-bl-md bg-mist text-ink'}`}>{children}</div>
  );
}

function Screen({ step }: { step: number }) {
  if (step === 0) return (
    <div className="space-y-2">
      <div className="text-sm font-extrabold">Today’s rates</div>
      {[['THB', '128.0', '129.5'], ['USD', '4,310', '4,340'], ['SGD', '3,250', '3,280'], ['CNY', '595', '602']].map(([c, b, s]) => (
        <div key={c} className="num flex items-center gap-2 rounded-xl bg-mist px-2.5 py-2 text-[13px] font-bold">
          <CurrencyBadge code={c} size="sm" /> {c}<span className="ml-auto text-slate">{b}</span><span>{s}</span>
        </div>
      ))}
      <div className="pt-1 text-[11px] text-slate">Buy / sell in Kyat · sample</div>
    </div>
  );
  if (step === 1) return (
    <div className="space-y-2.5">
      <Bubble me>Hi, I want to send 10,000 THB to a KBZ Bank account in Yangon.</Bubble>
      <Bubble>Rate 128.0: your family receives <b>1,280,000 MMK</b>. No service fee. Held 10 min, reply OK to confirm.</Bubble>
      <Bubble me>OK, confirmed. Account name and number coming now.</Bubble>
      <div className="flex gap-1 pl-1"><span className="size-1.5 animate-bounce rounded-full bg-slate/50" /><span className="size-1.5 animate-bounce rounded-full bg-slate/50 [animation-delay:120ms]" /><span className="size-1.5 animate-bounce rounded-full bg-slate/50 [animation-delay:240ms]" /></div>
    </div>
  );
  if (step === 2) return (
    <div className="space-y-2.5">
      <Bubble>Please transfer 10,000 THB to our account and send the slip.</Bubble>
      <div className="ml-auto w-36 rounded-2xl bg-forest-600 p-2">
        <div className="grid h-24 place-items-center rounded-xl bg-white/90 text-[11px] font-bold text-slate"><ImageUp className="size-6 text-forest-600" />payment.jpg</div>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-gold-100 px-3 py-2 text-[12px] font-bold text-forest-900">
        <CheckCircle2 className="size-4 text-forest-600" /> Payment checked by our team
      </div>
    </div>
  );
  return (
    <div className="rounded-2xl bg-mist p-3 text-[13px]">
      <div className="flex items-center gap-2 font-extrabold text-forest-600"><BadgeCheck className="size-5" /> Transfer complete</div>
      <dl className="num mt-3 space-y-1.5">
        {[['Sent', '10,000 THB'], ['Rate', '128.0'], ['Received', '1,280,000 MMK'], ['Service fee', 'None'], ['Bank', 'KBZ · Yangon']].map(([a, b]) => (
          <div key={a} className="flex justify-between"><dt className="text-slate">{a}</dt><dd className="font-bold">{b}</dd></div>
        ))}
      </dl>
      <div className="mt-3 rounded-lg border border-dashed border-slate/40 py-2 text-center text-[11px] font-bold text-slate">Receipt slip sent to you</div>
    </div>
  );
}

function Phone({ step }: { step: number }) {
  return (
    <div className="relative mx-auto w-[17rem] rounded-[2.6rem] bg-ink p-2.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.8)] ring-1 ring-white/10 sm:w-[19rem]">
      <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div className="h-[30rem] overflow-hidden rounded-[2.1rem] bg-white p-4 pt-10 text-ink sm:h-[33rem]">
        <div className="mb-4 flex items-center gap-2 border-b border-ink/10 pb-3">
          <img src="/mark.png" alt="" className="size-8 rounded-full bg-forest-900 p-1" />
          <div><div className="text-sm font-extrabold">Mergui Boss</div><div className="text-[11px] text-forest-600">online</div></div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <Screen step={step} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const track = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 30%', 'end 70%'] });
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)))));

  return (
    <section id="how" className="sheet z-40 bg-forest-900 text-white">
      <div className="shell">
        <SectionHead dark eyebrow="How it works" title={<>Four steps, <span className="text-gold">one chat</span>.</>}
          lead="Most customers do everything by message. Scroll to see a transfer from start to finish." />

        {/* Desktop: sticky phone, steps advance with scroll */}
        <div ref={track} className="relative hidden lg:block" style={{ height: `${STEPS.length * 60}vh` }}>
          <div className="sticky top-28 grid grid-cols-12 items-center gap-10">
            <ol className="relative col-span-6 space-y-3 pl-8">
              <div className="absolute bottom-3 left-[11px] top-3 w-0.5 rounded bg-white/10" />
              <motion.div className="absolute left-[11px] top-3 w-0.5 origin-top rounded bg-gold" style={{ scaleY: bar, height: 'calc(100% - 1.5rem)' }} />
              {STEPS.map((s, i) => {
                const on = i === step, done = i < step;
                return (
                  <li key={s.title} className="relative">
                    <span className={`absolute -left-8 top-5 grid size-6 place-items-center rounded-full text-[11px] font-extrabold transition-colors ${on || done ? 'bg-gold text-forest-900' : 'bg-forest-800 text-white/50 ring-1 ring-white/15'}`}>{i + 1}</span>
                    <motion.div animate={{ opacity: on ? 1 : 0.45, x: on ? 8 : 0 }} transition={{ duration: 0.4 }}
                      className={`rounded-3xl p-5 transition-colors ${on ? 'bg-white/10 ring-1 ring-white/15' : ''}`}>
                      <div className="flex items-center gap-3">
                        <s.icon className={`size-5 ${on ? 'text-gold' : 'text-white/60'}`} />
                        <h3 className="text-xl font-extrabold">{s.title}</h3>
                      </div>
                      <p className="mt-2 max-w-md text-white/70">{s.text}</p>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
            <div className="col-span-6">
              <Phone step={step} />
            </div>
          </div>
        </div>

        {/* Phones and tablets: stacked steps */}
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {STEPS.map((s, i) => (
            <Item key={s.title} className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-gold text-sm font-extrabold text-forest-900">{i + 1}</span>
                <h3 className="text-lg font-extrabold">{s.title}</h3>
              </div>
              <p className="mt-2 text-white/70">{s.text}</p>
              <div className="mt-4 rounded-2xl bg-white p-3 text-ink"><Screen step={i} /></div>
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

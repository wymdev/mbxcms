import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { BadgePercent, Clock, Infinity as InfinityIcon, Scale, Zap } from 'lucide-react';
import { Item, Reveal, SectionHead, TiltCard } from './ui';
import { site } from '../config/site';

const REASONS = [
  { icon: BadgePercent, big: '0', unit: 'MMK', title: 'No service fee', text: 'The rate is the full price. Nothing is added on top.' },
  { icon: Scale, big: 'Fair', unit: '', title: 'Fair daily rates', text: 'Rates follow the market through the day and are shown openly.' },
  { icon: Clock, big: '24/7', unit: '', title: 'Always reachable', text: 'Message us any time on Viber or Line.' },
  { icon: Zap, big: 'Fast', unit: '', title: 'Quick transfers', text: 'Confirmed by our team, with a receipt slip for every transfer.' },
  { icon: InfinityIcon, big: 'No', unit: 'limit', title: 'Unlimited transfers', text: 'Small family transfers or large business amounts.' },
];

/** Big words drift sideways as the band scrolls past: the hand-off between sections. */
function Drift() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-30%']);
  const x2 = useTransform(scrollYProgress, [0, 1], reduce ? ['-20%', '-20%'] : ['-30%', '0%']);
  const words = 'No service fee · Fair rate · 24/7 · Fast · Unlimited · ';
  return (
    <div ref={ref} className="overflow-hidden py-6" aria-hidden>
      <motion.div style={{ x: x1 }} className="display whitespace-nowrap text-[clamp(3rem,10vw,9rem)] text-forest-900">{words.repeat(3)}</motion.div>
      <motion.div style={{ x: x2 }} className="display whitespace-nowrap text-[clamp(3rem,10vw,9rem)] text-transparent [-webkit-text-stroke:1.5px_var(--color-forest-600)]">{words.repeat(3)}</motion.div>
    </div>
  );
}

export function WhyUs() {
  return (
    <section id="why" className="sheet z-50 bg-gold">
      <div className="shell">
        <SectionHead eyebrow="Why Mergui Boss" title={<>Trusted for Baht and Kyat <span className="italic">since {site.since}</span>.</>} />
      </div>
      <Drift />
      <div className="shell mt-8">
        <Reveal className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5" gap={0.06}>
          {REASONS.map((r, i) => (
            <Item key={r.title} className={i === REASONS.length - 1 ? 'col-span-2 sm:col-span-1' : ''}>
              <TiltCard className="h-full rounded-[1.75rem] bg-forest-900 p-5 text-white sm:p-6" glow="rgba(253,182,0,0.22)">
                <r.icon className="size-6 text-gold" />
                <div className="display mt-6 text-4xl text-gold sm:mt-8 sm:text-5xl">{r.big}<span className="ml-1 text-base text-white/60">{r.unit}</span></div>
                <h3 className="mt-3 text-lg font-extrabold">{r.title}</h3>
                <p className="mt-1 text-sm text-white/65">{r.text}</p>
              </TiltCard>
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="sheet z-[55] bg-paper">
      <div className="shell grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead stack eyebrow="About us" title={<>Money home, <span className="text-forest-600">done right</span>.</>} />
          <Reveal className="-mt-4 flex items-center gap-4">
            <Item><img src="/mark.png" alt="" className="size-20 rounded-3xl bg-forest-900 p-3" /></Item>
            <Item><div className="text-sm font-semibold text-slate">{site.legalName}<br />{site.address}</div></Item>
          </Reveal>
        </div>
        <Reveal className="space-y-6 lg:col-span-7" gap={0.12}>
          <Item>
            <p className="text-xl font-semibold leading-relaxed text-ink sm:text-2xl">
              Mergui Boss Money Exchange has been a trusted foreign exchange expert since {site.since}. We help everyone who sends money
              across borders get a fair rate, with trust and convenience.
            </p>
          </Item>
          <Item>
            <p className="text-slate">
              Every customer is different, so we fit our service to what you need, whether that is a monthly transfer to family or a
              large amount for your business.
            </p>
          </Item>
          <Item>
            <p className="mm rounded-3xl bg-mist p-6 text-[15px] text-ink">
              Mergui Boss Money Exchange သည် 2021 ခုနှစ်တွင် စတင်တည်ထောင်ခဲ့ပြီး ယုံကြည်စိတ်ချရတဲ့ နိုင်ငံခြားငွေလဲလှယ်နိုင်သော နေရာတစ်ခုဖြစ်ပါသည်။
              မားဂွီးဘော့စ်၏ ရည်ရွယ်ချက်မှာ နိုင်ငံတကာ ငွေလွှဲပို့သူအားလုံးအား မှန်ကန်သော နှုန်းထားနှင့် ယုံကြည်စိတ်ချ အဆင်ပြေစွာ ငွေလဲလှယ်နိုင်ရန်ဖြစ်ပါသည်။
            </p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

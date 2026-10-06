import { Check, Crown, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Item, Reveal, SectionHead } from './ui';

const PLANS = [
  { icon: User, name: 'Everyone', price: 'Free', note: 'every transfer', items: ['Live rates and calculator', 'Chat with us any time on Viber or Line', 'Any Thai or Myanmar bank', 'Receipt slip for every transfer', 'No service fee, ever'] },
  { icon: Crown, name: 'MBX Member', price: 'Monthly', note: 'price announced at launch', featured: true, items: ['A better rate on every transfer', 'Your transfers handled first', 'Saved recipients, repeat in one tap', 'Points on every transfer', 'Monthly statement of your transfers'] },
];

export function Membership() {
  return (
    <section id="membership" className="sheet z-[60] bg-mist">
      <div className="shell">
        <SectionHead eyebrow="Membership · coming soon" title={<>No fees. <span className="text-forest-600">More for members.</span></>}
          lead="Every transfer stays free of service charges. Membership adds a better rate and faster handling for people who send often." />
        <Reveal className="grid gap-4 md:grid-cols-2 lg:max-w-5xl" gap={0.1}>
          {PLANS.map((p) => (
            <Item key={p.name}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={`relative h-full rounded-[2rem] p-7 sm:p-8 ${p.featured ? 'bg-forest-900 text-white shadow-[0_40px_80px_-40px_rgba(10,42,32,0.9)]' : 'bg-white text-ink ring-1 ring-ink/5'}`}>
                {p.featured && <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-forest-900">For regular senders</span>}
                <span className={`grid size-12 place-items-center rounded-2xl ${p.featured ? 'bg-gold text-forest-900' : 'bg-mist text-forest-600'}`}><p.icon className="size-6" /></span>
                <h3 className="mt-6 text-2xl font-extrabold">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`display text-4xl ${p.featured ? 'text-gold' : 'text-forest-600'}`}>{p.price}</span>
                  <span className={`text-sm font-semibold ${p.featured ? 'text-white/60' : 'text-slate'}`}>{p.note}</span>
                </div>
                <ul className="mt-7 space-y-3">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-3 text-[15px] font-semibold">
                      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${p.featured ? 'bg-gold text-forest-900' : 'bg-forest-600 text-white'}`}><Check className="size-3" strokeWidth={3} /></span>
                      <span className={p.featured ? 'text-white/90' : ''}>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

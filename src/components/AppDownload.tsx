import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, FileUp, Receipt, Send } from 'lucide-react';
import { Item, Reveal, SectionHead } from './ui';
import { site } from '../config/site';

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function PlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M3.5 2L13.8 12L3.5 22Z" fill="#4285F4" />
      <path d="M3.5 2L15.75 9L13.8 12Z" fill="#34A853" />
      <path d="M15.75 9L21 12L15.75 15L13.8 12Z" fill="#FBBC04" />
      <path d="M13.8 12L15.75 15L3.5 22Z" fill="#EA4335" />
    </svg>
  );
}

/** Store button. Without a store link yet it shows as "Coming soon". */
function StoreButton({ href, logo, top, name }: { href: string; logo: ReactNode; top: string; name: string }) {
  const body = (
    <>
      {logo}
      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-semibold text-white/70">{href ? top : 'Coming soon to'}</span>
        <span className="mt-1 text-lg font-extrabold">{name}</span>
      </span>
    </>
  );
  const cls = 'inline-flex min-w-44 items-center gap-3 rounded-2xl bg-black px-5 py-3 text-white ring-1 ring-white/20';
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} transition-transform hover:-translate-y-0.5 hover:ring-gold/60`}>{body}</a>
  ) : (
    <span className={`${cls} cursor-default opacity-80`} aria-disabled="true">{body}</span>
  );
}

const STEPS = [
  { label: 'Rate confirmed', done: true },
  { label: 'Slip uploaded', done: true },
  { label: 'Payment checked', done: true },
  { label: 'Sent to your bank', done: false },
];

export function AppDownload() {
  const reduce = useReducedMotion();
  const live = site.appStoreUrl || site.playStoreUrl;
  return (
    <section id="app" className="sheet z-[65] overflow-hidden bg-forest-950 text-white">
      <div aria-hidden className="absolute -left-32 bottom-0 size-[30rem] rounded-full bg-gold/15 blur-[120px]" />
      <div className="shell relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHead stack dark eyebrow="Mergui Boss app" title={<>Your transfer, <span className="text-gold">in your pocket</span>.</>}
            lead={`${live ? 'Get' : 'Coming soon:'} the Mergui Boss app for Android and iPhone. Send a request, upload your payment slip and follow your transfer right up to the receipt.`} />
          <Reveal className="-mt-4 grid gap-3 sm:grid-cols-3" gap={0.08}>
            {[[Send, 'Send a request'], [FileUp, 'Upload your slip'], [Receipt, 'Track to receipt']].map(([I, t]) => {
              const Icon = I as typeof Send;
              return (
                <Item key={t as string} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <Icon className="size-5 text-gold" /><span className="text-sm font-bold">{t as string}</span>
                </Item>
              );
            })}
          </Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StoreButton href={site.appStoreUrl} logo={<AppleLogo className="size-7" />} top="Download on the" name="App Store" />
            <StoreButton href={site.playStoreUrl} logo={<PlayLogo className="size-7" />} top="Get it on" name="Google Play" />
          </div>
          <p className="mt-4 text-sm text-white/55">Free to download · Android and iPhone</p>
        </div>

        <div className="relative lg:col-span-5">
          <motion.div initial={{ opacity: 0, y: 60, rotate: -6 }} whileInView={{ opacity: 1, y: 0, rotate: -4 }} viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-64 rounded-[2.6rem] bg-ink p-2.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10 lg:ml-auto lg:mr-10">
            <div className="flex h-[28rem] flex-col gap-4 rounded-[2.1rem] bg-gradient-to-b from-forest-700 to-forest-900 p-5 pt-10">
              <div className="flex items-center gap-2">
                <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" className="size-8 rounded-xl" />
                <span className="text-sm font-extrabold">Mergui Boss</span>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Your transfer</p>
                <p className="num mt-1 text-2xl font-extrabold">฿10,000</p>
                <p className="text-xs text-white/60">to Myanmar bank ·· 4821</p>
              </div>
              <ol className="space-y-3 px-1">
                {STEPS.map((s) => (
                  <li key={s.label} className="flex items-center gap-3 text-xs font-bold">
                    {s.done ? (
                      <span className="grid size-5 place-items-center rounded-full bg-gold text-forest-900"><Check className="size-3" strokeWidth={3} /></span>
                    ) : (
                      <motion.span animate={reduce ? undefined : { scale: [1, 1.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                        className="size-5 rounded-full ring-2 ring-gold" />
                    )}
                    <span className={s.done ? 'text-white' : 'text-gold'}>{s.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Bell, Download, PlusSquare, Share, Smartphone, WifiOff, Zap } from 'lucide-react';
import { Item, Reveal, SectionHead } from './ui';

export function AppInstall({ canInstall, installed, isIOS, onInstall }: {
  canInstall: boolean; installed: boolean; isIOS: boolean; onInstall: () => void;
}) {
  const reduce = useReducedMotion();
  const [help, setHelp] = useState(false);
  return (
    <section id="app" className="sheet z-[65] overflow-hidden bg-forest-950 text-white">
      <div aria-hidden className="absolute -left-32 bottom-0 size-[30rem] rounded-full bg-gold/15 blur-[120px]" />
      <div className="shell relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHead stack dark eyebrow="On your phone" title={<>Keep Mergui Boss <span className="text-gold">one tap</span> away.</>}
            lead="Add this site to your home screen. It opens like an app, loads fast, and shows the last rates even with a weak signal." />
          <Reveal className="-mt-4 grid gap-3 sm:grid-cols-3" gap={0.08}>
            {[[Zap, 'Opens instantly'], [WifiOff, 'Works offline'], [Bell, 'Rate alerts soon']].map(([I, t]) => {
              const Icon = I as typeof Zap;
              return (
                <Item key={t as string} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                  <Icon className="size-5 text-gold" /><span className="text-sm font-bold">{t as string}</span>
                </Item>
              );
            })}
          </Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {installed ? (
              <span className="btn bg-white/10 text-white ring-1 ring-white/20"><Smartphone className="size-4" /> Installed on this device</span>
            ) : canInstall ? (
              <button onClick={onInstall} className="btn-gold px-6 py-3.5 text-base"><Download className="size-5" /> Install the app</button>
            ) : (
              <button onClick={() => setHelp((h) => !h)} className="btn-gold px-6 py-3.5 text-base" aria-expanded={help}><PlusSquare className="size-5" /> Add to home screen</button>
            )}
            <span className="text-sm text-white/55">Free · no store needed · Android and iPhone</span>
          </div>
          {help && !installed && (
            <motion.ol initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 max-w-lg space-y-2 rounded-2xl bg-white/5 p-5 text-sm ring-1 ring-white/10">
              {isIOS ? (
                <>
                  <li className="flex items-center gap-2">1. Tap <Share className="size-4 text-gold" /> Share in Safari</li>
                  <li>2. Choose <b>Add to Home Screen</b></li>
                </>
              ) : (
                <>
                  <li>1. Open your browser menu (⋮)</li>
                  <li>2. Choose <b>Install app</b> or <b>Add to Home screen</b></li>
                </>
              )}
            </motion.ol>
          )}
        </div>

        <div className="relative lg:col-span-5">
          <motion.div initial={{ opacity: 0, y: 60, rotate: -6 }} whileInView={{ opacity: 1, y: 0, rotate: -4 }} viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-64 rounded-[2.6rem] bg-ink p-2.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10 lg:ml-auto lg:mr-10">
            <div className="grid h-[28rem] grid-cols-4 content-start gap-4 rounded-[2.1rem] bg-gradient-to-b from-forest-700 to-forest-900 p-5 pt-12">
              {Array.from({ length: 11 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-white/10" />)}
              <motion.div animate={reduce ? undefined : { scale: [1, 1.08, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="flex flex-col items-center gap-1">
                <img src="/icon-192.png" alt="Mergui Boss app icon" className="aspect-square w-full rounded-2xl ring-2 ring-gold" />
                <span className="text-[10px] font-bold">Mergui Boss</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

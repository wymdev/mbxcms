import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Nav, TabBar } from './components/Nav';
import { Hero } from './components/Hero';
import { Rates } from './components/Rates';
import { Converter } from './components/Converter';
import { Services } from './components/Services';
import { HowItWorks } from './components/HowItWorks';
import { About, WhyUs } from './components/WhyUs';
import { Membership } from './components/Membership';
import { Reviews } from './components/Reviews';
import { AppInstall } from './components/AppInstall';
import { Contact, Faq } from './components/Contact';
import { useRates } from './hooks/useRates';
import { useInstallPrompt } from './hooks/useInstallPrompt';

export default function App() {
  const { rates, updatedAt, sample, loading, refresh } = useRates();
  const pwa = useInstallPrompt();
  const [from, setFrom] = useState('THB');
  const [to, setTo] = useState('MMK');
  const [amount, setAmount] = useState(10_000);

  const convert = (code: string) => {
    setFrom(code);
    setTo(code === 'MMK' ? 'THB' : 'MMK');
    document.getElementById('convert')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <a href="#rates" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:font-bold">
        Skip to rates
      </a>
      <Nav canInstall={pwa.canInstall} onInstall={pwa.install} />
      <main>
        <Hero rates={rates} sample={sample} />
        <Rates rates={rates} updatedAt={updatedAt} sample={sample} loading={loading} onConvert={convert} onRefresh={refresh} />
        <Converter rates={rates} sample={sample} from={from} to={to} amount={amount} setFrom={setFrom} setTo={setTo} setAmount={setAmount} />
        <Services />
        <HowItWorks />
        <WhyUs />
        <Reviews />
        <About />
        <Membership />
        <AppInstall canInstall={pwa.canInstall} installed={pwa.installed} isIOS={pwa.isIOS} onInstall={pwa.install} />
        <Faq />
        <Contact />
      </main>
      <TabBar />
    </MotionConfig>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { fetchRates, jiggle, sampleRates, type RatesResult } from '../data/rates';

const REFRESH_MS = 60_000;

/** Live rates with a one-minute refresh; keeps the last good result when a refresh fails. */
export function useRates() {
  const [data, setData] = useState<RatesResult>(() => sampleRates());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const next = await fetchRates(signal);
      // in sample mode keep the moving demo values instead of resetting them
      setData((prev) => (next.sample && prev.sample ? { ...prev, updatedAt: new Date() } : next));
      setError(false);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    const id = window.setInterval(() => load(), REFRESH_MS);
    return () => { ctrl.abort(); window.clearInterval(id); };
  }, [load]);

  // Sample mode: move the demo rates every few seconds so trends and charts animate
  useEffect(() => {
    if (!data.sample) return;
    const id = window.setInterval(() => setData((d) => ({ ...d, rates: jiggle(d.rates), updatedAt: new Date() })), 5000);
    return () => window.clearInterval(id);
  }, [data.sample]);

  return { ...data, loading, error, refresh: () => load() };
}

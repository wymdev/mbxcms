import { RATES_URL } from '../config/site';

export type Trend = 'up' | 'down' | 'flat';

export interface Rate {
  code: string;
  name: string;
  /** MMK paid by Mergui Boss for 1 unit of this currency */
  buy: number;
  /** MMK charged by Mergui Boss for 1 unit of this currency */
  sell: number;
  buyTrend: Trend;
  sellTrend: Trend;
  history: number[];
}

export interface RatesResult {
  rates: Rate[];
  updatedAt: Date;
  sample: boolean;
}

const NAMES: Record<string, string> = {
  THB: 'Thai Baht', USD: 'US Dollar', SGD: 'Singapore Dollar', CNY: 'Chinese Yuan', MYR: 'Malaysian Ringgit',
  EUR: 'Euro', JPY: 'Japanese Yen', KRW: 'South Korean Won', GBP: 'British Pound', AUD: 'Australian Dollar',
};

/** Illustrative figures only — the UI labels them "Sample" until VITE_RATES_URL is set. */
const SAMPLE: Array<[string, number, number, Trend, Trend, number[]]> = [
  ['THB', 128.0, 129.5, 'up', 'up', [126.2, 126.8, 127.1, 126.9, 127.6, 128.0]],
  ['USD', 4310, 4340, 'flat', 'up', [4290, 4300, 4296, 4305, 4310, 4310]],
  ['SGD', 3250, 3280, 'down', 'flat', [3275, 3270, 3262, 3258, 3254, 3250]],
  ['CNY', 595, 602, 'up', 'up', [588, 590, 589, 592, 594, 595]],
  ['MYR', 960, 975, 'flat', 'down', [958, 961, 960, 962, 960, 960]],
  ['EUR', 4680, 4730, 'up', 'up', [4620, 4635, 4650, 4648, 4670, 4680]],
  ['GBP', 5480, 5550, 'down', 'flat', [5530, 5520, 5510, 5500, 5492, 5480]],
  ['AUD', 2840, 2880, 'up', 'up', [2805, 2812, 2820, 2826, 2833, 2840]],
  ['JPY', 28.6, 29.2, 'flat', 'down', [28.7, 28.6, 28.7, 28.6, 28.6, 28.6]],
  ['KRW', 3.05, 3.15, 'up', 'flat', [3.0, 3.01, 3.02, 3.03, 3.04, 3.05]],
];

/** Demo only: nudge sample rates a little so the UI shows live movement. */
export function jiggle(rates: Rate[]): Rate[] {
  return rates.map((r) => {
    if (Math.random() < 0.45) return r;
    const step = r.buy * 0.0012 * (Math.random() < 0.5 ? -1 : 1);
    const dp = r.buy >= 1000 ? 0 : r.buy >= 10 ? 1 : 2;
    const round = (n: number) => Number(n.toFixed(dp));
    const buy = round(r.buy + step), sell = round(r.sell + step);
    const t: Trend = buy > r.buy ? 'up' : buy < r.buy ? 'down' : 'flat';
    return { ...r, buy, sell, buyTrend: t, sellTrend: t, history: [...r.history, buy].slice(-12) };
  });
}

export function sampleRates(): RatesResult {
  return {
    rates: SAMPLE.map(([code, buy, sell, buyTrend, sellTrend, history]) => ({
      code, name: NAMES[code] ?? code, buy, sell, buyTrend, sellTrend, history,
    })),
    updatedAt: new Date(),
    sample: true,
  };
}

/** Row shape of the Laravel `rates` table (buy/sell are stored as strings today). */
interface ApiRate {
  currency: string;
  country?: string;
  buy: string | number;
  sell: string | number;
  buy_status?: number;
  sell_status?: number;
  updated_at?: string;
}

// buy_status / sell_status: 1 = rate went up, 2 = went down, anything else = unchanged.
// Confirm this mapping against the admin panel before going live.
const trend = (s?: number): Trend => (s === 1 ? 'up' : s === 2 ? 'down' : 'flat');

export async function fetchRates(signal?: AbortSignal): Promise<RatesResult> {
  if (!RATES_URL) return sampleRates();
  const res = await fetch(RATES_URL, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Rates request failed: ${res.status}`);
  const body = await res.json();
  const rows: ApiRate[] = Array.isArray(body) ? body : body.data ?? [];
  const rates = rows.map((r) => {
    const code = r.currency.trim().toUpperCase();
    const buy = Number(r.buy), sell = Number(r.sell);
    return { code, name: NAMES[code] ?? r.country ?? code, buy, sell, buyTrend: trend(r.buy_status), sellTrend: trend(r.sell_status), history: [buy] };
  });
  const stamps = rows.map((r) => (r.updated_at ? Date.parse(r.updated_at) : 0)).filter(Boolean);
  return { rates, updatedAt: new Date(stamps.length ? Math.max(...stamps) : Date.now()), sample: false };
}

export const fmt = (n: number, max = 2) =>
  n.toLocaleString('en-US', { maximumFractionDigits: n >= 1000 ? 0 : max, minimumFractionDigits: n >= 1000 ? 0 : Math.min(1, max) });

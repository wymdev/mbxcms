/**
 * Business details shown on the site. Taken from the previous Mergui Boss website (legacy/index.html).
 * Leave a field empty ('') to hide it.
 */
export const site = {
  name: 'Mergui Boss',
  legalName: 'Mergui Boss Money Exchange',
  since: 2021,
  address: 'Phaya Thai, Bangkok 10400, Thailand',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Phaya+Thai+Bangkok+10400',
  email: 'info.mergui@gmail.com',
  phones: [
    { label: 'Thailand', number: '+66 66 023 9926', href: 'tel:+66660239926', app: 'Line' },
    { label: 'Myanmar', number: '+95 9 779 478 149', href: 'tel:+959779478149', app: 'Viber' },
  ],
  viber: 'viber://chat?number=%2B959779478149',
  facebook: '',
  hours: 'Service 24/7',
};

/**
 * Live rates endpoint (JSON array shaped like the `rates` table). Until the public API exists,
 * leave VITE_RATES_URL unset and the site shows clearly labelled sample rates.
 */
export const RATES_URL: string = import.meta.env.VITE_RATES_URL ?? '';

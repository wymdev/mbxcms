/**
 * Hero banner slides. Images live in public/images/banners as `<name>-2000.webp` and `<name>-1000.webp`
 * (20:11 ratio). To add a banner: export both sizes, add an entry here.
 */
export interface Banner {
  name: string;
  /** Describes the banner's message for screen readers (the banner text is baked into the image). */
  alt: string;
  /** Optional button shown on the slide. */
  cta?: { label: string; href: string };
}

export const banners: Banner[] = [
  { name: 'b1', alt: 'Mergui Boss: accurate and fast Thai to Myanmar money exchange', cta: { label: "Check today's rate", href: '#rates' } },
  { name: 'b2', alt: 'Mergui Boss: fast money exchange with no limit', cta: { label: 'Open the calculator', href: '#convert' } },
  { name: 'b3', alt: 'Mergui Boss: business owners are especially welcome', cta: { label: 'Talk to us', href: '#contact' } },
];

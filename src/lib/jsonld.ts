// Dati strutturati generati dagli stessi testi della pagina
import { t, routes, site, SITE_URL, type Lang, type PageKey } from '../i18n';

export function buildJsonLd(lang: Lang, pageKey: PageKey): object[] {
  const d = t(lang);
  const org = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${SITE_URL}/#org`,
    name: 'Comparte',
    url: SITE_URL + '/',
    logo: `${SITE_URL}/logo/comparte_logo_black.png`,
    foundingDate: '2018',
    taxID: site.cf,
    vatID: `IT${site.vat}`,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: 'Via G. G. Porro 8', postalCode: '00197', addressLocality: 'Roma', addressCountry: 'IT' },
    areaServed: [{ '@type': 'Place', name: 'Petén, Guatemala' }, { '@type': 'Place', name: 'La Habana, Cuba' }],
    sameAs: [site.social.instagram, site.social.facebook, site.social.linkedin],
  };
  const out: object[] = [org];
  if (pageKey === 'home' || pageKey === 'dona' || pageKey === 'cuba') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'DonateAction',
      recipient: { '@id': `${SITE_URL}/#org` },
      description: `${d.donate.bankTitle}: ${site.bank}, IBAN ${site.iban}`,
      url: SITE_URL + routes[lang].dona,
    });
  }
  if (pageKey === 'home' || pageKey === 'dona') {
    const items = pageKey === 'home' ? d.faq.items.slice(0, d.faq.homeCount) : d.faq.items;
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
    });
  }
  return out;
}

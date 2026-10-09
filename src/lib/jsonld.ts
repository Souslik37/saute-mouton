// Données structurées schema.org. Aucune note ni avis : on n'invente rien.
import { site, communes, chateauImage, type Chateau } from './data';
import { routes, withBase } from './i18n';
import { isPlaceholder } from './format';

const abs = (path: string) => new URL(path, site.url).toString();
const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => typeof v !== 'string' || !isPlaceholder(v)));

export const businessId = () => abs(withBase('/#business'));

export function localBusiness() {
  const a = site.legal.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': businessId(),
    name: site.name,
    description: site.fr.tagline,
    url: abs(withBase('/')),
    image: abs(withBase('/og-default.jpg')),
    ...clean({ telephone: site.contact.phoneE164, email: site.contact.email }),
    address: {
      '@type': 'PostalAddress',
      ...clean({ streetAddress: a.street }),
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressCountry: a.country,
    },
    areaServed: communes.map((c) => ({ '@type': 'City', name: c.name })),
    priceRange: '€€',
  };
}

export function product(c: Chateau, imageUrls: string[]) {
  const url = abs(routes().chateau(c.slug));
  const offer = (name: string, priceValue: number) => ({
    '@type': 'Offer',
    name,
    price: priceValue,
    priceCurrency: site.currency,
    availability: 'https://schema.org/InStock',
    businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
    url,
    seller: { '@id': businessId() },
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: c.fr.name,
    description: c.fr.description,
    image: imageUrls.map(abs),
    brand: { '@type': 'Brand', name: site.name },
    offers: [offer('Location à la journée', c.priceDay), offer('Location week-end', c.priceWeekend)],
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((i, n) => ({ '@type': 'ListItem', position: n + 1, name: i.name, item: abs(i.path) })),
  };
}

export { chateauImage };

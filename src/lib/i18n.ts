// Tout ce qui dépend de la langue passe par ici. Pour ajouter le néerlandais :
// 1. ajouter 'nl' dans astro.config.mjs (i18n.locales)
// 2. créer src/data/ui.nl.json et les blocs "nl" dans les autres JSON
// 3. compléter ROUTES ci-dessous avec les slugs néerlandais
import fr from '../data/ui.fr.json';

export const LOCALES = ['fr'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

const dictionaries = { fr } as const;
export const ui = (locale: Locale = DEFAULT_LOCALE) => dictionaries[locale];

/** Remplace {cle} par les valeurs fournies. */
export function tpl(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Préfixe un chemin absolu avec le sous-dossier d'hébergement (ex. /saute-mouton). */
export const withBase = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

const ROUTES = {
  fr: {
    home: withBase('/'),
    chateaux: withBase('/chateaux/'),
    chateau: (slug: string) => withBase(`/chateaux/${slug}/`),
    commune: (slug: string) => withBase(`/location-chateau-gonflable-${slug}/`),
    reserver: withBase('/reserver/'),
    merci: withBase('/merci/'),
    about: withBase('/a-propos/'),
    faq: withBase('/faq/'),
    conditions: withBase('/conditions-de-location/'),
    mentions: withBase('/mentions-legales/'),
    confidentialite: withBase('/confidentialite/'),
  },
} as const;

export const routes = (locale: Locale = DEFAULT_LOCALE) => ROUTES[locale];

// Point d'entrée unique vers src/data/. Chaque fichier est validé au build :
// un champ manquant ou mal typé fait échouer `npm run build` avec un message clair.
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import siteRaw from '../data/site.json';
import chateauxRaw from '../data/chateaux.json';
import communesRaw from '../data/communes.json';
import faqRaw from '../data/faq.json';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : AAAA-MM-JJ');
const slug = z.string().regex(/^[a-z0-9-]+$/, 'Slug : minuscules, chiffres et tirets uniquement');

const siteSchema = z.object({
  name: z.string(),
  url: z.url(),
  basePath: z.string().regex(/^(\/[a-z0-9-]+)?$/, 'basePath : "" ou "/sous-dossier"'),
  demo: z.boolean(),
  baseCity: z.string(),
  currency: z.string(),
  deliveryFee: z.number(),
  owner: z.object({ firstName: z.string(), fullName: z.string(), photo: z.string() }),
  contact: z.object({
    phoneDisplay: z.string(),
    phoneE164: z.string(),
    whatsappE164: z.string(),
    email: z.string(),
  }),
  legal: z.object({
    companyName: z.string(),
    bce: z.string(),
    vat: z.string(),
    address: z.object({ street: z.string(), postalCode: z.string(), city: z.string(), country: z.string() }),
  }),
  fr: z.object({
    tagline: z.string(),
    demoNotice: z.string(),
    promise: z.array(z.object({ title: z.string(), text: z.string() })),
    steps: z.array(z.object({ title: z.string(), text: z.string() })).length(3),
    deliveryNote: z.string(),
    weekendNote: z.string(),
    priceNote: z.string(),
  }),
});

const chateauText = z.object({
  name: z.string(),
  short: z.string(),
  description: z.string(),
  idealFor: z.array(z.string()),
  included: z.array(z.string()),
  imageAlts: z.array(z.string()),
});

const chateauSchema = z
  .object({
    slug,
    order: z.number(),
    dimensions: z.object({ length: z.number(), width: z.number(), height: z.number() }),
    spaceRequired: z.object({ length: z.number(), width: z.number() }),
    ageMin: z.number(),
    ageMax: z.number(),
    capacity: z.number(),
    maxUserHeightCm: z.number().optional(),
    priceDay: z.number(),
    priceWeekend: z.number(),
    power: z.string(),
    certification: z.string(),
    images: z.array(z.string()).min(1),
    unavailable: z.array(isoDate),
    fr: chateauText,
  })
  .refine((c) => c.fr.imageAlts.length === c.images.length, {
    message: 'Il faut un texte alternatif (imageAlts) par image',
  });

const communeSchema = z.object({
  slug,
  name: z.string(),
  postalCode: z.string(),
  region: z.string(),
  nearby: z.array(slug),
  fr: z.object({ metaDescription: z.string().max(170), intro: z.string(), tip: z.string() }),
});

const faqSchema = z.object({
  id: z.string(),
  home: z.boolean(),
  fr: z.object({ q: z.string(), a: z.string() }),
});

function parse<T extends z.ZodType>(name: string, schema: T, data: unknown): z.infer<T> {
  const r = schema.safeParse(data);
  if (!r.success) {
    throw new Error(`Données invalides dans src/data/${name} :\n${z.prettifyError(r.error)}`);
  }
  return r.data;
}

export const site = parse('site.json', siteSchema, siteRaw);
export const chateaux = parse('chateaux.json', z.array(chateauSchema), chateauxRaw).sort(
  (a, b) => a.order - b.order,
);
export const communes = parse('communes.json', z.array(communeSchema), communesRaw);
export const faq = parse('faq.json', z.array(faqSchema), faqRaw);

export type Chateau = (typeof chateaux)[number];
export type Commune = (typeof communes)[number];

// Vérifications croisées
for (const c of communes) {
  for (const n of c.nearby) {
    if (!communes.some((x) => x.slug === n)) {
      throw new Error(`communes.json : « ${c.slug} » référence une commune voisine inconnue « ${n} »`);
    }
  }
}

// Images : résolues depuis src/assets/ pour être optimisées (AVIF/WebP) au build
const assetFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export function asset(path: string): ImageMetadata {
  const mod = assetFiles[`../assets/${path}`];
  if (!mod) throw new Error(`Image introuvable : src/assets/${path}`);
  return mod.default;
}

export const chateauImage = (path: string) => asset(`chateaux/${path}`);
for (const c of chateaux) c.images.forEach(chateauImage);

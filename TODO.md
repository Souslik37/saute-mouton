# TODO : informations à compléter

Tout ce qui apparaît sur le site entre [CROCHETS] et surligné en jaune est listé ici.
`npm run todo` (lancé aussi à chaque `npm run build`) vérifie qu'aucun placeholder n'est oublié.

> ⚠️ **Site de démonstration.** Les 3 châteaux (noms, dimensions, prix, dates bloquées),
> les illustrations et les textes par commune sont **fictifs**. Avant la mise en ligne réelle :
> remplacer les données de `src/data/chateaux.json`, les images de `src/assets/`,
> relire `src/data/communes.json`, puis passer `"demo": false` dans `src/data/site.json`.

## 1. Identité et contact (`src/data/site.json`)

- [ ] [TÉLÉPHONE] : numéro affiché (ex. `0470 12 34 56`) → `contact.phoneDisplay`
- [ ] Numéro au format international pour le lien d'appel et le schema.org (ex. `+32470123456`) → `contact.phoneE164` (vide pour l'instant)
- [ ] Numéro WhatsApp au format international → `contact.whatsappE164` (vide pour l'instant : le bouton ouvre WhatsApp sans destinataire)
- [ ] [E-MAIL] : adresse de contact → `contact.email` (+ mentions légales, confidentialité)
- [ ] [NOM COMPLET DE L'EXPLOITANT] → `owner.fullName` (+ mentions légales)
- [ ] [DÉNOMINATION OU NOM DE L'INDÉPENDANT] → `legal.companyName` (+ mentions légales, confidentialité)
- [ ] [N° BCE] → `legal.bce` (+ mentions légales)
- [ ] [N° TVA OU MENTION FRANCHISE] → `legal.vat` (+ mentions légales)
- [ ] [RUE ET NUMÉRO] → `legal.address.street` (+ mentions légales, confidentialité)
- [ ] URL définitive du site → `url` + `basePath` (actuellement GitHub Pages : `https://souslik37.github.io` + `/saute-mouton`)

## 2. Page À propos (`src/data/ui.fr.json` → `pages.about`)

- [ ] [PHOTO D'ALEX] : remplacer `src/assets/site/alex.jpg` (format carré conseillé, ≥ 900 px) et retirer le placeholder du texte alternatif `photoAlt`
- [ ] [POURQUOI CE PROJET : 2 à 4 phrases écrites par Alex, à la première personne.]
- [ ] [CE QUI DIFFÉRENCIE SAUTE-MOUTON SELON ALEX : par exemple le fait d'être un seul interlocuteur, du début à la fin.]

## 3. FAQ (`src/data/faq.json`)

- [ ] [DURÉE D'INSTALLATION, ex. 30 à 45 minutes selon le château]
- [ ] [MODALITÉS DE PAIEMENT : acompte, virement, paiement le jour J…]
- [ ] [INFORMATIONS SUR L'ASSURANCE RESPONSABILITÉ CIVILE DE L'EXPLOITANT]

## 4. Conditions de location (`src/data/pages/conditions-de-location.fr.md`)

À faire relire par un professionnel (juriste, assureur) avant la mise en ligne réelle.

- [ ] [ET, LE CAS ÉCHÉANT, À LA RÉCEPTION DE L'ACOMPTE]
- [ ] [HORAIRES DE LA FORMULE JOURNÉE]
- [ ] [HORAIRES DE LIVRAISON ET DE REPRISE]
- [ ] [MODALITÉS DE PAIEMENT]
- [ ] [CONSÉQUENCE FINANCIÈRE DANS CE CAS]
- [ ] [POLITIQUE PLUIE : report sans frais, avoir, remboursement partiel…]
- [ ] [VITESSE DE VENT MAXIMALE, selon la notice du fabricant]
- [ ] [POLITIQUE VENT : report sans frais, remboursement…]
- [ ] [MONTANT DE LA CAUTION ET MODALITÉS : forme (virement, espèces), moment du versement, délai de restitution, cas de retenue]
- [ ] [CONDITIONS D'ANNULATION PAR LE CLIENT : délais et éventuels frais]
- [ ] [CLAUSE DE RESPONSABILITÉ ET D'ASSURANCE : à faire relire par un professionnel]
- [ ] [TRIBUNAUX COMPÉTENTS]
- [ ] [DATE DE MISE À JOUR] (aussi dans la politique de confidentialité)

## 5. Confidentialité (`src/data/pages/confidentialite.fr.md`)

- [ ] [DURÉE DE CONSERVATION : par exemple, demandes sans suite supprimées après X mois, données de facturation conservées 7 ans conformément à la loi]

## 6. Avant la mise en ligne réelle

- [ ] Vraies photos des châteaux dans `src/assets/chateaux/<slug>/` (≥ 1600 px de large, JPG ou PNG : la conversion AVIF/WebP est automatique)
- [ ] Vérifier les certificats EN 14960 de chaque château
- [ ] Relire les 10 textes de `src/data/communes.json` (rédigés comme brouillons)
- [ ] Image de partage `public/og-default.jpg` (1200 × 630 px)
- [ ] Passer sur Netlify (ou brancher un service de formulaire) pour recevoir les demandes : sur GitHub Pages l'envoi est seulement simulé
- [ ] Passer `"demo": false` dans `src/data/site.json` pour retirer le bandeau « site de démonstration »
- [ ] Supprimer `scripts/generate-demo-images.mjs` et la commande `images:demo` de `package.json`

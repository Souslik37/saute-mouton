# Saute-Mouton : site vitrine

Site 100 % statique (Astro + Tailwind + TypeScript), déployé sur Netlify.
**Tout le contenu se modifie dans `src/data/`**, sans toucher aux composants.

> Version actuelle = **démonstration** (châteaux, prix et illustrations fictifs).
> Les informations à compléter sont listées dans [TODO.md](TODO.md).

## Démarrer en local

Prérequis : Node.js 22 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:4321, rechargement automatique
npm run build      # vérification des types + build + contrôle des [PLACEHOLDERS]
npm run preview    # sert le dossier dist/ tel qu'il sera en ligne
```

Si un fichier de `src/data/` contient une erreur (champ manquant, date mal écrite, image
introuvable), `npm run build` s'arrête et indique précisément le fichier et le champ.

## Où est quoi

| Fichier | Contenu |
|---|---|
| `src/data/site.json` | Nom, contact, n° BCE, adresse, frais de livraison, promesse, étapes |
| `src/data/chateaux.json` | Châteaux : dimensions, prix, âge, inclus, photos, **dates bloquées** |
| `src/data/communes.json` | Une entrée par commune desservie = une page `/location-chateau-gonflable-<commune>/` |
| `src/data/faq.json` | Questions/réponses (`"home": true` = affichée aussi sur l'accueil) |
| `src/data/ui.fr.json` | Libellés de l'interface, titres et descriptions SEO de chaque page, texte « À propos » |
| `src/data/pages/*.fr.md` | Conditions de location, mentions légales, confidentialité (Markdown) |
| `src/assets/chateaux/<slug>/` | Photos des châteaux (converties automatiquement en AVIF/WebP) |

Un texte entre `[CROCHETS EN MAJUSCULES]` est un placeholder : il s'affiche surligné en
jaune sur le site, et doit figurer dans `TODO.md` (sinon le build échoue).

---

## Ajouter un château

1. Créez le dossier `src/assets/chateaux/mon-chateau/` et déposez-y les photos
   (`1.jpg`, `2.jpg`…, au moins 1600 px de large, JPG ou PNG).
2. Ajoutez une entrée dans `src/data/chateaux.json` (copiez un château existant) :

```json
{
  "slug": "mon-chateau",
  "order": 4,
  "dimensions": { "length": 4, "width": 4, "height": 3 },
  "spaceRequired": { "length": 5.5, "width": 5.5 },
  "ageMin": 3,
  "ageMax": 8,
  "capacity": 6,
  "maxUserHeightCm": 140,
  "priceDay": 130,
  "priceWeekend": 195,
  "power": "1 souffleur 230 V – 1 prise standard",
  "certification": "EN 14960",
  "images": ["mon-chateau/1.jpg", "mon-chateau/2.jpg"],
  "unavailable": [],
  "fr": {
    "name": "Mon Château",
    "short": "Une phrase pour la carte.",
    "description": "Deux ou trois phrases pour la fiche.",
    "idealFor": ["Anniversaires", "Écoles"],
    "included": ["Souffleur électrique", "Bâche de protection au sol", "Livraison, installation et reprise"],
    "imageAlts": ["Description de la photo 1", "Description de la photo 2"]
  }
}
```

- `slug` : l'adresse de la fiche (`/chateaux/mon-chateau/`), en minuscules et tirets.
- `order` : position dans les listes.
- `imageAlts` : une description par photo, dans le même ordre (accessibilité ; obligatoire).
- Prix en euros TVAC, dimensions en mètres.

La fiche, la carte sur l'accueil et les pages communes, le menu du formulaire, le
schema.org Product/Offer et le sitemap sont générés automatiquement.

## Bloquer une date

Dans `src/data/chateaux.json`, ajoutez la date (format `AAAA-MM-JJ`) au tableau
`unavailable` du château concerné :

```json
"unavailable": ["2026-10-10", "2026-10-17", "2026-11-14"]
```

- **Formule journée** : la date exacte est refusée par le formulaire.
- **Formule week-end** : le formulaire refuse le week-end si une seule des dates du vendredi au
  lundi est bloquée. Pour bloquer un week-end entier, ajoutez les 4 dates.
- Les dates passées sont ignorées : vous pouvez les laisser ou les nettoyer de temps en temps.

Enregistrez, puis `git commit` + `git push` : Netlify reconstruit le site en environ 1 minute.
Depuis le site GitHub, on peut aussi modifier le fichier directement dans le navigateur
(icône crayon), ce qui déclenche le même redéploiement.

⚠️ Le site étant statique, les disponibilités ne sont à jour qu'après le redéploiement.
C'est pourquoi le site parle de « demande », confirmée par Alex sous 24 h.

## Ajouter une commune

Ajoutez une entrée dans `src/data/communes.json` avec un `slug`, un `postalCode`, la liste
des communes voisines (`nearby`) et surtout un **texte `intro` unique** (pas de copier-coller
d'une autre commune : Google pénalise le contenu dupliqué). `metaDescription` : 170 caractères maximum.

---

## Déployer sur GitHub Pages (version démo actuelle)

Le site est publié sur `https://souslik37.github.io/saute-mouton/` par le workflow
`.github/workflows/deploy.yml`, à chaque `git push` sur `main`.

1. Créez le repo **public** `saute-mouton` sur github.com (sans README, .gitignore ni licence).
2. Poussez le projet :
   ```bash
   git remote add origin https://github.com/Souslik37/saute-mouton.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : GitHub Actions** (une seule fois).
   Si le premier déploiement a échoué avant ce réglage, relancez-le dans l'onglet **Actions**.

Limites de GitHub Pages :
- **Le formulaire n'est pas reçu** (GitHub Pages n'a pas de traitement de formulaires). Tant que
  `"demo": true`, l'envoi est simulé et redirige vers la page « Merci ».
- Le site vit dans un sous-dossier : `basePath` vaut `"/saute-mouton"` dans `src/data/site.json`.
  Avec un vrai nom de domaine, mettez `"basePath": ""`.
- `robots.txt` n'est lu par les moteurs de recherche qu'à la racine d'un domaine : il ne sert
  vraiment qu'avec un domaine propre.

## Déployer sur Netlify (pour la vraie mise en ligne, avec formulaire)

1. Créez un dépôt sur GitHub et poussez le projet :
   ```bash
   git remote add origin git@github.com:<compte>/saute-mouton.git
   git push -u origin main
   ```
2. Sur [app.netlify.com](https://app.netlify.com) : **Add new site → Import an existing project →
   GitHub**, puis choisissez le dépôt. Les réglages sont lus dans `netlify.toml` (commande
   `npm run build`, dossier `dist`, Node 22) : rien à modifier.
3. **Formulaire** : Netlify détecte automatiquement le formulaire « reservation » au premier
   déploiement. Allez dans **Site configuration → Forms → Form notifications → Add notification →
   Email notification** et indiquez l'adresse qui doit recevoir les demandes.
   Les envois sont aussi consultables dans l'onglet **Forms**. (Plan gratuit : 100 envois par mois.)
4. Dans `src/data/site.json` : `url` = l'adresse Netlify (ex. `https://saute-mouton.netlify.app`)
   ou votre nom de domaine, `basePath` = `""`, et `demo` = `false` pour que le formulaire
   soit réellement envoyé.

Chaque `git push` sur `main` redéploie le site.

## Brancher le nom de domaine

1. Achetez le domaine (ex. `saute-mouton.be`) chez un registrar (OVHcloud, Combell, Gandi…).
2. Netlify : **Domain management → Add a domain** → saisissez `saute-mouton.be`.
3. Chez le registrar, deux options :
   - **Recommandé** : remplacez les serveurs DNS (nameservers) par ceux indiqués par Netlify
     (`dns1.p0X.nsone.net`…). Netlify gère alors tout, y compris `www`.
   - **Sinon** : créez un enregistrement `A` pour `saute-mouton.be` vers l'IP du load balancer Netlify
     affichée dans l'interface, et un `CNAME` `www` → `<votre-site>.netlify.app`.
4. Attendez la propagation DNS (de quelques minutes à 24 h). Netlify active ensuite le HTTPS
   (Let's Encrypt) automatiquement.
5. Mettez `"url": "https://saute-mouton.be"` et `"basePath": ""` dans `src/data/site.json` puis redéployez : le sitemap,
   les balises canonical, Open Graph et le schema.org utiliseront la bonne adresse.
6. Déclarez le site dans [Google Search Console](https://search.google.com/search-console)
   et soumettez `https://saute-mouton.be/sitemap-index.xml`.

---

## Version néerlandaise (préparée, non activée)

- `astro.config.mjs` : ajouter `'nl'` à `i18n.locales`.
- `src/lib/i18n.ts` : ajouter `nl` dans `LOCALES`, le dictionnaire et la table `ROUTES`
  (ex. `/nl/springkasteel-huren-<gemeente>/`).
- Créer `src/data/ui.nl.json` (copie traduite de `ui.fr.json`) et ajouter un bloc `"nl": {…}` à
  côté de chaque bloc `"fr"` dans les JSON.
- Créer les pages sous `src/pages/nl/` en réutilisant les composants avec `locale="nl"`.

## Choix techniques

- **Zéro cookie, zéro service tiers** : la police (Nunito) est hébergée avec le site, pas de Google
  Fonts, pas de carte, ni de mesure d'audience. Le bouton WhatsApp est un simple lien `wa.me`.
- **JavaScript minimal** : uniquement sur `/reserver/` (blocage des dates, récapitulatif des erreurs,
  pré-remplissage WhatsApp). Sans JavaScript, le formulaire fonctionne avec la validation native.
- **Anti-spam** : champ piège (honeypot) Netlify, sans reCAPTCHA (qui déposerait des cookies).
- **SEO** : title et description uniques par page, JSON-LD LocalBusiness (toutes les pages),
  Product/Offer (fiches), FAQPage (`/faq/`), BreadcrumbList, sitemap, robots.txt.
  `/mentions-legales/` et `/merci/` sont en `noindex` et exclues du sitemap.
- **Aucune note ni avis** dans le schema.org : à ajouter seulement avec de vrais avis clients.
- **Images de démonstration** : générées par `npm run images:demo` (à supprimer avec les vraies photos).

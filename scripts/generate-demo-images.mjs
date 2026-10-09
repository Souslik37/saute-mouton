// Génère les illustrations de démonstration (châteaux fictifs, univers prairie + moutons).
// À supprimer quand les vraies photos seront disponibles : remplacer les fichiers
// de src/assets/ en gardant les mêmes noms.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets');
const INK = '#102a1c';
const G1 = '#1d7a3e'; // vert herbe
const G2 = '#8bd17c'; // herbe claire
const W = '#ffffff';

const sheep = (x, y, s = 1, flip = false) => `
<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
  <rect x="-28" y="28" width="9" height="34" rx="4.5" fill="${INK}"/>
  <rect x="18" y="28" width="9" height="34" rx="4.5" fill="${INK}"/>
  <path d="M-50 30c-20 0-25-22-9-30-6-20 16-32 29-21 6-16 32-17 40-1 13-11 35-3 33 14 18 3 19 29 2 33 3 16-17 24-27 14-8 11-29 11-35 0-13 10-33 3-33-9z" fill="${W}" stroke="${INK}" stroke-width="5"/>
  <ellipse cx="62" cy="-4" rx="20" ry="25" fill="${INK}"/>
  <ellipse cx="45" cy="-18" rx="12" ry="6" fill="${INK}" transform="rotate(-25 45 -18)"/>
  <circle cx="68" cy="-10" r="4" fill="${W}"/>
</g>`;

const scene = (inner, { sky = '#e9f6fb', hill = '#b8e3a8', ground = G2, sheepAt = [] } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <rect width="1600" height="1200" fill="${sky}"/>
  <circle cx="1360" cy="200" r="85" fill="#ffe27a"/>
  <g fill="${W}">
    <ellipse cx="290" cy="190" rx="130" ry="42"/><ellipse cx="370" cy="165" rx="90" ry="50"/>
    <ellipse cx="980" cy="130" rx="110" ry="36"/><ellipse cx="1040" cy="112" rx="72" ry="40"/>
  </g>
  <path d="M0 820 Q400 700 800 800 T1600 760 V1200 H0z" fill="${hill}"/>
  <path d="M0 900 Q400 860 800 900 T1600 880 V1200 H0z" fill="${ground}"/>
  <ellipse cx="800" cy="960" rx="640" ry="50" fill="${INK}" opacity=".12"/>
  ${inner}
  ${sheepAt.map(([x, y, s, f]) => sheep(x, y, s * 2.2, f)).join('')}
</svg>`;

// Tour « laineuse » : corps blanc, sommet en nuage de laine
const tower = (x, y, w, h, body = W, trim = G1) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2.2}" fill="${body}" stroke="${trim}" stroke-width="10"/>
  <g fill="${W}" stroke="${trim}" stroke-width="8">
    <circle cx="${x + w * 0.2}" cy="${y + 10}" r="${w * 0.32}"/>
    <circle cx="${x + w * 0.8}" cy="${y + 10}" r="${w * 0.32}"/>
    <circle cx="${x + w / 2}" cy="${y - 18}" r="${w * 0.38}"/>
  </g>`;

// Château 1 : Petit Pré (filets, bas)
const petitPre = (side = false) => `<g transform="translate(${side ? 160 : 0} ${side ? 90 : 0}) scale(${side ? 0.85 : 1})">
  <rect x="360" y="760" width="880" height="160" rx="60" fill="${G1}"/>
  <rect x="420" y="500" width="760" height="280" rx="30" fill="${W}" opacity=".55"/>
  <g stroke="${G1}" stroke-width="9" opacity=".75">
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${470 + i * 80}" y1="505" x2="${470 + i * 80}" y2="770"/>`).join('')}
    <line x1="420" y1="600" x2="1180" y2="600"/><line x1="420" y1="690" x2="1180" y2="690"/>
  </g>
  <rect x="400" y="450" width="800" height="70" rx="35" fill="${W}" stroke="${G1}" stroke-width="10"/>
  ${tower(300, 420, 150, 500)}
  ${tower(1150, 420, 150, 500)}
  <rect x="690" y="815" width="220" height="70" rx="30" fill="${W}"/>
</g>`;

// Château 2 : Bergerie (toboggan, toit en nuage)
const bergerie = (front = false) => `<g transform="translate(${front ? 60 : 0} 0)">
  <rect x="260" y="760" width="900" height="160" rx="60" fill="${G1}"/>
  <rect x="320" y="440" width="780" height="340" rx="40" fill="${W}" opacity=".5"/>
  <rect x="300" y="380" width="820" height="90" rx="45" fill="${W}" stroke="${G1}" stroke-width="10"/>
  <g fill="${W}" stroke="${G1}" stroke-width="8">
    ${Array.from({ length: 6 }, (_, i) => `<circle cx="${400 + i * 125}" cy="370" r="48"/>`).join('')}
  </g>
  ${tower(200, 300, 160, 620)}
  ${tower(1060, 300, 160, 620)}
  <path d="M1160 430 L1500 880 L1380 920 L1120 570 Z" fill="${G2}" stroke="${G1}" stroke-width="10"/>
  <g fill="${G1}" opacity=".85">
    <ellipse cx="560" cy="640" rx="60" ry="115"/><ellipse cx="860" cy="640" rx="60" ry="115"/>
  </g>
</g>`;

// Château 3 : Grand Troupeau (parcours long)
const troupeau = () => `<g>
  <rect x="80" y="780" width="1440" height="140" rx="55" fill="${G1}"/>
  ${tower(80, 540, 120, 380)}
  <g fill="${W}" stroke="${G1}" stroke-width="9">
    ${Array.from({ length: 5 }, (_, i) => `<rect x="${280 + i * 170}" y="${600 - (i % 2) * 40}" width="80" height="${190 + (i % 2) * 40}" rx="40"/>`).join('')}
  </g>
  <rect x="1100" y="440" width="160" height="350" rx="30" fill="${W}" stroke="${G1}" stroke-width="10"/>
  <g fill="${G1}">${Array.from({ length: 5 }, (_, i) => `<circle cx="${1145 + (i % 2) * 70}" cy="${490 + i * 58}" r="14"/>`).join('')}</g>
  <path d="M1250 450 L1520 860 L1420 900 L1250 610 Z" fill="${G2}" stroke="${G1}" stroke-width="10"/>
</g>`;

const portrait = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <rect width="1200" height="1200" fill="#e3f3dc"/>
  <circle cx="600" cy="470" r="200" fill="${G2}"/>
  <path d="M250 1200 Q250 800 600 800 Q950 800 950 1200 Z" fill="${G2}"/>
  <text x="600" y="1080" font-family="Arial, sans-serif" font-size="64" font-weight="700" text-anchor="middle" fill="${INK}">[PHOTO D'ALEX]</text>
</svg>`;

const og = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${W}"/>
  <path d="M0 520 Q300 470 600 520 T1200 500 V630 H0z" fill="${G2}"/>
  <g transform="translate(700 60) scale(.36)">${bergerie()}</g>
  ${sheep(170, 470, 0.9)}
  <text x="70" y="220" font-family="Arial, sans-serif" font-size="80" font-weight="800" fill="${INK}">Saute-Mouton</text>
  <text x="70" y="295" font-family="Arial, sans-serif" font-size="36" fill="${INK}">Châteaux gonflables livrés,</text>
  <text x="70" y="345" font-family="Arial, sans-serif" font-size="36" fill="${INK}">installés et repris</text>
</svg>`;

const files = {
  'chateaux/petit-pre/1.jpg': scene(petitPre(), { sheepAt: [[1400, 1010, 0.9, true]] }),
  'chateaux/petit-pre/2.jpg': scene(petitPre(true), { sky: '#f1f8ec', sheepAt: [[230, 1020, 0.8]] }),
  'chateaux/bergerie/1.jpg': scene(bergerie(), { sheepAt: [[190, 1030, 0.8]] }),
  'chateaux/bergerie/2.jpg': scene(bergerie(true), { sky: '#f1f8ec', hill: '#a9dc98' }),
  'chateaux/grand-troupeau/1.jpg': scene(troupeau(), { sheepAt: [[1430, 1060, 0.7, true]] }),
  'chateaux/grand-troupeau/2.jpg': scene(troupeau(), { sky: '#eef3f6', ground: '#c9ccc6', hill: '#dfe3dc' }),
  'site/hero.jpg': scene(bergerie(), { sky: '#eef8f2', sheepAt: [[1400, 1040, 0.8, true]] }),
  'site/alex.jpg': portrait(),
};

for (const [rel, svg] of Object.entries(files)) {
  const out = join(root, rel);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(out);
  console.log('✓', rel);
}

const ogOut = join(root, '..', '..', 'public', 'og-default.jpg');
await sharp(Buffer.from(og())).jpeg({ quality: 85 }).toFile(ogOut);
console.log('✓ public/og-default.jpg');

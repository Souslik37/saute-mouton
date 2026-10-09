// Liste tous les [PLACEHOLDERS] de src/data/ et vérifie qu'ils figurent dans TODO.md.
// Lancé automatiquement à la fin de `npm run build` ; utilisable seul : `npm run todo`.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dataDir = join(root, 'src', 'data');
const RE = /\[(?=[A-ZÀ-ÖØ-Þ])[^\]\n"]{2,}\](?!\()/g; // ignore les liens Markdown [texte](url)

const files = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });

const found = new Map();
for (const f of files(dataDir)) {
  for (const m of readFileSync(f, 'utf8').matchAll(RE)) {
    const key = m[0];
    if (!found.has(key)) found.set(key, new Set());
    found.get(key).add(relative(root, f));
  }
}

const todo = readFileSync(join(root, 'TODO.md'), 'utf8');
const missing = [...found.keys()].filter((k) => !todo.includes(k));

console.log(`\n${found.size} placeholder(s) restant(s) dans src/data/ :`);
for (const [k, where] of found) console.log(`  ${k}  ← ${[...where].join(', ')}`);

if (missing.length) {
  console.error(`\n✗ ${missing.length} placeholder(s) absent(s) de TODO.md :`);
  missing.forEach((m) => console.error(`  ${m}`));
  process.exit(1);
}
console.log('\n✓ Tous les placeholders sont listés dans TODO.md');

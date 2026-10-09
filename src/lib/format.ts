const PH = /\[(?=[A-ZÀ-ÖØ-Þ])[^\]\n<>]{2,}\]/g;

export const isPlaceholder = (s: string) => /^\[.*\]$/.test(s.trim()) || s.trim() === '';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Texte → HTML sûr, avec les [PLACEHOLDERS] surlignés. À utiliser avec set:html. */
export const rich = (s: string) => markPlaceholders(escape(s));

/** Surligne les [PLACEHOLDERS] dans du HTML déjà rendu (ex. pages Markdown). */
export const markPlaceholders = (html: string) => html.replace(PH, (m) => `<mark class="ph">${m}</mark>`);

const nf = new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 1 });
export const num = (n: number) => nf.format(n);
export const price = (n: number) => `${nf.format(n)} €`;
export const dims = (d: { length: number; width: number; height?: number }) =>
  [d.length, d.width, d.height].filter((x) => x !== undefined).map((x) => nf.format(x!)).join(' × ') + ' m';

const df = new Intl.DateTimeFormat('fr-BE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const longDate = (iso: string) => df.format(new Date(`${iso}T00:00:00Z`));

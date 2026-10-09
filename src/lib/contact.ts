import { site } from './data';

/** Lien wa.me. Si le numéro n'est pas encore renseigné, ouvre WhatsApp sans destinataire. */
export function whatsappUrl(text: string) {
  const n = site.contact.whatsappE164.replace(/\D/g, '');
  const base = n ? `https://wa.me/${n}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}

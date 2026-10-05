// The business's real WhatsApp contact number, used for direct-contact CTAs on
// the public site (landing, quiz, audit). wa.me requires digits only — no "+",
// no spaces. +31 6 185 54595 -> 31618554595.
export const WHATSAPP_NUMBER = '31618554595'

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

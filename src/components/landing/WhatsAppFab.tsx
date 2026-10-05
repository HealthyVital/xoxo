import { MessageCircle } from 'lucide-react'
import { buildWhatsAppLink } from '@/lib/contact'
import { trackEvent } from '@/lib/analytics'

/** Floating WhatsApp contact button for the public site (landing, quiz, audit). */
export function WhatsAppFab({
  message = "Hi! I'd like to know more about your content packages.",
  source,
}: {
  message?: string
  source: string
}) {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent('cta_click', { cta: 'whatsapp_fab', source })}
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  )
}

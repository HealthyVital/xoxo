import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, description, children, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div
        className={cn(
          'w-full rounded-2xl bg-[var(--color-surface)] shadow-xl',
          wide ? 'max-w-3xl' : 'max-w-lg',
        )}
      >
        <div className="flex items-start justify-between border-b border-[var(--color-hairline)] p-5">
          <div>
            <h2 className="text-base font-semibold text-[var(--color-ink)]">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-[var(--color-ink-secondary)]">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { PlugZap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-ink)]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-secondary)]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-sm font-semibold text-[var(--color-ink)]', className)}>{children}</h2>
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-hairline)] px-6 py-12 text-center">
      {icon && <div className="mb-2 text-[var(--color-ink-muted)]">{icon}</div>}
      <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-[var(--color-ink-secondary)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function NotConnectedNotice({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-dashed border-[var(--color-hairline)] bg-[var(--color-plane)] px-3 py-2 text-xs text-[var(--color-ink-secondary)]">
      <PlugZap size={14} className="shrink-0 text-[var(--color-ink-muted)]" />
      <span>
        <strong className="font-medium text-[var(--color-ink)]">{label}</strong> — Demo / Not Connected. This will
        call a real integration once credentials are added.
      </span>
    </div>
  )
}

export function DemoDataBanner() {
  return (
    <div className="mb-4 rounded-lg border border-[var(--color-series-7)]/25 bg-[var(--color-series-7)]/5 px-3 py-2 text-xs text-[var(--color-series-7)]">
      This view includes clearly-labeled illustrative demo data used to show how the product works. It is not a
      claim about real client results.
    </div>
  )
}

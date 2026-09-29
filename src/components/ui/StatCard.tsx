import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from './Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  icon?: LucideIcon
  delta?: { value: string; direction: 'up' | 'down'; good?: boolean }
  hint?: string
  className?: string
}

export function StatCard({ label, value, icon: Icon, delta, hint, className }: StatCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-[var(--color-ink-secondary)]">{label}</p>
        {Icon && (
          <div className="rounded-lg bg-[var(--color-brand-soft)] p-1.5 text-[var(--color-brand-strong)]">
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="tabular-nums mt-2 text-2xl font-semibold text-[var(--color-ink)]">{value}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              delta.good === false
                ? 'text-[var(--color-critical)]'
                : delta.direction === 'up'
                  ? 'text-[var(--color-good)]'
                  : 'text-[var(--color-critical)]',
            )}
          >
            {delta.direction === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta.value}
          </span>
        )}
        {hint && <span className="text-xs text-[var(--color-ink-muted)]">{hint}</span>}
      </div>
    </Card>
  )
}

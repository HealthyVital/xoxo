import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type BadgeTone = 'neutral' | 'brand' | 'good' | 'warning' | 'critical' | 'demo'

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--color-plane)] text-[var(--color-ink-secondary)] border-[var(--color-hairline)]',
  brand: 'bg-[var(--color-brand-soft)] text-[var(--color-brand-strong)] border-transparent',
  good: 'bg-[color-mix(in_oklab,var(--color-good)_14%,white)] text-[var(--color-good)] border-transparent',
  warning: 'bg-[color-mix(in_oklab,var(--color-warning)_20%,white)] text-[#8a5a00] border-transparent',
  critical: 'bg-[color-mix(in_oklab,var(--color-critical)_12%,white)] text-[var(--color-critical)] border-transparent',
  demo: 'bg-[var(--color-series-7)]/10 text-[var(--color-series-7)] border-[var(--color-series-7)]/20',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Badge tone="demo" className={cn('uppercase tracking-wide', className)} title="Illustrative demo data, not a real business or result">
      Demo
    </Badge>
  )
}

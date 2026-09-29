import { scoreLabel } from '@/lib/leadScoring'
import { cn } from '@/lib/utils'

export function LeadScoreBadge({ score, className }: { score: number; className?: string }) {
  const { label, tone } = scoreLabel(score)
  const toneClass =
    tone === 'good'
      ? 'bg-[color-mix(in_oklab,var(--color-good)_14%,white)] text-[var(--color-good)]'
      : tone === 'warning'
        ? 'bg-[color-mix(in_oklab,var(--color-warning)_20%,white)] text-[#8a5a00]'
        : 'bg-[var(--color-plane)] text-[var(--color-ink-muted)]'
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium', toneClass, className)}>
      <span className="tabular-nums font-semibold">{score}</span>
      {label}
    </span>
  )
}

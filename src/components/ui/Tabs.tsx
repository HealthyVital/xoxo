import { cn } from '@/lib/utils'

interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; count?: number }[]
  className?: string
}

export function Tabs<T extends string>({ value, onChange, options, className }: TabsProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-1 rounded-lg bg-[var(--color-plane)] p-1', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            value === opt.value
              ? 'bg-white text-[var(--color-ink)] shadow-sm'
              : 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]',
          )}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className="ml-1.5 text-[var(--color-ink-muted)]">{opt.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

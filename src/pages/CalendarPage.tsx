import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/Misc'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Select, Label, Input } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import { cn } from '@/lib/utils'
import type { CalendarItem, CalendarItemStatus } from '@/types'

const STATUS_TONE: Record<CalendarItemStatus, 'neutral' | 'brand' | 'good' | 'warning'> = {
  Idea: 'neutral',
  Script: 'neutral',
  Scheduled: 'brand',
  Shot: 'brand',
  Editing: 'warning',
  'Client Review': 'warning',
  Approved: 'good',
  Published: 'good',
  Analyzed: 'good',
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function buildGrid(monthDate: Date) {
  const first = startOfMonth(monthDate)
  const startDay = (first.getDay() + 6) % 7 // Monday-first
  const gridStart = new Date(first)
  gridStart.setDate(first.getDate() - startDay)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })
}

export default function CalendarPage() {
  const { calendarItems, clients, updateCalendarItem } = useDataStore()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = selectedId ? (calendarItems.find((i) => i.id === selectedId) ?? null) : null

  const days = useMemo(() => buildGrid(month), [month])
  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>()
    for (const item of calendarItems) {
      const list = map.get(item.date) ?? []
      list.push(item)
      map.set(item.date, list)
    }
    return map
  }, [calendarItems])

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Content production calendar across all clients."
        actions={
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}>
              <ChevronLeft size={16} />
            </Button>
            <span className="w-32 text-center text-sm font-medium">
              {month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="icon" onClick={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>
              <ChevronRight size={16} />
            </Button>
          </div>
        }
      />
      <Card className="overflow-hidden p-2">
        <div className="grid grid-cols-7 gap-px bg-[var(--color-hairline)] text-center text-[11px] font-medium text-[var(--color-ink-muted)]">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="bg-[var(--color-surface)] py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-[var(--color-hairline)]">
          {days.map((day) => {
            const key = day.toISOString().slice(0, 10)
            const inMonth = day.getMonth() === month.getMonth()
            const items = itemsByDate.get(key) ?? []
            return (
              <div
                key={key}
                className={cn('min-h-24 bg-[var(--color-surface)] p-1.5', !inMonth && 'bg-[var(--color-plane)]')}
              >
                <p className={cn('mb-1 text-[11px]', inMonth ? 'text-[var(--color-ink-secondary)]' : 'text-[var(--color-ink-muted)]')}>
                  {day.getDate()}
                </p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const client = clients.find((c) => c.id === item.clientId)
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className="block w-full truncate rounded-md border border-[var(--color-hairline)] bg-[var(--color-plane)] px-1.5 py-1 text-left text-[10px] hover:bg-[var(--color-brand-soft)]"
                      >
                        <span className="font-medium text-[var(--color-ink)]">{client?.companyName.replace('(Demo) ', '') ?? 'Unassigned'}</span>
                        <br />
                        <span className="text-[var(--color-ink-muted)]">{item.contentType}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {selected && (
        <CalendarItemModal item={selected} onClose={() => setSelectedId(null)} onSave={(patch) => updateCalendarItem(selected.id, patch)} />
      )}
    </div>
  )
}

function CalendarItemModal({
  item,
  onClose,
  onSave,
}: {
  item: CalendarItem
  onClose: () => void
  onSave: (patch: Partial<CalendarItem>) => void
}) {
  const { clients } = useDataStore()
  const client = clients.find((c) => c.id === item.clientId)
  const statuses: CalendarItemStatus[] = ['Idea', 'Script', 'Scheduled', 'Shot', 'Editing', 'Client Review', 'Approved', 'Published', 'Analyzed']

  return (
    <Modal open onClose={onClose} title={`${item.contentType} — ${item.platform}`} description={client?.companyName}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge tone={STATUS_TONE[item.status]}>{item.status}</Badge>
          <Badge tone={item.approval === 'Approved' ? 'good' : item.approval === 'Changes Requested' ? 'critical' : 'neutral'}>
            {item.approval}
          </Badge>
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" defaultValue={item.date} onChange={(e) => onSave({ date: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={item.status} onChange={(e) => onSave({ status: e.target.value as CalendarItemStatus })}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="approval">Approval</Label>
          <Select id="approval" value={item.approval} onChange={(e) => onSave({ approval: e.target.value as CalendarItem['approval'] })}>
            <option>Pending</option>
            <option>Approved</option>
            <option>Changes Requested</option>
          </Select>
        </div>
      </div>
    </Modal>
  )
}

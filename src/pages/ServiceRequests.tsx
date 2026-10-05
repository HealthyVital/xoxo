import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader } from '@/components/ui/Misc'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ServiceRequestFormModal } from '@/components/service-requests/ServiceRequestFormModal'
import { cn, formatCurrencyEUR } from '@/lib/utils'
import type { Professional, ServiceRequest, ServiceRequestStatus } from '@/types'

const STAGES: ServiceRequestStatus[] = ['New', 'Matched', 'In Progress', 'Completed', 'Cancelled']

export default function ServiceRequests() {
  const { serviceRequests, services, professionals, updateServiceRequest } = useDataStore()
  const [showAdd, setShowAdd] = useState(false)
  const [matchingId, setMatchingId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<ServiceRequestStatus | null>(null)

  const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services])
  const professionalById = useMemo(() => new Map(professionals.map((p) => [p.id, p])), [professionals])

  const byStage = useMemo(() => {
    const map = new Map<ServiceRequestStatus, ServiceRequest[]>()
    for (const stage of STAGES) map.set(stage, [])
    for (const r of serviceRequests) {
      if (map.has(r.status)) map.get(r.status)!.push(r)
    }
    return map
  }, [serviceRequests])

  const matching = matchingId ? (serviceRequests.find((r) => r.id === matchingId) ?? null) : null

  return (
    <div>
      <PageHeader
        title="Service Requests"
        description="One-time jobs from companies, matched to an available professional. Drag a card to move it to a new stage."
        actions={
          <Button onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add request
          </Button>
        }
      />

      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div
            key={stage}
            className={cn(
              'w-72 shrink-0 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-plane)] p-2',
              dragOverStage === stage && 'ring-2 ring-[var(--color-brand)]',
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverStage(stage)
            }}
            onDragLeave={() => setDragOverStage((s) => (s === stage ? null : s))}
            onDrop={(e) => {
              e.preventDefault()
              const id = e.dataTransfer.getData('text/service-request-id')
              if (id) updateServiceRequest(id, { status: stage })
              setDragOverStage(null)
            }}
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-xs font-semibold text-[var(--color-ink)]">
                {stage} <span className="text-[var(--color-ink-muted)]">({byStage.get(stage)?.length ?? 0})</span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {(byStage.get(stage) ?? []).map((r) => (
                <Card
                  key={r.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/service-request-id', r.id)}
                  className="cursor-grab p-3 active:cursor-grabbing"
                >
                  <p className="mb-1 text-sm leading-tight font-medium text-[var(--color-ink)]">{r.companyName}</p>
                  <p className="mb-2 text-[11px] text-[var(--color-ink-muted)]">
                    {serviceById.get(r.serviceId)?.name ?? r.serviceId} · {r.city}, {r.country}
                  </p>
                  {r.budget !== undefined && (
                    <p className="mb-2 tabular-nums text-xs font-medium text-[var(--color-ink-secondary)]">
                      {formatCurrencyEUR(r.budget)}
                    </p>
                  )}
                  {r.matchedProfessionalId ? (
                    <Badge tone="good">Matched: {professionalById.get(r.matchedProfessionalId)?.name ?? 'Unknown'}</Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setMatchingId(r.id)}>
                      Match professional
                    </Button>
                  )}
                </Card>
              ))}
              {(byStage.get(stage) ?? []).length === 0 && (
                <div className="rounded-lg border border-dashed border-[var(--color-hairline)] px-3 py-6 text-center text-[11px] text-[var(--color-ink-muted)]">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAdd && <ServiceRequestFormModal onClose={() => setShowAdd(false)} />}

      {matching && (
        <MatchProfessionalModal
          request={matching}
          onClose={() => setMatchingId(null)}
          onMatch={(professionalId) => {
            updateServiceRequest(matching.id, { matchedProfessionalId: professionalId, status: 'Matched' })
            setMatchingId(null)
          }}
        />
      )}
    </div>
  )
}

function MatchProfessionalModal({
  request,
  onClose,
  onMatch,
}: {
  request: ServiceRequest
  onClose: () => void
  onMatch: (professionalId: string) => void
}) {
  const { professionals } = useDataStore()
  // Best match first: available beats booked/unavailable, then higher rating,
  // then more reviews — so the auto-suggested pick below is a real
  // recommendation, not just whoever happens to be first in the list.
  const byRank = (a: Professional, b: Professional) => {
    const availRank = (p: Professional) => (p.availability === 'Available' ? 0 : p.availability === 'Booked' ? 1 : 2)
    if (availRank(a) !== availRank(b)) return availRank(a) - availRank(b)
    if ((b.ratingAvg ?? 0) !== (a.ratingAvg ?? 0)) return (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0)
    return b.reviewCount - a.reviewCount
  }
  const candidates = professionals
    .filter((p) => p.serviceIds.includes(request.serviceId) && p.city === request.city)
    .sort(byRank)
  const fallback = professionals
    .filter((p) => p.serviceIds.includes(request.serviceId) && p.city !== request.city)
    .sort(byRank)
  // Auto-suggest the top-ranked candidate (same-city preferred) so matching
  // is a one-click confirm by default — the team can still override via the
  // dropdown before confirming.
  const [selected, setSelected] = useState(() => candidates[0]?.id ?? fallback[0]?.id ?? '')

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] p-5 shadow-xl">
        <h2 className="mb-1 text-base font-semibold text-[var(--color-ink)]">Match a professional</h2>
        <p className="mb-4 text-xs text-[var(--color-ink-secondary)]">
          For {request.companyName} — {request.city}, {request.country}
        </p>
        {candidates.length === 0 && fallback.length === 0 ? (
          <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
            No professionals offer this service yet. Add one from the Professionals page first.
          </p>
        ) : (
          <Select value={selected} onChange={(e) => setSelected(e.target.value)} className="mb-4">
            <option value="">Select a professional…</option>
            {candidates.length > 0 && (
              <optgroup label={`In ${request.city}`}>
                {candidates.map((p, i) => (
                  <option key={p.id} value={p.id}>
                    {i === 0 ? '★ Suggested — ' : ''}
                    {p.name} ({p.availability}
                    {p.ratingAvg !== undefined ? `, ${p.ratingAvg.toFixed(1)}★` : ''})
                  </option>
                ))}
              </optgroup>
            )}
            {fallback.length > 0 && (
              <optgroup label="Other cities">
                {fallback.map((p, i) => (
                  <option key={p.id} value={p.id}>
                    {candidates.length === 0 && i === 0 ? '★ Suggested — ' : ''}
                    {p.name} — {p.city} ({p.availability}
                    {p.ratingAvg !== undefined ? `, ${p.ratingAvg.toFixed(1)}★` : ''})
                  </option>
                ))}
              </optgroup>
            )}
          </Select>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!selected} onClick={() => onMatch(selected)}>
            Confirm match
          </Button>
        </div>
      </div>
    </div>
  )
}

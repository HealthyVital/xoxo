import { useMemo, useState } from 'react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader } from '@/components/ui/Misc'
import { Card } from '@/components/ui/Card'
import { DemoBadge } from '@/components/ui/Badge'
import { LeadScoreBadge } from '@/components/prospects/LeadScoreBadge'
import { ProspectDetailModal } from '@/components/prospects/ProspectDetailModal'
import { ConvertToClientModal } from '@/components/prospects/ConvertToClientModal'
import { PIPELINE_STAGES, type PipelineStage, type Prospect } from '@/types'
import { formatCurrencyEUR, formatDate, cn } from '@/lib/utils'

export default function Pipeline() {
  const { prospects, updateProspect } = useDataStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null)
  const [convertingId, setConvertingId] = useState<string | null>(null)
  const selected = selectedId ? (prospects.find((p) => p.id === selectedId) ?? null) : null
  const converting = convertingId ? (prospects.find((p) => p.id === convertingId) ?? null) : null

  const byStage = useMemo(() => {
    const map = new Map<PipelineStage, Prospect[]>()
    for (const stage of PIPELINE_STAGES) map.set(stage, [])
    for (const p of prospects) {
      if (map.has(p.status as PipelineStage)) map.get(p.status as PipelineStage)!.push(p)
    }
    return map
  }, [prospects])

  const stageValue = (stage: PipelineStage) =>
    (byStage.get(stage) ?? []).reduce((sum, p) => sum + (p.dealValue ?? 0), 0)

  return (
    <div>
      <PageHeader title="Pipeline" description="Drag a card to move a prospect to a new stage." />

      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
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
              const id = e.dataTransfer.getData('text/prospect-id')
              if (id) {
                if (stage === 'Won') {
                  // Won only counts once the Client record actually exists —
                  // see ConvertToClientModal. The status itself is set there,
                  // not here, so a cancelled conversion leaves the card put.
                  setConvertingId(id)
                } else {
                  updateProspect(id, { status: stage })
                }
              }
              setDragOverStage(null)
            }}
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-xs font-semibold text-[var(--color-ink)]">
                {stage} <span className="text-[var(--color-ink-muted)]">({byStage.get(stage)?.length ?? 0})</span>
              </p>
              <p className="tabular-nums text-[11px] text-[var(--color-ink-muted)]">{formatCurrencyEUR(stageValue(stage))}</p>
            </div>
            <div className="flex flex-col gap-2">
              {(byStage.get(stage) ?? []).map((p) => (
                <Card
                  key={p.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/prospect-id', p.id)}
                  onClick={() => setSelectedId(p.id)}
                  className="cursor-grab p-3 active:cursor-grabbing"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="text-sm leading-tight font-medium text-[var(--color-ink)]">{p.companyName}</p>
                    {p.isDemo && <DemoBadge />}
                  </div>
                  <p className="mb-2 text-[11px] text-[var(--color-ink-muted)]">{p.industry}</p>
                  <div className="mb-2 flex items-center justify-between">
                    <LeadScoreBadge score={p.leadScore} />
                    <span className="tabular-nums text-xs font-medium text-[var(--color-ink-secondary)]">
                      {p.dealValue ? formatCurrencyEUR(p.dealValue) : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-ink-muted)]">
                    <span>Last: {formatDate(p.lastContact)}</span>
                    <span>Next: {formatDate(p.nextFollowUp)}</span>
                  </div>
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

      {selected && <ProspectDetailModal prospect={selected} onClose={() => setSelectedId(null)} />}
      {converting && (
        <ConvertToClientModal
          prospect={converting}
          onClose={() => setConvertingId(null)}
          onConverted={() => setConvertingId(null)}
        />
      )}
    </div>
  )
}

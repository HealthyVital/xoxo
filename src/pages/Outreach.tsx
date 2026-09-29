import { useMemo, useState } from 'react'
import { Send, Clock } from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader, DemoDataBanner, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { defaultVariablesFor, fillTemplate } from '@/lib/templateFill'
import { formatDate, nowIso, todayIso, cn } from '@/lib/utils'
import type { CommunicationChannel, OutreachTemplate } from '@/types'

export default function Outreach() {
  const { prospects, templates, logCommunication, updateProspect } = useDataStore()
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id)

  const queue = useMemo(() => {
    const today = todayIso()
    return prospects
      .filter((p) => !p.doNotContact && p.status !== 'Won' && p.status !== 'Lost' && p.status !== 'Not Interested')
      .filter((p) => (p.nextFollowUp && p.nextFollowUp <= today) || p.status === 'Ready to Contact')
      .sort((a, b) => (a.nextFollowUp ?? '').localeCompare(b.nextFollowUp ?? ''))
  }, [prospects])

  const selectedProspect = prospects.find((p) => p.id === selectedProspectId) ?? queue[0] ?? null
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) as OutreachTemplate

  const preview = selectedProspect
    ? fillTemplate(selectedTemplate.body, defaultVariablesFor(selectedProspect))
    : ''
  const subjectPreview =
    selectedProspect && selectedTemplate.subject
      ? fillTemplate(selectedTemplate.subject, defaultVariablesFor(selectedProspect))
      : ''

  function handleMarkSent() {
    if (!selectedProspect) return
    const channelMap: Record<OutreachTemplate['kind'], CommunicationChannel> = {
      'Email #1': 'Email',
      'Follow-up #1': 'Email',
      'Follow-up #2': 'Email',
      'LinkedIn DM': 'LinkedIn DM',
      'Instagram DM': 'Instagram DM',
      'WhatsApp follow-up': 'WhatsApp',
    }
    logCommunication({
      prospectId: selectedProspect.id,
      date: nowIso(),
      channel: channelMap[selectedTemplate.kind],
      direction: 'outbound',
      summary: `${selectedTemplate.kind} sent.`,
      templateId: selectedTemplate.id,
    })
    if (selectedProspect.status === 'New' || selectedProspect.status === 'Researching' || selectedProspect.status === 'Ready to Contact') {
      updateProspect(selectedProspect.id, { status: 'Contacted' })
    }
  }

  return (
    <div>
      <PageHeader
        title="Outreach"
        description="Day 0 → 3 → 7 → 14 sequence across email, LinkedIn, Instagram and WhatsApp."
      />
      <DemoDataBanner />

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">Sequence</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplateId(t.id)}
              className={cn(
                'rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                selectedTemplateId === t.id
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-strong)]'
                  : 'border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)]',
              )}
            >
              <p className="font-medium">{t.kind}</p>
              <p className="text-[var(--color-ink-muted)]">Day {t.sequenceDay}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Follow-up queue</CardTitle>
              <CardDescription>Ready to contact, or overdue for a follow-up</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="max-h-[520px] space-y-1.5 overflow-y-auto">
            {queue.length === 0 && <EmptyState title="Queue is clear" description="No one is due for a follow-up right now." />}
            {queue.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProspectId(p.id)}
                className={cn(
                  'w-full rounded-lg border p-2.5 text-left text-xs transition-colors',
                  selectedProspect?.id === p.id
                    ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]'
                    : 'border-[var(--color-hairline)] hover:bg-[var(--color-plane)]',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--color-ink)]">{p.companyName}</span>
                  {p.isDemo && <DemoBadge />}
                </div>
                <div className="mt-1 flex items-center justify-between text-[var(--color-ink-muted)]">
                  <Badge tone="brand">{p.status}</Badge>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} /> {formatDate(p.nextFollowUp)}
                  </span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Message preview</CardTitle>
              <CardDescription>
                {selectedProspect ? `For ${selectedProspect.companyName}` : 'Pick a prospect from the queue'}
              </CardDescription>
            </div>
            {selectedProspect && (
              <Select
                value={selectedProspect.id}
                onChange={(e) => setSelectedProspectId(e.target.value)}
                className="w-56"
              >
                {prospects
                  .filter((p) => !p.doNotContact)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.companyName}
                    </option>
                  ))}
              </Select>
            )}
          </CardHeader>
          <CardContent>
            {!selectedProspect ? (
              <EmptyState title="No prospect selected" />
            ) : (
              <>
                {subjectPreview && (
                  <p className="mb-2 text-sm font-medium text-[var(--color-ink)]">Subject: {subjectPreview}</p>
                )}
                <pre className="mb-4 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-plane)] p-4 text-xs whitespace-pre-wrap text-[var(--color-ink-secondary)]">
                  {preview}
                </pre>
                <p className="mb-3 text-[11px] text-[var(--color-ink-muted)]">
                  Demo / Not Connected — this logs the send in the CRM timeline. No real email, LinkedIn, Instagram or
                  WhatsApp message is sent by this MVP.
                </p>
                <Button onClick={handleMarkSent}>
                  <Send size={14} /> Log as sent
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

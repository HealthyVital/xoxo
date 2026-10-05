import { useState } from 'react'
import { Download, Trash2, ShieldOff, ExternalLink } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select, Textarea, Label } from '@/components/ui/Input'
import { LeadScoreBadge } from './LeadScoreBadge'
import { ConvertToClientModal } from './ConvertToClientModal'
import { useDataStore } from '@/store/DataStoreContext'
import type { CommunicationChannel, Prospect, ProspectStatus } from '@/types'
import { PROSPECT_STATUSES } from '@/data/statuses'
import { formatDate, nowIso } from '@/lib/utils'

export function ProspectDetailModal({ prospect, onClose }: { prospect: Prospect; onClose: () => void }) {
  const { communications, updateProspect, deleteProspect, logCommunication, proposals, pilotProposals, serviceRequests, services, clients } =
    useDataStore()
  const [channel, setChannel] = useState<CommunicationChannel>('Email')
  const [summary, setSummary] = useState('')
  const [showConvert, setShowConvert] = useState(false)

  const timeline = communications
    .filter((c) => c.prospectId === prospect.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Company 360 — every opportunity tied to this company, joined purely via the
  // existing prospectId / linkedProspectId links already on each record (no new
  // companyId field needed: this prospect's own id already is the company key).
  const client = clients.find((c) => c.prospectId === prospect.id)
  const serviceById = new Map(services.map((s) => [s.id, s]))
  const opportunities = [
    ...proposals
      .filter((p) => p.prospectId === prospect.id)
      .map((p) => ({
        key: `proposal-${p.id}`,
        kind: 'Proposal',
        label: p.packageId === 'custom' ? 'Custom proposal' : `${p.packageId} package`,
        status: p.status,
        createdAt: p.createdAt,
      })),
    ...pilotProposals
      .filter((p) => p.prospectId === prospect.id)
      .map((p) => ({
        key: `pilot-${p.id}`,
        kind: 'Free Pilot',
        label: p.objective || 'Free content pilot',
        status: p.status,
        createdAt: p.createdAt,
      })),
    ...serviceRequests
      .filter((r) => r.linkedProspectId === prospect.id)
      .map((r) => ({
        key: `request-${r.id}`,
        kind: 'Service Request',
        label: serviceById.get(r.serviceId)?.name ?? 'Service request',
        status: r.status,
        createdAt: r.createdAt,
      })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const field = (label: string, value?: string) => (
    <div>
      <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">{label}</p>
      <p className="text-sm text-[var(--color-ink)]">{value || <span className="text-[var(--color-ink-muted)]">Not verified</span>}</p>
    </div>
  )

  function handleLog() {
    if (!summary.trim()) return
    logCommunication({ prospectId: prospect.id, date: nowIso(), channel, direction: 'outbound', summary })
    setSummary('')
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(prospect, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prospect.companyName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
    <Modal open onClose={onClose} title={prospect.companyName} description={prospect.industry} wide>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {prospect.isDemo && <DemoBadge />}
        <Badge tone="brand">{prospect.status}</Badge>
        <Badge tone={prospect.verificationStatus === 'Verified' ? 'good' : 'neutral'}>{prospect.verificationStatus}</Badge>
        <LeadScoreBadge score={prospect.leadScore} />
        {prospect.doNotContact && (
          <Badge tone="critical">
            <ShieldOff size={11} /> Do Not Contact
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field('Website', prospect.website)}
            {field('Phone', prospect.phone)}
            {field('Email', prospect.email)}
            {field('Marketing contact', prospect.marketingContact)}
            {field('City', prospect.city)}
            {field('Company size', prospect.companySize)}
            {field('Instagram', prospect.instagram)}
            {field('TikTok', prospect.tiktok)}
          </div>

          <div>
            <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">Source</p>
            <p className="text-sm text-[var(--color-ink)]">
              {prospect.source}
              {prospect.sourceUrl && (
                <a
                  href={prospect.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1.5 inline-flex items-center gap-0.5 text-[var(--color-brand)] hover:underline"
                >
                  view <ExternalLink size={11} />
                </a>
              )}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">Last verified {formatDate(prospect.lastVerified)}</p>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-medium text-[var(--color-ink-muted)]">Why this lead scored {prospect.leadScore}</p>
            <ul className="space-y-1 text-xs text-[var(--color-ink-secondary)]">
              {prospect.scoreReasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-medium text-[var(--color-ink-muted)]">Recommended approach</p>
            <p className="text-sm text-[var(--color-ink-secondary)]">{prospect.recommendedApproach}</p>
          </div>

          <div>
            <p className="mb-1 text-[11px] font-medium text-[var(--color-ink-muted)]">Content opportunity</p>
            <p className="text-sm text-[var(--color-ink-secondary)]">{prospect.contentOpportunity}</p>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={prospect.status}
              onChange={(e) => {
                const next = e.target.value as ProspectStatus
                if (next === 'Won' && prospect.status !== 'Won') {
                  setShowConvert(true)
                } else {
                  updateProspect(prospect.id, { status: next })
                }
              }}
            >
              {PROSPECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-[var(--color-hairline)] pt-4">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={13} /> Export JSON
            </Button>
            {!prospect.doNotContact ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateProspect(prospect.id, {
                    doNotContact: true,
                    status: 'Do Not Contact',
                    consentNotes: `Marked Do Not Contact on ${formatDate(nowIso())}.`,
                  })
                }
              >
                <ShieldOff size={13} /> Mark Do Not Contact
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => updateProspect(prospect.id, { doNotContact: false })}>
                Remove Do Not Contact
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm(`Delete ${prospect.companyName}? This cannot be undone.`)) {
                  deleteProspect(prospect.id)
                  onClose()
                }
              }}
            >
              <Trash2 size={13} /> Delete
            </Button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium text-[var(--color-ink-muted)]">Log an interaction</p>
          <div className="flex gap-2">
            <Select value={channel} onChange={(e) => setChannel(e.target.value as CommunicationChannel)} className="w-40">
              {(['Email', 'Instagram DM', 'LinkedIn DM', 'Phone call', 'Meeting', 'WhatsApp', 'Note'] as CommunicationChannel[]).map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ),
              )}
            </Select>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What happened?"
              className="min-h-9 flex-1"
              rows={1}
            />
            <Button size="sm" onClick={handleLog}>
              Log
            </Button>
          </div>

          <div className="space-y-2 border-t border-[var(--color-hairline)] pt-4">
            <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">Opportunities for this company</p>
            {client && (
              <div className="flex items-center justify-between rounded-lg border border-[var(--color-hairline)] bg-[var(--color-brand-soft)] px-3 py-2 text-xs">
                <span className="font-medium text-[var(--color-ink)]">Recurring client</span>
                <Badge tone="good">
                  {client.status} · {client.mrr ? `€${client.mrr}/mo` : 'no MRR set'}
                </Badge>
              </div>
            )}
            {opportunities.length === 0 && !client && (
              <p className="text-xs text-[var(--color-ink-muted)]">No proposals or service requests yet.</p>
            )}
            {opportunities.map((o) => (
              <div
                key={o.key}
                className="flex items-center justify-between rounded-lg border border-[var(--color-hairline)] px-3 py-2 text-xs"
              >
                <div>
                  <span className="font-medium text-[var(--color-ink)]">{o.kind}</span>
                  <span className="ml-1.5 text-[var(--color-ink-secondary)]">{o.label}</span>
                </div>
                <Badge>{o.status}</Badge>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 border-t border-[var(--color-hairline)] pt-4">
            <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">Communication timeline</p>
            {timeline.length === 0 && <p className="text-xs text-[var(--color-ink-muted)]">No interactions logged yet.</p>}
            {timeline.map((c) => (
              <div key={c.id} className="flex gap-3 text-xs">
                <div className="w-16 shrink-0 text-[var(--color-ink-muted)]">{formatDate(c.date)}</div>
                <div>
                  <p className="font-medium text-[var(--color-ink)]">
                    {c.channel} <span className="font-normal text-[var(--color-ink-muted)]">· {c.direction}</span>
                  </p>
                  <p className="text-[var(--color-ink-secondary)]">{c.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
    {showConvert && (
      <ConvertToClientModal prospect={prospect} onClose={() => setShowConvert(false)} onConverted={() => setShowConvert(false)} />
    )}
    </>
  )
}

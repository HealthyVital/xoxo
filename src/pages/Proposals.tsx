import { useState } from 'react'
import { FileText, Plus, Printer } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useDataStore } from '@/store/DataStoreContext'
import { SEED_PRICING_PACKAGES } from '@/data/seedData'
import { formatDate, formatCurrencyEUR } from '@/lib/utils'
import type { Proposal, PricingPackageId } from '@/types'

const PROPOSAL_STATUSES: Proposal['status'][] = ['Draft', 'Sent', 'Won', 'Lost']

export default function Proposals() {
  const { prospects, proposals, addProposal, updateProposal } = useDataStore()
  const [prospectId, setProspectId] = useState('')
  const [clientProblem, setClientProblem] = useState('')
  const [contentOpportunity, setContentOpportunity] = useState('')
  const [strategy, setStrategy] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [production, setProduction] = useState('On-location shoot day(s) scheduled around your calendar.')
  const [distribution, setDistribution] = useState('Published to your own channels; we handle scheduling if needed.')
  const [reporting, setReporting] = useState('Monthly performance report with what worked and what changes next.')
  const [timeline, setTimeline] = useState('Onboarding within 1 week, first content live within 2 weeks.')
  const [packageId, setPackageId] = useState<PricingPackageId | 'custom'>('growth')
  const [customPrice, setCustomPrice] = useState<number | ''>('')
  const [terms, setTerms] = useState('Month-to-month, cancel with 30 days notice. Usage rights detailed separately.')
  const [cta, setCta] = useState('Reply to confirm and we will send over an onboarding form to get started.')
  const [viewing, setViewing] = useState<Proposal | null>(null)

  function handleCreate() {
    const prospect = prospects.find((p) => p.id === prospectId)
    if (!prospect) return
    addProposal({
      prospectId,
      client: prospect.companyName,
      clientProblem: clientProblem || prospect.painPoints.join('; '),
      contentOpportunity: contentOpportunity || prospect.contentOpportunity,
      strategy: strategy || prospect.recommendedApproach,
      deliverables: deliverables.split(',').map((s) => s.trim()).filter(Boolean),
      production,
      distribution,
      reporting,
      timeline,
      packageId,
      customPrice: packageId === 'custom' && customPrice !== '' ? Number(customPrice) : undefined,
      currency: 'EUR',
      terms,
      cta,
      status: 'Draft',
    })
    setProspectId('')
  }

  return (
    <div>
      <PageHeader title="Proposals" description="Generate a client-ready proposal from a prospect's profile." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="prospect">Client</Label>
              <Select id="prospect" value={prospectId} onChange={(e) => setProspectId(e.target.value)}>
                <option value="">Select a prospect</option>
                {prospects
                  .filter((p) => !p.doNotContact)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.companyName}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="clientProblem">Client problem</Label>
              <Textarea id="clientProblem" value={clientProblem} onChange={(e) => setClientProblem(e.target.value)} placeholder="Leave blank to use the prospect's pain points" />
            </div>
            <div>
              <Label htmlFor="contentOpportunity">Content opportunity</Label>
              <Textarea id="contentOpportunity" value={contentOpportunity} onChange={(e) => setContentOpportunity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="strategy">Strategy</Label>
              <Textarea id="strategy" value={strategy} onChange={(e) => setStrategy(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="deliverables">Deliverables (comma separated)</Label>
              <Textarea id="deliverables" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="8 short-form videos, 20 photos, monthly report" />
            </div>
            <div>
              <Label htmlFor="production">Production</Label>
              <Textarea id="production" value={production} onChange={(e) => setProduction(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="distribution">Distribution</Label>
              <Textarea id="distribution" value={distribution} onChange={(e) => setDistribution(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="reporting">Reporting</Label>
              <Textarea id="reporting" value={reporting} onChange={(e) => setReporting(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Textarea id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="package">Package</Label>
              <Select id="package" value={packageId} onChange={(e) => setPackageId(e.target.value as PricingPackageId | 'custom')}>
                {SEED_PRICING_PACKAGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.priceRange})
                  </option>
                ))}
                <option value="custom">Custom quote</option>
              </Select>
            </div>
            {packageId === 'custom' && (
              <div>
                <Label htmlFor="customPrice">Custom price (EUR/month)</Label>
                <Input id="customPrice" type="number" value={customPrice} onChange={(e) => setCustomPrice(e.target.value ? Number(e.target.value) : '')} />
              </div>
            )}
            <div>
              <Label htmlFor="terms">Terms</Label>
              <Textarea id="terms" value={terms} onChange={(e) => setTerms(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cta">CTA</Label>
              <Textarea id="cta" value={cta} onChange={(e) => setCta(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleCreate} disabled={!prospectId}>
              <Plus size={14} /> Create proposal
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {proposals.length === 0 && <EmptyState title="No proposals yet" icon={<FileText />} />}
          {proposals.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-[var(--color-ink)]">
                    {p.client}
                    {prospects.find((pr) => pr.id === p.prospectId)?.isDemo && <DemoBadge />}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Created {formatDate(p.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={p.status}
                    onChange={(e) => updateProposal(p.id, { status: e.target.value as Proposal['status'] })}
                    className="h-8 w-28 text-xs"
                  >
                    {PROPOSAL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => setViewing(p)}>
                    View
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[var(--color-ink-secondary)]">{p.contentOpportunity}</p>
            </Card>
          ))}
        </div>
      </div>

      {viewing && <ProposalPreviewModal proposal={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}

function ProposalPreviewModal({ proposal, onClose }: { proposal: Proposal; onClose: () => void }) {
  const pkg = SEED_PRICING_PACKAGES.find((p) => p.id === proposal.packageId)
  const price = proposal.packageId === 'custom' ? (proposal.customPrice ? formatCurrencyEUR(proposal.customPrice) + '/month' : 'Custom quote') : pkg?.priceRange
  return (
    <Modal open onClose={onClose} title={`Proposal — ${proposal.client}`} wide>
      <div id="proposal-print" className="space-y-5 text-sm">
        <Section title="Client problem" text={proposal.clientProblem} />
        <Section title="Content opportunity" text={proposal.contentOpportunity} />
        <Section title="Strategy" text={proposal.strategy} />
        <div>
          <p className="mb-1 text-xs font-semibold text-[var(--color-ink-muted)]">Deliverables</p>
          <div className="flex flex-wrap gap-1.5">
            {proposal.deliverables.map((d) => (
              <Badge key={d} tone="brand">
                {d}
              </Badge>
            ))}
          </div>
        </div>
        <Section title="Production" text={proposal.production} />
        <Section title="Distribution" text={proposal.distribution} />
        <Section title="Reporting" text={proposal.reporting} />
        <Section title="Timeline" text={proposal.timeline} />
        <Section title="Price" text={`${price ?? 'Custom quote'} — reference pricing, custom-quoted for final scope.`} />
        <Section title="Terms" text={proposal.terms} />
        <Section title="Next step" text={proposal.cta} />
      </div>
      <div className="mt-5 flex justify-end print:hidden">
        <Button onClick={() => window.print()}>
          <Printer size={14} /> Print / Save as PDF
        </Button>
      </div>
    </Modal>
  )
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-[var(--color-ink-muted)]">{title}</p>
      <p className="text-[var(--color-ink-secondary)] whitespace-pre-wrap">{text}</p>
    </div>
  )
}

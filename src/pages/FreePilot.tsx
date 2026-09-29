import { useState } from 'react'
import { Gift, Plus } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { useDataStore } from '@/store/DataStoreContext'
import { formatDate } from '@/lib/utils'
import type { PilotProposal } from '@/types'

const DEFAULT_DELIVERABLES = [
  '1 short-form video',
  '5 edited photographs',
  '3 social media concepts',
  'Mini content audit',
  'Benchmark against current content',
  'Results presentation',
]

export default function FreePilot() {
  const { prospects, pilotProposals, addPilotProposal, updatePilotProposal } = useDataStore()
  const [prospectId, setProspectId] = useState('')
  const [objective, setObjective] = useState('')
  const [productionDate, setProductionDate] = useState('')
  const [timeline, setTimeline] = useState('2 weeks from production date to delivery')
  const [clientProvides, setClientProvides] = useState('Access to the location, a point of contact on the day, any brand guidelines')
  const [weProvide, setWeProvide] = useState('Photographer/videographer, editing, and a short results presentation')
  const [usageRights, setUsageRights] = useState('Client may use pilot content on their own channels. We may use it in our portfolio unless otherwise agreed.')
  const [nextStep, setNextStep] = useState('A 20-minute results call to walk through the pilot and discuss a monthly package.')

  const eligible = prospects.filter((p) => !p.doNotContact && p.status !== 'Won' && p.status !== 'Lost')

  function handleCreate() {
    const prospect = prospects.find((p) => p.id === prospectId)
    if (!prospect) return
    addPilotProposal({
      prospectId,
      client: prospect.companyName,
      objective: objective || `Show ${prospect.companyName} what consistent, on-brand content can look like.`,
      deliverables: DEFAULT_DELIVERABLES,
      productionDate: productionDate || undefined,
      expectedTimeline: timeline,
      clientProvides: clientProvides.split(',').map((s) => s.trim()).filter(Boolean),
      weProvide: weProvide.split(',').map((s) => s.trim()).filter(Boolean),
      usageRights,
      nextStep,
      status: 'Draft',
    })
    setProspectId('')
    setObjective('')
  }

  return (
    <div>
      <PageHeader
        title="Free Content Pilot"
        description="A small, no-cost content package used to prove fit before a paid engagement — never with a guaranteed-results promise."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New pilot proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="prospect">Client</Label>
              <Select id="prospect" value={prospectId} onChange={(e) => setProspectId(e.target.value)}>
                <option value="">Select a prospect</option>
                {eligible.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.companyName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="objective">Objective</Label>
              <Textarea id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="productionDate">Production date</Label>
              <Input id="productionDate" type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="timeline">Expected timeline</Label>
              <Input id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="clientProvides">What the client provides (comma separated)</Label>
              <Textarea id="clientProvides" value={clientProvides} onChange={(e) => setClientProvides(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="weProvide">What we provide (comma separated)</Label>
              <Textarea id="weProvide" value={weProvide} onChange={(e) => setWeProvide(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="usageRights">Usage rights</Label>
              <Textarea id="usageRights" value={usageRights} onChange={(e) => setUsageRights(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="nextStep">Next step</Label>
              <Textarea id="nextStep" value={nextStep} onChange={(e) => setNextStep(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleCreate} disabled={!prospectId}>
              <Plus size={14} /> Create pilot proposal
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {pilotProposals.length === 0 && <EmptyState title="No pilot proposals yet" icon={<Gift />} />}
          {pilotProposals.map((p) => (
            <PilotCard key={p.id} pilot={p} onStatusChange={(status) => updatePilotProposal(p.id, { status })} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PilotCard({ pilot, onStatusChange }: { pilot: PilotProposal; onStatusChange: (s: PilotProposal['status']) => void }) {
  const { prospects } = useDataStore()
  const prospect = prospects.find((p) => p.id === pilot.prospectId)
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-[var(--color-ink)]">
            {pilot.client}
            {prospect?.isDemo && <DemoBadge />}
          </p>
          <p className="text-xs text-[var(--color-ink-muted)]">Created {formatDate(pilot.createdAt)}</p>
        </div>
        <Select value={pilot.status} onChange={(e) => onStatusChange(e.target.value as PilotProposal['status'])} className="w-32">
          <option>Draft</option>
          <option>Sent</option>
          <option>Accepted</option>
          <option>Completed</option>
        </Select>
      </div>
      <p className="mb-3 text-sm text-[var(--color-ink-secondary)]">{pilot.objective}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {pilot.deliverables.map((d) => (
          <Badge key={d} tone="brand">
            {d}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
        <div>
          <p className="font-medium text-[var(--color-ink-muted)]">Timeline</p>
          <p className="text-[var(--color-ink-secondary)]">{pilot.expectedTimeline}</p>
        </div>
        <div>
          <p className="font-medium text-[var(--color-ink-muted)]">Production date</p>
          <p className="text-[var(--color-ink-secondary)]">{pilot.productionDate ? formatDate(pilot.productionDate) : 'TBD'}</p>
        </div>
        <div>
          <p className="font-medium text-[var(--color-ink-muted)]">Client provides</p>
          <p className="text-[var(--color-ink-secondary)]">{pilot.clientProvides.join(', ')}</p>
        </div>
        <div>
          <p className="font-medium text-[var(--color-ink-muted)]">We provide</p>
          <p className="text-[var(--color-ink-secondary)]">{pilot.weProvide.join(', ')}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="font-medium text-[var(--color-ink-muted)]">Usage rights</p>
          <p className="text-[var(--color-ink-secondary)]">{pilot.usageRights}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="font-medium text-[var(--color-ink-muted)]">Next step</p>
          <p className="text-[var(--color-ink-secondary)]">{pilot.nextStep}</p>
        </div>
      </div>
    </Card>
  )
}

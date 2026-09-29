import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader, DemoDataBanner, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS } from '@/data/verticals'
import { formatDate } from '@/lib/utils'
import type { Campaign, Vertical } from '@/types'

const STATUSES: Campaign['status'][] = ['Planning', 'In Production', 'Live', 'Completed']

export default function Campaigns() {
  const { campaigns, clients, savedContentIdeas, addCampaign, updateSavedContentIdea } = useDataStore()
  const [statusFilter, setStatusFilter] = useState<Campaign['status'] | 'all'>('all')
  const [showNew, setShowNew] = useState(false)

  const filtered = statusFilter === 'all' ? campaigns : campaigns.filter((c) => c.status === statusFilter)
  const unassignedIdeas = savedContentIdeas.filter((i) => !i.campaignId)

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Group content ideas into a coordinated push for a client or vertical."
        actions={
          <Button onClick={() => setShowNew(true)}>
            <Plus size={14} /> New campaign
          </Button>
        }
      />
      <DemoDataBanner />

      <Tabs
        value={statusFilter}
        onChange={setStatusFilter}
        className="mb-4 w-fit"
        options={[{ value: 'all', label: 'All' }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const client = clients.find((cl) => cl.id === c.clientId)
          const ideaCount = savedContentIdeas.filter((i) => i.campaignId === c.id).length
          return (
            <Card key={c.id} className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="font-semibold text-[var(--color-ink)]">{c.name}</p>
                {client?.isDemo && <DemoBadge />}
              </div>
              <p className="mb-3 text-xs text-[var(--color-ink-muted)]">{c.vertical}{client ? ` · ${client.companyName}` : ''}</p>
              <p className="mb-3 text-sm text-[var(--color-ink-secondary)]">{c.objective}</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {c.platforms.map((p) => (
                  <Badge key={p} tone="neutral">
                    {p}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
                <Badge tone="brand">{c.status}</Badge>
                <span>{ideaCount} idea{ideaCount === 1 ? '' : 's'} attached</span>
              </div>
              <p className="mt-2 text-[11px] text-[var(--color-ink-muted)]">
                {formatDate(c.startDate)}
                {c.endDate ? ` → ${formatDate(c.endDate)}` : ''}
              </p>
            </Card>
          )
        })}
        {filtered.length === 0 && <EmptyState title="No campaigns in this status" />}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Unassigned content ideas ({unassignedIdeas.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {unassignedIdeas.length === 0 && (
            <p className="text-sm text-[var(--color-ink-muted)]">
              Everything saved from the Content Studio is assigned. Generate new ideas there to see them here.
            </p>
          )}
          {unassignedIdeas.map((idea) => (
            <div key={idea.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-hairline)] p-3 text-sm">
              <div>
                <p className="font-medium text-[var(--color-ink)]">{idea.brief.company || 'Untitled brief'}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{idea.ideas[0]}</p>
              </div>
              <Select
                className="w-48"
                defaultValue=""
                onChange={(e) => e.target.value && updateSavedContentIdea(idea.id, { campaignId: e.target.value })}
              >
                <option value="" disabled>
                  Assign to campaign…
                </option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {showNew && <NewCampaignModal onClose={() => setShowNew(false)} onCreate={addCampaign} />}
    </div>
  )
}

function NewCampaignModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (c: Omit<Campaign, 'id'>) => void
}) {
  const { clients } = useDataStore()
  const [name, setName] = useState('')
  const [vertical, setVertical] = useState<Vertical | 'Multi-vertical'>('Multi-vertical')
  const [clientId, setClientId] = useState('')
  const [objective, setObjective] = useState('')
  const [platforms, setPlatforms] = useState('Instagram, TikTok')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))

  return (
    <Modal open onClose={onClose} title="New campaign">
      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="vertical">Vertical</Label>
          <Select id="vertical" value={vertical} onChange={(e) => setVertical(e.target.value as Vertical | 'Multi-vertical')}>
            <option>Multi-vertical</option>
            {VERTICALS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="client">Client (optional)</Label>
          <Select id="client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">No client yet</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="objective">Objective</Label>
          <Input id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="platforms">Platforms (comma separated)</Label>
          <Input id="platforms" value={platforms} onChange={(e) => setPlatforms(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!name.trim()) return
              onCreate({
                name,
                vertical,
                clientId: clientId || undefined,
                objective,
                platforms: platforms.split(',').map((p) => p.trim()).filter(Boolean),
                status: 'Planning',
                contentIdeaIds: [],
                startDate,
              })
              onClose()
            }}
          >
            Create campaign
          </Button>
        </div>
      </div>
    </Modal>
  )
}

import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { LogClientMonthModal } from '@/components/clients/LogClientMonthModal'
import { formatCurrencyEUR, formatNumber, formatPercent } from '@/lib/utils'
import { SERIES } from '@/components/dashboard/Charts'
import { computeRoi } from '@/lib/roi'
import type { Client, RoiInputs } from '@/types'

export default function ClientDetail() {
  const { clientId } = useParams()
  const { clients, updateClient } = useDataStore()
  const client = clients.find((c) => c.id === clientId)
  const [showLogMonth, setShowLogMonth] = useState(false)

  const [roiInputs, setRoiInputs] = useState<RoiInputs>({
    productionCost: 1300,
    advertisingSpend: 0,
    leads: client?.history[client.history.length - 1]?.leads ?? 0,
    bookings: client?.history[client.history.length - 1]?.bookings ?? 0,
    averageCustomerValue: 300,
    revenueAttributed: 0,
    dataQuality: 'Estimated',
  })

  const chartData = useMemo(
    () => (client ? [client.before, ...client.history].map((h) => ({ period: h.period, reach: h.reach, engagementRate: h.engagementRate, leads: h.leads })) : []),
    [client],
  )

  if (!client) {
    return (
      <div>
        <Link to="/app/clients" className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-brand)]">
          <ArrowLeft size={14} /> Back to clients
        </Link>
        <EmptyState title="Client not found" />
      </div>
    )
  }

  const latest = client.history[client.history.length - 1] ?? client.before
  const roi = computeRoi(roiInputs)

  return (
    <div>
      <Link to="/app/clients" className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-brand)]">
        <ArrowLeft size={14} /> Back to clients
      </Link>
      <PageHeader
        title={client.companyName}
        description={`${client.industry} · Client since ${client.startDate}`}
        actions={
          <>
            {client.isDemo && <DemoBadge />}
            <Badge tone="brand">{formatCurrencyEUR(client.mrr)}/mo</Badge>
            <Select
              value={client.status}
              onChange={(e) => updateClient(client.id, { status: e.target.value as Client['status'] })}
              className="w-32"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Churned">Churned</option>
            </Select>
            <Button size="sm" onClick={() => setShowLogMonth(true)}>
              Log this month's results
            </Button>
          </>
        }
      />
      {showLogMonth && <LogClientMonthModal client={client} onClose={() => setShowLogMonth(false)} />}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <CardTitle className="mb-3">Before collaboration</CardTitle>
          <MetricRow label="Posts / month" value={formatNumber(client.before.postsPublished)} />
          <MetricRow label="Reach" value={formatNumber(client.before.reach)} />
          <MetricRow label="Engagement rate" value={formatPercent(client.before.engagementRate)} />
          <MetricRow label="Leads / month" value={formatNumber(client.before.leads)} />
        </Card>
        <Card className="border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-5">
          <CardTitle className="mb-3">After — latest month ({latest.period})</CardTitle>
          <MetricRow label="Posts / month" value={formatNumber(latest.postsPublished)} />
          <MetricRow label="Reach" value={formatNumber(latest.reach)} />
          <MetricRow label="Engagement rate" value={formatPercent(latest.engagementRate)} />
          <MetricRow label="Leads / month" value={formatNumber(latest.leads)} />
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Reach over time</CardTitle>
              <CardDescription>Illustrative demo history — see the Demo notice above</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#e1e0d9" vertical={false} />
                <XAxis dataKey="period" tick={{ fill: '#898781', fontSize: 11 }} axisLine={{ stroke: '#e1e0d9' }} tickLine={false} />
                <YAxis
                  tick={{ fill: '#898781', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tickFormatter={(v) => new Intl.NumberFormat('en-NL', { notation: 'compact' }).format(Number(v))}
                />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e1e0d9' }} formatter={(v) => formatNumber(Number(v))} />
                <Line type="monotone" dataKey="reach" name="Reach" stroke={SERIES.blue} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Leads over time</CardTitle>
              <CardDescription>Illustrative demo history — see the Demo notice above</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#e1e0d9" vertical={false} />
                <XAxis dataKey="period" tick={{ fill: '#898781', fontSize: 11 }} axisLine={{ stroke: '#e1e0d9' }} tickLine={false} />
                <YAxis tick={{ fill: '#898781', fontSize: 11 }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e1e0d9' }} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke={SERIES.orange} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListCard title="What we created" items={client.whatWeCreated} onSave={(items) => updateClient(client.id, { whatWeCreated: items })} />
        <ListCard title="What worked" items={client.whatWorked} tone="good" onSave={(items) => updateClient(client.id, { whatWorked: items })} />
        <ListCard
          title="What we'll change next month"
          items={client.whatWeWillChangeNextMonth}
          tone="warning"
          onSave={(items) => updateClient(client.id, { whatWeWillChangeNextMonth: items })}
        />
        <ListCard title="Next month's strategy" items={client.nextMonthStrategy} onSave={(items) => updateClient(client.id, { nextMonthStrategy: items })} />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Content ROI</CardTitle>
            <CardDescription>
              Distinguish observed vs. client-reported vs. estimated data. Never a guarantee of results.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              <RoiField label="Production cost (€)" value={roiInputs.productionCost} onChange={(v) => setRoiInputs((p) => ({ ...p, productionCost: v }))} />
              <RoiField label="Ad spend (€)" value={roiInputs.advertisingSpend} onChange={(v) => setRoiInputs((p) => ({ ...p, advertisingSpend: v }))} />
              <RoiField label="Leads" value={roiInputs.leads} onChange={(v) => setRoiInputs((p) => ({ ...p, leads: v }))} />
              <RoiField label="Bookings" value={roiInputs.bookings} onChange={(v) => setRoiInputs((p) => ({ ...p, bookings: v }))} />
              <RoiField label="Avg. customer value (€)" value={roiInputs.averageCustomerValue} onChange={(v) => setRoiInputs((p) => ({ ...p, averageCustomerValue: v }))} />
              <RoiField label="Revenue attributed (€)" value={roiInputs.revenueAttributed} onChange={(v) => setRoiInputs((p) => ({ ...p, revenueAttributed: v }))} />
              <div className="col-span-2">
                <Label htmlFor="dataQuality">Data quality</Label>
                <Select
                  id="dataQuality"
                  value={roiInputs.dataQuality}
                  onChange={(e) => setRoiInputs((p) => ({ ...p, dataQuality: e.target.value as RoiInputs['dataQuality'] }))}
                >
                  <option>Observed</option>
                  <option>Client-reported</option>
                  <option>Estimated</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-[var(--color-plane)] p-4">
              <RoiResultRow label="Total cost" value={formatCurrencyEUR(roi.totalCost)} />
              <RoiResultRow label="Cost per lead" value={roi.costPerLead !== null ? formatCurrencyEUR(roi.costPerLead) : '—'} />
              <RoiResultRow label="Cost per booking" value={roi.costPerBooking !== null ? formatCurrencyEUR(roi.costPerBooking) : '—'} />
              <RoiResultRow label="ROAS" value={roi.roas !== null ? `${roi.roas.toFixed(2)}x` : 'N/A (no ad spend)'} />
              <RoiResultRow label="Estimated ROI" value={roi.estimatedRoi !== null ? formatPercent(roi.estimatedRoi) : '—'} />
              <p className="pt-2 text-[11px] text-[var(--color-ink-muted)]">
                Marked as <strong>{roiInputs.dataQuality}</strong> data. This is a planning estimate, not an audited result.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-hairline)] py-2 text-sm last:border-0">
      <span className="text-[var(--color-ink-secondary)]">{label}</span>
      <span className="tabular-nums font-medium text-[var(--color-ink)]">{value}</span>
    </div>
  )
}

function ListCard({
  title,
  items,
  tone,
  onSave,
}: {
  title: string
  items: string[]
  tone?: 'good' | 'warning'
  onSave: (items: string[]) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(items.join('\n'))

  if (editing) {
    return (
      <Card className="p-5">
        <p className="mb-2 text-xs font-semibold text-[var(--color-ink-muted)]">{title}</p>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="One item per line"
          className="mb-2"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              onSave(draft.split('\n').map((l) => l.trim()).filter(Boolean))
              setEditing(false)
            }}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDraft(items.join('\n'))
              setEditing(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-[var(--color-ink-muted)]">{title}</p>
        <button onClick={() => setEditing(true)} className="text-xs font-medium text-[var(--color-brand)] hover:underline">
          Edit
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-[var(--color-ink-muted)]">Nothing logged yet.</p>
      ) : (
        <ul className="space-y-1.5 text-sm text-[var(--color-ink-secondary)]">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className={tone === 'good' ? 'text-[var(--color-good)]' : tone === 'warning' ? 'text-[var(--color-warning)]' : 'text-[var(--color-ink-muted)]'}>•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function RoiField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

function RoiResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-ink-secondary)]">{label}</span>
      <span className="tabular-nums font-semibold text-[var(--color-ink)]">{value}</span>
    </div>
  )
}

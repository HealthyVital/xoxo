import type { ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { DemoBadge } from '@/components/ui/Badge'
import { useDataStore } from '@/store/DataStoreContext'
import { formatNumber, formatPercent } from '@/lib/utils'

export default function ClientReports() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { clients } = useDataStore()

  const client = clientId ? clients.find((c) => c.id === clientId) : clients[0]

  if (!client) {
    return <EmptyState title="No clients yet" description="Win a client to generate their first executive report." />
  }

  const latest = client.history[client.history.length - 1] ?? client.before
  const before = client.before
  const reachGrowth = before.reach > 0 ? ((latest.reach - before.reach) / before.reach) * 100 : 0
  const engagementGrowth = latest.engagementRate - before.engagementRate

  return (
    <div>
      <PageHeader
        title="Client Reports"
        description="A one-page, presentation-ready executive summary."
        actions={
          <>
            <Select value={client.id} onChange={(e) => navigate(`/app/reports/${e.target.value}`)} className="w-56">
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </Select>
            <Button onClick={() => window.print()}>
              <Printer size={14} /> Print / Save as PDF
            </Button>
          </>
        }
      />
      <Card className="mx-auto max-w-3xl p-8">
        <div className="mb-6 flex items-center justify-between border-b border-[var(--color-hairline)] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">{client.companyName} — Monthly Report</h2>
            <p className="text-xs text-[var(--color-ink-muted)]">{latest.period} · {client.industry}</p>
          </div>
          {client.isDemo && <DemoBadge />}
        </div>

        <ReportSection title="Executive summary">
          <p>
            In {latest.period}, {client.companyName} published {latest.postsPublished} pieces of content, reaching{' '}
            {formatNumber(latest.reach)} people ({reachGrowth >= 0 ? '+' : ''}
            {reachGrowth.toFixed(0)}% vs. before working together) at a {formatPercent(latest.engagementRate)} engagement rate
            ({engagementGrowth >= 0 ? '+' : ''}
            {engagementGrowth.toFixed(1)}pp).
          </p>
        </ReportSection>

        <ReportSection title="Content produced">
          <ul className="list-disc space-y-1 pl-5">
            {client.whatWeCreated.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Top performing content">
          <ul className="list-disc space-y-1 pl-5">
            {client.whatWorked.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Performance metrics">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Reach" value={formatNumber(latest.reach)} />
            <Metric label="Views" value={formatNumber(latest.views)} />
            <Metric label="Engagement" value={formatPercent(latest.engagementRate)} />
            <Metric label="Followers gained" value={formatNumber(latest.followersGained)} />
            <Metric label="Likes" value={formatNumber(latest.likes)} />
            <Metric label="Comments" value={formatNumber(latest.comments)} />
            <Metric label="Shares" value={formatNumber(latest.shares)} />
            <Metric label="Saves" value={formatNumber(latest.saves)} />
          </div>
        </ReportSection>

        <ReportSection title="Leads & conversions">
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Website clicks" value={formatNumber(latest.websiteClicks)} />
            <Metric label="Leads" value={formatNumber(latest.leads)} />
            <Metric label="Bookings / conversions" value={formatNumber(latest.conversions)} />
          </div>
        </ReportSection>

        <ReportSection title="Key learning">
          <p>{client.whatWorked[0] ?? 'Collecting more data to identify a clear winning pattern.'}</p>
        </ReportSection>

        <ReportSection title="Next month">
          <ul className="list-disc space-y-1 pl-5">
            {client.nextMonthStrategy.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Recommended actions" last>
          <ul className="list-disc space-y-1 pl-5">
            {client.whatWeWillChangeNextMonth.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </ReportSection>
      </Card>
    </div>
  )
}

function ReportSection({ title, children, last }: { title: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={last ? 'mb-0' : 'mb-5 border-b border-[var(--color-hairline)] pb-5'}>
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-[var(--color-ink-muted)] uppercase">{title}</p>
      <div className="text-sm text-[var(--color-ink-secondary)]">{children}</div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--color-plane)] p-2.5 text-center">
      <p className="tabular-nums text-base font-semibold text-[var(--color-ink)]">{value}</p>
      <p className="text-[10px] text-[var(--color-ink-muted)]">{label}</p>
    </div>
  )
}

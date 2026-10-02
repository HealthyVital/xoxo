import { useMemo, useState } from 'react'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input, Label } from '@/components/ui/Input'
import { StatCard } from '@/components/ui/StatCard'
import { FunnelViz } from '@/components/dashboard/Charts'
import { useDataStore } from '@/store/DataStoreContext'
import { computeCrmStats } from '@/lib/metrics'
import { formatCurrencyEUR, formatPercent } from '@/lib/utils'
import { Percent, TrendingUp, Users, Wallet } from 'lucide-react'

export default function Analytics() {
  const { prospects, clients } = useDataStore()
  const realProspects = useMemo(() => prospects.filter((p) => !p.isDemo), [prospects])
  const realClients = useMemo(() => clients.filter((c) => !c.isDemo), [clients])
  const stats = useMemo(() => computeCrmStats(realProspects, realClients), [realProspects, realClients])
  const [monthlyCost, setMonthlyCost] = useState(2500)

  const funnelStages = [
    { label: 'Prospects', value: Math.max(stats.totalProspects, 1) },
    { label: 'Contacted', value: stats.contacted },
    { label: 'Replies', value: stats.replied },
    { label: 'Meetings', value: stats.meetings },
    { label: 'Pilots', value: stats.freePilots },
    { label: 'Proposals', value: stats.proposalsSent },
    { label: 'Clients', value: stats.won },
  ]

  const contactRate = stats.totalProspects > 0 ? (stats.contacted / stats.totalProspects) * 100 : 0
  const replyRate = stats.contacted > 0 ? (stats.replied / stats.contacted) * 100 : 0
  const positiveReplyRate = stats.replied > 0 ? (stats.positiveReplies / stats.replied) * 100 : 0
  const meetingRate = stats.positiveReplies > 0 ? (stats.meetings / stats.positiveReplies) * 100 : 0
  const pilotConversion = stats.meetings > 0 ? (stats.freePilots / stats.meetings) * 100 : 0
  const proposalConversion = stats.freePilots > 0 ? (stats.proposalsSent / stats.freePilots) * 100 : 0
  const closeRate = stats.proposalsSent > 0 ? (stats.won / stats.proposalsSent) * 100 : 0

  const cac = stats.won > 0 ? monthlyCost / stats.won : null

  const activeRetention = realClients.length > 0 ? (realClients.filter((c) => c.status === 'Active').length / realClients.length) * 100 : 0

  return (
    <div>
      <PageHeader title="Analytics" description="Conversion rates across the full prospecting-to-client funnel — real data only." />

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Funnel</CardTitle>
            <CardDescription>Real prospects in the database → real clients</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <FunnelViz stages={funnelStages} />
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Contact rate" value={formatPercent(contactRate)} icon={Users} hint="of all prospects" />
        <StatCard label="Reply rate" value={formatPercent(replyRate)} icon={TrendingUp} hint="of contacted" />
        <StatCard label="Positive reply rate" value={formatPercent(positiveReplyRate)} icon={TrendingUp} hint="of replies" />
        <StatCard label="Meeting rate" value={formatPercent(meetingRate)} icon={TrendingUp} hint="of positive replies" />
        <StatCard label="Pilot conversion" value={formatPercent(pilotConversion)} icon={TrendingUp} hint="of meetings" />
        <StatCard label="Proposal conversion" value={formatPercent(proposalConversion)} icon={TrendingUp} hint="of pilots" />
        <StatCard label="Close rate" value={formatPercent(closeRate)} icon={Percent} hint="of proposals" />
        <StatCard label="Avg. deal value" value={formatCurrencyEUR(stats.averageDealValue)} icon={Wallet} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer acquisition cost</CardTitle>
            <CardDescription>Enter your monthly sales & marketing cost to estimate CAC</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="monthlyCost">Monthly sales & marketing cost (€)</Label>
            <Input id="monthlyCost" type="number" value={monthlyCost} onChange={(e) => setMonthlyCost(Number(e.target.value))} />
            <p className="mt-3 text-sm text-[var(--color-ink-secondary)]">
              {stats.won} real client{stats.won === 1 ? '' : 's'} won so far →{' '}
              <span className="tabular-nums font-semibold text-[var(--color-ink)]">
                {cac !== null ? formatCurrencyEUR(cac) : 'N/A (no clients won yet)'}
              </span>{' '}
              CAC
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retention</CardTitle>
            <CardDescription>Share of clients still active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="tabular-nums text-3xl font-semibold text-[var(--color-ink)]">{formatPercent(activeRetention)}</p>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              {realClients.filter((c) => c.status === 'Active').length} of {realClients.length} clients active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Monthly history</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No monthly history yet"
            description="This builds up automatically, month by month, once real outreach, pilots and clients start happening."
          />
        </CardContent>
      </Card>
    </div>
  )
}

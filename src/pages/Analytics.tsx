import { useMemo, useState } from 'react'
import { PageHeader, DemoDataBanner } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input, Label } from '@/components/ui/Input'
import { StatCard } from '@/components/ui/StatCard'
import { FunnelViz } from '@/components/dashboard/Charts'
import { useDataStore } from '@/store/DataStoreContext'
import { computeCrmStats } from '@/lib/metrics'
import { SEED_DEMO_ANALYTICS } from '@/data/seedData'
import { formatCurrencyEUR, formatNumber, formatPercent } from '@/lib/utils'
import { Percent, TrendingUp, Users, Wallet } from 'lucide-react'

export default function Analytics() {
  const { prospects, clients } = useDataStore()
  const stats = useMemo(() => computeCrmStats(prospects, clients), [prospects, clients])
  const [monthlyCost, setMonthlyCost] = useState(2500)

  const funnelStages = [
    { label: '200 prospects (target research base)', value: Math.max(stats.totalProspects, 1) },
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

  const latestMonth = SEED_DEMO_ANALYTICS[SEED_DEMO_ANALYTICS.length - 1]
  const cac = latestMonth.won > 0 ? monthlyCost / latestMonth.won : null

  const activeRetention = clients.length > 0 ? (clients.filter((c) => c.status === 'Active').length / clients.length) * 100 : 0

  return (
    <div>
      <PageHeader title="Analytics" description="Conversion rates across the full prospecting-to-client funnel." />
      <DemoDataBanner />

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>Funnel</CardTitle>
            <CardDescription>200 target Rotterdam prospects → clients</CardDescription>
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
            <CardTitle>Customer acquisition cost (demo)</CardTitle>
            <CardDescription>Enter your monthly sales & marketing cost to estimate CAC</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="monthlyCost">Monthly sales & marketing cost (€)</Label>
            <Input id="monthlyCost" type="number" value={monthlyCost} onChange={(e) => setMonthlyCost(Number(e.target.value))} />
            <p className="mt-3 text-sm text-[var(--color-ink-secondary)]">
              {latestMonth.won} client{latestMonth.won === 1 ? '' : 's'} won in {latestMonth.month} (demo) →{' '}
              <span className="tabular-nums font-semibold text-[var(--color-ink)]">
                {cac !== null ? formatCurrencyEUR(cac) : 'N/A (no clients won)'}
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
              {clients.filter((c) => c.status === 'Active').length} of {clients.length} clients active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <CardHeader>
          <CardTitle>Monthly history (demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                <th className="py-2 pr-4 font-medium">Month</th>
                <th className="py-2 pr-4 font-medium">Added</th>
                <th className="py-2 pr-4 font-medium">Contacted</th>
                <th className="py-2 pr-4 font-medium">Replies</th>
                <th className="py-2 pr-4 font-medium">Meetings</th>
                <th className="py-2 pr-4 font-medium">Pilots</th>
                <th className="py-2 pr-4 font-medium">Proposals</th>
                <th className="py-2 pr-4 font-medium">Won</th>
                <th className="py-2 pr-4 font-medium">Lost</th>
                <th className="py-2 pr-4 font-medium">MRR</th>
              </tr>
            </thead>
            <tbody>
              {SEED_DEMO_ANALYTICS.map((m) => (
                <tr key={m.month} className="border-b border-[var(--color-hairline)] last:border-0">
                  <td className="py-2 pr-4 font-medium text-[var(--color-ink)]">{m.month}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.prospectsAdded)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.contacted)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.replies)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.meetings)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.pilots)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.proposals)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.won)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatNumber(m.lost)}</td>
                  <td className="tabular-nums py-2 pr-4">{formatCurrencyEUR(m.mrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

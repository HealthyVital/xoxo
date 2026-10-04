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
  const { prospects, clients, professionals, serviceRequests } = useDataStore()
  const realProspects = useMemo(() => prospects.filter((p) => !p.isDemo), [prospects])
  const realClients = useMemo(() => clients.filter((c) => !c.isDemo), [clients])
  const stats = useMemo(() => computeCrmStats(realProspects, realClients), [realProspects, realClients])
  const [monthlyCost, setMonthlyCost] = useState(2500)

  // Marketplace: demand (open one-time requests) vs. supply (available professionals), by city.
  const demandSupplyByCity = useMemo(() => {
    const openRequests = serviceRequests.filter((r) => r.status === 'New' || r.status === 'Matched' || r.status === 'In Progress')
    const cities = new Map<string, { city: string; country: string; demand: number; supply: number }>()
    for (const r of openRequests) {
      const key = `${r.city}|${r.country}`
      const row = cities.get(key) ?? { city: r.city, country: r.country, demand: 0, supply: 0 }
      row.demand += 1
      cities.set(key, row)
    }
    for (const p of professionals.filter((p) => p.availability === 'Available')) {
      const key = `${p.city}|${p.country}`
      const row = cities.get(key) ?? { city: p.city, country: p.country, demand: 0, supply: 0 }
      row.supply += 1
      cities.set(key, row)
    }
    return [...cities.values()].sort((a, b) => b.demand - a.demand - (b.supply - a.supply))
  }, [serviceRequests, professionals])

  const topProfessionals = useMemo(
    () =>
      [...professionals]
        .filter((p) => p.reviewCount > 0 && p.ratingAvg !== undefined)
        .sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0))
        .slice(0, 5),
    [professionals],
  )

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

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Marketplace: demand vs. supply by city</CardTitle>
            <CardDescription>Open service requests vs. available professionals, same city</CardDescription>
          </CardHeader>
          <CardContent>
            {demandSupplyByCity.length === 0 ? (
              <EmptyState
                title="No marketplace activity yet"
                description="This fills in once there are open service requests or available professionals."
              />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                    <th className="py-2 font-medium">City</th>
                    <th className="py-2 font-medium">Open requests</th>
                    <th className="py-2 font-medium">Available pros</th>
                    <th className="py-2 font-medium">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {demandSupplyByCity.map((row) => (
                    <tr key={`${row.city}|${row.country}`} className="border-b border-[var(--color-hairline)] last:border-0">
                      <td className="py-2 text-[var(--color-ink)]">
                        {row.city}, {row.country}
                      </td>
                      <td className="tabular-nums py-2 text-[var(--color-ink-secondary)]">{row.demand}</td>
                      <td className="tabular-nums py-2 text-[var(--color-ink-secondary)]">{row.supply}</td>
                      <td className="tabular-nums py-2 font-medium" style={{ color: row.demand > row.supply ? 'var(--color-critical)' : 'var(--color-good)' }}>
                        {row.demand > row.supply ? `-${row.demand - row.supply}` : 'covered'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top professionals</CardTitle>
            <CardDescription>By real review rating — only professionals with at least one review</CardDescription>
          </CardHeader>
          <CardContent>
            {topProfessionals.length === 0 ? (
              <EmptyState title="No reviews yet" description="Ratings appear here once real service requests are completed and reviewed." />
            ) : (
              <ul className="space-y-2">
                {topProfessionals.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-ink)]">
                      {p.name} <span className="text-xs text-[var(--color-ink-muted)]">· {p.city}</span>
                    </span>
                    <span className="tabular-nums font-medium text-[var(--color-ink-secondary)]">
                      {p.ratingAvg?.toFixed(1)} ★ ({p.reviewCount})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

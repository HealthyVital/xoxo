import { useMemo } from 'react'
import {
  Users,
  Send,
  MessageSquareReply,
  ThumbsUp,
  CalendarCheck,
  Gift,
  FileText,
  Trophy,
  XCircle,
  Wallet,
  TrendingUp,
  Percent,
  Target,
} from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { computeCrmStats } from '@/lib/metrics'
import { formatCurrencyEUR, formatNumber, formatPercent } from '@/lib/utils'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import {
  FunnelViz,
  PipelineValueChart,
  ContentProductionChart,
  RetentionBar,
  CountryBreakdownChart,
  VerificationBreakdownBar,
} from '@/components/dashboard/Charts'
import { PIPELINE_STAGES } from '@/types'

export default function Dashboard() {
  const { prospects, clients } = useDataStore()
  const realProspects = useMemo(() => prospects.filter((p) => !p.isDemo), [prospects])
  const realClients = useMemo(() => clients.filter((c) => !c.isDemo), [clients])
  const stats = useMemo(() => computeCrmStats(realProspects, realClients), [realProspects, realClients])

  const funnelStages = useMemo(
    () => [
      { label: 'Prospects', value: stats.totalProspects },
      { label: 'Contacted', value: stats.contacted },
      { label: 'Replies', value: stats.replied },
      { label: 'Meetings', value: stats.meetings },
      { label: 'Free Pilots', value: stats.freePilots },
      { label: 'Proposals', value: stats.proposalsSent },
      { label: 'Clients', value: stats.won },
    ],
    [stats],
  )

  const pipelineByStage = useMemo(() => {
    return PIPELINE_STAGES.filter((s) => !['Won', 'Lost'].includes(s)).map((stage) => ({
      stage,
      value: realProspects.filter((p) => p.status === stage).reduce((sum, p) => sum + (p.dealValue ?? 0), 0),
    }))
  }, [realProspects])

  const contentProductionData = useMemo(() => {
    const months = new Map<string, number>()
    for (const c of realClients) {
      for (const h of c.history) {
        months.set(h.period, (months.get(h.period) ?? 0) + h.postsPublished)
      }
    }
    return Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, posts]) => ({ month: month.slice(5), posts }))
  }, [realClients])

  const retention = useMemo(() => {
    const active = realClients.filter((c) => c.status === 'Active').length
    const paused = realClients.filter((c) => c.status === 'Paused').length
    const churned = realClients.filter((c) => c.status === 'Churned').length
    return { active, paused, churned }
  }, [realClients])

  const countryBreakdown = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of realProspects) counts.set(p.country, (counts.get(p.country) ?? 0) + 1)
    return Array.from(counts.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
  }, [realProspects])

  const verificationBreakdown = useMemo(() => {
    const verified = realProspects.filter((p) => p.verificationStatus === 'Verified').length
    const partiallyVerified = realProspects.filter((p) => p.verificationStatus === 'Partially Verified').length
    const needsVerification = realProspects.filter((p) => p.verificationStatus === 'Needs Verification').length
    const withEmail = realProspects.filter((p) => p.email).length
    const withPhone = realProspects.filter((p) => p.phone).length
    return { verified, partiallyVerified, needsVerification, withEmail, withPhone }
  }, [realProspects])

  const CLIENT_GOAL = 500
  const activeClientCount = useMemo(() => realClients.filter((c) => c.status === 'Active').length, [realClients])
  const goalProgressPct = Math.min((activeClientCount / CLIENT_GOAL) * 100, 100)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your commercial pipeline and content production at a glance — real data only."
      />

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[var(--color-brand)]" />
            <div>
              <CardTitle>Path to 500 stable monthly clients</CardTitle>
              <CardDescription>Active recurring clients vs. the long-term goal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-end justify-between">
            <p className="tabular-nums text-3xl font-semibold text-[var(--color-ink)]">
              {activeClientCount} <span className="text-base font-normal text-[var(--color-ink-muted)]">/ {CLIENT_GOAL}</span>
            </p>
            <p className="tabular-nums text-sm font-medium text-[var(--color-ink-secondary)]">{formatPercent(goalProgressPct)}</p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-hairline)]">
            <div className="h-full rounded-full bg-[var(--color-brand)] transition-all" style={{ width: `${goalProgressPct}%` }} />
          </div>
          <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
            {stats.totalProspects} prospects in the database, {stats.won} won so far. There isn't enough monthly
            history yet to project a real pace — that becomes possible once a few months of won/lost data build up.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total prospects" value={formatNumber(stats.totalProspects)} icon={Users} />
        <StatCard label="New this week" value={formatNumber(stats.newThisWeek)} icon={Users} />
        <StatCard label="Contacted" value={formatNumber(stats.contacted)} icon={Send} />
        <StatCard label="Replies" value={formatNumber(stats.replied)} icon={MessageSquareReply} />
        <StatCard label="Positive replies" value={formatNumber(stats.positiveReplies)} icon={ThumbsUp} />
        <StatCard label="Meetings" value={formatNumber(stats.meetings)} icon={CalendarCheck} />
        <StatCard label="Free pilots" value={formatNumber(stats.freePilots)} icon={Gift} />
        <StatCard label="Proposals" value={formatNumber(stats.proposalsSent)} icon={FileText} />
        <StatCard label="Won clients" value={formatNumber(stats.won)} icon={Trophy} />
        <StatCard label="Lost leads" value={formatNumber(stats.lost)} icon={XCircle} />
        <StatCard label="Monthly recurring revenue" value={formatCurrencyEUR(stats.mrr)} icon={Wallet} hint="Active clients" />
        <StatCard label="Pipeline value" value={formatCurrencyEUR(stats.pipelineValue)} icon={TrendingUp} hint="Open deals" />
        <StatCard label="Conversion rate" value={formatPercent(stats.conversionRate)} icon={Percent} hint="Contacted → Won" />
        <StatCard label="Avg. deal value" value={formatCurrencyEUR(stats.averageDealValue)} icon={Wallet} hint="Per active client" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Lead funnel</CardTitle>
              <CardDescription>Prospects → contacted → replies → meetings → pilots → proposals → clients</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <FunnelViz stages={funnelStages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Pipeline value by stage</CardTitle>
              <CardDescription>Estimated deal value currently sitting in each open stage</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <PipelineValueChart data={pipelineByStage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Outreach activity</CardTitle>
              <CardDescription>Monthly contacted / replies / meetings trend</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No outreach activity yet"
              description="This will start filling in once the team sends the first real outreach message."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly revenue</CardTitle>
              <CardDescription>Monthly recurring revenue trend</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No revenue yet"
              description="This will start filling in once the first client signs on."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Content production</CardTitle>
              <CardDescription>Posts published per month across active clients</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {realClients.length === 0 ? (
              <EmptyState title="No clients yet" description="Content production tracking starts with your first client." />
            ) : (
              <ContentProductionChart data={contentProductionData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Client retention</CardTitle>
              <CardDescription>Active vs. paused vs. churned clients</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {realClients.length === 0 ? (
              <EmptyState title="No clients yet" />
            ) : (
              <RetentionBar {...retention} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Prospects by country</CardTitle>
              <CardDescription>Where the {formatNumber(stats.totalProspects)} real prospects are based</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <CountryBreakdownChart data={countryBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Contact data quality</CardTitle>
              <CardDescription>How much of the database is independently verified</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <VerificationBreakdownBar
              verified={verificationBreakdown.verified}
              partiallyVerified={verificationBreakdown.partiallyVerified}
              needsVerification={verificationBreakdown.needsVerification}
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[var(--color-ink-secondary)]">
              <div>
                <p className="tabular-nums text-lg font-semibold text-[var(--color-ink)]">
                  {formatPercent((verificationBreakdown.withEmail / Math.max(stats.totalProspects, 1)) * 100)}
                </p>
                <p>have a verified email</p>
              </div>
              <div>
                <p className="tabular-nums text-lg font-semibold text-[var(--color-ink)]">
                  {formatPercent((verificationBreakdown.withPhone / Math.max(stats.totalProspects, 1)) * 100)}
                </p>
                <p>have a verified phone</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

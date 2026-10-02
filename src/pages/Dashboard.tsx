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
} from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { computeCrmStats } from '@/lib/metrics'
import { formatCurrencyEUR, formatNumber, formatPercent } from '@/lib/utils'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { FunnelViz, PipelineValueChart, ContentProductionChart, RetentionBar } from '@/components/dashboard/Charts'
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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your commercial pipeline and content production at a glance — real data only."
      />

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
      </div>
    </div>
  )
}

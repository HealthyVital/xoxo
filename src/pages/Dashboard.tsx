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
import { PageHeader, DemoDataBanner } from '@/components/ui/Misc'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import {
  FunnelViz,
  OutreachActivityChart,
  RevenueChart,
  PipelineValueChart,
  ContentProductionChart,
  RetentionBar,
} from '@/components/dashboard/Charts'
import { SEED_DEMO_ANALYTICS } from '@/data/seedData'
import { PIPELINE_STAGES } from '@/types'

export default function Dashboard() {
  const { prospects, clients } = useDataStore()
  const stats = useMemo(() => computeCrmStats(prospects, clients), [prospects, clients])

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

  const outreachActivityData = SEED_DEMO_ANALYTICS.map((m) => ({
    month: m.month.slice(5),
    contacted: m.contacted,
    replies: m.replies,
    meetings: m.meetings,
  }))

  const revenueData = SEED_DEMO_ANALYTICS.map((m) => ({ month: m.month.slice(5), mrr: m.mrr }))

  const pipelineByStage = useMemo(() => {
    return PIPELINE_STAGES.filter((s) => !['Won', 'Lost'].includes(s)).map((stage) => ({
      stage,
      value: prospects.filter((p) => p.status === stage).reduce((sum, p) => sum + (p.dealValue ?? 0), 0),
    }))
  }, [prospects])

  const contentProductionData = useMemo(() => {
    const months = new Map<string, number>()
    for (const c of clients) {
      for (const h of c.history) {
        months.set(h.period, (months.get(h.period) ?? 0) + h.postsPublished)
      }
    }
    return Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, posts]) => ({ month: month.slice(5), posts }))
  }, [clients])

  const retention = useMemo(() => {
    const active = clients.filter((c) => c.status === 'Active').length
    const paused = clients.filter((c) => c.status === 'Paused').length
    const churned = clients.filter((c) => c.status === 'Churned').length
    return { active, paused, churned }
  }, [clients])

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your commercial pipeline and content production at a glance."
      />
      <DemoDataBanner />

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
              <CardTitle>Outreach activity (demo)</CardTitle>
              <CardDescription>Monthly contacted / replies / meetings</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <OutreachActivityChart data={outreachActivityData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly revenue (demo)</CardTitle>
              <CardDescription>Monthly recurring revenue trend</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Content production (demo)</CardTitle>
              <CardDescription>Posts published per month across active clients</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ContentProductionChart data={contentProductionData} />
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
            <RetentionBar {...retention} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

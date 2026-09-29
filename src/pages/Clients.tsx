import { Link } from 'react-router-dom'
import { PageHeader, DemoDataBanner } from '@/components/ui/Misc'
import { Card } from '@/components/ui/Card'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { useDataStore } from '@/store/DataStoreContext'
import { formatCurrencyEUR, formatDate } from '@/lib/utils'
import { SEED_PRICING_PACKAGES } from '@/data/seedData'

export default function Clients() {
  const { clients } = useDataStore()

  return (
    <div>
      <PageHeader title="Clients" description="Active and past content clients." />
      <DemoDataBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((c) => {
          const pkg = SEED_PRICING_PACKAGES.find((p) => p.id === c.packageId)
          const latest = c.history[c.history.length - 1]
          return (
            <Link key={c.id} to={`/app/clients/${c.id}`}>
              <Card className="h-full p-5 transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-start justify-between">
                  <p className="font-semibold text-[var(--color-ink)]">{c.companyName}</p>
                  {c.isDemo && <DemoBadge />}
                </div>
                <p className="mb-3 text-xs text-[var(--color-ink-muted)]">{c.industry}</p>
                <div className="mb-3 flex items-center gap-2">
                  <Badge tone="brand">{pkg?.name}</Badge>
                  <Badge tone={c.status === 'Active' ? 'good' : c.status === 'Paused' ? 'warning' : 'critical'}>{c.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[var(--color-ink-muted)]">MRR</p>
                    <p className="tabular-nums font-medium text-[var(--color-ink)]">{formatCurrencyEUR(c.mrr)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--color-ink-muted)]">Client since</p>
                    <p className="font-medium text-[var(--color-ink)]">{formatDate(c.startDate)}</p>
                  </div>
                  {latest && (
                    <>
                      <div>
                        <p className="text-[var(--color-ink-muted)]">Latest reach</p>
                        <p className="tabular-nums font-medium text-[var(--color-ink)]">{latest.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[var(--color-ink-muted)]">Engagement</p>
                        <p className="tabular-nums font-medium text-[var(--color-ink)]">{latest.engagementRate}%</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

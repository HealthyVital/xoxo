import { PageHeader } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { VERTICALS, VERTICAL_STRATEGIES } from '@/data/verticals'
import { useDataStore } from '@/store/DataStoreContext'
import { AlertTriangle } from 'lucide-react'

export default function Verticals() {
  const { prospects } = useDataStore()

  return (
    <div>
      <PageHeader
        title="Vertical strategies"
        description="Content playbooks by industry — used to personalize outreach and drive the Content Studio."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {VERTICALS.map((v) => {
          const strategy = VERTICAL_STRATEGIES[v]
          const count = prospects.filter((p) => p.industry === v).length
          return (
            <Card key={v}>
              <CardHeader>
                <div>
                  <CardTitle>{v}</CardTitle>
                  <CardDescription>{strategy.summary}</CardDescription>
                </div>
                <Badge tone="brand">{count} prospects</Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-xs font-semibold text-[var(--color-ink-muted)]">Content ideas</p>
                <div className="flex flex-wrap gap-1.5">
                  {strategy.contentIdeas.map((idea) => (
                    <Badge key={idea} tone="neutral">
                      {idea}
                    </Badge>
                  ))}
                </div>
                {strategy.cautions && (
                  <div className="mt-4 flex gap-2 rounded-lg bg-[color-mix(in_oklab,var(--color-warning)_12%,white)] p-3 text-xs text-[#8a5a00]">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <ul className="space-y-1">
                      {strategy.cautions.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

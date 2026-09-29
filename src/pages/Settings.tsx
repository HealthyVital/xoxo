import { PageHeader } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useDataStore } from '@/store/DataStoreContext'
import { PlugZap, Download, Trash2, ShieldCheck } from 'lucide-react'

const INTEGRATIONS = [
  { name: 'Supabase', note: 'Swap the localStorage layer for a real database + auth.' },
  { name: 'Google Analytics', note: 'Pull real website traffic into Client Reports.' },
  { name: 'Meta (Facebook/Instagram)', note: 'Pull real reach, engagement and DM data.' },
  { name: 'LinkedIn', note: 'Automate LinkedIn DM outreach and analytics.' },
  { name: 'TikTok', note: 'Pull real TikTok performance data.' },
  { name: 'Gmail', note: 'Send and track real outreach emails.' },
  { name: 'Microsoft Outlook', note: 'Send and track real outreach emails.' },
  { name: 'Google Calendar', note: 'Sync discovery calls and shoot dates.' },
  { name: 'Calendly', note: 'Real booking links for discovery calls.' },
  { name: 'Stripe', note: 'Real billing for monthly content packages.' },
]

export default function Settings() {
  const { prospects, resetDemoData } = useDataStore()
  const doNotContactCount = prospects.filter((p) => p.doNotContact).length

  function exportAll() {
    const blob = new Blob([JSON.stringify(prospects, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all-prospects-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader title="Settings" description="Data, privacy and integration status for this workspace." />

      <Card className="mb-6">
        <CardHeader>
          <div>
            <CardTitle>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={15} /> GDPR & data quality
              </span>
            </CardTitle>
            <CardDescription>
              Every prospect tracks its source, verification status and consent notes. Nothing here represents
              verified contact information unless explicitly marked "Verified".
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-hairline)] p-3 text-sm">
            <span>Prospects marked Do Not Contact</span>
            <Badge tone="critical">{doNotContactCount}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportAll}>
              <Download size={14} /> Export all prospect data (JSON)
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('Reset ALL local data back to the seed dataset? This deletes anything you have added or edited.')) {
                  resetDemoData()
                }
              }}
            >
              <Trash2 size={14} /> Reset to seed data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              This MVP runs fully offline on local data. Everything below is a planned integration point — connect
              real credentials later without changing how the CRM works.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {INTEGRATIONS.map((i) => (
            <div key={i.name} className="flex items-start justify-between gap-3 rounded-lg border border-dashed border-[var(--color-hairline)] p-3">
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">{i.name}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{i.note}</p>
              </div>
              <Badge tone="neutral" className="shrink-0">
                <PlugZap size={11} /> Not Connected
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

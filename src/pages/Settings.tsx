import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useDataStore } from '@/store/DataStoreContext'
import { useAuthEmail } from '@/components/layout/AuthGate'
import {
  isIntegrationsConfigured,
  getIntegrationStatus,
  startOAuth,
  disconnectIntegration,
  type IntegrationService,
  type IntegrationStatus,
} from '@/lib/integrations'
import { PlugZap, Download, Trash2, ShieldCheck, CheckCircle2, X } from 'lucide-react'

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
] as const

const GOOGLE_INTEGRATIONS = new Set(['Gmail', 'Google Calendar'])
const SERVICE_FOR_NAME: Record<string, IntegrationService> = { Gmail: 'gmail', 'Google Calendar': 'calendar' }

export default function Settings() {
  const { prospects, resetDemoData } = useDataStore()
  const authEmail = useAuthEmail()
  const [searchParams, setSearchParams] = useSearchParams()

  const configured = isIntegrationsConfigured()
  const [status, setStatus] = useState<IntegrationStatus>({ gmail: false, calendar: false })
  const [busyService, setBusyService] = useState<IntegrationService | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const doNotContactCount = prospects.filter((p) => p.doNotContact).length

  // Load current connection status for the signed-in team member.
  useEffect(() => {
    if (!configured || !authEmail) return
    let cancelled = false
    getIntegrationStatus(authEmail).then((result) => {
      if (!cancelled) setStatus(result)
    })
    return () => {
      cancelled = true
    }
  }, [configured, authEmail])

  // The Worker's OAuth callback redirects back here with ?connected=gmail|calendar
  // or ?error=... — surface that once, then strip it from the URL.
  useEffect(() => {
    const connected = searchParams.get('connected')
    const errorParam = searchParams.get('error')
    if (connected === 'gmail') setBanner('Gmail connected successfully.')
    else if (connected === 'calendar') setBanner('Google Calendar connected successfully.')
    if (errorParam) setActionError(`Google sign-in didn't complete (${errorParam}). Please try again.`)
    if (connected || errorParam) {
      const next = new URLSearchParams(searchParams)
      next.delete('connected')
      next.delete('error')
      setSearchParams(next, { replace: true })
    }
    // Only run once on mount — this reads the redirect query string exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function exportAll() {
    const blob = new Blob([JSON.stringify(prospects, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all-prospects-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleConnect(service: IntegrationService, label: string) {
    if (!authEmail) return
    setActionError(null)
    try {
      startOAuth(authEmail, service)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Could not start the ${label} connection.`)
    }
  }

  async function handleDisconnect(service: IntegrationService, label: string) {
    if (!authEmail) return
    setActionError(null)
    setBusyService(service)
    try {
      await disconnectIntegration(authEmail, service)
      setStatus((s) => ({ ...s, [service]: false }))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Could not disconnect ${label}.`)
    } finally {
      setBusyService(null)
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Data, privacy and integration status for this workspace." />

      {banner && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[var(--color-good)]/25 bg-[color-mix(in_oklab,var(--color-good)_10%,white)] px-3 py-2 text-xs text-[var(--color-good)]">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={14} /> {banner}
          </span>
          <button onClick={() => setBanner(null)} aria-label="Dismiss" className="text-[var(--color-good)]">
            <X size={14} />
          </button>
        </div>
      )}
      {actionError && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[var(--color-critical)]/25 bg-[color-mix(in_oklab,var(--color-critical)_8%,white)] px-3 py-2 text-xs text-[var(--color-critical)]">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} aria-label="Dismiss" className="text-[var(--color-critical)]">
            <X size={14} />
          </button>
        </div>
      )}

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
              Gmail and Google Calendar connect to your own account below. Everything else is a planned integration
              point — connect real credentials later without changing how the CRM works.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {INTEGRATIONS.map((i) => {
            if (!GOOGLE_INTEGRATIONS.has(i.name)) {
              return (
                <div
                  key={i.name}
                  className="flex items-start justify-between gap-3 rounded-lg border border-dashed border-[var(--color-hairline)] p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-ink)]">{i.name}</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">{i.note}</p>
                  </div>
                  <Badge tone="neutral" className="shrink-0">
                    <PlugZap size={11} /> Not Connected
                  </Badge>
                </div>
              )
            }

            const service = SERVICE_FOR_NAME[i.name]
            const isConnected = status[service]
            const isBusy = busyService === service

            return (
              <div
                key={i.name}
                className="flex items-start justify-between gap-3 rounded-lg border border-dashed border-[var(--color-hairline)] p-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">{i.name}</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">{i.note}</p>
                  {!configured && (
                    <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
                      Ask an admin to finish backend setup — see INTEGRATIONS_SETUP.md.
                    </p>
                  )}
                </div>

                {!configured ? (
                  <Badge tone="neutral" className="shrink-0">
                    <PlugZap size={11} /> Not Connected
                  </Badge>
                ) : isConnected ? (
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Badge tone="good">
                      <CheckCircle2 size={11} /> Connected
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect(service, i.name)} disabled={isBusy}>
                      {isBusy ? 'Disconnecting…' : 'Disconnect'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => handleConnect(service, i.name)}
                    disabled={!authEmail}
                  >
                    <PlugZap size={12} /> Connect {i.name}
                  </Button>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

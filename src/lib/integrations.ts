// ---------------------------------------------------------------------------
// Thin client for the optional Cloudflare Worker backend that powers real
// Gmail-send / Google-Calendar integrations (see worker/ at the repo root
// and INTEGRATIONS_SETUP.md for how an admin deploys it).
//
// Critical behavior: until VITE_INTEGRATIONS_API_URL is set (build-time env
// var, wired in .github/workflows/deploy.yml from a repo secret), this file
// must make the rest of the app behave exactly as it did before any of this
// existed — no network calls, no thrown errors on render, just
// "integrations unavailable". Every export below is written with that as
// the default path.
// ---------------------------------------------------------------------------

export type IntegrationService = 'gmail' | 'calendar'

export interface IntegrationStatus {
  gmail: boolean
  calendar: boolean
}

function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_INTEGRATIONS_API_URL as string | undefined
  return (raw ?? '').trim().replace(/\/$/, '')
}

/** Whether an admin has finished the backend setup (see INTEGRATIONS_SETUP.md).
 *  An empty string counts the same as unset — Vite still defines the env var
 *  at build time even when the GitHub secret backing it is empty. */
export function isIntegrationsConfigured(): boolean {
  return getApiBaseUrl() !== ''
}

async function safeJson(res: Response): Promise<any> {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export async function getIntegrationStatus(email: string | null | undefined): Promise<IntegrationStatus> {
  const base = getApiBaseUrl()
  if (!base || !email) return { gmail: false, calendar: false }
  try {
    const res = await fetch(`${base}/oauth/status?email=${encodeURIComponent(email)}`)
    if (!res.ok) return { gmail: false, calendar: false }
    const data = await safeJson(res)
    return { gmail: Boolean(data?.gmail), calendar: Boolean(data?.calendar) }
  } catch {
    // Network failure, worker not deployed yet, CORS misconfigured, etc. —
    // degrade to "not connected" rather than breaking the Settings page.
    return { gmail: false, calendar: false }
  }
}

/** Navigates the browser to the Worker's OAuth start endpoint. Throws a
 *  plain Error (for the caller to catch and display) if integrations
 *  aren't configured — it never silently navigates to a broken URL. */
export function startOAuth(email: string, service: IntegrationService): void {
  const base = getApiBaseUrl()
  if (!base) {
    throw new Error("Integrations aren't configured yet. Ask an admin to finish backend setup — see INTEGRATIONS_SETUP.md.")
  }
  const url = `${base}/oauth/start?email=${encodeURIComponent(email)}&service=${service}`
  window.location.href = url
}

export async function disconnectIntegration(email: string, service: IntegrationService): Promise<void> {
  const base = getApiBaseUrl()
  if (!base) return
  const res = await fetch(`${base}/oauth/disconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, service }),
  })
  if (!res.ok) {
    const data = await safeJson(res)
    throw new Error(data?.error ?? 'Could not disconnect this integration.')
  }
}

export interface SendGmailArgs {
  fromEmail: string
  to: string
  subject: string
  body: string
}

export async function sendGmail(args: SendGmailArgs): Promise<{ ok: true; messageId: string }> {
  const base = getApiBaseUrl()
  if (!base) throw new Error("Integrations aren't configured yet.")
  const res = await fetch(`${base}/gmail/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  const data = await safeJson(res)
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? 'Gmail send failed.')
  }
  return data as { ok: true; messageId: string }
}

export interface CreateCalendarEventArgs {
  fromEmail: string
  summary: string
  description: string
  startIso: string
  endIso: string
}

// ---------------------------------------------------------------------------
// Public lead capture — closes the gap where a real visitor's quiz/audit
// submission would otherwise only ever live in that visitor's own browser
// (see worker/src/index.ts's comment above leadsSubmit for the full flow).
// ---------------------------------------------------------------------------
export type PublicLeadKind = 'quiz' | 'audit'

export interface PendingLead {
  id: string
  kind: PublicLeadKind
  payload: unknown
  submittedAt: string
}

/** Fire-and-forget: the public quiz/audit must work standalone (localStorage
 *  only) even when this fails or integrations aren't configured — this is a
 *  progressive enhancement, never a requirement for the form to "succeed". */
export async function submitPublicLead(kind: PublicLeadKind, payload: unknown): Promise<void> {
  const base = getApiBaseUrl()
  if (!base) return
  try {
    await fetch(`${base}/leads/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, payload }),
    })
  } catch {
    // Network failure, Worker not deployed, etc. — the local record (already
    // saved via addQuizSubmission/addFreeAuditSubmission) is still there.
  }
}

/** Used only from the authenticated CRM, by a team member, to pull in real
 *  leads submitted on the public site since anyone last synced. */
export async function fetchPendingLeads(email: string): Promise<PendingLead[]> {
  const base = getApiBaseUrl()
  if (!base) return []
  try {
    const res = await fetch(`${base}/leads/pending?email=${encodeURIComponent(email)}`)
    if (!res.ok) return []
    const data = await safeJson(res)
    return Array.isArray(data?.leads) ? (data.leads as PendingLead[]) : []
  } catch {
    return []
  }
}

/** Deletes the given leads from the Worker's pending queue once they've been
 *  merged into local data — prevents re-importing the same lead twice. */
export async function claimLeads(email: string, ids: string[]): Promise<void> {
  const base = getApiBaseUrl()
  if (!base || ids.length === 0) return
  try {
    await fetch(`${base}/leads/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ids }),
    })
  } catch {
    // Best-effort — if this fails, the lead stays in the Worker's queue and
    // is simply re-synced (and re-deduped locally) next time.
  }
}

export async function createCalendarEvent(
  args: CreateCalendarEventArgs,
): Promise<{ ok: true; eventId: string; htmlLink: string | null }> {
  const base = getApiBaseUrl()
  if (!base) throw new Error("Integrations aren't configured yet.")
  const res = await fetch(`${base}/calendar/create-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  })
  const data = await safeJson(res)
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? 'Calendar event creation failed.')
  }
  return data as { ok: true; eventId: string; htmlLink: string | null }
}

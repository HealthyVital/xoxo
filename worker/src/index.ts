// ---------------------------------------------------------------------------
// xoxo-integrations — Cloudflare Worker
//
// Confidential-client backend for the Rotterdam Content CRM's real Gmail-send
// and Google-Calendar integrations. The CRM itself is a static site (GitHub
// Pages) with no server, so anything that needs a client secret or a place to
// store refresh tokens has to live here instead. See INTEGRATIONS_SETUP.md at
// the repo root for deployment steps, and src/lib/integrations.ts on the
// frontend for the client that calls this Worker.
//
// Written as a single plain `fetch` handler (no framework) to keep this
// dependency-light — there is nothing here complex enough to need routing
// middleware.
// ---------------------------------------------------------------------------

// ---- Minimal ambient Workers types -----------------------------------------
// We intentionally do NOT depend on @cloudflare/workers-types so this file
// can be type-checked (`npx tsc --noEmit`) without `npm install` in worker/.
// Only the handful of runtime APIs actually used below are declared.
interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>
}

interface Env {
  /** KV namespace storing one entry per `${service}:${email}` holding the
   *  Google refresh token (JSON-encoded) for that team member + service. */
  TOKENS: KVNamespace
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  /** Random string used to HMAC-sign the OAuth `state` param. Set via
   *  `wrangler secret put STATE_SIGNING_SECRET`. */
  STATE_SIGNING_SECRET: string
  /** Base URL of the deployed CRM, e.g. "https://healthyvital.github.io/xoxo"
   *  in production or "http://localhost:5173" for local dev. No trailing
   *  slash. Used to build the post-OAuth redirect back to Settings. */
  APP_ORIGIN: string
}

// ---------------------------------------------------------------------------
// Team allowlist
//
// MUST be kept identical to ALLOWED_TEAM_EMAILS in
// ../../src/lib/auth.ts — there is no shared package between the frontend
// and this Worker, so the list is duplicated on purpose. If you add/remove a
// team member, update BOTH files.
// ---------------------------------------------------------------------------
const ALLOWED_TEAM_EMAILS = [
  'dima.gorba4ev123@gmail.com',
  'agrita.gorbacova@gmail.com',
  'yogi_khasha@proton.me',
  'schneiderswk7@gmail.com',
  'vineta.onckule@gmail.com',
]

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isAllowedTeamEmail(email: string): boolean {
  return ALLOWED_TEAM_EMAILS.includes(normalizeEmail(email))
}

// ---------------------------------------------------------------------------
// CORS — only the real app origin + local dev are ever allowed.
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = ['https://healthyvital.github.io', 'http://localhost:5173']

function corsHeadersFor(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

function jsonResponse(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeadersFor(origin),
    },
  })
}

function handleOptions(origin: string | null): Response {
  return new Response(null, { status: 204, headers: corsHeadersFor(origin) })
}

// ---------------------------------------------------------------------------
// base64url helpers (Workers expose global btoa/atob, which only handle
// Latin1 strings — these go through TextEncoder/TextDecoder for real UTF-8).
// ---------------------------------------------------------------------------
function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlEncode(input: string): string {
  return bytesToBase64Url(new TextEncoder().encode(input))
}

function base64UrlDecodeToString(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/')
  const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4)
  const binary = atob(withPadding)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

// ---------------------------------------------------------------------------
// OAuth `state` signing (HMAC-SHA256 over a short-lived JSON payload) —
// prevents a forged `state` from being accepted at /oauth/callback.
// ---------------------------------------------------------------------------
type ServiceName = 'gmail' | 'calendar'

interface StatePayload {
  email: string
  service: ServiceName
  nonce: string
  exp: number // epoch ms
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return bytesToBase64Url(new Uint8Array(sig))
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

async function signState(payload: StatePayload, secret: string): Promise<string> {
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  const sig = await hmacSign(payloadB64, secret)
  return `${payloadB64}.${sig}`
}

async function verifyState(state: string, secret: string): Promise<StatePayload | null> {
  const parts = state.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sig] = parts
  const expectedSig = await hmacSign(payloadB64, secret)
  if (!timingSafeEqual(sig, expectedSig)) return null
  try {
    const payload = JSON.parse(base64UrlDecodeToString(payloadB64)) as StatePayload
    if (!payload || typeof payload.email !== 'string' || typeof payload.exp !== 'number') return null
    if (Date.now() > payload.exp) return null
    if (payload.service !== 'gmail' && payload.service !== 'calendar') return null
    return payload
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Token storage
// ---------------------------------------------------------------------------
interface StoredToken {
  refreshToken: string
  connectedAt: string
}

function tokenKey(service: ServiceName, email: string): string {
  return `${service}:${email}`
}

class IntegrationError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

/** Exchanges the stored refresh token for a fresh access token. Never logs
 *  or returns either token. */
async function getAccessTokenForService(env: Env, service: ServiceName, email: string): Promise<string> {
  const raw = await env.TOKENS.get(tokenKey(service, email))
  if (!raw) {
    const label = service === 'gmail' ? 'Gmail' : 'Google Calendar'
    throw new IntegrationError(`${label} is not connected for ${email}. Connect it from Settings first.`, 409)
  }
  let stored: StoredToken
  try {
    stored = JSON.parse(raw) as StoredToken
  } catch {
    throw new IntegrationError('Stored credentials are corrupted — please reconnect this account in Settings.', 500)
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: stored.refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = (await tokenRes.json()) as { access_token?: string; error?: string; error_description?: string }
  if (!tokenRes.ok || !data.access_token) {
    throw new IntegrationError('Could not refresh the Google access token — please reconnect this account in Settings.', 401)
  }
  return data.access_token
}

function handleIntegrationError(err: unknown, origin: string | null): Response {
  if (err instanceof IntegrationError) {
    return jsonResponse({ ok: false, error: err.message }, err.status, origin)
  }
  return jsonResponse({ ok: false, error: 'Unexpected error talking to Google.' }, 500, origin)
}

async function readJsonBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// OAuth scopes
// ---------------------------------------------------------------------------
const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.send'
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events'

function redirectToApp(env: Env, query: string): Response {
  const target = `${env.APP_ORIGIN.replace(/\/$/, '')}/app/settings?${query}`
  return Response.redirect(target, 302)
}

// ---------------------------------------------------------------------------
// GET /oauth/start?email=&service=
// ---------------------------------------------------------------------------
async function oauthStart(url: URL, env: Env): Promise<Response> {
  const email = normalizeEmail(url.searchParams.get('email') ?? '')
  const service = url.searchParams.get('service')

  if (!email || !isAllowedTeamEmail(email)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, null)
  }
  if (service !== 'gmail' && service !== 'calendar') {
    return jsonResponse({ ok: false, error: 'service must be "gmail" or "calendar".' }, 400, null)
  }

  const payload: StatePayload = {
    email,
    service,
    nonce: crypto.randomUUID(),
    exp: Date.now() + 10 * 60 * 1000, // 10 minutes
  }
  const state = await signState(payload, env.STATE_SIGNING_SECRET)
  const redirectUri = new URL('/oauth/callback', url).toString()
  const scope = service === 'gmail' ? GMAIL_SCOPE : CALENDAR_SCOPE

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('access_type', 'offline')
  // Forces Google to re-issue a refresh_token even if this team member
  // already granted consent before (otherwise a silent re-auth returns no
  // refresh_token at all).
  authUrl.searchParams.set('prompt', 'consent')
  authUrl.searchParams.set('state', state)

  return Response.redirect(authUrl.toString(), 302)
}

// ---------------------------------------------------------------------------
// GET /oauth/callback?code=&state=
// ---------------------------------------------------------------------------
async function oauthCallback(url: URL, env: Env): Promise<Response> {
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const errorParam = url.searchParams.get('error')

  if (errorParam) {
    return redirectToApp(env, `error=${encodeURIComponent(errorParam)}`)
  }
  if (!code || !state) {
    return jsonResponse({ ok: false, error: 'Missing code or state.' }, 400, null)
  }

  const payload = await verifyState(state, env.STATE_SIGNING_SECRET)
  if (!payload) {
    return jsonResponse({ ok: false, error: 'Invalid or expired OAuth state. Please try connecting again.' }, 400, null)
  }
  if (!isAllowedTeamEmail(payload.email)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, null)
  }

  const redirectUri = new URL('/oauth/callback', url).toString()
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const data = (await tokenRes.json()) as {
    refresh_token?: string
    access_token?: string
    error?: string
    error_description?: string
  }

  if (!tokenRes.ok || !data.refresh_token) {
    // Never log the token response body — it can carry token material even
    // on partial failures. Just redirect with a generic error code.
    return redirectToApp(env, `error=${encodeURIComponent('no_refresh_token')}`)
  }

  const stored: StoredToken = { refreshToken: data.refresh_token, connectedAt: new Date().toISOString() }
  await env.TOKENS.put(tokenKey(payload.service, payload.email), JSON.stringify(stored))

  return redirectToApp(env, `connected=${payload.service}`)
}

// ---------------------------------------------------------------------------
// GET /oauth/status?email=
// ---------------------------------------------------------------------------
async function oauthStatus(url: URL, env: Env, origin: string | null): Promise<Response> {
  const email = normalizeEmail(url.searchParams.get('email') ?? '')
  if (!email || !isAllowedTeamEmail(email)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, origin)
  }
  const [gmail, calendar] = await Promise.all([
    env.TOKENS.get(tokenKey('gmail', email)),
    env.TOKENS.get(tokenKey('calendar', email)),
  ])
  return jsonResponse({ gmail: gmail !== null, calendar: calendar !== null }, 200, origin)
}

// ---------------------------------------------------------------------------
// POST /oauth/disconnect  { email, service }
// ---------------------------------------------------------------------------
async function oauthDisconnect(request: Request, env: Env, origin: string | null): Promise<Response> {
  const body = await readJsonBody<{ email?: string; service?: string }>(request)
  const email = normalizeEmail(body?.email ?? '')
  const service = body?.service

  if (!email || !isAllowedTeamEmail(email)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, origin)
  }
  if (service !== 'gmail' && service !== 'calendar') {
    return jsonResponse({ ok: false, error: 'service must be "gmail" or "calendar".' }, 400, origin)
  }

  await env.TOKENS.delete(tokenKey(service, email))
  return jsonResponse({ ok: true }, 200, origin)
}

// ---------------------------------------------------------------------------
// POST /gmail/send  { fromEmail, to, subject, body }
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function toBase64(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
}

function wrapAt76(value: string): string {
  const lines: string[] = []
  for (let i = 0; i < value.length; i += 76) lines.push(value.slice(i, i + 76))
  return lines.join('\r\n')
}

/** Builds a base64url-encoded raw RFC 2822 message, as the Gmail API expects
 *  for users.messages.send. Plain text only (no attachments/HTML) — that's
 *  all the Outreach templates need today. */
function buildRawEmail(args: { from: string; to: string; subject: string; body: string }): string {
  const encodedSubject = `=?UTF-8?B?${toBase64(new TextEncoder().encode(args.subject))}?=`
  const encodedBody = wrapAt76(toBase64(new TextEncoder().encode(args.body)))
  const lines = [
    `From: ${args.from}`,
    `To: ${args.to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    encodedBody,
  ]
  return base64UrlEncode(lines.join('\r\n'))
}

async function gmailSend(request: Request, env: Env, origin: string | null): Promise<Response> {
  const body = await readJsonBody<{ fromEmail?: string; to?: string; subject?: string; body?: string }>(request)
  const fromEmail = normalizeEmail(body?.fromEmail ?? '')
  const to = (body?.to ?? '').trim()
  const subject = body?.subject ?? ''
  const messageBody = body?.body ?? ''

  if (!fromEmail || !isAllowedTeamEmail(fromEmail)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, origin)
  }
  if (!EMAIL_RE.test(to)) {
    return jsonResponse({ ok: false, error: 'The recipient email address looks invalid.' }, 400, origin)
  }

  try {
    const accessToken = await getAccessTokenForService(env, 'gmail', fromEmail)
    const raw = buildRawEmail({ from: fromEmail, to, subject, body: messageBody })
    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    })
    const data = (await sendRes.json()) as { id?: string; error?: { message?: string } }
    if (!sendRes.ok || !data.id) {
      return jsonResponse({ ok: false, error: data.error?.message ?? 'Gmail refused to send the message.' }, 502, origin)
    }
    return jsonResponse({ ok: true, messageId: data.id }, 200, origin)
  } catch (err) {
    return handleIntegrationError(err, origin)
  }
}

// ---------------------------------------------------------------------------
// POST /calendar/create-event  { fromEmail, summary, description, startIso, endIso }
// ---------------------------------------------------------------------------
function isValidIsoDate(value: string): boolean {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

async function calendarCreateEvent(request: Request, env: Env, origin: string | null): Promise<Response> {
  const body = await readJsonBody<{
    fromEmail?: string
    summary?: string
    description?: string
    startIso?: string
    endIso?: string
  }>(request)
  const fromEmail = normalizeEmail(body?.fromEmail ?? '')
  const summary = (body?.summary ?? '').trim()
  const description = body?.description ?? ''
  const startIso = body?.startIso ?? ''
  const endIso = body?.endIso ?? ''

  if (!fromEmail || !isAllowedTeamEmail(fromEmail)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, origin)
  }
  if (!summary) {
    return jsonResponse({ ok: false, error: 'summary is required.' }, 400, origin)
  }
  if (!isValidIsoDate(startIso) || !isValidIsoDate(endIso)) {
    return jsonResponse({ ok: false, error: 'startIso and endIso must be valid ISO date-times.' }, 400, origin)
  }

  try {
    const accessToken = await getAccessTokenForService(env, 'calendar', fromEmail)
    const createRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary,
        description,
        start: { dateTime: startIso },
        end: { dateTime: endIso },
      }),
    })
    const data = (await createRes.json()) as { id?: string; htmlLink?: string; error?: { message?: string } }
    if (!createRes.ok || !data.id) {
      return jsonResponse({ ok: false, error: data.error?.message ?? 'Google Calendar refused to create the event.' }, 502, origin)
    }
    return jsonResponse({ ok: true, eventId: data.id, htmlLink: data.htmlLink ?? null }, 200, origin)
  } catch (err) {
    return handleIntegrationError(err, origin)
  }
}

// ---------------------------------------------------------------------------
// Public lead capture — POST /leads/submit  GET /leads/pending  POST /leads/claim
//
// The CRM itself has no server — it's a static site with localStorage
// persistence. That's fine for the authenticated team's own data, but it
// means a REAL visitor's quiz/audit submission on the public site would
// otherwise be trapped in that visitor's own browser, never reaching the
// business. These three endpoints close that gap using the same TOKENS KV
// namespace already bound for OAuth tokens (prefixed "lead:" so the two
// never collide) — no new Cloudflare resource to provision.
//
// Flow: public page POSTs the submission (fire-and-forget, no auth — anyone
// can submit, same as the public quiz itself) -> stored in KV -> next time
// any team member opens the authenticated CRM, it GETs pending leads, merges
// them into local Prospects/QuizSubmissions/FreeAuditSubmissions, then POSTs
// their ids back to /leads/claim to delete them from KV (claim-and-remove,
// so two team members opening the CRM around the same time don't double-
// import the same lead).
// ---------------------------------------------------------------------------
type LeadKind = 'quiz' | 'audit'

interface LeadRecord {
  id: string
  kind: LeadKind
  payload: unknown
  submittedAt: string
}

const MAX_LEAD_PAYLOAD_CHARS = 20000

async function leadsSubmit(request: Request, env: Env, origin: string | null): Promise<Response> {
  const body = await readJsonBody<{ kind?: string; payload?: unknown }>(request)
  if (!body || (body.kind !== 'quiz' && body.kind !== 'audit') || body.payload === undefined) {
    return jsonResponse({ ok: false, error: 'kind ("quiz" | "audit") and payload are required.' }, 400, origin)
  }
  const serialized = JSON.stringify(body.payload)
  if (serialized.length > MAX_LEAD_PAYLOAD_CHARS) {
    return jsonResponse({ ok: false, error: 'Payload too large.' }, 413, origin)
  }
  const record: LeadRecord = {
    id: crypto.randomUUID(),
    kind: body.kind,
    payload: body.payload,
    submittedAt: new Date().toISOString(),
  }
  await env.TOKENS.put(`lead:${record.id}`, JSON.stringify(record))
  return jsonResponse({ ok: true }, 200, origin)
}

async function leadsPending(url: URL, env: Env, origin: string | null): Promise<Response> {
  const email = normalizeEmail(url.searchParams.get('email') ?? '')
  if (!email || !isAllowedTeamEmail(email)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, origin)
  }
  const { keys } = await env.TOKENS.list({ prefix: 'lead:' })
  const records: LeadRecord[] = []
  for (const key of keys) {
    const raw = await env.TOKENS.get(key.name)
    if (!raw) continue
    try {
      records.push(JSON.parse(raw) as LeadRecord)
    } catch {
      // Skip a corrupted entry rather than failing the whole sync.
    }
  }
  return jsonResponse({ ok: true, leads: records }, 200, origin)
}

async function leadsClaim(request: Request, env: Env, origin: string | null): Promise<Response> {
  const body = await readJsonBody<{ email?: string; ids?: string[] }>(request)
  const email = normalizeEmail(body?.email ?? '')
  if (!email || !isAllowedTeamEmail(email)) {
    return jsonResponse({ ok: false, error: "This email isn't on the team access list." }, 403, origin)
  }
  const ids = Array.isArray(body?.ids) ? body.ids : []
  await Promise.all(ids.filter((id) => typeof id === 'string').map((id) => env.TOKENS.delete(`lead:${id}`)))
  return jsonResponse({ ok: true }, 200, origin)
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    if (request.method === 'OPTIONS') return handleOptions(origin)

    const url = new URL(request.url)
    try {
      switch (`${request.method} ${url.pathname}`) {
        case 'GET /':
          return jsonResponse({ ok: true, service: 'xoxo-integrations' }, 200, origin)
        case 'GET /oauth/start':
          return await oauthStart(url, env)
        case 'GET /oauth/callback':
          return await oauthCallback(url, env)
        case 'GET /oauth/status':
          return await oauthStatus(url, env, origin)
        case 'POST /oauth/disconnect':
          return await oauthDisconnect(request, env, origin)
        case 'POST /gmail/send':
          return await gmailSend(request, env, origin)
        case 'POST /calendar/create-event':
          return await calendarCreateEvent(request, env, origin)
        case 'POST /leads/submit':
          return await leadsSubmit(request, env, origin)
        case 'GET /leads/pending':
          return await leadsPending(url, env, origin)
        case 'POST /leads/claim':
          return await leadsClaim(request, env, origin)
        default:
          return jsonResponse({ ok: false, error: 'Not found' }, 404, origin)
      }
    } catch {
      // Never leak stack traces or error internals to the client.
      return jsonResponse({ ok: false, error: 'Internal server error.' }, 500, origin)
    }
  },
}

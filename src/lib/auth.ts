// ---------------------------------------------------------------------------
// IMPORTANT — this is NOT secure authentication.
//
// This app is a static site with no backend, no server, and no database.
// Everything below runs entirely in the visitor's browser. The email list is
// shipped inside the public JavaScript bundle, and "being logged in" is just
// a value in localStorage — anyone with browser dev tools can read the list
// or fake the stored value and get past AuthGate. Treat this as a lightweight
// access gate that keeps casual/accidental visitors out of the internal CRM,
// not as protection for genuinely confidential data. Real auth requires a
// backend (e.g. Supabase Auth) that checks credentials server-side.
// ---------------------------------------------------------------------------

// NOTE: the Cloudflare Worker backend (worker/src/index.ts) that powers real
// Gmail/Calendar integrations duplicates this exact list server-side (there's
// no shared package across the frontend/worker boundary). If you add/remove a
// team member here, update worker/src/index.ts's ALLOWED_TEAM_EMAILS too.
export const ALLOWED_TEAM_EMAILS = [
  'dima.gorba4ev123@gmail.com',
  'agrita.gorbacova@gmail.com',
  'yogi_khasha@proton.me',
  'schneiderswk7@gmail.com',
  'vineta.onckule@gmail.com',
]

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isAllowedTeamEmail(email: string): boolean {
  return ALLOWED_TEAM_EMAILS.includes(normalizeEmail(email))
}

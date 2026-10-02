# Agrita&Vin Content Co. — Sales & Content OS (MVP)

A production-quality MVP that turns a photography/videography/social-content business into a full
B2B sales machine: prospecting, lead scoring, outreach, a free-pilot workflow, proposals, a client
CRM, content production tooling, campaign management, calendar, analytics and client-facing
reporting — plus a public marketing site and a self-serve Free Content Audit.

It runs entirely **locally**, with no paid APIs and no backend required.

## Project purpose

The business (Rotterdam-based) offers event/wedding/corporate/product photography, short-form
video, Reels/TikTok/UGC content and monthly content packages, with dedicated playbooks for
hotels, travel, cosmetics/beauty, footwear/fashion, pharmacy/health retail, events/corporate and
restaurants/lifestyle. This app is the internal tool that runs the commercial side of that
business: who to contact, why, what to offer, what to say, when to follow up, whether it worked,
and whether the client can be retained and upsold.

See [`docs/product-spec.md`](docs/product-spec.md), [`docs/data-model.md`](docs/data-model.md) and
[`docs/outreach-strategy.md`](docs/outreach-strategy.md) for more detail.

## Tech stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (CSS-first theme, see `src/index.css`) — no component library (shadcn/ui
  wasn't already present in the project, so a small set of hand-built, reusable primitives lives
  in `src/components/ui`, matching the same visual language)
- **react-router-dom** for routing (public site + `/app` CRM shell)
- **recharts** for charts, styled against a validated, colorblind-safe categorical palette
- **lucide-react** for icons
- Data layer: local JSON seed data (`src/data`) + `localStorage` persistence (`src/lib/storage.ts`,
  `src/store/DataStoreContext.tsx`) — no server, no database, no paid API

## Installation

```bash
npm install
```

## Development

```bash
npm run dev      # start the Vite dev server
npm run build    # type-check (tsc -b) + production build
npm run preview  # preview the production build locally
```

The public marketing site is at `/`, the Free Content Audit at `/audit`, and the CRM app lives
under `/app/*` (dashboard, prospects, pipeline, outreach, content studio, verticals, free pilot,
proposals, clients, campaigns, analytics, client reports, calendar, templates, pricing, settings).

## Access control — read this before treating it as real security

`/app/*` is gated by an email allowlist (`src/lib/auth.ts`, `src/components/layout/AuthGate.tsx`):
a visitor types an email, and if it's one of a fixed set of team addresses, the app unlocks and the
choice is remembered in that browser's `localStorage`.

**This is not secure authentication, and it isn't meant to be treated as one.** This project is a
static site with no backend, no server, and no database, so there is nothing to check credentials
against except code running in the visitor's own browser:

- The allowed email list ships inside the public JavaScript bundle — anyone can read it by viewing
  the page source or the network tab.
- "Being logged in" is just a value in `localStorage`. Anyone who opens browser dev tools can set
  that value themselves and get in without knowing any of the allowed emails at all.
- There is no password, no verification that the visitor actually owns the email they typed, and
  no server-side check of any kind.

Use it to keep casual or accidental visitors off the internal CRM pages — not to protect anything
genuinely confidential. Real access control requires a real backend (e.g. Supabase Auth with row-
level security), which is exactly the kind of upgrade the architecture notes below are written for.

## Environment variables

**None are required to run the app.** See [`.env.example`](.env.example) for placeholders covering
every future integration listed below — they're commented out on purpose. The one exception is
`VITE_INTEGRATIONS_API_URL`, used by the real Gmail/Calendar integration described below — see
[`INTEGRATIONS_SETUP.md`](INTEGRATIONS_SETUP.md).

## Data & demo data — read this before showing the app to anyone

- **Real data:** `src/data/prospects.real.json` contains ~82 real, named Rotterdam-area companies
  (hotels, cosmetics/beauty stores, footwear/fashion retailers, pharmacies, event venues,
  restaurants, travel agencies), each found via a live web search. **No contact person, phone
  number, email address or social handle was invented for any of them** — those fields are left
  empty and `verificationStatus` is `"Needs Verification"` until someone actually verifies them.
  Every record carries `source`, `sourceUrl` and `lastVerified` so it can be audited and enriched.
  Lead scores for this list are a conservative baseline (vertical fit + known chain status only) —
  the score explicitly tells you what hasn't been verified yet (Instagram/TikTok activity,
  promotions, etc.) so a rep knows what to check before prioritizing a lead.
- **Why not exactly 200 real companies?** The spec asked for ~200 seeded prospects across 7
  verticals. Reaching 200 *real, named, sourced* Rotterdam companies without inventing anything
  would require far more individual research/verification than a single session of web searches
  responsibly supports — and the same spec explicitly forbids inventing company or contact
  information. Rather than pad the list with fabricated business names, this MVP ships the ~82
  companies that were actually verified to exist, with the tooling (CSV export on the Prospects
  page, a manual "Add prospect" form with the full lead-scoring checklist) needed to grow the list
  responsibly. Treat this as a real starting seed, not a finished list.
- **Demo data:** everything needed to make the CRM *feel* alive — pipeline deals in every stage,
  a communication history, won clients with monthly performance history, campaigns and a content
  calendar — is clearly synthetic and lives in `src/data/*.demo.json`. Every demo company name is
  prefixed `(Demo)`, every demo record carries `isDemo: true`, and a purple "Demo" badge plus a
  banner appears anywhere this data is shown. **None of it represents a real client or a real
  result.** Reset it any time from Settings → "Reset to seed data".

## Architecture notes (for adding Supabase later)

The whole app is written against a single data-access seam:

- `src/store/DataStoreContext.tsx` exposes one `useDataStore()` hook with typed CRUD-style
  mutators (`addProspect`, `updateProspect`, `logCommunication`, `addClient`, …). Every page reads
  and writes through this hook — no component talks to `localStorage` directly.
- `src/lib/storage.ts` is the only file that touches `localStorage` (`loadCollection` /
  `saveCollection` / `resetAllData`).

To move to Supabase: replace the body of `usePersistedState` in `DataStoreContext.tsx` (and the
functions in `storage.ts`) with Supabase queries/subscriptions. No page or component needs to
change, because they only ever depend on the `DataStoreValue` shape.

Types for every entity (Prospect, Client, Campaign, CalendarItem, Proposal, PilotProposal,
OutreachTemplate, …) live in `src/types/index.ts` and map directly to what a Postgres schema would
look like — see [`docs/data-model.md`](docs/data-model.md).

## Gmail & Google Calendar — real integrations, read this before relying on them

Unlike everything else in this document, Gmail-send and Google-Calendar sync are **real,
working integrations**, not a "Demo / Not Connected" placeholder. Each of the 5 allowed team
members (`src/lib/auth.ts`) can connect their own Gmail/Calendar account from Settings and send
actual outreach emails / create actual calendar events from the CRM.

This required adding the one piece of server infrastructure this project otherwise avoids: a
small, free **Cloudflare Worker** (`worker/` at the repo root). Real Gmail/Calendar OAuth needs a
confidential client — a client secret that must never reach the browser — and a place to persist
refresh tokens, and a 100%-static GitHub Pages site has neither. Everything else in this app is
still local-first and backend-free; this is the one deliberate exception, scoped as narrowly as
possible.

**How it works, in plain terms:**

- The Worker exposes OAuth start/callback endpoints, a connect/disconnect status check, and two
  action endpoints (`/gmail/send`, `/calendar/create-event`). It re-validates the same 5-email
  allowlist from `src/lib/auth.ts` on every request that touches a token (the list is duplicated
  in `worker/src/index.ts` with a comment pointing back here — there's no shared package across
  the frontend/worker boundary, so keep both in sync by hand).
- The frontend never sees a Google client secret or a refresh token — only the Worker does.
  `src/lib/integrations.ts` is a thin `fetch` client over the Worker's HTTP API.
- The OAuth `state` parameter is HMAC-signed (`STATE_SIGNING_SECRET`) with a 10-minute expiry, so
  the callback can't be forged or replayed.
- CORS on the Worker only allows `https://healthyvital.github.io` and `http://localhost:5173` —
  nothing else can call it from a browser.
- **Until an admin deploys the Worker and sets the `VITE_INTEGRATIONS_API_URL` secret**, the app
  behaves exactly as it always has: Settings shows the old static "Not Connected" badges (with a
  note pointing at the setup guide) and Outreach's "Log as sent" manual flow is the only option.
  Nothing about the existing local-first behavior changes until that's configured.
- **This inherits the same trust model as `AuthGate`** (see above) — whoever can get past the
  email allowlist screen can act as that team member's Gmail/Calendar. That's an accepted
  trade-off for a 5-person internal tool, not an oversight.

See [`INTEGRATIONS_SETUP.md`](INTEGRATIONS_SETUP.md) for the full deploy walkthrough (Google Cloud
OAuth consent screen, Cloudflare Workers deploy, GitHub secret) — $0 cost at this team size and
volume on both Google Cloud (testing-mode OAuth) and Cloudflare Workers' free tier.

## Future integrations (not implemented — by design)

The MVP must run without paid APIs, so every integration below is a labeled "Demo / Not
Connected" surface (see the Settings page) rather than a fake/mocked API call:

- **Supabase** — real database + auth, replacing the localStorage layer above
- **Google Analytics** — real website traffic in Client Reports
- **Meta / Instagram** — real reach, engagement and DM data
- **LinkedIn** — real DM sending + analytics (not just "not built yet": LinkedIn requires special
  partner access for messaging automation that isn't available to a small business, so this stays
  a manual compose-and-open-the-app flow by design, not a gap to fill in later)
- **TikTok** — real performance data
- **Microsoft Outlook** — real outreach email sending + tracking (Gmail is covered — see above)
- **Calendly** — real booking links for discovery calls (Google Calendar sync is covered — see
  above)
- **Stripe** — real billing for monthly packages

Instagram DM is in the same position as LinkedIn: Meta's Instagram Messaging API only allows
replying within a 24-hour window after the other person messages first, so it can't power cold
outreach either. WhatsApp outreach stays manual for the same reason (no cold-outreach API access
for a business this size). Those three channels' Outreach flows are unchanged by this project —
compose text, open the app, send it yourself.

No other fake integrations were built — outreach "sends" for non-Email channels on the Outreach
page just log a communication entry in the CRM timeline and are labeled as such.

## Repository structure

```
src/
  components/     shared UI (ui/, layout/) and feature components (dashboard/, prospects/, …)
  pages/          one file per route
  data/           seed data (real + demo, clearly separated) and static reference data
  store/          the single DataStoreContext (localStorage-backed) all pages read/write through
  lib/            lead scoring, content generator, free-audit scoring, ROI calc, storage, utils,
                  integrations.ts (client for the Gmail/Calendar Worker)
  types/          shared TypeScript types
docs/             product spec, data model, outreach strategy
worker/           Cloudflare Worker backend for real Gmail-send / Google-Calendar OAuth — the one
                  piece of server infrastructure in this project, see INTEGRATIONS_SETUP.md
```

## Design

Visual language follows the brief ("creative agency meets HubSpot"): clean neutral surfaces,
large stat cards, rounded cards, a single validated categorical chart palette (fixed hue order,
colorblind-safe), and no dark-mode toggle for this MVP (light-only, matching the agency-site
aesthetic). See `src/index.css` for the design tokens.

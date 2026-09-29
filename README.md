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

There is no authentication in this MVP — `/app` is open. Add auth when Supabase is wired in.

## Environment variables

**None are required to run the app.** See [`.env.example`](.env.example) for placeholders covering
every future integration listed below — they're commented out on purpose.

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

## Future integrations (not implemented — by design)

The MVP must run without paid APIs, so every integration below is a labeled "Demo / Not
Connected" surface (see the Settings page) rather than a fake/mocked API call:

- **Supabase** — real database + auth, replacing the localStorage layer above
- **Google Analytics** — real website traffic in Client Reports
- **Meta / Instagram** — real reach, engagement and DM data
- **LinkedIn** — real DM sending + analytics
- **TikTok** — real performance data
- **Gmail / Microsoft Outlook** — real outreach email sending + tracking
- **Google Calendar / Calendly** — real scheduling for discovery calls and shoots
- **Stripe** — real billing for monthly packages

No fake integrations were built — outreach "sends" on the Outreach page just log a communication
entry in the CRM timeline and are labeled as such.

## Repository structure

```
src/
  components/     shared UI (ui/, layout/) and feature components (dashboard/, prospects/, …)
  pages/          one file per route
  data/           seed data (real + demo, clearly separated) and static reference data
  store/          the single DataStoreContext (localStorage-backed) all pages read/write through
  lib/            lead scoring, content generator, free-audit scoring, ROI calc, storage, utils
  types/          shared TypeScript types
docs/             product spec, data model, outreach strategy
```

## Design

Visual language follows the brief ("creative agency meets HubSpot"): clean neutral surfaces,
large stat cards, rounded cards, a single validated categorical chart palette (fixed hue order,
colorblind-safe), and no dark-mode toggle for this MVP (light-only, matching the agency-site
aesthetic). See `src/index.css` for the design tokens.

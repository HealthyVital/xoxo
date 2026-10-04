# Data model

All types are defined once in `src/types/index.ts`. This doc explains the shapes that aren't
self-evident from the TypeScript alone, and how they'd map onto a Supabase/Postgres schema.

## Prospect

The core CRM record. Every prospect — real or demo — has:

- **Identity & firmographics:** `companyName`, `industry` (one of the 7 verticals), `city`,
  `companySize`, `website`, social handles.
- **Provenance & trust:** `source`, `sourceUrl`, `lastVerified`, `verificationStatus`
  (`Verified` / `Partially Verified` / `Needs Verification`). Any field that isn't confirmed is
  left `undefined` and rendered as "Not verified" in the UI — never guessed.
- **Lead scoring:** `leadScore` (0–100) plus `scoreReasons` (a plain-language audit trail of what
  was counted and, importantly, what was *not yet verified*) and `recommendedApproach`. See
  `src/lib/leadScoring.ts` — the scoring rules are exactly the ones in the product spec
  (+20 active Instagram, +15 active TikTok, etc.), applied only to signals that are actually
  known; nothing is inferred and presented as fact.
- **Pipeline state:** `status` (15 values, a superset of the 11 Kanban columns in
  `PIPELINE_STAGES`), `lastContact`, `nextFollowUp`, `dealValue`, `assignedTo`.
- **GDPR / compliance:** `doNotContact`, `consentNotes`. Do-Not-Contact prospects are excluded
  from the Outreach follow-up queue automatically.
- **`isDemo`:** the single flag that separates the real 82-company research seed from the
  synthetic pipeline/dashboard demo data. Every list/table that shows prospects renders a purple
  "Demo" badge when this is true.

## Communication log

A flat, append-only list (`CommunicationLogEntry`) of channel + direction + summary + timestamp,
keyed by `prospectId`. This is the single source of truth for "did they respond" — both the
Outreach page and the Prospect detail modal read/write the same list.

## Pilot proposal / Proposal

Two distinct documents, matching the two distinct moments in the funnel (free pilot vs. paid
proposal). Both are just structured text + a status enum — deliberately simple so they can be
generated, edited and printed without needing a PDF library (`window.print()` on a styled modal).

## Client

Created once a prospect is Won. Carries:

- `before` — one `ClientMetricSnapshot` captured pre-collaboration.
- `history` — one snapshot per month since.
- `whatWeCreated` / `whatWorked` / `whatWeWillChangeNextMonth` / `nextMonthStrategy` — the four
  lists the client-facing dashboard and the executive report are built from.

`ClientMetricSnapshot.isDemoData` exists so that, once real analytics integrations are connected,
observed data and illustrative data can be visually distinguished even within the same client's
history.

## Campaign / CalendarItem

Lightweight grouping/scheduling records. A `SavedContentIdea` (from the Content Studio) can be
attached to a `Campaign` via `campaignId` — see the "Unassigned content ideas" panel on the
Campaigns page.

## Marketplace layer: Skill / Service / Professional / ServiceRequest / Review / Payment

Added alongside everything above, not replacing it — see the Phase 1 architecture note in the
README. These model the **supply side** of a two-sided marketplace (independent professionals),
while `Prospect`/`Client` above remain the **demand side** (companies).

- **`Skill`** / **`Service`** — small reference catalogs (`{ id, name, category }` and
  `{ id, name, category, mode: 'one-time' | 'recurring', description, typicalPriceRange }`).
  Created inline from the Professionals / Service Requests add-forms as real ones are identified —
  there's no separate catalog-management page yet.
- **`Professional`** — a real, independent creative (photographer, videographer, etc.).
  `skillIds` / `serviceIds` reference the catalogs above. `verificationStatus` reuses the exact
  same `VerificationStatus` type and honesty rule as `Prospect`: an unconfirmed email/phone stays
  `undefined`, never guessed.
- **`ServiceRequest`** — a one-time job from a company. `status` moves New → Matched → In Progress
  → Completed/Cancelled on the Service Requests board (same drag-and-drop pattern as Pipeline).
  `matchedProfessionalId` is set when a professional is matched; `linkedProspectId` is an optional,
  non-destructive bridge to an existing `Prospect` so a company already in the CRM isn't duplicated.
- **`Review`** / **`Payment`** — record-keeping only (no real payment processor), tied to a
  `serviceRequestId`.

All six collections seed empty (`src/data/seedData.ts`) — no fabricated marketplace activity.

**Deliberately not done yet:** there is no shared `Company` entity joining `Prospect`/`Client`/
`ServiceRequest` under one id. That would require migrating the 1,400+ real prospect records
already gathered, and is left for a later phase (see the Phase 1 plan's "explicitly deferred"
section).

## Mapping to Postgres (future Supabase migration)

Every top-level array in `DataStoreContext` becomes a table with the same name (`prospects`,
`communications`, `clients`, `campaigns`, `calendar_items`, `pilot_proposals`, `proposals`,
`saved_content_ideas`, `templates`, `free_audit_submissions`, `skills`, `services`,
`professionals`, `service_requests`, `reviews`, `payments`). Nested arrays inside a record
(`Client.history`, `Prospect.painPoints`, etc.) become either a `jsonb` column (fastest migration
path) or a child table if they need to be queried independently. Foreign keys are already modeled
as `*Id` string fields (`prospectId`, `clientId`, `campaignId`, `linkedProspectId`,
`matchedProfessionalId`, `serviceRequestId`), so this is a fairly direct lift.

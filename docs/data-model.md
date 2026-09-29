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

## Mapping to Postgres (future Supabase migration)

Every top-level array in `DataStoreContext` becomes a table with the same name (`prospects`,
`communications`, `clients`, `campaigns`, `calendar_items`, `pilot_proposals`, `proposals`,
`saved_content_ideas`, `templates`, `free_audit_submissions`). Nested arrays inside a record
(`Client.history`, `Prospect.painPoints`, etc.) become either a `jsonb` column (fastest migration
path) or a child table if they need to be queried independently. Foreign keys are already modeled
as `*Id` string fields (`prospectId`, `clientId`, `campaignId`), so this is a fairly direct lift.

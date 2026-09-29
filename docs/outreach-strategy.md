# Outreach strategy

## Sequence

| Touch | Day | Channel | Template |
|---|---|---|---|
| 1 | 0 | Email | Email #1 |
| 2 | 3 | Email | Follow-up #1 |
| 3 | 7 | Email + LinkedIn | Follow-up #2, LinkedIn DM |
| 4 | 14 | Instagram + WhatsApp | Instagram DM, WhatsApp follow-up |

Four touches over two weeks, escalating across channels rather than repeating the same one —
and stopping. This is deliberately not a long drip campaign: the product spec is explicit that
this system is not designed for spam or mass unsolicited messaging.

## Variables

Every template uses the same variable set, filled in automatically on the Outreach page from the
prospect's own record (`src/lib/templateFill.ts`):

- `{{firstName}}` — from `marketingContact`, falls back to "there"
- `{{companyName}}`
- `{{industry}}`
- `{{specificObservation}}` — the prospect's `contentOpportunity`
- `{{contentIdea}}` — the prospect's `recommendedApproach`
- `{{pilotOffer}}` — the standard Free Content Pilot offer
- `{{bookingLink}}` — placeholder; replace with a real Calendly link once that integration is
  connected

## Opt-out

Both Email #1 and the WhatsApp follow-up include an explicit opt-out line ("reply STOP"). Marking
a prospect **Do Not Contact** (available from the Prospect detail modal) does two things
immediately: sets `status` to `Do Not Contact` and removes the prospect from the Outreach
follow-up queue — it cannot be accidentally re-contacted from that queue.

## Personalization discipline

`specificObservation` and `contentIdea` are pulled from real, vertical-specific reasoning (see
`src/data/verticals.ts`), not generic filler — the intent is that every message references
something specific to that business's category, even before a rep has done bespoke research.
Templates are editable in place on the Templates page; changes there apply immediately to the
Outreach page (they share the same store).

## Editing templates safely

Templates live in `src/data/templates.json` (seed) and are copied into `localStorage` on first
run, so editing them in the UI never touches the seed file. To ship a new default sequence,
edit the JSON file directly.

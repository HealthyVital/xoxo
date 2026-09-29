# Product spec

## What this is

A B2B sales-and-delivery system for a Rotterdam photography/videography/social-content company.
It is not a portfolio site — the portfolio/branding site is one small part (`/` and `/audit`); the
rest of the app (`/app/*`) is the internal tool the business runs on every day.

## The workflow this app manages

```
PROSPECTING → LEAD SCORING → OUTREACH → FOLLOW-UP → DISCOVERY CALL →
FREE CONTENT PILOT → RESULTS → PROPOSAL → CLIENT →
MONTHLY CONTENT → REPORTING → RETENTION → UPSELL
```

Every screen in the app maps to a stage of this workflow:

| Stage | Screen(s) |
|---|---|
| Prospecting | Prospects, Verticals |
| Lead scoring | Prospects (score badge + reasons), Prospect "Add" form |
| Outreach / follow-up | Outreach, Templates, Pipeline |
| Discovery call → results | Pipeline, Prospect detail (communication log) |
| Free Content Pilot | Free Pilot |
| Proposal | Proposals |
| Client / monthly content | Clients, Content Studio, Campaigns, Calendar |
| Reporting | Client Reports, Client detail (results dashboard) |
| Retention / upsell | Clients (status), Analytics (retention chart) |

Dashboard and Analytics roll all of the above into one view for a general manager.

## The twelve questions

Every feature in this app answers one of:

1. Who should I contact? → Prospects, filters, lead score
2. Why should I contact them? → content opportunity, pain points, vertical strategy
3. What should I offer them? → Free Pilot, Pricing, Proposals
4. What should I say? → Outreach templates, Content Studio
5. When should I follow up? → `nextFollowUp`, Outreach queue, Pipeline
6. Did they respond? → communication timeline, status
7. Did the pilot work? → Pilot Proposal status, notes
8. Did they become a paying client? → Won status → Client record
9. What content should I produce? → Content Studio, Calendar
10. Can I prove the value to the client? → Client detail results dashboard, Client Reports, ROI
11. Can I retain the client? → Client status, retention chart
12. Can I upsell them? → package tier on Client, Proposals

## Explicit non-goals for this MVP

- No real email/DM/social-API sending — every "send" is a logged CRM entry, clearly labeled
  Demo / Not Connected where a real integration would live.
- No authentication — this is a single-tenant local tool for now.
- No claim that any score, projection or demo metric is a guarantee of real-world results.
- No invented contact information, ever — see `docs/data-model.md` for how verification status
  is tracked per record.

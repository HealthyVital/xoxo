import type {
  CalendarItem,
  Campaign,
  Client,
  CommunicationLogEntry,
  OutreachTemplate,
  PilotProposal,
  PricingPackage,
  OneOffService,
  Prospect,
  Proposal,
  SavedContentIdea,
} from '@/types'

import prospectsReal from './prospects.real.json'
import templatesRaw from './templates.json'
import pricingRaw from './pricing.json'

// ---------------------------------------------------------------------------
// This app seeds with REAL data only by default — the business hasn't
// contacted anyone yet, so the live CRM should show that honestly (empty
// pipeline, zero clients) rather than blended with illustrative numbers.
// The old *.demo.json files (prospects.demo.json, clients.demo.json, etc.)
// still exist in this folder for reference/onboarding but are intentionally
// not imported into the default seed anymore.
// ---------------------------------------------------------------------------
export const SEED_PROSPECTS: Prospect[] = prospectsReal as Prospect[]

export const SEED_COMMUNICATIONS: CommunicationLogEntry[] = []
export const SEED_CLIENTS: Client[] = []
export const SEED_CAMPAIGNS: Campaign[] = []
export const SEED_CALENDAR_ITEMS: CalendarItem[] = []
export const SEED_TEMPLATES: OutreachTemplate[] = templatesRaw as OutreachTemplate[]
export const SEED_PRICING_PACKAGES: PricingPackage[] = pricingRaw.packages as PricingPackage[]
export const SEED_ONE_OFF_SERVICES: OneOffService[] = pricingRaw.oneOffServices as OneOffService[]
export const PRICING_DISCLAIMER: string = pricingRaw.disclaimer

export const SEED_PILOT_PROPOSALS: PilotProposal[] = []
export const SEED_PROPOSALS: Proposal[] = []
export const SEED_SAVED_CONTENT_IDEAS: SavedContentIdea[] = []

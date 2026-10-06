import type {
  CalendarItem,
  Campaign,
  Client,
  CommunicationLogEntry,
  OutreachTemplate,
  PilotProposal,
  Payment,
  PricingPackage,
  OneOffService,
  Professional,
  Prospect,
  Proposal,
  Review,
  SavedContentIdea,
  Service,
  ServiceRequest,
  Skill,
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
/** The three core monthly packages (Starter / Growth / Content Partner). */
export const MAIN_PRICING_PACKAGES: PricingPackage[] = SEED_PRICING_PACKAGES.filter((p) => !p.smallBusiness)
/** Entry tiers for very small businesses (Content Drop / Local). */
export const SMALL_BUSINESS_PACKAGES: PricingPackage[] = SEED_PRICING_PACKAGES.filter((p) => p.smallBusiness)
export const SEED_ONE_OFF_SERVICES: OneOffService[] = pricingRaw.oneOffServices as OneOffService[]
export const PRICING_DISCLAIMER: string = pricingRaw.disclaimer

export const SEED_PILOT_PROPOSALS: PilotProposal[] = []
export const SEED_PROPOSALS: Proposal[] = []
export const SEED_SAVED_CONTENT_IDEAS: SavedContentIdea[] = []

// ---------------------------------------------------------------------------
// Marketplace layer (supply side) — see src/types/index.ts for context.
// Starts empty: no fabricated professionals or service requests. Populating
// these with real, verified professionals is a separate future task.
// ---------------------------------------------------------------------------
export const SEED_SKILLS: Skill[] = []
export const SEED_SERVICES: Service[] = []
export const SEED_PROFESSIONALS: Professional[] = []
export const SEED_SERVICE_REQUESTS: ServiceRequest[] = []
export const SEED_REVIEWS: Review[] = []
export const SEED_PAYMENTS: Payment[] = []

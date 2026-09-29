import type {
  CalendarItem,
  Campaign,
  Client,
  CommunicationLogEntry,
  DemoAnalyticsMonth,
  OutreachTemplate,
  PilotProposal,
  PricingPackage,
  OneOffService,
  Prospect,
  Proposal,
  SavedContentIdea,
} from '@/types'

import prospectsReal from './prospects.real.json'
import prospectsDemo from './prospects.demo.json'
import communicationsDemo from './communications.demo.json'
import clientsDemo from './clients.demo.json'
import campaignsDemo from './campaigns.demo.json'
import calendarItemsDemo from './calendarItems.demo.json'
import demoAnalyticsRaw from './demoAnalytics.json'
import templatesRaw from './templates.json'
import pricingRaw from './pricing.json'

export const SEED_PROSPECTS: Prospect[] = [
  ...(prospectsReal as Prospect[]),
  ...(prospectsDemo as Prospect[]),
]

export const SEED_COMMUNICATIONS: CommunicationLogEntry[] = communicationsDemo as CommunicationLogEntry[]
export const SEED_CLIENTS: Client[] = clientsDemo as Client[]
export const SEED_CAMPAIGNS: Campaign[] = campaignsDemo as Campaign[]
export const SEED_CALENDAR_ITEMS: CalendarItem[] = calendarItemsDemo as CalendarItem[]
export const SEED_DEMO_ANALYTICS: DemoAnalyticsMonth[] = demoAnalyticsRaw as DemoAnalyticsMonth[]
export const SEED_TEMPLATES: OutreachTemplate[] = templatesRaw as OutreachTemplate[]
export const SEED_PRICING_PACKAGES: PricingPackage[] = pricingRaw.packages as PricingPackage[]
export const SEED_ONE_OFF_SERVICES: OneOffService[] = pricingRaw.oneOffServices as OneOffService[]
export const PRICING_DISCLAIMER: string = pricingRaw.disclaimer

export const SEED_PILOT_PROPOSALS: PilotProposal[] = []
export const SEED_PROPOSALS: Proposal[] = []
export const SEED_SAVED_CONTENT_IDEAS: SavedContentIdea[] = []

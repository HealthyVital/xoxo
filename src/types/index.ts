// ---------------------------------------------------------------------------
// Core domain types for the Rotterdam Content CRM MVP.
// All data in this MVP is local (JSON seed + localStorage). Nothing here talks
// to a real backend yet; see src/lib/storage.ts and README.md for the plan to
// swap in Supabase later without changing these shapes.
// ---------------------------------------------------------------------------

export type Vertical =
  | 'Hotels & Hospitality'
  | 'Travel & Tour Operators'
  | 'Cosmetics & Beauty'
  | 'Footwear & Fashion'
  | 'Pharmacy & Health Retail'
  | 'Events & Corporate'
  | 'Restaurants & Lifestyle'

export type ProspectStatus =
  | 'New'
  | 'Researching'
  | 'Ready to Contact'
  | 'Contacted'
  | 'Opened'
  | 'Replied'
  | 'Positive Reply'
  | 'Meeting'
  | 'Free Pilot'
  | 'Proposal'
  | 'Negotiation'
  | 'Won'
  | 'Lost'
  | 'Not Interested'
  | 'Do Not Contact'

// Stages shown on the Kanban pipeline board (a curated subset/ordering of
// ProspectStatus - some statuses like "Opened" or "Do Not Contact" are tracked
// on the record but not given their own column).
export const PIPELINE_STAGES = [
  'New',
  'Researching',
  'Ready to Contact',
  'Contacted',
  'Replied',
  'Meeting',
  'Free Pilot',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
] as const

export type PipelineStage = (typeof PIPELINE_STAGES)[number]

export type VerificationStatus =
  | 'Verified'
  | 'Partially Verified'
  | 'Needs Verification'

export type CompanySize = 'Micro (1-9)' | 'Small (10-49)' | 'Medium (50-249)' | 'Large (250+)' | 'Unknown'

export interface Prospect {
  id: string
  companyName: string
  industry: Vertical
  subIndustry?: string
  website?: string
  phone?: string
  email?: string
  marketingContact?: string
  marketingRole?: string
  address?: string
  city: string
  country: string
  postalCode?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  tiktok?: string
  source: string
  sourceUrl?: string
  lastVerified: string // ISO date
  verificationStatus: VerificationStatus
  leadScore: number
  scoreReasons: string[]
  recommendedApproach: string
  companySize: CompanySize
  location: string
  notes: string
  painPoints: string[]
  contentOpportunity: string
  personalizationNotes?: string
  status: ProspectStatus
  lastContact?: string // ISO date
  nextFollowUp?: string // ISO date
  assignedTo: string
  dealValue?: number // estimated monthly recurring value if won, EUR
  doNotContact: boolean
  consentNotes?: string
  createdAt: string
  updatedAt: string
  /** true = we have already delivered one-off work for this brand, but it is
   *  not (yet) a recurring client — a warm lead for a monthly package. */
  pastWork?: boolean
  /** true = illustrative demo record used to populate the pipeline/dashboard UI.
   *  false = a real, sourced Rotterdam company from the research seed list. */
  isDemo: boolean
}

export type CommunicationChannel =
  | 'Email'
  | 'Instagram DM'
  | 'LinkedIn DM'
  | 'Phone call'
  | 'Meeting'
  | 'WhatsApp'
  | 'Note'

export type CommunicationDirection = 'outbound' | 'inbound'

export interface CommunicationLogEntry {
  id: string
  prospectId: string
  date: string // ISO date-time
  channel: CommunicationChannel
  direction: CommunicationDirection
  summary: string
  templateId?: string
}

export type OutreachTemplateKind =
  | 'Email #1'
  | 'Follow-up #1'
  | 'Follow-up #2'
  | 'LinkedIn DM'
  | 'Instagram DM'
  | 'WhatsApp follow-up'

export interface OutreachTemplate {
  id: string
  kind: OutreachTemplateKind
  sequenceDay: number // 0, 3, 7, 14
  subject?: string
  body: string
  variables: string[]
}

export interface ContentIdeaBrief {
  company: string
  industry: Vertical | ''
  product: string
  targetAudience: string
  objective: string
  platform: string
  tone: string
  offer: string
  season: string
}

export interface ContentIdeaOutput {
  ideas: string[]
  hooks: string[]
  captions: string[]
  reelConcepts: string[]
  photoConcepts: string[]
  cta: string
  shotList: string[]
  productionFormat: string
}

export interface SavedContentIdea extends ContentIdeaOutput {
  id: string
  brief: ContentIdeaBrief
  campaignId?: string
  createdAt: string
}

export interface VerticalStrategy {
  vertical: Vertical
  summary: string
  contentIdeas: string[]
  cautions?: string[]
}

export interface PilotProposal {
  id: string
  prospectId: string
  client: string
  objective: string
  deliverables: string[]
  productionDate?: string
  expectedTimeline: string
  clientProvides: string[]
  weProvide: string[]
  usageRights: string
  nextStep: string
  status: 'Draft' | 'Sent' | 'Accepted' | 'Completed'
  createdAt: string
}

export type PricingPackageId = 'starter' | 'growth' | 'partner'

export interface PricingPackage {
  id: PricingPackageId
  name: string
  priceRange: string
  description: string
  deliverables: string[]
  bestFor: string
}

export interface OneOffService {
  id: string
  name: string
  priceRange: string
  description: string
}

export interface Proposal {
  id: string
  prospectId: string
  client: string
  clientProblem: string
  contentOpportunity: string
  strategy: string
  deliverables: string[]
  production: string
  distribution: string
  reporting: string
  timeline: string
  packageId: PricingPackageId | 'custom'
  customPrice?: number
  currency: 'EUR'
  terms: string
  cta: string
  status: 'Draft' | 'Sent' | 'Won' | 'Lost'
  createdAt: string
}

export interface ClientMetricSnapshot {
  period: string // e.g. "2026-08"
  postsPublished: number
  reach: number
  views: number
  engagementRate: number // percent
  likes: number
  comments: number
  shares: number
  saves: number
  followersGained: number
  websiteClicks: number
  leads: number
  bookings: number
  conversions: number
  adSpend?: number
  isDemoData: boolean
}

export interface Client {
  id: string
  prospectId?: string
  companyName: string
  industry: Vertical
  packageId: PricingPackageId
  mrr: number
  startDate: string
  status: 'Active' | 'Paused' | 'Churned'
  before: ClientMetricSnapshot
  history: ClientMetricSnapshot[]
  whatWeCreated: string[]
  whatWorked: string[]
  whatWeWillChangeNextMonth: string[]
  nextMonthStrategy: string[]
  isDemo: boolean
}

export interface RoiInputs {
  productionCost: number
  advertisingSpend: number
  leads: number
  bookings: number
  averageCustomerValue: number
  revenueAttributed: number
  dataQuality: 'Observed' | 'Client-reported' | 'Estimated'
}

export interface Campaign {
  id: string
  name: string
  vertical: Vertical | 'Multi-vertical'
  clientId?: string
  objective: string
  platforms: string[]
  status: 'Planning' | 'In Production' | 'Live' | 'Completed'
  contentIdeaIds: string[]
  startDate: string
  endDate?: string
}

export type CalendarItemStatus =
  | 'Idea'
  | 'Script'
  | 'Scheduled'
  | 'Shot'
  | 'Editing'
  | 'Client Review'
  | 'Approved'
  | 'Published'
  | 'Analyzed'

export interface CalendarItem {
  id: string
  date: string // ISO date
  clientId?: string
  platform: string
  contentType: string
  campaignId?: string
  status: CalendarItemStatus
  approval: 'Pending' | 'Approved' | 'Changes Requested'
  notes?: string
}

export interface FreeAuditSubmission {
  id: string
  company: string
  website?: string
  instagram?: string
  industry: Vertical | ''
  mainChallenge: string
  mainGoal: string
  createdAt: string
}

export interface FreeAuditResult {
  contentOpportunityScore: number
  missingContent: string[]
  recommendedPillars: string[]
  contentIdeas: string[]
  recommendedPackage: PricingPackageId
}

export interface QuizAnswer {
  questionId: string
  optionId: string
  label: string
}

export interface QuizSubmission {
  id: string
  companyName: string
  industry: Vertical | ''
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  instagram?: string
  answers: QuizAnswer[]
  qualificationScore: number // 0-100, rule-based from answers
  qualified: boolean // score >= QUALIFYING_THRESHOLD
  source: string // e.g. "Instagram bio quiz", "Facebook post quiz"
  createdAt: string
  convertedToProspectId?: string
}

export interface FunnelStage {
  label: string
  value: number
}

// ---------------------------------------------------------------------------
// Marketplace layer (supply side) — added alongside the existing
// prospect-to-client sales pipeline above, which models the demand side.
// See the architecture plan: a two-sided marketplace (Uber/Airbnb model)
// matching companies that need photo/video/marketing work (demand, already
// modeled via Prospect/Client above) with independent professionals who
// deliver it (supply, modeled here for the first time). Nothing above this
// comment was changed to make room for this — it's purely additive.
// ---------------------------------------------------------------------------

export interface Skill {
  id: string
  name: string
  category: string
}

export type ServiceMode = 'one-time' | 'recurring'

export interface Service {
  id: string
  name: string
  category: Vertical | 'General'
  mode: ServiceMode
  description: string
  typicalPriceRange: string
}

export type ProfessionalAvailability = 'Available' | 'Booked' | 'Unavailable'

export interface Professional {
  id: string
  name: string
  email?: string
  phone?: string
  city: string
  country: string
  skillIds: string[]
  serviceIds: string[]
  bio: string
  portfolioUrl?: string
  rateRange?: string
  availability: ProfessionalAvailability
  /** Same honesty rule as Prospect.verificationStatus: never invent a
   *  professional's contact info — leave fields empty and mark this
   *  "Needs Verification" until someone actually confirms them. */
  verificationStatus: VerificationStatus
  ratingAvg?: number
  reviewCount: number
  source: string
  notes: string
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export type ServiceRequestStatus = 'New' | 'Matched' | 'In Progress' | 'Completed' | 'Cancelled'

export interface ServiceRequest {
  id: string
  companyName: string
  contactEmail?: string
  contactPhone?: string
  city: string
  country: string
  serviceId: string
  description: string
  budget?: number
  requestedDate?: string // ISO date
  status: ServiceRequestStatus
  matchedProfessionalId?: string
  /** Optional bridge to an existing Prospect, so a one-time request from a
   *  company we already have doesn't duplicate its data. */
  linkedProspectId?: string
  notes: string
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  serviceRequestId: string
  professionalId: string
  rating: number // 1-5
  comment: string
  authorType: 'client' | 'professional'
  createdAt: string
}

export type PaymentType = 'one-time' | 'recurring-invoice'
export type PaymentStatus = 'Pending' | 'Paid' | 'Overdue'

export interface Payment {
  id: string
  serviceRequestId?: string
  clientId?: string
  amount: number
  currency: 'EUR'
  type: PaymentType
  status: PaymentStatus
  createdAt: string
}

export interface DemoAnalyticsMonth {
  month: string // "2026-04"
  prospectsAdded: number
  contacted: number
  replies: number
  positiveReplies: number
  meetings: number
  pilots: number
  proposals: number
  won: number
  lost: number
  mrr: number
  pipelineValue: number
}

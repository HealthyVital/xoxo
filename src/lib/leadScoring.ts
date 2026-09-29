// ---------------------------------------------------------------------------
// Lead scoring is an internal prioritization heuristic, not an objective truth
// about a business. Every score must be explainable: we store the signals that
// produced it in `scoreReasons` so a rep can see (and challenge) the "why".
//
// Rule set (per product spec):
//   +20 active Instagram presence         +10 multiple locations
//   +15 active TikTok presence            +10 active promotions
//   +15 weak or inconsistent visual content  +10 events or launches
//   +15 strong product/service fit for visual marketing
//   +5  recent social activity
//   -20 no visible marketing activity
//   -15 inactive social profiles
//   -10 no obvious visual opportunity
// ---------------------------------------------------------------------------

export interface LeadSignals {
  activeInstagram?: boolean
  activeTikTok?: boolean
  weakVisualContent?: boolean
  strongVisualFit?: boolean
  multipleLocations?: boolean
  activePromotions?: boolean
  eventsOrLaunches?: boolean
  recentSocialActivity?: boolean
  noMarketingActivity?: boolean
  inactiveSocialProfiles?: boolean
  noVisualOpportunity?: boolean
}

const RULES: Array<{ key: keyof LeadSignals; points: number; label: string }> = [
  { key: 'activeInstagram', points: 20, label: 'Active Instagram presence' },
  { key: 'activeTikTok', points: 15, label: 'Active TikTok presence' },
  { key: 'weakVisualContent', points: 15, label: 'Weak or inconsistent visual content today' },
  { key: 'strongVisualFit', points: 15, label: 'Product/service is well suited to visual marketing' },
  { key: 'multipleLocations', points: 10, label: 'Multiple locations' },
  { key: 'activePromotions', points: 10, label: 'Active promotions' },
  { key: 'eventsOrLaunches', points: 10, label: 'Events or launches' },
  { key: 'recentSocialActivity', points: 5, label: 'Recent social activity' },
  { key: 'noMarketingActivity', points: -20, label: 'No visible marketing activity' },
  { key: 'inactiveSocialProfiles', points: -15, label: 'Inactive social profiles' },
  { key: 'noVisualOpportunity', points: -10, label: 'No obvious visual opportunity' },
]

export interface LeadScoreResult {
  score: number
  reasons: string[]
}

export function computeLeadScore(signals: LeadSignals, unverifiedNote?: string): LeadScoreResult {
  let score = 0
  const reasons: string[] = []
  for (const rule of RULES) {
    if (signals[rule.key]) {
      score += rule.points
      reasons.push(`${rule.points > 0 ? '+' : ''}${rule.points} — ${rule.label}`)
    }
  }
  score = Math.max(0, Math.min(100, score))
  if (unverifiedNote) reasons.push(unverifiedNote)
  return { score, reasons }
}

export function scoreLabel(score: number): { label: string; tone: 'good' | 'warning' | 'muted' } {
  if (score >= 65) return { label: 'High priority', tone: 'good' }
  if (score >= 40) return { label: 'Worth researching', tone: 'warning' }
  return { label: 'Low priority', tone: 'muted' }
}

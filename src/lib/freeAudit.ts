// ---------------------------------------------------------------------------
// Rule-based scoring for the public "Free Content Audit" form. Runs entirely
// client-side — no data leaves the browser in this MVP.
// ---------------------------------------------------------------------------

import type { FreeAuditResult, FreeAuditSubmission, PricingPackageId } from '@/types'
import { VERTICAL_STRATEGIES } from '@/data/verticals'

export function computeFreeAudit(submission: Omit<FreeAuditSubmission, 'id' | 'createdAt'>): FreeAuditResult {
  let score = 40 // neutral baseline — nobody starts at 0 or 100 from a 6-field form

  if (submission.instagram) score += 10
  else score -= 5

  if (submission.website) score += 5
  else score -= 5

  if (submission.industry) score += 15 // a visual-first vertical we already have a strategy for

  if (submission.mainChallenge.toLowerCase().includes('content')) score += 10
  if (submission.mainChallenge.toLowerCase().includes('time') || submission.mainChallenge.toLowerCase().includes('consisten'))
    score += 10
  if (submission.mainGoal.toLowerCase().includes('booking') || submission.mainGoal.toLowerCase().includes('sale'))
    score += 5

  score = Math.max(5, Math.min(95, score))

  const strategy = submission.industry ? VERTICAL_STRATEGIES[submission.industry] : undefined
  const pillars = strategy?.contentIdeas ?? ['Product/service content', 'Behind the scenes', 'Customer stories']
  const ideas = pillars.slice(0, 3).map((p) => `${p} tailored to "${submission.mainGoal || 'your goal'}"`)

  const missingContent: string[] = []
  if (!submission.instagram) missingContent.push('No Instagram profile provided — likely limited short-form video presence')
  if (!submission.website) missingContent.push('No website provided — content has nowhere central to drive traffic to')
  missingContent.push('Consistent short-form video (most businesses in this category under-invest here)')

  let recommendedPackage: PricingPackageId = 'starter'
  if (score >= 70) recommendedPackage = 'partner'
  else if (score >= 50) recommendedPackage = 'growth'

  return {
    contentOpportunityScore: score,
    missingContent,
    recommendedPillars: pillars.slice(0, 4),
    contentIdeas: ideas,
    recommendedPackage,
  }
}

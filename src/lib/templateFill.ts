import type { Prospect } from '@/types'

export function defaultVariablesFor(prospect: Prospect) {
  const firstNameGuess = prospect.marketingContact?.split(' ')[0] || 'there'
  return {
    firstName: firstNameGuess,
    companyName: prospect.companyName,
    industry: prospect.industry,
    specificObservation: prospect.contentOpportunity || 'your current content presence',
    contentIdea: prospect.recommendedApproach || 'a short-form video + photo package',
    pilotOffer: '1 short-form video, 5 edited photos and 3 content concepts, completely free',
    bookingLink: 'https://cal.com/your-studio/discovery-call (demo link)',
  }
}

export function fillTemplate(body: string, variables: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? `{{${key}}}`)
}

// ---------------------------------------------------------------------------
// Local, rule-based content idea generator. No external API — this composes
// templated copy from the brief + the vertical's strategy so the Content
// Studio works fully offline. Swap this module out later if/when a real
// generation service is connected; the UI contract (ContentIdeaOutput) stays
// the same either way.
// ---------------------------------------------------------------------------

import type { ContentIdeaBrief, ContentIdeaOutput } from '@/types'
import { VERTICAL_STRATEGIES } from '@/data/verticals'

function pick<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n)
}

function fallback(value: string, label: string): string {
  return value.trim() || label
}

export function generateContentIdeas(brief: ContentIdeaBrief): ContentIdeaOutput {
  const company = fallback(brief.company, 'your business')
  const product = fallback(brief.product, 'your product or service')
  const audience = fallback(brief.targetAudience, 'your ideal customer')
  const objective = fallback(brief.objective, 'building brand awareness')
  const platform = fallback(brief.platform, 'Instagram & TikTok')
  const tone = fallback(brief.tone, 'friendly and confident')
  const offer = fallback(brief.offer, 'your current offer')
  const season = fallback(brief.season, 'this season')

  const strategy = brief.industry ? VERTICAL_STRATEGIES[brief.industry] : undefined
  const baseIdeas = strategy?.contentIdeas ?? [
    'Behind-the-scenes look',
    'Product/service close-up',
    'Team introduction',
    'Customer story',
    'Process walkthrough',
  ]

  const ideas = [
    ...pick(baseIdeas, 6),
    `A ${season} campaign moment built around ${offer}`,
    `A day-in-the-life piece for ${audience}`,
    `A quick myth vs. reality piece relevant to ${product}`,
    `A "3 things people don't know about ${company}" carousel`,
  ].slice(0, 10)

  const hooks = [
    `Nobody tells you this about ${product}...`,
    `${audience}, this one's for you.`,
    `We tried ${offer} so you don't have to guess.`,
    `Here's what ${company} actually looks like behind the scenes.`,
    `${season} is the best time to do this — here's why.`,
  ]

  const captions = [
    `${company} — ${objective}, one post at a time. ${offer} 👇`,
    `This is what ${product} looks like up close. Tell us what you think.`,
    `Built for ${audience}. Made in Rotterdam.`,
    `${season} calls for this. Link in bio for ${offer}.`,
    `Behind every post is a real team at ${company} — here's a look inside.`,
  ]

  const reelConcepts = [
    `15-30s ${tone} walkthrough of ${product}, hook in the first 2 seconds, text overlay + trending audio.`,
    `Before/after or transformation-style edit tied to ${offer}, fast cuts, captioned for sound-off viewing.`,
    `POV-style clip from the perspective of ${audience} discovering ${company} for the first time.`,
  ]

  const photoConcepts = [
    `Clean product/service hero shot of ${product} on a neutral background, natural light.`,
    `Lifestyle/in-context shot showing ${product} being used by someone matching ${audience}.`,
    `Behind-the-scenes candid of the team at ${company} — builds trust and familiarity.`,
  ]

  const shotList = [
    'Establishing wide shot of location/storefront/venue',
    `Close-up detail shots of ${product}`,
    'Candid team/process shots',
    'A few seconds of natural ambient sound/b-roll for edit flexibility',
    'One clear "hero" shot suitable for a thumbnail or cover image',
  ]

  const cta = `Ready to see this for ${company}? Book a Free Content Pilot — no cost, no commitment.`

  const productionFormat = `${platform} — vertical 9:16 for Reels/TikTok, 4:5 or 1:1 for feed photography.`

  return { ideas, hooks, captions, reelConcepts, photoConcepts, cta, shotList, productionFormat }
}

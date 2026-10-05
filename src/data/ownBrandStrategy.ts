// ---------------------------------------------------------------------------
// "Strategy Example" — the full Content Partner deliverable, written as if
// Agrita&Vin Content Co. were our own first client paying €2,500/month.
// Every hard number below comes from a real source (team-supplied profile
// screenshots, 2026-10-05) or is explicitly a projection scenario. Nothing
// here is presented as an achieved result.
// ---------------------------------------------------------------------------
import type { Vertical } from '@/types'

export const BASELINE_DATE = '2026-10-05'

export const ENGAGEMENT = {
  client: 'Agrita&Vin Content Co. (internal — we are our own first client)',
  packageName: 'Content Partner',
  price: '€2,500 / month',
  term: '6 months · October 2026 – March 2027',
  goal: 'Build an inbound engine that turns content into qualified B2B leads and wedding/event bookings — and prove the Content Partner package works on ourselves before selling it to anyone else.',
}

export const BASELINE: { label: string; value: string }[] = [
  { label: 'Recurring clients', value: '0' },
  { label: 'IG agency account', value: '1,275' },
  { label: 'IG founder account', value: '10.8K' },
  { label: 'TikTok', value: '0' },
  { label: 'YouTube', value: '0' },
  { label: 'Facebook / LinkedIn', value: '0' },
]

export const OBJECTIVES: string[] = [
  'Publish consistently: at least 16 short-form videos and 30 photos every month, across 5 platforms, from month 2 onward.',
  'Capture a real engagement-rate baseline from Instagram Insights in month 1, then beat it by 30% by month 6.',
  'Reach 6+ inbound leads per month by month 6 (DMs, quiz completions, WhatsApp) — base scenario.',
  'Contribute to signing the first 3 recurring clients, alongside outbound outreach — base scenario.',
  'Leave behind a reusable system: 1 real case study, a hook bank, script templates and a monthly report format that clone to any industry.',
]

export const POSITIONING = {
  oneLiner: 'Content that makes Rotterdam businesses visible — shot, edited and published for you.',
  tone: 'Warm, confident, expert-but-human. English first; RU/LV subtitles on posts aimed at Baltic audiences.',
  audiences: [
    {
      name: 'B2B decision makers (NL)',
      who: 'Hotel marketing managers, restaurant and café owners, beauty/clinic owners, event venues.',
      wants: 'More bookings, a premium look, zero time spent making content themselves.',
    },
    {
      name: 'Couples & families (NL + Baltics)',
      who: 'People planning a wedding, anniversary or family event.',
      wants: 'Beautiful, stress-free memories delivered fast — and proof the photographer is good.',
    },
    {
      name: 'Independent creatives (secondary)',
      who: 'Photographers, videographers, MUAs who could join the marketplace.',
      wants: 'Steady paid work without having to sell themselves.',
    },
  ],
}

export const PILLARS: { name: string; share: number; what: string }[] = [
  { name: 'Proof', share: 30, what: 'Before/after, finished client content, real results (real numbers only).' },
  { name: 'Teach', share: 25, what: 'Quick, practical content tips for business owners.' },
  { name: 'Behind the scenes', share: 20, what: 'Shoot days, gear, editing, how one shoot becomes a month of content.' },
  { name: 'Weddings & events', share: 15, what: 'Highlights, emotional moments, planning tips.' },
  { name: 'People', share: 10, what: 'Agrita & Vin, team life, crossovers with the founder travel account.' },
]

export const ROADMAP: { month: string; theme: string; focus: string[]; milestone: string }[] = [
  {
    month: 'Month 1 · Oct 2026',
    theme: 'Foundation',
    focus: [
      'Convert @worlddigital_marketing_agency into the company account (see Audit tab).',
      'Open TikTok, YouTube, Facebook and LinkedIn with the same handle and bio.',
      'Brand kit: fonts, colors, cover template, 1-second logo sting for long-form only.',
      'Shoot day #1 → first 10 reels; start at 3 posts/week while the system settles.',
    ],
    milestone: 'All 5 profiles live and consistent; Insights baseline captured.',
  },
  {
    month: 'Month 2 · Nov 2026',
    theme: 'Consistency & testing',
    focus: [
      'Full cadence: 4–5 reels/week (see Reels Playbook calendar).',
      'A/B test 3 hook styles: question, bold statement, visual reveal.',
      'First 2 Instagram Collab posts with @agrita_world_adventures (10.8K).',
      'Start the quiz promotion series ("Comment AUDIT").',
    ],
    milestone: 'Top 3 formats identified by watch time, saves and shares.',
  },
  {
    month: 'Month 3 · Dec 2026',
    theme: 'Optimize + seasonal',
    focus: [
      'Double down on the 20% of formats driving 80% of reach.',
      'Holiday content aimed at hospitality prospects ("How hotels should film Christmas").',
      'December is engagement season → engagement-shoot offer content for the wedding line.',
      'Optional €150 boost test on the best organic reel.',
    ],
    milestone: 'First inbound leads tracked to a specific post/source.',
  },
  {
    month: 'Month 4 · Jan 2027',
    theme: 'Proof',
    focus: [
      'Publish the first real case study (pilot or client) as reel + carousel + LinkedIn post.',
      'First testimonial reel (real client, real words).',
      'Wedding planning season: "questions to ask your wedding photographer" series.',
    ],
    milestone: 'Case study live; proof pillar no longer relies on our own shoots.',
  },
  {
    month: 'Month 5 · Feb 2027',
    theme: 'Scale',
    focus: [
      "Valentine's / wedding booking campaign.",
      'Launch a recurring weekly series: "60-second content audit" of a local business (with permission) — strong hook and B2B lead magnet.',
      'YouTube long-form #5 (wedding film or "how we produce a shoot").',
    ],
    milestone: 'One recurring series established with its own audience.',
  },
  {
    month: 'Month 6 · Mar 2027',
    theme: 'Convert & review',
    focus: [
      'Offer-led reels (free content pilot) aimed at the warm audience built in months 1–5.',
      '6-month report: real numbers vs. the projection scenarios.',
      'Package the whole playbook as the template sold to clients; plan the next 6 months.',
    ],
    milestone: 'Decision made on what to keep, cut and scale — backed by real data.',
  },
]

export const REEL_FORMATS: { name: string; duration: string; pillar: string; how: string }[] = [
  { name: 'Before / After reveal', duration: '7–12s', pillar: 'Proof', how: 'Raw phone shot → beat-drop cut → finished edit. No talking needed.' },
  { name: '"3 mistakes" talking head', duration: '25–45s', pillar: 'Teach', how: 'Direct to camera, one mistake + fix per ~9s, b-roll over each fix.' },
  { name: 'Shoot-day montage', duration: '10–20s', pillar: 'Behind the scenes', how: 'Fast cuts on trending audio, ends on a frame that loops to the start.' },
  { name: 'POV / day in the life', duration: '15–30s', pillar: 'People', how: 'First-person framing, on-screen text narrates, minimal voiceover.' },
  { name: 'Wedding highlight', duration: '15–30s (full film 3–5 min on YouTube)', pillar: 'Weddings & events', how: 'Open on the strongest emotional frame, one voiceover line, music-led.' },
  { name: 'Mini content audit', duration: '30–60s', pillar: 'Teach', how: 'Green-screen over a public profile (with permission): 3 fixes, 1 CTA.' },
  { name: 'Photo slideshow reel', duration: '7–10s', pillar: 'Proof', how: 'Repurposes a carousel into motion — lowest effort, keeps the grid active.' },
]

export const REEL_STRUCTURE: { time: string; part: string; rule: string }[] = [
  { time: '0–2s', part: 'Hook', rule: 'Movement in the first frame + on-screen text (max 7 words) + the spoken line. Never open with a logo or "hi guys".' },
  { time: '2–5s', part: 'Promise', rule: 'Tell them what they get if they keep watching ("number 3 is the one everyone misses").' },
  { time: '5s → end−3s', part: 'Value', rule: 'One idea per video. Cut every 1–2 seconds. Captions always on.' },
  { time: 'Last 2–3s', part: 'CTA or loop', rule: 'One CTA only (save / comment a keyword / DM), or end on a frame that loops seamlessly into the hook.' },
]

export const HOOK_BANK: { pillar: string; hooks: string[] }[] = [
  {
    pillar: 'Proof',
    hooks: [
      'Same room. Same light. Watch what changes.',
      "We gave this café one shoot day. Here's the month of content it became.",
      'Phone photo vs. professional shoot — which one would you book?',
      'Raw footage → final reel in 10 seconds.',
      'This is what a €2,500/month content plan actually delivers.',
    ],
  },
  {
    pillar: 'Teach',
    hooks: [
      'Stop posting your menu. Post this instead.',
      "3 reasons your hotel's Instagram isn't getting bookings.",
      "If your reel starts with your logo, you've already lost them.",
      "The first 2 seconds decide everything. Here's how to use them.",
      "You don't need more content. You need content people save.",
      "Your Google reviews are your best content. Here's how to film them.",
    ],
  },
  {
    pillar: 'Behind the scenes',
    hooks: [
      'What a real shoot day for a Rotterdam hotel looks like.',
      'Everything we packed for a 4-hour shoot.',
      'How we turn one shoot into 30 days of content.',
      'The edit nobody sees: 2 hours for 15 seconds.',
    ],
  },
  {
    pillar: 'Weddings & events',
    hooks: [
      'Questions nobody asks their wedding photographer (but should).',
      'The 5 minutes after the ceremony are the best photos of the day.',
      'Your wedding in 15 seconds.',
      'Planning a wedding in the Netherlands? Save this.',
    ],
  },
  {
    pillar: 'People',
    hooks: [
      "We're Agrita & Vin — and we film businesses for a living.",
      'From Riga to Rotterdam: why we started a content studio.',
      'What nobody tells you about running a content agency.',
    ],
  },
  {
    pillar: 'Engagement CTAs',
    hooks: [
      "Comment 'AUDIT' and we'll review your Instagram for free.",
      'Tag the business owner who needs to see this.',
    ],
  },
]

export const SCRIPT_TEMPLATES: { name: string; length: string; beats: { time: string; line: string }[] }[] = [
  {
    name: '"3 Mistakes" (talking head)',
    length: '~35s',
    beats: [
      { time: '0–2s', line: '"3 reasons your [business type] Instagram isn\'t getting [bookings]."' },
      { time: '2–5s', line: '"Number 3 is the one everyone gets wrong."' },
      { time: '5–14s', line: 'Mistake 1 + the fix (b-roll of the fix).' },
      { time: '14–23s', line: 'Mistake 2 + the fix.' },
      { time: '23–32s', line: 'Mistake 3 + the fix.' },
      { time: '32–35s', line: '"Want us to check yours? Comment AUDIT."' },
    ],
  },
  {
    name: 'Before / After (no speech)',
    length: '~10s',
    beats: [
      { time: '0–2s', line: 'Raw phone shot, on-screen text: "Before: phone photo".' },
      { time: '2–3s', line: 'Transition on the beat drop.' },
      { time: '3–8s', line: 'Finished sequence from the shoot.' },
      { time: '8–10s', line: 'Text: "Shot in 1 hour. Want this for your business? Link in bio."' },
    ],
  },
  {
    name: 'One shoot → 30 days',
    length: '~25s',
    beats: [
      { time: '0–2s', line: '"We shot this café for 4 hours."' },
      { time: '2–6s', line: 'Timelapse of the shoot.' },
      { time: '6–20s', line: 'Rapid grid of every output (reels, photos, stories) with a counter going up.' },
      { time: '20–25s', line: '"That\'s a month of content. Free pilot — link in bio."' },
    ],
  },
  {
    name: 'Wedding moment',
    length: '~15s',
    beats: [
      { time: '0–2s', line: 'Strongest emotional frame. Voiceover: "The moment she saw him."' },
      { time: '2–13s', line: 'Music-led sequence, no more talking.' },
      { time: '13–15s', line: 'Text: "Booking 2027 weddings — DM us."' },
    ],
  },
]

export const SPEECH_RULES: string[] = [
  'Speak to one person, lens at eye level, 140–160 words per minute.',
  'Short sentences (12 words max). Start on the hook word — no greeting, no "so today…".',
  "One idea per video. If it needs two ideas, it's two videos.",
  'Burned-in captions on every video (most people scroll muted); highlight 1–2 key words in the brand color.',
  'Clean audio beats 4K: lavalier or shotgun mic, quiet room.',
  'Record 3 hook variants for every talking-head video and test them.',
  'English by default; RU/LV subtitles for posts aimed at Baltic audiences.',
]

export const POST_RULES: string[] = [
  'Caption line 1 restates the hook or asks a question; include search keywords ("Rotterdam hotel content", "wedding photographer Netherlands") — Instagram and TikTok search read captions.',
  '3–5 specific hashtags, not 30 generic ones.',
  'One CTA per post.',
  'Trending audio (low volume) for montages; original audio for talking heads.',
  'One consistent cover template (brand font, 3–5 word title) so the grid reads like a catalogue.',
  'Export 1080×1920 (9:16); keep text out of the bottom 20% and the right edge where the app UI sits.',
  'Starting posting windows: weekdays 07:30–09:00 or 18:00–20:00 CET. Replace with the "most active times" from Insights after month 1.',
]

export const WEEKLY_CALENDAR: { day: string; plan: string }[] = [
  { day: 'Mon', plan: 'Teach reel (talking head) + story set' },
  { day: 'Tue', plan: 'Proof carousel (Instagram + LinkedIn)' },
  { day: 'Wed', plan: 'Behind-the-scenes reel' },
  { day: 'Thu', plan: 'Proof reel (before/after) + LinkedIn post' },
  { day: 'Fri', plan: 'Weddings & events reel' },
  { day: 'Sat', plan: 'People reel or Collab post with the founder account' },
  { day: 'Sun', plan: 'Stories only (Q&A box, polls) + plan next week' },
]

export const PLATFORMS: { name: string; role: string; formats: string; cadence: string; first30: string[] }[] = [
  {
    name: 'Instagram',
    role: 'Home base — portfolio, trust, DMs.',
    formats: 'Reels 7–45s, carousels, daily stories (3–7 frames).',
    cadence: '4–5 reels + 1–2 carousels per week.',
    first30: ['Complete the 7 conversion steps (Audit tab).', 'Pin 3 posts: best proof reel, the offer, "who we are".'],
  },
  {
    name: 'Facebook (set up first)',
    role: 'Required for Meta ads and WhatsApp Business; local groups.',
    formats: 'Cross-posted Reels and photos.',
    cadence: 'Automatic via Meta Business Suite.',
    first30: [
      'Create the Page and link it to the converted Instagram account.',
      'Turn on automatic IG → FB cross-posting.',
      'Join 3–5 local groups (Rotterdam expats, NL weddings, hospitality) — contribute, never spam.',
    ],
  },
  {
    name: 'TikTok',
    role: 'Discovery — the most organic reach for a 0-follower account.',
    formats: '15–45s, re-edited natively (TikTok text, trending sound).',
    cadence: '4–5 videos per week.',
    first30: ['Same handle as Instagram.', 'Month 1 success = consistency, not follower count.'],
  },
  {
    name: 'LinkedIn',
    role: 'B2B trust — where the CRM’s hotel/travel/corporate decision makers are.',
    formats: 'Native video 30–90s, PDF carousels, text posts.',
    cadence: '2–3 posts per week; founders post from personal profiles.',
    first30: [
      'Company page + Agrita and Vin personal profiles as founders.',
      'Connect with contacts at Hotels & Travel prospects already in the CRM.',
    ],
  },
  {
    name: 'YouTube',
    role: 'Search and long-term SEO.',
    formats: 'Shorts ≤60s (every reel) + 1 long-form video (6–12 min) per month.',
    cadence: 'Shorts daily-ish from the reel library; long-form monthly.',
    first30: ['Channel with the same handle and banner.', 'First long-form: "How we produce a shoot" or a wedding film.'],
  },
]

export const MONTHLY_DELIVERABLES: string[] = [
  '16+ short-form videos — edited, captioned, with platform-native versions',
  '30+ edited photos',
  '4 carousels',
  'Daily story plan',
  '1 YouTube long-form video',
  '8–12 LinkedIn posts',
  '2 shoot days (4 hours each)',
  'Monthly content calendar with scripts and 3 hooks per video',
  'Community management basics: comments and DMs answered within 24h',
  'Monthly performance report + 30-minute strategy call',
  'Quarterly strategy review',
]

export const WORKFLOW: { step: string; detail: string }[] = [
  { step: 'Week 1 — Plan', detail: 'Calendar + scripts + 3 hooks per video, approved before shooting.' },
  { step: 'Week 1–2 — Shoot day A', detail: '4 hours → ~8 reels + ~15 photos.' },
  { step: 'Week 3 — Shoot day B', detail: '4 hours → ~8 reels + ~15 photos.' },
  { step: 'Editing SLA', detail: 'First cut in 48h, final in 24h after feedback.' },
  { step: 'Scheduling', detail: 'Meta Business Suite (IG + FB), native schedulers for TikTok, YouTube and LinkedIn.' },
  { step: 'Priority production', detail: 'Same-week turnaround. Misses are logged in the monthly report, not hidden.' },
  { step: 'Tools (free-first)', detail: 'CapCut (edit), Canva free (covers, carousels), Meta Business Suite (schedule + Insights), GA4 (site), this CRM (tracking).' },
]

export type Scenario = { metric: string; start: string; m3: [string, string, string]; m6: [string, string, string] }

export const PROJECTIONS: Scenario[] = [
  { metric: 'IG company followers', start: '1,275', m3: ['1,500', '1,900', '2,500'], m6: ['1,900', '3,000', '5,000'] },
  { metric: 'TikTok followers', start: '0', m3: ['150', '600', '2,500'], m6: ['500', '2,000', '10,000'] },
  { metric: 'LinkedIn followers', start: '0', m3: ['80', '200', '400'], m6: ['200', '500', '1,000'] },
  { metric: 'YouTube subscribers', start: '0', m3: ['30', '100', '400'], m6: ['100', '400', '1,500'] },
  { metric: 'Facebook page followers', start: '0', m3: ['50', '150', '300'], m6: ['150', '400', '800'] },
  { metric: 'Inbound leads / month', start: '0', m3: ['1', '3', '6'], m6: ['2', '6', '15'] },
  { metric: 'Recurring clients from content (cumulative)', start: '0', m3: ['0', '1', '2'], m6: ['1', '3', '6'] },
]

export const PROJECTION_ASSUMPTIONS: string[] = [
  'These are planning scenarios, not guarantees or achieved results. They are replaced by real numbers in the Tracking tab every month.',
  'Assumes the cadence is actually kept (16+ videos/month from month 2). If it slips, assume the conservative column.',
  'No paid ads beyond optional €150 boost tests. A paid budget would shift every column upward.',
  'TikTok has the widest range: one breakout video can move an account from the conservative to the optimistic column.',
  'The overall business target in the separate 6-month action plan (8–12 active clients) depends mainly on outbound outreach; content is a supporting channel, counted here only for clients it directly sources.',
]

export const AUDITS: {
  handle: string
  url: string
  posts: number
  followers: number
  following: number
  bio: string
  link: string
  highlights: string[]
  findings: string[]
}[] = [
  {
    handle: '@worlddigital_marketing_agency',
    url: 'https://www.instagram.com/worlddigital_marketing_agency',
    posts: 391,
    followers: 1275,
    following: 3937,
    bio: 'YOUR BRAND MANAGER HERE · Digital creator · We help you grow in social platforms from ZERO · DM for collabs · WordPress',
    link: 'taplink.cc/best_traveldeals',
    highlights: ['SALE', 'Costumers', 'Reviews', 'About us', 'Principles'],
    findings: [
      'Follows 3.1x more accounts than follow it (3,937 vs 1,275) — the typical follow-for-follow footprint. The audience is likely low quality, and at a glance it hurts an agency’s credibility.',
      'Only ~3.3 followers per post (1,275 / 391): lots of output, little traction.',
      'The bio link goes to "best_traveldeals", not a marketing service — it contradicts the bio.',
      '4 of 5 highlight covers reuse the same stock photo; "Costumers" is a typo.',
      'Good agency skeleton: Reviews, About us and Customers highlights already exist, and the bio is client-facing ("we help you grow").',
    ],
  },
  {
    handle: '@agrita_world_adventures',
    url: 'https://www.instagram.com/agrita_world_adventures/',
    posts: 789,
    followers: 10800,
    following: 9296,
    bio: 'Traveler & brand manager & makeup artist EU · Travel | Content | LV based in NL · We turn moments into visuals · @agrita_photography · DM for collabs',
    link: 'taplink.cc/agrita_makeup_buisness_creator',
    highlights: ['Netherlands', 'Events 3', 'Deals', 'Collabs', 'Latvia', 'Photostudio', 'Collabs2'],
    findings: [
      'The strongest asset: 10.8K followers, ~13.7 per post, and a healthy follower/following ratio (1.16) compared with the agency account.',
      'Real brand collaborations (Collabs, Collabs2, Deals highlights) — social proof the company doesn’t use yet.',
      'The bio mixes three identities (traveler, brand manager, makeup artist). Separate accounts already exist (@agrita_photography, @agrita_makeup) but the bio doesn’t make that clear.',
      'Typo in the link: "buisness" instead of "business".',
      'Follows 9,296 accounts — worth reducing gradually.',
    ],
  },
]

export const STILL_UNKNOWN: string[] = [
  'Engagement rate (likes + comments + saves / reach)',
  'Reach and views per post',
  'Top-performing posts and reels',
  'Audience location (how much is NL / Rotterdam?)',
]

export const DECISION = {
  from: '@worlddigital_marketing_agency',
  to: 'Agrita&Vin Content Co.',
  reasons: [
    'It is already positioned as an agency ("we help you grow"), with Reviews, About us and Customers highlights — the skeleton exists.',
    'Converting it only puts 1,275 low-quality followers at stake. Converting the founder account would risk 10.8K people who follow Agrita for travel, not for an agency.',
    '@agrita_world_adventures stays the founder’s personal brand and feeds the company through Collab posts and mentions — a founder-led brand converts better than an agency account on its own.',
  ],
  steps: [
    'Change the username to a brand handle (e.g. @agritavin.content — check availability) and the display name to "Agrita&Vin Content Co.". Followers and posts are kept.',
    'Switch to a professional (Business) account to unlock Instagram Insights — without it there are no real numbers for the monthly report.',
    'Archive (not delete — it’s reversible) posts that don’t represent the brand: generic stock, travel deals.',
    'New bio: what we do, for whom, where (Rotterdam + Baltics), with a CTA to the free quiz. Link to the landing page instead of taplink.cc/best_traveldeals.',
    'Rebuild highlights with real covers, fix "Costumers" → "Clients", add Weddings, Reels, Quiz and Pricing.',
    'Reduce the following count gradually (a few dozen per day) to avoid Instagram action limits.',
    'Cross-link from the personal accounts: "Co-founder @…" in the bios of @agrita_world_adventures, @agrita_photography and @agrita_makeup.',
  ],
}

// Used by the "Clone by industry" tab to show how the same hook template
// re-skins per vertical while cadence, structure and reporting stay fixed.
export const VERTICAL_HOOK_WORDS: Record<Vertical, { business: string; outcome: string }> = {
  'Hotels & Hospitality': { business: 'hotel', outcome: 'bookings' },
  'Travel & Tour Operators': { business: 'travel agency', outcome: 'enquiries' },
  'Cosmetics & Beauty': { business: 'salon', outcome: 'appointments' },
  'Footwear & Fashion': { business: 'store', outcome: 'sales' },
  'Pharmacy & Health Retail': { business: 'pharmacy', outcome: 'store visits' },
  'Events & Corporate': { business: 'venue', outcome: 'event bookings' },
  'Restaurants & Lifestyle': { business: 'restaurant', outcome: 'reservations' },
}

import type { Vertical, VerticalStrategy } from '@/types'

export const VERTICALS: Vertical[] = [
  'Hotels & Hospitality',
  'Travel & Tour Operators',
  'Cosmetics & Beauty',
  'Footwear & Fashion',
  'Pharmacy & Health Retail',
  'Events & Corporate',
  'Restaurants & Lifestyle',
]

export const VERTICAL_STRATEGIES: Record<Vertical, VerticalStrategy> = {
  'Hotels & Hospitality': {
    vertical: 'Hotels & Hospitality',
    summary:
      'Hotels sell an experience before a guest ever arrives. Recurring content builds the "want to be there" feeling that drives direct bookings and reduces reliance on OTA commissions.',
    contentIdeas: [
      'Room tours',
      'Breakfast',
      'Spa',
      'Restaurant',
      'Lobby',
      'Local experiences',
      'Weekend packages',
      'Events',
      'Behind the scenes',
      'Guest experience',
    ],
  },
  'Travel & Tour Operators': {
    vertical: 'Travel & Tour Operators',
    summary:
      'Travel is bought on inspiration first, logistics second. Consistent destination and deal content keeps the brand top-of-mind for the next trip.',
    contentIdeas: [
      'Destination videos',
      'Travel inspiration',
      'Deals',
      'Itinerary videos',
      'Hotel highlights',
      'Airport/travel tips',
      'Seasonal campaigns',
      'UGC',
    ],
  },
  'Cosmetics & Beauty': {
    vertical: 'Cosmetics & Beauty',
    summary:
      'Beauty is one of the most visually native categories on social. Texture, routine and founder-story content builds trust that converts browsers into buyers.',
    contentIdeas: [
      'Product close-ups',
      'Before/after style content where legally appropriate',
      'Texture videos',
      'Routine videos',
      'Founder stories',
      'New product launches',
      'UGC',
      'Seasonal campaigns',
    ],
    cautions: [
      'Avoid medical or efficacy claims that require substantiation.',
      'Before/after content must be honest, unedited and comply with advertising standards.',
    ],
  },
  'Footwear & Fashion': {
    vertical: 'Footwear & Fashion',
    summary:
      'Retail foot traffic increasingly starts on Instagram and TikTok. Product and lifestyle content turns a store visit into a habit rather than a one-off.',
    contentIdeas: [
      'Product photography',
      'Lifestyle photography',
      'Outfit videos',
      'Try-on videos',
      'Store content',
      'New collection launches',
      'Street-style Reels',
      'UGC',
    ],
  },
  'Pharmacy & Health Retail': {
    vertical: 'Pharmacy & Health Retail',
    summary:
      'Pharmacies are trusted local institutions but rarely show up in feeds. Store and staff content builds familiarity without ever making a medical claim.',
    contentIdeas: [
      'Store experience',
      'Product categories',
      'Seasonal educational content',
      'Staff introduction',
      'Wellness campaigns',
      'Store photography',
    ],
    cautions: [
      'No medical or health claims. No implied diagnosis or treatment promises.',
      'Educational content should point to a pharmacist for personal advice.',
    ],
  },
  'Events & Corporate': {
    vertical: 'Events & Corporate',
    summary:
      'Corporate and event clients need proof of professionalism and scale — and families planning a wedding want proof the day will be captured beautifully. Recap and highlight content does double duty as sales collateral for the next event, and as the actual memories a couple keeps forever.',
    contentIdeas: [
      'Wedding highlights',
      'Ceremony & reception reels',
      'Engagement shoots',
      'Event photography',
      'Corporate portraits',
      'Behind the scenes',
      'Conference Reels',
      'Aftermovies',
      'Employee branding',
      'Employer branding',
      'LinkedIn content',
    ],
  },
  'Restaurants & Lifestyle': {
    vertical: 'Restaurants & Lifestyle',
    summary:
      'Food is one of the highest-performing content categories on every platform. Consistent posting keeps tables full on slow nights and builds a waitlist for peak ones.',
    contentIdeas: [
      'Food photography',
      'Chef content',
      'Behind the scenes',
      'Atmosphere',
      'Events',
      'Reels',
      'Customer experience',
    ],
  },
}

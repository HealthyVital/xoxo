// ---------------------------------------------------------------------------
// Rule-based scoring for the public lead-qualification quiz. Meant to be
// linked from social posts/bios to find real local businesses that are a
// strong fit for the Free Content Pilot — runs entirely client-side.
// ---------------------------------------------------------------------------

import type { QuizAnswer } from '@/types'

export interface QuizOption {
  id: string
  label: string
  points: number
}

export interface QuizQuestion {
  id: string
  question: string
  helper?: string
  options: QuizOption[]
}

export const QUALIFYING_THRESHOLD = 55

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'content-happiness',
    question: 'How happy are you with your current photos and videos?',
    options: [
      { id: 'none', label: "We don't really have any", points: 20 },
      { id: 'unhappy', label: 'Not happy — outdated or low quality', points: 18 },
      { id: 'okay', label: "It's okay, could be better", points: 12 },
      { id: 'happy', label: 'Very happy with what we have', points: 2 },
    ],
  },
  {
    id: 'posting-frequency',
    question: 'How often do you currently post new content?',
    options: [
      { id: 'rarely', label: 'Rarely or never', points: 15 },
      { id: 'monthly', label: 'A few times a month', points: 10 },
      { id: 'weekly', label: 'Weekly', points: 5 },
      { id: 'daily', label: 'Daily or almost daily', points: 1 },
    ],
  },
  {
    id: 'dedicated-photographer',
    question: 'Do you work with a photographer or videographer on a regular basis?',
    options: [
      { id: 'never', label: 'No, never', points: 15 },
      { id: 'occasionally', label: 'Occasionally, for one-off shoots', points: 10 },
      { id: 'ongoing', label: 'Yes, an ongoing arrangement', points: 1 },
    ],
  },
  {
    id: 'content-driving-bookings',
    question: 'Is your current content actually driving bookings or new customers?',
    options: [
      { id: 'no', label: 'No, not that we can tell', points: 14 },
      { id: 'unsure', label: "We're not sure / don't track it", points: 10 },
      { id: 'somewhat', label: 'Somewhat', points: 5 },
      { id: 'yes', label: 'Yes, clearly', points: 1 },
    ],
  },
  {
    id: 'biggest-challenge',
    question: "What's your biggest challenge with content right now?",
    options: [
      { id: 'no-time', label: "No time to create it", points: 12 },
      { id: 'no-idea', label: "Don't know what to post", points: 12 },
      { id: 'no-budget', label: 'No budget for a professional', points: 8 },
      { id: 'quality', label: 'Quality is inconsistent', points: 10 },
    ],
  },
  {
    id: 'social-presence',
    question: 'Do you have an active Instagram or TikTok business account?',
    options: [
      { id: 'no-account', label: "No, we don't have one", points: 10 },
      { id: 'inactive', label: 'We have one but rarely post', points: 12 },
      { id: 'active', label: 'Yes, and we post regularly', points: 3 },
    ],
  },
  {
    id: 'upcoming-activity',
    question: 'Do you have any promotions, launches or events coming up?',
    options: [
      { id: 'yes-soon', label: 'Yes, in the next few weeks', points: 12 },
      { id: 'planning', label: "We're planning one", points: 8 },
      { id: 'no', label: 'Nothing planned right now', points: 2 },
    ],
  },
  {
    id: 'team-size',
    question: 'Roughly how many people work at your business?',
    options: [
      { id: 'micro', label: '1–9', points: 6 },
      { id: 'small', label: '10–49', points: 8 },
      { id: 'medium', label: '50–249', points: 6 },
      { id: 'large', label: '250+', points: 4 },
    ],
  },
  {
    id: 'decision-role',
    question: 'Are you the person who decides on marketing/content for the business?',
    options: [
      { id: 'yes', label: 'Yes, that’s me', points: 10 },
      { id: 'influence', label: 'I influence the decision', points: 7 },
      { id: 'no', label: "No, someone else decides", points: 2 },
    ],
  },
  {
    id: 'free-pilot-interest',
    question: 'If you could get a professional content shoot done for free as a trial, how interested would you be?',
    helper: 'This is our actual offer — a free pilot shoot, no cost and no obligation.',
    options: [
      { id: 'very', label: 'Very interested — let’s talk', points: 15 },
      { id: 'somewhat', label: 'Somewhat interested', points: 10 },
      { id: 'not-now', label: 'Not right now', points: 1 },
    ],
  },
]

export function computeQuizScore(answers: QuizAnswer[]): { score: number; qualified: boolean } {
  const raw = answers.reduce((sum, a) => sum + (optionPoints(a) ?? 0), 0)
  const maxPossible = QUIZ_QUESTIONS.reduce(
    (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
    0,
  )
  const score = Math.round((raw / maxPossible) * 100)
  return { score, qualified: score >= QUALIFYING_THRESHOLD }
}

function optionPoints(answer: QuizAnswer): number | undefined {
  const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId)
  return question?.options.find((o) => o.id === answer.optionId)?.points
}

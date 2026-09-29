import type { Client, Prospect } from '@/types'

export function computeCrmStats(prospects: Prospect[], clients: Client[]) {
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const newThisWeek = prospects.filter((p) => new Date(p.createdAt) >= weekAgo).length

  const contactedStages = new Set([
    'Contacted',
    'Opened',
    'Replied',
    'Positive Reply',
    'Meeting',
    'Free Pilot',
    'Proposal',
    'Negotiation',
    'Won',
    'Lost',
  ])
  const contacted = prospects.filter((p) => contactedStages.has(p.status)).length
  const replied = prospects.filter((p) =>
    ['Replied', 'Positive Reply', 'Meeting', 'Free Pilot', 'Proposal', 'Negotiation', 'Won'].includes(p.status),
  ).length
  const positiveReplies = prospects.filter((p) =>
    ['Positive Reply', 'Meeting', 'Free Pilot', 'Proposal', 'Negotiation', 'Won'].includes(p.status),
  ).length
  const meetings = prospects.filter((p) =>
    ['Meeting', 'Free Pilot', 'Proposal', 'Negotiation', 'Won'].includes(p.status),
  ).length
  const freePilots = prospects.filter((p) => ['Free Pilot', 'Proposal', 'Negotiation', 'Won'].includes(p.status)).length
  const proposalsSent = prospects.filter((p) => ['Proposal', 'Negotiation', 'Won'].includes(p.status)).length
  const won = prospects.filter((p) => p.status === 'Won').length
  const lost = prospects.filter((p) => p.status === 'Lost' || p.status === 'Not Interested').length

  const mrr = clients.filter((c) => c.status === 'Active').reduce((sum, c) => sum + c.mrr, 0)

  const openPipelineStatuses = new Set([
    'New',
    'Researching',
    'Ready to Contact',
    'Contacted',
    'Opened',
    'Replied',
    'Positive Reply',
    'Meeting',
    'Free Pilot',
    'Proposal',
    'Negotiation',
  ])
  const pipelineValue = prospects
    .filter((p) => openPipelineStatuses.has(p.status))
    .reduce((sum, p) => sum + (p.dealValue ?? 0), 0)

  const conversionRate = contacted > 0 ? (won / contacted) * 100 : 0
  const averageDealValue = won > 0 ? clients.reduce((s, c) => s + c.mrr, 0) / Math.max(clients.length, 1) : 0

  return {
    totalProspects: prospects.length,
    newThisWeek,
    contacted,
    replied,
    positiveReplies,
    meetings,
    freePilots,
    proposalsSent,
    won,
    lost,
    mrr,
    pipelineValue,
    conversionRate,
    averageDealValue,
  }
}

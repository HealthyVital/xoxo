import { useState } from 'react'
import { ClipboardCopy, UserPlus } from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader } from '@/components/ui/Misc'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, todayIso } from '@/lib/utils'

const QUIZ_LINK = `${location.origin}${import.meta.env.BASE_URL}quiz`

export default function QuizLeads() {
  const { quizSubmissions, addProspect, markQuizConverted } = useDataStore()
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(QUIZ_LINK).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function convertToProspect(q: (typeof quizSubmissions)[number]) {
    if (!q.industry) return
    const hasEmail = Boolean(q.contactEmail)
    const hasPhone = Boolean(q.contactPhone)
    const verificationStatus = hasEmail && hasPhone ? 'Verified' : hasEmail || hasPhone ? 'Partially Verified' : 'Needs Verification'
    const record = addProspect({
      companyName: q.companyName,
      industry: q.industry,
      country: 'Netherlands',
      city: '',
      email: q.contactEmail || undefined,
      phone: q.contactPhone || undefined,
      instagram: q.instagram || undefined,
      marketingContact: q.contactName || undefined,
      source: `Quiz lead (self-submitted) — score ${q.qualificationScore}`,
      sourceUrl: undefined,
      lastVerified: todayIso(),
      verificationStatus,
      leadScore: q.qualificationScore,
      scoreReasons: [
        `Self-reported via the lead quiz, qualification score ${q.qualificationScore}/100`,
        'Contact details provided directly by the business, not independently verified yet',
      ],
      recommendedApproach: q.qualified
        ? 'Reach out promptly — they qualified for the Free Content Pilot and expressed real interest.'
        : 'Lower-intent quiz lead — verify fit before offering the free pilot.',
      companySize: 'Unknown',
      location: '',
      notes: `Quiz answers: ${q.answers.map((a) => a.label).join('; ')}`,
      painPoints: [],
      contentOpportunity: '',
      status: 'New',
      assignedTo: 'Unassigned',
      doNotContact: false,
      isDemo: false,
      subIndustry: undefined,
      marketingRole: undefined,
      address: undefined,
      postalCode: undefined,
      facebook: undefined,
      linkedin: undefined,
      tiktok: undefined,
      personalizationNotes: undefined,
      lastContact: undefined,
      nextFollowUp: undefined,
      dealValue: 1100,
      consentNotes: 'Submitted their own info via the public quiz — treat as opted in to being contacted.',
    })
    markQuizConverted(q.id, record.id)
  }

  return (
    <div>
      <PageHeader
        title="Quiz leads"
        description="Submissions from the public lead-qualification quiz — share the link below on social posts and bios."
      />

      <Card className="mb-4 flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-ink-muted)]">Quiz link to post</p>
          <p className="text-sm font-medium text-[var(--color-ink)]">{QUIZ_LINK}</p>
        </div>
        <Button variant="outline" onClick={copyLink}>
          <ClipboardCopy size={14} /> {copied ? 'Copied!' : 'Copy link'}
        </Button>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Qualified</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {quizSubmissions.map((q) => (
              <tr key={q.id} className="border-b border-[var(--color-hairline)] last:border-0">
                <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{q.companyName}</td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{q.industry || '—'}</td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">
                  {q.contactEmail || q.contactPhone || '—'}
                </td>
                <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{q.qualificationScore}</td>
                <td className="px-4 py-3">
                  <Badge tone={q.qualified ? 'good' : 'neutral'}>{q.qualified ? 'Qualified' : 'Lower fit'}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{formatDate(q.createdAt)}</td>
                <td className="px-4 py-3">
                  {q.convertedToProspectId ? (
                    <Badge tone="brand">Added to Prospects</Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => convertToProspect(q)}>
                      <UserPlus size={13} /> Convert
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {quizSubmissions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-[var(--color-ink-muted)]">
                  No quiz submissions yet — share the link above on your social posts and bio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

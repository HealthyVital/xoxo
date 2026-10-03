import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardCopy, UserPlus } from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader } from '@/components/ui/Misc'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { buildProspectFromQuiz } from '@/lib/quiz'

const QUIZ_BASE_LINK = `${location.origin}${import.meta.env.BASE_URL}quiz`
const QUIZ_LINKS = [
  { label: 'English', url: QUIZ_BASE_LINK },
  { label: 'Русский (Russian)', url: `${QUIZ_BASE_LINK}/ru` },
  { label: 'Latviešu (Latvian)', url: `${QUIZ_BASE_LINK}/lv` },
]

export default function QuizLeads() {
  const { quizSubmissions, addProspect, markQuizConverted } = useDataStore()
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  function copyLink(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl((u) => (u === url ? null : u)), 1500)
    })
  }

  // Submissions are added to Prospects automatically the moment someone
  // completes the quiz (see Quiz.tsx) — this stays only as a manual fallback
  // for any older submission saved before that behavior shipped.
  function convertToProspect(q: (typeof quizSubmissions)[number]) {
    if (!q.industry) return
    const record = addProspect(
      buildProspectFromQuiz({
        companyName: q.companyName,
        industry: q.industry,
        contactName: q.contactName,
        contactEmail: q.contactEmail,
        contactPhone: q.contactPhone,
        instagram: q.instagram,
        answers: q.answers,
        score: q.qualificationScore,
        qualified: q.qualified,
      }),
    )
    markQuizConverted(q.id, record.id)
  }

  return (
    <div>
      <PageHeader
        title="Quiz leads"
        description="Submissions from the public lead-qualification quiz, added to Prospects automatically — qualified leads are marked priority (Ready to Contact)."
      />

      <Card className="mb-4 divide-y divide-[var(--color-hairline)] p-0">
        {QUIZ_LINKS.map(({ label, url }) => (
          <div key={url} className="flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--color-ink-muted)]">Quiz link to post — {label}</p>
              <p className="text-sm font-medium text-[var(--color-ink)]">{url}</p>
            </div>
            <Button variant="outline" onClick={() => copyLink(url)}>
              <ClipboardCopy size={14} /> {copiedUrl === url ? 'Copied!' : 'Copy link'}
            </Button>
          </div>
        ))}
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
                  <Badge tone={q.qualified ? 'good' : 'neutral'}>{q.qualified ? 'Priority — Qualified' : 'Lower fit'}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{formatDate(q.createdAt)}</td>
                <td className="px-4 py-3">
                  {q.convertedToProspectId ? (
                    <Link to="/app/prospects" className="text-xs font-medium text-[var(--color-brand)] hover:underline">
                      <Badge tone="brand">View in Prospects ↗</Badge>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => convertToProspect(q)}>
                      <UserPlus size={13} /> Add to Prospects
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

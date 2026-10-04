import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Camera, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS } from '@/data/verticals'
import { computeFreeAudit } from '@/lib/freeAudit'
import { SEED_PRICING_PACKAGES } from '@/data/seedData'
import { trackEvent } from '@/lib/analytics'
import type { FreeAuditResult, Vertical } from '@/types'

export default function FreeAudit() {
  const { addFreeAuditSubmission } = useDataStore()
  const [searchParams] = useSearchParams()
  // Pre-filled when arriving as the next step after qualifying in the quiz
  // (see Quiz.tsx's "qualified" result CTA) — avoids asking the same two
  // questions twice. Still a perfectly normal blank form for anyone else.
  const prefillCompany = searchParams.get('company') ?? ''
  const prefillIndustry = (searchParams.get('industry') as Vertical | null) ?? ''
  const [company, setCompany] = useState(prefillCompany)
  const [website, setWebsite] = useState('')
  const [instagram, setInstagram] = useState('')
  const [industry, setIndustry] = useState<Vertical | ''>(VERTICALS.includes(prefillIndustry as Vertical) ? prefillIndustry : '')
  const [mainChallenge, setMainChallenge] = useState('')
  const [mainGoal, setMainGoal] = useState('')
  const [result, setResult] = useState<FreeAuditResult | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const submission = { company, website, instagram, industry, mainChallenge, mainGoal }
    addFreeAuditSubmission(submission)
    trackEvent('audit_submit', { industry: industry || 'unspecified' })
    setResult(computeFreeAudit(submission))
  }

  const recommendedPkg = result ? SEED_PRICING_PACKAGES.find((p) => p.id === result.recommendedPackage) : null

  return (
    <div className="min-h-screen bg-[var(--color-plane)]">
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-ink)] text-white">
              <Camera size={14} />
            </div>
            Agrita&Vin Content Co.
          </Link>
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
            <ArrowLeft size={13} /> Back home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--color-ink)]">Free Content Audit</h1>
        <p className="mb-8 text-sm text-[var(--color-ink-secondary)]">
          Two minutes, no cost. We'll compute a content opportunity score and 3 tailored ideas — calculated instantly,
          locally, from what you tell us below.
        </p>

        {!result ? (
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" required value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourcompany.com" />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourcompany" />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value as Vertical)}>
                    <option value="">Select your industry</option>
                    {VERTICALS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mainChallenge">Main challenge</Label>
                  <Textarea id="mainChallenge" required value={mainChallenge} onChange={(e) => setMainChallenge(e.target.value)} placeholder="e.g. we don't have time to create consistent content" />
                </div>
                <div>
                  <Label htmlFor="mainGoal">Main goal</Label>
                  <Textarea id="mainGoal" required value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} placeholder="e.g. more direct bookings" />
                </div>
                <Button type="submit" className="w-full">
                  <Sparkles size={14} /> Get my content audit
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <p className="text-xs font-medium text-[var(--color-ink-muted)]">Content opportunity score</p>
              <p className="tabular-nums mt-1 text-5xl font-semibold text-[var(--color-brand)]">
                {result.contentOpportunityScore}
              </p>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">out of 100 — an internal prioritization estimate, not an audited fact</p>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's likely missing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm text-[var(--color-ink-secondary)]">
                  {result.missingContent.map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended content pillars</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {result.recommendedPillars.map((p) => (
                  <Badge key={p} tone="brand">
                    {p}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3 content ideas for {company}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm text-[var(--color-ink-secondary)]">
                  {result.contentIdeas.map((idea, i) => (
                    <li key={i}>
                      {i + 1}. {idea}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {recommendedPkg && (
              <Card className="border-[var(--color-brand)] p-6">
                <p className="text-xs font-medium text-[var(--color-ink-muted)]">Suggested starting point</p>
                <p className="mt-1 text-lg font-semibold text-[var(--color-ink)]">{recommendedPkg.name} — {recommendedPkg.priceRange}</p>
                <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">{recommendedPkg.description}</p>
              </Card>
            )}

            <p className="text-center text-sm text-[var(--color-ink-secondary)]">
              Want to see this in action, for free?{' '}
              <Link to="/" className="font-medium text-[var(--color-brand)] hover:underline">
                Ask about our Free Content Pilot →
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

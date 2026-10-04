import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS } from '@/data/verticals'
import { computeQuizScore, buildProspectFromQuiz } from '@/lib/quiz'
import { resolveQuizLocale, getLocalizedQuestions, getVerticalLabel, QUIZ_UI } from '@/lib/quizI18n'
import { trackEvent } from '@/lib/analytics'
import type { QuizAnswer, Vertical } from '@/types'

type Stage = 'question' | 'contact' | 'result'

export default function Quiz() {
  const { lang } = useParams<{ lang?: string }>()
  const locale = resolveQuizLocale(lang)
  const questions = getLocalizedQuestions(locale)
  const ui = QUIZ_UI[locale]

  const { addQuizSubmission, addProspect } = useDataStore()
  const [stage, setStage] = useState<Stage>('question')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])

  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState<Vertical | ''>('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [instagram, setInstagram] = useState('')

  const [result, setResult] = useState<{ score: number; qualified: boolean } | null>(null)

  const question = questions[step]
  const progress = Math.round((step / questions.length) * 100)

  useEffect(() => {
    trackEvent('quiz_start', { locale })
    // Only fire once per page load — intentionally omits `locale` from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selectOption(optionId: string, label: string) {
    const next = [...answers.filter((a) => a.questionId !== question.id), { questionId: question.id, optionId, label }]
    setAnswers(next)
    trackEvent('quiz_step', { step: step + 1, total: questions.length })
    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      setStage('contact')
    }
  }

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault()
    if (!companyName.trim() || !industry) return
    const { score, qualified } = computeQuizScore(answers)
    trackEvent('quiz_complete', { qualified, score })

    // Every submission is added straight to Prospects — it's the business's
    // own self-reported info, not researched/invented, so it's real data.
    // Qualifying leads are marked "Ready to Contact" so they surface as
    // priority in the pipeline/follow-up queue immediately, regardless of
    // device or language used to fill it in.
    const prospect = addProspect(
      buildProspectFromQuiz({
        companyName,
        industry,
        contactName: contactName || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        instagram: instagram || undefined,
        answers,
        score,
        qualified,
      }),
    )

    addQuizSubmission({
      companyName,
      industry,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      instagram: instagram || undefined,
      answers,
      qualificationScore: score,
      qualified,
      source: locale === 'en' ? 'Quiz link (social post)' : `Quiz link (social post, ${locale})`,
      convertedToProspectId: prospect.id,
    })
    setResult({ score, qualified })
    setStage('result')
  }

  return (
    <div className="min-h-screen bg-[var(--color-plane)]">
      <header className="border-b border-[var(--color-hairline)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-ink)] text-white">
              <Camera size={14} />
            </div>
            Agrita&Vin Content Co.
          </Link>
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]">
            <ArrowLeft size={13} /> {ui.backHome.replace('← ', '')}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        {stage === 'question' && (
          <>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
                <span>{ui.questionProgress(step + 1, questions.length)}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-hairline)]">
                <div className="h-full rounded-full bg-[var(--color-brand)] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h1 className="mb-1 text-xl font-semibold text-[var(--color-ink)]">{question.question}</h1>
            {question.helper && <p className="mb-5 text-sm text-[var(--color-ink-secondary)]">{question.helper}</p>}
            {!question.helper && <div className="mb-5" />}

            <div className="space-y-2">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => selectOption(opt.id, opt.label)}
                  className="block w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 py-3 text-left text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'contact' && (
          <>
            <div className="mb-6 text-center">
              <Gift size={28} className="mx-auto mb-2 text-[var(--color-brand)]" />
              <h1 className="text-xl font-semibold text-[var(--color-ink)]">{ui.contactTitle}</h1>
              <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">{ui.contactSubtitle}</p>
            </div>
            <Card>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">{ui.businessNameLabel}</Label>
                    <Input id="companyName" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="industry">{ui.industryLabel}</Label>
                    <Select id="industry" required value={industry} onChange={(e) => setIndustry(e.target.value as Vertical)}>
                      <option value="">{ui.industryPlaceholder}</option>
                      {VERTICALS.map((v) => (
                        <option key={v} value={v}>
                          {getVerticalLabel(v, locale)}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contactName">{ui.yourNameLabel}</Label>
                    <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">{ui.emailLabel}</Label>
                    <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">{ui.phoneLabel}</Label>
                    <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="instagram">{ui.instagramLabel}</Label>
                    <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourbusiness" />
                  </div>
                  <Button type="submit" className="w-full">
                    <Sparkles size={14} /> {ui.submitButton}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}

        {stage === 'result' && result && (
          <div className="space-y-4 text-center">
            <Card className="p-6">
              <p className="text-xs font-medium text-[var(--color-ink-muted)]">{ui.resultScoreLabel}</p>
              <p className="tabular-nums mt-1 text-5xl font-semibold text-[var(--color-brand)]">{result.score}</p>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{ui.resultScoreCaption}</p>
            </Card>

            {result.qualified ? (
              <Card className="border-[var(--color-brand)] p-6">
                <Gift size={24} className="mx-auto mb-2 text-[var(--color-brand)]" />
                <p className="text-lg font-semibold text-[var(--color-ink)]">{ui.qualifiedTitle}</p>
                <p className="mt-2 text-sm text-[var(--color-ink-secondary)]">{ui.qualifiedBody(companyName)}</p>
                <Link
                  to={`/audit?company=${encodeURIComponent(companyName)}&industry=${encodeURIComponent(industry)}`}
                  onClick={() => trackEvent('cta_click', { cta: 'quiz_qualified_continue' })}
                  className="mt-4 inline-block"
                >
                  <Button>{ui.qualifiedCta}</Button>
                </Link>
              </Card>
            ) : (
              <Card className="p-6">
                <p className="text-lg font-semibold text-[var(--color-ink)]">{ui.notQualifiedTitle}</p>
                <p className="mt-2 text-sm text-[var(--color-ink-secondary)]">
                  {ui.notQualifiedBody(companyName || ui.businessNameLabel)}
                </p>
              </Card>
            )}

            <Link to="/" className="inline-block text-sm font-medium text-[var(--color-brand)] hover:underline">
              {ui.backHome}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

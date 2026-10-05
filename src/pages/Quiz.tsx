import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Camera, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input, Label, Select } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS } from '@/data/verticals'
import { computeQuizScore, buildProspectFromQuiz } from '@/lib/quiz'
import { resolveQuizLocale, getLocalizedQuestions, getVerticalLabel, QUIZ_UI } from '@/lib/quizI18n'
import { trackEvent } from '@/lib/analytics'
import { submitPublicLead } from '@/lib/integrations'
import { buildWhatsAppLink } from '@/lib/contact'
import { WhatsAppFab } from '@/components/landing/WhatsAppFab'
import { cn } from '@/lib/utils'
import type { QuizAnswer, Vertical } from '@/types'

type Stage = 'question' | 'contact' | 'result'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

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

    // Best-effort: also sends this submission to the Worker's pending-leads
    // queue so it reaches the team even if this visitor's own browser is the
    // only place the local record above ever lives (see src/lib/integrations.ts).
    void submitPublicLead('quiz', {
      companyName,
      industry,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      instagram: instagram || undefined,
      answers,
      score,
      qualified,
      locale,
    })

    setResult({ score, qualified })
    setStage('result')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-plane)]">
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(40% 50% at 20% 30%, var(--color-series-1), transparent), radial-gradient(35% 45% at 80% 20%, var(--color-series-5), transparent), radial-gradient(45% 55% at 50% 80%, var(--color-series-3), transparent)',
        }}
      />

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-[var(--color-hairline)] bg-[var(--color-surface)]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-strong)] text-white shadow-sm">
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
            <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)]/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
              <p className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-medium text-[var(--color-brand-strong)]">
                <Sparkles size={12} /> 60-second content fit quiz
              </p>

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-ink-muted)]">
                  <span>{ui.questionProgress(step + 1, questions.length)}</span>
                  <span className="tabular-nums">{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-hairline)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-series-3)] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{question.question}</h1>
              {question.helper && <p className="mb-5 text-sm text-[var(--color-ink-secondary)]">{question.helper}</p>}
              {!question.helper && <div className="mb-5" />}

              <div className="space-y-2.5">
                {question.options.map((opt, i) => (
                  <button
                    key={opt.id}
                    onClick={() => selectOption(opt.id, opt.label)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 py-3.5 text-left text-sm font-medium text-[var(--color-ink)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] hover:shadow-md"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline)] text-[11px] font-semibold text-[var(--color-ink-muted)] transition-colors group-hover:border-[var(--color-brand)] group-hover:bg-[var(--color-brand)] group-hover:text-white">
                      {OPTION_LETTERS[i] ?? i + 1}
                    </span>
                    <span className="flex-1">{opt.label}</span>
                    <ArrowRight size={14} className="shrink-0 text-[var(--color-ink-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 'contact' && (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-strong)] text-white shadow-lg">
                  <Gift size={22} />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{ui.contactTitle}</h1>
                <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">{ui.contactSubtitle}</p>
              </div>
              <Card className="rounded-2xl border-[var(--color-hairline)] bg-[var(--color-surface)]/90 shadow-xl backdrop-blur-sm">
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
                    <Button type="submit" size="lg" className="w-full shadow-[0_8px_24px_-6px_var(--color-brand)]">
                      <Sparkles size={14} /> {ui.submitButton}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          {stage === 'result' && result && (
            <div className="space-y-4 text-center">
              <Card className="rounded-2xl border-[var(--color-hairline)] bg-[var(--color-surface)]/90 p-6 shadow-xl backdrop-blur-sm">
                <p className="mb-4 text-xs font-medium text-[var(--color-ink-muted)]">{ui.resultScoreLabel}</p>
                <div
                  className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(var(--color-brand) ${result.score * 3.6}deg, var(--color-hairline) 0deg)` }}
                >
                  <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full bg-[var(--color-surface)]">
                    <span className="tabular-nums text-4xl font-semibold text-[var(--color-brand)]">{result.score}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[var(--color-ink-muted)]">{ui.resultScoreCaption}</p>
              </Card>

              {result.qualified ? (
                <Card className="rounded-2xl border-2 border-[var(--color-brand)] bg-[var(--color-surface)]/90 p-6 shadow-xl backdrop-blur-sm">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-strong)] text-white shadow-lg">
                    <Gift size={22} />
                  </div>
                  <p className="text-lg font-semibold text-[var(--color-ink)]">{ui.qualifiedTitle}</p>
                  <p className="mt-2 text-sm text-[var(--color-ink-secondary)]">{ui.qualifiedBody(companyName)}</p>
                  <Link
                    to={`/audit?company=${encodeURIComponent(companyName)}&industry=${encodeURIComponent(industry)}`}
                    onClick={() => trackEvent('cta_click', { cta: 'quiz_qualified_continue' })}
                    className="mt-4 inline-block"
                  >
                    <Button size="lg" className="shadow-[0_8px_24px_-6px_var(--color-brand)]">
                      {ui.qualifiedCta}
                    </Button>
                  </Link>
                  <div>
                    <a
                      href={buildWhatsAppLink(`Hi! I just took the content quiz (${companyName}) and would like to chat.`)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackEvent('cta_click', { cta: 'quiz_qualified_whatsapp' })}
                      className="mt-3 inline-block text-sm font-medium text-[#128C7E] hover:underline"
                    >
                      Or message us on WhatsApp now →
                    </a>
                  </div>
                </Card>
              ) : (
                <Card className={cn('rounded-2xl border-[var(--color-hairline)] bg-[var(--color-surface)]/90 p-6 shadow-xl backdrop-blur-sm')}>
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

      <WhatsAppFab source="quiz" message="Hi! I'm taking the content quiz and have a question." />
    </div>
  )
}

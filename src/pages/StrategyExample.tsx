import { useState } from 'react'
import { ExternalLink, AlertTriangle, Plus, Rocket } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LogOwnBrandMonthModal } from '@/components/strategy/LogOwnBrandMonthModal'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS, VERTICAL_STRATEGIES } from '@/data/verticals'
import { formatDate, formatNumber, formatPercent } from '@/lib/utils'

interface AuditSubject {
  handle: string
  url: string
  confirmedBio: string
  roleGuess: string
  hypotheses: string[]
}

const AUDIT_SUBJECTS: AuditSubject[] = [
  {
    handle: '@agrita_world_adventures',
    url: 'https://www.instagram.com/agrita_world_adventures/',
    confirmedBio: '"Traveler & Brand Manager & Makeup Artist 🇪🇺"',
    roleGuess: 'Personal lifestyle/travel brand (one of our own team members)',
    hypotheses: [
      'Three overlapping identities in one bio (traveler / brand manager / MUA) likely dilute a single, algorithm-legible content pillar — the account probably reads differently to each of its three audiences.',
      'No visible booking/contact CTA in the bio snippet we could pull — worth confirming whether a link-in-bio or DM funnel exists.',
      'Travel content performs best with a consistent visual identity (color grade, caption voice) — worth auditing the grid for consistency once we have full access.',
    ],
  },
  {
    handle: '@worlddigital_marketing_agency',
    url: 'https://www.instagram.com/worlddigital_marketing_agency',
    confirmedBio: '"Your Brand Manager Here"',
    roleGuess: 'A digital marketing / brand management service account — useful as a positioning reference',
    hypotheses: [
      'A generic "your brand manager" tagline competes with thousands of similar agency accounts — differentiation likely has to come from the portfolio grid itself, not the bio line.',
      'Worth checking whether this account shows client results/case studies (strong trust signal for a B2B-facing content agency) or stays purely aspirational/stock-style.',
    ],
  },
]

const AUDIT_CHECKLIST = [
  'Positioning: does the bio say who it is for, in one read?',
  'Content pillars: 3-5 repeatable themes, or scattered one-offs?',
  'Visual consistency: same grade/voice across the grid?',
  'Platform spread: Instagram-only, or cross-posted to TikTok/Reels/LinkedIn?',
  'Posting cadence: regular enough to train the algorithm?',
  'CTA: is there an obvious next step (DM, link, booking) on every post type?',
  'Social proof: testimonials, results, before/after, case studies visible?',
  'Engagement quality: real replies/saves, or just passive likes?',
]

const PARTNER_PLAN: { title: string; items: string[] }[] = [
  {
    title: '12+ short-form videos / month',
    items: [
      'Weekly "behind the shoot" Reel — real footage from an actual client or internal shoot that week (the 2 reels already live on the landing page are the template for this).',
      '2x/month wedding or event highlight Reel, repurposed from real client deliverables (with permission) — feeds the Track B wedding push directly.',
      'Weekly "content tip" talking-head Reel — positions Agrita/Vin as the expert, doubles as top-of-funnel content for the free quiz/audit.',
      '1x/month "day in the life" or team Reel — humanizes the brand, supports recruiting future professionals for the marketplace side.',
    ],
  },
  {
    title: '25+ photos / month',
    items: [
      'Portfolio carousel posts from real shoots (the wedding gallery and lifestyle gallery already built are the source library).',
      'Quote/stat graphics pulled from real Dashboard numbers once they exist (e.g. "X real prospects researched across Y countries") — honest, not fabricated.',
      'Team spotlight photos (Agrita, Vin) — already sourced and confirmed this session.',
      'Before/after or process shots once the first real client pilot completes.',
    ],
  },
  {
    title: 'Multiple platforms',
    items: [
      'Instagram — primary, matches both audit subjects above.',
      'TikTok — native-cut versions of the same Reels, not straight reposts.',
      'LinkedIn — B2B angle, aimed at the hotel/travel/corporate prospect list already in the CRM.',
      'The website itself (healthyvital.github.io/xoxo) — the Reels/wedding gallery sections built this session ARE this channel.',
    ],
  },
  {
    title: 'Content strategy',
    items: [
      'A fixed weekly skeleton: Mon = tip Reel, Wed = portfolio carousel, Fri = behind-the-scenes — predictable enough to actually sustain, not aspirational.',
      "Every piece maps to one of the 7 existing Vertical Strategies (see below) so the same content doubles as a sales asset for that vertical's prospects.",
    ],
  },
  {
    title: 'Campaign support',
    items: [
      'A dedicated push around the wedding/event launch (Track B) using the new wedding gallery + reels as the opening campaign.',
      'A quiz-promotion push — the quiz is live but has zero dedicated social campaign behind it yet.',
    ],
  },
  {
    title: 'Monthly reporting',
    items: [
      'Logged below, in this page, using the exact same ClientMetricSnapshot numbers a real Partner-tier client gets — isolated from real client data so it never distorts the real Dashboard.',
    ],
  },
  {
    title: 'Priority production',
    items: [
      "Internal content gets the same same-week turnaround policy as a paying Partner client — if that's not realistic in practice, the whole case study is dishonest. Track it the same way.",
    ],
  },
]

export default function StrategyExample() {
  const { ownBrandSnapshots } = useDataStore()
  const [showLogMonth, setShowLogMonth] = useState(false)

  return (
    <div>
      <PageHeader
        title="Estrategia Ejemplo"
        description="Aplicamos nuestro propio paquete Content Partner a Agrita&Vin Content Co. — un caso de estudio real, no una maqueta, clonable y adaptable por industria para cada cliente."
      />

      <Card className="mb-6 border-[var(--color-brand)] bg-[var(--color-brand-soft)] p-5">
        <div className="flex items-start gap-3">
          <Rocket size={18} className="mt-0.5 shrink-0 text-[var(--color-brand-strong)]" />
          <p className="text-sm text-[var(--color-ink)]">
            La idea: hacer para nosotros mismos, de verdad, lo que vendemos a otros — el paquete{' '}
            <strong>Content Partner</strong> (12+ videos, 25+ fotos, multi-plataforma, estrategia, campañas,
            reporte mensual, producción prioritaria). Si funciona en nuestra propia marca, se clona y adapta por
            industria para cada cliente real.
          </p>
        </div>
      </Card>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">1. Content audit — cuentas de referencia</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">
        Instagram bloquea el scraping sin autenticación — solo pudimos confirmar la bio pública de cada cuenta.
        Las observaciones de abajo son hipótesis de experto a validar con acceso real (Meta Business Suite /
        Instagram Insights), no cifras inventadas.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {AUDIT_SUBJECTS.map((s) => (
          <Card key={s.handle}>
            <CardHeader>
              <div>
                <CardTitle>
                  {s.handle}{' '}
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex align-middle text-[var(--color-brand)]">
                    <ExternalLink size={14} />
                  </a>
                </CardTitle>
                <CardDescription>{s.roleGuess}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-[var(--color-ink-secondary)]">
                Bio confirmada: <span className="italic">{s.confirmedBio}</span>
              </p>
              <p className="mb-1 text-xs font-semibold text-[var(--color-ink-muted)]">Hipótesis a validar</p>
              <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
                {s.hypotheses.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="text-[var(--color-ink-muted)]">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8 p-5">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-[var(--color-warning)]" />
          <p className="text-sm font-semibold text-[var(--color-ink)]">Checklist de un audit completo (próximo paso, con acceso real)</p>
        </div>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {AUDIT_CHECKLIST.map((c) => (
            <p key={c} className="text-xs text-[var(--color-ink-secondary)]">
              ○ {c}
            </p>
          ))}
        </div>
      </Card>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">2. El paquete Content Partner, aplicado a nosotros mismos</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">
        Mismo estándar que le prometemos a un cliente Partner — nada aspiracional, todo con una fuente real.
      </p>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {PARTNER_PLAN.map((section) => (
          <Card key={section.title} className="p-5">
            <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">{section.title}</p>
            <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--color-good)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">3. Cómo clonarlo por industria</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">
        Misma cadencia (12 videos / 25 fotos / multi-plataforma / reporte mensual) — solo cambian los pilares de
        contenido, tomados directamente de las Vertical Strategies ya existentes.
      </p>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {VERTICALS.map((v) => (
          <Card key={v} className="p-4">
            <p className="mb-1.5 text-sm font-semibold text-[var(--color-ink)]">{v}</p>
            <div className="flex flex-wrap gap-1">
              {VERTICAL_STRATEGIES[v].contentIdeas.slice(0, 4).map((idea) => (
                <Badge key={idea} tone="neutral">
                  {idea}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">4. Seguimiento mes a mes</h2>
        <Button onClick={() => setShowLogMonth(true)}>
          <Plus size={14} /> Log this month
        </Button>
      </div>
      <Card className="overflow-x-auto">
        {ownBrandSnapshots.length === 0 ? (
          <EmptyState
            title="Sin datos todavía"
            description="Esto se llena mes a mes, con números reales — igual que el historial de un cliente real."
          />
        ) : (
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                <th className="px-4 py-3 font-medium">Mes</th>
                <th className="px-4 py-3 font-medium">Posts</th>
                <th className="px-4 py-3 font-medium">Reach</th>
                <th className="px-4 py-3 font-medium">Engagement</th>
                <th className="px-4 py-3 font-medium">Seguidores ganados</th>
                <th className="px-4 py-3 font-medium">Leads</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {ownBrandSnapshots.map((s) => (
                <tr key={s.period} className="border-b border-[var(--color-hairline)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{formatDate(`${s.period}-01`)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.postsPublished)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.reach)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatPercent(s.engagementRate)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.followersGained)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.leads)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.bookings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showLogMonth && <LogOwnBrandMonthModal onClose={() => setShowLogMonth(false)} />}
    </div>
  )
}

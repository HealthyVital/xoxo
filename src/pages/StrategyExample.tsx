import { useState, type ReactNode } from 'react'
import { ExternalLink, AlertTriangle, Plus, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { LogOwnBrandMonthModal } from '@/components/strategy/LogOwnBrandMonthModal'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS, VERTICAL_STRATEGIES } from '@/data/verticals'
import { formatDate, formatNumber, formatPercent } from '@/lib/utils'
import {
  AUDITS,
  BASELINE,
  BASELINE_DATE,
  DECISION,
  ENGAGEMENT,
  HOOK_BANK,
  MONTHLY_DELIVERABLES,
  OBJECTIVES,
  PILLARS,
  PLATFORMS,
  POSITIONING,
  POST_RULES,
  PROJECTION_ASSUMPTIONS,
  PROJECTIONS,
  REEL_FORMATS,
  REEL_STRUCTURE,
  ROADMAP,
  SCRIPT_TEMPLATES,
  SPEECH_RULES,
  STILL_UNKNOWN,
  VERTICAL_HOOK_WORDS,
  WEEKLY_CALENDAR,
  WORKFLOW,
} from '@/data/ownBrandStrategy'

type TabKey = 'overview' | 'audit' | 'roadmap' | 'reels' | 'platforms' | 'production' | 'projections' | 'clone' | 'tracking'

const TABS: { value: TabKey; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'audit', label: 'Audit' },
  { value: 'roadmap', label: '6-Month Roadmap' },
  { value: 'reels', label: 'Reels Playbook' },
  { value: 'platforms', label: 'Platforms' },
  { value: 'production', label: 'Deliverables & Production' },
  { value: 'projections', label: 'Projections' },
  { value: 'clone', label: 'Clone by Industry' },
  { value: 'tracking', label: 'Tracking' },
]

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="tabular-nums text-lg font-semibold text-[var(--color-ink)]">{value}</p>
      <p className="text-[11px] text-[var(--color-ink-muted)]">{label}</p>
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
      {subtitle && <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </section>
  )
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function OverviewTab() {
  return (
    <>
      <Card className="mb-6 border-[var(--color-brand)] bg-[var(--color-brand-soft)] p-5">
        <div className="flex items-start gap-3">
          <Rocket size={18} className="mt-0.5 shrink-0 text-[var(--color-brand-strong)]" />
          <div className="space-y-1 text-sm text-[var(--color-ink)]">
            <p>
              <strong>Client:</strong> {ENGAGEMENT.client}
            </p>
            <p>
              <strong>Package:</strong> {ENGAGEMENT.packageName} — {ENGAGEMENT.price}
            </p>
            <p>
              <strong>Term:</strong> {ENGAGEMENT.term}
            </p>
            <p className="pt-1 text-[var(--color-ink-secondary)]">{ENGAGEMENT.goal}</p>
          </div>
        </div>
      </Card>

      <Section title={`Starting point (${formatDate(BASELINE_DATE)})`}>
        <Card className="p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {BASELINE.map((b) => (
              <Stat key={b.label} label={b.label} value={b.value} />
            ))}
          </div>
        </Card>
      </Section>

      <Section title="6-month objectives">
        <Card className="p-5">
          <ol className="space-y-1.5 text-sm text-[var(--color-ink-secondary)]">
            {OBJECTIVES.map((o, i) => (
              <li key={o} className="flex gap-2">
                <span className="tabular-nums font-semibold text-[var(--color-brand)]">{i + 1}.</span>
                {o}
              </li>
            ))}
          </ol>
        </Card>
      </Section>

      <Section title="Positioning" subtitle={POSITIONING.oneLiner}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {POSITIONING.audiences.map((a) => (
            <Card key={a.name} className="p-5">
              <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{a.name}</p>
              <p className="mb-2 text-xs text-[var(--color-ink-secondary)]">{a.who}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">
                <strong>Wants:</strong> {a.wants}
              </p>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          <strong>Tone:</strong> {POSITIONING.tone}
        </p>
      </Section>

      <Section title="Content pillars" subtitle="The monthly mix every piece of content is planned against.">
        <Card className="p-5">
          <div className="space-y-3">
            {PILLARS.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--color-ink)]">{p.name}</span>
                  <span className="tabular-nums text-[var(--color-ink-secondary)]">{p.share}%</span>
                </div>
                <div className="mb-1 h-2 w-full overflow-hidden rounded-full bg-[var(--color-hairline)]">
                  <div className="h-full rounded-full bg-[var(--color-brand)]" style={{ width: `${p.share}%` }} />
                </div>
                <p className="text-xs text-[var(--color-ink-muted)]">{p.what}</p>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </>
  )
}

function AuditTab() {
  return (
    <>
      <Section title="Account audit" subtitle={`Public profile data as of ${formatDate(BASELINE_DATE)}, supplied by the team.`}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {AUDITS.map((s) => (
            <Card key={s.handle}>
              <CardHeader>
                <div>
                  <CardTitle>
                    {s.handle}{' '}
                    <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex align-middle text-[var(--color-brand)]">
                      <ExternalLink size={14} />
                    </a>
                  </CardTitle>
                  <CardDescription>{s.bio}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-[var(--color-plane)] p-3">
                  <Stat label="Posts" value={formatNumber(s.posts)} />
                  <Stat label="Followers" value={formatNumber(s.followers)} />
                  <Stat label="Following" value={formatNumber(s.following)} />
                </div>
                <p className="mb-1 text-[11px] text-[var(--color-ink-muted)]">Bio link: {s.link}</p>
                <div className="mb-3 flex flex-wrap gap-1">
                  {s.highlights.map((h) => (
                    <Badge key={h} tone="neutral">
                      {h}
                    </Badge>
                  ))}
                </div>
                <p className="mb-1 text-xs font-semibold text-[var(--color-ink-muted)]">Findings</p>
                <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
                  {s.findings.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-[var(--color-ink-muted)]">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Card className="mb-8 p-5">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-[var(--color-warning)]" />
          <p className="text-sm font-semibold text-[var(--color-ink)]">Not measurable from a public profile yet</p>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 text-xs text-[var(--color-ink-secondary)] sm:grid-cols-2">
          {STILL_UNKNOWN.map((u) => (
            <li key={u}>○ {u}</li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-[var(--color-ink-muted)]">
          Unlocked by Instagram Insights after switching to a professional account (conversion step 2).
        </p>
      </Card>

      <Section title="Decision: which account becomes Agrita&Vin Content Co.">
        <Card className="mb-4 border-[var(--color-brand)] p-5">
          <p className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
            {DECISION.from} <ArrowRight size={14} /> {DECISION.to}
          </p>
          <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
            {DECISION.reasons.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">Conversion steps</p>
          <ol className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
            {DECISION.steps.map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="tabular-nums font-semibold text-[var(--color-brand)]">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </Section>
    </>
  )
}

function RoadmapTab() {
  return (
    <Section title="6-month roadmap" subtitle="One theme per month; each month builds on the data from the previous one.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {ROADMAP.map((m) => (
          <Card key={m.month} className="p-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--color-ink)]">{m.month}</p>
              <Badge tone="brand">{m.theme}</Badge>
            </div>
            <Checklist items={m.focus} />
            <p className="mt-3 border-t border-[var(--color-hairline)] pt-2 text-xs text-[var(--color-ink-muted)]">
              <strong>Milestone:</strong> {m.milestone}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

function ReelsTab() {
  return (
    <>
      <Section title="Reel formats & durations">
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                <th className="px-4 py-3 font-medium">Format</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Pillar</th>
                <th className="px-4 py-3 font-medium">How</th>
              </tr>
            </thead>
            <tbody>
              {REEL_FORMATS.map((f) => (
                <tr key={f.name} className="border-b border-[var(--color-hairline)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{f.name}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{f.duration}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{f.pillar}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-ink-secondary)]">{f.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      <Section title="Structure of every reel">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REEL_STRUCTURE.map((s) => (
            <Card key={s.part} className="p-4">
              <p className="tabular-nums text-xs font-semibold text-[var(--color-brand)]">{s.time}</p>
              <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{s.part}</p>
              <p className="text-xs text-[var(--color-ink-secondary)]">{s.rule}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Hook bank" subtitle="Result-based hooks are only used with real numbers from that client.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {HOOK_BANK.map((group) => (
            <Card key={group.pillar} className="p-5">
              <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">{group.pillar}</p>
              <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
                {group.hooks.map((h) => (
                  <li key={h}>“{h}”</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Script templates" subtitle="Second-by-second beats, including the spoken lines.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {SCRIPT_TEMPLATES.map((t) => (
            <Card key={t.name} className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{t.name}</p>
                <Badge tone="neutral">{t.length}</Badge>
              </div>
              <ul className="space-y-1.5 text-xs">
                {t.beats.map((b) => (
                  <li key={b.time} className="flex gap-3">
                    <span className="tabular-nums w-16 shrink-0 font-medium text-[var(--color-brand)]">{b.time}</span>
                    <span className="text-[var(--color-ink-secondary)]">{b.line}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">Speech & delivery</p>
          <Checklist items={SPEECH_RULES} />
        </Card>
        <Card className="p-5">
          <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">Captions, hashtags, audio, covers & timing</p>
          <Checklist items={POST_RULES} />
        </Card>
      </div>

      <Section title="Weekly calendar (from month 2)">
        <Card className="p-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
            {WEEKLY_CALENDAR.map((d) => (
              <div key={d.day} className="rounded-lg bg-[var(--color-plane)] p-3">
                <p className="text-xs font-semibold text-[var(--color-ink)]">{d.day}</p>
                <p className="mt-1 text-[11px] text-[var(--color-ink-secondary)]">{d.plan}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[var(--color-ink-muted)]">
            Every reel also goes out natively on TikTok and YouTube Shorts the same day; stories run daily.
          </p>
        </Card>
      </Section>
    </>
  )
}

function PlatformsTab() {
  return (
    <Section title="Platform plan" subtitle="Same handle everywhere. In the first 30 days we measure consistency, not followers.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {PLATFORMS.map((p) => (
          <Card key={p.name} className="p-5">
            <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{p.name}</p>
            <p className="mb-2 text-xs text-[var(--color-ink-muted)]">{p.role}</p>
            <p className="text-xs text-[var(--color-ink-secondary)]">
              <strong>Formats:</strong> {p.formats}
            </p>
            <p className="mb-3 text-xs text-[var(--color-ink-secondary)]">
              <strong>Cadence:</strong> {p.cadence}
            </p>
            <p className="mb-1 text-xs font-semibold text-[var(--color-ink-muted)]">First 30 days</p>
            <Checklist items={p.first30} />
          </Card>
        ))}
      </div>
    </Section>
  )
}

function ProductionTab() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">What the client receives every month</p>
        <p className="mb-3 text-xs text-[var(--color-ink-muted)]">{ENGAGEMENT.packageName} · {ENGAGEMENT.price}</p>
        <Checklist items={MONTHLY_DELIVERABLES} />
      </Card>
      <Card className="p-5">
        <p className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Production workflow</p>
        <ul className="space-y-2 text-xs">
          {WORKFLOW.map((w) => (
            <li key={w.step}>
              <p className="font-medium text-[var(--color-ink)]">{w.step}</p>
              <p className="text-[var(--color-ink-secondary)]">{w.detail}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function ProjectionsTab() {
  return (
    <>
      <Section title="Projected results" subtitle="Three scenarios at month 3 and month 6. Planning ranges, not promises.">
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-medium">Start</th>
                <th className="px-4 py-3 font-medium">M3 cons.</th>
                <th className="px-4 py-3 font-medium">M3 base</th>
                <th className="px-4 py-3 font-medium">M3 opt.</th>
                <th className="px-4 py-3 font-medium">M6 cons.</th>
                <th className="px-4 py-3 font-medium">M6 base</th>
                <th className="px-4 py-3 font-medium">M6 opt.</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTIONS.map((p) => (
                <tr key={p.metric} className="border-b border-[var(--color-hairline)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{p.metric}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-muted)]">{p.start}</td>
                  {p.m3.map((v, i) => (
                    <td key={`m3-${i}`} className={`tabular-nums px-4 py-3 ${i === 1 ? 'font-semibold text-[var(--color-ink)]' : 'text-[var(--color-ink-secondary)]'}`}>
                      {v}
                    </td>
                  ))}
                  {p.m6.map((v, i) => (
                    <td key={`m6-${i}`} className={`tabular-nums px-4 py-3 ${i === 1 ? 'font-semibold text-[var(--color-ink)]' : 'text-[var(--color-ink-secondary)]'}`}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>
      <Card className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-[var(--color-warning)]" />
          <p className="text-sm font-semibold text-[var(--color-ink)]">Assumptions</p>
        </div>
        <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
          {PROJECTION_ASSUMPTIONS.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      </Card>
    </>
  )
}

function CloneTab() {
  return (
    <Section
      title="Clone by industry"
      subtitle="What stays the same: cadence, reel structure, workflow and monthly report. What changes: pillars and hooks, taken from the existing Vertical Strategies."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {VERTICALS.map((v) => {
          const words = VERTICAL_HOOK_WORDS[v]
          return (
            <Card key={v} className="p-4">
              <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{v}</p>
              <p className="mb-2 text-xs italic text-[var(--color-ink-secondary)]">
                “3 reasons your {words.business}&apos;s Instagram isn&apos;t getting {words.outcome}.”
              </p>
              <div className="flex flex-wrap gap-1">
                {VERTICAL_STRATEGIES[v].contentIdeas.slice(0, 4).map((idea) => (
                  <Badge key={idea} tone="neutral">
                    {idea}
                  </Badge>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}

function TrackingTab() {
  const { ownBrandSnapshots } = useDataStore()
  const [showLogMonth, setShowLogMonth] = useState(false)

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Month-over-month tracking</h2>
          <p className="text-sm text-[var(--color-ink-secondary)]">
            Real numbers only, compared against the Projections tab. Kept separate from client data.
          </p>
        </div>
        <Button onClick={() => setShowLogMonth(true)}>
          <Plus size={14} /> Log this month
        </Button>
      </div>
      <Card className="overflow-x-auto">
        {ownBrandSnapshots.length === 0 ? (
          <EmptyState title="No data yet" description="Fills month by month with real numbers — the Overview starting point is the baseline." />
        ) : (
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 font-medium">Posts</th>
                <th className="px-4 py-3 font-medium">Reach</th>
                <th className="px-4 py-3 font-medium">Engagement</th>
                <th className="px-4 py-3 font-medium">Followers gained</th>
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
    </>
  )
}

export default function StrategyExample() {
  const [tab, setTab] = useState<TabKey>('overview')

  return (
    <div>
      <PageHeader
        title="Strategy Example"
        description="Our own Content Partner deliverable — written as if Agrita&Vin Content Co. were our first client paying €2,500/month. Clone it and adapt it per industry for every real client."
      />
      <Tabs value={tab} onChange={setTab} options={TABS} className="mb-6 w-fit" />

      {tab === 'overview' && <OverviewTab />}
      {tab === 'audit' && <AuditTab />}
      {tab === 'roadmap' && <RoadmapTab />}
      {tab === 'reels' && <ReelsTab />}
      {tab === 'platforms' && <PlatformsTab />}
      {tab === 'production' && <ProductionTab />}
      {tab === 'projections' && <ProjectionsTab />}
      {tab === 'clone' && <CloneTab />}
      {tab === 'tracking' && <TrackingTab />}
    </div>
  )
}

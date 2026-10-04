import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { FunnelStage } from '@/types'
import { formatNumber, formatCurrencyEUR } from '@/lib/utils'

// Fixed-order categorical series (validated CVD-safe, see dataviz palette)
export const SERIES = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
  yellow: '#eda100',
  magenta: '#e87ba4',
  green: '#008300',
  violet: '#4a3aa7',
  red: '#e34948',
}

const GRID = '#e1e0d9'
const AXIS = '#898781'
const TICK = { fill: AXIS, fontSize: 11 }

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 8,
  border: '1px solid #e1e0d9',
  boxShadow: '0 4px 12px rgba(11,11,11,0.08)',
}

export function FunnelViz({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map((s) => s.value), 1)
  return (
    <div className="space-y-2.5">
      {stages.map((s, i) => {
        const pct = (s.value / max) * 100
        const convFromPrev = i > 0 && stages[i - 1].value > 0 ? (s.value / stages[i - 1].value) * 100 : null
        return (
          <div key={s.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium text-[var(--color-ink)]">{s.label}</span>
              <span className="tabular-nums text-[var(--color-ink-secondary)]">
                {formatNumber(s.value)}
                {convFromPrev !== null && (
                  <span className="ml-1.5 text-[var(--color-ink-muted)]">({convFromPrev.toFixed(0)}%)</span>
                )}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-plane)]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(pct, 3)}%`, background: SERIES.blue }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function OutreachActivityChart({
  data,
}: {
  data: { month: string; contacted: number; replies: number; meetings: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={TICK} axisLine={{ stroke: GRID }} tickLine={false} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={36} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="contacted" name="Contacted" stroke={SERIES.blue} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="replies" name="Replies" stroke={SERIES.orange} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="meetings" name="Meetings" stroke={SERIES.aqua} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function RevenueChart({ data }: { data: { month: string; mrr: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES.blue} stopOpacity={0.25} />
            <stop offset="100%" stopColor={SERIES.blue} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={TICK} axisLine={{ stroke: GRID }} tickLine={false} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={48} tickFormatter={(v) => `€${v}`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrencyEUR(Number(v))} />
        <Area type="monotone" dataKey="mrr" name="MRR" stroke={SERIES.blue} strokeWidth={2} fill="url(#mrrFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function PipelineValueChart({ data }: { data: { stage: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
        <YAxis type="category" dataKey="stage" tick={TICK} axisLine={false} tickLine={false} width={90} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrencyEUR(Number(v))} />
        <Bar dataKey="value" fill={SERIES.blue} radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ContentProductionChart({ data }: { data: { month: string; posts: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={TICK} axisLine={{ stroke: GRID }} tickLine={false} />
        <YAxis tick={TICK} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="posts" name="Posts published" fill={SERIES.aqua} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RetentionBar({ active, paused, churned }: { active: number; paused: number; churned: number }) {
  const total = Math.max(active + paused + churned, 1)
  const seg = (n: number) => (n / total) * 100
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-[var(--color-plane)]">
        <div style={{ width: `${seg(active)}%`, background: SERIES.aqua }} title={`Active: ${active}`} />
        <div style={{ width: `${seg(paused)}%`, background: SERIES.yellow }} title={`Paused: ${paused}`} />
        <div style={{ width: `${seg(churned)}%`, background: SERIES.red }} title={`Churned: ${churned}`} />
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--color-ink-secondary)]">
        <LegendDot color={SERIES.aqua} label={`Active (${active})`} />
        <LegendDot color={SERIES.yellow} label={`Paused (${paused})`} />
        <LegendDot color={SERIES.red} label={`Churned (${churned})`} />
      </div>
    </div>
  )
}

export function CountryBreakdownChart({ data }: { data: { country: string; count: number }[] }) {
  const height = Math.max(data.length * 28 + 20, 120)
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="country" tick={TICK} axisLine={false} tickLine={false} width={96} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${formatNumber(Number(v))} prospects`} />
        <Bar dataKey="count" fill={SERIES.blue} radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function VerificationBreakdownBar({
  verified,
  partiallyVerified,
  needsVerification,
}: {
  verified: number
  partiallyVerified: number
  needsVerification: number
}) {
  const total = Math.max(verified + partiallyVerified + needsVerification, 1)
  const seg = (n: number) => (n / total) * 100
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-[var(--color-plane)]">
        <div style={{ width: `${seg(verified)}%`, background: SERIES.aqua }} title={`Verified: ${verified}`} />
        <div
          style={{ width: `${seg(partiallyVerified)}%`, background: SERIES.yellow }}
          title={`Partially Verified: ${partiallyVerified}`}
        />
        <div
          style={{ width: `${seg(needsVerification)}%`, background: '#d8d5cb' }}
          title={`Needs Verification: ${needsVerification}`}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--color-ink-secondary)]">
        <LegendDot color={SERIES.aqua} label={`Verified (${verified})`} />
        <LegendDot color={SERIES.yellow} label={`Partially Verified (${partiallyVerified})`} />
        <LegendDot color="#d8d5cb" label={`Needs Verification (${needsVerification})`} />
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

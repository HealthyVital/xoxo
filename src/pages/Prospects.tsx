import { useMemo, useState } from 'react'
import { Plus, Search, Download, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader } from '@/components/ui/Misc'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { LeadScoreBadge } from '@/components/prospects/LeadScoreBadge'
import { ProspectDetailModal } from '@/components/prospects/ProspectDetailModal'
import { ProspectFormModal } from '@/components/prospects/ProspectFormModal'
import { VERTICALS } from '@/data/verticals'
import { PROSPECT_STATUSES } from '@/data/statuses'
import { formatDate, formatCurrencyEUR, cn } from '@/lib/utils'
import type { Prospect } from '@/types'

type SortableKey =
  | 'companyName'
  | 'phone'
  | 'email'
  | 'industry'
  | 'city'
  | 'country'
  | 'status'
  | 'leadScore'
  | 'verificationStatus'
  | 'lastContact'
  | 'nextFollowUp'
  | 'dealValue'

type ColumnType = 'text' | 'number' | 'date'

const COLUMNS: { key: SortableKey; label: string; type: ColumnType }[] = [
  { key: 'companyName', label: 'Company', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'industry', label: 'Industry', type: 'text' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'country', label: 'Country', type: 'text' },
  { key: 'status', label: 'Status', type: 'text' },
  { key: 'leadScore', label: 'Lead score', type: 'number' },
  { key: 'verificationStatus', label: 'Verification', type: 'text' },
  { key: 'lastContact', label: 'Last contact', type: 'date' },
  { key: 'nextFollowUp', label: 'Next follow-up', type: 'date' },
  { key: 'dealValue', label: 'Deal value', type: 'number' },
]

function isEmptyValue(v: unknown) {
  return v === undefined || v === null || v === ''
}

// Empty values (no phone, no email, no follow-up date, ...) always sort to the
// bottom regardless of direction — sorting "empty vs. not empty" first, then
// ordering whatever's left alphabetically, numerically or chronologically.
function compareProspects(a: Prospect, b: Prospect, key: SortableKey, type: ColumnType, dir: 'asc' | 'desc') {
  const av = a[key]
  const bv = b[key]
  const aEmpty = isEmptyValue(av)
  const bEmpty = isEmptyValue(bv)
  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1

  let cmp: number
  if (type === 'number') cmp = (av as number) - (bv as number)
  else if (type === 'date') cmp = new Date(av as string).getTime() - new Date(bv as string).getTime()
  else cmp = String(av).localeCompare(String(bv))
  return dir === 'asc' ? cmp : -cmp
}

export default function Prospects() {
  const { prospects } = useDataStore()
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('all')
  const [country, setCountry] = useState('all')
  const [status, setStatus] = useState('all')
  const [minScore, setMinScore] = useState(0)
  const [companySize, setCompanySize] = useState('all')
  const [sortKey, setSortKey] = useState<SortableKey>('leadScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(key: SortableKey, type: ColumnType) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      // Text starts A→Z; numbers and dates start highest/most-recent first.
      setSortDir(type === 'text' ? 'asc' : 'desc')
    }
  }
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const selected = selectedId ? (prospects.find((p) => p.id === selectedId) ?? null) : null

  const countries = useMemo(
    () => [...new Set(prospects.map((p) => p.country).filter(Boolean))].sort(),
    [prospects],
  )

  const filtered = useMemo(() => {
    let list = prospects.filter((p) => {
      if (industry !== 'all' && p.industry !== industry) return false
      if (country !== 'all' && p.country !== country) return false
      if (status !== 'all' && p.status !== status) return false
      if (companySize !== 'all' && p.companySize !== companySize) return false
      if (p.leadScore < minScore) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!p.companyName.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.industry.toLowerCase().includes(q))
          return false
      }
      return true
    })
    const columnType = COLUMNS.find((c) => c.key === sortKey)?.type ?? 'text'
    list = [...list].sort((a, b) => compareProspects(a, b, sortKey, columnType, sortDir))
    return list
  }, [prospects, industry, country, status, companySize, minScore, search, sortKey, sortDir])

  function exportCsv() {
    const headers = ['companyName', 'phone', 'email', 'industry', 'city', 'country', 'status', 'leadScore', 'verificationStatus', 'website', 'source', 'sourceUrl']
    const rows = filtered.map((p) => headers.map((h) => JSON.stringify((p as unknown as Record<string, unknown>)[h] ?? '')).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prospects-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Prospects"
        description="Rotterdam companies in your research and outreach database."
        actions={
          <>
            <Button variant="outline" onClick={exportCsv}>
              <Download size={14} /> Export CSV
            </Button>
            <Button onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Add prospect
            </Button>
          </>
        }
      />
      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          <div className="relative lg:col-span-2">
            <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-ink-muted)]" />
            <Input placeholder="Search company, city, industry…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="all">All industries</option>
            {VERTICALS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {PROSPECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
            <option value="all">Any company size</option>
            <option>Micro (1-9)</option>
            <option>Small (10-49)</option>
            <option>Medium (50-249)</option>
            <option>Large (250+)</option>
            <option>Unknown</option>
          </Select>
          <div className="flex items-center gap-2">
            <label className="text-xs whitespace-nowrap text-[var(--color-ink-secondary)]">Min score</label>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full"
            />
            <span className="tabular-nums w-6 text-xs">{minScore}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-ink-secondary)]">
          <span className="text-[var(--color-ink-muted)]">Click a column header to sort by it.</span>
          <span className="ml-auto">{filtered.length} of {prospects.length} prospects</span>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
              {COLUMNS.map((col) => {
                const active = sortKey === col.key
                return (
                  <th key={col.key} className="px-4 py-3 font-medium">
                    <button
                      onClick={() => handleSort(col.key, col.type)}
                      className={cn(
                        'inline-flex items-center gap-1 hover:text-[var(--color-ink)]',
                        active && 'text-[var(--color-ink)]',
                      )}
                      title={
                        col.type === 'number'
                          ? 'Sort high to low / low to high'
                          : col.type === 'date'
                            ? 'Sort by date; empty last'
                            : 'Sort A–Z / Z–A; empty last'
                      }
                    >
                      {col.label}
                      {active ? (
                        sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-30" />
                      )}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="cursor-pointer border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-plane)]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]">
                    {p.companyName}
                    {p.isDemo && <DemoBadge />}
                  </div>
                  {p.website && <div className="text-xs text-[var(--color-ink-muted)]">{p.website}</div>}
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{p.phone || '—'}</td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">
                  {p.email ? (
                    <a
                      href={`mailto:${p.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[var(--color-brand)] hover:underline"
                    >
                      {p.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{p.industry}</td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{p.city}</td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{p.country}</td>
                <td className="px-4 py-3">
                  <Badge tone="brand">{p.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <LeadScoreBadge score={p.leadScore} />
                </td>
                <td className="px-4 py-3">
                  <Badge tone={p.verificationStatus === 'Verified' ? 'good' : 'neutral'}>{p.verificationStatus}</Badge>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{formatDate(p.lastContact)}</td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{formatDate(p.nextFollowUp)}</td>
                <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">
                  {p.dealValue ? formatCurrencyEUR(p.dealValue) : '—'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-sm text-[var(--color-ink-muted)]">
                  No prospects match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {selected && <ProspectDetailModal prospect={selected} onClose={() => setSelectedId(null)} />}
      {showAdd && <ProspectFormModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}

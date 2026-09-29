import { useMemo, useState } from 'react'
import { Plus, Search, Download } from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader, DemoDataBanner } from '@/components/ui/Misc'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { LeadScoreBadge } from '@/components/prospects/LeadScoreBadge'
import { ProspectDetailModal } from '@/components/prospects/ProspectDetailModal'
import { ProspectFormModal } from '@/components/prospects/ProspectFormModal'
import { VERTICALS } from '@/data/verticals'
import { PROSPECT_STATUSES } from '@/data/statuses'
import { formatDate, formatCurrencyEUR } from '@/lib/utils'

type SortKey = 'leadScore' | 'companyName' | 'lastContact' | 'nextFollowUp' | 'createdAt'

export default function Prospects() {
  const { prospects } = useDataStore()
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('all')
  const [status, setStatus] = useState('all')
  const [minScore, setMinScore] = useState(0)
  const [companySize, setCompanySize] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('leadScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const selected = selectedId ? (prospects.find((p) => p.id === selectedId) ?? null) : null

  const filtered = useMemo(() => {
    let list = prospects.filter((p) => {
      if (industry !== 'all' && p.industry !== industry) return false
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
    list = [...list].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'leadScore') cmp = a.leadScore - b.leadScore
      else if (sortKey === 'companyName') cmp = a.companyName.localeCompare(b.companyName)
      else cmp = new Date(a[sortKey] ?? 0).getTime() - new Date(b[sortKey] ?? 0).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [prospects, industry, status, companySize, minScore, search, sortKey, sortDir])

  function exportCsv() {
    const headers = ['companyName', 'industry', 'city', 'status', 'leadScore', 'verificationStatus', 'website', 'source', 'sourceUrl']
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
      <DemoDataBanner />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
          <span>Sort by</span>
          <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="h-8 w-auto py-1">
            <option value="leadScore">Lead score</option>
            <option value="companyName">Company name</option>
            <option value="lastContact">Last contact</option>
            <option value="nextFollowUp">Next follow-up</option>
            <option value="createdAt">Date added</option>
          </Select>
          <button
            className="rounded-md border border-[var(--color-border-strong)] px-2 py-1"
            onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          >
            {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
          <span className="ml-auto">{filtered.length} of {prospects.length} prospects</span>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Lead score</th>
              <th className="px-4 py-3 font-medium">Verification</th>
              <th className="px-4 py-3 font-medium">Last contact</th>
              <th className="px-4 py-3 font-medium">Next follow-up</th>
              <th className="px-4 py-3 font-medium">Deal value</th>
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
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{p.industry}</td>
                <td className="px-4 py-3 text-[var(--color-ink-secondary)]">{p.city}</td>
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
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-[var(--color-ink-muted)]">
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

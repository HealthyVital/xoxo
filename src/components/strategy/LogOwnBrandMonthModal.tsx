import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import type { ClientMetricSnapshot } from '@/types'

const NUMERIC_FIELDS: { key: keyof Omit<ClientMetricSnapshot, 'period' | 'isDemoData' | 'adSpend'>; label: string }[] = [
  { key: 'postsPublished', label: 'Posts published' },
  { key: 'reach', label: 'Reach' },
  { key: 'views', label: 'Views' },
  { key: 'engagementRate', label: 'Engagement rate (%)' },
  { key: 'likes', label: 'Likes' },
  { key: 'comments', label: 'Comments' },
  { key: 'shares', label: 'Shares' },
  { key: 'saves', label: 'Saves' },
  { key: 'followersGained', label: 'Followers gained' },
  { key: 'websiteClicks', label: 'Website clicks' },
  { key: 'leads', label: 'Leads' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'conversions', label: 'Conversions' },
]

/** Logs our OWN monthly content-ops numbers (Estrategia Ejemplo) — a
 *  dedicated, isolated snapshot store (ownBrandSnapshots), never mixed into
 *  the real `clients` collection. Same upsert-by-period behavior as
 *  LogClientMonthModal. */
export function LogOwnBrandMonthModal({ onClose }: { onClose: () => void }) {
  const { addOwnBrandSnapshot } = useDataStore()
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7))
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(NUMERIC_FIELDS.map((f) => [f.key, 0])),
  )
  const [adSpend, setAdSpend] = useState<number | ''>('')

  function setField(key: string, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    addOwnBrandSnapshot({
      period,
      postsPublished: values.postsPublished,
      reach: values.reach,
      views: values.views,
      engagementRate: values.engagementRate,
      likes: values.likes,
      comments: values.comments,
      shares: values.shares,
      saves: values.saves,
      followersGained: values.followersGained,
      websiteClicks: values.websiteClicks,
      leads: values.leads,
      bookings: values.bookings,
      conversions: values.conversions,
      adSpend: adSpend === '' ? undefined : adSpend,
      isDemoData: false,
    })
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Log this month — our own brand" description="Real numbers only, same discipline as a real client report." wide>
      <div className="mb-4">
        <Label htmlFor="ownPeriod">Month</Label>
        <Input id="ownPeriod" type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="max-w-[200px]" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {NUMERIC_FIELDS.map((f) => (
          <div key={f.key}>
            <Label htmlFor={`own-${f.key}`}>{f.label}</Label>
            <Input
              id={`own-${f.key}`}
              type="number"
              value={values[f.key]}
              onChange={(e) => setField(f.key, Number(e.target.value))}
            />
          </div>
        ))}
        <div>
          <Label htmlFor="ownAdSpend">Ad spend (€, optional)</Label>
          <Input
            id="ownAdSpend"
            type="number"
            value={adSpend}
            onChange={(e) => setAdSpend(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save month</Button>
      </div>
    </Modal>
  )
}

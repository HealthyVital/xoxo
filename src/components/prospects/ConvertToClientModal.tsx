import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import { SEED_PRICING_PACKAGES } from '@/data/seedData'
import { todayIso } from '@/lib/utils'
import type { ClientMetricSnapshot, PricingPackageId, Prospect } from '@/types'

const ZERO_SNAPSHOT: Omit<ClientMetricSnapshot, 'period'> = {
  postsPublished: 0,
  reach: 0,
  views: 0,
  engagementRate: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  followersGained: 0,
  websiteClicks: 0,
  leads: 0,
  bookings: 0,
  conversions: 0,
  isDemoData: false,
}

/**
 * The actual mechanism that turns a won deal into a tracked Client — nothing
 * else in the app calls addClient. Triggered whenever a prospect's status is
 * set to "Won" (Pipeline drag-and-drop, or the status dropdown in the detail
 * modal). Cancelling here means the status change itself is also cancelled —
 * "Won" is only real once the client record actually exists.
 */
export function ConvertToClientModal({
  prospect,
  onClose,
  onConverted,
}: {
  prospect: Prospect
  onClose: () => void
  onConverted: () => void
}) {
  const { addClient, updateProspect } = useDataStore()
  const [packageId, setPackageId] = useState<PricingPackageId>('growth')
  const [mrr, setMrr] = useState(prospect.dealValue ?? 0)
  const [startDate, setStartDate] = useState(todayIso())

  function handleConfirm() {
    addClient({
      prospectId: prospect.id,
      companyName: prospect.companyName,
      industry: prospect.industry,
      packageId,
      mrr,
      startDate,
      status: 'Active',
      before: { period: startDate.slice(0, 7), ...ZERO_SNAPSHOT },
      history: [],
      whatWeCreated: [],
      whatWorked: [],
      whatWeWillChangeNextMonth: [],
      nextMonthStrategy: [],
      isDemo: false,
    })
    updateProspect(prospect.id, { status: 'Won' })
    onConverted()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Convert ${prospect.companyName} to a client`}
      description="This is what actually creates the Client record — Won only counts once this is filled in."
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="packageId">Package</Label>
          <Select id="packageId" value={packageId} onChange={(e) => setPackageId(e.target.value as PricingPackageId)}>
            {SEED_PRICING_PACKAGES.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({pkg.priceRange})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="mrr">Monthly recurring revenue (EUR) *</Label>
          <Input id="mrr" type="number" min={0} value={mrr} onChange={(e) => setMrr(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel — don't mark as Won yet
        </Button>
        <Button onClick={handleConfirm} disabled={mrr <= 0}>
          Confirm — create client
        </Button>
      </div>
    </Modal>
  )
}

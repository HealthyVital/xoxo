import type { RoiInputs } from '@/types'

export interface RoiResult {
  costPerLead: number | null
  costPerBooking: number | null
  totalCost: number
  roas: number | null
  estimatedRoi: number | null // percent
}

export function computeRoi(inputs: RoiInputs): RoiResult {
  const totalCost = inputs.productionCost + inputs.advertisingSpend
  const costPerLead = inputs.leads > 0 ? totalCost / inputs.leads : null
  const costPerBooking = inputs.bookings > 0 ? totalCost / inputs.bookings : null
  const roas = inputs.advertisingSpend > 0 ? inputs.revenueAttributed / inputs.advertisingSpend : null
  const estimatedRoi = totalCost > 0 ? ((inputs.revenueAttributed - totalCost) / totalCost) * 100 : null

  return { costPerLead, costPerBooking, totalCost, roas, estimatedRoi }
}

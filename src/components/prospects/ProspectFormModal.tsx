import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS } from '@/data/verticals'
import { computeLeadScore, type LeadSignals } from '@/lib/leadScoring'
import { todayIso } from '@/lib/utils'
import type { Vertical } from '@/types'

const SIGNAL_OPTIONS: { key: keyof LeadSignals; label: string }[] = [
  { key: 'activeInstagram', label: 'Active Instagram presence' },
  { key: 'activeTikTok', label: 'Active TikTok presence' },
  { key: 'weakVisualContent', label: 'Weak / inconsistent visual content' },
  { key: 'strongVisualFit', label: 'Strong fit for visual marketing' },
  { key: 'multipleLocations', label: 'Multiple locations' },
  { key: 'activePromotions', label: 'Active promotions' },
  { key: 'eventsOrLaunches', label: 'Events or launches' },
  { key: 'recentSocialActivity', label: 'Recent social activity' },
  { key: 'noMarketingActivity', label: 'No visible marketing activity' },
  { key: 'inactiveSocialProfiles', label: 'Inactive social profiles' },
  { key: 'noVisualOpportunity', label: 'No obvious visual opportunity' },
]

export function ProspectFormModal({ onClose }: { onClose: () => void }) {
  const { addProspect } = useDataStore()
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState<Vertical>('Hotels & Hospitality')
  const [country, setCountry] = useState('Netherlands')
  const [city, setCity] = useState('Rotterdam')
  const [website, setWebsite] = useState('')
  const [source, setSource] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [signals, setSignals] = useState<LeadSignals>({})

  const { score, reasons } = computeLeadScore(signals)

  function toggleSignal(key: keyof LeadSignals) {
    setSignals((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSubmit() {
    if (!companyName.trim()) return
    addProspect({
      companyName,
      industry,
      country,
      city,
      website: website || undefined,
      source: source || 'Manually added',
      sourceUrl: sourceUrl || undefined,
      lastVerified: todayIso(),
      verificationStatus: 'Needs Verification',
      leadScore: score,
      scoreReasons: reasons,
      recommendedApproach: 'Review vertical strategy and personalize before the first outreach touch.',
      companySize: 'Unknown',
      location: city,
      notes,
      painPoints: [],
      contentOpportunity: '',
      status: 'New',
      assignedTo: 'Unassigned',
      doNotContact: false,
      isDemo: false,
      subIndustry: undefined,
      phone: undefined,
      email: undefined,
      marketingContact: undefined,
      marketingRole: undefined,
      address: undefined,
      postalCode: undefined,
      instagram: undefined,
      facebook: undefined,
      linkedin: undefined,
      tiktok: undefined,
      personalizationNotes: undefined,
      lastContact: undefined,
      nextFollowUp: undefined,
      dealValue: 1100,
      consentNotes: undefined,
    })
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Add prospect" description="Manually add a company to the CRM." wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyName">Company name *</Label>
          <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value as Vertical)}>
            {VERTICALS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="example.com" />
        </div>
        <div>
          <Label htmlFor="source">Source</Label>
          <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Google Maps, referral" />
        </div>
        <div>
          <Label htmlFor="sourceUrl">Source URL</Label>
          <Input id="sourceUrl" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--color-hairline)] pt-4">
        <p className="mb-2 text-xs font-medium text-[var(--color-ink-secondary)]">
          Lead score signals — only check what you've actually verified.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SIGNAL_OPTIONS.map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 text-xs text-[var(--color-ink-secondary)]">
              <input type="checkbox" checked={!!signals[opt.key]} onChange={() => toggleSignal(opt.key)} />
              {opt.label}
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
          Computed lead score: <span className="tabular-nums">{score}</span> / 100
        </p>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add prospect</Button>
      </div>
    </Modal>
  )
}

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import type { ProfessionalAvailability } from '@/types'

const AVAILABILITY_OPTIONS: ProfessionalAvailability[] = ['Available', 'Booked', 'Unavailable']

export function ProfessionalFormModal({ onClose }: { onClose: () => void }) {
  const { skills, services, addSkill, addService, addProfessional } = useDataStore()
  const [newSkill, setNewSkill] = useState('')
  const [newService, setNewService] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [bio, setBio] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [rateRange, setRateRange] = useState('')
  const [availability, setAvailability] = useState<ProfessionalAvailability>('Available')
  const [source, setSource] = useState('')
  const [notes, setNotes] = useState('')
  const [skillIds, setSkillIds] = useState<string[]>([])
  const [serviceIds, setServiceIds] = useState<string[]>([])

  function toggle(list: string[], setList: (v: string[]) => void, id: string) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  function handleAddSkill() {
    const name = newSkill.trim()
    if (!name) return
    const record = addSkill({ name, category: 'General' })
    setSkillIds((prev) => [...prev, record.id])
    setNewSkill('')
  }

  function handleAddService() {
    const name = newService.trim()
    if (!name) return
    const record = addService({ name, category: 'General', mode: 'one-time', description: '', typicalPriceRange: '' })
    setServiceIds((prev) => [...prev, record.id])
    setNewService('')
  }

  function handleSubmit() {
    if (!name.trim() || !city.trim() || !country.trim()) return
    addProfessional({
      name,
      email: email || undefined,
      phone: phone || undefined,
      city,
      country,
      skillIds,
      serviceIds,
      bio,
      portfolioUrl: portfolioUrl || undefined,
      rateRange: rateRange || undefined,
      availability,
      verificationStatus: 'Needs Verification',
      ratingAvg: undefined,
      reviewCount: 0,
      source: source || 'Manually added',
      notes,
      isDemo: false,
    })
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Add professional" description="Add a real, verified independent professional." wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="availability">Availability</Label>
          <Select id="availability" value={availability} onChange={(e) => setAvailability(e.target.value as ProfessionalAvailability)}>
            {AVAILABILITY_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="country">Country *</Label>
          <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="leave blank until verified" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="leave blank until verified" />
        </div>
        <div>
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          <Input id="portfolioUrl" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rateRange">Rate range</Label>
          <Input id="rateRange" value={rateRange} onChange={(e) => setRateRange(e.target.value)} placeholder="e.g. €150-300 / shoot" />
        </div>
        <div>
          <Label htmlFor="source">Source</Label>
          <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. referral, Instagram" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--color-hairline)] pt-4">
        <p className="mb-2 text-xs font-medium text-[var(--color-ink-secondary)]">Skills</p>
        {skills.length > 0 && (
          <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {skills.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-xs text-[var(--color-ink-secondary)]">
                <input type="checkbox" checked={skillIds.includes(s.id)} onChange={() => toggle(skillIds, setSkillIds, s.id)} />
                {s.name}
              </label>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="New skill name…"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSkill()
              }
            }}
          />
          <Button type="button" variant="outline" onClick={handleAddSkill}>
            Add
          </Button>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--color-hairline)] pt-4">
        <p className="mb-2 text-xs font-medium text-[var(--color-ink-secondary)]">Services offered</p>
        {services.length > 0 && (
          <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-xs text-[var(--color-ink-secondary)]">
                <input type="checkbox" checked={serviceIds.includes(s.id)} onChange={() => toggle(serviceIds, setServiceIds, s.id)} />
                {s.name}
              </label>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="New service name…"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddService()
              }
            }}
          />
          <Button type="button" variant="outline" onClick={handleAddService}>
            Add
          </Button>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add professional</Button>
      </div>
    </Modal>
  )
}

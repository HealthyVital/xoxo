import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useDataStore } from '@/store/DataStoreContext'
import { PageHeader } from '@/components/ui/Misc'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { ProfessionalFormModal } from '@/components/professionals/ProfessionalFormModal'
import type { ProfessionalAvailability } from '@/types'

const AVAILABILITY_OPTIONS: ProfessionalAvailability[] = ['Available', 'Booked', 'Unavailable']

export default function Professionals() {
  const { professionals, skills, services, updateProfessional } = useDataStore()
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [country, setCountry] = useState('all')
  const [skillId, setSkillId] = useState('all')
  const [serviceId, setServiceId] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  const cities = useMemo(() => [...new Set(professionals.map((p) => p.city).filter(Boolean))].sort(), [professionals])
  const countries = useMemo(() => [...new Set(professionals.map((p) => p.country).filter(Boolean))].sort(), [professionals])

  const skillById = useMemo(() => new Map(skills.map((s) => [s.id, s])), [skills])
  const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services])

  const filtered = useMemo(() => {
    return professionals.filter((p) => {
      if (city !== 'all' && p.city !== city) return false
      if (country !== 'all' && p.country !== country) return false
      if (skillId !== 'all' && !p.skillIds.includes(skillId)) return false
      if (serviceId !== 'all' && !p.serviceIds.includes(serviceId)) return false
      if (availability !== 'all' && p.availability !== availability) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.bio.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [professionals, city, country, skillId, serviceId, availability, search])

  return (
    <div>
      <PageHeader
        title="Professionals"
        description="Independent photographers, videographers and creatives available to take on service requests."
        actions={
          <Button onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add professional
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-ink-muted)]" />
            <Input placeholder="Search name, city, bio…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
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
          <Select value={skillId} onChange={(e) => setSkillId(e.target.value)}>
            <option value="all">Any skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            <option value="all">Any service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Select value={availability} onChange={(e) => setAvailability(e.target.value)} className="max-w-[160px]">
            <option value="all">Any availability</option>
            {AVAILABILITY_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <span className="ml-auto text-xs text-[var(--color-ink-secondary)]">
            {filtered.length} of {professionals.length} professionals
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-[var(--color-ink-muted)]">
          {professionals.length === 0
            ? 'No professionals yet. Add real, verified professionals as you source them — never fabricated placeholders.'
            : 'No professionals match these filters.'}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-[var(--color-ink)]">{p.name}</p>
                {p.isDemo && <DemoBadge />}
              </div>
              <p className="mb-2 text-xs text-[var(--color-ink-muted)]">
                {p.city}, {p.country}
              </p>
              <div className="mb-2 flex flex-wrap gap-1">
                {p.skillIds.map((id) => (
                  <Badge key={id} tone="brand">
                    {skillById.get(id)?.name ?? id}
                  </Badge>
                ))}
              </div>
              <div className="mb-2 flex flex-wrap gap-1">
                {p.serviceIds.map((id) => (
                  <Badge key={id}>{serviceById.get(id)?.name ?? id}</Badge>
                ))}
              </div>
              <p className="mb-3 line-clamp-3 text-xs text-[var(--color-ink-secondary)]">{p.bio}</p>
              <div className="flex items-center justify-between">
                <Select
                  value={p.availability}
                  onChange={(e) => updateProfessional(p.id, { availability: e.target.value as ProfessionalAvailability })}
                  className="h-7 w-28 text-xs"
                >
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </Select>
                <Badge
                  tone={
                    p.verificationStatus === 'Verified'
                      ? 'good'
                      : p.verificationStatus === 'Partially Verified'
                        ? 'warning'
                        : 'neutral'
                  }
                >
                  {p.verificationStatus}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAdd && <ProfessionalFormModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}

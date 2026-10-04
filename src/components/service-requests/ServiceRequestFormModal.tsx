import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select, Textarea } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'

export function ServiceRequestFormModal({ onClose }: { onClose: () => void }) {
  const { services, addService, addServiceRequest } = useDataStore()
  const [companyName, setCompanyName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '')
  const [newServiceName, setNewServiceName] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [requestedDate, setRequestedDate] = useState('')
  const [notes, setNotes] = useState('')

  function handleAddService() {
    const name = newServiceName.trim()
    if (!name) return
    const record = addService({ name, category: 'General', mode: 'one-time', description: '', typicalPriceRange: '' })
    setServiceId(record.id)
    setNewServiceName('')
  }

  function handleSubmit() {
    if (!companyName.trim() || !city.trim() || !country.trim() || !serviceId) return
    addServiceRequest({
      companyName,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      city,
      country,
      serviceId,
      description,
      budget: budget ? Number(budget) : undefined,
      requestedDate: requestedDate || undefined,
      status: 'New',
      matchedProfessionalId: undefined,
      linkedProspectId: undefined,
      notes,
      isDemo: false,
    })
    onClose()
  }

  return (
    <Modal open onClose={onClose} title="Add service request" description="A one-time job from a company that needs a professional." wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyName">Company name *</Label>
          <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="service">Service *</Label>
          {services.length > 0 && (
            <Select id="service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="mb-2">
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          )}
          <div className="flex gap-2">
            <Input
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
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
        <div>
          <Label htmlFor="city">City *</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="country">Country *</Label>
          <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="budget">Budget (EUR)</Label>
          <Input id="budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="requestedDate">Requested date</Label>
          <Input id="requestedDate" type="date" value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add request</Button>
      </div>
    </Modal>
  )
}

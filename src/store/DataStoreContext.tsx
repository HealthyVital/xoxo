import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { loadCollection, saveCollection, resetAllData } from '@/lib/storage'
import { uid, nowIso } from '@/lib/utils'
import {
  SEED_PROSPECTS,
  SEED_COMMUNICATIONS,
  SEED_CLIENTS,
  SEED_CAMPAIGNS,
  SEED_CALENDAR_ITEMS,
  SEED_PILOT_PROPOSALS,
  SEED_PROPOSALS,
  SEED_SAVED_CONTENT_IDEAS,
  SEED_TEMPLATES,
  SEED_SKILLS,
  SEED_SERVICES,
  SEED_PROFESSIONALS,
  SEED_SERVICE_REQUESTS,
  SEED_REVIEWS,
  SEED_PAYMENTS,
} from '@/data/seedData'
import type {
  CalendarItem,
  Campaign,
  Client,
  CommunicationLogEntry,
  FreeAuditSubmission,
  OutreachTemplate,
  Payment,
  PilotProposal,
  Professional,
  Prospect,
  Proposal,
  QuizSubmission,
  Review,
  SavedContentIdea,
  Service,
  ServiceRequest,
  Skill,
} from '@/types'

interface DataStoreValue {
  prospects: Prospect[]
  communications: CommunicationLogEntry[]
  clients: Client[]
  campaigns: Campaign[]
  calendarItems: CalendarItem[]
  pilotProposals: PilotProposal[]
  proposals: Proposal[]
  savedContentIdeas: SavedContentIdea[]
  freeAuditSubmissions: FreeAuditSubmission[]
  quizSubmissions: QuizSubmission[]
  templates: OutreachTemplate[]
  skills: Skill[]
  services: Service[]
  professionals: Professional[]
  serviceRequests: ServiceRequest[]
  reviews: Review[]
  payments: Payment[]

  addProspect: (p: Omit<Prospect, 'id' | 'createdAt' | 'updatedAt'>) => Prospect
  updateProspect: (id: string, patch: Partial<Prospect>) => void
  deleteProspect: (id: string) => void

  logCommunication: (entry: Omit<CommunicationLogEntry, 'id'>) => void

  addClient: (c: Omit<Client, 'id'>) => Client
  updateClient: (id: string, patch: Partial<Client>) => void

  addCampaign: (c: Omit<Campaign, 'id'>) => Campaign
  updateCampaign: (id: string, patch: Partial<Campaign>) => void

  addCalendarItem: (c: Omit<CalendarItem, 'id'>) => CalendarItem
  updateCalendarItem: (id: string, patch: Partial<CalendarItem>) => void

  addPilotProposal: (p: Omit<PilotProposal, 'id' | 'createdAt'>) => PilotProposal
  updatePilotProposal: (id: string, patch: Partial<PilotProposal>) => void

  addProposal: (p: Omit<Proposal, 'id' | 'createdAt'>) => Proposal
  updateProposal: (id: string, patch: Partial<Proposal>) => void

  addSavedContentIdea: (i: Omit<SavedContentIdea, 'id' | 'createdAt'>) => SavedContentIdea
  updateSavedContentIdea: (id: string, patch: Partial<SavedContentIdea>) => void

  addFreeAuditSubmission: (s: Omit<FreeAuditSubmission, 'id' | 'createdAt'>) => FreeAuditSubmission

  addQuizSubmission: (s: Omit<QuizSubmission, 'id' | 'createdAt'>) => QuizSubmission
  markQuizConverted: (id: string, prospectId: string) => void

  addSkill: (s: Omit<Skill, 'id'>) => Skill
  addService: (s: Omit<Service, 'id'>) => Service

  addProfessional: (p: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>) => Professional
  updateProfessional: (id: string, patch: Partial<Professional>) => void

  addServiceRequest: (r: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => ServiceRequest
  updateServiceRequest: (id: string, patch: Partial<ServiceRequest>) => void

  addReview: (r: Omit<Review, 'id' | 'createdAt'>) => Review

  addPayment: (p: Omit<Payment, 'id' | 'createdAt'>) => Payment

  updateTemplate: (id: string, patch: Partial<OutreachTemplate>) => void

  resetDemoData: () => void
}

const DataStoreContext = createContext<DataStoreValue | null>(null)

function usePersistedState<T>(key: string, seed: T) {
  const [state, setState] = useState<T>(() => loadCollection(key, seed))
  const set = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater
        saveCollection(key, next)
        return next
      })
    },
    [key],
  )
  return [state, set] as const
}

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [prospects, setProspects] = usePersistedState<Prospect[]>('prospects', SEED_PROSPECTS)
  const [communications, setCommunications] = usePersistedState<CommunicationLogEntry[]>(
    'communications',
    SEED_COMMUNICATIONS,
  )
  const [clients, setClients] = usePersistedState<Client[]>('clients', SEED_CLIENTS)
  const [campaigns, setCampaigns] = usePersistedState<Campaign[]>('campaigns', SEED_CAMPAIGNS)
  const [calendarItems, setCalendarItems] = usePersistedState<CalendarItem[]>(
    'calendarItems',
    SEED_CALENDAR_ITEMS,
  )
  const [pilotProposals, setPilotProposals] = usePersistedState<PilotProposal[]>(
    'pilotProposals',
    SEED_PILOT_PROPOSALS,
  )
  const [proposals, setProposals] = usePersistedState<Proposal[]>('proposals', SEED_PROPOSALS)
  const [savedContentIdeas, setSavedContentIdeas] = usePersistedState<SavedContentIdea[]>(
    'savedContentIdeas',
    SEED_SAVED_CONTENT_IDEAS,
  )
  const [freeAuditSubmissions, setFreeAuditSubmissions] = usePersistedState<FreeAuditSubmission[]>(
    'freeAuditSubmissions',
    [],
  )
  const [quizSubmissions, setQuizSubmissions] = usePersistedState<QuizSubmission[]>('quizSubmissions', [])
  const [templates, setTemplates] = usePersistedState<OutreachTemplate[]>('templates', SEED_TEMPLATES)
  const [skills, setSkills] = usePersistedState<Skill[]>('skills', SEED_SKILLS)
  const [services, setServices] = usePersistedState<Service[]>('services', SEED_SERVICES)
  const [professionals, setProfessionals] = usePersistedState<Professional[]>('professionals', SEED_PROFESSIONALS)
  const [serviceRequests, setServiceRequests] = usePersistedState<ServiceRequest[]>(
    'serviceRequests',
    SEED_SERVICE_REQUESTS,
  )
  const [reviews, setReviews] = usePersistedState<Review[]>('reviews', SEED_REVIEWS)
  const [payments, setPayments] = usePersistedState<Payment[]>('payments', SEED_PAYMENTS)

  const addProspect = useCallback<DataStoreValue['addProspect']>(
    (p) => {
      const record: Prospect = { ...p, id: uid('prospect'), createdAt: nowIso(), updatedAt: nowIso() }
      setProspects((prev) => [record, ...prev])
      return record
    },
    [setProspects],
  )

  const updateProspect = useCallback<DataStoreValue['updateProspect']>(
    (id, patch) => {
      setProspects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: nowIso() } : p)),
      )
    },
    [setProspects],
  )

  const deleteProspect = useCallback<DataStoreValue['deleteProspect']>(
    (id) => {
      setProspects((prev) => prev.filter((p) => p.id !== id))
    },
    [setProspects],
  )

  const logCommunication = useCallback<DataStoreValue['logCommunication']>(
    (entry) => {
      const record: CommunicationLogEntry = { ...entry, id: uid('comm') }
      setCommunications((prev) => [record, ...prev])
      setProspects((prev) =>
        prev.map((p) => (p.id === entry.prospectId ? { ...p, lastContact: entry.date, updatedAt: nowIso() } : p)),
      )
    },
    [setCommunications, setProspects],
  )

  const addClient = useCallback<DataStoreValue['addClient']>(
    (c) => {
      const record: Client = { ...c, id: uid('client') }
      setClients((prev) => [record, ...prev])
      return record
    },
    [setClients],
  )

  const updateClient = useCallback<DataStoreValue['updateClient']>(
    (id, patch) => {
      setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    },
    [setClients],
  )

  const addCampaign = useCallback<DataStoreValue['addCampaign']>(
    (c) => {
      const record: Campaign = { ...c, id: uid('campaign') }
      setCampaigns((prev) => [record, ...prev])
      return record
    },
    [setCampaigns],
  )

  const updateCampaign = useCallback<DataStoreValue['updateCampaign']>(
    (id, patch) => {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    },
    [setCampaigns],
  )

  const addCalendarItem = useCallback<DataStoreValue['addCalendarItem']>(
    (c) => {
      const record: CalendarItem = { ...c, id: uid('cal') }
      setCalendarItems((prev) => [record, ...prev])
      return record
    },
    [setCalendarItems],
  )

  const updateCalendarItem = useCallback<DataStoreValue['updateCalendarItem']>(
    (id, patch) => {
      setCalendarItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    },
    [setCalendarItems],
  )

  const addPilotProposal = useCallback<DataStoreValue['addPilotProposal']>(
    (p) => {
      const record: PilotProposal = { ...p, id: uid('pilot'), createdAt: nowIso() }
      setPilotProposals((prev) => [record, ...prev])
      return record
    },
    [setPilotProposals],
  )

  const updatePilotProposal = useCallback<DataStoreValue['updatePilotProposal']>(
    (id, patch) => {
      setPilotProposals((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    },
    [setPilotProposals],
  )

  const addProposal = useCallback<DataStoreValue['addProposal']>(
    (p) => {
      const record: Proposal = { ...p, id: uid('proposal'), createdAt: nowIso() }
      setProposals((prev) => [record, ...prev])
      return record
    },
    [setProposals],
  )

  const updateProposal = useCallback<DataStoreValue['updateProposal']>(
    (id, patch) => {
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    },
    [setProposals],
  )

  const addSavedContentIdea = useCallback<DataStoreValue['addSavedContentIdea']>(
    (i) => {
      const record: SavedContentIdea = { ...i, id: uid('idea'), createdAt: nowIso() }
      setSavedContentIdeas((prev) => [record, ...prev])
      return record
    },
    [setSavedContentIdeas],
  )

  const updateSavedContentIdea = useCallback<DataStoreValue['updateSavedContentIdea']>(
    (id, patch) => {
      setSavedContentIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
    },
    [setSavedContentIdeas],
  )

  const addFreeAuditSubmission = useCallback<DataStoreValue['addFreeAuditSubmission']>(
    (s) => {
      const record: FreeAuditSubmission = { ...s, id: uid('audit'), createdAt: nowIso() }
      setFreeAuditSubmissions((prev) => [record, ...prev])
      return record
    },
    [setFreeAuditSubmissions],
  )

  const addQuizSubmission = useCallback<DataStoreValue['addQuizSubmission']>(
    (s) => {
      const record: QuizSubmission = { ...s, id: uid('quiz'), createdAt: nowIso() }
      setQuizSubmissions((prev) => [record, ...prev])
      return record
    },
    [setQuizSubmissions],
  )

  const markQuizConverted = useCallback<DataStoreValue['markQuizConverted']>(
    (id, prospectId) => {
      setQuizSubmissions((prev) => prev.map((q) => (q.id === id ? { ...q, convertedToProspectId: prospectId } : q)))
    },
    [setQuizSubmissions],
  )

  const addSkill = useCallback<DataStoreValue['addSkill']>(
    (s) => {
      const record: Skill = { ...s, id: uid('skill') }
      setSkills((prev) => [...prev, record])
      return record
    },
    [setSkills],
  )

  const addService = useCallback<DataStoreValue['addService']>(
    (s) => {
      const record: Service = { ...s, id: uid('service') }
      setServices((prev) => [...prev, record])
      return record
    },
    [setServices],
  )

  const addProfessional = useCallback<DataStoreValue['addProfessional']>(
    (p) => {
      const record: Professional = { ...p, id: uid('pro'), createdAt: nowIso(), updatedAt: nowIso() }
      setProfessionals((prev) => [record, ...prev])
      return record
    },
    [setProfessionals],
  )

  const updateProfessional = useCallback<DataStoreValue['updateProfessional']>(
    (id, patch) => {
      setProfessionals((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: nowIso() } : p)))
    },
    [setProfessionals],
  )

  const addServiceRequest = useCallback<DataStoreValue['addServiceRequest']>(
    (r) => {
      const record: ServiceRequest = { ...r, id: uid('req'), createdAt: nowIso(), updatedAt: nowIso() }
      setServiceRequests((prev) => [record, ...prev])
      return record
    },
    [setServiceRequests],
  )

  const updateServiceRequest = useCallback<DataStoreValue['updateServiceRequest']>(
    (id, patch) => {
      setServiceRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: nowIso() } : r)))
    },
    [setServiceRequests],
  )

  const addReview = useCallback<DataStoreValue['addReview']>(
    (r) => {
      const record: Review = { ...r, id: uid('review'), createdAt: nowIso() }
      setReviews((prev) => [record, ...prev])
      return record
    },
    [setReviews],
  )

  const addPayment = useCallback<DataStoreValue['addPayment']>(
    (p) => {
      const record: Payment = { ...p, id: uid('payment'), createdAt: nowIso() }
      setPayments((prev) => [record, ...prev])
      return record
    },
    [setPayments],
  )

  const updateTemplate = useCallback<DataStoreValue['updateTemplate']>(
    (id, patch) => {
      setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    },
    [setTemplates],
  )

  const resetDemoData = useCallback(() => {
    resetAllData()
    window.location.reload()
  }, [])

  const value = useMemo<DataStoreValue>(
    () => ({
      prospects,
      communications,
      clients,
      campaigns,
      calendarItems,
      pilotProposals,
      proposals,
      savedContentIdeas,
      freeAuditSubmissions,
      quizSubmissions,
      templates,
      skills,
      services,
      professionals,
      serviceRequests,
      reviews,
      payments,
      addProspect,
      updateProspect,
      deleteProspect,
      logCommunication,
      addClient,
      updateClient,
      addCampaign,
      updateCampaign,
      addCalendarItem,
      updateCalendarItem,
      addPilotProposal,
      updatePilotProposal,
      addProposal,
      updateProposal,
      addSavedContentIdea,
      updateSavedContentIdea,
      addFreeAuditSubmission,
      addQuizSubmission,
      markQuizConverted,
      addSkill,
      addService,
      addProfessional,
      updateProfessional,
      addServiceRequest,
      updateServiceRequest,
      addReview,
      addPayment,
      updateTemplate,
      resetDemoData,
    }),
    [
      prospects,
      communications,
      clients,
      campaigns,
      calendarItems,
      pilotProposals,
      proposals,
      savedContentIdeas,
      freeAuditSubmissions,
      quizSubmissions,
      templates,
      skills,
      services,
      professionals,
      serviceRequests,
      reviews,
      payments,
      addProspect,
      updateProspect,
      deleteProspect,
      logCommunication,
      addClient,
      updateClient,
      addCampaign,
      updateCampaign,
      addCalendarItem,
      updateCalendarItem,
      addPilotProposal,
      updatePilotProposal,
      addProposal,
      updateProposal,
      addSavedContentIdea,
      updateSavedContentIdea,
      addFreeAuditSubmission,
      addQuizSubmission,
      markQuizConverted,
      addSkill,
      addService,
      addProfessional,
      updateProfessional,
      addServiceRequest,
      updateServiceRequest,
      addReview,
      addPayment,
      updateTemplate,
      resetDemoData,
    ],
  )

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>
}

export function useDataStore(): DataStoreValue {
  const ctx = useContext(DataStoreContext)
  if (!ctx) throw new Error('useDataStore must be used within a DataStoreProvider')
  return ctx
}

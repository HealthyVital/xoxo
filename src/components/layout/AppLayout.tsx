import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useAuthEmail } from './AuthGate'
import { useDataStore } from '@/store/DataStoreContext'
import { fetchPendingLeads, claimLeads } from '@/lib/integrations'
import { buildProspectFromQuiz, type QuizProspectInput } from '@/lib/quiz'
import type { FreeAuditSubmission } from '@/types'

/** Pulls in real quiz/audit leads submitted on the public site since anyone
 *  last opened the CRM, merges them locally exactly as the public pages
 *  themselves would, then clears them from the Worker's queue. Runs once per
 *  login, automatically — see worker/src/index.ts's leadsSubmit comment for
 *  why this exists (the CRM has no backend of its own; without this, a real
 *  visitor's submission would only ever live in that visitor's own browser). */
function useAutoSyncPublicLeads() {
  const authEmail = useAuthEmail()
  const { addProspect, addQuizSubmission, addFreeAuditSubmission } = useDataStore()

  useEffect(() => {
    if (!authEmail) return
    let cancelled = false
    ;(async () => {
      const leads = await fetchPendingLeads(authEmail)
      if (cancelled || leads.length === 0) return
      const claimedIds: string[] = []
      for (const lead of leads) {
        try {
          if (lead.kind === 'quiz') {
            const p = lead.payload as QuizProspectInput & { locale?: string }
            const prospect = addProspect(buildProspectFromQuiz(p))
            addQuizSubmission({
              companyName: p.companyName,
              industry: p.industry,
              contactName: p.contactName,
              contactEmail: p.contactEmail,
              contactPhone: p.contactPhone,
              instagram: p.instagram,
              answers: p.answers,
              qualificationScore: p.score,
              qualified: p.qualified,
              source: 'Quiz link (social post) — synced from public site',
              convertedToProspectId: prospect.id,
            })
          } else if (lead.kind === 'audit') {
            addFreeAuditSubmission(lead.payload as Omit<FreeAuditSubmission, 'id' | 'createdAt'>)
          }
          claimedIds.push(lead.id)
        } catch {
          // Skip a malformed lead rather than blocking the rest of the sync.
        }
      }
      if (claimedIds.length > 0) await claimLeads(authEmail, claimedIds)
    })()
    return () => {
      cancelled = true
    }
  }, [authEmail, addProspect, addQuizSubmission, addFreeAuditSubmission])
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  useAutoSyncPublicLeads()

  return (
    <div className="flex min-h-screen bg-[var(--color-plane)]">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 py-3 lg:hidden">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-[var(--color-ink)]">
            <Menu size={20} />
          </button>
          <p className="text-sm font-semibold">Agrita&Vin Content Co.</p>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DataStoreProvider } from '@/store/DataStoreContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthGate } from '@/components/layout/AuthGate'

const Landing = lazy(() => import('@/pages/Landing'))
const FreeAudit = lazy(() => import('@/pages/FreeAudit'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Prospects = lazy(() => import('@/pages/Prospects'))
const Pipeline = lazy(() => import('@/pages/Pipeline'))
const Outreach = lazy(() => import('@/pages/Outreach'))
const ContentStudio = lazy(() => import('@/pages/ContentStudio'))
const Verticals = lazy(() => import('@/pages/Verticals'))
const FreePilot = lazy(() => import('@/pages/FreePilot'))
const Proposals = lazy(() => import('@/pages/Proposals'))
const Clients = lazy(() => import('@/pages/Clients'))
const ClientDetail = lazy(() => import('@/pages/ClientDetail'))
const Campaigns = lazy(() => import('@/pages/Campaigns'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const ClientReports = lazy(() => import('@/pages/ClientReports'))
const CalendarPage = lazy(() => import('@/pages/CalendarPage'))
const Templates = lazy(() => import('@/pages/Templates'))
const Pricing = lazy(() => import('@/pages/Pricing'))
const SettingsPage = lazy(() => import('@/pages/Settings'))

function PageFallback() {
  return <div className="p-8 text-sm text-[var(--color-ink-muted)]">Loading…</div>
}

export default function App() {
  return (
    <DataStoreProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/audit" element={<FreeAudit />} />

            <Route
              path="/app"
              element={
                <AuthGate>
                  <AppLayout />
                </AuthGate>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="prospects" element={<Prospects />} />
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="outreach" element={<Outreach />} />
              <Route path="content-studio" element={<ContentStudio />} />
              <Route path="verticals" element={<Verticals />} />
              <Route path="free-pilot" element={<FreePilot />} />
              <Route path="proposals" element={<Proposals />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:clientId" element={<ClientDetail />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<ClientReports />} />
              <Route path="reports/:clientId" element={<ClientReports />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="templates" element={<Templates />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </DataStoreProvider>
  )
}

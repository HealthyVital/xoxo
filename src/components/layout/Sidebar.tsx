import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Send,
  Clapperboard,
  Layers,
  Gift,
  FileText,
  Building2,
  Megaphone,
  BarChart3,
  ClipboardList,
  ListChecks,
  CalendarDays,
  FileStack,
  Tag,
  Settings,
  Camera,
  X,
  LogOut,
  Briefcase,
  ClipboardCheck,
  Rocket,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthEmail, logoutTeamMember } from '@/components/layout/AuthGate'

const NAV = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/prospects', label: 'Prospects', icon: Users },
  { to: '/app/quiz-leads', label: 'Quiz leads', icon: ListChecks },
  { to: '/app/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/app/professionals', label: 'Professionals', icon: Briefcase },
  { to: '/app/service-requests', label: 'Service Requests', icon: ClipboardCheck },
  { to: '/app/outreach', label: 'Outreach', icon: Send },
  { to: '/app/content-studio', label: 'Content Studio', icon: Clapperboard },
  { to: '/app/verticals', label: 'Verticals', icon: Layers },
  { to: '/app/strategy-example', label: 'Strategy Example', icon: Rocket },
  { to: '/app/free-pilot', label: 'Free Pilot', icon: Gift },
  { to: '/app/proposals', label: 'Proposals', icon: FileText },
  { to: '/app/clients', label: 'Clients', icon: Building2 },
  { to: '/app/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/reports', label: 'Client Reports', icon: ClipboardList },
  { to: '/app/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/templates', label: 'Templates', icon: FileStack },
  { to: '/app/pricing', label: 'Pricing', icon: Tag },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const authEmail = useAuthEmail()

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--color-hairline)] bg-[var(--color-surface)] transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[var(--color-hairline)] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)] text-white">
              <Camera size={16} />
            </div>
            <div>
              <p className="text-sm leading-tight font-semibold text-[var(--color-ink)]">Agrita&Vin Content Co.</p>
              <p className="text-[11px] leading-tight text-[var(--color-ink-muted)]">Sales & content OS</p>
            </div>
          </div>
          <button className="text-[var(--color-ink-muted)] lg:hidden" onClick={onCloseMobile} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand-strong)]'
                    : 'text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)] hover:text-[var(--color-ink)]',
                )
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2 border-t border-[var(--color-hairline)] p-4">
          {authEmail && (
            <div className="flex items-center justify-between gap-2 px-1">
              <p className="truncate text-[11px] text-[var(--color-ink-muted)]" title={authEmail}>
                Signed in as {authEmail}
              </p>
              <button
                onClick={logoutTeamMember}
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-critical)]"
              >
                <LogOut size={12} /> Log out
              </button>
            </div>
          )}
          <a
            href={import.meta.env.BASE_URL}
            className="block rounded-lg border border-[var(--color-hairline)] px-3 py-2 text-center text-xs font-medium text-[var(--color-ink-secondary)] hover:bg-[var(--color-plane)]"
          >
            View public website ↗
          </a>
        </div>
      </aside>
    </>
  )
}

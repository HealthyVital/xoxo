import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

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

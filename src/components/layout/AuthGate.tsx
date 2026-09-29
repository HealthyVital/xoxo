import { useState, type FormEvent, type ReactNode } from 'react'
import { Camera, Lock, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { isAllowedTeamEmail, normalizeEmail } from '@/lib/auth'

const STORAGE_KEY = 'rotterdam-crm:v1:authEmail'

function readStoredEmail(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** For display elsewhere (e.g. the sidebar) — not used for access control itself. */
export function useAuthEmail(): string | null {
  const [email] = useState(readStoredEmail)
  return email
}

export function logoutTeamMember() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  window.location.href = import.meta.env.BASE_URL
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(readStoredEmail)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  if (email && isAllowedTeamEmail(email)) return <>{children}</>

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isAllowedTeamEmail(input)) {
      const normalized = normalizeEmail(input)
      try {
        localStorage.setItem(STORAGE_KEY, normalized)
      } catch {
        // localStorage unavailable — access still granted for this page view
      }
      setEmail(normalized)
      setError('')
    } else {
      setError("This email isn't on the team access list.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-plane)] p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-ink)] text-white">
            <Camera size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">Agrita&Vin Content Co.</p>
            <p className="text-xs text-[var(--color-ink-muted)]">Team access</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="teamEmail">Team email</Label>
            <Input
              id="teamEmail"
              type="email"
              autoFocus
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-xs text-[var(--color-critical)]">{error}</p>}
          <Button type="submit" className="w-full">
            <Lock size={14} /> Continue
          </Button>
        </form>

        <div className="mt-4 flex gap-2 rounded-lg bg-[var(--color-plane)] p-3 text-[11px] text-[var(--color-ink-muted)]">
          <ShieldAlert size={26} className="shrink-0" />
          <p>
            This is a lightweight access gate, not secure authentication — this site has no backend. Anyone using
            browser dev tools could read the allowed list or bypass this screen. Don't rely on it to protect
            genuinely confidential data.
          </p>
        </div>
      </div>
    </div>
  )
}

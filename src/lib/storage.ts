// ---------------------------------------------------------------------------
// Local persistence layer for the MVP.
//
// Everything lives in localStorage under a single namespaced key per
// collection, seeded on first run from the JSON files in src/data. This is
// intentionally a thin, swappable layer: every read/write goes through
// `loadCollection` / `saveCollection`, so replacing this file with a Supabase
// client later does not require touching the pages or components that call
// the `use*Store` hooks in src/hooks.
// ---------------------------------------------------------------------------

const NAMESPACE = 'rotterdam-crm:v1:'

export function loadCollection<T>(key: string, seed: T): T {
  if (typeof window === 'undefined') return seed
  try {
    const raw = window.localStorage.getItem(NAMESPACE + key)
    if (raw === null) {
      window.localStorage.setItem(NAMESPACE + key, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw) as T
  } catch {
    return seed
  }
}

export function saveCollection<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(NAMESPACE + key, JSON.stringify(value))
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently, in
    // memory state still works for the current session.
  }
}

export function resetCollection(key: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(NAMESPACE + key)
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(NAMESPACE))
    .forEach((k) => window.localStorage.removeItem(k))
}

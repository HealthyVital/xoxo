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

/** Like loadCollection, but records added to the seed file after a browser was
 *  first seeded still reach it: seed ids never offered before are appended once.
 *  Ids already offered are remembered, so a record the team deleted or edited
 *  locally is never re-added or overwritten. */
export function loadCollectionWithNewSeed<T extends { id: string }>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed
  const seenKey = NAMESPACE + key + ':seedIds'
  try {
    const current = loadCollection<T[]>(key, seed)
    const rawSeen = window.localStorage.getItem(seenKey)
    // First run of this logic: treat whatever is stored as already offered.
    const seen = new Set<string>(rawSeen ? (JSON.parse(rawSeen) as string[]) : current.map((r) => r.id))
    const have = new Set(current.map((r) => r.id))
    const additions = seed.filter((r) => !seen.has(r.id) && !have.has(r.id))
    window.localStorage.setItem(seenKey, JSON.stringify([...new Set([...seen, ...seed.map((r) => r.id)])]))
    if (additions.length === 0) return current
    const merged = [...current, ...additions]
    saveCollection(key, merged)
    return merged
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

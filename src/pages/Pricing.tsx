import { useState } from 'react'
import { Check } from 'lucide-react'
import { PageHeader } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input, Label } from '@/components/ui/Input'
import { SEED_PRICING_PACKAGES, SEED_ONE_OFF_SERVICES, PRICING_DISCLAIMER } from '@/data/seedData'
import { formatCurrencyEUR } from '@/lib/utils'

const VIDEO_RATE = 90
const PHOTO_RATE = 20
const BASE_FEE = 150

export default function Pricing() {
  const [videos, setVideos] = useState(8)
  const [photos, setPhotos] = useState(20)

  const estimate = BASE_FEE + videos * VIDEO_RATE + photos * PHOTO_RATE

  return (
    <div>
      <PageHeader title="Pricing" description="Reference pricing for planning conversations — every engagement is custom-quoted." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {SEED_PRICING_PACKAGES.map((pkg, i) => (
          <Card key={pkg.id} className={i === 1 ? 'border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]' : ''}>
            <CardHeader>
              <div>
                <CardTitle>{pkg.name}</CardTitle>
                <p className="mt-1 text-lg font-semibold text-[var(--color-ink)]">{pkg.priceRange}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-[var(--color-ink-secondary)]">{pkg.description}</p>
              <ul className="mb-4 space-y-1.5 text-sm">
                {pkg.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-[var(--color-ink-secondary)]">
                    <Check size={14} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--color-ink-muted)]">Best for: {pkg.bestFor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>One-off services</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEED_ONE_OFF_SERVICES.map((s) => (
            <div key={s.id} className="rounded-lg border border-[var(--color-hairline)] p-3">
              <p className="text-sm font-medium text-[var(--color-ink)]">{s.name}</p>
              <p className="text-sm font-semibold text-[var(--color-brand)]">{s.priceRange}</p>
              <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{s.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Build a rough custom estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="videos">Short-form videos / month</Label>
              <Input id="videos" type="number" value={videos} onChange={(e) => setVideos(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="photos">Edited photos / month</Label>
              <Input id="photos" type="number" value={photos} onChange={(e) => setPhotos(Number(e.target.value))} />
            </div>
          </div>
          <p className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">{formatCurrencyEUR(estimate)} / month</p>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Rough planning estimate only ({formatCurrencyEUR(BASE_FEE)} base + {formatCurrencyEUR(VIDEO_RATE)}/video +{' '}
            {formatCurrencyEUR(PHOTO_RATE)}/photo) — not a quote.
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-[var(--color-ink-muted)]">{PRICING_DISCLAIMER}</p>
    </div>
  )
}

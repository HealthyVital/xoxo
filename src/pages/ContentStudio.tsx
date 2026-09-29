import { useState } from 'react'
import { Sparkles, Save } from 'lucide-react'
import { PageHeader } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label, Select } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'
import { generateContentIdeas } from '@/lib/contentGenerator'
import { VERTICALS } from '@/data/verticals'
import type { ContentIdeaBrief, ContentIdeaOutput, Vertical } from '@/types'

const EMPTY_BRIEF: ContentIdeaBrief = {
  company: '',
  industry: '',
  product: '',
  targetAudience: '',
  objective: '',
  platform: 'Instagram & TikTok',
  tone: 'Friendly and confident',
  offer: '',
  season: '',
}

export default function ContentStudio() {
  const { addSavedContentIdea, savedContentIdeas } = useDataStore()
  const [brief, setBrief] = useState<ContentIdeaBrief>(EMPTY_BRIEF)
  const [output, setOutput] = useState<ContentIdeaOutput | null>(null)

  function set<K extends keyof ContentIdeaBrief>(key: K, value: ContentIdeaBrief[K]) {
    setBrief((prev) => ({ ...prev, [key]: value }))
  }

  function handleGenerate() {
    setOutput(generateContentIdeas(brief))
  }

  function handleSave() {
    if (!output) return
    addSavedContentIdea({ ...output, brief })
  }

  return (
    <div>
      <PageHeader
        title="Content Studio"
        description="A local, rule-based idea generator — fill in a brief and get a full content package."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={brief.company} onChange={(e) => set('company', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select id="industry" value={brief.industry} onChange={(e) => set('industry', e.target.value as Vertical)}>
                <option value="">Select industry</option>
                {VERTICALS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="product">Product / service</Label>
              <Input id="product" value={brief.product} onChange={(e) => set('product', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="audience">Target audience</Label>
              <Input id="audience" value={brief.targetAudience} onChange={(e) => set('targetAudience', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="objective">Campaign objective</Label>
              <Input id="objective" value={brief.objective} onChange={(e) => set('objective', e.target.value)} placeholder="e.g. drive direct bookings" />
            </div>
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Input id="platform" value={brief.platform} onChange={(e) => set('platform', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Input id="tone" value={brief.tone} onChange={(e) => set('tone', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="offer">Offer</Label>
              <Input id="offer" value={brief.offer} onChange={(e) => set('offer', e.target.value)} placeholder="e.g. weekend package" />
            </div>
            <div>
              <Label htmlFor="season">Season</Label>
              <Input id="season" value={brief.season} onChange={(e) => set('season', e.target.value)} placeholder="e.g. autumn" />
            </div>
            <Button className="w-full" onClick={handleGenerate}>
              <Sparkles size={14} /> Generate content package
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {!output ? (
            <Card className="flex h-full min-h-64 items-center justify-center p-8 text-center text-sm text-[var(--color-ink-muted)]">
              Fill in the brief and generate a content package to see it here.
            </Card>
          ) : (
            <>
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleSave}>
                  <Save size={14} /> Save to campaign library ({savedContentIdeas.length} saved)
                </Button>
              </div>
              <OutputSection title="10 content ideas" items={output.ideas} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <OutputSection title="5 hooks" items={output.hooks} />
                <OutputSection title="5 captions" items={output.captions} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <OutputSection title="3 Reel concepts" items={output.reelConcepts} />
                <OutputSection title="3 photo concepts" items={output.photoConcepts} />
              </div>
              <OutputSection title="Suggested shot list" items={output.shotList} />
              <Card className="p-5">
                <p className="text-xs font-semibold text-[var(--color-ink-muted)]">CTA</p>
                <p className="mt-1 text-sm text-[var(--color-ink)]">{output.cta}</p>
                <p className="mt-3 text-xs font-semibold text-[var(--color-ink-muted)]">Suggested production format</p>
                <p className="mt-1 text-sm text-[var(--color-ink)]">{output.productionFormat}</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function OutputSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-5">
      <p className="mb-2 text-xs font-semibold text-[var(--color-ink-muted)]">{title}</p>
      <ul className="space-y-1.5 text-sm text-[var(--color-ink-secondary)]">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-[var(--color-ink-muted)]">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  )
}

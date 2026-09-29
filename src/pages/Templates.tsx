import { useState } from 'react'
import { PageHeader } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input, Label, Textarea } from '@/components/ui/Input'
import { useDataStore } from '@/store/DataStoreContext'

export default function Templates() {
  const { templates, updateTemplate } = useDataStore()
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div>
      <PageHeader
        title="Outreach Templates"
        description="Email, LinkedIn, Instagram and WhatsApp templates for the Day 0 → 3 → 7 → 14 sequence. Variables like {{firstName}} are filled in automatically on the Outreach page."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {templates.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <div>
                <CardTitle>{t.kind}</CardTitle>
                <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">Day {t.sequenceDay} of the sequence</p>
              </div>
              <Badge tone="brand">{editingId === t.id ? 'Editing' : 'Active'}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {t.subject !== undefined && (
                <div>
                  <Label>Subject</Label>
                  <Input
                    value={t.subject}
                    onChange={(e) => updateTemplate(t.id, { subject: e.target.value })}
                    onFocus={() => setEditingId(t.id)}
                  />
                </div>
              )}
              <div>
                <Label>Body</Label>
                <Textarea
                  value={t.body}
                  onChange={(e) => updateTemplate(t.id, { body: e.target.value })}
                  onFocus={() => setEditingId(t.id)}
                  className="min-h-40"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.variables.map((v) => (
                  <Badge key={v} tone="neutral">{`{{${v}}}`}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

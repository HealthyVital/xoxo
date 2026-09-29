import { Link } from 'react-router-dom'
import {
  Camera,
  Video,
  Clapperboard,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Hotel,
  Plane,
  Sparkle,
  ShoppingBag,
  Pill,
  Building2,
  UtensilsCrossed,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEED_PRICING_PACKAGES } from '@/data/seedData'
import { VERTICAL_STRATEGIES } from '@/data/verticals'

const SERVICES = [
  { icon: Camera, title: 'Event photography', desc: 'Corporate events, launches and conferences, delivered fast.' },
  { icon: Heart, title: 'Wedding photography', desc: 'A dedicated service, kept separate from our B2B content work.' },
  { icon: Building2, title: 'Corporate photography', desc: 'Portraits, offices and employer-branding content.' },
  { icon: ShoppingBag, title: 'Product photography', desc: 'Studio or on-location, e-commerce and campaign ready.' },
  { icon: Video, title: 'Short-form video', desc: 'Built for how people actually watch — vertical, fast, hooked in 2 seconds.' },
  { icon: Clapperboard, title: 'Reels & TikTok content', desc: 'Platform-native content, not repurposed ads.' },
  { icon: Sparkles, title: 'UGC-style content', desc: 'Authentic-feeling content that performs like organic.' },
  { icon: Sparkle, title: 'Monthly content packages', desc: 'A steady content engine, not a one-off shoot.' },
]

const INDUSTRIES = [
  { icon: Hotel, label: 'Hotels' },
  { icon: Plane, label: 'Travel' },
  { icon: Sparkle, label: 'Cosmetics & Beauty' },
  { icon: ShoppingBag, label: 'Footwear & Fashion' },
  { icon: Pill, label: 'Pharmacy & Health Retail' },
  { icon: Building2, label: 'Events & Corporate' },
  { icon: UtensilsCrossed, label: 'Restaurants' },
]

const STEPS = [
  { step: '01', title: 'Free Content Audit', desc: 'Tell us about your business — get a content opportunity score and 3 ideas back instantly.' },
  { step: '02', title: 'Free Content Pilot', desc: 'One short-form video, 5 edited photos and 3 concepts — on us, no commitment.' },
  { step: '03', title: 'Monthly content', desc: 'If the pilot proves the fit, we build a recurring content engine around your goals.' },
  { step: '04', title: 'Reporting & growth', desc: 'Monthly reports show what worked and what we\'re changing next — so the budget keeps earning its place.' },
]

const FAQ = [
  { q: 'Is the Free Content Pilot really free?', a: 'Yes — one short-form video, 5 edited photos and 3 concepts, with no cost and no obligation to continue.' },
  { q: 'Do you only work with weddings?', a: 'No. Wedding and event photography is one service among many — our primary focus is recurring content for businesses.' },
  { q: 'Are your prices fixed?', a: 'Pricing shown is a starting reference. Every engagement is custom-quoted based on scope.' },
  { q: 'Can we cancel a monthly package?', a: 'Yes, our packages run month-to-month with a short notice period — no long lock-in contracts.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-hairline)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-ink)] text-white">
              <Camera size={16} />
            </div>
            <span className="text-sm font-semibold">Agrita&Vin Content Co.</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[var(--color-ink-secondary)] md:flex">
            <a href="#services" className="hover:text-[var(--color-ink)]">Services</a>
            <a href="#industries" className="hover:text-[var(--color-ink)]">Industries</a>
            <a href="#how-it-works" className="hover:text-[var(--color-ink)]">How it works</a>
            <a href="#packages" className="hover:text-[var(--color-ink)]">Packages</a>
            <a href="#faq" className="hover:text-[var(--color-ink)]">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app/dashboard" className="hidden text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] sm:block">
              Team login
            </Link>
            <Link to="/audit">
              <Button size="sm">Get a Free Content Audit</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center sm:px-6">
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-medium text-[var(--color-brand-strong)]">
          <Sparkles size={12} /> Content for business — Rotterdam
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Professional Content That Makes Your Brand Visible.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-ink-secondary)]">
          Photography, short-form video and social content created around your business goals.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/audit">
            <Button size="lg">
              Get a Free Content Audit <ArrowRight size={16} />
            </Button>
          </Link>
          <a href="#services">
            <Button size="lg" variant="outline">
              See Our Work
            </Button>
          </a>
        </div>
      </section>

      <section id="services" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-[var(--color-ink)]">Services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Card key={s.title} className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand-strong)]">
                  <s.icon size={17} />
                </div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{s.title}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-semibold text-[var(--color-ink)]">Industries we focus on</h2>
          <p className="mx-auto mb-8 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">
            Every industry gets a dedicated content playbook, not a one-size-fits-all package.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRIES.map((ind) => (
              <div key={ind.label} className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-hairline)] p-5 text-center">
                <ind.icon size={22} className="text-[var(--color-brand)]" />
                <p className="text-xs font-medium text-[var(--color-ink)]">{ind.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-[var(--color-ink)]">How it works</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <Card key={s.step} className="p-5">
                <p className="mb-2 text-xs font-semibold text-[var(--color-brand)]">{s.step}</p>
                <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{s.title}</p>
                <p className="text-xs text-[var(--color-ink-secondary)]">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-semibold text-[var(--color-ink)]">Content built for real objectives</h2>
          <p className="mx-auto mb-8 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">
            A sample of the content pillars we build per industry — see the full playbook once you're a client.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(['Hotels & Hospitality', 'Cosmetics & Beauty', 'Restaurants & Lifestyle'] as const).map((v) => (
              <Card key={v} className="p-5">
                <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">{v}</p>
                <ul className="space-y-1 text-xs text-[var(--color-ink-secondary)]">
                  {VERTICAL_STRATEGIES[v].contentIdeas.slice(0, 4).map((i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                      {i}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="results" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--color-ink)]">Results, reported honestly</h2>
          <p className="mx-auto max-w-xl text-sm text-[var(--color-ink-secondary)]">
            Every client gets a monthly report showing reach, engagement, leads and what we're changing next. We don't
            promise guaranteed outcomes — every number in your report is your own, clearly separated between observed,
            client-reported and estimated data.
          </p>
        </div>
      </section>

      <section id="packages" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-[var(--color-ink)]">Packages</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {SEED_PRICING_PACKAGES.map((pkg, i) => (
              <Card key={pkg.id} className={i === 1 ? 'border-[var(--color-brand)] p-6 ring-1 ring-[var(--color-brand)]' : 'p-6'}>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{pkg.name}</p>
                <p className="mt-1 text-xl font-semibold text-[var(--color-ink)]">{pkg.priceRange}</p>
                <p className="mt-2 text-xs text-[var(--color-ink-secondary)]">{pkg.description}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
                  {pkg.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-1.5">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-ink-muted)]">
            Reference pricing only — every engagement is custom-quoted.
          </p>
        </div>
      </section>

      <section id="faq" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-semibold text-[var(--color-ink)]">FAQ</h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <Card key={f.q} className="p-4">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{f.q}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--color-ink)]">Ready to see your content opportunity?</h2>
          <p className="mb-6 text-sm text-[var(--color-ink-secondary)]">
            Takes two minutes. No cost, no commitment — just a clear look at what's possible.
          </p>
          <Link to="/audit">
            <Button size="lg">
              Get a Free Content Audit <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--color-hairline)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-[var(--color-ink-muted)] sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Agrita&Vin Content Co. — content production MVP.</span>
          <Link to="/app/dashboard" className="hover:text-[var(--color-ink)]">Team login</Link>
        </div>
      </footer>
    </div>
  )
}

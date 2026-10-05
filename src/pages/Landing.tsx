import { useRef, useState, type MouseEvent } from 'react'
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
  Film,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEED_PRICING_PACKAGES, SEED_ONE_OFF_SERVICES } from '@/data/seedData'
import { VERTICAL_STRATEGIES } from '@/data/verticals'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { WhatsAppFab } from '@/components/landing/WhatsAppFab'
import { buildWhatsAppLink } from '@/lib/contact'
import vinFlowerTunnel from '@/assets/team/vin-flower-tunnel.jpg'
import vinForestRock from '@/assets/team/vin-forest-rock.jpg'
import vinBoardwalk from '@/assets/team/vin-boardwalk.jpg'
import reel1 from '@/assets/reels/reel-1.mp4'
import reel1Poster from '@/assets/reels/reel-1-poster.jpg'
import reel2 from '@/assets/reels/reel-2.mp4'
import reel2Poster from '@/assets/reels/reel-2-poster.jpg'
import agritaPortrait from '@/assets/team/agrita.jpg'
import vinPortrait from '@/assets/team/vin.jpg'
import wedding1 from '@/assets/portfolio/wedding-1.jpg'
import wedding2 from '@/assets/portfolio/wedding-2.jpg'
import wedding3 from '@/assets/portfolio/wedding-3.jpg'
import wedding4 from '@/assets/portfolio/wedding-4.jpg'
import wedding5 from '@/assets/portfolio/wedding-5.jpg'
import wedding6 from '@/assets/portfolio/wedding-6.jpg'
import wedding7 from '@/assets/portfolio/wedding-7.jpg'
import lifestyle1 from '@/assets/portfolio/lifestyle-1.jpg'
import lifestyle2 from '@/assets/portfolio/lifestyle-2.jpg'
import lifestyle3 from '@/assets/portfolio/lifestyle-3.jpg'

const TEAM = [
  { photo: agritaPortrait as string | undefined, name: 'Agrita', role: 'Model & content creator', bio: 'The face and eye behind the content — on both sides of the camera, from concept to the final shot.' },
  { photo: vinPortrait as string | undefined, name: 'Vin', role: 'Content producer', bio: 'Keeps every shoot and every client timeline running — production, logistics, delivery.' },
]

const WEDDING_GALLERY = [wedding1, wedding2, wedding3, wedding4, wedding5, wedding6, wedding7]
const LIFESTYLE_GALLERY = [lifestyle1, lifestyle2, lifestyle3]

const SERIES = [
  'var(--color-series-1)',
  'var(--color-series-2)',
  'var(--color-series-3)',
  'var(--color-series-4)',
  'var(--color-series-5)',
  'var(--color-series-6)',
  'var(--color-series-7)',
  'var(--color-series-8)',
]

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

const REELS = [
  { src: reel1, poster: reel1Poster },
  { src: reel2, poster: reel2Poster },
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
  { q: 'Do you cover weddings and one-time events?', a: 'Yes — weddings and events (corporate or family) are booked as a single one-time package, alongside our recurring monthly content work for businesses. Message us on WhatsApp for availability.' },
  { q: 'Are your prices fixed?', a: 'Pricing shown is a starting reference. Every engagement is custom-quoted based on scope.' },
  { q: 'Can we cancel a monthly package?', a: 'Yes, our packages run month-to-month with a short notice period — no long lock-in contracts.' },
]

/** A truly-3D content-tile scene for the hero: a perspective container whose
 *  group tilts toward the cursor (real parallax, not a CSS trick), while each
 *  tile continuously floats at its own depth (translateZ) via the
 *  float-1..float-5 keyframes in index.css. Mixes real photos of the team
 *  with small gradient content-type icon accents. */
function HeroMosaic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: px, y: py })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
  }

  const tiles: { photo?: string; icon?: typeof Camera; color: string; floatClass: string; size: string; x: string; y: string }[] = [
    { photo: vinFlowerTunnel, color: SERIES[0], floatClass: 'float-3', size: 'h-32 w-32 sm:h-40 sm:w-40', x: '-translate-x-[6.5rem] sm:-translate-x-36', y: '' },
    { icon: Film, color: SERIES[1], floatClass: 'float-2', size: 'h-16 w-16 sm:h-20 sm:w-20', x: '-translate-x-[2.5rem] sm:-translate-x-12', y: '-translate-y-16 sm:-translate-y-20' },
    { photo: vinForestRock, color: SERIES[2], floatClass: 'float-1', size: 'h-28 w-28 sm:h-32 sm:w-32', x: '', y: '' },
    { icon: Camera, color: SERIES[4], floatClass: 'float-4', size: 'h-16 w-16 sm:h-20 sm:w-20', x: 'translate-x-[2.5rem] sm:translate-x-12', y: '-translate-y-12 sm:-translate-y-16' },
    { photo: vinBoardwalk, color: SERIES[6], floatClass: 'float-5', size: 'h-24 w-24 sm:h-28 sm:w-28', x: 'translate-x-[6.5rem] sm:translate-x-36', y: 'translate-y-4' },
  ]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden
      className="relative mx-auto mt-14 h-64 max-w-2xl [perspective:1400px] sm:h-80"
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${14 - tilt.y * 22}deg) rotateY(${tilt.x * 28}deg)` }}
      >
        {tiles.map((t, i) => (
          // Outer div holds the static scatter position (its own transform:
          // translate-x/y) so the inner div's float-N keyframe animation
          // (which sets translateY/translateZ/rotateZ every frame) never
          // overwrites that position — the two transforms compose because
          // both ancestors keep transform-style: preserve-3d.
          <div
            key={i}
            className={cn('absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]', t.x, t.y)}
          >
            <div className={cn('flex shrink-0 items-center justify-center rounded-3xl [transform-style:preserve-3d]', t.floatClass, t.size)}>
              {t.photo ? (
                <img
                  src={t.photo}
                  alt=""
                  className="h-full w-full rounded-3xl border border-white/40 object-cover shadow-[0_20px_45px_-12px_rgba(11,11,11,0.45)]"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-3xl border border-white/25 shadow-[0_20px_45px_-12px_rgba(11,11,11,0.45)]"
                  style={{ background: `linear-gradient(135deg, ${t.color}, color-mix(in oklab, ${t.color} 55%, black))` }}
                >
                  {t.icon && <t.icon size={26} className="text-white/95" strokeWidth={1.6} />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionKicker({ children }: { children: string }) {
  return (
    <p className="mb-3 text-center text-xs font-semibold tracking-[0.18em] text-[var(--color-brand)] uppercase">
      {children}
    </p>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-surface)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-hairline)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-strong)] text-white shadow-sm">
              <Camera size={16} />
            </div>
            <span className="text-sm font-semibold">Agrita&Vin Content Co.</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[var(--color-ink-secondary)] md:flex">
            <a href="#reels" className="hover:text-[var(--color-ink)]">Reels</a>
            <a href="#weddings" className="hover:text-[var(--color-ink)]">Weddings</a>
            <a href="#services" className="hover:text-[var(--color-ink)]">Services</a>
            <a href="#industries" className="hover:text-[var(--color-ink)]">Industries</a>
            <a href="#how-it-works" className="hover:text-[var(--color-ink)]">How it works</a>
            <a href="#packages" className="hover:text-[var(--color-ink)]">Packages</a>
            <a href="#faq" className="hover:text-[var(--color-ink)]">FAQ</a>
            <Link to="/quiz" onClick={() => trackEvent('cta_click', { cta: 'nav_quiz' })} className="hover:text-[var(--color-ink)]">
              Take the Quiz
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app/dashboard" className="hidden text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] sm:block">
              Team login
            </Link>
            <Link to="/audit" onClick={() => trackEvent('cta_click', { cta: 'nav_audit' })}>
              <Button size="sm">Get a Free Content Audit</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 opacity-[0.16] blur-3xl"
          style={{
            background:
              'radial-gradient(40% 55% at 20% 30%, var(--color-series-1), transparent), radial-gradient(35% 50% at 80% 20%, var(--color-series-5), transparent), radial-gradient(45% 60% at 50% 80%, var(--color-series-3), transparent)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 text-center sm:px-6">
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-medium text-[var(--color-brand-strong)]">
            <Sparkles size={12} /> Content for business — Rotterdam
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight text-balance text-[var(--color-ink)] sm:text-6xl">
            Professional content that makes your brand{' '}
            <span className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-series-3)] bg-clip-text text-transparent">
              visible.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[var(--color-ink-secondary)] sm:text-lg">
            Photography, short-form video and social content created around your business goals.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/audit" onClick={() => trackEvent('cta_click', { cta: 'hero_audit' })}>
              <Button size="lg" className="shadow-[0_8px_24px_-6px_var(--color-brand)]">
                Get a Free Content Audit <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#reels" onClick={() => trackEvent('cta_click', { cta: 'hero_see_work' })}>
              <Button size="lg" variant="outline">
                See Our Work
              </Button>
            </a>
          </div>
          <Link
            to="/quiz"
            onClick={() => trackEvent('cta_click', { cta: 'hero_quiz' })}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand)] hover:underline"
          >
            Not sure where to start? Take the 2-minute quiz <ArrowRight size={14} />
          </Link>

          <HeroMosaic />

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[var(--color-ink-muted)]">
            {INDUSTRIES.map((ind) => (
              <span key={ind.label} className="inline-flex items-center gap-1.5">
                <ind.icon size={13} className="text-[var(--color-brand)]" /> {ind.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* REELS — real work, not stock */}
      <section id="reels" className="border-t border-[var(--color-hairline)] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionKicker>Real work, not stock</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">See it in motion</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">
            Short-form reels, shot and edited by our own team — weddings, events and everyday business
            moments, the same format we produce for clients every month.
          </p>
          <div className="mx-auto grid max-w-sm grid-cols-2 gap-5 sm:max-w-xl sm:gap-8">
            {REELS.map((r, i) => (
              <div
                key={r.src}
                className="group relative aspect-[9/16] overflow-hidden rounded-2xl shadow-xl ring-1 ring-[var(--color-hairline)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <video
                  src={r.src}
                  poster={r.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  <Sparkles size={10} /> Reel {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REAL WEDDINGS GALLERY */}
      <section id="weddings" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionKicker>Weddings &amp; events</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Real weddings, real moments</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">
            One-time coverage for weddings and events — corporate or family — captured and delivered
            as a single, no-subscription package.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {WEDDING_GALLERY.map((src, i) => (
              <div
                key={src}
                className={cn(
                  'group overflow-hidden rounded-2xl shadow-md ring-1 ring-[var(--color-hairline)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                  i === 0 && 'col-span-2 row-span-2 sm:col-span-2',
                )}
              >
                <img
                  src={src}
                  alt="Real wedding coverage by Agrita&Vin Content Co."
                  loading="lazy"
                  className={cn('h-full w-full object-cover transition-transform duration-500 group-hover:scale-105', i === 0 ? 'aspect-square' : 'aspect-[4/5]')}
                />
              </div>
            ))}
          </div>
          <p className="mt-8 text-center">
            <a
              href={buildWhatsAppLink("Hi! I'd like to ask about wedding or event coverage.")}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('cta_click', { cta: 'wedding_gallery_whatsapp' })}
              className="text-sm font-medium text-[#128C7E] hover:underline"
            >
              Ask about wedding &amp; event coverage on WhatsApp →
            </a>
          </p>
        </div>
      </section>

      {/* MEET THE CREATORS */}
      <section id="team" className="border-t border-[var(--color-hairline)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionKicker>Behind the camera</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Meet the creators</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {TEAM.map((person, i) => (
              <Card key={person.name} className="overflow-hidden p-0">
                <div className="aspect-[4/5] w-full bg-[var(--color-plane)]">
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-5xl font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${SERIES[i * 3]}, color-mix(in oklab, ${SERIES[i * 3]} 60%, black))` }}
                    >
                      {person.name[0]}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {person.name} <span className="font-normal text-[var(--color-ink-muted)]">— {person.role}</span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">{person.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>What we make</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <Card
                key={s.title}
                className="group p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(11,11,11,0.18)]"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${SERIES[i % SERIES.length]}, color-mix(in oklab, ${SERIES[i % SERIES.length]} 65%, black))` }}
                >
                  <s.icon size={18} />
                </div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{s.title}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>Focused, not generic</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Industries we focus on</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">
            Every industry gets a dedicated content playbook, not a one-size-fits-all package.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.label}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_32px_-12px_rgba(11,11,11,0.18)]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${SERIES[i % SERIES.length]}, color-mix(in oklab, ${SERIES[i % SERIES.length]} 65%, black))` }}
                >
                  <ind.icon size={20} />
                </div>
                <p className="text-xs font-medium text-[var(--color-ink)]">{ind.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL & LIFESTYLE SAMPLE CONTENT */}
      <section className="border-t border-[var(--color-hairline)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionKicker>Travel &amp; lifestyle</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            The same eye, for travel &amp; lifestyle content
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">
            The destination, hospitality and lifestyle content style we bring to travel and tour
            operator clients.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {LIFESTYLE_GALLERY.map((src) => (
              <div
                key={src}
                className="group aspect-[4/5] overflow-hidden rounded-2xl shadow-md ring-1 ring-[var(--color-hairline)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={src}
                  alt="Travel & lifestyle content sample"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>The process</SectionKicker>
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">How it works</h2>
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              aria-hidden
              className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-[var(--color-hairline)] lg:block"
            />
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                <div
                  className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${SERIES[i % SERIES.length]}, color-mix(in oklab, ${SERIES[i % SERIES.length]} 65%, black))` }}
                >
                  {s.step}
                </div>
                <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{s.title}</p>
                <p className="text-xs text-[var(--color-ink-secondary)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section id="examples" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>Strategy first</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Content built for real objectives</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">
            A sample of the content pillars we build per industry — see the full playbook once you're a client.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(['Hotels & Hospitality', 'Cosmetics & Beauty', 'Restaurants & Lifestyle'] as const).map((v, i) => (
              <Card key={v} className="overflow-hidden p-0">
                <div
                  className="h-2 w-full"
                  style={{ background: `linear-gradient(90deg, ${SERIES[i * 2]}, ${SERIES[i * 2 + 1]})` }}
                />
                <div className="p-5">
                  <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">{v}</p>
                  <ul className="space-y-1 text-xs text-[var(--color-ink-secondary)]">
                    {VERTICAL_STRATEGIES[v].contentIdeas.slice(0, 4).map((i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SectionKicker>Honesty over hype</SectionKicker>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Results, reported honestly</h2>
          <p className="mx-auto max-w-xl text-sm text-[var(--color-ink-secondary)]">
            Every client gets a monthly report showing reach, engagement, leads and what we're changing next. We don't
            promise guaranteed outcomes — every number in your report is your own, clearly separated between observed,
            client-reported and estimated data.
          </p>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>Simple pricing</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Packages</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {SEED_PRICING_PACKAGES.map((pkg, i) => (
              <Card
                key={pkg.id}
                className={cn(
                  'relative p-6 transition-transform duration-200',
                  i === 1
                    ? 'border-transparent shadow-[0_24px_48px_-16px_var(--color-brand)] ring-2 ring-[var(--color-brand)] lg:-translate-y-2'
                    : 'hover:-translate-y-1',
                )}
              >
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-brand)] px-3 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
                    Most popular
                  </span>
                )}
                <p className="text-sm font-semibold text-[var(--color-ink)]">{pkg.name}</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{pkg.priceRange}</p>
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
          <p className="mt-10 mb-5 text-center text-sm font-medium text-[var(--color-ink-secondary)]">
            Prefer a single one-time project instead of a monthly package?
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SEED_ONE_OFF_SERVICES.map((s) => (
              <Card key={s.id} className={cn('p-4', s.id === 'wedding-coverage' && 'border-[var(--color-brand)]')}>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{s.name}</p>
                <p className="mt-1 text-lg font-semibold text-[var(--color-brand)]">{s.priceRange}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{s.description}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
            Reference pricing only — every engagement is custom-quoted.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <SectionKicker>Questions</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">FAQ</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <Card key={f.q} className="overflow-hidden p-0">
                <div className="flex gap-3 p-4">
                  <div
                    className="mt-0.5 h-full w-1 shrink-0 self-stretch rounded-full"
                    style={{ background: SERIES[i % SERIES.length] }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{f.q}</p>
                    <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{f.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background:
              'radial-gradient(50% 80% at 50% 0%, var(--color-brand), transparent)',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">Ready to see your content opportunity?</h2>
          <p className="mb-6 text-sm text-[var(--color-ink-secondary)]">
            Takes two minutes. No cost, no commitment — just a clear look at what's possible.
          </p>
          <Link to="/audit" onClick={() => trackEvent('cta_click', { cta: 'bottom_audit' })}>
            <Button size="lg" className="shadow-[0_8px_24px_-6px_var(--color-brand)]">
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

      <WhatsAppFab source="landing" message="Hi! I'd like to know more about your content packages, including weddings and events." />
    </div>
  )
}

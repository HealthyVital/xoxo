import { useEffect, useRef, useState, type MouseEvent } from 'react'
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
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SEED_PRICING_PACKAGES, SEED_ONE_OFF_SERVICES } from '@/data/seedData'
import { VERTICAL_STRATEGIES } from '@/data/verticals'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { WhatsAppFab } from '@/components/landing/WhatsAppFab'
import { buildWhatsAppLink } from '@/lib/contact'
import heroTulips from '@/assets/hero/hero-tulips.jpg'
import heroMirror from '@/assets/hero/hero-mirror.jpg'
import heroGrocery from '@/assets/hero/hero-grocery.jpg'
import reel1 from '@/assets/reels/reel-1.mp4'
import reel1Poster from '@/assets/reels/reel-1-poster.jpg'
import reel2 from '@/assets/reels/reel-2.mp4'
import reel2Poster from '@/assets/reels/reel-2-poster.jpg'
import reel3 from '@/assets/reels/reel-3.mp4'
import reel3Poster from '@/assets/reels/reel-3-poster.jpg'
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
  // DOM order = mobile layout (two side by side, featured full-width below);
  // `layout` reorders on sm+ so the featured reel sits in the middle.
  // views: real view counts of each reel, confirmed by the team (2026-10-06).
  { src: reel1, poster: reel1Poster, label: 'Reel 1', views: 525_375, layout: 'sm:order-1' },
  { src: reel2, poster: reel2Poster, label: 'Reel 2', views: 1_555_324, layout: 'sm:order-3' },
  { src: reel3, poster: reel3Poster, label: 'Featured', views: 3_999_999, brandSlot: true, captions: true, layout: 'col-span-2 sm:col-span-1 sm:order-2 sm:z-10 sm:scale-[1.06]' },
] as { src: string; poster: string; label: string; views?: number; brandSlot?: boolean; captions?: boolean; layout: string }[]

/** Generic ad-style captions for the featured reel, as fractions of its
 *  playback (so they stay in sync whatever the clip length). */
const REEL_CAPTIONS = [
  { until: 0.24, before: 'Picture', highlight: 'your brand', after: 'here' },
  { until: 0.5, before: 'Moments people', highlight: 'stop scrolling', after: 'for' },
  { until: 0.75, before: 'Shot, edited &', highlight: 'ready to post', after: '' },
  { until: 1.01, before: 'Your story —', highlight: 'told beautifully', after: '' },
]

/** Captions synced to the sibling <video>'s playback position. */
function ReelCaptions() {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const video = ref.current?.closest('.group')?.querySelector('video')
    if (!video) return
    let raf = 0
    const tick = () => {
      const p = video.duration ? video.currentTime / video.duration : 0
      const next = REEL_CAPTIONS.findIndex((c) => p < c.until)
      setIndex(next === -1 ? REEL_CAPTIONS.length - 1 : next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const c = REEL_CAPTIONS[index]
  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-3 bottom-[18%] flex justify-center">
      <p
        key={index}
        className="animate-[caption-in_450ms_cubic-bezier(0.2,0.9,0.3,1.2)] text-center text-lg leading-snug font-extrabold tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] sm:text-xl"
      >
        {c.before}{' '}
        <span className="rounded-md bg-[var(--color-brand)] px-1.5 [box-decoration-break:clone] [text-shadow:none]">
          {c.highlight}
        </span>
        {c.after && ` ${c.after}`}
      </p>
    </div>
  )
}

const BRAND_SLOT_ICONS = [Hotel, UtensilsCrossed, ShoppingBag]

/** Generic "Your logo" placeholder whose icon cycles hotel → restaurant → shop,
 *  so visitors picture the reel as their own brand's ad. */
function BrandSlot() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI((n) => (n + 1) % BRAND_SLOT_ICONS.length), 2200)
    return () => window.clearInterval(id)
  }, [])
  const Icon = BRAND_SLOT_ICONS[i]
  return (
    <span className="pointer-events-none absolute top-1/2 left-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border-[3px] border-dashed border-[var(--color-brand)] bg-white/90 text-[var(--color-ink)] shadow-[0_12px_36px_-8px_rgba(0,0,0,0.5)] ring-8 ring-white/35 sm:h-48 sm:w-48">
      <Icon key={i} strokeWidth={2} className="h-16 w-16 animate-[fade-in_400ms_ease-out] sm:h-[4.5rem] sm:w-[4.5rem]" />
      <span className="text-center text-sm leading-tight font-bold tracking-wider uppercase sm:text-base">
        Your
        <br />
        logo
      </span>
    </span>
  )
}

/** View count tied to the reel's playback: climbs from 0 to `target` (ease-out)
 *  as the sibling <video> plays, and restarts each time the video loops. */
function ViewCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const video = ref.current?.closest('.group')?.querySelector('video')
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf = 0
    const tick = () => {
      const p = video.duration ? Math.min(video.currentTime / video.duration, 1) : 0
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return (
    <span ref={ref} className="inline-flex items-center gap-1 tabular-nums">
      <Eye size={10} /> {value.toLocaleString('en-US')} views
    </span>
  )
}

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

const LATVIA_BRANDS = ['Maxima', 'Drogas', 'Lidl', 'Lido', 'REWE', 'Gambas', 'VIVI', 'Origo']

/** Wordmark chips orbiting the hero tiles on an ellipse. Positions are written
 *  straight to the DOM each frame (no React re-render); chips on the front half
 *  of the orbit sit above the tiles (z-20), the back half passes behind them. */
function BrandOrbit() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const n = LATVIA_BRANDS.length
    function place(t: number) {
      const wrap = wrapRef.current
      if (!wrap) return
      const rx = wrap.offsetWidth * 0.46
      const ry = wrap.offsetHeight * 0.4
      chipRefs.current.forEach((el, i) => {
        if (!el) return
        const a = t + (i / n) * Math.PI * 2
        const depth = (Math.sin(a) + 1) / 2 // 0 = back, 1 = front
        el.style.transform = `translate(-50%, -50%) translate(${Math.cos(a) * rx}px, ${Math.sin(a) * ry}px) scale(${0.72 + 0.38 * depth})`
        el.style.zIndex = depth > 0.5 ? '20' : '0'
        el.style.opacity = String(0.5 + 0.5 * depth)
      })
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      place(0)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      place(((now - start) / 1000) * 0.22)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      {LATVIA_BRANDS.map((brand, i) => (
        <div
          key={brand}
          ref={(el) => {
            chipRefs.current[i] = el
          }}
          className="absolute top-1/2 left-1/2 rounded-2xl border border-[var(--color-hairline)] bg-white/90 px-3 py-1.5 text-sm font-bold tracking-tight whitespace-nowrap text-[var(--color-ink)] shadow-[0_10px_25px_-10px_rgba(11,11,11,0.35)] backdrop-blur sm:px-4 sm:py-2 sm:text-base"
        >
          {brand}
        </div>
      ))}
    </div>
  )
}

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
    { photo: heroTulips, color: SERIES[0], floatClass: 'float-3', size: 'h-32 w-32 sm:h-40 sm:w-40', x: '-translate-x-[6.5rem] sm:-translate-x-36', y: '' },
    { icon: Film, color: SERIES[1], floatClass: 'float-2', size: 'h-16 w-16 sm:h-20 sm:w-20', x: '-translate-x-[2.5rem] sm:-translate-x-12', y: '-translate-y-16 sm:-translate-y-20' },
    { photo: heroGrocery, color: SERIES[2], floatClass: 'float-1', size: 'h-28 w-28 sm:h-32 sm:w-32', x: '', y: '' },
    { icon: Camera, color: SERIES[4], floatClass: 'float-4', size: 'h-16 w-16 sm:h-20 sm:w-20', x: 'translate-x-[2.5rem] sm:translate-x-12', y: '-translate-y-12 sm:-translate-y-16' },
    { photo: heroMirror, color: SERIES[6], floatClass: 'float-5', size: 'h-24 w-24 sm:h-28 sm:w-28', x: 'translate-x-[6.5rem] sm:translate-x-36', y: 'translate-y-4' },
  ]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden
      className="relative mx-auto mt-14 h-64 max-w-2xl [perspective:1400px] sm:h-80"
    >
      <BrandOrbit />
      <div
        className="absolute inset-0 z-10 flex items-center justify-center transition-transform duration-200 ease-out [transform-style:preserve-3d]"
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
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-9">
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
          <div className="mx-auto grid max-w-sm grid-cols-2 items-center gap-4 sm:max-w-3xl sm:grid-cols-3 sm:gap-8">
            {REELS.map((r) => (
              <div
                key={r.src}
                className={cn(
                  'group relative aspect-[9/16] overflow-hidden rounded-2xl shadow-xl ring-1 ring-[var(--color-hairline)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl',
                  r.layout,
                )}
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
                <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    <Sparkles size={10} /> {r.label}
                  </span>
                  {r.views && (
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      <ViewCounter target={r.views} />
                    </span>
                  )}
                </div>
                {r.brandSlot && <BrandSlot />}
                {r.captions && <ReelCaptions />}
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

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-hairline)] bg-[var(--color-surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-3 px-4 text-[10px] text-[var(--color-ink-muted)] sm:px-6 sm:text-[11px]">
          <span className="truncate">
            © {new Date().getFullYear()} CreatiVibe Media Netherlands, trading as Agrita&Vin Content Co. All rights reserved.
          </span>
          <Link to="/app/dashboard" className="shrink-0 hover:text-[var(--color-ink)]">Team login</Link>
        </div>
      </footer>

      <WhatsAppFab source="landing" message="Hi! I'd like to know more about your content packages, including weddings and events." />
    </div>
  )
}

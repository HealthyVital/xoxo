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
import { MAIN_PRICING_PACKAGES, SMALL_BUSINESS_PACKAGES, SEED_ONE_OFF_SERVICES } from '@/data/seedData'
import { VERTICAL_STRATEGIES } from '@/data/verticals'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { WhatsAppFab } from '@/components/landing/WhatsAppFab'
import { buildWhatsAppLink } from '@/lib/contact'
import {
  LANDING_COPY,
  LANDING_LOCALES,
  detectLandingLocale,
  saveLandingLocale,
  type LandingCopy,
  type LandingLocale,
} from '@/lib/landingI18n'
import heroTulips from '@/assets/hero/hero-tulips.jpg'
import heroMirror from '@/assets/hero/hero-mirror.jpg'
import heroGrocery from '@/assets/hero/hero-grocery.jpg'
import logoMaxima from '@/assets/brands/maxima.png'
import logoDrogas from '@/assets/brands/drogas.png'
import logoLido from '@/assets/brands/lido.png'
import logoRewe from '@/assets/brands/rewe.png'
import logoStockmann from '@/assets/brands/stockmann.png'
import logoVivi from '@/assets/brands/vivi.png'
import logoOrigo from '@/assets/brands/origo.png'
import logoLidl from '@/assets/brands/lidl.png'
import logoGambas from '@/assets/brands/gambas.png'
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

// Role/bio text per person lives in landingI18n (team.people, same order).
const TEAM = [
  { photo: agritaPortrait as string | undefined, name: 'Agrita' },
  { photo: vinPortrait as string | undefined, name: 'Vin' },
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

// Icons only — titles/descriptions are services.items in landingI18n (same order).
const SERVICE_ICONS = [Camera, Heart, Building2, ShoppingBag, Video, Clapperboard, Sparkles, Sparkle]

const REELS = [
  // DOM order = mobile layout (two side by side, featured full-width below);
  // `layout` reorders on sm+ so the featured reel sits in the middle.
  // views: real view counts of each reel, confirmed by the team (2026-10-06).
  // label: index into reels.labels in landingI18n.
  { src: reel1, poster: reel1Poster, label: 0, views: 525_375, layout: 'sm:order-1' },
  { src: reel2, poster: reel2Poster, label: 1, views: 1_555_324, layout: 'sm:order-3' },
  { src: reel3, poster: reel3Poster, label: 2, views: 3_999_999, brandSlot: true, captions: true, layout: 'col-span-2 sm:col-span-1 sm:order-2 sm:z-10 sm:scale-[1.06]' },
] as { src: string; poster: string; label: number; views?: number; brandSlot?: boolean; captions?: boolean; layout: string }[]

/** Where each featured-reel caption ends, as a fraction of playback (so they
 *  stay in sync whatever the clip length). Text is reels.captions in landingI18n. */
const CAPTION_UNTIL = [0.24, 0.5, 0.75, 1.01]

/** Captions synced to the sibling <video>'s playback position. */
function ReelCaptions({ captions }: { captions: LandingCopy['reels']['captions'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const video = ref.current?.closest('.group')?.querySelector('video')
    if (!video) return
    let raf = 0
    const tick = () => {
      const p = video.duration ? video.currentTime / video.duration : 0
      const next = CAPTION_UNTIL.findIndex((until) => p < until)
      setIndex(next === -1 ? CAPTION_UNTIL.length - 1 : next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const c = captions[index]
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
function BrandSlot({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI((n) => (n + 1) % BRAND_SLOT_ICONS.length), 2200)
    return () => window.clearInterval(id)
  }, [])
  const Icon = BRAND_SLOT_ICONS[i]
  return (
    <span className="pointer-events-none absolute top-[25%] left-1/2 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border-[3px] border-dashed border-[var(--color-brand)] bg-white/90 text-[var(--color-ink)] shadow-[0_12px_36px_-8px_rgba(0,0,0,0.5)] ring-8 ring-white/35 sm:h-[180px] sm:w-[180px]">
      <Icon key={i} strokeWidth={2} className="h-[60px] w-[60px] animate-[fade-in_400ms_ease-out] sm:h-[68px] sm:w-[68px]" />
      <span className="text-center text-sm leading-tight font-bold tracking-wider uppercase sm:text-base">
        {lines[0]}
        <br />
        {lines[1]}
      </span>
    </span>
  )
}

/** View count tied to the reel's playback: climbs from 0 to `target` (ease-out)
 *  as the sibling <video> plays, and restarts each time the video loops. */
function ViewCounter({ target, format }: { target: number; format: (n: number) => string }) {
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
      <Eye size={10} /> {format(value)}
    </span>
  )
}

// Icons only — labels are `industries` in landingI18n (same order).
const INDUSTRY_ICONS = [Hotel, Plane, Sparkle, ShoppingBag, Pill, Building2, UtensilsCrossed]

const FEATURED_VERTICALS = ['Hotels & Hospitality', 'Cosmetics & Beauty', 'Restaurants & Lifestyle'] as const

// logo: supplied brand artwork; brands without one render as a text wordmark.
// bleed: the logo has its own background, so it fills the chip edge to edge.
// tall: near-square logo, shown taller so it carries the same visual weight.
const LATVIA_BRANDS: { name: string; logo?: string; bleed?: boolean; tall?: boolean }[] = [
  { name: 'Maxima', logo: logoMaxima },
  { name: 'Drogas', logo: logoDrogas },
  { name: 'Lidl', logo: logoLidl, bleed: true },
  { name: 'Lido', logo: logoLido, bleed: true },
  { name: 'REWE', logo: logoRewe, bleed: true },
  { name: 'Stockmann', logo: logoStockmann },
  { name: 'Gambas', logo: logoGambas, tall: true },
  { name: 'VIVI', logo: logoVivi, bleed: true },
  { name: 'Origo', logo: logoOrigo, tall: true },
]

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
          key={brand.name}
          ref={(el) => {
            chipRefs.current[i] = el
          }}
          className={cn(
            'absolute top-1/2 left-1/2 overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white whitespace-nowrap shadow-[0_10px_25px_-10px_rgba(11,11,11,0.35)]',
            !brand.logo && 'px-3 py-1.5 text-sm font-bold tracking-tight text-[var(--color-ink)] sm:px-4 sm:py-2 sm:text-base',
            brand.logo && !brand.bleed && 'px-2.5 py-1.5 sm:px-3 sm:py-2',
          )}
        >
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className={cn('block w-auto max-w-none', brand.bleed || brand.tall ? 'h-9 sm:h-11' : 'h-6 sm:h-7')}
            />
          ) : (
            brand.name
          )}
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

// Logos of businesses we've worked with (supplied by the team), loaded from
// src/assets/clients — drop a new file there and it joins the strip.
const CLIENT_LOGO_FILES = import.meta.glob('../assets/clients/*.{png,jpg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const CLIENT_LOGOS = Object.entries(CLIENT_LOGO_FILES).map(([path, src]) => ({
  src,
  // "../assets/clients/sea-bees.jpg" -> "Sea Bees"
  name: path
    .split('/')
    .pop()!
    .replace(/\.[a-z]+$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '),
}))

const MARQUEE_FADE = 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)'

/** One endless row; the list is rendered twice so the loop is seamless. */
function MarqueeRow({ logos, direction }: { logos: typeof CLIENT_LOGOS; direction: 'right' | 'left' }) {
  return (
    <div
      className="group overflow-hidden py-1"
      style={{ maskImage: MARQUEE_FADE, WebkitMaskImage: MARQUEE_FADE }}
    >
      <div
        className={cn(
          'flex w-max gap-4 group-hover:[animation-play-state:paused]',
          direction === 'right' ? 'animate-[marquee-right_70s_linear_infinite]' : 'animate-[marquee-left_70s_linear_infinite]',
        )}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            aria-hidden={i >= logos.length}
            className="flex h-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-hairline)] bg-white px-4 shadow-[0_8px_22px_-12px_rgba(11,11,11,0.35)] sm:h-20 sm:px-5"
          >
            <img
              src={logo.src}
              alt={i < logos.length ? logo.name : ''}
              loading="lazy"
              className="h-11 w-auto max-w-[180px] object-contain sm:h-14 sm:max-w-[220px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Client logos in two endless rows — top drifts left → right, bottom right → left —
 *  so every logo comes round twice as often; each row pauses on hover. */
function LogoMarquee() {
  const half = Math.ceil(CLIENT_LOGOS.length / 2)
  return (
    <div className="mx-auto mt-10 max-w-6xl space-y-3">
      <MarqueeRow logos={CLIENT_LOGOS.slice(0, half)} direction="right" />
      <MarqueeRow logos={CLIENT_LOGOS.slice(half)} direction="left" />
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

function LanguageSwitcher({ locale, onChange }: { locale: LandingLocale; onChange: (l: LandingLocale) => void }) {
  return (
    <div role="group" aria-label="Language" className="flex rounded-full border border-[var(--color-hairline)] p-0.5 text-[11px] font-semibold">
      {LANDING_LOCALES.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onChange(l.id)}
          aria-pressed={locale === l.id}
          className={cn(
            'rounded-full px-2 py-0.5 transition-colors',
            locale === l.id ? 'bg-[var(--color-ink)] text-white' : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]',
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

export default function Landing() {
  const [locale, setLocale] = useState<LandingLocale>(detectLandingLocale)
  const t = LANDING_COPY[locale]
  // The quiz has its own RU/LV versions at /quiz/:lang.
  const quizPath = locale === 'en' ? '/quiz' : `/quiz/${locale}`

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  function changeLocale(next: LandingLocale) {
    setLocale(next)
    saveLandingLocale(next)
    trackEvent('language_change', { locale: next })
    // Keep ?lang= in the URL so a link in a given language can be shared.
    const url = new URL(window.location.href)
    if (next === 'en') url.searchParams.delete('lang')
    else url.searchParams.set('lang', next)
    window.history.replaceState(window.history.state, '', url)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--color-surface)] pb-9">
      <header className="sticky top-0 z-30 border-b border-[var(--color-hairline)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-strong)] text-white shadow-sm">
              <Camera size={16} />
            </div>
            <span className="truncate text-sm font-semibold max-[420px]:hidden">Agrita&Vin Content Co.</span>
          </div>
          <nav className="hidden items-center gap-5 text-sm whitespace-nowrap text-[var(--color-ink-secondary)] xl:flex">
            <a href="#reels" className="hover:text-[var(--color-ink)]">{t.nav.reels}</a>
            <a href="#weddings" className="hover:text-[var(--color-ink)]">{t.nav.weddings}</a>
            <a href="#services" className="hover:text-[var(--color-ink)]">{t.nav.services}</a>
            <a href="#industries" className="hover:text-[var(--color-ink)]">{t.nav.industries}</a>
            <a href="#how-it-works" className="hover:text-[var(--color-ink)]">{t.nav.how}</a>
            <a href="#packages" className="hover:text-[var(--color-ink)]">{t.nav.packages}</a>
            <a href="#faq" className="hover:text-[var(--color-ink)]">{t.nav.faq}</a>
            <Link to={quizPath} onClick={() => trackEvent('cta_click', { cta: 'nav_quiz' })} className="hover:text-[var(--color-ink)]">
              {t.nav.quiz}
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher locale={locale} onChange={changeLocale} />
            <Link to="/app/dashboard" className="hidden text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] xl:block">
              {t.teamLogin}
            </Link>
            <Link to="/audit" onClick={() => trackEvent('cta_click', { cta: 'nav_audit' })}>
              <Button size="sm">
                <span className="sm:hidden">{t.auditCtaShort}</span>
                <span className="hidden sm:inline">{t.auditCta}</span>
              </Button>
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
            <Sparkles size={12} /> {t.hero.badge}
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance text-[var(--color-ink)] sm:text-6xl">
            {t.hero.titleA}{' '}
            <span className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-series-3)] bg-clip-text text-transparent">
              {t.hero.titleB}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[var(--color-ink-secondary)] sm:text-lg">
            {t.hero.sub}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/audit" onClick={() => trackEvent('cta_click', { cta: 'hero_audit' })}>
              <Button size="lg" className="shadow-[0_8px_24px_-6px_var(--color-brand)]">
                {t.auditCta} <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#reels" onClick={() => trackEvent('cta_click', { cta: 'hero_see_work' })}>
              <Button size="lg" variant="outline">
                {t.hero.seeWork}
              </Button>
            </a>
          </div>
          <Link
            to={quizPath}
            onClick={() => trackEvent('cta_click', { cta: 'hero_quiz' })}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand)] hover:underline"
          >
            {t.hero.quizNudge} <ArrowRight size={14} />
          </Link>

          <HeroMosaic />
          <LogoMarquee />

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[var(--color-ink-muted)]">
            {INDUSTRY_ICONS.map((Icon, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                <Icon size={13} className="text-[var(--color-brand)]" /> {t.industries[i]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* REELS — real work, not stock */}
      <section id="reels" className="border-t border-[var(--color-hairline)] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionKicker>{t.reels.kicker}</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.reels.title}</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">{t.reels.sub}</p>
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
                <div className="pointer-events-none absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    <Sparkles size={10} /> {t.reels.labels[r.label]}
                  </span>
                  {r.views && (
                    <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      <ViewCounter target={r.views} format={t.reels.views} />
                    </span>
                  )}
                </div>
                {r.brandSlot && <BrandSlot lines={t.reels.yourLogo} />}
                {r.captions && <ReelCaptions captions={t.reels.captions} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REAL WEDDINGS GALLERY */}
      <section id="weddings" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionKicker>{t.weddings.kicker}</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.weddings.title}</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">{t.weddings.sub}</p>
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
                  alt={t.weddings.alt}
                  loading="lazy"
                  className={cn('h-full w-full object-cover transition-transform duration-500 group-hover:scale-105', i === 0 ? 'aspect-square' : 'aspect-[4/5]')}
                />
              </div>
            ))}
          </div>
          <p className="mt-8 text-center">
            <a
              href={buildWhatsAppLink(t.weddings.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('cta_click', { cta: 'wedding_gallery_whatsapp' })}
              className="text-sm font-medium text-[#128C7E] hover:underline"
            >
              {t.weddings.whatsappLink}
            </a>
          </p>
        </div>
      </section>

      {/* MEET THE CREATORS */}
      <section id="team" className="border-t border-[var(--color-hairline)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionKicker>{t.team.kicker}</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.team.title}</h2>
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
                    {person.name} <span className="font-normal text-[var(--color-ink-muted)]">— {t.team.people[i].role}</span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">{t.team.people[i].bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>{t.services.kicker}</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.services.title}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.items.map((s, i) => {
              const Icon = SERVICE_ICONS[i]
              return (
              <Card
                key={i}
                className="group p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(11,11,11,0.18)]"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${SERIES[i % SERIES.length]}, color-mix(in oklab, ${SERIES[i % SERIES.length]} 65%, black))` }}
                >
                  <Icon size={18} />
                </div>
                <p className="text-sm font-semibold text-[var(--color-ink)]">{s.title}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{s.desc}</p>
              </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>{t.industriesSection.kicker}</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.industriesSection.title}</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">{t.industriesSection.sub}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRY_ICONS.map((Icon, i) => (
              <div
                key={i}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_32px_-12px_rgba(11,11,11,0.18)]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${SERIES[i % SERIES.length]}, color-mix(in oklab, ${SERIES[i % SERIES.length]} 65%, black))` }}
                >
                  <Icon size={20} />
                </div>
                <p className="text-xs font-medium text-[var(--color-ink)]">{t.industries[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAVEL & LIFESTYLE SAMPLE CONTENT */}
      <section className="border-t border-[var(--color-hairline)] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionKicker>{t.lifestyle.kicker}</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.lifestyle.title}</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">{t.lifestyle.sub}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {LIFESTYLE_GALLERY.map((src) => (
              <div
                key={src}
                className="group aspect-[4/5] overflow-hidden rounded-2xl shadow-md ring-1 ring-[var(--color-hairline)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={src}
                  alt={t.lifestyle.alt}
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
          <SectionKicker>{t.how.kicker}</SectionKicker>
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.how.title}</h2>
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              aria-hidden
              className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-[var(--color-hairline)] lg:block"
            />
            {t.how.steps.map((s, i) => (
              <div key={i} className="relative">
                <div
                  className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${SERIES[i % SERIES.length]}, color-mix(in oklab, ${SERIES[i % SERIES.length]} 65%, black))` }}
                >
                  {String(i + 1).padStart(2, '0')}
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
          <SectionKicker>{t.examples.kicker}</SectionKicker>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.examples.title}</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">{t.examples.sub}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_VERTICALS.map((v, i) => {
              const vc = t.examples.verticals[v] ?? { name: v, ideas: VERTICAL_STRATEGIES[v].contentIdeas.slice(0, 4) }
              return (
              <Card key={v} className="overflow-hidden p-0">
                <div
                  className="h-2 w-full"
                  style={{ background: `linear-gradient(90deg, ${SERIES[i * 2]}, ${SERIES[i * 2 + 1]})` }}
                />
                <div className="p-5">
                  <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">{vc.name}</p>
                  <ul className="space-y-1 text-xs text-[var(--color-ink-secondary)]">
                    {vc.ideas.map((idea) => (
                      <li key={idea} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SectionKicker>{t.results.kicker}</SectionKicker>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.results.title}</h2>
          <p className="mx-auto max-w-xl text-sm text-[var(--color-ink-secondary)]">{t.results.body}</p>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionKicker>{t.packages.kicker}</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.packages.title}</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {MAIN_PRICING_PACKAGES.map((pkg, i) => {
              const pc = t.packages.items[pkg.id] ?? pkg
              return (
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
                    {t.packages.mostPopular}
                  </span>
                )}
                <p className="text-sm font-semibold text-[var(--color-ink)]">{pkg.name}</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--color-ink)]">{pc.priceRange}</p>
                <p className="mt-2 text-xs text-[var(--color-ink-secondary)]">{pc.description}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
                  {pc.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-1.5">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Card>
              )
            })}
          </div>
          <div className="mt-12 rounded-3xl border border-dashed border-[var(--color-brand)] bg-[var(--color-brand-soft)]/40 p-5 sm:p-8">
            <p className="text-center text-xs font-semibold tracking-[0.18em] text-[var(--color-brand)] uppercase">{t.packages.smallKicker}</p>
            <h3 className="mt-1 text-center text-xl font-semibold tracking-tight text-[var(--color-ink)]">{t.packages.smallTitle}</h3>
            <p className="mx-auto mt-1 mb-6 max-w-lg text-center text-sm text-[var(--color-ink-secondary)]">{t.packages.smallSub}</p>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              {SMALL_BUSINESS_PACKAGES.map((pkg) => {
                const pc = t.packages.items[pkg.id] ?? pkg
                return (
                  <Card key={pkg.id} className="p-5">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{pkg.name}</p>
                    <p className="mt-1 text-2xl font-semibold text-[var(--color-brand)]">{pc.priceRange}</p>
                    <p className="mt-2 text-xs text-[var(--color-ink-secondary)]">{pc.description}</p>
                    <ul className="mt-3 space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
                      {pc.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-1.5">
                          <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )
              })}
            </div>
          </div>
          <p className="mt-10 mb-5 text-center text-sm font-medium text-[var(--color-ink-secondary)]">{t.packages.oneOffIntro}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SEED_ONE_OFF_SERVICES.map((s) => {
              const sc = t.packages.oneOff[s.id] ?? s
              return (
                <Card key={s.id} className={cn('p-4', s.id === 'wedding-coverage' && 'border-[var(--color-brand)]')}>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{sc.name}</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--color-brand)]">{sc.priceRange}</p>
                  <p className="mt-1 text-xs text-[var(--color-ink-secondary)]">{sc.description}</p>
                </Card>
              )
            })}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">{t.packages.disclaimer}</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-[var(--color-hairline)] bg-[var(--color-plane)] py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <SectionKicker>{t.faq.kicker}</SectionKicker>
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.faq.title}</h2>
          <div className="space-y-3">
            {t.faq.items.map((f, i) => (
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
          <h2 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{t.contact.title}</h2>
          <p className="mb-6 text-sm text-[var(--color-ink-secondary)]">{t.contact.sub}</p>
          <Link to="/audit" onClick={() => trackEvent('cta_click', { cta: 'bottom_audit' })}>
            <Button size="lg" className="shadow-[0_8px_24px_-6px_var(--color-brand)]">
              {t.auditCta} <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-hairline)] bg-[var(--color-surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-3 px-4 text-[10px] text-[var(--color-ink-muted)] sm:px-6 sm:text-[11px]">
          <span className="truncate">{t.footer(new Date().getFullYear())}</span>
          <Link to="/app/dashboard" className="shrink-0 hover:text-[var(--color-ink)]">{t.teamLogin}</Link>
        </div>
      </footer>

      <WhatsAppFab source="landing" message={t.whatsappFab} />
    </div>
  )
}

import { useState } from 'react'
import { ExternalLink, AlertTriangle, Plus, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui/Misc'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LogOwnBrandMonthModal } from '@/components/strategy/LogOwnBrandMonthModal'
import { useDataStore } from '@/store/DataStoreContext'
import { VERTICALS, VERTICAL_STRATEGIES } from '@/data/verticals'
import { formatDate, formatNumber, formatPercent } from '@/lib/utils'

// Starting point as of 2026-10-05, read from profile screenshots supplied by
// the team. Engagement rate / reach are NOT visible on a public profile, so
// they stay unknown until the account is switched to a professional account
// and Instagram Insights are available.
const BASELINE_DATE = '2026-10-05'

interface AuditSubject {
  handle: string
  url: string
  posts: number
  followers: number
  following: number
  bio: string[]
  link: string
  highlights: string[]
  findings: string[]
}

const AUDIT_SUBJECTS: AuditSubject[] = [
  {
    handle: '@worlddigital_marketing_agency',
    url: 'https://www.instagram.com/worlddigital_marketing_agency',
    posts: 391,
    followers: 1275,
    following: 3937,
    bio: [
      'YOUR BRAND MANAGER HERE · Digital creator',
      'Your Brand Visualization · We help you grow in social platforms from ZERO',
      'Dm for collabs · WordPress',
    ],
    link: 'taplink.cc/best_traveldeals',
    highlights: ['SALE', 'Costumers', 'Reviews', 'About us', 'Principles'],
    findings: [
      'Sigue a 3,1 veces más cuentas de las que lo siguen (3.937 vs 1.275). Es la huella típica del crecimiento "follow-for-follow": la audiencia probablemente es de baja calidad y, a simple vista, resta credibilidad a una agencia.',
      'Solo ~3,3 seguidores por post (1.275 / 391). Mucho volumen publicado con poca tracción.',
      'El enlace de la bio lleva a "best_traveldeals", no a un servicio de marketing. Es incoherente con lo que promete la bio.',
      '4 de las 5 portadas de highlights usan la misma foto de stock. "Costumers" tiene un error de ortografía (debería ser "Customers").',
      'Buen esqueleto de agencia: ya tiene highlights de Reviews, About us y Customers, y una bio orientada a clientes ("we help you grow").',
    ],
  },
  {
    handle: '@agrita_world_adventures',
    url: 'https://www.instagram.com/agrita_world_adventures/',
    posts: 789,
    followers: 10800,
    following: 9296,
    bio: [
      'Traveler & brand manager & makeup artist EU · Digital creator',
      'Travel | Content | LV based in NL · We turn moments into visuals',
      '@agrita_photography · DM for collabs',
    ],
    link: 'taplink.cc/agrita_makeup_buisness_creator',
    highlights: ['Netherlands', 'Events 3', 'Deals', 'Collabs', 'Latvia', 'Photostudio', 'Collabs2'],
    findings: [
      'Es el activo más fuerte: 10,8K seguidores y ~13,7 por post. Su ratio seguidores/seguidos (1,16) es sano comparado con el de la cuenta de agencia.',
      'Tiene colaboraciones de marca reales (highlights "Collabs", "Collabs2", "Deals"), que son prueba social que hoy no aprovecha la empresa.',
      'La bio mezcla tres identidades (viajera, brand manager, maquilladora). Las cuentas separadas ya existen (@agrita_photography, @agrita_makeup), pero la bio todavía no lo refleja con claridad.',
      'El enlace tiene un error de ortografía: "buisness" en vez de "business".',
      'Sigue a 9.296 cuentas, casi tantas como seguidores tiene. Conviene reducirlo de a poco.',
    ],
  },
]

const STILL_UNKNOWN = [
  'Tasa de engagement (likes + comentarios + guardados / alcance)',
  'Alcance y visualizaciones por post',
  'Posts y Reels con mejor rendimiento',
  'Demografía y país de la audiencia (¿cuánta es de NL/Rotterdam?)',
]

const CONVERSION_STEPS = [
  'Cambiar el usuario a un handle de marca (p. ej. @agritavin.content; verificar disponibilidad) y el nombre visible a "Agrita&Vin Content Co.". Se conservan seguidores y posts.',
  'Pasarla a cuenta profesional (Business) para tener Instagram Insights. Sin esto, el reporte mensual no se puede hacer con datos reales.',
  'Archivar (no borrar; es reversible) los posts que no representen la marca: stock genérico, travel deals.',
  'Bio nueva: qué hacemos, para quién y dónde (Rotterdam + Bálticos), con CTA al quiz gratis. Enlace a la landing (healthyvital.github.io/xoxo) en lugar de taplink.cc/best_traveldeals.',
  'Rehacer los highlights con portadas propias, corregir "Costumers" → "Clients" y añadir Weddings, Reels, Quiz y Pricing.',
  'Reducir los seguidos de a poco (unas decenas por día) para no disparar los límites de acción de Instagram.',
  'Enlazar la empresa desde las cuentas personales: "Co-founder @…" en las bios de @agrita_world_adventures, @agrita_photography y @agrita_makeup.',
]

const NEW_PLATFORMS: { name: string; why: string; first30: string[] }[] = [
  {
    name: 'Facebook (empezar primero)',
    why: 'Se conecta a Instagram vía Meta Business Suite: publicación cruzada y programación gratis, Insights unificados, y es requisito para anuncios de Meta y WhatsApp Business.',
    first30: [
      'Crear la Página "Agrita&Vin Content Co." y vincularla a la cuenta de Instagram convertida.',
      'Activar la publicación cruzada automática IG → FB.',
      'Unirse a 3-5 grupos locales (expats en Rotterdam, bodas en NL, negocios de hostelería) y aportar valor, no spam.',
    ],
  },
  {
    name: 'TikTok',
    why: 'Mayor alcance orgánico para una cuenta de 0 seguidores. Los mismos Reels verticales sirven, editados de forma nativa.',
    first30: [
      'Mismo handle que en Instagram.',
      '3-5 videos por semana: detrás de cámara, tips de contenido, highlights de bodas.',
      'Usar audio en tendencia y un texto-gancho en los 2 primeros segundos. En el mes 1 el objetivo es la constancia, no los números.',
    ],
  },
  {
    name: 'LinkedIn',
    why: 'Es donde está el público B2B del CRM: hoteles, turismo, corporativo. Convierte mejor para retainers mensuales.',
    first30: [
      'Página de empresa + perfiles personales de Agrita y Vin como fundadoras/es.',
      '1-2 posts por semana: casos, el antes/después de esta misma Estrategia Ejemplo, aprendizajes.',
      'Conectar con los contactos de los prospectos de Hotels & Travel ya cargados en el CRM.',
    ],
  },
  {
    name: 'YouTube',
    why: 'Activo a largo plazo: búsquedas y SEO. Los Shorts reciclan los Reels sin trabajo extra.',
    first30: [
      'Canal con el mismo handle y banner de marca.',
      'Subir como Shorts todos los Reels del mes.',
      '1 video largo al mes: el film de una boda o un "cómo producimos un shoot" de 5-10 min.',
    ],
  },
]

const PARTNER_PLAN: { title: string; items: string[] }[] = [
  {
    title: '12+ videos cortos / mes',
    items: [
      'Semanal: Reel "detrás del shoot" con material real (los 2 reels ya publicados en la landing son la plantilla).',
      '2 al mes: highlight de boda o evento con material de clientes reales (con permiso). Alimenta la línea de bodas.',
      'Semanal: Reel de tip de contenido. Posiciona a Agrita y Vin como expertas y lleva tráfico al quiz y al audit gratis.',
      '1 al mes: "un día con el equipo". Humaniza la marca y ayuda a sumar profesionales al marketplace.',
    ],
  },
  {
    title: '25+ fotos / mes',
    items: [
      'Carruseles de portafolio con shoots reales. Fuente: las galerías de bodas y lifestyle ya publicadas.',
      'Gráficos con datos reales del Dashboard cuando existan (nada inventado).',
      'Fotos del equipo (Agrita, Vin), ya confirmadas.',
      'Antes/después y proceso en cuanto se complete el primer piloto real.',
    ],
  },
  {
    title: 'Multiplataforma',
    items: [
      'Instagram (cuenta convertida) como base y Facebook vía cross-posting.',
      'TikTok y YouTube Shorts con los mismos verticales, editados de forma nativa.',
      'LinkedIn para el público B2B.',
      'La web: las secciones de Reels y bodas de la landing también son un canal.',
    ],
  },
  {
    title: 'Estrategia de contenido',
    items: [
      'Esqueleto semanal fijo y sostenible: lunes tip, miércoles portafolio, viernes detrás de cámara.',
      'Cada pieza se asocia a una de las 7 Vertical Strategies, así el contenido también sirve como material de venta.',
    ],
  },
  {
    title: 'Campañas',
    items: [
      'Lanzamiento de bodas y eventos con la galería y los reels nuevos.',
      'Campaña del quiz: está publicado pero todavía no tiene ninguna campaña en redes.',
      'Posts "Collab" de Instagram entre @agrita_world_adventures (10,8K) y la cuenta de empresa: comparten audiencia sin perder la marca personal.',
    ],
  },
  {
    title: 'Reporte mensual',
    items: [
      'Se registra abajo con las mismas métricas que el reporte de un cliente Partner, separado de los clientes reales para no distorsionar el Dashboard.',
    ],
  },
  {
    title: 'Producción prioritaria',
    items: [
      'El contenido propio tiene el mismo plazo de entrega en la semana que un cliente Partner. Si eso no se cumple en la práctica, el caso de estudio no es honesto.',
    ],
  },
]

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="tabular-nums text-lg font-semibold text-[var(--color-ink)]">{value}</p>
      <p className="text-[11px] text-[var(--color-ink-muted)]">{label}</p>
    </div>
  )
}

export default function StrategyExample() {
  const { ownBrandSnapshots } = useDataStore()
  const [showLogMonth, setShowLogMonth] = useState(false)

  return (
    <div>
      <PageHeader
        title="Estrategia Ejemplo"
        description="Aplicamos nuestro propio paquete Content Partner a Agrita&Vin Content Co.: un caso de estudio real, clonable y adaptable por industria para cada cliente."
      />

      <Card className="mb-6 border-[var(--color-brand)] bg-[var(--color-brand-soft)] p-5">
        <div className="flex items-start gap-3">
          <Rocket size={18} className="mt-0.5 shrink-0 text-[var(--color-brand-strong)]" />
          <p className="text-sm text-[var(--color-ink)]">
            Hacemos para nosotros mismos, de verdad, lo que vendemos a otros: el paquete{' '}
            <strong>Content Partner</strong>. Si funciona en nuestra propia marca, se clona y se adapta por
            industria para cada cliente real.
          </p>
        </div>
      </Card>

      <h2 className="mb-3 text-lg font-semibold text-[var(--color-ink)]">Punto de partida ({formatDate(BASELINE_DATE)})</h2>
      <Card className="mb-8 p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Clientes recurrentes" value="0" />
          <Stat label="IG agencia (seguidores)" value="1.275" />
          <Stat label="IG personal (seguidores)" value="10,8K" />
          <Stat label="TikTok" value="0" />
          <Stat label="YouTube" value="0" />
          <Stat label="Facebook / LinkedIn" value="0" />
        </div>
      </Card>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">1. Content audit</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">
        Datos de los perfiles públicos al {formatDate(BASELINE_DATE)}, aportados por el equipo.
      </p>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {AUDIT_SUBJECTS.map((s) => (
          <Card key={s.handle}>
            <CardHeader>
              <div>
                <CardTitle>
                  {s.handle}{' '}
                  <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex align-middle text-[var(--color-brand)]">
                    <ExternalLink size={14} />
                  </a>
                </CardTitle>
                <CardDescription>{s.bio.join(' · ')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-[var(--color-plane)] p-3">
                <Stat label="Posts" value={formatNumber(s.posts)} />
                <Stat label="Seguidores" value={formatNumber(s.followers)} />
                <Stat label="Seguidos" value={formatNumber(s.following)} />
              </div>
              <p className="mb-1 text-[11px] text-[var(--color-ink-muted)]">Enlace en bio: {s.link}</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {s.highlights.map((h) => (
                  <Badge key={h} tone="neutral">
                    {h}
                  </Badge>
                ))}
              </div>
              <p className="mb-1 text-xs font-semibold text-[var(--color-ink-muted)]">Hallazgos</p>
              <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
                {s.findings.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[var(--color-ink-muted)]">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8 p-5">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={14} className="text-[var(--color-warning)]" />
          <p className="text-sm font-semibold text-[var(--color-ink)]">Lo que todavía no se puede medir desde un perfil público</p>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 text-xs text-[var(--color-ink-secondary)] sm:grid-cols-2">
          {STILL_UNKNOWN.map((u) => (
            <li key={u}>○ {u}</li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-[var(--color-ink-muted)]">
          Se desbloquea con Instagram Insights tras pasar a cuenta profesional (paso 2 de la conversión).
        </p>
      </Card>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">2. Decisión: qué cuenta se convierte en Agrita&amp;Vin Content Co.</h2>
      <Card className="mb-4 border-[var(--color-brand)] p-5">
        <p className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
          @worlddigital_marketing_agency <ArrowRight size={14} /> Agrita&amp;Vin Content Co.
        </p>
        <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
          <li>• Ya está posicionada como agencia ("we help you grow"), con highlights de Reviews, About us y Customers: el esqueleto ya existe.</li>
          <li>• Convertirla solo cuesta 1.275 seguidores de baja calidad. Convertir la cuenta personal pondría en riesgo los 10,8K, que siguen a Agrita por sus viajes y no a una agencia.</li>
          <li>• @agrita_world_adventures se queda como la marca personal de la fundadora y alimenta a la empresa con posts Collab y menciones. Es el modelo de marca liderada por su fundadora, que convierte mejor que una cuenta de agencia sola.</li>
        </ul>
      </Card>
      <Card className="mb-8 p-5">
        <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">Pasos de la conversión</p>
        <ol className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
          {CONVERSION_STEPS.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="tabular-nums font-semibold text-[var(--color-brand)]">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">3. Nuevas plataformas, desde cero</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">
        Mismo handle en todas. En los primeros 30 días se mide la constancia, no los seguidores.
      </p>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {NEW_PLATFORMS.map((p) => (
          <Card key={p.name} className="p-5">
            <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">{p.name}</p>
            <p className="mb-3 text-xs text-[var(--color-ink-muted)]">{p.why}</p>
            <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
              {p.first30.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[var(--color-good)]" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">4. El paquete Content Partner, aplicado a nosotros mismos</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">
        El mismo estándar que le prometemos a un cliente Partner, con fuentes reales.
      </p>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {PARTNER_PLAN.map((section) => (
          <Card key={section.title} className="p-5">
            <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">{section.title}</p>
            <ul className="space-y-1.5 text-xs text-[var(--color-ink-secondary)]">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--color-good)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <h2 className="mb-1 text-lg font-semibold text-[var(--color-ink)]">5. Cómo clonarlo por industria</h2>
      <p className="mb-4 text-sm text-[var(--color-ink-secondary)]">
        Misma cadencia (12 videos, 25 fotos, multiplataforma, reporte mensual). Solo cambian los pilares de
        contenido, que salen de las Vertical Strategies ya existentes.
      </p>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {VERTICALS.map((v) => (
          <Card key={v} className="p-4">
            <p className="mb-1.5 text-sm font-semibold text-[var(--color-ink)]">{v}</p>
            <div className="flex flex-wrap gap-1">
              {VERTICAL_STRATEGIES[v].contentIdeas.slice(0, 4).map((idea) => (
                <Badge key={idea} tone="neutral">
                  {idea}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">6. Seguimiento mes a mes</h2>
        <Button onClick={() => setShowLogMonth(true)}>
          <Plus size={14} /> Registrar este mes
        </Button>
      </div>
      <Card className="overflow-x-auto">
        {ownBrandSnapshots.length === 0 ? (
          <EmptyState
            title="Sin datos todavía"
            description="Se llena mes a mes con números reales, igual que el historial de un cliente real. El punto de partida es la tarjeta de arriba."
          />
        ) : (
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] text-left text-xs text-[var(--color-ink-muted)]">
                <th className="px-4 py-3 font-medium">Mes</th>
                <th className="px-4 py-3 font-medium">Posts</th>
                <th className="px-4 py-3 font-medium">Alcance</th>
                <th className="px-4 py-3 font-medium">Engagement</th>
                <th className="px-4 py-3 font-medium">Seguidores ganados</th>
                <th className="px-4 py-3 font-medium">Leads</th>
                <th className="px-4 py-3 font-medium">Reservas</th>
              </tr>
            </thead>
            <tbody>
              {ownBrandSnapshots.map((s) => (
                <tr key={s.period} className="border-b border-[var(--color-hairline)] last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{formatDate(`${s.period}-01`)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.postsPublished)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.reach)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatPercent(s.engagementRate)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.followersGained)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.leads)}</td>
                  <td className="tabular-nums px-4 py-3 text-[var(--color-ink-secondary)]">{formatNumber(s.bookings)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {showLogMonth && <LogOwnBrandMonthModal onClose={() => setShowLogMonth(false)} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Translations for the public landing page (English / Russian / Latvian).
// English package, one-off service and vertical copy lives in pricing.json and
// verticals.ts; the `items`/`oneOff`/`verticals` maps below only override it
// for RU and LV, so prices and ids stay defined in one place.
// ---------------------------------------------------------------------------

export type LandingLocale = 'en' | 'ru' | 'lv'

export const LANDING_LOCALES: { id: LandingLocale; label: string }[] = [
  { id: 'en', label: 'EN' },
  { id: 'ru', label: 'RU' },
  { id: 'lv', label: 'LV' },
]

const STORAGE_KEY = 'landing-locale'

function asLocale(value: string | null | undefined): LandingLocale | null {
  const v = value?.slice(0, 2).toLowerCase()
  return v === 'en' || v === 'ru' || v === 'lv' ? v : null
}

/** ?lang= in the URL wins, then the visitor's saved choice, then their browser language. */
export function detectLandingLocale(): LandingLocale {
  const fromUrl = asLocale(new URLSearchParams(window.location.search).get('lang'))
  if (fromUrl) return fromUrl
  try {
    const saved = asLocale(window.localStorage.getItem(STORAGE_KEY))
    if (saved) return saved
  } catch {
    // storage blocked (private mode etc.) — fall through to browser language
  }
  for (const lang of navigator.languages ?? [navigator.language]) {
    const l = asLocale(lang)
    if (l) return l
  }
  return 'en'
}

export function saveLandingLocale(locale: LandingLocale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // ignore — the choice just won't persist across visits
  }
}

function pluralViews(locale: string, forms: Partial<Record<Intl.LDMLPluralRule, string>>, fallback: string) {
  const rules = new Intl.PluralRules(locale)
  return (n: number) => `${n.toLocaleString(locale)} ${forms[rules.select(n)] ?? fallback}`
}

type Caption = { before: string; highlight: string; after: string }
type PackageCopy = { priceRange: string; description: string; deliverables: string[] }
type OneOffCopy = { name: string; priceRange: string; description: string }

const EN = {
  nav: {
    reels: 'Reels',
    weddings: 'Weddings',
    services: 'Services',
    industries: 'Industries',
    how: 'How it works',
    packages: 'Packages',
    faq: 'FAQ',
    quiz: 'Take the Quiz',
  },
  teamLogin: 'Team login',
  auditCta: 'Get a Free Content Audit',
  auditCtaShort: 'Free audit',
  hero: {
    badge: 'Content for business — Rotterdam',
    titleA: 'Professional content that makes your brand',
    titleB: 'visible.',
    sub: 'Photography, short-form video and social content created around your business goals.',
    seeWork: 'See Our Work',
    quizNudge: 'Not sure where to start? Take the 2-minute quiz',
  },
  industries: ['Hotels', 'Travel', 'Cosmetics & Beauty', 'Footwear & Fashion', 'Pharmacy & Health Retail', 'Events & Corporate', 'Restaurants'],
  reels: {
    kicker: 'Real work, not stock',
    title: 'See it in motion',
    sub: 'Short-form reels, shot and edited by our own team — weddings, events and everyday business moments, the same format we produce for clients every month.',
    labels: ['Reel 1', 'Reel 2', 'Featured'],
    views: pluralViews('en-US', { one: 'view', other: 'views' }, 'views'),
    yourLogo: ['Your', 'logo'],
    captions: [
      { before: 'Picture', highlight: 'your brand', after: 'here' },
      { before: 'Moments people', highlight: 'stop scrolling', after: 'for' },
      { before: 'Shot, edited &', highlight: 'ready to post', after: '' },
      { before: 'Your story —', highlight: 'told beautifully', after: '' },
    ] as Caption[],
  },
  weddings: {
    kicker: 'Weddings & events',
    title: 'Real weddings, real moments',
    sub: 'One-time coverage for weddings and events — corporate or family — captured and delivered as a single, no-subscription package.',
    alt: 'Real wedding coverage by Agrita&Vin Content Co.',
    whatsappMessage: "Hi! I'd like to ask about wedding or event coverage.",
    whatsappLink: 'Ask about wedding & event coverage on WhatsApp →',
  },
  team: {
    kicker: 'Behind the camera',
    title: 'Meet the creators',
    people: [
      { role: 'Model & content creator', bio: 'The face and eye behind the content — on both sides of the camera, from concept to the final shot.' },
      { role: 'Content producer', bio: 'Keeps every shoot and every client timeline running — production, logistics, delivery.' },
    ],
  },
  services: {
    kicker: 'What we make',
    title: 'Services',
    items: [
      { title: 'Event photography', desc: 'Corporate events, launches and conferences, delivered fast.' },
      { title: 'Wedding photography', desc: 'A dedicated service, kept separate from our B2B content work.' },
      { title: 'Corporate photography', desc: 'Portraits, offices and employer-branding content.' },
      { title: 'Product photography', desc: 'Studio or on-location, e-commerce and campaign ready.' },
      { title: 'Short-form video', desc: 'Built for how people actually watch — vertical, fast, hooked in 2 seconds.' },
      { title: 'Reels & TikTok content', desc: 'Platform-native content, not repurposed ads.' },
      { title: 'UGC-style content', desc: 'Authentic-feeling content that performs like organic.' },
      { title: 'Monthly content packages', desc: 'A steady content engine, not a one-off shoot.' },
    ],
  },
  industriesSection: {
    kicker: 'Focused, not generic',
    title: 'Industries we focus on',
    sub: 'Every industry gets a dedicated content playbook, not a one-size-fits-all package.',
  },
  lifestyle: {
    kicker: 'Travel & lifestyle',
    title: 'The same eye, for travel & lifestyle content',
    sub: 'The destination, hospitality and lifestyle content style we bring to travel and tour operator clients.',
    alt: 'Travel & lifestyle content sample',
  },
  how: {
    kicker: 'The process',
    title: 'How it works',
    steps: [
      { title: 'Free Content Audit', desc: 'Tell us about your business — get a content opportunity score and 3 ideas back instantly.' },
      { title: 'Free Content Pilot', desc: 'One short-form video, 5 edited photos and 3 concepts — on us, no commitment.' },
      { title: 'Monthly content', desc: 'If the pilot proves the fit, we build a recurring content engine around your goals.' },
      { title: 'Reporting & growth', desc: "Monthly reports show what worked and what we're changing next — so the budget keeps earning its place." },
    ],
  },
  examples: {
    kicker: 'Strategy first',
    title: 'Content built for real objectives',
    sub: "A sample of the content pillars we build per industry — see the full playbook once you're a client.",
    verticals: {} as Record<string, { name: string; ideas: string[] }>,
  },
  results: {
    kicker: 'Honesty over hype',
    title: 'Results, reported honestly',
    body: "Every client gets a monthly report showing reach, engagement, leads and what we're changing next. We don't promise guaranteed outcomes — every number in your report is your own, clearly separated between observed, client-reported and estimated data.",
  },
  packages: {
    kicker: 'Simple pricing',
    title: 'Packages',
    mostPopular: 'Most popular',
    smallKicker: 'Small business?',
    smallTitle: 'Start small — from €49 a month',
    smallSub: 'Not every business needs a €1,500 package. Start with what fits your budget and grow when the content starts paying off.',
    items: {} as Record<string, PackageCopy>,
    oneOffIntro: 'Prefer a single one-time project instead of a monthly package?',
    oneOff: {} as Record<string, OneOffCopy>,
    disclaimer: 'Reference pricing only — every engagement is custom-quoted.',
  },
  faq: {
    kicker: 'Questions',
    title: 'FAQ',
    items: [
      { q: 'Is the Free Content Pilot really free?', a: 'Yes — one short-form video, 5 edited photos and 3 concepts, with no cost and no obligation to continue.' },
      { q: 'Do you cover weddings and one-time events?', a: 'Yes — weddings and events (corporate or family) are booked as a single one-time package, alongside our recurring monthly content work for businesses. Message us on WhatsApp for availability.' },
      { q: 'Are your prices fixed?', a: 'Pricing shown is a starting reference. Every engagement is custom-quoted based on scope.' },
      { q: 'Can we cancel a monthly package?', a: 'Yes, our packages run month-to-month with a short notice period — no long lock-in contracts.' },
    ],
  },
  contact: {
    title: 'Ready to see your content opportunity?',
    sub: "Takes two minutes. No cost, no commitment — just a clear look at what's possible.",
  },
  footer: (year: number) => `© ${year} CreatiVibe Media Netherlands, trading as Agrita&Vin Content Co. All rights reserved.`,
  whatsappFab: "Hi! I'd like to know more about your content packages, including weddings and events.",
}

export type LandingCopy = typeof EN

const RU: LandingCopy = {
  nav: {
    reels: 'Ролики',
    weddings: 'Свадьбы',
    services: 'Услуги',
    industries: 'Отрасли',
    how: 'Как мы работаем',
    packages: 'Пакеты',
    faq: 'Вопросы',
    quiz: 'Пройти квиз',
  },
  teamLogin: 'Вход для команды',
  auditCta: 'Бесплатный аудит контента',
  auditCtaShort: 'Бесплатный аудит',
  hero: {
    badge: 'Контент для бизнеса — Роттердам',
    titleA: 'Профессиональный контент, который делает ваш бренд',
    titleB: 'заметным.',
    sub: 'Фото, короткие видео и контент для соцсетей, созданные под цели вашего бизнеса.',
    seeWork: 'Наши работы',
    quizNudge: 'Не знаете, с чего начать? Пройдите квиз за 2 минуты',
  },
  industries: ['Отели', 'Путешествия', 'Косметика и красота', 'Обувь и мода', 'Аптеки и товары для здоровья', 'Мероприятия и корпоративы', 'Рестораны'],
  reels: {
    kicker: 'Реальные работы, а не стоки',
    title: 'Смотрите в движении',
    sub: 'Короткие ролики, снятые и смонтированные нашей командой: свадьбы, мероприятия и будни бизнеса — в том же формате, который мы каждый месяц делаем для клиентов.',
    labels: ['Ролик 1', 'Ролик 2', 'Топ'],
    views: pluralViews('ru-RU', { one: 'просмотр', few: 'просмотра', many: 'просмотров', other: 'просмотра' }, 'просмотров'),
    yourLogo: ['Ваш', 'логотип'],
    captions: [
      { before: 'Представьте здесь', highlight: 'ваш бренд', after: '' },
      { before: 'Моменты, ради которых', highlight: 'перестают листать', after: '' },
      { before: 'Снято, смонтировано и', highlight: 'готово к публикации', after: '' },
      { before: 'Ваша история —', highlight: 'красиво рассказана', after: '' },
    ],
  },
  weddings: {
    kicker: 'Свадьбы и мероприятия',
    title: 'Настоящие свадьбы, настоящие моменты',
    sub: 'Разовая съёмка свадеб и мероприятий — корпоративных или семейных — с готовым результатом в одном пакете, без подписки.',
    alt: 'Свадебная съёмка Agrita&Vin Content Co.',
    whatsappMessage: 'Здравствуйте! Хочу узнать о съёмке свадьбы или мероприятия.',
    whatsappLink: 'Спросить о съёмке свадьбы или мероприятия в WhatsApp →',
  },
  team: {
    kicker: 'За кадром',
    title: 'Знакомьтесь с авторами',
    people: [
      { role: 'Модель и контент-креатор', bio: 'Лицо и взгляд нашего контента — по обе стороны камеры, от идеи до финального кадра.' },
      { role: 'Продюсер контента', bio: 'Отвечает за каждую съёмку и сроки каждого клиента — продакшн, логистика, сдача материалов.' },
    ],
  },
  services: {
    kicker: 'Что мы создаём',
    title: 'Услуги',
    items: [
      { title: 'Съёмка мероприятий', desc: 'Корпоративы, презентации и конференции — с быстрой сдачей материалов.' },
      { title: 'Свадебная съёмка', desc: 'Отдельное направление, независимое от нашей работы с бизнесом.' },
      { title: 'Корпоративная съёмка', desc: 'Портреты, офисы и контент для HR-бренда.' },
      { title: 'Предметная съёмка', desc: 'В студии или на локации — для интернет-магазина и рекламных кампаний.' },
      { title: 'Короткие видео', desc: 'Сняты так, как люди реально смотрят: вертикально, динамично, цепляют за 2 секунды.' },
      { title: 'Контент для Reels и TikTok', desc: 'Нативный контент для платформ, а не переделанная реклама.' },
      { title: 'Контент в стиле UGC', desc: 'Живой, естественный контент, который работает как органика.' },
      { title: 'Ежемесячные контент-пакеты', desc: 'Стабильный поток контента, а не разовая съёмка.' },
    ],
  },
  industriesSection: {
    kicker: 'Фокус, а не шаблоны',
    title: 'Отрасли, на которых мы специализируемся',
    sub: 'Для каждой отрасли — своя контент-стратегия, а не универсальный пакет.',
  },
  lifestyle: {
    kicker: 'Путешествия и лайфстайл',
    title: 'Тот же взгляд — для контента о путешествиях и лайфстайле',
    sub: 'Стиль контента о направлениях, гостеприимстве и образе жизни, который мы предлагаем туристическим компаниям и туроператорам.',
    alt: 'Пример контента о путешествиях и лайфстайле',
  },
  how: {
    kicker: 'Процесс',
    title: 'Как мы работаем',
    steps: [
      { title: 'Бесплатный аудит контента', desc: 'Расскажите о своём бизнесе — и сразу получите оценку контент-потенциала и 3 идеи.' },
      { title: 'Бесплатный пилот', desc: 'Одно короткое видео, 5 обработанных фото и 3 концепции — за наш счёт, без обязательств.' },
      { title: 'Ежемесячный контент', desc: 'Если пилот подтвердит, что мы подходим друг другу, мы выстроим регулярный поток контента под ваши цели.' },
      { title: 'Отчёты и рост', desc: 'Ежемесячные отчёты показывают, что сработало и что мы меняем дальше, — чтобы бюджет продолжал окупаться.' },
    ],
  },
  examples: {
    kicker: 'Сначала стратегия',
    title: 'Контент под реальные цели',
    sub: 'Пример контент-рубрик, которые мы выстраиваем для каждой отрасли, — полная стратегия доступна клиентам.',
    verticals: {
      'Hotels & Hospitality': { name: 'Отели и гостеприимство', ideas: ['Обзоры номеров', 'Завтраки', 'Спа', 'Ресторан'] },
      'Cosmetics & Beauty': {
        name: 'Косметика и красота',
        ideas: ['Крупные планы продукта', 'Контент «до/после» там, где это допустимо по закону', 'Видео текстур', 'Видео с бьюти-рутиной'],
      },
      'Restaurants & Lifestyle': { name: 'Рестораны и лайфстайл', ideas: ['Фуд-фотография', 'Контент с шеф-поваром', 'Закулисье', 'Атмосфера'] },
    },
  },
  results: {
    kicker: 'Честность важнее хайпа',
    title: 'Результаты — честно',
    body: 'Каждый клиент получает ежемесячный отчёт: охват, вовлечённость, заявки и что мы меняем дальше. Мы не обещаем гарантированных результатов — все цифры в вашем отчёте ваши собственные, с чётким разделением на наблюдаемые данные, данные от клиента и оценочные.',
  },
  packages: {
    kicker: 'Простые цены',
    title: 'Пакеты',
    mostPopular: 'Самый популярный',
    smallKicker: 'Небольшой бизнес?',
    smallTitle: 'Начните с малого — от €49 в месяц',
    smallSub: 'Не каждому бизнесу нужен пакет за €1 500. Начните с того, что по карману, и растите, когда контент начнёт окупаться.',
    items: {
      drop: {
        priceRange: '€49 / мес.',
        description: 'Вы снимаете на телефон — мы превращаем это в готовый к публикации контент. Без выезда на съёмку, поэтому цена минимальная.',
        deliverables: ['2 коротких видео, смонтированных из ваших съёмок', '4 ретушированных фото', 'Тексты-хуки и подписи', 'Ежемесячный чек-лист для съёмки'],
      },
      local: {
        priceRange: '€249 – €349 / мес.',
        description: 'Одна короткая выездная съёмка каждый месяц — профессиональный контент без цен крупного агентства.',
        deliverables: ['1 выездная съёмка в месяц (до 2 часов)', '2 коротких видео', '6–8 обработанных фото', 'Подписи к каждому посту'],
      },
      starter: {
        priceRange: '€650 – €850 / мес.',
        description: 'Стабильная база контента для бизнеса, который только начинает вкладываться в соцсети.',
        deliverables: ['4 коротких видео', '8–12 обработанных фото', 'Контент-план', 'Ежемесячный отчёт'],
      },
      growth: {
        priceRange: '€1 100 – €1 500 / мес.',
        description: 'Наш самый популярный пакет — достаточно объёма и стратегии, чтобы набрать реальный темп.',
        deliverables: ['8 коротких видео', '15–25 фото', 'Контент-календарь', 'Креативная стратегия', 'Ежемесячная отчётность'],
      },
      partner: {
        priceRange: '€1 800 – €2 500+ / мес.',
        description: 'Полноценный контент-процесс на всех важных платформах с приоритетным продакшном.',
        deliverables: ['12+ коротких видео', '25+ фото', 'Несколько платформ', 'Контент-стратегия', 'Поддержка кампаний', 'Ежемесячная отчётность', 'Приоритетный продакшн'],
      },
    },
    oneOffIntro: 'Нужен разовый проект вместо ежемесячного пакета?',
    oneOff: {
      'one-off-shoot': { name: 'Разовая съёмка', priceRange: 'от €350', description: 'Фото- или видеосъёмка на полдня или на целый день.' },
      'event-coverage': { name: 'Съёмка мероприятия', priceRange: 'от €450', description: 'Полная фото- и/или видеосъёмка мероприятия с монтажом хайлайтов в течение недели.' },
      'wedding-coverage': {
        name: 'Съёмка свадебного дня',
        priceRange: 'от €750',
        description: 'Фото- и/или видеосъёмка на весь день свадьбы, включая смонтированный ролик-хайлайт, — одним разовым пакетом.',
      },
      'product-photography': { name: 'Предметная съёмка', priceRange: 'от €300', description: 'Съёмка продукции в студии или на локации — для интернет-магазина или рекламы.' },
      'corporate-photography': { name: 'Корпоративная съёмка', priceRange: 'от €400', description: 'Портреты команды, съёмка офиса или площадки и контент для HR-бренда.' },
      'campaign-production': {
        name: 'Продакшн кампании',
        priceRange: 'Индивидуальный расчёт',
        description: 'Многодневный продакшн с множеством материалов для сезонной кампании или запуска.',
      },
    },
    disclaimer: 'Цены ориентировочные — стоимость каждого проекта рассчитывается индивидуально.',
  },
  faq: {
    kicker: 'Вопросы',
    title: 'Частые вопросы',
    items: [
      { q: 'Бесплатный пилот действительно бесплатный?', a: 'Да — одно короткое видео, 5 обработанных фото и 3 концепции, без оплаты и без обязательств продолжать.' },
      {
        q: 'Вы снимаете свадьбы и разовые мероприятия?',
        a: 'Да — свадьбы и мероприятия (корпоративные или семейные) бронируются как один разовый пакет, параллельно с нашей регулярной работой для бизнеса. Напишите нам в WhatsApp, чтобы уточнить свободные даты.',
      },
      { q: 'Цены фиксированные?', a: 'Указанные цены — ориентир. Стоимость каждого проекта рассчитывается индивидуально в зависимости от объёма.' },
      { q: 'Можно ли отказаться от ежемесячного пакета?', a: 'Да, пакеты продлеваются помесячно с коротким сроком уведомления — без долгосрочных контрактов.' },
    ],
  },
  contact: {
    title: 'Хотите увидеть потенциал своего контента?',
    sub: 'Это займёт две минуты. Бесплатно и без обязательств — просто ясная картина того, что возможно.',
  },
  footer: (year: number) => `© ${year} CreatiVibe Media Netherlands, торговое название Agrita&Vin Content Co. Все права защищены.`,
  whatsappFab: 'Здравствуйте! Хочу узнать больше о ваших контент-пакетах, а также о съёмке свадеб и мероприятий.',
}

const LV: LandingCopy = {
  nav: {
    reels: 'Video',
    weddings: 'Kāzas',
    services: 'Pakalpojumi',
    industries: 'Nozares',
    how: 'Kā tas notiek',
    packages: 'Paketes',
    faq: 'BUJ',
    quiz: 'Aizpildīt testu',
  },
  teamLogin: 'Komandas pieslēgšanās',
  auditCta: 'Bezmaksas satura audits',
  auditCtaShort: 'Bezmaksas audits',
  hero: {
    badge: 'Saturs uzņēmumiem — Roterdama',
    titleA: 'Profesionāls saturs, kas padara jūsu zīmolu',
    titleB: 'pamanāmu.',
    sub: 'Fotogrāfija, īsie video un sociālo tīklu saturs, kas veidots atbilstoši jūsu uzņēmuma mērķiem.',
    seeWork: 'Mūsu darbi',
    quizNudge: 'Nezināt, ar ko sākt? Aizpildiet 2 minūšu testu',
  },
  industries: ['Viesnīcas', 'Ceļojumi', 'Kosmētika un skaistums', 'Apavi un mode', 'Aptiekas un veselības preces', 'Pasākumi un korporatīvie klienti', 'Restorāni'],
  reels: {
    kicker: 'Īsts darbs, nevis fotobankas',
    title: 'Skatiet kustībā',
    sub: 'Īsi video, ko filmējusi un montējusi mūsu komanda, — kāzas, pasākumi un uzņēmumu ikdiena tādā pašā formātā, kādu katru mēnesi veidojam klientiem.',
    labels: ['Video 1', 'Video 2', 'Izcelts'],
    views: pluralViews('lv-LV', { zero: 'skatījumu', one: 'skatījums', other: 'skatījumi' }, 'skatījumi'),
    yourLogo: ['Jūsu', 'logo'],
    captions: [
      { before: 'Iedomājieties šeit', highlight: 'savu zīmolu', after: '' },
      { before: 'Mirkļi, kuru dēļ', highlight: 'pārstāj ritināt', after: '' },
      { before: 'Nofilmēts, samontēts un', highlight: 'gatavs publicēšanai', after: '' },
      { before: 'Jūsu stāsts —', highlight: 'izstāstīts skaisti', after: '' },
    ],
  },
  weddings: {
    kicker: 'Kāzas un pasākumi',
    title: 'Īstas kāzas, īsti mirkļi',
    sub: 'Vienreizēja kāzu un pasākumu — korporatīvu vai ģimenes — fotografēšana un filmēšana vienā paketē, bez abonementa.',
    alt: 'Kāzu fotografēšana — Agrita&Vin Content Co.',
    whatsappMessage: 'Labdien! Vēlos uzzināt par kāzu vai pasākuma fotografēšanu un filmēšanu.',
    whatsappLink: 'Jautājiet par kāzu un pasākumu filmēšanu WhatsApp →',
  },
  team: {
    kicker: 'Aiz kameras',
    title: 'Iepazīstieties ar autoriem',
    people: [
      { role: 'Modele un satura veidotāja', bio: 'Seja un skatiens aiz mūsu satura — abās kameras pusēs, no idejas līdz pēdējam kadram.' },
      { role: 'Satura producents', bio: 'Rūpējas, lai katra filmēšana un katra klienta termiņi noritētu gludi, — producēšana, loģistika, nodošana.' },
    ],
  },
  services: {
    kicker: 'Ko mēs radām',
    title: 'Pakalpojumi',
    items: [
      { title: 'Pasākumu fotografēšana', desc: 'Korporatīvi pasākumi, prezentācijas un konferences — ar ātru nodošanu.' },
      { title: 'Kāzu fotografēšana', desc: 'Atsevišķs pakalpojums, nodalīts no mūsu darba ar uzņēmumiem.' },
      { title: 'Korporatīvā fotografēšana', desc: 'Portreti, biroji un darba devēja zīmola saturs.' },
      { title: 'Produktu fotografēšana', desc: 'Studijā vai uz vietas — e-komercijai un kampaņām.' },
      { title: 'Īsie video', desc: 'Veidoti tā, kā cilvēki patiešām skatās: vertikāli, dinamiski, ieinteresē 2 sekundēs.' },
      { title: 'Reels un TikTok saturs', desc: 'Platformām piemērots saturs, nevis pārveidotas reklāmas.' },
      { title: 'UGC stila saturs', desc: 'Dabisks saturs, kas darbojas kā organisks.' },
      { title: 'Ikmēneša satura paketes', desc: 'Stabila satura plūsma, nevis vienreizēja fotosesija.' },
    ],
  },
  industriesSection: {
    kicker: 'Fokuss, nevis šabloni',
    title: 'Nozares, uz kurām koncentrējamies',
    sub: 'Katrai nozarei — sava satura stratēģija, nevis viena pakete visiem.',
  },
  lifestyle: {
    kicker: 'Ceļojumi un dzīvesstils',
    title: 'Tas pats skatiens — ceļojumu un dzīvesstila saturam',
    sub: 'Galamērķu, viesmīlības un dzīvesstila satura stils, ko piedāvājam ceļojumu uzņēmumiem un tūroperatoriem.',
    alt: 'Ceļojumu un dzīvesstila satura piemērs',
  },
  how: {
    kicker: 'Process',
    title: 'Kā tas notiek',
    steps: [
      { title: 'Bezmaksas satura audits', desc: 'Pastāstiet par savu uzņēmumu — un uzreiz saņemiet satura potenciāla novērtējumu un 3 idejas.' },
      { title: 'Bezmaksas pilotprojekts', desc: 'Viens īss video, 5 apstrādātas fotogrāfijas un 3 koncepcijas — uz mūsu rēķina, bez saistībām.' },
      { title: 'Ikmēneša saturs', desc: 'Ja pilotprojekts apstiprina, ka esam piemēroti viens otram, izveidojam regulāru satura plūsmu atbilstoši jūsu mērķiem.' },
      { title: 'Atskaites un izaugsme', desc: 'Ikmēneša atskaites rāda, kas nostrādāja un ko mainām tālāk, — lai budžets turpinātu sevi attaisnot.' },
    ],
  },
  examples: {
    kicker: 'Vispirms stratēģija',
    title: 'Saturs reāliem mērķiem',
    sub: 'Piemērs satura tēmām, ko veidojam katrai nozarei, — pilna stratēģija pieejama klientiem.',
    verticals: {
      'Hotels & Hospitality': { name: 'Viesnīcas un viesmīlība', ideas: ['Numuru apskates', 'Brokastis', 'Spa', 'Restorāns'] },
      'Cosmetics & Beauty': {
        name: 'Kosmētika un skaistums',
        ideas: ['Produktu tuvplāni', 'Saturs “pirms/pēc”, kur to atļauj likums', 'Tekstūru video', 'Ikdienas rutīnas video'],
      },
      'Restaurants & Lifestyle': { name: 'Restorāni un dzīvesstils', ideas: ['Ēdienu fotogrāfija', 'Saturs ar šefpavāru', 'Aizkulises', 'Atmosfēra'] },
    },
  },
  results: {
    kicker: 'Godīgums, nevis skaļi solījumi',
    title: 'Rezultāti — godīgi',
    body: 'Katrs klients saņem ikmēneša atskaiti: sasniedzamība, iesaiste, pieteikumi un ko mainām tālāk. Mēs nesolām garantētus rezultātus — visi skaitļi jūsu atskaitē ir jūsu pašu, skaidri nodalot novērotos, klienta sniegtos un aplēstos datus.',
  },
  packages: {
    kicker: 'Vienkāršas cenas',
    title: 'Paketes',
    mostPopular: 'Populārākā',
    smallKicker: 'Mazs uzņēmums?',
    smallTitle: 'Sāciet ar mazumiņu — no €49 mēnesī',
    smallSub: 'Ne katram uzņēmumam vajag €1500 paketi. Sāciet ar to, kas atbilst budžetam, un augiet, kad saturs sāk atmaksāties.',
    items: {
      drop: {
        priceRange: '€49 / mēnesī',
        description: 'Jūs filmējat ar telefonu, mēs to pārvēršam publicēšanai gatavā saturā — bez filmēšanas izbraukuma, tāpēc cena ir minimāla.',
        deliverables: ['2 īsi video, samontēti no jūsu materiāla', '4 retušētas fotogrāfijas', 'Āķa teksti un apraksti', 'Ikmēneša filmēšanas kontrolsaraksts'],
      },
      local: {
        priceRange: '€249 – €349 / mēnesī',
        description: 'Viena īsa filmēšana uz vietas katru mēnesi — profesionāls saturs bez lielas aģentūras cenām.',
        deliverables: ['1 filmēšana uz vietas mēnesī (līdz 2 stundām)', '2 īsi video', '6–8 apstrādātas fotogrāfijas', 'Apraksti katram ierakstam'],
      },
      starter: {
        priceRange: '€650 – €850 / mēnesī',
        description: 'Stabils satura pamats uzņēmumiem, kas tikai sāk ieguldīt sociālajos tīklos.',
        deliverables: ['4 īsi video', '8–12 apstrādātas fotogrāfijas', 'Satura plānošana', 'Ikmēneša atskaite'],
      },
      growth: {
        priceRange: '€1100 – €1500 / mēnesī',
        description: 'Mūsu populārākā pakete — pietiekami daudz satura un stratēģijas, lai iegūtu reālu impulsu.',
        deliverables: ['8 īsi video', '15–25 fotogrāfijas', 'Satura kalendārs', 'Radošā stratēģija', 'Ikmēneša atskaites'],
      },
      partner: {
        priceRange: '€1800 – €2500+ / mēnesī',
        description: 'Pilns satura process visās svarīgākajās platformās ar prioritāru producēšanu.',
        deliverables: ['12+ īsi video', '25+ fotogrāfijas', 'Vairākas platformas', 'Satura stratēģija', 'Kampaņu atbalsts', 'Ikmēneša atskaites', 'Prioritāra producēšana'],
      },
    },
    oneOffIntro: 'Vēlaties vienreizēju projektu, nevis ikmēneša paketi?',
    oneOff: {
      'one-off-shoot': { name: 'Vienreizēja fotosesija', priceRange: 'No €350', description: 'Viena pusdienas vai visas dienas foto/video filmēšana.' },
      'event-coverage': { name: 'Pasākuma filmēšana', priceRange: 'No €450', description: 'Pilna pasākuma fotografēšana un/vai filmēšana ar spilgtāko mirkļu montāžu tās pašas nedēļas laikā.' },
      'wedding-coverage': {
        name: 'Kāzu dienas filmēšana',
        priceRange: 'No €750',
        description: 'Visas kāzu dienas fotografēšana un/vai filmēšana, ieskaitot samontētu spilgtāko mirkļu video, — vienā vienreizējā paketē.',
      },
      'product-photography': { name: 'Produktu fotografēšana', priceRange: 'No €300', description: 'Produktu fotografēšana studijā vai uz vietas — e-komercijai vai kampaņām.' },
      'corporate-photography': { name: 'Korporatīvā fotografēšana', priceRange: 'No €400', description: 'Komandas portreti, biroja vai telpu fotografēšana un darba devēja zīmola saturs.' },
      'campaign-production': {
        name: 'Kampaņas producēšana',
        priceRange: 'Individuāls piedāvājums',
        description: 'Vairāku dienu producēšana ar daudziem materiāliem sezonas kampaņai vai produkta palaišanai.',
      },
    },
    disclaimer: 'Cenas ir orientējošas — katra projekta izmaksas tiek aprēķinātas individuāli.',
  },
  faq: {
    kicker: 'Jautājumi',
    title: 'Biežāk uzdotie jautājumi',
    items: [
      { q: 'Vai bezmaksas pilotprojekts tiešām ir bezmaksas?', a: 'Jā — viens īss video, 5 apstrādātas fotogrāfijas un 3 koncepcijas, bez maksas un bez pienākuma turpināt.' },
      {
        q: 'Vai jūs filmējat kāzas un vienreizējus pasākumus?',
        a: 'Jā — kāzas un pasākumi (korporatīvi vai ģimenes) tiek rezervēti kā viena vienreizēja pakete, paralēli mūsu regulārajam darbam ar uzņēmumiem. Rakstiet mums WhatsApp, lai uzzinātu brīvos datumus.',
      },
      { q: 'Vai jūsu cenas ir fiksētas?', a: 'Norādītās cenas ir orientējošas. Katra projekta izmaksas tiek aprēķinātas individuāli atkarībā no apjoma.' },
      { q: 'Vai ikmēneša paketi var atcelt?', a: 'Jā, paketes darbojas pa mēnešiem ar īsu uzteikuma termiņu — bez ilgtermiņa līgumiem.' },
    ],
  },
  contact: {
    title: 'Vēlaties redzēt sava satura potenciālu?',
    sub: 'Tas aizņem divas minūtes. Bez maksas un bez saistībām — vienkārši skaidrs priekšstats par iespējamo.',
  },
  footer: (year: number) => `© ${year} CreatiVibe Media Netherlands, komercnosaukums Agrita&Vin Content Co. Visas tiesības aizsargātas.`,
  whatsappFab: 'Labdien! Vēlos uzzināt vairāk par jūsu satura paketēm, kā arī par kāzu un pasākumu filmēšanu.',
}

export const LANDING_COPY: Record<LandingLocale, LandingCopy> = { en: EN, ru: RU, lv: LV }

// ---------------------------------------------------------------------------
// Translations for the public lead-qualification quiz. Scoring is entirely
// language-independent (QUIZ_QUESTIONS in quiz.ts keeps the canonical
// question/option ids and point values); this file only supplies the display
// text per locale, so answers submitted in any language score identically.
// ---------------------------------------------------------------------------

import { QUIZ_QUESTIONS, type QuizQuestion } from '@/lib/quiz'
import type { Vertical } from '@/types'

export type QuizLocale = 'en' | 'ru' | 'lv'

export function resolveQuizLocale(lang: string | undefined): QuizLocale {
  return lang === 'ru' || lang === 'lv' ? lang : 'en'
}

interface QuestionCopy {
  question: string
  helper?: string
  options: Record<string, string>
}

const QUESTION_COPY: Record<QuizLocale, Record<string, QuestionCopy>> = {
  en: {}, // English copy lives directly on QUIZ_QUESTIONS in quiz.ts
  ru: {
    'content-happiness': {
      question: 'Насколько вы довольны своими текущими фото и видео?',
      options: {
        none: 'У нас их практически нет',
        unhappy: 'Недовольны — устарели или низкое качество',
        okay: 'Нормально, но можно лучше',
        happy: 'Полностью довольны тем, что есть',
      },
    },
    'posting-frequency': {
      question: 'Как часто вы сейчас публикуете новый контент?',
      options: {
        rarely: 'Редко или никогда',
        monthly: 'Несколько раз в месяц',
        weekly: 'Раз в неделю',
        daily: 'Ежедневно или почти каждый день',
      },
    },
    'dedicated-photographer': {
      question: 'Вы регулярно работаете с фотографом или видеооператором?',
      options: {
        never: 'Нет, никогда',
        occasionally: 'Иногда, для разовых съёмок',
        ongoing: 'Да, на постоянной основе',
      },
    },
    'content-driving-bookings': {
      question: 'Приносит ли ваш текущий контент реальные бронирования или новых клиентов?',
      options: {
        no: 'Нет, заметного эффекта нет',
        unsure: 'Не уверены / не отслеживаем',
        somewhat: 'В какой-то мере',
        yes: 'Да, явно приносит',
      },
    },
    'biggest-challenge': {
      question: 'Какая ваша главная проблема с контентом сейчас?',
      options: {
        'no-time': 'Нет времени на его создание',
        'no-idea': 'Не знаем, что публиковать',
        'no-budget': 'Нет бюджета на профессионала',
        quality: 'Качество нестабильное',
      },
    },
    'social-presence': {
      question: 'У вас есть активный бизнес-аккаунт в Instagram или TikTok?',
      options: {
        'no-account': 'Нет, у нас его нет',
        inactive: 'Есть, но публикуем редко',
        active: 'Да, и публикуем регулярно',
      },
    },
    'upcoming-activity': {
      question: 'Планируются ли у вас акции, запуски или мероприятия?',
      options: {
        'yes-soon': 'Да, в ближайшие недели',
        planning: 'Планируем что-то',
        no: 'Пока ничего не запланировано',
      },
    },
    'team-size': {
      question: 'Примерно сколько человек работает в вашей компании?',
      options: { micro: '1–9', small: '10–49', medium: '50–249', large: '250+' },
    },
    'decision-role': {
      question: 'Именно вы принимаете решения по маркетингу/контенту в компании?',
      options: {
        yes: 'Да, это я',
        influence: 'Я влияю на решение',
        no: 'Нет, решает кто-то другой',
      },
    },
    'free-pilot-interest': {
      question:
        'Если бы вы могли получить профессиональную съёмку бесплатно, в качестве пробы — насколько вам было бы интересно?',
      helper: 'Это наше реальное предложение — бесплатная пробная съёмка, без оплаты и без обязательств.',
      options: {
        very: 'Очень интересно — давайте обсудим',
        somewhat: 'Умеренно интересно',
        'not-now': 'Не сейчас',
      },
    },
  },
  lv: {
    'content-happiness': {
      question: 'Cik apmierināti esat ar saviem pašreizējiem foto un video?',
      options: {
        none: 'Mums to praktiski nav',
        unhappy: 'Neapmierināti — novecojuši vai zemas kvalitātes',
        okay: 'Ir labi, bet varētu būt labāk',
        happy: 'Pilnībā apmierināti ar to, kas ir',
      },
    },
    'posting-frequency': {
      question: 'Cik bieži jūs pašlaik publicējat jaunu saturu?',
      options: {
        rarely: 'Reti vai nekad',
        monthly: 'Dažas reizes mēnesī',
        weekly: 'Reizi nedēļā',
        daily: 'Katru dienu vai gandrīz katru dienu',
      },
    },
    'dedicated-photographer': {
      question: 'Vai regulāri strādājat ar fotogrāfu vai video operatoru?',
      options: {
        never: 'Nē, nekad',
        occasionally: 'Reizēm, atsevišķām fotosesijām',
        ongoing: 'Jā, pastāvīgi sadarbojamies',
      },
    },
    'content-driving-bookings': {
      question: 'Vai jūsu pašreizējais saturs patiešām atnes rezervācijas vai jaunus klientus?',
      options: {
        no: 'Nē, mēs to nepamanām',
        unsure: 'Neesam pārliecināti / neizsekojam',
        somewhat: 'Zināmā mērā',
        yes: 'Jā, nepārprotami',
      },
    },
    'biggest-challenge': {
      question: 'Kāda ir jūsu lielākā problēma ar saturu šobrīd?',
      options: {
        'no-time': 'Nav laika to veidot',
        'no-idea': 'Nezinām, ko publicēt',
        'no-budget': 'Nav budžeta profesionālim',
        quality: 'Kvalitāte ir nevienmērīga',
      },
    },
    'social-presence': {
      question: 'Vai jums ir aktīvs Instagram vai TikTok biznesa konts?',
      options: {
        'no-account': 'Nē, mums tāda nav',
        inactive: 'Ir, bet reti publicējam',
        active: 'Jā, un publicējam regulāri',
      },
    },
    'upcoming-activity': {
      question: 'Vai tuvākajā laikā plānojat akcijas, jaunumus vai pasākumus?',
      options: {
        'yes-soon': 'Jā, tuvāko nedēļu laikā',
        planning: 'Plānojam kaut ko',
        no: 'Pašlaik nekas nav plānots',
      },
    },
    'team-size': {
      question: 'Aptuveni cik cilvēku strādā jūsu uzņēmumā?',
      options: { micro: '1–9', small: '10–49', medium: '50–249', large: '250+' },
    },
    'decision-role': {
      question: 'Vai tieši jūs pieņemat lēmumus par mārketingu/saturu uzņēmumā?',
      options: {
        yes: 'Jā, tas esmu es',
        influence: 'Es ietekmēju šo lēmumu',
        no: 'Nē, lemj kāds cits',
      },
    },
    'free-pilot-interest': {
      question:
        'Ja jūs varētu saņemt profesionālu satura uzņemšanu bez maksas, izmēģinājuma veidā — cik tas jūs interesētu?',
      helper: 'Šis ir mūsu reālais piedāvājums — bezmaksas izmēģinājuma fotosesija, bez maksas un bez saistībām.',
      options: {
        very: 'Ļoti interesē — parunāsim',
        somewhat: 'Zināmā mērā interesē',
        'not-now': 'Pašlaik ne',
      },
    },
  },
}

export function getLocalizedQuestions(locale: QuizLocale): QuizQuestion[] {
  if (locale === 'en') return QUIZ_QUESTIONS
  const copy = QUESTION_COPY[locale]
  return QUIZ_QUESTIONS.map((q) => {
    const c = copy[q.id]
    if (!c) return q
    return {
      ...q,
      question: c.question,
      helper: c.helper,
      options: q.options.map((o) => ({ ...o, label: c.options[o.id] ?? o.label })),
    }
  })
}

const VERTICAL_LABELS: Record<QuizLocale, Record<Vertical, string>> = {
  en: {
    'Hotels & Hospitality': 'Hotels & Hospitality',
    'Travel & Tour Operators': 'Travel & Tour Operators',
    'Cosmetics & Beauty': 'Cosmetics & Beauty',
    'Footwear & Fashion': 'Footwear & Fashion',
    'Pharmacy & Health Retail': 'Pharmacy & Health Retail',
    'Events & Corporate': 'Events & Corporate',
    'Restaurants & Lifestyle': 'Restaurants & Lifestyle',
  },
  ru: {
    'Hotels & Hospitality': 'Отели и гостиничный бизнес',
    'Travel & Tour Operators': 'Туристические агентства',
    'Cosmetics & Beauty': 'Косметика и салоны красоты',
    'Footwear & Fashion': 'Обувь и мода',
    'Pharmacy & Health Retail': 'Аптеки и товары для здоровья',
    'Events & Corporate': 'Мероприятия и корпоративные услуги',
    'Restaurants & Lifestyle': 'Рестораны и лайфстайл',
  },
  lv: {
    'Hotels & Hospitality': 'Viesnīcas un viesmīlība',
    'Travel & Tour Operators': 'Ceļojumu aģentūras',
    'Cosmetics & Beauty': 'Kosmētika un skaistumkopšana',
    'Footwear & Fashion': 'Apavi un modes preces',
    'Pharmacy & Health Retail': 'Aptiekas un veselības preces',
    'Events & Corporate': 'Pasākumi un korporatīvie pakalpojumi',
    'Restaurants & Lifestyle': 'Restorāni un dzīvesstils',
  },
}

export function getVerticalLabel(vertical: Vertical, locale: QuizLocale): string {
  return VERTICAL_LABELS[locale][vertical]
}

interface QuizUiCopy {
  backHome: string
  questionProgress: (current: number, total: number) => string
  contactTitle: string
  contactSubtitle: string
  businessNameLabel: string
  industryLabel: string
  industryPlaceholder: string
  yourNameLabel: string
  emailLabel: string
  phoneLabel: string
  instagramLabel: string
  submitButton: string
  resultScoreLabel: string
  resultScoreCaption: string
  qualifiedTitle: string
  qualifiedBody: (company: string) => string
  qualifiedCta: string
  notQualifiedTitle: string
  notQualifiedBody: (company: string) => string
}

export const QUIZ_UI: Record<QuizLocale, QuizUiCopy> = {
  en: {
    backHome: '← Back to homepage',
    questionProgress: (current, total) => `Question ${current} of ${total}`,
    contactTitle: 'Almost done — where should we send your result?',
    contactSubtitle: "Tell us a bit about your business so we can see if a Free Content Pilot is a fit.",
    businessNameLabel: 'Business name *',
    industryLabel: 'Industry *',
    industryPlaceholder: 'Select your industry',
    yourNameLabel: 'Your name',
    emailLabel: 'Email',
    phoneLabel: 'Phone / WhatsApp',
    instagramLabel: 'Instagram',
    submitButton: 'See my result',
    resultScoreLabel: 'Your content fit score',
    resultScoreCaption: 'out of 100 — based on your answers',
    qualifiedTitle: 'You qualify for a Free Content Pilot',
    qualifiedBody: (company) =>
      `Based on what you told us, ${company} looks like a great fit for a free, no-obligation content shoot — real photos and video of your own business, on us. Our team will reach out within 1 business day to schedule it.`,
    qualifiedCta: 'Continue →',
    notQualifiedTitle: 'Thanks for taking the quiz!',
    notQualifiedBody: (company) =>
      `We've saved your answers — our team reviews every submission personally and will reach out if a Free Content Pilot makes sense for ${company}.`,
  },
  ru: {
    backHome: '← Вернуться на главную',
    questionProgress: (current, total) => `Вопрос ${current} из ${total}`,
    contactTitle: 'Почти готово — куда отправить результат?',
    contactSubtitle: 'Расскажите немного о вашем бизнесе, чтобы мы поняли, подходит ли вам бесплатная пробная съёмка.',
    businessNameLabel: 'Название компании *',
    industryLabel: 'Сфера деятельности *',
    industryPlaceholder: 'Выберите сферу деятельности',
    yourNameLabel: 'Ваше имя',
    emailLabel: 'Email',
    phoneLabel: 'Телефон / WhatsApp',
    instagramLabel: 'Instagram',
    submitButton: 'Показать результат',
    resultScoreLabel: 'Ваш показатель соответствия',
    resultScoreCaption: 'из 100 — на основе ваших ответов',
    qualifiedTitle: 'Вы подходите для бесплатной пробной съёмки',
    qualifiedBody: (company) =>
      `Судя по вашим ответам, ${company} отлично подходит для бесплатной пробной фото/видео съёмки — без каких-либо обязательств. Наша команда свяжется с вами в течение 1 рабочего дня, чтобы договориться о съёмке.`,
    qualifiedCta: 'Продолжить →',
    notQualifiedTitle: 'Спасибо, что прошли опрос!',
    notQualifiedBody: (company) =>
      `Мы сохранили ваши ответы — наша команда лично рассматривает каждую заявку и свяжется с вами, если бесплатная пробная съёмка подойдёт для ${company}.`,
  },
  lv: {
    backHome: '← Atpakaļ uz sākumlapu',
    questionProgress: (current, total) => `Jautājums ${current} no ${total}`,
    contactTitle: 'Gandrīz gatavs — kurp sūtīt rezultātu?',
    contactSubtitle: 'Pastāstiet mazliet par savu uzņēmumu, lai mēs saprastu, vai bezmaksas satura izmēģinājums der tieši jums.',
    businessNameLabel: 'Uzņēmuma nosaukums *',
    industryLabel: 'Nozare *',
    industryPlaceholder: 'Izvēlieties savu nozari',
    yourNameLabel: 'Jūsu vārds',
    emailLabel: 'E-pasts',
    phoneLabel: 'Tālrunis / WhatsApp',
    instagramLabel: 'Instagram',
    submitButton: 'Parādīt manu rezultātu',
    resultScoreLabel: 'Jūsu satura atbilstības rādītājs',
    resultScoreCaption: 'no 100 — balstoties uz jūsu atbildēm',
    qualifiedTitle: 'Jūs kvalificējaties bezmaksas satura izmēģinājumam',
    qualifiedBody: (company) =>
      `Pamatojoties uz jūsu atbildēm, ${company} izskatās kā lielisks kandidāts bezmaksas, bez saistībām izmēģinājuma fotosesijai — reāliem sava uzņēmuma foto un video. Mūsu komanda sazināsies ar jums 1 darba dienas laikā, lai vienotos par laiku.`,
    qualifiedCta: 'Turpināt →',
    notQualifiedTitle: 'Paldies, ka piedalījāties aptaujā!',
    notQualifiedBody: (company) =>
      `Mēs saglabājām jūsu atbildes — mūsu komanda personīgi izskata katru pieteikumu un sazināsies, ja bezmaksas satura izmēģinājums der uzņēmumam ${company}.`,
  },
}

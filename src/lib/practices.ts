export type Practice = {
  id: string
  title: string
  type: "free" | "subscription"
  audioKey: AudioKey
  placeholder?: boolean
}

type AudioKey =
  | "balance"
  | "energy"
  | "relaxation"
  | "subscriptionPractice1"
  | "subscriptionPractice2"
  | "subscriptionPractice3"
  | "subscriptionPractice4"
  | "subscriptionPractice5"
  | "subscriptionPractice6"
  | "subscriptionPractice7"
  | "subscriptionPractice8"
  | "subscriptionPractice9"
  | "subscriptionPractice10"

export const welcomeText = `Приветственный текст

Здесь будет короткое и теплое описание библиотеки breathwork-практик: что можно выбрать, как слушать и как возвращаться к практикам.

Готовы перейти к практикам?`

export const subscribeText = `Подписка на практики стоит 1000 рублей (10 евро) в месяц.

Оплатить можно по следующим реквизитам:
...

После оплаты нажмите кнопку "оплатил/оплатила"`

export const practices: Practice[] = [
  {
    id: "balance",
    title: "Баланс (бесплатно)",
    type: "free",
    audioKey: "balance",
  },
  {
    id: "energy",
    title: "Энергия (бесплатно)",
    type: "free",
    audioKey: "energy",
  },
  {
    id: "relaxation",
    title: "Расслабление (бесплатно)",
    type: "free",
    audioKey: "relaxation",
  },
  {
    id: "subscriptionPractice1",
    title: "Безопасное пространство (13 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice1",
    placeholder: true,
  },
  {
    id: "subscriptionPractice2",
    title: "Ресурс (16 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice2",
    placeholder: true,
  },
  {
    id: "subscriptionPractice3",
    title: "Креативность (12 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice3",
    placeholder: true,
  },
  {
    id: "subscriptionPractice4",
    title: "Любовь к себе (15 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice4",
    placeholder: true,
  },
  {
    id: "subscriptionPractice5",
    title: "Переход (20 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice5",
    placeholder: true,
  },
  {
    id: "subscriptionPractice6",
    title: "Ресурс/Мягкая Сила (19 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice6",
    placeholder: true,
  },
  {
    id: "subscriptionPractice7",
    title: "Фокус Дня (12 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice7",
    placeholder: true,
  },
  {
    id: "subscriptionPractice8",
    title: "Внутренняя Сила и Ресурс (30 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice8",
    placeholder: true,
  },
  {
    id: "subscriptionPractice9",
    title: "Освобождение от Сомнений (21 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice9",
    placeholder: true,
  },
  {
    id: "subscriptionPractice10",
    title: "Выдыхай (17 мин)",
    type: "subscription",
    audioKey: "subscriptionPractice10",
    placeholder: true,
  },
]

export function findPractice(id: string) {
  return practices.find((practice) => practice.id === id)
}

export function addOneMonth(date = new Date()) {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1)
  return result
}

export function formatRuDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Lisbon",
  }).format(date)
}

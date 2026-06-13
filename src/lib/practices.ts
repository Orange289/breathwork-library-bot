export type Practice = {
  id: string;
  title: string;
  type: "free" | "subscription";
  audioKey: AudioKey;
  placeholder?: boolean;
};

type AudioKey =
  | "balance"
  | "energy"
  | "relaxation"
  | "subscriptionPractice1"
  | "subscriptionPractice2"
  | "subscriptionPractice3";

export const welcomeText = `Приветственный текст

Здесь будет короткое и теплое описание библиотеки breathwork-практик: что можно выбрать, как слушать и как возвращаться к практикам.

Готовы перейти к практикам?`;

export const subscribeText = `Подписка на практики стоит 1000 рублей (10 евро) в месяц.

Оплатить можно по следующим реквизитам:
...

После оплаты нажмите кнопку "оплатил/оплатила"`;

export const practices: Practice[] = [
  {
    id: "balance",
    title: "Баланс",
    type: "free",
    audioKey: "balance"
  },
  {
    id: "energy",
    title: "Энергия",
    type: "free",
    audioKey: "energy"
  },
  {
    id: "relaxation",
    title: "Расслабление",
    type: "free",
    audioKey: "relaxation"
  },
  {
    id: "subscriptionPractice1",
    title: "Практика по подписке 1",
    type: "subscription",
    audioKey: "subscriptionPractice1",
    placeholder: true
  },
  {
    id: "subscriptionPractice2",
    title: "Практика по подписке 2",
    type: "subscription",
    audioKey: "subscriptionPractice2",
    placeholder: true
  },
  {
    id: "subscriptionPractice3",
    title: "Практика по подписке 3",
    type: "subscription",
    audioKey: "subscriptionPractice3",
    placeholder: true
  }
];

export function findPractice(id: string) {
  return practices.find((practice) => practice.id === id);
}

export function addOneMonth(date = new Date()) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
}

export function formatRuDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Lisbon"
  }).format(date);
}

import { practices } from "./practices";

type InlineButton = {
  text: string;
  callback_data: string;
};

export function welcomeKeyboard() {
  return {
    inline_keyboard: [[button("Перейти к практикам", "menu")]]
  };
}

export function practicesKeyboard() {
  return {
    inline_keyboard: [
      ...practices.map((practice) => [
        button(
          practice.type === "subscription"
            ? `${practice.title} (по подписке)`
            : practice.title,
          `practice:${practice.id}`
        )
      ]),
      [button("Главное меню", "start")]
    ]
  };
}

export function subscriptionKeyboard() {
  return {
    inline_keyboard: [
      [button("Оплатил/оплатила", "paid")],
      [button("Назад к практикам", "menu")]
    ]
  };
}

export function backToMenuKeyboard() {
  return {
    inline_keyboard: [[button("Назад к практикам", "menu")]]
  };
}

function button(text: string, callbackData: string): InlineButton {
  return {
    text,
    callback_data: callbackData
  };
}

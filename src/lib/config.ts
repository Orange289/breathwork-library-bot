import path from "node:path";

export const botToken = process.env.TELEGRAM_BOT_TOKEN;
export const adminSecret = process.env.ADMIN_SECRET;

export const excelLogPath = path.resolve(
  /* turbopackIgnore: true */ process.cwd(),
  process.env.EXCEL_LOG_PATH ?? "./data/breathwork-actions.xlsx"
);

export const subscriptionsPath = path.resolve(
  /* turbopackIgnore: true */ process.cwd(),
  process.env.SUBSCRIPTIONS_PATH ?? "./data/subscriptions.json"
);

export const audioPaths = {
  balance: process.env.AUDIO_BALANCE_PATH,
  energy: process.env.AUDIO_ENERGY_PATH,
  relaxation: process.env.AUDIO_RELAXATION_PATH,
  subscriptionPractice1: process.env.AUDIO_SUBSCRIPTION_PRACTICE_1_PATH,
  subscriptionPractice2: process.env.AUDIO_SUBSCRIPTION_PRACTICE_2_PATH,
  subscriptionPractice3: process.env.AUDIO_SUBSCRIPTION_PRACTICE_3_PATH
};

export function requireBotToken() {
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  return botToken;
}

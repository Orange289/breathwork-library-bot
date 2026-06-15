import path from "node:path"

export const botToken = process.env.TELEGRAM_BOT_TOKEN
export const adminSecret = process.env.ADMIN_SECRET
export const googleSheetsSpreadsheetId =
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID
export const googleSheetsSheetName =
  process.env.GOOGLE_SHEETS_SHEET_NAME ?? "actions"
export const googleServiceAccountEmail =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
export const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
)

const defaultDataDir = process.env.NETLIFY
  ? "/tmp"
  : path.join(/* turbopackIgnore: true */ process.cwd(), "data")

export const excelLogPath = resolveWritablePath(
  process.env.EXCEL_LOG_PATH,
  "breathwork-actions.xlsx",
)

export const subscriptionsPath = resolveWritablePath(
  process.env.SUBSCRIPTIONS_PATH,
  "subscriptions.json",
)

function resolveWritablePath(value: string | undefined, fallbackFileName: string) {
  if (!value) {
    return path.join(defaultDataDir, fallbackFileName)
  }

  if (process.env.NETLIFY && !path.isAbsolute(value)) {
    return path.join(defaultDataDir, path.basename(value))
  }

  return path.resolve(value)
}

export const audioPaths = {
  balance: process.env.AUDIO_BALANCE_PATH,
  energy: process.env.AUDIO_ENERGY_PATH,
  relaxation: process.env.AUDIO_RELAXATION_PATH,
  subscriptionPractice1: process.env.AUDIO_SAFE_SPACE_PATH,
  subscriptionPractice2: process.env.AUDIO_RESOURCE_PATH,
  subscriptionPractice3: process.env.AUDIO_CREATIVITY_PATH,
  subscriptionPractice4: process.env.AUDIO_SELF_LOVE_PATH,
  subscriptionPractice5: process.env.AUDIO_SELF_TRANSITION_PATH,
  subscriptionPractice6: process.env.AUDIO_SOFT_POWER_PATH,
  subscriptionPractice7: process.env.AUDIO_DAY_FOCUS_PATH,
  subscriptionPractice8: process.env.AUDIO_INTERNAL_POWER_PATH,
  subscriptionPractice9: process.env.AUDIO_NO_DOUBTS_PATH,
  subscriptionPractice10: process.env.AUDIO_BREATHOUT_PATH,
}

export const audioFileIds = {
  balance: process.env.AUDIO_BALANCE_FILE_ID,
  energy: process.env.AUDIO_ENERGY_FILE_ID,
  relaxation: process.env.AUDIO_RELAXATION_FILE_ID,
  subscriptionPractice1: process.env.AUDIO_SAFE_SPACE_FILE_ID,
  subscriptionPractice2: process.env.AUDIO_RESOURCE_FILE_ID,
  subscriptionPractice3: process.env.AUDIO_CREATIVITY_FILE_ID,
  subscriptionPractice4: process.env.AUDIO_SELF_LOVE_FILE_ID,
  subscriptionPractice5: process.env.AUDIO_SELF_TRANSITION_FILE_ID,
  subscriptionPractice6: process.env.AUDIO_SELF_SOFT_POWER_FILE_ID,
  subscriptionPractice7: process.env.AUDIO_DAY_FOCUS_FILE_ID,
  subscriptionPractice8: process.env.AUDIO_INTERNAL_POWER_FILE_ID,
  subscriptionPractice9: process.env.AUDIO_NO_DOUBTS_FILE_ID,
  subscriptionPractice10: process.env.AUDIO_BREATHOUT_FILE_ID,
}

export function requireBotToken() {
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured")
  }

  return botToken
}

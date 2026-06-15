import fs from "node:fs"
import path from "node:path"
import { loadDotEnv } from "./env.mjs"

loadDotEnv()

const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_AUDIO_UPLOAD_CHAT_ID

const audios = [
  {
    title: "Баланс (7 мин)",
    pathEnv: "AUDIO_BALANCE_PATH",
    fileIdEnv: "AUDIO_BALANCE_FILE_ID",
  },
  {
    title: "Энергия (15 мин)",
    pathEnv: "AUDIO_ENERGY_PATH",
    fileIdEnv: "AUDIO_ENERGY_FILE_ID",
  },
  {
    title: "Расслабление (15 мин)",
    pathEnv: "AUDIO_RELAXATION_PATH",
    fileIdEnv: "AUDIO_RELAXATION_FILE_ID",
  },
  {
    title: "Практика по подписке 1",
    pathEnv: "AUDIO_SUBSCRIPTION_PRACTICE_1_PATH",
    fileIdEnv: "AUDIO_SUBSCRIPTION_PRACTICE_1_FILE_ID",
  },
  {
    title: "Практика по подписке 2",
    pathEnv: "AUDIO_SUBSCRIPTION_PRACTICE_2_PATH",
    fileIdEnv: "AUDIO_SUBSCRIPTION_PRACTICE_2_FILE_ID",
  },
  {
    title: "Практика по подписке 3",
    pathEnv: "AUDIO_SUBSCRIPTION_PRACTICE_3_PATH",
    fileIdEnv: "AUDIO_SUBSCRIPTION_PRACTICE_3_FILE_ID",
  },
]

async function main() {
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is required")
  }

  if (!chatId) {
    throw new Error(
      "TELEGRAM_AUDIO_UPLOAD_CHAT_ID is required. Send /start to the bot, then set your Telegram numeric user id here.",
    )
  }

  const uploaded = []

  for (const audio of audios) {
    const audioPath = process.env[audio.pathEnv]

    if (!audioPath) {
      continue
    }

    if (!fs.existsSync(audioPath)) {
      console.warn(`Skipped ${audio.title}: file does not exist: ${audioPath}`)
      continue
    }

    console.log(`Uploading ${audio.title}: ${audioPath}`)
    const fileId = await uploadAudio(audioPath, audio.title)
    uploaded.push({ env: audio.fileIdEnv, fileId })
  }

  if (uploaded.length === 0) {
    console.log(
      "No audio files were uploaded. Check AUDIO_*_PATH values in .env.",
    )
    return
  }

  console.log("\nAdd these values to .env and Netlify environment variables:\n")

  for (const item of uploaded) {
    console.log(`${item.env}=${item.fileId}`)
  }
}

async function uploadAudio(audioPath, title) {
  const formData = new FormData()
  const bytes = fs.readFileSync(audioPath)
  const file = new Blob([new Uint8Array(bytes)], { type: "audio/mpeg" })

  formData.append("chat_id", chatId)
  formData.append("audio", file, path.basename(audioPath))
  formData.append("title", title)
  formData.append("caption", title)
  formData.append("protect_content", "true")

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendAudio`,
    {
      method: "POST",
      body: formData,
    },
  )

  const result = await response.json()

  if (!result.ok) {
    throw new Error(
      `Telegram upload failed for ${title}: ${JSON.stringify(result)}`,
    )
  }

  const fileId = result.result?.audio?.file_id

  if (!fileId) {
    throw new Error(`Telegram did not return audio.file_id for ${title}`)
  }

  return fileId
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

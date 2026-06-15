import fs from "node:fs"
import path from "node:path"
import { loadDotEnv } from "./env.mjs"

loadDotEnv()

const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_AUDIO_UPLOAD_CHAT_ID

const audios = [
  // {
  //   title: "Баланс (7 мин)",
  //   pathEnv: "AUDIO_BALANCE_PATH",
  //   fileIdEnv: "AUDIO_BALANCE_FILE_ID",
  // },
  // {
  //   title: "Энергия (15 мин)",
  //   pathEnv: "AUDIO_ENERGY_PATH",
  //   fileIdEnv: "AUDIO_ENERGY_FILE_ID",
  // },
  // {
  //   title: "Расслабление (15 мин)",
  //   pathEnv: "AUDIO_RELAXATION_PATH",
  //   fileIdEnv: "AUDIO_RELAXATION_FILE_ID",
  // },
  {
    title: "Безопасное пространство (13 мин)",
    pathEnv: "AUDIO_SAFE_SPACE_PATH",
    fileIdEnv: "AUDIO_SAFE_SPACE_FILE_ID",
  },
  {
    title: "Ресурс (16 мин)",
    pathEnv: "AUDIO_RESOURCE_PATH",
    fileIdEnv: "AUDIO_RESOURCE_FILE_ID",
  },
  {
    title: "Креативность (12 мин)",
    pathEnv: "AUDIO_CREATIVITY_PATH",
    fileIdEnv: "AUDIO_CREATIVITY_FILE_ID",
  },
  {
    title: "Любовь к себе (15 мин)",
    pathEnv: "AUDIO_SELF_LOVE_PATH",
    fileIdEnv: "AUDIO_SELF_LOVE_FILE_ID",
  },
  {
    title: "Переход (20 мин)",
    pathEnv: "AUDIO_TRANSITION_PATH",
    fileIdEnv: "AUDIO_TRANSITION_FILE_ID",
  },
  {
    title: "Ресурс/Мягкая Сила (19 мин)",
    pathEnv: "AUDIO_SOFT_POWER_PATH",
    fileIdEnv: "AUDIO_SOFT_POWER_FILE_ID",
  },
  {
    title: "Фокус Дня (12 мин)",
    pathEnv: "AUDIO_DAY_FOCUS_PATH",
    fileIdEnv: "AUDIO_DAY_FOCUS_FILE_ID",
  },
  {
    title: "Внутренняя Сила и Ресурс (30 мин)",
    pathEnv: "AUDIO_INTERNAL_POWER_PATH",
    fileIdEnv: "AUDIO_INTERNAL_POWER_FILE_ID",
  },
  {
    title: "Освобождение от Сомнений (21 мин)",
    pathEnv: "AUDIO_NO_DOUBTS_PATH",
    fileIdEnv: "AUDIO_NO_DOUBTS_FILE_ID",
  },
  {
    title: "Выдыхай (17 мин)",
    pathEnv: "AUDIO_BREATHOUT_PATH",
    fileIdEnv: "AUDIO_BREATHOUT_FILE_ID",
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

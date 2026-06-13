import fs from "node:fs";
import path from "node:path";
import { requireBotToken } from "./config";

type ReplyMarkup = {
  inline_keyboard: Array<Array<{ text: string; callback_data: string }>>;
};

const apiBase = () => `https://api.telegram.org/bot${requireBotToken()}`;

export async function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: ReplyMarkup
) {
  return telegramRequest("sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
    protect_content: true
  });
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  return telegramRequest("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text
  });
}

export async function sendAudio(
  chatId: number,
  audio: string,
  caption?: string,
  replyMarkup?: ReplyMarkup
) {
  if (!isLocalFilePath(audio)) {
    return telegramRequest("sendAudio", {
      chat_id: chatId,
      audio,
      caption,
      reply_markup: replyMarkup,
      protect_content: true
    });
  }

  if (!fs.existsSync(audio)) {
    await sendMessage(
      chatId,
      `Аудиофайл пока не найден: ${audio}`,
      replyMarkup
    );
    return;
  }

  const formData = new FormData();
  const bytes = fs.readFileSync(audio);
  const file = new Blob([new Uint8Array(bytes)], { type: "audio/mpeg" });

  formData.append("chat_id", String(chatId));
  formData.append("audio", file, path.basename(audio));
  formData.append("protect_content", "true");

  if (caption) {
    formData.append("caption", caption);
  }

  if (replyMarkup) {
    formData.append("reply_markup", JSON.stringify(replyMarkup));
  }

  const response = await fetch(`${apiBase()}/sendAudio`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Telegram sendAudio failed: ${await response.text()}`);
  }
}

function isLocalFilePath(audio: string) {
  return audio.startsWith("/") || audio.startsWith("./") || audio.startsWith("../");
}

async function telegramRequest(method: string, payload: Record<string, unknown>) {
  const response = await fetch(`${apiBase()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Telegram ${method} failed: ${await response.text()}`);
  }

  return response.json();
}
